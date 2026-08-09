function _deferredIncludeRequiredRole_(name) {
    name = String(name || "").trim();
    var baseName = _deferredAssetNameParts_(name).base;
    try {
        if (_appIsFnName_("_appAssetRequiredRoleForDeferredName_"))
            return _appAssetRequiredRoleForDeferredName_(name) || "viewer";
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
    return /Admin|Diagnostics|Release|Regression/i.test(baseName) ? "admin" : "viewer";
}
function _deferredIncludeAllowedMap_() {
    try {
        if (_appIsFnName_("_appAssetAllowedDeferredFiles_"))
            return _appAssetAllowedDeferredFiles_();
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
    return {
        SCR: !0, Scripts_Page_Dashboard: !0, Scripts_Page_Meeting: !0, Scripts_Page_Budget: !0, Scripts_Page_People: !0, Scripts_Page_ReportTrack: !0, Scripts_Page_Petitioner: !0, Scripts_Page_Admin: !0
    };
}
function _deferredIncludeBundleAllowed_(bundleName) {
    bundleName = String(bundleName || "").trim();
    try {
        var m = typeof getAppAssetManifest_ == "function" ? getAppAssetManifest_() : {};
        return !(!m.bundles || !m.bundles[bundleName]);
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C00"
        }), !1;
    }
}
function _deferredAssetNameParts_(name) {
    name = String(name || "").trim();
    var match = name.match(/^([^:]+)::([a-z0-9_-]+)$/i);
    return match ? { name: name, base: match[1], fragment: match[2].toLowerCase() } : { name: name, base: name, fragment: "" };
}
function _deferredAssetFragmentHtml_(html, fragment) {
    html = String(html || ""), fragment = String(fragment || "").trim().toLowerCase();
    if (!fragment)
        return html;
    var blocks = [], matched = 0, tagPattern = /<(script|style)\b([^>]*)>[\s\S]*?<\/\1\s*>/gi;
    html.replace(tagPattern, function (block, tag, attrs) {
        var m = String(attrs || "").match(/\bdata-app-fragment\s*=\s*(["'])(.*?)\1/i), tokens = m ? String(m[2] || "").toLowerCase().split(/\s+/).filter(Boolean) : [];
        if (tokens.indexOf(fragment) >= 0) {
            blocks.push(block), matched++;
        }
        return block;
    });
    if (!matched)
        throw new Error("DEFERRED_FRAGMENT_NOT_FOUND:" + fragment);
    return blocks.join("\n");
}
function _includeDeferredAssetHtml_(name) {
    var parts = _deferredAssetNameParts_(name), html = includeAppHtml_(parts.base);
    return parts.fragment ? _deferredAssetFragmentHtml_(html, parts.fragment) : html;
}
function getDeferredInclude(payload) {
    var req = payload && typeof payload == "object" && !Array.isArray(payload) ? payload : {
        name: payload
    }, name = String(req.name || req.partial || req.file || "").trim();
    try {
        req._securityContext = {
            method: "getDeferredInclude", asset: !0, admin: _deferredIncludeRequiredRole_(name) === "admin"
        }, requireAuth_(req || {}, _deferredIncludeRequiredRole_(name));
    }
    catch (e) {
        return err_(e && e.message ? e.message : String(e), {
            code: "DEFERRED_INCLUDE_AUTH_REQUIRED", name
        });
    }
    if (/^bundle:/i.test(name)) {
        var b = name.replace(/^bundle:/i, "");
        return _deferredIncludeBundleAllowed_(b) ? ok_({
            name, html: includeProductionBundle_(b), loadedAt: new Date().toISOString(), bundled: !0
        }, "โหลด bundle สำเร็จ") : err_("ไม่พบ bundle: " + b, {
            code: "DEFERRED_BUNDLE_NOT_FOUND", name
        });
    }
    return _deferredIncludeAllowedMap_()[name] ? ok_({
        name, html: _includeDeferredAssetHtml_(name), loadedAt: new Date().toISOString(), fragment: _deferredAssetNameParts_(name).fragment || ""
    }, "โหลด partial สำเร็จ") : err_("ไม่อนุญาตให้โหลด partial: " + name, {
        code: "DEFERRED_INCLUDE_NOT_ALLOWED", name
    });
}
function include(filename) {
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}
function getAppLogoConfig_() {
    var logoUrl = "", logoDataUri = "";
    try {
        logoUrl = String(_scriptProp_("LOGO_URL", "") || "").trim();
    }
    catch (_urlErr) {
        _recordWarning_("ec", _urlErr), logoUrl = "";
    }
    try {
        logoDataUri = String(_scriptProp_("LOGO_DATA_URI", "") || "").trim();
    }
    catch (_dataErr) {
        _recordWarning_("ec", _dataErr), logoDataUri = "";
    }
    var compactDefaultSvg = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="24" fill="#f8fafc"/><circle cx="64" cy="48" r="26" fill="#d4af37"/><path d="M28 100h72M40 88h48M48 74h32" stroke="#334155" stroke-width="7" stroke-linecap="round"/><text x="64" y="55" text-anchor="middle" font-family="Sarabun, Arial" font-size="18" fill="#334155">สภา</text></svg>'), active = logoUrl || logoDataUri || compactDefaultSvg;
    return {
        svg: active, png96: active, png192: active, png512: active, inline: logoDataUri || "", active, source: logoUrl ? "LOGO_URL" : logoDataUri ? "LOGO_DATA_URI" : "compact-default"
    };
}
function getActiveLogoUrl_() {
    var cfg = getAppLogoConfig_();
    return String(cfg.active || cfg.png192 || cfg.svg || "");
}
function includeAppHtml_(filename) {
    if (!(filename = String(filename || "").trim()))
        return "";
    try {
        if (typeof includeHtml_ == "function")
            return includeHtml_(filename);
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
    try {
        if (typeof include == "function")
            return include(filename);
    }
    catch (_e2) {
        _recordWarning_("ec", _e2);
    }
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}
function _vue3NormalizeRequestedPage_(e) {
    var page = e && e.parameter && (e.parameter.page || e.parameter.view || e.parameter.route);
    return (page = String(page || "").trim().toLowerCase()) ? (page.charAt(0) === "#" && (page = page.replace(/^#/, "")), page.charAt(0) !== "/" && (page = "/" + page), page.replace(/\/+/g, "/")) : "/dashboard";
}
function _vue3SessionBootstrapCanonical_(e, options) {
    options = options || {};
    var release = _appIsFnName_("_appRelease_") ? _appRelease_() : {
        stamp: "5.10.47", assetStamp: "local"
    }, page = _appIsFnName_("_vue3ResolveRequestedPage_") ? _vue3ResolveRequestedPage_(e) : _vue3NormalizeRequestedPage_(e), baseUrl = "";
    try {
        baseUrl = _appIsFnName_("_vue3BaseUrl_") ? _vue3BaseUrl_() : ScriptApp.getService().getUrl() || "";
    }
    catch (_baseErr) {
        _recordWarning_("core.bootstrap.baseUrl", _baseErr), baseUrl = "";
    }
    var logoUrl = "";
    try {
        logoUrl = _appIsFnName_("_vue3LogoUrl_") ? _vue3LogoUrl_() : typeof getActiveLogoUrl_ == "function" ? getActiveLogoUrl_() : "";
    }
    catch (_logoErr) {
        _recordWarning_("core.bootstrap.logo", _logoErr), logoUrl = "";
    }
    var out = {
        authenticated: !1, username: "", displayName: "", role: "", csrfToken: "", authBootstrapMode: "memory-token-with-opaque-session-resume-handle", sessionRestoreSupported: !0, sessionResumeMode: "sessionStorage-opaque-resume-handle", loginRouteContract: "router-login-renders-form-current-critical-runtime", criticalRuntimeContract: "critical-login-runtime-production-current-overwrite-correction", runtimeAuthContract: "runtime-auth-production-current-overwrite-correction", logoUrl, defaultRoute: "/dashboard", appStamp: release.stamp || "APP-CURRENT", assetStamp: release.assetStamp || "", sourceFingerprint: release.sourceFingerprint || "", contractStamp: release.contractStamp || "", buildName: release.buildName || "", page, baseUrl, uiMode: "vue3", enabledVuePages: [
            "/login", "/dashboard", "/meeting", "/search", "/track", "/report", "/people", "/petitioner", "/budget", "/admin"
        ], terminology: typeof getAppTerminology_ == "function" ? getAppTerminology_() : {}, printStandard: typeof getStandardPrintHeader_ == "function" ? getStandardPrintHeader_() : {}
    };
    return options.securityGate && _appIsFnName_("_securityProductionGateSnapshot_") && (out.securityGate = _securityProductionGateSnapshot_()), out;
}
function includeHtml_(filename) {
    return typeof include == "function" ? include(filename) : HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}
function _assetManifestStamp_() {
    var release = _appIsFnName_("_appRelease_") ? _appRelease_() : {
        stamp: "current"
    }, stamp, fingerprint;
    return "asset-manifest-production-" + String(release.assetStamp || release.stamp || "current") + "-" + String(release.sourceFingerprint || "source");
}

function _appExternalAssetPolicy_() {
    return {
        stamp: "sri-asset-policy-r216-recovery",
        owner: "Code_03_Platform_Assets.ExternalAssetPolicy",
        contractFingerprint: "vue@3.5.13|sweetalert2@11.26.25|bootstrap@5.3.0|fontawesome@6.4.0|xlsx@0.18.5|sri-r216-recovery",
        mode: "exact-version-sri-fail-closed",
        requireHttps: !0,
        requireIntegrityForExecutable: !0,
        allowFloatingVersions: !1,
        allowedHosts: [
            "cdn.jsdelivr.net",
            "unpkg.com",
            "cdnjs.cloudflare.com",
            "fonts.googleapis.com",
            "fonts.gstatic.com"
        ],
        executableHosts: [
            "cdn.jsdelivr.net",
            "unpkg.com",
            "cdnjs.cloudflare.com"
        ],
        assets: {
            vue: {
                version: "3.5.13", type: "script", critical: !0, expectedGlobal: "Vue", requiredMethods: ["createApp", "h", "nextTick", "onMounted", "reactive", "shallowRef"], sources: [
                    { script: "https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js", integrity: "sha256-xFm6fMjbZcmCWJ+l1kx/9HiHfo5bD9dWgyB87GpOieg=", crossorigin: "anonymous", referrerPolicy: "no-referrer" },
                    { script: "https://unpkg.com/vue@3.5.13/dist/vue.global.prod.js", integrity: "sha256-xFm6fMjbZcmCWJ+l1kx/9HiHfo5bD9dWgyB87GpOieg=", crossorigin: "anonymous", referrerPolicy: "no-referrer" }
                ]
            },
            sweetalert2: {
                version: "11.26.25", type: "script", critical: !0, expectedGlobal: "Swal", requiredMethods: ["fire", "close", "showLoading", "showValidationMessage", "getTitle", "isVisible"], sources: [
                    { script: "https://cdn.jsdelivr.net/npm/sweetalert2@11.26.25/dist/sweetalert2.all.min.js", integrity: "sha512-TA1p+I1AtmUN2QnvpJT01/hjvxCxjyBfXtNuKNnvvwyCaQpdl5JUfiJ7geQtMnJ55myntTq5JwPLiH3j6e222A==", crossorigin: "anonymous", referrerPolicy: "no-referrer" },
                    { script: "https://unpkg.com/sweetalert2@11.26.25/dist/sweetalert2.all.min.js", integrity: "sha512-TA1p+I1AtmUN2QnvpJT01/hjvxCxjyBfXtNuKNnvvwyCaQpdl5JUfiJ7geQtMnJ55myntTq5JwPLiH3j6e222A==", crossorigin: "anonymous", referrerPolicy: "no-referrer" }
                ]
            },
            bootstrapCss: {
                version: "5.3.0", type: "style", sources: [
                    { style: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css", integrity: "sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM", crossorigin: "anonymous", referrerPolicy: "no-referrer" }
                ]
            },
            fontAwesomeCss: {
                version: "6.4.0", type: "style", sources: [
                    { style: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css", integrity: "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==", crossorigin: "anonymous", referrerPolicy: "no-referrer" }
                ]
            },
            googleFonts: {
                version: "Sarabun-300-400-600-700", type: "style", integrityExempt: !0, integrityExemptReason: "user-agent-negotiated-google-font-css", exactUrl: "https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap", sources: [
                    { style: "https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap", integrityExempt: !0, crossorigin: "anonymous", referrerPolicy: "no-referrer" }
                ]
            },
            bootstrap: {
                version: "5.3.0", type: "script", onDemand: !0, sources: [
                    { script: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js", integrity: "sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz", crossorigin: "anonymous", referrerPolicy: "no-referrer" }
                ]
            },
            xlsx: {
                version: "0.18.5", type: "script", onDemand: !0, sources: [
                    { script: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js", integrity: "sha512-r22gChDnGvBylk90+2e/ycr3RVrDi8DIOkIGNhJlKfuyQM4tIRAI062MaV8sfjQKYVGjOBaZBOA87z+IhZE9DA==", crossorigin: "anonymous", referrerPolicy: "no-referrer" }
                ]
            }
        }
    };
}
function getAppAssetManifest_() {
    return {
        stamp: _assetManifestStamp_(), sourceOwner: "gas-backend", canonicalRoot: "gas-backend", generatedMirrorRoot: "github-pages/assets", generatedMirrorPolicy: "generated-deployment-mirror-read-only", syncTool: "tools/sync_github_assets.py", releaseGate: "", securityGate: "", contractFinalCleanup: !0, runtimeSlimmingEnabled: !0, writeSchemaUnification: !0, bundles: {
            appCritical: {
                files: [
                    "Scripts_Critical_Login_Runtime"
                ]
            }, appCore: {
                files: [
                    "Scripts_Core_Runtime",
                    "Runtime_01_Request_Lifecycle"
                ]
            }, runtimeDateTable: {
                files: ["Runtime_02_Date_Time", "Runtime_03_Table_UI"]
            }, runtimeThailandLocation: {
                minRole: "staff", files: ["Runtime_04_Thailand_Location"]
            }, runtimeStatusAging: {
                files: ["Runtime_05_Status_Aging"]
            }, runtimeAiBridge: {
                files: ["Runtime_08_AI_Bridge"]
            }, runtimeQaRegression: {
                minRole: "admin", files: ["Runtime_09_QA_Regression"]
            }, pageDashboard: {
                files: [
                    "Scripts_Page_Dashboard"
                ]
            }, pageMeeting: {
                minRole: "staff", files: [
                    "Scripts_Page_Meeting::meeting-common",
                    "Scripts_Page_Meeting::meeting"
                ]
            }, pageCommitteeMeeting: {
                minRole: "staff", files: [
                    "Scripts_Page_Meeting::meeting-common",
                    "Scripts_Page_Meeting::committee"
                ]
            }, pageTrackReport: {
                minRole: "staff", files: [
                        "Scripts_Page_ReportTrack::reporttrack-common"
                ]
            }, pagePetitioner: {
                minRole: "staff", files: [
                    "Scripts_Page_Petitioner"
                ]
            }, pagePeople: {
                minRole: "staff", files: [
                    "Scripts_Page_People"
                ]
            }, pageBudget: {
                minRole: "staff", files: [
                    "Scripts_Page_Budget"
                ]
            }, pageAdmin: {
                files: [
                    "Scripts_Page_Admin"
                ], minRole: "admin"
            }, pageAiPrint: {
                files: [
                    "Scripts_Page_ReportTrack::print"
                ]
            }
        }, upfrontScripts: [], chunks: {
            dashboard: [
                "Scripts_Page_Dashboard"
            ], search: [
                "bundle:runtimeDateTable",
                "Runtime_05_Status_Aging",
                "Scripts_Page_ReportTrack::reporttrack-common"
            ], petitioner: [
                "bundle:runtimeDateTable",
                "Runtime_04_Thailand_Location",
                "Scripts_Page_Petitioner"
            ], meeting: [
                "bundle:runtimeDateTable",
                "Scripts_Page_Meeting::meeting-common",
                "Scripts_Page_Meeting::meeting"
            ], "committee-meeting": [
                "bundle:runtimeDateTable",
                "Scripts_Page_Meeting::meeting-common",
                "Scripts_Page_Meeting::committee"
            ], track: [
                "bundle:runtimeDateTable",
                "Runtime_05_Status_Aging",
                "Scripts_Page_ReportTrack::reporttrack-common"
            ], report: [
                "bundle:runtimeDateTable",
                "Runtime_05_Status_Aging",
                "Scripts_Page_ReportTrack::reporttrack-common"
            ], people: [
                "bundle:runtimeDateTable",
                "Scripts_Page_People"
            ], personnel: [
                "bundle:runtimeDateTable",
                "Scripts_Page_People"
            ], budget: [
                "bundle:runtimeDateTable",
                "Runtime_04_Thailand_Location",
                "Runtime_05_Status_Aging",
                "Scripts_Page_Budget"
            ], admin: [
                "bundle:runtimeDateTable",
                "Scripts_Page_Admin"
            ], ai: [
                "Runtime_08_AI_Bridge"
            ], print: [
                "Scripts_Page_ReportTrack::print"
            ]
        }, templates: {}, externalGroups: [
            "bootstrap", "xlsx"
        ], assetPolicy: _appExternalAssetPolicy_(), externalAssets: {
            bootstrap: {
                version: "5.3.0", type: "script", script: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js", integrity: "sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz", crossorigin: "anonymous", referrerPolicy: "no-referrer", onDemand: !0
            }, xlsx: {
                version: "0.18.5", type: "script", script: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js", integrity: "sha512-r22gChDnGvBylk90+2e/ycr3RVrDi8DIOkIGNhJlKfuyQM4tIRAI062MaV8sfjQKYVGjOBaZBOA87z+IhZE9DA==", crossorigin: "anonymous", referrerPolicy: "no-referrer", onDemand: !0
            }
        }
    };
}
function _appAssetManifestBundles_() {
    var manifest = getAppAssetManifest_();
    return manifest && manifest.bundles ? manifest.bundles : {};
}
function _appAssetBundleFiles_(bundleName) {
    var bundles, bundle = _appAssetManifestBundles_()[String(bundleName || "").replace(/^bundle:/i, "")];
    return bundle && Array.isArray(bundle.files) ? bundle.files.slice() : [];
}
function _appAssetDeferredScriptMap_() {
    var manifest = getAppAssetManifest_(), out = {}, chunks = manifest && manifest.chunks ? manifest.chunks : {};
    return Object.keys(chunks).forEach(function (key) {
        out[key] = Array.isArray(chunks[key]) ? chunks[key].slice() : [];
    }), out;
}
function getAppDeferredScriptMapJson_() {
    return _assetJson_(_appAssetDeferredScriptMap_());
}
function getAppCoreRuntimeFilesJson_() {
    return _assetJson_(_appAssetBundleFiles_("appCore"));
}
function _appAssetAllowedDeferredFiles_() {
    var manifest = getAppAssetManifest_(), out = {};
    function addAllowedAssetFile_(file) {
        (file = String(file || "").trim()) && (out[file] = !0);
    }
    return Object.keys(manifest.bundles || {}).forEach(function (name) {
        var files;
        (manifest.bundles[name] && manifest.bundles[name].files || []).forEach(addAllowedAssetFile_);
    }), Object.keys(manifest.chunks || {}).forEach(function (name) {
        (manifest.chunks[name] || []).forEach(addAllowedAssetFile_);
    }), Object.keys(manifest.templates || {}).forEach(function (name) {
        addAllowedAssetFile_(manifest.templates[name]);
    }), (manifest.upfrontScripts || []).forEach(addAllowedAssetFile_), out;
}
function _appAssetRequiredRoleForDeferredName_(name) {
    if (_appIsFnName_("_permissionRequiredRoleForDeferredAsset_"))
        return String(_permissionRequiredRoleForDeferredAsset_(name) || "Viewer").toLowerCase();
    var bundleName = (name = String(name || "").trim()).replace(/^bundle:/i, ""), baseName = _deferredAssetNameParts_(name).base, manifest = getAppAssetManifest_(), roleRank = {
        viewer: 1, editor: 2, staff: 2, admin: 3
    }, required = "viewer";
    function bump(role) {
        role = String(role || "viewer").trim().toLowerCase(), roleRank[role] || (role = "viewer"), roleRank[role] > roleRank[required] && (required = role);
    }
    var bundles = manifest.bundles || {};
    return /^bundle:/i.test(name) && bundles[bundleName] ? String(bundles[bundleName].minRole || "viewer").toLowerCase() : (Object.keys(bundles).forEach(function (key) {
        var b = bundles[key] || {}, files;
        (Array.isArray(b.files) ? b.files : []).indexOf(name) >= 0 && bump(b.minRole || "viewer");
    }), /Admin|Diagnostics|Release|Regression/i.test(baseName) && bump("admin"), required);
}
function _assetJson_(value) {
    try {
        return JSON.stringify(value == null ? null : value);
    }
    catch (_e) {
        return "{}";
    }
}
function _minifyBundleHtml_(html) {
    html = String(html || "");
    var preserved = [];
    return html = (html = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, function (block) {
        var token = "%%APP_PRESERVED_BLOCK_" + preserved.length + "%%";
        return preserved.push(block), token;
    })).replace(/<!--[\s\S]*?-->/g, function (m) {
        return /^\s*<!--\s*\[if/i.test(m) ? m : "";
    }).replace(/>\s+</g, "><").replace(/\n{3,}/g, `

`).trim(), preserved.forEach(function (block, index) {
        html = html.replace("%%APP_PRESERVED_BLOCK_" + index + "%%", block);
    }), html;
}
function _bundleCacheKey_(bundleName, files) {
    var stamp = _assetManifestStamp_(), joined = (files || []).join(",");
    return [
        "bundle", stamp, String(bundleName || ""), joined
    ].join(":");
}
function _cacheGetLargeHtml_(key) {
    try {
        var cache = _AppScriptCache_(), metaRaw = cache.get(key + ":meta");
        if (!metaRaw)
            return "";
        var meta = JSON.parse(metaRaw), count = Number(meta && meta.count || 0);
        if (!count || count < 1 || count > 20)
            return "";
        for (var parts = [], i = 0; i < count; i++) {
            var part = cache.get(key + ":" + i);
            if (part == null)
                return "";
            parts.push(part);
        }
        return parts.join("");
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C00"
        }), "";
    }
}
function _cachePutLargeHtml_(key, value, ttlSeconds) {
    try {
        value = String(value || "");
        var cache = _AppScriptCache_(), chunkSize = 85e3, count = Math.ceil(value.length / 85e3);
        if (!count || count > 20)
            return !1;
        for (var i = 0; i < count; i++)
            cache.put(key + ":" + i, value.slice(85e3 * i, 85e3 * (i + 1)), ttlSeconds || 21600);
        return cache.put(key + ":meta", JSON.stringify({
            count, size: value.length, stamp: _assetManifestStamp_()
        }), ttlSeconds || 21600), !0;
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C00"
        }), !1;
    }
}
function includeProductionBundle_(bundleName) {
    bundleName = String(bundleName || "").replace(/^bundle:/i, "");
    var manifest = getAppAssetManifest_(), bundle = manifest && manifest.bundles && manifest.bundles[bundleName];
    if (!bundle || !Array.isArray(bundle.files) || !bundle.files.length)
        return "<!-- production bundle not found: " + bundleName + " -->";
    var files = bundle.files.slice(), key = _bundleCacheKey_(bundleName, files), cached = _cacheGetLargeHtml_(key);
    if (cached)
        return cached;
    var html = files.map(function (file) {
        return _includeDeferredAssetHtml_(file);
    }).join(`
`);
    return _cachePutLargeHtml_(key, html = _minifyBundleHtml_(html), 21600), html;
}
function getAppAssetManifestJson_() {
    return _assetJson_(getAppAssetManifest_());
}
function _vue3LogoUrl_() {
    try {
        return (typeof getActiveLogoUrl_ == "function" ? getActiveLogoUrl_() : "") || "";
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C00"
        }), "";
    }
}
function _vue3BaseUrl_() {
    try {
        return ScriptApp.getService().getUrl() || "";
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C00"
        }), "";
    }
}
function _vue3ResolveRequestedPage_(e) {
    return _vue3NormalizeRequestedPage_(e);
}
