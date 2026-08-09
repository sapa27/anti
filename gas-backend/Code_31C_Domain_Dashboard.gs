/** Canonical — Dashboard read-model function owner extracted from Code_30; behavior preserved. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {};
function _Domain_getDashboardStatsRaw_(payload) {
    return _appIsFnName_("_dashboardStatsDirect_")
        ? _dashboardStatsDirect_(payload || {})
        : {
            total: 0,
            totalMeetings: 0,
            meetingItemTotal: 0,
            meetings: {
                total: 0, totalMeetings: 0, totalItems: 0
            },
            statusRows: [],
            byType: [],
            byTopic: [],
            meta: {
                source: "dashboard-owner-code21-unavailable"
            },
        };
}

function _dashboardStatusLabels_() {
    return {
        s0: "เรื่องเข้าใหม่",
        s8: "ไม่รับเรื่อง",
        s2: "อนุฯ พิจารณา",
        s3: "รอพิจารณา",
        s4: "กมธ. พิจารณา",
        s6: "ยุติเรื่อง",
        s5: "ส่งหน่วยงาน",
        s7: "จัดทำรายงาน",
    };
}

function _dashboardStatusReadModel_(rows) {
    rows = _c30A_(rows) ? rows : [];
    var labels = _dashboardStatusLabels_(), counts = {}, unknownStatus = 0;
    Object.keys(labels).forEach(function (key) {
        counts[key] = 0;
    });
    rows.forEach(function (row) {
        var key = _dashboardCaseStatusKey_(_dashboardCaseStatusValue_(row || {}));
        _appHasOwnProperty_(labels, key)
            ? (counts[key] = _dashboardNum_(counts[key]) + 1)
            : unknownStatus++;
    });
    var statusRows = Object.keys(labels).map(function (key) {
        return {
            key: key,
            label: labels[key],
            count: _dashboardNum_(counts[key]),
        };
    }), statusRowsTotal = statusRows.reduce(function (sum, row) {
        return sum + _dashboardNum_(row && row.count);
    }, 0);
    unknownStatus &&
        (statusRows.push({
            key: "unknown",
            label: "ไม่ระบุสถานะ",
            count: unknownStatus,
        }),
            (statusRowsTotal += unknownStatus));
    return {
        stamp: DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT,
        statusCountStamp: APP_DASHBOARD_STATUS_COUNT_STAMP,
        dashboardStatusCountStamp: APP_DASHBOARD_STATUS_COUNT_STAMP,
        source: "DashboardStatusReadModel.PhaseF",
        sourceRowCount: rows.length,
        statusRows: statusRows,
        statusRowsTotal: statusRowsTotal,
        counts: counts,
        unknownStatus: unknownStatus,
        defaultBlankToS0: !0,
        labels: labels,
        generatedAt: new Date().toISOString(),
    };
}

function _dashboardStatusReadModelContract_() {
    return _cm_({
        ok: !0,
        stamp: DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT,
        owner: "DashboardDomain.statusReadModel",
        singleSource: "_dashboardStatusReadModel_",
        statusCountStamp: APP_DASHBOARD_STATUS_COUNT_STAMP,
        sourceRowCountRequired: !0,
        frontendRemapDisabled: !0,
        snapshotStampRequired: !0,
        apiNamesPreserved: !0,
        noNewFiles: !0,
        uiDomChanged: !1,
        businessLogicChanged: !1,
    });
}

function _dashboardEmptyStatsPayload_(reason) {
    return {
        total: 0,
        pending: 0,
        completed: 0,
        overdueLetters: 0,
        soonOverdue: 0,
        s0: 0,
        s2: 0,
        s3: 0,
        s4: 0,
        s5: 0,
        s6: 0,
        s7: 0,
        s8: 0,
        meetings: {
            total: 0, recent: 0, byResult: []
        },
        byType: [],
        byTopic: [],
        statusRows: [],
        statusCountStamp: APP_DASHBOARD_STATUS_COUNT_STAMP,
        dashboardStatusCountStamp: APP_DASHBOARD_STATUS_COUNT_STAMP,
        statusReadModelStamp: DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT,
        dashboardStatusReadModelStamp: DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT,
        statusReadModel: {
            stamp: DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT,
            sourceRowCount: 0,
            statusRows: [],
            statusRowsTotal: 0,
        },
        sourceRowCount: 0,
        statusSourceRowCount: 0,
        generatedAt: new Date().toISOString(),
        degraded: !!reason,
        errorCode: reason ? "DASHBOARD_STATS_DEGRADED" : "",
    };
}

function _dashboardStatsHasDashboardData_(stats) {
    function hasList(list) {
        return (_c30A_(list) &&
            list.some(function (x) {
                return Number((x && (x.count || x.total || x.value)) || 0) > 0;
            }));
    }
    var letters = (stats = stats || {}).letters || {}, meetings = stats.meetings || {};
    return (Number(stats.total || stats.totalCases || 0) > 0 ||
        hasList(stats.byType) ||
        hasList(stats.byTopic) ||
        hasList(stats.statusRows) ||
        Number(letters.total || 0) > 0 ||
        Number(meetings.total || 0) > 0);
}

function _dashboardEmptyBudgetPayload_(reason) {
    return {
        fy: _appIsFnName_("_currentBudgetFyString_")
            ? _currentBudgetFyString_()
            : "",
        totalBudget: 0,
        totalPaid: 0,
        totalRemain: 0,
        byPlan: [],
        plans: [],
        rows: [],
        statusSummary: {
            refund: {
                total: 0, pending: 0
            },
            report: {
                total: 0, pending: 0
            },
        },
        generatedAt: new Date().toISOString(),
        degraded: !!reason,
        errorCode: reason ? "DASHBOARD_BUDGET_DEGRADED" : "",
    };
}

function _dashboardText_(value) {
    return value == null
        ? ""
        : Object.prototype.toString.call(value) === "[object Date]"
            ? isNaN(value.getTime())
                ? ""
                : value.toISOString()
            : String(value)
                .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, " ")
                .replace(/\s+/g, " ")
                .trim();
}

function _dashboardStrictTitleText_(value) {
    var txt = _dashboardText_(value);
    if (!txt)
        return "";
    var compact = txt.replace(/[\s\u00A0\u1680\u180E\u2000-\u200F\u2028\u2029\u202F\u205F\u2060\u3000\uFEFF]/g, "");
    return !compact ||
        compact === "-" ||
        compact === "\u2014" ||
        compact === "\u2013" ||
        compact === "_" ||
        compact === "." ||
        compact === "\u2026" ||
        /^null$/i.test(compact) ||
        /^undefined$/i.test(compact) ||
        /^n\/?a$/i.test(compact) ||
        /^na$/i.test(compact)
        ? ""
        : txt;
}

function _dashboardMeetingAgendaTitle_(row) {
    return _dashboardStrictTitleText_((row = row || {}).title);
}

function _dashboardThaiDateText_(value) {
    return _appThaiDateText_(value);
}

function _dashboardNum_(value) {
    var n = Number(String(value == null ? 0 : value).replace(/,/g, ""));
    return isFinite(n) ? n : 0;
}


function _routerDashboardProjectedFields_(sheetName, options) {
    options = options || {};
    var includeDetails = options.includeDetails === !0;
    var minimal = {
        MainData: ["cat", "subCat", "status", "isDeleted", "deletedAt"],
        Letters: ["letterStatus", "dueDate", "extendDate", "isDeleted", "deletedAt"],
        CommitteeMeetings: ["meetingNo", "meetingDate", "isDeleted", "deletedAt"],
        CommitteeMeetingAgendaItems: ["title", "isDeleted", "deletedAt"]
    };
    var detail = {
        MainData: ["caseId", "caseNum", "recNo", "title", "petitioners", "cat", "subCat", "status", "updatedAt", "createdAt", "isDeleted", "deletedAt"],
        Letters: ["letterId", "caseId", "letterStatus", "dueDate", "extendDate", "updatedAt", "createdAt", "isDeleted", "deletedAt"],
        CommitteeMeetings: ["meetingId", "meetingNo", "meetingDate", "title", "status", "note", "updatedAt", "createdAt", "isDeleted", "deletedAt"],
        CommitteeMeetingAgendaItems: ["itemId", "meetingId", "agendaNo", "title", "caseId", "caseNum", "agencyOrPresenter", "result", "updatedAt", "createdAt", "isDeleted", "deletedAt"]
    };
    return ((includeDetails ? detail : minimal)[_s_(sheetName)] || []).slice();
}

function _dashboardSafeRows_(sheetName, options) {
    options = options || {};
    sheetName = _s_(sheetName).trim();
    var ttl = Math.max(15, Math.min(Number(options.ttl || 60) || 60, 300));
    var errors = [];
    function note(label, err) {
        var msg = label + ": " + String(err && err.message ? err.message : err || "unknown");
        errors.push(msg);
        try {
            _c30W_("dashboard.performanceD.projected." + label + "." + sheetName, err);
        }
        catch (_e) {
            _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _e) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
                error: String((_e && _e.message) || _e)
            });
        }
    }
    function clean(list) {
        return (list = _c30A_(list) ? list : []).filter(function (row) {
            return row && !(typeof isSoftDeletedRow_ == "function" ? isSoftDeletedRow_(row) : row.isDeleted === !0 || _s_(row.isDeleted).toLowerCase() === "true" || row.deletedAt);
        });
    }
    var fields = _c30A_(options.fields) && options.fields.length ? options.fields.slice() : _routerDashboardProjectedFields_(sheetName, options);
    if (fields && fields.length && typeof readSheetProjectedObjectsCached_ == "function")
        try {
            var projectedRows = clean(readSheetProjectedObjectsCached_(sheetName, fields, {
                includeDeleted: !1,
                requireCanonical: !1,
                ttl: ttl,
                sparseRead: !0,
                projectedReadMode: "bounded-sparse-spans",
                maxColumnSpans: 4,
                projectionPlan: "dashboard:" + sheetName,
                projectionPlanFields: _routerDashboardProjectedFields_(sheetName, { includeDetails: !0 })
            }) || []);
            return projectedRows;
        }
        catch (_projectedErr) {
            note("projectedReader", _projectedErr);
        }
    if (errors.length && options.failOnError === !0)
        throw new Error("DASHBOARD_PROJECTED_ROWS_FAILED: " + sheetName + ": " + errors.join(" | "));
    try {
        if (sheetName === "MainData" && _appIsFnName_("_listMainDataRows_"))
            return clean(_listMainDataRows_(!1) || []);
        if (sheetName === "Letters" && _appIsFnName_("_trackingReadLettersRows_"))
            return clean(_trackingReadLettersRows_() || []);
    }
    catch (_domainRowsErr) {
        note("domainFallbackRows", _domainRowsErr);
    }
    return [];
}

function _dashboardRequestRows_(sheetName, options) {
    ((options = options || {}), (sheetName = _s_(sheetName).trim()));
    var cacheKey = JSON.stringify({
        sheetName,
        ttl: Math.max(15, Math.min(Number(options.ttl || 60) || 60, 300)),
        failOnError: options.failOnError === !0,
        allowEmpty: options.allowEmpty === !0,
        fields: (_c30A_(options.fields) ? options.fields : _routerDashboardProjectedFields_(sheetName, options)).join("|"),
    });
    try {
        if (_appIsFnName_("_requestScopeGet_")) {
            var hit = _requestScopeGet_("dashboardSafeRows", cacheKey);
            if (hit && _c30A_(hit.rows))
                return hit.rows.slice();
        }
    }
    catch (_requestHitErr) {
        _c30W_("dashboard.requestRows.hit." + sheetName, _requestHitErr);
    }
    var started = Date.now(), rows = _dashboardSafeRows_(sheetName, options), entry = {
        rows: (rows = _c30A_(rows) ? rows : []).slice(),
        meta: {
            sheetName,
            rowsRead: rows.length,
            durationMs: Math.max(0, Date.now() - started),
            source: "dashboard-request-scope-current",
        },
    };
    try {
        _appIsFnName_("_requestScopePut_") &&
            _requestScopePut_("dashboardSafeRows", cacheKey, entry);
    }
    catch (_requestPutErr) {
        _c30W_("dashboard.requestRows.put." + sheetName, _requestPutErr);
    }
    return rows.slice();
}

function _dashboardNormalizeCaseStatusForCount_(status) {
    return _caseStatusNormalize_(status, {
        defaultStatus: "เรื่องเข้าใหม่",
        strict: !0,
        warningKey: "dashboard.status.normalize",
    });
}

function _dashboardCaseStatusValue_(row) {
    if (!row)
        return "เรื่องเข้าใหม่";
    if (typeof row != "object" || _c30A_(row))
        return _dashboardNormalizeCaseStatusForCount_(row);
    try {
        if (_appIsFnName_("_dashboardPickCaseStatus_")) {
            var picked = _dashboardPickCaseStatus_(row);
            if (picked)
                return _dashboardNormalizeCaseStatusForCount_(picked);
        }
    }
    catch (_pickErr) {
        _appIsFnName_("_recordWarning_")
            ? _recordWarning_("ec", _pickErr)
            : _appIsFnName_("_logWarn_") &&
                _logWarn_("ec", {
                    error: String((_pickErr && _pickErr.message) || _pickErr),
                });
    }
    for (var keys = [
        "สถานะเรื่อง",
        "สถานะเรื่องพิจารณา",
        "สถานะ",
        "สถานะพิจารณา",
        "สถานะปัจจุบัน",
        "ผลการพิจารณา",
        "สถานะการพิจารณา",
        "caseStatus",
        "status",
        "processStatus",
        "resultStatus",
        "currentStatus",
        "statusText",
        "caseState",
        "workflowStatus",
        "meetingStatus",
        "colStatus",
        "col10",
        "col11",
        "col12",
    ], i = 0; i < keys.length; i++) {
        var value = row[keys[i]];
        if (value != null && String(value).trim())
            return _dashboardNormalizeCaseStatusForCount_(value);
    }
    return "เรื่องเข้าใหม่";
}

function _dashboardCaseStatusKey_(status) {
    var raw = _dashboardNormalizeCaseStatusForCount_(status), compact = _dashboardText_(raw).replace(/\s+/g, "");
    return !compact
        ? "s0"
        : /จัดทำรายงาน|รายงาน/.test(compact)
            ? "s7"
            : /ไม่รับเรื่อง|ไม่รับ/.test(compact)
                ? "s8"
                : /ยุติ|ปิดเรื่อง|เสร็จสิ้น|สำเร็จ/.test(compact)
                    ? "s6"
                    : /ส่ง.*หน่วยงาน|หน่วยงาน.*เกี่ยวข้อง|ติดตาม/.test(compact)
                        ? "s5"
                        : /(อนุฯ|อนุกรรมาธิการ|คณะอนุกรรมาธิการ)/.test(compact)
                            ? "s2"
                            : /(กมธ|กรรมาธิการ|คณะกรรมาธิการ)/.test(compact)
                                ? "s4"
                                : /รอ|รอบรรจุ|ค้างพิจารณา/.test(compact)
                                    ? "s3"
                                    : /เรื่องเข้าใหม่|ได้รับเรื่อง|เรื่องใหม่|รับเรื่อง|รับเข้า|^รับ$/.test(compact)
                                        ? "s0"
                                        : "s0";
}

function _dashboardTopRows_(map, limit) {
    return Object.keys(map || {})
        .map(function (label) {
        return {
            label, count: _dashboardNum_(map[label])
        };
    })
        .filter(function (x) {
        return x.count > 0;
    })
        .sort(function (a, b) {
        return (b.count - a.count || _s_(a.label).localeCompare(_s_(b.label), "th"));
    })
        .slice(0, Math.max(1, Number(limit || 10) || 10));
}

function _dashboardType_(row) {
    var raw = _dashboardText_((row = row || {}).cat ||
        row.caseType ||
        row.type ||
        row.category ||
        row.caseCategory ||
        row.subjectType ||
        row.ประเภทเรื่อง ||
        row.ประเภท ||
        row.col2);
    if (!raw)
        return "ไม่ระบุประเภท";
    var compact = raw.replace(/\s+/g, "");
    return /ร้องเรียน|ผู้ร้อง|ร้องทุกข์/.test(compact)
        ? "เรื่องร้องเรียน"
        : /ประธานสภา/.test(compact)
            ? "ประธานสภาผู้แทนราษฎรมอบหมาย"
            : /สภาผู้แทนราษฎร/.test(compact) && /มอบหมาย/.test(compact)
                ? "สภาผู้แทนราษฎรมอบหมาย"
                : /กรรมาธิการ/.test(compact) && /ญัตติ/.test(compact)
                    ? "กรรมาธิการเสนอญัตติ"
                    : raw;
}

function _dashboardTopic_(row) {
    var raw = _dashboardText_((row = row || {}).subCat ||
        row.subCategory ||
        row.ประเด็นพิจารณา ||
        row.ประเด็น ||
        row.issue ||
        row.topic ||
        row.topicName ||
        row.considerIssue ||
        row.caseIssue ||
        row.col3 ||
        row.col7);
    return raw
        ? raw.length > 70
            ? raw.substring(0, 70) + "\u2026"
            : raw
        : "ไม่ระบุประเด็น";
}

function _routerDashboardMeetingNoValue_(row) {
    var meetingNo = _dashboardText_((row = row || {}).meetingNo || "");
    return meetingNo
        ? (meetingNo = meetingNo
            .replace(/^\s*(ครั้งที่|ครั้งประชุม)\s*/, "")
            .replace(/\s+/g, " ")
            .trim())
        : "";
}

function _routerDashboardMeetingRoundKey_(row) {
    var meetingNo = _routerDashboardMeetingNoValue_(row);
    return meetingNo ? "meetingNo:" + meetingNo : "";
}

function _dashboardMeetingSessionKey_(row) {
    return _routerDashboardMeetingRoundKey_((row = row || {}));
}

function _dashboardMeetingTitleText_(row) {
    return _dashboardStrictTitleText_((row = row || {}).title || row.caseTitle || row.subject || "");
}

function _dashboardMeetingNoTitleSummary_(rows) {
    rows = _c30A_(rows) ? rows : [];
    var cutoff = new Date();
    (cutoff.setDate(cutoff.getDate() - 30), cutoff.setHours(0, 0, 0, 0));
    var sessionMap = {}, recentSessionMap = {}, titleCount = 0;
    rows.forEach(function (row) {
        var sessionKey = _dashboardMeetingSessionKey_((row = row || {}));
        sessionKey && (sessionMap[sessionKey] = !0);
        var d = _caseDateOnly_(row.meetingDate ||
            row.date ||
            row.วันที่ประชุม ||
            row.updatedAt ||
            row.createdAt);
        (d && d >= cutoff && sessionKey && (recentSessionMap[sessionKey] = !0),
            _dashboardMeetingTitleText_(row) && titleCount++);
    });
    var totalMeetings = Object.keys(sessionMap).length, recent = Object.keys(recentSessionMap).length;
    return {
        total: totalMeetings,
        totalMeetings,
        meetingCount: totalMeetings,
        recent,
        recentMeetings: recent,
        totalItems: titleCount,
        itemTotal: titleCount,
        totalCasesDiscussed: titleCount,
        subjectCount: titleCount,
        byResult: [],
        generatedAt: new Date().toISOString(),
        source: "dashboard-current-meetingNo-title-strict",
    };
}

function _dashboardCommitteeMeetingDashboard_(payload) {
    payload = payload || {};
    var ttl = payload.forceFresh === !0 ? 0 : payload.cacheTtlSeconds || 60, includeRows = payload.includeMeetingRows === !0, meetings = _dashboardRequestRows_("CommitteeMeetings", {
        ttl,
        failOnError: !1,
        allowEmpty: !0,
        fields: _routerDashboardProjectedFields_("CommitteeMeetings", { includeDetails: includeRows }),
    }).filter(function (row) {
        return !(row &&
            (row.isDeleted === !0 || _s_(row.isDeleted).toLowerCase() === "true"));
    }), meetingMap = {};
    includeRows &&
        meetings.forEach(function (meeting) {
            ((meeting = meeting || {}),
                (meetingMap[_s_(meeting.meetingId)] = meeting));
        });
    var rows = [], itemCount = 0;
    _dashboardRequestRows_("CommitteeMeetingAgendaItems", {
        ttl,
        failOnError: !1,
        allowEmpty: !0,
        fields: _routerDashboardProjectedFields_("CommitteeMeetingAgendaItems", { includeDetails: includeRows }),
    }).forEach(function (item) {
        if ((item = item || {}).isDeleted !== !0 &&
            _s_(item.isDeleted).toLowerCase() !== "true" &&
            !item.deletedAt) {
            var title = _dashboardMeetingAgendaTitle_(item);
            if (title && (itemCount++, includeRows)) {
                var meeting = meetingMap[_s_(item.meetingId)] || {};
                rows.push({
                    meetingId: _s_(item.meetingId),
                    meetingNo: _dashboardText_(meeting.meetingNo || ""),
                    meetingDate: _dashboardThaiDateText_(meeting.meetingDate || ""),
                    title,
                    agencyOrPresenter: _dashboardText_(item.agencyOrPresenter || ""),
                    agendaNo: _dashboardText_(item.agendaNo || item.agenda || ""),
                    source: "CommitteeMeetingAgendaItems.title.nonblank",
                });
            }
        }
    });
    var summary = _dashboardMeetingNoTitleSummary_(meetings);
    return ((summary.totalItems = itemCount),
        (summary.itemTotal = itemCount),
        (summary.totalCasesDiscussed = itemCount),
        (summary.subjectCount = itemCount),
        (summary.source =
            "dashboard-committee-meetingNo-title-nonblank-strict-current"),
        (summary.meetingItemSource = "CommitteeMeetingAgendaItems.title.nonblank"),
        {
            rows, meetingRows: includeRows ? meetings : [], summary
        });
}

function _dashboardLetterDateOnly_(value) {
    if (!value && value !== 0)
        return null;
    try {
        if (value instanceof Date) {
            var direct = new Date(value.getFullYear(), value.getMonth(), value.getDate());
            return (direct.setHours(0, 0, 0, 0), direct);
        }
        var text = _c30S_(value)
            .replace(/[\u200B-\u200D\uFEFF]/g, "")
            .trim();
        if (!text)
            return null;
        var m = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (m) {
            var y = Number(m[1]);
            y > 2400 && (y -= 543);
            var d1 = new Date(y, Number(m[2]) - 1, Number(m[3]));
            if (!isNaN(d1.getTime()))
                return (d1.setHours(0, 0, 0, 0), d1);
        }
        if ((m = text.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/))) {
            var yy = Number(m[3]);
            (yy < 100 && (yy += 2500), yy > 2400 && (yy -= 543));
            var d2 = new Date(yy, Number(m[2]) - 1, Number(m[1]));
            if (!isNaN(d2.getTime()))
                return (d2.setHours(0, 0, 0, 0), d2);
        }
        var d = new Date(text);
        return isNaN(d.getTime())
            ? null
            : (d.getFullYear() > 2400 &&
                (d = new Date(d.getFullYear() - 543, d.getMonth(), d.getDate())),
                d.setHours(0, 0, 0, 0),
                d);
    }
    catch (_dateErr) {
        return (_c30W_("dashboard.letter.dateOnly", _dateErr), null);
    }
}

function _dashboardLetterIsReceived_(status) {
    var st = _dashboardText_(status).replace(/\s+/g, "");
    return /ได้รับแล้ว|ได้รับตอบกลับแล้ว|ตอบกลับแล้ว|ตอบแล้ว|เสร็จสิ้น|เสร็จ|รายงานแล้ว/.test(st);
}

function _dashboardLetterSummary_(rows) {
    rows = _c30A_(rows) ? rows : [];
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var out = {
        total: rows.length,
        notDue: 0,
        overdue: 0,
        received: 0,
        soonDue: 0,
    };
    return (rows.forEach(function (row) {
        var status;
        if (_dashboardLetterIsReceived_((row = row || {}).letterStatus ||
            row.status ||
            row.trackStatus ||
            row.สถานะ ||
            row.สถานะหนังสือ ||
            ""))
            return (out.received++, void 0);
        var due = _dashboardLetterDateOnly_(row.extendDate ||
            row.ขยายเวลา ||
            row.วันที่ขยายเวลา ||
            row.dueDate ||
            row.วันครบกำหนดตอบ ||
            row.ครบกำหนด ||
            row.กำหนดตอบ ||
            row.วันครบกำหนด);
        if (!due)
            return (out.notDue++, void 0);
        var diff = Math.round((due.getTime() - today.getTime()) / 864e5);
        if (diff <= 0)
            return (out.overdue++, void 0);
        (diff <= 7 && out.soonDue++, out.notDue++);
    }),
        out);
}

function _dashboardStatsDirect_(payload) {
    payload = payload || {};
    var fastFirstPaint = payload.phase1FirstPaint === !0 ||
        /first-paint|fast-summary|summary-kpi/i.test(_s_(payload.hotPathMode || payload.mode || "")), skipHeavyFirstPaint = fastFirstPaint &&
        payload.includeLetters !== !0 &&
        payload.includeMeetingRows !== !0 &&
        String(_appIsFnName_("_scriptProp_")
            ? _scriptProp_("DASHBOARD_FAST_FIRST_PAINT_SKIP_HEAVY", "Y")
            : "Y").toUpperCase() !== "N", caseRows = _dashboardRequestRows_("MainData", {
        ttl: payload.cacheTtlSeconds || 60,
        failOnError: !0,
        allowEmpty: !0,
        fields: _routerDashboardProjectedFields_("MainData", { includeDetails: payload.includeCases === !0 }),
    }), letterRows = skipHeavyFirstPaint
        ? []
        : _dashboardRequestRows_("Letters", {
            ttl: payload.cacheTtlSeconds || 60,
            failOnError: !0,
            allowEmpty: !0,
            fields: _routerDashboardProjectedFields_("Letters", { includeDetails: payload.includeLetters === !0 }),
        }), committeeMeetingDashboard = skipHeavyFirstPaint
        ? {
            rows: [], meetingRows: [], summary: _dashboardMeetingNoTitleSummary_([])
        }
        : _dashboardCommitteeMeetingDashboard_(payload || {}), meetingRows = _c30A_(committeeMeetingDashboard.rows)
        ? committeeMeetingDashboard.rows
        : [], meetingNoRows = _c30A_(committeeMeetingDashboard.meetingRows)
        ? committeeMeetingDashboard.meetingRows
        : [], stats = _dashboardEmptyStatsPayload_("dashboard-direct-current");
    ((stats.degraded = !1),
        (stats.errorCode = ""),
        (stats.total = caseRows.length));
    var statusReadModel = _dashboardStatusReadModel_(caseRows), typeMap = {}, topicMap = {};
    Object.keys(statusReadModel.counts || {}).forEach(function (key) {
        stats[key] = _dashboardNum_(statusReadModel.counts[key]);
    });
    (caseRows.forEach(function (row) {
        row = row || {};
        var typeName = _dashboardType_(row), topic = _dashboardTopic_(row);
        ((typeMap[typeName] = (typeMap[typeName] || 0) + 1),
            (topicMap[topic] = (topicMap[topic] || 0) + 1));
    }),
        (stats.byType = _dashboardTopRows_(typeMap, 20)),
        (stats.byTopic = _dashboardTopRows_(topicMap, 10)),
        (stats.statusRows = statusReadModel.statusRows),
        (stats.statusCountStamp = statusReadModel.statusCountStamp),
        (stats.dashboardStatusCountStamp =
            statusReadModel.dashboardStatusCountStamp),
        (stats.statusReadModelStamp = DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT),
        (stats.dashboardStatusReadModelStamp =
            DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT),
        (stats.statusDefaultBlankToS0 = !0),
        (stats.statusRowsTotal = statusReadModel.statusRowsTotal),
        (stats.sourceRowCount = statusReadModel.sourceRowCount),
        (stats.statusSourceRowCount = statusReadModel.sourceRowCount),
        (stats.statusUnknownCount = statusReadModel.unknownStatus),
        (stats.statusReadModel = statusReadModel),
        (stats.completed =
            _dashboardNum_(stats.s6) +
                _dashboardNum_(stats.s7) +
                _dashboardNum_(stats.s8)),
        (stats.pending = Math.max(stats.total - stats.completed, 0)),
        (stats.letters = _dashboardLetterSummary_(letterRows)),
        (stats.overdueLetters = _dashboardNum_(stats.letters.overdue)),
        (stats.soonOverdue = _dashboardNum_(stats.letters.soonDue)),
        (stats.meetings =
            committeeMeetingDashboard.summary ||
                _dashboardMeetingNoTitleSummary_(meetingNoRows)),
        (stats.meetings.totalItems = _dashboardNum_(stats.meetings.totalItems ||
            stats.meetings.itemTotal ||
            meetingRows.length)),
        (stats.meetings.itemTotal = stats.meetings.totalItems),
        (stats.meetings.totalCasesDiscussed = stats.meetings.totalItems),
        (stats.meetings.subjectCount = stats.meetings.totalItems),
        (stats.meetings.totalMeetings = _dashboardNum_(stats.meetings.totalMeetings || stats.meetings.total || 0)),
        (stats.meetings.meetingCount = stats.meetings.totalMeetings),
        (stats.meetings.total = stats.meetings.totalMeetings),
        (stats.meetings.recentMeetings = _dashboardNum_(stats.meetings.recentMeetings || stats.meetings.recent || 0)),
        (stats.meetings.recent = stats.meetings.recentMeetings),
        (stats.meetings.source =
            "dashboard-current-CommitteeMeetings-meetingNo-title-nonblank-only"),
        (stats.meetings.strictKpi = !0),
        (stats.meetings.archivedDirectRead = !1),
        (stats.totalMeetings = _dashboardNum_(stats.meetings.totalMeetings)),
        (stats.recentMeetings = _dashboardNum_(stats.meetings.recentMeetings || stats.meetings.recent)),
        (stats.meetingItemTotal = _dashboardNum_(stats.meetings.totalItems ||
            stats.meetings.itemTotal ||
            stats.meetings.totalCasesDiscussed ||
            stats.meetings.subjectCount)));
    var includeCaseRowsForDashboard = payload.includeCases === !0, includeMeetingRowsForDashboard = payload.includeMeetingRows === !0;
    ((stats.caseRows = includeCaseRowsForDashboard
        ? caseRows.slice(0, Math.max(1, Math.min(Number(payload.caseLimit || 30) || 30, 120)))
        : []),
        (stats.letterRows =
            payload.includeLetters === !0 ? letterRows.slice(0, 100) : []),
        (stats.meetingRows = includeMeetingRowsForDashboard
            ? meetingRows.slice(0, 100)
            : []),
        (stats.meetingNoRows = includeMeetingRowsForDashboard
            ? meetingNoRows.slice(0, 100)
            : []),
        (stats.generatedAt = new Date().toISOString()));
    var requestMetrics = typeof getRequestScopeMetrics_ == "function"
        ? getRequestScopeMetrics_()
        : {};
    return ((stats.meta = {
        generatedAt: stats.generatedAt,
        source: "dashboard-current-strict-kpi-hot-path-r161",
        dashboardKpiStrict: !0,
        statusReadModelStamp: DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT,
        statusCountStamp: APP_DASHBOARD_STATUS_COUNT_STAMP,
        statusSourceRowCount: stats.sourceRowCount,
        statusRowsTotal: stats.statusRowsTotal,
        performanceMode: payload && payload.phase1FirstPaint
            ? "phase1-summary-kpi-first-paint"
            : "phase5-summary-kpi-first-paint",
        meetingSource: "CommitteeMeetings.meetingNo",
        meetingItemSource: "CommitteeMeetingAgendaItems.title.nonblank-strict",
        archivedMeetingLogsDirectRead: !1,
        cases: caseRows.length,
        letters: letterRows.length,
        meetings: meetingNoRows.length,
        meetingItems: meetingRows.length,
        caseRowsIncluded: includeCaseRowsForDashboard,
        meetingRowsIncluded: includeMeetingRowsForDashboard,
        fastFirstPaintSkippedHeavySheets: !!skipHeavyFirstPaint,
        cacheHit: !(!requestMetrics || !requestMetrics.cacheHit),
        cacheHits: Number((requestMetrics && requestMetrics.cacheHits) || 0),
        cacheMisses: Number((requestMetrics && requestMetrics.cacheMisses) || 0),
        rowsRead: Number((requestMetrics && requestMetrics.rowsRead) || 0),
        cellsRead: Number((requestMetrics && requestMetrics.cellsRead) || 0),
        serviceReads: Number((requestMetrics && requestMetrics.serviceReads) || 0),
        projectedColumnsRead: Number((requestMetrics && requestMetrics.projectedColumnsRead) || 0),
        fullWidthColumnsAvoided: Number((requestMetrics && requestMetrics.fullWidthColumnsAvoided) || 0),
        projectionPlanHits: Number((requestMetrics && requestMetrics.projectionPlanHits) || 0),
        projectionPlanBuilds: Number((requestMetrics && requestMetrics.projectionPlanBuilds) || 0),
        projectionPlanDerivations: Number((requestMetrics && requestMetrics.projectionPlanDerivations) || 0),
        authoritativeEmptyReads: Number((requestMetrics && requestMetrics.authoritativeEmptyReads) || 0),
        fallbackReadsSuppressed: Number((requestMetrics && requestMetrics.fallbackReadsSuppressed) || 0),
        sheetCellsRead: (requestMetrics && requestMetrics.sheetCellsRead) || {},
        sheetServiceReads: (requestMetrics && requestMetrics.sheetServiceReads) || {},
        spreadsheetScanMode: "bounded-sparse-projection-hot-path-r161",
        cacheKinds: (requestMetrics && requestMetrics.cacheKinds) || {},
    }),
        (stats.source = "dashboard-current-strict-kpi-hot-path-r161"),
        stats);
}

function _dashboardStats_(payload) {
    return _dashboardStatsDirect_(payload || {});
}

function _dashboardCanonicalBundleDto_(stats, budgetData, caseData, cacheMeta) {
    ((budgetData = budgetData || {}),
        (caseData = caseData || {
            rows: [],
            totalRecords: 0,
            totalPages: 1,
            page: 1,
            limit: 0,
        }),
        (cacheMeta = cacheMeta || {}));
    var statsMeetingSummary = (stats = stats || {}).meetings && typeof stats.meetings == "object"
        ? stats.meetings
        : {}, strictMeetingRows = _c30A_(stats.meetingNoRows) && stats.meetingNoRows.length
        ? stats.meetingNoRows
        : _c30A_(stats.meetingRows)
            ? stats.meetingRows
            : [], strictMeetingSummary = strictMeetingRows.length
        ? _dashboardMeetingNoTitleSummary_(strictMeetingRows)
        : {
            total: _dashboardNum_(statsMeetingSummary.totalMeetings ||
                statsMeetingSummary.meetingCount ||
                statsMeetingSummary.total ||
                stats.totalMeetings),
            totalMeetings: _dashboardNum_(statsMeetingSummary.totalMeetings ||
                statsMeetingSummary.meetingCount ||
                statsMeetingSummary.total ||
                stats.totalMeetings),
            meetingCount: _dashboardNum_(statsMeetingSummary.totalMeetings ||
                statsMeetingSummary.meetingCount ||
                statsMeetingSummary.total ||
                stats.totalMeetings),
            recent: _dashboardNum_(statsMeetingSummary.recentMeetings ||
                statsMeetingSummary.recent ||
                stats.recentMeetings),
            recentMeetings: _dashboardNum_(statsMeetingSummary.recentMeetings ||
                statsMeetingSummary.recent ||
                stats.recentMeetings),
        }, strictAgendaItemTotal = _dashboardNum_(stats.meetingItemTotal ||
        statsMeetingSummary.totalItems ||
        statsMeetingSummary.itemTotal ||
        statsMeetingSummary.totalCasesDiscussed ||
        statsMeetingSummary.subjectCount);
    stats.meetings &&
        stats.meetings.strictKpi === !0 &&
        (strictAgendaItemTotal = _dashboardNum_(stats.meetings.totalItems ||
            stats.meetings.itemTotal ||
            stats.meetingItemTotal ||
            strictAgendaItemTotal));
    var summary = {
        totalCases: Number(stats.total || 0),
        pendingCases: Number(stats.pending || 0),
        completedCases: Number(stats.completed || 0),
        overdueLetters: Number(stats.overdueLetters || 0),
        soonOverdue: Number(stats.soonOverdue || 0),
        totalMeetings: Number(strictMeetingSummary.totalMeetings ||
            strictMeetingSummary.meetingCount ||
            strictMeetingSummary.total ||
            0),
        recentMeetings: Number(strictMeetingSummary.recentMeetings || strictMeetingSummary.recent || 0),
        meetingItemTotal: Number(strictAgendaItemTotal || 0),
    }, canonicalMeetingStats = _appAssignObjects_({
        total: summary.totalMeetings,
        totalMeetings: summary.totalMeetings,
        meetingCount: summary.totalMeetings,
        recent: summary.recentMeetings,
        recentMeetings: summary.recentMeetings,
        totalItems: summary.meetingItemTotal,
        itemTotal: summary.meetingItemTotal,
        totalCasesDiscussed: summary.meetingItemTotal,
        byResult: [],
    }, stats.meetings || {});
    ((canonicalMeetingStats.total = summary.totalMeetings),
        (canonicalMeetingStats.totalMeetings = summary.totalMeetings),
        (canonicalMeetingStats.meetingCount = summary.totalMeetings),
        (canonicalMeetingStats.recent = summary.recentMeetings),
        (canonicalMeetingStats.recentMeetings = summary.recentMeetings),
        (canonicalMeetingStats.totalItems = summary.meetingItemTotal),
        (canonicalMeetingStats.itemTotal = summary.meetingItemTotal),
        (canonicalMeetingStats.totalCasesDiscussed = summary.meetingItemTotal),
        (canonicalMeetingStats.meetingRows = _c30A_(stats.meetingRows)
            ? stats.meetingRows.slice(0, 500)
            : []),
        (canonicalMeetingStats.meetingNoRows = _c30A_(stats.meetingNoRows)
            ? stats.meetingNoRows.slice(0, 500)
            : []));
    var dto = {
        contractStamp: "dashboard-canonical-dto-production-current",
        summary,
        caseStats: {
            total: summary.totalCases,
            pending: summary.pendingCases,
            completed: summary.completedCases,
            statusRows: _c30A_(stats.statusRows) ? stats.statusRows : [],
            statusReadModelStamp: stats.statusReadModelStamp || DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT,
            statusCountStamp: stats.statusCountStamp || APP_DASHBOARD_STATUS_COUNT_STAMP,
            sourceRowCount: Number(stats.sourceRowCount ||
                stats.statusSourceRowCount ||
                summary.totalCases ||
                0),
            statusRowsTotal: Number(stats.statusRowsTotal || 0),
            rows: _c30A_(caseData.rows) ? caseData.rows : [],
            totalRecords: Number(caseData.totalRecords || summary.totalCases || 0),
            page: Number(caseData.page || 1),
            limit: Number(caseData.limit || 0),
        },
        typeStats: _c30A_(stats.byType) ? stats.byType : [],
        issueStats: _c30A_(stats.byTopic) ? stats.byTopic : [],
        trackingStats: stats.letters || {
            total: 0,
            notDue: 0,
            overdue: 0,
            received: 0,
            soonDue: 0,
        },
        meetingStats: canonicalMeetingStats,
        budgetStats: budgetData,
        charts: {
            byStatus: _c30A_(stats.statusRows) ? stats.statusRows : [],
            byType: _c30A_(stats.byType) ? stats.byType : [],
            byIssue: _c30A_(stats.byTopic) ? stats.byTopic : [],
            byMeetingResult: [],
        },
        meta: _appAssignObjects_({}, stats.meta || {}, cacheMeta || {}, {
            generatedAt: new Date().toISOString(),
            source: (stats.meta && stats.meta.source) ||
                "dashboard-canonical-dto-production-current",
            statusReadModelStamp: stats.statusReadModelStamp || DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT,
            statusCountStamp: stats.statusCountStamp || APP_DASHBOARD_STATUS_COUNT_STAMP,
            statusSourceRowCount: Number(stats.sourceRowCount ||
                stats.statusSourceRowCount ||
                summary.totalCases ||
                0),
            noSilentEmpty: !0,
        }),
    };
    return ((dto.errorState = dto.meta.errorCode
        ? {
            code: dto.meta.errorCode, message: dto.meta.message || ""
        }
        : null),
        dto);
}

function _dashboardBundleTtlSeconds_(payload) {
    var defaultTtl = _appIsFnName_("_appCacheTtl_")
        ? _appCacheTtl_("dashboardBundle", 240, 15, 300)
        : 240;
    return Math.max(15, Math.min(Number((payload && payload.cacheTtlSeconds) || defaultTtl) || defaultTtl, 300));
}

function _dashboardBuildSubBundles_(payload, stats, budget, cacheTtlSeconds) {
    payload = payload || {};
    var includeCases = payload.includeCases === !0, includeMeetingRows = payload.includeMeetingRows === !0, scopedCaseLimit = includeCases
        ? Math.max(10, Math.min(Number(payload.caseLimit || 30) || 30, 120))
        : 0, caseRows = includeCases
        ? _c30A_(stats.caseRows)
            ? stats.caseRows.slice(0, scopedCaseLimit)
            : _dashboardRequestRows_("MainData", {
                ttl: cacheTtlSeconds,
                failOnError: !0,
                allowEmpty: !0,
            }).slice(0, scopedCaseLimit)
        : [], budgetData = budget && budget.data ? budget.data : budget || {};
    return {
        caseData: {
            rows: caseRows,
            totalRecords: Number(stats.total || caseRows.length || 0),
            totalPages: 1,
            page: 1,
            limit: scopedCaseLimit,
        },
        caseRows,
        budgetData,
        includeCases,
        includeMeetingRows,
    };
}

function _dashboardPayloadStats_(stats, subBundles) {
    if (((stats = stats || {}),
        (subBundles = subBundles || {}),
        subBundles.includeCases !== !1 && subBundles.includeMeetingRows !== !1))
        return stats;
    var slim = _appAssignObjects_({}, stats);
    return (subBundles.includeCases === !1 &&
        ((slim.caseRows = []), (slim.letterRows = [])),
        subBundles.includeMeetingRows === !1 &&
            ((slim.meetingRows = []), (slim.meetingNoRows = [])),
        (slim.meta = _appAssignObjects_({}, stats.meta || {}, {
            dashboardFastFirstPaint: !0,
            caseRowsOmitted: subBundles.includeCases === !1,
            letterRowsOmitted: subBundles.includeCases === !1,
            meetingRowsOmitted: subBundles.includeMeetingRows === !1,
            rowPayloadMode: "summary-kpi-payload-phase5",
            routerFacadeOnly: !0,
        })),
        slim);
}

function _dashboardBundleMeta_(startedAt, cacheKey, source) {
    var bundleMetrics = typeof getRequestScopeMetrics_ == "function"
        ? getRequestScopeMetrics_()
        : {};
    return {
        cached: !1,
        cacheStatus: "miss",
        cacheHit: !(!bundleMetrics || !bundleMetrics.cacheHit),
        cacheHits: Number((bundleMetrics && bundleMetrics.cacheHits) || 0),
        cacheMisses: Number((bundleMetrics && bundleMetrics.cacheMisses) || 0),
        rowsRead: Number((bundleMetrics && bundleMetrics.rowsRead) || 0),
        cellsRead: Number((bundleMetrics && bundleMetrics.cellsRead) || 0),
        serviceReads: Number((bundleMetrics && bundleMetrics.serviceReads) || 0),
        projectedColumnsRead: Number((bundleMetrics && bundleMetrics.projectedColumnsRead) || 0),
        fullWidthColumnsAvoided: Number((bundleMetrics && bundleMetrics.fullWidthColumnsAvoided) || 0),
        projectionPlanHits: Number((bundleMetrics && bundleMetrics.projectionPlanHits) || 0),
        projectionPlanBuilds: Number((bundleMetrics && bundleMetrics.projectionPlanBuilds) || 0),
        projectionPlanDerivations: Number((bundleMetrics && bundleMetrics.projectionPlanDerivations) || 0),
        authoritativeEmptyReads: Number((bundleMetrics && bundleMetrics.authoritativeEmptyReads) || 0),
        fallbackReadsSuppressed: Number((bundleMetrics && bundleMetrics.fallbackReadsSuppressed) || 0),
        sheetCellsRead: (bundleMetrics && bundleMetrics.sheetCellsRead) || {},
        sheetServiceReads: (bundleMetrics && bundleMetrics.sheetServiceReads) || {},
        spreadsheetScanMode: "bounded-sparse-projection-hot-path-r161",
        durationMs: Math.max(0, Date.now() - startedAt),
        cacheKey,
        source: source || "dashboard-bundle-request-scope-current",
    };
}

function _dashboardBuildBundlePayload_(stats, subBundles, bundleMeta, cacheKey) {
    subBundles = subBundles || {};
    var caseRows = _c30A_(subBundles.caseRows) ? subBundles.caseRows : [], caseData = subBundles.caseData || {
        rows: caseRows
    }, budgetData = subBundles.budgetData || {}, payloadStats = _dashboardPayloadStats_(stats, subBundles), dashboardDto = _dashboardCanonicalBundleDto_(payloadStats, budgetData, caseData, bundleMeta);
    return {
        dashboardDto,
        contractStamp: dashboardDto.contractStamp,
        caseStats: dashboardDto.caseStats,
        typeStats: dashboardDto.typeStats,
        issueStats: dashboardDto.issueStats,
        trackingStats: dashboardDto.trackingStats,
        meetingStats: dashboardDto.meetingStats,
        charts: dashboardDto.charts,
        stats: payloadStats,
        summaryStats: payloadStats,
        budget: budgetData,
        budgetStats: budgetData,
        cases: caseData,
        rows: caseRows,
        letters: payloadStats.letters || {},
        meetings: payloadStats.meetings || {},
        meetingSummary: payloadStats.meetings || {},
        meetingRows: _c30A_(payloadStats.meetingRows)
            ? payloadStats.meetingRows
            : [],
        meetingNoRows: _c30A_(payloadStats.meetingNoRows)
            ? payloadStats.meetingNoRows
            : [],
        summary: {
            totalCases: Number(payloadStats.total || 0),
            pendingCases: Number(payloadStats.pending || 0),
            completedCases: Number(payloadStats.completed || 0),
            overdueLetters: Number(payloadStats.overdueLetters || 0),
            soonOverdue: Number(payloadStats.soonOverdue || 0),
            totalMeetings: Number((dashboardDto.summary && dashboardDto.summary.totalMeetings) || 0),
            recentMeetings: Number((dashboardDto.summary && dashboardDto.summary.recentMeetings) || 0),
            meetingItemTotal: Number((dashboardDto.summary && dashboardDto.summary.meetingItemTotal) || 0),
        },
        quickCounts: {
            total: Number(payloadStats.total || 0),
            byStatus: payloadStats.statusRows || [],
            byType: payloadStats.byType || [],
            byTopic: payloadStats.byTopic || [],
            generatedAt: new Date().toISOString(),
        },
        generatedAt: new Date().toISOString(),
        meta: _appAssignObjects_({}, payloadStats.meta || {}, bundleMeta),
        cached: !1,
        cacheStatus: "miss",
        cacheKey,
    };
}

function _dashboardBundleErrorCodeDASH2_(err, stage) {
    var msg = String((err && (err.error || err.message || err.msg)) || err || "").toLowerCase(), st = String(stage || "dashboard").toLowerCase();
    return /ไม่พบ\s*token|missing[-\s_]*token|no\s*token|token\s*การใช้งาน/.test(msg)
        ? "DASHBOARD_AUTH_MISSING"
        : /session\s*หมดอายุ|expired[-\s_]*session|session\s*expired|invalid\s*session|หมดอายุ/.test(msg)
            ? "DASHBOARD_SESSION_EXPIRED"
            : /สิทธิ์ไม่เพียงพอ|permission|forbidden|unauthori[sz]ed|access\s*denied/.test(msg)
                ? "DASHBOARD_PERMISSION_DENIED"
                : /cache/.test(st) || /cache/.test(msg)
                    ? "DASHBOARD_CACHE_READ_FAILED"
                    : /budget/.test(st)
                        ? "DASHBOARD_BUDGET_READ_FAILED"
                        : /sheet|spreadsheet|range|readsheet|ชีต|แผ่นงาน|ไม่พบชีต|rows|row/.test(msg) || /stats|case|letter|meeting|subbundle/.test(st)
                            ? "DASHBOARD_SHEET_READ_FAILED"
                            : /dto|normalize|bundle|build/.test(st)
                                ? "DASHBOARD_BUNDLE_BUILD_FAILED"
                                : "DASHBOARD_BUNDLE_FAILED";
}

function _dashboardBundleErrorMessageDASH2_(code, err) {
    var raw = String((err && (err.message || err.error || err.msg)) || err || "").trim();
    return code === "DASHBOARD_AUTH_MISSING"
        ? "Dashboard โหลดข้อมูลไม่สำเร็จ: ไม่พบ token การใช้งาน"
        : code === "DASHBOARD_SESSION_EXPIRED"
            ? "Dashboard โหลดข้อมูลไม่สำเร็จ: session หมดอายุ กรุณาเข้าสู่ระบบใหม่"
            : code === "DASHBOARD_PERMISSION_DENIED"
                ? "Dashboard โหลดข้อมูลไม่สำเร็จ: สิทธิ์ไม่เพียงพอ"
                : code === "DASHBOARD_CACHE_READ_FAILED"
                    ? "Dashboard โหลดข้อมูลต่อจาก cache ไม่สำเร็จ ระบบจะโหลดข้อมูลใหม่"
                    : code === "DASHBOARD_BUDGET_READ_FAILED"
                        ? "Dashboard โหลดข้อมูลงบประมาณไม่สำเร็จ"
                        : code === "DASHBOARD_SHEET_READ_FAILED"
                            ? "Dashboard อ่านข้อมูลจากชีตไม่สำเร็จ"
                            : code === "DASHBOARD_BUNDLE_BUILD_FAILED"
                                ? "Dashboard สร้างชุดข้อมูลไม่สำเร็จ"
                                : raw || "Dashboard โหลดข้อมูลไม่สำเร็จ";
}

function _dashboardBundleFailDASH2_(payload, code, err, stage, extra) {
    var now = new Date().toISOString(), message = _dashboardBundleErrorMessageDASH2_(code, err), stats = _dashboardEmptyStatsPayload_("dash2-" + String(code || "dashboard").toLowerCase());
    stats.meta = _appAssignObjects_({}, stats.meta || {}, {
        degraded: !0,
        dashboardErrorCode: code,
        errorCode: code,
        errorStage: String(stage || "dashboard"),
        message,
        generatedAt: now,
        owner: "DASH-2:dashboard-error-code",
    }, extra || {});
    var data = {
        stats,
        summaryStats: stats,
        budget: _dashboardEmptyBudgetPayload_("dash2-" + String(code || "dashboard").toLowerCase()),
        budgetStats: _dashboardEmptyBudgetPayload_("dash2-" + String(code || "dashboard").toLowerCase()),
        cases: {
            rows: []
        },
        rows: [],
        meetings: {},
        meetingSummary: {},
        generatedAt: now,
        meta: _appAssignObjects_({
            degraded: !0,
            dashboardErrorCode: code,
            errorCode: code,
            errorStage: String(stage || "dashboard"),
            message,
            generatedAt: now,
            owner: "DASH-2:dashboard-error-code",
        }, extra || {}),
    };
    ((data.dashboardDto = _dashboardCanonicalBundleDto_(stats, data.budgetStats, data.cases, data.meta)),
        (data.dashboardDto.meta = _appAssignObjects_({}, data.dashboardDto.meta || {}, data.meta || {})));
    var out = err_(message, data);
    return ((out.errorCode = code),
        (out.dashboardErrorCode = code),
        (out.errorStage = String(stage || "dashboard")),
        (out.requestId = _s_(payload && payload.requestId)),
        out);
}

function _dashboardBundleWarnDASH2_(label, err, meta) {
    try {
        _appIsFnName_("_logApiFailure_") && _logApiFailure_(label, err, meta || {});
    }
    catch (_dash2LogErr) {
        try {
            _c30W_("dashboard.dash2.log", _dash2LogErr);
        }
        catch (_ignore) {
            _ignore && String(_ignore);
        }
    }
}

function _dashboardBudgetFromBudgetDomain_(payload, authenticatedSession) {
    payload = _appAssignObjects_({}, payload || {}, {
        __dashboardBudgetHydrationIntegrated: !0,
        __dashboardSingleCompletePath: !0,
        source: String((payload && payload.source) || "dashboard-server-hot-path-budget-r161"),
        cacheTtlSeconds: Math.max(30, Math.min(Number((payload && payload.cacheTtlSeconds) || 240) || 240, 600)),
        limit: Math.max(10, Math.min(Number((payload && payload.budgetPlanLimit) || 30) || 30, 60)),
        pageSize: Math.max(10, Math.min(Number((payload && payload.budgetPlanLimit) || 30) || 30, 60)),
        budgetPlanLimit: Math.max(10, Math.min(Number((payload && payload.budgetPlanLimit) || 30) || 30, 60)),
        dashboardWorkflowLimit: Math.max(20, Math.min(Number((payload && payload.budgetWorkflowLimit) || 60) || 60, 120))
    });
    if (typeof _budgetGetDashboardSummaryForDashboardTrusted_ == "function" && authenticatedSession)
        return _budgetGetDashboardSummaryForDashboardTrusted_(payload, authenticatedSession);
    return typeof BudgetDomain != "undefined" && BudgetDomain && typeof BudgetDomain.getDashboardSummaryForDashboard == "function"
        ? BudgetDomain.getDashboardSummaryForDashboard(payload)
        : ok_(_dashboardEmptyBudgetPayload_("performance-f-budget-domain-owner-unavailable"), "ข้ามการโหลดงบประมาณ: BudgetDomain ยังไม่พร้อม");
}

function _dashboardPersistentSnapshotTarget_(payload, sess) {
    payload = payload || {};
    sess = sess || {};
    var summaryOnly = payload.includeCases !== !0 &&
        payload.includeMeetingRows !== !0 &&
        payload.includeReportOptions !== !0 &&
        payload.includeSchema !== !0 &&
        payload.includeHealth !== !0 &&
        !String(payload.reportQuery || payload.query || "").trim();
    if (!summaryOnly)
        return null;
    var role = String(sess.role || payload.userRole || "viewer").toLowerCase(), fy = String(payload.fy || payload.budgetFy || payload.defaultBudgetFY || "default");
    return {
        domain: "dashboard",
        targetKey: "summary|role=" + role + "|fy=" + fy + "|budget=" + (payload.includeBudget === !0 ? "1" : "0"),
        role: role
    };
}

function _dashboardBundleStats_(bundle) {
    bundle = bundle && bundle.data !== void 0 ? bundle.data : bundle || {};
    var dto = bundle.dashboardDto && typeof bundle.dashboardDto == "object" ? bundle.dashboardDto : {}, summary = dto.summary || {}, caseStats = dto.caseStats || {};
    return bundle.stats || bundle.summaryStats || {
        total: Number(summary.totalCases || caseStats.total || 0),
        byType: dto.typeStats || [],
        byTopic: dto.issueStats || [],
        statusRows: caseStats.statusRows || [],
        letters: dto.trackingStats || {},
        meetings: dto.meetingStats || {}
    };
}

function _dashboardBundleHasDashboardData_(bundle) {
    return _dashboardStatsHasDashboardData_(_dashboardBundleStats_(bundle));
}

function _dashboardCompactBundle_(data) {
    data = data || {};
    var dto = data.dashboardDto || _dashboardCanonicalBundleDto_(data.stats || data.summaryStats || {}, data.budgetStats || data.budget || {}, data.cases || { rows: data.rows || [] }, data.meta || {}), meta = _appAssignObjects_({}, data.meta || {}, dto.meta || {}, {
        payloadMode: "compact-canonical-dto-r162",
        compactDashboardPayload: !0,
        dashboardSingleCompletePath: !0,
        singleCompletePath: !0,
        completeData: !0,
        pendingHydration: !1,
        deferHydrationRequired: !1,
        separateBudgetHydration: !1
    });
    dto.meta = _appAssignObjects_({}, dto.meta || {}, meta);
    return {
        dashboardDto: dto,
        contractStamp: dto.contractStamp || data.contractStamp || "dashboard-canonical-dto-production-current",
        generatedAt: data.generatedAt || meta.generatedAt || new Date().toISOString(),
        pendingHydration: !1,
        dashboardSingleCompletePath: !0,
        completeData: !0,
        cached: !!data.cached,
        cacheStatus: data.cacheStatus || "miss",
        cacheKey: data.cacheKey || "",
        meta: meta
    };
}

function _dashboardStageTimer_() {
    var startedAt = Date.now(), stages = {
        authMs: 0,
        cacheReadMs: 0,
        persistentSnapshotMs: 0,
        persistentSnapshotWriteMs: 0,
        statsMs: 0,
        budgetMs: 0,
        subBundlesMs: 0,
        buildMs: 0,
        cacheWriteMs: 0,
        totalMs: 0,
        budgetHotPathHit: !1,
        sharedCacheHit: !1,
        persistentSnapshotHit: !1,
        compactPayload: !1,
        stamp: "dashboard-persistent-compact-stage-timing-r162"
    };
    return {
        stages: stages,
        measure: function (name, fn) {
            var stageStarted = Date.now();
            try {
                return fn();
            }
            finally {
                stages[name] = Math.max(0, Date.now() - stageStarted);
            }
        },
        finish: function () {
            stages.totalMs = Math.max(0, Date.now() - startedAt);
            return _appAssignObjects_({}, stages);
        }
    };
}

function _dashboardBudgetHotPathHit_(budgetResult) {
    try {
        var data = budgetResult && budgetResult.data !== void 0 ? budgetResult.data : budgetResult || {};
        return !!(data && data.meta && data.meta.budgetHotPathHit);
    }
    catch (_e) {
        return !1;
    }
}

function _dashboardBudgetHasDataD_(bundle) {
    try {
        var data = bundle && bundle.data !== void 0 ? bundle.data : bundle || {}, dto = data.dashboardDto && typeof data.dashboardDto === "object" ? data.dashboardDto : {}, budget = data.budgetStats || data.budget || data.dashboardBudget || dto.budgetStats || {}, guard = 0;
        while (budget && typeof budget === "object" && !Array.isArray(budget) && guard++ < 8) {
            if (budget.budgetStats) { budget = budget.budgetStats; continue; }
            if (budget.dashboardBudget) { budget = budget.dashboardBudget; continue; }
            if (budget.budget) { budget = budget.budget; continue; }
            if (budget.data && typeof budget.data === "object" && !Array.isArray(budget.data) && (budget.data.budgetStats || budget.data.overviewSection || budget.data.segments || budget.data.rows || budget.data.byPlan || budget.data.plans)) { budget = budget.data; continue; }
            break;
        }
        var segments = budget && budget.segments || {}, overview = budget && budget.overviewSection || segments.overview || {}, workflow = budget && budget.workflowSection || segments.workflow || {}, reportSection = budget && budget.reportSection || segments.report || {}, totals = budget && budget.grandTotals || budget && budget.totals || overview.totals || {}, all = totals.all || totals || {};
        function numberValue(value) {
            value = Number(String(value == null ? "" : value).replace(/[^0-9.\-]/g, ""));
            return isFinite(value) ? value : 0;
        }
        function hasRows(value) {
            return Array.isArray(value) && value.length > 0;
        }
        var status = budget && budget.statusSummary || budget && budget.workflow || budget && budget.budgetWorkflow || budget && budget.workflowSummary || workflow.summary || {}, refund = status.refund || status.refundSummary || {}, report = status.report || status.reportSummary || {};
        return !!(numberValue(budget && budget.totalBudget) || numberValue(budget && budget.totalPaid) || numberValue(budget && budget.totalExpense) || numberValue(budget && budget.totalRemain) || numberValue(budget && budget.totalRemaining) || numberValue(all.budget) || numberValue(all.totalBudget) || numberValue(all.spent) || numberValue(all.totalPaid) || numberValue(all.remain) || numberValue(all.totalRemain) || numberValue(overview.totalBudget) || numberValue(overview.totalPaid) || numberValue(overview.totalRemain) || hasRows(budget && budget.byPlan) || hasRows(budget && budget.plans) || hasRows(budget && budget.rows) || hasRows(budget && budget.details) || hasRows(overview.rows) || hasRows(reportSection.rows) || hasRows(budget && budget.workflowRows) || hasRows(budget && budget.statusRows) || hasRows(workflow.rows) || numberValue(refund.total) || numberValue(report.total) || numberValue(status.refundTotal) || numberValue(status.reportTotal));
    }
    catch (_budgetHasErr) {
        return !1;
    }
}

function _dashboardBundleContextD_(payload) {
    payload = payload || {};
    payload.includeBudget = payload.permissionIncludeBudget === !1 ? !1 : payload.includeBudget !== !1;
    payload.includeCases = payload.includeCases === !0;
    payload.includeMeetingRows = payload.includeMeetingRows === !0;
    payload.phase1FirstPaint = !1;
    payload.phase1LazyHydration = !1;
    payload.dashboardSingleCompletePath = !0;
    payload.hotPathMode = "dashboard-persistent-compact-snapshot-g-r162";
    var stageTimer = _dashboardStageTimer_();
    return {
        payload: payload,
        startedAt: Date.now(),
        stageTimer: stageTimer,
        stages: stageTimer.stages,
        owner: "DashboardDomain.bundlePipelineD.r175",
        sess: null,
        cacheTtlSeconds: 0,
        sharedKey: "",
        cacheKey: "",
        persistentTarget: null
    };
}

function _dashboardBundleAttachStagesD_(ctx, target) {
    var finalStages = ctx.stageTimer.finish();
    target = target && typeof target == "object" ? target : {};
    target.meta = _appAssignObjects_({}, target.meta || {}, {
        dashboardStageTimings: finalStages,
        performanceFServerHotPath: !0,
        performanceGPersistentSnapshot: !0
    });
    target.dashboardDto && (target.dashboardDto.meta = _appAssignObjects_({}, target.dashboardDto.meta || {}, target.meta || {}));
    return target;
}

function _dashboardBundleInitializeD_(ctx) {
    try {
        ctx.sess = ctx.stageTimer.measure("authMs", function () {
            return requireAuth_(ctx.payload, "viewer");
        });
    }
    catch (authErr) {
        var authCode = _dashboardBundleErrorCodeDASH2_(authErr, "auth");
        _dashboardBundleWarnDASH2_("dashboard.bundle.auth.failure", authErr, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "", errorCode: authCode });
        return _dashboardBundleFailDASH2_(ctx.payload, authCode, authErr, "auth", { dashboardStageTimings: ctx.stageTimer.finish() });
    }
    ctx.cacheTtlSeconds = _dashboardBundleTtlSeconds_(ctx.payload);
    ctx.sharedKey = _appIsFnName_("_dashboardSharedBundleCacheKey_") ? _dashboardSharedBundleCacheKey_(ctx.payload, ctx.sess) : "";
    ctx.cacheKey = ctx.sharedKey || ("dash_bundle_server_hot_path_r162_" + _dashboardBundleCacheKey_(ctx.payload, ctx.sess));
    ctx.persistentTarget = _dashboardPersistentSnapshotTarget_(ctx.payload, ctx.sess);
    return null;
}

function _dashboardBundleCacheAllowedD_(ctx) {
    return ctx.payload.forceFresh !== !0 && ctx.payload.noCache !== !0 && ctx.payload.bypassCache !== !0;
}

function _dashboardBundleTryCacheD_(ctx) {
    if (!_dashboardBundleCacheAllowedD_(ctx))
        return null;
    try {
        var cachedBundle = ctx.stageTimer.measure("cacheReadMs", function () {
            return _cacheGetJson_(ctx.cacheKey);
        });
        if (cachedBundle && _dashboardBundleHasDashboardData_(cachedBundle) && (ctx.payload.includeBudget !== !0 || _dashboardBudgetHasDataD_(cachedBundle))) {
            ctx.stages.sharedCacheHit = !!ctx.sharedKey;
            cachedBundle.cached = !0;
            cachedBundle.cacheStatus = "hit";
            cachedBundle.cacheKey = ctx.cacheKey;
            cachedBundle.meta = _appAssignObjects_({}, cachedBundle.meta || {}, {
                cached: !0,
                cacheStatus: "hit",
                cacheHit: !0,
                sharedCacheHit: !!ctx.sharedKey,
                cacheKey: ctx.cacheKey,
                durationMs: Math.max(0, Date.now() - ctx.startedAt),
                rowsRead: 0,
                source: ctx.sharedKey ? "dashboard-bundle-shared-summary-cache-r162" : "dashboard-bundle-server-hot-path-cache-r162",
                dashboardSingleCompletePath: !0,
                singleCompletePath: !0,
                completeData: !0,
                pendingHydration: !1,
                deferHydrationRequired: !1,
                separateBudgetHydration: !1,
                dashboardErrorCode: "",
                errorCode: ""
            });
            cachedBundle.dashboardDto ? (cachedBundle.dashboardDto.meta = _appAssignObjects_({}, cachedBundle.dashboardDto.meta || {}, cachedBundle.meta || {})) : (cachedBundle.dashboardDto = _dashboardCanonicalBundleDto_(cachedBundle.stats || cachedBundle.summaryStats || {}, cachedBundle.budgetStats || cachedBundle.budget || {}, cachedBundle.cases || { rows: cachedBundle.rows || [] }, cachedBundle.meta));
            _dashboardBundleAttachStagesD_(ctx, cachedBundle);
            return ok_(cachedBundle, "โหลด dashboard bundle สำเร็จ");
        }
        if (cachedBundle && ctx.payload.includeBudget === !0 && !_dashboardBudgetHasDataD_(cachedBundle))
            ctx.payload.__dashboardBudgetCacheMissCurrent = !0;
    }
    catch (cacheErr) {
        var cacheCode = _dashboardBundleErrorCodeDASH2_(cacheErr, "cache-read");
        _dashboardBundleWarnDASH2_("dashboard.bundle.cache.read.failure", cacheErr, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "", errorCode: cacheCode, cacheKey: ctx.cacheKey });
        ctx.payload.__dashboardCacheReadErrorCode = cacheCode;
    }
    return null;
}

function _dashboardBundleTryPersistentD_(ctx) {
    if (!ctx.persistentTarget || !_dashboardBundleCacheAllowedD_(ctx) || !_appIsFnName_("_persistentSummarySnapshotRead_"))
        return null;
    try {
        var persistentRead = ctx.stageTimer.measure("persistentSnapshotMs", function () {
            return _persistentSummarySnapshotRead_(ctx.persistentTarget.domain, ctx.persistentTarget.targetKey, ctx.persistentTarget.role, { requestId: ctx.payload.requestId || "" });
        });
        if (persistentRead && persistentRead.ok && persistentRead.bundle && _dashboardBundleHasDashboardData_(persistentRead.bundle) && _dashboardBudgetHasDataD_(persistentRead.bundle)) {
            ctx.stages.persistentSnapshotHit = !0;
            var persistentBundle = _dashboardCompactBundle_(persistentRead.bundle);
            persistentBundle.cached = !0;
            persistentBundle.cacheStatus = "persistent-hit";
            persistentBundle.cacheKey = ctx.cacheKey;
            persistentBundle.meta = _appAssignObjects_({}, persistentBundle.meta || {}, persistentRead.meta || {}, {
                cached: !0,
                cacheHit: !0,
                sharedCacheHit: !!ctx.sharedKey,
                persistentSnapshotHit: !0,
                source: "dashboard-persistent-compact-snapshot-r162",
                durationMs: Math.max(0, Date.now() - ctx.startedAt)
            });
            persistentBundle.dashboardDto && (persistentBundle.dashboardDto.meta = _appAssignObjects_({}, persistentBundle.dashboardDto.meta || {}, persistentBundle.meta || {}));
            try {
                _cachePutJson_(ctx.cacheKey, persistentBundle, ctx.cacheTtlSeconds);
            }
            catch (_persistentCacheWarmErr) {
                _c30W_("dashboard.persistent.cacheWarm", _persistentCacheWarmErr);
            }
            _dashboardBundleAttachStagesD_(ctx, persistentBundle);
            return ok_(persistentBundle, "โหลด dashboard bundle จาก persistent snapshot สำเร็จ");
        }
    }
    catch (_persistentReadErr) {
        _dashboardBundleWarnDASH2_("dashboard.bundle.persistent.read.failure", _persistentReadErr, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "" });
    }
    return null;
}

function _dashboardBundleBuildFreshD_(ctx) {
    var stats;
    try {
        stats = ctx.stageTimer.measure("statsMs", function () {
            return _dashboardStats_(ctx.payload);
        });
    }
    catch (statsErr) {
        var statsCode = _dashboardBundleErrorCodeDASH2_(statsErr, "stats-sheet-read");
        _dashboardBundleWarnDASH2_("dashboard.bundle.stats.failure", statsErr, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "", errorCode: statsCode });
        return _dashboardBundleFailDASH2_(ctx.payload, statsCode, statsErr, "stats-sheet-read", { dashboardStageTimings: ctx.stageTimer.finish() });
    }
    var budgetResult;
    try {
        budgetResult = ctx.stageTimer.measure("budgetMs", function () {
            return ctx.payload.includeBudget === !0 ? _dashboardBudgetFromBudgetDomain_(ctx.payload, ctx.sess) : ok_({}, "ข้ามการโหลดงบประมาณ");
        });
        ctx.stages.budgetHotPathHit = _dashboardBudgetHotPathHit_(budgetResult);
    }
    catch (budgetErr) {
        var budgetCode = _dashboardBundleErrorCodeDASH2_(budgetErr, "budget-read");
        _dashboardBundleWarnDASH2_("dashboard.bundle.budget.failure", budgetErr, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "", errorCode: budgetCode });
        budgetResult = err_(_dashboardBundleErrorMessageDASH2_(budgetCode, budgetErr), _dashboardEmptyBudgetPayload_("performance-f-budget-read-failed"));
        budgetResult.errorCode = budgetCode;
    }
    var subBundles;
    try {
        subBundles = ctx.stageTimer.measure("subBundlesMs", function () {
            return _dashboardBuildSubBundles_(ctx.payload, stats, budgetResult, ctx.cacheTtlSeconds);
        });
    }
    catch (subErr) {
        var subCode = _dashboardBundleErrorCodeDASH2_(subErr, "subbundle-sheet-read");
        _dashboardBundleWarnDASH2_("dashboard.bundle.subbundle.failure", subErr, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "", errorCode: subCode });
        return _dashboardBundleFailDASH2_(ctx.payload, subCode, subErr, "subbundle-sheet-read", { dashboardStageTimings: ctx.stageTimer.finish() });
    }
    var bundleMeta = _dashboardBundleMeta_(ctx.startedAt, ctx.cacheKey, "dashboard-persistent-compact-snapshot-r162");
    bundleMeta.includeBudget = ctx.payload.includeBudget === !0;
    bundleMeta.includeCases = ctx.payload.includeCases === !0;
    bundleMeta.hotPathMode = "dashboard-persistent-compact-snapshot-g-r162";
    bundleMeta.initialSingleBundle = !0;
    bundleMeta.dataLoadingPerformance = !0;
    bundleMeta.dashboardSingleCompletePath = !0;
    bundleMeta.singleCompletePath = !0;
    bundleMeta.completeData = !(budgetResult && budgetResult.ok === !1);
    bundleMeta.budgetIntegrated = !0;
    bundleMeta.separateBudgetHydration = !1;
    bundleMeta.pendingHydration = !1;
    bundleMeta.deferHydrationRequired = !1;
    bundleMeta.dashboardApiCallPlan = "apiGetDashboardBundle:1";
    bundleMeta.performanceTargetMs = 5000;
    bundleMeta.performanceFServerHotPath = !0;
    bundleMeta.performanceGPersistentSnapshot = !0;
    bundleMeta.sharedSummaryCache = !!ctx.sharedKey;
    bundleMeta.budgetHotPathHit = ctx.stages.budgetHotPathHit;
    ctx.payload.__dashboardCacheReadErrorCode && (bundleMeta.cacheReadWarningCode = ctx.payload.__dashboardCacheReadErrorCode);
    ctx.payload.__dashboardBudgetCacheMissCurrent && (bundleMeta.budgetCacheBypassReason = "cached-bundle-missing-budget-r81");
    budgetResult && budgetResult.errorCode && (bundleMeta.budgetWarningCode = budgetResult.errorCode);
    var data;
    try {
        data = ctx.stageTimer.measure("buildMs", function () {
            var built = _dashboardBuildBundlePayload_(stats, subBundles, bundleMeta, ctx.cacheKey);
            if (ctx.persistentTarget) {
                ctx.stages.compactPayload = !0;
                return _dashboardCompactBundle_(built);
            }
            return built;
        });
        data.pendingHydration = !1;
        data.dashboardSingleCompletePath = !0;
        data.meta = _appAssignObjects_({}, data.meta || {}, bundleMeta);
        data.dashboardDto && (data.dashboardDto.meta = _appAssignObjects_({}, data.dashboardDto.meta || {}, bundleMeta));
    }
    catch (buildErr) {
        var buildCode = _dashboardBundleErrorCodeDASH2_(buildErr, "bundle-build");
        _dashboardBundleWarnDASH2_("dashboard.bundle.build.failure", buildErr, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "", errorCode: buildCode });
        return _dashboardBundleFailDASH2_(ctx.payload, buildCode, buildErr, "bundle-build", { dashboardStageTimings: ctx.stageTimer.finish() });
    }
    try {
        ctx.stageTimer.measure("cacheWriteMs", function () {
            if ((ctx.payload.includeBudget !== !0 || _dashboardBudgetHasDataD_(data)) && _dashboardBundleHasDashboardData_(data))
                _cachePutJson_(ctx.cacheKey, data, ctx.cacheTtlSeconds);
            return !0;
        });
    }
    catch (cacheWriteErr) {
        _dashboardBundleWarnDASH2_("dashboard.bundle.cache.write.failure", cacheWriteErr, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "", errorCode: "DASHBOARD_CACHE_WRITE_FAILED", cacheKey: ctx.cacheKey });
        data.meta = _appAssignObjects_({}, data.meta || {}, { cacheWriteWarningCode: "DASHBOARD_CACHE_WRITE_FAILED" });
    }
    if (ctx.persistentTarget && _appIsFnName_("_persistentSummarySnapshotWrite_") && _dashboardBundleHasDashboardData_(data) && _dashboardBudgetHasDataD_(data))
        try {
            var persistentWrite = ctx.stageTimer.measure("persistentSnapshotWriteMs", function () {
                return _persistentSummarySnapshotWrite_(ctx.persistentTarget.domain, ctx.persistentTarget.targetKey, ctx.persistentTarget.role, _dashboardCompactBundle_(data), {
                    ttlSeconds: 1800,
                    source: "apiGetDashboardBundle.performanceG.r162",
                    cacheKey: ctx.cacheKey
                });
            });
            data.meta = _appAssignObjects_({}, data.meta || {}, {
                persistentSnapshotStored: !!(persistentWrite && persistentWrite.stored),
                persistentSnapshotKey: String(persistentWrite && persistentWrite.snapshotKey || ""),
                persistentSnapshotChunks: Number(persistentWrite && persistentWrite.chunks || 0) || 0
            });
            data.dashboardDto && (data.dashboardDto.meta = _appAssignObjects_({}, data.dashboardDto.meta || {}, data.meta || {}));
        }
        catch (_persistentWriteErr) {
            _dashboardBundleWarnDASH2_("dashboard.bundle.persistent.write.failure", _persistentWriteErr, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "" });
        }
    _dashboardBundleAttachStagesD_(ctx, data);
    return ok_(data, "โหลด dashboard bundle สำเร็จ");
}

function _apiGetDashboardBundleCore_(payload) {
    var ctx = _dashboardBundleContextD_(payload);
    try {
        var failure = _dashboardBundleInitializeD_(ctx);
        if (failure)
            return failure;
        var cached = _dashboardBundleTryCacheD_(ctx);
        if (cached)
            return cached;
        var persistent = _dashboardBundleTryPersistentD_(ctx);
        if (persistent)
            return persistent;
        return _dashboardBundleBuildFreshD_(ctx);
    }
    catch (e) {
        var code = _dashboardBundleErrorCodeDASH2_(e, "bundle");
        _dashboardBundleWarnDASH2_("dashboard.bundle.current.failure", e, { method: "apiGetDashboardBundle", requestId: ctx.payload.requestId || "", errorCode: code });
        return _dashboardBundleFailDASH2_(ctx.payload, code, e, "bundle", { dashboardStageTimings: ctx.stageTimer.finish() });
    }
}

function _dashboardHotRowsReturned_(res) {
    var data = res && res.data && typeof res.data == "object" ? res.data : res || {}, rows = _c30A_(data.rows)
        ? data.rows
        : _c30A_(data.cases && data.cases.rows)
            ? data.cases.rows
            : _c30A_(data.items)
                ? data.items
                : [];
    return rows.length;
}

function _dashboardHotAttachMeta_(res, payload, started) {
    res = res && typeof res == "object" ? res : {
        ok: !1, data: {}
    };
    var data = res.data && typeof res.data == "object" && !_c30A_(res.data)
        ? res.data
        : res, rowsReturned = _dashboardHotRowsReturned_(res), baseMeta = data.meta || res.meta || {}, meta = _appAssignObjects_({}, baseMeta, {
        method: "apiGetDashboardBundle",
        readModel: DASHBOARD_HOT_READ_MODEL_STAMP,
        readModelOwner: "Code_30_Domain_Cases.dashboardBundleReadModelOverlay",
        durationMs: Math.max(0, Date.now() - Number(started || Date.now())),
        rowsRead: Number(baseMeta.rowsRead || data.rowsRead || rowsReturned || 0) || 0,
        rowsReturned,
        cacheHit: !!(baseMeta.cacheHit ||
            data.cacheHit ||
            res.cacheHit ||
            data.cached ||
            res.cached),
        cacheStatus: String(baseMeta.cacheStatus || data.cacheStatus || res.cacheStatus || "live"),
        source: "apiGetDashboardBundle.readModelOverlay",
    });
    return ((data.meta = meta),
        (data.readModel = DASHBOARD_HOT_READ_MODEL_STAMP),
        (data.rowsReturned = rowsReturned),
        (data.rowsRead = meta.rowsRead),
        (data.cacheHit = meta.cacheHit),
        (data.cacheStatus = meta.cacheStatus),
        (res.meta = _appAssignObjects_({}, res.meta || {}, meta)),
        (res.readModel = DASHBOARD_HOT_READ_MODEL_STAMP),
        (res.rowsReturned = rowsReturned),
        (res.rowsRead = meta.rowsRead),
        (res.cacheHit = meta.cacheHit),
        (res.cacheStatus = meta.cacheStatus),
        res);
}
