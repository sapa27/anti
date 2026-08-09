/**
 * P0/P1 CONSOLIDATION FREEZE — 2026-07-24 r154
 * This file is frozen against new phases, transports, API owners, read models,
 * hot paths, and compatibility fallbacks. Allowed changes: defect fixes,
 * read-only audits, migration guards, deletion, and consolidation only.
 * Canonical relation key for MeetingLogs and Letters is "ลำดับเรื่อง".
 */
function _caseAliasListCurrent_(field) {
    if (typeof getAppFieldAliasList_ == "function") {
        var list = getAppFieldAliasList_("MainData", field);
        if (Array.isArray(list) && list.length)
            return list;
    }
    return [String(field || "")];
}

var __APP_GLOBAL__ = (typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__) ||
    (typeof globalThis != "undefined" && globalThis) ||
    this ||
    {}, AppDomain = (__APP_GLOBAL__.AppDomain = __APP_GLOBAL__.AppDomain || {}), CaseDomain = (__APP_GLOBAL__.CaseDomain = __APP_GLOBAL__.CaseDomain || {}), TrackingDomain = (__APP_GLOBAL__.TrackingDomain =
    __APP_GLOBAL__.TrackingDomain || {}), MeetingDomain = (__APP_GLOBAL__.MeetingDomain =
    __APP_GLOBAL__.MeetingDomain || {}), DashboardDomain = (__APP_GLOBAL__.DashboardDomain =
    __APP_GLOBAL__.DashboardDomain || {}), CASE_DOMAIN_SAFETY_FREEZE_STAMP_CURRENT = "case-domain-p0-safety-freeze-2026-07-24-r154", CASE_DOMAIN_PRIMARY_KEY_MIGRATION_STAMP_CURRENT = "case-domain-primary-key-migration-2026-07-24-r154", CASE_PRIMARY_KEY_MIGRATION_CONFIRMATION = "MIGRATE_PRIMARY_KEY_ONE_TO_ONE", CASE_PRIMARY_KEY_MIGRATION_STATE_PROPERTY = "CASE_PRIMARY_KEY_MIGRATION_STATE", CASE_DOMAIN_DTO_REFACTOR_STAMP = "case-domain-dto-no-envelope-refactor-2026-06-15", CASE_DOMAIN_OWNER_STAMP_CURRENT = "domain-owner-current-r253", CASE_DOMAIN_BOUNDARY_STAMP_CURRENT = "c5-case-tracking-meeting-domain-owner-current", CASE_DOMAIN_PHYSICAL_STAMP_CURRENT = "c5-domain-physical-owner-lock-current", _CDO_ = "Code_30_Domain_Cases", _CWR_ = [
    "apiSaveCase", "apiDeleteCase"
], _TWR_ = [
    "apiSaveLetter", "apiDeleteLetter"
], _MWR_ = [
    "apiSaveMeetingLog",
    "apiDeleteMeetingLog",
    "apiSaveCommitteeMeetingSystem",
    "apiDeleteCommitteeMeetingSystem",
], _C30K_CASE_NUM_ = _caseAliasListCurrent_("caseNum"), _C30K_PENDING_REASON_ = _caseAliasListCurrent_("pendingRemark"), _C30K_PETITIONER_PHONE_ = _caseAliasListCurrent_("petitionerPhone"), _C30K_SENT_AGENCY_ = _caseAliasListCurrent_("sentAgency"), _C30K_CO_ASSIGNEES_ = _caseAliasListCurrent_("coAssignees"), _C30K_SUBCOMMITTEE_NAME_ = _caseAliasListCurrent_("subcommitteeName"), _C30K_CASE_TITLE_ = _caseAliasListCurrent_("caseTitle"), _C30K_TITLE_ = _caseAliasListCurrent_("title"), _C30K_PETITIONERS_ = _caseAliasListCurrent_("petitioners"), _C30K_OFFER_DATE_ = _caseAliasListCurrent_("offerDate"), _C30K_CLOSED_REASON_ = _caseAliasListCurrent_("closedReason"), _C30K_RESPONDENT_ = _caseAliasListCurrent_("respondent"), _C30K_STAFFS_ = _caseAliasListCurrent_("staffs"), _C30K_RESPONDENT_SPACED_ = _caseAliasListCurrent_("respondent"), _C30K_CANONICAL_REPORT_BASE_ = [
    "caseId",
    "id",
    "caseNum",
    "caseNo",
    "runningNo",
    "recNo",
    "receiveNo",
    "title",
    "subject",
    "caseTitle",
    "considerationTitle",
    "petitioners",
    "petitionerName",
    "status",
    "cat",
    "subCat",
    "assignees",
    "staffs",
    "coAssignees",
    "agencyName",
    "respondent",
    "recDate",
    "recDateText",
    "receiveDate",
    "receiveDateText",
    "type",
    "typeLabel",
    "ลำดับเรื่อง",
    "เลขรับเรื่อง",
    "วันที่รับเรื่อง",
    "ชื่อเรื่องพิจารณา (ถ้ามี)",
    "ผู้เสนอญัตติ/ผู้ร้อง",
];

function _s_(v) {
    return String(v || "");
}
function _a_(v) {
    return _c30A_(v) ? v.slice() : [];
}
function _cm_(o) {
    return _appAssignObjects_({
        uiDomChanged: !1, businessLogicChanged: !1
    }, o || {});
}
function _c30S_(v) {
    return String(v == null ? "" : v);
}
function _c30W_(k, e, c) {
    return _appIsFnName_("_recordWarning_") && _recordWarning_(k, e, c);
}
function _c30A_(v) {
    return Array.isArray(v);
}
var DOMAIN_CONSOLIDATION_STAMP_CURRENT = "domain-status-consolidation-current-r253";
function _domainStatus_(domain, name, extra) {
    var out = {
        ok: !0,
        owner: name,
        phase5: domain.OWNER_CONTRACT_CURRENT,
        uiDomChanged: !1,
        businessLogicChanged: !1,
        phaseCStamp: DOMAIN_CONSOLIDATION_STAMP_CURRENT,
    };
    (domain.BOUNDARY && (out.boundary = domain.BOUNDARY),
        domain.PHYSICAL && (out.physical = domain.PHYSICAL),
        domain.VERSION && (out.version = domain.VERSION),
        (domain.BOUNDARY || domain.PHYSICAL) &&
            ((out.stamp = CASE_DOMAIN_PHYSICAL_STAMP_CURRENT),
                (out.boundaryStamp = CASE_DOMAIN_BOUNDARY_STAMP_CURRENT)));
    return _appAssignObjects_(out, extra || {});
}
function _domainConsolidationContract_() {
    return _cm_({
        ok: !0,
        stamp: DOMAIN_CONSOLIDATION_STAMP_CURRENT,
        owner: _CDO_,
        consolidated: [
            "CaseDomain.status",
            "TrackingDomain.status",
            "MeetingDomain.status",
            "DashboardDomain.status",
        ],
        singleStatusFactory: "_domainStatus_",
        apiNamesPreserved: !0,
        noNewFiles: !0,
    });
}
var CODE30_MAPPER_DEDUP_STAMP_CURRENT = "status-mapper-dedup-current-r253";
function _caseStatusNormalize_(value, opts) {
    opts = opts || {};
    var fallback = String(opts.defaultStatus || "เรื่องเข้าใหม่"), raw = _c30S_(value).trim(), compact = raw.replace(/\s+/g, "");
    try {
        if (typeof AppBackendCore != "undefined" &&
            AppBackendCore &&
            typeof AppBackendCore.normalizeCaseStatus == "function") {
            var normalized = AppBackendCore.normalizeCaseStatus(raw, {
                defaultStatus: fallback,
                strict: opts.strict === !0,
            });
            if (normalized)
                return normalized;
        }
    }
    catch (_statusNormalizeErr) {
        _c30W_(String(opts.warningKey || "case.status.phaseD"), _statusNormalizeErr, {
            value: value,
        });
    }
    return !compact
        ? fallback
        : /^(รับเรื่อง|ได้รับเรื่อง|เรื่องใหม่|รับเข้า|รับ)$/.test(compact)
            ? "เรื่องเข้าใหม่"
            : /^(อยู่ระหว่างดำเนินการ|รอติดตาม)$/.test(compact)
                ? "รอพิจารณา"
                : raw || fallback;
}
function _code30MapperDedupContract_() {
    return _cm_({
        ok: !0,
        stamp: CODE30_MAPPER_DEDUP_STAMP_CURRENT,
        owner: _CDO_,
        consolidated: [
            "_caseNormalizeStatusForDisplay_",
            "_caseReportStatus_",
            "_dashboardNormalizeCaseStatusForCount_",
        ],
        singleStatusMapper: "_caseStatusNormalize_",
        apiNamesPreserved: !0,
        noNewFiles: !0,
        uiDomChanged: !1,
        businessLogicChanged: !1,
    });
}
var CODE30_ROW_DATE_MAPPER_DEDUP_STAMP_CURRENT = "row-date-mapper-dedup-current-r253";
function _caseD2Pad2_(value) {
    return String(Number(value) || 0).padStart(2, "0");
}
function _caseD2ThaiYear_(year) {
    year = Number(_c30S_(year).replace(/[^0-9]/g, "")) || 0;
    return year
        ? year >= 3600 && year <= 3700
            ? year - 1086
            : year >= 3e3 && year <= 3200
                ? year - 543
                : year < 100
                    ? year + 2500
                    : year < 2400
                        ? year + 543
                        : year
        : 0;
}
function _caseD2CivilYear_(year) {
    year = _caseD2ThaiYear_(year);
    return year > 2400 ? year - 543 : year;
}
function _caseDateOnly_(value) {
    if (value == null || value === "")
        return null;
    try {
        var d = null;
        if (Object.prototype.toString.call(value) === "[object Date]" &&
            !isNaN(value.getTime()))
            d = new Date(value.getFullYear(), value.getMonth(), value.getDate());
        else if (typeof value === "number" &&
            isFinite(value) &&
            value > 2e4 &&
            value < 4e5) {
            var serial = new Date(Math.round(864e5 * (value - 25569)));
            d = new Date(serial.getUTCFullYear(), serial.getUTCMonth(), serial.getUTCDate());
        }
        else {
            var text = _c30S_(value)
                .replace(/^'+/, "")
                .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "")
                .trim();
            if (!text)
                return null;
            if (/^\d+(?:\.0+)?$/.test(text)) {
                var serialNumber = Number(text);
                if (isFinite(serialNumber) &&
                    serialNumber > 2e4 &&
                    serialNumber < 4e5) {
                    var serialText = new Date(Math.round(864e5 * (serialNumber - 25569)));
                    d = new Date(serialText.getUTCFullYear(), serialText.getUTCMonth(), serialText.getUTCDate());
                }
            }
            if (!d) {
                var iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s]|$)/);
                if (iso)
                    d = new Date(_caseD2CivilYear_(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
                else {
                    var th = text.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
                    if (th)
                        d = new Date(_caseD2CivilYear_(th[3]), Number(th[2]) - 1, Number(th[1]));
                    else if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s/i.test(text) ||
                        /GMT[+-]\d{4}|เวลาอินโดจีน|^[A-Z][a-z]{2}\s+[A-Z][a-z]{2}\s+\d{1,2}\s+\d{4}/.test(text)) {
                        var parsed = new Date(text
                            .replace(/\s*\(.*?\)\s*/g, " ")
                            .replace(/เวลาอินโดจีน/g, "")
                            .trim());
                        if (!isNaN(parsed.getTime()))
                            d = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
                    }
                    else {
                        var parsed2 = new Date(text);
                        if (!isNaN(parsed2.getTime()))
                            d = new Date(parsed2.getFullYear(), parsed2.getMonth(), parsed2.getDate());
                    }
                }
            }
        }
        if (!d || isNaN(d.getTime()))
            return null;
        d.getFullYear() > 2400 &&
            (d = new Date(d.getFullYear() - 543, d.getMonth(), d.getDate()));
        return (d.setHours(0, 0, 0, 0), d);
    }
    catch (_dateOnlyNormalizeErr) {
        return (_c30W_("case.date.phaseD2", _dateOnlyNormalizeErr, {
            value: value
        }),
            null);
    }
}
function _caseDateText_(value, opts) {
    opts = opts || {};
    if (value == null || value === "")
        return "";
    var d = _caseDateOnly_(value);
    if (d) {
        var be = d.getFullYear() < 2400 ? d.getFullYear() + 543 : d.getFullYear();
        return (_caseD2Pad2_(d.getDate()) +
            "/" +
            _caseD2Pad2_(d.getMonth() + 1) +
            "/" +
            String(be));
    }
    var raw = _c30S_(value).trim();
    return opts.preserveRaw === !0 ? raw : "";
}
function _caseRowPick_(row, aliases, defaultValue) {
    ((row = row || {}), (aliases = _c30A_(aliases) ? aliases : [
        aliases
    ]));
    for (var i = 0; i < aliases.length; i += 1) {
        var key = aliases[i];
        if (key &&
            _appHasOwnProperty_(row, key) &&
            row[key] != null &&
            String(row[key]).trim() !== "")
            return row[key];
    }
    return defaultValue == null ? "" : defaultValue;
}
function _code30RowDateMapperDedupContract_() {
    return _cm_({
        ok: !0,
        stamp: CODE30_ROW_DATE_MAPPER_DEDUP_STAMP_CURRENT,
        owner: _CDO_,
        consolidated: [
            "_committeeMeetingDateText_",
            "_caseDateOnly_",
            "_normalizeLetterDateFromFields_",
        ],
        retiredThinDateAdapters: [
            "_trackingDateOnly_",
            "_trackingDueDateOnly_",
            "_dashboardDate_",
        ],
        singleDateMapper: "_caseDateText_/_caseDateOnly_",
        singleRowPicker: "_caseRowPick_",
        apiNamesPreserved: !0,
        noNewFiles: !0,
        uiDomChanged: !1,
        businessLogicChanged: !1,
    });
}
CaseDomain.dto = function (data, meta) {
    return _appAssignObjects_({
        domain: "cases",
        contractOwner: _CDO_,
        stamp: CASE_DOMAIN_DTO_REFACTOR_STAMP,
    }, data || {}, {
        meta: _appAssignObjects_({
            dtoOnly: !0
        }, meta || {})
    });
};
function _caseDomainOwnerContract_(n, s, r, w) {
    return _cm_({
        ok: !0,
        owner: _s_(n),
        codeOwner: _CDO_,
        stamp: CASE_DOMAIN_OWNER_STAMP_CURRENT,
        sourceOfTruth: _a_(s),
        readOwner: _s_(r),
        writeOwner: _s_(w),
        apiFacadeMode: "thin-api-to-domain-owner",
        apiNamesPreserved: !0,
        noNewFiles: !0,
    });
}
function _domainBoundary_(n, p, apis, h, w) {
    return _cm_({
        name: _s_(n),
        purpose: _s_(p),
        owner: _CDO_,
        stamp: CASE_DOMAIN_BOUNDARY_STAMP_CURRENT,
        api: _a_(apis),
        helpersPrefix: _s_(h),
        writes: _a_(w),
    });
}
function _domainPhysicalSection_(n, o, p, api, h, s, w) {
    return _cm_({
        name: _s_(n),
        owner: _s_(o),
        purpose: _s_(p),
        apiPrefix: _s_(api || "api"),
        helperPrefixes: _a_(h),
        sourceSheets: _a_(s),
        writes: _a_(w),
        stamp: CASE_DOMAIN_PHYSICAL_STAMP_CURRENT,
        apiNamesPreserved: !0,
    });
}
[
    [
        CaseDomain,
        "CaseDomain",
        "case",
        [
            "apiSaveCase",
            "apiDeleteCase",
            "apiSearch",
            "apiGetCaseContext",
            "apiSearchCasesLite",
            "apiGetCaseReportExportRows",
            "apiGetCasesBundle",
            "apiGetCaseReportOptions",
        ],
        "_case",
        _CWR_,
    ],
    [
        TrackingDomain,
        "TrackingDomain",
        "tracking",
        [
            "apiGetTracking",
            "apiGetLetters",
            "apiSaveLetter",
            "apiDeleteLetter",
            "apiGetAllLettersWithCaseInfo",
        ],
        "_tracking",
        _TWR_,
    ],
    [
        MeetingDomain,
        "MeetingDomain",
        "meeting",
        [
            "apiGetMeetingLookupOptions",
            "apiGetMeetingHistory",
            "apiSaveMeetingLog",
            "apiDeleteMeetingLog",
            "apiListCommitteeMeetings",
            "apiGetCommitteeMeetingSystem",
            "apiGetCommitteeMeetingSystemSpec",
            "apiSearchMeetingAgendaCases",
            "apiGetCommitteeMeetingPrintBundle",
            "apiSaveCommitteeMeetingSystem",
            "apiDeleteCommitteeMeetingSystem",
        ],
        "_committeeMeeting",
        _MWR_,
    ],
].forEach(function (d) {
    d[0].BOUNDARY = _domainBoundary_(d[1], d[2], d[3], d[4], d[5]);
});
[
    [
        CaseDomain,
        "Case physical cluster",
        "Code_30_Domain_Cases.gs:CaseDomain",
        "case",
        [
            "_case", "_Domain_getCase", "_dashboardCase"
        ],
        [
            "MainData", "MeetingLogs", "Letters"
        ],
        _CWR_,
    ],
    [
        TrackingDomain,
        "Tracking physical cluster",
        "Code_30_Domain_Cases.gs:TrackingDomain",
        "tracking",
        [
            "_tracking", "_letter", "_meetingLetters"
        ],
        [
            "Letters", "MainData"
        ],
        _TWR_,
    ],
    [
        MeetingDomain,
        "Meeting physical cluster",
        "Code_30_Domain_Cases.gs:MeetingDomain",
        "meeting",
        [
            "_meeting", "_committeeMeeting"
        ],
        [
            "MeetingLogs", "CommitteeMeetings", "CommitteeMeetingAgendaItems"
        ],
        _MWR_,
    ],
].forEach(function (d) {
    d[0].PHYSICAL = _domainPhysicalSection_(d[1], d[2], d[3], "api", d[4], d[5], d[6]);
});
/* Meeting/Tracking/Dashboard/Search-Report function declarations moved to companion domain modules. */

/* ============================================================================
 * Code_30_Domain_Cases.gs internal owners (R146, no new files / no new APIs)
 * --------------------------------------------------------------------------
 * CaseDomain      : MainData search/report/canonical case bundle/save/delete
 * MeetingDomain   : MeetingLogs + CommitteeMeetingAgendaItems history linkage
 * TrackingDomain  : Letters tracking/follow-up linkage to case sequence
 * DashboardDomain : Dashboard read-model bundle; budget remains BudgetDomain
 * SharedRelation  : _caseSequenceFrom_ / _stampCaseSequenceIdentity_ /
 *                   _caseChildRowBelongsToResolvedCase_ only
 * ========================================================================== */
CaseDomain.CONSOLIDATION_CURRENT = _domainConsolidationContract_();
CaseDomain.MAPPER_DEDUP_CURRENT = _code30MapperDedupContract_();
CaseDomain.ROW_DATE_MAPPER_DEDUP_CURRENT =
    _code30RowDateMapperDedupContract_();
[
    [
        CaseDomain,
        "CaseDomain",
        [
            "MainData", "MeetingLogs", "Letters"
        ],
        "CaseDomain.searchCases / CaseDomain.getReportOptions / CaseDomain.getReportExportRows / CaseDomain.quickSummary",
        "apiSaveCase / apiDeleteCase",
    ],
    [
        DashboardDomain,
        "DashboardDomain",
        [
            "MainData", "MeetingLogs", "Letters"
        ],
        "DashboardDomain.getBundle + BudgetDomain.getDashboardSummaryForDashboard",
        "read-only; budget delegated to BudgetDomain",
    ],
    [
        TrackingDomain,
        "TrackingDomain",
        [
            "Letters", "MainData"
        ],
        "TrackingDomain.getTracking / TrackingDomain.getLetters",
        "TrackingDomain.saveLetter / TrackingDomain.deleteLetter",
    ],
    [
        MeetingDomain,
        "MeetingDomain",
        [
            "MeetingLogs",
            "CommitteeMeetings",
            "CommitteeMeetingAgendaItems",
            "MainData",
        ],
        "MeetingDomain.getHistory / MeetingDomain.listMeetings / MeetingDomain.getSystem",
        "MeetingDomain.saveLog / MeetingDomain.saveSystem",
    ],
].forEach(function (d) {
    d[0].OWNER_CONTRACT_CURRENT = _caseDomainOwnerContract_(d[1], d[2], d[3], d[4]);
});
/* R146: single relation owner cleanup; sequence/caseId guards remain the only child-row identity path. */
var CASE_SEQUENCE_CANONICAL_KEYS_CURRENT = Object.freeze(_C30K_CASE_NUM_.slice());
function _caseBundleHasValue_(value) {
    return value != null && String(value).trim() !== "";
}
function _caseBundleMergeNonEmpty_() {
    for (var merged = {}, i = 0; i < arguments.length; i += 1) {
        var row = arguments[i] || {};
        Object.keys(row).forEach(function (key) {
            var value = row[key];
            _caseBundleHasValue_(value)
                ? (merged[key] = value)
                : _appHasOwnProperty_(merged, key) || (merged[key] = value);
        });
    }
    return sanitizeRow_(merged);
}
var CaseIdentity = __APP_GLOBAL__.CaseIdentity = __APP_GLOBAL__.CaseIdentity || {};
CaseIdentity.owner = "Code_30_Domain_Cases:CaseIdentity-canonical-r200";
CaseIdentity.primaryKey = "caseNum/ลำดับเรื่อง";
CaseIdentity.technicalIdentity = "caseId";
CaseIdentity.readAliases = Object.freeze(CASE_SEQUENCE_CANONICAL_KEYS_CURRENT.slice());
CaseIdentity.normalizeSequence = function (value) {
    return String(value == null ? "" : value).replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
};
CaseIdentity.sequenceFrom = function (row) {
    row = row || {};
    for (var i = 0; i < CaseIdentity.readAliases.length; i++) {
        var key = CaseIdentity.readAliases[i], value = row[key], normalized = value === void 0 || value === null ? "" : CaseIdentity.normalizeSequence(value);
        if (normalized) return normalized;
    }
    return "";
};
CaseIdentity.stampRelation = function (row, caseNum) {
    row = row || {};
    caseNum = CaseIdentity.normalizeSequence(caseNum);
    if (!caseNum) return row;
    CaseIdentity.readAliases.forEach(function (key) { row[key] = caseNum; });
    row.__relationSequenceStampedBy = CaseIdentity.owner;
    row.__relationPrimaryKey = "ลำดับเรื่อง";
    return row;
};
CaseIdentity.status = function () {
    var missing = [];
    CaseIdentity.readAliases.indexOf("caseNum") >= 0 || missing.push("caseNum");
    CaseIdentity.readAliases.indexOf("ลำดับเรื่อง") >= 0 || missing.push("ลำดับเรื่อง");
    return { ok: missing.length === 0, stamp: "case-identity-owner-r200", owner: CaseIdentity.owner, primaryKey: CaseIdentity.primaryKey, technicalIdentity: CaseIdentity.technicalIdentity, readAliasCount: CaseIdentity.readAliases.length, writePolicy: "canonical relation owner; DTO compatibility aliases preserved; caseId technical only", titleOrPetitionerFallback: !1, noNewApi: !0, noDataMigration: !0, missing: missing };
};
function _caseSequenceNormalizeStrict_(value) {
    return CaseIdentity.normalizeSequence(value);
}
function _caseSequenceFrom_(row) {
    return CaseIdentity.sequenceFrom(row);
}
function _stampCaseSequenceIdentity_(row, caseNum) {
    return CaseIdentity.stampRelation(row, caseNum);
}
function _caseIdentityOwnerStatus_() {
    return CaseIdentity.status();
}
function _caseUniqueFieldList_(fields) {
    var seen = {}, out = [];
    (fields || []).forEach(function (field) {
        field = _s_(field).trim();
        field && !seen[field] && ((seen[field] = 1), out.push(field));
    });
    return out;
}
function _caseFieldsWithSequence_(prefix, suffix) {
    return _caseUniqueFieldList_((prefix || []).concat(CASE_SEQUENCE_CANONICAL_KEYS_CURRENT, suffix || []));
}
function _caseApplySequenceIdentity_(row, caseNum, clearWhenEmpty) {
    row = row || {};
    caseNum = _caseSequenceNormalizeStrict_(caseNum);
    if (!caseNum) {
        clearWhenEmpty === !0 && CASE_SEQUENCE_CANONICAL_KEYS_CURRENT.forEach(function (key) {
            row[key] = "";
        });
        return row;
    }
    return _stampCaseSequenceIdentity_(row, caseNum);
}
function _caseSequenceIdentityPayload_(caseNum, base) {
    return _caseApplySequenceIdentity_(_appAssignObjects_({}, base || {}), caseNum, false);
}
function _requireUniqueCaseBySequence_(payload) {
    var caseNum = _caseSequenceFrom_(payload || {});
    if (!caseNum)
        throw new Error("กรุณาระบุลำดับเรื่อง");
    var rows = (_listMainDataRows_(!1, {
        selectKeyField: "caseNum",
        selectKeyValues: [caseNum],
        selectionMode: "primary-key-case-sequence",
        selectionFallbackOnEmpty: !0,
        batchSize: 500
    }) || []).filter(function (row) {
        return (row && !isSoftDeletedRow_(row) && _caseSequenceFrom_(row) === caseNum);
    });
    rows = _dedupeLatestRowsBy_(rows, function (row) {
        return _caseSequenceFrom_(row);
    });
    if (!rows.length)
        throw new Error("ไม่พบข้อมูลลำดับเรื่อง: " + caseNum);
    if (rows.length !== 1)
        throw new Error("พบลำดับเรื่องซ้ำในข้อมูลหลัก: " + caseNum);
    return {
        caseNum: caseNum, row: rows[0]
    };
}
function _caseResolvedRelationContext_(payload) {
    var resolved = _requireUniqueCaseBySequence_(payload || {}), caseNum = resolved.caseNum, row = resolved.row || {}, caseId = _s_(row.caseId || row.id || row.recordId || row.uid || "").trim();
    return {
        caseNum: caseNum, caseId: caseId, row: row
    };
}
function _caseChildRowBelongsToResolvedCase_(row, relation) {
    row = row || {};
    relation = relation || {};
    if (_appIsFnName_("isSoftDeletedRow_") && isSoftDeletedRow_(row))
        return !1;
    var targetSeq = _caseSequenceNormalizeStrict_(relation.caseNum), rowSeq = _caseSequenceFrom_(row), targetCaseId = _s_(relation.caseId || "").trim(), rowCaseId = _s_(row.caseId || row.caseID || row.case_id || "").trim();
    if (rowSeq)
        return !!(targetSeq && rowSeq === targetSeq);
    if (_casePrimaryKeyStrictReadEnabled_()) {
        _recordWarning_("case.primaryKeyMigration.strictRead.rejectMissingSequence", null, {
            targetCaseNum: targetSeq,
            rowCaseId: rowCaseId,
        });
        return !1;
    }
    return !!(targetCaseId && rowCaseId && rowCaseId === targetCaseId);
}
function _caseStampResolvedRelation_(row, relation, owner) {
    row = _appAssignObjects_({}, row || {});
    relation = relation || {};
    if (relation.caseNum)
        _stampCaseSequenceIdentity_(row, relation.caseNum);
    if (relation.caseId)
        row.caseId = relation.caseId;
    if (!_caseSequenceFrom_(row)) {
        row.__legacyCaseIdRelationFallback = !0;
        row.__relationFallbackOwner = owner || "Code_30_Domain_Cases:caseId-fallback-no-petitioner-r146";
    }
    else {
        row.__relationCanonicalStamp = owner || "Code_30_Domain_Cases:case-sequence-canonical-r146";
    }
    return row;
}
var CASE_RELATED_READ_MODEL_STAMP_CURRENT = "case-related-bundle-cache-persistent-r163";
function _caseRelatedBundleScope_(payload) {
    payload = payload || {};
    var caseNum = _caseSequenceFrom_(payload), stamp = function (name) {
        return _appIsFnName_("_entityCacheStamp_") ? String(_entityCacheStamp_(name) || "1") : "1";
    };
    return {
        caseNum: caseNum,
        casesStamp: stamp("cases"),
        lettersStamp: stamp("letters"),
        meetingLogsStamp: stamp("meetinglogs"),
        meetingsStamp: stamp("meetings"),
        model: CASE_RELATED_READ_MODEL_STAMP_CURRENT
    };
}
function _caseRelatedBundleCacheKey_(payload) {
    var scope = _caseRelatedBundleScope_(payload || {});
    return "case_related_bundle_r163_" + _hotRouteDigest_(JSON.stringify(scope));
}
function _caseRelatedBundleAllowCache_(payload) {
    return _appIsFnName_("_appCachePolicyFor_") ? _appCachePolicyFor_("cases", payload || {}, { ttlKey: "caseList", ttl: 180, maxTtl: 600 }).allowRead : !_appCacheBypassRequested_(payload || {});
}
function _caseRelatedBundleAttachMeta_(bundle, status, started, extra) {
    bundle = bundle && typeof bundle == "object" ? bundle : {};
    bundle.meta = _appAssignObjects_({}, bundle.meta || {}, extra || {}, {
        performanceHCaseRelated: !0,
        readModel: CASE_RELATED_READ_MODEL_STAMP_CURRENT,
        cacheStatus: status || "live",
        cacheHit: status === "cache-hit" || status === "persistent-hit",
        durationMs: Math.max(0, Date.now() - Number(started || Date.now()))
    });
    return bundle;
}
function _caseRelatedBundleRead_(payload) {
    payload = payload || {};
    var started = Date.now(), caseNum = _caseSequenceFrom_(payload), allowCache = _caseRelatedBundleAllowCache_(payload);
    if (!caseNum)
        return ok_(getCanonicalCaseBundleImpl_(payload), "โหลดชุดข้อมูลเรื่องแบบ canonical สำเร็จ");
    var cacheKey = _caseRelatedBundleCacheKey_(payload), cached = allowCache ? _hotRouteCacheGet_(cacheKey) : null;
    if (cached && typeof cached == "object")
        return ok_(_caseRelatedBundleAttachMeta_(cached, "cache-hit", started), "โหลดชุดข้อมูลเรื่องจาก cache สำเร็จ");
    if (allowCache && _appIsFnName_("_persistentSummarySnapshotRead_"))
        try {
            var persistent = _persistentSummarySnapshotRead_("case-related", caseNum, "viewer", { requestId: payload.requestId || "" });
            if (persistent && persistent.ok && persistent.bundle && _caseSequenceFrom_(persistent.bundle.case || persistent.bundle) === caseNum) {
                var persistentBundle = _caseRelatedBundleAttachMeta_(persistent.bundle, "persistent-hit", started, {
                    persistentSnapshotHit: !0,
                    persistentSnapshotMeta: persistent.meta || {}
                });
                _hotRouteCachePut_(cacheKey, persistentBundle, Math.max(120, Math.min(Number(payload.cacheTtlSeconds || 600) || 600, 1800)));
                return ok_(persistentBundle, "โหลดชุดข้อมูลเรื่องจาก persistent snapshot สำเร็จ");
            }
        }
        catch (_casePersistentReadErr) {
            _c30W_("caseRelated.persistent.read", _casePersistentReadErr, { caseNum: caseNum });
        }
    var bundle = _caseRelatedBundleAttachMeta_(getCanonicalCaseBundleImpl_(payload), allowCache ? "cache-miss" : "cache-bypass", started);
    if (allowCache) {
        _hotRouteCachePut_(cacheKey, bundle, Math.max(120, Math.min(Number(payload.cacheTtlSeconds || 600) || 600, 1800)));
        if (_appIsFnName_("_persistentSummarySnapshotWrite_") && bundle.relatedLoadOk !== !1)
            try {
                var stored = _persistentSummarySnapshotWrite_("case-related", caseNum, "viewer", bundle, {
                    ttlSeconds: Math.max(300, Math.min(Number(payload.persistentTtlSeconds || 1800) || 1800, 3600)),
                    source: "case-related-live-r163"
                });
                bundle.meta.persistentSnapshotStored = !!(stored && stored.stored);
            }
            catch (_casePersistentWriteErr) {
                _c30W_("caseRelated.persistent.write", _casePersistentWriteErr, { caseNum: caseNum });
            }
    }
    return ok_(bundle, "โหลดชุดข้อมูลเรื่องแบบ canonical สำเร็จ");
}
function getCanonicalCaseBundleImpl_(payload) {
    payload = payload || {};
    var resolved = _requireUniqueCaseBySequence_(payload);
    var caseNum = resolved.caseNum, requestKey = "case-related:" + caseNum, requestCached = _requestScopeGet_("canonicalCaseBundle", requestKey);
    if (requestCached && typeof requestCached === "object")
        return requestCached;
    var seed = _caseBundleMergeNonEmpty_(resolved.row, _stampCaseSequenceIdentity_({}, caseNum));
    var strictPayload = _caseSequenceIdentityPayload_(caseNum);
    var history = [], letters = [], relatedWarnings = [];
    try {
        history = _Domain_getMeetingHistory(strictPayload);
        _c30A_(history) || (history = []);
    }
    catch (historyErr) {
        _recordWarning_("canonical_case_bundle.history.case_sequence_strict", historyErr, {
            caseNum: caseNum,
        });
        relatedWarnings.push({
            section: "history",
            errorCode: "CASE_HISTORY_LOAD_FAILED",
            message: String(historyErr && historyErr.message
                ? historyErr.message
                : "โหลดประวัติการประชุมไม่สำเร็จ"),
        });
        history = [];
    }
    try {
        letters = _Domain_getLetters(_appAssignObjects_({}, strictPayload, {
            includeLetters: !0,
            __meetingListMode: "caseLetters",
        }));
        _c30A_(letters) || (letters = []);
    }
    catch (lettersErr) {
        _recordWarning_("canonical_case_bundle.letters.case_sequence_strict", lettersErr, {
            caseNum: caseNum,
        });
        relatedWarnings.push({
            section: "letters",
            errorCode: "CASE_LETTERS_LOAD_FAILED",
            message: String(lettersErr && lettersErr.message
                ? lettersErr.message
                : "โหลดหนังสือติดตามไม่สำเร็จ"),
        });
        letters = [];
    }
    var result = {
        case: seed,
        rawCase: seed,
        aliases: [
            caseNum
        ],
        relatedCases: [
            seed
        ],
        matchKey: caseNum,
        primaryLinkKey: "caseNum",
        history: _c30A_(history) ? history : [],
        letters: _c30A_(letters) ? letters : [],
        counts: {
            aliases: 1,
            relatedCases: 1,
            history: _c30A_(history) ? history.length : 0,
            letters: _c30A_(letters) ? letters.length : 0,
        },
        relatedLoadOk: relatedWarnings.length === 0,
        relatedWarnings: relatedWarnings,
        partialRelatedData: relatedWarnings.length > 0,
        resolvedAt: new Date().toISOString(),
    };
    _requestScopePut_("canonicalCaseBundle", requestKey, result);
    return result;
}
function _Domain_getCaseContext(payload) {
    var bundle = getCanonicalCaseBundleImpl_((payload = payload || {})), seed = bundle.case || {};
    return ok_({
        case: seed || null,
        aliases: bundle.aliases || [],
        relatedCases: bundle.relatedCases || [],
        matchKey: bundle.matchKey,
        historyCount: Number((bundle.counts && bundle.counts.history) || 0),
        letterCount: Number((bundle.counts && bundle.counts.letters) || 0),
        historyPreview: _c30A_(bundle.history) ? bundle.history.slice(0, 5) : [],
        letterPreview: _c30A_(bundle.letters) ? bundle.letters.slice(0, 5) : [],
        resolvedAt: bundle.resolvedAt || new Date().toISOString(),
    }, "โหลดบริบทข้อมูลเรื่องสำเร็จ");
}
function _Domain_getCanonicalCaseBundle(payload) {
    return _caseRelatedBundleRead_(payload || {});
}
function _getCaseIdentityHealthReport_(limit) {
    limit = Number(limit || 200) || 200;
    var cases = [];
    try {
        cases = _dedupeLatestRowsBy_(_listMainDataRows_(!1), _caseIdentityKey_);
    }
    catch (_e) {
        (_recordWarning_("ec", _e), (cases = []));
    }
    var sliced = cases.slice(0, limit), byAlias = {};
    sliced.forEach(function (r) {
        var key = _normalizedText_((r && (r.title || r.caseTitle)) || "") +
            "||" +
            _normalizedText_((r && (r.petitioners || r.petitionerName)) || "");
        key &&
            key !== "||" &&
            ((byAlias[key] = byAlias[key] || []), byAlias[key].push(r));
    });
    var aliasCollisions = Object.keys(byAlias)
        .filter(function (k) {
        return (byAlias[k] || []).length > 1;
    })
        .map(function (k) {
        var group = byAlias[k] || [];
        return {
            aliasKey: k,
            count: group.length,
            caseIds: group
                .map(function (x) {
                return _s_(x.caseId).trim();
            })
                .filter(Boolean),
            caseNums: group
                .map(function (x) {
                return _s_(x.caseNum).trim();
            })
                .filter(Boolean),
            titles: group
                .map(function (x) {
                return _s_(x.title || x.caseTitle).trim();
            })
                .filter(Boolean)
                .slice(0, 3),
        };
    }), missingCaseIds = sliced
        .filter(function (r) {
        return !_s_(r && r.caseId).trim();
    })
        .slice(0, 50)
        .map(function (r) {
        return {
            caseNum: _s_(r.caseNum).trim(),
            recNo: _s_(r.recNo).trim(),
            title: _s_(r.title || r.caseTitle).trim(),
        };
    }), sampledBundles, failedBundles = sliced
        .slice(0, Math.min(25, sliced.length))
        .map(function (r) {
        try {
            var bundle = getCanonicalCaseBundleImpl_({
                caseId: _s_(r.caseId).trim(),
                caseNum: _s_(r.caseNum).trim(),
                recNo: _s_(r.recNo).trim(),
                title: _s_(r.title || r.caseTitle).trim(),
                petitioners: _s_(r.petitioners || r.petitionerName).trim(),
            });
            return {
                ok: !(!bundle || !bundle.case),
                caseId: _s_(r.caseId).trim(),
                relatedCases: Number((bundle && bundle.counts && bundle.counts.relatedCases) || 0),
                history: Number((bundle && bundle.counts && bundle.counts.history) || 0),
                letters: Number((bundle && bundle.counts && bundle.counts.letters) || 0),
            };
        }
        catch (e) {
            return (_recordWarning_("ec", e),
                {
                    ok: !1,
                    caseId: _s_(r.caseId).trim(),
                    error: (e && e.message) || String(e),
                });
        }
    })
        .filter(function (x) {
        return !x.ok;
    }), report = {
        generatedAt: new Date().toISOString(),
        scannedCases: sliced.length,
        aliasCollisionCount: aliasCollisions.length,
        aliasCollisions: aliasCollisions.slice(0, 20),
        missingCaseIdCount: missingCaseIds.length,
        missingCaseIds,
        bundleFailures: failedBundles.length,
        bundleFailureCases: failedBundles.slice(0, 20),
        ok: aliasCollisions.length === 0 &&
            missingCaseIds.length === 0 &&
            failedBundles.length === 0,
    };
    return ok_(report, report.ok
        ? "สถานะ identity ของเรื่องอยู่ในเกณฑ์ดี"
        : "พบประเด็นด้าน identity/canonical ของเรื่อง");
}
function getCaseIdentityHealthReport(limit) {
    return _getCaseIdentityHealthReport_(Number(limit || 200) || 200);
}
function _caseManualNumericText_(value) {
    if (value == null || _caseValueLooksLikeDate_(value))
        return "";
    var raw = String(value)
        .replace(/^'+/, "")
        .replace(/[​-‍\uFEFF]/g, "")
        .trim();
    if (!raw ||
        raw === "-" ||
        _caseValueLooksLikeDate_(raw) ||
        _caseLooksLikeInternalId_(raw))
        return "";
    if (/^\d+$/.test(raw))
        return raw;
    var decimal = raw.match(/^(\d+)\.0+$/);
    return decimal ? decimal[1] : "";
}
function _caseReferenceTextColumnNames_() {
    return [
        "caseNum",
        "caseNo",
        "runningNo",
        "ลำดับเรื่อง",
        "recNo",
        "receiveNo",
        "receivedNo",
        "เลขรับเรื่อง",
        "เลขที่รับเรื่อง",
        "รับเรื่องเลขที่",
    ];
}
function _caseEnsureMainDataReferenceTextColumns_() {
    try {
        var exec = _appIsFnName_("_executionState_")
            ? _executionState_()
            : typeof AppInfra != "undefined" && AppInfra
                ? AppInfra
                : {};
        if (exec.__caseReferenceTextColumnsEnsured)
            return {
                ok: !0, cached: !0
            };
        if (typeof getSheet_ != "function" || !_appIsFnName_("_sheetHeaders_"))
            return {
                ok: !1, skipped: !0, reason: "sheet helpers unavailable"
            };
        var sh = getSheet_("MainData"), headers = _sheetHeaders_("MainData"), names = _caseReferenceTextColumnNames_(), rowCount = Math.max(2, Number(sh.getMaxRows && sh.getMaxRows()) ||
            Number(sh.getLastRow && sh.getLastRow()) ||
            2), formatted = [];
        return (names.forEach(function (name) {
            var idx = headers.indexOf(name);
            if (!(idx < 0))
                try {
                    (AppRepository.setRangeNumberFormat("MainData", 1, idx + 1, rowCount, 1, "@"),
                        formatted.push(name));
                }
                catch (e) {
                    _c30W_("case.referenceTextColumnFormat." + name, e);
                }
        }),
            (exec.__caseReferenceTextColumnsEnsured = !0),
            {
                ok: !0, formatted, rowCount
            });
    }
    catch (e) {
        return (_c30W_("case.ensureReferenceTextColumns", e),
            {
                ok: !1, error: String((e && e.message) || e)
            });
    }
}
function _caseReceiveNoFromDateValue_(value) {
    if (value == null)
        return "";
    if (Object.prototype.toString.call(value) === "[object Date]" &&
        !isNaN(value.getTime())) {
        var y = value.getFullYear(), thaiYear = y > 2400 ? y : y + 543;
        return String(value.getMonth() + 1) + "/" + String(thaiYear);
    }
    var raw = String(value)
        .replace(/^'+/, "")
        .replace(/[​-‍\uFEFF]/g, "")
        .trim();
    if (!raw)
        return "";
    var dateLike = raw.match(/^1[\/\-](\d{1,2})[\/\-]((?:19|20|25)\d{2})$/);
    if (dateLike) {
        var m = Number(dateLike[1]);
        if (m >= 1 && m <= 12)
            return String(m) + "/" + dateLike[2];
    }
    if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s/i.test(raw) ||
        /GMT[+-]\d{4}|เวลาอินโดจีน/i.test(raw)) {
        var parsed = new Date(raw);
        if (parsed && !isNaN(parsed.getTime())) {
            var py = parsed.getFullYear();
            return (String(parsed.getMonth() + 1) + "/" + String(py > 2400 ? py : py + 543));
        }
    }
    return "";
}
function _caseManualReceiveNoText_(value) {
    if (value == null)
        return "";
    var recovered = _caseReceiveNoFromDateValue_(value);
    if (recovered)
        return recovered;
    var raw = String(value)
        .replace(/^'+/, "")
        .replace(/[​-‍\uFEFF]/g, "")
        .trim();
    if (!raw ||
        raw === "-" ||
        raw === "/" ||
        _caseValueLooksLikeDate_(raw) ||
        _caseLooksLikeInternalId_(raw))
        return "";
    if (/^\d+$/.test(raw))
        return raw;
    var decimal = raw.match(/^(\d+)\.0+$/);
    if (decimal)
        return decimal[1];
    var slash = raw.match(/^(\d+)\s*\/\s*((?:19|20|25)?\d{2})$/);
    if (slash)
        return slash[1] + "/" + slash[2];
    var dashYear = raw.match(/^(\d+)\s*[\-–—]\s*((?:19|20|25)?\d{2})$/);
    return dashYear ? dashYear[1] + "/" + dashYear[2] : "";
}
function _caseManualReceiveNoForSheet_(value) {
    var normalized = _caseManualReceiveNoText_(value);
    return normalized
        ? normalized.indexOf("/") > -1
            ? "'" + normalized
            : normalized
        : "";
}
function _extractRunningNumber_(value, referenceDate, explicitYear) {
    return _caseManualNumericText_(value);
}
function _caseLooksLikeInternalId_(value) {
    var raw = _c30S_(value).trim();
    return (/^CASE[_-]/i.test(raw) || /^MAIN-\d+/i.test(raw) || /^ROW-\d+/i.test(raw));
}
function _caseValueLooksLikeDate_(value) {
    if (Object.prototype.toString.call(value) === "[object Date]" &&
        !isNaN(value.getTime()))
        return !0;
    var raw = _c30S_(value).trim();
    return (!!raw &&
        (/^\d{4}-\d{1,2}-\d{1,2}/.test(raw) ||
            /^\d{1,2}\/\d{1,2}\/(?:19|20|25)\d{2}$/.test(raw) ||
            /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s/i.test(raw) ||
            /GMT[+-]\d{4}|เวลาอินโดจีน/i.test(raw) ||
            /^\d{1,2}\s*(ม\.?ค\.?|ก\.?พ\.?|มี\.?ค\.?|เม\.?ย\.?|พ\.?ค\.?|มิ\.?ย\.?|ก\.?ค\.?|ส\.?ค\.?|ก\.?ย\.?|ต\.?ค\.?|พ\.?ย\.?|ธ\.?ค\.?|มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s*(?:19|20|25)\d{2}$/i.test(raw)));
}
function _normalizeReceiveNo_(caseNum, recNo, recDate, offerDate) {
    return _caseManualReceiveNoText_(recNo);
}
function _caseDomainSharedRows_(sheetName, fields, opts) {
    return ((opts = opts || {}),
        (fields = _c30A_(fields) ? fields : []),
        _appIsFnName_("_appDataServiceRead_")
            ? _appDataServiceRead_(sheetName, fields, _appAssignObjects_({
                owner: "cases.domain", ttl: 180, projectionPlan: String(opts.projectionPlan || ""), projectionPlanFields: opts.projectionPlanFields || []
            }, opts)) || []
            : fields.length && typeof readSheetProjectedObjectsCached_ == "function"
                ? readSheetProjectedObjectsCached_(sheetName, fields, {
                    includeDeleted: opts.includeDeleted === !0,
                    requireCanonical: opts.requireCanonical === !0,
                    ttl: opts.ttl || 180,
                }) || []
                : typeof readSheetObjectsCached_ == "function"
                    ? readSheetObjectsCached_(sheetName, {
                        includeDeleted: opts.includeDeleted === !0,
                        requireCanonical: opts.requireCanonical === !0,
                    }) || []
                    : readSheetObjects_(sheetName, {
                        includeDeleted: opts.includeDeleted === !0,
                        requireCanonical: opts.requireCanonical === !0,
                    }) || []);
}
function _caseReadProjectionSpec_(name) {
    var specs = {
        mainData: {
            sheetName: "MainData",
            ttl: 180,
            fields: [
                "caseId", "id", "cat", "subCat", "recNo", "receiveNo", "offerDate", "recDate", "title",
                "petitioners", "petitionerName", "petitioner", "status", "assignees", "owner",
                "responsibleCommissioners", "responsibleComm", "committeeOwner", "responsibleCommittee",
                "staffs", "secretariatOfficer", "operationOfficer", "opStaff", "operator", "responsibleOfficer",
                "operationStaff", "staff", "officer", "respondent", "agencyName", "accusedAgency", "accused",
                "agency", "coAssignees", "coAssignee", "coOwners", "coResponsible", "remark", "caseTitle",
                "closedReason", "rejectionReason", "pendingRemark", "pendingReason", "waitReason", "waitingReason",
                "เหตุผลรอพิจารณา", "เหตุผลรอการพิจารณา", "หมายเหตุรอพิจารณา", "หมายเหตุรอการพิจารณา",
                "statusReason", "reason", "เหตุผล", "committeeHistory", "committeeMeeting", "committeeMeetings",
                "meetingCommitteeHistory", "คณะกรรมาธิการ", "subcommitteeHistory", "subcommitteeMeeting",
                "subcommitteeMeetings", "meetingSubcommitteeHistory", "คณะอนุกรรมาธิการ", "petitionerPhone",
                "subject", "caseType", "topic", "subcommittee", "dueDate", "createdAt", "updatedAt",
                "meetingStatus", "isDeleted", "deletedAt", "keySummary"
            ]
        },
        letters: {
            sheetName: "Letters",
            ttl: 180,
            fields: [
                "letterId", "caseId", "letterNo", "bookNo", "letterDate", "agency", "subject", "issue",
                "dueDate", "extendDate", "remark", "letterStatus", "status", "repliesJSON", "extensionsJSON",
                "extensionJSON", "opStaff", "officer", "createdAt", "updatedAt", "isDeleted", "deletedAt"
            ]
        }
    };
    var spec = specs[String(name || "").trim()] || null;
    return spec ? {
        sheetName: spec.sheetName,
        ttl: spec.ttl,
        fields: _caseFieldsWithSequence_(spec.fields)
    } : null;
}
function _caseReadProjectedRows_(name, includeDeleted, opts) {
    var spec = _caseReadProjectionSpec_(name);
    if (!spec)
        throw new Error("CASE_READ_PROJECTION_UNKNOWN:" + String(name || ""));
    opts = opts || {};
    var readOpts = {
        includeDeleted: includeDeleted === !0,
        ttl: Number(opts.ttl || spec.ttl) || spec.ttl
    };
    opts.requireCanonical === !0 && (readOpts.requireCanonical = !0);
    opts.forceFresh === !0 && (readOpts.forceFresh = !0);
    opts.noCache === !0 && (readOpts.noCache = !0);
    opts.bypassCache === !0 && (readOpts.bypassCache = !0);
    opts.bypassRequestCache === !0 && (readOpts.bypassRequestCache = !0);
    opts.selectKeyField && (readOpts.selectKeyField = opts.selectKeyField);
    opts.selectKeyValues != null && (readOpts.selectKeyValues = opts.selectKeyValues);
    opts.selectRowNumbers && (readOpts.selectRowNumbers = opts.selectRowNumbers);
    opts.selectionMode && (readOpts.selectionMode = opts.selectionMode);
    opts.selectionFallbackOnEmpty === !0 && (readOpts.selectionFallbackOnEmpty = !0);
    opts.batchSize && (readOpts.batchSize = opts.batchSize);
    return _caseDomainSharedRows_(spec.sheetName, spec.fields, readOpts);
}
function _caseDomainMainDataProjectedRows_(includeDeleted) {
    return _caseReadProjectedRows_("mainData", includeDeleted);
}
function _caseDomainLettersProjectedRows_(includeDeleted) {
    return _caseReadProjectedRows_("letters", includeDeleted);
}
function _getMainDataRepository_() {
    return getCanonicalRepository_("cases.mainData");
}
function _listMainDataRows_(includeDeleted, opts) {
    try {
        return _caseReadProjectedRows_("mainData", includeDeleted === !0, opts || {});
    }
    catch (_projectedErr) {
        throw (_recordWarning_("ec", _projectedErr),
            new Error("CASE_MAIN_DATA_PROJECTED_READER_FAILED:" +
                String((_projectedErr && _projectedErr.message) || _projectedErr)));
    }
}
function _casePick_(row, keys) {
    ((row = row || {}), (keys = _c30A_(keys) ? keys : []));
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (row[key] !== void 0 &&
            row[key] !== null &&
            String(row[key]).trim() !== "")
            return row[key];
    }
    return "";
}
function _caseCanonicalFields_(row) {
    var title, cat, subCat, assignees;
    return ((row = row || {}),
        {
            title: String(_casePick_(row, _C30K_TITLE_) || "").trim(),
            cat: String(_casePick_(row, [
                "cat",
                "caseType",
                "category",
                "ประเภทเรื่อง",
                "ประเภท",
            ]) || "").trim(),
            subCat: String(_casePick_(row, [
                "subCat",
                "subCategory",
                "issue",
                "topic",
                "topicName",
                "considerIssue",
                "caseIssue",
                "ประเด็นพิจารณา",
                "ประเด็น",
            ]) || "").trim(),
            assignees: String(_casePick_(row, [
                "assignees",
                "owner",
                "responsibleCommissioners",
                "responsibleComm",
                "committeeOwner",
                "responsibleCommittee",
                "กมธ.รับผิดชอบ",
                "กมธ.รับผิดชอบ",
                "กรรมาธิการรับผิดชอบ",
                "คณะกรรมาธิการรับผิดชอบ",
                "ผู้รับผิดชอบ",
                "ผู้รับผิดชอบหลัก",
            ]) || "").trim(),
        });
}
function _caseNormalizeInputDto_(input) {
    (((input = _appAssignObjects_({}, input || {})).id = input.id || input.caseId || ""),
        (input.caseId = input.caseId || input.id || ""));
    var schema = _caseCanonicalFields_(input);
    ((input.title = schema.title),
        (input.caseTitle = String(_casePick_(input, [
            "caseTitle", "title", "subject", "เรื่อง"
        ]) ||
            schema.title ||
            "").trim()),
        (input.subject = _s_(input.subject || schema.title).trim()),
        (input.cat = schema.cat || input.cat || ""),
        (input.caseType = input.caseType || schema.cat || ""),
        (input.subCat = schema.subCat || input.subCat || ""),
        (input.subCategory = input.subCategory || input.subCat || ""),
        (input.issue = input.issue || input.subCat || ""),
        (input.topic = input.subCat || input.topic || ""),
        (input.assignees = schema.assignees || input.assignees || ""),
        (input.owner = input.owner || input.assignees || ""),
        (input.responsibleCommissioners =
            input.responsibleCommissioners || input.assignees || ""),
        (input.petitioner = String(_casePick_(input, [
            "petitioner",
            "petitioners",
            "petitionerName",
            "ผู้ร้อง",
            "ผู้เสนอญัตติ",
            "ผู้เสนอญัตติ/ผู้ร้อง",
        ]) || "").trim()),
        (input.petitioners = String(_casePick_(input, _C30K_PETITIONERS_) || "").trim()),
        (input.keySummary = String(_casePick_(input, [
            "keySummary",
            "summary",
            "สรุปสาระสำคัญของเรื่อง",
            "สรุปสาระสำคัญ",
            "สาระสำคัญ",
        ]) || "").trim()),
        (input.remark = String(_casePick_(input, [
            "remark", "note", "หมายเหตุ"
        ]) || "").trim()),
        (input.pendingRemark = String(_casePick_(input, _C30K_PENDING_REASON_) || "").trim()),
        (input.pendingReason = input.pendingRemark),
        (input.rejectionReason = String(_casePick_(input, [
            "rejectionReason",
            "rejectReason",
            "notAcceptedReason",
            "เหตุผล(ไม่รับเรื่อง)",
            "เหตุผลไม่รับเรื่อง",
        ]) || "").trim()),
        (input.petitionerPhone = _appPhoneForDisplay_(_casePick_(input, _C30K_PETITIONER_PHONE_) || "")));
    var rawStatus = String(_casePick_(input, [
        "status",
        "caseStatus",
        "processStatus",
        "currentStatus",
        "สถานะ",
        "สถานะเรื่อง",
    ]) || "เรื่องเข้าใหม่").trim();
    ((input.statusRaw = rawStatus),
        (input.status =
            typeof AppBackendCore != "undefined" &&
                AppBackendCore &&
                typeof AppBackendCore.normalizeCaseStatus == "function"
                ? AppBackendCore.normalizeCaseStatus(rawStatus, {
                    defaultStatus: "เรื่องเข้าใหม่",
                    strict: !0,
                })
                : _caseNormalizeStatusForDisplay_(rawStatus)));
    var caseNumRaw = _casePick_(input, _C30K_CASE_NUM_) || "";
    _caseValueLooksLikeDate_(caseNumRaw) && (caseNumRaw = "");
    input.caseNum = _extractRunningNumber_(caseNumRaw, input.offerDate || input.recDate || input.createdAt, input.fy || input.fiscalYear || input.budgetYear);
    _caseApplySequenceIdentity_(input, input.caseNum, true);
    var recNoRaw = _casePick_(input, [
        "recNo",
        "receiveNo",
        "receivedNo",
        "เลขรับเรื่อง",
        "เลขที่รับเรื่อง",
        "รับเรื่องเลขที่",
    ]) || "";
    return ((input.recNo = _normalizeReceiveNo_(input.caseNum, recNoRaw, input.recDate, input.offerDate)),
        (input.receiveNo = input.recNo),
        (input.เลขรับเรื่อง = input.recNo),
        input);
}
function _caseNormalizeStatusForDisplay_(status) {
    return _caseStatusNormalize_(status, {
        defaultStatus: "เรื่องเข้าใหม่",
        warningKey: "case.display.status",
    });
}
function _caseCanonicalDto_(row) {
    var schema = _caseCanonicalFields_((row = row || {})), title = schema.title, cat = schema.cat, subCat = schema.subCat, assignees = schema.assignees, statusRaw = String(row.status || row.caseStatus || "เรื่องเข้าใหม่").trim(), statusForReason = _caseNormalizeStatusForDisplay_(statusRaw), offerDateCanonical = String(_casePick_(row, _C30K_OFFER_DATE_) || "").trim(), rawClosedReason = String(_casePick_(row, _C30K_CLOSED_REASON_) || "").trim(), rawRejectionReason = String(_casePick_(row, [
        "rejectionReason",
        "rejectReason",
        "notAcceptedReason",
        "notReceiveReason",
        "notAcceptReason",
        "caseRejectReason",
        "statusReason",
        "decisionReason",
        "reason",
        "เหตุผล",
        "เหตุผล(ไม่รับเรื่อง)",
        "เหตุผลไม่รับเรื่อง",
        "เหตุผลการไม่รับเรื่อง",
    ]) || "").trim(), rawPendingReason = String(_casePick_(row, _C30K_PENDING_REASON_) || "").trim(), closedReasonForDto = rawClosedReason || rawRejectionReason || "", rejectionReasonForDto = rawRejectionReason || rawClosedReason || "", pendingReasonForDto = rawPendingReason ||
        (statusForReason === "รอพิจารณา"
            ? rawClosedReason || rawRejectionReason
            : ""), genericReasonForDto = statusForReason === "รอพิจารณา"
        ? pendingReasonForDto
        : statusForReason === "ยุติเรื่อง"
            ? closedReasonForDto
            : statusForReason === "ไม่รับเรื่อง"
                ? rejectionReasonForDto
                : rawPendingReason || rawClosedReason || rawRejectionReason || "";
    return _appAssignObjects_({}, row, {
        caseId: _s_(row.caseId || row.id).trim(),
        id: _s_(row.id || row.caseId).trim(),
        caseNum: _caseManualNumericText_(_casePick_(row, _C30K_CASE_NUM_) || ""),
        caseNo: _caseManualNumericText_(_casePick_(row, [
            "caseNo",
            "caseNum",
            "runningNo",
            "ลำดับเรื่อง",
            "เลขลำดับเรื่อง",
        ]) || ""),
        recNo: _caseManualReceiveNoText_((_appIsFnName_("_caseSearchReceiveNoText_")
            ? _caseSearchReceiveNoText_(row)
            : "") ||
            _casePick_(row, [
                "recNo",
                "receiveNo",
                "receivedNo",
                "เลขรับเรื่อง",
                "เลขรับ",
                "เลขรับที่",
                "ทะเบียนรับ",
            ]) ||
            ""),
        title,
        caseTitle: String(_casePick_(row, [
            "caseTitle",
            "considerationTitle",
            "caseConsiderationTitle",
            "ชื่อเรื่องพิจารณา(ถ้ามี)",
            "ชื่อเรื่องพิจารณา",
            "เรื่องพิจารณา",
        ]) ||
            row.caseTitle ||
            title ||
            "").trim(),
        subject: _s_(row.subject || title).trim(),
        cat,
        caseType: _s_(row.caseType || cat).trim(),
        petitioners: String(_casePick_(row, _C30K_PETITIONERS_) || "").trim(),
        petitionerPhone: _appPhoneForDisplay_(_casePick_(row, _C30K_PETITIONER_PHONE_) || ""),
        respondent: String(_casePick_(row, _C30K_RESPONDENT_) || "").trim(),
        sentAgency: String(_casePick_(row, _C30K_SENT_AGENCY_) || "").trim(),
        sendToAgency: String(_casePick_(row, _C30K_SENT_AGENCY_) || "").trim(),
        subCat,
        subCategory: subCat,
        issue: subCat,
        topic: subCat,
        assignees,
        owner: assignees,
        responsibleCommissioners: assignees,
        staffs: String(_casePick_(row, _C30K_STAFFS_) || "").trim(),
        coAssignees: String(_casePick_(row, _C30K_CO_ASSIGNEES_) || "").trim(),
        status: statusForReason,
        statusRaw,
        offerDate: offerDateCanonical,
        dateProposed: offerDateCanonical,
        bookDate: offerDateCanonical,
        closedReason: closedReasonForDto,
        rejectionReason: rejectionReasonForDto,
        rejectReason: rejectionReasonForDto,
        notAcceptedReason: rejectionReasonForDto,
        pendingRemark: pendingReasonForDto,
        pendingReason: pendingReasonForDto,
        statusReason: genericReasonForDto,
        reason: genericReasonForDto,
        เหตุผล: genericReasonForDto,
        "เหตุผล(ไม่รับเรื่อง)": rejectionReasonForDto,
        schemaStamp: "domain-schema-cases-current",
        contractStamp: "case-dto-current",
    });
}
function _casePlainIdentityKey_(value) {
    return _c30S_(value).replace(/^'+/, "").trim();
}
/* r146: title/petitioner is display-only, never a relational key. */
function _caseBuildSaveLookupIndex_() {
    var cacheKey = "case.saveLookupIndex.current." +
        (_appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("maindata")
            : "1"), hit = _appIsFnName_("_requestScopeGet_")
        ? _requestScopeGet_("caseSaveLookupIndex", cacheKey)
        : null;
    if (hit)
        return hit;
    var rows = [];
    try {
        rows = _appIsFnName_("_caseDomainMainDataProjectedRows_")
            ? _caseDomainMainDataProjectedRows_(!0)
            : _getMainDataRepository_().list({
                includeDeleted: !0,
                requireCanonical: !0,
            });
    }
    catch (_idxProjectedErr) {
        rows = _getMainDataRepository_().list({
            includeDeleted: !0,
            requireCanonical: !0,
        });
    }
    var idx = {
        byId: {},
        byCaseNum: {},
        rowsRead: (rows = _c30A_(rows) ? rows : []).length,
        generatedAt: new Date().toISOString(),
        source: "case-keyed-index-current",
    };
    function caseIndexPut_(map, key, row) {
        if ((key = _casePlainIdentityKey_(key))) {
            var current = map[key];
            (!current ||
                _rowFreshnessScore_(row).localeCompare(_rowFreshnessScore_(current)) >
                    0) &&
                (map[key] = row);
        }
    }
    return (rows.forEach(function (row) {
        ((row = row || {}),
            caseIndexPut_(idx.byId, row.caseId || row.id, row),
            caseIndexPut_(idx.byCaseNum, _caseManualNumericText_(row.caseNum || row.caseNo || row.runningNo || row.ลำดับเรื่อง || ""), row));
    }),
        _appIsFnName_("_requestScopePut_") &&
            (idx = _requestScopePut_("caseSaveLookupIndex", cacheKey, idx)),
        idx);
}
function _caseFindExistingFromIndex_(input) {
    input = input || {};
    var idx = _caseBuildSaveLookupIndex_(), id = _casePlainIdentityKey_(input.id || input.caseId || "");
    if (id && idx.byId[id])
        return idx.byId[id];
    var caseNum = _caseManualNumericText_(input.caseNum || input.caseNo || input.runningNo || input.ลำดับเรื่อง || "");
    if (caseNum && idx.byCaseNum[caseNum])
        return idx.byCaseNum[caseNum];
    return null;
}
function _findExistingCaseRecord_(input) {
    input = input || {};
    var targetId = _s_(input.id || input.caseId).trim();
    if (targetId)
        try {
            var byId = _getMainDataRepository_().findByKey(targetId, {
                includeDeleted: !0,
                requireCanonical: !0,
            });
            if (byId)
                return byId;
        }
        catch (_findByIdErr) {
            _recordWarning_("cases.findExisting.byId", _findByIdErr);
        }
    try {
        var indexed = _appIsFnName_("_caseFindExistingFromIndex_")
            ? _caseFindExistingFromIndex_(input)
            : null;
        if (indexed)
            return indexed;
    }
    catch (_caseIndexErr) {
        _recordWarning_("cases.findExisting.keyedIndex", _caseIndexErr);
    }
    var rows = _getMainDataRepository_().listActive(), targetCaseNum = _caseManualNumericText_(input.caseNum ||
        input.caseNo ||
        input.runningNo ||
        input.ลำดับเรื่อง ||
        ""), matches = (_c30A_(rows) ? rows : []).filter(function (row) {
        if (((row = row || {}),
            (targetId && _s_(row.caseId).trim() === targetId) ||
                (targetCaseNum &&
                    _caseManualNumericText_(row.caseNum ||
                        row.caseNo ||
                        row.runningNo ||
                        row.ลำดับเรื่อง ||
                        "") === targetCaseNum) ||
                false))
            return !0;
        return !1;
    });
    return matches.length
        ? (matches.sort(function (a, b) {
            return _rowFreshnessScore_(b).localeCompare(_rowFreshnessScore_(a));
        }),
            matches[0] || null)
        : null;
}
function _buildCaseCanonicalRecord_(input, existing, now) {
    ((input = input || {}),
        (existing = existing || {}),
        (now = now || new Date().toISOString()));
    var resolvedId = String(existing.caseId ||
        input.id ||
        input.caseId ||
        "CASE_" + Date.now() + "_" + Math.floor(9e3 * Math.random() + 1e3)).trim(), schema = _caseCanonicalFields_(_appAssignObjects_({}, existing, input)), title = _s_(input.title ||
        input.caseTitle ||
        schema.title ||
        existing.title ||
        existing.caseTitle).trim(), cat = _s_(schema.cat ||
        input.cat ||
        input.caseType ||
        existing.cat ||
        existing.caseType).trim(), subCat = _s_(schema.subCat || input.subCat || existing.subCat || existing.topic).trim(), assignees = _s_(schema.assignees || input.assignees || existing.assignees).trim(), receiveNoForSheet = _caseManualReceiveNoForSheet_(input.recNo ||
        input.receiveNo ||
        existing.recNo ||
        existing.receiveNo ||
        existing.เลขรับเรื่อง ||
        ""), statusForReason = _caseNormalizeStatusForDisplay_(String(input.status || existing.status || "เรื่องเข้าใหม่").trim()), incomingClosedReason = String(input.closedReason !== void 0
        ? input.closedReason
        : existing.closedReason || "").trim(), incomingRejectionReason = String(input.rejectionReason ||
        input.rejectReason ||
        input.notAcceptedReason ||
        input["เหตุผล(ไม่รับเรื่อง)"] ||
        existing.rejectionReason ||
        existing.rejectReason ||
        existing.notAcceptedReason ||
        existing["เหตุผล(ไม่รับเรื่อง)"] ||
        "").trim(), incomingPendingRemark = String(input.pendingRemark ||
        input.pendingReason ||
        input.waitReason ||
        input.waitingReason ||
        (statusForReason === "รอพิจารณา"
            ? input.statusReason ||
                input.reason ||
                input.เหตุผล ||
                existing.pendingRemark ||
                existing.pendingReason ||
                existing.statusReason ||
                existing.reason ||
                existing.เหตุผล ||
                ""
            : existing.pendingRemark || existing.pendingReason || "")).trim(), incomingStatusReason = "";
    return (statusForReason === "ไม่รับเรื่อง"
        ? ((incomingRejectionReason =
            incomingRejectionReason || incomingClosedReason),
            (incomingClosedReason = ""),
            (incomingPendingRemark = ""),
            (incomingStatusReason = incomingRejectionReason))
        : statusForReason === "ยุติเรื่อง"
            ? ((incomingClosedReason =
                incomingClosedReason || incomingRejectionReason),
                (incomingRejectionReason = ""),
                (incomingPendingRemark = ""),
                (incomingStatusReason = incomingClosedReason))
            : statusForReason === "รอพิจารณา"
                ? ((incomingPendingRemark =
                    incomingPendingRemark ||
                        incomingClosedReason ||
                        incomingRejectionReason),
                    (incomingClosedReason = ""),
                    (incomingRejectionReason = ""),
                    (incomingStatusReason = incomingPendingRemark))
                : ((incomingClosedReason = ""),
                    (incomingRejectionReason = ""),
                    (incomingPendingRemark = ""),
                    (incomingStatusReason = "")),
        _appAssignObjects_({}, existing, {
            caseId: resolvedId,
            caseNum: _caseManualNumericText_(input.caseNum || input.caseNo || existing.caseNum || ""),
            recNo: receiveNoForSheet,
            receiveNo: receiveNoForSheet,
            เลขรับเรื่อง: receiveNoForSheet,
            title,
            petitioners: _s_(input.petitioner || input.petitioners || existing.petitioners).trim(),
            respondent: String(_casePick_(_appAssignObjects_({}, existing, input), _C30K_RESPONDENT_) || "").trim(),
            assignees,
            staffs: String(_casePick_(_appAssignObjects_({}, existing, input), _C30K_STAFFS_) || "").trim(),
            coAssignees: String(_casePick_(_appAssignObjects_({}, existing, input), _C30K_CO_ASSIGNEES_) || "").trim(),
            offerDate: input.offerDate || existing.offerDate || "",
            recDate: input.recDate || existing.recDate || "",
            dueDate: input.dueDate || existing.dueDate || "",
            status: statusForReason,
            caseTitle: _s_(input.caseTitle || title || existing.caseTitle).trim(),
            subCat,
            subCategory: subCat,
            issue: subCat,
            remark: String(input.remark !== void 0 ? input.remark : existing.remark || "").trim(),
            keySummary: _s_(input.keySummary || input.summary || existing.keySummary).trim(),
            agencyName: _s_(input.agencyName || existing.agencyName).trim(),
            closedReason: incomingClosedReason,
            rejectionReason: incomingRejectionReason,
            pendingRemark: incomingPendingRemark,
            pendingReason: incomingPendingRemark,
            statusReason: incomingStatusReason,
            reason: incomingStatusReason,
            เหตุผล: incomingStatusReason,
            cat,
            subcommittee: _s_(input.subcommittee || existing.subcommittee).trim(),
            owner: assignees,
            responsibleCommissioners: assignees,
            petitionerPhone: _appPhoneForSheet_(input.petitionerPhone || existing.petitionerPhone || ""),
            meetingStatus: _s_(input.meetingStatus || existing.meetingStatus).trim(),
            subject: _s_(input.subject || title || existing.subject).trim(),
            caseType: cat,
            topic: subCat,
            schemaStamp: "domain-schema-cases-current",
            createdAt: existing.createdAt || now,
            updatedAt: now,
            isDeleted: !1,
            deletedAt: "",
        }));
}
function _applyCaseAiSummaryIfNeeded_(caseId, record, isNew) {
    if (!isNew)
        return "";
    record = record || {};
    var title = _s_(record.title || record.caseTitle).trim();
    if (!_getGeminiKey_() || !title)
        return "";
    try {
        var aiSummary = _generateCaseSummary_(title, record.petitioners || "", record.respondent || "");
        return (aiSummary &&
            !_s_(record.keySummary).trim() &&
            _getMainDataRepository_().upsert(caseId, {
                caseId,
                keySummary: aiSummary,
            }),
            aiSummary || "");
    }
    catch (_aiErr) {
        return (_recordWarning_("ec", _aiErr), "");
    }
}
function _caseNormalizeComparableText_(value) {
    return _c30S_(value).replace(/\s+/g, "").trim();
}
function _caseValidateIndependentFields_(input) {
    var caseNum = _caseManualNumericText_((input = input || {}).caseNum || input.caseNo || ""), recNo = _caseManualReceiveNoText_(input.recNo || input.receiveNo || ""), keySummary = _caseNormalizeComparableText_(input.keySummary || input.summary || ""), remark = _caseNormalizeComparableText_(input.remark || input.note || "");
    if (keySummary && remark && keySummary === remark)
        throw new Error("สรุปสาระสำคัญของเรื่อง และหมายเหตุต้องเป็นคนละรายการ ห้ามคัดลอกข้อความเดียวกัน");
    return !0;
}
function apiSaveCase(payload) {
    return writeGateway_("apiSaveCase", payload || {}, function (inputPayload) {
        (_appIsFnName_("_domainRouterAuthAlreadyOk_") &&
            _domainRouterAuthAlreadyOk_(inputPayload)) ||
            requireAuth_(inputPayload, "staff");
        var sess = _getSession_(inputPayload.token || inputPayload._token), c = _caseNormalizeInputDto_(inputPayload.case || inputPayload || {});
        _caseValidateIndependentFields_(c);
        var title = _s_(c.title || c.caseTitle).trim();
        if (!title)
            throw new Error("กรุณากรอกชื่อเรื่อง");
        var repo = _getMainDataRepository_(), existing = _findExistingCaseRecord_(c), now, record = _buildCaseCanonicalRecord_(c, existing, new Date().toISOString());
        _caseEnsureMainDataReferenceTextColumns_();
        var saved = repo.upsert(record.caseId, record);
        invalidateSheetCache_("MainData");
        var derivedInvalidation = _appIsFnName_("_invalidateCaseDerivedCaches_")
            ? _invalidateCaseDerivedCaches_("apiSaveCase")
            : {}, aiSummary = "";
        (!inputPayload ||
            (inputPayload.enableAiSummary !== !0 &&
                inputPayload.generateAiSummary !== !0 &&
                inputPayload.aiSummaryRequested !== !0) ||
            (aiSummary = _applyCaseAiSummaryIfNeeded_(record.caseId, record, saved && saved.mode === "create")),
            logAudit_("apiSaveCase", {
                caseId: record.caseId,
                mode: (saved && saved.mode) || (existing ? "update" : "create"),
                title,
                user: sess ? sess.username || sess.email : "unknown",
            }));
        var dto = _caseCanonicalDto_(record);
        return ok_(_appAssignObjects_({}, dto, {
            aiSummary: aiSummary || "",
            cacheInvalidation: derivedInvalidation || {},
        }), "บันทึกข้อมูลเรื่องสำเร็จ");
    }, "บันทึกข้อมูลเรื่องสำเร็จ", "บันทึกข้อมูลเรื่องไม่สำเร็จ");
}
function apiDeleteCase(payload) {
    return writeGateway_("apiDeleteCase", payload || {}, function (input) {
        (_appIsFnName_("_domainRouterAuthAlreadyOk_") &&
            _domainRouterAuthAlreadyOk_(input)) ||
            requireAuth_(input, "admin");
        var sess = _getSession_(input.token || input._token), caseId = _s_(input.caseId).trim();
        if (!caseId)
            throw new Error("ไม่พบ caseId");
        if ((getCanonicalHeaderAudit_("MainData"),
            !softDeleteSheetObjectByKey_("MainData", "caseId", caseId)))
            throw new Error("ไม่พบเรื่อง:" + caseId);
        invalidateSheetCache_("MainData");
        var derivedInvalidation = _appIsFnName_("_invalidateCaseDerivedCaches_")
            ? _invalidateCaseDerivedCaches_("apiDeleteCase")
            : {};
        return (logAudit_("apiDeleteCase", {
            caseId,
            user: sess ? sess.username : "unknown",
        }),
            ok_({
                deleted: !0, caseId, cacheInvalidation: derivedInvalidation || {}
            }, "ลบข้อมูลเรื่องสำเร็จ"));
    }, "ลบข้อมูลเรื่องสำเร็จ", "ลบข้อมูลเรื่องไม่สำเร็จ");
}

function apiGetCaseContext(payload) {
    return ((payload = requireDomainRequest_(payload, "viewer")),
        normalizeResult_(_Domain_getCaseContext(payload), "โหลดบริบทข้อมูลเรื่องสำเร็จ", "โหลดบริบทข้อมูลเรื่องไม่สำเร็จ"));
}









function _normalizeIdentityTextSafe_(value) {
    if (_appIsFnName_("_normalizeIdentityText_"))
        try {
            return _normalizeIdentityText_(value || "");
        }
        catch (_e) {
            _recordWarning_("ec", _e);
        }
    return _c30S_(value)
        .replace(/\s+/g, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .trim()
        .toLowerCase();
}
function _safeCaseIdentityKey_(row) {
    row = row || {};
    var seq = _caseSequenceFrom_(row);
    var primary = _s_(row.caseId || row.id).trim();
    return seq ? "seq:" + seq : primary ? "id:" + primary : "missing-sequence:" + _rowFreshnessScore_(row);
}






function _safeResolveCaseIdentityAliases_(payload) {
    payload = payload || {};
    var strictCaseNum = _caseSequenceFrom_(payload);
    if (strictCaseNum) {
        var strictResolved = _requireUniqueCaseBySequence_(_caseSequenceIdentityPayload_(strictCaseNum));
        var strictRow = strictResolved && strictResolved.row ? strictResolved.row : null;
        var strictIds = [];
        if (strictRow) {
            var strictCaseId = _s_(strictRow.caseId || strictRow.id).trim();
            strictCaseId && strictIds.push(strictCaseId);
        }
        return {
            ids: strictIds,
            case: strictRow,
            rows: strictRow ? [
                strictRow
            ] : [],
            caseNum: strictCaseNum,
            identityOwner: "case-sequence-strict-current-r146",
        };
    }
    var seedId = String((payload && (payload.caseId || payload.id)) || "").trim(), seedRows = [];
    if (seedId) {
        try {
            seedRows = (_listMainDataRows_(!1) || []).filter(function (row) {
                return (row &&
                    !isSoftDeletedRow_(row) &&
                    (_s_(row.caseId).trim() === seedId || _s_(row.id).trim() === seedId));
            });
        }
        catch (_strictIdErr) {
            _recordWarning_("case.identity.strictIdOnly", _strictIdErr, {
                caseId: seedId
            });
            seedRows = [];
        }
    }
    if (seedRows.length > 1)
        seedRows = _dedupeLatestRowsBy_(seedRows, function (row) {
            return _s_(row.caseId || row.id).trim();
        });
    var seedCase = seedRows.length === 1 ? seedRows[0] : null, ids = [];
    seedCase && _s_(seedCase.caseId || seedCase.id).trim() && ids.push(_s_(seedCase.caseId || seedCase.id).trim());
    return {
        ids: ids.filter(Boolean).filter(function (v, i, arr) {
            return arr.indexOf(v) === i;
        }),
        case: seedCase,
        rows: seedCase ? [
            seedCase
        ] : [],
        caseNum: seedCase ? _caseSequenceFrom_(seedCase) : "",
        identityOwner: seedCase
            ? "case-id-strict-current-r146"
            : "case-identity-empty-no-title-petitioner-fallback-r146",
    };
}
function _casePrimaryKeyMigrationState_(forceFresh) {
    var root = typeof globalThis != "undefined" ? globalThis : this, cacheKey = "__CASE_PRIMARY_KEY_MIGRATION_STATE_CACHE__", state = "LEGACY_READ_COMPAT";
    if (!forceFresh && root && root[cacheKey])
        return String(root[cacheKey]);
    try {
        var props = PropertiesService.getScriptProperties();
        state = String(props.getProperty(CASE_PRIMARY_KEY_MIGRATION_STATE_PROPERTY) ||
            "LEGACY_READ_COMPAT")
            .trim()
            .toUpperCase();
    }
    catch (e) {
        _recordWarning_("case.primaryKeyMigration.state.read", e);
    }
    if ([
        "LEGACY_READ_COMPAT", "QUARANTINE_PENDING", "ENFORCED"
    ].indexOf(state) < 0)
        state = "LEGACY_READ_COMPAT";
    if (root)
        root[cacheKey] = state;
    return state;
}
function _casePrimaryKeyStrictReadEnabled_() {
    return _casePrimaryKeyMigrationState_(!1) === "ENFORCED";
}
function _casePrimaryKeySetMigrationState_(state, detail) {
    state = String(state || "LEGACY_READ_COMPAT")
        .trim()
        .toUpperCase();
    if ([
        "LEGACY_READ_COMPAT", "QUARANTINE_PENDING", "ENFORCED"
    ].indexOf(state) < 0)
        throw new Error("สถานะ Primary Key Migration ไม่ถูกต้อง: " + state);
    var props = PropertiesService.getScriptProperties(), now = new Date().toISOString(), root = typeof globalThis != "undefined" ? globalThis : this, values = {};
    values[CASE_PRIMARY_KEY_MIGRATION_STATE_PROPERTY] = state;
    values.CASE_PRIMARY_KEY_MIGRATION_LAST_RUN_AT = now;
    values.CASE_PRIMARY_KEY_MIGRATION_LAST_DETAIL = _safeJsonStringify_(detail || {}).slice(0, 8000);
    props.setProperties(values, !1);
    if (root)
        root.__CASE_PRIMARY_KEY_MIGRATION_STATE_CACHE__ = state;
    return {
        state: state, updatedAt: now
    };
}
function _assertCaseWritePrimaryKeyConsistency_(payload, operation) {
    payload = payload && typeof payload === "object" ? payload : {};
    operation = String(operation || "case-write");
    var scopes = [
        payload, payload.caseIdentity, payload.case, payload.log, payload.meetingLog, payload.history, payload.letter, payload.row
    ].filter(function (item) {
        return item && typeof item === "object";
    }), sequences = [], caseIds = [];
    function pushUnique(list, value) {
        value = String(value || "").trim();
        value && list.indexOf(value) < 0 && list.push(value);
    }
    function fail(code, message, detail) {
        var error = new Error(message);
        throw error.errorCode = code, error.detail = detail || {}, error;
    }
    scopes.forEach(function (scope) {
        pushUnique(sequences, _caseSequenceNormalizeStrict_(_caseSequenceFrom_(scope)));
        pushUnique(caseIds, scope.caseId || scope.caseID || scope.case_id || "");
    });
    if (!sequences.length)
        fail("PRIMARY_KEY_SEQUENCE_REQUIRED", "ไม่พบลำดับเรื่องสำหรับ " + operation, {
            operation: operation, primaryKey: "ลำดับเรื่อง"
        });
    if (sequences.length > 1)
        fail("PRIMARY_KEY_SEQUENCE_CONFLICT", "พบลำดับเรื่องหลายค่าในคำขอเดียวกัน", {
            operation: operation, sequences: sequences
        });
    var caseNum = sequences[0], resolved = _requireUniqueCaseBySequence_(_caseSequenceIdentityPayload_(caseNum)), row = resolved && resolved.row ? resolved.row : null, canonicalCaseId = _s_(row && (row.caseId || row.id) || "").trim();
    if (!row || !canonicalCaseId)
        fail("PRIMARY_KEY_CANONICAL_CASE_NOT_FOUND", "ไม่พบเรื่องพิจารณาที่ตรงกับลำดับเรื่อง: " + caseNum, {
            operation: operation, caseNum: caseNum
        });
    var mismatches = caseIds.filter(function (value) {
        return value !== canonicalCaseId;
    });
    if (mismatches.length)
        fail("PRIMARY_KEY_CASE_ID_CONFLICT", "caseId ไม่ตรงกับลำดับเรื่องที่เลือก ระบบยกเลิกการบันทึกเพื่อป้องกันข้อมูลผิดเรื่อง", {
            operation: operation, caseNum: caseNum, canonicalCaseId: canonicalCaseId, receivedCaseIds: caseIds
        });
    return {
        ok: !0, operation: operation, primaryKey: "ลำดับเรื่อง", caseNum: caseNum, caseId: canonicalCaseId, case: row, identityOwner: "case-sequence-p0-primary-key-migration-r154"
    };
}

function _caseReadProjectedRowsStrict_(sheetName, fields, opts) {
    opts = opts || {};
    sheetName = _s_(sheetName).trim();
    if (!fields || !fields.length)
        throw new Error(String(opts.unavailableCode || "CASE_PROJECTED_READER_UNAVAILABLE") + ":" + sheetName);
    try {
        var readOpts = {
            includeDeleted: opts.includeDeleted === !0,
            ttl: Number(opts.ttl || 120) || 120
        };
        Object.prototype.hasOwnProperty.call(opts, "requireCanonical") && (readOpts.requireCanonical = opts.requireCanonical === !0);
        opts.forceFresh === !0 && (readOpts.forceFresh = !0);
        opts.noCache === !0 && (readOpts.noCache = !0);
        opts.bypassCache === !0 && (readOpts.bypassCache = !0);
        opts.bypassRequestCache === !0 && (readOpts.bypassRequestCache = !0);
        opts.selectKeyField && (readOpts.selectKeyField = opts.selectKeyField);
        opts.selectKeyValues != null && (readOpts.selectKeyValues = opts.selectKeyValues);
        opts.selectRowNumbers && (readOpts.selectRowNumbers = opts.selectRowNumbers);
        opts.selectionMode && (readOpts.selectionMode = opts.selectionMode);
        opts.selectionFallbackOnEmpty === !0 && (readOpts.selectionFallbackOnEmpty = !0);
        opts.batchSize && (readOpts.batchSize = opts.batchSize);
        return _caseDomainSharedRows_(sheetName, fields, readOpts) || [];
    }
    catch (_projectedErr) {
        _recordWarning_("ec", _projectedErr);
        throw new Error(String(opts.failedCode || "CASE_PROJECTED_READER_FAILED") + ":" + sheetName + ":" +
            String(_projectedErr && _projectedErr.message ? _projectedErr.message : _projectedErr));
    }
}





































function _caseArrayPayload_(value) {
    if (_c30A_(value))
        return value.filter(Boolean);
    if (value && typeof value === "object") {
        var keys = ["rows", "items", "data", "records"];
        for (var i = 0; i < keys.length; i++)
            if (_c30A_(value[keys[i]]))
                return value[keys[i]].filter(Boolean);
        return value.payload ? _caseArrayPayload_(value.payload) : value.result ? _caseArrayPayload_(value.result) : [];
    }
    var raw = _s_(value).replace(/^'+/, "").trim();
    if (!raw || raw === "-" || raw === "[]" || raw === "{}" || /^(?:null|undefined)$/i.test(raw))
        return [];
    try {
        return _caseArrayPayload_(JSON.parse(raw));
    }
    catch (_jsonErr) {
        return [];
    }
}
function _caseFirstArrayField_(row, normalized, keys) {
    row = row || {};
    normalized = normalized || {};
    for (var i = 0; i < keys.length; i++) {
        var values = [row[keys[i]], normalized[keys[i]]];
        for (var j = 0; j < values.length; j++) {
            var parsed = _caseArrayPayload_(values[j]);
            if (parsed.length)
                return parsed;
        }
    }
    return [];
}
function _caseMergeNonEmpty_(base, fresh) {
    var out = _appAssignObjects_({}, base || {});
    Object.keys(fresh || {}).forEach(function (key) {
        var value = fresh[key], usable = _c30A_(value) ? value.length : value !== void 0 && value !== null && _s_(value).trim() !== "";
        if (usable || !(key in out))
            out[key] = value;
    });
    return out;
}












































function _caseHeaderIndex_(headers) {
    var map = {};
    (headers || []).forEach(function (header, index) {
        map[_s_(header).trim()] = index;
    });
    return function (names) {
        for (var i = 0; i < names.length; i++)
            if (map[names[i]] !== void 0)
                return map[names[i]];
        return -1;
    };
}























((MeetingDomain.getLookupOptions = function (payload) {
    try {
        return ((payload = requireDomainRequest_(payload, "viewer")),
            ok_(_Domain_getMeetingLookupOptions(payload), "โหลดข้อมูลตัวเลือกการประชุมสำเร็จ"));
    }
    catch (e) {
        return (_c30W_("cases.meetingLookup.auth", e),
            err_("ไม่สามารถโหลดข้อมูลตัวเลือกการประชุมได้:ไม่พบ token การใช้งาน กรุณาเข้าสู่ระบบใหม่แล้วลองอีกครั้ง", {
                authRequired: !0,
                route: "apiGetMeetingLookupOptions",
                error: String((e && e.message) || e),
            }));
    }
}),
    (MeetingDomain.getHistory = function (payload) {
        payload = payload || {};
        var perfToken = _appIsFnName_("_appApiPerfStart_")
            ? _appApiPerfStart_("apiGetMeetingHistory", payload)
            : null;
        (_appIsFnName_("_domainRouterAuthAlreadyOk_") &&
            _domainRouterAuthAlreadyOk_(payload)) ||
            requireAuth_(payload, "viewer");
        var rows = _Domain_getMeetingHistory(payload), data = _paginateArrayResult_(rows, payload, 20, 250, {
            source: "getMeetingHistory",
            pageFacade: "AppPageKit.rowsFrom-publicBridge",
            domainOwner: "MeetingDomain.getHistory",
        });
        return (_appIsFnName_("_appApiPerfEnd_") &&
            (data = _appApiPerfEnd_(perfToken, "ok", data, {
                rowsRead: _c30A_(rows) ? rows.length : 0,
            })),
            ok_(data, "โหลดประวัติการประชุมสำเร็จ"));
    }),
    (MeetingDomain.saveLog = function (payload) {
        try {
            return ((payload = requireDomainRequest_(payload, "staff")),
                normalizeResult_(saveMeetingLog(payload), "บันทึกประวัติการประชุมสำเร็จ", "บันทึกประวัติการประชุมไม่สำเร็จ"));
        }
        catch (e) {
            var message = String((e && e.message) || e || "บันทึกประวัติการประชุมไม่สำเร็จ");
            return (_c30W_("cases.saveMeetingLog", e),
                err_("บันทึกประวัติการประชุมไม่สำเร็จ:" + message, {
                    route: "apiSaveMeetingLog",
                    error: message,
                }));
        }
    }),
    (MeetingDomain.deleteLog = function (payload) {
        payload = requireDomainRequest_(payload, "staff");
        var logId = _payloadValue_(payload, [
            "logId",
            "id",
            "meetingLogId",
            "currentLogId",
        ]);
        return logId
            ? ((payload.logId = logId),
                (payload.id = logId),
                normalizeResult_(deleteMeetingLog(payload), "ลบประวัติการประชุมสำเร็จ", "ลบประวัติการประชุมไม่สำเร็จ"))
            : err_("ลบประวัติการประชุมไม่สำเร็จ:ไม่พบรหัสรายการประชุม", {
                route: "apiDeleteMeetingLog",
            });
    }),
    (TrackingDomain.getLetters = function (payload) {
        payload = requireDomainRequest_(payload, "viewer");
        var rows = _Domain_getLetters(payload);
        return ok_(_paginateArrayResult_(rows, payload, 20, 250, {
            source: "getLetters",
            domainOwner: "TrackingDomain.getLetters",
        }), "โหลดข้อมูลหนังสือสำเร็จ");
    }),
    (TrackingDomain.saveLetter = function (payload) {
        return ((payload = requireDomainRequest_(payload, "staff")),
            auditEvent_("letters", {
                route: "apiSaveLetter",
                caseId: payload.caseId || "",
            }),
            _normalizeOkEnvelope_(saveLetter(payload), "บันทึกหนังสือติดตามสำเร็จ", "บันทึกหนังสือติดตามไม่สำเร็จ"));
    }),
    (TrackingDomain.deleteLetter = function (payload) {
        return ((payload = requireDomainRequest_(payload, "staff")),
            _normalizeOkEnvelope_(deleteLetter(payload), "ลบหนังสือติดตามสำเร็จ", "ลบหนังสือติดตามไม่สำเร็จ"));
    }));








(typeof _Domain_getCanonicalCaseBundle == "function" &&
    (AppDomain.getCanonicalCaseBundle = _Domain_getCanonicalCaseBundle),
    (AppDomain.CasesService = AppDomain.CasesService || {
        cleanOwner: !0,
        getBundle: function (payload) {
            return _Domain_getCanonicalCaseBundle(payload || {});
        },
        getContext: function (payload) {
            return _Domain_getCaseContext(payload || {});
        },
        findExisting: function (payload) {
            return _findExistingCaseRecord_(payload || {});
        },
        repository: function () {
            return _getMainDataRepository_();
        },
    }),
    typeof _Domain_getCaseIdentityHealthReport == "function" &&
        (AppDomain.getCaseIdentityHealthReport =
            _Domain_getCaseIdentityHealthReport),
    typeof _Domain_getLetters == "function" &&
        (AppDomain.getLetters = _Domain_getLetters),
    typeof _Domain_getMeetingHistory == "function" &&
        (AppDomain.getMeetingHistory = _Domain_getMeetingHistory),
    (AppDomain.getDashboardStatsRaw = _Domain_getDashboardStatsRaw_));












/* R146: title/petitioner relation-key helpers removed; relation identity is sequence/caseId only. */
















function _caseReadMainDataRowsForSearch_(fields, opts) {
    opts = opts || {};
    var requested = _c30A_(fields) ? fields.slice() : [], projectedFields = requested.length ? requested.slice() : _caseSearchProjectedFields_(), ttl = opts.forceFresh === !0 || opts.noCache === !0 || opts.bypassCache === !0 ? 0 : Math.max(60, Math.min(Number(opts.cacheTtlSeconds || opts.ttl || 180) || 180, 300));
    try {
        var projectedRows = readSheetProjectedObjectsCached_("MainData", projectedFields, {
            includeDeleted: !1,
            requireCanonical: !1,
            ttl: ttl,
            batchSize: 500
        });
        if (_c30A_(projectedRows) && projectedRows.length) {
            var projected = _caseSearchCanonicalRows_(projectedRows, requested), identityCount = projected.filter(_caseSearchHasIdentity_).length;
            if (identityCount) {
                _requestScopeNoteRowsRead_("MainData.projected.identity", projected.length);
                return projected;
            }
            _c30W_("case.search.projectedRead.emptyIdentity.fullMatrixRead", new Error("PROJECTED_ROWS_WITHOUT_CASE_IDENTITY"));
        }
    }
    catch (projectedErr) {
        _c30W_("case.search.projectedRead.fullMatrixRead", projectedErr);
    }
    try {
        var sheet = getSheet_("MainData"), matrix = getSheetMatrixCached_(sheet, 0, { allowFullMatrix: !0 });
        if (!_c30A_(matrix) || matrix.length < 2)
            return [];
        var schema = typeof SHEET_SCHEMAS !== "undefined" && _c30A_(SHEET_SCHEMAS.MainData) ? SHEET_SCHEMAS.MainData : [], aliases = typeof SHEET_HEADER_ALIASES !== "undefined" && SHEET_HEADER_ALIASES.MainData || {}, rows = AppBackendCore.matrixToObjects(matrix, {
            schema: schema,
            aliases: aliases,
            appAliases: typeof getAppFieldAliases_ === "function" ? getAppFieldAliases_("MainData") : aliases,
            normalizeKey: normalizeDirectRowKey_,
            includeDeleted: !1
        });
        rows = _caseSearchCanonicalRows_(rows, requested);
        _requestScopeNoteRowsRead_("MainData", rows.length);
        return rows;
    }
    catch (e) {
        _c30W_("case.directMainData.recDateOwner.failed", e);
        return [];
    }
}
function _caseProjectedRows_(fields, ttl) {
    var requested = fields || _caseSearchProjectedFields_(), rows = [];
    try {
        rows = _caseReadMainDataRowsForSearch_(requested) || [];
    }
    catch (directErr) {
        (_c30W_("case.search.projectedRows.directMainDataRecDate", directErr),
            (rows = []));
    }
    if (!rows.length) {
        var effectiveTtl = ttl === 0 ? 0 : ttl || 180;
        try {
            rows =
                _caseDomainSharedRows_("MainData", requested, {
                    includeDeleted: !1,
                    requireCanonical: !1,
                    ttl: effectiveTtl,
                }) || [];
        }
        catch (e) {
            (_c30W_("case.search.projectedRows.sharedRead", e), (rows = []));
        }
    }
    return (_c30A_(rows) ? rows : [])
        .map(_caseSearchEnsureReceiveNo_)
        .filter(function (row) {
        var deleted = _s_(row.isDeleted || row.deleted || row.deletedAt)
            .trim()
            .toLowerCase();
        if (deleted === "true" ||
            deleted === "1" ||
            deleted === "deleted" ||
            deleted === "ลบ")
            return !1;
        var type = _s_(row.type).trim().toLowerCase(), label = _s_(row.typeLabel).trim();
        return (type !== "letter" && label !== "หนังสือ" && label !== "หนังสือติดตามมติ");
    });
}
function _caseAttachMeetingHistoryCurrent_(rows) {
    return _appIsFnName_("_caseReportApplyMeetingHistory_")
        ? _caseReportApplyMeetingHistory_(_c30A_(rows) ? rows : [])
        : _c30A_(rows)
            ? rows
            : [];
}

function _caseSortRowsForSearch_(rows, payload) {
    ((payload = payload || {}), (rows = _c30A_(rows) ? rows : []));
    var sortBy = String(payload.sortBy || "caseNum").trim() || "caseNum", sortDir = String(payload.sortDir || "asc").toLowerCase() === "desc" ? -1 : 1;
    return rows.slice().sort(function (a, b) {
        function sortValue(row) {
            if (sortBy === "caseNum" ||
                sortBy === "caseNo" ||
                sortBy === "runningNo" ||
                sortBy === "ลำดับเรื่อง") {
                var raw, m = String((row &&
                    (row.caseNum ||
                        row.caseNo ||
                        row.runningNo ||
                        row.ลำดับเรื่อง)) ||
                    "")
                    .replace(/^'+/, "")
                    .trim()
                    .match(/^\d+/);
                return m ? Number(m[0]) : Number.POSITIVE_INFINITY;
            }
            if (sortBy === "recNo" ||
                sortBy === "receiveNo" ||
                sortBy === "เลขรับเรื่อง") {
                var rn, rm = String((row && (row.recNo || row.receiveNo || row.เลขรับเรื่อง)) || "")
                    .replace(/^'+/, "")
                    .trim()
                    .match(/^\d+/);
                return rm ? Number(rm[0]) : Number.POSITIVE_INFINITY;
            }
            return row && row[sortBy];
        }
        var av = sortValue(a), bv = sortValue(b);
        return typeof av == "number" &&
            typeof bv == "number" &&
            isFinite(av) &&
            isFinite(bv) &&
            av !== bv
            ? (av - bv) * sortDir
            : _c30S_(av).localeCompare(_c30S_(bv), "th") * sortDir;
    });
}
function _caseBuildSearchIndexSummary_(rows) {
    rows = _c30A_(rows) ? rows : [];
    var byStatus = {}, byType = {}, byFy = {}, recNoCount = 0, caseNoCount = 0;
    return (rows.forEach(function (row) {
        row = row || {};
        var status = String(row.status || row.statusText || row.สถานะเรื่อง || "ไม่ระบุ").trim() || "ไม่ระบุ", type = String(row.category ||
            row.caseType ||
            row.typeName ||
            row.ประเภท ||
            "ไม่ระบุ").trim() || "ไม่ระบุ", fy = _s_(row.fy || row.fiscalYear || row.budgetFy || row.ปีงบประมาณ).replace(/[^0-9]/g, "") || "ไม่ระบุ";
        ((byStatus[status] = Number(byStatus[status] || 0) + 1),
            (byType[type] = Number(byType[type] || 0) + 1),
            (byFy[fy] = Number(byFy[fy] || 0) + 1),
            _s_(row.recNo || row.receiveNo || row.เลขรับเรื่อง).trim() &&
                recNoCount++,
            _s_(row.caseNum || row.caseNo || row.runningNo || row.ลำดับเรื่อง).trim() && caseNoCount++);
    }),
        {
            ok: !0,
            modelId: "case-search-index-current",
            totalRecords: rows.length,
            byStatus,
            byType,
            byFiscalYear: byFy,
            recNoCoverage: recNoCount,
            caseNoCoverage: caseNoCount,
            generatedAt: new Date().toISOString(),
        });
}
var CASE_REPORT_READ_MODEL_STAMP_CURRENT = "performance-k-case-report-read-model-r166";























var PERFORMANCE_K_CASE_REPORT_STAMP = "performance-k-search-report-r166";











var DASHBOARD_STATUS_READ_MODEL_STAMP_CURRENT = "dashboard-status-read-model-current-r253";






























































var DASHBOARD_HOT_READ_MODEL_STAMP = "dashboard-bundle-read-model-index-v1-2026-07-01";


((DashboardDomain.VERSION = "dashboard-domain-persistent-compact-r162"),
    (DashboardDomain.getBundle = function (payload) {
        var started = Date.now();
        return (((payload = payload || {}).includeBudget = payload.permissionIncludeBudget === !1 ? !1 : payload.includeBudget !== !1),
            (payload.includeCases = payload.includeCases === !0),
            (payload.phase1FirstPaint = !1),
            (payload.phase1LazyHydration = !1),
            (payload.dashboardSingleCompletePath = !0),
            (payload.hotPathMode = "dashboard-persistent-compact-snapshot-g-r162"),
            _dashboardHotAttachMeta_(_apiGetDashboardBundleCore_(payload), payload, started));
    }),
    (DashboardDomain.status = function () {
        return _domainStatus_(DashboardDomain, "DashboardDomain", {
            version: DashboardDomain.VERSION || "dashboard-domain-single-bundle-current",
            apiNamesPreserved: !0,
        });
    }),
    (CaseDomain.SHEET_NAME = "MainData"),
    (CaseDomain.VERSION = "case-domain-production-single-owner-current"),
    (CaseDomain.Services = CaseDomain.Services || {
        Repository: {
            source: "MainData"
        },
        Search: {
            source: "MainData", dto: "CaseSearchRowDTO"
        },
        Report: {
            source: "MainData+MeetingLogs"
        },
        MeetingHistory: {
            source: "MeetingLogs"
        },
    }),
    (CaseDomain.caseText = function (value) {
        return typeof AppBackendCore != "undefined" && AppBackendCore.text
            ? AppBackendCore.text(value)
            : _c30S_(value).trim();
    }),
    (CaseDomain.pick = function (row, keys, defaultValue) {
        return typeof AppBackendCore != "undefined" && AppBackendCore.pick
            ? AppBackendCore.pick(row, keys, defaultValue)
            : (row && row[keys]) || defaultValue || "";
    }),
    (CaseDomain.toSearchRow = function (row, seq) {
        if (((row = row || {}),
            typeof AppBackendCore != "undefined" &&
                AppBackendCore.normalizeCaseSearchDto)) {
            var base = AppBackendCore.normalizeCaseSearchDto(row, seq) || {}, comm = CaseDomain.pick(row, [
                "committeeHistory",
                "committeeMeeting",
                "committeeMeetings",
                "meetingCommitteeHistory",
                "คณะกรรมาธิการ",
            ], ""), sub = CaseDomain.pick(row, [
                "subcommitteeHistory",
                "subcommitteeMeeting",
                "subcommitteeMeetings",
                "meetingSubcommitteeHistory",
                "คณะอนุกรรมาธิการ",
            ], "");
            return (comm &&
                ((base.committeeHistory = base.committeeHistory || comm),
                    (base.committeeMeeting = base.committeeMeeting || comm),
                    (base.คณะกรรมาธิการ = base.คณะกรรมาธิการ || comm)),
                sub &&
                    ((base.subcommitteeHistory = base.subcommitteeHistory || sub),
                        (base.subcommitteeMeeting = base.subcommitteeMeeting || sub),
                        (base.คณะอนุกรรมาธิการ = base.คณะอนุกรรมาธิการ || sub)),
                (base.reportColumns = _appAssignObjects_({}, base.reportColumns || {}, {
                    committeeHistory: base.committeeHistory || "",
                    subcommitteeHistory: base.subcommitteeHistory || "",
                    operationOfficer: base.operationOfficer ||
                        base.opStaff ||
                        base.staffs ||
                        base.เจ้าหน้าที่ฝ่ายเลขานุการ ||
                        "",
                })),
                (base.dtoOwner = "CaseDomain.toSearchRow.production"),
                base);
        }
        var recDate = CaseDomain.pick(row, [
            "recDate", "recDateText", "วันที่รับเรื่อง", "receiveDate"
        ], ""), statusRaw = CaseDomain.pick(row, [
            "status", "สถานะ"
        ], ""), status = typeof AppBackendCore != "undefined" &&
            AppBackendCore.normalizeCaseStatus
            ? AppBackendCore.normalizeCaseStatus(statusRaw, {
                defaultStatus: "เรื่องเข้าใหม่",
            })
            : _caseNormalizeStatusForDisplay_(statusRaw), loc = typeof AppBackendCore != "undefined" && AppBackendCore.location
            ? AppBackendCore.location(row)
            : {
                subdistrict: CaseDomain.pick(row, [
                    "ตำบล", "subdistrict"
                ], ""),
                district: CaseDomain.pick(row, [
                    "อำเภอ", "district"
                ], ""),
                province: CaseDomain.pick(row, [
                    "จังหวัด", "province"
                ], ""),
            }, title = CaseDomain.pick(row, [
            "title", "subject", "ชื่อเรื่อง", "เรื่อง"
        ], ""), fullName = CaseDomain.pick(row, [
            "fullName",
            "petitionerName",
            "petitioners",
            "ชื่อ-สกุล",
            "ผู้เสนอญัตติ/ผู้ร้อง",
        ], ""), coOwners = CaseDomain.pick(row, [
            "coOwners", "coAssignees", "ผู้ร่วมรับผิดชอบ", "ผู้รับผิดชอบร่วม"
        ], ""), out = {
            id: CaseDomain.pick(row, [
                "id", "caseId", "รหัส"
            ], ""),
            caseId: CaseDomain.pick(row, [
                "caseId", "id", "รหัส"
            ], ""),
            seq,
            caseNo: CaseDomain.pick(row, [
                "caseNo", "caseNum", "ลำดับเรื่อง"
            ], ""),
            caseNum: CaseDomain.pick(row, [
                "caseNo", "caseNum", "ลำดับเรื่อง"
            ], ""),
            recNo: CaseDomain.pick(row, [
                "recNo", "เลขรับเรื่อง", "receiveNo"
            ], ""),
            recDate,
            recDateText: typeof AppBackendCore != "undefined" && AppBackendCore.dateText
                ? AppBackendCore.dateText(recDate)
                : _s_(recDate),
            title,
            subject: title,
            considerationTitle: CaseDomain.pick(row, [
                "considerationTitle",
                "ชื่อเรื่องพิจารณา",
                "ชื่อเรื่องพิจารณา (ถ้ามี)",
            ], ""),
            petitionerName: fullName,
            petitioners: fullName,
            fullName,
            respondent: CaseDomain.pick(row, [
                "respondent", "ผู้ถูกร้อง"
            ], ""),
            agency: CaseDomain.pick(row, [
                "agency", "หน่วยงาน"
            ], ""),
            assignees: CaseDomain.pick(row, [
                "assignees", "กมธ.รับผิดชอบ", "กรรมาธิการรับผิดชอบ"
            ], ""),
            coAssignees: coOwners,
            coOwners,
            opStaff: CaseDomain.pick(row, [
                "opStaff", "เจ้าหน้าที่ฝ่ายเลขานุการ", "เจ้าหน้าที่ฝ่ายปฏิบัติการ"
            ], ""),
            cat: CaseDomain.pick(row, [
                "cat", "ประเภทเรื่อง", "ประเภท"
            ], ""),
            subCat: CaseDomain.pick(row, [
                "subCat", "ประเด็นพิจารณา", "ประเด็น"
            ], ""),
            committeeHistory: CaseDomain.pick(row, [
                "committeeHistory", "committeeMeeting", "คณะกรรมาธิการ"
            ], ""),
            subcommitteeHistory: CaseDomain.pick(row, [
                "subcommitteeHistory", "subcommitteeMeeting", "คณะอนุกรรมาธิการ"
            ], ""),
            status,
            statusRaw,
            type: "case",
            typeLabel: "เรื่องพิจารณา",
            subdistrict: loc.subdistrict,
            district: loc.district,
            province: loc.province,
        };
        return ((out.statusMeta =
            typeof AppBackendCore != "undefined" && AppBackendCore.statusMeta
                ? AppBackendCore.statusMeta(status, recDate)
                : {
                    status
                }),
            (out.reportColumns = {
                caseNo: out.caseNo,
                recNo: out.recNo,
                recDateText: out.recDateText,
                title: out.title,
                considerationTitle: out.considerationTitle,
                committeeHistory: out.committeeHistory || "",
                subcommitteeHistory: out.subcommitteeHistory || "",
                petitioners: out.petitioners,
                status: out.status,
            }),
            out);
    }),
    (CaseDomain.toCompactSearchRow = function (row, seq) {
        var dto = CaseDomain.toSearchRow(row || {}, seq) || {}, compact = {
            id: dto.id || dto.caseId || "",
            caseId: dto.caseId || dto.id || "",
            seq: dto.seq || seq || "",
            caseNo: dto.caseNo || dto.caseNum || "",
            caseNum: dto.caseNum || dto.caseNo || "",
            recNo: dto.recNo || dto.receiveNo || "",
            recDate: dto.recDate || dto.recDateText || "",
            recDateText: dto.recDateText || dto.recDate || "",
            offerDate: dto.offerDate ||
                dto.offerDateText ||
                dto.bookDate ||
                dto.letterDate ||
                dto.documentDate ||
                "",
            offerDateText: dto.offerDateText ||
                dto.offerDate ||
                dto.bookDate ||
                dto.letterDate ||
                dto.documentDate ||
                "",
            bookDate: dto.bookDate || dto.offerDate || dto.offerDateText || "",
            letterDate: dto.letterDate || dto.offerDate || dto.offerDateText || "",
            documentDate: dto.documentDate || dto.offerDate || dto.offerDateText || "",
            title: dto.title || dto.subject || "",
            considerationTitle: dto.considerationTitle || dto.caseTitle || "",
            petitioners: dto.petitioners || dto.petitionerName || "",
            respondent: dto.respondent || dto.agency || dto.agencyName || "",
            agency: dto.agency || dto.respondent || dto.agencyName || "",
            assignees: dto.assignees || "",
            coAssignees: dto.coAssignees || dto.coOwners || "",
            opStaff: dto.opStaff || dto.operationOfficer || dto.staffs || "",
            cat: dto.cat || "",
            subCat: dto.subCat || "",
            status: dto.status || "เรื่องเข้าใหม่",
            statusRaw: dto.statusRaw || dto.status || "",
            closedReason: dto.closedReason || "",
            rejectionReason: dto.rejectionReason || "",
            pendingRemark: dto.pendingRemark || dto.pendingReason || "",
            pendingReason: dto.pendingReason || dto.pendingRemark || "",
            reason: dto.reason ||
                dto.pendingRemark ||
                dto.pendingReason ||
                dto.closedReason ||
                dto.rejectionReason ||
                "",
            sentAgency: dto.sentAgency || "",
            committeeHistory: dto.committeeHistory || "",
            subcommitteeHistory: dto.subcommitteeHistory || "",
            type: "case",
            typeLabel: "เรื่องพิจารณา",
        };
        return ((compact.ลำดับเรื่อง = compact.caseNo),
            (compact.เลขรับเรื่อง = compact.recNo),
            (compact.วันที่รับเรื่อง = compact.recDateText),
            (compact.ชื่อเรื่อง = compact.title),
            (compact["ชื่อเรื่องพิจารณา (ถ้ามี)"] = compact.considerationTitle),
            (compact["ผู้เสนอญัตติ/ผู้ร้อง"] = compact.petitioners),
            (compact.สถานะ = compact.status),
            compact);
    }),
    (CaseDomain.matchRow = function (row, payload) {
        payload = payload || {};
        var q = CaseDomain.caseText(payload.query || payload.q || payload.keyword || "").toLowerCase(), reportType = CaseDomain.caseText(payload.reportType || payload.groupType || payload.type || "all"), reportValue = CaseDomain.caseText(payload.reportValue || payload.groupValue || payload.value || ""), hay;
        if (q &&
            [
                row.caseNo,
                row.caseNum,
                row.recNo,
                row.recDateText,
                row.title,
                row.subject,
                row.considerationTitle,
                row.caseTitle,
                row.petitionerName,
                row.petitioners,
                row.respondent,
                row.agency,
                row.agencyName,
                row.assignees,
                row.coOwners,
                row.coAssignees,
                row.opStaff,
                row.operationOfficer,
                row.staffs,
                row.status,
                row.cat,
                row.subCat,
            ]
                .join(" ")
                .toLowerCase()
                .indexOf(q) < 0)
            return !1;
        if (reportType && reportType !== "all" && reportValue) {
            var field = reportType === "cat"
                ? row.cat
                : reportType === "sub"
                    ? row.subCat
                    : reportType === "comm"
                        ? row.assignees
                        : reportType === "status"
                            ? row.status
                            : "", fieldText = CaseDomain.caseText(field);
            if (reportType === "comm"
                ? fieldText.indexOf(reportValue) < 0
                : fieldText !== reportValue)
                return !1;
        }
        return !0;
    }));
var CASE_REPORT_INDEX_STAMP_CURRENT = "performance-k-case-report-index-r166";









function _getQaGate_(payload) {
    payload = payload || {};
    var started = Date.now();
    var current = _appIsFnName_("_currentQualityGateStatus_") ? _currentQualityGateStatus_({
        includeCases: payload.includeCases === !0,
        requireLiveEvidence: !1
    }) : null;
    var regression = current && current.regression || null;
    var checks = regression && Array.isArray(regression.cases) ? regression.cases : [];
    var failed = regression ? Number(regression.failCount != null ? regression.failCount : regression.failed || 0) : 1;
    var passed = regression ? Number(regression.passCount != null ? regression.passCount : regression.passed || 0) : 0;
    return {
        ok: !!(current && current.ok),
        owner: "Code_06_Platform_QualityGates.CurrentQualityGate",
        stamp: String(current && current.stamp || "current-quality-gate-unavailable"),
        checks: checks,
        passed: passed,
        failed: failed,
        currentQualityGate: current,
        compatibilityFacade: !0,
        canonicalOwner: "Code_06_Platform_QualityGates.CurrentQualityGate",
        readOnly: !0,
        noDataMutation: !0,
        durationMs: Math.max(0, Date.now() - started),
        generatedAt: new Date().toISOString(),
        meta: { source: "CurrentQualityGateCompatibilityFacade", uiDomChanged: !1, businessLogicChanged: !1 }
    };
}
function apiGetPhase4QaGate(payload) {
    return _getQaGate_(payload);
}

var HOT_ROUTE_READ_MODEL_STAMP = "hot-route-materialized-index-v2-2026-07-02", CASE_SEARCH_MATERIALIZED_INDEX_STAMP = "case-search-materialized-index-performance-hot-path-c-r169", TRACKING_MATERIALIZED_INDEX_STAMP = "tracking-materialized-index-v2-2026-07-02";




function _casePayloadSessionScope_(payload) {
    payload = payload || {};
    var security = payload._securityContext || payload.__securityContext || {}, role = _s_(security.role || payload.role || "viewer").trim().toLowerCase() || "viewer", visibility = _s_(security.visibilityScope || payload.visibilityScope || payload.dataVisibilityScope || "role-wide").trim().toLowerCase() || "role-wide", principalScoped = /^(self|owner|principal|user|user-only)$/.test(visibility), principal = principalScoped
        ? _s_(security.userId || security.username || security.email || payload.userId || payload.username || payload.email || "anonymous").trim().toLowerCase()
        : "";
    return _hotRouteDigest_(JSON.stringify({
        role: role,
        visibility: visibility,
        principal: principal,
        group: _s_(security.group || "cases").trim().toLowerCase(),
    })).substring(0, 32);
}
function _casePayloadSequenceScope_(payload) {
    return _caseSequenceFrom_(payload || {}) || "all";
}


















((CaseDomain.searchCases = function (payload) {
    return ((payload = payload || {}),
        _hotRouteReadThrough_("apiSearchCasesLite", payload, Number(payload.cacheTtlSeconds || 600) || 600, function (p) {
            return _caseSearchMaterializedQuery_(_appAssignObjects_(p || {}, {
                __route: "CaseDomain.searchCases",
                compactReadModel: !0,
                serverPaged: !0,
                __projectedFieldsOwner: "case-search-visible-fields-r146",
            }));
        }));
}),
    (CaseDomain.saveCase = apiSaveCase),
    (CaseDomain.getReportExportRows = function (payload) {
        payload = payload || {};
        var maxRows = Math.max(1, Math.min(Number(payload.maxRows || payload.limit || 5e3) || 5e3, 5e3)), res = _caseReportReadModel_(_appAssignObjects_({}, payload, {
            page: 1,
            limit: maxRows,
            pageSize: maxRows,
            maxRows,
            noPage: !0,
            fullList: !0,
            serverPaged: !1,
            exportMode: String(payload.exportMode || payload.mode || "report"),
            compactReadModel: !0,
            includeMeetingHistory: payload.includeMeetingHistory !== !1,
            forceFresh: payload.forceFresh === !0,
            noCache: payload.noCache === !0,
            bypassCache: payload.bypassCache === !0,
            cacheTtlSeconds: Math.max(90, Math.min(Number(payload.cacheTtlSeconds || 300) || 300, 600)),
            __route: "CaseDomain.getReportExportRows",
            source: "apiGetCaseReportExportRows.performanceK.r166",
        })), rows = _c30A_(res && res.rows) ? res.rows.slice(0, maxRows) : [], total = Number((res && res.totalRecords) || rows.length || 0) || 0;
        return {
            ok: !0,
            rows,
            data: rows,
            items: rows,
            totalRecords: total,
            total,
            returnedRows: rows.length,
            maxRows,
            truncated: total > rows.length,
            page: 1,
            limit: rows.length || maxRows,
            pageSize: rows.length || maxRows,
            totalPages: 1,
            serverPaged: !1,
            exportMode: String(payload.exportMode || payload.mode || "report"),
            owner: "CaseDomain.getReportExportRows",
            source: "CaseReportIndex.performanceK.r166.export",
            readModel: CASE_REPORT_INDEX_STAMP_CURRENT,
            performanceK: !0,
            fullMatrixFallback: !1,
            persistentSnapshotHit: !!(res && res.persistentSnapshotHit),
            generatedAt: new Date().toISOString(),
            meta: _appAssignObjects_({}, (res && res.meta) || {}, {
                includeMeetingHistory: payload.includeMeetingHistory !== !1,
                sourceOfTruth: "MainData+MeetingLogs",
                reportReadModel: CASE_REPORT_INDEX_STAMP_CURRENT,
                meetingHistoryMatchedRows: Number((res && res.meetingHistoryMatchedRows) || 0) || 0,
            }),
        };
    }),
    (CaseDomain.quickSummary = function (payload) {
        payload = payload || {};
        var requestedCaseId = _s_(payload.caseId || payload.id || payload.recordId || payload.uid || "").trim(), requestedCaseNum = _caseSequenceFrom_(payload), singleMode = !!(requestedCaseId || requestedCaseNum);
        function top(map) {
            return Object.keys(map || {})
                .map(function (k) {
                return {
                    label: k, count: Number(map[k] || 0)
                };
            })
                .sort(function (a, b) {
                return (Number(b.count || 0) - Number(a.count || 0) ||
                    _s_(a.label).localeCompare(_s_(b.label), "th"));
            })
                .slice(0, 8);
        }
        function rowCaseId(row) {
            return _s_((row && (row.caseId || row.id || row.recordId || row.uid)) || "").trim();
        }
        function latestDate(rows, keys, nestedKey) {
            var latestValue = "", latestTime = 0;
            function consider(value) {
                value = _s_(value).trim();
                if (!value)
                    return;
                var time = _committeeMeetingSortableDate_(value);
                if (!latestValue || time > latestTime) {
                    latestValue = value;
                    latestTime = time;
                }
            }
            (_c30A_(rows) ? rows : []).forEach(function (row) {
                row = row || {};
                (keys || []).forEach(function (key) {
                    consider(row[key]);
                });
                if (nestedKey) {
                    var nested = row[nestedKey];
                    if (!_c30A_(nested) && typeof nested == "string" && nested.trim().charAt(0) === "[")
                        try {
                            nested = JSON.parse(nested);
                        }
                        catch (_nestedDateParseErr) {
                            nested = [];
                        }
                    (_c30A_(nested) ? nested : []).forEach(function (item) {
                        item = item || {};
                        (keys || []).forEach(function (key) {
                            consider(item[key]);
                        });
                    });
                }
            });
            return latestValue;
        }
        if (singleMode) {
            var allRows = _listMainDataRows_(!1) || [], matches = allRows.filter(function (row) {
                var rowSeq = _caseSequenceFrom_(row), rowId = rowCaseId(row);
                if (requestedCaseNum && rowSeq !== requestedCaseNum)
                    return !1;
                if (requestedCaseId && rowId !== requestedCaseId)
                    return !1;
                return !0;
            });
            if (!matches.length && requestedCaseId && !requestedCaseNum) {
                var caseIdAsSequence = _caseSequenceNormalizeStrict_(requestedCaseId);
                caseIdAsSequence && (matches = allRows.filter(function (row) {
                    return _caseSequenceFrom_(row) === caseIdAsSequence;
                }));
            }
            matches = _dedupeLatestRowsBy_(matches, function (row) {
                return _caseSequenceFrom_(row) || rowCaseId(row);
            });
            if (!matches.length) {
                var notFoundDetail = {
                    errorCode: "CASE_QUICK_SUMMARY_NOT_FOUND",
                    caseId: requestedCaseId,
                    caseNum: requestedCaseNum,
                    owner: "CaseDomain.quickSummary",
                };
                return _appAssignObjects_(err_("ไม่พบข้อมูลเรื่องพิจารณาที่ระบุ", notFoundDetail), notFoundDetail);
            }
            var distinctSequences = {}, distinctIds = {};
            matches.forEach(function (row) {
                var seq = _caseSequenceFrom_(row), id = rowCaseId(row);
                seq && (distinctSequences[seq] = !0);
                id && (distinctIds[id] = !0);
            });
            if (Object.keys(distinctSequences).length !== 1 || Object.keys(distinctIds).length > 1) {
                var ambiguousDetail = {
                    errorCode: "CASE_QUICK_SUMMARY_IDENTITY_AMBIGUOUS",
                    caseId: requestedCaseId,
                    caseNum: requestedCaseNum,
                    matchedCaseNums: Object.keys(distinctSequences),
                    matchedCaseIds: Object.keys(distinctIds),
                    owner: "CaseDomain.quickSummary",
                };
                return _appAssignObjects_(err_("ข้อมูลอ้างอิงเรื่องพิจารณาไม่เป็นเอกลักษณ์ ระบบยกเลิกการสรุปเพื่อป้องกันข้อมูลผิดเรื่อง", ambiguousDetail), ambiguousDetail);
            }
            var canonicalCaseNum = Object.keys(distinctSequences)[0] || "";
            if (!canonicalCaseNum) {
                var sequenceRequiredDetail = {
                    errorCode: "CASE_QUICK_SUMMARY_SEQUENCE_REQUIRED",
                    caseId: requestedCaseId,
                    owner: "CaseDomain.quickSummary",
                };
                return _appAssignObjects_(err_("ไม่พบลำดับเรื่อง canonical สำหรับข้อมูลที่ระบุ", sequenceRequiredDetail), sequenceRequiredDetail);
            }
            var canonicalIdentityRows = allRows.filter(function (row) {
                return _caseSequenceFrom_(row) === canonicalCaseNum;
            }), canonicalIds = {};
            canonicalIdentityRows.forEach(function (row) {
                var id = rowCaseId(row);
                id && (canonicalIds[id] = !0);
            });
            if (Object.keys(canonicalIds).length !== 1) {
                var canonicalConflictDetail = {
                    errorCode: "CASE_QUICK_SUMMARY_CANONICAL_ID_CONFLICT",
                    caseId: requestedCaseId,
                    caseNum: canonicalCaseNum,
                    matchedCaseIds: Object.keys(canonicalIds),
                    owner: "CaseDomain.quickSummary",
                };
                return _appAssignObjects_(err_("ลำดับเรื่องเชื่อมกับรหัสเรื่องมากกว่าหนึ่งค่า ระบบยกเลิกการสรุปเพื่อป้องกันข้อมูลผิดเรื่อง", canonicalConflictDetail), canonicalConflictDetail);
            }
            var bundle = getCanonicalCaseBundleImpl_(_caseSequenceIdentityPayload_(canonicalCaseNum)), row = (bundle && bundle.case) || matches[0] || {}, dto = _caseCanonicalDto_(row), history = _c30A_(bundle && bundle.history) ? bundle.history : [], letters = _c30A_(bundle && bundle.letters) ? bundle.letters : [], latestMeetingDate = latestDate(history, [
                "meetingDate", "date", "dateRaw", "วันที่ประชุม"
            ]), latestLetterDueDate = latestDate(letters, [
                "extendedDueDate", "newDueDate", "extendDate", "dueDate", "วันครบกำหนดขยายเวลา"
            ], "extensions"), canonicalCaseId = rowCaseId(dto) || rowCaseId(row), summaryPieces = [];
            canonicalCaseNum && summaryPieces.push("ลำดับเรื่อง: " + canonicalCaseNum);
            canonicalCaseId && summaryPieces.push("รหัสเรื่อง: " + canonicalCaseId);
            dto.title && summaryPieces.push("ชื่อเรื่อง: " + dto.title);
            dto.status && summaryPieces.push("สถานะ: " + dto.status);
            dto.petitioners && summaryPieces.push("ผู้เสนอญัตติ/ผู้ร้อง: " + dto.petitioners);
            dto.assignees && summaryPieces.push("ผู้รับผิดชอบ: " + dto.assignees);
            latestMeetingDate && summaryPieces.push("ประชุมล่าสุด: " + latestMeetingDate);
            latestLetterDueDate && summaryPieces.push("กำหนดหนังสือล่าสุด: " + latestLetterDueDate);
            var singleData = {
                caseId: canonicalCaseId,
                id: canonicalCaseId,
                caseNum: canonicalCaseNum,
                caseNo: canonicalCaseNum,
                runningNo: canonicalCaseNum,
                ลำดับเรื่อง: canonicalCaseNum,
                title: dto.title || dto.subject || "",
                subject: dto.subject || dto.title || "",
                caseTitle: dto.caseTitle || dto.title || "",
                status: dto.status || "",
                petitioners: dto.petitioners || dto.petitionerName || "",
                petitionerName: dto.petitionerName || dto.petitioners || "",
                assignees: dto.assignees || dto.owner || "",
                owner: dto.owner || dto.assignees || "",
                latestMeetingDate: latestMeetingDate,
                latestLetterDueDate: latestLetterDueDate,
                historyCount: history.length,
                letterCount: letters.length,
                summary: summaryPieces.join("\n"),
                executiveSummary: summaryPieces.join("\n"),
                mode: "single-case",
                primaryKey: "ลำดับเรื่อง",
                requestedCaseId: requestedCaseId,
                requestedCaseNum: requestedCaseNum,
                resolvedAt: new Date().toISOString(),
                relatedLoadOk: bundle && bundle.relatedLoadOk !== !1,
                partialRelatedData: !!(bundle && bundle.partialRelatedData),
                relatedWarnings: _c30A_(bundle && bundle.relatedWarnings) ? bundle.relatedWarnings : [],
                cacheStatus: "CaseDomain.quickSummary.single",
            };
            return _appAssignObjects_({
                ok: !0,
                data: singleData,
                owner: "CaseDomain.quickSummary",
                source: "MainData+MeetingLogs+Letters",
                contract: "case-quick-summary-single-r168",
            }, singleData);
        }
        var rows = _dedupeLatestRowsBy_(_listMainDataRows_(!1) || [], function (row) {
            return _caseSequenceFrom_(row) || rowCaseId(row);
        }).map(function (row, index) {
            return CaseDomain.toCompactSearchRow(row || {}, index + 1);
        }).filter(function (row) {
            return CaseDomain.matchRow(row || {}, payload);
        }), statusMap = {}, typeMap = {};
        rows.forEach(function (r) {
            var st = CaseDomain.caseText((r && r.status) || "") || "ไม่ระบุสถานะ", ty = CaseDomain.caseText((r && r.cat) || "") || "ไม่ระบุประเภท";
            ((statusMap[st] = (statusMap[st] || 0) + 1),
                (typeMap[ty] = (typeMap[ty] || 0) + 1));
        });
        var aggregateData = {
            total: rows.length,
            query: _s_(payload.query || payload.q || payload.keyword),
            reportType: String(payload.reportType || payload.groupType || payload.type || "all"),
            reportValue: _s_(payload.reportValue || payload.groupValue || payload.value),
            byStatus: top(statusMap),
            byType: top(typeMap),
            generatedAt: new Date().toISOString(),
            cached: !1,
            cacheStatus: "CaseDomain.quickSummary.aggregate",
            mode: "aggregate",
            completeDataset: !0,
            truncated: !1,
        };
        return _appAssignObjects_({
            ok: !0,
            data: aggregateData,
            owner: "CaseDomain.quickSummary",
            source: "MainData.projected.complete",
            contract: "case-quick-summary-aggregate-r168",
        }, aggregateData);
    }),
    (CaseDomain.getReportOptions = function (payload) {
        payload = payload || {};
        var facets = _caseReportFacets_(payload);
        return {
            ok: !0,
            data: facets,
            owner: "CaseDomain.getReportOptions",
            source: "CaseReportFacets.phase4",
            readModel: CASE_REPORT_INDEX_STAMP_CURRENT,
        };
    }),
    (CaseDomain.status = function () {
        return _domainStatus_(CaseDomain, "CaseDomain");
    }));






















((TrackingDomain.VERSION = "tracking-domain-final-current"),
    (TrackingDomain.normalize = function (res) {
        var data = res && res.data && typeof res.data == "object" ? res.data : res;
        if (data && typeof data == "object") {
            var rows = _c30A_(data.rows)
                ? data.rows
                : _c30A_(data.data)
                    ? data.data
                    : _c30A_(data.items)
                        ? data.items
                        : [];
            ((data.rows = rows),
                (data.data = rows),
                (data.items = rows),
                (data.totalRecords =
                    Number(data.totalRecords || data.total || rows.length || 0) || 0),
                (data.total = data.totalRecords),
                (data.page = Number(data.page || 1) || 1),
                (data.limit = Number(data.limit || data.pageSize || 20) || 20),
                (data.pageSize = data.limit),
                (data.owner = "TrackingDomain.getTracking"),
                (data.domainOwner = "TrackingDomain"),
                (data.serverPaged = data.serverPaged !== !1),
                (data.authoritative = data.authoritative !== !1 && data.partial !== !0 && !data.errorCode),
                (data.authoritativeEmpty = data.authoritative === !0 && rows.length === 0),
                (data.fallbackAllowed = data.authoritative !== !0));
        }
        return res;
    }),
    (TrackingDomain.getTracking = function (payload) {
        return ((payload = payload || {}),
            _hotRouteReadThrough_("apiGetTracking", payload, Number(payload.cacheTtlSeconds || 600) || 600, function (p) {
                return TrackingDomain.normalize(_getTrackingMaterializedCore_(p));
            }));
    }),
    (TrackingDomain.status = function () {
        return _domainStatus_(TrackingDomain, "TrackingDomain");
    }),
    (CaseDomain.RepositoryFacade = AppRepositoryRegistry.register("CaseRepository", {
        search: function (payload) {
            return CaseDomain.searchCases(payload || {});
        },
        readModel: function (payload) {
            return _caseSearchReadModel_(payload || {});
        },
        facets: function (payload) {
            return _caseSearchReportFacets_(payload || {});
        },
    }, { owner: "Code_30_Domain_Cases:CaseRepository" })),
    (CaseDomain.FACADE_CURRENT = {
        owner: "Code_30_Domain_Cases:CaseService.ProductionOwner",
        repository: CaseDomain.RepositoryFacade,
        search: function (payload) {
            return CaseDomain.searchCases(payload || {});
        },
        reportOptions: function (payload) {
            return CaseDomain.getReportOptions(payload || {});
        },
        reportExportRows: function (payload) {
            return CaseDomain.getReportExportRows(payload || {});
        },
        quickSummary: function (payload) {
            return CaseDomain.quickSummary(payload || {});
        },
        meetingHistory: function (payload) {
            return typeof _caseAttachMeetingHistoryProduction_ == "function"
                ? _caseAttachMeetingHistoryProduction_(payload || {})
                : payload;
        },
        status: function () {
            return {
                ok: !0,
                owner: this.owner,
                uiDomChanged: !1,
                businessLogicChanged: !1,
            };
        },
    }));










var MEETING_READ_MODEL_STAMP_CURRENT = "meeting-generation-stamped-read-model-r210";





((MeetingDomain.VERSION = "meeting-domain-final-current"),
    (MeetingDomain.status = function () {
        return _domainStatus_(MeetingDomain, "MeetingDomain");
    }),
    (MeetingDomain.getSystemSpec = function (payload) {
        return ((payload = requireDomainRequest_(payload || {}, "viewer")),
            ok_(_committeeMeetingSheetSpec_(), "โหลดรายละเอียดชีตการประชุมคณะกรรมาธิการสำเร็จ"));
    }),
    (MeetingDomain.listMeetings = function (payload) {
        payload = requireDomainRequest_(payload || {}, "viewer") || {};
        var useCompact = payload.compactList !== !1 &&
            !_committeeMeetingText_(payload.meetingId || payload.id || "") &&
            !_committeeMeetingText_(payload.query || payload.q || payload.keyword || "") &&
            !_committeeMeetingText_(payload.agendaNo || payload.agenda || "");
        if (!useCompact) {
            return ok_(_committeeMeetingBuildBundle_(payload), "โหลดการประชุมคณะกรรมาธิการสำเร็จ");
        }
        return _meetingReadThrough_("compact-list", payload, Number(payload.cacheTtlSeconds || 180) || 180, function (input) {
            return ok_(_committeeMeetingBuildCompactList_(input), "โหลดการประชุมคณะกรรมาธิการสำเร็จ");
        });
    }),
    (MeetingDomain.getSystem = function (payload) {
        payload = requireDomainRequest_(payload || {}, "viewer") || {};
        return _meetingReadThrough_("system", payload, Number(payload.cacheTtlSeconds || 180) || 180, function (input) {
            var bundle = _committeeMeetingBuildBundle_(input), first = (bundle.meetings && bundle.meetings[0]) || null;
            return ok_({
                meeting: first,
                items: (first && bundle.itemsByMeetingId[_s_(first.meetingId)]) || [],
                spec: bundle.spec,
            }, first ? "โหลดข้อมูลการประชุมสำเร็จ" : "ไม่พบข้อมูลการประชุม");
        });
    }),
    (MeetingDomain.getPrintBundle = function (payload) {
        return ((payload = requireDomainRequest_(payload || {}, "viewer")),
            ok_(_committeeMeetingPrintBundle_(payload || {}), "โหลดข้อมูลพิมพ์การประชุมคณะกรรมาธิการสำเร็จ"));
    }),
    (MeetingDomain.searchAgendaCases = function (payload) {
        var q = _committeeMeetingText_((payload = requireDomainRequest_(payload || {}, "viewer")).query ||
            payload.q ||
            "").toLowerCase();
        if (q.length < 1)
            return ok_({
                rows: []
            }, "กรุณาระบุคำค้น");
        var limit = Number(payload.limit || 30) || 30, rows, out = _caseDomainSharedRows_("MainData", [
            "caseId",
            "caseNum",
            "recNo",
            "title",
            "caseTitle",
            "petitioners",
            "respondent",
            "status",
            "agencyName",
            "updatedAt",
            "createdAt",
            "isDeleted",
            "deletedAt",
        ], {
            includeDeleted: !1, requireCanonical: !0, ttl: 180
        })
            .filter(function (r) {
            return (!isSoftDeletedRow_(r) &&
                [
                    _committeeMeetingCaseRefText_(r.caseNum || ""),
                    _committeeMeetingCaseRefText_(r.recNo || ""),
                    r.title,
                    r.caseTitle,
                    r.petitioners,
                    r.respondent,
                    r.status,
                    r.agencyName,
                ]
                    .join(" ")
                    .toLowerCase()
                    .indexOf(q) > -1);
        })
            .slice(0, limit)
            .map(function (r) {
            var caseNum = _committeeMeetingCaseRefText_(r.caseNum || ""), recNo = _committeeMeetingCaseRefText_(r.recNo || "");
            return {
                caseId: _s_(r.caseId),
                caseNum,
                recNo,
                title: _s_(r.title),
                caseTitle: _s_(r.caseTitle || r.title),
                petitioners: _s_(r.petitioners),
                respondent: _s_(r.respondent),
                status: _s_(r.status),
                agencyName: _s_(r.agencyName),
            };
        });
        return ok_({
            rows: out, totalRecords: out.length
        }, "ค้นหาเรื่องพิจารณาสำเร็จ");
    }),
    (MeetingDomain.saveSystem = function (payload) {
        return ((payload = requireDomainRequest_(payload || {}, "staff")),
            domainWrite_("apiSaveCommitteeMeetingSystem", payload, function (input) {
                (ensureCanonicalHeadersForNewSheet_("CommitteeMeetings"),
                    ensureCanonicalHeadersForNewSheet_("CommitteeMeetingAgendaItems"));
                var now = new Date().toISOString(), meetingInput = input.meeting || input || {}, meetingId = _committeeMeetingText_(meetingInput.meetingId || input.meetingId || "") || _committeeMeetingId_("CMTG"), meeting = {
                    meetingId,
                    meetingNo: _committeeMeetingText_(meetingInput.meetingNo ||
                        meetingInput.round ||
                        input.meetingNo ||
                        ""),
                    meetingDate: _committeeMeetingDateText_(meetingInput.meetingDate ||
                        meetingInput.date ||
                        input.meetingDate ||
                        ""),
                    title: _committeeMeetingText_(meetingInput.title || "การประชุมคณะกรรมาธิการ"),
                    status: _committeeMeetingText_(meetingInput.status || "บันทึก"),
                    note: _committeeMeetingText_(meetingInput.note || ""),
                    isDeleted: !1,
                    deletedAt: "",
                };
                if (!meeting.meetingNo)
                    throw new Error("กรุณาระบุการประชุมครั้งที่");
                if (!meeting.meetingDate)
                    throw new Error("กรุณาระบุวันเดือนปีการประชุม");
                var meetingResult = _committeeMeetingRepo_("committee.meetings").upsert(meetingId, meeting), incoming = [];
                ([
                    "agenda1", "agenda2", "agenda3", "agenda4"
                ].forEach(function (k, idx) {
                    var arr = input[k] || [];
                    (_c30A_(arr) || (arr = []),
                        arr.forEach(function (row, i) {
                            (((row = row || {}).agendaNo = String(idx + 1)),
                                (row.seq = row.seq || i + 1),
                                incoming.push(row));
                        }));
                }),
                    _c30A_(input.items) && (incoming = incoming.concat(input.items)));
                var repo = _committeeMeetingRepo_("committee.meetingAgendaItems"), existing = repo.listActive().filter(function (r) {
                    return _s_(r.meetingId) === meetingId;
                }), keep = {}, saved = [];
                (incoming.forEach(function (row, i) {
                    var item = _committeeMeetingNormalizeItem_(row, meetingId, i + 1);
                    if (_committeeMeetingItemHasContent_((item = _committeeMeetingLinkCaseInfo_(item)))) {
                        var res = repo.upsert(item.itemId, item, {
                            now
                        });
                        ((keep[item.itemId] = !0), saved.push(res.row || item));
                    }
                }),
                    existing.forEach(function (row) {
                        var id = _s_(row.itemId);
                        id &&
                            !keep[id] &&
                            repo.softDelete(id, {
                                deletedAt: now, updatedAt: now
                            });
                    }));
                var synced = _committeeMeetingSyncAgenda1And3ToHistory_(meeting, saved);
                return (_appIsFnName_("_invalidateMeetingDerivedCaches_") &&
                    _invalidateMeetingDerivedCaches_("committeeMeetingSystem"),
                    typeof invalidateSheetCache_ == "function" &&
                        (invalidateSheetCache_("CommitteeMeetings"),
                            invalidateSheetCache_("CommitteeMeetingAgendaItems"),
                            invalidateSheetCache_("MeetingLogs")),
                    ok_({
                        meetingId,
                        mode: meetingResult.mode,
                        items: saved,
                        syncedMeetingLogs: synced,
                    }, "บันทึกการประชุมคณะกรรมาธิการสำเร็จ"));
            }));
    }),
    (MeetingDomain.deleteSystem = function (payload) {
        return ((payload = requireDomainRequest_(payload || {}, "staff")),
            domainWrite_("apiDeleteCommitteeMeetingSystem", payload, function (input) {
                var meetingId = _committeeMeetingText_(input.meetingId || input.id || "");
                if (!meetingId)
                    throw new Error("ไม่พบรหัสการประชุม");
                var now = new Date().toISOString();
                return (_committeeMeetingRepo_("committee.meetings").softDelete(meetingId, {
                    deletedAt: now,
                    updatedAt: now,
                }),
                    _committeeMeetingRepo_("committee.meetingAgendaItems")
                        .listActive()
                        .filter(function (r) {
                        return _s_(r.meetingId) === meetingId;
                    })
                        .forEach(function (r) {
                        _committeeMeetingRepo_("committee.meetingAgendaItems").softDelete(_s_(r.itemId), {
                            deletedAt: now, updatedAt: now
                        });
                    }),
                    typeof invalidateSheetCache_ == "function" &&
                        (invalidateSheetCache_("CommitteeMeetings"),
                            invalidateSheetCache_("CommitteeMeetingAgendaItems")),
                    ok_({
                        meetingId
                    }, "ลบข้อมูลการประชุมสำเร็จ"));
            }));
    }));
DashboardDomain.STATUS_READ_MODEL_CURRENT =
    _dashboardStatusReadModelContract_();
