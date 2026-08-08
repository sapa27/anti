(function (root, doc) {
  "use strict";
  if (!root || !doc || root.__APP_GITHUB_RPC_TRANSPORT__) return;
  root.__APP_GITHUB_RPC_TRANSPORT__ = true;
  root.__APP_GITHUB_BRIDGE_TRANSPORT__ = true; /* compatibility guard */
  root.__APP_HOST_MODE__ = "github-pages";

  var config = root.APP_GITHUB_CONFIG || {};
  var RPC_VERSION = String(config.RPC_VERSION || "r246-github-form-post-jsonp-rpc");
  var pending = Object.create(null);
  var sequence = 0;
  var healthPromise = null;
  var health = { ok: false, checked: false, serverVersion: "", allowedOrigin: false, error: "" };
  var metrics = { calls: 0, posts: 0, polls: 0, pendingPolls: 0, completed: 0, failed: 0, healthChecks: 0, postSignals: 0 };

  function text(value) { return value == null ? "" : String(value); }
  function normalizeGasUrl(value) {
    value = text(value).trim();
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:[?#].*)?$/i.test(value)) return "";
    return value.replace(/[?#].*$/, "");
  }
  function gasUrl() {
    var value = normalizeGasUrl(config.GAS_WEB_APP_URL);
    if (!value) throw createError({ code: "GITHUB_GAS_URL_NOT_CONFIGURED", message: "กรุณากำหนด GAS_WEB_APP_URL ใน github-config.js" });
    return value;
  }
  function createError(raw, fallbackCode) {
    var info = raw && typeof raw === "object" ? raw : { message: text(raw) };
    var error = new Error(text(info.message || "GAS RPC request failed"));
    error.code = text(info.code || fallbackCode || "GAS_RPC_FAILED");
    if (info.detail) error.detail = info.detail;
    return error;
  }
  function randomCapability(prefix) {
    var bytes = new Uint8Array(24);
    try { root.crypto.getRandomValues(bytes); }
    catch (_e) { for (var i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256); }
    var hex = Array.prototype.map.call(bytes, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
    return text(prefix || "rpc") + "_" + hex;
  }
  function callbackName() {
    sequence += 1;
    return "__ghRpcCb_" + Date.now().toString(36) + "_" + sequence.toString(36) + "_" + Math.random().toString(36).slice(2, 10);
  }
  function buildUrl(mode, fields) {
    var query = ["mode=" + encodeURIComponent(mode)];
    Object.keys(fields || {}).forEach(function (key) { query.push(encodeURIComponent(key) + "=" + encodeURIComponent(text(fields[key]))); });
    query.push("_ts=" + Date.now().toString(36));
    return gasUrl() + "?" + query.join("&");
  }
  function jsonp(mode, fields, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var cb = callbackName(), done = false, script = doc.createElement("script"), timer;
      fields = Object.assign({}, fields || {}, { callback: cb });
      function cleanup() {
        if (timer) root.clearTimeout(timer);
        try { delete root[cb]; } catch (_deleteErr) { root[cb] = undefined; }
        if (script && script.parentNode) script.parentNode.removeChild(script);
      }
      function finish(ok, value) {
        if (done) return;
        done = true; cleanup();
        if (ok) resolve(value); else reject(value instanceof Error ? value : createError(value, "GAS_RPC_JSONP_FAILED"));
      }
      root[cb] = function (payload) { finish(true, payload || {}); };
      script.async = true;
      script.referrerPolicy = "no-referrer";
      script.onerror = function () { finish(false, { code: "GAS_RPC_JSONP_LOAD_FAILED", message: "ไม่สามารถโหลดผลตอบกลับจาก GAS ได้" }); };
      script.onload = function () {
        root.setTimeout(function () {
          if (!done) finish(false, { code: "GAS_RPC_JSONP_NO_CALLBACK", message: "GAS ตอบกลับแต่ไม่ใช่ RPC r246 — ตรวจว่า Deploy GAS เป็น New version แล้ว" });
        }, 0);
      };
      timer = root.setTimeout(function () { finish(false, { code: "GAS_RPC_JSONP_TIMEOUT", message: "GAS RPC JSONP timeout" }); }, Math.max(3000, Number(timeoutMs || 10000)));
      script.src = buildUrl(mode, fields);
      (doc.head || doc.documentElement).appendChild(script);
    });
  }

  function ensureHealth(force) {
    if (healthPromise && !force) return healthPromise;
    if (health.ok && health.allowedOrigin && health.serverVersion === RPC_VERSION && !force) return Promise.resolve(health);
    metrics.healthChecks += 1;
    healthPromise = jsonp("github-rpc-health", { parentOrigin: root.location.origin, rpcVersion: RPC_VERSION }, Number(config.HEALTH_TIMEOUT_MS || 10000)).then(function (data) {
      var serverVersion = text(data.transportVersion);
      health.checked = true; health.serverVersion = serverVersion; health.allowedOrigin = data.allowedOrigin === true; health.error = "";
      if (serverVersion !== RPC_VERSION) throw createError({ code: "GAS_RPC_VERSION_MISMATCH", message: "GAS transport version ไม่ตรง: " + (serverVersion || "unknown") + " (ต้องเป็น " + RPC_VERSION + ")" });
      if (!health.allowedOrigin) throw createError({ code: "GITHUB_PAGES_ORIGIN_NOT_ALLOWED", message: "GITHUB_PAGES_ORIGIN ไม่ตรงกับ " + root.location.origin });
      health.ok = true;
      return health;
    }).catch(function (error) {
      health.ok = false; health.checked = true; health.error = text(error && (error.message || error.code) || error);
      throw error;
    }).finally(function () { healthPromise = null; });
    return healthPromise;
  }

  function postFields(rec, fn, args) {
    var fields = {
      mode: "github-rpc",
      parentOrigin: root.location.origin,
      rpcVersion: RPC_VERSION,
      rpcId: rec.rpcId,
      rpcToken: rec.rpcToken,
      rpcFunction: text(fn),
      rpcPayload: JSON.stringify(args == null ? {} : args)
    };
    var params = new URLSearchParams();
    Object.keys(fields).forEach(function (key) { params.append(key, fields[key]); });
    metrics.posts += 1;
    rec.postMode = "fetch-no-cors";
    if (root.fetch) {
      return root.fetch(gasUrl(), {
        method: "POST",
        mode: "no-cors",
        credentials: "omit",
        cache: "no-store",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: params
      }).then(function () { metrics.postSignals += 1; rec.postSettled = true; return true; }, function (error) {
        rec.postError = text(error && error.message || error); return false;
      });
    }
    rec.postMode = "hidden-form";
    return new Promise(function (resolve) {
      var frame = doc.createElement("iframe"), form = doc.createElement("form"), frameName = "ghrpc_" + rec.rpcId.replace(/[^A-Za-z0-9_]/g, "_");
      frame.name = frameName; frame.style.display = "none"; frame.setAttribute("aria-hidden", "true");
      form.method = "POST"; form.action = gasUrl(); form.target = frameName; form.style.display = "none";
      Object.keys(fields).forEach(function (key) { var input = doc.createElement("textarea"); input.name = key; input.value = fields[key]; form.appendChild(input); });
      var submitted = false, done = false;
      function complete() { if (done || !submitted) return; done = true; metrics.postSignals += 1; rec.postSettled = true; root.setTimeout(function () { if (form.parentNode) form.parentNode.removeChild(form); if (frame.parentNode) frame.parentNode.removeChild(frame); }, 0); resolve(true); }
      frame.onload = complete;
      (doc.body || doc.documentElement).appendChild(frame); (doc.body || doc.documentElement).appendChild(form);
      submitted = true;
      try { form.submit(); } catch (error) { rec.postError = text(error && error.message || error); complete(); }
      root.setTimeout(complete, Math.max(3000, Number(config.POST_SIGNAL_GRACE_MS || 3500)));
    });
  }

  function pollDelay(attempt) {
    var min = Math.max(250, Number(config.RESULT_POLL_MIN_MS || 450)), max = Math.max(min, Number(config.RESULT_POLL_MAX_MS || 2200));
    return Math.min(max, min + Math.max(0, attempt - 1) * 220);
  }
  function pollResult(rec, attempt) {
    attempt = Number(attempt || 0) || 0;
    if (Date.now() >= rec.deadline) return Promise.reject(createError({ code: "GAS_RPC_REQUEST_TIMEOUT", message: "GAS request timeout: " + rec.fn }));
    metrics.polls += 1;
    return jsonp("github-rpc-result", {
      parentOrigin: root.location.origin,
      rpcVersion: RPC_VERSION,
      rpcId: rec.rpcId,
      rpcToken: rec.rpcToken
    }, Math.min(12000, Math.max(4000, rec.deadline - Date.now()))).then(function (data) {
      if (data && data.pending === true) {
        metrics.pendingPolls += 1;
        return new Promise(function (resolve) { root.setTimeout(resolve, pollDelay(attempt + 1)); }).then(function () { return pollResult(rec, attempt + 1); });
      }
      if (!data || data.transportOk === false || data.ok === false) throw createError(data && data.error || { code: "GAS_RPC_RESULT_FAILED", message: "GAS RPC result failed" });
      return data.result;
    });
  }
  function startRpc(fn, args, options) {
    options = options || {};
    metrics.calls += 1;
    var rpcId = randomCapability("req"), rpcToken = randomCapability("tok"), timeoutMs = Math.max(10000, Number(options.timeoutMs || config.RESULT_TIMEOUT_MS || 90000));
    var rec = { rpcId: rpcId, rpcToken: rpcToken, fn: text(fn), startedAt: Date.now(), deadline: Date.now() + timeoutMs, postSettled: false, postError: "", postMode: "" };
    pending[rpcId] = rec;
    var postSignal;
    try { postSignal = postFields(rec, fn, args); }
    catch (error) { delete pending[rpcId]; return Promise.reject(error); }
    var grace = new Promise(function (resolve) { root.setTimeout(resolve, Math.max(500, Number(config.POST_SIGNAL_GRACE_MS || 3500))); });
    return Promise.race([Promise.resolve(postSignal), grace]).then(function () { return pollResult(rec, 0); }).then(function (value) {
      metrics.completed += 1; delete pending[rpcId]; return value;
    }, function (error) {
      metrics.failed += 1; delete pending[rpcId]; throw error;
    });
  }
  function run(fn, args, options) { return ensureHealth(false).then(function () { return startRpc(fn, args, options); }); }

  root.AppTransport = root.AppTransport || {};
  root.AppTransport.run = run;
  root.AppTransport.mode = "github-pages-gas-rpc";
  root.AppTransport.probe = function () { return ensureHealth(true); };
  root.AppTransport.reset = function () {
    healthPromise = null; health = { ok: false, checked: false, serverVersion: "", allowedOrigin: false, error: "" };
    Object.keys(pending).forEach(function (id) { delete pending[id]; });
    return true;
  };
  root.AppTransport.resetBridge = root.AppTransport.reset; /* backward-compatible console command */
  root.AppTransport.status = function () {
    return {
      ok: health.ok === true && health.allowedOrigin === true && health.serverVersion === RPC_VERSION,
      mode: root.AppTransport.mode,
      configured: !!normalizeGasUrl(config.GAS_WEB_APP_URL),
      parentOrigin: root.location.origin,
      transportVersion: RPC_VERSION,
      serverVersion: health.serverVersion,
      healthChecked: health.checked,
      allowedOrigin: health.allowedOrigin,
      healthError: health.error,
      activeRequests: Object.keys(pending).length,
      bridgeRequired: false,
      bridgeState: "retired-r246",
      ingress: "POST(no-cors/form)",
      egress: "capability-JSONP",
      metrics: Object.assign({}, metrics)
    };
  };
  root.setTimeout(function () { ensureHealth(false).catch(function () {}); }, 0);
})(window, document);
