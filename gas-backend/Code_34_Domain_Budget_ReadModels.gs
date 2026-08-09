/** Canonical — Budget read-model owner. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {}, AppDomain = __APP_GLOBAL__.AppDomain = __APP_GLOBAL__.AppDomain || {}, BudgetDomain = __APP_GLOBAL__.BudgetDomain = __APP_GLOBAL__.BudgetDomain || {};
/* --------------------------------------------------------------------------
 * 6. Central Budget DTO / Overview / Workflow / Report segments
 * -------------------------------------------------------------------------- */
function _budgetReadModelData_(res) {
    var cur = res, guard = 0;
    function isObj(v) {
        return v && typeof v === "object" && !Array.isArray(v);
    }
    function hasBudgetShape(v) {
        return isObj(v) && (Array.isArray(v.rows) || Array.isArray(v.byPlan) || Array.isArray(v.plans) ||
            Array.isArray(v.workflowRows) || Array.isArray(v.statusRows) || v.totalBudget != null ||
            v.totalPaid != null || v.totalRemain != null || v.totalRemaining != null || v.grandTotals ||
            v.totals || v.overviewSection || v.workflowSection || v.reportSection || v.segments ||
            v.statusSummary || v.workflowSummary || v.budgetWorkflow);
    }
    while (isObj(cur) && guard++ < 10) {
        if (hasBudgetShape(cur))
            break;
        if (isObj(cur.budgetStats)) {
            cur = cur.budgetStats;
            continue;
        }
        if (isObj(cur.dashboardBudget)) {
            cur = cur.dashboardBudget;
            continue;
        }
        if (isObj(cur.budget)) {
            cur = cur.budget;
            continue;
        }
        if (isObj(cur.dashboardDto) && isObj(cur.dashboardDto.budgetStats)) {
            cur = cur.dashboardDto.budgetStats;
            continue;
        }
        if (isObj(cur.dto) && isObj(cur.dto.budgetStats)) {
            cur = cur.dto.budgetStats;
            continue;
        }
        if (isObj(cur.result)) {
            cur = cur.result;
            continue;
        }
        if (isObj(cur.payload)) {
            cur = cur.payload;
            continue;
        }
        if (isObj(cur.value)) {
            cur = cur.value;
            continue;
        }
        if (isObj(cur.body)) {
            cur = cur.body;
            continue;
        }
        if (isObj(cur.data)) {
            cur = cur.data;
            continue;
        }
        break;
    }
    return isObj(cur) ? cur : {};
}
function _budgetReadModelRows_(data) {
    data = data || {};
    return Array.isArray(data.rows) ? data.rows : Array.isArray(data.items) ? data.items : Array.isArray(data.records) ? data.records : _appArrayValue_(data.data);
}
function _budgetReadModelWorkflowRows_(data) {
    data = data || {};
    var sources = [
        data.workflowRows,
        data.statusRows,
        data.workflowSection && data.workflowSection.rows,
        data.segments && data.segments.workflow && data.segments.workflow.rows,
        data.budgetWorkflowRows,
        data.importRows,
        data.details,
        data.items,
        data.records,
        data.rows,
        data.data
    ];
    for (var i = 0; i < sources.length; i += 1) {
        var rows = _appArrayValue_(sources[i]);
        if (rows.length)
            return _appArrayValue_(rows).filter(function (row) {
                if (!row || typeof row !== "object")
                    return false;
                if (_budgetNoWaitDeleted_(row))
                    return false;
                return true;
            });
    }
    return [];
}
function _budgetReadModelPickWorkflowStatus_(row, kind) {
    row = row || {};
    var keys = kind === "refund" ? [
        "refundStatus", "refund_status", "returnStatus", "return_status",
        "borrowReturnStatus", "moneyReturnStatus", "loanReturnStatus",
        "สถานะคืนเงิน", "สถานะการคืนเงิน", "การคืนเงิน", "คืนเงิน", "สถานะยืมเงิน"
    ] : [
        "reportStatus", "report_status", "expenseReportStatus", "expense_report_status",
        "expenseStatus", "reportSubmitStatus",
        "สถานะรายงาน", "สถานะรายงานค่าใช้จ่าย", "รายงานค่าใช้จ่าย", "การรายงาน", "รายงาน"
    ];
    for (var i = 0; i < keys.length; i += 1) {
        var key = keys[i];
        if (row[key] != null && String(row[key]).trim() !== "")
            return row[key];
    }
    return "";
}
function _budgetReadModelWorkflowSummaryFromRows_(rows) {
    var summary = {
        refund: {
            total: 0, pending: 0, completed: 0
        },
        report: {
            total: 0, pending: 0, completed: 0
        }
    };
    _appArrayValue_(rows).forEach(function (r) {
        r = r || {};
        var refundValue = _budgetReadModelPickWorkflowStatus_(r, "refund");
        var reportValue = _budgetReadModelPickWorkflowStatus_(r, "report");
        // Rows without explicit status still count as workflow records, but they are
        // treated as pending only after write/read normalization fails to provide a
        // concrete status. This keeps the workflow visible without falsely marking
        // a row as completed.
        summary.refund.total += 1;
        summary.report.total += 1;
        _budgetStatusDone_(refundValue, "refund") ? summary.refund.completed += 1 : summary.refund.pending += 1;
        _budgetStatusDone_(reportValue, "report") ? summary.report.completed += 1 : summary.report.pending += 1;
    });
    return summary;
}
function _budgetReadModelFindPersonnelRow_(rows) {
    rows = _appArrayValue_(rows);
    for (var i = 0; i < rows.length; i += 1)
        if (_budgetIsPersonnelCompensationTypeRow_(rows[i]) || _budgetIsPersonnelBudgetRow_(rows[i]))
            return rows[i];
    return null;
}
function _budgetReadModelTotalsHaveData_(totals, data) {
    data = data || {};
    totals = totals || {};
    var all = totals.all || totals || {};
    return !!(Number(all.budget || all.totalBudget || data.totalBudget || 0) || Number(all.spent || all.totalPaid || data.totalPaid || 0) || Number(all.remain || all.totalRemain || data.totalRemain || 0));
}
function _budgetReadModelVisibleRows_(dto, kind) {
    var rows = _budgetReadModelRows_(dto || {}), report = kind === "report";
    return rows.filter(function (r) {
        r = r || {};
        var textValue = report ? r.item || r.topic || r.name || r.label || r.category || r.planGroup : r.planGroup || r.plan || r.category || r.item || r.label;
        var numericValue = report ? r.spent || r.expense || r.totalPaid || r.budget || r.totalBudget || r.remain : r.budget || r.totalBudget || r.spent || r.totalPaid || r.remain || r.totalRemain;
        return !!(String(textValue || "").trim() || Number(numericValue || 0));
    });
}
function _budgetReadModelOverviewRows_(dto) {
    return _budgetReadModelVisibleRows_(dto, "overview");
}
function _budgetReadModelReportRows_(dto) {
    return _budgetReadModelVisibleRows_(dto, "report");
}
function _budgetReadModelHasOverview_(dto) {
    dto = dto || {};
    var totals = dto.grandTotals || dto.totals || {};
    return !!(_budgetReadModelOverviewRows_(dto).length || _budgetReadModelTotalsHaveData_(totals, dto));
}
function _budgetReadModelHasWorkflow_(dto) {
    dto = dto || {};
    var workflowSummary = dto.statusSummary || dto.workflow || dto.budgetWorkflow || dto.workflowSummary || {}, workflowRows = _budgetReadModelWorkflowRows_(dto);
    return !!(workflowRows.length || _dashboardBudgetWorkflowSummaryHasData_(workflowSummary));
}
function _budgetReadModelHasReport_(dto) {
    dto = dto || {};
    return !!(_budgetReadModelReportRows_(dto).length || Number(dto.totalRecords || 0));
}
function _budgetReadModelSegments_(dto) {
    dto = dto || {};
    var totals = dto.grandTotals || dto.totals || {}, overviewRows = _budgetReadModelOverviewRows_(dto), workflowRows = _budgetReadModelWorkflowRows_(dto), reportRows = _budgetReadModelReportRows_(dto), workflowSummary = dto.statusSummary || dto.workflow || dto.budgetWorkflow || dto.workflowSummary || {};
    return {
        overview: {
            kind: "overview", hasData: _budgetReadModelHasOverview_(dto), rows: overviewRows, totals: totals, totalBudget: Number((totals.all || totals || {}).budget || (totals.all || totals || {}).totalBudget || dto.totalBudget || 0) || 0, totalPaid: Number((totals.all || totals || {}).spent || (totals.all || totals || {}).totalPaid || dto.totalPaid || 0) || 0, totalRemain: Number((totals.all || totals || {}).remain || (totals.all || totals || {}).totalRemain || dto.totalRemain || 0) || 0
        }, workflow: {
            kind: "workflow", hasData: _budgetReadModelHasWorkflow_(dto), rows: workflowRows, summary: workflowSummary
        }, report: {
            kind: "report", hasData: _budgetReadModelHasReport_(dto), rows: reportRows, totalRecords: Number(dto.totalRecords || reportRows.length || 0) || 0
        }
    };
}
function _budgetReadModelDataCompleteness_(dto) {
    dto = dto || {};
    var segments = _budgetReadModelSegments_(dto);
    return {
        overview: segments.overview.hasData, workflow: segments.workflow.hasData, report: segments.report.hasData, overviewRows: segments.overview.rows.length,
        workflowRows: segments.workflow.rows.length, reportRows: segments.report.rows.length, owner: "BudgetReadModel.segmentCompleteness.r77"
    };
}
function _budgetReadModelBuildSummaryDto_(payload, opts) {
    payload = payload || {};
    opts = opts || {};
    var requestedFy = _b32FY_(_budgetCanonicalPayloadFy_(payload) || payload.fy || payload.fiscalYear || payload.year) || _budgetNoWaitNormalizeFy_(payload), fy = _b32FY_(opts.fy || requestedFy) || requestedFy, allRows = opts.rows ? _appArrayValue_(opts.rows) : _budgetNoWaitSummaryRows_(fy, payload), fallbackFy = "";
    opts.ensurePersonnel === !1 || (allRows = _budgetNoWaitEnsurePersonnelRow_(allRows, fy));
    if (!allRows.length && payload.strictFy !== !0 && payload.exactFy !== !0) {
        try {
            fallbackFy = _latestAvailableBudgetFy_() || _resolveBudgetDefaultFiscalYear_() || "";
        }
        catch (_dtoFyErr) {
            fallbackFy = "";
        }
        fallbackFy = _b32FY_(fallbackFy);
        if (fallbackFy && fallbackFy !== fy) {
            var fallbackRows = opts.rows ? _appArrayValue_(opts.rows) : _budgetNoWaitSummaryRows_(fallbackFy, payload);
            opts.ensurePersonnel === !1 || (fallbackRows = _budgetNoWaitEnsurePersonnelRow_(fallbackRows, fallbackFy));
            if (fallbackRows.length) {
                fy = fallbackFy;
                allRows = fallbackRows;
            }
        }
    }
    var limit = Number(payload.limit || payload.pageSize || opts.limit || 20) || 20, paged = _budgetNoWaitPaged_(allRows, payload, limit, 500), grandTotals = opts.grandTotals || _budgetNoWaitTotals_(allRows), pageTotals = opts.pageTotals || _budgetNoWaitTotals_(paged.rows), workflowRows = opts.workflowRows && opts.workflowRows.length ? _appArrayValue_(opts.workflowRows) : _dashboardBudgetStatusSummaryRows_(fy), workflowSummary = opts.statusSummary || opts.workflow || opts.budgetWorkflow || opts.workflowSummary || {};
    _dashboardBudgetWorkflowSummaryHasData_(workflowSummary) || (workflowSummary = _budgetReadModelWorkflowSummaryFromRows_(workflowRows));
    var personnelExpenseRow = opts.personnelExpenseRow || _budgetReadModelFindPersonnelRow_(allRows), dto = {
        rows: paged.rows, data: paged.rows, items: paged.rows, records: paged.rows, fy: fy, fiscalYear: fy, requestedFy: requestedFy, resolvedFy: fy,
        fallbackFyUsed: !!(requestedFy && fy !== requestedFy), totalRecords: paged.totalRecords, total: paged.totalRecords, totalPages: paged.totalPages,
        page: paged.page, limit: paged.limit, pageSize: paged.limit, grandTotals: grandTotals, totals: grandTotals, pageTotals: pageTotals, statusSummary: workflowSummary,
        workflow: workflowSummary, budgetWorkflow: workflowSummary, workflowSummary: workflowSummary, workflowRows: workflowRows, statusRows: workflowRows,
        personnelExpenseRow: personnelExpenseRow, includePersonnelCompensation: opts.includePersonnelCompensation !== !1, sourceOfTruth: opts.sourceOfTruth || "BudgetImports",
        editSource: opts.editSource || "BudgetImports", loadOk: !0, contractStamp: opts.contractStamp || "budget-summary-central-dto-r77"
    };
    dto.segments = _budgetReadModelSegments_(dto);
    dto.overviewSection = dto.segments.overview;
    dto.workflowSection = dto.segments.workflow;
    dto.reportSection = dto.segments.report;
    var completeness = _budgetReadModelDataCompleteness_(dto);
    dto.dataCompleteness = completeness;
    dto.meta = _appAssignObjects_({}, opts.meta || {}, {
        fy: fy, requestedFy: requestedFy, resolvedFy: fy, fallbackFyUsed: dto.fallbackFyUsed, source: opts.source || "BudgetReadModel.centralDTO.r77",
        sourceOfTruth: dto.sourceOfTruth, dataSource: opts.dataSource || "centralBudgetDTO", readModelOwner: "Code_32_Domain_Budget.BudgetReadModel.centralDTO",
        segmentOwner: "BudgetReadModel.overviewWorkflowReport.r77", fast: !0, cacheHit: !1, warnings: [], noWait: !0, personnelExpenseIncluded: !!personnelExpenseRow,
        personnelExpenseSource: personnelExpenseRow && personnelExpenseRow.__budgetPersonnelExpenseSource || "", overviewRows: completeness.overviewRows,
        workflowRows: workflowRows.length, reportRows: completeness.reportRows, dataCompleteness: completeness
    });
    return dto;
}
function _budgetReadModelDashboardPayload_(res, fy, startedAt, sourceMeta) {
    var data = _budgetReadModelData_(res), rows = _budgetReadModelRows_(data), totals = data.grandTotals || data.totals || {}, all = totals.all || totals || {}, plans = rows.map(function (r) {
        return r = r || {}, {
            fy: String(r.fy || fy || data.fy || ""), plan: String(r.planGroup || r.plan || r.category || "").trim() || "-", label: String(r.planGroup || r.plan || r.category || "").trim() || "-",
            item: String(r.item || r.planGroup || r.plan || r.category || "").trim() || "-", budget: _b32N_(r.budget != null ? r.budget : r.totalBudget),
            spent: _b32N_(r.spent != null ? r.spent : r.expense != null ? r.expense : r.totalPaid != null ? r.totalPaid : r.totalSpent), remain: _b32N_(r.remain != null ? r.remain : r.balance != null ? r.balance : _b32N_(r.budget != null ? r.budget : r.totalBudget) - _b32N_(r.spent != null ? r.spent : r.expense != null ? r.expense : r.totalPaid))
        };
    }), workflowRows = _budgetReadModelWorkflowRows_(data), workflowSummary = data.statusSummary || data.workflow || data.budgetWorkflow || data.workflowSummary || {};
    _dashboardBudgetWorkflowSummaryHasData_(workflowSummary) || (workflowSummary = _budgetReadModelWorkflowSummaryFromRows_(workflowRows));
    var payload = {
        fy: String(data.fy || data.resolvedFy || fy || ""), requestedFy: String(data.requestedFy || fy || ""), resolvedFy: String(data.resolvedFy || data.fy || fy || ""),
        fallbackFyUsed: data.fallbackFyUsed === !0, totalBudget: _b32N_(all.budget != null ? all.budget : all.totalBudget != null ? all.totalBudget : data.totalBudget),
        totalPaid: _b32N_(all.spent != null ? all.spent : all.totalPaid != null ? all.totalPaid : data.totalPaid), totalRemain: _b32N_(all.remain != null ? all.remain : all.totalRemain != null ? all.totalRemain : data.totalRemain != null ? data.totalRemain : 0),
        plans: plans, byPlan: plans, rows: plans, details: plans, totals: totals, statusSummary: workflowSummary, workflow: workflowSummary, budgetWorkflow: workflowSummary,
        workflowSummary: workflowSummary, workflowRows: workflowRows, statusRows: workflowRows, meta: _appAssignObjects_({}, data.meta || {}, sourceMeta || {}, {
            source: "BudgetReadModel.centralDTO.dashboardPayload.r77", readModelOwner: "Code_32_Domain_Budget.BudgetReadModel.centralDTO", dashboardBudgetOwner: "BudgetReadModel.centralDTO",
            phaseESeparateBudgetHydration: !1, dashboardBudgetIntegrated: !0, cacheEmptySkipped: !plans.length && !_b32N_(all.budget || all.spent || all.remain), durationMs: Math.max(0, Date.now() - Number(startedAt || Date.now()))
        })
    };
    payload.segments = _budgetReadModelSegments_(_appAssignObjects_({}, data, {
        rows: plans, grandTotals: totals, statusSummary: workflowSummary, workflowRows: workflowRows
    }));
    payload.overviewSection = payload.segments.overview;
    payload.workflowSection = payload.segments.workflow;
    payload.reportSection = payload.segments.report;
    payload.meta.dataCompleteness = _budgetReadModelDataCompleteness_(_appAssignObjects_({}, data, {
        rows: plans, grandTotals: totals, statusSummary: workflowSummary, workflowRows: workflowRows
    }));
    payload.meta.segmentOwner = "BudgetReadModel.dashboardPayload.overviewWorkflowReport.r77";
    return !payload.totalRemain && (payload.totalBudget || payload.totalPaid) && (payload.totalRemain = payload.totalBudget - payload.totalPaid),
        _applyDashboardBudgetStatusSummary_(payload, payload.fy || fy || "");
}
function _budgetSummaryResultHasData_(res) {
    try {
        var data = _budgetReadModelData_(res), comp = _budgetReadModelDataCompleteness_(data);
        return !!(comp.overview || comp.workflow || comp.report);
    }
    catch (_budgetHasDataErr) {
        return !1;
    }
}
function _budgetDashboardPayloadFromSummaryResult_(res, fy, startedAt, sourceMeta) {
    return _budgetReadModelDashboardPayload_(res, fy, startedAt, sourceMeta);
}
function _budgetCompactDashboardPayload_(dashboardPayload, payload) {
    dashboardPayload = dashboardPayload || {};
    payload = payload || {};
    var planLimit = Math.max(10, Math.min(Number(payload.budgetPlanLimit || payload.limit || 50) || 50, 100));
    var workflowLimit = Math.max(20, Math.min(Number(payload.dashboardWorkflowLimit || 100) || 100, 200));
    ["plans", "byPlan", "rows", "details"].forEach(function (key) {
        Array.isArray(dashboardPayload[key]) && (dashboardPayload[key] = dashboardPayload[key].slice(0, planLimit));
    });
    ["workflowRows", "statusRows"].forEach(function (key) {
        Array.isArray(dashboardPayload[key]) && (dashboardPayload[key] = dashboardPayload[key].slice(0, workflowLimit));
    });
    dashboardPayload.overviewSection && Array.isArray(dashboardPayload.overviewSection.rows) && (dashboardPayload.overviewSection.rows = dashboardPayload.overviewSection.rows.slice(0, planLimit));
    dashboardPayload.workflowSection && Array.isArray(dashboardPayload.workflowSection.rows) && (dashboardPayload.workflowSection.rows = dashboardPayload.workflowSection.rows.slice(0, workflowLimit));
    dashboardPayload.reportSection && Array.isArray(dashboardPayload.reportSection.rows) && (dashboardPayload.reportSection.rows = dashboardPayload.reportSection.rows.slice(0, planLimit));
    dashboardPayload.meta = _appAssignObjects_({}, dashboardPayload.meta || {}, {
        dashboardBudgetIntegrated: !0,
        phaseESeparateBudgetHydration: !1,
        dashboardSingleCompletePath: payload.__dashboardSingleCompletePath === !0,
        compactDashboardPayload: !0,
        planLimit: planLimit,
        workflowLimit: workflowLimit
    });
    return dashboardPayload;
}

var PERFORMANCE_F_BUDGET_HOT_PATH_STAMP = "budget-dashboard-materialized-hot-path-r161";
function _budgetDashboardHotSummaryFields_() {
    return [
        "id", "ID", "fy", "FY", "fiscalYear", "budgetFy", "budgetYear", "year", "ปีงบประมาณ", "ปีงบ",
        "planGroup", "plan", "category", "item", "name", "label", "title", "แผนงาน", "หมวด", "หมวดงบประมาณ", "รายการ", "ชื่อรายการ", "รายการงบประมาณ",
        "budget", "totalBudget", "amountBudget", "budgetAmount", "annualBudget", "วงเงินงบประมาณ", "งบประมาณ", "งบประมาณที่ได้รับ", "งบประมาณรวม",
        "spent", "spentAmount", "expense", "expenseAmount", "totalExpense", "totalSpent", "totalPaid", "used", "usedAmount", "paid", "paidAmount", "actualAmount",
        "disbursement", "disbursed", "usedBudget", "personnelExpense", "staffExpense", "รายจ่าย", "รายจ่ายรวม", "ยอดใช้จ่าย", "ค่าใช้จ่าย", "ค่าใช้จ่ายรวม", "เบิกจ่าย", "ยอดเบิกจ่าย",
        "remain", "balance", "remaining", "คงเหลือ", "งบประมาณคงเหลือ", "updatedAt", "createdAt", "isDeleted", "deleted", "deletedAt"
    ];
}
function _budgetDashboardHotWorkflowFields_() {
    return [
        "fy", "FY", "fiscalYear", "budgetFy", "budgetYear", "year", "ปีงบประมาณ", "ปีงบ",
        "refundStatus", "refund_status", "returnStatus", "return_status", "สถานะคืนเงิน", "สถานะการคืนเงิน",
        "reportStatus", "report_status", "expenseReportStatus", "expense_report_status", "สถานะรายงาน", "สถานะรายงานค่าใช้จ่าย",
        "updatedAt", "createdAt", "isDeleted", "deleted", "deletedAt"
    ];
}
function _budgetDashboardHotFy_(payload, summaryRows) {
    var explicit = _budgetCanonicalPayloadFy_(payload || {});
    if (explicit)
        return explicit;
    var current = _currentBudgetFyString_();
    var years = {};
    (_appArrayValue_(summaryRows)).forEach(function (row) {
        var fy = _b32FY_(_budgetTypeSummaryPick_(row || {}, _B32FY));
        fy && (years[fy] = !0);
    });
    if (current && years[current])
        return current;
    var list = Object.keys(years).sort(function (a, b) { return Number(b || 0) - Number(a || 0); });
    return list[0] || current || "";
}
function _budgetDashboardHotWorkflow_(rows, fy) {
    var compactRows = [], summary = { refund: { total: 0, pending: 0, completed: 0 }, report: { total: 0, pending: 0, completed: 0 } };
    (_appArrayValue_(rows)).forEach(function (row) {
        row = row || {};
        var rowFy = _budgetRowFyLite_(row);
        if (fy && rowFy && rowFy !== fy)
            return;
        var refund = String(row.refundStatus || row.refund_status || row.returnStatus || row.return_status || row["สถานะคืนเงิน"] || row["สถานะการคืนเงิน"] || "ยังไม่คืนเงิน");
        var report = String(row.reportStatus || row.report_status || row.expenseReportStatus || row.expense_report_status || row["สถานะรายงาน"] || row["สถานะรายงานค่าใช้จ่าย"] || "ยังไม่รายงาน");
        summary.refund.total += 1;
        summary.report.total += 1;
        _budgetStatusDone_(refund, "refund") ? summary.refund.completed += 1 : summary.refund.pending += 1;
        _budgetStatusDone_(report, "report") ? summary.report.completed += 1 : summary.report.pending += 1;
        compactRows.push({ fy: rowFy || fy || "", refundStatus: refund, reportStatus: report });
    });
    return { rows: compactRows, summary: summary };
}
function _budgetDashboardMaterializedHot_(payload) {
    payload = payload || {};
    var startedAt = Date.now(), ttl = Math.max(30, Math.min(Number(payload.cacheTtlSeconds || 240) || 240, 600));
    var summaryRows = _budgetDataServiceRows_("BudgetSummary", _budgetDashboardHotSummaryFields_(), {
        includeDeleted: !1,
        requireCanonical: !1,
        ttl: ttl,
        sparseRead: !0,
        projectedReadMode: "bounded-sparse-spans",
        maxColumnSpans: 4,
        allowEmpty: !0
    }) || [];
    if (!summaryRows.length)
        return null;
    var fy = _budgetDashboardHotFy_(payload, summaryRows);
    var plans = summaryRows.filter(function (row) {
        var rowFy = _b32FY_(_budgetTypeSummaryPick_(row || {}, _B32FY));
        return !fy || !rowFy || rowFy === fy;
    }).map(function (row) {
        return _budgetBudgetSummaryRowToDto_(row, fy);
    }).filter(function (row) {
        return row && (row.planGroup || row.item || row.budget || row.spent || row.remain);
    });
    if (!plans.length)
        return null;
    var workflowRowsRaw = _budgetDataServiceRows_("BudgetImports", _budgetDashboardHotWorkflowFields_(), {
        includeDeleted: !1,
        requireCanonical: !1,
        ttl: ttl,
        sparseRead: !0,
        projectedReadMode: "bounded-sparse-spans",
        maxColumnSpans: 4,
        allowEmpty: !0
    }) || [];
    function latestMillis(rows) {
        return (_appArrayValue_(rows)).reduce(function (maxValue, row) {
            var raw = row && (row.updatedAt || row.createdAt) || "", d = _budgetParseDate_(raw), value = d && d.getTime ? d.getTime() : 0;
            return value > maxValue ? value : maxValue;
        }, 0);
    }
    var summaryUpdatedAt = latestMillis(summaryRows), importsUpdatedAt = latestMillis(workflowRowsRaw);
    if (importsUpdatedAt && (!summaryUpdatedAt || importsUpdatedAt > summaryUpdatedAt + 1000))
        return null;
    var workflow = _budgetDashboardHotWorkflow_(workflowRowsRaw, fy);
    var totals = plans.reduce(function (out, row) {
        out.budget += _b32N_(row && row.budget);
        out.spent += _b32N_(row && row.spent);
        out.remain += _b32N_(row && row.remain);
        return out;
    }, { budget: 0, spent: 0, remain: 0 });
    var planLimit = Math.max(10, Math.min(Number(payload.budgetPlanLimit || payload.limit || 50) || 50, 100));
    var workflowLimit = Math.max(20, Math.min(Number(payload.dashboardWorkflowLimit || 100) || 100, 200));
    plans = plans.slice(0, planLimit);
    var dto = {
        fy: fy,
        requestedFy: _budgetCanonicalPayloadFy_(payload || {}),
        resolvedFy: fy,
        fallbackFyUsed: !!(_budgetCanonicalPayloadFy_(payload || {}) && _budgetCanonicalPayloadFy_(payload || {}) !== fy),
        totalBudget: totals.budget,
        totalPaid: totals.spent,
        totalRemain: totals.remain,
        plans: plans,
        byPlan: plans,
        rows: plans,
        details: plans,
        grandTotals: { all: totals },
        totals: { all: totals },
        statusSummary: workflow.summary,
        workflow: workflow.summary,
        budgetWorkflow: workflow.summary,
        workflowSummary: workflow.summary,
        workflowRows: workflow.rows.slice(0, workflowLimit),
        statusRows: workflow.rows.slice(0, workflowLimit),
        meta: {
            source: PERFORMANCE_F_BUDGET_HOT_PATH_STAMP,
            readModelOwner: "Code_32_Domain_Budget.BudgetSummary",
            sourceOfTruth: "BudgetImports",
            materializedReadModel: "BudgetSummary",
            dashboardBudgetIntegrated: !0,
            dashboardSingleCompletePath: !0,
            budgetHotPathHit: !0,
            durationMs: Math.max(0, Date.now() - startedAt),
            summaryRowsRead: summaryRows.length,
            workflowRowsRead: workflowRowsRaw.length,
            summaryUpdatedAtMs: summaryUpdatedAt,
            importsUpdatedAtMs: importsUpdatedAt,
            freshnessVerified: !!(summaryUpdatedAt && importsUpdatedAt)
        }
    };
    dto.segments = _budgetReadModelSegments_(_appAssignObjects_({}, dto, { rows: plans, workflowRows: dto.workflowRows }));
    dto.overviewSection = dto.segments.overview;
    dto.workflowSection = dto.segments.workflow;
    dto.reportSection = dto.segments.report;
    dto.meta.dataCompleteness = _budgetReadModelDataCompleteness_(dto);
    return _budgetCompactDashboardPayload_(dto, payload);
}
function _budgetGetDashboardSummaryForDashboardCore_(payload, trustedSession) {
    var auth;
    if (trustedSession && typeof trustedSession == "object") {
        auth = { ok: !0, payload: _appAssignObjects_({}, payload || {}), session: trustedSession };
    }
    else {
        auth = _bSafeReq_(payload || {}, "viewer", "apiBudgetGetSummary");
    }
    if (!auth.ok)
        return auth.result;
    payload = auth.payload || {};
    var startedAt = Date.now(), policy = _budgetCachePolicy_(payload, "dashboard"), explicitFy = _b32FY_(payload.fy || payload.fiscalYear || payload.year), initialFy = explicitFy || _currentBudgetFyString_(), cache = _AppScriptCache_();
    var initialCacheKey = _dashboardBudgetCacheKey_(initialFy);
    if (policy.allowRead)
        try {
            var initialCached = cache.get(initialCacheKey);
            if (initialCached) {
                var initialRaw = JSON.parse(initialCached), initialStatus = initialRaw && (initialRaw.statusSummary || initialRaw.workflow || initialRaw.workflowSummary || initialRaw.budgetWorkflow) || {}, initialHasWorkflow = _dashboardBudgetWorkflowSummaryHasData_(initialStatus) || (_appArrayValue_(initialRaw && (initialRaw.workflowRows || initialRaw.statusRows))).length > 0;
                var initialParsed = _budgetCompactDashboardPayload_(initialHasWorkflow ? initialRaw : _applyDashboardBudgetStatusSummary_(initialRaw, initialFy), payload);
                if (_dashboardBudgetHasData_(initialParsed) && _budgetCachePolicyCanStoreSummary_(initialParsed, payload, "dashboard")) {
                    initialParsed.meta = _budgetCachePolicyMeta_(_appAssignObjects_({}, initialParsed.meta || {}, {
                        cacheHit: !0,
                        cacheStatus: "hit",
                        dataSource: "dashboardBudgetCache.performanceF.r161",
                        source: "BudgetDomain.getDashboardSummaryForDashboard.performanceF.cache",
                        readModelOwner: "Code_32_Domain_Budget.BudgetDomain",
                        phaseESeparateBudgetHydration: !1,
                        dashboardBudgetIntegrated: !0,
                        durationMs: Math.max(0, Date.now() - startedAt),
                        rowsRead: 0,
                        budgetHotPathHit: !!(initialParsed.meta && initialParsed.meta.budgetHotPathHit)
                    }), policy, { status: "hit" });
                    return ok_(initialParsed, "โหลดสรุปงบประมาณ Dashboard จาก cache สำเร็จ");
                }
            }
        }
        catch (_initialCacheErr) {
            _b32W_("budget.dashboard.performanceF.cache.read", _initialCacheErr, { fy: initialFy });
        }
    try {
        var hotPayload = _budgetDashboardMaterializedHot_(payload);
        if (hotPayload && _dashboardBudgetHasData_(hotPayload)) {
            var hotFy = _b32FY_(hotPayload.fy || initialFy), hotKey = _dashboardBudgetCacheKey_(hotFy);
            hotPayload.meta = _budgetCachePolicyMeta_(_appAssignObjects_({}, hotPayload.meta || {}, {
                cacheHit: !1,
                cacheStatus: "fresh-hot",
                source: PERFORMANCE_F_BUDGET_HOT_PATH_STAMP,
                durationMs: Math.max(0, Date.now() - startedAt),
                budgetHotPathHit: !0
            }), policy, { status: "fresh-hot" });
            try {
                _budgetCachePolicyCanStoreSummary_(hotPayload, payload, "dashboard") && safeCachePut_(cache, hotKey, hotPayload, policy.ttlSeconds);
            }
            catch (_hotCacheWriteErr) {
                _b32W_("budget.dashboard.performanceF.cache.write", _hotCacheWriteErr, { fy: hotFy });
            }
            return ok_(hotPayload, "โหลดสรุปงบประมาณ Dashboard จาก read model สำเร็จ");
        }
    }
    catch (_hotPathErr) {
        _b32W_("budget.dashboard.performanceF.hotPath", _hotPathErr, { fy: initialFy });
    }
    var seenFy = {}, candidateYears = [initialFy].filter(function (fy2) {
        fy2 = _b32FY_(fy2);
        return !!fy2 && !seenFy[fy2] && (seenFy[fy2] = !0);
    });
    candidateYears.length || (candidateYears = [_currentBudgetFyString_()].filter(Boolean));
    for (var ci = 0; ci < candidateYears.length; ci += 1) {
        var fy = _b32FY_(candidateYears[ci]), cacheKey = _dashboardBudgetCacheKey_(fy);
        var summaryPayload = _appAssignObjects_({}, payload, {
            fy: fy,
            fiscalYear: fy,
            year: fy,
            includeWorkflow: !0,
            limit: Math.max(10, Math.min(Number(payload.limit || payload.pageSize || 50) || 50, 100)),
            pageSize: Math.max(10, Math.min(Number(payload.limit || payload.pageSize || 50) || 50, 100)),
            cacheTtlSeconds: policy.ttlSeconds,
            source: String(payload.source || "dashboard-budget-performanceF-fallback-r161")
        });
        var summaryRes = BudgetDomain && typeof BudgetDomain.getSummary == "function" ? BudgetDomain.getSummary(summaryPayload) : _budgetGetSummaryDomainOwner_(summaryPayload);
        var dashboardPayload = _budgetDashboardPayloadFromSummaryResult_(summaryRes, fy, startedAt, {
            summaryOk: (summaryRes && summaryRes.ok) !== !1,
            summarySource: summaryRes && summaryRes.meta && summaryRes.meta.source || summaryRes && summaryRes.data && summaryRes.data.meta && summaryRes.data.meta.source || "BudgetDomain.getSummary",
            cachePolicyStamp: BUDGET_CACHE_POLICY_STAMP,
            budgetHotPathHit: !1,
            performanceFFallback: !0
        });
        dashboardPayload = _budgetCompactDashboardPayload_(dashboardPayload, payload);
        if (_dashboardBudgetHasData_(dashboardPayload)) {
            try {
                _budgetCachePolicyCanStoreSummary_(dashboardPayload, payload, "dashboard") && safeCachePut_(cache, cacheKey, dashboardPayload, policy.ttlSeconds);
            }
            catch (_cacheWriteErr) {
                _b32W_("budget.dashboard.performanceF.fallback.cache.write", _cacheWriteErr, { fy: fy });
            }
            dashboardPayload.meta = _budgetCachePolicyMeta_(_appAssignObjects_({}, dashboardPayload.meta || {}, {
                budgetHotPathHit: !1,
                performanceFFallback: !0,
                durationMs: Math.max(0, Date.now() - startedAt)
            }), policy, { status: "fresh-fallback" });
            return ok_(dashboardPayload, "โหลดสรุปงบประมาณ Dashboard สำเร็จ");
        }
    }
    if (!explicitFy) {
        var extraYears = _budgetFyCandidatesFromData_() || [];
        for (var ei = 0; ei < extraYears.length; ei += 1) {
            var extraFy = _b32FY_(extraYears[ei]);
            if (!extraFy || seenFy[extraFy])
                continue;
            seenFy[extraFy] = !0;
            var extraPayload = _appAssignObjects_({}, payload, { fy: extraFy, fiscalYear: extraFy, year: extraFy, includeWorkflow: !0, limit: 50, pageSize: 50, cacheTtlSeconds: policy.ttlSeconds, source: "dashboard-budget-performanceF-latest-fallback-r161" });
            var extraRes = BudgetDomain && typeof BudgetDomain.getSummary == "function" ? BudgetDomain.getSummary(extraPayload) : _budgetGetSummaryDomainOwner_(extraPayload);
            var extraDashboard = _budgetCompactDashboardPayload_(_budgetDashboardPayloadFromSummaryResult_(extraRes, extraFy, startedAt, { performanceFFallback: !0, latestFyFallback: !0 }), payload);
            if (_dashboardBudgetHasData_(extraDashboard)) {
                extraDashboard.meta = _budgetCachePolicyMeta_(_appAssignObjects_({}, extraDashboard.meta || {}, { budgetHotPathHit: !1, performanceFFallback: !0, latestFyFallback: !0, durationMs: Math.max(0, Date.now() - startedAt) }), policy, { status: "fresh-latest-fallback" });
                return ok_(extraDashboard, "โหลดสรุปงบประมาณ Dashboard สำเร็จ");
            }
        }
    }
    var emptyFy = candidateYears[0] || _currentBudgetFyString_(), empty = _applyDashboardBudgetStatusSummary_(_dashboardBudgetEmpty_(emptyFy), emptyFy);
    empty.generatedAt = new Date().toISOString();
    empty.meta = _budgetCachePolicyMeta_(_appAssignObjects_({}, empty.meta || {}, {
        dataSource: "dashboardBudgetEmpty.performanceF.r161",
        cacheHit: !1,
        cacheEmptySkipped: !0,
        rowsRead: 0,
        durationMs: Math.max(0, Date.now() - startedAt),
        degraded: !1,
        source: "BudgetDomain.getDashboardSummaryForDashboard.performanceF.empty",
        readModelOwner: "Code_32_Domain_Budget.BudgetDomain",
        phaseESeparateBudgetHydration: !1,
        dashboardBudgetIntegrated: !0,
        budgetHotPathHit: !1
    }), policy, { status: "empty-not-cached" });
    return ok_(empty, "ยังไม่มีข้อมูลงบประมาณสำหรับปีที่เลือก");
}
function _budgetGetDashboardSummaryForDashboard_(payload) {
    return _budgetGetDashboardSummaryForDashboardCore_(payload || {}, null);
}
function _budgetGetDashboardSummaryForDashboardTrusted_(payload, session) {
    if (!session || typeof session != "object")
        throw new Error("DASHBOARD_TRUSTED_SESSION_REQUIRED");
    return _budgetGetDashboardSummaryForDashboardCore_(payload || {}, session);
}
function _normalizePersonnelPosition_(value) {
    return AppDomain.BudgetSalaryRules && AppDomain.BudgetSalaryRules.normalizePersonnelPosition ? AppDomain.BudgetSalaryRules.normalizePersonnelPosition(value) : String(value || "").trim();
}
function _salaryKeyMap_() {
    return AppDomain.BudgetSalaryRules && AppDomain.BudgetSalaryRules.salaryKeyMap ? AppDomain.BudgetSalaryRules.salaryKeyMap() : {};
}
function _resolveIsGovFlag_(row) {
    return AppDomain.BudgetSalaryRules && AppDomain.BudgetSalaryRules.resolveIsGovFlag ? AppDomain.BudgetSalaryRules.resolveIsGovFlag(row) : "n";
}
function _normalizeBudgetFyValue_(fy) {
    var s = String(fy || "").replace(/[^0-9]/g, "");
    return /^\d{4}$/.test(s) ? s : "";
}
function _latestSalarySettingsFy_(rows) {
    var years = [];
    return (_appArrayValue_(rows)).forEach(function (r) {
        var fy = _b32FY_(r && r.fy);
        fy && years.indexOf(fy) === -1 && years.push(fy);
    }), years.sort(function (a, b) {
        return Number(b || 0) - Number(a || 0);
    }), years[0] || String(_currentFiscalYearThai_(new Date));
}
function _salarySettingsRowsDirect_() {
    var collected = [], dataServiceRead = {};
    function appendRows(sheetName, sourceName, rows) {
        (_appArrayValue_(rows)).forEach(function (row) {
            !row || typeof row != "object" || collected.push(_appAssignObjects_({}, row, {
                __salarySettingsSheet: sheetName, __salarySettingsSource: sourceName
            }));
        });
    }
    function readDataService(sheetName) {
        try {
            var rows = typeof _budgetDataServiceRows_ == "function" ? _budgetDataServiceRows_(sheetName, _budgetProjectedFields_("SalarySettings"), {
                includeDeleted: !1, requireCanonical: !1, ttl: 300
            }) || [] : [];
            Array.isArray(rows) && rows.length && (appendRows(sheetName, "DataService", rows), dataServiceRead[sheetName] = !0);
        }
        catch (err) {
            _b32W_("budget.salarySettings." + sheetName, err);
        }
    }
    function readDirect(sheetName) {
        if (!dataServiceRead[sheetName])
            try {
                var rows = typeof _readObjects_ == "function" ? _readObjects_(sheetName) : [];
                appendRows(sheetName, "direct", rows);
            }
            catch (err) {
                _b32W_("budget.salarySettings.direct." + sheetName, err);
            }
    }
    readDataService("SalarySettings"), readDataService("BudgetSalarySettings"), readDirect("SalarySettings"), readDirect("BudgetSalarySettings");
    var byKey = {};
    return collected.forEach(function (row, index) {
        var fy = _b32FY_(row && row.fy), key = String(row && (row.Key || row.key) || "").trim().toUpperCase();
        if (key) {
            var composite = String(fy || "*") + "|" + key, value = _b32N_(row && (row.Value != null ? row.Value : row.value)), current = byKey[composite];
            (!current || _b32N_(current.Value != null ? current.Value : current.value) <= 0 && value > 0) && (byKey[composite] = _appAssignObjects_({}, row, {
                fy: fy || row.fy || "", Key: key, Value: value, __salarySettingsOrder: index
            }));
        }
    }), Object.keys(byKey).map(function (key) {
        return byKey[key];
    }).sort(function (a, b) {
        var fyDiff = Number(b.fy || 0) - Number(a.fy || 0);
        return fyDiff || String(a.Key || "").localeCompare(String(b.Key || ""));
    });
}
function getSalarySettings(fy) {
    try {
        let collect2 = function (targetFy2) {
            var s = {};
            return rows.forEach(function (row) {
                var rowFy = _b32FY_(row && row.fy);
                if (!targetFy2 || !rowFy || rowFy === targetFy2) {
                    var rawKey = String(row && (row.Key || row.key) || "").trim().toUpperCase();
                    if (rawKey) {
                        var val = Number(row && (row.Value || row.value) || 0) || 0;
                        (val || s[rawKey] == null) && (s[rawKey] = val);
                    }
                }
            }), s;
        }, hasAny2 = function (fyVal) {
            return rows.some(function (row) {
                return _b32FY_(row && row.fy) === fyVal;
            });
        };
        var collect = collect2, hasAny = hasAny2, rows = _salarySettingsRowsDirect_(), explicitFy = _b32FY_(fy), currentFy = _currentBudgetFyString_(), targetFy = explicitFy || (hasAny2(currentFy) ? currentFy : _latestSalarySettingsFy_(rows)), primary = collect2(targetFy), fallbackFy = _latestSalarySettingsFy_(rows.filter(function (row) {
            return Number(row && (row.Value || row.value) || 0) > 0;
        })), fallback = collect2(fallbackFy);
        return [
            "BUDGET", "ADV", "ADV_G", "EXP", "EXP_G", "ACA", "ACA_G", "SEC", "SEC_G"
        ].forEach(function (k) {
            !primary[k] && fallback[k] && (primary[k] = fallback[k]);
        }), {
            fy: targetFy || fallbackFy || String(fy || ""), budget: primary.BUDGET || 0, adv: primary.ADV || 0, adv_g: primary.ADV_G || 0, exp: primary.EXP || 0,
            exp_g: primary.EXP_G || 0, aca: primary.ACA || 0, aca_g: primary.ACA_G || 0, sec: primary.SEC || 0, sec_g: primary.SEC_G || 0
        };
    }
    catch (e) {
        return {
            fy: String(fy || ""), budget: 0, adv: 0, adv_g: 0, exp: 0, exp_g: 0, aca: 0, aca_g: 0, sec: 0, sec_g: 0
        };
    }
}
function saveSalarySettings(payload) {
    return domainWrite_("saveSalarySettings", payload, function (input) {
        var ss = getSpreadsheet_(), sh = getSheetOptional_("SalarySettings"), schema = [
            "fy", "Key", "Value", "UpdatedAt", "isDeleted", "deletedAt"
        ];
        sh || (sh = ss.insertSheet("SalarySettings"), _spreadsheetContextRegisterSheet_("SalarySettings", sh), AppRepository.setRangeValues("SalarySettings", 1, 1, [
            schema
        ], {
            invalidate: !1
        }), sh.setFrozenRows(1));
        var matrix = typeof getSheetMatrixCached_ == "function" ? getSheetMatrixCached_(sh, schema.length, {
            allowFullMatrix: !1
        }) : getSheetMatrix_(sh, schema.length, {
            allowFullMatrix: !1
        }), header = matrix.length ? matrix[0].map(function (h) {
            return String(h || "").trim();
        }) : schema.slice();
        header.indexOf("fy") !== -1 && header.indexOf("Key") !== -1 && header.indexOf("Value") !== -1 || (header = schema.slice(), AppRepository.clearSheetContents("SalarySettings"),
            AppRepository.setRangeValues("SalarySettings", 1, 1, [
                header
            ], {
                invalidate: !1
            }), sh.setFrozenRows(1), matrix = [
            header
        ]);
        var idx = {};
        header.forEach(function (h, i2) {
            idx[h] = i2;
        });
        for (var fy = _b32FY_(input && input.fy) || String(_currentFiscalYearThai_(new Date)), keyMap = {
            budget: "BUDGET", adv: "ADV", adv_g: "ADV_G", exp: "EXP", exp_g: "EXP_G", aca: "ACA", aca_g: "ACA_G", sec: "SEC", sec_g: "SEC_G"
        }, keep = [
            header
        ], i = 1; i < matrix.length; i++) {
            var row = matrix[i], rowFy;
            _b32FY_(row[idx.fy]) !== fy && keep.push(row);
        }
        var now = new Date;
        return Object.keys(keyMap).forEach(function (k) {
            if (input[k] !== void 0 && input[k] !== null && input[k] !== "") {
                var row2 = new Array(header.length).fill("");
                row2[idx.fy] = fy, row2[idx.Key] = keyMap[k], row2[idx.Value] = Number(String(input[k]).replace(/,/g, "")) || 0, idx.UpdatedAt != null && (row2[idx.UpdatedAt] = now),
                    idx.isDeleted != null && (row2[idx.isDeleted] = !1), idx.deletedAt != null && (row2[idx.deletedAt] = ""), keep.push(row2);
            }
        }), AppRepository.clearSheetContents("SalarySettings"), AppRepository.setRangeValues("SalarySettings", 1, 1, keep, {
            invalidate: !1
        }), invalidateSheetCache_("SalarySettings"), ok_(getSalarySettings(fy), "บันทึกการตั้งค่าเงินเดือนสำเร็จ");
    });
}
