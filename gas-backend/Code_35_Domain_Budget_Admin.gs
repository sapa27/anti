/** Canonical — Budget command/admin owner. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {}, AppDomain = __APP_GLOBAL__.AppDomain = __APP_GLOBAL__.AppDomain || {}, BudgetDomain = __APP_GLOBAL__.BudgetDomain = __APP_GLOBAL__.BudgetDomain || {};
/* --------------------------------------------------------------------------
 * 10. Budget administration / year settings / salary settings
 * -------------------------------------------------------------------------- */
function apiBudgetAdminListYearSettingsAll(payload) {
    var auth = _bSafeReq_(payload, "admin", "apiBudgetAdminListYearSettingsAll");
    if (!auth.ok)
        return auth.result;
    payload = auth.payload;
    var rows = _budgetDataServiceRows_("BudgetYearSettingsItems", [], {
        includeDeleted: !1, requireCanonical: !1
    }) || [];
    return (rows = (_appArrayValue_(rows)).map(function (row, idx) {
        return row = row || {}, {
            fy: String(row.fy || row.fiscalYear || row.budgetFy || row.ปีงบประมาณ || "").replace(/[^0-9]/g, ""), category: String(row.category || row.planGroup || row.plan || row.แผนงาน || row.หมวด || "").trim(),
            planGroup: String(row.planGroup || row.category || row.plan || row.แผนงาน || row.หมวด || "").trim(), item: String(row.item || row.name || row.label || row.รายการ || row.ชื่อรายการ || "").trim(),
            budget: Number(String(row.budget || row.amount || row.totalBudget || row.วงเงิน || row.งบประมาณ || "0").replace(/,/g, "")) || 0, remark: String(row.remark || row.note || row.หมายเหตุ || "").trim(),
            order: Number(row.order || row.sortOrder || row.ลำดับ || idx + 1) || idx + 1
        };
    }).filter(function (row) {
        return row.fy || row.category || row.item || row.budget;
    })).sort(function (a, b) {
        return Number(b.fy || 0) - Number(a.fy || 0) || Number(a.order || 0) - Number(b.order || 0) || String(a.category + a.item).localeCompare(String(b.category + b.item), "th");
    }), ok_({
        rows, data: rows, totalRecords: rows.length
    }, "โหลดรายการตั้งค่างบประมาณสำเร็จ");
}
function apiBudgetAdminSaveYearSettingsRows(payload) {
    return writeGateway_("apiBudgetAdminSaveYearSettingsRows", payload || {}, function (input) {
        return budgetAdminSaveYearSettingsRows(input || {});
    }, "บันทึกตั้งค่าปีงบประมาณสำเร็จ", "บันทึกตั้งค่าปีงบประมาณไม่สำเร็จ");
}
function budgetAdminSaveYearSettingsRows(payload) {
    try {
        requireAuth_(payload, "admin"), payload = payload || {};
        var fy = String(payload.fy || "").trim();
        if (!fy)
            throw new Error("ไม่พบปีงบประมาณ");
        return _withScriptLock_(1e4, function () {
            getCanonicalHeaderAudit_("BudgetYearSettingsItems");
            for (var sh = getSheet_("BudgetYearSettingsItems"), existing = typeof getSheetMatrixCached_ == "function" ? getSheetMatrixCached_(sh, (SHEET_SCHEMAS.BudgetYearSettingsItems || []).length, {
                allowFullMatrix: !1
            }) : getSheetMatrix_(sh, (SHEET_SCHEMAS.BudgetYearSettingsItems || []).length, {
                allowFullMatrix: !1
            }), header = existing.length ? existing[0] : SHEET_SCHEMAS.BudgetYearSettingsItems.slice(), preserved = [], i = 1; i < existing.length; i++)
                String(existing[i][0] || "") !== fy && preserved.push(existing[i]);
            var rows = _appArrayValue_(payload.rows), now = new Date, prepared = rows.map(function (r, idx) {
                var category = String(r.category || "").trim(), planGroup = category.indexOf("บุคลากร") !== -1 ? "แผนงานบุคลากรภาครัฐ" : "แผนงานยุทธศาสตร์เพื่อสนับสนุนด้านการปรับสมดุลและพัฒนาระบบการบริหารจัดการภาครัฐ";
                return [
                    fy, category, String(r.item || "").trim(), Number(r.budget || 0), String(r.remark || "").trim(), "Y", planGroup, idx + 1, now,
                    !1, ""
                ];
            }), finalRows = [
                header
            ].concat(preserved, prepared);
            AppRepository.clearSheetContents("BudgetYearSettingsItems"), AppRepository.setRangeValues("BudgetYearSettingsItems", 1, 1, finalRows, {
                invalidate: !1
            }), invalidateSheetCache_("BudgetYearSettingsItems");
            var cacheInvalidation = _appIsFnName_("_invalidateBudgetDerivedCaches_") ? _invalidateBudgetDerivedCaches_("budgetAdminSaveYearSettingsRows") : {};
            return _appIsFnName_("_invalidateAdminDerivedCaches_") && (cacheInvalidation.admin = _invalidateAdminDerivedCaches_("budgetAdminSaveYearSettingsRows")),
                _safeAudit_("budgetAdminSaveYearSettingsRows", {
                    fy, rows: prepared.length, source: "batch.current.rebuild"
                }), ok_({
                fy, rows: prepared.length, cacheInvalidation: cacheInvalidation || {}
            }, "บันทึกตั้งค่าปีงบประมาณสำเร็จ");
        });
    }
    catch (e) {
        return _safeAudit_("budgetAdminSaveYearSettingsRows.error", {
            message: String(e && e.message || e)
        }), err_(e.message || String(e));
    }
}
function getBudgetYearSettingsMatrix(fy) {
    try {
        var rowsAll = _budgetRows_("BudgetYearSettingsItems", !1), targetFy = _b32FY_(fy) || _currentBudgetFyString_(), normalize = function (row, overrideFy) {
            return row = row || {}, {
                fy: String(overrideFy || row.fy || "").trim(), planGroup: String(row.planGroup || row.category || "").trim(), item: String(row.item || "").trim(),
                budget: Number(row.budget || 0) || 0
            };
        }, rows = rowsAll.filter(function (row) {
            return String(row && row.fy || "").trim() === targetFy;
        }).map(function (row) {
            return normalize(row);
        });
        if (!rows.length) {
            var prevFy = String(Number(targetFy) - 1), prevRows = rowsAll.filter(function (row) {
                return String(row && row.fy || "").trim() === prevFy;
            }).map(function (row) {
                return normalize(row, targetFy);
            });
            prevRows.length && (rows = prevRows);
        }
        return ok_({
            rows
        });
    }
    catch (e) {
        return err_(e.message, {
            rows: []
        });
    }
}
function _getBudgetImportRepository_() {
    return getCanonicalRepository_("budget.imports");
}
function _budgetImportExtraPayload_(row) {
    var warnings = [], extra = _budgetParsePayloadExtra_(row = row || {}, warnings);
    return Array.isArray(extra.visitLocations) || (extra.visitLocations = []), Array.isArray(extra.seminarLocations) || (extra.seminarLocations = []),
        Array.isArray(extra.countries) || (extra.countries = []), extra.countriesText || (extra.countriesText = row.countriesText || ""), extra.semDate || (extra.semDate = row.seminarDate || ""),
        extra.roundNo || (extra.roundNo = row.roundNo || ""), warnings.length && (extra._warnings = warnings), extra;
}
function _budgetImportListMapperContext_(row, mode) {
    row = row || {};
    mode = String(mode || "full");
    var extra = {}, warnings = [];
    if (mode === "full")
        extra = _budgetImportExtraPayload_(row);
    else
        try {
            extra = _budgetParsePayloadExtra_(row, warnings) || {};
        }
        catch (_extraErr) {
            if (mode !== "fast")
                throw _extraErr;
            extra = {};
        }
    var fy = mode === "full" ? String(row.fy || "").replace(/[^\d]/g, "") : _budgetRowFyLite_(row);
    mode === "fast" && !fy && (fy = _budgetRowFiscalYearForList_(row));
    return {
        row: row,
        mode: mode,
        extra: extra,
        fy: fy,
        warnings: warnings
    };
}
function _budgetMapImportListRowCanonical_(row, mode) {
    var ctx = _budgetImportListMapperContext_(row, mode), r = ctx.row, extra = ctx.extra, full = ctx.mode === "full", fast = ctx.mode === "fast";
    var startDate = full ? r.startDate : r.startDate || r.activityDate || (fast ? extra.startDate || extra.activityDate : "") || "";
    var endDate = full ? r.endDate : r.endDate || r.activityDate || (fast ? extra.endDate || extra.activityDate : "") || "";
    var activityDate = full ? r.activityDate : r.activityDate || r.startDate || (fast ? extra.activityDate || extra.startDate : "") || "";
    var amount = full ? Number(r.amount != null && r.amount !== "" ? r.amount : r.totalAmount) || 0 : _b32N_(r.amount || r.totalAmount || extra.rowAmount);
    var totalAmount = full ? Number(r.totalAmount != null && r.totalAmount !== "" ? r.totalAmount : r.amount) || 0 : _b32N_(r.totalAmount || r.amount || extra.rowAmount);
    function component(name) {
        return full ? Number(r[name] || 0) : _b32N_(r[name] || extra[name]);
    }
    return _budgetImportDto_({
        id: String(r.id || (fast ? r.ID : "") || ""),
        fy: ctx.fy,
        entryType: String(full ? r.entryType || "" : r.entryType || r.category || r.ประเภท || (fast ? extra.entryType || extra.category : "") || ""),
        committeeType: String(r.committeeType || (fast ? extra.committeeType : "") || ""),
        startDate: _bFormatDate(startDate || ""),
        endDate: _bFormatDate(endDate || ""),
        activityDate: _bFormatDate(activityDate || ""),
        seminarDate: _bFormatDate(r.seminarDate || (full ? "" : extra.semDate || (fast ? extra.seminarDate : "")) || ""),
        committeeName: String(r.committeeName || (fast ? extra.committeeName : "") || ""),
        roundNo: String(r.roundNo || (full ? "" : extra.roundNo) || ""),
        topic: String(r.topic || (full ? "" : r.item || (fast ? extra.topic : "")) || ""),
        amount: amount,
        committeeResponsible: String(r.committeeResponsible || (fast ? extra.committeeResponsible : "") || ""),
        staffResponsible: String(r.staffResponsible || (fast ? extra.staffResponsible : "") || ""),
        note: String(r.note || (fast ? extra.note : "") || ""),
        refundStatus: String(r.refundStatus || (fast ? extra.refundStatus : "") || "ยังไม่คืนเงิน"),
        refundDate: _bFormatDate(r.refundDate || extra.refundDate || ""),
        reportStatus: String(r.reportStatus || (fast ? extra.reportStatus : "") || "ยังไม่รายงาน"),
        reportDate: _bFormatDate(r.reportDate || extra.reportDate || ""),
        totalAmount: totalAmount,
        meetingAllowance: component("meetingAllowance"),
        snackCost: component("snackCost"),
        lunchCost: component("lunchCost"),
        travelCost: component("travelCost"),
        receptionCost: component("receptionCost"),
        seminarCost: component("seminarCost"),
        foreignTripCost: component("foreignTripCost"),
        foreignGuestCost: component("foreignGuestCost"),
        supportCost: _budgetResolveSupportCostAmount_(r, extra),
        visitLocations: String(r.visitLocations || r.visitLocationsText || (fast ? extra.visitLocationsText : "") || ""),
        seminarLocations: String(r.seminarLocations || r.seminarLocationsText || (fast ? extra.seminarLocationsText : "") || ""),
        countriesText: String(r.countriesText || (full ? "" : extra.countriesText) || ""),
        category: String(r.category || (fast ? extra.category : "") || ""),
        item: String(r.item || (full ? "" : extra.supportType) || ""),
        extra: extra,
        refundAgingDays: fast ? r.refundAgingDays || "" : _budgetAgingDays_(r, extra, "refund"),
        reportAgingDays: fast ? r.reportAgingDays || "" : _budgetAgingDays_(r, extra, "report"),
        fastLite: fast || void 0
    });
}
function _mapBudgetImportListRow_(row) {
    return _budgetMapImportListRowCanonical_(row, "full");
}
function _mapBudgetImportListRowLite_(row) {
    return _budgetMapImportListRowCanonical_(row, "lite");
}
function _mapBudgetImportListRowFastLite_(row) {
    return _budgetMapImportListRowCanonical_(row, "fast");
}
function _budgetDirectSheetObjects_(sheetName, options) {
    sheetName = String(sheetName || "").trim();
    var ttl = (options = options || {}).forceFresh === !0 ? 0 : options.ttl != null ? options.ttl : 240, fields = sheetName === "BudgetImports" ? _budgetImportCanonicalFields_() : _budgetProjectedFields_(sheetName);
    return typeof readRepositoryRows_ == "function" ? readRepositoryRows_(sheetName, fields, {
        includeDeleted: !1, requireCanonical: !1, ttl, forceFresh: options.forceFresh === !0 || options.noCache === !0 || options.bypassCache === !0 || options.bypassRequestCache === !0,
        owner: "budget." + sheetName
    }) || [] : _budgetDataServiceRows_(sheetName, fields, {
        includeDeleted: !1, requireCanonical: !1, ttl, forceFresh: options.forceFresh === !0 || options.noCache === !0 || options.bypassCache === !0 || options.bypassRequestCache === !0,
        noCache: options.noCache === !0, bypassCache: options.bypassCache === !0, bypassRequestCache: options.bypassRequestCache === !0
    }) || [];
}
function _budgetListImportRowsRobust_(options) {
    options = options || {};
    var bypass = _budgetCachePolicyBypass_(options) || options.forceFresh === !0 || options.noCache === !0 || options.bypassCache === !0 || options.bypassRequestCache === !0, cacheStamp, cacheKey = "budgetimports:active:current:r77:" + (_appIsFnName_("_entityCacheStamp_") ? _entityCacheStamp_("budgetimports") : "1");
    if (!bypass)
        try {
            var hit = _AppScriptCache_().get(cacheKey);
            if (hit)
                return JSON.parse(hit) || [];
        }
        catch (_cacheReadErr) {
            _b32W_("ec", _cacheReadErr);
        }
    var rows = [];
    try {
        rows = _budgetDirectSheetObjects_("BudgetImports", {
            forceFresh: bypass, noCache: bypass, bypassCache: bypass, bypassRequestCache: bypass, ttl: bypass ? 0 : 240
        });
    }
    catch (_directErr) {
        _recordWarning_("core.budget.import.directRows", _directErr), rows = [];
    }
    rows = (_appArrayValue_(rows)).filter(function (row) {
        var del = String((row || {}).isDeleted || (row || {}).deleted || "").trim().toLowerCase();
        return !(del === "true" || del === "1" || del === "deleted" || del === "ลบ");
    });
    if (!bypass)
        try {
            safeCachePut_(_AppScriptCache_(), cacheKey, rows, 240);
        }
        catch (_cachePutErr) {
            _b32W_("ec", _cachePutErr);
        }
    return rows;
}
function _budgetTypeSummaryHeaderKey_(value) {
    return String(value == null ? "" : value).replace(/[\s\n\r\t_\-–—()（）\[\]{}:：/\\.]+/g, "").toLowerCase();
}
function _budgetTypeSummaryPick_(row, keys) {
    return typeof AppBackendCore != "undefined" && AppBackendCore.pickNormalized ? AppBackendCore.pickNormalized(row || {}, keys, "") : "";
}
function _budgetTypeSummaryOwnerPolicy_() {
    return {
        contractStamp: "budget-single-source-type-summary-current", owner: "BudgetImports", sourceOfTruth: "BudgetImports", readOwner: "BudgetImports",
        writeOwner: "BudgetImports", editOwner: "BudgetImports", materializedSheet: "BudgetTypeSummary_current", readModelRole: "cache/report-only",
        materializedRole: "cache/report-read-model-only", readPath: "BudgetImports/direct-aggregate -> optional cache metadata only", archivedReadPathDisabled: !0,
        readModelFirst: !1, materializedFirst: !1, includePersonnelCompensation: !1, detailReadOwner: "BudgetImports", rebuildSource: "BudgetImports",
        liveImportDefaultAllowed: !0, liveImportDirectRead: !0, boundedDetailCache: !1, maxDetailScanRows: 1800, strictFiscalYear: !0, readThroughRefreshOnMiss: !1,
        mutationRefresh: !1, deferredReadModelRefresh: !0, preserveOtherFiscalYears: !0, replaceStrategy: "single-source-of-truth; BudgetImports is the only runtime read/write/edit source; BudgetTypeSummary remains cache/report model only",
        publicBridgeApi: "apiBudgetGetTypeSummaryByFY"
    };
}
function _budgetGetOptionalSheet_(sheetName) {
    try {
        return getSheetOptional_(String(sheetName || ""));
    }
    catch (_e) {
        return _b32W_("observed.catch", _e, {
            file: "C32"
        }), null;
    }
}
function _budgetTypeSummaryFyFromRow_(row) {
    row = row || {};
    var fy = String(_budgetTypeSummaryPick_(row, _B32FY) || "").replace(/[^0-9]/g, "");
    if (fy)
        return fy;
    try {
        fy = (_appIsFnName_("_budgetRowFiscalYearForList_") ? _budgetRowFiscalYearForList_(row) : "") || "";
    }
    catch (_fyListErr) {
        fy = "";
    }
    if (fy)
        return String(fy).replace(/[^0-9]/g, "");
    try {
        fy = (_appIsFnName_("_budgetRowFyLite_") ? _budgetRowFyLite_(row) : "") || "";
    }
    catch (_fyLiteErr) {
        fy = "";
    }
    return String(fy || "").replace(/[^0-9]/g, "");
}
function _budgetTypeSummaryImportSourceRows_(fy, options) {
    options = options || {}, fy = String(fy || "").replace(/[^0-9]/g, "") || _budgetNoWaitNormalizeFy_({});
    var raw = [], ttl = options.forceFresh === !0 ? 0 : Math.max(60, Math.min(Number(options.ttl || 240) || 240, 600));
    try {
        raw = _budgetDirectSheetObjects_("BudgetImports", {
            forceFresh: options.forceFresh === !0, ttl
        }) || [];
    }
    catch (_directErr) {
        try {
            raw = _budgetNoWaitReadRows_("BudgetImports", _budgetImportCanonicalFields_(), ttl) || [];
        }
        catch (_readErr) {
            _b32W_("budget.typeSummary.importSourceRows", _readErr, {
                fy, sourceOfTruth: "BudgetImports"
            }), raw = [];
        }
    }
    return (_appArrayValue_(raw)).filter(function (r) {
        if (!r || _budgetNoWaitDeleted_(r))
            return !1;
        var rowFy = _budgetTypeSummaryFyFromRow_(r);
        return !fy || rowFy === fy;
    }).map(function (r) {
        return _budgetFastTypeDto_(r, fy);
    });
}
function _budgetRowFiscalYearForList_(row) {
    var extra = (row = row || {}).extra || {};
    if (typeof extra == "string")
        try {
            extra = JSON.parse(extra) || {};
        }
        catch (_extraJsonErr) {
            extra = {};
        }
    var rowFy = _b32FY_(row.fy || row.FY || row.fiscalYear || row.budgetFy || row.budgetYear || row.year || row.ปีงบประมาณ || row.ปีงบ || extra.fy || extra.FY || extra.fiscalYear || extra.budgetFy || extra.budgetYear || extra.year || extra.ปีงบประมาณ || extra.ปีงบ);
    if (rowFy)
        return rowFy;
    for (var dateFields = [
        "activityDate", "startDate", "endDate", "seminarDate", "date", "meetingDate", "travelDate", "travelStartDate", "travelEndDate",
        "visitDate", "refundDate", "reportDate", "paidDate", "paymentDate", "createdAt", "updatedAt", "วันที่", "วันเดือนปี", "วันที่ประชุม", "วันที่เดินทาง",
        "วันที่เริ่ม", "วันที่สิ้นสุด", "วันคืนเงิน", "วันรายงาน"
    ], i = 0; i < dateFields.length; i++) {
        var key = dateFields[i], baseDate, d = _budgetParseDate_(row[key] || extra[key] || "" || "");
        if (d)
            return String(d.getMonth() >= 9 ? d.getFullYear() + 544 : d.getFullYear() + 543);
    }
    return "";
}
function listBudgetImportRecordsByFY(fy) {
    try {
        var payload = fy && typeof fy == "object" && !Array.isArray(fy) ? fy : {
            fy
        }, targetFy = String(payload.fy || "").replace(/[^\d]/g, "") || _resolveBudgetDefaultFiscalYear_(), page = Math.max(1, Number(payload.page || 1) || 1), requestedLimit = Math.max(0, Math.min(Number(payload.limit || payload.pageSize || 0) || 0, 5e3)), liteMode = payload.lite === !0 || String(payload.lite || "").toLowerCase() === "true", fastMode = payload.fast === !0 || String(payload.fast || "").toLowerCase() === "true" || liteMode, cacheStamp, cacheKey = [
            "budgetListByFY:current",
            _appIsFnName_("_entityCacheStamp_") ? _entityCacheStamp_("budgetimports") : "", targetFy, page, requestedLimit || 0, liteMode ? "lite" : "full",
            fastMode ? "fast" : "normal"
        ].join(":");
        if (payload.forceFresh !== !0 && _appIsFnName_("_cacheGetJson_")) {
            var cachedList = _cacheGetJson_(cacheKey);
            if (cachedList && Array.isArray(cachedList.rows))
                return cachedList.cached = !0, cachedList.cacheStatus = "hit", cachedList.cacheKey = cacheKey,
                    cachedList.source = String(cachedList.source || "") + ":cache-hit", ok_(cachedList, "โหลดรายการงบประมาณสำเร็จ");
        }
        var allRows = fastMode ? _budgetDirectSheetObjects_("BudgetImports", payload || {}) : _budgetListImportRowsRobust_(payload || {}), rows = (_appArrayValue_(allRows)).filter(function (row) {
            row = row || {};
            var del = String(row.isDeleted || row.deleted || "").trim().toLowerCase();
            return !(del === "true" || del === "1" || del === "deleted" || del === "ลบ" || targetFy && _budgetRowFiscalYearForList_(row) !== targetFy);
        }).sort(function (a, b) {
            return String(b && (b.activityDate || b.startDate || b.createdAt) || "").localeCompare(String(a && (a.activityDate || a.startDate || a.createdAt) || "")) || String(b && b.id || "").localeCompare(String(a && a.id || ""));
        }), totalRecords = rows.length, limit = requestedLimit || totalRecords, start = requestedLimit ? (page - 1) * limit : 0, pageRows, result = {
            rows: (requestedLimit ? rows.slice(start, start + limit) : rows).map(fastMode ? _mapBudgetImportListRowFastLite_ : liteMode ? _mapBudgetImportListRowLite_ : _mapBudgetImportListRow_),
            totalRecords, page, limit, pageSize: limit, totalPages: limit ? Math.max(1, Math.ceil(totalRecords / limit)) : 1, isPaged: !!requestedLimit,
            serverPaged: !!requestedLimit, lite: liteMode, fast: fastMode, fy: targetFy, source: fastMode ? "BudgetImports/current-direct-page" : "BudgetImports/current-repository-page",
            cached: !1, cacheStatus: "miss", cacheKey, contractStamp: "budget-list-dto-current"
        };
        return _appIsFnName_("_cachePutJson_") && _cachePutJson_(cacheKey, result, Math.max(30, Math.min(Number(payload.cacheTtlSeconds || 90) || 90, 300))), ok_(result, "โหลดรายการงบประมาณสำเร็จ");
    }
    catch (e) {
        return err_(e && e.message ? e.message : String(e), {
            rows: [], totalRecords: 0, page: 1, limit: 0, totalPages: 1, serverPaged: !1
        });
    }
}
function _budgetAfterTypeSummaryMutation_(record, reason) {
    var fy = _budgetTypeSummaryFyFromRow_(record = record || {}) || _budgetNoWaitNormalizeFy_(record), refresh = null, warning = "", dirtyMarker = null;
    try {
        _appIsFnName_("_AppCacheInvalidateDomain_") && (_AppCacheInvalidateDomain_("budget"), _AppCacheInvalidateDomain_("budgetimports"), _AppCacheInvalidateDomain_("dashboard"));
    }
    catch (_cacheErr) {
        _b32W_("budget.singleSource.cacheInvalidate", _cacheErr, {
            fy, reason
        });
    }
    try {
        dirtyMarker = _appIsFnName_("_budgetMarkTypeSummaryDirty_") ? _budgetMarkTypeSummaryDirty_(_appAssignObjects_({}, record, {
            fy
        }), reason || "budget-mutation") : null;
    }
    catch (_dirtyErr) {
        warning = String(_dirtyErr && _dirtyErr.message || _dirtyErr), _b32W_("budget.singleSource.dirtyMarker", _dirtyErr, {
            fy, reason
        });
    }
    try {
        var explicitRefresh;
        (record.syncReadModelRefresh === !0 || record.forceReadModelRefresh === !0 || record.refreshReadModelNow === !0) && fy && _appIsFnName_("_budgetRefreshTypeSummaryReadModel_") && (refresh = _budgetRefreshTypeSummaryReadModel_(_appAssignObjects_({}, record, {
            fy, fiscalYear: fy, forceFresh: !0, singleSourceExplicitRefresh: !0
        })));
    }
    catch (_refreshErr) {
        warning = String(_refreshErr && _refreshErr.message || _refreshErr), _b32W_("budget.singleSource.explicitReadModelRefresh", _refreshErr, {
            fy, reason
        });
    }
    return {
        fy, dirty: !refresh, refresh, warning, dirtyMarker, owner: "BudgetImports", sourceOfTruth: "BudgetImports", materializedSheet: "BudgetTypeSummary_current",
        readModelRole: "cache/report-read-model-only", reason: String(reason || "budget-mutation"), deferredReadModelRefresh: !refresh
    };
}
function _budgetFastWriteSchemaGate_(p, op) {
    p = p || {};
    var operation = String(op || "write"), mustEnsure = operation === "saveImport" || p.ensureSchema === !0 || p.schemaRepair === !0 || p.forceSchemaEnsure === !0 || p.ensureHeaders === !0, before = null, after = null, added = [];
    try {
        before = typeof getCanonicalHeaderAudit_ == "function" ? getCanonicalHeaderAudit_("BudgetImports") : {
            missing: []
        };
        var missing = before && Array.isArray(before.missing) ? before.missing.slice() : [];
        if (mustEnsure && missing.length) {
            for (var sh = getSheet_("BudgetImports"), meta = AppRepository.getSheetMeta("BudgetImports", { forceFresh: !0 }), width = Math.max(1, Number(meta.lastColumn || 0)), current = AppRepository.getRangeValues("BudgetImports", 1, 1, 1, width)[0] || [], headers = current.map(function (v) {
                return String(v == null ? "" : v).trim();
            }); headers.length && !headers[headers.length - 1];)
                headers.pop();
            var normalizedExisting = {};
            headers.forEach(function (h) {
                h && (normalizedExisting[String(h).replace(/[\s_\-()（）]/g, "").toLowerCase()] = !0);
            });
            var required = typeof BUDGET_IMPORT_SCHEMA != "undefined" && Array.isArray(BUDGET_IMPORT_SCHEMA) ? BUDGET_IMPORT_SCHEMA.slice() : missing.slice();
            if (required.forEach(function (h) {
                if (h = String(h || "").trim(), !!h) {
                    var nk = h.replace(/[\s_\-()（）]/g, "").toLowerCase();
                    normalizedExisting[nk] || (headers.push(h), normalizedExisting[nk] = !0, added.push(h));
                }
            }), added.length) {
                AppRepository.setRangeValues("BudgetImports", 1, 1, [headers], { domain: "budget", invalidate: !1 });
                try {
                    sh.setFrozenRows(1);
                }
                catch (_freezeErr) { _appIgnoreExpected_("Code_32_Domain_Budget.gs.ignored", _freezeErr); }
                typeof invalidateSheetCache_ == "function" && invalidateSheetCache_("BudgetImports"), typeof AppRepository != "undefined" && AppRepository && typeof AppRepository.flush == "function" && AppRepository.flush();
            }
        }
        after = typeof getCanonicalHeaderAudit_ == "function" ? getCanonicalHeaderAudit_("BudgetImports") : {
            missing: []
        };
        var remaining = after && Array.isArray(after.missing) ? after.missing.slice() : [];
        return remaining.length ? {
            ok: !1, operation, sheet: "BudgetImports", ensured: added.length > 0, added, missing: remaining, error: "ชีต BudgetImports ขาดหัวตารางสำคัญ: " + remaining.join(", ")
        } : {
            ok: !0, operation, sheet: "BudgetImports", ensured: added.length > 0, added, missing: []
        };
    }
    catch (e) {
        return _b32W_("budget.schema.ensure." + operation, e, {
            sheet: "BudgetImports"
        }), {
            ok: !1, operation, sheet: "BudgetImports", ensured: added.length > 0, added, missing: after && after.missing || before && before.missing || [],
            error: String(e && e.message || e || "ตรวจ schema งบประมาณไม่สำเร็จ")
        };
    }
}
function _budgetFastVerifyWrite_(p, id) {
    p = p || {};
    var verifyRequested = p.verifyWrite === !0 || p.strictWriteVerify === !0 || p.forceWriteVerify === !0, targetId = String(id || "").trim();
    if (!verifyRequested)
        return {
            ok: !0, verified: !1, skipped: !0, id: targetId, source: "BudgetImports/repository-read"
        };
    if (!targetId)
        return {
            ok: !1, verified: !1, id: "", error: "WRITE_VERIFY_ID_REQUIRED", source: "BudgetImports/direct-fresh-key-index"
        };
    try {
        typeof AppRepository != "undefined" && AppRepository && typeof AppRepository.flush == "function" && AppRepository.flush();
        var row = findSheetObjectByKey_("BudgetImports", "id", targetId, {
            includeDeleted: !0, requireCanonical: !0, bypassRequestCache: !0, forceFresh: !0, partitionBatchSize: 500
        });
        return row ? {
            ok: !0, verified: !0, row, rowNumber: Number(row._rowNumber || 0) || 0, id: targetId, source: "BudgetImports/direct-fresh-key-index",
            cacheBypassed: !0
        } : {
            ok: !1, verified: !1, id: targetId, error: "WRITE_VERIFY_NOT_FOUND", source: "BudgetImports/direct-fresh-key-index", cacheBypassed: !0
        };
    }
    catch (e) {
        return _b32W_("budget.save.verifyReadBack.direct", e, {
            id: targetId, sheet: "BudgetImports"
        }), {
            ok: !1, verified: !1, id: targetId, error: String(e && e.message || e), source: "BudgetImports/direct-fresh-key-index", cacheBypassed: !0
        };
    }
}
function budgetUnifiedDeleteImport(id) {
    return domainWrite_("budgetUnifiedDeleteImport", {
        id
    }, function (input) {
        var schemaGate = _budgetFastWriteSchemaGate_(input, "deleteImport");
        if (schemaGate && schemaGate.ok === !1)
            return err_("ตรวจ schema งบประมาณไม่สำเร็จ", schemaGate);
        var repo = _getBudgetImportRepository_(), existing = repo.findByKey(input.id, {
            includeDeleted: !0, requireCanonical: !0
        }), deleted = repo.softDelete(input.id), cacheInvalidation = _appIsFnName_("_invalidateBudgetDerivedCaches_") ? _invalidateBudgetDerivedCaches_("budgetUnifiedDeleteImport") : {}, typeSummaryRefresh = deleted ? _budgetAfterTypeSummaryMutation_(existing || {
            id: input.id, fy: _budgetNoWaitNormalizeFy_({})
        }, "deleteImport") : null;
        return deleted ? ok_({
            id: input.id, fy: typeSummaryRefresh && typeSummaryRefresh.fy, cacheInvalidation: cacheInvalidation || {}, typeSummaryRefresh
        }, "ลบรายการงบประมาณสำเร็จ") : err_("ไม่พบรหัสรายการ");
    });
}
function budgetUnifiedUpdateStatuses(id, refundStatus, reportStatus, statusPayload) {
    var request = id && typeof id == "object" ? _appAssignObjects_({}, id) : _appAssignObjects_({}, statusPayload || {}, {
        id, refundStatus, reportStatus
    });
    return domainWrite_("budgetUnifiedUpdateStatuses", request, function (input) {
        var schemaGate = _budgetFastWriteSchemaGate_(input, "updateStatuses");
        if (schemaGate && schemaGate.ok === !1)
            return err_("ตรวจ schema งบประมาณไม่สำเร็จ", schemaGate);
        var repo = _getBudgetImportRepository_(), existing = repo.findByKey(input.id, {
            includeDeleted: !0, requireCanonical: !0
        });
        if (!existing)
            return err_("ไม่พบรายการ");
        var patch = {};
        input.refundStatus && (patch.refundStatus = input.refundStatus), input.refundDate && (patch.refundDate = _budgetDateToIso_(input.refundDate) || input.refundDate),
            input.reportStatus && (patch.reportStatus = input.reportStatus), input.reportDate && (patch.reportDate = _budgetDateToIso_(input.reportDate) || input.reportDate);
        var mergedStatusRecord = _appAssignObjects_({}, existing, patch);
        _withBudgetStatusFreeze_(mergedStatusRecord, existing), repo.upsert(input.id, mergedStatusRecord);
        var cacheInvalidation = _appIsFnName_("_invalidateBudgetDerivedCaches_") ? _invalidateBudgetDerivedCaches_("budgetUnifiedUpdateStatuses") : {}, typeSummaryRefresh = _budgetAfterTypeSummaryMutation_(mergedStatusRecord, "updateStatuses");
        return ok_({
            id: input.id, fy: typeSummaryRefresh && typeSummaryRefresh.fy, refundStatus: patch.refundStatus || existing.refundStatus || "", reportStatus: patch.reportStatus || existing.reportStatus || "",
            cacheInvalidation: cacheInvalidation || {}, typeSummaryRefresh
        }, "อัปเดตสถานะสำเร็จ");
    });
}
function _normalizeBudgetClassification_(input) {
    input = input || {};
    var entry = String(input.entryType || input.category || "").trim(), supportType = String(input.extra && input.extra.supportType || input.supportType || "").trim(), aliases = {
        การศึกษาดูงานในประเทศและจัดสัมมนา: "การศึกษาดูงานในประเทศและการจัดสัมมนา", จัดสัมมนา: "การจัดสัมมนา", การเดินทางศึกษาดูงานต่างประเทศ: "การศึกษาดูงานต่างประเทศ",
        ส่งเสริมและสนับสนุนการดำเนินการ: "ส่งเสริมและสนับสนุนการดำเนินงาน"
    };
    entry = aliases[entry] || entry, supportType = aliases[supportType] || supportType, input.entryType = entry, input.category = input.category || entry,
        input.extra = input.extra && typeof input.extra == "object" && !Array.isArray(input.extra) ? input.extra : {}, supportType && (input.extra.supportType = supportType);
    var effective = supportType || entry;
    return input.item || (input.item = effective), input.fy || (input.fy = _currentFiscalYearThai_(new Date)), input.fy = _b32FY_(input.fy) || String(input.fy || ""),
        input;
}
function _budgetDateParseMeta_(value) {
    if (_appIsFnName_("_systemDateParseMetaForAudit_"))
        try {
            return _systemDateParseMetaForAudit_(value);
        }
        catch (_budgetDateOwnerErr) {
            _b32W_("budget.dateParse.platformOwnerFailed", _budgetDateOwnerErr);
        }
    if (value == null || value === "")
        return {
            valid: !0, empty: !0, date: null, reason: "empty"
        };
    if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime()))
        return {
            valid: !0, date: value, reason: "date-object"
        };
    var raw = String(value || "").trim(), parsed = new Date(raw);
    return isNaN(parsed.getTime()) ? {
        valid: !1, date: null, reason: "unparseable"
    } : {
        valid: !0, date: parsed, reason: "date-parse"
    };
}
function _budgetParseDate_(value) {
    var meta = _budgetDateParseMeta_(value);
    return meta && meta.valid ? meta.date : null;
}
function _budgetDateToIso_(value) {
    var meta = _budgetDateParseMeta_(value);
    return meta && meta.valid && meta.date ? Utilities.formatDate(meta.date, Session.getScriptTimeZone(), "yyyy-MM-dd") : "";
}
function _budgetValidateInputDates_(input) {
    input = input || {};
    var invalid = [];
    return [
        "startDate", "endDate", "activityDate", "seminarDate", "refundDate", "reportDate"
    ].forEach(function (field) {
        var value = input[field];
        if (value != null && String(value).trim() !== "") {
            var meta = _budgetDateParseMeta_(value);
            meta && meta.valid || invalid.push(field + "=" + String(value) + " (" + String(meta && meta.reason || "invalid") + ")");
        }
    }), invalid;
}
function _budgetHolidayKeyMap_() {
    var map = {};
    try {
        var rows;
        readSheetObjects_("SystemSettings", {
            includeDeleted: !1
        }).forEach(function (r) {
            var key = String(r.key || r.name || "").trim(), val = String(r.value || r.date || "").trim(), active = String(r.active == null ? "Y" : r.active).trim().toUpperCase();
            if (active !== "N" && active !== "FALSE" && active !== "0") {
                if (/^(thaiHoliday|holiday|systemHoliday)/i.test(key)) {
                    _appAddDateKey_(map, val);
                    try {
                        var parsed = JSON.parse(val);
                        Array.isArray(parsed) && parsed.forEach(function (value) { _appAddDateKey_(map, value); });
                    }
                    catch (_json) {
                        _b32W_("budget.holiday.parse", _json, {
                            key
                        });
                    }
                }
                _appAddDateKey_(map, key), _appAddDateKey_(map, val);
            }
        });
    }
    catch (_e) {
        _b32W_("budget.holiday.load", _e);
    }
    return map;
}
function _budgetIsThaiPublicHoliday_(d) {
    if (!d || Object.prototype.toString.call(d) !== "[object Date]" || isNaN(d.getTime()))
        return !1;
    var yyyy = d.getFullYear(), key = String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"), map = _budgetHolidayKeyMap_();
    return !(!map[yyyy + "-" + key] && !map[key]);
}
function _budgetBusinessDaysSince_(dateText, endDate) {
    var s = _budgetParseDate_(dateText), e = _budgetParseDate_(endDate || new Date) || new Date;
    if (!s || isNaN(s.getTime()) || !e || isNaN(e.getTime()))
        return 0;
    s.setHours(0, 0, 0, 0), e.setHours(0, 0, 0, 0);
    var count = 0, cur = new Date(s.getTime());
    for (cur.setDate(cur.getDate() + 1); cur <= e;) {
        var day = cur.getDay();
        day === 0 || day === 6 || _budgetIsThaiPublicHoliday_(cur) || count++, cur.setDate(cur.getDate() + 1);
    }
    return count;
}
function _budgetAgingBaseDate_(row) {
    row = row || {};
    var entry = String(row.entryType || "").trim();
    return entry === "การประชุมคณะกรรมาธิการ" || entry === "การประชุมคณะอนุกรรมาธิการ" ? row.activityDate || row.startDate || row.endDate || "" : row.endDate || row.activityDate || row.startDate || "";
}
function _budgetAgingEndDate_(row, extra, kind) {
    row = row || {}, extra = extra || {};
    var status = String(kind === "report" ? row.reportStatus : row.refundStatus || "").trim(), explicit, explicitIso = _budgetDateToIso_((kind === "report" ? row.reportDate || extra.reportDate || "" : row.refundDate || extra.refundDate || "") || ""), done;
    return explicitIso || _budgetStatusDone_(status, kind) && (extra[kind + "StatusFrozenAt"] || row.updatedAt) || new Date;
}
function _budgetCanonicalText_(value) {
    return String(value == null ? "" : value).replace(/[​-‍\uFEFF]/g, "").replace(/\s+/g, " ").trim();
}
function _budgetCanonicalAmount_(row) {
    var value = (row = row || {}).amount;
    value != null && value !== "" || (value = row.totalAmount), value = String(value == null ? "" : value).replace(/,/g, "").trim();
    var n = Number(value || 0);
    return isFinite(n) ? n : 0;
}
function _budgetCanonicalImportBase_(row) {
    var amount = _budgetCanonicalAmount_(row = row || {}), category, item;
    return {
        amount, totalAmount: amount, category: _budgetCanonicalText_(row.category || row.item || row.entryType || ""), item: _budgetCanonicalText_(row.item || row.category || row.entryType || ""),
        fy: _budgetCanonicalText_(row.fy || row.fiscalYear || ""), entryType: _budgetCanonicalText_(row.entryType || row.type || ""), schemaStamp: "domain-schema-budget-current"
    };
}
function _budgetStatusDto_(row, extra, kind) {
    row = row || {}, extra = extra || {};
    var status = String(kind === "report" ? row.reportStatus : row.refundStatus || "").trim() || (kind === "report" ? "ยังไม่รายงาน" : "ยังไม่คืนเงิน"), done = _budgetStatusDone_(status, kind), days = Number(_budgetAgingDays_(row, extra, kind) || 0) || 0, threshold = kind === "report" ? 15 : 1, overdue = !done && days > threshold, state;
    return {
        status, label: status, done, days, threshold, overdue, state: done ? "done" : overdue ? "overdue" : "pending", badgeClass: done ? "bg-success" : overdue ? "bg-danger" : "bg-warning text-dark",
        textClass: overdue ? "text-danger fw-bold" : "text-muted", rowClass: overdue ? "table-danger" : done ? "table-success" : ""
    };
}
function _budgetImportDto_(mappedRow) {
    var extra = (mappedRow = mappedRow || {}).extra || {}, canonical = _budgetCanonicalImportBase_(mappedRow), statusRow = _appAssignObjects_({}, mappedRow, canonical), refund = _budgetStatusDto_(statusRow, extra, "refund"), report = _budgetStatusDto_(statusRow, extra, "report");
    return _appAssignObjects_({}, mappedRow, canonical, {
        refundStatusLabel: refund.label, refundDone: refund.done, refundAgingDays: refund.days, refundAgingState: refund.state, refundBadgeClass: refund.badgeClass,
        refundTextClass: refund.textClass, refundRowClass: refund.rowClass, reportStatusLabel: report.label, reportDone: report.done, reportAgingDays: report.days,
        reportAgingState: report.state, reportBadgeClass: report.badgeClass, reportTextClass: report.textClass, reportRowClass: report.rowClass, agingState: report.overdue || refund.overdue ? "overdue" : report.done && refund.done ? "done" : "pending",
        rowClass: report.overdue || refund.overdue ? "table-danger" : report.done && refund.done ? "table-success" : "", canonicalCategoryKey: _budgetCanonicalText_(canonical.category).toLowerCase(),
        canonicalItemLabel: canonical.item || canonical.category, schemaStamp: canonical.schemaStamp, contractStamp: "budget-import-dto-current"
    });
}
function _budgetAgingDays_(row, extra, kind) {
    row = row || {}, extra = extra || {};
    var explicit = kind === "report" ? row.reportDate || extra.reportDate || "" : row.refundDate || extra.refundDate || "";
    if (_budgetDateToIso_(explicit || ""))
        return _budgetBusinessDaysSince_(_budgetAgingBaseDate_(row), explicit);
    var daysKey = kind + "StatusFrozenDays";
    return extra[daysKey] != null && extra[daysKey] !== "" ? Number(extra[daysKey] || 0) : _budgetBusinessDaysSince_(_budgetAgingBaseDate_(row), _budgetAgingEndDate_(row, extra, kind));
}
function _withBudgetStatusFreeze_(record, existing) {
    record = record || {}, existing = existing || {};
    var ex = {};
    try {
        ex = record.payloadJson || record.payloadJSON ? JSON.parse(record.payloadJson || record.payloadJSON) : {};
    }
    catch (_e) {
        ex = {};
    }
    var oldEx = {};
    try {
        oldEx = existing.payloadJson || existing.payloadJSON ? JSON.parse(existing.payloadJson || existing.payloadJSON) : {};
    }
    catch (_e2) {
        oldEx = {};
    }
    return [
        {
            kind: "refund", statusKey: "refundStatus", doneWord: "คืนเงินแล้ว"
        }, {
            kind: "report", statusKey: "reportStatus", doneWord: "รายงานแล้ว"
        }
    ].forEach(function (cfg) {
        var dateKey = cfg.kind + "StatusFrozenAt", daysKey = cfg.kind + "StatusFrozenDays", status = String(record[cfg.statusKey] || "").trim(), done;
        if (status.indexOf(cfg.doneWord) !== -1 || status.indexOf("แล้ว") !== -1 && status.indexOf("ยังไม่") === -1 || cfg.kind === "refund" && status.indexOf("ไม่มีการยืมเงิน") !== -1) {
            var explicitDoneDate, explicitIso = _budgetDateToIso_((cfg.kind === "refund" ? record.refundDate : record.reportDate) || "");
            ex[dateKey] = explicitIso || oldEx[dateKey] || ex[dateKey] || Utilities.formatDate(new Date, Session.getScriptTimeZone(), "yyyy-MM-dd"),
                ex[daysKey] = explicitIso || oldEx[daysKey] == null || oldEx[daysKey] === "" ? _budgetBusinessDaysSince_(_budgetAgingBaseDate_(record), ex[dateKey]) : Number(oldEx[daysKey] || 0);
        }
    }), record.payloadJson = JSON.stringify(ex), record.payloadJSON = record.payloadJson, record;
}
function budgetUnifiedSaveImport(payload) {
    var BUDGET_FAST_SAVE_PATH_ENABLED = !0;
    return domainWrite_("budgetUnifiedSaveImport", payload, function (input) {
        var schemaGate = _budgetFastWriteSchemaGate_(input = _normalizeBudgetClassification_(input || {}), "saveImport");
        if (schemaGate && schemaGate.ok === !1)
            return err_("ตรวจ schema งบประมาณไม่สำเร็จ", schemaGate);
        var repo = _getBudgetImportRepository_(), isNew = !input.id, id = String(input.id || "BI-" + Date.now()).trim(), existing = isNew ? null : repo.findByKey(id, {
            includeDeleted: !0, requireCanonical: !0
        });
        if (!isNew && !existing)
            return err_("ไม่พบ ID");
        var now = _bFormatDate(new Date), invalidDates = _budgetValidateInputDates_(input);
        if (invalidDates.length)
            return err_("รูปแบบวันที่ไม่ถูกต้อง: " + invalidDates.join(", "));
        var dto = _budgetNormalizeImportDto_(input, existing || {});
        input = dto.input;
        var ex = dto.extra, budgetNote = String(input.note != null && input.note !== "" ? input.note : input.remark != null && input.remark !== "" ? input.remark : ex.note != null && ex.note !== "" ? ex.note : existing && existing.note || "");
        ex.note = budgetNote;
        var amount = dto.amount, supportInputAmount = dto.supportCost, visitLocs = dto.visitLocations, seminarLocs = dto.seminarLocations, record = _appAssignObjects_({}, existing || {}, {
            id, fy: input.fy || existing && existing.fy || "", entryType: input.entryType || existing && existing.entryType || "", committeeType: input.committeeType || existing && existing.committeeType || "",
            startDate: _budgetDateToIso_(input.startDate || input.activityDate) || existing && existing.startDate || "", endDate: _budgetDateToIso_(input.endDate || input.activityDate) || existing && existing.endDate || "",
            activityDate: _budgetDateToIso_(input.activityDate || input.startDate) || existing && existing.activityDate || "", seminarDate: _budgetDateToIso_(ex.semDate || input.seminarDate) || existing && existing.seminarDate || "",
            committeeName: input.committeeName || existing && existing.committeeName || "", roundNo: ex.roundNo || input.roundNo || existing && existing.roundNo || "",
            topic: input.topic || existing && existing.topic || "", visitLocations: visitLocs.join(", "), seminarLocations: seminarLocs.join(", "),
            countriesText: ex.countriesText || input.countriesText || existing && existing.countriesText || "", meetingAllowance: Number(ex.meetingAllowance || 0),
            snackCost: Number(ex.snackCost || 0), lunchCost: Number(ex.lunchCost || 0), travelCost: Number(ex.travelCost || 0), receptionCost: Number(ex.receptionCost || 0),
            seminarCost: Number(ex.seminarCost || 0), foreignTripCost: Number(ex.foreignTripCost || 0), foreignGuestCost: Number(ex.foreignGuestCost || 0),
            amount, committeeResponsible: input.committeeResponsible || existing && existing.committeeResponsible || "", staffResponsible: input.staffResponsible || existing && existing.staffResponsible || "",
            note: budgetNote, createdAt: existing && existing.createdAt || now, updatedAt: now, refundStatus: input.refundStatus || existing && existing.refundStatus || "ยังไม่คืนเงิน",
            refundDate: _budgetDateToIso_(input.refundDate || ex.refundDate || "") || existing && existing.refundDate || "", reportStatus: input.reportStatus || existing && existing.reportStatus || "ยังไม่รายงาน",
            reportDate: _budgetDateToIso_(input.reportDate || ex.reportDate || "") || existing && existing.reportDate || "", subcommitteeName: input.subcommitteeName || ex.subcommitteeName || input.committeeName || existing && existing.subcommitteeName || "",
            seminarTitle: input.seminarTitle || ex.seminarTitle || input.topic || existing && existing.seminarTitle || "", supportType: ex.supportType || input.supportType || input.item || existing && existing.supportType || "",
            detail: input.detail || ex.detail || budgetNote || existing && existing.detail || "", guestCountry: input.guestCountry || ex.guestCountry || ex.countriesText || input.countriesText || existing && existing.guestCountry || "",
            visitPlace: visitLocs[0] || input.visitPlace || ex.visitPlace || existing && existing.visitPlace || "", visitProvince: visitLocs[1] || input.visitProvince || ex.visitProvince || existing && existing.visitProvince || "",
            visitDistrict: visitLocs[2] || input.visitDistrict || ex.visitDistrict || existing && existing.visitDistrict || "", visitSubDistrict: visitLocs[3] || input.visitSubDistrict || ex.visitSubDistrict || ex.visitSubdistrict || existing && existing.visitSubDistrict || "",
            seminarPlace: seminarLocs[0] || input.seminarPlace || ex.seminarPlace || existing && existing.seminarPlace || "", seminarProvince: seminarLocs[1] || input.seminarProvince || ex.seminarProvince || existing && existing.seminarProvince || "",
            seminarDistrict: seminarLocs[2] || input.seminarDistrict || ex.seminarDistrict || existing && existing.seminarDistrict || "", seminarSubDistrict: seminarLocs[3] || input.seminarSubDistrict || ex.seminarSubDistrict || ex.seminarSubdistrict || existing && existing.seminarSubDistrict || "",
            seminarItemsJson: JSON.stringify(ex.seminarItems || input.seminarItems || []), extraJson: JSON.stringify(ex || {}), visitLocationsJson: JSON.stringify(visitLocs), visitLocationsJSON: JSON.stringify(visitLocs), seminarLocationsJson: JSON.stringify(seminarLocs),
            seminarLocationsJSON: JSON.stringify(seminarLocs), countriesJson: JSON.stringify(ex.countries || (ex.countriesText ? [
                ex.countriesText
            ] : [])),
            countriesJSON: JSON.stringify(ex.countries || (ex.countriesText ? [
                ex.countriesText
            ] : [])), totalAmount: amount, payloadJson: JSON.stringify(_appAssignObjects_({}, ex, {
                contractStamp: dto.contractStamp, contractWarnings: dto.warnings || [], serverOwnedBusinessRules: !0
            })), payloadJSON: JSON.stringify(_appAssignObjects_({}, ex, {
                contractStamp: dto.contractStamp, contractWarnings: dto.warnings || [], serverOwnedBusinessRules: !0
            })), category: input.category || existing && existing.category || "", item: input.item || existing && existing.item || "", supportCost: supportInputAmount,
            visitLocationsText: input.visitLocationsText || visitLocs.join(", "), seminarLocationsText: input.seminarLocationsText || seminarLocs.join(", "),
            isDeleted: !1, deletedAt: ""
        });
        try {
            var passthrough = _appAssignObjects_({}, input || {}, ex || {});
            Object.keys(passthrough).forEach(function (k) {
                if ((k = String(k || "").trim()) && !/^(token|csrfToken|actionToken|clientContext|extra|payload|data)$/i.test(k)) {
                    var v = passthrough[k];
                    if (v != null) {
                        if (typeof v == "object")
                            try {
                                v = JSON.stringify(v);
                            }
                            catch (_jsonPass) {
                                v = String(v);
                            }
                        record[k] !== void 0 && record[k] !== "" && String(k).indexOf("budget-") !== 0 || (record[k] = v);
                    }
                }
            });
        }
        catch (_passErr) {
            _b32W_("budget.save.passThroughFields", _passErr, {
                id
            });
        }
        _withBudgetStatusFreeze_(record, existing || {});
        var upsertResult = repo.upsert(id, record), writeVerify = _budgetFastVerifyWrite_(input, id);
        if (writeVerify && writeVerify.ok === !1)
            return err_("บันทึกไม่สำเร็จ: ตรวจยืนยันข้อมูลหลังเขียนลงชีต BudgetImports ไม่ผ่าน", {
                id, sheet: "BudgetImports", sourceOfTruth: "BudgetImports", writeVerified: !1, verify: writeVerify
            });
        var cacheInvalidation = _appIsFnName_("_invalidateBudgetDerivedCaches_") ? _invalidateBudgetDerivedCaches_("budgetUnifiedSaveImport") : {}, typeSummaryRefresh = _budgetAfterTypeSummaryMutation_(record, isNew ? "saveImport:new" : "saveImport:update");
        return ok_({
            id, fy: typeSummaryRefresh && typeSummaryRefresh.fy, isNew, writeVerified: !(!writeVerify || !writeVerify.verified), verifySkipped: !(!writeVerify || !writeVerify.skipped),
            sheet: "BudgetImports", mode: upsertResult && upsertResult.mode || "", cacheInvalidation: cacheInvalidation || {}, typeSummaryRefresh
        }, isNew ? "เพิ่มรายการงบประมาณสำเร็จ" : "อัปเดตรายการงบประมาณสำเร็จ");
    });
}
function apiGetSalarySettings(payload) {
    var auth = _bSafeReq_(payload, "viewer", "apiGetSalarySettings");
    return auth.ok ? (payload = auth.payload, ok_(getSalarySettings(payload.fy || payload.year || ""), "โหลดข้อมูลอัตราค่าตอบแทนสำเร็จ")) : auth.result;
}
function apiSaveSalarySettings(payload) {
    return writeGateway_("apiSaveSalarySettings", payload || {}, function (input) {
        return requireAuth_(input || {}, "admin"), saveSalarySettings(input || {});
    }, "บันทึกอัตราค่าตอบแทนสำเร็จ", "บันทึกอัตราค่าตอบแทนไม่สำเร็จ");
}
function _budgetCanonicalCacheRead_(key) {
    try {
        if (_appIsFnName_("_AppScriptCache_")) {
            var raw = _AppScriptCache_().get(String(key || ""));
            if (raw)
                return JSON.parse(raw);
        }
    }
    catch (_cacheReadErr) {
        _b32W_("budget.canonical.cache.read", _cacheReadErr);
    }
    return null;
}
function _budgetCanonicalCacheWrite_(key, value, ttl) {
    try {
        var policy = _budgetCachePolicy_({
            cacheTtlSeconds: ttl
        }, "canonical");
        _appIsFnName_("_AppScriptCache_") && safeCachePut_(_AppScriptCache_(), String(key || ""), value, policy.ttlSeconds);
    }
    catch (_cacheWriteErr) {
        _b32W_("budget.canonical.cache.write", _cacheWriteErr);
    }
    return value;
}
function _budgetCanonicalEntityStamp_(name) {
    try {
        return _appIsFnName_("_entityCacheStamp_") ? _entityCacheStamp_(String(name || "budgetimports")) : "1";
    }
    catch (_verErr) {
        return "1";
    }
}
function _budgetCanonicalRowsFromSheet_(sheetName, ttl) {
    var fields;
    return _budgetNoWaitReadRows_(sheetName = String(sheetName || "").trim(), _appIsFnName_("_budgetProjectedFields_") ? _budgetProjectedFields_(sheetName) : [], ttl === 0 ? 0 : ttl || 240);
}
function _budgetBudgetSummaryRowToDto_(r, fy) {
    r = r || {};
    var pick = typeof AppBackendCore != "undefined" && AppBackendCore.makePickNormalized ? AppBackendCore.makePickNormalized(r, "") : function (keys) {
        return _budgetTypeSummaryPick_(r, keys);
    };
    function money(keys) {
        return _b32N_(pick(keys));
    }
    function moneyPositive(keys) {
        return _budgetPickFirstPositiveMoney_(r, keys);
    }
    var budget = money(_B32BUD), spent = moneyPositive([
        "personnelExpense", "staffExpense", "ytdExpense", "salaryExpense", "compensationExpense",
        "allowanceExpense", "currentMonthlyExpense", "monthlyRateTotal", "ค่าตอบแทน", "ค่าตอบแทนรวม", "เงินเดือน", "เงินเดือนรวม", "ค่าตอบแทนรายเดือน",
        "spent", "spentAmount", "expense", "expenseAmount", "totalExpense", "totalSpent", "totalPaid", "used", "usedAmount", "paid", "paidAmount", "actualAmount",
        "disbursement", "disbursed", "usedBudget", "รายจ่าย", "รายจ่ายรวม", "จำนวนรายจ่าย", "ยอดใช้จ่าย", "ค่าใช้จ่าย", "ค่าใช้จ่ายรวม", "เบิกจ่าย",
        "ยอดเบิกจ่าย", "amount", "totalAmount", "rowAmount", "จำนวนเงิน", "ยอดรวม", "รวมเป็นเงิน", "รวม"
    ]), remainRaw = pick(_B32REM), remain = remainRaw !== "" ? _b32N_(remainRaw) : budget - spent, planGroup = String(pick([
        "planGroup", "plan", "category", "แผนงาน", "หมวด", "หมวดงบประมาณ"
    ]) || "แผนงานงบประมาณ").trim() || "แผนงานงบประมาณ", item = String(pick([
        "item", "name", "label", "title", "รายการ", "ชื่อรายการ", "รายการงบประมาณ"
    ]) || "-").trim() || "-", isPersonnel = _budgetIsPersonnelBudgetRow_({
        planGroup, category: planGroup, item, label: item, name: item
    });
    return {
        id: String(pick([
            "id", "ID"
        ]) || ""), fy: String(fy || pick(_B32FY) || ""), planGroup, category: planGroup, item, budget, totalBudget: budget,
        spent, spentAmount: spent, expense: spent, expenseAmount: spent, totalPaid: spent, totalSpent: spent, personnelExpense: isPersonnel ? spent : 0,
        staffExpense: isPersonnel ? spent : 0, remain, balance: remain, isPersonnelCompensation: isPersonnel
    };
}
function _budgetCanonicalSummaryRows_(fy, options) {
    options = options || {};
    fy = _b32FY_(fy) || String(fy || "").replace(/[^0-9]/g, "") || _currentBudgetFyString_();
    var cacheBypass = _budgetCachePolicyBypass_(options) || options.forceFresh === !0 || options.noCache === !0 || options.bypassCache === !0 || options.bypassRequestCache === !0 || options.reload === !0, cacheStamp = _budgetCanonicalEntityStamp_("budgetimports") + "|" + _budgetCanonicalEntityStamp_("budgetsummary") + "|" + _budgetCanonicalEntityStamp_("budgetyearsettingsitems") + "|" + _budgetCanonicalEntityStamp_("personnel_staff") + "|" + _budgetCanonicalEntityStamp_("salarypayments") + "|" + _budgetCanonicalEntityStamp_("salarysettings") + "|" + _budgetCanonicalEntityStamp_("budgetsalarysettings") + "|budget-personnel-summary-row-current-v13-r77", cacheKey = "budget:canonical:summary:personnel-summary-row-current-v12:" + fy + ":" + cacheStamp, cached = cacheBypass ? null : _budgetCanonicalCacheRead_(cacheKey);
    if (cached && Array.isArray(cached.rows))
        return _budgetNoWaitEnsurePersonnelRow_(cached.rows, fy);
    var rows = [];
    try {
        rows = (typeof _budgetSummaryRowsFromImportsLite_ == "function" ? _budgetSummaryRowsFromImportsLite_(fy) : []) || [];
    }
    catch (_importsSummaryErr) {
        _b32W_("budget.canonical.summary.imports", _importsSummaryErr, {
            fy
        }), rows = [];
    }
    if (!Array.isArray(rows) || !rows.length)
        try {
            rows = _budgetCanonicalRowsFromSheet_("BudgetSummary", 0).filter(function (r) {
                if (!r || _budgetNoWaitDeleted_(r))
                    return !1;
                var rowFy = _b32FY_(_budgetTypeSummaryPick_(r, _B32FY));
                return !fy || !rowFy || rowFy === fy;
            }).map(function (r) {
                return _budgetBudgetSummaryRowToDto_(r, fy);
            }).filter(function (r) {
                return r.planGroup || r.item || r.budget || r.spent || r.remain;
            });
        }
        catch (_matSummaryErr) {
            _b32W_("budget.canonical.summary.materialized", _matSummaryErr, {
                fy
            }), rows = [];
        }
    if (!Array.isArray(rows) || !rows.length)
        try {
            rows = (typeof _budgetSummaryRowsFromSettingsOnly_ == "function" ? _budgetSummaryRowsFromSettingsOnly_(fy) : []) || [];
        }
        catch (_settingsErr) {
            _b32W_("budget.canonical.summary.settings", _settingsErr, {
                fy
            }), rows = [];
        }
    return rows = _budgetNoWaitEnsurePersonnelRow_(_appArrayValue_(rows), fy), _budgetCanonicalCacheWrite_(cacheKey, {
        rows
    }, 180).rows;
}
function _budgetFastTypeSummaryFields_(sheetName) {
    var common = [
        "id", "ID", "fy", "FY", "fiscalYear", "budgetFy", "budgetYear", "year", "ปีงบประมาณ", "ปีงบ", "entryType", "type", "category",
        "item", "itemName", "topic", "name", "label", "ประเภทรายการ", "ประเภทรายการงบประมาณ", "ประเภท", "รายการ", "ชื่อรายการ", "รายการงบประมาณ", "หัวข้อ",
        "ชื่อเรื่อง", "committeeType", "committeeName", "roundNo", "คณะ", "ชื่อคณะ", "ครั้งที่", "startDate", "endDate", "activityDate", "seminarDate",
        "date", "createdAt", "updatedAt", "วันที่", "วันเดือนปี", "วันที่ดำเนินการ", "วันที่เริ่ม", "วันที่สิ้นสุด", "meetingAllowance", "snackCost",
        "lunchCost", "travelCost", "receptionCost", "seminarCost", "foreignTripCost", "foreignGuestCost", "supportCost", "spent", "expense", "paid",
        "paidAmount", "actualAmount", "expenseAmount", "disbursement", "disbursed", "usedBudget", "usedAmount", "รายจ่าย", "รายจ่ายรวม", "จำนวนรายจ่าย",
        "เบิกจ่าย", "ยอดเบิกจ่าย", "amount", "totalAmount", "rowAmount", "จำนวนเงิน", "ยอดรวม", "รวมเป็นเงิน", "ค่าใช้จ่าย", "ค่าใช้จ่ายรวม", "committeeResponsible",
        "staffResponsible", "note", "remark", "refundStatus", "refundDate", "reportStatus", "reportDate", "สถานะคืนเงิน", "สถานะการคืนเงิน", "วันที่คืนเงิน",
        "วันคืนเงิน", "สถานะรายงาน", "สถานะรายงานค่าใช้จ่าย", "วันที่รายงาน", "วันรายงาน", "payloadJson", "payloadJSON", "extraJson", "extraJSON", "extra",
        "seminarItemsJson", "seminarItemsJSON", "subcommitteeName", "seminarTitle", "supportType", "detail", "guestCountry", "visitLocations", "seminarLocations",
        "countriesText", "visitLocationsText", "seminarLocationsText", "visitLocationsJson", "visitLocationsJSON", "seminarLocationsJson", "seminarLocationsJSON",
        "countriesJson", "countriesJSON", "seminarPlace", "seminarProvince", "seminarDistrict", "seminarSubDistrict", "seminarSubdistrict", "visitPlace",
        "visitProvince", "visitDistrict", "visitSubDistrict", "visitSubdistrict", "isDeleted", "deleted", "deletedAt"
    ];
    return (sheetName = String(sheetName || "").trim()) === "BudgetTypeSummary" ? common.concat([
        "sourceRow", "source", "updatedAt"
    ]) : common;
}
function _budgetFastNormalizeKey_(v) {
    try {
        if (_appIsFnName_("_budgetTypeSummaryHeaderKey_"))
            return _budgetTypeSummaryHeaderKey_(v);
    }
    catch (_e) {
        _b32W_("budget.obs.observed", _e);
    }
    return String(v == null ? "" : v).trim().toLowerCase().replace(/\s+/g, "");
}
function _budgetFastPick_(row, keys) {
    return _appIsFnName_("_budgetTypeSummaryPick_") ? _budgetTypeSummaryPick_(row, keys) : (function () {
        keys = Array.isArray(keys) ? keys : [
            keys
        ];
        for (var i = 0; i < keys.length; i++)
            if (row && row[keys[i]] != null && String(row[keys[i]]).trim() !== "")
                return row[keys[i]];
        return "";
    })();
}
function _budgetPickFirstPositiveMoney_(row, keys) {
    row = row || {}, keys = Array.isArray(keys) ? keys : [
        keys
    ];
    var sources = [
        row
    ];
    try {
        row.extra && typeof row.extra == "object" && !Array.isArray(row.extra) && sources.push(row.extra), String(row.extraJson || row.payloadJson || "").trim().charAt(0) === "{" && sources.push(JSON.parse(String(row.extraJson || row.payloadJson || "{}")));
    }
    catch (_moneyExtraErr) {
        _b32W_("budget.money.extra.parse", _moneyExtraErr);
    }
    for (var maps = sources.map(_budgetNormalizedKeyMap_), best = 0, seen = !1, i = 0; i < keys.length; i++)
        for (var sIdx = 0; sIdx < sources.length; sIdx++) {
            var src = sources[sIdx] || {}, k = keys[i], v = src[k], real;
            if ((v == null || String(v).trim() === "") && (real = maps[sIdx][_budgetNormalizedLookupKey_(k)]) && (v = src[real]), v != null && String(v).trim() !== "") {
                var n = _b32N_(v);
                if (seen = !0, n > 0)
                    return n;
                best = n;
            }
        }
    return seen ? best : 0;
}
function _budgetFastTypeDto_(row, fy) {
    row = row || {};
    var rowFy = String(_budgetFastPick_(row, _B32FY) || "").replace(/[^0-9]/g, "");
    if (!rowFy)
        try {
            rowFy = (_appIsFnName_("_budgetRowFyLite_") ? _budgetRowFyLite_(row) : "") || "";
        }
        catch (_fyErr) {
            rowFy = "";
        }
    var entryType = String(_budgetFastPick_(row, _B32ENTRY) || "").trim(), item = String(_budgetFastPick_(row, [
        "item", "itemName", "topic", "name",
        "label", "รายการ", "ชื่อรายการ", "รายการงบประมาณ", "หัวข้อ", "ชื่อเรื่อง"
    ]) || "").trim(), moneyFields = [
        "personnelExpense", "staffExpense",
        "ytdExpense", "salaryExpense", "compensationExpense", "allowanceExpense", "currentMonthlyExpense", "monthlyRateTotal", "totalPaid", "totalSpent",
        "spent", "spentAmount", "expense", "expenseAmount", "totalExpense", "paid", "paidAmount", "actualAmount", "disbursement", "disbursed", "usedBudget",
        "usedAmount", "รายจ่าย", "รายจ่ายรวม", "จำนวนรายจ่าย", "ค่าใช้จ่าย", "ค่าใช้จ่ายรวม", "เบิกจ่าย", "ยอดเบิกจ่าย", "amount", "totalAmount", "rowAmount",
        "จำนวนเงิน", "ยอดรวม", "รวมเป็นเงิน", "ค่าตอบแทน", "ค่าตอบแทนรายเดือน"
    ], amount = _budgetPickFirstPositiveMoney_(row, moneyFields), totalAmount = _budgetPickFirstPositiveMoney_(row, [
        "totalAmount", "amount"
    ].concat(moneyFields));
    !totalAmount && amount && (totalAmount = amount);
    var activityDate = _budgetFastPick_(row, [
        "activityDate", "startDate", "date", "createdAt", "updatedAt", "วันที่", "วันเดือนปี", "วันที่ดำเนินการ",
        "วันที่เริ่ม"
    ]) || "", warnings = [], extra = {};
    try {
        extra = (_appIsFnName_("_budgetParsePayloadExtra_") ? _budgetParsePayloadExtra_(row, warnings) : {}) || {};
    }
    catch (_extraErr) {
        extra = {};
    }
    var seminarLocs = _appArrayValue_(extra.seminarLocations);
    seminarLocs.length || (seminarLocs = [
        _budgetFastPick_(row, [
            "seminarPlace"
        ]), _budgetFastPick_(row, [
            "seminarProvince"
        ]), _budgetFastPick_(row, [
            "seminarDistrict"
        ]), _budgetFastPick_(row, _B32_SEMINAR_SUBDISTRICT_SHORT_FIELDS)
    ].map(function (x) {
        return String(x || "").trim();
    }).filter(Boolean));
    var visitLocs = _appArrayValue_(extra.visitLocations), out;
    return visitLocs.length || (visitLocs = [
        _budgetFastPick_(row, [
            "visitPlace"
        ]), _budgetFastPick_(row, [
            "visitProvince"
        ]), _budgetFastPick_(row, [
            "visitDistrict"
        ]), _budgetFastPick_(row, _B32_VISIT_SUBDISTRICT_FIELDS)
    ].map(function (x) {
        return String(x || "").trim();
    }).filter(Boolean)), {
        id: String(_budgetFastPick_(row, [
            "id", "ID", "เลขที่"
        ]) || ""), fy: String(rowFy || fy || ""), fiscalYear: String(rowFy || fy || ""), entryType,
        type: entryType, category: String(_budgetFastPick_(row, _B32_CATEGORY_FIELDS) || entryType || "").trim(), item, topic: String(_budgetFastPick_(row, [
            "topic",
            "item", "รายการ", "ชื่อเรื่อง"
        ]) || item || "").trim(), committeeType: String(_budgetFastPick_(row, [
            "committeeType", "คณะ"
        ]) || ""), committeeName: String(_budgetFastPick_(row, [
            "committeeName", "ชื่อคณะ"
        ]) || ""), subcommitteeName: String(_budgetFastPick_(row, _B32_SUBCOMMITTEE_FIELDS) || extra.subcommitteeName || ""), roundNo: String(_budgetFastPick_(row, [
            "roundNo", "ครั้งที่"
        ]) || ""), seminarTitle: String(_budgetFastPick_(row, _B32_SEMINAR_TITLE_FIELDS) || extra.seminarTitle || ""), supportType: String(_budgetFastPick_(row, _B32_SUPPORT_TYPE_FIELDS) || extra.supportType || ""), detail: String(_budgetFastPick_(row, _B32_DETAIL_FIELDS) || extra.detail || ""), guestCountry: String(_budgetFastPick_(row, [
            "guestCountry", "ประเทศของแขก"
        ]) || extra.guestCountry || extra.countriesText || ""), startDate: _bFormatDate(_budgetFastPick_(row, [
            "startDate",
            "activityDate", "date", "วันที่เริ่ม", "วันที่"
        ]) || ""), endDate: _bFormatDate(_budgetFastPick_(row, [
            "endDate", "วันที่สิ้นสุด"
        ]) || ""),
        activityDate: _bFormatDate(activityDate || ""), seminarDate: _bFormatDate(_budgetFastPick_(row, [
            "seminarDate"
        ]) || ""), meetingAllowance: _b32N_(_budgetFastPick_(row, [
            "meetingAllowance"
        ])), snackCost: _b32N_(_budgetFastPick_(row, [
            "snackCost"
        ])), lunchCost: _b32N_(_budgetFastPick_(row, [
            "lunchCost"
        ])),
        travelCost: _b32N_(_budgetFastPick_(row, [
            "travelCost"
        ])), receptionCost: _b32N_(_budgetFastPick_(row, [
            "receptionCost"
        ])), seminarCost: _b32N_(_budgetFastPick_(row, [
            "seminarCost"
        ])), foreignTripCost: _b32N_(_budgetFastPick_(row, [
            "foreignTripCost"
        ])), foreignGuestCost: _b32N_(_budgetFastPick_(row, [
            "foreignGuestCost"
        ])),
        supportCost: _appIsFnName_("_budgetResolveSupportCostAmount_") ? _budgetResolveSupportCostAmount_(row, extra) : _b32N_(_budgetFastPick_(row, [
            "supportCost"
        ])), amount, totalAmount, committeeResponsible: String(_budgetFastPick_(row, [
            "committeeResponsible"
        ]) || ""), staffResponsible: String(_budgetFastPick_(row, [
            "staffResponsible"
        ]) || ""), note: String(_budgetFastPick_(row, [
            "note", "remark"
        ]) || ""), refundStatus: String(_budgetFastPick_(row, [
            "refundStatus",
            "สถานะการคืนเงิน"
        ]) || "ยังไม่คืนเงิน"), refundDate: _bFormatDate(_budgetFastPick_(row, [
            "refundDate", "วันคืนเงิน"
        ]) || ""), reportStatus: String(_budgetFastPick_(row, [
            "reportStatus", "สถานะรายงาน"
        ]) || "ยังไม่รายงาน"), reportDate: _bFormatDate(_budgetFastPick_(row, [
            "reportDate", "วันรายงาน"
        ]) || ""), visitLocations: String(_budgetFastPick_(row, _B32_VISIT_LOCATIONS_FIELDS) || visitLocs.join(", ") || ""), seminarLocations: String(_budgetFastPick_(row, _B32_SEMINAR_LOCATIONS_FIELDS) || seminarLocs.join(", ") || ""), countriesText: String(_budgetFastPick_(row, [
            "countriesText"
        ]) || extra.countriesText || ""), visitPlace: String(_budgetFastPick_(row, [
            "visitPlace"
        ]) || visitLocs[0] || ""), visitProvince: String(_budgetFastPick_(row, [
            "visitProvince"
        ]) || visitLocs[1] || ""), visitDistrict: String(_budgetFastPick_(row, [
            "visitDistrict"
        ]) || visitLocs[2] || ""), visitSubDistrict: String(_budgetFastPick_(row, _B32_VISIT_SUBDISTRICT_FIELDS) || visitLocs[3] || ""), seminarPlace: String(_budgetFastPick_(row, [
            "seminarPlace"
        ]) || seminarLocs[0] || ""), seminarProvince: String(_budgetFastPick_(row, [
            "seminarProvince"
        ]) || seminarLocs[1] || ""), seminarDistrict: String(_budgetFastPick_(row, [
            "seminarDistrict"
        ]) || seminarLocs[2] || ""),
        seminarSubDistrict: String(_budgetFastPick_(row, _B32_SEMINAR_SUBDISTRICT_SHORT_FIELDS) || seminarLocs[3] || ""), seminarItemsJson: String(_budgetFastPick_(row, _B32_SEMINAR_ITEMS_JSON_FIELDS) || ""),
        visitLocationsJson: String(_budgetFastPick_(row, _B32_VISIT_LOCATIONS_JSON_FIELDS) || ""), seminarLocationsJson: String(_budgetFastPick_(row, _B32_SEMINAR_LOCATIONS_JSON_FIELDS) || ""), countriesJson: String(_budgetFastPick_(row, [
            "countriesJson", "countriesJSON"
        ]) || ""), payloadJson: String(_budgetFastPick_(row, [
            "payloadJson", "payloadJSON"
        ]) || ""), extraJson: String(_budgetFastPick_(row, [
            "extraJson", "extraJSON"
        ]) || ""), extra, isDeleted: !1
    };
}
function _budgetFastReadWindowObjects_(sheetName, fields, opts) {
    opts = opts || {}, sheetName = String(sheetName || "").trim();
    var sh = _appIsFnName_("_budgetGetOptionalSheet_") ? _budgetGetOptionalSheet_(sheetName) : null;
    if (!sh)
        return {
            rows: [], scannedRows: 0, lastRow: 0, source: sheetName + "/missing"
        };
    var lastRow = Math.max(Number(sh.getLastRow && sh.getLastRow()) || 0, 1), width = Math.max(Number(sh.getLastColumn && sh.getLastColumn()) || 0, 1);
    if (lastRow < 2)
        return {
            rows: [], scannedRows: 0, lastRow, source: sheetName + "/empty"
        };
    var headers = AppRepository.getRangeValues(sheetName, 1, 1, 1, width)[0] || [], byKey = {};
    headers.forEach(function (h, i) {
        var raw = String(h || "").trim();
        raw && (byKey[raw] = i, byKey[_budgetFastNormalizeKey_(raw)] = i);
    });
    var cols = [];
    if ((_appArrayValue_(fields)).forEach(function (f) {
        var k = _appHasOwnProperty_(byKey, f) ? byKey[f] : byKey[_budgetFastNormalizeKey_(f)];
        (k === 0 || k > 0) && cols.indexOf(k) < 0 && cols.push(k);
    }), !cols.length)
        return {
            rows: [], scannedRows: 0, lastRow, source: sheetName + "/no-columns"
        };
    cols.sort(function (a, b) {
        return a - b;
    });
    for (var minCol = cols[0], maxCol = cols[cols.length - 1], batchSize = Math.max(50, Math.min(Number(opts.batchSize || 350) || 350, 700)), maxScanRows = Math.max(batchSize, Math.min(Number(opts.maxScanRows || 1400) || 1400, 3e3)), desired = Math.max(1, Number(opts.desired || 200) || 200), started = new Date().getTime(), deadlineMs = Math.max(700, Math.min(Number(opts.deadlineMs || 2600) || 2600, 5e3)), out = [], scanned = 0, end = lastRow; end >= 2 && scanned < maxScanRows && out.length < desired && !(new Date().getTime() - started > deadlineMs);) {
        var n = Math.min(batchSize, end - 1, maxScanRows - scanned), start = end - n + 1, values = AppRepository.getRangeValues(sheetName, start, minCol + 1, n, maxCol - minCol + 1);
        scanned += values.length;
        for (var r = values.length - 1; r >= 0; r--) {
            var arr = values[r], obj = {};
            if ((_appArrayValue_(fields)).forEach(function (f) {
                var idx = _appHasOwnProperty_(byKey, f) ? byKey[f] : byKey[_budgetFastNormalizeKey_(f)];
                obj[f] = (idx === 0 || idx > 0) && idx >= minCol && idx <= maxCol ? arr[idx - minCol] : "";
            }), out.push(obj), out.length >= desired)
                break;
        }
        end = start - 1;
    }
    try {
        _appIsFnName_("_requestScopeNoteRowsRead_") && _requestScopeNoteRowsRead_(sheetName, scanned);
    }
    catch (_n) {
        _b32W_("budget.rowsRead.note", _n);
    }
    return {
        rows: out, scannedRows: scanned, lastRow, source: sheetName + "/window-reverse"
    };
}
function _budgetCanonicalImportRowsByFy_(fy, options) {
    options = options || {}, fy = String(fy || "").replace(/[^0-9]/g, "");
    var cacheBypass = _budgetCachePolicyBypass_(options) || options.forceFresh === !0 || options.noCache === !0 || options.bypassCache === !0 || options.bypassRequestCache === !0 || options.reload === !0, requestedLimit = Math.max(1, Math.min(Number(options.limit || options.pageSize || options.limitTarget || 240) || 240, 1e3)), requestedPage = Math.max(1, Number(options.page || 1) || 1), desired = Math.max(1, Math.min(Number(options.desired || options.limitTarget || requestedPage * requestedLimit) || 240, 1e3)), cacheStamp = _budgetCanonicalEntityStamp_("budgetimports"), cacheKey = "budget:type:imports:window:current:" + fy + ":" + desired + ":" + cacheStamp, cached = cacheBypass ? null : _budgetCanonicalCacheRead_(cacheKey);
    if (cached && Array.isArray(cached.rows))
        return cached.rows;
    var fields = _budgetFastTypeSummaryFields_("BudgetImports"), rows = [], scanned = 0, cursorDesired = desired;
    try {
        var pack = _budgetFastReadWindowObjects_("BudgetImports", fields, {
            desired: Math.max(3 * desired, 360), batchSize: 450, maxScanRows: 1800, deadlineMs: 2800
        });
        scanned = pack.scannedRows || 0, rows = (pack.rows || []).filter(function (row) {
            if (!row || _budgetNoWaitDeleted_(row))
                return !1;
            var rowFy = String(_budgetFastPick_(row, _B32FY) || "").replace(/[^0-9]/g, "");
            if (!rowFy)
                try {
                    rowFy = (_appIsFnName_("_budgetRowFyLite_") ? _budgetRowFyLite_(row) : "") || "";
                }
                catch (_rfe) {
                    rowFy = "";
                }
            return !fy || rowFy === fy;
        }).slice(0, cursorDesired);
    }
    catch (_readErr) {
        _b32W_("budget.type.imports.window", _readErr, {
            fy
        }), rows = [];
    }
    return rows.__budgetScannedRows = scanned, rows.__budgetSource = "BudgetImports/window-reverse", _budgetCanonicalCacheWrite_(cacheKey, {
        rows
    }, Number(options.ttl || 600) || 600).rows;
}
function _budgetCanonicalTypeRows_(payload) {
    payload = payload || {};
    var fy = _budgetNoWaitNormalizeFy_(payload), limit = Math.max(10, Math.min(Number(payload.limit || payload.pageSize || 20) || 20, 100)), maxRows = Math.max(limit, Math.min(Number(payload.maxRows || payload.totalTarget || 800) || 800, 1e3)), cacheStamp = _budgetCanonicalEntityStamp_("budgetimports"), cacheBypass = payload.forceFresh === !0 || payload.noCache === !0 || payload.bypassCache === !0 || payload.reload === !0, cacheKey = "budget:canonical:type:budgetimports-v10:" + fy + ":" + maxRows + ":" + cacheStamp, cached = cacheBypass ? null : _budgetCanonicalCacheRead_(cacheKey);
    if (cached && Array.isArray(cached.rows))
        return cached.rows;
    var rows = [];
    try {
        if (payload.noWait === !0 || payload.fast === !0 || payload.lite === !0) {
            var rawWindow = _budgetCanonicalImportRowsByFy_(fy, {
                page: 1, limit: maxRows, pageSize: maxRows, desired: maxRows, forceFresh: cacheBypass, ttl: Math.max(60, Math.min(Number(payload.cacheTtlSeconds || 300) || 300, 600)), deadlineMs: Math.max(1500, Math.min(Number(payload.deadlineMs || 5e3) || 5e3, 8e3))
            }) || [];
            rows = (_appArrayValue_(rawWindow)).map(function (r) {
                return _budgetFastTypeDto_(r, fy);
            }), rows.__budgetSource = rawWindow.__budgetSource || "BudgetImports/window-reverse-source-of-truth", rows.__budgetScannedRows = rawWindow.__budgetScannedRows || rows.length,
                rows.__budgetDirty = rawWindow.__budgetDirty === !0;
        }
        else
            rows = _budgetTypeSummaryImportSourceRows_(fy, {
                forceFresh: cacheBypass, ttl: Math.max(60, Math.min(Number(payload.cacheTtlSeconds || 300) || 300, 600))
            }) || [], rows = _appArrayValue_(rows), rows.forEach(function (r) {
                r && (r.__budgetCanonicalSource = "BudgetImports/direct-source-of-truth");
            }), rows.__budgetSource = "BudgetImports/direct-source-of-truth", rows.__budgetScannedRows = rows.length, rows.__budgetDirty = !1;
    }
    catch (err) {
        _b32W_("budget.typeSummary.directBudgetImports", err, {
            fy
        }), rows = [], rows.__budgetSource = "BudgetImports/error-fallback-empty", rows.__budgetScannedRows = 0, rows.__budgetDirty = !1;
    }
    return rows.__budgetMaterializedRequired = !1, rows.__budgetMaterializedHit = !1, rows.__budgetDirectSource = !0, rows.__budgetPolicy = _budgetTypeSummaryOwnerPolicy_(),
        _budgetCanonicalCacheWrite_(cacheKey, {
            rows
        }, cacheBypass ? 0 : 300).rows;
}
function _budgetNoWaitNormalizeFy_(payload) {
    payload = payload || {};
    var fy = "";
    try {
        fy = (_appIsFnName_("_budgetCanonicalPayloadFy_") ? _budgetCanonicalPayloadFy_(payload) : "") || "";
    }
    catch (_fyErr) {
        fy = "";
    }
    if (!fy)
        try {
            fy = (_appIsFnName_("_resolveBudgetDefaultFiscalYear_") ? _resolveBudgetDefaultFiscalYear_() : "") || "";
        }
        catch (_defaultErr) {
            fy = "";
        }
    if (!fy) {
        var d = new Date;
        fy = String(d.getMonth() >= 9 ? d.getFullYear() + 544 : d.getFullYear() + 543);
    }
    return String(fy || "").replace(/[^0-9]/g, "");
}
function _budgetNoWaitDeleted_(row) {
    row = row || {};
    var v = String(row.isDeleted || row.deleted || row.deletedAt || "").trim().toLowerCase();
    return v === "true" || v === "1" || v === "deleted" || v === "ลบ";
}
function _budgetNoWaitReadRows_(sheetName, fields, ttl) {
    sheetName = String(sheetName || "").trim();
    try {
        var useFields = fields || [];
        return useFields && useFields.length || !_appIsFnName_("_budgetProjectedFields_") || (useFields = _budgetProjectedFields_(sheetName)), _budgetDataServiceRows_(sheetName, useFields || [], {
            includeDeleted: !1, requireCanonical: !1, ttl: ttl === 0 ? 0 : ttl || 240, forceFresh: ttl === 0, noCache: ttl === 0, bypassCache: ttl === 0,
            bypassRequestCache: ttl === 0
        }) || [];
    }
    catch (e) {
        _b32W_("budget.nowait.projected." + sheetName, e);
    }
    try {
        return (_appIsFnName_("_budgetRows_") ? _budgetRows_(sheetName, !1) : []) || [];
    }
    catch (e2) {
        _b32W_("budget.nowait.rows." + sheetName, e2);
    }
    return [];
}
function _budgetNoWaitImportRows_(fy, options) {
    return _budgetCanonicalImportRowsByFy_(fy, options || {});
}
function _budgetNoWaitMapImportRows_(rows) {
    return (rows = _appArrayValue_(rows)).map(function (row) {
        try {
            return _appIsFnName_("_mapBudgetImportListRowFastLite_") ? _mapBudgetImportListRowFastLite_(row) : row;
        }
        catch (_mapErr) {
            return row || {};
        }
    });
}
function _budgetNoWaitPersonnelLabel_() {
    return _appIsFnName_("_budgetPersonnelCompensationLabel_") ? _budgetPersonnelCompensationLabel_() : "ค่าตอบแทนผู้ปฏิบัติงานให้คณะกรรมาธิการประจำสภาผู้แทนราษฎร";
}
function _budgetPersonnelFiscalYtdPeriod_(fy, asOfDate) {
    fy = _b32FY_(fy) || String(fy || "").replace(/[^0-9]/g, "") || _currentBudgetFyString_();
    var range = _budgetFiscalYearRange_(fy), today = asOfDate || new Date;
    if (!range)
        return {
            fy, start: null, end: today, monthsElapsed: 0, valid: !1
        };
    var anchor = today < range.start ? range.start : today > range.end ? range.end : today;
    return anchor = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate(), 23, 59, 59, 999), {
        fy, start: range.start, end: anchor, fiscalEnd: range.end, monthsElapsed: _budgetMonthOverlapCount_(range.start, anchor, range.start, anchor),
        valid: !0, contractStamp: "budget-personnel-salary-summary-fiscal-ytd-current"
    };
}
function _budgetPersonnelExpenseReadModel_(fy) {
    fy = _b32FY_(fy) || String(fy || "").replace(/[^0-9]/g, "") || _currentBudgetFyString_();
    var stamp = [
        _budgetCanonicalEntityStamp_("salarypayments"), _budgetCanonicalEntityStamp_("personnel_staff"), _budgetCanonicalEntityStamp_("budgetsalarysettings"),
        _budgetCanonicalEntityStamp_("salarysettings")
    ].join("|"), cacheKey = "budget:personnel-expense:fy-v13:" + fy + ":" + stamp, cached = _budgetCanonicalCacheRead_(cacheKey);
    if (cached && cached.result && typeof cached.result == "object" && _b32N_(cached.result.amount || cached.result.ytdExpense || cached.result.currentMonthlyExpense) > 0)
        return cached.result;
    var period = _budgetPersonnelFiscalYtdPeriod_(fy, new Date), warnings = [], payTotal = 0, payMonthly = 0, payCount = 0, payInferredCount = 0;
    function pick(r, ks) {
        r = r || {};
        for (var raw = r.__raw && typeof r.__raw == "object" ? r.__raw : {}, i = 0; i < ks.length; i++) {
            var k = ks[i], v = r[k];
            if (v != null && String(v).trim() !== "" || (v = raw[k], v != null && String(v).trim() !== ""))
                return v;
        }
        return "";
    }
    function num(r, ks) {
        return _b32N_(pick(r, ks));
    }
    function dateValue(r, ks) {
        return _budgetParsePersonnelDate_(pick(r, ks));
    }
    function rowWithinFiscalYtd(r) {
        var rowFy = _b32FY_(pick(r, _B32FY)), paidDate = dateValue(r, _B32_PAYMENT_DATE_FIELDS);
        return paidDate && period.valid ? paidDate >= period.start && paidDate <= period.end : rowFy ? rowFy === fy : !0;
    }
    function inferredMonths(r) {
        if (!period.valid)
            return 0;
        var start = dateValue(r, [
            "startDate", "workStartDate", "appointedDate", "วันที่เริ่ม", "วันเริ่ม", "วันที่เริ่มดำรงตำแหน่ง", "วันเริ่มดำรงตำแหน่ง",
            "วันที่แต่งตั้ง", "วันแต่งตั้ง", "วันเริ่มทำหน้าที่"
        ]) || period.start, end = dateValue(r, [
            "endDate", "workEndDate", "retireDate", "วันที่สิ้นสุด",
            "วันสิ้นสุด", "วันที่พ้นตำแหน่ง", "วันพ้นตำแหน่ง", "วันสิ้นสุดตำแหน่ง"
        ]) || period.end;
        return _budgetMonthOverlapCount_(start, end, period.start, period.end);
    }
    function addPay(rows) {
        (_appArrayValue_(rows)).forEach(function (r) {
            if (!(!r || _budgetNoWaitDeleted_(r) || !rowWithinFiscalYtd(r))) {
                var paidDate = dateValue(r, _B32_PAYMENT_DATE_FIELDS), rate = num(r, [
                    "monthlyRate", "monthlySalary", "salary", "salaryAmount", "rate", "เงินเดือน", "ค่าตอบแทน",
                    "ค่าตอบแทนรายเดือน"
                ]), explicitMonths = num(r, [
                    "months", "monthCount", "จำนวนเดือน"
                ]), amountField = num(r, [
                    "amount", "totalAmount",
                    "paidAmount", "expense", "spent", "รายจ่าย", "ยอดเบิกจ่าย", "จำนวนเงิน", "ยอดรวม", "รวมเป็นเงิน"
                ]), months = paidDate ? 1 : explicitMonths || inferredMonths(r), amount2 = amountField > 0 ? amountField : rate > 0 ? rate * Math.max(1, months || 1) : 0;
                !paidDate && !explicitMonths && rate > 0 && amountField > 0 && amountField <= rate * 1.01 && months > 1 && (amount2 = rate * months),
                    amount2 > 0 && (payTotal += amount2, payCount++, !paidDate && months > 1 && payInferredCount++), rate > 0 && (!paidDate || period.valid && paidDate.getFullYear() === period.end.getFullYear() && paidDate.getMonth() === period.end.getMonth()) && (payMonthly += rate);
            }
        });
    }
    var salaryPayments = [];
    try {
        salaryPayments = _budgetDataServiceRows_("SalaryPayments", _budgetProjectedFields_("SalaryPayments"), {
            includeDeleted: !1, requireCanonical: !1, ttl: 300
        }) || [];
    }
    catch (e1) {
        warnings.push("SalaryPayments DataService: " + String(e1 && e1.message || e1));
    }
    if (!salaryPayments.length)
        try {
            salaryPayments = typeof _budgetCanonicalRowsFromSheet_ == "function" ? _budgetCanonicalRowsFromSheet_("SalaryPayments", 300) || [] : [];
        }
        catch (e2) {
            warnings.push("SalaryPayments direct: " + String(e2 && e2.message || e2));
        }
    addPay(salaryPayments);
    var calc = {};
    try {
        calc = calculatePersonnelSalaryObligation_(_budgetReadPersonnelStaffRowsForSalary_(), _salarySettingsRowsDirect_(), fy, period.valid ? period.end : new Date) || {};
    }
    catch (e3) {
        warnings.push("Personnel_Staff+SalarySettings: " + String(e3 && e3.message || e3));
    }
    var amount = payTotal > 0 ? payTotal : _b32N_(calc.ytdExpense || calc.amount || calc.currentMonthlyExpense || 0), budget = _b32N_(calc.annualCommitment || calc.budget || calc.monthlyBudget || 0), monthly = _b32N_(calc.currentMonthlyExpense || calc.monthlyRateTotal || payMonthly || 0);
    !amount && Number(calc.relevantCount || 0) > 0 && warnings.push("พบข้อมูลบุคลากรที่เกี่ยวข้อง แต่ยอดรายจ่ายค่าตอบแทนเป็น 0"), warnings = warnings.concat(calc.warnings || []).filter(function (v, i, a) {
        return v && a.indexOf(v) === i;
    }).slice(0, 20);
    var result = {
        amount: _b32N_(amount), spent: _b32N_(amount), expense: _b32N_(amount), currentMonthlyExpense: monthly, monthlyRateTotal: monthly, ytdExpense: _b32N_(amount),
        annualCommitment: budget, budget, count: Number(calc.relevantCount || 0), staffCount: Number(calc.staffCount || 0), paymentCount: payCount,
        inferredPaymentRows: payInferredCount, fiscalYtdStart: period.start ? period.start.toISOString() : "", fiscalYtdEnd: period.end ? period.end.toISOString() : "",
        fiscalYtdMonths: Number(period.monthsElapsed || 0), status: amount > 0 ? "production-fiscal-ytd-read-model" : "missing", source: payTotal > 0 ? "SalaryPayments fiscal-ytd" : amount > 0 ? "Personnel_Staff+SalarySettings fiscal-ytd" : "empty",
        contractStamp: "budget-personnel-salary-summary-fiscal-ytd-v10", warnings
    };
    return _budgetCanonicalCacheWrite_(cacheKey, {
        result
    }, 300), result;
}
function _budgetIsPersonnelCompensationTypeRow_(row) {
    if ((row = row || {}).isPersonnelCompensation === !0)
        return !0;
    var txt = String([
        row.planGroup, row.category, row.item, row.label, row.name, row.entryType, row.type, row.topic, row.description
    ].join(" ")).replace(/[\u00A0\u200B-\u200D\uFEFF]/g, " ").replace(/\s+/g, "").trim();
    return txt.indexOf("ค่าตอบแทนผู้ปฏิบัติงาน") > -1 || txt.indexOf("ผู้ปฏิบัติงานให้คณะกรรมาธิการ") > -1;
}
function _budgetNoWaitEnsurePersonnelRow_(rows, fy) {
    rows = Array.isArray(rows) ? rows.slice() : [], fy = _b32FY_(fy) || String(fy || "").replace(/[^0-9]/g, "") || _currentBudgetFyString_();
    var label = _budgetNoWaitPersonnelLabel_(), budgetKeys = "budget|totalBudget|amountBudget|budgetAmount|annualBudget|annualCommitment|monthlyBudget|วงเงินงบประมาณ|งบประมาณ|งบประมาณที่ได้รับ|งบประมาณรวม|จำนวนงบประมาณ".split("|"), expenseKeys = "personnelExpense|staffExpense|ytdExpense|salaryExpense|compensationExpense|allowanceExpense|currentMonthlyExpense|monthlyRateTotal|ค่าตอบแทน|ค่าตอบแทนรวม|เงินเดือน|เงินเดือนรวม|ค่าตอบแทนรายเดือน|totalPaid|totalSpent|spent|spentAmount|expense|expenseAmount|รายจ่าย|รายจ่ายรวม|จำนวนรายจ่าย|amount|totalAmount".split("|");
    function isPersonnel(row2) {
        return _budgetIsPersonnelBudgetRow_(row2 || {}) || _budgetIsPersonnelCompensationTypeRow_(row2 || {});
    }
    function pick(row2, keys) {
        row2 = row2 || {};
        for (var extra = row2.extra && typeof row2.extra == "object" ? row2.extra : {}, i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            if (row2[key] != null && String(row2[key]).trim() !== "")
                return row2[key];
            if (extra[key] != null && String(extra[key]).trim() !== "")
                return extra[key];
        }
        try {
            var v = _budgetTypeSummaryPick_(row2, keys);
            if (v != null && String(v).trim() !== "" || (v = _budgetTypeSummaryPick_(extra, keys), v != null && String(v).trim() !== ""))
                return v;
        }
        catch (_pickErr) {
            _b32W_("budget.personnel.pick", _pickErr);
        }
        return "";
    }
    function positive(row2, keys) {
        for (var best = 0, i = 0; i < keys.length; i += 1) {
            var n = _b32N_(pick(row2, [
                keys[i]
            ]));
            n > best && (best = n);
        }
        return best;
    }
    function maxPositive(values) {
        var best = 0;
        return (_appArrayValue_(values)).forEach(function (value) {
            var n = _b32N_(value);
            n > best && (best = n);
        }), best;
    }
    var existingPersonnelRows = rows.filter(isPersonnel), nonPersonnelRows = rows.filter(function (row2) {
        return !isPersonnel(row2);
    }), existing = existingPersonnelRows[0] || {}, model = {}, detailed = {}, settings = {}, materialized = {};
    try {
        model = _budgetPersonnelExpenseReadModel_(fy) || {};
    }
    catch (modelErr) {
        _b32W_("budget.personnel.readModel", modelErr, {
            fy
        });
    }
    try {
        detailed = typeof _calculatePersonnelSalaryExpenseDetailedFull_ == "function" ? _calculatePersonnelSalaryExpenseDetailedFull_(fy) || {} : {};
    }
    catch (detailErr) {
        _b32W_("budget.personnel.detailed", detailErr, {
            fy
        });
    }
    try {
        settings = typeof getSalarySettings == "function" ? getSalarySettings(fy) || {} : {};
    }
    catch (settingsErr) {
        _b32W_("budget.personnel.settings", settingsErr, {
            fy
        });
    }
    try {
        var materializedRows = typeof _budgetCanonicalRowsFromSheet_ == "function" ? _budgetCanonicalRowsFromSheet_("BudgetSummary", 0) || [] : [];
        (_appArrayValue_(materializedRows)).some(function (row2) {
            if (!row2 || !isPersonnel(row2))
                return !1;
            var rowFy = _b32FY_(pick(row2, _B32FY));
            return fy && rowFy && rowFy !== fy ? !1 : (materialized = row2, !0);
        });
    }
    catch (materializedErr) {
        _b32W_("budget.personnel.materialized", materializedErr, {
            fy
        });
    }
    var amount = maxPositive([
        model.ytdExpense, model.amount, detailed.ytdExpense, detailed.amount, model.currentMonthlyExpense, detailed.currentMonthlyExpense,
        positive(existing, expenseKeys), positive(materialized, expenseKeys)
    ]), budget = maxPositive([
        model.budget, model.annualCommitment, detailed.budget,
        detailed.annualCommitment, settings.budget, positive(existing, budgetKeys), positive(materialized, budgetKeys)
    ]), currentMonthlyExpense = maxPositive([
        model.currentMonthlyExpense,
        detailed.currentMonthlyExpense, model.monthlyRateTotal, detailed.monthlyRateTotal
    ]), annualCommitment = maxPositive([
        model.annualCommitment,
        detailed.annualCommitment, budget
    ]), remain = budget - amount, source = String(model.source || detailed.source || (positive(existing, expenseKeys) > 0 ? "existing-summary-row" : "") || (positive(materialized, expenseKeys) > 0 ? "BudgetSummary" : "") || "Personnel_Staff+SalarySettings"), row = _appAssignObjects_({}, existing, {
        id: String(existing.id || fy + "|personnel-compensation"), fy, fiscalYear: fy, planGroup: "แผนงานบุคลากรภาครัฐ", category: "แผนงานบุคลากรภาครัฐ",
        item: label, name: label, label, entryType: label, type: label, budget, totalBudget: budget, spent: amount, spentAmount: amount, expense: amount,
        expenseAmount: amount, totalPaid: amount, totalSpent: amount, personnelExpense: amount, staffExpense: amount, ytdExpense: amount, currentMonthlyExpense,
        monthlyRateTotal: maxPositive([
            model.monthlyRateTotal, detailed.monthlyRateTotal, currentMonthlyExpense
        ]), annualCommitment, amount, totalAmount: amount,
        remain, balance: remain, isPersonnelCompensation: !0, synthetic: !0, readOnly: !0, canEdit: !1, canDelete: !1, __budgetPersonnelExpenseSource: source,
        __budgetPersonnelExpenseContract: "budget-personnel-summary-row-current-v13-r77"
    });
    return nonPersonnelRows.unshift(row), nonPersonnelRows;
}
function _budgetNoWaitSummaryRows_(fy, options) {
    return _budgetCanonicalSummaryRows_(fy, options || {});
}
function _budgetNoWaitTotals_(rows) {
    try {
        if (_appIsFnName_("_computeBudgetSummaryGrandTotals_"))
            return _computeBudgetSummaryGrandTotals_(rows || []);
    }
    catch (_tErr) {
        _b32W_("budget.grandTotals.compute", _tErr);
    }
    var totals = {
        all: {
            budget: 0, spent: 0, remain: 0
        }, noPersonnel: {
            budget: 0, spent: 0, remain: 0
        }
    };
    function money(row, keys) {
        row = row || {};
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (row[k] != null && String(row[k]).trim() !== "")
                return Number(String(row[k]).replace(/,/g, "")) || 0;
        }
        return 0;
    }
    return (_appArrayValue_(rows)).forEach(function (r) {
        var textForSpent = String([
            r && r.planGroup, r && r.category, r && r.item
        ].join(" ")).replace(/\s+/g, ""), spentKeys = textForSpent.indexOf("บุคลากรภาครัฐ") > -1 || textForSpent.indexOf("ค่าตอบแทนผู้ปฏิบัติงาน") > -1 || textForSpent.indexOf("ผู้ปฏิบัติงานให้คณะกรรมาธิการ") > -1 ? [
            "personnelExpense",
            "staffExpense", "ytdExpense", "salaryExpense", "compensationExpense", "allowanceExpense", "currentMonthlyExpense", "monthlyRateTotal", "spent",
            "spentAmount", "expense", "expenseAmount", "รายจ่าย", "รายจ่ายรวม", "จำนวนรายจ่าย"
        ] : [
            "spent", "spentAmount", "expense", "expenseAmount",
            "totalExpense", "totalSpent", "totalPaid", "used", "usedAmount", "paid", "paidAmount", "actualAmount", "disbursement", "disbursed", "usedBudget",
            "รายจ่าย", "รายจ่ายรวม", "จำนวนรายจ่าย", "ค่าใช้จ่าย", "ค่าใช้จ่ายรวม", "เบิกจ่าย", "ยอดเบิกจ่าย", "totalAmount", "amount", "rowAmount"
        ], b = Number(r && r.budget || 0) || 0, s = money(r, spentKeys), rm = Number(r && (r.remain != null ? r.remain : r.balance));
        isFinite(rm) || (rm = b - s), totals.all.budget += b, totals.all.spent += s, totals.all.remain += rm;
        var text = String([
            r && r.planGroup, r && r.category, r && r.item
        ].join(" ")).replace(/\s+/g, "");
        text.indexOf("บุคลากรภาครัฐ") < 0 && text.indexOf("ค่าตอบแทนผู้ปฏิบัติงาน") < 0 && text.indexOf("ผู้ปฏิบัติงานให้คณะกรรมาธิการ") < 0 && (totals.noPersonnel.budget += b,
            totals.noPersonnel.spent += s, totals.noPersonnel.remain += rm);
    }), totals;
}
function _budgetNoWaitPaged_(rows, payload, defaultLimit, maxLimit) {
    rows = _appArrayValue_(rows);
    var page = Math.max(1, Number(payload && payload.page || 1) || 1), limit = Math.max(1, Math.min(Number(payload && (payload.limit || payload.pageSize) || defaultLimit) || defaultLimit, maxLimit || 1e3)), start = (page - 1) * limit;
    return {
        page, limit, totalRecords: rows.length, rows: rows.slice(start, start + limit), totalPages: Math.max(1, Math.ceil(rows.length / limit))
    };
}
function _budgetHotPathBypass_(payload) {
    return _appIsFnName_("_appCacheBypassRequested_") ? _appCacheBypassRequested_(payload || {}, ["afterWrite"]) : (payload = payload || {}).forceFresh === !0 || payload.forceRefresh === !0 || payload.noCache === !0 || payload.bypassCache === !0 || payload.reload === !0 || payload.afterWrite === !0;
}
function _budgetRowsCacheKey_(payload, scope) {
    var fy = _budgetNoWaitNormalizeFy_(payload = payload || {}), typeFilter = String(payload.type || payload.typeFilter || payload.category || "").trim();
    typeFilter === "ทั้งหมด" && (typeFilter = "");
    var raw = {
        scope: String(scope || "typeRows"), fy, type: typeFilter, strictFy: !0, stampBudgetImports: _appIsFnName_("_budgetCanonicalEntityStamp_") ? _budgetCanonicalEntityStamp_("budgetimports") : "1",
        stampBudgetTypeSummary: _appIsFnName_("_budgetCanonicalEntityStamp_") ? _budgetCanonicalEntityStamp_("budgettypesummary") : "1", policy: "core-budget-type-summary-no-personnel-v11-cached"
    };
    try {
        return "budget:core:" + String(scope || "typeRows") + ":" + fy + ":" + _buildDigestHex_(JSON.stringify(raw));
    }
    catch (_e) {
        return "budget:core:" + String(scope || "typeRows") + ":" + fy + ":" + String(typeFilter || "all");
    }
}
function _budgetCacheReadRows_(key) {
    try {
        var hit = _appIsFnName_("_budgetCanonicalCacheRead_") ? _budgetCanonicalCacheRead_(key) : _appIsFnName_("_AppCacheGetJson_") ? _AppCacheGetJson_(key) : null, rows = hit && Array.isArray(hit.rows) ? hit.rows : null;
        return rows ? (rows.__budgetSource = String(hit.source || "core-hot-cache"), rows.__budgetScannedRows = Number(hit.scannedRows || rows.length) || rows.length,
            rows.__budgetCacheHit = !0, rows.__budgetPerformanceCache = !0, rows) : null;
    }
    catch (_e) {
        return _b32W_("observed.catch", _e, {
            file: "C32"
        }), null;
    }
}
function _budgetCacheWriteRows_(key, rows, ttl, source) {
    rows = _appArrayValue_(rows);
    try {
        var policy = _budgetCachePolicy_({
            cacheTtlSeconds: ttl
        }, "rows"), data = {
            rows, source: String(source || "core-hot-cache-store"), scannedRows: Number(rows.__budgetScannedRows || rows.length) || rows.length, cachedAt: new Date().toISOString(),
            corePerformance: !0, cachePolicyStamp: BUDGET_CACHE_POLICY_STAMP
        };
        _appIsFnName_("_budgetCanonicalCacheWrite_") ? _budgetCanonicalCacheWrite_(key, data, policy.ttlSeconds) : _appIsFnName_("_AppCachePutJson_") && _AppCachePutJson_(key, data, policy.ttlSeconds);
    }
    catch (_e) {
        _b32W_("budget.obs.observed", _e);
    }
    return rows.__budgetCacheHit = !1, rows.__budgetPerformanceCache = !0, rows;
}
function _budgetNoWaitTypeRows_(payload) {
    payload = payload || {};
    var typeFilter = String(payload.type || payload.typeFilter || payload.category || "").trim();
    typeFilter === "ทั้งหมด" && (typeFilter = "");
    function normalizeText(v) {
        return String(v == null ? "" : v).replace(/[\s\u00A0\u200B-\u200D\uFEFF]/g, "").trim();
    }
    function isPersonnelRow(row) {
        if (row = row && typeof row == "object" ? row : {}, row.isPersonnelCompensation === !0)
            return !0;
        var text = [
            row.planGroup, row.plan, row.category, row.entryType, row.type, row.item, row.topic, row.label, row.name, row.description
        ].map(normalizeText).join("|");
        return text.indexOf("แผนงานบุคลากรภาครัฐ") > -1 || text.indexOf("บุคลากรภาครัฐ") > -1 || text.indexOf("ค่าตอบแทนผู้ปฏิบัติงาน") > -1 || text.indexOf("ผู้ปฏิบัติงานให้คณะกรรมาธิการ") > -1;
    }
    function typeText(row) {
        return row = row || {}, [
            row.entryType, row.type, row.category, row.planGroup, row.item, row.topic, row.label, row.name, row.supportType, row.expenseType, row.description
        ].map(normalizeText).join("|");
    }
    function includeType(row) {
        return !typeFilter || typeText(row).indexOf(normalizeText(typeFilter)) > -1;
    }
    function finalize(inputRows, source) {
        var rows2 = (_appArrayValue_(inputRows)).filter(function (row) {
            return !isPersonnelRow(row);
        });
        return rows2 = rows2.map(function (row, idx) {
            return row = row && typeof row == "object" ? row : {}, row.__budgetSource = row.__budgetSource || source || "BudgetImports", row.__budgetScannedRows = row.__budgetScannedRows || rows2.length,
                row.__budgetRowNo = idx + 1, row;
        }), rows2.__budgetSource = source || inputRows && inputRows.__budgetSource || "BudgetImports", rows2.__budgetScannedRows = inputRows && inputRows.__budgetScannedRows || rows2.length,
            rows2.__budgetCacheHit = !!(inputRows && inputRows.__budgetCacheHit), typeFilter ? rows2.filter(includeType) : rows2;
    }
    var coreKey = typeof _budgetRowsCacheKey_ == "function" ? _budgetRowsCacheKey_(_appAssignObjects_({}, payload, {
        includePersonnelCompensation: !1
    }), "typeRows-no-personnel-v11") : "", cacheAllowed = coreKey && (typeof _budgetHotPathBypass_ != "function" || !_budgetHotPathBypass_(payload));
    if (cacheAllowed) {
        var cached = typeof _budgetCacheReadRows_ == "function" ? _budgetCacheReadRows_(coreKey) : null;
        if (cached)
            return finalize(cached, "BudgetImports-cache");
    }
    var rows = typeof _budgetCanonicalTypeRows_ == "function" ? _budgetCanonicalTypeRows_(payload) : [];
    return rows = finalize(rows, "BudgetImports"), cacheAllowed && typeof _budgetCacheWriteRows_ == "function" && (rows = _budgetCacheWriteRows_(coreKey, rows, 300) || rows), rows;
}
function apiBudgetGetFiscalYears(payload) {
    return BudgetDomain.getFiscalYears(payload || {});
}
function _apiBudgetListByFYUnifiedCore_(payload, options) {
    var apiName, auth = _bSafeReq_(payload, "viewer", (options = options || {}).apiName || "apiBudgetListByFY");
    if (!auth.ok)
        return auth.result;
    payload = auth.payload || {}, options.fast === !0 && (payload.lite = !0, payload.fast = !0);
    var fy = _budgetNoWaitNormalizeFy_(payload), page = Math.max(1, Number(payload.page || 1) || 1), defaultLimit = options.fast === !0 ? 300 : 50, requestedLimit = Math.max(1, Math.min(Number(payload.limit || payload.pageSize || defaultLimit) || defaultLimit, 1e3)), desired = Math.max(requestedLimit, Math.min(page * requestedLimit, 1e3)), mapped = _budgetNoWaitMapImportRows_(_budgetNoWaitImportRows_(fy, {
        ttl: 180, page, limit: requestedLimit, desired, limitTarget: desired
    })), paged = _budgetNoWaitPaged_(mapped, payload, Number(payload.limit || payload.pageSize || (options.fast === !0 ? 300 : mapped.length || 50)) || defaultLimit, 1e3);
    return ok_({
        rows: paged.rows, data: paged.rows, items: paged.rows, records: paged.rows, fy, totalRecords: paged.totalRecords, total: paged.totalRecords,
        page: paged.page, limit: paged.limit, pageSize: paged.limit, totalPages: paged.totalPages, isPaged: !0, serverPaged: !0, lite: payload.lite === !0,
        fast: options.fast === !0, source: options.fast === !0 ? "BudgetImports/no-wait-fast-list-current" : "BudgetImports/no-wait-canonical-list-current",
        sourceOfTruth: "BudgetImports", editSource: "BudgetImports", cacheHit: !1, loadOk: !0, contractStamp: "budget-list-no-wait-current"
    }, "โหลดรายการงบประมาณสำเร็จ");
}
function apiBudgetListByFY(payload) {
    return _appIsFnName_("_withHotApiTelemetry_") ? _withHotApiTelemetry_("apiBudgetListByFY", payload || {}, "budget.list", function (p) {
        return BudgetDomain.listByFY(p || {});
    }) : BudgetDomain.listByFY(payload || {});
}
function _budgetTypeKeyForSummary_(row) {
    var extra = (row = row || {}).extra || {}, text = String(_budgetTypeSummaryPick_(row, [
        "entryType", "ประเภทรายการ", "ประเภทรายการงบประมาณ", "ประเภท", "category", "item", "รายการ",
        "itemName"
    ]) || extra.entryType || extra.category || extra.supportType || "").trim(), compact = text.replace(/\s+/g, ""), committeeType = String(_budgetTypeSummaryPick_(row, [
        "committeeType"
    ]) || extra.committeeType || "").trim();
    return compact.indexOf("ค่าตอบแทนผู้ปฏิบัติงาน") > -1 || compact.indexOf("ผู้ปฏิบัติงานให้คณะกรรมาธิการ") > -1 || compact.indexOf("บุคลากรภาครัฐ") > -1 ? _budgetNoWaitPersonnelLabel_() : compact.indexOf("การประชุมคณะอนุกรรมาธิการ") > -1 || committeeType.indexOf("อนุ") > -1 ? "การประชุมคณะอนุกรรมาธิการ" : compact.indexOf("การประชุมคณะกรรมาธิการ") > -1 || compact.indexOf("เบี้ยประชุม") > -1 || Number(row.meetingAllowance || 0) > 0 ? "การประชุมคณะกรรมาธิการ" : compact.indexOf("ศึกษาดูงานในประเทศและการจัดสัมมนา") > -1 ? "การศึกษาดูงานในประเทศและการจัดสัมมนา" : compact.indexOf("ศึกษาดูงานในประเทศ") > -1 ? "การศึกษาดูงานในประเทศ" : compact.indexOf("การจัดสัมมนา") > -1 || compact.indexOf("สัมมนา") > -1 || Number(row.seminarCost || 0) > 0 ? "การจัดสัมมนา" : compact.indexOf("ศึกษาดูงานต่างประเทศ") > -1 || compact.indexOf("ต่างประเทศ") > -1 && compact.indexOf("รับรอง") === -1 || Number(row.foreignTripCost || 0) > 0 ? "การศึกษาดูงานต่างประเทศ" : compact.indexOf("รับรองแขกต่างประเทศ") > -1 || compact.indexOf("รับรอง") > -1 || Number(row.foreignGuestCost || 0) > 0 ? "การรับรองแขกต่างประเทศ" : compact.indexOf("ส่งเสริม") > -1 && compact.indexOf("สนับสนุน") > -1 || Number(row.supportCost || 0) > 0 ? "ค่าใช้จ่ายในการส่งเสริมและสนับสนุนการทำงานของคณะกรรมาธิการ" : text || "อื่น ๆ";
}
function _budgetAggregateTypeSummaryRows_(rows) {
    var totals = {
        records: 0, totalAmount: 0, byType: {}
    };
    return (_appArrayValue_(rows)).forEach(function (row) {
        row = row || {};
        var type = _budgetTypeKeyForSummary_(row);
        totals.byType[type] || (totals.byType[type] = {
            type, records: 0, totalAmount: 0, supportCost: 0, meetingAllowance: 0, travelCost: 0, seminarCost: 0, foreignTripCost: 0, foreignGuestCost: 0,
            personnelExpense: 0
        });
        var bucket = totals.byType[type];
        bucket.records += 1, totals.records += 1;
        var isPersonnelRow = _appIsFnName_("_budgetIsPersonnelCompensationTypeRow_") && _budgetIsPersonnelCompensationTypeRow_(row), totalAmount = _b32N_(isPersonnelRow ? row.personnelExpense || row.staffExpense || row.ytdExpense || row.salaryExpense || row.compensationExpense || row.allowanceExpense || row.currentMonthlyExpense || row.monthlyRateTotal || row.totalPaid || row.totalSpent || row.spent || row.expense || 0 : row.totalAmount || row.amount || row.spent || row.expense || row.personnelExpense || row.staffExpense || 0);
        bucket.totalAmount += totalAmount, totals.totalAmount += totalAmount, isPersonnelRow && (bucket.personnelExpense += totalAmount), [
            "supportCost",
            "meetingAllowance", "travelCost", "seminarCost", "foreignTripCost", "foreignGuestCost"
        ].forEach(function (key) {
            bucket[key] += _b32N_(row[key] || 0);
        });
    }), totals.byTypeRows = Object.keys(totals.byType).sort(function (a, b) {
        return a.localeCompare(b, "th");
    }).map(function (type) {
        return totals.byType[type];
    }), totals;
}
function _budgetTypeSummaryDirtyKey_(fy) {
    return "budget:core:type-summary:dirty:" + (fy = String(fy || "").replace(/[^0-9]/g, ""));
}
function _budgetMarkTypeSummaryDirty_(payload, reason) {
    payload = payload || {};
    var fy = "";
    try {
        fy = _budgetNoWaitNormalizeFy_(payload) || _budgetCanonicalPayloadFy_(payload) || "";
    }
    catch (_e) {
        fy = "";
    }
    var marker = {
        ok: !0, dirty: !0, fy: fy = String(fy || "").replace(/[^0-9]/g, ""), reason: String(reason || "budget-write"), markedAt: new Date().toISOString(),
        owner: "Code_32_Domain_Budget:fast-save-dirty-marker-current", sourceOfTruth: "BudgetImports", readModelRefresh: "deferred"
    };
    if (!fy)
        return marker;
    try {
        _appIsFnName_("_AppCachePutJson_") && _AppCachePutJson_(_budgetTypeSummaryDirtyKey_(fy), marker, 21600);
    }
    catch (_cacheErr) {
        marker.cacheError = String(_cacheErr && _cacheErr.message || _cacheErr);
    }
    return marker;
}
function _budgetReadTypeSummaryDirty_(fy) {
    if (!(fy = String(fy || "").replace(/[^0-9]/g, "")))
        return {
            ok: !0, dirty: !1, fy: ""
        };
    try {
        var hit = _appIsFnName_("_AppCacheGetJson_") ? _AppCacheGetJson_(_budgetTypeSummaryDirtyKey_(fy)) : null;
        if (hit && hit.dirty)
            return _appAssignObjects_({
                ok: !0, dirty: !0, fy
            }, hit);
    }
    catch (_cacheErr) {
        return {
            ok: !1, dirty: !1, fy, error: String(_cacheErr && _cacheErr.message || _cacheErr)
        };
    }
    return {
        ok: !0, dirty: !1, fy
    };
}
function _budgetClearTypeSummaryDirty_(fy) {
    var res = {
        ok: !0, cleared: !1, fy: fy = String(fy || "").replace(/[^0-9]/g, "")
    };
    if (!fy)
        return res;
    try {
        _appIsFnName_("_AppCachePutJson_") && (_AppCachePutJson_(_budgetTypeSummaryDirtyKey_(fy), {
            ok: !0, dirty: !1, fy, clearedAt: new Date().toISOString(), owner: "Code_32_Domain_Budget:fast-save-dirty-marker-current"
        }, 5), res.cleared = !0);
    }
    catch (_cacheErr) {
        res.ok = !1, res.error = String(_cacheErr && _cacheErr.message || _cacheErr);
    }
    return res;
}
function _budgetShouldRefreshReadModelNow_(payload) {
    return (payload = payload || {}).syncReadModelRefresh === !0 || payload.forceReadModelRefresh === !0 || payload.refreshReadModelNow === !0;
}
function _budgetRefreshReadModelAfterWrite_(payload, reason) {
    payload = payload || {};
    var fy = "";
    try {
        fy = _budgetNoWaitNormalizeFy_(payload) || _budgetCanonicalPayloadFy_(payload) || "";
    }
    catch (_e) {
        fy = "";
    }
    var res = {
        ok: !0, reason: String(reason || "budget-write"), fy, invalidatedAt: new Date().toISOString()
    };
    try {
        _appIsFnName_("_AppCacheInvalidateDomain_") && (res.budgetCache = _AppCacheInvalidateDomain_("budget"), res.budgetImportsCache = _AppCacheInvalidateDomain_("budgetimports"));
    }
    catch (_cacheErr) {
        res.cacheError = String(_cacheErr && _cacheErr.message || _cacheErr);
    }
    try {
        fy && _appIsFnName_("_budgetRefreshTypeSummaryReadModel_") && (res.readModel = _budgetRefreshTypeSummaryReadModel_(_appAssignObjects_({}, payload, {
            fy, forceFresh: !0, afterWrite: !0
        })));
    }
    catch (_rmErr) {
        res.readModelError = String(_rmErr && _rmErr.message || _rmErr);
    }
    try {
        typeof AppDataService != "undefined" && AppDataService && AppDataService.refreshSummarySnapshotsAfterInvalidation && (res.summarySnapshots = AppDataService.refreshSummarySnapshotsAfterInvalidation("BudgetImports", reason || "budget-write", _appAssignObjects_({}, payload, {
            fy, fiscalYear: fy, forceFresh: !0, refreshSnapshots: !0
        })));
    }
    catch (_snapshotErr) {
        res.summarySnapshotError = String(_snapshotErr && _snapshotErr.message || _snapshotErr);
    }
    return res;
}
function _budgetGetTypeSummaryByFYCore_(payload) {
    var auth = _bSafeReq_(payload, "viewer", "apiBudgetGetTypeSummaryByFY");
    if (!auth.ok)
        return auth.result;
    var fy = _budgetNoWaitNormalizeFy_(payload = auth.payload || {}), limit = Math.max(10, Math.min(Number(payload.limit || payload.pageSize || 20) || 20, 100)), page = Math.max(1, Number(payload.page || 1) || 1);
    payload = _appAssignObjects_({}, payload, {
        fy, fiscalYear: fy, year: fy, limit, pageSize: limit, page, noWait: !0, strictFy: !0, preferCache: payload.forceFresh !== !0, allowReadThrough: !1,
        sourceOfTruth: "BudgetImports", readFromBudgetImports: !0, materializedFirst: !1, readModelFirst: !1, materializedOnly: !1, readModelOnly: !1,
        maxRows: Math.max(limit, Math.min(Number(payload.maxRows || payload.totalTarget || 800) || 800, 1e3))
    });
    var started = new Date().getTime(), dirtyMarkerState = _appIsFnName_("_budgetReadTypeSummaryDirty_") ? _budgetReadTypeSummaryDirty_(fy) : {
        ok: !0, dirty: !1, fy
    }, allRows = _budgetNoWaitTypeRows_(payload);
    allRows = _appArrayValue_(allRows);
    var paged = _budgetNoWaitPaged_(allRows, payload, limit, 100), totals = {};
    try {
        totals = _appIsFnName_("_budgetAggregateTypeSummaryRows_") ? _budgetAggregateTypeSummaryRows_(allRows) : {};
    }
    catch (_aggErr) {
        totals = {}, _b32W_("budget.singleSource.aggregate", _aggErr, {
            fy
        });
    }
    var elapsed = new Date().getTime() - started, source = String(allRows && allRows.__budgetSource || "BudgetImports/direct-source-of-truth"), data = {
        fy, fiscalYear: fy, explicitFy: !!_budgetCanonicalPayloadFy_(payload), strictFy: !0, type: String(payload.type || payload.typeFilter || "ทั้งหมด") || "ทั้งหมด",
        rows: paged.rows, data: paged.rows, items: paged.rows, records: paged.rows, totals, totalRecords: paged.totalRecords, total: paged.totalRecords,
        totalPages: paged.totalPages, page: paged.page, pageSize: paged.limit, limit: paged.limit, isPaged: !0, rowsRead: paged.rows.length, scannedRows: allRows && allRows.__budgetScannedRows || allRows.length,
        partial: paged.totalRecords > paged.rows.length, lite: !0, fast: !0, aggregated: !0, serverPaged: !0, source, sourceOfTruth: "BudgetImports",
        readOwner: "BudgetImports", writeOwner: "BudgetImports", editOwner: "BudgetImports", cacheHit: !(!allRows || !allRows.__budgetCacheHit),
        corePerformance: !0, degraded: !1, materializedRequired: !1, materializedHit: !1, readModelHit: !1, readModelCacheHit: !1, readModelRows: 0,
        readModelUpdatedAt: "", readThroughRefresh: !1, liveDefault: !0, loadOk: !0, elapsedMs: elapsed, policy: _budgetTypeSummaryOwnerPolicy_(),
        dirtyMarker: dirtyMarkerState, readModelBypassed: !0, includePersonnelCompensation: !1, meta: {
            fy, strictFy: !0, serverPaged: !0, rowsRead: paged.rows.length, scannedRows: allRows && allRows.__budgetScannedRows || allRows.length,
            materializedFirst: !1, readModelFirst: !1, readModelHit: !1, materializedRequired: !1, displaySource: "BudgetImports", noWait: !0,
            windowed: !1, noAnyFyReadPath: !0, noDeadPath: !0, liveDefault: !0, elapsedMs: elapsed, corePerformance: !0, cacheHit: !(!allRows || !allRows.__budgetCacheHit),
            includePersonnelCompensation: !1
        }, contractStamp: "budget-type-summary-single-source-current"
    };
    return ok_(data, "โหลดข้อมูลสรุปแยกแต่ละประเภทสำเร็จจาก BudgetImports");
}
function apiBudgetGetTypeSummaryByFY(payload) {
    return _appIsFnName_("_withHotApiTelemetry_") ? _withHotApiTelemetry_("apiBudgetGetTypeSummaryByFY", payload || {}, "budget.typeSummary", function (p) {
        return BudgetDomain.getTypeSummary(p || {});
    }) : BudgetDomain.getTypeSummary(payload || {});
}
function _budgetEditNormalizeKey_(value) {
    return String(value == null ? "" : value).trim();
}
function _budgetEditRecordId_(row) {
    return _budgetEditNormalizeKey_(_budgetTypeSummaryPick_(row = row || {}, [
        "id", "ID", "importId", "recordId", "budgetId", "uuid", "_id", "เลขที่"
    ]) || "");
}
function _budgetEditMergeJsonPayload_(row) {
    row = row || {};
    var extra = {};
    try {
        extra = (_appIsFnName_("_budgetImportExtraPayload_") ? _budgetImportExtraPayload_(row) : _budgetParsePayloadExtra_(row, [])) || {};
    }
    catch (_extraErr) {
        extra = {};
    }
    return extra && typeof extra == "object" && !Array.isArray(extra) ? extra : {};
}
function _budgetEditFirst_(row, keys, extra) {
    var v = _appIsFnName_("_budgetTypeSummaryPick_") ? _budgetTypeSummaryPick_(row, keys) : "";
    if (v != null && String(v).trim() !== "")
        return v;
    extra = extra || {}, keys = Array.isArray(keys) ? keys : [
        keys
    ];
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (extra[k] != null && String(extra[k]).trim() !== "")
            return extra[k];
    }
    return "";
}
function _budgetEditLocations_(row, prefix, extra) {
    extra = extra || {};
    var key = prefix === "visit" ? "visitLocations" : "seminarLocations", list = Array.isArray(extra[key]) ? extra[key] : [];
    if (!list.length) {
        var raw = _budgetEditFirst_(row, [
            key, key + "Text", key + "Json", key + "JSON"
        ], extra);
        if (String(raw || "").trim().charAt(0) === "[")
            try {
                var parsed = JSON.parse(String(raw));
                Array.isArray(parsed) && (list = parsed);
            }
            catch (_parseLocErr) {
                list = [];
            }
        else
            raw && (list = String(raw).split(",").map(function (x) {
                return String(x || "").trim();
            }).filter(Boolean));
    }
    if (list.length && typeof list[0] == "object") {
        var first = list[0] || {};
        return {
            text: list.map(function (x) {
                return typeof x == "string" ? x : [
                    x.place || x.location || x.name || "", x.subDistrict || x.subdistrict || x.tambon || "", x.district || x.amphoe || "",
                    x.province || ""
                ].filter(Boolean).join(", ");
            }).filter(Boolean).join(", "), place: first.place || first.location || first.name || "", province: first.province || "", district: first.district || first.amphoe || "",
            subDistrict: first.subDistrict || first.subdistrict || first.tambon || ""
        };
    }
    return {
        text: list.join(", "), place: list[0] || "", province: list[1] || "", district: list[2] || "", subDistrict: list[3] || ""
    };
}
function _budgetMapImportRowForEdit_(row) {
    row = row || {};
    var dto = {};
    try {
        dto = (_appIsFnName_("_mapBudgetImportListRow_") ? _mapBudgetImportListRow_(row) : _budgetFastTypeDto_(row, _budgetTypeSummaryFyFromRow_(row))) || {};
    }
    catch (_mapErr) {
        try {
            dto = _budgetFastTypeDto_(row, _budgetTypeSummaryFyFromRow_(row)) || {};
        }
        catch (_fastErr) {
            dto = {};
        }
    }
    var extra = _budgetEditMergeJsonPayload_(row), visit = _budgetEditLocations_(row, "visit", extra), seminar = _budgetEditLocations_(row, "seminar", extra), rawId = _budgetEditRecordId_(row) || String(dto.id || ""), fy = _budgetTypeSummaryFyFromRow_(row) || String(dto.fy || dto.fiscalYear || "").replace(/[^0-9]/g, ""), supportCost = _appIsFnName_("_budgetResolveSupportCostAmount_") ? _budgetResolveSupportCostAmount_(row, extra) : _b32N_(_budgetEditFirst_(row, [
        "supportCost"
    ], extra));
    return _appAssignObjects_(dto, {
        id: rawId || String(dto.id || ""), importId: rawId || String(dto.id || ""), recordId: rawId || String(dto.id || ""), rawId, fy, fiscalYear: fy,
        entryType: String(_budgetEditFirst_(row, _B32ENTRY, extra) || dto.entryType || dto.category || ""), category: String(_budgetEditFirst_(row, _B32_CATEGORY_FIELDS, extra) || dto.category || dto.entryType || ""), item: String(_budgetEditFirst_(row, [
            "item", "itemName", "topic", "name", "label",
            "รายการ", "ชื่อรายการ", "รายการงบประมาณ"
        ], extra) || dto.item || ""), committeeType: String(_budgetEditFirst_(row, [
            "committeeType", "คณะ"
        ], extra) || dto.committeeType || ""), committeeName: String(_budgetEditFirst_(row, [
            "committeeName", "ชื่อคณะ"
        ], extra) || dto.committeeName || ""),
        subcommitteeName: String(_budgetEditFirst_(row, _B32_SUBCOMMITTEE_FIELDS, extra) || dto.subcommitteeName || dto.committeeName || ""), roundNo: String(_budgetEditFirst_(row, [
            "roundNo", "ครั้งที่"
        ], extra) || dto.roundNo || ""), topic: String(_budgetEditFirst_(row, [
            "topic", "name", "label", "หัวข้อ", "ชื่อเรื่อง"
        ], extra) || dto.topic || dto.item || ""), seminarTitle: String(_budgetEditFirst_(row, _B32_SEMINAR_TITLE_FIELDS, extra) || dto.seminarTitle || dto.topic || ""),
        supportType: String(_budgetEditFirst_(row, _B32_SUPPORT_TYPE_FIELDS, extra) || dto.supportType || dto.item || ""), detail: String(_budgetEditFirst_(row, _B32_DETAIL_FIELDS, extra) || dto.detail || dto.note || ""), guestCountry: String(_budgetEditFirst_(row, [
            "guestCountry", "ประเทศของแขก"
        ], extra) || dto.guestCountry || dto.countriesText || extra.countriesText || ""),
        startDate: _bFormatDate(_budgetEditFirst_(row, [
            "startDate", "วันที่เริ่ม"
        ], extra) || dto.startDate || ""), endDate: _bFormatDate(_budgetEditFirst_(row, [
            "endDate", "วันที่สิ้นสุด"
        ], extra) || dto.endDate || ""), activityDate: _bFormatDate(_budgetEditFirst_(row, [
            "activityDate", "date", "วันที่",
            "วันเดือนปี", "วันที่ดำเนินการ"
        ], extra) || dto.activityDate || ""), seminarDate: _bFormatDate(_budgetEditFirst_(row, _B32_SEMINAR_DATE_FIELDS, extra) || dto.seminarDate || extra.semDate || ""),
        committeeResponsible: String(_budgetEditFirst_(row, [
            "committeeResponsible", "responsibleCommittee", "committeeOwner", "กรรมาธิการรับผิดชอบ"
        ], extra) || dto.committeeResponsible || ""), staffResponsible: String(_budgetEditFirst_(row, [
            "staffResponsible", "responsibleStaff", "operationOfficer",
            "officer", "เจ้าหน้าที่รับผิดชอบ", "เจ้าหน้าที่"
        ], extra) || dto.staffResponsible || ""), note: String(_budgetEditFirst_(row, [
            "note", "remark",
            "remarks", "หมายเหตุ"
        ], extra) || dto.note || ""), refundStatus: String(_budgetEditFirst_(row, [
            "refundStatus", "สถานะคืนเงิน", "สถานะการคืนเงิน"
        ], extra) || dto.refundStatus || "ยังไม่คืนเงิน"), refundDate: _bFormatDate(_budgetEditFirst_(row, [
            "refundDate", "วันที่คืนเงิน", "วันคืนเงิน"
        ], extra) || dto.refundDate || ""), reportStatus: String(_budgetEditFirst_(row, [
            "reportStatus", "สถานะรายงาน", "สถานะรายงานค่าใช้จ่าย"
        ], extra) || dto.reportStatus || "ยังไม่รายงาน"),
        reportDate: _bFormatDate(_budgetEditFirst_(row, [
            "reportDate", "วันที่รายงาน", "วันรายงาน"
        ], extra) || dto.reportDate || ""), meetingAllowance: _b32N_(_budgetEditFirst_(row, [
            "meetingAllowance", "ค่าเบี้ยประชุม"
        ], extra) || dto.meetingAllowance), snackCost: _b32N_(_budgetEditFirst_(row, [
            "snackCost", "ค่าอาหารว่าง"
        ], extra) || dto.snackCost), lunchCost: _b32N_(_budgetEditFirst_(row, [
            "lunchCost", "ค่าอาหารกลางวัน"
        ], extra) || dto.lunchCost), travelCost: _b32N_(_budgetEditFirst_(row, [
            "travelCost", "ค่าเดินทาง", "ค่าใช้จ่ายเดินทาง"
        ], extra) || dto.travelCost), receptionCost: _b32N_(_budgetEditFirst_(row, [
            "receptionCost",
            "ค่ารับรอง"
        ], extra) || dto.receptionCost), seminarCost: _b32N_(_budgetEditFirst_(row, [
            "seminarCost", "ค่าใช้จ่ายสัมมนา"
        ], extra) || dto.seminarCost),
        foreignTripCost: _b32N_(_budgetEditFirst_(row, [
            "foreignTripCost", "foreignStudyCost"
        ], extra) || dto.foreignTripCost), foreignGuestCost: _b32N_(_budgetEditFirst_(row, [
            "foreignGuestCost", "guestCost"
        ], extra) || dto.foreignGuestCost), supportCost, amount: _b32N_(_budgetEditFirst_(row, [
            "amount", "totalAmount",
            "rowAmount", "จำนวนเงิน", "ยอดรวม", "รวมเป็นเงิน"
        ], extra) || dto.amount || dto.totalAmount || supportCost), totalAmount: _b32N_(_budgetEditFirst_(row, [
            "totalAmount", "amount", "rowAmount", "จำนวนเงิน", "ยอดรวม", "รวมเป็นเงิน"
        ], extra) || dto.totalAmount || dto.amount || supportCost), visitLocations: String(_budgetEditFirst_(row, _B32_VISIT_LOCATIONS_FIELDS, extra) || dto.visitLocations || visit.text || ""), visitPlace: String(_budgetEditFirst_(row, [
            "visitPlace", "สถานที่ศึกษาดูงาน",
            "สถานที่"
        ], extra) || dto.visitPlace || visit.place || ""), visitProvince: String(_budgetEditFirst_(row, [
            "visitProvince", "จังหวัด"
        ], extra) || dto.visitProvince || visit.province || ""),
        visitDistrict: String(_budgetEditFirst_(row, [
            "visitDistrict", "อำเภอ", "อำเภอ/เขต"
        ], extra) || dto.visitDistrict || visit.district || ""),
        visitSubDistrict: String(_budgetEditFirst_(row, [
            "visitSubDistrict", "visitSubdistrict", "ตำบล", "ตำบล/แขวง"
        ], extra) || dto.visitSubDistrict || visit.subDistrict || ""),
        seminarLocations: String(_budgetEditFirst_(row, _B32_SEMINAR_LOCATIONS_FIELDS, extra) || dto.seminarLocations || seminar.text || ""), seminarPlace: String(_budgetEditFirst_(row, _B32_SEMINAR_PLACE_FIELDS, extra) || dto.seminarPlace || seminar.place || ""), seminarProvince: String(_budgetEditFirst_(row, _B32_SEMINAR_PROVINCE_FIELDS, extra) || dto.seminarProvince || seminar.province || ""),
        seminarDistrict: String(_budgetEditFirst_(row, _B32_SEMINAR_DISTRICT_FIELDS, extra) || dto.seminarDistrict || seminar.district || ""), seminarSubDistrict: String(_budgetEditFirst_(row, _B32_SEMINAR_SUBDISTRICT_FIELDS, extra) || dto.seminarSubDistrict || seminar.subDistrict || ""), countriesText: String(_budgetEditFirst_(row, [
            "countriesText", "ประเทศ",
            "ประเทศที่เดินทางไป"
        ], extra) || dto.countriesText || extra.countriesText || ""), seminarItemsJson: String(_budgetEditFirst_(row, _B32_SEMINAR_ITEMS_JSON_FIELDS, extra) || dto.seminarItemsJson || ""), visitLocationsJson: String(_budgetEditFirst_(row, _B32_VISIT_LOCATIONS_JSON_FIELDS, extra) || dto.visitLocationsJson || ""),
        seminarLocationsJson: String(_budgetEditFirst_(row, _B32_SEMINAR_LOCATIONS_JSON_FIELDS, extra) || dto.seminarLocationsJson || ""), countriesJson: String(_budgetEditFirst_(row, [
            "countriesJson", "countriesJSON"
        ], extra) || dto.countriesJson || ""), payloadJson: String(_budgetEditFirst_(row, [
            "payloadJson", "payloadJSON"
        ], extra) || dto.payloadJson || ""), extraJson: String(_budgetEditFirst_(row, [
            "extraJson", "extraJSON"
        ], extra) || dto.extraJson || ""), extra,
        _raw: row, source: "BudgetImports/edit-direct"
    }), !dto.supportCost && String(dto.entryType || "").replace(/\s+/g, "").indexOf("ส่งเสริม") > -1 && (dto.supportCost = dto.amount || dto.totalAmount || 0),
        dto;
}
function _budgetEditScoreCandidate_(candidate, wanted) {
    candidate = candidate || {};
    var score = 0, id = _budgetEditRecordId_(wanted = wanted || {});
    id && _budgetEditRecordId_(candidate) === id && (score += 1e3);
    var fy = String(_budgetEditFirst_(wanted, _B32_FISCAL_YEAR_FIELDS, {}) || "").replace(/[^0-9]/g, "");
    fy && _budgetTypeSummaryFyFromRow_(candidate) === fy && (score += 80), [
        "entryType", "category", "item", "topic", "roundNo", "committeeName",
        "subcommitteeName", "activityDate", "startDate", "endDate"
    ].forEach(function (k) {
        var a = String(_budgetEditFirst_(candidate, [
            k
        ], {}) || "").trim(), b = String(_budgetEditFirst_(wanted, [
            k
        ], {}) || "").trim();
        a && b && a === b && (score += 12);
    });
    var ca = _b32N_(_budgetEditFirst_(candidate, _B32_AMOUNT_FIELDS, {})), wa = _b32N_(_budgetEditFirst_(wanted, _B32_AMOUNT_FIELDS, {}));
    return ca && wa && Math.abs(ca - wa) < .01 && (score += 30), score;
}
function _budgetFindImportRecordForEdit_(payload) {
    var base = (payload = payload || {}).baseRecord || payload.record || payload.row || payload.data || payload || {}, id = _budgetEditNormalizeKey_(payload.id || payload.importId || payload.recordId || payload.budgetId || payload.rowId || _budgetEditRecordId_(base)), fy = String(payload.fy || payload.fiscalYear || payload.budgetFy || payload.budgetYear || _budgetEditFirst_(base, _B32_FISCAL_YEAR_FIELDS, {}) || "").replace(/[^0-9]/g, ""), row = null, source = "";
    if (id && id.indexOf("row-") !== 0)
        try {
            var repo = _getBudgetImportRepository_ && _getBudgetImportRepository_();
            repo && _appIsFn_(repo.findByKey) && (row = repo.findByKey(id, {
                includeDeleted: !1, requireCanonical: !1
            }) || null), row && (source = "BudgetImports/repository-key");
        }
        catch (_repoErr) {
            _b32W_("budget.edit.find.repo", _repoErr, {
                id
            });
        }
    if (!row) {
        var rows = [];
        try {
            rows = _budgetDirectSheetObjects_("BudgetImports", {
                forceFresh: payload.forceFresh === !0 || payload.noCache === !0, ttl: payload.forceFresh === !0 || payload.noCache === !0 ? 0 : 120
            }) || [];
        }
        catch (_directErr) {
            try {
                rows = _budgetListImportRowsRobust_(payload || {}) || [];
            }
            catch (_robustErr) {
                rows = [];
            }
        }
        if (rows = (_appArrayValue_(rows)).filter(function (r) {
            return r && !_budgetNoWaitDeleted_(r) && (!fy || _budgetTypeSummaryFyFromRow_(r) === fy);
        }), id && id.indexOf("row-") !== 0 && (row = rows.filter(function (r) {
            return _budgetEditRecordId_(r) === id;
        })[0] || null) && (source = "BudgetImports/direct-key"), !row && base && typeof base == "object") {
            var best = null, bestScore = 0;
            rows.forEach(function (r) {
                var sc = _budgetEditScoreCandidate_(r, base);
                sc > bestScore && (bestScore = sc, best = r);
            }), best && (bestScore >= 40 || fy && bestScore >= 30) && (source = "BudgetImports/direct-signature", (row = best).__budgetEditMatchScore = bestScore);
        }
    }
    if (!row)
        return null;
    var dto = _budgetMapImportRowForEdit_(row);
    return dto.__budgetEditSource = source || "BudgetImports", dto.__budgetEditMatchScore = row.__budgetEditMatchScore || 0, dto;
}
function apiBudgetGetImportForEdit(payload) {
    var auth = _bSafeReq_(payload, "viewer", "apiBudgetGetImportForEdit");
    if (!auth.ok)
        return auth.result;
    payload = auth.payload || {};
    try {
        var record = _budgetFindImportRecordForEdit_(payload);
        return record ? ok_({
            record, row: record, data: record, id: record.id, fy: record.fy, fiscalYear: record.fiscalYear, source: record.__budgetEditSource || "BudgetImports/edit-direct",
            matchScore: record.__budgetEditMatchScore || 0, contractStamp: "budget-import-edit-direct-current"
        }, "โหลดรายการงบประมาณสำหรับแก้ไขสำเร็จ") : err_("ไม่พบรายการงบประมาณสำหรับแก้ไข", {
            record: null, row: null, data: null, source: "BudgetImports/edit-direct", requestedId: String(payload && payload.id || "")
        });
    }
    catch (e) {
        return err_(e && e.message ? e.message : String(e), {
            record: null, row: null, data: null, source: "BudgetImports/edit-direct"
        });
    }
}
function apiBudgetSaveImport(payload) {
    return BudgetDomain.saveImport(payload || {});
}
function apiBudgetDeleteImport(payload) {
    return BudgetDomain.deleteImport(payload || {});
}
var BUDGET_HOT_READ_MODEL_STAMP = "budget-summary-central-dto-r77";
var BUDGET_CACHE_POLICY_STAMP = "budget-cache-policy-single-owner-r77";
