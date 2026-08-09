/*==========================================================================
 * Code_32_Domain_Budget.gs — Budget Domain / DTO / Cache / Reports
 * Deminified in-place for maintainability. API contract unchanged.
 *========================================================================== */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {}, AppDomain = __APP_GLOBAL__.AppDomain = __APP_GLOBAL__.AppDomain || {}, BudgetDomain = __APP_GLOBAL__.BudgetDomain = __APP_GLOBAL__.BudgetDomain || {}, BUDGET_DOMAIN_DTO_REFACTOR_STAMP = "budget-domain-dto-no-envelope-refactor-2026-06-15";
BudgetDomain.dto = function (data, meta) {
    return _appAssignObjects_({
        domain: "budget", contractOwner: "Code_32_Domain_Budget", stamp: BUDGET_DOMAIN_DTO_REFACTOR_STAMP
    }, data || {}, {
        meta: _appAssignObjects_({
            dtoOnly: !0
        }, meta || {})
    });
};
var BUDGET_DOMAIN_OWNER_STAMP_CURRENT = "domain-owner-current-r253", BUDGET_SINGLE_OWNER_STAMP_CURRENT = "budget-single-domain-owner-current-r253";
/* --------------------------------------------------------------------------
 * 1. Domain ownership / platform helpers
 * -------------------------------------------------------------------------- */
function _budgetDomainOwnerContract_() {
    return {
        ok: !0, owner: "BudgetDomain", codeOwner: "Code_32_Domain_Budget", stamp: BUDGET_DOMAIN_OWNER_STAMP_CURRENT, singleOwnerStamp: BUDGET_SINGLE_OWNER_STAMP_CURRENT,
        apiFacadeMode: "thin-api-to-domain-owner", sourceOfTruth: "BudgetImports", dashboardBudgetOwner: "BudgetDomain.getDashboardSummaryForDashboard",
        readOwner: "BudgetDomain", writeOwner: "BudgetDomain", apiNamesPreserved: !0, uiDomChanged: !1, businessLogicChanged: !1, noNewFiles: !0
    };
}
var BUDGET_DOMAIN_PHYSICAL_STAMP_CURRENT = "c5-budget-domain-physical-owner-lock-current";
function _budgetDomainPhysicalSection_(name, purpose, api, helperPrefixes, sourceSheets, writes) {
    return {
        name: String(name || ""), purpose: String(purpose || ""), owner: "Code_32_Domain_Budget.gs:BudgetDomain", api: api || [], helperPrefixes: helperPrefixes || [],
        sourceSheets: sourceSheets || [], writes: writes || [], stamp: BUDGET_DOMAIN_PHYSICAL_STAMP_CURRENT, uiDomChanged: !1, businessLogicChanged: !1,
        apiNamesPreserved: !0
    };
}
var _B32WAPIS = [
    "apiBudgetSaveImport", "apiBudgetDeleteImport", "apiSaveSalarySettings", "apiBudgetAdminSaveYearSettingsRows"
];
var _B32FY = [
    "fy", "FY", "fiscalYear", "budgetFy", "budgetYear", "year", "ปีงบประมาณ", "ปีงบ"
], _B32ENTRY = [
    "entryType", "type", "category",
    "ประเภทรายการ", "ประเภทรายการงบประมาณ", "ประเภท"
], _B32REM = [
    "remain", "balance", "remaining", "คงเหลือ", "งบประมาณคงเหลือ"
], _B32BUD = [
    "budget",
    "totalBudget", "amountBudget", "budgetAmount", "annualBudget", "annualCommitment", "monthlyBudget", "วงเงินงบประมาณ", "งบประมาณ", "งบประมาณที่ได้รับ",
    "งบประมาณรวม", "จำนวนงบประมาณ"
];
var _B32_AMOUNT_FIELDS = [
    "amount", "totalAmount", "supportCost", "meetingAllowance", "seminarCost", "foreignTripCost", "foreignGuestCost"
], _B32_PAYMENT_DATE_FIELDS = [
    "paymentDate",
    "paidDate", "date", "วันที่จ่าย", "วันที่เบิกจ่าย", "createdAt", "updatedAt"
], _B32_SEMINAR_SUBDISTRICT_FIELDS = [
    "seminarSubDistrict", "seminarSubdistrict", "ตำบลสัมมนา",
    "ตำบล/แขวง"
], _B32_SUBCOMMITTEE_FIELDS = [
    "subcommitteeName", "ชื่อคณะอนุกรรมาธิการ", "คณะอนุกรรมาธิการ"
], _B32_FISCAL_YEAR_FIELDS = [
    "fy", "fiscalYear", "budgetFy", "budgetYear",
    "ปีงบประมาณ"
], _B32_SEMINAR_TITLE_FIELDS = [
    "seminarTitle", "ชื่อโครงการสัมมนา", "projectName"
], _B32_DETAIL_FIELDS = [
    "detail", "details", "description", "รายละเอียด"
], _B32_SEMINAR_LOCATIONS_JSON_FIELDS = [
    "seminarLocationsJson",
    "seminarLocationsJSON"
], _B32_SEMINAR_PROVINCE_FIELDS = [
    "seminarProvince", "จังหวัดสัมมนา", "จังหวัด"
], _B32_SEMINAR_DISTRICT_FIELDS = [
    "seminarDistrict", "อำเภอสัมมนา", "อำเภอ/เขต"
], _B32_SEMINAR_DATE_FIELDS = [
    "seminarDate", "semDate", "วันที่จัดสัมมนา"
], _B32_SEMINAR_SUBDISTRICT_SHORT_FIELDS = [
    "seminarSubDistrict", "seminarSubdistrict"
], _B32_SEMINAR_LOCATIONS_FIELDS = [
    "seminarLocations",
    "seminarLocationsText"
], _B32_VISIT_LOCATIONS_JSON_FIELDS = [
    "visitLocationsJson", "visitLocationsJSON"
], _B32_SEMINAR_PLACE_FIELDS = [
    "seminarPlace", "สถานที่สัมมนา", "สถานที่"
], _B32_CATEGORY_FIELDS = [
    "category",
    "type", "entryType", "ประเภท"
], _B32_VISIT_SUBDISTRICT_FIELDS = [
    "visitSubDistrict", "visitSubdistrict"
], _B32_VISIT_LOCATIONS_FIELDS = [
    "visitLocations", "visitLocationsText"
], _B32_SEMINAR_ITEMS_JSON_FIELDS = [
    "seminarItemsJson",
    "seminarItemsJSON"
], _B32_SUPPORT_TYPE_FIELDS = [
    "supportType", "ประเภทรายการส่งเสริม"
], _B32_INVALIDATION_DOMAINS = [
    "budget", "budgetimports", "dashboard"
];
function _b32W_(label, e, meta) {
    try {
        _appIsFnName_("_recordWarning_") ? _recordWarning_(label, e, meta) : _b32W_(label, e, meta);
    }
    catch (_) { _appIgnoreExpected_("Code_32_Domain_Budget.gs.ignored", _); }
}
function _b32N_(v) {
    return _budgetToNumber_(v);
}
function _b32FY_(v) {
    return _normalizeBudgetFyValue_(v);
}
BudgetDomain.PHYSICAL = {
    owner: "Code_32_Domain_Budget", stamp: BUDGET_DOMAIN_PHYSICAL_STAMP_CURRENT, clusters: {
        readModel: _budgetDomainPhysicalSection_("read", "summary/dashboard/list/type/fy", [
            "apiBudgetGetSummary", "apiBudgetGetTypeSummaryByFY",
            "apiBudgetListByFY", "apiBudgetGetFiscalYears"
        ], [
            "_budget", "_dashboardBudget"
        ], [
            "BudgetImports", "BudgetYearSettingsItems"
        ], []), writeModel: _budgetDomainPhysicalSection_("write", "import/salary/year-settings", _B32WAPIS, [
            "_budgetFast", "_budgetEdit"
        ], [
            "BudgetImports",
            "BudgetYearSettingsItems", "BudgetSalarySettings"
        ], _B32WAPIS), salary: _budgetDomainPhysicalSection_("salary", "personnel compensation", [
            "apiGetSalarySettings", "apiSaveSalarySettings"
        ], [
            "_salary", "_budgetPeople", "_calculatePersonnelSalary"
        ], [
            "People", "BudgetSalarySettings"
        ], [
            "apiSaveSalarySettings"
        ]), admin: _budgetDomainPhysicalSection_("admin", "budget settings", [
            "apiBudgetAdminListYearSettingsAll",
            "apiBudgetAdminSaveYearSettingsRows", "apiBudgetGetFiscalYears"
        ], [
            "_budgetAdmin", "_budgetFy"
        ], [
            "BudgetYearSettings", "BudgetYearSettingsItems"
        ], [
            "apiBudgetAdminSaveYearSettingsRows"
        ])
    }, rules: {
        uiDomChanged: !1, businessLogicChanged: !1, apiRouteContractPreserved: !0, retiredApiFacades: ["apiBudgetListByFYFast"], noRouteRenamed: !0, noNewFiles: !0, physicalCleanupOnly: !0
    }
};
AppRepositoryRegistry.register("BudgetRepository", {
    buildSummary: function (fyValue) {
        if (fyValue = String(fyValue || ""), _appIsFnName_("_buildBudgetSummaryFromSheet_"))
            return _buildBudgetSummaryFromSheet_(fyValue);
        if (typeof getBudgetSummaryByFY == "function") {
            var res = getBudgetSummaryByFY({
                fy: fyValue
            }), data = res && res.data && typeof res.data == "object" ? res.data : res;
            return data && _appArrayValue_(data.rows);
        }
        return [];
    }
}, { owner: "Code_32_Domain_Budget:BudgetRepository" });
AppDomain.BudgetSalaryRules = AppDomain.BudgetSalaryRules || {}, AppDomain.BudgetSalaryRules.normalizePersonnelPosition = function (value) {
    var v = String(value || "").replace(/\s+/g, " ").trim();
    return v ? /(คณะอนุกรรมาธิการ|อนุกรรมาธิการ|คณะกรรมาธิการ)\s*\d*/.test(v) && !/(ที่ปรึกษา|ผู้ชำนาญการ|นักวิชาการ|เลขานุการ)/.test(v) ? "" : /ที่ปรึกษา/.test(v) ? "ที่ปรึกษา" : /ผู้ชำนาญการ/.test(v) ? "ผู้ชำนาญการ" : /นักวิชาการ/.test(v) ? "นักวิชาการ" : /เลขานุการ/.test(v) ? "เลขานุการ" : v : "";
}, AppDomain.BudgetSalaryRules.isSalaryRelevantPosition = function (value) {
    var v = String(value || "").replace(/\s+/g, " ").trim();
    return !!v && /(ที่ปรึกษา|ผู้ชำนาญการ|นักวิชาการ|เลขานุการ)/.test(v);
}, AppDomain.BudgetSalaryRules.salaryKeyMap = function () {
    return {
        ที่ปรึกษา: {
            g: "ADV_G", n: "ADV"
        }, ผู้ชำนาญการ: {
            g: "EXP_G", n: "EXP"
        }, นักวิชาการ: {
            g: "ACA_G", n: "ACA"
        }, เลขานุการ: {
            g: "SEC_G", n: "SEC"
        }
    };
}, AppDomain.BudgetSalaryRules.resolveIsGovFlag = function (row) {
    row = row || {};
    var gov = String(row.isGov || "").trim();
    if (gov === "ใช่")
        return "g";
    if (gov === "ไม่ใช่")
        return "n";
    var t = String(row.personnelType || "").trim();
    return t === "ใช่" ? "g" : "n";
}, AppDomain.BudgetAgingRules = AppDomain.BudgetAgingRules || {}, AppDomain.BudgetAgingRules.businessDaysSince = function (startDate, endDate, holidays) {
    var s = new Date(startDate || ""), e = endDate ? new Date(endDate) : new Date;
    if (isNaN(s.getTime()) || isNaN(e.getTime()))
        return 0;
    s.setHours(0, 0, 0, 0), e.setHours(0, 0, 0, 0);
    var holidaySet = {};
    (holidays || []).forEach(function (h) {
        holidaySet[String(h || "")] = !0;
    });
    var count = 0, cur = new Date(s.getTime());
    for (cur.setDate(cur.getDate() + 1); cur <= e;) {
        var day = cur.getDay(), iso = Utilities.formatDate(cur, Session.getScriptTimeZone(), "yyyy-MM-dd");
        day === 0 || day === 6 || holidaySet[iso] || count++, cur.setDate(cur.getDate() + 1);
    }
    return count;
};
function _currentBudgetFyString_() {
    try {
        return String(_currentFiscalYearThai_(new Date));
    }
    catch (_e) {
        var d = new Date;
        return String(d.getMonth() >= 9 ? d.getFullYear() + 544 : d.getFullYear() + 543);
    }
}
function _bAuthErrorResult_(e, route) {
    var msg = String(e && e.message ? e.message : e || "ไม่พบ token การใช้งาน");
    return (msg.indexOf("token") > -1 || msg.indexOf("session") > -1 || msg.indexOf("สิทธิ") > -1) && (msg = "session หมดอายุหรือไม่พบ token การใช้งาน กรุณาเข้าสู่ระบบใหม่"),
        err_(msg, {
            rows: [], data: [], items: [], records: [], authRequired: !0, route: String(route || ""), source: "budget-auth-guard"
        });
}
function _bSafeReq_(payload, role, route) {
    return safeDomainRequest_(payload, role || "viewer", route, _bAuthErrorResult_);
}
/* --------------------------------------------------------------------------
 * 2. Repository and sheet/data-service reads
 * -------------------------------------------------------------------------- */
function _budgetRepository_(name) {
    var aliasMap;
    return getCanonicalRepository_({
        BudgetImports: "budget.imports", BudgetSummary: "budget.summary", BudgetYearSettingsItems: "budget.yearSettingsItems", SalarySettings: "budget.salarySettings",
        Personnel_Staff: "people.personnelStaff"
    }[String(name || "").trim()] || String(name || "").trim());
}
function _budgetRows_(name, includeDeleted) {
    try {
        var repo = _budgetRepository_(name);
        return includeDeleted === !0 ? repo.listAll() : repo.listActive();
    }
    catch (_repoErr) {
        return readSheetObjectsCached_(String(name || ""), {
            includeDeleted: includeDeleted === !0
        });
    }
}
function _budgetProjectionPlanFieldsC_(sheetName) {
    sheetName = String(sheetName || "").trim();
    var fields = _budgetProjectedFields_(sheetName);
    if (!fields.length && typeof SHEET_SCHEMAS != "undefined" && Array.isArray(SHEET_SCHEMAS[sheetName]))
        fields = SHEET_SCHEMAS[sheetName].slice();
    return fields;
}
function _budgetDataServiceRows_(sheetName, fields, opts) {
    opts = opts || {};
    fields = _appArrayValue_(fields);
    var name = String(sheetName || "").trim(), cacheBypass = _budgetCachePolicyBypass_(opts) || opts.forceFresh === !0 || opts.noCache === !0 || opts.bypassCache === !0 || opts.bypassRequestCache === !0 || opts.reload === !0, projectedRows = null, projectedOk = !1, planFields = Array.isArray(opts.projectionPlanFields) && opts.projectionPlanFields.length ? opts.projectionPlanFields : _budgetProjectionPlanFieldsC_(name), planName = String(opts.projectionPlan || "budget:" + name);
    function fullRead(reason) {
        var rows = [];
        try {
            rows = _budgetRows_(name, opts.includeDeleted === !0) || [];
        }
        catch (_fullErr) {
            _b32W_("budget.dataService.fullRead", _fullErr, {
                sheetName: name,
                reason: reason || "fallback"
            });
            rows = [];
        }
        if (rows && rows.length)
            try {
                rows.__budgetFallbackFullRead = !0;
                rows.__budgetFallbackReason = String(reason || "");
            }
            catch (_tagErr) { _appIgnoreExpected_("Code_32_Domain_Budget.gs.ignored", _tagErr); }
        return rows || [];
    }
    try {
        if (_appIsFnName_("_appDataServiceRead_")) {
            projectedRows = _appDataServiceRead_(name, fields, _appAssignObjects_({}, opts, {
                owner: "budget.domain",
                ttl: cacheBypass ? 0 : (opts.ttl || 240),
                forceFresh: cacheBypass || opts.forceFresh === !0,
                noCache: cacheBypass || opts.noCache === !0,
                bypassCache: cacheBypass || opts.bypassCache === !0,
                bypassRequestCache: cacheBypass || opts.bypassRequestCache === !0,
                includeDeleted: opts.includeDeleted === !0,
                requireCanonical: opts.requireCanonical === !0,
                sparseRead: opts.sparseRead !== !1,
                projectedReadMode: "bounded-sparse-spans",
                maxColumnSpans: Number(opts.maxColumnSpans || 4) || 4,
                projectionPlan: planName,
                projectionPlanFields: planFields
            })) || [];
            projectedOk = !0;
        }
        else if (fields.length && typeof readSheetProjectedObjectsCached_ == "function") {
            projectedRows = (cacheBypass ? [] : readSheetProjectedObjectsCached_(name, fields, {
                includeDeleted: opts.includeDeleted === !0,
                requireCanonical: opts.requireCanonical === !0,
                ttl: opts.ttl || 240,
                sparseRead: opts.sparseRead !== !1,
                projectedReadMode: "bounded-sparse-spans",
                maxColumnSpans: Number(opts.maxColumnSpans || 4) || 4,
                projectionPlan: planName,
                projectionPlanFields: planFields
            })) || [];
            projectedOk = !0;
        }
    }
    catch (_projectErr) {
        _b32W_("budget.dataService.projectedRead", _projectErr, {
            sheetName: name,
            fields: fields.length
        });
        projectedRows = null;
        projectedOk = !1;
    }
    if (projectedOk && Array.isArray(projectedRows) && projectedRows.length)
        return projectedRows;
    if (projectedOk && Array.isArray(projectedRows) && !projectedRows.length) {
        var projectionMeta = projectedRows.__projectionMeta || null;
        if (projectionMeta && projectionMeta.authoritative === !0) {
            _appIsFnName_("_requestScopeBump_") && _requestScopeBump_("projectionPlan", "fallbackReadsSuppressed", 1);
            return projectedRows;
        }
    }
    var coreSheets = {
        BudgetImports: !0,
        BudgetSummary: !0,
        BudgetYearSettingsItems: !0,
        BudgetYearSettings: !0,
        SalaryPayments: !0,
        Personnel_Staff: !0,
        SalarySettings: !0,
        BudgetSalarySettings: !0
    };
    if (projectedOk && Array.isArray(projectedRows) && !projectedRows.length && coreSheets[name] && opts.allowEmpty !== !0) {
        var recoveryAllowed = opts.allowFullReadRecovery === !0 || _appIsFnName_("_productionHotPathFullSheetReadAllowed_") && _productionHotPathFullSheetReadAllowed_("budget.dataService." + name);
        if (recoveryAllowed)
            return fullRead("projection-non-authoritative-recovery");
        _appIsFnName_("_requestScopeBump_") && _requestScopeBump_("projectionPlan", "fallbackReadsSuppressed", 1);
        return projectedRows || [];
    }
    if (projectedOk)
        return projectedRows || [];
    return fullRead("projected-unavailable");
}
/* --------------------------------------------------------------------------
 * 3. Dashboard budget helpers and workflow summary
 * -------------------------------------------------------------------------- */
function _dashboardBudgetEmpty_(fy) {
    return {
        fy: String(fy || ""), totalBudget: 0, totalPaid: 0, totalRemain: 0, plans: [], byPlan: [], rows: [], details: []
    };
}
function _dashboardBudgetStatusSummaryByFY_(fy) {
    var rows = _dashboardBudgetStatusSummaryRows_(fy), summary = {
        refund: {
            total: 0, pending: 0, completed: 0
        }, report: {
            total: 0, pending: 0, completed: 0
        }
    };
    return rows.forEach(function (r) {
        r = r || {}, summary.refund.total += 1, summary.report.total += 1, _budgetStatusDone_(r.refundStatus, "refund") ? summary.refund.completed += 1 : summary.refund.pending += 1,
            _budgetStatusDone_(r.reportStatus, "report") ? summary.report.completed += 1 : summary.report.pending += 1;
    }), summary;
}
function _dashboardBudgetWorkflowSummaryHasData_(summary) {
    summary = summary || {};
    var refund = summary.refund || summary.refundSummary || summary.return || summary.returns || {}, report = summary.report || summary.reportSummary || summary.expenseReport || {};
    return !!(Number(refund.total || 0) || Number(report.total || 0) || Number(summary.refundTotal || 0) || Number(summary.reportTotal || 0));
}
function _applyDashboardBudgetStatusSummary_(payload, fy) {
    payload = payload && typeof payload === "object" ? payload : _dashboardBudgetEmpty_(fy);
    var existing = payload.statusSummary || payload.workflow || payload.budgetWorkflow || payload.workflowSummary || {}, generated = _dashboardBudgetStatusSummaryByFY_(fy || payload.fy || ""), summary = _dashboardBudgetWorkflowSummaryHasData_(existing) ? existing : generated, existingRows = _appArrayValue_(payload.workflowRows && payload.workflowRows.length ? payload.workflowRows : payload.statusRows && payload.statusRows.length ? payload.statusRows : []), generatedRows = _dashboardBudgetStatusSummaryRows_(fy || payload.fy || "");
    payload.statusSummary = summary;
    payload.workflow = summary;
    payload.budgetWorkflow = summary;
    payload.workflowSummary = summary;
    payload.workflowRows = existingRows.length ? existingRows : generatedRows;
    payload.statusRows = payload.workflowRows;
    return payload;
}
function _dashboardBudgetHasData_(payload) {
    payload = _budgetReadModelData_(payload || {});
    var seg = payload.segments || {}, overview = payload.overviewSection || seg.overview || {}, workflow = payload.workflowSection || seg.workflow || {}, reportSeg = payload.reportSection || seg.report || {};
    var rows = Array.isArray(payload.byPlan) ? payload.byPlan : Array.isArray(payload.plans) ? payload.plans : Array.isArray(payload.rows) ? payload.rows : Array.isArray(payload.details) ? payload.details : Array.isArray(overview.rows) ? overview.rows : [];
    var statusSummary = payload.statusSummary || payload.workflow || payload.budgetWorkflow || payload.workflowSummary || workflow.summary || {};
    var refund = statusSummary.refund || statusSummary.refundSummary || {};
    var report = statusSummary.report || statusSummary.reportSummary || {};
    var totals = payload.grandTotals || payload.totals || overview.totals || {};
    var all = totals.all || totals || {};
    return !!(rows.length ||
        Number(payload.totalBudget || payload.totalPaid || payload.totalExpense || payload.totalRemain || payload.totalRemaining || 0) ||
        Number(all.budget || all.totalBudget || all.spent || all.totalPaid || all.remain || all.totalRemain || 0) ||
        Number(overview.totalBudget || overview.totalPaid || overview.totalRemain || 0) ||
        Number(refund.total || report.total || statusSummary.refundTotal || statusSummary.reportTotal || 0) ||
        (Array.isArray(payload.workflowRows) && payload.workflowRows.length) ||
        (Array.isArray(payload.statusRows) && payload.statusRows.length) ||
        (Array.isArray(workflow.rows) && workflow.rows.length) ||
        (Array.isArray(reportSeg.rows) && reportSeg.rows.length));
}
function _budgetCollectFiscalYears_(includeCurrent, warningPrefix) {
    var years = [];
    function add2(value) {
        var fy = _b32FY_(value);
        fy && years.indexOf(fy) < 0 && years.push(fy);
    }
    function read(sheetName, pick) {
        try {
            (_budgetLiteRows_(sheetName) || []).forEach(function (row) {
                add2(pick ? pick(row || {}) : row && row.fy);
            });
        }
        catch (e) {
            _b32W_(String(warningPrefix || "budget.fiscalYears") + "." + String(sheetName || "sheet"), e);
        }
    }
    return read("BudgetYearSettingsItems", function (row) {
        return row && (row.fy || row.fiscalYear || row.budgetFy || row.budgetYear || row.year || row.ปีงบประมาณ || row.ปีงบ);
    }), read("BudgetSummary", function (row) {
        return row && (row.fy || row.fiscalYear || row.budgetFy || row.budgetYear || row.year || row.ปีงบประมาณ || row.ปีงบ);
    }), read("BudgetImports", function (row) {
        return _budgetRowFyLite_(row);
    }), includeCurrent && add2(_currentBudgetFyString_()), years.filter(Boolean).sort(function (a, b) {
        return Number(b || 0) - Number(a || 0);
    });
}
function _latestAvailableBudgetFy_() {
    var years = _budgetCollectFiscalYears_(!1, "budget.latestFy");
    return years.length ? years[0] : _currentBudgetFyString_() || "";
}
function _resolveBudgetDefaultFiscalYear_() {
    var currentFy = _currentBudgetFyString_(), preferred;
    return _b32FY_(_latestAvailableBudgetFy_()) || currentFy;
}
function _budgetFyCandidatesFromData_() {
    return _budgetCollectFiscalYears_(!0, "budget.dashboardFyCandidates");
}
function _budgetImportCanonicalFields_() {
    return [
        "id", "ID", "เลขที่", "fy", "FY", "fiscalYear", "budgetFy", "budgetYear", "year", "ปีงบประมาณ", "ปีงบ", "entryType", "category", "type",
        "item", "itemName", "topic", "name", "label", "ประเภทรายการ", "ประเภทรายการงบประมาณ", "ประเภท", "รายการ", "ชื่อรายการ", "รายการงบประมาณ", "หัวข้อ",
        "ชื่อเรื่อง", "committeeType", "committeeName", "roundNo", "คณะ", "ชื่อคณะ", "ครั้งที่", "startDate", "endDate", "activityDate", "seminarDate",
        "date", "createdAt", "updatedAt", "วันที่", "วันเดือนปี", "วันที่ดำเนินการ", "วันที่เริ่ม", "วันที่สิ้นสุด", "meetingAllowance", "snackCost",
        "lunchCost", "travelCost", "receptionCost", "seminarCost", "foreignTripCost", "foreignGuestCost", "supportCost", "spent", "expense", "paid",
        "paidAmount", "actualAmount", "expenseAmount", "disbursement", "disbursed", "usedBudget", "usedAmount", "รายจ่าย", "รายจ่ายรวม", "จำนวนรายจ่าย",
        "เบิกจ่าย", "ยอดเบิกจ่าย", "amount", "totalAmount", "rowAmount", "จำนวนเงิน", "ยอดรวม", "รวมเป็นเงิน", "ค่าใช้จ่าย", "ค่าใช้จ่ายรวม", "committeeResponsible",
        "staffResponsible", "note", "remark", "refundStatus", "refundDate", "reportStatus", "reportDate", "สถานะคืนเงิน", "สถานะการคืนเงิน", "วันที่คืนเงิน",
        "วันคืนเงิน", "สถานะรายงาน", "สถานะรายงานค่าใช้จ่าย", "วันที่รายงาน", "วันรายงาน", "payloadJson", "payloadJSON", "extra", "payload", "visitLocations",
        "seminarLocations", "countriesText", "subcommitteeName", "seminarTitle", "supportType", "detail", "guestCountry", "visitPlace", "visitProvince",
        "visitDistrict", "visitSubDistrict", "seminarPlace", "seminarProvince", "seminarDistrict", "seminarSubDistrict", "seminarItemsJson", "extraJson",
        "visitLocationsJson", "visitLocationsJSON", "seminarLocationsJson", "seminarLocationsJSON", "countriesJson", "countriesJSON", "visitLocationsText",
        "seminarLocationsText", "isDeleted", "deleted", "deletedAt"
    ];
}
function _budgetProjectedFields_(sheetName) {
    return sheetName = String(sheetName || "").trim(), sheetName === "BudgetImports" ? _budgetImportCanonicalFields_() : sheetName === "BudgetTypeSummary" ? _budgetFastTypeSummaryFields_("BudgetTypeSummary") : sheetName === "BudgetSummary" ? [
        "id",
        "ID", "fy", "FY", "fiscalYear", "budgetFy", "budgetYear", "year", "ปีงบประมาณ", "ปีงบ", "planGroup", "plan", "category", "item", "name", "label",
        "title", "description", "แผนงาน", "หมวด", "หมวดงบประมาณ", "รายการ", "ชื่อรายการ", "รายการงบประมาณ", "budget", "totalBudget", "amountBudget",
        "budgetAmount", "annualBudget", "annualCommitment", "monthlyBudget", "วงเงินงบประมาณ", "งบประมาณ", "งบประมาณที่ได้รับ", "งบประมาณรวม", "จำนวนงบประมาณ",
        "spent", "spentAmount", "expense", "expenseAmount", "totalExpense", "totalSpent", "totalPaid", "used", "usedAmount", "paid", "paidAmount", "actualAmount",
        "disbursement", "disbursed", "usedBudget", "personnelExpense", "staffExpense", "ytdExpense", "salaryExpense", "compensationExpense", "allowanceExpense",
        "currentMonthlyExpense", "monthlyRateTotal", "รายจ่าย", "รายจ่ายรวม", "จำนวนรายจ่าย", "ยอดใช้จ่าย", "ค่าใช้จ่าย", "ค่าใช้จ่ายรวม", "เบิกจ่าย",
        "ยอดเบิกจ่าย", "ค่าตอบแทน", "ค่าตอบแทนรวม", "เงินเดือน", "เงินเดือนรวม", "ค่าตอบแทนรายเดือน", "amount", "totalAmount", "rowAmount", "จำนวนเงิน",
        "ยอดรวม", "รวมเป็นเงิน", "รวม", "remain", "balance", "remaining", "คงเหลือ", "งบประมาณคงเหลือ", "updatedAt", "isDeleted", "deleted", "deletedAt"
    ] : sheetName === "BudgetYearSettingsItems" || sheetName === "BudgetYearSettings" ? [
        "fy",
        "FY", "fiscalYear", "budgetFy", "budgetYear", "year", "ปีงบประมาณ", "ปีงบ", "category", "item", "budget", "amount", "remark", "active", "planGroup",
        "plan", "sortNo", "updatedAt", "isDeleted", "deleted", "deletedAt"
    ] : sheetName === "SalarySettings" ? [
        "fy", "FY", "fiscalYear", "Key", "key",
        "Value", "value", "UpdatedAt", "updatedAt", "isDeleted", "deletedAt"
    ] : sheetName === "SalaryPayments" ? [
        "id", "ID", "fy", "FY", "fiscalYear",
        "budgetFy", "budgetYear", "year", "ปีงบประมาณ", "ปีงบ", "personId", "personName", "name", "fullName", "ชื่อ-สกุล", "position", "role", "title",
        "ตำแหน่ง", "monthlyRate", "monthlySalary", "salary", "salaryAmount", "rate", "months", "monthCount", "จำนวนเดือน", "amount", "totalAmount",
        "paidAmount", "expense", "spent", "รายจ่าย", "ยอดเบิกจ่าย", "จำนวนเงิน", "เงินเดือน", "ค่าตอบแทน", "paymentDate", "paidDate", "date", "วันที่จ่าย",
        "วันที่เบิกจ่าย", "createdAt", "updatedAt", "isDeleted", "deleted", "deletedAt"
    ] : sheetName === "Personnel_Staff" ? [
        "id", "ID", "รหัส", "ลำดับ",
        "เลขที่", "รหัสบุคลากร", "name", "fullName", "ชื่อ-สกุล", "ชื่อสกุล", "ชื่อ - สกุล", "ชื่อ-นามสกุล", "ชื่อ", "ชื่อบุคลากร", "ชื่อและสกุล", "position",
        "role", "title", "personnelType", "ตำแหน่ง", "ตำแหน่งในคณะ", "ตำแหน่งงาน", "ประเภทบุคลากร", "ประเภท", "สถานภาพ", "phone", "startDate", "workStartDate",
        "appointedDate", "วันที่เริ่ม", "วันเริ่ม", "วันที่เริ่มดำรงตำแหน่ง", "วันเริ่มดำรงตำแหน่ง", "วันที่แต่งตั้ง", "วันแต่งตั้ง", "วันเริ่มทำหน้าที่",
        "วันเริ่ม-สิ้นสุด", "วันเริ่ม - สิ้นสุด", "endDate", "workEndDate", "retireDate", "วันที่สิ้นสุด", "วันสิ้นสุด", "วันที่พ้นตำแหน่ง", "วันพ้นตำแหน่ง",
        "วันสิ้นสุดตำแหน่ง", "status", "workStatus", "activeStatus", "สถานะ", "สถานะการดำรงตำแหน่ง", "isGov", "ข้าราชการ", "เป็นข้าราชการ", "สถานะข้าราชการ",
        "salary", "monthlySalary", "compensation", "amount", "rate", "monthlyRate", "allowance", "เงินเดือน", "ค่าตอบแทน", "ค่าตอบแทนรายเดือน", "จำนวนเงิน",
        "createdAt", "updatedAt", "isDeleted", "deleted", "deletedAt"
    ] : [];
}
function _budgetLiteRows_(sheetName) {
    var fields = _budgetProjectedFields_(sheetName);
    if (fields.length)
        try {
            return _budgetDataServiceRows_(String(sheetName || ""), fields, {
                includeDeleted: !1, requireCanonical: !1, ttl: 240, sparseRead: !0, projectedReadMode: "bounded-sparse-spans", maxColumnSpans: 4, allowEmpty: !0
            }) || [];
        }
        catch (_projectedErr) {
            _b32W_("budget.liteRows.projected", _projectedErr, {
                sheetName
            });
        }
    try {
        return _budgetRows_(sheetName, !1) || [];
    }
    catch (_e3) {
        _b32W_("budget.liteRows.directRead", _e3, {
            sheetName
        });
    }
    return [];
}
function _budgetRowFyLite_(row) {
    var rowFy = _b32FY_((row = row || {}).fy || row.fiscalYear || row.budgetFy || row.budgetYear || row.ปีงบประมาณ || row.ปีงบ);
    if (rowFy)
        return rowFy;
    var extra = {};
    try {
        extra = _appIsFnName_("_budgetParsePayloadExtra_") ? _budgetParsePayloadExtra_(row, []) : {};
    }
    catch (_e) {
        extra = {};
    }
    if (rowFy = _b32FY_(extra.fy || extra.fiscalYear || extra.budgetFy || extra.budgetYear || extra.ปีงบประมาณ))
        return rowFy;
    var baseDate, d = _budgetParseDate_(row.activityDate || row.meetingDate || row.seminarDate || row.travelStartDate || row.travelEndDate || row.startDate || row.endDate || row.createdAt || row.วันที่ || row.วันที่จัดกิจกรรม || extra.activityDate || extra.meetingDate || extra.semDate || extra.seminarDate || extra.travelStartDate || extra.travelEndDate || extra.startDate || extra.endDate || "");
    return d ? String(d.getMonth() >= 9 ? d.getFullYear() + 544 : d.getFullYear() + 543) : "";
}
function _dashboardBudgetStatusSummaryRows_(fy) {
    var target = _b32FY_(fy), cacheStamp = "1";
    try {
        cacheStamp = _appIsFnName_("_entityCacheStamp_") ? _entityCacheStamp_("budgetimports") : "1";
    }
    catch (_verErr) {
        cacheStamp = "1";
    }
    var cacheKey = "dashboard_budget_status_current_r77_" + String(target || "all") + "_" + cacheStamp;
    try {
        var cached = _AppScriptCache_().get(cacheKey);
        if (cached) {
            var parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length)
                return parsed;
        }
    }
    catch (_cacheErr) {
        _b32W_("ec", _cacheErr);
    }
    var rows = [];
    function pick(row, keys) {
        row = row || {};
        var raw = row.__raw && typeof row.__raw == "object" ? row.__raw : {};
        var extra = {};
        try {
            extra = _appIsFnName_("_budgetParsePayloadExtra_") ? _budgetParsePayloadExtra_(row, []) : {};
        }
        catch (_extraErr) {
            extra = {};
        }
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i], v = row[k];
            if (v != null && String(v).trim() !== "")
                return v;
            v = raw[k];
            if (v != null && String(v).trim() !== "")
                return v;
            v = extra[k];
            if (v != null && String(v).trim() !== "")
                return v;
        }
        return "";
    }
    try {
        var raw = _budgetLiteRows_("BudgetImports") || [];
        if (!raw.length)
            raw = _budgetRows_("BudgetImports", !1) || [];
        var matched = raw.filter(function (r) {
            var rowFy = _budgetRowFyLite_(r);
            return !target || rowFy === target;
        });
        if (target && raw.length && !matched.length)
            matched = raw;
        rows = matched.map(function (r) {
            r = r || {};
            var rowFy = _budgetRowFyLite_(r) || target || "", refund = pick(r, [
                "refundStatus", "refund_status", "returnStatus", "return_status", "refund",
                "return", "สถานะคืนเงิน", "สถานะการคืนเงิน", "การคืนเงิน", "สถานะการคืน", "สถานะยืมเงิน"
            ]), report = pick(r, [
                "reportStatus", "report_status",
                "expenseReportStatus", "expense_report_status", "report", "expenseReport", "reportExpenseStatus", "expenseReport", "สถานะรายงาน", "สถานะรายงานค่าใช้จ่าย",
                "รายงานค่าใช้จ่าย", "สถานะส่งรายงาน", "สถานะส่งรายงานค่าใช้จ่าย"
            ]);
            return {
                fy: rowFy, refundStatus: String(refund || "ยังไม่คืนเงิน"), reportStatus: String(report || "ยังไม่รายงาน"), __dashboardWorkflowFyFallbackAll: !!(target && rowFy !== target)
            };
        }).filter(function (r) {
            return r && String(r.refundStatus || r.reportStatus || "").trim();
        });
    }
    catch (_e) {
        _b32W_("budget.dashboardStatus.rows", _e, {
            fy: target
        }), rows = [];
    }
    try {
        rows.length && safeCachePut_(_AppScriptCache_(), cacheKey, rows, 120);
    }
    catch (_putErr) {
        _b32W_("budget.dashboardStatus.cachePut", _putErr, {
            cacheKey
        });
    }
    return _appArrayValue_(rows);
}
function _budgetStatusDone_(status, kind) {
    var st = String(status || "").trim();
    return !!st && st.indexOf("ยังไม่") === -1 && (kind === "refund" && st.indexOf("ไม่มีการยืมเงิน") !== -1 || st.indexOf("แล้ว") !== -1 || st.indexOf("เสร็จ") !== -1 || st.indexOf("ครบ") !== -1);
}
function _dashboardBudgetCacheKey_(fy) {
    var cacheStamp = "na";
    return _appIsFnName_("_entityCacheStamp_") && (cacheStamp = [
        _entityCacheStamp_("budgetsummary"), _entityCacheStamp_("budgetyearsettingsitems"),
        _entityCacheStamp_("budgetimports"), _entityCacheStamp_("salarysettings"), BUDGET_CACHE_POLICY_STAMP
    ].join("_")), "dashboard_budget_current_r77_" + String(fy || "") + "_" + cacheStamp;
}
function _budgetCanonicalPayloadFy_(payload) {
    return _b32FY_((payload = payload || {}).fy || payload.fiscalYear || payload.year || payload.budgetFy || payload.budgetYear || payload.defaultBudgetFY || payload.defaultFy || payload.selectedFiscalYear || payload.currentFy || payload.ปีงบประมาณ || payload.ปีงบ || "");
}
function _budgetSummaryRowsFromSettingsOnly_(fyValue) {
    fyValue = _b32FY_(fyValue);
    try {
        var settings = getBudgetYearSettingsMatrix(fyValue), rows = settings && settings.data && settings.data.rows || settings.rows || [];
        return _normalizeBudgetSummaryRows_(rows = (_appArrayValue_(rows)).map(function (r) {
            r = r || {};
            var budget = Number(r.budget || r.amount || 0) || 0;
            return {
                fy: fyValue, planGroup: String(r.planGroup || r.category || r.plan || "").trim(), category: String(r.category || r.planGroup || r.plan || "").trim(),
                item: String(r.item || r.name || "").trim(), budget, spent: 0, remain: budget
            };
        }).filter(function (row) {
            return row.planGroup || row.item || row.budget;
        }), fyValue);
    }
    catch (_e) {
        return _b32W_("budget.summary.settingsOnly", _e, {
            fy: fyValue
        }), [];
    }
}
/* --------------------------------------------------------------------------
 * 4. Budget summary read model and canonical rows
 * -------------------------------------------------------------------------- */
function getBudgetSummaryByFY(fy) {
    var payload = fy && typeof fy == "object" && !Array.isArray(fy) ? fy : {
        fy: fy
    }, dto = _budgetReadModelBuildSummaryDto_(payload, {
        source: "BudgetReadModel.centralDTO.getBudgetSummaryByFY.r76", dataSource: "centralBudgetDTO", contractStamp: "budget-summary-central-dto-current-r76"
    });
    return ok_(dto, "โหลดสรุปงบประมาณสำเร็จ");
}
function _budgetImportCostAmountLite_(row) {
    row = row || {};
    var warnings = [], ex = _appIsFnName_("_budgetNormalizeImportCostPayload_") ? _budgetNormalizeImportCostPayload_(row, warnings) : {}, direct = _budgetCanonicalExpenseAmount_(row, ex);
    return direct || _budgetComponentTotal_(ex, !1) + _budgetResolveSupportCostAmount_(row, ex, warnings);
}
function _budgetSummaryRowsFromImportsLite_(fyValue) {
    var settings = _budgetSummaryRowsFromSettingsOnly_(fyValue = _b32FY_(fyValue) || _currentBudgetFyString_()), map = {}, warnings = [];
    function makeKey(planGroup, item) {
        return String(planGroup || "").trim() + "||" + String(item || "").trim();
    }
    (_appArrayValue_(settings)).forEach(function (r) {
        if (!_budgetIsActivityLeakRow_(r)) {
            var k = makeKey(r.planGroup || r.category, r.item);
            map[k] || (map[k] = _appAssignObjects_({}, r, {
                spent: 0, remain: Number(r.budget || 0) || 0
            }));
        }
    });
    var hasSettings = Object.keys(map).length > 0, importRows = _budgetLiteRows_("BudgetImports") || [], matched = 0;
    importRows.forEach(function (row) {
        if (_budgetRowFyLite_(row = row || {}) === fyValue) {
            var ex = _budgetNormalizeImportCostPayload_(row, warnings), allocated = {}, rowAmount = _b32N_(ex.rowAmount || row.totalAmount || row.amount), components = _budgetCostComponentsForRow_(row, ex, warnings), componentTotal = components.reduce(function (sum, component) {
                return sum + _b32N_(component && component.amount);
            }, 0);
            if (componentTotal && rowAmount && rowAmount > componentTotal + .01 && warnings.push("ยอดรวมมากกว่ายอดแยกหมวด " + String(row.id || row.topic || row.entryType || "") + ": total=" + rowAmount + ", components=" + componentTotal),
                !componentTotal && rowAmount) {
                for (var category = String(row.category || row.planGroup || "").trim(), item = String(row.item || ex.supportType || row.entryType || "").trim(), exactKeys = [
                    category + "||" + item, category + "||" + String(row.entryType || "").trim(), String(row.entryType || "").trim() + "||" + item
                ], ek = 0; ek < exactKeys.length; ek++)
                    if (map[exactKeys[ek]]) {
                        if (!_budgetCanAllocateRowAmountToSummaryKey_(exactKeys[ek])) {
                            warnings.push("ไม่ใช้ totalAmount ลงหมวดรายจ่ายแบบ component: " + exactKeys[ek]);
                            continue;
                        }
                        map[exactKeys[ek]].spent = _b32N_(map[exactKeys[ek]].spent) + rowAmount, map[exactKeys[ek]].remain = _b32N_(map[exactKeys[ek]].budget) - _b32N_(map[exactKeys[ek]].spent),
                            allocated.rowAmount = !0, matched++;
                        break;
                    }
            }
            components.forEach(function (component) {
                if (!allocated[component.field]) {
                    var key = _budgetChooseBestSummaryKey_(map, component, row, ex);
                    if (!key || !map[key])
                        return warnings.push("ไม่พบหมวดงบประมาณสำหรับ " + component.field), void 0;
                    map[key].spent = _b32N_(map[key].spent) + _b32N_(component.amount), map[key].remain = _b32N_(map[key].budget) - _b32N_(map[key].spent),
                        allocated[component.field] = !0, matched++;
                }
            });
        }
    });
    var staffExpenseInfo = {
        amount: 0, status: "ok-fast", warnings: []
    };
    try {
        staffExpenseInfo = _calculatePersonnelSalaryExpenseDetailed_(fyValue);
        var staffAmount = _b32N_(staffExpenseInfo.amount), staffTouched = !1;
        if (Object.keys(map).forEach(function (k) {
            var keyText = String(k || "").toLowerCase();
            if (keyText.indexOf("บุคลากร") > -1 || keyText.indexOf("ค่าตอบแทน") > -1 || keyText.indexOf("ผู้ปฏิบัติงาน") > -1) {
                var existingAmount = _budgetCanonicalExpenseAmount_(map[k], map[k].extra || {}), effectiveAmount = staffAmount > 0 ? staffAmount : existingAmount;
                map[k].spent = effectiveAmount, map[k].spentAmount = effectiveAmount, map[k].expense = effectiveAmount, map[k].expenseAmount = effectiveAmount,
                    map[k].totalPaid = effectiveAmount, map[k].totalSpent = effectiveAmount, map[k].personnelExpense = effectiveAmount, map[k].staffExpense = effectiveAmount,
                    map[k].remain = _b32N_(map[k].budget) - effectiveAmount, map[k].balance = map[k].remain, map[k].isPersonnelCompensation = !0, staffTouched = !0;
            }
        }), !staffTouched && staffAmount > 0) {
            var staffKey = "แผนงานบุคลากรภาครัฐ||" + _budgetPersonnelCompensationLabel_();
            map[staffKey] = {
                fy: fyValue, planGroup: "แผนงานบุคลากรภาครัฐ", category: "แผนงานบุคลากรภาครัฐ", item: _budgetPersonnelCompensationLabel_(), budget: 0,
                spent: staffAmount, spentAmount: staffAmount, expense: staffAmount, expenseAmount: staffAmount, totalPaid: staffAmount, totalSpent: staffAmount,
                personnelExpense: staffAmount, staffExpense: staffAmount, remain: -staffAmount, balance: -staffAmount, isPersonnelCompensation: !0
            };
        }
        warnings = warnings.concat(staffExpenseInfo.warnings || []);
    }
    catch (_staffFastErr) {
        warnings.push("คำนวณค่าตอบแทนบุคลากรไม่สำเร็จ: " + String(_staffFastErr && _staffFastErr.message ? _staffFastErr.message : _staffFastErr)),
            staffExpenseInfo = {
                amount: 0, status: "error", warnings: []
            };
    }
    var rows = _normalizeBudgetSummaryRows_(Object.keys(map).map(function (k) {
        return map[k];
    }), fyValue);
    rows.length || hasSettings || (rows = (importRows || []).filter(function (row) {
        return _budgetRowFyLite_(row) === fyValue;
    }).slice(0, 50).map(function (r) {
        var ex = _budgetNormalizeImportCostPayload_(r, []), amount = _budgetImportCostAmountLite_(r), label = String(r.item || r.category || r.entryType || ex.supportType || "รายการงบประมาณ").trim();
        return /^การประชุมคณะกรรมาธิการ$|^การประชุมคณะอนุกรรมาธิการ$|^การศึกษาดูงานในประเทศ$/.test(label) && (label = "รายการงบประมาณ"), {
            fy: fyValue, planGroup: label, category: label, item: label, budget: 0, spent: amount, expense: amount, remain: -amount, balance: -amount
        };
    })), rows = _budgetApplyStrictComponentSpentToRows_(rows, fyValue, warnings);
    try {
        rows._meta = _budgetSetLastSummaryMeta_({
            fy: fyValue, warnings: warnings.filter(function (v, i, a) {
                return v && a.indexOf(v) === i;
            }), staffExpenseStatus: staffExpenseInfo.status || "ok-fast", staffExpense: _b32N_(staffExpenseInfo.amount), allocationMode: "strict-component-totals-no-personnel-reconciled",
            matchedImports: matched, totalsReconciled: !0
        });
    }
    catch (_e) {
        _b32W_("ec", _e);
    }
    return rows;
}
var __LAST_BUDGET_SUMMARY_META__ = null;
function _budgetToNumber_(value) {
    if (value == null || value === "")
        return 0;
    if (typeof value == "number")
        return isFinite(value) ? value : 0;
    var raw = String(value).trim();
    if (!raw)
        return 0;
    var thaiDigits = {
        "๐": "0", "๑": "1", "๒": "2", "๓": "3", "๔": "4", "๕": "5", "๖": "6", "๗": "7", "๘": "8", "๙": "9"
    };
    raw = raw.replace(/[๐-๙]/g, function (ch) {
        return thaiDigits[ch] || ch;
    }).replace(/,/g, "").replace(/[()]/g, function (ch) {
        return ch === "(" ? "-" : "";
    });
    var cleaned = raw.replace(/[^0-9.\-]/g, "");
    if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.")
        return 0;
    var parts = cleaned.split(".");
    parts.length > 2 && (cleaned = parts.shift() + "." + parts.join(""));
    var n = Number(cleaned);
    return isFinite(n) ? n : 0;
}
function _budgetNormalizedLookupKey_(value) {
    return String(value || "").replace(/[\s_\-()（）]/g, "").toLowerCase();
}
function _budgetNormalizedKeyMap_(source) {
    var out = {};
    return Object.keys(source || {}).forEach(function (key) {
        out[_budgetNormalizedLookupKey_(key)] = key;
    }), out;
}
function _budgetCostFieldNames_(includeSupport) {
    var fields = [
        "meetingAllowance", "snackCost", "lunchCost", "travelCost", "receptionCost", "seminarCost", "foreignTripCost", "foreignGuestCost"
    ];
    return includeSupport ? fields.concat([
        "supportCost"
    ]) : fields;
}
function _budgetCanonicalExpenseAmount_(row, extra) {
    row = row || {}, extra = extra || {};
    var aliases = [
        "spent", "spentAmount", "expense", "expenseAmount", "totalExpense", "totalSpent", "totalPaid", "used", "usedAmount", "paid",
        "paidAmount", "actualAmount", "disbursement", "disbursed", "usedBudget", "personnelExpense", "staffExpense", "currentMonthlyExpense", "monthlyRateTotal",
        "รายจ่าย", "รายจ่ายรวม", "จำนวนรายจ่าย", "ค่าใช้จ่าย", "ค่าใช้จ่ายรวม", "เบิกจ่าย", "ยอดเบิกจ่าย", "amount", "totalAmount", "rowAmount", "จำนวนเงิน",
        "ยอดรวม", "รวมเป็นเงิน", "รวม"
    ], sources = [
        row, extra, row.extra && typeof row.extra == "object" ? row.extra : {}
    ], best = 0, seen = !1;
    function read(src2, k2) {
        return src2 && _appHasOwnProperty_(src2, k2) && src2[k2] != null && String(src2[k2]).trim() !== "" ? src2[k2] : null;
    }
    for (var maps = sources.map(_budgetNormalizedKeyMap_), i = 0; i < aliases.length; i++)
        for (var sIdx = 0; sIdx < sources.length; sIdx++) {
            var src = sources[sIdx] || {}, k = aliases[i], v = read(src, k), nk, real, n;
            if (v == null && (nk = _budgetNormalizedLookupKey_(k), real = maps[sIdx][nk], real && (v = read(src, real))), v != null) {
                if (n = _b32N_(v), seen = !0, n > 0)
                    return n;
                best = n;
            }
        }
    return seen ? best : 0;
}
function _budgetComponentTotal_(extra, includeSupport) {
    return extra = extra || {}, _budgetCostFieldNames_(includeSupport).reduce(function (sum, key) {
        return sum + _b32N_(extra[key]);
    }, 0);
}
function _budgetReadRowField_(row, aliases) {
    row = row || {}, aliases = Array.isArray(aliases) ? aliases : [
        aliases
    ];
    var sources = [
        row
    ];
    row.extra && typeof row.extra == "object" && !Array.isArray(row.extra) && sources.push(row.extra);
    for (var sIdx = 0; sIdx < sources.length; sIdx++) {
        for (var src = sources[sIdx] || {}, i = 0; i < aliases.length; i++) {
            var k = aliases[i];
            if (_appHasOwnProperty_(src, k) && src[k] != null && src[k] !== "")
                return src[k];
        }
        var norm = {};
        Object.keys(src).forEach(function (k2) {
            norm[_budgetNormalizedLookupKey_(k2)] = k2;
        });
        for (var j = 0; j < aliases.length; j++) {
            var nk = String(aliases[j] || "").replace(/[\s_\-()（）]/g, "").toLowerCase();
            if (norm[nk] && src[norm[nk]] != null && src[norm[nk]] !== "")
                return src[norm[nk]];
        }
    }
    return "";
}
function _budgetParseJsonObject_(raw, warnings, label) {
    if (raw && typeof raw == "object" && !Array.isArray(raw))
        return _appAssignObjects_({}, raw);
    var text = String(raw == null ? "" : raw).trim();
    if (!text)
        return {};
    try {
        var parsed = JSON.parse(text);
        return parsed && typeof parsed == "object" && !Array.isArray(parsed) ? parsed : {};
    }
    catch (e) {
        warnings && warnings.push("parse-failed:" + String(label || "payload"));
        try {
            typeof logAudit_ == "function" && logAudit_("budget.payload.parse.failed", {
                label: label || "", error: e && e.message || String(e)
            });
        }
        catch (_auditErr) {
            _b32W_("ec", _auditErr);
        }
        return {};
    }
}
function _budgetParsePayloadExtra_(row, warnings) {
    warnings = warnings || [];
    var extra = {}, rawExtra = _budgetReadRowField_(row = row || {}, [
        "extra", "Extra", "extraJson", "extraJSON", "ExtraJson", "ExtraJSON"
    ]);
    rawExtra && typeof rawExtra == "object" && !Array.isArray(rawExtra) ? extra = _appAssignObjects_(extra, rawExtra) : rawExtra && (extra = _appAssignObjects_(extra, _budgetParseJsonObject_(rawExtra, warnings, "extra")));
    var rawPayload = _budgetReadRowField_(row, [
        "payloadJson", "payloadJSON", "payloadjson", "PayloadJson", "PayloadJSON"
    ]);
    if (rawPayload && (extra = _appAssignObjects_(extra, _budgetParseJsonObject_(rawPayload, warnings, "payloadJson"))), !Array.isArray(extra.seminarItems)) {
        var rawSeminarItems = _budgetReadRowField_(row, [
            "seminarItems", "seminarItemsJson", "seminarItemsJSON", "SeminarItemsJson", "SeminarItemsJSON"
        ]);
        if (rawSeminarItems && typeof rawSeminarItems == "object")
            extra.seminarItems = _appArrayValue_(rawSeminarItems);
        else if (String(rawSeminarItems || "").trim())
            try {
                var parsedSeminarItems = JSON.parse(String(rawSeminarItems || "[]"));
                extra.seminarItems = _appArrayValue_(parsedSeminarItems);
            }
            catch (_seminarItemsErr) {
                extra.seminarItems = [], warnings.push("parse-failed:seminarItems");
            }
        else
            extra.seminarItems = [];
    }
    [
        "visitLocations", "seminarLocations", "countries"
    ].forEach(function (key) {
        if (!Array.isArray(extra[key])) {
            var raw = _budgetReadRowField_(row, [
                key + "JSON", key + "Json", key + "Text", key
            ]);
            if (String(raw || "").trim().charAt(0) === "[")
                try {
                    extra[key] = JSON.parse(String(raw));
                }
                catch (_e) {
                    extra[key] = [], warnings.push("parse-failed:" + key);
                }
            else
                extra[key] = raw ? String(raw).split(",").map(function (x) {
                    return String(x || "").trim();
                }).filter(Boolean) : [];
        }
    });
    var explicitSeminarLocs = [
        _budgetReadRowField_(row, _B32_SEMINAR_PLACE_FIELDS), _budgetReadRowField_(row, _B32_SEMINAR_PROVINCE_FIELDS), _budgetReadRowField_(row, _B32_SEMINAR_DISTRICT_FIELDS), _budgetReadRowField_(row, _B32_SEMINAR_SUBDISTRICT_FIELDS)
    ].map(function (x) {
        return String(x || "").trim();
    });
    if (Array.isArray(extra.seminarLocations) && extra.seminarLocations.length || !explicitSeminarLocs.some(Boolean) || (extra.seminarLocations = explicitSeminarLocs.filter(Boolean)),
        Array.isArray(extra.seminarItems) && extra.seminarItems.length && (extra.seminarItems = extra.seminarItems.map(function (item) {
            return (item = item && typeof item == "object" ? _appAssignObjects_({}, item) : {}).date || (item.date = item.seminarDate || item.semDate || ""), item.title || (item.title = item.seminarTitle || item.projectName || item.topic || item.name || ""),
                item.place || (item.place = item.seminarPlace || item.location || ""), item.province || (item.province = item.seminarProvince || ""), item.district || (item.district = item.seminarDistrict || ""),
                item.subDistrict || (item.subDistrict = item.seminarSubDistrict || item.seminarSubdistrict || item.subdistrict || ""), item.cost != null && item.cost !== "" || (item.cost = item.seminarCost || item.amount || item.totalAmount || 0),
                item;
        }), !Array.isArray(extra.seminarLocations) || !extra.seminarLocations.length)) {
        var firstSeminar = extra.seminarItems.filter(function (item) {
            return item && (item.place || item.province || item.district || item.subDistrict);
        })[0] || {}, fromFirst = [
            firstSeminar.place, firstSeminar.province, firstSeminar.district, firstSeminar.subDistrict
        ].map(function (x) {
            return String(x || "").trim();
        }).filter(Boolean);
        fromFirst.length && (extra.seminarLocations = fromFirst);
    }
    return extra.countriesText || (extra.countriesText = _budgetReadRowField_(row, [
        "countriesText", "ประเทศ"
    ])), extra.semDate || (extra.semDate = _budgetReadRowField_(row, _B32_SEMINAR_DATE_FIELDS)), extra.roundNo || (extra.roundNo = _budgetReadRowField_(row, [
        "roundNo", "ครั้งที่"
    ])), extra;
}
function _budgetNormalizeImportCostPayload_(row, warnings) {
    var extra = _budgetParsePayloadExtra_(row = row || {}, warnings || []);
    return _budgetCostFieldNames_(!0).forEach(function (k) {
        var v = extra[k];
        v != null && v !== "" || (v = _budgetReadRowField_(row, [
            k
        ])), extra[k] = _b32N_(v);
    }), extra.foodCost = _b32N_(extra.snackCost) + _b32N_(extra.lunchCost), extra.rowAmount = _budgetCanonicalExpenseAmount_(row, extra), extra.supportType || (extra.supportType = _budgetReadRowField_(row, [
        "supportType", "ประเภทรายการส่งเสริม", "item"
    ])), extra = _budgetApplySupportOnlyCostRule_(row, extra, warnings || []);
}
function _budgetRowClassificationText_(row, extra) {
    return row = row || {}, extra = extra || {}, String([
        row.entryType, row.category, row.item, row.topic, row.planGroup, row.committeeType, extra.supportType, extra.category, extra.item,
        extra.entryType, extra.topic
    ].filter(function (v) {
        return v != null && String(v).trim() !== "";
    }).join(" ")).replace(/\s+/g, " ").trim();
}
function _budgetIsSupportCostClassifiedRow_(row, extra) {
    var text, compact = _budgetRowClassificationText_(row, extra).replace(/\s+/g, "");
    if (!compact)
        return !1;
    if (_budgetIsSupportEntryTypeRow_(row, extra))
        return !0;
    var exactSupportItem = "ค่าใช้จ่ายในการส่งเสริมและสนับสนุนการทำงานของคณะกรรมาธิการสภาผู้แทนราษฎร".replace(/\s+/g, "");
    return compact.indexOf(exactSupportItem) > -1 || compact.indexOf("ส่งเสริม") > -1 && compact.indexOf("สนับสนุน") > -1;
}
function _budgetIsSupportEntryTypeRow_(row, extra) {
    row = row || {}, extra = extra || {};
    var primary = String(row.entryType || row.category || extra.entryType || extra.category || "").replace(/\s+/g, "");
    return primary.indexOf("ส่งเสริมและสนับสนุนการดำเนินงาน") > -1 || primary.indexOf("ส่งเสริม") > -1 && primary.indexOf("สนับสนุน") > -1;
}
function _budgetResolveSupportOnlyAmount_(row, extra, existing) {
    return extra = extra || {}, existing = existing || {}, _b32N_((row = row || {}).supportCost) || _b32N_(extra.supportCost) || _budgetCanonicalExpenseAmount_(row, extra) || _budgetNonSupportComponentTotal_(extra) || _b32N_(existing.supportCost) || _budgetCanonicalExpenseAmount_(existing, {});
}
function _budgetApplySupportOnlyCostRule_(row, extra, warnings) {
    if (!_budgetIsSupportEntryTypeRow_(row = row || {}, extra = extra || {}))
        return extra;
    var nonSupportTotal = _budgetNonSupportComponentTotal_(extra);
    return _budgetCostFieldNames_(!1).concat([
        "foodCost"
    ]).forEach(function (k) {
        extra[k] = 0;
    }), extra.supportCost = _b32N_(_budgetResolveSupportOnlyAmount_(row, extra)), warnings && nonSupportTotal && warnings.push("support-only: ย้ายยอดรวมรายการส่งเสริมฯ ไป supportCost และไม่นับ component อื่น"),
        extra;
}
function _budgetNonSupportComponentTotal_(extra) {
    return _budgetComponentTotal_(extra, !1);
}
function _budgetResolveSupportCostAmount_(row, extra, warnings) {
    row = row || {};
    var amount = _b32N_((extra = extra || {}).supportCost != null && extra.supportCost !== "" ? extra.supportCost : row.supportCost);
    if (!amount)
        return 0;
    if (_budgetIsSupportCostClassifiedRow_(row, extra))
        return amount;
    var otherTotal = _budgetNonSupportComponentTotal_(extra), rowAmount = _b32N_(extra.rowAmount || row.totalAmount || row.amount);
    return warnings && (otherTotal || rowAmount) && warnings.push("ไม่รวม supportCost เพราะรายการไม่ใช่หมวดส่งเสริมฯ: " + String(row.id || row.entryType || row.item || row.topic || "") + " supportCost=" + amount),
        0;
}
/* --------------------------------------------------------------------------
 * 5. Import DTO normalization and cost allocation
 * -------------------------------------------------------------------------- */
function _budgetNormalizeImportDto_(input, existing) {
    input = _normalizeBudgetClassification_(input || {}), existing = existing || {};
    var warnings = [], ex = _appAssignObjects_({}, input.extra || {});
    if (_budgetCostFieldNames_(!0).forEach(function (k) {
        var raw = ex[k];
        raw != null && raw !== "" || (raw = input[k]), raw != null && raw !== "" || !existing || (raw = existing[k]), ex[k] = _b32N_(raw);
    }), ex.foodCost = _b32N_(ex.snackCost) + _b32N_(ex.lunchCost), ex.rowAmount = _b32N_(input.totalAmount || input.amount || existing.totalAmount || existing.amount || ex.totalAmount || ex.amount),
        ex.supportType || (ex.supportType = input.supportType || input.item || existing.item || ""), _budgetIsSupportEntryTypeRow_(input, ex)) {
        var supportOnlyAmount = _b32N_(_budgetResolveSupportOnlyAmount_(input, ex, existing));
        _budgetCostFieldNames_(!1).concat([
            "foodCost"
        ]).forEach(function (k) {
            input[k] = 0, ex[k] = 0;
        }), input.supportCost = supportOnlyAmount, input.amount = supportOnlyAmount, input.totalAmount = supportOnlyAmount, ex.supportCost = supportOnlyAmount,
            ex.rowAmount = supportOnlyAmount, warnings.push("support-only: ยอดรายการส่งเสริมฯ ถูกล็อกไว้ที่ supportCost เท่านั้น");
    }
    var supportInputAmount = _budgetResolveSupportCostAmount_(input, _appAssignObjects_({}, ex, {
        supportCost: input.supportCost != null && input.supportCost !== "" ? input.supportCost : ex.supportCost
    }), warnings);
    _budgetIsSupportCostClassifiedRow_(input, ex) || (supportInputAmount = 0), ex.supportCost = supportInputAmount;
    var componentAmount = _budgetComponentTotal_(ex, !1) + _b32N_(supportInputAmount), inputAmount = _budgetCanonicalExpenseAmount_(input, ex), amount = componentAmount || inputAmount;
    input.amount = amount, input.totalAmount = amount, ex.totalAmount = amount, ex.amount = amount, ex.serverAmountSource = componentAmount ? "server-components" : "input-amount-default",
        ex.serverNormalized = !0;
    var visitLocs = Array.isArray(ex.visitLocations || input.visitLocations) ? ex.visitLocations || input.visitLocations : [], seminarLocs = Array.isArray(ex.seminarLocations || input.seminarLocations) ? ex.seminarLocations || input.seminarLocations : [];
    if ((!seminarLocs || !seminarLocs.length) && Array.isArray(ex.seminarItems) && ex.seminarItems.length) {
        var firstSeminarLoc = (ex.seminarItems || []).filter(function (item) {
            return item && (item.place || item.province || item.district || item.subDistrict || item.subdistrict);
        })[0] || {};
        (seminarLocs = [
            firstSeminarLoc.place, firstSeminarLoc.province, firstSeminarLoc.district, firstSeminarLoc.subDistrict || firstSeminarLoc.subdistrict
        ].map(function (x) {
            return String(x || "").trim();
        }).filter(Boolean)).length && (ex.seminarLocations = seminarLocs);
    }
    return {
        input, extra: ex, amount, supportCost: supportInputAmount, visitLocations: visitLocs, seminarLocations: seminarLocs, warnings, contractStamp: "budget-import-dto-current"
    };
}
function _budgetCostComponentsForRow_(row, extra, warnings) {
    var supportAmount = _budgetResolveSupportCostAmount_(row = row || {}, extra = extra || {}, warnings || null), comps;
    return [
        {
            field: "meetingAllowance", amount: _b32N_(extra.meetingAllowance), keywords: [
                "ค่าเบี้ยประชุม", "เบี้ยประชุมกรรมาธิการ"
            ]
        }, {
            field: "foodCost", amount: _b32N_(extra.foodCost), keywords: [
                "ค่าอาหาร", "อาหารเลี้ยงรับรอง"
            ]
        }, {
            field: "travelCost", amount: _b32N_(extra.travelCost), keywords: [
                "เบี้ยเลี้ยง", "ค่าเช่าที่พัก", "ค่าที่พัก", "ค่าพาหนะ"
            ]
        }, {
            field: "foreignGuestCost", amount: _b32N_(extra.foreignGuestCost), keywords: [
                "รับรองแขกต่างประเทศ", "แขกต่างประเทศ"
            ]
        }, {
            field: "foreignTripCost", amount: _b32N_(extra.foreignTripCost), keywords: [
                "ศึกษาดูงานต่างประเทศ", "เดินทางไปศึกษาดูงานต่างประเทศ", "ต่างประเทศ"
            ]
        }, {
            field: "receptionCost", amount: _b32N_(extra.receptionCost), keywords: [
                "เดินทางภายในประเทศ", "ปฏิบัติหน้าที่ภายในประเทศ", "ค่ารับรอง", "ภายในประเทศ"
            ]
        }, {
            field: "seminarCost", amount: _b32N_(extra.seminarCost), keywords: [
                "สัมมนา"
            ]
        }, {
            field: "supportCost", amount: supportAmount, keywords: [
                "ส่งเสริม", "สนับสนุน"
            ]
        }
    ].filter(function (c) {
        return _b32N_(c.amount) !== 0;
    });
}
function _budgetExplicitSummaryNeedles_(field) {
    var map = {
        meetingAllowance: [
            "ค่าเบี้ยประชุมกรรมาธิการ", "เบี้ยประชุมกรรมาธิการ"
        ], travelCost: [
            "ค่าเบี้ยเลี้ยง ค่าเช่าที่พักและค่าพาหนะ", "เบี้ยเลี้ยง",
            "ค่าเช่าที่พัก", "ค่าพาหนะ"
        ], foodCost: [
            "ค่าอาหารเลี้ยงรับรองคณะกรรมาธิการสภาผู้แทนราษฎร", "ค่าอาหารเลี้ยงรับรอง", "ค่าอาหาร"
        ], supportCost: [
            "ค่าใช้จ่ายในการส่งเสริมและสนับสนุนการทำงานของคณะกรรมาธิการสภาผู้แทนราษฎร",
            "ส่งเสริมและสนับสนุน"
        ], seminarCost: [
            "ค่าใช้จ่ายในการจัดสัมมนาของคณะกรรมาธิการสามัญสภาผู้แทนราษฎร", "จัดสัมมนา", "สัมมนา"
        ], foreignGuestCost: [
            "ค่าใช้จ่ายเพื่อรับรองแขกต่างประเทศของคณะกรรมาธิการสภาผู้แทนราษฎร",
            "รับรองแขกต่างประเทศ", "แขกต่างประเทศ"
        ], receptionCost: [
            "ค่าใช้จ่ายในการเดินทางเพื่อปฏิบัติหน้าที่ภายในประเทศของคณะกรรมาธิการ (ค่ารับรอง)",
            "ค่าใช้จ่ายในการเดินทางเพื่อปฏิบัติหน้าที่ภายในประเทศ", "เดินทางเพื่อปฏิบัติหน้าที่ภายในประเทศ", "เดินทางภายในประเทศ", "ปฏิบัติหน้าที่ภายในประเทศ",
            "ค่ารับรอง"
        ], foreignTripCost: [
            "ค่าใช้จ่ายในการเดินทางไปศึกษาดูงานและเจรจาธุรกิจในต่างประเทศ", "ศึกษาดูงานและเจรจาธุรกิจในต่างประเทศ", "เดินทางไปศึกษาดูงาน",
            "ต่างประเทศ"
        ]
    };
    return map[field] || [];
}
function _budgetFindExplicitSummaryKey_(summaryMap, field) {
    var needles = _budgetExplicitSummaryNeedles_(field).map(function (v) {
        return String(v || "").replace(/\s+/g, "").toLowerCase();
    }).filter(Boolean);
    if (!needles.length)
        return "";
    for (var keys = Object.keys(summaryMap || {}), i = 0; i < needles.length; i++)
        for (var k = 0; k < keys.length; k++) {
            var text = String(keys[k] || "").replace(/\s+/g, "").toLowerCase();
            if (text.indexOf(needles[i]) !== -1 || needles[i].indexOf(text) !== -1)
                return keys[k];
        }
    return "";
}
function _budgetStrictComponentFieldForSummaryKey_(summaryKey) {
    var keyText = String(summaryKey || "").replace(/\s+/g, "").toLowerCase();
    if (!keyText)
        return "";
    for (var fields = [
        "meetingAllowance", "travelCost", "foodCost", "supportCost", "seminarCost", "foreignGuestCost", "receptionCost", "foreignTripCost"
    ], i = 0; i < fields.length; i++)
        for (var needles = _budgetExplicitSummaryNeedles_(fields[i]).map(function (v) {
            return String(v || "").replace(/\s+/g, "").toLowerCase();
        }).filter(Boolean), j = 0; j < needles.length; j++)
            if (keyText.indexOf(needles[j]) !== -1 || needles[j].indexOf(keyText) !== -1)
                return fields[i];
    return "";
}
function _budgetCanAllocateRowAmountToSummaryKey_(summaryKey) {
    return !_budgetStrictComponentFieldForSummaryKey_(summaryKey);
}
function _budgetIsActivityLeakRow_(row) {
    row = row || {};
    var text = ((row.planGroup || "") + " " + (row.category || "") + " " + (row.item || "") + " " + (row.plan || "")).replace(/\s+/g, " ").trim();
    if (!text)
        return !1;
    var compact = text.replace(/\s+/g, ""), activityOnly = [
        "การประชุมคณะกรรมาธิการ", "การประชุมคณะอนุกรรมาธิการ", "การศึกษาดูงานในประเทศ", "การจัดสัมมนา",
        "การรับรองแขกต่างประเทศ"
    ].some(function (label) {
        return compact === label.replace(/\s+/g, "") || compact.indexOf(label.replace(/\s+/g, "")) === 0;
    }), hasBudgetKeyword = /(ค่าใช้จ่าย|ค่าเบี้ย|ค่าอาหาร|ค่าพาหนะ|ค่าเช่า|คงเหลือ|งบประมาณ|รายจ่าย|รับรองแขกต่างประเทศ|ส่งเสริม|สนับสนุน|สัมมนา|ต่างประเทศ)/.test(text);
    return activityOnly && !hasBudgetKeyword;
}
function _budgetSummaryKeyScore_(summaryKey, component, row, extra) {
    var keyText = String(summaryKey || "").toLowerCase();
    if (!keyText || keyText.indexOf("ค่าตอบแทนผู้ปฏิบัติงาน") > -1 || keyText.indexOf("ผู้ปฏิบัติงานให้คณะกรรมาธิการ") > -1)
        return -1;
    var score = 0;
    (component.keywords || []).forEach(function (word) {
        word && keyText.indexOf(String(word).toLowerCase()) > -1 && (score += 10);
    });
    var item = String(row.item || row.entryType || extra.supportType || "").trim().toLowerCase(), category = String(row.category || row.planGroup || "").trim().toLowerCase();
    return item && keyText.indexOf(item) > -1 && (score += 5), category && keyText.indexOf(category) > -1 && (score += 3), component.field === "foreignTripCost" && keyText.indexOf("ต่างประเทศ") === -1 && (score = -1),
        component.field === "receptionCost" && keyText.indexOf("ต่างประเทศ") > -1 && (score = -1), component.field === "seminarCost" && keyText.indexOf("สัมมนา") === -1 && (score = -1),
        component.field === "supportCost" && keyText.indexOf("ส่งเสริม") === -1 && keyText.indexOf("สนับสนุน") === -1 && (score = -1), score;
}
function _budgetChooseBestSummaryKey_(summaryMap, component, row, extra) {
    var explicitKey = _budgetFindExplicitSummaryKey_(summaryMap, component && component.field);
    if (explicitKey)
        return explicitKey;
    var bestKey = "", bestScore = 0;
    return Object.keys(summaryMap || {}).forEach(function (k) {
        var score = _budgetSummaryKeyScore_(k, component, row || {}, extra || {});
        score > bestScore && (bestScore = score, bestKey = k);
    }), bestKey;
}
function _budgetSetLastSummaryMeta_(meta) {
    return __LAST_BUDGET_SUMMARY_META__ = meta || null, meta;
}
function _budgetFiscalYearRange_(targetFy) {
    var fy = Number(_b32FY_(targetFy)), ad = fy - 543;
    return !fy || isNaN(ad) ? null : {
        fy: String(fy), start: new Date(ad - 1, 9, 1), end: new Date(ad, 8, 30, 23, 59, 59)
    };
}
function _budgetMonthOverlapCount_(startDate, endDate, rangeStart, rangeEnd) {
    if (!rangeStart || !rangeEnd)
        return 0;
    var s = startDate && startDate > rangeStart ? startDate : rangeStart, e = endDate && endDate < rangeEnd ? endDate : rangeEnd;
    if (e < s)
        return 0;
    var count = 12 * (e.getFullYear() - s.getFullYear()) + (e.getMonth() - s.getMonth()) + 1;
    return count < 0 ? 0 : Math.min(12, count);
}
function _budgetParsePersonnelDate_(value) {
    return _peopleBudgetParseDate_(value);
}
function _budgetReadPersonnelStaffRowsForSalary_() {
    return _peopleReadStaffRowsForBudget_({
        readers: [{
            label: "budget-dataservice",
            read: function () {
                return _budgetDataServiceRows_("Personnel_Staff", _budgetProjectedFields_("Personnel_Staff"), {
                    includeDeleted: false, requireCanonical: false, ttl: 300
                });
            }
        }],
        warn: function (label, err) {
            _b32W_("budget.personnel." + String(label || "read"), err);
        }
    });
}
function calculatePersonnelSalaryObligation_(staffRows, salarySettingsRows, targetFy, asOfDate) {
    var warnings = [], range = _budgetFiscalYearRange_(targetFy);
    if (!range)
        return {
            monthlyBudget: 0, monthlyRateTotal: 0, currentMonthlyExpense: 0, ytdExpense: 0, annualCommitment: 0, amount: 0, status: "error", warnings: [
                "ปีงบประมาณไม่ถูกต้อง"
            ]
        };
    var rows = _appArrayValue_(staffRows), salaryRows = _appArrayValue_(salarySettingsRows), requestedFy = _b32FY_(targetFy), targetSalaryFy = requestedFy || _latestSalarySettingsFy_(salaryRows), rates = {};
    function applyRate(key, value, overwrite) {
        key = String(key || "").trim().toUpperCase();
        var numberValue = _b32N_(value);
        !key || numberValue <= 0 || (overwrite || !rates[key]) && (rates[key] = numberValue);
    }
    salaryRows.forEach(function (row) {
        var rowFy = _b32FY_(row && row.fy);
        (!rowFy || !targetSalaryFy || rowFy === targetSalaryFy) && applyRate(row && (row.Key || row.key), row && (row.Value || row.value), !0);
    });
    try {
        var resolvedSettings = typeof getSalarySettings == "function" ? getSalarySettings(requestedFy || targetSalaryFy) || {} : {}, settingsMap = {
            BUDGET: resolvedSettings.budget, ADV: resolvedSettings.adv, ADV_G: resolvedSettings.adv_g, EXP: resolvedSettings.exp, EXP_G: resolvedSettings.exp_g,
            ACA: resolvedSettings.aca, ACA_G: resolvedSettings.aca_g, SEC: resolvedSettings.sec, SEC_G: resolvedSettings.sec_g
        };
        Object.keys(settingsMap).forEach(function (key) {
            applyRate(key, settingsMap[key], !1);
        }), resolvedSettings.fy && (targetSalaryFy = String(resolvedSettings.fy)), resolvedSettings.fy && String(resolvedSettings.fy) !== String(requestedFy || "") && warnings.push("ใช้อัตราค่าตอบแทนปีงบประมาณ " + String(resolvedSettings.fy) + " แทนปี " + String(requestedFy || targetFy));
    }
    catch (settingsErr) {
        warnings.push("อ่านอัตราค่าตอบแทนสำรองไม่สำเร็จ: " + String(settingsErr && settingsErr.message || settingsErr));
    }
    Object.keys(rates).some(function (key) {
        return Number(rates[key] || 0) > 0;
    }) || warnings.push("ไม่พบข้อมูล SalarySettings/BudgetSalarySettings ที่มีอัตรามากกว่า 0");
    function rowSalary(row) {
        row = row || {};
        for (var raw = row.__raw && typeof row.__raw == "object" ? row.__raw : {}, keys = [
            "salaryAmount", "monthlySalary", "salary", "salaryBaht", "compensation", "amount", "rate", "monthlyRate", "allowance", "เงินเดือน (บาท)",
            "เงินเดือน", "เงินเดือนบาท", "ค่าตอบแทน", "ค่าตอบแทนรายเดือน", "จำนวนเงิน"
        ], i = 0; i < keys.length; i += 1) {
            var value = row[keys[i]];
            if (value != null && String(value).trim() !== "" && _b32N_(value) > 0 || (value = raw[keys[i]], value != null && String(value).trim() !== "" && _b32N_(value) > 0))
                return _b32N_(value);
        }
        return 0;
    }
    var keyMap = _salaryKeyMap_(), today = asOfDate || new Date, anchor = today < range.start ? range.start : today > range.end ? range.end : today, ytdEnd = anchor, monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1), monthEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 23, 59, 59, 999), monthlyBudget = _b32N_(rates.BUDGET), currentMonthlyExpense = 0, ytdExpense = 0, annualCommitment = 0, relevantCount = 0, usedSheetSalary = 0;
    rows.forEach(function (row) {
        row = row || {};
        var status = String(row.status || "").trim().toLowerCase();
        if (!(status && /พ้น|สิ้นสุด|ลาออก|ยกเลิก|เสียชีวิต|inactive|deleted/.test(status))) {
            var rowFy = _b32FY_(row.fy || ""), start = _budgetParsePersonnelDate_(row.startDate || row.วันที่เริ่มดำรงตำแหน่ง || row.วันที่แต่งตั้ง || "") || range.start, end = _budgetParsePersonnelDate_(row.endDate || row.วันที่พ้นตำแหน่ง || "") || range.end;
            if (!(rowFy && rowFy !== String(targetFy) && end < range.start) && !(end < range.start || start > range.end)) {
                var rawPosition = row.position || row.role || row.personnelType || "", position = _normalizePersonnelPosition_(rawPosition);
                if (!(!position || !AppDomain.BudgetSalaryRules.isSalaryRelevantPosition(rawPosition || position))) {
                    relevantCount += 1;
                    var mapped = keyMap[position], isGov = _resolveIsGovFlag_(row), salaryKey = mapped ? String(mapped[isGov] || mapped.n || mapped.g || "").trim().toUpperCase() : "", alternateKey = mapped ? String((isGov === "g" ? mapped.n : mapped.g) || mapped.n || mapped.g || "").trim().toUpperCase() : "", rate = _b32N_(salaryKey && rates[salaryKey] || alternateKey && rates[alternateKey] || 0);
                    if (rate || (rate = rowSalary(row), rate > 0 && (usedSheetSalary += 1)), !rate) {
                        warnings.push("ไม่พบอัตราค่าตอบแทนสำหรับ " + String(position || rawPosition));
                        return;
                    }
                    var ytdMonths = _budgetMonthOverlapCount_(start, end, range.start, ytdEnd), annualMonths = _budgetMonthOverlapCount_(start, end, range.start, range.end);
                    _budgetMonthOverlapCount_(start, end, monthStart, monthEnd) > 0 && (currentMonthlyExpense += rate), ytdExpense += rate * ytdMonths,
                        annualCommitment += rate * annualMonths;
                }
            }
        }
    }), !currentMonthlyExpense && relevantCount && warnings.push("คำนวณค่าบุคลากรรายเดือนได้ 0 ทั้งที่มีข้อมูลบุคลากร"), warnings = warnings.filter(function (value, index, arr) {
        return value && arr.indexOf(value) === index;
    }).slice(0, 20);
    var statusText = warnings.length ? currentMonthlyExpense || ytdExpense ? "partial" : "missing" : "ok";
    return {
        monthlyBudget: monthlyBudget || annualCommitment, monthlyRateTotal: currentMonthlyExpense, currentMonthlyExpense, ytdExpense, annualCommitment,
        amount: ytdExpense || currentMonthlyExpense, status: statusText, warnings, staffCount: rows.length, relevantCount, usedSheetSalary, resolvedRateFiscalYear: targetSalaryFy,
        requestedFiscalYear: requestedFy || String(targetFy || "")
    };
}
function _calculatePersonnelSalaryExpenseDetailed_(targetFy) {
    var r = _calculatePersonnelSalaryExpenseDetailedFull_(targetFy) || {};
    return r.amount = _b32N_(r.amount || r.ytdExpense || r.currentMonthlyExpense || 0), r.budget = _b32N_(r.budget || r.annualCommitment || 0),
        r.ytdExpense = _b32N_(r.ytdExpense || r.amount || 0), r.currentMonthlyExpense = _b32N_(r.currentMonthlyExpense || r.monthlyRateTotal || 0),
        r.monthlyRateTotal = _b32N_(r.monthlyRateTotal || r.currentMonthlyExpense || 0), r.annualCommitment = _b32N_(r.annualCommitment || r.budget || 0),
        r.warnings = _appArrayValue_(r.warnings), r.status = String(r.status || "ok"), r.source = String(r.source || "BudgetPersonnelExpenseReadModel"), r;
}
function _buildBudgetSummaryFromSheet_(fyValue) {
    fyValue = String(fyValue || "");
    var warnings = [], settings = getBudgetYearSettingsMatrix(fyValue), imports = listBudgetImportRecordsByFY(fyValue);
    if (!settings || !settings.ok)
        throw new Error(settings && (settings.msg || settings.error) || "โหลดการตั้งค่างบประมาณไม่สำเร็จ");
    var settingsRows = settings.data && settings.data.rows || settings.rows || [], importRows = imports && imports.data && imports.data.rows || imports.rows || [], summaryMap = {};
    function addSpentToSummary(key, amount, allocated, fieldName) {
        return key = String(key || ""), fieldName = String(fieldName || "rowAmount"), amount = _b32N_(amount), !!(key && amount && summaryMap[key]) && (!allocated || !allocated[fieldName]) && (summaryMap[key].spent += amount,
            summaryMap[key].remain = _b32N_(summaryMap[key].budget) - _b32N_(summaryMap[key].spent), allocated && (allocated[fieldName] = !0), !0);
    }
    settingsRows.forEach(function (r) {
        r = r || {};
        var plan = String(r.planGroup || r.category || r.plan || "").trim(), item = String(r.item || "").trim(), key;
        summaryMap[plan + "||" + item] = {
            fy: fyValue, planGroup: plan, category: plan, item, budget: _b32N_(r.budget), spent: 0, remain: _b32N_(r.budget)
        };
    }), importRows.forEach(function (r) {
        var ex = _budgetNormalizeImportCostPayload_(r = r || {}, warnings), rowAmount = _b32N_(ex.rowAmount || r.totalAmount || r.amount), category = String(r.category || r.planGroup || "").trim(), item = String(r.item || ex.supportType || r.entryType || "").trim(), allocated = {}, components = _budgetCostComponentsForRow_(r, ex, warnings), componentTotal = components.reduce(function (sum, component) {
            return sum + _b32N_(component && component.amount);
        }, 0);
        if (componentTotal && rowAmount && rowAmount > componentTotal + .01 && warnings.push("ยอดรวมมากกว่ายอดแยกหมวด " + String(r.id || r.topic || r.entryType || "") + ": total=" + rowAmount + ", components=" + componentTotal),
            !componentTotal)
            for (var exactKeys = [
                category + "||" + item, category + "||" + String(r.entryType || "").trim(), String(r.entryType || "").trim() + "||" + item
            ], ek = 0; ek < exactKeys.length; ek++)
                if (_budgetCanAllocateRowAmountToSummaryKey_(exactKeys[ek])) {
                    if (addSpentToSummary(exactKeys[ek], rowAmount, allocated, "rowAmount"))
                        return;
                }
                else
                    warnings.push("ไม่ใช้ totalAmount ลงหมวดรายจ่ายแบบ component: " + exactKeys[ek]);
        components.forEach(function (component) {
            if (!allocated[component.field]) {
                var bestKey = _budgetChooseBestSummaryKey_(summaryMap, component, r, ex);
                bestKey ? addSpentToSummary(bestKey, component.amount, allocated, component.field) : warnings.push("ไม่พบหมวดงบประมาณสำหรับ " + component.field + " ในรายการ " + String(r.id || r.topic || r.entryType || ""));
            }
        });
    });
    var staffExpenseInfo = _calculatePersonnelSalaryExpenseDetailed_(fyValue), staffAmount = _b32N_(staffExpenseInfo.amount), staffTouched = !1;
    Object.keys(summaryMap).forEach(function (k) {
        var keyText = String(k || "").toLowerCase();
        if (keyText.indexOf("บุคลากร") > -1 || keyText.indexOf("ค่าตอบแทน") > -1 || keyText.indexOf("ผู้ปฏิบัติงาน") > -1) {
            var existingAmount = _budgetCanonicalExpenseAmount_(summaryMap[k], summaryMap[k].extra || {}), effectiveAmount = staffAmount > 0 ? staffAmount : existingAmount;
            summaryMap[k].spent = effectiveAmount, summaryMap[k].spentAmount = effectiveAmount, summaryMap[k].expense = effectiveAmount, summaryMap[k].expenseAmount = effectiveAmount,
                summaryMap[k].totalPaid = effectiveAmount, summaryMap[k].totalSpent = effectiveAmount, summaryMap[k].personnelExpense = effectiveAmount,
                summaryMap[k].staffExpense = effectiveAmount, summaryMap[k].remain = _b32N_(summaryMap[k].budget) - effectiveAmount, summaryMap[k].balance = summaryMap[k].remain,
                summaryMap[k].isPersonnelCompensation = !0, staffTouched = !0;
        }
    }), !staffTouched && staffAmount > 0 && (summaryMap["แผนงานบุคลากรภาครัฐ||" + _budgetPersonnelCompensationLabel_()] = {
        fy: fyValue, planGroup: "แผนงานบุคลากรภาครัฐ", category: "แผนงานบุคลากรภาครัฐ", item: _budgetPersonnelCompensationLabel_(), budget: 0, spent: staffAmount,
        spentAmount: staffAmount, expense: staffAmount, expenseAmount: staffAmount, totalPaid: staffAmount, totalSpent: staffAmount, personnelExpense: staffAmount,
        staffExpense: staffAmount, remain: -staffAmount, balance: -staffAmount, isPersonnelCompensation: !0
    }), warnings = warnings.concat(staffExpenseInfo.warnings || []);
    var normalizedRows = _normalizeBudgetSummaryRows_(Object.keys(summaryMap).map(function (k) {
        return summaryMap[k];
    }), fyValue);
    !(normalizedRows = _budgetApplyStrictComponentSpentToRows_(normalizedRows, fyValue, warnings)).length && Array.isArray(importRows) && importRows.length && (normalizedRows = importRows.map(function (r) {
        var amount = _b32N_((r = r || {}).amount || r.totalAmount), label = String(r.entryType || r.topic || r.committeeType || "รายการงบประมาณ").trim();
        return {
            fy: fyValue, planGroup: label, category: label, item: String(r.topic || label).trim(), budget: amount, spent: amount, expense: amount, remain: 0,
            balance: 0
        };
    }));
    var meta = _budgetSetLastSummaryMeta_({
        fy: fyValue, warnings: warnings.filter(function (v, i, a) {
            return v && a.indexOf(v) === i;
        }), staffExpenseStatus: staffExpenseInfo.status || "unknown", staffExpense: _b32N_(staffExpenseInfo.amount), allocationMode: "exact-first-component-single-allocation"
    });
    try {
        normalizedRows._meta = meta;
    }
    catch (_eMeta) {
        _b32W_("ec", _eMeta);
    }
    return normalizedRows;
}
function _normalizeBudgetSummaryRows_(rows, fyValue) {
    function pickMoney(row, keys) {
        row = row || {};
        var sources = [
            row
        ], extra = row.extra;
        try {
            extra && typeof extra == "object" && !Array.isArray(extra) ? sources.push(extra) : String(extra || row.extraJson || row.payloadJson || "").trim().charAt(0) === "{" && sources.push(JSON.parse(String(extra || row.extraJson || row.payloadJson || "{}")));
        }
        catch (_extraErr) {
            _appIgnore_(_extraErr, "c6.C32:1252");
        }
        for (var best = 0, seen = !1, i = 0; i < keys.length; i++)
            for (var sIdx = 0; sIdx < sources.length; sIdx++) {
                var src = sources[sIdx] || {}, k = keys[i], v = null;
                if (src[k] != null && String(src[k]).trim() !== "")
                    v = src[k];
                else {
                    for (var nk = _budgetNormalizedLookupKey_(k), real = "", ks = Object.keys(src), n = 0; n < ks.length; n++)
                        if (String(ks[n] || "").replace(/[\s_\-()（）]/g, "").toLowerCase() === nk) {
                            real = ks[n];
                            break;
                        }
                    real && src[real] != null && String(src[real]).trim() !== "" && (v = src[real]);
                }
                if (v != null) {
                    var num = _b32N_(v);
                    if (seen = !0, num > 0)
                        return num;
                    best = num;
                }
            }
        return seen ? best : 0;
    }
    function pickRemain(row, budget, spent) {
        row = row || {};
        for (var keys = _B32REM, i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (row[k] != null && String(row[k]).trim() !== "")
                return _b32N_(row[k]);
        }
        return budget - spent;
    }
    return rows = _appArrayValue_(rows), fyValue = String(fyValue || ""), rows.filter(function (r) {
        return !_budgetIsActivityLeakRow_(r || {});
    }).map(function (r) {
        r = r || {};
        var planGroup = String(r.planGroup || r.category || r.plan || r.แผนงาน || r.หมวด || r.หมวดงบประมาณ || "").trim(), item = String(r.item || r.plan || r.name || r.label || r.title || r.รายการ || r.ชื่อรายการ || r.รายการงบประมาณ || "").trim(), isPersonnel = _budgetIsPersonnelBudgetRow_({
            planGroup, category: planGroup, item, label: item, name: item
        }), budget = pickMoney(r, _B32BUD), spent = isPersonnel ? pickMoney(r, [
            "personnelExpense", "staffExpense", "ytdExpense", "salaryExpense",
            "compensationExpense", "allowanceExpense", "currentMonthlyExpense", "monthlyRateTotal", "ค่าตอบแทน", "ค่าตอบแทนรวม", "เงินเดือน", "เงินเดือนรวม",
            "ค่าตอบแทนรายเดือน", "spent", "spentAmount", "expense", "expenseAmount", "totalExpense", "totalSpent", "totalPaid", "รายจ่าย", "รายจ่ายรวม",
            "จำนวนรายจ่าย"
        ]) : pickMoney(r, [
            "spent", "spentAmount", "expense", "expenseAmount", "totalExpense", "totalSpent", "totalPaid", "used", "usedAmount",
            "paid", "paidAmount", "actualAmount", "disbursement", "disbursed", "usedBudget", "ยอดใช้จ่าย", "รายจ่าย", "รายจ่ายรวม", "จำนวนรายจ่าย", "ค่าใช้จ่าย",
            "ค่าใช้จ่ายรวม", "เบิกจ่าย", "ยอดเบิกจ่าย", "totalAmount", "amount", "rowAmount", "จำนวนเงิน", "ยอดรวม", "รวมเป็นเงิน", "รวม"
        ]), remain = pickRemain(r, budget, spent);
        return {
            id: String(r.id || fyValue + "|" + planGroup + "|" + item), fy: fyValue, planGroup, category: planGroup, item, budget, totalBudget: budget,
            spent, spentAmount: spent, expense: spent, expenseAmount: spent, totalPaid: spent, totalSpent: spent, personnelExpense: isPersonnel ? spent : 0,
            staffExpense: isPersonnel ? spent : 0, remain, balance: remain, isPersonnelCompensation: isPersonnel || r.isPersonnelCompensation === !0
        };
    });
}
function _budgetPersonnelCompensationLabel_() {
    return "ค่าตอบแทนผู้ปฏิบัติงานให้คณะกรรมาธิการประจำสภาผู้แทนราษฎร";
}
function _calculatePersonnelSalaryExpenseDetailedFull_(targetFy) {
    var m;
    try {
        m = _budgetPersonnelExpenseReadModel_(targetFy) || {};
    }
    catch (e) {
        m = {
            amount: 0, budget: 0, currentMonthlyExpense: 0, ytdExpense: 0, annualCommitment: 0, monthlyRateTotal: 0, status: "error", source: "BudgetPersonnelExpenseReadModel",
            warnings: [
                String(e && e.message || e)
            ]
        };
    }
    m.amount = _b32N_(m.amount || m.ytdExpense || m.currentMonthlyExpense || 0), m.ytdExpense = _b32N_(m.ytdExpense || m.amount), m.currentMonthlyExpense = _b32N_(m.currentMonthlyExpense || m.monthlyRateTotal),
        m.monthlyRateTotal = _b32N_(m.monthlyRateTotal || m.currentMonthlyExpense), m.budget = _b32N_(m.budget || m.annualCommitment), m.annualCommitment = _b32N_(m.annualCommitment || m.budget),
        m.status = String(m.status || (m.amount > 0 ? "ok" : "missing")), m.source = String(m.source || "BudgetPersonnelExpenseReadModel"), m.warnings = _appArrayValue_(m.warnings);
    try {
        m.warnings.length && typeof logAudit_ == "function" && logAudit_("budget.personnelExpense.readModel.warning", {
            fy: targetFy, status: m.status, source: m.source, amount: m.amount, budget: m.budget, warnings: m.warnings.slice(0, 10)
        });
    }
    catch (e2) {
        _b32W_("budget.personnelExpense.audit", e2);
    }
    return m;
}
function _budgetIsPersonnelBudgetRow_(row) {
    row = row || {};
    var text = String([
        row.planGroup, row.category, row.plan, row.item, row.label, row.name
    ].filter(function (v) {
        return v != null && String(v).trim() !== "";
    }).join(" ")).replace(/\s+/g, " ").trim();
    if (!text)
        return !1;
    var compact = text.replace(/\s+/g, "");
    return compact.indexOf("แผนงานบุคลากรภาครัฐ") !== -1 || compact.indexOf("บุคลากรภาครัฐ") !== -1 || compact.indexOf("ค่าตอบแทนผู้ปฏิบัติงาน") !== -1 || compact.indexOf("ผู้ปฏิบัติงานให้คณะกรรมาธิการ") !== -1;
}
function _budgetActualComponentSpentByField_(fyValue, warnings) {
    fyValue = _b32FY_(fyValue) || _currentBudgetFyString_(), warnings = warnings || [];
    var sums = {
        meetingAllowance: 0, travelCost: 0, foodCost: 0, supportCost: 0, seminarCost: 0, foreignGuestCost: 0, receptionCost: 0, foreignTripCost: 0
    }, rows = [];
    try {
        rows = _budgetLiteRows_("BudgetImports") || [];
    }
    catch (_liteErr) {
        _recordWarning_("core.budget.summary.liteRows", _liteErr), rows = [];
    }
    if (!Array.isArray(rows) || !rows.length)
        try {
            var full = listBudgetImportRecordsByFY(fyValue);
            rows = full && full.data && full.data.rows || full.rows || [];
        }
        catch (_fullErr) {
            _recordWarning_("core.budget.summary.fullRows", _fullErr), rows = [];
        }
    return (_appArrayValue_(rows)).forEach(function (row) {
        var ex, comps;
        _budgetRowFyLite_(row = row || {}) !== fyValue && _b32FY_(row.fy) !== fyValue || row.isDeleted === !0 || String(row.isDeleted || "").toLowerCase() === "true" || String(row.deletedAt || "").trim() || _budgetCostComponentsForRow_(row, _budgetNormalizeImportCostPayload_(row, warnings), warnings).forEach(function (component) {
            var field = String(component && component.field || "");
            _appHasOwnProperty_(sums, field) && (sums[field] += _b32N_(component.amount));
        });
    }), sums;
}
function _budgetApplyStrictComponentSpentToRows_(rows, fyValue, warnings) {
    if (!(rows = _appArrayValue_(rows)).length)
        return rows;
    var sums = _budgetActualComponentSpentByField_(fyValue, warnings = warnings || []), touched = {};
    return rows.forEach(function (row) {
        if (row = row || {}, !_budgetIsPersonnelBudgetRow_(row)) {
            var key, field = _budgetStrictComponentFieldForSummaryKey_(((row.planGroup || row.category || row.plan || "") + "||" + (row.item || row.label || row.name || "")).trim());
            if (field && _appHasOwnProperty_(sums, field)) {
                var spent = _b32N_(sums[field]);
                row.spent = spent, row.expense = spent, row.remain = _b32N_(row.budget) - spent, row.balance = row.remain, touched[field] = !0;
            }
        }
    }), touched.supportCost && _b32N_(sums.supportCost) === 0 && warnings.push("ปรับรายจ่าย supportCost เป็น 0 จาก field จริงของ BudgetImports"),
        rows;
}
function _budgetDeriveGrandTotalsFromRows_(rows) {
    rows = _appArrayValue_(rows);
    var totals = {
        all: {
            budget: 0, spent: 0, remain: 0
        }, noPersonnel: {
            budget: 0, spent: 0, remain: 0
        }
    };
    return rows.forEach(function (r) {
        var budget = _b32N_((r = r || {}).budget), spent = _b32N_(r.spent != null ? r.spent : r.expense), remain = _b32N_(r.remain != null ? r.remain : budget - spent);
        totals.all.budget += budget, totals.all.spent += spent, totals.all.remain += remain, _budgetIsPersonnelBudgetRow_(r) || (totals.noPersonnel.budget += budget,
            totals.noPersonnel.spent += spent, totals.noPersonnel.remain += remain);
    }), totals.all.remain = totals.all.budget - totals.all.spent, totals.noPersonnel.remain = totals.noPersonnel.budget - totals.noPersonnel.spent,
        totals;
}
function _computeBudgetSummaryGrandTotals_(rows) {
    return _budgetDeriveGrandTotalsFromRows_(rows);
}

/* Canonical implementation lives in Code_34_Domain_Budget_ReadModels.gs. */

/* Canonical implementation lives in Code_35_Domain_Budget_Admin.gs. */

/* Canonical implementation lives in Code_36_Domain_Budget_Facade.gs. */
