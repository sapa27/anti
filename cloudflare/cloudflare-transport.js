(function (root) {
  "use strict";
  if (!root || root.__APP_CLOUDFLARE_TRANSPORT__) return;
  root.__APP_CLOUDFLARE_TRANSPORT__ = true;
  root.__APP_HOST_MODE__ = "cloudflare-pages";

  var config = root.APP_CLOUDFLARE_CONFIG || Object.freeze({
    API_ENDPOINT: "/api/gas",
    REQUEST_TIMEOUT_MS: 90000,
    LOCAL_ASSET_MODE: true,
    LOCAL_ASSET_BASE: "./assets/",
    LOCAL_ASSET_VERSION: "r257",
    LOCAL_ASSET_TIMEOUT_MS: 8000
  });
  root.APP_CLOUDFLARE_CONFIG = config;
  var TRANSPORT_VERSION = "cloudflare-pages-same-origin-v1";
  var localAssetCache = Object.create(null);
  var localAssetInflight = Object.create(null);
  var metrics = { calls: 0, proxyCalls: 0, localAssetHits: 0, localAssetNetworkLoads: 0, localAssetFallbacks: 0, timeouts: 0, errors: 0 };

  var DIRECT_FUNCTIONS = Object.freeze({
    apiRouter: true, apiLogin: true, apiSessionResume: true, apiSessionCheck: true,
    apiLogout: true, getDeferredInclude: true
  });
  var LOCAL_BUNDLES = Object.freeze({
    appCore: ["Scripts_Core_Runtime", "Runtime_01_Request_Lifecycle"],
    runtimeDateTable: ["Runtime_02_Date_Time", "Runtime_03_Table_UI"],
    runtimeThailandLocation: ["Runtime_04_Thailand_Location"],
    runtimeStatusAging: ["Runtime_05_Status_Aging"],
    runtimeAiBridge: ["Runtime_08_AI_Bridge"],
    runtimeQaRegression: ["Runtime_09_QA_Regression"],
    pageDashboard: ["Scripts_Page_Dashboard"],
    pageMeeting: ["Scripts_Page_Meeting::meeting-common", "Scripts_Page_Meeting::meeting"],
    pageCommitteeMeeting: ["Scripts_Page_Meeting::meeting-common", "Scripts_Page_Meeting::committee"],
    pageTrackReport: ["Scripts_Page_ReportTrack::report", "Scripts_Page_ReportTrack::reporttrack-common"],
    pagePetitioner: ["Scripts_Page_Petitioner"],
    pagePeople: ["Scripts_Page_People"],
    pageBudget: ["Scripts_Page_Budget"],
    pageAdmin: ["Scripts_Page_Admin"],
    pageAiPrint: ["Scripts_Page_ReportTrack::print"]
  });

  function text(v) { return v == null ? "" : String(v); }
  function createError(raw, fallbackCode) {
    var info = raw && typeof raw === "object" ? raw : { message: text(raw) };
    var err = new Error(text(info.message || "Cloudflare GAS proxy request failed"));
    err.code = text(info.code || fallbackCode || "CLOUDFLARE_GAS_PROXY_FAILED");
    if (info.meta) err.meta = info.meta;
    return err;
  }
  function apiEndpoint() {
    var endpoint = text(config.API_ENDPOINT || "/api/gas").trim();
    if (!endpoint || endpoint.charAt(0) !== "/") endpoint = "/api/gas";
    return endpoint;
  }
  function normalizeInvocation(fn, args) {
    fn = text(fn).trim(); args = args == null ? {} : args;
    return DIRECT_FUNCTIONS[fn] ? { fn: fn, args: args } : { fn: "apiRouter", args: { method: fn, payload: args } };
  }
  function proxyRun(fn, args, options) {
    options = options || {};
    var invocation = normalizeInvocation(fn, args);
    var timeoutMs = Math.max(5000, Number(options.timeoutMs || config.REQUEST_TIMEOUT_MS || 90000));
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? root.setTimeout(function () { metrics.timeouts += 1; try { controller.abort(); } catch (_e) {} }, timeoutMs) : null;
    metrics.proxyCalls += 1;
    return fetch(apiEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json", "X-App-Transport": TRANSPORT_VERSION },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ fn: invocation.fn, args: invocation.args }),
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      return response.text().then(function (body) {
        var payload = null;
        try { payload = body ? JSON.parse(body) : null; }
        catch (_parse) { throw createError({ message: "Cloudflare proxy ตอบกลับไม่ใช่ JSON (HTTP " + response.status + ")", code: "CLOUDFLARE_PROXY_INVALID_JSON" }); }
        if (!response.ok || !payload || payload.ok !== true) {
          var info = payload && payload.error ? payload.error : { message: "Cloudflare proxy HTTP " + response.status, code: "CLOUDFLARE_PROXY_HTTP_FAILED" };
          if (payload && payload.meta) info.meta = payload.meta;
          throw createError(info);
        }
        return payload.result;
      });
    }).catch(function (error) {
      metrics.errors += 1;
      if (error && error.name === "AbortError") throw createError({ message: "Cloudflare GAS proxy timeout: " + text(fn), code: "CLOUDFLARE_PROXY_TIMEOUT" });
      throw error;
    }).finally(function () { if (timer) root.clearTimeout(timer); });
  }

  function assetParts(name) {
    name = text(name).trim();
    var match = name.match(/^([^:]+)::([a-z0-9_-]+)$/i);
    return match ? { name: name, base: match[1], fragment: match[2].toLowerCase() } : { name: name, base: name, fragment: "" };
  }
  function extractAssetFragment(html, fragment) {
    html = text(html); fragment = text(fragment).trim().toLowerCase();
    if (!fragment) return html;
    var blocks = [];
    var tagPattern = /<(script|style)\b([^>]*)>[\s\S]*?<\/\1\s*>/gi;
    html.replace(tagPattern, function (block, _tag, attrs) {
      var m = text(attrs).match(/\bdata-app-fragment\s*=\s*(["'])(.*?)\1/i);
      var tokens = m ? text(m[2]).toLowerCase().split(/\s+/).filter(Boolean) : [];
      if (tokens.indexOf(fragment) >= 0) blocks.push(block);
      return block;
    });
    if (!blocks.length) throw createError({ message: "ไม่พบ local asset fragment: " + fragment, code: "LOCAL_ASSET_FRAGMENT_NOT_FOUND" });
    return blocks.join("\n");
  }
  function localAssetBaseUrl() {
    var base = text(config.LOCAL_ASSET_BASE || "./assets/").trim() || "./assets/";
    if (base.charAt(base.length - 1) !== "/") base += "/";
    return base;
  }
  function fetchLocalAssetFile(baseName) {
    baseName = text(baseName).trim();
    if (!/^[A-Za-z0-9_]+$/.test(baseName)) return Promise.reject(createError({ message: "ชื่อ local asset ไม่ถูกต้อง: " + baseName, code: "LOCAL_ASSET_NAME_INVALID" }));
    if (Object.prototype.hasOwnProperty.call(localAssetCache, baseName)) { metrics.localAssetHits += 1; return Promise.resolve(localAssetCache[baseName]); }
    if (localAssetInflight[baseName]) return localAssetInflight[baseName];
    var version = encodeURIComponent(text(config.LOCAL_ASSET_VERSION || TRANSPORT_VERSION));
    var url = localAssetBaseUrl() + baseName + ".html?v=" + version;
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timeoutId = controller ? root.setTimeout(function () { try { controller.abort(); } catch (_ignored) {} }, Math.max(3000, Number(config.LOCAL_ASSET_TIMEOUT_MS || 8000))) : null;
    metrics.localAssetNetworkLoads += 1;
    localAssetInflight[baseName] = fetch(url, { method: "GET", cache: "force-cache", credentials: "same-origin", signal: controller ? controller.signal : undefined })
      .then(function (response) { if (!response.ok) throw createError({ message: "โหลด local asset ไม่สำเร็จ: " + baseName + " (HTTP " + response.status + ")", code: "LOCAL_ASSET_HTTP_FAILED" }); return response.text(); })
      .then(function (html) { localAssetCache[baseName] = text(html); delete localAssetInflight[baseName]; if (timeoutId) root.clearTimeout(timeoutId); return localAssetCache[baseName]; },
        function (error) { delete localAssetInflight[baseName]; if (timeoutId) root.clearTimeout(timeoutId); throw error; });
    return localAssetInflight[baseName];
  }
  function localAssetHtml(name) {
    name = text(name).trim();
    if (/^bundle:/i.test(name)) {
      var bundleName = name.replace(/^bundle:/i, ""), files = LOCAL_BUNDLES[bundleName];
      if (!files || !files.length) return Promise.reject(createError({ message: "ไม่พบ local bundle: " + bundleName, code: "LOCAL_BUNDLE_NOT_FOUND" }));
      return Promise.all(files.map(function (file) { return localAssetHtml(file); })).then(function (parts) { return parts.join("\n"); });
    }
    var parts = assetParts(name);
    return fetchLocalAssetFile(parts.base).then(function (html) { return extractAssetFragment(html, parts.fragment); });
  }
  function deferredRequestFromCall(fn, args) {
    fn = text(fn);
    if (fn === "getDeferredInclude") return { name: text(args && (args.name || args.partial || args.file) || args) };
    if (fn === "apiRouter" && args && text(args.method) === "getDeferredInclude") {
      var payload = args.payload || args.data || {};
      return { name: text(payload && (payload.name || payload.partial || payload.file) || payload) };
    }
    return null;
  }
  function tryLocalDeferred(fn, args) {
    if (config.LOCAL_ASSET_MODE === false) return null;
    var req = deferredRequestFromCall(fn, args);
    if (!req || !req.name) return null;
    return localAssetHtml(req.name).then(function (html) {
      metrics.localAssetHits += 1;
      return { ok: true, data: { name: req.name, html: html, loadedAt: (new Date()).toISOString(), fragment: assetParts(req.name).fragment || "", bundled: /^bundle:/i.test(req.name), source: "cloudflare-pages-local-assets", transportVersion: TRANSPORT_VERSION }, msg: "โหลด static asset จาก Cloudflare Pages สำเร็จ" };
    }).catch(function (error) {
      metrics.localAssetFallbacks += 1;
      if (root.console && console.warn) console.warn("[r257] local asset fallback to GAS proxy", req.name, error && error.message || error);
      return null;
    });
  }
  function run(fn, args, options) {
    metrics.calls += 1;
    var localAttempt = tryLocalDeferred(fn, args);
    if (localAttempt) return Promise.resolve(localAttempt).then(function (local) { return local || proxyRun(fn, args, options); });
    return proxyRun(fn, args, options);
  }

  root.AppTransport = root.AppTransport || {};
  root.AppTransport.run = run;
  root.AppTransport.mode = "cloudflare-pages-same-origin-proxy";
  root.AppTransport.clearLocalAssetCache = function () { localAssetCache = Object.create(null); localAssetInflight = Object.create(null); return true; };
  root.AppTransport.status = function () { return { ok: true, mode: root.AppTransport.mode, routingMode: "apiRouter-single-entry", endpoint: apiEndpoint(), sameOrigin: true, localAssetMode: config.LOCAL_ASSET_MODE !== false, localAssetBase: localAssetBaseUrl(), localAssetCacheEntries: Object.keys(localAssetCache).length, transportVersion: TRANSPORT_VERSION, metrics: Object.assign({}, metrics) }; };
})(window);
