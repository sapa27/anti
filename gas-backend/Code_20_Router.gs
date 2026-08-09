var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {}, AppBackendMiddleware = __APP_GLOBAL__.AppBackendMiddleware = __APP_GLOBAL__.AppBackendMiddleware || {}, ROUTER_REFACTOR_CONTRACT_STAMP = "router-middleware-envelope-single-owner-refactor-2026-06-15";
function normalizeResult_(result, successMsg, errorMsg) {
    if (result && typeof result == "object" && !Array.isArray(result)) {
        if (result.ok === !1)
            return {
                ok: !1, data: Object.prototype.hasOwnProperty.call(result, "data") ? result.data : null, rows: Array.isArray(result.rows) ? result.rows : [], msg: String(result.msg || result.error || errorMsg || "คำขอไม่สำเร็จ"), error: String(result.error || result.msg || errorMsg || "คำขอไม่สำเร็จ"), errorCode: String(result.errorCode || result.code || "API_ERROR"), meta: Object.assign({
                    contractOwner: "Code_20_Router.normalizeResult_", stamp: ROUTER_REFACTOR_CONTRACT_STAMP
                }, result.meta || {})
            };
        var rows = Array.isArray(result.rows) ? result.rows : Array.isArray(result.data) ? result.data : Array.isArray(result.items) ? result.items : Array.isArray(result.records) ? result.records : null, data = Object.prototype.hasOwnProperty.call(result, "data") ? result.data : rows || result, out = Object.assign({}, result, {
            ok: !0, data, msg: String(result.msg || successMsg || "สำเร็จ")
        });
        rows && (out.rows = rows, out.items = rows, out.records = rows, out.totalRecords = Number(result.totalRecords || result.total || rows.length) || 0, out.total = out.totalRecords, out.page = Number(result.page || 1) || 1, out.limit = Number(result.limit || result.pageSize || rows.length || 20) || 20, out.pageSize = Number(result.pageSize || out.limit) || out.limit, out.totalPages = Number(result.totalPages || Math.max(1, Math.ceil(out.totalRecords / Math.max(1, out.limit)))) || 1);
        var resultData = result.data && typeof result.data == "object" && !Array.isArray(result.data) ? result.data : {}, degraded = result.degraded === !0 || result.loadOk === !1 || resultData.degraded === !0 || resultData.loadOk === !1 || result.meta && result.meta.degraded === !0 || resultData.meta && resultData.meta.degraded === !0, warningText = String(result.warning || resultData.warning || result.meta && result.meta.warning || resultData.meta && resultData.meta.warning || "").trim();
        if (out.meta = Object.assign({
            contractOwner: "Code_20_Router.normalizeResult_", stamp: ROUTER_REFACTOR_CONTRACT_STAMP
        }, result.meta || {}), degraded) {
            var warnings = Array.isArray(result.warnings) ? result.warnings.slice() : Array.isArray(resultData.warnings) ? resultData.warnings.slice() : [];
            warningText && !warnings.some(function (item) {
                return String(item && (item.message || item) || "") === warningText;
            }) && warnings.push({
                code: String(result.errorCode || resultData.errorCode || "DEGRADED_DATA"), message: warningText
            }), out.degraded = !0, out.loadOk = !1, out.warning = warningText || "โหลดข้อมูลได้ไม่ครบถ้วน", out.warnings = warnings, out.errorCode = String(result.errorCode || resultData.errorCode || "DEGRADED_DATA"), out.meta.degraded = !0, out.meta.warningCount = warnings.length || 1, (!out.msg || out.msg === "สำเร็จ") && (out.msg = out.warning);
        }
        return out;
    }
    return Array.isArray(result) ? {
        ok: !0, data: result, rows: result, items: result, records: result, totalRecords: result.length, total: result.length, page: 1, limit: result.length || 20, pageSize: result.length || 20, totalPages: 1, msg: String(successMsg || "สำเร็จ"), meta: {
            contractOwner: "Code_20_Router.normalizeResult_", stamp: ROUTER_REFACTOR_CONTRACT_STAMP
        }
    } : {
        ok: !0, data: result, msg: String(successMsg || "สำเร็จ"), meta: {
            contractOwner: "Code_20_Router.normalizeResult_", stamp: ROUTER_REFACTOR_CONTRACT_STAMP
        }
    };
}
AppBackendMiddleware.normalizeResult = normalizeResult_, AppBackendMiddleware.errorEnvelope = function (method, routeMeta, requestId, startedAt, error, extra) {
    var phaseD = typeof _routerClassifyError_ == "function" ? _routerClassifyError_(method, routeMeta || {}, error, extra && extra.errorCode || "API_ROUTE_FAILED") : null, message = String(phaseD && phaseD.message || error && error.message || error || "คำขอไม่สำเร็จ"), group = String(routeMeta && (routeMeta.group || routeMeta.domain) || "general");
    return {
        ok: !1, data: null, rows: [], items: [], records: [], msg: message, error: message, errorCode: String(phaseD && phaseD.errorCode || error && (error.errorCode || error.code) || extra && extra.errorCode || "API_ROUTE_FAILED"), method: String(method || ""), group, requestId: requestId || "", latencyMs: Date.now() - Number(startedAt || Date.now()), meta: {
            contractOwner: "Code_20_Router.AppBackendMiddleware.errorEnvelope", stamp: ROUTER_REFACTOR_CONTRACT_STAMP, writeReliabilityStamp: phaseD && phaseD.stamp || "", rawError: phaseD && phaseD.rawMessage || ""
        }
    };
}, AppBackendMiddleware.invoke = function (method, payload, meta, handler) {
    var started = Date.now(), requestId = "rt_" + started + "_" + Math.floor(Math.random() * 1e6);
    try {
        var ctx = AppBackendMiddleware.run(method, payload || {}, meta || {});
        if (typeof handler != "function")
            throw new Error("ไม่พบ API handler: " + String(method || ""));
        return normalizeResult_(handler(ctx.payload), "สำเร็จ", "คำขอไม่สำเร็จ");
    }
    catch (e) {
        return AppBackendMiddleware.errorEnvelope(method, meta || {}, requestId, started, e, {
            errorCode: "API_ROUTE_EXCEPTION"
        });
    }
};
var AppDomain = __APP_GLOBAL__.AppDomain = __APP_GLOBAL__.AppDomain || {}, AppInfra = __APP_GLOBAL__.AppInfra = __APP_GLOBAL__.AppInfra || {}, AppSecurity = __APP_GLOBAL__.AppSecurity = __APP_GLOBAL__.AppSecurity || {}, ROUTER_CLEANUP_STAMP = "c4-router-facade-owner-current", ROUTER_FACADE_STAMP_CURRENT = "router-facade-dispatch-envelope-current-r253", ROUTER_LIFECYCLE_ACTIVE = "active";
AppBackendMiddleware.buildContext = function (method, payload, meta) {
    return {
        method: String(method || ""), payload: payload || {}, meta: meta || {}, session: null, user: null
    };
}, AppBackendMiddleware.requireAuth = function (ctx) {
    var meta = (ctx = ctx || {}).meta || {}, requiredRole = _appIsFnName_("_permissionRequiredRoleForApi_") ? _permissionRequiredRoleForApi_(ctx.method || "", meta) : meta.minRole || "viewer";
    if (meta.public !== !0 && typeof requireAuth_ == "function") {
        ctx.session = requireAuth_(ctx.payload || {}, requiredRole === "public" ? "viewer" : String(requiredRole || "viewer").toLowerCase()) || ctx.session || null;
        ctx.effectiveMinRole = requiredRole;
    }
    return ctx;
};
var PRODUCTION_DTO_CONTRACT = {
    ok: !0, owner: "Code_20_Router:ProductionDtoContract", contractStamp: "production-dto-contract-v2", responseShape: {
        ok: "boolean", rows: "array|undefined", data: "array|object|null", items: "array|undefined", records: "array|undefined", page: "number|undefined", pageSize: "number|undefined", limit: "number|undefined", totalRecords: "number|undefined", total: "number|undefined", totalPages: "number|undefined", meta: "object|undefined"
    }, routeContracts: {
        apiSearchCasesLite: {
            contractStamp: "case-search-page-envelope-v3", outerShape: "standard-envelope-with-paging-aliases", dataShape: "paging-object", requiredDataKeys: [
                "rows", "totalRecords", "page", "pageSize", "totalPages"
            ], rowAliases: [
                "rows", "items", "records"
            ], serverPaged: !0, serverFiltered: !0, maxPageSize: 100
        }
    }, canonicalEnvelope: function (rows, meta) {
        rows = Array.isArray(rows) ? rows : [], meta = meta || {};
        var pageSize = Math.max(1, Number(meta.pageSize || meta.limit || 20) || 20), totalRecords = Math.max(0, Number(meta.totalRecords || meta.total || rows.length) || 0);
        return {
            ok: !0, rows, data: rows, items: rows, records: rows, page: Math.max(1, Number(meta.page || 1) || 1), pageSize, limit: pageSize, totalRecords, total: totalRecords, totalPages: Math.max(1, Math.ceil(totalRecords / pageSize) || 1), meta: Object.assign({
                contractOwner: "Code_20_Router:ProductionDtoContract", contractStamp: "production-dto-contract-v2", uiDomChanged: !1, businessLogicChanged: !1
            }, meta.meta || {})
        };
    }, canonicalPagingEnvelope: function (rows, meta) {
        rows = Array.isArray(rows) ? rows : [], meta = meta || {};
        var pageSize = Math.max(1, Math.min(Number(meta.pageSize || meta.limit || 20) || 20, Number(meta.maxPageSize || 100) || 100)), totalRecords = Math.max(0, Number(meta.totalRecords || meta.total || rows.length) || 0), page = Math.max(1, Number(meta.page || 1) || 1), totalPages = Math.max(1, Number(meta.totalPages || Math.ceil(totalRecords / pageSize)) || 1), pagingMeta = Object.assign({
            contractOwner: "Code_20_Router:ProductionDtoContract.canonicalPagingEnvelope", contractStamp: "case-search-page-envelope-v3", pagingContract: "case-search-page-envelope-v3", serverPaged: !0, serverFiltered: !0, uiDomChanged: !1, businessLogicChanged: !1
        }, meta.meta || {}), pageData = {
            rows, items: rows, records: rows, totalRecords, total: totalRecords, page, pageSize, limit: pageSize, totalPages, serverPaged: !0, serverFiltered: !0, meta: pagingMeta
        };
        return {
            ok: !0, data: pageData, rows, items: rows, records: rows, totalRecords, total: totalRecords, page, pageSize, limit: pageSize, totalPages, serverPaged: !0, serverFiltered: !0, pagingContract: "case-search-page-envelope-v3", meta: pagingMeta, msg: String(meta.msg || ""), error: ""
        };
    }, uiDomChanged: !1, businessLogicChanged: !1
};
AppBackendMiddleware.requirePermission = function (ctx) {
    var meta = (ctx = ctx || {}).meta || {};
    if (meta.public === !0)
        return ctx;
    var role = ctx.session && ctx.session.role || "Viewer", allowed = _appIsFnName_("_permissionCanApi_") ? _permissionCanApi_(role, ctx.method || "", meta) : !0;
    if (!allowed) {
        try {
            _appIsFnName_("_safeAudit_") && _safeAudit_("security.permissionMatrixDenied", { method: String(ctx.method || ""), role: String(role || ""), group: String(meta.group || meta.domain || ""), matrixStamp: typeof APP_PERMISSION_MATRIX != "undefined" ? APP_PERMISSION_MATRIX.stamp : "" });
        }
        catch (_auditPermissionErr) {
            _routerWarn_("security.permissionMatrixDenied.audit", _auditPermissionErr);
        }
        var permissionError = new Error("สิทธิ์ไม่เพียงพอสำหรับการใช้งานส่วนนี้");
        permissionError.errorCode = "PERMISSION_MATRIX_DENIED";
        throw permissionError;
    }
    _appIsFnName_("_permissionApplyApiPayloadPolicy_") && _permissionApplyApiPayloadPolicy_(role, ctx.method || "", ctx.payload || {});
    return ctx;
}, AppBackendMiddleware.requireCsrf = function (ctx) {
    var meta = (ctx = ctx || {}).meta || {};
    return meta.write !== !0 && meta.csrf !== !0 ? ctx : _appIsFnName_("_verifyCsrfToken_") ? (_verifyCsrfToken_(ctx.payload || {}, ctx.session || null, {
        action: ctx.method || "", requireAction: !1
    }), ctx) : (_appIsFnName_("_assertCsrfToken_") && _assertCsrfToken_(ctx.payload || {}, ctx.method || ""), ctx);
}, AppBackendMiddleware.validateDto = function (ctx) {
    return ctx = ctx || {}, _appIsFnName_("_assertApiPayloadEnvelopeSafe_") && _assertApiPayloadEnvelopeSafe_(ctx.method || "", ctx.payload || {}, "backend-middleware-owner"), ctx;
}, AppBackendMiddleware.run = function (method, payload, meta) {
    var ctx = AppBackendMiddleware.buildContext(method, payload, meta);
    return AppBackendMiddleware.requireAuth(ctx), AppBackendMiddleware.requirePermission(ctx), AppBackendMiddleware.requireCsrf(ctx), AppBackendMiddleware.validateDto(ctx), ctx;
};
var MainRouter = __APP_GLOBAL__.MainRouter = __APP_GLOBAL__.MainRouter || {};
MainRouter.dispatch = MainRouter.dispatch || function (method, payload) {
    return apiRouter({
        method: String(method || ""), payload: payload || {}
    });
}, MainRouter.listRoutes = MainRouter.listRoutes || function () {
    return _appIsFnName_("_apiActiveRouteRegistry_") ? _apiActiveRouteRegistry_() : _appIsFnName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {};
};
var ROUTER_CORE_CONTRACT_STAMP = "router-core-middleware-pipeline-production-current", ROUTER_DIRECT_ENTRYPOINTS = Object.freeze([
    "apiRouter", "apiLogin", "apiSessionResume"
]);
function _routerDirectEntrypointPolicy_() {
    return {
        stamp: "router-direct-entrypoint-lock-phaseA-current", owner: "Code_20_Router", directEntrypoints: ROUTER_DIRECT_ENTRYPOINTS.slice(), frontendTransport: "AppApi.call -> apiRouter", routerOnlyDefault: !0, publicWriteAllowed: !1, directApiWriteBlocked: !0, directApiReadBlocked: !0, directReadBoundary: "_routerAuthorizedEntry_", directWriteBoundary: "writeGateway_ + _backendBoundaryCurrent_"
    };
}
function _routerAuthorizedEntry_(method, payload, role) {
    method = String(method || "").trim(), payload = payload && typeof payload == "object" && !Array.isArray(payload) ? payload : {};
    var meta = method && _appIsFnName_("_resolveRouteMeta_") ? _resolveRouteMeta_(method) : null, expectedRole = String(role || meta && meta.minRole || "viewer").toLowerCase();
    if (!method || !meta || meta.public === !0)
        return {
            ok: !1, result: err_("ไม่อนุญาตให้เรียก API นี้โดยตรง", {
                errorCode: "ROUTER_AUTH_BOUNDARY_REQUIRED", method, boundaryOwner: "Code_20_Router._routerAuthorizedEntry_", directInvocationBlocked: !0
            })
        };
    if (!_domainRouterAuthAlreadyOk_(payload, method)) {
        try {
            _appIsFnName_("_safeAudit_") && _safeAudit_("security.directApiBlocked", {
                method, reason: "router-context-required", group: String(meta.group || meta.domain || "")
            });
        }
        catch (_auditErr) {
            _routerWarn_("security.directApiBlocked.audit", _auditErr);
        }
        return {
            ok: !1, result: err_("ไม่อนุญาตให้เรียก API โดยข้าม apiRouter", {
                errorCode: "ROUTER_AUTH_BOUNDARY_REQUIRED", method, boundaryOwner: "Code_20_Router._routerAuthorizedEntry_", directInvocationBlocked: !0
            })
        };
    }
    if (_routerRequiresCsrf_(method, meta) && payload.__routerCsrfOk !== !0)
        return {
            ok: !1, result: err_("ไม่ผ่านการตรวจสอบ CSRF ของ Router", {
                errorCode: "ROUTER_CSRF_BOUNDARY_REQUIRED", method, boundaryOwner: "Code_20_Router._routerAuthorizedEntry_", directInvocationBlocked: !0
            })
        };
    try {
        return {
            ok: !0, session: requireAuth_(payload, expectedRole), meta, payload
        };
    }
    catch (e) {
        return {
            ok: !1, result: err_(String(e && e.message || e || "ไม่ผ่านการตรวจสอบสิทธิ์"), {
                errorCode: "ROUTER_AUTH_CONTEXT_INVALID", method, boundaryOwner: "Code_20_Router._routerAuthorizedEntry_"
            })
        };
    }
}
function _routerBatch_(m, names, role, group, flags, domain, maxLimit) {
    var meta = {
        write: (flags = String(flags || "")).indexOf("w") > -1, minRole: String(role || "viewer"), csrf: flags.indexOf("c") > -1, group: String(group || "general")
    };
    return flags.indexOf("p") > -1 && (meta.public = !0), flags.indexOf("r") > -1 && (meta.sessionResume = !0), flags.indexOf("s") > -1 && (meta.serverPaged = !0), flags.indexOf("f") > -1 && (meta.serverFiltered = !0), domain && (meta.domain = String(domain)), maxLimit && (meta.maxLimit = Number(maxLimit)), String(names || "").split("|").forEach(function (n) {
        (n = String(n || "").trim()) && (m[n] = Object.assign({}, meta));
    }), m;
}
function _routerRoutesFrom_(rows) {
    var m = {};
    return (rows || []).forEach(function (r) {
        _routerBatch_(m, r[0], r[1], r[2], r[3], r[4], r[5]);
    }), m;
}
function _routerHotPathContractSpec_() {
    return {
        contractStamp: "hot-path-single-owner-contract-current", methods: {
            apiGetDashboardBundle: {
                domain: "dashboard", owner: "DashboardDomain.getBundle via Code_20 router facade", readOnly: !0, cacheTtlSeconds: 240, deadlineMs: 25e3, dto: "dashboard-strict-kpi-committee-meeting-current", singleBundle: !0
            }, apiBudgetGetSummary: {
                domain: "budget", owner: "Code_32_Domain_Budget", readOnly: !0, cacheTtlSeconds: 300, deadlineMs: 25e3, dto: "budget-summary-canonical-current"
            }, apiBudgetGetImportForEdit: {
                domain: "budget", owner: "Code_32_Domain_Budget", readOnly: !0, cacheTtlSeconds: 0, deadlineMs: 25e3, dto: "budget-import-edit-direct-current"
            }, apiBudgetGetTypeSummaryByFY: {
                domain: "budget", owner: "Code_32_Domain_Budget", readOnly: !0, cacheTtlSeconds: 600, deadlineMs: 25e3, serverPaged: !0, serverFiltered: !0, maxLimit: 200, dto: "budget-type-summary-budgetimports-direct-current", sourceOfTruth: "BudgetImports", readModelFirst: !1, detailRowsPreserved: !0, materializedRequired: !1, materializedMode: "BudgetTypeSummary_R4-cache-report-only"
            }, apiGetPeoplePageBundle: {
                domain: "people", owner: "Code_33_Domain_People", readOnly: !0, cacheTtlSeconds: 300, deadlineMs: 25e3, dto: "people-page-bundle-dto-current"
            }, apiGetTracking: {
                domain: "tracking", owner: "Code_30_Domain_Cases", readOnly: !0, cacheTtlSeconds: 180, deadlineMs: 25e3, serverPaged: !0, serverFiltered: !0, maxLimit: 25, dto: "tracking-server-paged-current"
            }, apiSearchCasesLite: {
                domain: "cases", owner: "Code_30_Domain_Cases via Code_20 router owner", readOnly: !0, cacheTtlSeconds: 180, deadlineMs: 2e4, serverPaged: !0, serverFiltered: !0, maxLimit: 100, dto: "case-search-page-envelope-v3"
            }, apiGetCaseReportExportRows: {
                domain: "cases", owner: "Code_30_Domain_Cases via Code_20 router owner", readOnly: !0, cacheTtlSeconds: 0, deadlineMs: 25e3, serverPaged: !1, serverFiltered: !0, maxLimit: 5e3, onDemandOnly: !0, initialLoadAllowed: !1, dto: "case-report-export-on-demand-current"
            }, apiGetCaseReportOptions: {
                domain: "cases", owner: "Code_30_Domain_Cases via Code_20 router owner", readOnly: !0, cacheTtlSeconds: 180, deadlineMs: 2e4, dto: "case-report-options-current"
            }
        }
    };
}
var ROUTER_PERFORMANCE_HARDENING_STAMP_CURRENT = "router-performance-hardening-current-r253";
function _routerEntityCacheStamp_(name) {
    var key = String(name || "general");
    try {
        var memo = __APP_GLOBAL__.__APP_ROUTER_ENTITY_STAMP_MEMO__ = __APP_GLOBAL__.__APP_ROUTER_ENTITY_STAMP_MEMO__ || {};
        if (Object.prototype.hasOwnProperty.call(memo, key))
            return memo[key];
        var fn = typeof globalThis != "undefined" ? globalThis._entityCacheVersion_ : null, value = typeof fn == "function" ? fn(key) : "current";
        return memo[key] = String(value || "current");
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _e) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
            error: String(_e && _e.message || _e)
        });
    }
    return "current";
}
function _routerApplyDataContractCurrent_(registry) {
    registry = registry || {};
    return Object.keys(registry).forEach(function (method) {
        var meta = Object.assign({}, registry[method] || {}), policy = _appIsFnName_("_platformDataContractMethod_") ? _platformDataContractMethod_(method, meta) : null;
        if (policy) {
            meta.domain = String(policy.domain || meta.domain || meta.group || "general");
            meta.cacheEntity = String(policy.cacheEntity || "general");
            meta.cacheTtlSeconds = Number(policy.serverTtlSeconds || 0) || void 0;
            meta.clientCacheTtlSeconds = Number(policy.clientTtlSeconds || 0) || void 0;
            meta.domainOwnedCache = policy.domainOwnedCache === true;
            meta.dataContractStamp = String(policy.stamp || "");
            meta.dataContractOwner = String(policy.owner || "");
        }
        registry[method] = meta;
    }), registry;
}
function _routerApplyHotPathContracts_(registry) {
    registry = registry || {};
    var spec = _routerHotPathContractSpec_();
    return Object.keys(spec.methods || {}).forEach(function (method) {
        if (registry[method]) {
            var lock = spec.methods[method] || {}, meta = Object.assign({}, registry[method] || {});
            meta.hotPath = !0, meta.contractLocked = !0, meta.phaseHPerformanceHardening = ROUTER_PERFORMANCE_HARDENING_STAMP_CURRENT, meta.hotPathOwner = String(lock.owner || meta.owner || ""), meta.hotPathDomain = String(lock.domain || meta.domain || meta.group || ""), meta.deadlineMs = Number(lock.deadlineMs || meta.deadlineMs || 0) || void 0, meta.dtoContract = String(lock.dto || meta.dtoContract || ""), lock.serverPaged === !0 && (meta.serverPaged = !0), lock.serverFiltered === !0 && (meta.serverFiltered = !0), lock.maxLimit && (meta.maxLimit = Number(lock.maxLimit)), registry[method] = meta;
        }
    }), registry;
}
var AI_ROUTE_OWNER_VERSION = "ai-production-lazy-advisory-no-write-current";
function _routerAiRouteContractSpec_() {
    return {
        stamp: AI_ROUTE_OWNER_VERSION, owner: "Code_22_AiGateway", lazyOnly: !0, advisoryOnly: !0, noDataMutation: !0, initialLoadAllowed: !1, readOnly: !0, requiresUserAction: !0, productionMode: "lazy-user-action-advisory-no-write", mutationPolicy: "forbid-data-mutation", methods: [
            "apiAiAssistantAsk", "apiAiAssistantStartJob", "apiAiAssistantGetJob", "apiAiAssistantSummarizeCase", "apiSuggestCaseStatus", "apiSuggestCaseClassification", "apiSemanticSearch", "apiMeetingSmartSummary", "apiDraftReplyLetter", "apiExtractTrackingPdf", "apiExtractDocumentPdf", "apiGenerateExecutiveSummary", "apiPredictOverdueRisk", "apiPredictiveBudgeting", "apiAnalyzePersonnelWorkload", "apiAnalyzeWorkloadBottlenecks", "apiRecommendWorkloadDistribution", "apiCheckDuplicateCase", "apiDetectBudgetAnomalies", "apiGetDailyBriefing", "apiGenerateBudgetTrendSummary", "apiAiDashboardInsights", "apiExtractMeetingAgendaPdf", "apiChat"
        ]
    };
}
function _routerPayloadLooksInitialLoad_(payload) {
    if (!(payload = payload || {}) || typeof payload != "object" || Array.isArray(payload))
        return !1;
    if (payload.initialLoad === !0 || payload.autoLoad === !0 || payload.pageLoad === !0 || payload.backgroundAuto === !0)
        return !0;
    var src = String(payload.source || payload.requestSource || payload.trigger || "").toLowerCase();
    return /initial|autoload|page-load|boot|dashboard-fast-first-paint|first-paint/.test(src);
}
function _routerApplyAiContracts_(registry) {
    registry = registry || {};
    var spec = _routerAiRouteContractSpec_(), byName = {};
    return (spec.methods || []).forEach(function (name) {
        byName[name] = !0;
    }), Object.keys(registry).forEach(function (method) {
        var meta = Object.assign({}, registry[method] || {}), group = String(meta.group || meta.domain || "").toLowerCase();
        (byName[method] || group === "ai") && (meta.aiRoute = !0, meta.aiOwner = spec.owner, meta.aiContractStamp = spec.stamp, meta.lazyOnly = !0, meta.advisoryOnly = !0, meta.noDataMutation = !0, meta.initialLoadAllowed = !1, meta.readOnly = !0, meta.requiresUserAction = !0, meta.owner = meta.owner || spec.owner, meta.deadlineMs = Number(meta.deadlineMs || 45e3), meta.cacheTtlSeconds = Number(meta.cacheTtlSeconds || 0), registry[method] = meta);
    }), registry;
}
function _routerAnnotateAiPayload_(method, payload, meta) {
    return (meta = meta || {}).aiRoute && payload && typeof payload == "object" && !Array.isArray(payload) && (payload.aiClientOwner = payload.aiClientOwner || "Code_22_AiGateway", payload.aiAdvisoryOnly = !0, payload.aiNoDataMutation = !0, payload.aiProductionMode = payload.aiProductionMode || "lazy-user-action-advisory-no-write", _routerPayloadLooksInitialLoad_(payload) && (payload.aiInitialLoadBlockedByRouter = !0)), payload;
}
function _routerAiLazyDeferredEnvelope_(method, meta, requestId, startedAt) {
    var latency = Date.now() - Number(startedAt || Date.now());
    return {
        ok: !0, data: {
            deferred: !0, aiDeferred: !0, feature: String(method || "ai"), reason: "AI_INITIAL_LOAD_BLOCKED_USE_USER_ACTION", aiProduction: {
                owner: String(meta && meta.aiOwner || meta && meta.owner || "Code_22_AiGateway"), stamp: AI_ROUTE_OWNER_VERSION, mode: "lazy-user-action-advisory-no-write", lazyOnly: !0, advisoryOnly: !0, noDataMutation: !0, initialLoadAllowed: !1, requiresUserAction: !0
            }
        }, msg: "เลื่อนการประมวลผล AI เป็น lazy load เพื่อไม่ให้กระทบการโหลดหน้าหลัก", error: "", requestId, latencyMs: latency, errorCode: "AI_INITIAL_LOAD_DEFERRED", method: String(method || ""), group: "ai"
    };
}
function _routerAttachAiResponseMeta_(normalized, method, meta) {
    if (!meta || meta.aiRoute !== !0 || !normalized || typeof normalized != "object")
        return normalized;
    var aiMeta = {
        owner: String(meta.aiOwner || meta.owner || "Code_22_AiGateway"), stamp: String(meta.aiContractStamp || AI_ROUTE_OWNER_VERSION), method: String(method || ""), mode: "lazy-user-action-advisory-no-write", lazyOnly: !0, advisoryOnly: !0, noDataMutation: !0, initialLoadAllowed: !1, requiresUserAction: !0, routeOwner: "Code_20_Router"
    };
    return normalized.aiProduction = aiMeta, normalized.data && typeof normalized.data == "object" && !Array.isArray(normalized.data) && (normalized.data.aiProduction = Object.assign({}, normalized.data.aiProduction || {}, aiMeta)), normalized;
}
function _routerReq_(p, r) {
    return p = p || {}, AppBackendMiddleware !== void 0 && AppBackendMiddleware && _appIsFn_(AppBackendMiddleware.run) ? (AppBackendMiddleware.run("router-direct-request", p, {
        minRole: r || "viewer"
    }), p) : (requireAuth_(p, r || "viewer"), p);
}
function _routerAdminRoutes_() {
    return _routerRoutesFrom_([
        [
            "apiAdminListUsers", "admin", "admin-users", "", "admin"
        ], [
            "apiAdminSaveUser|apiAdminDeleteUser", "admin", "admin-users", "wc", "admin"
        ], [
            "apiAdminListSubcommittees", "admin", "personnel", "", "people"
        ], [
            "apiAdminSaveSubcommittee|apiAdminDeleteSubcommittee", "admin", "personnel", "wc", "people"
        ], [
            "apiBudgetAdminListYearSettingsAll", "admin", "admin-budget", "", "budget"
        ], [
            "apiBudgetAdminSaveYearSettingsRows", "admin", "admin-budget", "wc", "budget"
        ]
    ]);
}
function _routerAiRoutes_() {
    return _routerRoutesFrom_([
        [
            "apiAiAssistantAsk|apiAiAssistantStartJob|apiAiAssistantGetJob|apiAiAssistantSummarizeCase|apiSuggestCaseStatus|apiSuggestCaseClassification|apiSemanticSearch|apiMeetingSmartSummary|apiDraftReplyLetter|apiExtractTrackingPdf|apiExtractDocumentPdf|apiGenerateExecutiveSummary|apiPredictOverdueRisk|apiPredictiveBudgeting|apiAnalyzePersonnelWorkload|apiAnalyzeWorkloadBottlenecks|apiRecommendWorkloadDistribution|apiCheckDuplicateCase|apiDetectBudgetAnomalies|apiGetDailyBriefing|apiGenerateBudgetTrendSummary|apiAiDashboardInsights|apiExtractMeetingAgendaPdf|apiChat", "viewer", "ai", "c", "ai"
        ]
    ]);
}
function _routerWriteBoundaryMode_(name, fn) {
    var src = "";
    try {
        src = typeof fn == "function" ? String(fn) : "";
    }
    catch (_e) {
        src = "";
    }
    return src.indexOf("writeGateway_(") > -1 ? "api-root-write-gateway" : /^(apiBudgetSaveImport|apiBudgetDeleteImport)$/.test(String(name || "")) ? "domain-root-write-gateway" : "";
}
function _routerBackendBoundaryContract_() {
    var registry = _appIsFnName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {}, handlers = _appIsFnName_("_apiRouteHandlers_") ? _apiRouteHandlers_(!0) : {}, readRoutes = [], writeRoutes = [], missingBoundary = [];
    return Object.keys(registry || {}).sort().forEach(function (name) {
        var meta = registry[name] || {}, mode = meta.write === !0 ? "write" : "read";
        if (mode === "write") {
            writeRoutes.push(name);
            var boundaryMode = _routerWriteBoundaryMode_(name, handlers[name]);
            boundaryMode || missingBoundary.push(name);
        }
        else
            readRoutes.push(name);
    }), {
        ok: missingBoundary.length === 0, stamp: "phase3-backend-read-write-boundary-current", owner: "Code_20_Router + Code_00_PlatformCore", routerRole: "route-context-authorize-dispatch-envelope", readOwner: "canonical domain read owner", writeOwner: "writeGateway_", domainWriteOwner: "domainWrite_", repositoryOwner: "AppRepository", readRouteCount: readRoutes.length, writeRouteCount: writeRoutes.length, writeRoutes, writeRoutesWithoutBoundary: missingBoundary, rules: {
            readRouteCannotEnterWriteGateway: !0, writeRouteRequiresOneRootGateway: !0, nestedDomainWriteJoinsRootGateway: !0, rootOnlyCacheInvalidation: !0, routerBusinessLogicForbidden: !0, uiDomChanged: !1, businessLogicChanged: !1, noNewFiles: !0
        }
    };
}
function _routerWriteGatewayContract_() {
    var phase3 = _appIsFnName_("_routerBackendBoundaryContract_") ? _routerBackendBoundaryContract_() : {
        ok: !1, writeRoutes: [], writeRoutesWithoutBoundary: []
    };
    return {
        ok: phase3.ok !== !1, stamp: "phase6-save-write-contract-current", owner: "Code_20_Router + writeGateway_", writeRouteCount: (phase3.writeRoutes || []).length, writeRoutes: phase3.writeRoutes || [], writeRoutesWithoutGateway: phase3.writeRoutesWithoutBoundary || [], routerCsrfRequired: !0, publicWriteAllowed: !1, backendBoundaryStamp: String(phase3.stamp || "phase3-backend-read-write-boundary-current"), domainWriteOwner: "domainWrite_", rootOnlyInvalidation: !0, uiDomChanged: !1, businessLogicChanged: !1
    };
}
var ROUTER_CONTRACT_FREEZE_STAMP = "contract-freeze-production-lock-current-r253";
function _routerCacheEntityForMethod_(method, meta) {
    return _appIsFnName_("_platformCacheEntityByMethod_") ? _platformCacheEntityByMethod_(method, meta) : _appIsFnName_("_platformRouterEntityNameForRoute_") ? _platformRouterEntityNameForRoute_(method, meta) : String(meta && (meta.domain || meta.group) || "general");
}
function _routerInvalidationForWriteMethod_(method, meta) {
    return _appIsFnName_("_platformWriteInvalidationByMethod_") ? _platformWriteInvalidationByMethod_(method) : [
        _routerCacheEntityForMethod_(method, meta)
    ];
}
function _routerFrontendRefreshByEntity_() {
    return _appIsFnName_("_platformFrontendRefreshByEntity_") ? _platformFrontendRefreshByEntity_() : {
        case: [
            "dashboard", "meeting", "reportTrack"
        ], tracking: [
            "dashboard", "reportTrack"
        ], letters: [
            "dashboard", "reportTrack"
        ], meeting: [
            "dashboard", "meeting"
        ], budget: [
            "dashboard", "budget"
        ], people: [
            "people"
        ], petitioner: [
            "petitioner", "dashboard"
        ], admin: [
            "admin"
        ], "admin-users": [
            "admin"
        ], dashboard: [
            "dashboard"
        ], general: [
            "active-page"
        ]
    };
}
function _routerContractFreezeStatus_(registry) {
    registry = registry || (_appIsFnName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {});
    var schema = _routerWriteSchemaByMethod_(), routes = Object.keys(registry || {}).sort(), schemaMethods = Object.keys(schema || {}).sort(), writeRoutes = [], issues = [], cacheEntityByMethod = {}, domainOwnerByMethod = {}, writeInvalidationByMethod = {}, frontendRefreshByEntity = _routerFrontendRefreshByEntity_();
    routes.forEach(function (method) {
        var meta = registry[method] || {}, entity = _routerCacheEntityForMethod_(method, meta), owner = String(meta.owner || _routerOwnerByGroup_(meta.group || meta.domain) || "");
        cacheEntityByMethod[method] = entity, domainOwnerByMethod[method] = owner;
        if (!owner)
            issues.push({
                code: "PHASEA_DOMAIN_OWNER_MISSING", method: method
            });
        if (!String(meta.group || meta.domain || "").trim())
            issues.push({
                code: "PHASEA_ROUTE_DOMAIN_MISSING", method: method
            });
        if (!String(meta.minRole || "").trim())
            issues.push({
                code: "PHASEA_MIN_ROLE_MISSING", method: method
            });
        if (!entity)
            issues.push({
                code: "PHASEA_CACHE_ENTITY_MISSING", method: method
            });
        if (meta.write === !0) {
            writeRoutes.push(method);
            if (meta.csrf !== !0)
                issues.push({
                    code: "PHASEA_WRITE_WITHOUT_CSRF", method: method
                });
            if (!schema[method])
                issues.push({
                    code: "PHASEA_WRITE_SCHEMA_MISSING", method: method
                });
            var invalidates = _routerInvalidationForWriteMethod_(method, meta) || [];
            writeInvalidationByMethod[method] = invalidates.slice ? invalidates.slice() : [];
            if (!invalidates.length)
                issues.push({
                    code: "PHASEA_WRITE_INVALIDATION_MISSING", method: method
                });
            invalidates.forEach(function (entityName) {
                if (!frontendRefreshByEntity[entityName])
                    issues.push({
                        code: "PHASEA_FRONTEND_REFRESH_MISSING", method: method, entity: entityName
                    });
            });
        }
    });
    schemaMethods.forEach(function (method) {
        !registry[method] && issues.push({
            code: "PHASEA_SCHEMA_WITHOUT_ROUTE", method: method
        });
    });
    [
        "case", "tracking", "letters", "meeting", "budget", "people", "petitioner", "admin", "admin-users", "dashboard"
    ].forEach(function (entity) {
        !frontendRefreshByEntity[entity] && issues.push({
            code: "PHASEA_ENTITY_REFRESH_CONTRACT_MISSING", entity: entity
        });
    });
    var platformCache = _appIsFnName_("_platformCacheContractStatus_") ? _platformCacheContractStatus_() : {
        ok: null
    };
    platformCache && platformCache.ok === !1 && issues.push({
        code: "PHASEA_PLATFORM_CACHE_CONTRACT_NOT_READY", details: platformCache.issues || []
    });
    return {
        ok: issues.length === 0, stamp: ROUTER_CONTRACT_FREEZE_STAMP, owner: "Code_20_Router.PhaseAContractFreeze", frozenContracts: [
            "API_ROUTE_REGISTRY", "WRITE_SCHEMA_BY_METHOD", "CACHE_ENTITY_BY_METHOD", "DOMAIN_OWNER_BY_METHOD", "FRONTEND_PAGE_REFRESH_BY_ENTITY"
        ], routeRegistryOwner: "Code_20_Router._apiRouteRegistry_", writeSchemaOwner: "Code_20_Router.WRITE_SCHEMA_BY_METHOD", cacheEntityOwner: "Code_00_PlatformCore.PhaseAContractFreeze", domainOwnerSource: "route.meta.owner", frontendRefreshOwner: "Code_00_PlatformCore.PhaseAContractFreeze", routeCount: routes.length, writeRouteCount: writeRoutes.length, writeSchemaCount: schemaMethods.length, cacheEntityCount: Object.keys(cacheEntityByMethod).length, domainOwnerCount: Object.keys(domainOwnerByMethod).length, writeInvalidationCount: Object.keys(writeInvalidationByMethod).length, cacheEntityByMethod: cacheEntityByMethod, domainOwnerByMethod: domainOwnerByMethod, writeInvalidationByMethod: writeInvalidationByMethod, frontendRefreshByEntity: frontendRefreshByEntity, platformCacheContract: platformCache, issues: issues, uiDomChanged: !1, businessLogicChanged: !1
    };
}
var ROUTER_WRITE_FLOW_STAMP_CURRENT = "router-write-flow-current-r253";
function _routerWriteContractForMethod_(method, meta) {
    method = String(method || "").trim(), meta = meta || {};
    var schemaWrite = _routerSchemaWriteMethod_(method), registryWrite = meta.write === !0, nameWrite = _routerNameLooksWrite_(method), legacyWrite = !(!_appIsFnName_("_isWriteApiMethod_") || !_isWriteApiMethod_(method)), transitionalCandidate = !schemaWrite && !registryWrite && (nameWrite || legacyWrite), isActionToken = method === "apiIssueActionToken", write = !isActionToken && (schemaWrite || registryWrite), source = schemaWrite ? "WRITE_SCHEMA_BY_METHOD" : registryWrite ? "API_ROUTE_REGISTRY" : "READ_ROUTE", entity = _routerCacheEntityForMethod_(method, meta), invalidates = write ? _routerInvalidationForWriteMethod_(method, meta) : [], refresh = _routerFrontendRefreshByEntity_(), missingRefresh = [];
    invalidates = Array.isArray(invalidates) ? invalidates : [], invalidates.forEach(function (entityName) {
        refresh && refresh[entityName] || missingRefresh.push(entityName);
    });
    return {
        ok: !write || !!entity && invalidates.length > 0 && missingRefresh.length === 0, stamp: ROUTER_WRITE_FLOW_STAMP_CURRENT, method: method, write: !!write, csrf: !!(meta.csrf === !0 || write || isActionToken), schemaWrite: !!schemaWrite, registryWrite: !!registryWrite, transitionalNameWrite: !1, transitionalCandidate: !!transitionalCandidate, transitionalFallbackDisabled: !!transitionalCandidate, source: source, entity: entity, invalidates: invalidates, missingRefresh: missingRefresh, minRole: String(meta.minRole || (write ? "staff" : "viewer")), actionTokenNonWrite: !!isActionToken, uiDomChanged: !1, businessLogicChanged: !1
    };
}

function _apiRouteContract_(options) {
    options = options || {};
    var registry = _appIsFnName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {}, handlers = _appIsFnName_("_apiRouteHandlers_") ? _apiRouteHandlers_(!0) : {}, routeNames = Object.keys(registry || {}).sort(), writeRouteNames = routeNames.filter(function (name) {
        var meta = registry[name] || {};
        return meta.write === !0;
    }), readRouteNames = routeNames.filter(function (name) {
        return writeRouteNames.indexOf(name) < 0;
    }), publicRouteNames = routeNames.filter(function (name) {
        return (registry[name] || {}).public === !0;
    }), csrfWriteRouteNames = writeRouteNames.filter(function (name) {
        return (registry[name] || {}).csrf === !0;
    }), missingHandlers = routeNames.filter(function (name) {
        return typeof handlers[name] != "function";
    }), writeRoutesWithoutCsrf = routeNames.filter(function (name) {
        var meta = registry[name] || {};
        return meta.write === !0 && meta.csrf !== !0;
    }), publicWriteRoutes = routeNames.filter(function (name) {
        var meta = registry[name] || {};
        return meta.write === !0 && meta.public === !0;
    }), routesWithoutMinRole = routeNames.filter(function (name) {
        var meta = registry[name] || {};
        return !String(meta.minRole || "").trim();
    }), maintenanceRoutes = routeNames.filter(function (name) {
        var meta = registry[name] || {};
        return String(meta.lifecycle || "active").toLowerCase() === "maintenance" || meta.maintenanceRequired === !0;
    }), unexpectedDirectEntrypoints = routeNames.filter(function (name) {
        var meta = registry[name] || {};
        return meta.directEntrypoint === !0 && ROUTER_DIRECT_ENTRYPOINTS.indexOf(name) < 0;
    }), routerOnlyRoutesUnlocked = routeNames.filter(function (name) {
        var meta = registry[name] || {};
        return ROUTER_DIRECT_ENTRYPOINTS.indexOf(name) < 0 && meta.routerLocked !== !0;
    }), routeIssues = [];
    missingHandlers.length && routeIssues.push({
        code: "MISSING_ROUTE_HANDLER", routes: missingHandlers
    }), writeRoutesWithoutCsrf.length && routeIssues.push({
        code: "WRITE_ROUTE_WITHOUT_CSRF", routes: writeRoutesWithoutCsrf
    }), publicWriteRoutes.length && routeIssues.push({
        code: "PUBLIC_WRITE_ROUTE", routes: publicWriteRoutes
    }), routesWithoutMinRole.length && routeIssues.push({
        code: "ROUTE_WITHOUT_MIN_ROLE", routes: routesWithoutMinRole
    }), maintenanceRoutes.length && routeIssues.push({
        code: "MAINTENANCE_ROUTE_SURFACE_NOT_ALLOWED", routes: maintenanceRoutes
    }), unexpectedDirectEntrypoints.length && routeIssues.push({
        code: "UNEXPECTED_DIRECT_ENTRYPOINT", routes: unexpectedDirectEntrypoints
    }), routerOnlyRoutesUnlocked.length && routeIssues.push({
        code: "ROUTER_ONLY_ROUTE_UNLOCKED", routes: routerOnlyRoutesUnlocked
    }), routeNames.length && readRouteNames.length + writeRouteNames.length !== routeNames.length && routeIssues.push({
        code: "ROUTE_CLASSIFICATION_COUNT_MISMATCH", routeCount: routeNames.length, readRouteCount: readRouteNames.length, writeRouteCount: writeRouteNames.length
    }), routeNames.length && !readRouteNames.length && routeIssues.push({
        code: "READ_ROUTE_COUNT_ZERO"
    }), routeNames.length && !writeRouteNames.length && routeIssues.push({
        code: "WRITE_ROUTE_COUNT_ZERO"
    });
    var compactRoutes = {};
    routeNames.forEach(function (name) {
        var m = registry[name] || {};
        compactRoutes[name] = {
            public: !!m.public, write: !!m.write, minRole: String(m.minRole || ""), csrf: !!m.csrf, group: String(m.group || ""), domain: String(m.domain || m.group || ""), serverPaged: !!m.serverPaged, serverFiltered: !!m.serverFiltered, maxLimit: Number(m.maxLimit || 0) || void 0, routeSource: String(m.routeSource || ""), lifecycle: String(m.lifecycle || "active"), status: String(m.status || m.lifecycle || "active"), maintenanceRequired: !!m.maintenanceRequired, owner: String(m.owner || ""), routeClass: String(m.routeClass || ""), routeTier: String(m.routeTier || ""), productionSurface: String(m.productionSurface || "active-production"), directEntrypoint: !!m.directEntrypoint, routerLocked: !!m.routerLocked, hotPath: !!m.hotPath, contractLocked: !!m.contractLocked, hotPathOwner: String(m.hotPathOwner || ""), cacheTtlSeconds: Number(m.cacheTtlSeconds || 0) || void 0, clientCacheTtlSeconds: Number(m.clientCacheTtlSeconds || 0) || void 0, cacheEntity: String(m.cacheEntity || ""), dataContractStamp: String(m.dataContractStamp || ""), deadlineMs: Number(m.deadlineMs || 0) || void 0, dtoContract: String(m.dtoContract || ""), aiRoute: !!m.aiRoute, lazyOnly: !!m.lazyOnly, advisoryOnly: !!m.advisoryOnly, noDataMutation: !!m.noDataMutation, requiresUserAction: !!m.requiresUserAction, initialLoadAllowed: m.initialLoadAllowed === !0, aiOwner: String(m.aiOwner || ""), accessMode: String(m.accessMode || (m.write === !0 ? "write" : "read")), readBoundaryOwner: String(m.readBoundaryOwner || ""), writeBoundaryOwner: String(m.writeBoundaryOwner || ""), domainWriteOwner: String(m.domainWriteOwner || ""), repositoryOwner: String(m.repositoryOwner || "AppRepository"), backendBoundaryStamp: String(m.backendBoundaryStamp || "phase3-backend-read-write-boundary-current")
        };
    });
    var activeRegistry = _appIsFnName_("_apiActiveRouteRegistry_") ? _apiActiveRouteRegistry_() : {};
    return {
        ok: routeIssues.length === 0, generatedAt: new Date().toISOString(), contractStamp: String(typeof globalThis != "undefined" && globalThis.ROUTER_CLEANUP_VERSION || "router-cleanup-current") + "-production-route-contract-current", canonicalEnvelope: {
            contractStamp: "router-envelope-current", okField: "ok", dataField: "data", messageField: "msg", errorField: "error"
        }, envelopeSpec: {
            contractStamp: "router-envelope-current"
        }, publicEntrypointPolicy: _routerDirectEntrypointPolicy_(),
        facadeContract: _appIsFnName_("_routerFacadeContract_") ? _routerFacadeContract_() : { ok: null },
        backendBoundary: _appIsFnName_("_routerBackendBoundaryContract_") ? _routerBackendBoundaryContract_() : { ok: null },
        writeContract: _appIsFnName_("_routerWriteGatewayContract_") ? _routerWriteGatewayContract_() : { ok: null },
        writeSchemaContract: _routerWriteSchemaContract_(),
        contractFreeze: _routerContractFreezeStatus_(registry),
        routeCount: routeNames.length, handlerCount: routeNames.length - missingHandlers.length, readRouteCount: readRouteNames.length, writeRouteCount: writeRouteNames.length, publicRouteCount: publicRouteNames.length, csrfWriteRouteCount: csrfWriteRouteNames.length, readRoutes: readRouteNames.slice(), writeRoutes: writeRouteNames.slice(), activeRouteCount: Object.keys(activeRegistry).length, maintenanceRouteCount: 0, routeLifecycleCounts: {
            active: Object.keys(activeRegistry).length, maintenance: 0, deprecated: 0, blocked: 0
        }, routeSourceDuplication: _appIsFnName_("_routerRouteSourceDuplicateReport_") ? _routerRouteSourceDuplicateReport_() : {
            duplicateCount: null
        }, routerSlimming: _appIsFnName_("_routerSlimmingStatus_") ? _routerSlimmingStatus_() : {
            ok: null
        }, cleanupVersion: String(typeof globalThis != "undefined" && globalThis.ROUTER_CLEANUP_VERSION || "router-cleanup-current"), routeClassification: {
            production: "active-production-only"
        }, routeSurfaceSnapshot: {
            ok: !0, activeProductionCount: Object.keys(activeRegistry).length, maintenanceGatedCount: 0, adminActiveCount: 0
        }, activeAllowedMethods: Object.keys(activeRegistry).sort(), productionAllowedMethods: Object.keys(activeRegistry).sort(), maintenanceAllowedMethods: [], hotPathContract: _appIsFnName_("_routerHotPathContractSpec_") ? _routerHotPathContractSpec_() : {
            methods: {}
        }, productionDtoContract: {
            ok: !0, owner: String(PRODUCTION_DTO_CONTRACT.owner || "Code_20_Router:ProductionDtoContract"), contractStamp: String(PRODUCTION_DTO_CONTRACT.contractStamp || "production-dto-contract-v2"), responseShape: PRODUCTION_DTO_CONTRACT.responseShape, routeContracts: PRODUCTION_DTO_CONTRACT.routeContracts
        }, routes: compactRoutes, allowedMethods: routeNames, missingHandlers, optionalMissingHandlers: [], writeRoutesWithoutCsrf, publicWriteRoutes, routesWithoutMinRole, unexpectedDirectEntrypoints, routerOnlyRoutesUnlocked, routerIssues: routeIssues, readinessIssues: [], securityOpsFinal: {
            productionStrictOnly: !0, diagnosticRoutesRemoved: !0, maintenanceRoutesRemoved: !0, strictActionTokens: !0
        }, performanceMonitoring: {
            privateGateOnly: !0, logSheet: "disabled-by-default", targets: {
                dashboard: 3e3, budgetSummary: 5e3, budgetTypeSummary: 8e3, people: 8e3, meeting: 8e3, tracking: 5e3, cases: 5e3
            }
        }, payloadSchemas: {
            apiGetTracking: {
                rows: "array", paging: "object", serverPaged: !0, serverFiltered: !0, maxLimit: 25, hotPath: !0, owner: "Code_30_Domain_Cases"
            }, apiBudgetGetSummary: {
                rows: "array", summary: "object", hotPath: !0, owner: "Code_32_Domain_Budget", source: "BudgetSummary/canonical-imports-merged-summary-current"
            }, apiBudgetGetTypeSummaryByFY: {
                rows: "array", fiscalYear: "string", materializedRequired: !1, readModelFirst: !1, detailRowsPreserved: !0, liveDirectRead: !0, serverPaged: !0, serverFiltered: !0, maxLimit: 200, hotPath: !0, owner: "C32/BudgetImports", sourceOfTruth: "BudgetImports", materializedSheet: "BudgetTypeSummary_R4", materializedSheetMode: "cache-report-only", dto: "budget-type-summary-budgetimports-direct-current"
            }, apiGetPeoplePageBundle: {
                bundle: "object", hotPath: !0, owner: "Code_33_Domain_People", fiscalYearMode: "date-overlap"
            }, apiSearchCasesLite: {
                rows: "array", canonicalReceiveField: "recNo", paging: "object", pagingContract: "case-search-page-envelope-v3", serverPaged: !0, serverFiltered: !0, maxLimit: 100, compactReadModel: !0, hotPath: !0, owner: "Code_20_Router + Code_30_Domain_Cases"
            }, apiGetCaseReportExportRows: {
                rows: "array", canonicalReceiveField: "recNo", serverPaged: !1, serverFiltered: !0, maxLimit: 5e3, includeMeetingHistory: !0, onDemandOnly: !0, initialLoadAllowed: !1, hotPath: !0, owner: "Code_20_Router + Code_30_Domain_Cases"
            }, apiGetDashboardBundle: {
                dashboardDto: "object", hotPath: !0, contractStamp: "dashboard-strict-kpi-committee-meeting-current", stats: "object", budget: "object", cacheKey: "string", meetingSource: "CommitteeMeetings.meetingNo", meetingItemSource: "CommitteeMeetingAgendaItems.title.nonblank-strict", archivedMeetingLogsDirectRead: !1
            }, apiMigrateCanonicalSchemas: {
                ok: "boolean", migrated: "boolean"
            }
        }
    };
}
function _routerCoreRouteTuples_() {
    return [
        [
            "apiLogin|apiSessionResume", "public", "auth", "p"
        ], [
            "apiLogout", "viewer", "auth", "p"
        ], [
            "apiSessionCheck", "public", "auth", "pr"
        ], [
            "getDeferredInclude", "viewer", "assets", ""
        ], [
            "apiBootstrap", "viewer", "bootstrap", ""
        ], [
            "apiGetRouteContract", "viewer", "bootstrap", ""
        ], [
            "apiGetPhase0ContractGate|apiGetPhase1Contract|apiGetPhase2Contract", "admin", "bootstrap", ""
        ], [
            "apiGetClientDataContract|apiGetAppTerminology", "viewer", "bootstrap", ""
        ], [
            "apiGetPhase5ReleaseReadiness", "admin", "bootstrap", ""
        ], [
            "apiIssueActionToken", "viewer", "auth", "c"
        ], [
            "apiSaveCase|apiDeleteCase", "staff", "cases", "wc"
        ], [
            "apiGetCaseQuickSummary|apiGetCaseReportOptions|apiGetCaseContext|apiGetCanonicalCaseBundle|apiGetPhase4QaGate", "viewer", "cases", ""
        ], [
            "apiSearchCasesLite", "viewer", "cases", "sf", "cases", 100
        ], [
            "apiGetCaseReportExportRows", "viewer", "cases", "f", "cases", 5e3
        ], [
            "apiGetPetitioners|apiGetPetitionerRelatedCounts", "viewer", "petitioners", ""
        ], [
            "apiSavePetitioner|apiDeletePetitioner", "staff", "petitioners", "wc"
        ], [
            "apiGetPersonnelComms|apiGetPersonnelOps|apiGetPersonnelStaffs|apiGetPersonnelSubcommittees|apiGetPersonnelDirectoryBundle|apiGetPeoplePageBundle|apiGetSalarySettings", "viewer", "personnel", ""
        ], [
            "apiSavePersonnelComm|apiSavePersonnelOp|apiSavePersonnelStaff|apiSavePersonnelSubcommittee|apiDeletePersonnelComm|apiDeletePersonnelOp|apiDeletePersonnelStaff|apiDeletePersonnelSubcommittee", "staff", "personnel", "wc", "people"
        ], [
            "apiGetMeetingLookupOptions|apiGetMeetingHistory|apiListCommitteeMeetings|apiGetCommitteeMeetingSystem|apiGetCommitteeMeetingSystemSpec|apiSearchMeetingAgendaCases|apiGetCommitteeMeetingPrintBundle", "viewer", "meeting", ""
        ], [
            "apiSaveCommitteeMeetingSystem|apiDeleteCommitteeMeetingSystem", "staff", "meeting", "wc"
        ], [
            "apiSaveSalarySettings", "admin", "personnel", "wc"
        ], [
            "apiSaveMeetingLog|apiDeleteMeetingLog", "staff", "meeting", "wc"
        ], [
            "apiGetLetters|apiGetAllLettersWithCaseInfo", "viewer", "letters", ""
        ], [
            "apiSaveLetter|apiDeleteLetter", "staff", "letters", "wc"
        ], [
            "apiAuditMeetingData|apiExportMeetingDuplicateAuditCsv", "admin", "meeting", ""
        ], [
            "apiCleanupMeetingData", "admin", "meeting", "wc"
        ], [
            "apiGetTracking", "viewer", "tracking", "sf", "", 25
        ], [
            "apiBudgetListByFY|apiBudgetGetSummary|apiBudgetGetFiscalYears|apiBudgetGetSubcommitteeOptions|apiBudgetGetImportForEdit", "viewer", "budget", ""
        ], [
            "apiBudgetGetTypeSummaryByFY", "viewer", "budget", "sf", "budget", 200
        ], [
            "apiBudgetSaveImport|apiBudgetDeleteImport", "staff", "budget", "wc"
        ], [
            "apiGetDashboardBundle", "viewer", "dashboard", ""
        ], [
            "apiGetThailandLocations|apiSearchLookup", "viewer", "lookups", ""
        ], [
            "apiSearch", "viewer", "search", ""
        ]
    ];
}
function _routerCoreRoutes_() {
    return _routerRoutesFrom_(_routerCoreRouteTuples_());
}
function _routerStrictActionTokensEnabled_() {
    return APP_PRODUCTION_POLICY_FLAGS_CURRENT.strictActionTokensEnabled;
}
function _routerIsHighRiskWriteMethod_(method, routeMeta) {
    if (routeMeta = routeMeta || {}, !(method = String(method || "").trim()))
        return !1;
    var group = String(routeMeta.group || routeMeta.domain || "").toLowerCase();
    return group === "admin-users" || group === "admin-budget" || group === "admin-diagnostics" || group === "admin-release" || group === "admin-go-live" || group === "admin-maintenance-final" || !!/^api(?:Admin)?(?:Delete|Revoke|Migrate|SystemRepair|BudgetProcessQueue|BudgetQueueImport|BudgetDeleteImport|Cleanup|RefreshMaterialized|BudgetAdminSave)/.test(method) || !(!/^apiAdmin/.test(method) || !routeMeta.csrf && !routeMeta.write);
}
function _routerSchemaWriteMethod_(method) {
    try {
        return !!(_appIsFnName_("_routerSchemaForMethod_") && _routerSchemaForMethod_(String(method || "").trim()));
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("router.schemaWrite.lookup", _e, {
            method: String(method || "")
        }), !1;
    }
}
function _routerNameLooksWrite_(method) {
    method = String(method || "").trim();
    return method !== "apiIssueActionToken" && /^api(?:Admin)?(?:Save|Delete|Cleanup|BudgetSave|BudgetDelete|BudgetAdminSave|SavePersonnel|DeletePersonnel)/.test(method);
}
function _routerIsWriteRoute_(method, routeMeta) {
    method = String(method || "").trim();
    var c = _routerWriteContractForMethod_(method, routeMeta || {});
    return !!(c && c.write);
}
function _routerRequiresCsrf_(method, routeMeta) {
    return !((routeMeta = routeMeta || {}).csrf !== !0 && !_routerIsWriteRoute_(method, routeMeta));
}
function _routerMinRoleForRoute_(method, routeMeta) {
    return routeMeta = routeMeta || {}, String(routeMeta.minRole || (_routerIsWriteRoute_(method, routeMeta) ? "staff" : "viewer"));
}
function _withApiRouterInvocationContext_(runner) {
    var prev = !1;
    try {
        prev = !!globalThis.__APP_API_ROUTER_CONTEXT__, globalThis.__APP_API_ROUTER_CONTEXT__ = !0;
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e);
    }
    try {
        return runner();
    }
    finally {
        try {
            globalThis.__APP_API_ROUTER_CONTEXT__ = prev;
        }
        catch (_e2) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e2);
        }
    }
}
function _expandRouteRegistry_(registry) {
    return registry = registry || {}, Object.keys(registry).forEach(function (name) {
        var meta = registry[name] || {};
        meta.domain || (meta.domain = String(meta.group || "general")), registry[name] = meta;
    }), registry;
}
function _newRequestId_() {
    return "req_" + Utilities.getUuid().replace(/-/g, "").substring(0, 16);
}
function _routerAnnotateSourceMap_(sourceName, map) {
    return sourceName = String(sourceName || "unknown"), map = map || {}, Object.keys(map).forEach(function (name) {
        var meta = Object.assign({}, map[name] || {});
        meta.routeSource = meta.routeSource || sourceName, meta.lifecycle = ROUTER_LIFECYCLE_ACTIVE, meta.status = ROUTER_LIFECYCLE_ACTIVE, meta.maintenanceRequired = !1, meta = _routerAnnotateRouteMeta_(name, meta), map[name] = meta;
    }), map;
}
function _routerRouteClass_(method, meta) {
    method = String(method || "").trim(), meta = meta || {};
    var minRole = String(meta.minRole || "viewer").toLowerCase(), group = String(meta.group || meta.domain || "general").toLowerCase();
    return meta.public === !0 ? group === "auth" ? "public-auth" : "public-read" : group === "ai" ? meta.write || meta.csrf ? "ai-action" : "ai-read" : minRole === "admin" ? meta.write ? "admin-write" : "admin-read" : meta.write ? "authenticated-write" : "authenticated-read";
}
function _routerRouteTier_(method, meta) {
    method = String(method || "").trim(), meta = meta || {};
    var group = String(meta.group || meta.domain || "general").toLowerCase();
    return meta.hotPath === !0 || /^(apiGetDashboardBundle|apiSearchCasesLite|apiGetPeoplePageBundle|apiBudgetGetSummary|apiBudgetGetTypeSummaryByFY|apiGetTracking)$/.test(method) ? "production-hot-path" : meta.public === !0 ? "public-entry" : String(meta.minRole || "").toLowerCase() === "admin" || group.indexOf("admin") === 0 ? "production-admin" : "production-standard";
}
function _routerAnnotateRouteMeta_(method, meta) {
    return (meta = Object.assign({}, meta || {})).routeClass = String(_routerRouteClass_(method, meta)), meta.routeTier = String(_routerRouteTier_(method, meta)), meta.productionSurface = "active-production", meta.routerReadinessLocked = !0, meta.accessMode = meta.write === !0 ? "write" : "read", meta.readBoundaryOwner = meta.write === !0 ? "" : String(meta.owner || _routerOwnerByGroup_(meta.domain || meta.group || "general")), meta.writeBoundaryOwner = meta.write === !0 ? "writeGateway_" : "", meta.domainWriteOwner = meta.write === !0 ? "domainWrite_" : "", meta.repositoryOwner = "AppRepository", meta.effectiveMinRole = _appIsFnName_("_permissionRequiredRoleForApi_") ? _permissionRequiredRoleForApi_(method, meta) : String(meta.minRole || "viewer"), meta.permissionMatrixStamp = typeof APP_PERMISSION_MATRIX != "undefined" ? APP_PERMISSION_MATRIX.stamp : "", meta.backendBoundaryStamp = "phase3-backend-read-write-boundary-current", meta;
}
function _mergeRouteMaps_(maps) {
    var merged = {}, duplicates = {};
    (maps || []).forEach(function (source, sourceIndex) {
        var sourceName = source && source.name ? String(source.name) : String(sourceIndex), map = source && source.map ? source.map : source;
        map = _routerAnnotateSourceMap_(sourceName, map || {}), Object.keys(map).forEach(function (name) {
            Object.prototype.hasOwnProperty.call(merged, name) && (duplicates[name] = (duplicates[name] || []).concat([
                sourceName
            ])), merged[name] = map[name];
        });
    });
    try {
        __APP_GLOBAL__.__APP_ROUTE_DUPLICATE_META__ = duplicates;
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _e) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
            error: String(_e && _e.message || _e)
        });
    }
    return merged;
}
var __API_ROUTE_SOURCE_MAPS_CACHE__ = null;
function _routerBuildRouteSourceMaps_() {
    return [
        {
            name: "core", map: _appIsFnName_("_routerCoreRoutes_") ? _routerCoreRoutes_() : {}
        }, {
            name: "admin", map: _appIsFnName_("_routerAdminRoutes_") ? _routerAdminRoutes_() : {}
        }, {
            name: "ai", map: _appIsFnName_("_routerAiRoutes_") ? _routerAiRoutes_() : {}
        }
    ];
}
function _routerCloneRouteSourceMaps_(maps) {
    return (maps || []).map(function (source) {
        return {
            name: String(source && source.name || ""), map: _routerCloneRegistry_(source && source.map ? source.map : {})
        };
    });
}
function _routerRouteSourceMaps_(refresh) {
    return _routerCloneRouteSourceMaps_(!refresh && __API_ROUTE_SOURCE_MAPS_CACHE__ ? __API_ROUTE_SOURCE_MAPS_CACHE__ : __API_ROUTE_SOURCE_MAPS_CACHE__ = _routerBuildRouteSourceMaps_());
}
function _routerRouteSourceDuplicateReport_() {
    var seen = {}, duplicates = [];
    return _routerRouteSourceMaps_().forEach(function (source) {
        Object.keys(source.map || {}).sort().forEach(function (route) {
            seen[route] || (seen[route] = []), seen[route].push(source.name);
        });
    }), Object.keys(seen).sort().forEach(function (route) {
        seen[route].length > 1 && duplicates.push({
            route, sources: seen[route]
        });
    }), {
        duplicateCount: duplicates.length, duplicates, sourceCounts: _routerRouteSourceMaps_().reduce(function (out, source) {
            return out[source.name] = Object.keys(source.map || {}).length, out;
        }, {})
    };
}
function _routerCanonicalFileOwners_() {
    return {
        router: "Code_20_Router", auth: "Code_10_Security_Auth", cases: "Code_30_Domain_Cases", meetings: "Code_30_Domain_Cases", budget: "Code_32_Domain_Budget", people: "Code_33_Domain_People", dashboard: "Code_20_Router", ai: "Code_22_AiGateway", admin: "Code_33_Domain_People", core: "Code_00_PlatformCore"
    };
}
function _routerOwnerLabel_() {
    var seen = {}, labels = [];
    Array.prototype.slice.call(arguments).filter(Boolean).forEach(function (name) {
        var label = String(name || "").trim();
        if (label && !seen[label]) {
            seen[label] = !0;
            labels.push(label);
        }
    });
    return labels.join(" + ");
}
function _routerOwnerByGroup_(group) {
    var owners = _routerCanonicalFileOwners_();
    return (group = String(group || "").toLowerCase()) === "auth" || group === "bootstrap" ? _routerOwnerLabel_(owners.auth, owners.router) : group === "admin-users" ? _routerOwnerLabel_(owners.admin, owners.router) : group === "cases" || group === "petitioners" || group === "search" ? _routerOwnerLabel_(owners.cases, owners.router) : group === "meeting" || group === "letters" || group === "tracking" ? _routerOwnerLabel_(owners.meetings, owners.router) : group === "budget" || group === "admin-budget" ? _routerOwnerLabel_(owners.budget, owners.router) : group === "personnel" ? _routerOwnerLabel_(owners.people, owners.router) : group === "dashboard" || group === "lookups" ? _routerOwnerLabel_(owners.dashboard, owners.router) : group === "ai" ? _routerOwnerLabel_(owners.ai, owners.router) : group.indexOf("admin") === 0 ? _routerOwnerLabel_(owners.admin, owners.router) : _routerOwnerLabel_(owners.router);
}
function _annotateRouteOwnership_(registry) {
    var map = registry && typeof registry == "object" ? registry : {};
    return Object.keys(map).forEach(function (method) {
        var meta = map[method] || {};
        meta.owner || (meta.owner = _routerOwnerByGroup_(meta.group || "")), meta = _routerAnnotateRouteMeta_(method, meta), meta.directEntrypoint = ROUTER_DIRECT_ENTRYPOINTS.indexOf(method) >= 0, meta.routerLocked = !meta.directEntrypoint, map[method] = meta;
    }), map;
}
var __API_ROUTE_REGISTRY_CACHE__ = null;
function _routerCloneMeta_(meta) {
    var out = {};
    return Object.keys(meta || {}).forEach(function (key) {
        out[key] = meta[key];
    }), out;
}
function _routerCloneRegistry_(registry) {
    var out = {};
    return Object.keys(registry || {}).forEach(function (name) {
        out[name] = _routerCloneMeta_(registry[name]);
    }), out;
}
function _apiRouteRegistry_(refresh) {
    if (refresh && (__API_ROUTE_SOURCE_MAPS_CACHE__ = null, __API_ROUTE_REGISTRY_CACHE__ = null, __API_ROUTE_HANDLERS_CACHE__ = null), !refresh && __API_ROUTE_REGISTRY_CACHE__)
        return _routerCloneRegistry_(__API_ROUTE_REGISTRY_CACHE__);
    var sourceMaps, registry = _expandRouteRegistry_(_mergeRouteMaps_(_routerRouteSourceMaps_(!!refresh)));
    return registry = _annotateRouteOwnership_(registry = _routerApplyDataContractCurrent_(registry = _routerApplyAiContracts_(registry = _routerApplyHotPathContracts_(registry)))), __API_ROUTE_REGISTRY_CACHE__ = _routerCloneRegistry_(registry), _routerCloneRegistry_(registry);
}
function _apiActiveRouteRegistry_() {
    var registry = _apiRouteRegistry_(), out = {};
    return Object.keys(registry || {}).forEach(function (name) {
        var meta = registry[name] || {};
        String(meta.lifecycle || "active") === "active" && (out[name] = meta);
    }), out;
}
function _routerNameSetFingerprint_(names) {
    var ordered = (Array.isArray(names) ? names : []).map(function (name) { return String(name || ""); }).sort(), serialized = JSON.stringify(ordered);
    return _appIsFnName_("_appSha256Hex_") ? _appSha256Hex_(serialized) : serialized;
}
function _routerFacadeContract_() {
    var registry = _appIsFnName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {}, handlers = _appIsFnName_("_apiRouteHandlers_") ? _apiRouteHandlers_() : {}, routeNames = Object.keys(registry || {}).sort(), handlerNames = Object.keys(handlers || {}).sort(), missingHandlers = routeNames.filter(function (name) {
        return typeof handlers[name] != "function";
    }), unexpectedHandlers = handlerNames.filter(function (name) {
        return !registry[name];
    }), nonFunctionHandlers = handlerNames.filter(function (name) {
        return typeof handlers[name] != "function";
    }), groupCounts = {}, ownerCounts = {}, writeCount = 0, readCount = 0, publicCount = 0, csrfWriteCount = 0, writeWithoutCsrf = [], publicWrites = [];
    routeNames.forEach(function (name) {
        var meta = registry[name] || {}, group = String(meta.domain || meta.group || "general"), owner = String(meta.owner || _routerOwnerByGroup_(group) || "Code_20_Router");
        groupCounts[group] = (groupCounts[group] || 0) + 1;
        ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
        if (meta.write === !0) {
            writeCount += 1;
            if (meta.csrf === !0)
                csrfWriteCount += 1;
            else
                writeWithoutCsrf.push(name);
        }
        else
            readCount += 1;
        if (meta.public === !0) {
            publicCount += 1;
            meta.write === !0 && publicWrites.push(name);
        }
    });
    var routeNamesFingerprint = _routerNameSetFingerprint_(routeNames), handlerNamesFingerprint = _routerNameSetFingerprint_(handlerNames), exactSetParity = missingHandlers.length === 0 && unexpectedHandlers.length === 0 && nonFunctionHandlers.length === 0 && routeNamesFingerprint === handlerNamesFingerprint;
    return {
        ok: exactSetParity && writeWithoutCsrf.length === 0 && publicWrites.length === 0,
        stamp: ROUTER_FACADE_STAMP_CURRENT,
        owner: "Code_20_Router",
        role: "facade-dispatch-envelope-contract-only",
        uiDomChanged: !1,
        businessLogicChanged: !1,
        routeCount: routeNames.length,
        handlerCount: handlerNames.length,
        readRouteCount: readCount,
        writeRouteCount: writeCount,
        csrfWriteRouteCount: csrfWriteCount,
        publicRouteCount: publicCount,
        exactSetParity: exactSetParity,
        routeNamesFingerprint: routeNamesFingerprint,
        handlerNamesFingerprint: handlerNamesFingerprint,
        missingHandlers: missingHandlers,
        unexpectedHandlers: unexpectedHandlers,
        nonFunctionHandlers: nonFunctionHandlers,
        writeWithoutCsrf: writeWithoutCsrf,
        publicWrites: publicWrites,
        groupCounts: groupCounts,
        ownerCounts: ownerCounts,
        strictResolver: "registered-route-handler-only",
        dynamicFallbackDisabled: !0,
        domainExecutionPolicy: "router invokes canonical api* facade only; domain logic remains in owner files",
        forbidden: [
            "BUSINESS_LOGIC_IN_ROUTER", "PUBLIC_WRITE_ROUTE", "WRITE_WITHOUT_CSRF", "DYNAMIC_UNREGISTERED_METHOD_CALL"
        ],
        generatedAt: new Date().toISOString()
    };
}
function _routerSlimmingStatus_() {
    var duplicateReport = _routerRouteSourceDuplicateReport_(), registry = _apiRouteRegistry_(), active = _apiActiveRouteRegistry_(), facade = _appIsFnName_("_routerFacadeContract_") ? _routerFacadeContract_() : {
        ok: null
    };
    return {
        ok: duplicateReport.duplicateCount === 0 && facade.ok !== !1, stage: "router-facade-production-surface", stamp: ROUTER_CLEANUP_STAMP, facadeStamp: ROUTER_FACADE_STAMP_CURRENT, routeCount: Object.keys(registry).length, activeRouteCount: Object.keys(active).length, maintenanceRouteCount: 0, sourceCounts: duplicateReport.sourceCounts || {}, duplicateCount: duplicateReport.duplicateCount, activeProductionCount: Object.keys(active).length, maintenanceGatedCount: 0, cachedSourceMaps: !!__API_ROUTE_SOURCE_MAPS_CACHE__, cachedRegistry: !!__API_ROUTE_REGISTRY_CACHE__, cachedHandlers: !!__API_ROUTE_HANDLERS_CACHE__, productionSurface: "active production API only; route metadata and contract owned by Code_20", ownerSeparation: "Code_20 owns registry/permission/dispatch/envelope only; audit/perf/cache telemetry delegated to Code_00_PlatformCore; domain handlers stay in canonical owner files", routeContractOwner: "C20", facadeContract: facade, pipelineOwner: "RouterPipeline", pipelineStamp: RouterPipeline !== void 0 && RouterPipeline && RouterPipeline.STAMP || ROUTER_CORE_CONTRACT_STAMP, generatedAt: new Date().toISOString()
    };
}
function _apiRouteMeta_(method) {
    return _apiRouteRegistry_()[String(method || "")] || null;
}
var __API_ROUTE_HANDLERS_CACHE__ = null;
function _resolveGlobalFunctionDirect_(name) {
    if (!(name = String(name || "").trim()))
        return null;
    try {
        var registry = typeof __APP_ROUTE_HANDLER_MAP__ != "undefined" && __APP_ROUTE_HANDLER_MAP__ ? __APP_ROUTE_HANDLER_MAP__ : null;
        if (registry && typeof registry[name] == "function")
            return registry[name];
    }
    catch (_registryErr) {
        _logWarn_("router.resolveGlobal.registry", {
            name, error: String(_registryErr && _registryErr.message || _registryErr)
        });
    }
    try {
        if (__APP_GLOBAL__ !== void 0 && __APP_GLOBAL__ && typeof __APP_GLOBAL__[name] == "function")
            return __APP_GLOBAL__[name];
    }
    catch (_appGlobalErr) {
        _logWarn_("router.resolveGlobal.appGlobal", {
            name, error: String(_appGlobalErr && _appGlobalErr.message || _appGlobalErr)
        });
    }
    try {
        if (typeof globalThis != "undefined" && typeof globalThis[name] == "function")
            return globalThis[name];
    }
    catch (_globalErr) {
        _logWarn_("router.resolveGlobal.globalThis", {
            name, error: String(_globalErr && _globalErr.message || _globalErr)
        });
    }
    try {
        var scope = this;
        if (this && typeof this[name] == "function")
            return this[name];
    }
    catch (_scopeErr) {
        _logWarn_("router.resolveGlobal.scope", {
            name, error: String(_scopeErr && _scopeErr.message || _scopeErr)
        });
    }
    return null;
}
function _routerBuildFacadeHandlerMap_(refresh) {
    var map = {}, registry = _apiRouteRegistry_(!!refresh);
    return Object.keys(registry || {}).forEach(function (name) {
        var fn = _resolveGlobalFunctionDirect_(name);
        typeof fn == "function" && (map[name] = fn);
    }), map;
}
function _buildApiRouteHandlers_() {
    return _routerBuildFacadeHandlerMap_(!1);
}
function _apiRouteHandlers_(refresh) {
    return !refresh && __API_ROUTE_HANDLERS_CACHE__ || (__API_ROUTE_HANDLERS_CACHE__ = _buildApiRouteHandlers_()), __API_ROUTE_HANDLERS_CACHE__;
}
function apiGetRouteContract(payload) {
    return payload = payload || {}, ok_(_apiRouteContract_({
        compact: !0
    }), "โหลด API route contract สำเร็จ");
}
function _routerEntityNameForRoute_(method, meta) {
    return _appIsFnName_("_platformRouterEntityNameForRoute_") ? _platformRouterEntityNameForRoute_(method, meta) : String(meta && (meta.group || meta.domain) || "general");
}
function _routerCacheTelemetryForRoute_(method, meta) {
    return _appIsFnName_("_platformRouterCacheTelemetryForRoute_") ? _platformRouterCacheTelemetryForRoute_(method, meta) : {
        entity: _routerEntityNameForRoute_(method, meta), entityStamp: "", cacheInvalidated: !(!meta || !meta.write), method: String(method || ""), generatedAt: new Date().toISOString(), owner: "Code_20_Router.facade-delegate"
    };
}
function _apiRouterResolveFunction_(method) {
    if (method = String(method || "").trim(), !method || !_apiRouteMeta_(method))
        return null;
    var handlers = _apiRouteHandlers_(), fn = handlers[method];
    return fn || (fn = _apiRouteHandlers_(!0)[method]), typeof fn == "function" ? fn : null;
}
function _normalizeRouterRequest_(request) {
    return request = request || {}, {
        method: String(request.method || "").trim(), payload: request.payload === void 0 ? {} : request.payload
    };
}
function _enforceRoutePayloadPolicy_(method, payload, meta) {
    if (!(meta = meta || {}))
        throw new Error("ไม่พบ route contract");
    if (meta.write === !0 && meta.csrf !== !0)
        throw new Error("write route ต้องเปิด CSRF contract");
    if (meta.public === !0 && meta.write === !0)
        throw new Error("public write route ไม่ได้รับอนุญาต");
    var lim;
    return payload && typeof payload == "object" && !Array.isArray(payload) && meta.maxLimit && (Number(payload.limit || payload.pageSize || 0) || 0) > Number(meta.maxLimit || 0) && (payload.limit = Number(meta.maxLimit || 0), payload.pageSize = Number(meta.maxLimit || 0)), AppBackendMiddleware !== void 0 && AppBackendMiddleware && _appIsFn_(AppBackendMiddleware.validateDto) ? AppBackendMiddleware.validateDto({
        method, payload, meta
    }) : _appIsFnName_("_assertApiPayloadEnvelopeSafe_") && _assertApiPayloadEnvelopeSafe_(method, payload, "apiRouter"), !0;
}
function _routerEffectiveWriteMeta_(method, meta) {
    method = String(method || "").trim(), meta = meta || {};
    var out = {};
    Object.keys(meta || {}).forEach(function (key) {
        out[key] = meta[key];
    });
    out.domain = String(out.domain || out.group || "");
    var contract = _routerWriteContractForMethod_(method, out);
    return contract.actionTokenNonWrite ? (out.write = !1, out.csrf = !0, out.productionActionTokenNonWrite = !0, out.productionContractStamp = "router-production-contract-p2-2026-07-25-r178") : contract.write && (out.write = !0, out.csrf = !0, out.writeContractSource = contract.source, out.productionContractStamp = "router-production-contract-p2-2026-07-25-r178", out.productionWriteOwner = "writeGateway_", out.minRole = String(out.minRole || contract.minRole || "staff")), out;
}
function _resolveRouteMeta_(method) {
    var meta = _apiRouteMeta_(method);
    return meta ? _routerEffectiveWriteMeta_(method, meta) : null;
}
function _enforceProductionAdminMaintenanceGate_(method, meta) {
    var group = String(meta && (meta.group || meta.domain || "") || "").toLowerCase(), maintenanceRequired = !(!meta || meta.maintenanceRequired !== !0);
    return group === "admin-diagnostics" || group === "admin-release" || group === "admin-go-live" || maintenanceRequired ? err_("เครื่องมือวินิจฉัย/Release ถูกถอดออกจาก production route surface แล้ว", {
        method: String(method || ""), group, code: "ADMIN_MAINTENANCE_ROUTES_REMOVED_CURRENT"
    }) : null;
}
function _enforceCanonicalRoutePolicy_(method, meta) {
    if (method = String(method || "").trim(), !meta)
        return err_("ไม่อนุญาตให้เรียก API method: " + method, null);
    var status = String(meta.status || "").trim().toLowerCase(), publicBridgeTarget = String(meta.publicBridgeTarget || "").trim(), routePolicy = _appIsFnName_("_canonicalRoutePolicy_") ? String(_canonicalRoutePolicy_() || "") : "", isBlockedPublicBridge;
    if (status === "blocked" || publicBridgeTarget && String(meta.domain || "").trim().toLowerCase() === "publicBridge") {
        var errorCode = "API_ROUTE_RETIRED";
        try {
            logAudit_("api.router.blocked.archived", { method, publicBridgeTarget, routePolicy: routePolicy || "canonical-only", errorCode: errorCode });
        }
        catch (_cutoverAuditErr) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _cutoverAuditErr);
        }
        var msg = "ปิดการเรียก API method เดิม: " + method;
        return publicBridgeTarget && (msg += " ให้ใช้ " + publicBridgeTarget), routePolicy && (msg += " (" + routePolicy + ")"), err_(msg, {
            errorCode: errorCode, method, publicBridgeTarget: publicBridgeTarget || "", canonicalMethod: publicBridgeTarget || "", routePolicy: routePolicy || ""
        });
    }
    return null;
}
function _normalizeRouterResponse_(result, method) {
    var normalized = normalizeResult_(result, "", "คำขอไม่สำเร็จ");
    return normalized && typeof normalized == "object" ? normalized : {
        ok: !0, data: normalized, msg: "", error: "", meta: {
            contractOwner: "Code_20_Router._normalizeRouterResponse_"
        }
    };
}
function _apiRouterFailureEnvelope_(method, routeMeta, requestId, startedAt, error, extra) {
    try {
        typeof logAudit_ == "function" && logAudit_("api.router.failure", {
            method, requestId, group: String(routeMeta && (routeMeta.group || routeMeta.domain) || "general"), error: String(error && error.message || error || "").slice(0, 240)
        });
    }
    catch (_e) {
        _appIgnore_(_e, "c6.C20:846");
    }
    return AppBackendMiddleware.errorEnvelope(method, routeMeta || {}, requestId, startedAt, error, extra || {});
}
function _shouldRequireStrictWriteActionToken_(method, routeMeta, payload) {
    return routeMeta = routeMeta || {}, payload = payload || {}, !(!(method = String(method || "").trim()) || method === "apiIssueActionToken") && !!_routerRequiresCsrf_(method, routeMeta) && !!_routerStrictActionTokensEnabled_() && _routerIsHighRiskWriteMethod_(method, routeMeta);
}
function _routerEnvelopeStamp_() {
    return _routerWriteSchemaStamp_();
}
function _routerWriteSchemaStamp_() {
    return "phaseK-write-schema-unification-2026-07-02-r1";
}
function _routerText_(value) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
}
function _routerGet_(obj, paths) {
    obj = obj || {};
    for (var i = 0; i < (paths || []).length; i++) {
        for (var cur = obj, parts = String(paths[i] || "").split("."), ok = !0, j = 0; j < parts.length; j++) {
            if (!cur || typeof cur != "object" || Array.isArray(cur) || !Object.prototype.hasOwnProperty.call(cur, parts[j])) {
                ok = !1;
                break;
            }
            cur = cur[parts[j]];
        }
        if (ok && _routerText_(cur))
            return _routerText_(cur);
    }
    return "";
}
function _routerFieldError_(code, message, fields) {
    return {
        ok: !1, errorCode: String(code || "WRITE_PREFLIGHT_FAILED"), message: String(message || "ข้อมูลสำหรับบันทึกไม่ครบถ้วน"), fields: fields || [], stamp: _routerEnvelopeStamp_()
    };
}
function _routerWriteSchemaByMethod_() {
    var schema = {
        apiSaveCase: {
            required: [
                {
                    code: "VALIDATION_MISSING_CASE_TITLE", message: "กรุณากรอกชื่อเรื่องก่อนบันทึก", fields: [
                        "title", "caseTitle", "subject"
                    ], paths: [
                        "case.title", "case.caseTitle", "case.subject", "title", "caseTitle", "subject"
                    ]
                }
            ]
        }, apiDeleteCase: {
            required: [
                {
                    code: "VALIDATION_MISSING_CASE_ID", message: "ไม่พบรหัสเรื่องที่จะลบ", fields: [
                        "caseId"
                    ], paths: [
                        "caseId", "id", "case.caseId", "case.id"
                    ]
                }
            ]
        }, apiSavePetitioner: {
            required: []
        }, apiDeletePetitioner: {
            required: [
                {
                    code: "VALIDATION_MISSING_PETITIONER_ID", message: "ไม่พบรหัสผู้ร้องเรียนที่จะลบ", fields: [
                        "petId", "id"
                    ], paths: [
                        "petId", "id", "petitionerId", "row.petId", "row.id"
                    ]
                }
            ]
        }, apiSavePersonnelComm: {
            required: []
        }, apiSavePersonnelOp: {
            required: []
        }, apiSavePersonnelStaff: {
            required: []
        }, apiSavePersonnelSubcommittee: {
            required: []
        }, apiDeletePersonnelComm: {
            required: [
                {
                    code: "VALIDATION_MISSING_PERSONNEL_ID", message: "ไม่พบรหัสข้อมูลบุคลากรที่จะลบ", fields: [
                        "id", "personnelId", "commId"
                    ], paths: [
                        "id", "personnelId", "commId", "row.id", "row.personnelId", "row.commId"
                    ]
                }
            ]
        }, apiDeletePersonnelOp: {
            required: [
                {
                    code: "VALIDATION_MISSING_PERSONNEL_ID", message: "ไม่พบรหัสข้อมูลบุคลากรที่จะลบ", fields: [
                        "id", "personnelId", "opId"
                    ], paths: [
                        "id", "personnelId", "opId", "row.id", "row.personnelId", "row.opId"
                    ]
                }
            ]
        }, apiDeletePersonnelStaff: {
            required: [
                {
                    code: "VALIDATION_MISSING_PERSONNEL_ID", message: "ไม่พบรหัสข้อมูลบุคลากรที่จะลบ", fields: [
                        "id", "personnelId", "staffId"
                    ], paths: [
                        "id", "personnelId", "staffId", "row.id", "row.personnelId", "row.staffId"
                    ]
                }
            ]
        }, apiDeletePersonnelSubcommittee: {
            required: [
                {
                    code: "VALIDATION_MISSING_PERSONNEL_ID", message: "ไม่พบรหัสข้อมูลบุคลากรที่จะลบ", fields: [
                        "id", "personnelId", "subcommitteeId"
                    ], paths: [
                        "id", "personnelId", "subcommitteeId", "row.id", "row.personnelId", "row.subcommitteeId"
                    ]
                }
            ]
        }, apiSaveCommitteeMeetingSystem: {
            required: [
                {
                    code: "VALIDATION_MISSING_MEETING_NO", message: "กรุณาระบุการประชุมครั้งที่ก่อนบันทึก", fields: [
                        "meetingNo", "round"
                    ], paths: [
                        "meeting.meetingNo", "meeting.round", "meeting.no", "meetingNo", "round", "no"
                    ]
                }, {
                    code: "VALIDATION_MISSING_MEETING_DATE", message: "กรุณาระบุวันเดือนปีการประชุมก่อนบันทึก", fields: [
                        "meetingDate", "date"
                    ], paths: [
                        "meeting.meetingDate", "meeting.date", "meetingDate", "date"
                    ]
                }
            ]
        }, apiDeleteCommitteeMeetingSystem: {
            required: [
                {
                    code: "VALIDATION_MISSING_MEETING_ID", message: "ไม่พบรหัสการประชุมที่จะลบ", fields: [
                        "meetingId"
                    ], paths: [
                        "meetingId", "id", "meeting.meetingId", "meeting.id"
                    ]
                }
            ]
        }, apiSaveSalarySettings: {
            required: []
        }, apiSaveMeetingLog: {
            required: [
                {
                    code: "VALIDATION_MISSING_CASE_SEQUENCE", message: "ไม่พบลำดับเรื่องสำหรับบันทึกประวัติการประชุม", fields: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"
                    ], paths: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง", "caseIdentity.caseNum", "caseIdentity.caseNo", "caseIdentity.runningNo", "caseIdentity.ลำดับเรื่อง", "log.caseNum", "log.caseNo", "log.runningNo", "log.ลำดับเรื่อง", "row.caseNum", "row.caseNo", "row.runningNo", "row.ลำดับเรื่อง"
                    ]
                }, {
                    code: "VALIDATION_MISSING_MEETING_HISTORY_DETAIL", message: "กรุณากรอกข้อมูลประวัติการประชุม", fields: [
                        "round", "meetingNo", "date", "meetingDate", "note", "result", "summary"
                    ], paths: [
                        "round", "meetingRound", "meetingNo", "date", "meetingDate", "note", "result", "summary", "log.round", "log.meetingNo", "log.date", "log.meetingDate", "log.note", "log.result", "log.summary", "row.round", "row.meetingNo", "row.date", "row.meetingDate", "row.note", "row.result", "row.summary"
                    ]
                }
            ]
        }, apiDeleteMeetingLog: {
            required: [
                {
                    code: "VALIDATION_MISSING_MEETING_LOG_ID", message: "ไม่พบรหัสประวัติการประชุมที่จะลบ", fields: [
                        "id", "logId"
                    ], paths: [
                        "id", "logId", "meetingLogId", "row.id", "log.id"
                    ]
                }, {
                    code: "VALIDATION_MISSING_CASE_SEQUENCE", message: "ไม่พบลำดับเรื่องสำหรับลบประวัติการประชุม", fields: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"
                    ], paths: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง", "caseIdentity.caseNum", "caseIdentity.caseNo", "caseIdentity.runningNo", "caseIdentity.ลำดับเรื่อง", "log.caseNum", "log.caseNo", "log.runningNo", "log.ลำดับเรื่อง", "row.caseNum", "row.caseNo", "row.runningNo", "row.ลำดับเรื่อง"
                    ]
                }
            ]
        }, apiSaveLetter: {
            required: [
                {
                    code: "VALIDATION_MISSING_CASE_SEQUENCE", message: "ไม่พบลำดับเรื่องสำหรับบันทึกหนังสือติดตาม", fields: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"
                    ], paths: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง", "caseIdentity.caseNum", "caseIdentity.caseNo", "caseIdentity.runningNo", "caseIdentity.ลำดับเรื่อง", "letter.caseNum", "letter.caseNo", "letter.runningNo", "letter.ลำดับเรื่อง", "row.caseNum", "row.caseNo", "row.runningNo", "row.ลำดับเรื่อง"
                    ]
                }
            ]
        }, apiDeleteLetter: {
            required: [
                {
                    code: "VALIDATION_MISSING_LETTER_ID", message: "ไม่พบรหัสหนังสือที่จะลบ", fields: [
                        "letterId", "id"
                    ], paths: [
                        "letterId", "id", "letter.id", "row.id"
                    ]
                }, {
                    code: "VALIDATION_MISSING_CASE_SEQUENCE", message: "ไม่พบลำดับเรื่องสำหรับลบหนังสือติดตาม", fields: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"
                    ], paths: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง", "caseIdentity.caseNum", "caseIdentity.caseNo", "caseIdentity.runningNo", "caseIdentity.ลำดับเรื่อง", "letter.caseNum", "letter.caseNo", "letter.runningNo", "letter.ลำดับเรื่อง", "row.caseNum", "row.caseNo", "row.runningNo", "row.ลำดับเรื่อง"
                    ]
                }
            ]
        }, apiCleanupMeetingData: {
            required: []
        }, apiBudgetSaveImport: {
            required: []
        }, apiBudgetDeleteImport: {
            required: [
                {
                    code: "VALIDATION_MISSING_BUDGET_IMPORT_ID", message: "ไม่พบรหัสรายการงบประมาณที่จะลบ", fields: [
                        "id", "importId", "recordId"
                    ], paths: [
                        "id", "importId", "recordId", "budgetId", "row.id", "record.id"
                    ]
                }
            ]
        }, apiAdminSaveUser: {
            required: []
        }, apiAdminDeleteUser: {
            required: [
                {
                    code: "VALIDATION_MISSING_ADMIN_USER_ID", message: "ไม่พบรหัสหรือชื่อผู้ใช้งานที่จะลบ", fields: [
                        "username", "id"
                    ], paths: [
                        "username", "oldUsername", "id", "user.username", "user.id"
                    ]
                }
            ]
        }, apiAdminSaveSubcommittee: {
            required: [
                {
                    code: "VALIDATION_MISSING_SUBCOMMITTEE_NAME", message: "กรุณาระบุชื่อคณะอนุกรรมาธิการ", fields: [
                        "name"
                    ], paths: [
                        "name", "subcommittee.name", "row.name"
                    ]
                }
            ]
        }, apiAdminDeleteSubcommittee: {
            required: [
                {
                    code: "VALIDATION_MISSING_SUBCOMMITTEE_ID", message: "ไม่พบรหัสคณะอนุกรรมาธิการที่จะลบ", fields: [
                        "id", "subcommitteeId"
                    ], paths: [
                        "id", "subcommitteeId", "subcommittee.id", "row.id"
                    ]
                }
            ]
        }, apiBudgetAdminSaveYearSettingsRows: {
            required: [
                {
                    code: "VALIDATION_MISSING_FISCAL_YEAR", message: "กรุณาระบุปีงบประมาณ", fields: [
                        "fy"
                    ], paths: [
                        "fy", "fiscalYear", "budgetYear", "year"
                    ]
                }
            ]
        }
    };
    return Object.keys(schema).forEach(function (method) {
        schema[method].method = method, schema[method].owner = "Code_20_Router.WRITE_SCHEMA_BY_METHOD", schema[method].stamp = _routerWriteSchemaStamp_(), schema[method].required = schema[method].required || [];
    }), schema;
}
function _routerSchemaForMethod_(method) {
    var schema = _routerWriteSchemaByMethod_();
    return schema[String(method || "").trim()] || null;
}
function _routerValidateRequiredFields_(method, payload) {
    var schema = _routerSchemaForMethod_(method);
    if (!schema)
        return null;
    for (var required = schema.required || [], i = 0; i < required.length; i++) {
        var spec = required[i] || {};
        if (!_routerGet_(payload, spec.paths || spec.fields || []))
            return _routerFieldError_(spec.code, spec.message, spec.fields || spec.paths || []);
    }
    return null;
}
function _routerWriteSchemaContract_() {
    var schema = _routerWriteSchemaByMethod_(), out = {};
    return Object.keys(schema).sort().forEach(function (method) {
        var item = schema[method] || {};
        out[method] = {
            method, required: (item.required || []).map(function (spec) {
                return {
                    code: spec.code, message: spec.message, fields: spec.fields || [], paths: spec.paths || []
                };
            }), owner: item.owner, stamp: item.stamp
        };
    }), {
        ok: !0, stamp: _routerWriteSchemaStamp_(), owner: "Code_20_Router.WRITE_SCHEMA_BY_METHOD", schemaCount: Object.keys(out).length, methods: Object.keys(out).sort(), schemas: out
    };
}
function _routerRequiredFields_(method, payload) {
    return payload = payload || {}, _routerValidateRequiredFields_(method, payload);
}
function _routerClassifyError_(method, routeMeta, error, fallbackCode) {
    var raw = String(error && (error.message || error.error || error.msg) || error || ""), text = raw.replace(/^Error:\s*/i, "").trim(), upper = ((error && (error.errorCode || error.code) || "") + " " + text).toUpperCase(), code = String(fallbackCode || error && (error.errorCode || error.code) || "API_ROUTE_EXCEPTION"), message = text || "คำขอไม่สำเร็จ";
    return /PERMISSION_DENIED|สิทธิ|ไม่ได้รับอนุญาต/.test(upper) ? (code = "PERMISSION_DENIED", message = "สิทธิผู้ใช้งานไม่เพียงพอสำหรับการบันทึกข้อมูล") : /AUTH_REQUIRED|MISSING_TOKEN|TOKEN_EXPIRED|SESSION|เซสชัน|เข้าสู่ระบบ|ไม่พบ\s*TOKEN/i.test(upper) ? (code = "AUTH_REQUIRED", message = "เซสชันหมดอายุหรือยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่") : /CSRF ACTION TOKEN/.test(upper) || /ACTION TOKEN/.test(upper) ? (code = "CSRF_ACTION_TOKEN_INVALID", message = "รหัสยืนยันการบันทึกหมดอายุ กรุณาบันทึกใหม่อีกครั้ง") : /CSRF/.test(upper) ? (code = "CSRF_TOKEN_INVALID", message = "รหัสยืนยันความปลอดภัยหมดอายุ กรุณาโหลด/เข้าสู่ระบบใหม่แล้วบันทึกอีกครั้ง") : /WRITE_ROUTE_ROOT_GATEWAY_REQUIRED|ROUTER_WRITE_BOUNDARY_REQUIRED/.test(upper) ? (code = "WRITE_GATEWAY_REQUIRED", message = "เส้นทางบันทึกข้อมูลไม่ผ่าน write gateway กลาง") : /VALIDATION_MISSING_CASE_TITLE|กรุณากรอกชื่อเรื่อง/.test(upper) ? (code = "VALIDATION_MISSING_CASE_TITLE", message = "กรุณากรอกชื่อเรื่องก่อนบันทึก") : /VALIDATION_MISSING_MEETING_NO|กรุณาระบุการประชุมครั้งที่/.test(upper) ? (code = "VALIDATION_MISSING_MEETING_NO", message = "กรุณาระบุการประชุมครั้งที่ก่อนบันทึก") : /VALIDATION_MISSING_MEETING_DATE|กรุณาระบุวันเดือนปีการประชุม|กรุณาระบุวันที่ประชุม/.test(upper) ? (code = "VALIDATION_MISSING_MEETING_DATE", message = "กรุณาระบุวันเดือนปีการประชุมก่อนบันทึก") : /LOCK|WAITLOCK|Service invoked too many times|Exceeded maximum execution/i.test(raw) && (code = "WRITE_BACKEND_BUSY", message = "ระบบบันทึกข้อมูลทำงานช้าหรือถูกใช้งานพร้อมกัน กรุณาลองใหม่อีกครั้ง"), {
        errorCode: code, message, rawMessage: raw, phaseD: !0, stamp: _routerEnvelopeStamp_(), method: String(method || ""), write: !!(routeMeta && routeMeta.write)
    };
}
function _routerWritePreflight_(ctx, payload, routeMeta) {
    routeMeta = routeMeta || {};
    var method = String(ctx && ctx.method || "").trim(), contract = _routerWriteContractForMethod_(method, routeMeta);
    return !method || !contract.write ? null : !payload || typeof payload != "object" || Array.isArray(payload) ? _routerFieldError_("WRITE_PAYLOAD_INVALID", "ข้อมูลสำหรับบันทึกไม่ถูกต้อง", []) : !routeMeta || routeMeta.public === !0 ? _routerFieldError_("PUBLIC_WRITE_BLOCKED", "ไม่อนุญาตให้บันทึกข้อมูลผ่าน public route", []) : !contract.write || !contract.csrf ? _routerFieldError_("WRITE_ROUTE_CONTRACT_INVALID", "สัญญา API บันทึกข้อมูลไม่ครบถ้วน: " + method, []) : _routerText_(payload.token || payload._token || payload.authToken) ? _routerText_(payload.csrfActionToken || payload.actionToken || payload._actionToken || payload.csrfToken || payload.csrf || payload._csrf) ? _routerRequiredFields_(method, payload) : _routerFieldError_("CSRF_TOKEN_MISSING_BEFORE_WRITE", "ไม่พบรหัสยืนยันความปลอดภัยสำหรับการบันทึก กรุณาโหลด/เข้าสู่ระบบใหม่", [
        "csrfToken"
    ]) : _routerFieldError_("AUTH_REQUIRED_BEFORE_WRITE", "เซสชันหมดอายุหรือยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่", [
        "token"
    ]);
}
function _routerPreflightEnvelope_(ctx, preflight, routeMeta) {
    var method = String(ctx && ctx.method || ""), message = String(preflight && preflight.message || "ข้อมูลสำหรับบันทึกไม่ครบถ้วน"), env = err_(message, {
        method, fields: preflight && preflight.fields || [], phaseDPreflight: !0, writeOwner: "Code_20_Router.WRITE_SCHEMA_BY_METHOD", writeSchemaOwner: "Code_20_Router.WRITE_SCHEMA_BY_METHOD", stamp: _routerEnvelopeStamp_(), routeGroup: String(routeMeta && (routeMeta.group || routeMeta.domain) || "")
    });
    return env.requestId = ctx && ctx.requestId, env.latencyMs = Date.now() - Number(ctx && ctx.startedAt || Date.now()), env.errorCode = String(preflight && preflight.errorCode || "WRITE_PREFLIGHT_FAILED"), env.method = method, env.meta = Object.assign({}, env.meta || {}, {
        phaseDPreflight: !0, writeSchemaUnification: !0, writeSchemaOwner: "Code_20_Router.WRITE_SCHEMA_BY_METHOD", writeReliabilityStamp: _routerEnvelopeStamp_(), fields: preflight && preflight.fields || []
    }), env;
}
function apiIssueActionToken(payload) {
    payload = payload || {};
    var parentToken = String(payload.token || payload._token || ""), action = String(payload.action || payload.method || "").trim(), sess = requireAuth_(payload, "viewer"), token = _issueSingleUseCsrfToken_(parentToken, sess, action);
    return ok_({
        actionToken: token, expiresInSeconds: 300, action
    }, "ออก CSRF action token สำเร็จ");
}
function _routerWarn_(code, error) {
    try {
        _appIsFnName_("_recordWarning_") && _recordWarning_(String(code || "router.warn"), error);
    }
    catch (_ignored) {
        _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _ignored) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
            error: String(_ignored && _ignored.message || _ignored)
        });
    }
}
function _routerAuditAccess_(status, method, meta, payload, sess, requestId, detail) {
    return _appIsFnName_("_platformRouterAuditAccess_") ? _platformRouterAuditAccess_(status, method, meta, payload, sess, requestId, detail) : !1;
}
function _routerLogAudit_(action, detail) {
    return _appIsFnName_("_platformRouterLogAudit_") ? _platformRouterLogAudit_(action, detail) : !1;
}
function _routerResetRequestScope_() {
    try {
        _appIsFnName_("_requestScopeReset_") && _requestScopeReset_({
            newRequest: !0,
            preserveMetrics: !1,
            source: "apiRouter"
        });
    }
    catch (e) {
        _routerWarn_("router.requestScope.reset", e);
    }
}
function _routerBuildContext_(request) {
    var startedAt = Date.now(), requestId = _newRequestId_(), normalizedRequest = _normalizeRouterRequest_(request), method = normalizedRequest.method, payload, routeMeta;
    return {
        startedAt, requestId, method, payload: normalizedRequest.payload, routeMeta: method ? _resolveRouteMeta_(method) : null
    };
}
function _routerReject_(ctx, message, data, errorCode) {
    var rejected = err_(String(message || "คำขอไม่สำเร็จ"), data == null ? null : data);
    return rejected.requestId = ctx && ctx.requestId, rejected.latencyMs = Date.now() - Number(ctx && ctx.startedAt || Date.now()), errorCode && (rejected.errorCode = String(errorCode)), rejected;
}
function _routerPrepareInvokePayload_(payload, method, routeMeta, requestId) {
    var invokePayload = payload === void 0 ? {} : payload;
    invokePayload && typeof invokePayload == "object" && !Array.isArray(invokePayload) && _appIsFnName_("_appCacheNormalizeRequest_") && (invokePayload = _appCacheNormalizeRequest_(invokePayload, { clone: !1 }));
    return invokePayload && typeof invokePayload == "object" && !Array.isArray(invokePayload) && (invokePayload.requestId = invokePayload.requestId || requestId, invokePayload.method = invokePayload.method || method, invokePayload._securityContext = {
        method, write: !!_routerRequiresCsrf_(method, routeMeta), admin: String(routeMeta.minRole || "").toLowerCase() === "admin", group: String(routeMeta.group || routeMeta.domain || "")
    }), invokePayload;
}
function _routerExtractPerformanceContext_(invokePayload) {
    if (!invokePayload || typeof invokePayload != "object" || Array.isArray(invokePayload))
        return {};
    var context = {
        __perfBaselineRunId: invokePayload.__perfBaselineRunId,
        __perfBaselineMode: invokePayload.__perfBaselineMode,
        __perfJourneyId: invokePayload.__perfJourneyId,
        forceFresh: invokePayload.forceFresh === !0,
        noCache: invokePayload.noCache === !0,
        bypassCache: invokePayload.bypassCache === !0,
        cacheTtlSeconds: invokePayload.cacheTtlSeconds
    };
    try {
        delete invokePayload.__perfBaselineRunId;
        delete invokePayload.__perfBaselineMode;
        delete invokePayload.__perfJourneyId;
    }
    catch (_perfContextErr) {
        _routerWarn_("router.performanceContext.strip", _perfContextErr);
    }
    return context;
}
function _routerAuthorizeInvocation_(method, invokePayload, routeMeta, executionGuard) {
    var routeMinRole = _routerMinRoleForRoute_(method, routeMeta), sess = null;
    if (!routeMeta.public) {
        executionGuard && _appIsFn_(executionGuard.check) && executionGuard.check("before-auth"), sess = requireAuth_(invokePayload, routeMinRole);
        var requiresCsrf = _routerRequiresCsrf_(method, routeMeta), requiresActionToken = !!_appIsFnName_("_shouldRequireStrictWriteActionToken_") && _shouldRequireStrictWriteActionToken_(method, routeMeta, invokePayload);
        method === "apiIssueActionToken" ? _verifyCsrfToken_(invokePayload, sess, {
            action: method, requireAction: !1
        }) : requiresCsrf && _verifyCsrfToken_(invokePayload, sess, {
            action: method, requireAction: requiresActionToken
        }), invokePayload && typeof invokePayload == "object" && (invokePayload.__routerAuthOk = !0, invokePayload.__routerCsrfOk = !!requiresCsrf, invokePayload.__routerAuthorizedMethod = method, invokePayload.__routerAuthorizedRole = routeMinRole, invokePayload._securityContext = Object.assign({}, invokePayload._securityContext || {}, {
            role: String(sess && sess.role || "Viewer"),
            userId: String(sess && sess.id || ""),
            username: String(sess && sess.username || ""),
            email: String(sess && sess.email || ""),
            group: String(routeMeta.group || routeMeta.domain || ""),
        }), invokePayload.__routerAuthorizedAt = new Date().toISOString());
    }
    return sess;
}
function _routerInvokeHandler_(fn, invokePayload, method, executionGuard, routeMeta) {
    return _withApiRouterInvocationContext_(function () {
        var previousGuard = null, boundaryCtx = null;
        try {
            _appIsFnName_("_setActiveExecutionGuard_") && (previousGuard = _setActiveExecutionGuard_(executionGuard || null));
        }
        catch (e) {
            _routerWarn_("router.guard.set", e);
        }
        try {
            _appIsFnName_("_backendBoundaryEnter_") && (boundaryCtx = _backendBoundaryEnter_(method, routeMeta || {})), executionGuard && _appIsFn_(executionGuard.check) && executionGuard.check("before-invoke");
            var routeResult = fn(invokePayload), boundarySnapshot = _appIsFnName_("_backendBoundarySnapshot_") ? _backendBoundarySnapshot_(boundaryCtx) : null;
            if (routeMeta && routeMeta.write === !0 && boundarySnapshot && Number(boundarySnapshot.rootGatewayCalls || 0) !== 1)
                throw new Error("WRITE_ROUTE_ROOT_GATEWAY_REQUIRED:" + String(method || "unknown"));
            return executionGuard && _appIsFn_(executionGuard.check) && executionGuard.check("after-invoke"), _appIsFnName_("_backendBoundaryAttachResult_") ? _backendBoundaryAttachResult_(routeResult, boundarySnapshot) : routeResult;
        }
        finally {
            try {
                boundaryCtx && _appIsFnName_("_backendBoundaryLeave_") && _backendBoundaryLeave_(boundaryCtx);
            }
            catch (e) {
                _routerWarn_("router.backendBoundary.leave", e);
            }
            if (_appIsFnName_("_setActiveExecutionGuard_"))
                try {
                    _setActiveExecutionGuard_(previousGuard);
                }
                catch (e) {
                    _routerWarn_("router.guard.restore", e);
                }
        }
    });
}
function _routerRotateWriteTokens_(normalized, method, routeMeta, invokePayload, sess) {
    if (!(normalized && normalized.ok && method !== "apiIssueActionToken" && !routeMeta.public && _routerRequiresCsrf_(method, routeMeta) && invokePayload && typeof invokePayload == "object"))
        return normalized;
    var oldToken = String(invokePayload.token || invokePayload._token || ""), rotated = _appIsFnName_("_rotateSessionToken_") ? _rotateSessionToken_(oldToken, sess || null, invokePayload, "write:" + method) : {
        token: oldToken, csrfToken: _issueCsrfToken_(oldToken, sess || null)
    };
    return normalized.token = rotated.token, normalized.nextToken = rotated.token, normalized.csrfToken = rotated.csrfToken, normalized.data && typeof normalized.data == "object" && !Array.isArray(normalized.data) && (normalized.data.token = rotated.token, normalized.data.nextToken = rotated.token, normalized.data.csrfToken = rotated.csrfToken), normalized;
}
function _routerAttachResponseMeta_(normalized, method, routeMeta, startedAt, requestId) {
    if (normalized.requestId = requestId, normalized.latencyMs = Date.now() - startedAt, routeMeta = routeMeta || {}, typeof getRequestScopeMetrics_ == "function") {
        var metrics = getRequestScopeMetrics_(), dataMeta = normalized && normalized.data && normalized.data.meta && typeof normalized.data.meta == "object" ? normalized.data.meta : {}, rowsReturned = _appIsFnName_("_appPerfCountRows_") ? _appPerfCountRows_(normalized && normalized.data) : Array.isArray(normalized.rows) ? normalized.rows.length : 0;
        var loginPerformance = normalized && normalized.data && normalized.data.loginPerformance && typeof normalized.data.loginPerformance == "object" ? normalized.data.loginPerformance : {};
        normalized.perf = {
            method, requestId, durationMs: normalized.latencyMs, cacheHit: !!(metrics.cacheHit || normalized.cacheHit || dataMeta.cacheHit || loginPerformance.principalDirectoryCacheHit), cacheHits: Number(metrics.cacheHits || 0), cacheMisses: Number(metrics.cacheMisses || 0), rowsRead: Number(metrics.rowsRead || dataMeta.rowsRead || 0), rowsReturned: Number(dataMeta.rowsReturned || normalized.returnedRows || rowsReturned || 0), cellsRead: Number(metrics.cellsRead || 0), serviceReads: Number(metrics.serviceReads || 0), projectedColumnsRead: Number(metrics.projectedColumnsRead || 0), fullWidthColumnsAvoided: Number(metrics.fullWidthColumnsAvoided || 0), spreadsheetServiceOpens: Number(metrics.spreadsheetServiceOpens || 0), spreadsheetContextCreates: Number(metrics.spreadsheetContextCreates || 0), spreadsheetContextHits: Number(metrics.spreadsheetContextHits || 0), sheetHandleCacheHits: Number(metrics.sheetHandleCacheHits || 0), sheetHandleCacheMisses: Number(metrics.sheetHandleCacheMisses || 0), sheetMetaReads: Number(metrics.sheetMetaReads || 0), sheetMetaCacheHits: Number(metrics.sheetMetaCacheHits || 0), headerReads: Number(metrics.headerReads || 0), headerCacheHits: Number(metrics.headerCacheHits || 0), headerMapBuilds: Number(metrics.headerMapBuilds || 0), headerMapCacheHits: Number(metrics.headerMapCacheHits || 0), requestCacheInvalidations: Number(metrics.requestCacheInvalidations || 0), warningCount: Number(metrics.warnings || 0), errorCount: Number(metrics.errors || 0), source: String(dataMeta.source || normalized.cacheSource || normalized.source || routeMeta.domain || routeMeta.group || "live"), degraded: !(!dataMeta.degraded && !normalized.degraded), group: String(routeMeta.group || routeMeta.domain || ""), sheetsRead: metrics.sheetsRead || {}, warnLabels: metrics.warnLabels || {}, errorLabels: metrics.errorLabels || {}, loginPerformance: loginPerformance,
            dashboardStageTimings: dataMeta.dashboardStageTimings && typeof dataMeta.dashboardStageTimings == "object" ? dataMeta.dashboardStageTimings : {}
        };
        var profile = _appIsFnName_("_appPerformanceProfile_") ? _appPerformanceProfile_(method) : null, payloadBytes = _appIsFnName_("_appPerformancePayloadBytes_") ? _appPerformancePayloadBytes_(normalized && normalized.data) : 0, gate = _appIsFnName_("_appPerformanceEvaluate_") ? _appPerformanceEvaluate_(method, {
            durationMs: normalized.latencyMs, rowsRead: normalized.perf.rowsRead, payloadBytes, cacheHit: normalized.perf.cacheHit
        }) : null;
        normalized.perf.payloadBytes = payloadBytes, normalized.perf.gate = gate, normalized.performanceGateStatus = gate && gate.status || "not-profiled", normalized.data && typeof normalized.data == "object" && !Array.isArray(normalized.data) && (normalized.data.meta = Object.assign({}, normalized.data.meta || {}, {
            requestId, durationMs: normalized.latencyMs, rowsRead: normalized.perf.rowsRead, rowsReturned: normalized.perf.rowsReturned, cacheHit: normalized.perf.cacheHit, warningCount: normalized.perf.warningCount, errorCount: normalized.perf.errorCount, payloadBytes, performanceGate: gate
        }));
    }
    return routeMeta && routeMeta.write === !0 && normalized && normalized.ok && normalized.data && typeof normalized.data == "object" && !Array.isArray(normalized.data) && (normalized.data.meta = Object.assign({}, normalized.data.meta || {}, {
        saveFlow: _routerCacheTelemetryForRoute_(method, routeMeta), durationMs: normalized.latencyMs
    })), normalized;
}
function _routerRecordPerf_(normalized, method, routeMeta, requestId, invokePayload) {
    return _appIsFnName_("_platformRouterRecordPerf_") ? _platformRouterRecordPerf_(normalized, method, routeMeta, requestId, invokePayload || {}) : !1;
}
var RouterPipeline = __APP_GLOBAL__.RouterPipeline = __APP_GLOBAL__.RouterPipeline || {};
function apiRouter(request) {
    return RouterPipeline.run(request || {});
}
function _apiRouterCoreDispatch_(request) {
    _routerResetRequestScope_();
    var ctx = _routerBuildContext_(request), method = ctx.method, payload = ctx.payload, routeMeta = ctx.routeMeta;
    if (_appIsFnName_("_routeTraceStart_") && _routeTraceStart_(ctx), !method) {
        var noMethod = _routerReject_(ctx, "ไม่พบชื่อ API method", null, "API_METHOD_MISSING");
        return _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, noMethod, "rejected"), noMethod;
    }
    var policyErr = _enforceCanonicalRoutePolicy_(method, routeMeta);
    if (policyErr)
        return policyErr.requestId = ctx.requestId, policyErr.latencyMs = Date.now() - ctx.startedAt, policyErr.errorCode = policyErr.errorCode || "ROUTE_POLICY_REJECTED", _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, policyErr, "policy-rejected"), policyErr;
    var maintenanceGateErr = _enforceProductionAdminMaintenanceGate_(method, routeMeta);
    if (maintenanceGateErr)
        return maintenanceGateErr.requestId = ctx.requestId, maintenanceGateErr.latencyMs = Date.now() - ctx.startedAt, maintenanceGateErr.errorCode = maintenanceGateErr.errorCode || "ADMIN_MAINTENANCE_TOOLS_DISABLED", _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, maintenanceGateErr, "maintenance-gated"), maintenanceGateErr;
    try {
        if (_enforceRoutePayloadPolicy_(method, payload, routeMeta), payload = _routerAnnotateAiPayload_(method, payload, routeMeta), routeMeta && routeMeta.aiRoute === !0 && payload && typeof payload == "object" && !Array.isArray(payload) && payload.aiInitialLoadBlockedByRouter === !0) {
            var aiDeferred = _routerAiLazyDeferredEnvelope_(method, routeMeta, ctx.requestId, ctx.startedAt);
            return _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, aiDeferred, "ai-initial-load-deferred"), aiDeferred;
        }
    }
    catch (e) {
        _routerAuditAccess_("rejected", method, routeMeta || {}, payload || {}, null, ctx.requestId, {
            reason: String(e && e.message || e)
        });
        var rejected = _routerReject_(ctx, String(e && e.message || e), null, "ROUTE_PAYLOAD_REJECTED");
        return _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, rejected, "payload-rejected"), rejected;
    }
    var executionGuard = typeof createExecutionGuard_ == "function" ? createExecutionGuard_({
        label: "apiRouter:" + method, method, route: method, maxMs: Number(routeMeta && routeMeta.deadlineMs || 33e4)
    }) : null;
    try {
        executionGuard && _appIsFn_(executionGuard.check) && executionGuard.check("route-resolved", {
            group: routeMeta && (routeMeta.group || routeMeta.domain || "")
        });
    }
    catch (e) {
        throw e;
    }
    var fn = _apiRouterResolveFunction_(method);
    if (!fn) {
        _routerLogAudit_("api.router.missing", {
            method, requestId: ctx.requestId
        });
        var missing = _routerReject_(ctx, "ไม่พบ API method: " + method, null, "API_ROUTE_MISSING_HANDLER");
        return _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, missing, "missing-handler"), missing;
    }
    try {
        var invokePayload = _routerPrepareInvokePayload_(payload, method, routeMeta, ctx.requestId), perfContext = _routerExtractPerformanceContext_(invokePayload), preflight = typeof _routerWritePreflight_ == "function" ? _routerWritePreflight_(ctx, invokePayload, routeMeta) : null;
        if (preflight) {
            var preflightResult = _routerPreflightEnvelope_(ctx, preflight, routeMeta);
            return _routerAuditAccess_("rejected", method, routeMeta || {}, invokePayload || {}, null, ctx.requestId, {
                reason: preflightResult.errorCode || "WRITE_PREFLIGHT_FAILED", source: "phaseD-write-preflight"
            }), _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, preflightResult, "write-preflight-rejected"), preflightResult;
        }
        var sess = _routerAuthorizeInvocation_(method, invokePayload, routeMeta, executionGuard);
        _routerAuditAccess_("attempt", method, routeMeta, invokePayload, sess, ctx.requestId, {
            source: "apiRouter"
        });
        var cachedResult = _appIsFnName_("_performanceRouterReadCacheGet_") ? _performanceRouterReadCacheGet_(method, invokePayload, routeMeta, sess) : null;
        if (cachedResult) {
            var cachedNormalized = _normalizeRouterResponse_(cachedResult, method);
            return (cachedNormalized = _routerAttachResponseMeta_(cachedNormalized = _routerAttachAiResponseMeta_(cachedNormalized, method, routeMeta), method, routeMeta, ctx.startedAt, ctx.requestId)).cacheHit = !0, cachedNormalized.cacheSource = "performance-router-read-cache", cachedNormalized.perf && (cachedNormalized.perf.cacheHit = !0), _routerRecordPerf_(cachedNormalized, method, routeMeta, ctx.requestId, perfContext), _routerAuditAccess_("result", method, routeMeta, null, sess, ctx.requestId, {
                ok: !!cachedNormalized.ok, latencyMs: cachedNormalized.latencyMs, errorCode: cachedNormalized.errorCode || "", cacheHit: !0
            }), _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, cachedNormalized, "cache-hit"), cachedNormalized;
        }
        var result, normalized = _normalizeRouterResponse_(_routerInvokeHandler_(fn, invokePayload, method, executionGuard, routeMeta), method);
        return normalized = _routerAttachResponseMeta_(normalized = _routerAttachAiResponseMeta_(normalized = _routerRotateWriteTokens_(normalized, method, routeMeta, invokePayload, sess), method, routeMeta), method, routeMeta, ctx.startedAt, ctx.requestId), _appIsFnName_("_performanceRouterReadCachePut_") && _performanceRouterReadCachePut_(method, invokePayload, routeMeta, sess, normalized), _routerRecordPerf_(normalized, method, routeMeta, ctx.requestId, perfContext), _routerAuditAccess_("result", method, routeMeta, null, sess, ctx.requestId, {
            ok: !!normalized.ok, latencyMs: normalized.latencyMs, errorCode: normalized.errorCode || ""
        }), _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, normalized, "ok"), normalized;
    }
    catch (e) {
        _routerAuditAccess_("error", method, routeMeta || {}, null, null, ctx.requestId, {
            error: (e && e.message ? e.message : String(e)).substring(0, 180)
        }), _routerLogAudit_("api.router.error", {
            method, requestId: ctx.requestId, error: (e && e.message ? e.message : String(e)).substring(0, 240)
        });
        var failed = _apiRouterFailureEnvelope_(method, routeMeta || {}, ctx.requestId, ctx.startedAt, e, {
            errorCode: "API_ROUTE_EXCEPTION"
        });
        _routerRecordPerf_(failed, method, routeMeta || {}, ctx.requestId, typeof perfContext != "undefined" ? perfContext : payload || {});
        return _appIsFnName_("_routeTraceEnd_") && _routeTraceEnd_(ctx, failed, "exception"), failed;
    }
}
RouterPipeline.STAMP = "router-core-middleware-pipeline-production-current", RouterPipeline.owner = "C20", RouterPipeline.responsibilities = Object.freeze([
    "route-registry", "middleware", "permission", "csrf-policy", "dispatch", "response-envelope"
]), RouterPipeline.buildRequest = function (request) {
    request = request || {};
    var method = String(request.method || request.name || request.action || "").trim(), payload = request.payload;
    return payload === void 0 && (payload = request.data), payload === void 0 && (payload = {}), Object.assign({}, request, {
        method, payload
    });
}, RouterPipeline.run = function (request) {
    var req;
    return _apiRouterCoreDispatch_(RouterPipeline.buildRequest(request || {}));
}, RouterPipeline.getRouteMeta = function (method) {
    return _resolveRouteMeta_(method);
}, RouterPipeline.getActiveRoutes = function () {
    return _apiActiveRouteRegistry_();
}, RouterPipeline.resolveHandler = function (method) {
    return _apiRouterResolveFunction_(method);
}, RouterPipeline.requirePayloadPolicy = function (method, payload, meta) {
    return _enforceRoutePayloadPolicy_(method, payload, meta);
}, RouterPipeline.authorize = function (method, payload, meta, guard) {
    return _routerAuthorizeInvocation_(method, payload, meta, guard);
}, RouterPipeline.normalizeResponse = function (result, method) {
    return _normalizeRouterResponse_(result, method);
};
function _routerDomainOwner_(name) {
    var key = String(name || "").trim();
    if (!key)
        return null;
    var owner = __APP_GLOBAL__ && __APP_GLOBAL__[key];
    return owner && typeof owner == "object" ? owner : null;
}
function _routerDomainMethod_(ownerName, methodName) {
    var owner = _routerDomainOwner_(ownerName), fn = owner && owner[String(methodName || "")];
    return typeof fn == "function" ? function (payload) {
        return fn.call(owner, payload || {});
    } : null;
}
function _routerInvokeDomain_(ownerName, methodName, payload, errorCode) {
    var fn = _routerDomainMethod_(ownerName, methodName);
    return fn ? fn(payload || {}) : err_(String(errorCode || "DOMAIN_OWNER_UNAVAILABLE"));
}
function _normalizePaging_(payload, defaultLimit, maxLimit) {
    payload = payload || {}, defaultLimit = Number(defaultLimit || 10), maxLimit = Number(maxLimit || 100);
    var page = Number(payload.page), limit = Number(payload.limit), startIndex;
    return (!isFinite(page) || page < 1) && (page = 1), (!isFinite(limit) || limit < 1) && (limit = defaultLimit), {
        page, limit: limit = Math.min(Math.max(1, limit), maxLimit), startIndex: (page - 1) * limit
    };
}
function _paginateArrayResult_(rows, payload, defaultLimit, maxLimit, meta) {
    rows = Array.isArray(rows) ? rows : [];
    var paging = _normalizePaging_(payload || {}, defaultLimit || 20, maxLimit || 250), sliced = rows.slice(paging.startIndex, paging.startIndex + paging.limit);
    return {
        rows: sliced, data: sliced, totalRecords: rows.length, totalPages: Math.max(1, Math.ceil(rows.length / Math.max(1, paging.limit))), page: paging.page, limit: paging.limit, meta: meta || {}
    };
}
function apiGetClientDataContract(payload) {
    return payload = _routerReq_(payload, "viewer"), ok_({
        generatedAt: new Date().toISOString(), routeContract: _apiRouteContract_({
            compact: !0
        }), dataPolicy: _appIsFnName_("_platformClientDataContract_") ? _platformClientDataContract_(_apiRouteRegistry_()) : {}, securityGate: _appIsFnName_("_securityProductionGateSnapshot_") ? _securityProductionGateSnapshot_() : {}, runtimeContract: {
            routerResolver: "no-eval-explicit-global-current", storageMode: "memory-token-plus-opaque-resume-handle", tablePager: "AppTablePager:current", directEntrypointPolicy: _routerDirectEntrypointPolicy_(), caseStatusOwner: "AppBackendCore.normalizeCaseStatus"
        }, phase1SingleSourceContract: _appIsFnName_("_singleSourceContract_") ? _singleSourceContract_({
            compact: !0
        }) : {
            ok: null
        }, fieldMap: typeof AppBackendCore != "undefined" && AppBackendCore.FIELD_MAP ? AppBackendCore.FIELD_MAP : {}, statusMap: typeof AppBackendCore != "undefined" && AppBackendCore.STATUS_MAP ? AppBackendCore.STATUS_MAP : {}, caseStatusContract: {
            owner: "AppBackendCore.normalizeCaseStatus", statuses: typeof AppBackendCore != "undefined" && AppBackendCore.CASE_STATUS ? AppBackendCore.CASE_STATUS.slice() : []
        }, appConfig: _appIsFnName_("_getRuntimeConfigBundle_") ? _getRuntimeConfigBundle_() : {}
    }, "โหลด client data contract สำเร็จ");
}
function getAppTerminology_() {
    return {
        appTitle: "ระบบบริหารจัดการเรื่องพิจารณา", committee: "คณะกรรมาธิการการป้องกันและปราบปรามการทุจริตประพฤติมิชอบ สภาผู้แทนราษฎร", office: "กลุ่มงานคณะกรรมาธิการการป้องกันและปราบปรามการทุจริตประพฤติมิชอบ สำนักกรรมาธิการ 3", fiscalYear: "ปีงบประมาณ", caseManagement: "จัดการเรื่องพิจารณา"
    };
}
function getStandardPrintHeader_() {
    return {
        title: "รัฐสภา", committee: getAppTerminology_().committee, office: getAppTerminology_().office, dateFormat: "dd/MM/yyyy BE"
    };
}
function apiGetAppTerminology(payload) {
    return payload = _routerReq_(payload, "viewer"), ok_({
        terminology: getAppTerminology_(), printStandard: getStandardPrintHeader_(), caseStatuses: typeof AppBackendCore != "undefined" && AppBackendCore.CASE_STATUS ? AppBackendCore.CASE_STATUS.slice() : [], caseStatusOwner: "AppBackendCore.normalizeCaseStatus", statusMap: typeof AppBackendCore != "undefined" && AppBackendCore.STATUS_MAP ? AppBackendCore.STATUS_MAP : {}
    }, "โหลด terminology สำเร็จ");
}
function _routerCaseSearchFacade_(method, payload, label) {
    function routeCaseSearchRun_(p) {
        return p = Object.assign({}, p || {}), String(method || "") === "apiSearchCasesLite" && (p.compactReadModel = !0, p.serverPaged == null && (p.serverPaged = !0), p.noPage == null && (p.noPage = !1), p.fullList == null && (p.fullList = !1)), p = _appIsFnName_("_routerReq_") ? _routerReq_(p, "viewer") : p, _routerInvokeDomain_("CaseDomain", "searchCases", p, "CASE_DOMAIN_SEARCH_UNAVAILABLE");
    }
    return method = String(method || "apiSearchCasesLite"), label = String(label || "cases.search"), _appIsFnName_("_withHotApiTelemetry_") ? _withHotApiTelemetry_(method, payload || {}, label, routeCaseSearchRun_) : routeCaseSearchRun_(payload || {});
}
function apiGetCaseQuickSummary(payload) {
    return payload = _appIsFnName_("_routerReq_") ? _routerReq_(payload || {}, "viewer") : payload || {}, _routerInvokeDomain_("CaseDomain", "quickSummary", payload, "CASE_DOMAIN_QUICK_SUMMARY_UNAVAILABLE");
}
function apiSearchCasesLite(payload) {
    var result = _routerCaseSearchFacade_("apiSearchCasesLite", payload, "cases.searchLite");
    if (!result || typeof result != "object" || result.ok === !1)
        return result;
    var nested = result.data && typeof result.data == "object" && !Array.isArray(result.data) ? result.data : {}, rows = Array.isArray(result.rows) ? result.rows : Array.isArray(nested.rows) ? nested.rows : Array.isArray(result.data) ? result.data : Array.isArray(result.items) ? result.items : [], totalRecords = Math.max(0, Number(result.totalRecords || result.total || nested.totalRecords || nested.total || rows.length) || 0), page = Math.max(1, Number(result.page || nested.page || 1) || 1), pageSize = Math.max(1, Math.min(Number(result.pageSize || result.limit || nested.pageSize || nested.limit || payload && (payload.pageSize || payload.limit) || 20) || 20, 100)), totalPages = Math.max(1, Number(result.totalPages || nested.totalPages || Math.ceil(totalRecords / pageSize)) || 1), canonical = PRODUCTION_DTO_CONTRACT.canonicalPagingEnvelope(rows, {
        totalRecords, page, pageSize, totalPages, maxPageSize: 100, msg: String(result.msg || "โหลดข้อมูลเรื่องพิจารณาสำเร็จ"), meta: Object.assign({}, nested.meta || {}, result.meta || {}, {
            contractOwner: "Code_20_Router.apiSearchCasesLite", pagingContract: "case-search-page-envelope-v3", serverPaged: !0, serverFiltered: !0
        })
    });
    return Object.assign({}, result, canonical, {
        ok: !0, data: canonical.data, msg: String(result.msg || "โหลดข้อมูลเรื่องพิจารณาสำเร็จ"), error: ""
    });
}
function apiGetCaseReportExportRows(payload) {
    function runCaseReportExportRows_(p) {
        return p = _appIsFnName_("_routerReq_") ? _routerReq_(p || {}, "viewer") : p || {}, _routerInvokeDomain_("CaseDomain", "getReportExportRows", p, "CASE_DOMAIN_REPORT_EXPORT_UNAVAILABLE");
    }
    return _appIsFnName_("_withHotApiTelemetry_") ? _withHotApiTelemetry_("apiGetCaseReportExportRows", payload || {}, "cases.reportExport.onDemand", runCaseReportExportRows_) : runCaseReportExportRows_(payload || {});
}
function apiGetCaseReportOptions(payload) {
    function runCaseReportOptions_(p) {
        return p = _appIsFnName_("_routerReq_") ? _routerReq_(p || {}, "viewer") : p || {}, _routerInvokeDomain_("CaseDomain", "getReportOptions", p, "CASE_DOMAIN_REPORT_OPTIONS_UNAVAILABLE");
    }
    return _appIsFnName_("_withHotApiTelemetry_") ? _withHotApiTelemetry_("apiGetCaseReportOptions", payload || {}, "cases.reportOptions", runCaseReportOptions_) : runCaseReportOptions_(payload || {});
}
function _dashboardSnapshotBudgetHasData_(bundle) {
    try {
        let n2 = function (v) {
            return v = Number(String(v == null ? "" : v).replace(/[^0-9.\-]/g, "")), isFinite(v) ? v : 0;
        };
        var n = n2, data = bundle && (bundle.data !== void 0 ? bundle.data : bundle) || {}, dto = data.dashboardDto && typeof data.dashboardDto == "object" ? data.dashboardDto : {}, b = data.budgetStats || data.budget || dto.budgetStats || {};
        b && b.data && typeof b.data == "object" && !Array.isArray(b.data) && (b = b.data);
        var rows = Array.isArray(b.byPlan) ? b.byPlan : Array.isArray(b.plans) ? b.plans : Array.isArray(b.rows) ? b.rows : Array.isArray(b.details) ? b.details : [], status = b.statusSummary || {}, refund = status.refund || {}, report = status.report || {};
        return !!(n2(b.totalBudget) || n2(b.totalPaid) || n2(b.totalExpense) || n2(b.totalRemain) || n2(b.totalRemaining) || rows.length || n2(refund.total) || n2(report.total));
    }
    catch (_snapshotBudgetErr) {
        return !1;
    }
}
function _dashboardStatusStatsObject_(bundle) {
    try {
        var data = bundle && (bundle.data !== void 0 ? bundle.data : bundle) || {}, dto = data.dashboardDto && typeof data.dashboardDto == "object" ? data.dashboardDto : {}, stats = data.stats || data.dashboardStats || data.caseStats || dto.stats || dto.dashboardStats || dto.caseStats || {};
        return stats && typeof stats == "object" && !Array.isArray(stats) ? stats : null;
    }
    catch (_e) {
        return null;
    }
}
function _dashboardSnapshotStatusCurrent_(bundle) {
    var stats = _dashboardStatusStatsObject_(bundle), stamp = stats && String(stats.statusCountStamp || stats.dashboardStatusCountStamp || stats.meta && stats.meta.statusCountStamp || "");
    return stamp === APP_DASHBOARD_STATUS_COUNT_STAMP;
}
function _dashboardEnsureStatusSnapshotStamp_(bundle) {
    try {
        var stats = _dashboardStatusStatsObject_(bundle);
        stats && (stats.statusCountStamp = APP_DASHBOARD_STATUS_COUNT_STAMP, stats.dashboardStatusCountStamp = APP_DASHBOARD_STATUS_COUNT_STAMP, stats.statusReadModelStamp = "dashboard-status-read-model-current-r253", stats.dashboardStatusReadModelStamp = "dashboard-status-read-model-current-r253", stats.meta = Object.assign({}, stats.meta || {}, {
            statusCountStamp: APP_DASHBOARD_STATUS_COUNT_STAMP, statusReadModelStamp: "dashboard-status-read-model-current-r253", statusDefaultBlankToS0: !0
        }));
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("dashboard.statusSnapshot.stamp", _e);
    }
    return bundle;
}
function _dashboardSnapshotSatisfiesPayload_(bundle, payload) {
    return _dashboardSnapshotStatusCurrent_(bundle) && ((payload && payload.includeBudget) !== !0 || _dashboardSnapshotBudgetHasData_(bundle));
}
function _dashboardShouldWriteSummarySnapshot_(payload, bundle) {
    return bundle ? _dashboardSnapshotStatusCurrent_(_dashboardEnsureStatusSnapshotStamp_(bundle)) && ((payload && payload.__snapshotRefreshAfterInvalidation) === !0 ? !0 : ((payload && payload.includeBudget) === !0, _dashboardSnapshotBudgetHasData_(bundle))) : !1;
}
function _dashboardColdFirstPaintDeferEnabled_() {
    try {
        return String(_appIsFnName_("_scriptProp_") ? _scriptProp_("DASHBOARD_COLD_FIRST_PAINT_DEFER_ENABLED", "Y") : "Y").toUpperCase() !== "N";
    }
    catch (_e) {
        return !0;
    }
}
function _dashboardIsColdFirstPaintRequest_(payload) {
    payload = payload || {};
    var source = String(payload.source || payload.requestSource || payload.clientSource || "");
    var hot = String(payload.hotPathMode || payload.mode || "");
    if (payload.forceFresh === !0 || payload.noCache === !0 || payload.bypassCache === !0)
        return !1;
    if (payload.phase1FirstPaint !== !0)
        return !1;
    if (/retry|auto-retry|refresh|reload|lazy|hydrate|hydration|force|auth-ready|visible-data/i.test(source + " " + hot))
        return !1;
    return /first-paint|fast-summary|summary-kpi|dashboard\.activate\.phase1/i.test(source + " " + hot);
}
function _dashboardBuildDeferredFirstPaintPayload_(payload, reason) {
    payload = payload || {};
    var nowIso = new Date().toISOString(), meta = {
        source: "dashboard-cold-first-paint-deferred-r146", reason: String(reason || "snapshot-miss-defer-heavy-read"), dashboardFirstPaintDeferred: !0, deferHydrationRequired: !0, fastFirstPaintNoSheetRead: !0, coldStartNoBlockingSheetRead: !0, generatedAt: nowIso, requestId: String(payload.requestId || ""), hotPathMode: String(payload.hotPathMode || "dashboard-phase1-first-paint")
    }, stats = _appIsFnName_("_dashboardEmptyStatsPayload_") ? _dashboardEmptyStatsPayload_("dashboard-cold-first-paint-deferred-r146") : {
        total: 0, pending: 0, completed: 0, byStatus: {}, byType: [], byTopic: []
    }, budget = _appIsFnName_("_dashboardEmptyBudgetPayload_") ? _dashboardEmptyBudgetPayload_("dashboard-cold-first-paint-deferred-r146") : {}, cases = {
        rows: [], items: [], records: [], totalRecords: 0, total: 0, page: 1, pageSize: 0, totalPages: 1, meta: {
            deferred: !0, source: "dashboard-cold-first-paint-deferred-r146"
        }
    };
    stats.meta = Object.assign({}, stats.meta || {}, meta), stats.degraded = !1, stats.pendingHydration = !0;
    budget.meta = Object.assign({}, budget.meta || {}, meta), budget.pendingHydration = !0;
    var dto = _appIsFnName_("_dashboardCanonicalBundleDto_") ? _dashboardCanonicalBundleDto_(stats, budget, cases, meta) : {
        stats: stats, budgetStats: budget, cases: cases, meta: meta
    };
    return {
        dashboardDto: dto, stats: stats, summaryStats: stats, caseStats: stats, budgetStats: budget, budget: budget, cases: cases, rows: [], items: [], records: [], totalRecords: 0, total: 0, pendingHydration: !0, degraded: !1, loadOk: !0, meta: meta, readModel: typeof DASHBOARD_HOT_READ_MODEL_STAMP != "undefined" ? DASHBOARD_HOT_READ_MODEL_STAMP : "dashboard-hot-read-model-r146", rowsRead: 0, rowsReturned: 0, cacheHit: !1, cacheStatus: "deferred-first-paint"
    };
}
function apiGetDashboardBundle(payload) {
    payload = payload || {};
    var canUseSnapshot = payload.forceFresh !== !0 && payload.noCache !== !0 && payload.bypassCache !== !0 && payload.__snapshotRefreshAfterInvalidation !== !0;
    if (canUseSnapshot && _appIsFnName_("_performanceReadSnapshot_"))
        try {
            var snap = _performanceReadSnapshot_("dashboard", "default");
            if (snap && snap.ok && snap.data) {
                var bundle = snap.data && typeof snap.data == "object" ? snap.data : {
                    value: snap.data
                };
                if (_dashboardSnapshotSatisfiesPayload_(bundle, payload))
                    return ok_(bundle, "โหลด Dashboard จาก summary snapshot สำเร็จ");
                _appIsFnName_("_recordWarning_") && _recordWarning_("dashboard.summarySnapshot.skipStaleStatus", null, {
                    includeBudget: !!payload.includeBudget, requestId: payload.requestId || "", requiredStatusStamp: APP_DASHBOARD_STATUS_COUNT_STAMP
                });
            }
        }
        catch (_dashboardSnapshotReadErr) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("dashboard.summarySnapshot.read", _dashboardSnapshotReadErr);
        }
    if (canUseSnapshot && _dashboardColdFirstPaintDeferEnabled_() && _dashboardIsColdFirstPaintRequest_(payload))
        return ok_(_dashboardBuildDeferredFirstPaintPayload_(payload, "snapshot-miss-defer-heavy-sheet-read"), "โหลดโครง Dashboard แบบเร็วสำเร็จ");
    function runDashboardBundle_(p) {
        var res = _routerInvokeDomain_("DashboardDomain", "getBundle", p || {}, "DASHBOARD_DOMAIN_UNAVAILABLE"), bundle2 = res && res.data !== void 0 ? res.data : res;
        _dashboardEnsureStatusSnapshotStamp_(bundle2);
        try {
            (p && p.__snapshotRefreshAfterInvalidation) !== !0 && _appIsFnName_("_performanceWriteSnapshot_") && res && res.ok !== !1 && _dashboardShouldWriteSummarySnapshot_(p, bundle2) && _performanceWriteSnapshot_("dashboard", "default", bundle2, {
                source: "apiGetDashboardBundle.direct-refresh.status-count-safe", ttlSeconds: Number(p && p.snapshotTtlSeconds || 21600) || 21600, includeBudget: !!(p && p.includeBudget), budgetSnapshotSafe: !0, statusCountStamp: APP_DASHBOARD_STATUS_COUNT_STAMP, statusReadModelStamp: "dashboard-status-read-model-current-r253"
            });
        }
        catch (_dashboardSnapshotWriteErr) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("dashboard.summarySnapshot.write", _dashboardSnapshotWriteErr);
        }
        return res;
    }
    return _appIsFnName_("_withHotApiTelemetry_") ? _withHotApiTelemetry_("apiGetDashboardBundle", payload || {}, "dashboard.bundle", runDashboardBundle_) : runDashboardBundle_(payload || {});
}
function apiGetThailandLocations(payload) {
    return payload = _routerReq_(payload, "viewer"), normalizeResult_(_Domain_getThailandLocations(payload), "โหลดข้อมูลจังหวัด/อำเภอสำเร็จ", "โหลดข้อมูลจังหวัด/อำเภอไม่สำเร็จ");
}
function apiGetAllLettersWithCaseInfo(payload) {
    payload = _routerReq_(payload, "viewer");
    var result = _fetchAllLettersWithCaseInfoImpl_(payload);
    if (result && result.ok) {
        var rows = Array.isArray(result.data) ? result.data : result.data && result.data.rows ? result.data.rows : [];
        return ok_(_paginateArrayResult_(rows, payload, 50, 500, {
            source: "fetchAllLettersWithCaseInfo"
        }), "โหลดหนังสือติดตามพร้อมข้อมูลเรื่องสำเร็จ");
    }
    return normalizeResult_(result, "โหลดหนังสือติดตามพร้อมข้อมูลเรื่องสำเร็จ", "โหลดหนังสือติดตามพร้อมข้อมูลเรื่องไม่สำเร็จ");
}
function apiGetCanonicalCaseBundle(payload) {
    return payload = _routerReq_(payload, "viewer"), normalizeResult_(_Domain_getCanonicalCaseBundle(payload), "โหลดชุดข้อมูลเรื่องแบบ canonical สำเร็จ", "โหลดชุดข้อมูลเรื่องแบบ canonical ไม่สำเร็จ");
}
function apiGetTracking(payload) {
    payload = payload || {};
    var boundary = _routerAuthorizedEntry_("apiGetTracking", payload, "viewer");
    if (!boundary.ok)
        return boundary.result;
    function runTracking_(p) {
        return _routerInvokeDomain_("TrackingDomain", "getTracking", p || {}, "TRACKING_DOMAIN_UNAVAILABLE");
    }
    return _appIsFnName_("_withHotApiTelemetry_") ? _withHotApiTelemetry_("apiGetTracking", payload, "tracking.list", runTracking_) : runTracking_(payload);
}
function _normalizeOkEnvelope_(result, okMsg, errMsg) {
    return normalizeResult_(result, okMsg || "", errMsg || "คำขอไม่สำเร็จ");
} /* phase5-system-stability-current: admin user api facades live only in Code_33_Domain_People.gs to avoid duplicate global apiAdmin* owners. */
