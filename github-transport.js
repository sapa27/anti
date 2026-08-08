(function (root, doc) {
  "use strict";
  if (!root || !doc || root.__APP_GITHUB_BRIDGE_TRANSPORT__) return;
  root.__APP_GITHUB_BRIDGE_TRANSPORT__ = true;
  root.__APP_HOST_MODE__ = "github-pages";

  var config = root.APP_GITHUB_CONFIG || {};
  var pending = Object.create(null);
  var sequence = 0;
  var iframe = null;
  var readyPromise = null;
  var nonce = "";
  var bridgePort = null;
  var bridgeChannel = "";
  var bridgeOrigin = "";
  var bridgeLoadState = "idle";
  var bridgeLastError = "";
  var EXPECTED_BRIDGE_VERSION = "r243-github-pages-message-channel";

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
    else rec.reject(createError(data.error, "GAS_BRIDGE_REQUEST_FAILED"));
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
          ? "Bridge iframe โหลดแล้วแต่ช่องสื่อสารจาก GAS sandbox ไม่เชื่อมต่อ: ตรวจว่า GAS เป็น r243 และ GITHUB_PAGES_ORIGIN ตรงกับ location.origin"
          : "Bridge iframe เปิดไม่สำเร็จ: ตรวจสิทธิ Web App (Anyone), URL /exec และ Deployment ล่าสุด";
        reject(createError({ message: "GAS Bridge ไม่ตอบสนอง — " + hint, code: "GAS_BRIDGE_READY_TIMEOUT" }));
      }, Math.max(5000, Number(config.BRIDGE_TIMEOUT_MS || 20000)));
      function cleanupReadyListener() { root.removeEventListener("message", onReady, false); }
      function fail(data) {
        root.clearTimeout(timeout);
        cleanupReadyListener();
        readyPromise = null;
        bridgeLastError = text(data && (data.message || data.code) || "GAS_BRIDGE_ERROR");
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
          return fail({ code: "GAS_BRIDGE_PORT_MISSING", message: "GAS Bridge READY แล้วแต่ไม่ได้รับ MessagePort" });
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

  function run(fn, args, options) {
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

  root.AppTransport = root.AppTransport || {};
  root.AppTransport.run = run;
  root.AppTransport.mode = "github-pages-gas-bridge";
  root.AppTransport.resetBridge = function () {
    Object.keys(pending).forEach(function (id) { cleanupPending(id, createError({ message: "Bridge reset", code: "GAS_BRIDGE_RESET" })); });
    closeBridgePort();
    if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
    iframe = null;
    readyPromise = null;
    bridgeLoadState = "idle";
    bridgeLastError = "";
    bridgeOrigin = "";
    return true;
  };
  root.AppTransport.status = function () {
    return {
      ok: bridgeLoadState === "ready",
      mode: root.AppTransport.mode,
      configured: !!normalizeGasUrl(config.GAS_WEB_APP_URL),
      parentOrigin: root.location.origin,
      pending: Object.keys(pending).length,
      bridgeLoadState: bridgeLoadState,
      bridgeLastError: bridgeLastError,
      bridgeChannel: bridgeChannel,
      bridgeOrigin: bridgeOrigin,
      expectedBridgeVersion: EXPECTED_BRIDGE_VERSION
    };
  };
})(window, document);
