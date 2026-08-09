/** Canonical — Repository cache, snapshot, generation and request-scope performance owner. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {}, AppDataService = __APP_GLOBAL__.AppDataService = __APP_GLOBAL__.AppDataService || {};
var APP_CACHE_GOVERNANCE_CURRENT = Object.freeze({
    stamp: "cache-governance-current-2026-07-26",
    owner: "Code_01_Platform_SheetRepo.CacheGovernanceCurrent",
    policy: "one-policy-owner-per-domain; generation-stamps; single-fallback; no-payload-cache-telemetry",
    domains: Object.freeze({
        dashboard: Object.freeze({ ttlKey: "dashboardBundle", ttl: 240, staleTtl: 600, sourceOfTruth: "MainData/MeetingLogs/Letters/Budget read models", invalidates: Object.freeze(["dashboard"]), keyPrefix: "dash_" }),
        cases: Object.freeze({ ttlKey: "caseList", ttl: 180, staleTtl: 600, sourceOfTruth: "MainData", invalidates: Object.freeze(["case", "cases", "dashboard"]), keyPrefix: "case_" }),
        letters: Object.freeze({ ttlKey: "trackingList", ttl: 180, staleTtl: 600, sourceOfTruth: "Letters", invalidates: Object.freeze(["letters", "case", "dashboard"]), keyPrefix: "letter_" }),
        meeting: Object.freeze({ ttlKey: "caseList", ttl: 180, staleTtl: 600, sourceOfTruth: "MeetingLogs/CommitteeMeetings", invalidates: Object.freeze(["meeting", "meetinglogs", "case", "dashboard"]), keyPrefix: "meeting_" }),
        people: Object.freeze({ ttlKey: "peopleBundle", ttl: 300, staleTtl: 900, sourceOfTruth: "Personnel_*", invalidates: Object.freeze(["personnel", "people", "dashboard"]), keyPrefix: "people_" }),
        budget: Object.freeze({ ttlKey: "budgetSummary", ttl: 300, staleTtl: 1800, sourceOfTruth: "BudgetImports/BudgetYearSettingsItems", invalidates: Object.freeze(["budget", "budgetimports", "dashboard"]), keyPrefix: "budget_" }),
        lookup: Object.freeze({ ttlKey: "lookupBundle", ttl: 600, staleTtl: 1800, sourceOfTruth: "Lookup sheets", invalidates: Object.freeze(["lookup"]), keyPrefix: "lookup_" })
    }),
    bypassFlags: Object.freeze(["forceFresh", "forceRefresh", "noCache", "bypassCache", "bypassRequestCache", "reload", "afterWrite", "__snapshotRefreshAfterInvalidation", "__budgetBackendCacheBypass"]),
    maxFallbackDepth: 1,
    enabledByDefault: !0,
    dataMutation: !1,
    publicApiAdded: !1
});
function _appCacheTtlPolicy_() {
    return {
        dashboardBundle: 240, dashboardStats: 180, caseList: 180, caseReportOptions: 180, trackingList: 180, peopleBundle: 300, budgetSummary: 300, budgetTypeSummary: 600, lookupBundle: 600, session: 21600
    };
}
function _appCacheGovernanceDomain_(domain) {
    domain = String(domain || "").trim().toLowerCase();
    if (domain === "case") domain = "cases";
    if (domain === "personnel") domain = "people";
    return APP_CACHE_GOVERNANCE_CURRENT.domains[domain] || null;
}
var APP_CACHE_REQUEST_MODE_CURRENT = Object.freeze({
    stamp: "cache-request-mode-canonical-r200",
    owner: "Code_01_Platform_SheetRepo.CacheRequestMode",
    modes: Object.freeze(["default", "fresh", "afterWrite"]),
    compatibilityReadOnly: !0,
    canonicalField: "cacheMode",
    legacyFlagsPreserved: !0
});
function _appCacheNormalizeRequest_(payload, options) {
    payload = payload && typeof payload == "object" && !Array.isArray(payload) ? payload : {};
    options = options || {};
    var out = options.clone === !1 ? payload : Object.assign({}, payload), rawMode = String(out.cacheMode || "").trim().toLowerCase(), mode = rawMode;
    if (["default", "fresh", "afterwrite"].indexOf(mode) < 0) {
        if (out.afterWrite === !0 || out.__snapshotRefreshAfterInvalidation === !0) mode = "afterwrite";
        else if (Number(out.cacheTtlSeconds) === 0 || APP_CACHE_GOVERNANCE_CURRENT.bypassFlags.some(function (flag) { return out[flag] === !0; })) mode = "fresh";
        else mode = "default";
    }
    out.cacheMode = mode === "afterwrite" ? "afterWrite" : mode;
    if (mode === "fresh" || mode === "afterwrite") {
        out.forceFresh = !0;
        out.noCache = !0;
        out.bypassCache = !0;
        out.cacheTtlSeconds = 0;
    }
    if (mode === "afterwrite") out.afterWrite = !0;
    out.__cachePolicyOwner = APP_CACHE_REQUEST_MODE_CURRENT.owner;
    return out;
}
function _appCacheBypassRequested_(payload, extraFlags) {
    payload = _appCacheNormalizeRequest_(payload || {}, { clone: !1 });
    var mode = String(payload.cacheMode || "default").toLowerCase(), flags = APP_CACHE_GOVERNANCE_CURRENT.bypassFlags.slice();
    Array.isArray(extraFlags) && extraFlags.forEach(function (flag) { flags.indexOf(flag) < 0 && flags.push(flag); });
    if (mode === "fresh" || mode === "afterwrite" || Number(payload.cacheTtlSeconds) === 0) return !0;
    return flags.some(function (flag) { return payload[flag] === !0; });
}
function _appCacheRequestModeStatus_() {
    var missing = [];
    _appIsFnName_("_appCacheNormalizeRequest_") || missing.push("normalize");
    _appIsFnName_("_appCacheBypassRequested_") || missing.push("bypass");
    return { ok: missing.length === 0, stamp: APP_CACHE_REQUEST_MODE_CURRENT.stamp, owner: APP_CACHE_REQUEST_MODE_CURRENT.owner, modes: APP_CACHE_REQUEST_MODE_CURRENT.modes.slice(), canonicalField: APP_CACHE_REQUEST_MODE_CURRENT.canonicalField, compatibilityReadOnly: !0, legacyFlagsPreserved: !0, missing: missing };
}
function _appCacheTtl_(name, defaultValue, minValue, maxValue) {
    var policy = _appIsFnName_("_appCacheTtlPolicy_") ? _appCacheTtlPolicy_() : {}, n = Number(policy[String(name || "")] || defaultValue || _CACHE_TTL_DATA_ || 300) || 300;
    return minValue != null && (n = Math.max(Number(minValue) || 0, n)), maxValue != null && (n = Math.min(Number(maxValue) || n, n)), n;
}
function _appCachePolicyFor_(domain, payload, overrides) {
    payload = payload || {}; overrides = overrides || {};
    var spec = _appCacheGovernanceDomain_(domain) || {}, ttl = _appCacheTtl_(String(overrides.ttlKey || spec.ttlKey || ""), Number(overrides.ttl || spec.ttl || 300), Number(overrides.minTtl || 15), Number(overrides.maxTtl || 1800));
    if (payload.cacheTtlSeconds != null && Number(payload.cacheTtlSeconds) > 0) ttl = Math.max(Number(overrides.minTtl || 15), Math.min(Number(payload.cacheTtlSeconds), Number(overrides.maxTtl || 1800)));
    return {
        owner: APP_CACHE_GOVERNANCE_CURRENT.owner,
        stamp: APP_CACHE_GOVERNANCE_CURRENT.stamp,
        domain: String(domain || ""),
        allowRead: !_appCacheBypassRequested_(payload, overrides.extraBypassFlags),
        allowWrite: !_appCacheBypassRequested_(payload, overrides.extraBypassFlags),
        ttlSeconds: ttl,
        staleTtlSeconds: Number(overrides.staleTtl || spec.staleTtl || Math.max(ttl, 600)),
        sourceOfTruth: String(overrides.sourceOfTruth || spec.sourceOfTruth || ""),
        maxFallbackDepth: APP_CACHE_GOVERNANCE_CURRENT.maxFallbackDepth
    };
}
AppDataService.VERSION = AppDataService.VERSION || "app-data-service-production-owner-current", AppDataService.owner = AppDataService.owner || "Code_01_Platform_SheetRepo:AppDataService", AppDataService.readModelTargetsForSheet = AppDataService.readModelTargetsForSheet || function (sheetName) {
    var key, targets;
    return {
        MainData: [
            "CaseSearchIndex_R4", "CaseSearchMaterializedIndex", "CaseSearchPersistentSnapshot", "CaseReportPersistentSnapshot", "TrackingMaterializedIndex", "TrackingPersistentSnapshot", "CaseRelatedSnapshot", "PetitionerPersistentSnapshot", "DashboardSummarySnapshot"
        ], MeetingLogs: [
            "CaseSearchMaterializedIndex", "CaseSearchPersistentSnapshot", "CaseReportPersistentSnapshot", "CaseRelatedSnapshot", "DashboardSummarySnapshot"
        ], CommitteeMeetings: [
            "CaseRelatedSnapshot", "DashboardSummarySnapshot"
        ], CommitteeMeetingAgendaItems: [
            "CaseRelatedSnapshot", "DashboardSummarySnapshot"
        ], Letters: [
            "TrackingMaterializedIndex", "TrackingPersistentSnapshot", "CaseRelatedSnapshot", "DashboardSummarySnapshot"
        ], BudgetImports: [
            "BudgetTypeSummary_R4", "BudgetSummary", "BudgetSummarySnapshot", "DashboardSummarySnapshot"
        ], BudgetSummary: [
            "BudgetTypeSummary_R4", "BudgetSummarySnapshot", "DashboardSummarySnapshot"
        ], Personnel_Comm: [
            "PeopleDirectory_R4"
        ], Personnel_Op: [
            "PeopleDirectory_R4"
        ], Personnel_Staff: [
            "PeopleDirectory_R4", "BudgetSummarySnapshot", "DashboardSummarySnapshot"
        ], SalarySettings: [
            "BudgetSummarySnapshot", "DashboardSummarySnapshot"
        ], SalaryPayments: [
            "BudgetSummarySnapshot", "DashboardSummarySnapshot"
        ], BudgetYearSettings: [
            "BudgetSummarySnapshot", "DashboardSummarySnapshot"
        ], BudgetYearSettingsItems: [
            "BudgetSummarySnapshot", "DashboardSummarySnapshot"
        ], Petitioners: [
            "PetitionerPersistentSnapshot"
        ], Personnel_Subcommittees: [
            "PeopleDirectory_R4"
        ], Subcommittees: [
            "PeopleDirectory_R4"
        ]
    }[String(sheetName || "").trim()] || [];
}, AppDataService.cacheGet = AppDataService.cacheGet || function (key) {
    try {
        return _appDataServiceCacheRead_(key);
    }
    catch (e) {
        return _appWarn_("AppDataService.cacheGet", e, {
            key
        }), null;
    }
}, AppDataService.cachePut = AppDataService.cachePut || function (key, value, ttl) {
    try {
        return _appDataServiceCacheWrite_(key, value, ttl || 300);
    }
    catch (e) {
        return _appWarn_("AppDataService.cachePut", e, {
            key
        }), !1;
    }
}, AppDataService.cacheRemove = AppDataService.cacheRemove || function (key) {
    try {
        return _AppScriptCache_().remove(String(key || "")), !0;
    }
    catch (e) {
        return _appWarn_("AppDataService.cacheRemove", e, {
            key
        }), !1;
    }
}, AppDataService.invalidateReadModelsForSheet = AppDataService.invalidateReadModelsForSheet || function (sheetName, reason) {
    for (var targets = AppDataService.readModelTargetsForSheet(sheetName), out = [], i = 0; i < targets.length; i++) {
        var target = targets[i];
        AppDataService.cacheRemove("sheet_current_" + target);
        try {
            _appIsFnName_("_bumpEntityCacheStamp_") && _bumpEntityCacheStamp_(String(target || "").toLowerCase());
        }
        catch (e2) {
            _appWarn_("AppDataService.readModel.stamp.bump", e2, {
                source: sheetName, target
            });
        }
        try {
            _appIsFnName_("_requestScopeReset_") && _requestScopeReset_({
                newRequest: !1,
                preserveMetrics: !0,
                invalidateSheets: [String(sheetName || "")],
                source: "read-model-invalidation"
            });
        }
        catch (e3) {
            _appWarn_("AppDataService.requestScopeReset", e3, {
                source: sheetName, target
            });
        }
        try {
            _appIsFnName_("_serverLog_") && _serverLog_("info", "AppDataService.readModel.invalidated", {
                sourceSheet: String(sheetName || ""), targetSheet: target, reason: String(reason || "write")
            });
        }
        catch (e4) {
            _appWarn_("AppDataService.serverLog", e4, {
                source: sheetName, target
            });
        }
        out.push(target);
    }
    var persistentSnapshotInvalidation = {}, persistentDomains = [];
    targets.indexOf("DashboardSummarySnapshot") !== -1 && persistentDomains.push("dashboard");
    targets.indexOf("BudgetSummarySnapshot") !== -1 && persistentDomains.push("budgetsummary");
    targets.indexOf("TrackingPersistentSnapshot") !== -1 && persistentDomains.push("tracking");
    targets.indexOf("CaseRelatedSnapshot") !== -1 && persistentDomains.push("case-related");
    targets.indexOf("CaseSearchPersistentSnapshot") !== -1 && persistentDomains.push("case-search");
    targets.indexOf("CaseReportPersistentSnapshot") !== -1 && persistentDomains.push("case-report");
    targets.indexOf("PetitionerPersistentSnapshot") !== -1 && persistentDomains.push("petitioners");
    if (persistentDomains.length && _appIsFnName_("_persistentSummarySnapshotInvalidate_"))
        persistentDomains.forEach(function (domain) {
            try {
                persistentSnapshotInvalidation[domain] = _persistentSummarySnapshotInvalidate_(domain, reason || "write");
            }
            catch (_persistentInvalidateErr) {
                _appWarn_("AppDataService.persistentSnapshot.invalidate", _persistentInvalidateErr, {
                    sourceSheet: sheetName, reason: reason, domain: domain
                });
            }
        });
    var snapshotRefresh = null;
    try {
        AppDataService.refreshSummarySnapshotsAfterInvalidation && (snapshotRefresh = AppDataService.refreshSummarySnapshotsAfterInvalidation(sheetName, reason || "write"));
    }
    catch (_summaryRefreshErr) {
        _appWarn_("AppDataService.summarySnapshot.refreshAfterInvalidation", _summaryRefreshErr, {
            sourceSheet: sheetName, reason
        });
    }
    return {
        invalidated: out.length > 0, targets: out, reason: String(reason || "write"), owner: AppDataService.owner, summarySnapshots: snapshotRefresh, persistentDashboardSnapshot: persistentSnapshotInvalidation.dashboard || null, persistentBudgetSummarySnapshot: persistentSnapshotInvalidation.budgetsummary || null, persistentPetitionerSnapshot: persistentSnapshotInvalidation.petitioners || null, persistentSnapshots: persistentSnapshotInvalidation
    };
}, AppDataService.invalidate = AppDataService.invalidate || function (sheetName, reason) {
    var result = {
        sheetName: String(sheetName || ""), sheetCache: !1, readModels: null, owner: AppDataService.owner
    };
    try {
        result.sheetCache = AppDataService.cacheRemove("sheet_current_" + String(sheetName || ""));
    }
    catch (e) {
        _appWarn_("AppDataService.invalidate.sheetCache", e, {
            sheetName
        });
    }
    return result.readModels = AppDataService.invalidateReadModelsForSheet(sheetName, reason || "invalidate"), result;
}, AppDataService.readSheetModel = AppDataService.readSheetModel || function (sheetName, options) {
    options = options || {};
    var key = String(options.cacheKey || "sheet_model:" + sheetName + ":" + String(options.version || "current"));
    if (options.forceFresh !== !0) {
        var cached = AppDataService.cacheGet(key);
        if (cached)
            return Object.assign({
                ok: !0, cacheHit: !0, cacheKey: key, owner: AppDataService.owner
            }, cached);
    }
    var rows = [];
    try {
        rows = _appIsFnName_("cachedSheetObjects_") ? cachedSheetObjects_(sheetName, options) : [];
    }
    catch (e) {
        return _appFail_("APP_DATA_SERVICE_READ_FAILED", e, {
            sheetName
        });
    }
    var model = {
        ok: !0, rows: Array.isArray(rows) ? rows : [], totalRecords: Array.isArray(rows) ? rows.length : 0, cacheHit: !1, cacheKey: key, owner: AppDataService.owner, generatedAt: new Date().toISOString()
    };
    return AppDataService.cachePut(key, model, Number(options.ttlSeconds || options.ttl || 300) || 300), model;
}, AppDataService.status = AppDataService.status || function () {
    return {
        ok: !0, owner: AppDataService.owner, version: AppDataService.VERSION, ownerMap: _appProductionOwnerMap_()
    };
}, AppDataService.productionReadModel = function (domain, payload) {
    domain = String(domain || "").toLowerCase(), payload = payload || {};
    var started = Date.now(), result;
    return (result = domain === "cases" || domain === "search" || domain === "reporttrack" ? AppDataService.readCaseSearchModel(payload) : domain === "snapshot" || domain === "dashboard" || domain === "budget" || domain === "people" || domain === "petitioner" || domain === "tracking" ? AppDataService.getReadModelSnapshot(Object.assign({}, payload, {
        domain
    })) : AppDataService.readSheetModel(domain || String(payload.sheetName || ""), payload)) && typeof result == "object" && (result.productionReadModelOwner = "AppDataService.productionReadModel", result.productionReadModelDomain = domain, result.elapsedMs = Number(result.elapsedMs || 0) || Math.max(0, Date.now() - started)), result;
}, AppDataService.readCaseSearchModel = AppDataService.readCaseSearchModel || function (payload) {
    payload = payload || {};
    var started = Date.now(), allowCache = payload.forceFresh !== !0 && payload.noCache !== !0 && payload.bypassCache !== !0, cacheTtlSeconds = allowCache ? Math.max(60, Math.min(Number(payload.cacheTtlSeconds || 180) || 180, 300)) : 0, cacheKey = "case_search_read_model_recdate_v5_" + (_appIsFnName_("_buildDigestHex_") ? _buildDigestHex_(JSON.stringify({
        q: _appIsFnName_("_normalizeSearchText_") ? _normalizeSearchText_(payload.query || payload.q || payload.keyword || "") : String(payload.query || payload.q || payload.keyword || ""), reportType: String(payload.reportType || payload.groupType || payload.type || "all").toLowerCase().trim(), reportValue: String(payload.reportValue || payload.groupValue || payload.value || "").trim(), sortBy: String(payload.sortBy || "caseNum").trim(), sortDir: String(payload.sortDir || "asc").trim().toLowerCase(), compactReadModel: payload.compactReadModel === !0 ? 1 : 0, includeMeetingHistory: payload.includeMeetingHistory === !0 ? 1 : 0, stamp: _appIsFnName_("_entityCacheStamp_") ? _entityCacheStamp_("maindata") : "1", meetingStamp: payload.includeMeetingHistory === !0 && _appIsFnName_("_entityCacheStamp_") ? _entityCacheStamp_("meeting") : "none"
    })) : String(Date.now()));
    if (allowCache && _appIsFnName_("_requestScopeGet_")) {
        var scoped = _requestScopeGet_("AppDataService.caseSearchReadModel", cacheKey);
        if (scoped && Array.isArray(scoped.rows))
            return scoped.cacheHit = !0, scoped.cacheStatus = "request-hit", scoped.durationMs = Math.max(0, Date.now() - started), scoped.owner = AppDataService.owner, scoped;
    }
    if (allowCache)
        try {
            var cached = AppDataService.cacheGet(cacheKey);
            if (cached && Array.isArray(cached.rows))
                return cached.cacheHit = !0, cached.cacheStatus = "hit", cached.durationMs = Math.max(0, Date.now() - started), cached.rowsRead = 0, cached.owner = AppDataService.owner, _appIsFnName_("_requestScopePut_") && _requestScopePut_("AppDataService.caseSearchReadModel", cacheKey, cached), cached;
        }
        catch (_readModelCacheErr) {
            _appWarn_("AppDataService.caseSearch.cacheGet", _readModelCacheErr, {
                cacheKey
            });
        }
    var rows = _appIsFnName_("_caseReportMatchRows_") ? _caseReportMatchRows_(Object.assign({}, payload, {
        forceFresh: !allowCache, noCache: !allowCache, bypassCache: !allowCache, cacheTtlSeconds
    })) : [];
    rows = (rows = Array.isArray(rows) ? rows : []).map(function (row) {
        return row = row || {}, _appIsFnName_("_caseSearchEnsureReceiveNo_") && (row = _caseSearchEnsureReceiveNo_(row)), _appIsFnName_("sanitizeRow_") && (row = sanitizeRow_(row)), row;
    }).filter(function (row) {
        var type = String(row && row.type || "").trim().toLowerCase(), label = String(row && row.typeLabel || "").trim(), deleted = String(row && (row.isDeleted || row.deleted || row.deletedAt || row.ลบ) || "").trim().toLowerCase();
        return deleted !== "true" && deleted !== "1" && deleted !== "deleted" && deleted !== "ลบ" && type !== "letter" && label !== "หนังสือ" && label !== "หนังสือติดตามมติ";
    }), _appIsFnName_("_caseSortRowsForSearch_") && (rows = _caseSortRowsForSearch_(rows, payload));
    var model = {
        ok: !0, rows, totalRecords: rows.length, query: String(payload.query || payload.q || payload.keyword || ""), reportType: String(payload.reportType || payload.groupType || payload.type || "all"), reportValue: String(payload.reportValue || payload.groupValue || payload.value || ""), source: "AppDataService.MainData.caseSearch.cacheFirst", cacheHit: !1, cacheStatus: allowCache ? "miss" : "bypass", rowsRead: rows.length, durationMs: Math.max(0, Date.now() - started), compactReadModel: payload.compactReadModel === !0, includeMeetingHistory: payload.includeMeetingHistory === !0, searchIndexSummary: _appIsFnName_("_caseBuildSearchIndexSummary_") ? _caseBuildSearchIndexSummary_(rows) : null, generatedAt: new Date().toISOString(), owner: AppDataService.owner
    };
    if (_appIsFnName_("_requestScopePut_") && _requestScopePut_("AppDataService.caseSearchReadModel", cacheKey, model), allowCache)
        try {
            AppDataService.cachePut(cacheKey, model, cacheTtlSeconds);
        }
        catch (_readModelCachePutErr) {
            _appWarn_("AppDataService.caseSearch.cachePut", _readModelCachePutErr, {
                cacheKey
            });
        }
    return model;
}, AppDataService.budgetReadModelPartitionKey = AppDataService.budgetReadModelPartitionKey || function (payload) {
    var fy;
    return payload = payload || {}, String(payload.fy || payload.fiscalYear || payload.year || "all").replace(/[^0-9a-zA-Z_-]/g, "") || "all";
}, AppDataService.budgetReadModelHeader = AppDataService.budgetReadModelHeader || function () {
    return [
        "partition", "fy", "type", "records", "totalAmount", "source", "updatedAt"
    ];
}, AppDataService.refreshBudgetTypeSummary = AppDataService.refreshBudgetTypeSummary || function (payload) {
    payload = payload || {};
    var fy = String(payload.fy || payload.fiscalYear || payload.year || "").replace(/[^0-9]/g, ""), rows = _appIsFnName_("_budgetNoWaitTypeRows_") ? _budgetNoWaitTypeRows_(Object.assign({}, payload, {
        fy, forceFresh: payload.forceFresh === !0
    })) : [], totals = _appIsFnName_("_budgetAggregateTypeSummaryRows_") ? _budgetAggregateTypeSummaryRows_(rows) : {
        byTypeRows: []
    }, now = new Date().toISOString(), key = AppDataService.budgetReadModelPartitionKey(payload), header = AppDataService.budgetReadModelHeader(), values = (totals.byTypeRows || []).map(function (r) {
        return [
            key, fy, String(r && r.type || "อื่น ๆ"), Number(r && r.records || 0), Number(r && r.totalAmount || 0), "BudgetImports", now
        ];
    });
    try {
        AppDataService.cachePut("budget:type-summary:fy:" + fy, {
            rows: values, header, fy, source: "BudgetImports/cache-only/AppDataService", updatedAt: now, owner: AppDataService.owner
        }, 21600);
    }
    catch (e) {
        _appWarn_("AppDataService.budget.typeSummary.cachePut", e, {
            fy
        });
    }
    var clear = _appIsFnName_("_budgetClearTypeSummaryDirty_") ? _budgetClearTypeSummaryDirty_(fy) : null;
    return {
        ok: !0, fy, rowsWritten: 0, cacheRows: values.length, source: "BudgetImports/cache-only/AppDataService", updatedAt: now, dirtyMarkerStateCleared: clear, owner: AppDataService.owner
    };
}, AppDataService.readModelNow = AppDataService.readModelNow || function () {
    return new Date().toISOString();
}, AppDataService.readModelTargetKey = AppDataService.readModelTargetKey || function (payload) {
    return payload = payload || {}, String(payload.targetKey || payload.fy || payload.fiscalYear || payload.budgetFy || "default");
}, AppDataService.readModelSnapshotDomainMap = AppDataService.readModelSnapshotDomainMap || function () {
    return {
        dashboard: "dashboard", budget: "budgetsummary", budgetsummary: "budgetsummary", budgettypesummary: "budgettypesummary", people: "people", personnel: "people", tracking: "tracking", track: "tracking", cases: "cases", search: "cases", petitioner: "petitioners", petitioners: "petitioners", lookups: "lookups"
    };
}, AppDataService.readModelCanonicalDomain = AppDataService.readModelCanonicalDomain || function (domain) {
    return domain = String(domain || "dashboard").toLowerCase(), AppDataService.readModelSnapshotDomainMap()[domain] || domain;
}, AppDataService.buildReadModelPayload = AppDataService.buildReadModelPayload || function (domain, targetKey, payload) {
    var auth = {
        token: (payload = payload || {}).token || payload._token || "", _token: payload._token || payload.token || "", csrfToken: payload.csrfToken || payload.csrf || "", actionToken: payload.actionToken || ""
    }, base = Object.assign({}, payload, auth, {
        targetKey, fy: payload.fy || payload.fiscalYear || targetKey
    });
    return (domain = AppDataService.readModelCanonicalDomain(domain)) === "dashboard" ? Object.assign(base, {
        includeSchema: !1, includeHealth: !1, includeReportOptions: !1, includeBudget: payload.includeBudget === !0, includeCases: payload.includeCases === !0, caseLimit: Number(payload.caseLimit || 20)
    }) : domain === "budgettypesummary" ? Object.assign(base, {
        page: 1, limit: Math.max(50, Math.min(Number(payload.limit || 200) || 200, 200)), allowLiveDirectRead: payload.allowLiveDirectRead === !0
    }) : domain === "tracking" ? Object.assign(base, {
        page: 1, limit: Math.min(Number(payload.limit || 25) || 25, 25), sortBy: "dueDate", sortDir: "asc"
    }) : domain === "cases" ? Object.assign(base, {
        page: 1, limit: Math.max(25, Math.min(Number(payload.limit || 100) || 100, 200))
    }) : domain === "people" ? Object.assign(base, {
        lite: payload.lite !== !1
    }) : base;
}, AppDataService.buildReadModel = AppDataService.buildReadModel || function (domain, targetKey, payload) {
    domain = AppDataService.readModelCanonicalDomain(domain);
    var p = AppDataService.buildReadModelPayload(domain, targetKey, payload || {});
    if (domain === "dashboard" && _appIsFnName_("apiGetDashboardBundle"))
        return apiGetDashboardBundle(p);
    if (domain === "budgetsummary" && _appIsFnName_("apiBudgetGetSummary"))
        return apiBudgetGetSummary(p);
    if (domain === "budgettypesummary" && _appIsFnName_("apiBudgetGetTypeSummaryByFY"))
        return apiBudgetGetTypeSummaryByFY(p);
    if (domain === "people" && _appIsFnName_("apiGetPeoplePageBundle"))
        return apiGetPeoplePageBundle(p);
    if (domain === "tracking" && _appIsFnName_("apiGetTracking"))
        return apiGetTracking(p);
    if (domain === "cases" && _appIsFnName_("apiSearchCasesLite"))
        return apiSearchCasesLite(p);
    if (domain === "petitioners" && _appIsFnName_("apiGetPetitioners"))
        return apiGetPetitioners(p);
    if (domain === "lookups" && _appIsFnName_("apiGetThailandLocations"))
        return apiGetThailandLocations(p);
    throw new Error("READ_MODEL_DOMAIN_UNSUPPORTED: " + domain);
}, AppDataService.unwrapReadModelResult = AppDataService.unwrapReadModelResult || function (result) {
    if (result && result.ok === !1)
        throw new Error(String(result.error || result.msg || "READ_MODEL_API_FAILED"));
    return result && result.data !== void 0 ? result.data : result || {};
}, AppDataService.readModelGet = AppDataService.readModelGet || function (domain, targetKey, payload) {
    domain = AppDataService.readModelCanonicalDomain(domain), targetKey = String(targetKey || "default");
    var snap = null;
    if (_appIsFnName_("_performanceReadSnapshot_") && (!payload || payload.forceFresh !== !0))
        try {
            snap = _performanceReadSnapshot_(domain, targetKey);
        }
        catch (_snapErr) {
            snap = null;
        }
    if (snap && snap.ok)
        return {
            ok: !0, domain, targetKey, bundle: snap.data, snapshot: snap.meta || {}, cacheHit: !!snap.cacheHit, source: "AppDataService.materialized-snapshot-hit", generatedAt: AppDataService.readModelNow(), owner: AppDataService.owner
        };
    var built = AppDataService.unwrapReadModelResult(AppDataService.buildReadModel(domain, targetKey, payload || {})), write = null;
    if (_appIsFnName_("_performanceWriteSnapshot_"))
        try {
            write = _performanceWriteSnapshot_(domain, targetKey, built, {
                source: "AppDataService.read-model-refresh", ttlSeconds: Number(payload && payload.ttlSeconds || 21600) || 21600, readModelStamp: "app-data-service-read-model-current"
            });
        }
        catch (_writeErr) {
            write = {
                ok: !1, error: String(_writeErr && _writeErr.message || _writeErr)
            };
        }
    return {
        ok: !0, domain, targetKey, bundle: built, snapshot: write, cacheHit: !1, source: "AppDataService.materialized-refresh-on-miss", generatedAt: AppDataService.readModelNow(), owner: AppDataService.owner
    };
}, AppDataService.getReadModelSnapshot = AppDataService.getReadModelSnapshot || function (payload) {
    payload = payload || {};
    var domain = AppDataService.readModelCanonicalDomain(payload.domain || payload.page || "dashboard"), targetKey = AppDataService.readModelTargetKey(payload);
    return AppDataService.readModelGet(domain, targetKey, payload);
};

function _repositoryRegistrySingleOwnerStatus_() {
    var status = AppRepositoryRegistry && typeof AppRepositoryRegistry.status == "function" ? AppRepositoryRegistry.status() : null, release = typeof APP_DEPLOY_RELEASE != "undefined" ? APP_DEPLOY_RELEASE : null, missing = [];
    _appReleaseCapability_("repositoryRegistrySingleOwner") || missing.push("capability.repositoryRegistrySingleOwner");
    status && status.ok || missing.push("registry.status");
    return {
        ok: missing.length === 0,
        stamp: "repository-registry-single-owner-gate-r205",
        owner: "Code_01_Platform_SheetRepo.AppRepositoryRegistry",
        registry: status,
        directDomainWritersAllowed: !1,
        apiRoutesChanged: !1,
        fileCountChanged: !1,
        uiDomChanged: !1,
        businessLogicChanged: !1,
        missing: missing
    };
}
function _appRepositoryOwnerStatus_() {
    var required = ["getSpreadsheet", "getSheet", "readMatrix", "getRangeValues", "setRangeValues", "setCellValue", "clearSheetContents", "clearRangeContent", "readObjects", "page", "invalidateDomain", "afterWrite", "withWriteLock", "writeObject"], missing = [];
    required.forEach(function (name) { AppRepository && typeof AppRepository[name] == "function" || missing.push(name); });
    AppRepository && String(AppRepository.owner || "").indexOf("Code_01_Platform_SheetRepo") === 0 || missing.push("owner");
    var cacheMode = _appIsFnName_("_appCacheRequestModeStatus_") ? _appCacheRequestModeStatus_() : null, registry = _repositoryRegistrySingleOwnerStatus_();
    cacheMode && cacheMode.ok || missing.push("cacheRequestMode");
    registry && registry.ok || missing.push("repositoryRegistry");
    return { ok: missing.length === 0, stamp: "repository-owner-canonical-r205", owner: String(AppRepository && AppRepository.owner || ""), bootstrapOwner: String(AppRepository && AppRepository.bootstrapOwner || ""), methodCount: required.length, repositoryRegistry: registry, cacheRequestMode: cacheMode, fallbackDepth: APP_CACHE_GOVERNANCE_CURRENT.maxFallbackDepth, noNewApi: !0, noNewFiles: !0, missing: missing };
}
function _performanceSnapshotKey_(domain, targetKey) {
    domain = AppDataService.readModelCanonicalDomain(domain || "dashboard"), targetKey = String(targetKey || "default");
    var seed = JSON.stringify({
        domain, targetKey, stamp: "summary-snapshot-v2-2026-07-02"
    }), digest = "";
    try {
        digest = _appIsFnName_("_appSha256Hex_") ? _appSha256Hex_(seed).substring(0, 32) : seed.replace(/[^A-Za-z0-9_-]/g, "_").substring(0, 80);
    }
    catch (_digestErr) {
        digest = String(Date.now());
    }
    return "summary_snapshot_v2_" + domain + "_" + digest;
}
function _performanceReadSnapshot_(domain, targetKey) {
    var key = _performanceSnapshotKey_(domain, targetKey), snap = null;
    try {
        snap = AppDataService.cacheGet(key);
    }
    catch (_readErr) {
        _appWarn_("AppDataService.summarySnapshot.read", _readErr, {
            domain, targetKey
        });
    }
    return !snap || !snap.bundle ? null : {
        ok: !0, data: snap.bundle, meta: Object.assign({}, snap.meta || {}, {
            cacheKey: key, readAt: AppDataService.readModelNow()
        }), cacheHit: !0, source: "AppDataService.summarySnapshot.cache"
    };
}
function _performanceWriteSnapshot_(domain, targetKey, bundle, meta) {
    var key = _performanceSnapshotKey_(domain, targetKey), now = AppDataService.readModelNow(), envelope = {
        ok: !0, domain: AppDataService.readModelCanonicalDomain(domain || "dashboard"), targetKey: String(targetKey || "default"), bundle: bundle || {}, meta: Object.assign({}, meta || {}, {
            cacheKey: key, writtenAt: now, owner: "AppDataService.summarySnapshot", snapshotStamp: "summary-snapshot-v2-2026-07-02"
        }), generatedAt: now, owner: AppDataService.owner
    }, stored = !1;
    try {
        stored = AppDataService.cachePut(key, envelope, Number(meta && meta.ttlSeconds || 21600) || 21600);
    }
    catch (_writeErr) {
        _appWarn_("AppDataService.summarySnapshot.write", _writeErr, {
            domain, targetKey
        });
    }
    return {
        ok: !!stored, domain: envelope.domain, targetKey: envelope.targetKey, cacheKey: key, stored: !!stored, generatedAt: now, owner: "AppDataService.summarySnapshot"
    };
}

/**
 * Performance G/H/I persistent summary snapshot repository.
 *
 * CacheService remains the first-level cache. This hidden-sheet read model is
 * only used after CacheService eviction or a new GAS container. It stores
 * compact role-safe Dashboard, Tracking-index, and case-related read models;
 * it never stores credentials, tokens, or mutation payloads.
 */
var PERFORMANCE_G_PERSISTENT_SNAPSHOT = Object.freeze({
    sheetName: "SYS_DASHBOARD_SNAPSHOT",
    version: "persistent-summary-read-model-m13-r237",
    chunkChars: 40000,
    ttlSeconds: 1800,
    headers: Object.freeze([
        "snapshotKey", "domain", "targetKey", "role", "version",
        "shapeStamp", "generatedAt", "expiresAt", "chunkNo",
        "chunkCount", "payloadHash", "payloadJson"
    ])
});
function _persistentSummarySnapshotDigest_(value) {
    var text = String(value == null ? "" : value);
    try {
        return _appIsFnName_("_appSha256Hex_") ? _appSha256Hex_(text) : Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8)).replace(/=+$/g, "");
    }
    catch (_digestErr) {
        var hash = 2166136261;
        for (var i = 0; i < text.length; i++)
            hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
        return (hash >>> 0).toString(16);
    }
}
function _persistentSummarySnapshotKey_(domain, targetKey, role) {
    var seed = JSON.stringify({
        domain: String(domain || "dashboard").toLowerCase(),
        targetKey: String(targetKey || "default"),
        role: String(role || "viewer").toLowerCase(),
        version: PERFORMANCE_G_PERSISTENT_SNAPSHOT.version
    });
    return "pss_current_" + _persistentSummarySnapshotDigest_(seed).slice(0, 40);
}
var APP_PERSISTENT_SNAPSHOT_ENTITY_PARTITIONS_CURRENT = Object.freeze({
    dashboard: Object.freeze([
        "dashboard", "maindata", "cases", "letters", "tracking",
        "meeting", "meetinglogs", "budget", "budgetimports",
        "budgetsummary", "people", "petitioners"
    ]),
    tracking: Object.freeze(["letters", "tracking", "maindata", "cases"]),
    "case-search": Object.freeze(["maindata", "case", "cases", "meeting", "meetinglogs"]),
    "case-report": Object.freeze(["maindata", "case", "cases", "meeting", "meetinglogs"]),
    "case-related": Object.freeze(["cases", "letters", "meetinglogs", "meetings"]),
    budgetsummary: Object.freeze([
        "budget", "budgetimports", "budgetsummary",
        "budgetyearsettingsitems", "personnel_staff",
        "salarypayments", "salarysettings"
    ]),
    petitioners: Object.freeze(["petitioners", "maindata", "cases"])
});
function _persistentSummarySnapshotSourceShape_(domain) {
    domain = String(domain || "dashboard").toLowerCase();
    var entities = APP_PERSISTENT_SNAPSHOT_ENTITY_PARTITIONS_CURRENT[domain] || null;
    if (!entities)
        return { stamp: "unsupported", sheets: [], entityStamps: [] };
    var stamps = entities.map(function (entity) {
        return {
            entity: entity,
            stamp: _appIsFnName_("_entityCacheStamp_")
                ? String(_entityCacheStamp_(entity) || "1")
                : "1"
        };
    });
    return {
        stamp: _persistentSummarySnapshotDigest_(JSON.stringify(stamps)).slice(0, 32),
        sheets: [],
        entityStamps: stamps,
        partitionOwner: "Current.PersistentSnapshotEntityGeneration"
    };
}
function _persistentSummarySnapshotEnsureSheet_() {
    var cfg = PERFORMANCE_G_PERSISTENT_SNAPSHOT, ss = getSpreadsheet_(), sh = getSheetOptional_(cfg.sheetName);
    if (!sh) {
        sh = ss.insertSheet(cfg.sheetName);
        _spreadsheetContextRegisterSheet_(cfg.sheetName, sh);
        sh.getRange(1, 1, 1, cfg.headers.length).setValues([cfg.headers.slice()]);
        sh.setFrozenRows(1);
        try { sh.hideSheet(); } catch (_hideErr) { _appIgnore_(_hideErr, "c.s"); }
        return sh;
    }
    var width = Math.max(cfg.headers.length, Number(sh.getLastColumn && sh.getLastColumn()) || 0), current = width ? sh.getRange(1, 1, 1, width).getValues()[0] : [], mismatch = cfg.headers.some(function (header, idx) {
        return String(current[idx] || "") !== header;
    });
    if (mismatch)
        sh.getRange(1, 1, 1, cfg.headers.length).setValues([cfg.headers.slice()]);
    try { sh.hideSheet(); } catch (_hideErr2) { _appIgnore_(_hideErr2, "c.s"); }
    return sh;
}
function _persistentSummarySnapshotRows_(sh) {
    var cfg = PERFORMANCE_G_PERSISTENT_SNAPSHOT, lastRow = Math.max(0, Number(sh && sh.getLastRow && sh.getLastRow()) || 0);
    if (!sh || lastRow < 2)
        return [];
    return sh.getRange(2, 1, lastRow - 1, cfg.headers.length).getValues().filter(function (row) {
        return row && String(row[0] || "").trim();
    });
}
function _persistentSummarySnapshotPruneRowsCurrent_(rows, now) {
    rows = Array.isArray(rows) ? rows : [];
    now = Math.max(0, Number(now || Date.now()) || Date.now());
    var caps = {
        dashboard: 8,
        budgetsummary: 12,
        petitioners: 4,
        tracking: 4,
        "case-search": 8,
        "case-report": 4,
        "case-related": 80
    }, groups = {}, order = [];
    rows.forEach(function (row) {
        if (!row || !String(row[0] || "").trim())
            return;
        var expiresAt = Math.max(0, Number(row[7] || 0) || 0);
        if (expiresAt && expiresAt < now)
            return;
        var domain = String(row[1] || "dashboard").toLowerCase(), key = String(row[0] || ""), groupKey = domain + "|" + key;
        if (!groups[groupKey]) {
            groups[groupKey] = {
                domain: domain,
                key: key,
                generatedAt: Date.parse(String(row[6] || "")) || 0,
                rows: []
            };
            order.push(groupKey);
        }
        groups[groupKey].rows.push(row);
    });
    var selected = {};
    Object.keys(caps).forEach(function (domain) {
        Object.keys(groups).map(function (groupKey) {
            return groups[groupKey];
        }).filter(function (group) {
            return group.domain === domain;
        }).sort(function (a, b) {
            return b.generatedAt - a.generatedAt;
        }).slice(0, caps[domain]).forEach(function (group) {
            selected[group.domain + "|" + group.key] = !0;
        });
    });
    Object.keys(groups).forEach(function (groupKey) {
        var group = groups[groupKey];
        if (!Object.prototype.hasOwnProperty.call(caps, group.domain))
            selected[groupKey] = !0;
    });
    var out = [];
    order.forEach(function (groupKey) {
        if (selected[groupKey])
            out = out.concat(groups[groupKey].rows);
    });
    return out;
}
function _persistentSummarySnapshotRowsForKey_(sh, key) {
    var cfg = PERFORMANCE_G_PERSISTENT_SNAPSHOT,
        lastRow = Math.max(0, Number(sh && sh.getLastRow && sh.getLastRow()) || 0);
    if (!sh || lastRow < 2 || !String(key || ""))
        return [];
    try {
        var keyRange = sh.getRange(2, 1, lastRow - 1, 1), finder = keyRange.createTextFinder(String(key)).matchEntireCell(!0), matches = finder.findAll() || [];
        return matches.map(function (match) {
            return sh.getRange(match.getRow(), 1, 1, cfg.headers.length).getValues()[0];
        }).filter(function (row) {
            return row && String(row[0] || "") === String(key);
        });
    }
    catch (_finderErr) {
        _appWarn_("persistentSummarySnapshot.keyLookup", _finderErr, { key: key });
        return _persistentSummarySnapshotRows_(sh).filter(function (row) {
            return String(row[0] || "") === String(key);
        });
    }
}
function _persistentSummarySnapshotRowNumbersForKey_(sh, key) {
    var lastRow = Math.max(0, Number(sh && sh.getLastRow && sh.getLastRow()) || 0);
    if (!sh || lastRow < 2 || !String(key || ""))
        return [];
    try {
        var matches = sh.getRange(2, 1, lastRow - 1, 1)
            .createTextFinder(String(key))
            .matchEntireCell(!0)
            .findAll() || [];
        return matches.map(function (match) {
            return Number(match.getRow() || 0) || 0;
        }).filter(function (rowNo) {
            return rowNo >= 2;
        }).sort(function (a, b) {
            return a - b;
        });
    }
    catch (_finderErr) {
        _appWarn_("persistentSummarySnapshot.rowNumbers", _finderErr, { key: key });
        return [];
    }
}
function _persistentSummarySnapshotContiguousSpans_(rowNumbers) {
    var rows = (Array.isArray(rowNumbers) ? rowNumbers : [])
        .map(function (n) { return Number(n || 0) || 0; })
        .filter(function (n) { return n >= 2; })
        .sort(function (a, b) { return a - b; });
    if (!rows.length)
        return [];
    var spans = [], start = rows[0], prev = rows[0];
    for (var i = 1; i < rows.length; i++) {
        if (rows[i] === prev + 1) {
            prev = rows[i];
            continue;
        }
        spans.push({ startRow: start, rowCount: prev - start + 1 });
        start = prev = rows[i];
    }
    spans.push({ startRow: start, rowCount: prev - start + 1 });
    return spans;
}
function _persistentSummarySnapshotClearRows_(sh, rowNumbers) {
    var cfg = PERFORMANCE_G_PERSISTENT_SNAPSHOT, spans = _persistentSummarySnapshotContiguousSpans_(rowNumbers);
    spans.forEach(function (span) {
        sh.getRange(span.startRow, 1, span.rowCount, cfg.headers.length).clearContent();
    });
    return { clearedRows: rowNumbers.length, spans: spans.length };
}
function _persistentSummarySnapshotCompactIfNeeded_(sh, force) {
    var cfg = PERFORMANCE_G_PERSISTENT_SNAPSHOT, lastRow = Math.max(0, Number(sh && sh.getLastRow && sh.getLastRow()) || 0);
    if (!sh || (!force && lastRow <= 600))
        return { compacted: !1, lastRow: lastRow };
    var existing = _persistentSummarySnapshotRows_(sh),
        keep = _persistentSummarySnapshotPruneRowsCurrent_(existing, Date.now()),
        clearRows = Math.max(0, lastRow - 1);
    if (clearRows > 0)
        sh.getRange(2, 1, clearRows, cfg.headers.length).clearContent();
    if (keep.length)
        sh.getRange(2, 1, keep.length, cfg.headers.length).setValues(keep);
    return { compacted: !0, beforeRows: existing.length, afterRows: keep.length };
}
function _persistentSummarySnapshotRead_(domain, targetKey, role, options) {
    options = options || {};
    var cfg = PERFORMANCE_G_PERSISTENT_SNAPSHOT, ss = getSpreadsheet_(), sh = getSheetOptional_(cfg.sheetName);
    if (!sh)
        return null;
    var key = _persistentSummarySnapshotKey_(domain, targetKey, role), now = Date.now(), selected = _persistentSummarySnapshotRowsForKey_(sh, key).filter(function (row) {
        return String(row[1] || "").toLowerCase() === String(domain || "dashboard").toLowerCase() &&
            String(row[4] || "") === cfg.version;
    });
    if (!selected.length)
        return null;
    var expiresAt = Number(selected[0][7] || 0) || 0;
    if (expiresAt && expiresAt < now)
        return null;
    var expectedShape = String(selected[0][5] || ""), currentShape = _persistentSummarySnapshotSourceShape_(domain);
    if (expectedShape && currentShape.stamp !== expectedShape)
        return null;
    selected.sort(function (a, b) { return Number(a[8] || 0) - Number(b[8] || 0); });
    var expectedCount = Number(selected[0][9] || 0) || selected.length;
    if (selected.length !== expectedCount)
        return null;
    var text = selected.map(function (row) { return String(row[11] || ""); }).join(""), expectedHash = String(selected[0][10] || "");
    if (expectedHash && _persistentSummarySnapshotDigest_(text) !== expectedHash)
        return null;
    try {
        var envelope = JSON.parse(text);
        if (!envelope || !envelope.bundle)
            return null;
        return {
            ok: !0,
            bundle: envelope.bundle,
            meta: Object.assign({}, envelope.meta || {}, {
                snapshotKey: key,
                persistentSnapshotHit: !0,
                source: "PersistentSummarySnapshot.read-r163",
                shapeStamp: currentShape.stamp,
                expiresAt: expiresAt,
                readAt: new Date().toISOString()
            })
        };
    }
    catch (_parseErr) {
        _appWarn_("persistentSummarySnapshot.read.parse", _parseErr, { domain: domain, targetKey: targetKey, role: role });
        return null;
    }
}
function _persistentSummarySnapshotWrite_(domain, targetKey, role, bundle, meta) {
    meta = meta || {};
    var cfg = PERFORMANCE_G_PERSISTENT_SNAPSHOT, text = JSON.stringify({
        bundle: bundle || {},
        meta: Object.assign({}, meta || {}, {
            version: cfg.version,
            writtenAt: new Date().toISOString()
        })
    }), key = _persistentSummarySnapshotKey_(domain, targetKey, role),
        hash = _persistentSummarySnapshotDigest_(text), chunks = [],
        chunkSize = Math.max(10000, Number(cfg.chunkChars || 40000) || 40000);
    for (var pos = 0; pos < text.length; pos += chunkSize)
        chunks.push(text.slice(pos, pos + chunkSize));
    chunks.length || chunks.push("");
    var lock = null, locked = !1;
    try {
        lock = LockService.getDocumentLock();
        locked = !lock || lock.tryLock(3000);
        if (!locked)
            return { ok: !1, stored: !1, reason: "lock-timeout", snapshotKey: key };
        var sh = _persistentSummarySnapshotEnsureSheet_(),
            oldRows = _persistentSummarySnapshotRowNumbersForKey_(sh, key),
            cleared = _persistentSummarySnapshotClearRows_(sh, oldRows),
            now = Date.now(), shape = _persistentSummarySnapshotSourceShape_(domain),
            ttl = Math.max(300, Math.min(Number(meta.ttlSeconds || cfg.ttlSeconds) || cfg.ttlSeconds, 21600)),
            generatedAt = new Date(now).toISOString(), expiresAt = now + ttl * 1000,
            newRows = chunks.map(function (chunk, idx) {
                return [
                    key, String(domain || "dashboard").toLowerCase(), String(targetKey || "default"),
                    String(role || "viewer").toLowerCase(), cfg.version, shape.stamp,
                    generatedAt, expiresAt, idx + 1, chunks.length, hash, chunk
                ];
            }),
            startRow = Math.max(2, Number(sh.getLastRow && sh.getLastRow()) + 1 || 2);
        sh.getRange(startRow, 1, newRows.length, cfg.headers.length).setValues(newRows);
        var compact = _persistentSummarySnapshotCompactIfNeeded_(sh, !1);
        return {
            ok: !0, stored: !0, snapshotKey: key, chunks: chunks.length,
            bytes: text.length, shapeStamp: shape.stamp, expiresAt: expiresAt,
            source: "PersistentSummarySnapshot.write-m13-r237",
            partitionedWrite: !0,
            replacedRows: oldRows.length,
            clearSpans: Number(cleared.spans || 0),
            compacted: !!compact.compacted
        };
    }
    catch (_writeErr) {
        _appWarn_("persistentSummarySnapshot.write", _writeErr, { domain: domain, targetKey: targetKey, role: role });
        return { ok: !1, stored: !1, snapshotKey: key, error: String(_writeErr && _writeErr.message || _writeErr) };
    }
    finally {
        try { locked && lock && lock.releaseLock(); } catch (_unlockErr) { _appIgnore_(_unlockErr, "c.s"); }
    }
}
function _persistentSummarySnapshotInvalidate_(domain, reason) {
    domain = String(domain || "dashboard").toLowerCase();
    var cfg = PERFORMANCE_G_PERSISTENT_SNAPSHOT, sh = getSheetOptional_(cfg.sheetName);
    if (!sh)
        return { ok: !0, invalidated: !1, reason: "sheet-missing" };
    var lock = null, locked = !1;
    try {
        lock = LockService.getDocumentLock();
        locked = !lock || lock.tryLock(3000);
        if (!locked)
            return { ok: !1, invalidated: !1, reason: "lock-timeout" };
        var lastRow = Math.max(0, Number(sh.getLastRow && sh.getLastRow()) || 0);
        if (lastRow < 2)
            return { ok: !0, invalidated: !1, removed: 0, reason: String(reason || "source-write") };
        var domainValues = sh.getRange(2, 2, lastRow - 1, 1).getValues(),
            rows = [];
        domainValues.forEach(function (row, idx) {
            String(row && row[0] || "").toLowerCase() === domain && rows.push(idx + 2);
        });
        var cleared = _persistentSummarySnapshotClearRows_(sh, rows),
            compact = _persistentSummarySnapshotCompactIfNeeded_(sh, !1);
        return {
            ok: !0,
            invalidated: rows.length > 0,
            removed: rows.length,
            reason: String(reason || "source-write"),
            partitionedInvalidation: !0,
            scannedCells: Math.max(0, lastRow - 1),
            clearSpans: Number(cleared.spans || 0),
            compacted: !!compact.compacted
        };
    }
    catch (_invalidateErr) {
        _appWarn_("persistentSummarySnapshot.invalidate", _invalidateErr, { domain: domain, reason: reason });
        return { ok: !1, invalidated: !1, error: String(_invalidateErr && _invalidateErr.message || _invalidateErr) };
    }
    finally {
        try { locked && lock && lock.releaseLock(); } catch (_unlockErr2) { _appIgnore_(_unlockErr2, "c.s"); }
    }
}

AppDataService.summarySnapshotTargetsForSheet = AppDataService.summarySnapshotTargetsForSheet || function (sheetName) {
    var map = {
        MainData: [
            "dashboard"
        ], MeetingLogs: [
            "dashboard"
        ], Letters: [
            "dashboard"
        ], BudgetImports: [
            "budgetsummary", "dashboard"
        ], BudgetSummary: [
            "budgetsummary", "dashboard"
        ]
    };
    return map[String(sheetName || "").trim()] || [];
}, AppDataService.summarySnapshotTargetKey = AppDataService.summarySnapshotTargetKey || function (domain, sheetName, payload) {
    if (payload = payload || {}, domain = AppDataService.readModelCanonicalDomain(domain || "dashboard"), domain === "budgetsummary") {
        var fy = String(payload.fy || payload.fiscalYear || payload.year || "").replace(/[^0-9]/g, "");
        if (!fy && _appIsFnName_("_resolveBudgetDefaultFiscalYear_"))
            try {
                fy = String(_resolveBudgetDefaultFiscalYear_() || "").replace(/[^0-9]/g, "");
            }
            catch (_fyErr) {
                fy = "";
            }
        return fy || "default";
    }
    return "default";
}, AppDataService.refreshSummarySnapshotsAfterInvalidation = AppDataService.refreshSummarySnapshotsAfterInvalidation || function (sheetName, reason, payload) {
    payload = payload || {};
    var enabled = payload.refreshSnapshots === !0 || String(_appIsFnName_("_scriptProp_") ? _scriptProp_("SUMMARY_SNAPSHOT_REFRESH_ON_WRITE", "N") : "N").trim().toUpperCase() === "Y", targets = AppDataService.summarySnapshotTargetsForSheet(sheetName), out = [];
    return !enabled || !targets.length ? {
        refreshed: !1, skipped: !0, reason: enabled ? "no-summary-target" : "disabled", targets, owner: AppDataService.owner
    } : (targets.forEach(function (domain) {
        var targetKey = AppDataService.summarySnapshotTargetKey(domain, sheetName, payload), item = {
            domain: AppDataService.readModelCanonicalDomain(domain), targetKey, ok: !1
        };
        try {
            var refreshPayload = Object.assign({}, payload, {
                domain, targetKey, forceFresh: !0, noCache: !0, bypassCache: !0, __snapshotRefreshAfterInvalidation: !0, __sourceSheet: String(sheetName || ""), __reason: String(reason || "write"), ttlSeconds: Number(payload.ttlSeconds || 21600) || 21600
            });
            AppDataService.readModelCanonicalDomain(domain) === "dashboard" && (refreshPayload.includeBudget = !0, refreshPayload.includeCases = !1, refreshPayload.includeMeetingRows = !1, refreshPayload.snapshotRefreshMode = "dashboard-budget-safe-after-invalidation");
            var res = AppDataService.readModelGet(domain, targetKey, refreshPayload);
            item.ok = !!(res && res.ok), item.source = String(res && res.source || ""), item.snapshot = res && res.snapshot || null;
        }
        catch (e) {
            item.ok = !1, item.error = String(e && e.message || e), _appWarn_("AppDataService.summarySnapshot.refreshTarget", e, {
                domain, sheetName
            });
        }
        out.push(item);
    }), {
        refreshed: out.some(function (x) {
            return x.ok;
        }), targets: out, sourceSheet: String(sheetName || ""), reason: String(reason || "write"), owner: AppDataService.owner, snapshotStamp: "summary-snapshot-v2-2026-07-02"
    });
};
var _CACHE_SOFT_LIMIT_BYTES_ = 92160;
function _cacheSoftLimitBytes_() {
    var raw = Number(_scriptProp_("CACHE_SOFT_LIMIT_BYTES", _CACHE_SOFT_LIMIT_BYTES_));
    return isFinite(raw) && raw > 0 ? raw : _CACHE_SOFT_LIMIT_BYTES_;
}
function _cacheByteLength_(value) {
    try {
        var text = typeof value == "string" ? value : JSON.stringify(value);
        return Utilities.newBlob(String(text || "")).getBytes().length;
    }
    catch (_e) {
        return _recordWarning_("ec", _e), String(value || "").length;
    }
}
function _AppScriptCache_() {
    try {
        return CacheService.getScriptCache();
    }
    catch (e) {
        return _serverLog_("warn", "cache.script.unavailable", {
            error: String(e && e.message || e)
        }), null;
    }
}
function _AppCacheKey_(key) {
    return (key = String(key || "")).length > 230 ? key.slice(0, 80) + ":" + _appSha256Hex_(key).slice(0, 48) : key;
}
function _AppCacheGetJson_(key) {
    try {
        var cache = _AppScriptCache_();
        if (!cache || !key)
            return null;
        var raw = cache.get(_AppCacheKey_(key));
        return raw ? JSON.parse(raw) : null;
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C00"
        }), null;
    }
}
function _AppCachePutJson_(key, value, ttl) {
    try {
        var cache = _AppScriptCache_();
        return !(!cache || !key) && safeCachePut_(cache, _AppCacheKey_(key), value, Math.max(30, Number(ttl || 120)));
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C00"
        }), !1;
    }
}
var APP_DURABLE_CACHE_GENERATION_REPOSITORY_CURRENT = Object.freeze({
    stamp: "f1-durable-cache-generation-2026-08-07-r229",
    owner: "Code_01_Platform_SheetRepo.DurableCacheGeneration",
    propertyPrefix: "cache_ver_",
    persistentSource: "PropertiesService.ScriptProperties",
    accelerator: "CacheService.ScriptCache + execution cache",
    lockPolicy: "join canonical root Script Lock or acquire one Script Lock",
    writePolicy: "allowlisted runtime state only; configuration properties remain governed and read-only",
    batchPersistence: !0,
    monotonic: !0,
    cacheEvictionSafe: !0
});
function _cacheGenerationEntity_(entityName) {
    return String(entityName || "").trim().toLowerCase() || "default";
}
function _cacheGenerationKey_(entityName) {
    return APP_DURABLE_CACHE_GENERATION_REPOSITORY_CURRENT.propertyPrefix + _cacheGenerationEntity_(entityName);
}
function _cacheGenerationNumber_(value, fallback) {
    var n = Number(value);
    return isFinite(n) && n >= 1 ? Math.floor(n) : Math.max(1, Number(fallback || 1) || 1);
}
function _cacheGenerationUpdateSnapshot_(updates) {
    updates = updates && typeof updates == "object" ? updates : {};
    try {
        var exec = _appIsFnName_("_execCache_") ? _execCache_() : null;
        if (exec && exec.scriptPropertiesSnapshot && typeof exec.scriptPropertiesSnapshot == "object")
            Object.keys(updates).forEach(function (key) { exec.scriptPropertiesSnapshot[key] = String(updates[key]); });
    }
    catch (err) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("cache.generation.snapshot", err);
    }
}
function _cacheGenerationWithLock_(fn) {
    if (typeof fn != "function")
        throw new Error("CACHE_GENERATION_CALLBACK_REQUIRED");
    if (typeof __APP_WRITE_LOCK_DEPTH__ == "number" && __APP_WRITE_LOCK_DEPTH__ > 0)
        return fn({ joinedRootWriteLock: !0, acquiredLock: !1 });
    var lock = null, acquired = !1;
    try {
        lock = typeof LockService != "undefined" && LockService.getScriptLock ? LockService.getScriptLock() : null;
        if (!lock || typeof lock.waitLock != "function")
            throw new Error("CACHE_GENERATION_SCRIPT_LOCK_UNAVAILABLE");
        lock.waitLock(1e4), acquired = !0;
        return fn({ joinedRootWriteLock: !1, acquiredLock: acquired });
    }
    finally {
        if (lock && acquired && lock.releaseLock)
            try { lock.releaseLock(); }
            catch (releaseErr) { _appIsFnName_("_recordWarning_") && _recordWarning_("cache.generation.lock.release", releaseErr); }
    }
}
function _cacheGenerationReadProperties_() {
    try {
        return PropertiesService.getScriptProperties().getProperties() || {};
    }
    catch (err) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("cache.generation.properties.read", err);
        throw err;
    }
}
function _cacheGenerationPersist_(updates) {
    updates = updates && typeof updates == "object" ? updates : {};
    var clean = {};
    Object.keys(updates).forEach(function (key) {
        key = String(key || "");
        if (key.indexOf(APP_DURABLE_CACHE_GENERATION_REPOSITORY_CURRENT.propertyPrefix) !== 0 || !/^cache_ver_[^\u0000-\u001f]{1,160}$/.test(key))
            throw new Error("CACHE_GENERATION_PROPERTY_NOT_ALLOWLISTED:" + key);
        clean[key] = String(_cacheGenerationNumber_(updates[key], 1));
    });
    if (!Object.keys(clean).length)
        return !0;
    PropertiesService.getScriptProperties().setProperties(clean, !1);
    _cacheGenerationUpdateSnapshot_(clean);
    return !0;
}
function _entityCacheStamp_(entityName) {
    var key = _cacheGenerationKey_(entityName);
    try {
        var durable = _cacheGenerationNumber_(_appIsFnName_("_scriptProp_") ? _scriptProp_(key, "") : "", 1),
            accelerated = _cacheGenerationNumber_(_appIsFnName_("_runtimeStateGet_") ? _runtimeStateGet_(key, "") : "", 1),
            current = Math.max(durable, accelerated, 1);
        accelerated !== current && _appIsFnName_("_runtimeStateSet_") && _runtimeStateSet_(key, String(current), 21600);
        return String(current);
    }
    catch (err) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("cache.generation.read", err, { entity: _cacheGenerationEntity_(entityName) });
        return "1";
    }
}
function _bumpEntityCacheStamps_(entityNames, options) {
    options = options || {};
    var names = [], seen = {};
    (Array.isArray(entityNames) ? entityNames : [entityNames]).forEach(function (name) {
        var entity = _cacheGenerationEntity_(name);
        if (seen[entity])
            return;
        if (options.skipLedgerMark !== !0 && _appIsFnName_("_cacheLedgerHasStamp_") && _cacheLedgerHasStamp_(entity))
            return;
        seen[entity] = !0, names.push(entity);
    });
    if (!names.length)
        return {};
    return _cacheGenerationWithLock_(function (lockMeta) {
        var props = _cacheGenerationReadProperties_(), updates = {}, result = {}, nowFloor = Math.max(1, Math.floor(Date.now() / 1e3));
        names.forEach(function (entity) {
            var key = _cacheGenerationKey_(entity),
                durable = _cacheGenerationNumber_(props[key], 1),
                accelerated = _cacheGenerationNumber_(_appIsFnName_("_runtimeStateGet_") ? _runtimeStateGet_(key, "") : "", 1),
                base = Math.max(durable, accelerated, 1),
                next = base >= Number.MAX_SAFE_INTEGER - 2 ? Math.max(base + 1, nowFloor) : base + 1;
            updates[key] = String(next), result[entity] = String(next);
        });
        _cacheGenerationPersist_(updates);
        Object.keys(result).forEach(function (entity) {
            var key = _cacheGenerationKey_(entity);
            _appIsFnName_("_runtimeStateSet_") && _runtimeStateSet_(key, result[entity], 21600);
            options.skipLedgerMark !== !0 && _appIsFnName_("_cacheLedgerIsFlushing_") && _cacheLedgerIsFlushing_() && _appIsFnName_("_cacheLedgerMarkStamp_") && _cacheLedgerMarkStamp_(entity);
        });
        try {
            var exec = _appIsFnName_("_execCache_") ? _execCache_() : null;
            exec && (exec.lastDurableCacheGenerationWrite = { stamp: APP_DURABLE_CACHE_GENERATION_REPOSITORY_CURRENT.stamp, entities: names.slice(), values: Object.assign({}, result), lock: lockMeta, at: new Date().toISOString() });
        }
        catch (telemetryErr) { _appIsFnName_("_recordWarning_") && _recordWarning_("cache.generation.telemetry", telemetryErr); }
        return result;
    });
}
function _bumpEntityCacheStamp_(entityName) {
    var entity = _cacheGenerationEntity_(entityName), result;
    try {
        result = _bumpEntityCacheStamps_([entity]);
        return String(result[entity] || _entityCacheStamp_(entity));
    }
    catch (err) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("cache.generation.bump", err, { entity: entity });
        var fallback = String(Math.max(_cacheGenerationNumber_(_entityCacheStamp_(entity), 1) + 1, Math.floor(Date.now() / 1e3)));
        _appIsFnName_("_runtimeStateSet_") && _runtimeStateSet_(_cacheGenerationKey_(entity), fallback, 21600);
        return fallback;
    }
}
function _durableCacheGenerationStatus_() {
    var readSource = String(_entityCacheStamp_), bumpSource = String(_bumpEntityCacheStamps_), persistSource = String(_cacheGenerationPersist_), lockSource = String(_cacheGenerationWithLock_), missing = [];
    /Math\.max\(durable, accelerated, 1\)/.test(readSource) || missing.push("max-durable-accelerated-read");
    /setProperties\(clean, !1\)/.test(persistSource) || missing.push("script-properties-batch-write");
    /CACHE_GENERATION_PROPERTY_NOT_ALLOWLISTED/.test(persistSource) || missing.push("cache-ver-write-allowlist");
    /__APP_WRITE_LOCK_DEPTH__/.test(lockSource) && /getScriptLock/.test(lockSource) || missing.push("canonical-script-lock");
    /base = Math\.max\(durable, accelerated, 1\)/.test(bumpSource) || missing.push("monotonic-base");
    return {
        ok: missing.length === 0,
        stamp: APP_DURABLE_CACHE_GENERATION_REPOSITORY_CURRENT.stamp,
        owner: APP_DURABLE_CACHE_GENERATION_REPOSITORY_CURRENT.owner,
        persistentSourceOfTruth: !0,
        cacheServiceAcceleratorOnly: !0,
        monotonicMaxRead: !0,
        cacheEvictionSafe: !0,
        batchPersistence: !0,
        joinsRootWriteLock: !0,
        configurationPropertiesRemainReadOnly: !0,
        missing: missing
    };
}
function _AppCacheInvalidateDomain_(domain) {
    domain = String(domain || "default").toLowerCase();
    try {
        return _appIsFnName_("_cacheLedgerShouldDefer_") && _cacheLedgerShouldDefer_() ? _cacheLedgerQueueDomain_(domain, "_AppCacheInvalidateDomain_", "domain-stamp-request") : _bumpEntityCacheStamp_(domain);
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C00"
        }), !1;
    }
}
function _sessionCacheTtlSeconds_() {
    var raw = typeof _scriptProp_ == "function" ? _scriptProp_("SESSION_CACHE_TTL_SECONDS", 21600) : 21600, n = Number(raw);
    return Math.max(300, Math.min(isFinite(n) ? n : 21600, 21600));
}
function _sessionResumeTtlDefaultSeconds_() {
    var raw = typeof _scriptProp_ == "function" ? _scriptProp_("SESSION_RESUME_TTL_SECONDS", 86400) : 86400, n = Number(raw);
    return Math.max(300, Math.min(isFinite(n) ? n : 86400, 86400));
}
function _sessionDurableTtlSeconds_() {
    var raw = typeof _scriptProp_ == "function" ? _scriptProp_("SESSION_DURABLE_TTL_SECONDS", 86400) : 86400, n = Number(raw);
    return Math.max(3600, Math.min(isFinite(n) ? n : 86400, 604800));
}
function _sessionExpiryDisabled_() {
    try {
        if (_appIsFnName_("_authSecurityProfile_"))
            return _authSecurityProfile_().sessionExpiryDisabled === !0;
    }
    catch (e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("security.session.profileUnavailable", e);
    }
    var v = String(_scriptProp_("SESSION_EXPIRY_DISABLED", "N") || "N").trim().toUpperCase();
    return v === "Y" || v === "YES" || v === "TRUE" || v === "1";
}
function _sessionPersistentUntilIso_() {
    var now = Date.now(), maxSeconds = _appIsFnName_("_sessionDurableTtlSeconds_") ? _sessionDurableTtlSeconds_() : 86400, maxMs = now + 1e3 * Math.max(3600, Math.min(Number(maxSeconds || 86400) || 86400, 604800)), iso = String(_scriptProp_("SESSION_PERSIST_UNTIL_ISO", "") || "").trim(), configuredMs = Date.parse(iso), resolvedMs = isFinite(configuredMs) && configuredMs > now ? Math.min(configuredMs, maxMs) : maxMs;
    return new Date(resolvedMs).toISOString();
}
function _sheetEntityCacheKeys_(sheetName) {
    var map, keys = {
        MainData: [
            "maindata", "dashboard", "cases", "petitioners", "reportoptions"
        ], Letters: [
            "letters", "dashboard", "tracking", "reportoptions"
        ], MeetingLogs: [
            "meetinglogs", "dashboard", "meetings"
        ], CommitteeMeetings: [
            "committeemeetings", "meeting", "meetings", "dashboard"
        ], CommitteeMeetingAgendaItems: [
            "committeemeetingagendaitems", "meeting", "meetings", "dashboard"
        ], BudgetImports: [
            "budgetimports", "budgetsummary", "budget", "dashboard", "adminreports"
        ], BudgetSummary: [
            "budgetsummary", "dashboard", "adminreports"
        ], BudgetYearSettingsItems: [
            "budgetsettings", "budgetsummary", "dashboard", "adminreports"
        ], BudgetYearSettings: [
            "budgetsettings", "budgetsummary", "dashboard", "adminreports"
        ], SalarySettings: [
            "budgetsettings", "budgetsummary", "dashboard", "personnel"
        ], SalaryPayments: [
            "budgetsettings", "budgetsummary", "dashboard", "personnel"
        ], Personnel_Comm: [
            "personnel_comm", "personnel", "meetinglookup", "dashboard"
        ], Personnel_Op: [
            "personnel_op", "personnel", "meetinglookup", "dashboard"
        ], Personnel_Staff: [
            "personnel_staff", "personnel", "meetinglookup", "budgetsummary", "dashboard"
        ], Petitioners: [
            "petitioners", "meetinglookup", "dashboard", "cases"
        ], Personnel_Subcommittees: [
            "personnel_subcommittees", "personnel", "meetinglookup", "dashboard"
        ], Subcommittees: [
            "subcommittees", "meetinglookup", "budgetsettings", "dashboard"
        ], ThailandLocations: [
            "thailandlocations", "lookups"
        ], Users: [
            "users", "adminreports"
        ], SystemSettings: [
            "systemsettings", "adminreports"
        ], Config: [
            "config", "adminreports"
        ], AuditLog: [
            "auditlog", "adminreports"
        ]
    }[sheetName = String(sheetName || "").trim()] || [
        sheetName.toLowerCase()
    ], seen = {};
    return keys.filter(function (k) {
        return !(!(k = String(k || "").trim().toLowerCase()) || seen[k]) && (seen[k] = 1, !0);
    });
}
function _requestScopeKey_(kind, key) {
    return String(kind || "") + "::" + String(key || "");
}
function _requestScopeBump_(kind, field, amount) {
    try {
        __APP_REQUEST_SCOPE_METRICS__ = __APP_REQUEST_SCOPE_METRICS__ || {
            hits: 0, misses: 0, rowsRead: 0, cellsRead: 0, serviceReads: 0, projectedColumnsRead: 0, fullWidthColumnsAvoided: 0, spreadsheetResolveCalls: 0, spreadsheetServiceOpens: 0, spreadsheetHandleCacheHits: 0, sheetResolveCalls: 0, projectionPlanHits: 0, projectionPlanMisses: 0, projectionPlanBuilds: 0, projectionPlanDerivations: 0, authoritativeEmptyReads: 0, fallbackReadsSuppressed: 0, projectionSchemaMisses: 0, warnings: 0, errors: 0, sheetsRead: {}, sheetCellsRead: {}, sheetServiceReads: {}, spreadsheetSources: {}, sheetResolveByName: {}, cacheKinds: {}, warnLabels: {}, errorLabels: {}
        }, __APP_REQUEST_SCOPE_METRICS__[field] = Number(__APP_REQUEST_SCOPE_METRICS__[field] || 0) + Number(amount || 1), kind && (__APP_REQUEST_SCOPE_METRICS__.cacheKinds[kind] = __APP_REQUEST_SCOPE_METRICS__.cacheKinds[kind] || {
            hits: 0, misses: 0
        }, __APP_REQUEST_SCOPE_METRICS__.cacheKinds[kind][field] = Number(__APP_REQUEST_SCOPE_METRICS__.cacheKinds[kind][field] || 0) + Number(amount || 1));
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
}
function _requestScopeNoteCacheAccess_(kind, hit, amount) {
    return _requestScopeBump_(String(kind || "cache"), hit ? "hits" : "misses", amount || 1);
}
function _requestScopeGet_(kind, key) {
    var cacheKey = _requestScopeKey_(kind, key), found = Object.prototype.hasOwnProperty.call(__APP_REQUEST_SCOPE_CACHE__, cacheKey);
    return _requestScopeBump_(kind, found ? "hits" : "misses", 1), found ? __APP_REQUEST_SCOPE_CACHE__[cacheKey] : null;
}
function _requestScopePut_(kind, key, value) {
    return __APP_REQUEST_SCOPE_CACHE__[_requestScopeKey_(kind, key)] = value, value;
}
function _requestScopeMetricSeed_() {
    return {
        hits: 0, misses: 0, rowsRead: 0, cellsRead: 0, serviceReads: 0, projectedColumnsRead: 0, fullWidthColumnsAvoided: 0,
        spreadsheetResolveCalls: 0, spreadsheetServiceOpens: 0, spreadsheetHandleCacheHits: 0,
        spreadsheetContextCreates: 0, spreadsheetContextHits: 0, spreadsheetContextResets: 0, spreadsheetContextSheetInvalidations: 0,
        sheetResolveCalls: 0, sheetHandleCacheHits: 0, sheetHandleCacheMisses: 0, sheetMetaReads: 0, sheetMetaCacheHits: 0,
        headerReads: 0, headerCacheHits: 0, headerMapBuilds: 0, headerMapCacheHits: 0, requestCacheInvalidations: 0,
        projectionPlanHits: 0, projectionPlanMisses: 0, projectionPlanBuilds: 0, projectionPlanDerivations: 0, authoritativeEmptyReads: 0, fallbackReadsSuppressed: 0, projectionSchemaMisses: 0,
        warnings: 0, errors: 0, sheetsRead: {}, sheetCellsRead: {}, sheetServiceReads: {}, spreadsheetSources: {}, sheetResolveByName: {}, sheetResolveCacheHitsByName: {}, cacheKinds: {}, warnLabels: {}, errorLabels: {}
    };
}
function _requestScopeReset_(options) {
    options = options || {};
    var newRequest = options.newRequest !== !1, preserveMetrics = options.preserveMetrics === !0 || !newRequest;
    __APP_REQUEST_SCOPE_CACHE__ = {};
    if (!preserveMetrics)
        __APP_REQUEST_SCOPE_METRICS__ = _requestScopeMetricSeed_();
    else {
        __APP_REQUEST_SCOPE_METRICS__ = __APP_REQUEST_SCOPE_METRICS__ || _requestScopeMetricSeed_();
        __APP_REQUEST_SCOPE_METRICS__.requestCacheInvalidations = Number(__APP_REQUEST_SCOPE_METRICS__.requestCacheInvalidations || 0) + 1;
    }
    if (newRequest)
        _appIsFnName_("_spreadsheetContextReset_") && _spreadsheetContextReset_({
            retainHandle: !1,
            source: String(options.source || "request-start")
        });
    else if (Array.isArray(options.invalidateSheets))
        options.invalidateSheets.forEach(function (sheetName) {
            _appIsFnName_("_spreadsheetContextInvalidateSheet_") && _spreadsheetContextInvalidateSheet_(sheetName);
        });
    return !0;
}
function _requestScopeNoteRowsRead_(sheetName, count) {
    try {
        var n = Math.max(0, Number(count || 0));
        __APP_REQUEST_SCOPE_METRICS__.rowsRead = Number(__APP_REQUEST_SCOPE_METRICS__.rowsRead || 0) + n, sheetName = String(sheetName || "unknown"), __APP_REQUEST_SCOPE_METRICS__.sheetsRead[sheetName] = Number(__APP_REQUEST_SCOPE_METRICS__.sheetsRead[sheetName] || 0) + n;
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
}
function _requestScopeNoteProjectionRead_(sheetName, rowCount, columnCount, serviceReads, fullWidth) {
    try {
        var rows = Math.max(0, Number(rowCount || 0));
        var cols = Math.max(0, Number(columnCount || 0));
        var reads = Math.max(0, Number(serviceReads || 0));
        var width = Math.max(cols, Number(fullWidth || cols) || cols);
        var name = String(sheetName || "unknown");
        var cells = rows * cols;
        __APP_REQUEST_SCOPE_METRICS__.cellsRead = Number(__APP_REQUEST_SCOPE_METRICS__.cellsRead || 0) + cells;
        __APP_REQUEST_SCOPE_METRICS__.serviceReads = Number(__APP_REQUEST_SCOPE_METRICS__.serviceReads || 0) + reads;
        __APP_REQUEST_SCOPE_METRICS__.projectedColumnsRead = Number(__APP_REQUEST_SCOPE_METRICS__.projectedColumnsRead || 0) + cols;
        __APP_REQUEST_SCOPE_METRICS__.fullWidthColumnsAvoided = Number(__APP_REQUEST_SCOPE_METRICS__.fullWidthColumnsAvoided || 0) + Math.max(0, width - cols);
        __APP_REQUEST_SCOPE_METRICS__.sheetCellsRead[name] = Number(__APP_REQUEST_SCOPE_METRICS__.sheetCellsRead[name] || 0) + cells;
        __APP_REQUEST_SCOPE_METRICS__.sheetServiceReads[name] = Number(__APP_REQUEST_SCOPE_METRICS__.sheetServiceReads[name] || 0) + reads;
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
}
function _requestScopeNoteSpreadsheetResolve_(source, serviceOpen, cacheHit) {
    try {
        __APP_REQUEST_SCOPE_METRICS__ = __APP_REQUEST_SCOPE_METRICS__ || {};
        __APP_REQUEST_SCOPE_METRICS__.spreadsheetResolveCalls = Number(__APP_REQUEST_SCOPE_METRICS__.spreadsheetResolveCalls || 0) + 1;
        serviceOpen && (__APP_REQUEST_SCOPE_METRICS__.spreadsheetServiceOpens = Number(__APP_REQUEST_SCOPE_METRICS__.spreadsheetServiceOpens || 0) + 1);
        cacheHit && (__APP_REQUEST_SCOPE_METRICS__.spreadsheetHandleCacheHits = Number(__APP_REQUEST_SCOPE_METRICS__.spreadsheetHandleCacheHits || 0) + 1);
        source = String(source || "unknown");
        __APP_REQUEST_SCOPE_METRICS__.spreadsheetSources = __APP_REQUEST_SCOPE_METRICS__.spreadsheetSources || {};
        __APP_REQUEST_SCOPE_METRICS__.spreadsheetSources[source] = Number(__APP_REQUEST_SCOPE_METRICS__.spreadsheetSources[source] || 0) + 1;
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
}
function _requestScopeNoteSheetResolve_(sheetName, cacheHit) {
    try {
        __APP_REQUEST_SCOPE_METRICS__ = __APP_REQUEST_SCOPE_METRICS__ || _requestScopeMetricSeed_();
        __APP_REQUEST_SCOPE_METRICS__.sheetResolveCalls = Number(__APP_REQUEST_SCOPE_METRICS__.sheetResolveCalls || 0) + 1;
        sheetName = String(sheetName || "unknown");
        __APP_REQUEST_SCOPE_METRICS__.sheetResolveByName = __APP_REQUEST_SCOPE_METRICS__.sheetResolveByName || {};
        __APP_REQUEST_SCOPE_METRICS__.sheetResolveByName[sheetName] = Number(__APP_REQUEST_SCOPE_METRICS__.sheetResolveByName[sheetName] || 0) + 1;
        if (cacheHit) {
            __APP_REQUEST_SCOPE_METRICS__.sheetResolveCacheHitsByName = __APP_REQUEST_SCOPE_METRICS__.sheetResolveCacheHitsByName || {};
            __APP_REQUEST_SCOPE_METRICS__.sheetResolveCacheHitsByName[sheetName] = Number(__APP_REQUEST_SCOPE_METRICS__.sheetResolveCacheHitsByName[sheetName] || 0) + 1;
        }
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
}
function getRequestScopeMetrics_() {
    var m = __APP_REQUEST_SCOPE_METRICS__ || {};
    return {
        cacheHit: Number(m.hits || 0) > 0,
        cacheHits: Number(m.hits || 0),
        cacheMisses: Number(m.misses || 0),
        rowsRead: Number(m.rowsRead || 0),
        cellsRead: Number(m.cellsRead || 0),
        serviceReads: Number(m.serviceReads || 0),
        projectedColumnsRead: Number(m.projectedColumnsRead || 0),
        fullWidthColumnsAvoided: Number(m.fullWidthColumnsAvoided || 0),
        spreadsheetResolveCalls: Number(m.spreadsheetResolveCalls || 0),
        spreadsheetServiceOpens: Number(m.spreadsheetServiceOpens || 0),
        spreadsheetHandleCacheHits: Number(m.spreadsheetHandleCacheHits || 0),
        spreadsheetContextCreates: Number(m.spreadsheetContextCreates || 0),
        spreadsheetContextHits: Number(m.spreadsheetContextHits || 0),
        spreadsheetContextResets: Number(m.spreadsheetContextResets || 0),
        spreadsheetContextSheetInvalidations: Number(m.spreadsheetContextSheetInvalidations || 0),
        sheetResolveCalls: Number(m.sheetResolveCalls || 0),
        sheetHandleCacheHits: Number(m.sheetHandleCacheHits || 0),
        sheetHandleCacheMisses: Number(m.sheetHandleCacheMisses || 0),
        sheetMetaReads: Number(m.sheetMetaReads || 0),
        sheetMetaCacheHits: Number(m.sheetMetaCacheHits || 0),
        headerReads: Number(m.headerReads || 0),
        headerCacheHits: Number(m.headerCacheHits || 0),
        headerMapBuilds: Number(m.headerMapBuilds || 0),
        headerMapCacheHits: Number(m.headerMapCacheHits || 0),
        requestCacheInvalidations: Number(m.requestCacheInvalidations || 0),
        projectionPlanHits: Number(m.projectionPlanHits || 0),
        projectionPlanMisses: Number(m.projectionPlanMisses || 0),
        projectionPlanBuilds: Number(m.projectionPlanBuilds || 0),
        projectionPlanDerivations: Number(m.projectionPlanDerivations || 0),
        authoritativeEmptyReads: Number(m.authoritativeEmptyReads || 0),
        fallbackReadsSuppressed: Number(m.fallbackReadsSuppressed || 0),
        projectionSchemaMisses: Number(m.projectionSchemaMisses || 0),
        warnings: Number(m.warnings || 0),
        errors: Number(m.errors || 0),
        sheetsRead: Object.assign({}, m.sheetsRead || {}),
        sheetCellsRead: Object.assign({}, m.sheetCellsRead || {}),
        sheetServiceReads: Object.assign({}, m.sheetServiceReads || {}),
        spreadsheetSources: Object.assign({}, m.spreadsheetSources || {}),
        sheetResolveByName: Object.assign({}, m.sheetResolveByName || {}),
        sheetResolveCacheHitsByName: Object.assign({}, m.sheetResolveCacheHitsByName || {}),
        cacheKinds: Object.assign({}, m.cacheKinds || {}),
        warnLabels: Object.assign({}, m.warnLabels || {}),
        errorLabels: Object.assign({}, m.errorLabels || {})
    };
}
function _repositoryProjectionCanonicalField_(sheetName, field) {
    sheetName = String(sheetName || "").trim();
    field = String(field == null ? "" : field).trim();
    if (!field)
        return "";
    var aliases = typeof SHEET_HEADER_ALIASES != "undefined" && SHEET_HEADER_ALIASES[sheetName] || {}, appAliases = _appIsFnName_("getAppFieldAliases_") ? getAppFieldAliases_(sheetName) || {} : aliases, normalized = _appIsFnName_("_normFieldKey_") ? _normFieldKey_(field) : field.replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "").toLowerCase().replace(/[\s\n\r\t\-–—_()（）\[\]{}:：\/\.]+/g, "");
    return String(appAliases[field] || appAliases[normalized] || aliases[field] || aliases[normalized] || field).trim();
}
function _repositoryProjectionPlanFields_(sheetName, requestedFields, opts) {
    opts = opts || {};
    var fields = [], seen = {};
    function add(field) {
        var canonical = _repositoryProjectionCanonicalField_(sheetName, field);
        if (canonical && !seen[canonical]) {
            seen[canonical] = !0;
            fields.push(canonical);
        }
    }
    (Array.isArray(opts.projectionPlanFields) ? opts.projectionPlanFields : []).forEach(add);
    (Array.isArray(requestedFields) ? requestedFields : []).forEach(add);
    opts.includeDeleted !== !0 && add("isDeleted");
    return fields;
}
function _repositoryProjectionAttachMeta_(rows, meta) {
    rows = Array.isArray(rows) ? rows : [];
    try {
        rows.__projectionMeta = Object.assign({}, meta || {});
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("repository.projection.meta", _e);
    }
    return rows;
}
function _repositoryProjectionDeriveRows_(sheetName, rows, outputFields, meta) {
    rows = Array.isArray(rows) ? rows : [];
    outputFields = _repositoryNormalizeFieldList_(outputFields);
    var mapping = outputFields.map(function (field) {
        return {
            output: field,
            canonical: _repositoryProjectionCanonicalField_(sheetName, field)
        };
    }), canonicalFields = _repositoryNormalizeFieldList_(mapping.map(function (entry) {
        return entry.canonical;
    })), mappedFields = _repositoryNormalizeFieldList_(meta && meta.mappedFields || []), mappedSet = {};
    mappedFields.forEach(function (field) {
        mappedSet[field] = !0;
    });
    var missingFields = canonicalFields.filter(function (field) {
        return !mappedSet[field];
    }), derivedMeta = Object.assign({}, meta || {}, {
        requestedFieldCount: outputFields.length,
        requestedCanonicalFieldCount: canonicalFields.length,
        requestedMappedFieldCount: Math.max(0, canonicalFields.length - missingFields.length),
        requestedMissingFields: missingFields
    });
    if (String(derivedMeta.reason || "") !== "no-data-rows" && canonicalFields.length)
        derivedMeta.authoritative = derivedMeta.authoritative !== !1 && missingFields.length === 0;
    if (!outputFields.length)
        return _repositoryProjectionAttachMeta_(rows, derivedMeta);
    var derived = rows.map(function (row) {
        row = row || {};
        var out = {};
        mapping.forEach(function (entry) {
            out[entry.output] = Object.prototype.hasOwnProperty.call(row, entry.canonical) ? row[entry.canonical] : Object.prototype.hasOwnProperty.call(row, entry.output) ? row[entry.output] : "";
        });
        return out;
    });
    _requestScopeBump_("projectionPlan", "projectionPlanDerivations", 1);
    return _repositoryProjectionAttachMeta_(derived, derivedMeta);
}
function getSheetMatrixCached_(sh, minCols, opts) {
    if (!sh)
        return [];
    opts = opts || {};
    var name = "";
    try {
        name = String(sh.getName() || "");
    }
    catch (_e) {
        _recordWarning_("ec", _e), name = "";
    }
    var meta = _spreadsheetContextSheetMeta_(name, sh, {
        forceFresh: opts.forceFresh === !0
    }), lastRow = Math.max(Number(meta && meta.lastRow || 0) || 0, 1), lastCol = Math.max(Number(meta && meta.lastColumn || 0) || 0, Number(minCols) || 0, 1), readMode = opts.allowFullMatrix === !0 ? "full" : "schema", cacheKey = [
        name, lastRow, lastCol, Number(minCols) || 0, readMode
    ].join("|"), cached = _requestScopeGet_("sheetMatrix", cacheKey);
    if (cached && Array.isArray(cached))
        return cached;
    var data = getSheetMatrix_(sh, minCols, Object.assign({}, opts, {
        sheetName: name,
        sheetMeta: meta
    }));
    return _requestScopeNoteRowsRead_(name, Math.max(0, data.length - 1)), _requestScopePut_("sheetMatrix", cacheKey, data);
}
function readSheetObjectsCached_(sheetName, opts) {
    opts = opts || {};
    var k = JSON.stringify({
        sheetName: String(sheetName || ""), includeDeleted: opts.includeDeleted === !0, requireCanonical: opts.requireCanonical === !0
    }), hit = _requestScopeGet_("sheetObjects", k);
    return hit && Array.isArray(hit) ? hit : _requestScopePut_("sheetObjects", k, readSheetObjects_(sheetName, opts));
}
function readSheetProjectedObjectsCached_(sheetName, fields, opts) {
    opts = opts || {};
    sheetName = String(sheetName || "").trim();
    var outputFields = _repositoryNormalizeFieldList_(fields), planName = String(opts.projectionPlan || "").trim(), readFields = _repositoryProjectionPlanFields_(sheetName, outputFields, opts), selectionSeed = _repositoryProjectedSelectionSeed_(opts), ver = "1";
    try {
        _appIsFnName_("_entityCacheStamp_") && (ver = _entityCacheStamp_(sheetName.toLowerCase()));
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
    var planSeed = JSON.stringify({
        s: sheetName,
        p: planName || "exact",
        f: readFields,
        d: opts.includeDeleted === !0,
        c: opts.requireCanonical === !0,
        x: selectionSeed,
        v: ver
    }), planKey = _appIsFnName_("_appSha256Hex_") ? _appSha256Hex_(planSeed).substring(0, 32) : planSeed;
    if (planName && opts.forceFresh !== !0) {
        var planHit = _requestScopeGet_("projectionPlanRows", planKey);
        if (planHit && Array.isArray(planHit.rows)) {
            _requestScopeBump_("projectionPlan", "projectionPlanHits", 1);
            return _repositoryProjectionDeriveRows_(sheetName, planHit.rows, outputFields, Object.assign({}, planHit.meta || {}, {
                projectionPlan: planName,
                projectionPlanHit: !0,
                cacheStatus: "request-plan-hit"
            }));
        }
        _requestScopeBump_("projectionPlan", "projectionPlanMisses", 1);
    }
    var exactSeed = JSON.stringify({
        s: sheetName,
        f: readFields,
        d: opts.includeDeleted === !0,
        c: opts.requireCanonical === !0,
        x: selectionSeed,
        v: ver
    }), key = _appIsFnName_("_appSha256Hex_") ? _appSha256Hex_(exactSeed).substring(0, 32) : exactSeed, hit = opts.forceFresh === !0 ? null : _requestScopeGet_("sheetProjectedObjects", key);
    if (hit && Array.isArray(hit.rows)) {
        var hitMeta = Object.assign({}, hit.meta || {}, {
            projectionPlan: planName,
            projectionPlanHit: !!planName,
            cacheStatus: "request-hit"
        });
        planName && _requestScopePut_("projectionPlanRows", planKey, {
            rows: hit.rows,
            meta: hitMeta
        });
        return _repositoryProjectionDeriveRows_(sheetName, hit.rows, outputFields, hitMeta);
    }
    var ttl = Math.max(0, Math.min(Number(opts.ttl || 0) || 0, 600)), ck = "sheet_projected_current_" + key;
    if (ttl && opts.forceFresh !== !0)
        try {
            var raw = _AppScriptCache_().get(ck), parsed = raw ? JSON.parse(raw) : null;
            if (parsed && Array.isArray(parsed.rows)) {
                var cachedMeta = Object.assign({}, parsed.meta || {}, {
                    projectionPlan: planName,
                    projectionPlanHit: !!planName,
                    cacheStatus: "script-cache-hit"
                });
                _requestScopeNoteCacheAccess_("scriptCache", !0, 1);
                _requestScopePut_("sheetProjectedObjects", key, { rows: parsed.rows, meta: cachedMeta });
                planName && _requestScopePut_("projectionPlanRows", planKey, { rows: parsed.rows, meta: cachedMeta });
                return _repositoryProjectionDeriveRows_(sheetName, parsed.rows, outputFields, cachedMeta);
            }
            var partitioned = _AppCacheGetPartitionedRows_(ck);
            if (partitioned && Array.isArray(partitioned.rows)) {
                var partitionMeta = Object.assign({}, partitioned.manifest && partitioned.manifest.meta || {}, {
                    projectionPlan: planName,
                    projectionPlanHit: !!planName,
                    cacheStatus: "script-partition-hit"
                });
                _requestScopeNoteCacheAccess_("scriptCachePartition", !0, 1);
                _requestScopePut_("sheetProjectedObjects", key, { rows: partitioned.rows, meta: partitionMeta });
                planName && _requestScopePut_("projectionPlanRows", planKey, { rows: partitioned.rows, meta: partitionMeta });
                return _repositoryProjectionDeriveRows_(sheetName, partitioned.rows, outputFields, partitionMeta);
            }
            _requestScopeNoteCacheAccess_("scriptCache", !1, 1);
        }
        catch (_cacheReadErr) {
            _requestScopeNoteCacheAccess_("scriptCache", !1, 1);
        }
    if (opts.requireCanonical === !0) {
        var audit = getCanonicalHeaderAudit_(sheetName);
        if (audit.missing.length)
            throw new Error("ชีต " + sheetName + " ขาดหัวตารางสำคัญ: " + audit.missing.join(", "));
    }
    var sh = getSheet_(sheetName), sheetMeta = _spreadsheetContextSheetMeta_(sheetName, sh, {
        forceFresh: opts.forceFresh === !0
    }), lastRow = Math.max(Number(sheetMeta && sheetMeta.lastRow || 0) || 0, 1), width = Math.max(Number(sheetMeta && sheetMeta.lastColumn || 0) || 0, 1), schema = SHEET_SCHEMAS[sheetName] || [], aliases = SHEET_HEADER_ALIASES[sheetName] || {}, appAliases = _appIsFnName_("getAppFieldAliases_") ? getAppFieldAliases_(sheetName) || aliases : aliases;
    function normalizeHeaderKey_(value) {
        return _appIsFnName_("_normFieldKey_") ? _normFieldKey_(value) : String(value || "").replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "").trim().toLowerCase().replace(/[\s\n\r\t\-–—_()（）\[\]{}:：\/\.]+/g, "");
    }
    function canonicalHeader_(rawHeader, defaultHeader) {
        rawHeader = String(rawHeader == null ? "" : rawHeader).trim();
        var normalized = normalizeHeaderKey_(rawHeader);
        return String(appAliases[rawHeader] || appAliases[normalized] || aliases[rawHeader] || aliases[normalized] || rawHeader || defaultHeader || "").trim();
    }
    var rawHeaders = _sheetHeaders_(sheetName, {
        sheet: sh,
        sheetMeta: sheetMeta,
        widthHint: width,
        forceFresh: opts.forceFresh === !0
    }), headers = rawHeaders.map(function (header, index) {
        return canonicalHeader_(header, schema[index] || "col" + (index + 1));
    }), colByName = {};
    rawHeaders.forEach(function (rawHeader, index) {
        if (!String(rawHeader == null ? "" : rawHeader).trim())
            return;
        var header = headers[index];
        header && !Object.prototype.hasOwnProperty.call(colByName, header) && (colByName[header] = index, colByName[normalizeHeaderKey_(header)] = index);
    });
    headers.forEach(function (header, index) {
        header && !Object.prototype.hasOwnProperty.call(colByName, header) && (colByName[header] = index, colByName[normalizeHeaderKey_(header)] = index);
    });
    schema.forEach(function (header, index) {
        index < width && header && !Object.prototype.hasOwnProperty.call(colByName, header) && (colByName[header] = index, colByName[normalizeHeaderKey_(header)] = index);
    });
    var requestedColumns = readFields.map(function (field) {
        var canonical = _repositoryProjectionCanonicalField_(sheetName, field), index = Object.prototype.hasOwnProperty.call(colByName, canonical) ? colByName[canonical] : colByName[normalizeHeaderKey_(canonical)];
        return {
            field: canonical,
            index: index === 0 || index > 0 ? Number(index) : -1
        };
    }).filter(function (entry) {
        return entry.index >= 0 && entry.index < width;
    }), uniqueColumnMap = {};
    requestedColumns.forEach(function (entry) {
        uniqueColumnMap[entry.index] = !0;
    });
    var uniqueColumns = Object.keys(uniqueColumnMap).map(Number).sort(function (a, b) {
        return a - b;
    }), outputCanonicalFields = _repositoryNormalizeFieldList_(outputFields.map(function (field) {
        return _repositoryProjectionCanonicalField_(sheetName, field);
    })), outputMissingFields = outputCanonicalFields.filter(function (field) {
        var index = Object.prototype.hasOwnProperty.call(colByName, field) ? colByName[field] : colByName[normalizeHeaderKey_(field)];
        return !(index === 0 || index > 0) || Number(index) >= width;
    }), outputMappedCount = Math.max(0, outputCanonicalFields.length - outputMissingFields.length), baseMeta = {
        owner: "Code_01_Platform_SheetRepo.readSheetProjectedObjectsCached_",
        stamp: APP_REPOSITORY_PROJECTION_C.stamp,
        projectionPlan: planName,
        sheetName: sheetName,
        requestedFieldCount: outputFields.length,
        requestedCanonicalFieldCount: outputCanonicalFields.length,
        requestedMappedFieldCount: outputMappedCount,
        requestedMissingFields: outputMissingFields,
        planFieldCount: readFields.length,
        mappedFieldCount: requestedColumns.length,
        mappedFields: _repositoryNormalizeFieldList_(requestedColumns.map(function (entry) { return entry.field; })),
        uniqueColumnCount: uniqueColumns.length,
        fullWidthColumns: width,
        authoritative: uniqueColumns.length > 0 && (!outputCanonicalFields.length || outputMissingFields.length === 0),
        authoritativeEmpty: !1,
        projectionPlanHit: !1
    };
    if (lastRow < 2) {
        baseMeta.authoritative = !0;
        baseMeta.authoritativeEmpty = !0;
        baseMeta.reason = "no-data-rows";
        baseMeta.rowsRead = 0;
        baseMeta.serviceReads = 0;
        _requestScopeBump_("projectionPlan", "authoritativeEmptyReads", 1);
        var noRows = _repositoryProjectionAttachMeta_([], baseMeta);
        _requestScopePut_("sheetProjectedObjects", key, { rows: noRows, meta: baseMeta });
        planName && _requestScopePut_("projectionPlanRows", planKey, { rows: noRows, meta: baseMeta });
        return _repositoryProjectionDeriveRows_(sheetName, noRows, outputFields, baseMeta);
    }
    if (!uniqueColumns.length) {
        baseMeta.authoritative = !1;
        baseMeta.authoritativeEmpty = !1;
        baseMeta.reason = "no-mapped-columns";
        _requestScopeBump_("projectionPlan", "projectionSchemaMisses", 1);
        var schemaEmpty = _repositoryProjectionAttachMeta_([], baseMeta);
        _requestScopePut_("sheetProjectedObjects", key, { rows: schemaEmpty, meta: baseMeta });
        planName && _requestScopePut_("projectionPlanRows", planKey, { rows: schemaEmpty, meta: baseMeta });
        return _repositoryProjectionDeriveRows_(sheetName, schemaEmpty, outputFields, baseMeta);
    }
    var selectionKeyIndex = -1;
    if (selectionSeed.keyField) {
        var selectionCanonicalKey = _repositoryProjectionCanonicalField_(sheetName, selectionSeed.keyField);
        selectionKeyIndex = Object.prototype.hasOwnProperty.call(colByName, selectionCanonicalKey) ? Number(colByName[selectionCanonicalKey]) : Number(colByName[normalizeHeaderKey_(selectionCanonicalKey)]);
        (!isFinite(selectionKeyIndex) || selectionKeyIndex < 0) && (selectionKeyIndex = -1);
    }
    var selection = _repositoryResolveProjectedSelection_(sheetName, selectionSeed, lastRow, selectionKeyIndex, opts);
    baseMeta.selection = {
        requested: selection.requested,
        active: selection.active,
        mode: selection.mode,
        keyField: selection.keyField,
        keyValueCount: selection.keyValues.length,
        selectedRowCount: selection.rowNumbers.length,
        missingValueCount: selection.missingValues.length,
        fallbackOnEmpty: selection.fallbackOnEmpty,
        fallbackUsed: selection.fallbackUsed,
        indexCacheHit: selection.indexCacheHit,
        indexRowsRead: selection.indexRowsRead,
        indexServiceReads: selection.indexServiceReads,
        indexMode: selection.indexMode
    };
    if (selection.requested && !selection.active && !selection.fallbackUsed) {
        baseMeta.authoritative = selectionKeyIndex >= 0;
        baseMeta.authoritativeEmpty = selectionKeyIndex >= 0;
        baseMeta.reason = selectionKeyIndex >= 0 ? "indexed-selection-empty" : "selection-key-field-missing";
        baseMeta.rowsRead = 0;
        baseMeta.rowsReturned = 0;
        baseMeta.serviceReads = 0;
        var selectedEmpty = _repositoryProjectionAttachMeta_([], baseMeta);
        _requestScopePut_("sheetProjectedObjects", key, { rows: selectedEmpty, meta: baseMeta });
        planName && _requestScopePut_("projectionPlanRows", planKey, { rows: selectedEmpty, meta: baseMeta });
        return _repositoryProjectionDeriveRows_(sheetName, selectedEmpty, outputFields, baseMeta);
    }
    function contiguousSpans_(columns) {
        var spans = [];
        columns.forEach(function (column) {
            var last = spans.length ? spans[spans.length - 1] : null;
            last && column === last.end + 1 ? last.end = column : spans.push({ start: column, end: column });
        });
        return spans;
    }
    function mergeSpansToLimit_(spans, maxSpans) {
        spans = spans.slice();
        while (spans.length > maxSpans) {
            var best = 0, bestGap = Infinity;
            for (var i = 0; i < spans.length - 1; i++) {
                var gap = spans[i + 1].start - spans[i].end - 1;
                if (gap < bestGap) {
                    bestGap = gap;
                    best = i;
                }
            }
            spans.splice(best, 2, { start: spans[best].start, end: spans[best + 1].end });
        }
        return spans;
    }
    var sparseRead = opts.sparseRead === !0 || String(opts.projectedReadMode || "").toLowerCase() === "sparse" || String(opts.projectedReadMode || "").toLowerCase().indexOf("sparse") >= 0, maxSpans = Math.max(1, Math.min(Number(opts.maxColumnSpans || 4) || 4, 8)), spans = sparseRead ? mergeSpansToLimit_(contiguousSpans_(uniqueColumns), maxSpans) : [{ start: uniqueColumns[0], end: uniqueColumns[uniqueColumns.length - 1] }], columnsRead = spans.reduce(function (sum, span) {
        return sum + span.end - span.start + 1;
    }, 0), selectionActive = selection.active && !selection.fallbackUsed, physicalRows = selectionActive ? selection.rowNumbers.slice() : [], rowCount = selectionActive ? physicalRows.length : Math.max(0, lastRow - 1), batchSize = _i3AdaptiveReadBatchRows_(rowCount, Math.max(1, columnsRead), opts), columnValues = {}, serviceReads = 0, outputPositionByRow = {}, rowSpans = selectionActive ? _repositoryContiguousRowSpans_(physicalRows) : [{ start: 2, end: lastRow }];
    physicalRows.forEach(function (row, index) { outputPositionByRow[row] = index; });
    uniqueColumns.forEach(function (index) {
        columnValues[index] = new Array(rowCount);
    });
    spans.forEach(function (span) {
        var spanWidth = span.end - span.start + 1;
        rowSpans.forEach(function (rowSpan) {
            for (var startRow = rowSpan.start; startRow <= rowSpan.end; startRow += batchSize) {
                var take = Math.min(batchSize, rowSpan.end - startRow + 1), chunk = sh.getRange(startRow, span.start + 1, take, spanWidth).getValues() || [];
                serviceReads++;
                for (var rowOffset = 0; rowOffset < chunk.length; rowOffset++) {
                    var physicalRow = startRow + rowOffset, targetRow = selectionActive ? outputPositionByRow[physicalRow] : physicalRow - 2;
                    if (targetRow == null || targetRow < 0)
                        continue;
                    uniqueColumns.forEach(function (index) {
                        index >= span.start && index <= span.end && (columnValues[index][targetRow] = chunk[rowOffset][index - span.start]);
                    });
                }
            }
        });
    });
    _requestScopeNoteRowsRead_(sheetName, rowCount);
    _requestScopeNoteProjectionRead_(sheetName, rowCount, columnsRead, serviceReads, width);
    var canonicalRows = new Array(rowCount);
    for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        var rowObject = {};
        requestedColumns.forEach(function (entry) {
            rowObject[entry.field] = columnValues[entry.index] ? columnValues[entry.index][rowIndex] : "";
        });
        canonicalRows[rowIndex] = rowObject;
    }
    if (opts.includeDeleted !== !0)
        canonicalRows = canonicalRows.filter(function (row) {
            return String(row && row.isDeleted || "").trim().toLowerCase() !== "true";
        });
    var projectionMeta = Object.assign({}, baseMeta, {
        mode: selectionActive ? (sparseRead ? "indexed-exact-key-bounded-sparse-plan" : "indexed-exact-key-contiguous-plan") : sparseRead ? "canonical-bounded-sparse-plan" : "canonical-contiguous-plan",
        columnsRead: columnsRead,
        columnsAvoided: Math.max(0, width - columnsRead),
        spanCount: spans.length,
        rowSpanCount: rowSpans.length,
        serviceReads: serviceReads,
        rowsRead: rowCount,
        bodyRowsRead: rowCount,
        indexRowsRead: Number(selection.indexRowsRead || 0) || 0,
        totalPhysicalRowsRead: rowCount + (Number(selection.indexRowsRead || 0) || 0),
        rowsAvoided: Math.max(0, Math.max(0, lastRow - 1) - rowCount),
        rowsReturned: canonicalRows.length,
        selection: baseMeta.selection,
        authoritative: baseMeta.authoritative,
        authoritativeEmpty: canonicalRows.length === 0 && baseMeta.authoritative,
        reason: canonicalRows.length ? "rows" : "empty-or-soft-deleted"
    });
    canonicalRows.length === 0 && _requestScopeBump_("projectionPlan", "authoritativeEmptyReads", 1);
    planName && _requestScopeBump_("projectionPlan", "projectionPlanBuilds", 1);
    _repositoryProjectionAttachMeta_(canonicalRows, projectionMeta);
    var cachePayload = { rows: canonicalRows, storedAt: Date.now(), meta: projectionMeta };
    if (ttl)
        try {
            var serialized = JSON.stringify(cachePayload);
            if (serialized.length <= 85e3)
                _AppScriptCache_().put(ck, serialized, ttl);
            else
                _AppCachePutPartitionedRows_(ck, canonicalRows, ttl, {
                    envelope: { storedAt: cachePayload.storedAt, meta: projectionMeta },
                    stamp: APP_REPOSITORY_PROJECTION_C.stamp,
                    sheetName: sheetName,
                    fields: readFields.length,
                    columnsRead: columnsRead,
                    spanCount: spans.length
                });
        }
        catch (_cachePutErr) {
            _recordWarning_("ec", _cachePutErr);
        }
    _requestScopePut_("sheetProjectedObjects", key, { rows: canonicalRows, meta: projectionMeta });
    planName && _requestScopePut_("projectionPlanRows", planKey, { rows: canonicalRows, meta: projectionMeta });
    return _repositoryProjectionDeriveRows_(sheetName, canonicalRows, outputFields, projectionMeta);
}
function _appDataServicePartitionKey_(sheetName, fields, opts) {
    opts = opts || {};
    var ver = "1";
    try {
        _appIsFnName_("_entityCacheStamp_") && (ver = _entityCacheStamp_(String(sheetName || "").toLowerCase()));
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _e) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
            error: String(_e && _e.message || _e)
        });
    }
    var seed = JSON.stringify({
        sheet: String(sheetName || "").trim(), fields: _repositoryNormalizeFieldList_(fields), includeDeleted: opts.includeDeleted === !0, requireCanonical: opts.requireCanonical === !0, owner: String(opts.owner || "shared"), selection: _repositoryProjectedSelectionSeed_(opts), stamp: ver
    });
    try {
        return _appIsFnName_("_appSha256Hex_") ? _appSha256Hex_(seed).substring(0, 32) : seed;
    }
    catch (_e) {
        return seed;
    }
}
function _appDataServiceCacheRead_(key) {
    try {
        if (!key || !_appIsFnName_("_AppScriptCache_"))
            return null;
        var raw = _AppScriptCache_().get(String(key));
        if (raw)
            return _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("appDataService", !0, 1), JSON.parse(raw);
        var partitioned = _AppCacheGetPartitionedRows_(String(key));
        if (partitioned && Array.isArray(partitioned.rows)) {
            var envelope = partitioned.manifest && partitioned.manifest.meta && partitioned.manifest.meta.envelope || {};
            return _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("appDataServicePartition", !0, 1), Object.assign({}, envelope, {
                rows: partitioned.rows, cacheHit: !0, cacheStatus: "partition-hit"
            });
        }
        return null;
    }
    catch (_e) {
        try {
            _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("appDataService", !1, 1);
        }
        catch (_ignore) {
            _appIgnore_(_ignore, "c.s");
        }
        return null;
    }
}
function _appDataServiceCacheWrite_(key, value, ttl) {
    try {
        if (!key || !_appIsFnName_("_AppScriptCache_") || typeof safeCachePut_ != "function")
            return !1;
        ttl = Math.max(10, Math.min(Number(ttl || 120) || 120, 21600));
        var text = JSON.stringify(value), cache = _AppScriptCache_();
        if (_cacheByteLength_(text) <= _cacheSoftLimitBytes_())
            return safeCachePut_(cache, String(key), text, ttl);
        if (value && Array.isArray(value.rows)) {
            var envelope = Object.assign({}, value);
            return delete envelope.rows, _AppCachePutPartitionedRows_(String(key), value.rows, ttl, {
                envelope, owner: "AppDataService.partitioned-envelope-v1"
            });
        }
        return !1;
    }
    catch (_e) {
        try {
            _appIsFnName_("_recordWarning_") && _recordWarning_("app.dataService.cacheWrite.failed", _e, {
                key
            });
        }
        catch (_ignore) {
            _appIgnore_(_ignore, "c.s");
        }
        return !1;
    }
}
function _appDataServiceRead_(sheetName, fields, opts) {
    if (opts = opts || {}, sheetName = String(sheetName || "").trim(), fields = _repositoryNormalizeFieldList_(fields), !sheetName)
        return [];
    var owner = String(opts.owner || "shared-data-service"), ttl = opts.forceFresh === !0 ? 0 : Math.max(0, Math.min(Number(opts.ttl != null ? opts.ttl : 120) || 0, 600)), cacheKey = ttl ? "app_data_service_current_" + _appDataServicePartitionKey_(sheetName, fields, opts) : "";
    if (cacheKey) {
        var cached = _appDataServiceCacheRead_(cacheKey);
        if (cached && Array.isArray(cached.rows)) {
            try {
                cached.rows.__repositoryMeta = Object.assign({}, cached.meta || {}, {
                    cacheStatus: "hit", owner
                });
                cached.meta && cached.meta.projection && _repositoryProjectionAttachMeta_(cached.rows, cached.meta.projection);
            }
            catch (_m) {
                _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _m) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
                    error: String(_m && _m.message || _m)
                });
            }
            return cached.rows;
        }
    }
    var rows = [];
    rows = typeof readRepositoryRows_ == "function" ? readRepositoryRows_(sheetName, fields, {
        includeDeleted: opts.includeDeleted === !0, requireCanonical: opts.requireCanonical === !0, ttl, forceFresh: opts.forceFresh === !0, owner, sparseRead: opts.sparseRead === !0, projectedReadMode: opts.projectedReadMode || "", maxColumnSpans: opts.maxColumnSpans || 4, projectionPlan: opts.projectionPlan || "", projectionPlanFields: opts.projectionPlanFields || [], selectKeyField: opts.selectKeyField || opts.keyField || "", selectKeyValues: opts.selectKeyValues != null ? opts.selectKeyValues : opts.keyValues, selectRowNumbers: opts.selectRowNumbers || [], selectionMode: opts.selectionMode || "", selectionFallbackOnEmpty: opts.selectionFallbackOnEmpty === !0, indexCacheTtlSeconds: opts.indexCacheTtlSeconds || 0, batchSize: opts.batchSize || 0, readBatchRows: opts.readBatchRows || 0, bypassRequestCache: opts.bypassRequestCache === !0
    }) || [] : fields.length && typeof readSheetProjectedObjectsCached_ == "function" ? readSheetProjectedObjectsCached_(sheetName, fields, {
        includeDeleted: opts.includeDeleted === !0, requireCanonical: opts.requireCanonical === !0, ttl, sparseRead: opts.sparseRead === !0, projectedReadMode: opts.projectedReadMode || "", maxColumnSpans: opts.maxColumnSpans || 4, projectionPlan: opts.projectionPlan || "", projectionPlanFields: opts.projectionPlanFields || [], selectKeyField: opts.selectKeyField || opts.keyField || "", selectKeyValues: opts.selectKeyValues != null ? opts.selectKeyValues : opts.keyValues, selectRowNumbers: opts.selectRowNumbers || [], selectionMode: opts.selectionMode || "", selectionFallbackOnEmpty: opts.selectionFallbackOnEmpty === !0, indexCacheTtlSeconds: opts.indexCacheTtlSeconds || 0, batchSize: opts.batchSize || 0, readBatchRows: opts.readBatchRows || 0, bypassRequestCache: opts.bypassRequestCache === !0
    }) || [] : typeof readSheetObjectsCached_ == "function" ? readSheetObjectsCached_(sheetName, {
        includeDeleted: opts.includeDeleted === !0, requireCanonical: opts.requireCanonical === !0
    }) || [] : readSheetObjects_(sheetName, {
        includeDeleted: opts.includeDeleted === !0, requireCanonical: opts.requireCanonical === !0
    }) || [], rows = Array.isArray(rows) ? rows : [];
    var meta = {
        stamp: "app-data-service-current", owner, sheetName, projected: !!fields.length, fieldCount: fields.length, ttlSeconds: ttl, rowsReturned: rows.length, cacheStatus: "miss", projectionPlan: String(opts.projectionPlan || ""), projection: rows && rows.__projectionMeta ? Object.assign({}, rows.__projectionMeta) : null
    };
    try {
        rows.__repositoryMeta = Object.assign({}, rows.__repositoryMeta || {}, meta);
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _e) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
            error: String(_e && _e.message || _e)
        });
    }
    return cacheKey && _appDataServiceCacheWrite_(cacheKey, {
        rows, meta
    }, ttl), rows;
}
function safeCachePut_(cache, key, value, ttl) {
    try {
        if (!cache || !key)
            return !1;
        var text = typeof value == "string" ? value : JSON.stringify(value), softLimit = _cacheSoftLimitBytes_();
        if (_cacheByteLength_(text) > softLimit) {
            try {
                logAudit_("cache.skip.oversize", {
                    key: String(key), bytes: _cacheByteLength_(text), limit: softLimit
                });
            }
            catch (_auditErr) {
                _recordWarning_("cache.skip.oversize.audit.failed", _auditErr);
            }
            return !1;
        }
        return cache.put(String(key), text, Math.max(30, Number(ttl || 60))), !0;
    }
    catch (_e) {
        return _recordWarning_("cache.put.failed", _e, {
            key
        }), !1;
    }
}
function _cachePartitionManifestKey_(baseKey) {
    return String(baseKey || "") + ":manifest";
}
function _cachePartitionChunkKey_(baseKey, index) {
    return String(baseKey || "") + ":part:" + String(Math.max(0, Number(index || 0) || 0));
}
function _cacheBuildRowPartitions_(rows, maxBytes, maxParts) {
    rows = Array.isArray(rows) ? rows : [], maxBytes = Math.max(12e3, Math.min(Number(maxBytes || 72e3) || 72e3, _cacheSoftLimitBytes_() - 4096)), maxParts = Math.max(1, Math.min(Number(maxParts || 80) || 80, 120));
    for (var parts = [], current = [], currentBytes = 2, i = 0; i < rows.length; i++) {
        var row = rows[i], rowText;
        try {
            rowText = JSON.stringify(row);
        }
        catch (_rowJsonErr) {
            _recordWarning_("cache.partition.row.stringify", _rowJsonErr), rowText = "{}", row = {};
        }
        var rowBytes = _cacheByteLength_(rowText) + (current.length ? 1 : 0);
        if (current.length && currentBytes + rowBytes > maxBytes && (parts.push(current), current = [], currentBytes = 2, parts.length >= maxParts))
            return null;
        current.push(row), currentBytes += rowBytes;
    }
    return current.length && parts.push(current), parts;
}
function _AppCachePutPartitionedRows_(baseKey, rows, ttl, meta) {
    try {
        var cache = _AppScriptCache_();
        if (!cache || !baseKey || !Array.isArray(rows))
            return !1;
        var parts = _cacheBuildRowPartitions_(rows, 72e3, 80);
        if (!parts || !parts.length)
            return !1;
        for (var i = 0; i < parts.length; i++)
            if (!safeCachePut_(cache, _cachePartitionChunkKey_(baseKey, i), {
                rows: parts[i]
            }, ttl))
                return !1;
        return safeCachePut_(cache, _cachePartitionManifestKey_(baseKey), {
            version: "partitioned-rows-v1", partCount: parts.length, rowCount: rows.length, meta: meta || {}, generatedAt: new Date().toISOString()
        }, ttl);
    }
    catch (_partitionPutErr) {
        return _recordWarning_("cache.partition.put.failed", _partitionPutErr, {
            baseKey: String(baseKey || "")
        }), !1;
    }
}
function _AppCacheGetPartitionedRows_(baseKey) {
    try {
        var cache = _AppScriptCache_();
        if (!cache || !baseKey)
            return null;
        var rawManifest = cache.get(_cachePartitionManifestKey_(baseKey));
        if (!rawManifest)
            return null;
        var manifest = JSON.parse(rawManifest), count = Math.max(0, Number(manifest && manifest.partCount || 0) || 0);
        if (!count || count > 120)
            return null;
        for (var keys = [], i = 0; i < count; i++)
            keys.push(_cachePartitionChunkKey_(baseKey, i));
        for (var values = typeof cache.getAll == "function" ? cache.getAll(keys) : null, rows = [], j = 0; j < keys.length; j++) {
            var raw = values ? values[keys[j]] : cache.get(keys[j]);
            if (!raw)
                return null;
            var part = JSON.parse(raw);
            if (!part || !Array.isArray(part.rows))
                return null;
            rows = rows.concat(part.rows);
        }
        return Number(manifest.rowCount || rows.length) !== rows.length ? null : {
            rows, manifest, cacheHit: !0, cacheStatus: "partition-hit"
        };
    }
    catch (_partitionGetErr) {
        return _recordWarning_("cache.partition.get.failed", _partitionGetErr, {
            baseKey: String(baseKey || "")
        }), null;
    }
}
function cachedSheetObjects_(sheetName, ttl) {
    ttl = ttl || _CACHE_TTL_DATA_;
    var key = "sheet_current_" + sheetName, cache = _AppScriptCache_(), hit = null;
    try {
        hit = cache.get(key);
    }
    catch (e) {
        _recordWarning_("ec", e);
    }
    if (hit)
        try {
            return JSON.parse(hit);
        }
        catch (e) {
            _recordWarning_("ec", e);
        }
    var data = sheetToObjects_(getSheet_(sheetName));
    try {
        safeCachePut_(cache, key, data, ttl);
    }
    catch (e) {
        _recordWarning_("ec", e);
    }
    return data;
}
function invalidateSheetCache_(sheetName) {
    _appIsFnName_("_spreadsheetContextInvalidateSheet_") && _spreadsheetContextInvalidateSheet_(sheetName);
    if (_appIsFnName_("_cacheLedgerShouldDefer_") && _cacheLedgerShouldDefer_())
        return _cacheLedgerQueueSheet_(sheetName, "invalidateSheetCache_", "sheet-cache-request");
    var result = {
        sheetName: String(sheetName || ""), sheetCache: !1, entityStamps: [], readModels: null
    };
    try {
        _AppScriptCache_().remove("sheet_current_" + sheetName), result.sheetCache = !0;
    }
    catch (e) {
        _recordWarning_("ec", e);
    }
    try {
        _appIsFnName_("_bumpEntityCacheStamp_") && _sheetEntityCacheKeys_(sheetName).forEach(function (entityKey) {
            _bumpEntityCacheStamp_(entityKey), result.entityStamps.push(entityKey);
        });
    }
    catch (stampErr) {
        try {
            _logWarn_("cache.invalidate.entityStamp", {
                sheetName, error: String(stampErr && stampErr.message || stampErr)
            });
        }
        catch (_eWarn) {
            _recordWarning_("ec", _eWarn);
        }
    }
    try {
        _appIsFnName_("_i3InvalidateReadModelsForSheet_") && (result.readModels = _i3InvalidateReadModelsForSheet_(sheetName, "invalidateSheetCache_"));
    }
    catch (readModelErr) {
        _recordWarning_("i3.invalidate.readModel.failed", readModelErr, {
            sheetName
        });
    }
    return result;
}
function cachedGeminiCall_(cacheKey, requestFn, ttl) {
    ttl = ttl || _CACHE_TTL_GEMINI_;
    var key = "gem_" + cacheKey, cache = _AppScriptCache_();
    try {
        var hit = cache.get(key);
        if (hit)
            return JSON.parse(hit);
    }
    catch (e) {
        _recordWarning_("ec", e);
    }
    var lock = null;
    try {
        if (!(lock = LockService.getScriptLock()).tryLock(500))
            return requestFn();
        var lockedHit = cache.get(key);
        if (lockedHit)
            return JSON.parse(lockedHit);
        var result = requestFn();
        try {
            safeCachePut_(cache, key, result, ttl);
        }
        catch (e2) {
            _recordWarning_("ec", e2);
        }
        return result;
    }
    finally {
        try {
            lock && lock.releaseLock();
        }
        catch (_e) {
            _recordWarning_("ec", _e);
        }
    }
}
var _SESSION_TTL_ = _sessionCacheTtlSeconds_(), _SESSION_TOUCH_PERSIST_INTERVAL_ = 300, PERFORMANCE_ENGINE_VERSION = "phase5-performance-gate-paging-envelope-v2";
function _performanceJsonStringify_(v) {
    try {
        return JSON.stringify(v == null ? null : v);
    }
    catch (_e) {
        return JSON.stringify({
            error: "JSON_STRINGIFY_FAILED", text: String(v)
        });
    }
}
function _performanceHash_(text) {
    try {
        return (_appIsFnName_("_appSha256Hex_") ? _appSha256Hex_(String(text || "")) : Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(text || ""), Utilities.Charset.UTF_8))).substring(0, 48);
    }
    catch (_e) {
        return String(Date.now());
    }
}
function _performanceMarkDirtyDomains_(domains, reason) {
    return APP_PRODUCTION_POLICY_FLAGS_CURRENT.performanceMarkDirtyDomainsEnabled;
}
function _recordPerformanceSample_(sample) {
    try {
        if (sample = sample || {}, !sample.method)
            return !1;
        var profile = _appIsFnName_("_appPerformanceProfile_") ? _appPerformanceProfile_(sample.method) : null, gate = _appIsFnName_("_appPerformanceEvaluate_") ? _appPerformanceEvaluate_(sample.method, sample) : null;
        if (!profile && !sample.errorCode && sample.ok !== !1)
            return !1;
        var key = "APP_PERFORMANCE_GATE_SAMPLES_CURRENT", cache = _AppScriptCache_();
        if (!cache)
            return !1;
        var rows = [];
        try {
            rows = JSON.parse(String(cache.get(key) || "[]"));
        }
        catch (_parseErr) {
            rows = [];
        }
        Array.isArray(rows) || (rows = []);
        var requestId = String(sample.requestId || ""), method = String(sample.method || "");
        return requestId && (rows = rows.filter(function (row) {
            return !(String(row && row.requestId || "") === requestId && String(row && row.method || "") === method);
        })), rows.unshift({
            at: String(sample.at || _appNowIso_()), requestId, method, group: String(sample.group || "general"), ok: sample.ok !== !1, durationMs: Math.max(0, Number(sample.durationMs || 0)), rowsRead: Math.max(0, Number(sample.rowsRead || 0)), payloadBytes: Math.max(0, Number(sample.payloadBytes || 0)), cacheHit: !!sample.cacheHit, source: String(sample.source || "live"), errorCode: String(sample.errorCode || ""), gateStatus: String(gate && gate.status || "not-profiled"), violations: gate && gate.violations || []
        }), safeCachePut_(cache, key, rows.slice(0, 80), 21600);
    }
    catch (_perfSampleErr) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("performance.sample.record", _perfSampleErr), !1;
    }
}
function _performanceCleanPayloadForCache_(payload) {
    payload = payload && typeof payload == "object" && !Array.isArray(payload) ? payload : {};
    var out = {}, security = payload._securityContext && typeof payload._securityContext == "object"
        ? payload._securityContext
        : {}, visibility = String(security.visibilityScope || payload.visibilityScope || payload.dataVisibilityScope || "role-wide").trim().toLowerCase() || "role-wide", principalScoped = /^(self|owner|principal|user|user-only)$/.test(visibility);
    return Object.keys(payload).sort().forEach(function (k) {
        if (!/^(token|_token|csrfToken|nextToken|password|_securityContext|requestId)$/i.test(k) && !/^actionToken$/i.test(k) && !/^__perf/i.test(k) && !/^__router/i.test(k)) {
            var v = payload[k];
            typeof v != "function" && (out[k] = v);
        }
    }), out.__accessRole = String(security.role || payload.role || "viewer").trim().toLowerCase() || "viewer", out.__accessGroup = String(security.group || "").trim().toLowerCase(), out.__accessVisibility = visibility, principalScoped && (out.__accessPrincipal = String(security.userId || security.username || security.email || payload.userId || payload.username || payload.email || "anonymous").trim().toLowerCase()), out;
}
function _performanceRouteCacheableTtl_(method, meta) {
    if (!_appIsFnName_("_platformDataContractMethod_")) return 0;
    return Math.max(0, Number(_platformDataContractMethod_(method, meta || {}).serverTtlSeconds || 0) || 0);
}
function _performanceStampSeedForRoute_(method, meta) {
    var policy = _appIsFnName_("_platformDataContractMethod_") ? _platformDataContractMethod_(method, meta || {}) : { stampEntities: [String(meta && (meta.domain || meta.group) || "general")] };
    return (policy.stampEntities || [policy.cacheEntity || "general"]).map(function (e) {
        var v = "1";
        try { v = _appIsFnName_("_entityCacheStamp_") ? _entityCacheStamp_(e) : "1"; }
        catch (_e) { _appIsFnName_("_recordWarning_") && _recordWarning_("performance.stampSeed", _e, { entity: String(e || "") }); }
        return e + "=" + v;
    }).join("|");
}
function _performanceRouterReadCacheKey_(method, payload, meta, sess) {
    var clean = _performanceCleanPayloadForCache_(payload || {}), role = sess && sess.role ? String(sess.role || "") : String(payload && payload.role || "viewer"), seed = {
        method: String(method || ""), role: role || "viewer", stampSeed: _performanceStampSeedForRoute_(method, meta), payload: clean, app: PERFORMANCE_ENGINE_VERSION
    };
    return "performance:route:" + String(method || "") + ":" + _performanceHash_(_performanceJsonStringify_(seed));
}
function _performanceRouterReadCacheGet_(method, payload, meta, sess) {
    try {
        if (!method || !meta || meta.write || meta.public || payload && (payload.forceFresh === !0 || payload.noCache === !0 || payload.bypassCache === !0) || !_performanceRouteCacheableTtl_(method, meta))
            return null;
        var hit = _AppCacheGetJson_(_performanceRouterReadCacheKey_(method, payload, meta, sess)), found = !!(hit && hit.result);
        if (_appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("routerReadCache", found, 1), found)
            return hit.result.cacheHit = !0, hit.result.cacheSource = "performance-router-read-cache", hit.result;
    }
    catch (e) {
        try {
            _recordWarning_("performance.router.cache.get.failed", e);
        }
        catch (_ignored) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _ignored);
        }
    }
    return null;
}
function _performanceRouterReadCachePut_(method, payload, meta, sess, normalized) {
    try {
        if (!method || !meta || meta.write || meta.public || !normalized || normalized.ok === !1 || payload && (payload.forceFresh === !0 || payload.noCache === !0 || payload.bypassCache === !0 || payload.cacheTtlSeconds === 0))
            return !1;
        var ttl = _performanceRouteCacheableTtl_(method, meta);
        if (!ttl)
            return !1;
        var cachedResult = {};
        return Object.keys(normalized).forEach(function (key) {
            key !== "rows" && key !== "items" && key !== "records" && key !== "perf" && key !== "requestId" && key !== "latencyMs" && key !== "token" && key !== "nextToken" && key !== "csrfToken" && key !== "nextCsrfToken" && (cachedResult[key] = normalized[key]);
        }), cachedResult.ok = !0, cachedResult.data = normalized.data, cachedResult.msg = normalized.msg || "", cachedResult.error = "", cachedResult.method = method, cachedResult.cacheStoredAt = _appNowIso_(), cachedResult.cacheContract = "router-read-envelope-paging-v2", _AppCachePutJson_(_performanceRouterReadCacheKey_(method, payload, meta, sess), {
            result: cachedResult
        }, ttl);
    }
    catch (e) {
        try {
            _recordWarning_("performance.router.cache.put.failed", e);
        }
        catch (_ignored) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _ignored);
        }
        return !1;
    }
}

