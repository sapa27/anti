(function (root, doc) {
  "use strict";
  if (!root || !doc || root.__APP_GITHUB_BRIDGE_TRANSPORT__) return;
  root.__APP_GITHUB_BRIDGE_TRANSPORT__ = true;
  root.__APP_HOST_MODE__ = "github-pages";

  var config = root.APP_GITHUB_CONFIG || {};
  var pending = Object.create(null);
  var postPending = Object.create(null);
  var sequence = 0;
  var postSequence = 0;
  var iframe = null;
  var readyPromise = null;
  var nonce = "";
  var bridgePort = null;
  var bridgeChannel = "";
  var bridgeOrigin = "";
  var bridgeLoadState = "idle";
  var bridgeLastError = "";
  var EXPECTED_BRIDGE_VERSION = "github-pages-bridge-v1";
  var FRONTEND_TRANSPORT_VERSION = "github-postmessage-v1-nav-lifecycle";
  var localAssetCache = Object.create(null);
  var localAssetInflight = Object.create(null);
  var transportMetrics = {
    calls: 0,
    directBridgeCalls: 0,
    routerBridgeCalls: 0,
    localAssetHits: 0,
    localAssetNetworkLoads: 0,
    localAssetFallbacks: 0,
    errors: 0,
    postCalls: 0,
    postResults: 0,
    postTimeouts: 0,
    bridgeFallbackCalls: 0,
    opaquePostResults: 0,
    authBridgeFirstCalls: 0,
    authBridgeReadyFailures: 0,
    authPostFallbackCalls: 0
  };

  var DIRECT_BRIDGE_FUNCTIONS = Object.freeze({
    apiRouter: true,
    apiLogin: true,
    apiSessionResume: true,
    apiSessionCheck: true,
    apiLogout: true,
    getDeferredInclude: true
  });
  var AUTH_BRIDGE_FUNCTIONS = Object.freeze({
    apiLogin: true,
    apiSessionResume: true,
    apiSessionCheck: true,
    apiLogout: true
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

  function text(value) { return value == null ? "" : String(value); }
  function normalizeGasUrl(value) {
    value = text(value).trim();
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:[?#].*)?$/i.test(value)) return "";
    return value.replace(/[?#].*$/, "");
  }
  function trustedBridgeOrigin(origin) {
    origin = text(origin).toLowerCase();
    return origin === "https://script.google.com" ||
      /^https:\/\/(?:[a-z0-9-]+\.)*script\.googleusercontent\.com$/.test(origin);
  }
  function randomNonce() {
    var bytes = new Uint8Array(24);
    try { root.crypto.getRandomValues(bytes); }
    catch (_e) { for (var i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256); }
    return Array.prototype.map.call(bytes, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
  }
  function createError(raw, fallbackCode) {
    var info = raw && typeof raw === "object" ? raw : { message: text(raw) };
    var error = new Error(text(info.message || "GAS bridge request failed"));
    error.code = text(info.code || fallbackCode || "GAS_BRIDGE_FAILED");
    return error;
  }
  function bridgeUrl() {
    var gas = normalizeGasUrl(config.GAS_WEB_APP_URL);
    if (!gas) throw createError({
      message: "กรุณากำหนด GAS_WEB_APP_URL ใน github-config.js",
      code: "GITHUB_GAS_URL_NOT_CONFIGURED"
    });
    var origin = root.location.origin;
    return gas + "?mode=" + encodeURIComponent(text(config.BRIDGE_MODE || "github-bridge")) +
      "&parentOrigin=" + encodeURIComponent(origin) + "&nonce=" + encodeURIComponent(nonce) +
      "&bridgeVersion=" + encodeURIComponent(EXPECTED_BRIDGE_VERSION);
  }
  function cleanupPending(id, error) {
    var rec = pending[id];
    if (!rec) return;
    delete pending[id];
    if (rec.timer) root.clearTimeout(rec.timer);
    if (error) rec.reject(error);
  }
  function closeBridgePort() {
    if (!bridgePort) return;
    try { bridgePort.onmessage = null; } catch (_ignored1) {}
    try { bridgePort.close(); } catch (_ignored2) {}
    bridgePort = null;
    bridgeChannel = "";
  }
  function handleResult(data) {
    data = data || {};
    if (data.type !== "GAS_BRIDGE_RESULT" || data.nonce !== nonce) return;
    var id = text(data.id);
    var rec = pending[id];
    if (!rec) return;
    delete pending[id];
    if (rec.timer) root.clearTimeout(rec.timer);
    if (data.ok) rec.resolve(data.result);
    else {
      transportMetrics.errors += 1;
      rec.reject(createError(data.error, "GAS_BRIDGE_REQUEST_FAILED"));
    }
  }
  function attachPort(port) {
    closeBridgePort();
    bridgePort = port || null;
    if (!bridgePort) return false;
    bridgePort.onmessage = function (event) { handleResult(event && event.data || {}); };
    if (bridgePort.start) bridgePort.start();
    return true;
  }
  function ensureBridge() {
    if (readyPromise) return readyPromise;
    nonce = randomNonce();
    bridgeLoadState = "creating";
    bridgeLastError = "";
    bridgeOrigin = "";
    closeBridgePort();
    readyPromise = new Promise(function (resolve, reject) {
      var timeout = root.setTimeout(function () {
        var state = bridgeLoadState;
        readyPromise = null;
        var hint = state === "loaded-no-ready"
          ? "Bridge iframe โหลดแล้วแต่ช่องสื่อสารจาก GAS sandbox ไม่เชื่อมต่อ: ตรวจว่า GAS deploy จาก canonical r255 และ GITHUB_PAGES_ORIGIN ตรงกับ location.origin"
          : "Bridge iframe เปิดไม่สำเร็จ: ตรวจสิทธิ Web App (Anyone), URL /exec และ Deployment ล่าสุด";
        reject(createError({ message: "GAS Bridge ไม่ตอบสนอง — " + hint, code: "GAS_BRIDGE_READY_TIMEOUT" }));
      }, Math.max(5000, Number(config.BRIDGE_TIMEOUT_MS || 10000)));
      function cleanupReadyListener() { root.removeEventListener("message", onReady, false); }
      function fail(data) {
        root.clearTimeout(timeout);
        cleanupReadyListener();
        readyPromise = null;
        var requested = text(data && data.requestedOrigin || "");
        var configured = data && Array.isArray(data.configuredOrigins) ? data.configuredOrigins.join(", ") : "";
        bridgeLastError = text(data && (data.message || data.code) || "GAS_BRIDGE_ERROR");
        if (requested || configured) bridgeLastError += " — requested: " + (requested || root.location.origin) + "; configured: " + (configured || "(ไม่มีค่า)");
        transportMetrics.errors += 1;
        reject(createError({ message: bridgeLastError, code: text(data && data.code || "GAS_BRIDGE_ERROR") }));
      }
      function onReady(event) {
        var data = event.data || {};
        if (data.nonce !== nonce) return;
        if (!trustedBridgeOrigin(event.origin)) return;
        if (data.type === "GAS_BRIDGE_ERROR") return fail(data);
        if (data.type !== "GAS_BRIDGE_READY") return;
        if (data.bridgeVersion !== EXPECTED_BRIDGE_VERSION) {
          return fail({ code: "GAS_BRIDGE_VERSION_MISMATCH", message: "GAS Bridge version ไม่ตรง: " + text(data.bridgeVersion || "unknown") + " (ต้องเป็น " + EXPECTED_BRIDGE_VERSION + ")" });
        }
        var transferredPort = event.ports && event.ports[0] || null;
        if (data.channel === "message-port" && !transferredPort) {
          bridgeLastError = "GAS_BRIDGE_PORT_MISSING_WAITING_FALLBACK";
          return;
        }
        if (transferredPort) attachPort(transferredPort);
        bridgeChannel = text(data.channel || (transferredPort ? "message-port" : "window-postmessage"));
        bridgeOrigin = text(event.origin);
        root.clearTimeout(timeout);
        cleanupReadyListener();
        bridgeLoadState = "ready";
        resolve(true);
      }
      root.addEventListener("message", onReady, false);
      iframe = doc.createElement("iframe");
      iframe.id = "app-gas-github-bridge";
      iframe.title = "GAS API Bridge";
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("referrerpolicy", "no-referrer");
      iframe.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;border:0;opacity:0;pointer-events:none";
      iframe.onload = function () { if (bridgeLoadState !== "ready") bridgeLoadState = "loaded-no-ready"; };
      iframe.onerror = function () { bridgeLoadState = "load-error"; };
      try { iframe.src = bridgeUrl(); }
      catch (error) {
        root.clearTimeout(timeout);
        cleanupReadyListener();
        readyPromise = null;
        reject(error);
        return;
      }
      bridgeLoadState = "loading";
      (doc.body || doc.documentElement).appendChild(iframe);
    });
    return readyPromise;
  }

  root.addEventListener("message", function (event) {
    var data = event.data || {};
    if (data.nonce !== nonce || !trustedBridgeOrigin(event.origin)) return;
    handleResult(data);
  }, false);

  function sendCall(message) {
    if (bridgePort) {
      bridgePort.postMessage(message);
      return;
    }
    if (!iframe || !iframe.contentWindow) throw createError({ message: "GAS Bridge window unavailable", code: "GAS_BRIDGE_WINDOW_UNAVAILABLE" });
    iframe.contentWindow.postMessage(message, "*");
  }

  function bridgeRun(fn, args, options) {
    options = options || {};
    return ensureBridge().then(function () {
      return new Promise(function (resolve, reject) {
        var id = "gh-" + Date.now().toString(36) + "-" + (++sequence).toString(36);
        var timeoutMs = Math.max(10000, Number(options.timeoutMs || config.REQUEST_TIMEOUT_MS || 90000));
        var timer = root.setTimeout(function () {
          cleanupPending(id, createError({ message: "GAS request timeout: " + fn, code: "GAS_BRIDGE_REQUEST_TIMEOUT" }));
        }, timeoutMs);
        pending[id] = { resolve: resolve, reject: reject, timer: timer, fn: fn };
        try {
          sendCall({ type: "GAS_BRIDGE_CALL", nonce: nonce, id: id, fn: text(fn), args: args == null ? {} : args });
        } catch (error) {
          cleanupPending(id, error);
        }
      });
    });
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
    if (Object.prototype.hasOwnProperty.call(localAssetCache, baseName)) {
      transportMetrics.localAssetHits += 1;
      return Promise.resolve(localAssetCache[baseName]);
    }
    if (localAssetInflight[baseName]) return localAssetInflight[baseName];
    var version = encodeURIComponent(text(config.LOCAL_ASSET_VERSION || FRONTEND_TRANSPORT_VERSION));
    var url = localAssetBaseUrl() + baseName + ".html?v=" + version;
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timeoutId = controller ? root.setTimeout(function () { try { controller.abort(); } catch (_ignored) {} }, Math.max(3000, Number(config.LOCAL_ASSET_TIMEOUT_MS || 8000))) : null;
    transportMetrics.localAssetNetworkLoads += 1;
    localAssetInflight[baseName] = fetch(url, {
      method: "GET",
      cache: "force-cache",
      credentials: "same-origin",
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (!response.ok) throw createError({ message: "โหลด local asset ไม่สำเร็จ: " + baseName + " (HTTP " + response.status + ")", code: "LOCAL_ASSET_HTTP_FAILED" });
      return response.text();
    }).then(function (html) {
      localAssetCache[baseName] = text(html);
      delete localAssetInflight[baseName];
      if (timeoutId) root.clearTimeout(timeoutId);
      return localAssetCache[baseName];
    }, function (error) {
      delete localAssetInflight[baseName];
      if (timeoutId) root.clearTimeout(timeoutId);
      throw error;
    });
    return localAssetInflight[baseName];
  }
  function localAssetHtml(name) {
    name = text(name).trim();
    if (/^bundle:/i.test(name)) {
      var bundleName = name.replace(/^bundle:/i, "");
      var files = LOCAL_BUNDLES[bundleName];
      if (!files || !files.length) return Promise.reject(createError({ message: "ไม่พบ local bundle: " + bundleName, code: "LOCAL_BUNDLE_NOT_FOUND" }));
      return Promise.all(files.map(function (file) { return localAssetHtml(file); })).then(function (parts) { return parts.join("\n"); });
    }
    var parts = assetParts(name);
    return fetchLocalAssetFile(parts.base).then(function (html) { return extractAssetFragment(html, parts.fragment); });
  }
  function localDeferredResponse(name) {
    return localAssetHtml(name).then(function (html) {
      return {
        ok: true,
        data: {
          name: text(name),
          html: html,
          loadedAt: (new Date()).toISOString(),
          fragment: assetParts(name).fragment || "",
          bundled: /^bundle:/i.test(text(name)),
          source: "github-pages-local-assets",
          transportVersion: FRONTEND_TRANSPORT_VERSION
        },
        msg: "โหลด static asset จาก GitHub Pages สำเร็จ"
      };
    });
  }
  function deferredRequestFromCall(fn, args) {
    fn = text(fn);
    if (fn === "getDeferredInclude") return { direct: true, name: text(args && (args.name || args.partial || args.file) || args) };
    if (fn === "apiRouter" && args && text(args.method) === "getDeferredInclude") {
      var payload = args.payload || args.data || {};
      return { direct: false, name: text(payload && (payload.name || payload.partial || payload.file) || payload) };
    }
    return null;
  }
  function tryLocalDeferred(fn, args) {
    if (config.LOCAL_ASSET_MODE === false) return null;
    var req = deferredRequestFromCall(fn, args);
    if (!req || !req.name) return null;
    return localDeferredResponse(req.name).then(function (response) {
      transportMetrics.localAssetHits += 1;
      return response;
    }).catch(function (error) {
      transportMetrics.localAssetFallbacks += 1;
      if (root.console && console.warn) console.warn("[r255] local asset fallback to GAS", req.name, error && error.message || error);
      return null;
    });
  }

  function appendHiddenField(form, name, value) {
    var input = doc.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = text(value);
    form.appendChild(input);
    return input;
  }
  function cleanupPostRequest(id, error) {
    var rec = postPending[id];
    if (!rec) return;
    delete postPending[id];
    if (rec.timer) root.clearTimeout(rec.timer);
    try { if (rec.form && rec.form.parentNode) rec.form.parentNode.removeChild(rec.form); } catch (_formCleanup) {}
    try { if (rec.iframe && rec.iframe.parentNode) rec.iframe.parentNode.removeChild(rec.iframe); } catch (_frameCleanup) {}
    if (error) rec.reject(error);
  }
  function handlePostResult(event) {
    var data = event && event.data || {};
    if (data.type !== "GAS_POST_RESULT") return;
    var id = text(data.id);
    var rec = postPending[id];
    if (!rec || data.nonce !== rec.nonce) return;
    var trusted = trustedBridgeOrigin(event.origin);
    var opaqueAppsScriptSandbox = event.origin === "null" && data.transportVersion === "github-postmessage-v1";
    if (!trusted && !opaqueAppsScriptSandbox) return;
    if (opaqueAppsScriptSandbox) transportMetrics.opaquePostResults += 1;
    delete postPending[id];
    if (rec.timer) root.clearTimeout(rec.timer);
    try { if (rec.form && rec.form.parentNode) rec.form.parentNode.removeChild(rec.form); } catch (_formCleanup) {}
    try { if (rec.iframe && rec.iframe.parentNode) rec.iframe.parentNode.removeChild(rec.iframe); } catch (_frameCleanup) {}
    transportMetrics.postResults += 1;
    if (data.ok) rec.resolve(data.result);
    else {
      transportMetrics.errors += 1;
      rec.reject(createError(data.error, "GAS_POST_REQUEST_FAILED"));
    }
  }
  root.addEventListener("message", handlePostResult, false);
  function postRun(fn, args, options) {
    options = options || {};
    var gas = normalizeGasUrl(config.GAS_WEB_APP_URL);
    if (!gas) return Promise.reject(createError({ message: "กรุณากำหนด GAS_WEB_APP_URL ใน github-config.js", code: "GITHUB_GAS_URL_NOT_CONFIGURED" }));
    var requestNonce = randomNonce();
    var id = "ghp-" + Date.now().toString(36) + "-" + (++postSequence).toString(36);
    var timeoutMs = Math.max(10000, Number(options.timeoutMs || config.REQUEST_TIMEOUT_MS || 90000));
    var argsJson = "{}";
    try { argsJson = JSON.stringify(args == null ? {} : args); }
    catch (jsonError) { return Promise.reject(createError({ message: "ไม่สามารถแปลง API payload เป็น JSON ได้", code: "GITHUB_POST_PAYLOAD_SERIALIZE_FAILED" })); }
    transportMetrics.postCalls += 1;
    return new Promise(function (resolve, reject) {
      var frameName = "app_gas_post_" + id.replace(/[^A-Za-z0-9_]/g, "_");
      var iframe = doc.createElement("iframe");
      iframe.name = frameName;
      iframe.title = "GAS API POST " + id;
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("referrerpolicy", "no-referrer");
      iframe.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;border:0;opacity:0;pointer-events:none";
      var form = doc.createElement("form");
      form.method = "POST";
      form.action = gas;
      form.target = frameName;
      form.acceptCharset = "UTF-8";
      form.style.display = "none";
      appendHiddenField(form, "mode", "github-api-post");
      appendHiddenField(form, "parentOrigin", root.location.origin);
      appendHiddenField(form, "nonce", requestNonce);
      appendHiddenField(form, "id", id);
      appendHiddenField(form, "fn", text(fn));
      appendHiddenField(form, "args", argsJson);
      var timer = root.setTimeout(function () {
        transportMetrics.postTimeouts += 1;
        cleanupPostRequest(id, createError({ message: "GAS POST request timeout: " + fn, code: "GAS_POST_REQUEST_TIMEOUT" }));
      }, timeoutMs);
      postPending[id] = { resolve: resolve, reject: reject, timer: timer, iframe: iframe, form: form, nonce: requestNonce, fn: text(fn) };
      try {
        (doc.body || doc.documentElement).appendChild(iframe);
        (doc.body || doc.documentElement).appendChild(form);
        form.submit();
      } catch (error) {
        cleanupPostRequest(id, error);
      }
    });
  }

  function normalizeBridgeInvocation(fn, args) {
    fn = text(fn).trim();
    args = args == null ? {} : args;
    if (DIRECT_BRIDGE_FUNCTIONS[fn]) {
      transportMetrics.directBridgeCalls += 1;
      return { fn: fn, args: args, routed: false };
    }
    /* Core Runtime calls AppTransport.run(apiMethod, payload) directly.
       GitHub Bridge deliberately exposes only apiRouter as the canonical API entry.
       Route every non-bootstrap method through apiRouter to preserve the 108-route
       contract and avoid GAS_BRIDGE_FN_DENIED / silent degraded empty data. */
    transportMetrics.routerBridgeCalls += 1;
    return { fn: "apiRouter", args: { method: fn, payload: args }, routed: true, originalFn: fn };
  }

  function authBridgeCanFallback(error) {
    var code = text(error && error.code || "");
    return code === "GAS_BRIDGE_READY_TIMEOUT" ||
      code === "GAS_BRIDGE_ERROR" ||
      code === "GAS_BRIDGE_VERSION_MISMATCH" ||
      code === "GAS_BRIDGE_WINDOW_UNAVAILABLE";
  }
  function optionsWithTimeout(options, timeoutMs) {
    var out = {};
    Object.keys(options || {}).forEach(function (key) { out[key] = options[key]; });
    out.timeoutMs = Math.max(10000, Number(timeoutMs || out.timeoutMs || config.REQUEST_TIMEOUT_MS || 90000));
    return out;
  }
  function authBridgeFirstRun(invocation, options) {
    transportMetrics.authBridgeFirstCalls += 1;
    return bridgeRun(invocation.fn, invocation.args, options).catch(function (bridgeError) {
      if (!authBridgeCanFallback(bridgeError)) throw bridgeError;
      transportMetrics.authBridgeReadyFailures += 1;
      transportMetrics.authPostFallbackCalls += 1;
      if (root.console && console.warn) console.warn("[r255] auth bridge unavailable; fallback to POST before API call", bridgeError && bridgeError.code || "", bridgeError && bridgeError.message || bridgeError);
      var fallbackTimeout = Number(config.AUTH_POST_FALLBACK_TIMEOUT_MS || 15000);
      return postRun(invocation.fn, invocation.args, optionsWithTimeout(options, fallbackTimeout)).catch(function (postError) {
        var message = "ไม่สามารถเชื่อมต่อ GAS สำหรับเข้าสู่ระบบได้" +
          " — Bridge: " + text(bridgeError && bridgeError.message || bridgeError) +
          " — POST: " + text(postError && postError.message || postError) +
          " — ตรวจ Deploy GAS Web App ให้เป็นเวอร์ชันล่าสุด, Execute as Me และอนุญาต Anyone/anonymous";
        var combined = createError({ message: message, code: "GAS_AUTH_TRANSPORT_UNAVAILABLE" });
        combined.bridgeError = bridgeError;
        combined.postError = postError;
        throw combined;
      });
    });
  }
  function run(fn, args, options) {
    transportMetrics.calls += 1;
    var localAttempt = tryLocalDeferred(fn, args);
    if (localAttempt) {
      return Promise.resolve(localAttempt).then(function (localResponse) {
        if (localResponse) return localResponse;
        var invocationAfterFallback = normalizeBridgeInvocation(fn, args);
        return postRun(invocationAfterFallback.fn, invocationAfterFallback.args, options);
      });
    }
    var invocation = normalizeBridgeInvocation(fn, args);
    var authMode = text(config.AUTH_TRANSPORT_MODE || "bridge-first").toLowerCase();
    if (AUTH_BRIDGE_FUNCTIONS[invocation.fn] && authMode === "bridge-first") {
      return authBridgeFirstRun(invocation, options);
    }
    if (text(config.API_TRANSPORT_MODE || "post-message").toLowerCase() === "bridge") {
      transportMetrics.bridgeFallbackCalls += 1;
      return bridgeRun(invocation.fn, invocation.args, options);
    }
    return postRun(invocation.fn, invocation.args, options);
  }

  root.AppTransport = root.AppTransport || {};
  root.AppTransport.run = run;
  root.AppTransport.mode = "github-pages-gas-router-hybrid";
  root.AppTransport.warmAuthBridge = function () {
    return ensureBridge().then(function () { return true; }, function () { return false; });
  };
  root.AppTransport.resetBridge = function () {
    Object.keys(pending).forEach(function (id) { cleanupPending(id, createError({ message: "Bridge reset", code: "GAS_BRIDGE_RESET" })); });
    Object.keys(postPending).forEach(function (id) { cleanupPostRequest(id, createError({ message: "POST transport reset", code: "GAS_POST_RESET" })); });
    closeBridgePort();
    if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
    iframe = null;
    readyPromise = null;
    bridgeLoadState = "idle";
    bridgeLastError = "";
    bridgeOrigin = "";
    return true;
  };
  root.AppTransport.clearLocalAssetCache = function () {
    localAssetCache = Object.create(null);
    localAssetInflight = Object.create(null);
    return true;
  };
  root.setTimeout(function () {
    if (text(config.AUTH_TRANSPORT_MODE || "bridge-first").toLowerCase() === "bridge-first") {
      root.AppTransport.warmAuthBridge();
    }
  }, 0);
  root.AppTransport.status = function () {
    return {
      ok: !!normalizeGasUrl(config.GAS_WEB_APP_URL),
      mode: root.AppTransport.mode,
      routingMode: "apiRouter-single-entry",
      apiTransportMode: text(config.API_TRANSPORT_MODE || "post-message"),
      authTransportMode: text(config.AUTH_TRANSPORT_MODE || "bridge-first"),
      configured: !!normalizeGasUrl(config.GAS_WEB_APP_URL),
      parentOrigin: root.location.origin,
      pending: Object.keys(pending).length + Object.keys(postPending).length,
      postPending: Object.keys(postPending).length,
      bridgeLoadState: bridgeLoadState,
      bridgeLastError: bridgeLastError,
      bridgeChannel: bridgeChannel,
      bridgeOrigin: bridgeOrigin,
      expectedBridgeVersion: EXPECTED_BRIDGE_VERSION,
      frontendTransportVersion: FRONTEND_TRANSPORT_VERSION,
      localAssetMode: config.LOCAL_ASSET_MODE !== false,
      localAssetBase: localAssetBaseUrl(),
      localAssetCacheEntries: Object.keys(localAssetCache).length,
      metrics: Object.assign({}, transportMetrics)
    };
  };
})(window, document);
