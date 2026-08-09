const ALLOWED_FUNCTIONS = new Set([
  "apiRouter", "apiLogin", "apiSessionResume", "apiSessionCheck", "apiLogout", "getDeferredInclude"
]);

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer"
    }
  });
}
function normalizeGasUrl(value) {
  const text = String(value || "").trim();
  return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(text) ? text : "";
}
function requestIsSameOrigin(request) {
  const expected = new URL(request.url).origin;
  const origin = request.headers.get("Origin");
  if (origin && origin !== expected) return false;
  const fetchSite = String(request.headers.get("Sec-Fetch-Site") || "").toLowerCase();
  return !fetchSite || fetchSite === "same-origin" || fetchSite === "none";
}
export async function onRequestGet({ env }) {
  return json({ ok: true, service: "cloudflare-gas-proxy", release: "r257", gasConfigured: !!normalizeGasUrl(env.GAS_WEB_APP_URL), secretConfigured: String(env.GAS_PROXY_SECRET || "").length >= 32 });
}
export async function onRequestPost({ request, env }) {
  if (!requestIsSameOrigin(request)) return json({ ok: false, error: { code: "CLOUDFLARE_PROXY_ORIGIN_DENIED", message: "Cross-site API request denied" } }, 403);
  const gasUrl = normalizeGasUrl(env.GAS_WEB_APP_URL);
  const proxySecret = String(env.GAS_PROXY_SECRET || "");
  if (!gasUrl) return json({ ok: false, error: { code: "CLOUDFLARE_GAS_URL_NOT_CONFIGURED", message: "Cloudflare variable GAS_WEB_APP_URL ยังไม่ได้ตั้งค่า" } }, 503);
  if (proxySecret.length < 32) return json({ ok: false, error: { code: "CLOUDFLARE_PROXY_SECRET_NOT_CONFIGURED", message: "Cloudflare secret GAS_PROXY_SECRET ยังไม่ได้ตั้งค่า" } }, 503);

  let body;
  try { body = await request.json(); }
  catch (_e) { return json({ ok: false, error: { code: "CLOUDFLARE_PROXY_PAYLOAD_INVALID", message: "Request body ต้องเป็น JSON" } }, 400); }
  const fn = String(body && body.fn || "").trim();
  if (!ALLOWED_FUNCTIONS.has(fn)) return json({ ok: false, error: { code: "CLOUDFLARE_PROXY_FN_DENIED", message: "Function not allowed: " + fn } }, 403);
  let argsJson = "{}";
  try { argsJson = JSON.stringify(body && body.args != null ? body.args : {}); }
  catch (_e) { return json({ ok: false, error: { code: "CLOUDFLARE_PROXY_ARGS_INVALID", message: "API args ไม่สามารถแปลงเป็น JSON ได้" } }, 400); }

  const requestId = "cf-" + crypto.randomUUID();
  const params = new URLSearchParams();
  params.set("mode", "cloudflare-api-post");
  params.set("id", requestId);
  params.set("fn", fn);
  params.set("args", argsJson);
  params.set("proxySecret", proxySecret);

  let upstream;
  try {
    upstream = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "Accept": "application/json", "User-Agent": "Cloudflare-Pages-GAS-Proxy/r257" },
      body: params.toString(),
      redirect: "follow"
    });
  } catch (_e) {
    return json({ ok: false, error: { code: "CLOUDFLARE_GAS_FETCH_FAILED", message: "Cloudflare ติดต่อ GAS ไม่สำเร็จ" }, meta: { requestId } }, 502);
  }
  const text = await upstream.text();
  let payload;
  try { payload = JSON.parse(text); }
  catch (_e) {
    return json({ ok: false, error: { code: "CLOUDFLARE_GAS_INVALID_JSON", message: "GAS ตอบกลับไม่ใช่ JSON", upstreamStatus: upstream.status }, meta: { requestId } }, 502);
  }
  const status = payload && payload.ok === true ? 200 : (upstream.ok ? 400 : 502);
  return json(payload, status);
}
