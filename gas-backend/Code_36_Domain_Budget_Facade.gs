/** Canonical — Budget cache policy and public facade owner. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {}, AppDomain = __APP_GLOBAL__.AppDomain = __APP_GLOBAL__.AppDomain || {}, BudgetDomain = __APP_GLOBAL__.BudgetDomain = __APP_GLOBAL__.BudgetDomain || {};
/* --------------------------------------------------------------------------
 * 7. Single Budget cache policy
 * -------------------------------------------------------------------------- */
function _budgetCachePolicyBypass_(payload) {
    return _appIsFnName_("_appCacheBypassRequested_") ? _appCacheBypassRequested_(payload || {}, ["__snapshotRefreshAfterInvalidation", "__budgetBackendCacheBypass"]) : (payload = payload || {}).forceFresh === !0 || payload.forceRefresh === !0 || payload.noCache === !0 || payload.bypassCache === !0 || payload.__snapshotRefreshAfterInvalidation === !0 || payload.__budgetBackendCacheBypass === !0;
}
function _budgetCachePolicyNumber_(value, fallback, min, max) {
    var n = Number(value);
    return isFinite(n) && n > 0 ? Math.max(Number(min || 1), Math.min(n, Number(max || 900))) : Number(fallback || 60);
}
function _budgetCachePolicyScopeDefaults_(scope) {
    scope = String(scope || "summary").toLowerCase();
    if (scope.indexOf("dashboard") !== -1)
        return {
            ttl: 60, max: 180, stale: 600, requireWorkflow: !0, requireOverview: !0
        };
    if (scope.indexOf("workflow") !== -1 || scope.indexOf("status") !== -1)
        return {
            ttl: 60, max: 180, stale: 600, requireWorkflow: !0
        };
    if (scope.indexOf("report") !== -1)
        return {
            ttl: 90, max: 180, stale: 600, requireReport: !0
        };
    if (scope.indexOf("rows") !== -1 || scope.indexOf("canonical") !== -1)
        return {
            ttl: 120, max: 300, stale: 600
        };
    if (scope.indexOf("snapshot") !== -1)
        return {
            ttl: 900, max: 1800, stale: 3600
        };
    if (scope.indexOf("summary") !== -1)
        return {
            ttl: 300, max: 600, stale: 1800
        };
    return {
        ttl: 90, max: 180, stale: 600
    };
}
function _budgetCachePolicy_(payload, scope) {
    payload = payload || {};
    var d = _budgetCachePolicyScopeDefaults_(scope), manual = _budgetCachePolicyBypass_(payload), ttl = _budgetCachePolicyNumber_(payload.cacheTtlSeconds, d.ttl, 15, d.max), snapshotTtl = _budgetCachePolicyNumber_(payload.snapshotTtlSeconds || payload.cacheTtlSeconds, d.ttl, 15, d.max), requireWorkflow = !!(d.requireWorkflow || payload.includeWorkflow === !0 || payload.__budgetHydrationIntegrated === !0), requireReport = !!(d.requireReport || payload.includeReport === !0), requireOverview = !!d.requireOverview;
    return {
        owner: "Code_32_Domain_Budget.BudgetCachePolicy.r77", stamp: BUDGET_CACHE_POLICY_STAMP, scope: String(scope || "summary"), manualRefresh: manual,
        allowRead: !manual, allowWrite: !manual, ttlSeconds: ttl, snapshotTtlSeconds: snapshotTtl, staleTtlSeconds: _budgetCachePolicyNumber_(payload.staleTtlSeconds, d.stale, 60, 900), requireWorkflow: requireWorkflow, requireReport: requireReport, requireOverview: requireOverview
    };
}
function _budgetCachePolicyCompleteness_(res) {
    var data = _budgetReadModelData_(res), comp = data && data.meta && data.meta.dataCompleteness ? data.meta.dataCompleteness : _budgetReadModelDataCompleteness_(data);
    return comp || {};
}
function _budgetCachePolicyCanStoreSummary_(res, payload, scope) {
    try {
        var policy = _budgetCachePolicy_(payload || {}, scope || "summary");
        if (!res || res.ok === !1 || !_budgetSummaryResultHasData_(res))
            return !1;
        var comp = _budgetCachePolicyCompleteness_(res);
        if (policy.requireOverview && comp.overview !== !0)
            return !1;
        if (policy.requireWorkflow && comp.workflow !== !0)
            return !1;
        if (policy.requireReport && comp.report !== !0)
            return !1;
        return !0;
    }
    catch (_budgetPolicyStoreErr) {
        _b32W_("budget.cachePolicy.canStore", _budgetPolicyStoreErr, {
            scope: String(scope || "")
        });
        return !1;
    }
}
function _budgetCachePolicyMeta_(meta, policy, cacheInfo) {
    return _appAssignObjects_({}, meta || {}, {
        cachePolicyOwner: policy && policy.owner || "Code_32_Domain_Budget.BudgetCachePolicy.r77", cachePolicyStamp: BUDGET_CACHE_POLICY_STAMP, cacheScope: policy && policy.scope || "summary",
        cacheTtlSeconds: policy && policy.ttlSeconds, cacheManualRefresh: !!(policy && policy.manualRefresh), cacheStatus: cacheInfo && cacheInfo.status || meta && meta.cacheStatus || ""
    });
}
function _budgetHotSummaryCacheKey_(payload) {
    payload = payload || {};
    var scope = {
        fy: String(payload.fy || payload.fiscalYear || payload.year || "").replace(/[^0-9]/g, ""), fast: payload.fast === !0 ? 1 : 0, includeSpent: payload.includeSpent === !1 ? 0 : 1,
        includeWorkflow: payload.includeWorkflow === !0 || payload.__budgetHydrationIntegrated === !0 ? 1 : 0, includeReport: payload.includeReport === !0 ? 1 : 0,
        budgetStamp: _appIsFnName_("_entityCacheStamp_") ? String(_entityCacheStamp_("budget") || "1") : "1", importsStamp: _appIsFnName_("_entityCacheStamp_") ? String(_entityCacheStamp_("budgetimports") || "1") : "1",
        model: BUDGET_HOT_READ_MODEL_STAMP, policy: BUDGET_CACHE_POLICY_STAMP
    }, seed = JSON.stringify(scope);
    return "budget_summary_hot_read_model_" + (_appIsFnName_("_buildDigestHex_") ? _buildDigestHex_(seed) : Utilities.base64EncodeWebSafe(seed).substring(0, 80));
}
function _budgetHotAttachMeta_(res, payload, started, cacheInfo) {
    res = res && typeof res == "object" ? res : {
        ok: !1, data: {}
    };
    var data = res.data && typeof res.data == "object" && !Array.isArray(res.data) ? res.data : res, rows = Array.isArray(data.rows) ? data.rows : _appArrayValue_(data.items), meta = _appAssignObjects_({}, data.meta || res.meta || {}, {
        method: "apiBudgetGetSummary", readModel: BUDGET_HOT_READ_MODEL_STAMP, readModelOwner: "Code_32_Domain_Budget.budgetSummaryReadModelOverlay",
        durationMs: Math.max(0, Date.now() - Number(started || Date.now())), rowsRead: Number(data.rowsRead || res.rowsRead || rows.length || 0) || 0,
        rowsReturned: rows.length, cacheHit: !!(cacheInfo && cacheInfo.hit), cacheStatus: cacheInfo && cacheInfo.status || "bypass", cacheKey: cacheInfo && cacheInfo.key || "",
        source: "apiBudgetGetSummary.readModelOverlay", backendCacheBypass: _budgetCachePolicyBypass_(payload) || payload.__budgetBackendCacheBypass === !0,
        snapshotReadBypassed: _budgetCachePolicyBypass_(payload) || payload.__budgetBackendCacheBypass === !0
    });
    return data.meta = meta, data.readModel = BUDGET_HOT_READ_MODEL_STAMP, data.cacheHit = meta.cacheHit, data.cacheStatus = meta.cacheStatus, data.durationMs = meta.durationMs,
        data.rowsRead = meta.rowsRead, data.rowsReturned = meta.rowsReturned, res.meta = _appAssignObjects_({}, res.meta || {}, meta), res.readModel = BUDGET_HOT_READ_MODEL_STAMP, res.cacheHit = meta.cacheHit, res.cacheStatus = meta.cacheStatus, res.durationMs = meta.durationMs,
        res.rowsRead = meta.rowsRead, res.rowsReturned = meta.rowsReturned, res;
}
function _budgetSummaryReadThrough_(payload, builder) {
    payload = payload || {};
    var started = Date.now(), policy = _budgetCachePolicy_(payload, "summary"), allowCache = policy.allowRead, key = _budgetHotSummaryCacheKey_(payload), cacheInfo = {
        key: key, status: allowCache ? "miss" : "bypass", hit: !1, policy: BUDGET_CACHE_POLICY_STAMP, owner: policy.owner
    };
    if (allowCache && _appIsFnName_("_cacheGetJson_"))
        try {
            var hit = _cacheGetJson_(key);
            if (hit && typeof hit == "object" && _budgetCachePolicyCanStoreSummary_(hit, payload, "summary"))
                return cacheInfo.status = "hit", cacheInfo.hit = !0,
                    _budgetHotAttachMeta_(hit, payload, started, cacheInfo);
            hit && typeof hit == "object" && (cacheInfo.status = "skip-incomplete-hit");
        }
        catch (cacheErr) {
            cacheInfo.status = "read-error", _b32W_("budget.summary.cachePolicy.cacheGet", cacheErr);
        }
    var res = _budgetHotAttachMeta_(builder(payload || {}), payload, started, cacheInfo);
    try {
        var data = res && res.data && typeof res.data == "object" ? res.data : res;
        if (data && typeof data == "object")
            data.meta = _budgetCachePolicyMeta_(data.meta || res.meta || {}, policy, cacheInfo);
    }
    catch (_policyMetaErr) { _appIgnoreExpected_("Code_32_Domain_Budget.gs.ignored", _policyMetaErr); }
    if (policy.allowWrite && res && res.ok !== !1 && _budgetCachePolicyCanStoreSummary_(res, payload, "summary") && _appIsFnName_("_cachePutJson_"))
        try {
            _cachePutJson_(key, res, policy.ttlSeconds);
        }
        catch (cachePutErr) {
            _b32W_("budget.summary.cachePolicy.cachePut", cachePutErr);
        }
    return res;
}
/* --------------------------------------------------------------------------
 * 9. Public API facade — Summary / FY / List / Save / Delete
 * -------------------------------------------------------------------------- */
function _budgetSummaryDashboardHydrationD_(payload) {
    if (!payload.__budgetHydrationIntegrated || payload.__budgetDashboardOwnerBypass)
        return { handled: !1, result: null };
    try {
        var dashPayload = _appAssignObjects_({}, payload, {
            __budgetDashboardOwnerBypass: !0,
            forceFresh: payload.forceFresh === !0,
            noCache: payload.noCache === !0,
            bypassCache: payload.bypassCache === !0,
            cacheTtlSeconds: Number(payload.cacheTtlSeconds || 600) || 600,
            snapshotTtlSeconds: Number(payload.snapshotTtlSeconds || 600) || 600
        });
        return {
            handled: !0,
            result: BudgetDomain && typeof BudgetDomain.getDashboardSummaryForDashboard == "function"
                ? BudgetDomain.getDashboardSummaryForDashboard(dashPayload)
                : ok_(_budgetDashboardEmptyPayload_("phase4-budget-domain-owner-unavailable"), "ข้ามการโหลดงบประมาณ: BudgetDomain ยังไม่พร้อม")
        };
    }
    catch (e) {
        _b32W_("budget.summary.domainPipelineD.dashboardHydration", e);
        return { handled: !1, result: null };
    }
}
function _budgetSummaryContextD_(payload) {
    payload = payload || {};
    var started = Date.now(), backendBypass = _budgetCachePolicyBypass_(payload), fy = String(payload.fy || payload.fiscalYear || payload.year || "").replace(/[^0-9]/g, "");
    if (!fy && _appIsFnName_("_resolveBudgetDefaultFiscalYear_"))
        try {
            fy = String(_resolveBudgetDefaultFiscalYear_() || "").replace(/[^0-9]/g, "");
        }
        catch (_fyErr) {
            fy = "";
        }
    var snapshotPolicy = _budgetCachePolicy_(payload, "snapshot");
    return {
        payload: payload,
        started: started,
        backendBypass: backendBypass,
        fy: fy,
        targetKey: fy || "default",
        snapshotPolicy: snapshotPolicy,
        canUseSnapshot: snapshotPolicy.allowRead && !backendBypass,
        owner: "BudgetDomain.summaryPipelineD.r175"
    };
}
function _budgetSummaryTrySnapshotsD_(ctx) {
    if (!ctx.canUseSnapshot)
        return null;
    if (_appIsFnName_("_performanceReadSnapshot_"))
        try {
            var snap = _performanceReadSnapshot_("budgetsummary", ctx.targetKey);
            if (snap && snap.ok && snap.data)
                return _budgetAttachFiscalYearMeta_(_budgetHotAttachMeta_({
                    ok: !0,
                    data: snap.data,
                    msg: "โหลดสรุปงบประมาณจาก summary snapshot สำเร็จ",
                    source: "BudgetSummarySnapshot.performanceI.r164"
                }, ctx.payload, ctx.started, {
                    key: snap.meta && snap.meta.cacheKey || "",
                    status: "summary-snapshot-hit",
                    hit: !0,
                    persistentSnapshotHit: !1
                }), ctx.fy);
        }
        catch (_budgetSnapshotReadErr) {
            _b32W_("budget.summarySnapshot.read", _budgetSnapshotReadErr);
        }
    if (_appIsFnName_("_persistentSummarySnapshotRead_"))
        try {
            var persistent = _persistentSummarySnapshotRead_("budgetsummary", ctx.targetKey, "viewer", {
                requestId: ctx.payload.requestId || ""
            });
            if (persistent && persistent.ok && persistent.data)
                return _budgetAttachFiscalYearMeta_(_budgetHotAttachMeta_({
                    ok: !0,
                    data: persistent.data,
                    msg: "โหลดสรุปงบประมาณจาก persistent snapshot สำเร็จ",
                    source: "BudgetPersistentSummarySnapshot.performanceI.r164"
                }, ctx.payload, ctx.started, {
                    key: persistent.meta && persistent.meta.snapshotKey || "",
                    status: "persistent-summary-snapshot-hit",
                    hit: !0,
                    persistentSnapshotHit: !0
                }), ctx.fy);
        }
        catch (_budgetPersistentReadErr) {
            _b32W_("budget.persistentSummarySnapshot.read", _budgetPersistentReadErr);
        }
    return null;
}
function _budgetSummaryStoreSnapshotsD_(ctx, payload, res) {
    try {
        (payload && payload.__snapshotRefreshAfterInvalidation) !== !0 && _appIsFnName_("_performanceWriteSnapshot_") && res && res.ok !== !1 && _budgetCachePolicyCanStoreSummary_(res, payload, "snapshot") && _performanceWriteSnapshot_("budgetsummary", ctx.targetKey, res.data !== void 0 ? res.data : res, {
            source: "apiBudgetGetSummary.performanceI.r164",
            ttlSeconds: ctx.snapshotPolicy.snapshotTtlSeconds,
            phaseEEmptySnapshotGuard: _budgetCachePolicyCanStoreSummary_(res, payload, "snapshot"),
            cachePolicyStamp: BUDGET_CACHE_POLICY_STAMP
        });
    }
    catch (_budgetSnapshotWriteErr) {
        _b32W_("budget.summarySnapshot.write", _budgetSnapshotWriteErr);
    }
    try {
        _appIsFnName_("_persistentSummarySnapshotWrite_") && res && res.ok !== !1 && _budgetCachePolicyCanStoreSummary_(res, payload, "snapshot") && _persistentSummarySnapshotWrite_("budgetsummary", ctx.targetKey, "viewer", res.data !== void 0 ? res.data : res, {
            source: "apiBudgetGetSummary.performanceI.persistent-r164",
            ttlSeconds: Math.max(900, Number(ctx.snapshotPolicy.snapshotTtlSeconds || 900) || 900),
            requestId: payload && payload.requestId || ""
        });
    }
    catch (_budgetPersistentWriteErr) {
        _b32W_("budget.persistentSummarySnapshot.write", _budgetPersistentWriteErr);
    }
}
function _budgetSummaryBuildFreshD_(ctx) {
    var output = _budgetSummaryReadThrough_(_appAssignObjects_({}, ctx.payload, {
        __budgetBackendCacheBypass: ctx.backendBypass,
        forceFresh: ctx.payload.forceFresh === !0 || ctx.backendBypass,
        noCache: ctx.payload.noCache === !0 || ctx.backendBypass,
        bypassCache: ctx.payload.bypassCache === !0 || ctx.backendBypass,
        bypassRequestCache: ctx.payload.bypassRequestCache === !0 || ctx.backendBypass
    }), function (payload) {
        var res = _budgetAttachFiscalYearMeta_(BudgetDomain.getSummary(payload || {}), ctx.fy);
        _budgetSummaryStoreSnapshotsD_(ctx, payload, res);
        return res;
    });
    return _budgetAttachFiscalYearMeta_(output, ctx.fy);
}
function apiBudgetGetSummary(payload) {
    payload = payload || {};
    var hydration = _budgetSummaryDashboardHydrationD_(payload);
    if (hydration.handled)
        return hydration.result;
    var ctx = _budgetSummaryContextD_(payload), snapshot = _budgetSummaryTrySnapshotsD_(ctx);
    return snapshot || _budgetSummaryBuildFreshD_(ctx);
}
function apiBudgetGetSubcommitteeOptions(payload) {
    var auth = _bSafeReq_(payload, "viewer", "apiBudgetGetSubcommitteeOptions");
    return auth.ok ? (payload = auth.payload, _normalizeOkEnvelope_(typeof _Domain_budgetUnifiedSubcommitteeOptions == "function" ? _Domain_budgetUnifiedSubcommitteeOptions(payload) : [], "โหลดรายการคณะอนุกรรมาธิการสำเร็จ", "โหลดรายการคณะอนุกรรมาธิการไม่สำเร็จ")) : auth.result;
}
function _budgetRefreshTypeSummaryReadModel_(payload) {
    if (typeof AppDataService != "undefined" && AppDataService && AppDataService.refreshBudgetTypeSummary)
        return AppDataService.refreshBudgetTypeSummary(payload || {});
    throw new Error("APP_DATA_SERVICE_UNAVAILABLE: budget type summary read model");
}
/**
 * Performance I: fiscal-year metadata is part of the canonical Budget summary.
 * This helper performs no Spreadsheet scan; the selected fiscal year is already
 * resolved by the summary request and the fixed operational range is preserved.
 */
function _budgetFiscalYearOptionsFast_(selectedFy) {
    var d = new Date(), calendarCurrentFy = String(d.getMonth() >= 9 ? d.getFullYear() + 544 : d.getFullYear() + 543), yearsMap = {};
    function add(value) {
        value = _b32FY_(value);
        if (value)
            yearsMap[value] = !0;
    }
    for (var fy = 2569; fy <= 2576; fy++)
        add(fy);
    add(calendarCurrentFy);
    add(selectedFy);
    var years = Object.keys(yearsMap).sort(function (a, b) {
        return Number(a) - Number(b);
    }), defaultFy = _b32FY_(selectedFy) || calendarCurrentFy;
    return {
        years: years,
        fiscalYears: years.slice(),
        currentFy: defaultFy,
        defaultFy: defaultFy,
        calendarCurrentFy: calendarCurrentFy,
        source: "budget-summary-embedded-fiscal-years-r164"
    };
}
function _budgetAttachFiscalYearMeta_(result, selectedFy) {
    if (!result || typeof result != "object")
        return result;
    var data = result.data && typeof result.data == "object" ? result.data : result,
        options = _budgetFiscalYearOptionsFast_(selectedFy || data.fy || data.fiscalYear || data.year || "");
    data.fiscalYears = options.fiscalYears.slice();
    data.years = options.years.slice();
    data.currentFy = options.currentFy;
    data.defaultFy = options.defaultFy;
    data.calendarCurrentFy = options.calendarCurrentFy;
    data.meta = _appAssignObjects_({}, data.meta || {}, {
        fiscalYears: options.fiscalYears.slice(),
        currentFy: options.currentFy,
        defaultFy: options.defaultFy,
        calendarCurrentFy: options.calendarCurrentFy,
        fiscalYearMetadataEmbedded: !0,
        performanceBudgetHotPathI: !0
    });
    result !== data && (result.meta = _appAssignObjects_({}, result.meta || {}, {
        fiscalYearMetadataEmbedded: !0,
        performanceBudgetHotPathI: !0
    }));
    return result;
}
function _budgetGetFiscalYearsDomainOwner_(payload) {
    var auth = _bSafeReq_(payload, "viewer", "apiBudgetGetFiscalYears");
    if (!auth.ok)
        return auth.result;
    payload = auth.payload || {};
    var selectedFy = _b32FY_(payload.fy || payload.fiscalYear || payload.year || "");
    if (!selectedFy)
        try {
            selectedFy = _b32FY_(_resolveBudgetDefaultFiscalYear_() || "");
        }
        catch (_e) {
            _b32W_("budget.fiscalYears.defaultFy", _e);
        }
    return ok_(_budgetFiscalYearOptionsFast_(selectedFy), "โหลดตัวเลือกปีงบประมาณสำเร็จ");
}
function _budgetSaveImportDomainOwner_(payload) {
    return writeGateway_("apiBudgetSaveImport", payload || {}, function (input) {
        var auth = _bSafeReq_(input, "staff", "apiBudgetSaveImport");
        if (!auth.ok)
            return auth.result;
        input = auth.payload;
        var _syncReadModelRefresh = _appIsFnName_("_budgetShouldRefreshReadModelNow_") ? _budgetShouldRefreshReadModelNow_(input) : !(!input || input.syncReadModelRefresh !== !0 && input.forceReadModelRefresh !== !0 && input.refreshReadModelNow !== !0), _fastUiSave = !input || input.skipReadModelRefresh === !0 || input.uiFastSave === !0 || input.fastSave === !0 || !_syncReadModelRefresh;
        if (input && input.__budgetCriticalPathDryRun === !0)
            return ok_({
                dryRun: !0, writeAuthOk: !0, csrfVerifiedByRouter: !0, method: "apiBudgetSaveImport", fy: _budgetCanonicalPayloadFy_(input) || "",
                id: String(input.id || input.importId || input.recordId || ""), entryType: String(input.entryType || input.category || ""), staffResponsible: String(input.staffResponsible || ""),
                fastUiSave: !!_fastUiSave, owner: "Code_32_Domain_Budget:budget-critical-path-current"
            }, "ตรวจ Budget write path สำเร็จโดยไม่เขียนข้อมูลจริง");
        auditEvent_("budget", {
            route: "apiBudgetSaveImport", fy: _budgetCanonicalPayloadFy_(input) || ""
        });
        var _res = _normalizeOkEnvelope_(budgetUnifiedSaveImport(input), "บันทึกรายการงบประมาณสำเร็จ", "บันทึกรายการงบประมาณไม่สำเร็จ");
        try {
            if (_res && _res.ok !== !1)
                if (_fastUiSave) {
                    try {
                        typeof AppRepository != "undefined" && AppRepository.afterWrite ? AppRepository.afterWrite(_B32_INVALIDATION_DOMAINS) : _appIsFnName_("_AppCacheInvalidateDomain_") && (_AppCacheInvalidateDomain_("budget"),
                            _AppCacheInvalidateDomain_("budgetimports"), _AppCacheInvalidateDomain_("dashboard"));
                    }
                    catch (_cacheErr) {
                        _b32W_("budget.cache.invalidate.fastSave", _cacheErr);
                    }
                    _res.dirtyMarker = _appIsFnName_("_budgetMarkTypeSummaryDirty_") ? _budgetMarkTypeSummaryDirty_(input, "apiBudgetSaveImport") : null, _res.readModelRefresh = {
                        ok: !0, skipped: !0, reason: "ui-fast-save-deferred-refresh", fy: _budgetCanonicalPayloadFy_(input) || "", dirtyMarker: !!_res.dirtyMarker
                    };
                }
                else
                    _res.readModelRefresh = _budgetRefreshReadModelAfterWrite_(input, "apiBudgetSaveImport");
        }
        catch (_corecoreErr) {
            _res && typeof _res == "object" && (_res.readModelError = String(_corecoreErr && _corecoreErr.message || _corecoreErr));
        }
        return _res;
    }, "บันทึกรายการงบประมาณสำเร็จ", "บันทึกรายการงบประมาณไม่สำเร็จ");
}
function _budgetDeleteImportDomainOwner_(payload) {
    return writeGateway_("apiBudgetDeleteImport", payload || {}, function (input) {
        var auth = _bSafeReq_(input, "staff", "apiBudgetDeleteImport");
        if (!auth.ok)
            return auth.result;
        input = auth.payload;
        var _del = _normalizeOkEnvelope_(budgetUnifiedDeleteImport(input.id || input.importId || ""), "ลบรายการงบประมาณสำเร็จ", "ลบรายการงบประมาณไม่สำเร็จ");
        try {
            if (_del && _del.ok !== !1)
                if (_appIsFnName_("_budgetShouldRefreshReadModelNow_") && _budgetShouldRefreshReadModelNow_(input))
                    _del.readModelRefresh = _budgetRefreshReadModelAfterWrite_(input, "apiBudgetDeleteImport");
                else {
                    try {
                        typeof AppRepository != "undefined" && AppRepository.afterWrite ? AppRepository.afterWrite(_B32_INVALIDATION_DOMAINS) : _appIsFnName_("_AppCacheInvalidateDomain_") && (_AppCacheInvalidateDomain_("budget"),
                            _AppCacheInvalidateDomain_("budgetimports"), _AppCacheInvalidateDomain_("dashboard"));
                    }
                    catch (_cacheErr) {
                        _b32W_("budget.cache.invalidate.delete", _cacheErr);
                    }
                    _del.dirtyMarker = _appIsFnName_("_budgetMarkTypeSummaryDirty_") ? _budgetMarkTypeSummaryDirty_(input, "apiBudgetDeleteImport") : null,
                        _del.readModelRefresh = {
                            ok: !0, skipped: !0, reason: "ui-fast-delete-deferred-refresh", fy: _budgetCanonicalPayloadFy_(input) || "", dirtyMarker: !!_del.dirtyMarker
                        };
                }
        }
        catch (_corecoreErr) {
            _del && typeof _del == "object" && (_del.readModelError = String(_corecoreErr && _corecoreErr.message || _corecoreErr));
        }
        return _del;
    }, "ลบรายการงบประมาณสำเร็จ", "ลบรายการงบประมาณไม่สำเร็จ");
}
function _budgetGetSummaryDomainOwner_(payload) {
    var auth = _bSafeReq_(payload, "viewer", "apiBudgetGetSummary");
    if (!auth.ok)
        return auth.result;
    payload = auth.payload || {};
    var dto = _budgetReadModelBuildSummaryDto_(payload, {
        source: "BudgetReadModel.centralDTO.BudgetDomain.getSummary.r76", dataSource: "centralBudgetDTO+r76", contractStamp: "budget-summary-central-dto-current-r76",
        includePersonnelCompensation: !0
    });
    return ok_(dto, "โหลดสรุปงบประมาณสำเร็จ");
}
BudgetDomain.OWNER_CONTRACT_CURRENT = _budgetDomainOwnerContract_(), BudgetDomain.getFiscalYears = function (payload) {
    return _budgetGetFiscalYearsDomainOwner_(payload || {});
}, BudgetDomain.listByFY = function (payload) {
    payload = payload || {};
    var fast = payload.fast === !0 || payload.lite === !0;
    return _apiBudgetListByFYUnifiedCore_(payload, {
        apiName: "apiBudgetListByFY", fast: fast
    });
}, BudgetDomain.getSummary = function (payload) {
    return _budgetGetSummaryDomainOwner_(payload || {});
}, BudgetDomain.getDashboardSummaryForDashboard = function (payload) {
    return _budgetGetDashboardSummaryForDashboard_(payload || {});
}, BudgetDomain.saveImport = function (payload) {
    return _budgetSaveImportDomainOwner_(payload || {});
}, BudgetDomain.deleteImport = function (payload) {
    return _budgetDeleteImportDomainOwner_(payload || {});
}, BudgetDomain.VERSION = "budget-domain-production-single-owner-performance-i-r164", BudgetDomain.SERVICE_FACADE_CURRENT = {
    owner: "Code_32_Domain_Budget:BudgetService.ProductionOwner", Import: {
        source: "BudgetImports", list: function (payload) {
            return BudgetDomain.listByFY(_appAssignObjects_({}, payload || {}, { fast: !0, lite: !0, source: "BudgetDomain.Services.Import" }));
        }
    }, Summary: {
        source: "BudgetSummary/BudgetImports", get: function (payload) {
            return BudgetDomain.getSummary(payload || {});
        }
    }, TypeSummary: {
        source: "BudgetImports", excludePersonnelCompensation: !0, includePersonnelCompensation: !1, get: function (payload) {
            return BudgetDomain.getTypeSummary(payload || {});
        }
    }, FiscalYear: {
        source: "BudgetImports+settings"
    }, status: function () {
        return {
            ok: !0, owner: this.owner, sourceOfTruth: "BudgetImports", uiDomChanged: !1, businessLogicChanged: !1
        };
    }
}, BudgetDomain.Services = BudgetDomain.SERVICE_FACADE_CURRENT, BudgetDomain.normalizeTypeSummary = function (res) {
    var data = res && res.data && typeof res.data == "object" ? res.data : res;
    if (data && typeof data == "object") {
        var rows = Array.isArray(data.rows) ? data.rows : Array.isArray(data.data) ? data.data : _appArrayValue_(data.items);
        data.rows = rows, data.data = rows, data.items = rows, data.records = rows, data.totalRecords = Number(data.totalRecords || data.total || rows.length) || 0,
            data.total = data.totalRecords, data.page = Number(data.page || 1) || 1, data.limit = Number(data.limit || data.pageSize || 20) || 20, data.pageSize = data.limit,
            data.totalPages = Number(data.totalPages || Math.max(1, Math.ceil(data.totalRecords / data.limit))) || 1, data.owner = "BudgetDomain.getTypeSummary",
            data.domainOwner = "BudgetDomain", data.sourceOfTruth = "BudgetImports", data.serverPaged = !0, data.materializedFirst = !1, data.readModelFirst = !1;
    }
    return res;
}, BudgetDomain.getTypeSummary = function (payload) {
    (payload = payload || {}).sourceOfTruth = "BudgetImports", payload.materializedFirst = !1, payload.readModelFirst = !1, payload.readFromBudgetImports = !0, payload.page = Math.max(1, Number(payload.page || 1) || 1), payload.limit = Math.max(1, Math.min(Number(payload.limit || payload.pageSize || 20) || 20, 100)), payload.pageSize = payload.limit,
        payload.serverPaged = !0;
    var res = _budgetGetTypeSummaryByFYCore_(payload);
    return BudgetDomain.normalizeTypeSummary(res);
}, BudgetDomain.canonicalReadFacadeStatus = function () {
    var missing = [];
    typeof BudgetDomain.listByFY == "function" || missing.push("BudgetDomain.listByFY");
    _appIsFnName_("_apiBudgetListByFYUnifiedCore_") || missing.push("_apiBudgetListByFYUnifiedCore_");
    _appIsFnName_("apiBudgetListByFY") || missing.push("apiBudgetListByFY");
    typeof BudgetDomain.listByFYFast == "undefined" || missing.push("parallel-domain-fast-owner");
    return { ok: missing.length === 0, stamp: "budget-canonical-read-facade-r200", owner: "Code_32_Domain_Budget:BudgetDomain.listByFY", implementation: "_apiBudgetListByFYUnifiedCore_", canonicalApi: "apiBudgetListByFY", retiredCompatibilityApis: ["apiBudgetListByFYFast"], sourceOfTruth: "BudgetImports", noParallelDomainFastOwner: typeof BudgetDomain.listByFYFast == "undefined", noNewApi: !0, dtoContractPreserved: !0, missing: missing };
}, BudgetDomain.status = function () {
    return {
        ok: !0, owner: "BudgetDomain", version: BudgetDomain.VERSION || "budget-domain-production-single-owner-performance-i-r164", physical: BudgetDomain.PHYSICAL,
        phase5: BudgetDomain.OWNER_CONTRACT_CURRENT || _budgetDomainOwnerContract_(), stamp: BUDGET_DOMAIN_PHYSICAL_STAMP_CURRENT, uiDomChanged: !1,
        businessLogicChanged: !1, apiRouteContractPreserved: !0, retiredApiFacades: ["apiBudgetListByFYFast"]
    };
};


function _budgetCanonicalReadFacadeStatus_() {
    return BudgetDomain && typeof BudgetDomain.canonicalReadFacadeStatus == "function" ? BudgetDomain.canonicalReadFacadeStatus() : { ok: !1, missing: ["BudgetDomain.canonicalReadFacadeStatus"] };
}
