/**
 * R253 — INSTANT PAGE SHELL / GAS BACKEND SINGLE SOURCE
 *
 * One production implementation per concern. Historical gates, retired route aliases and
 * revision-coded internal owners are removed from the active source.
 */
var __APP_GLOBAL__ = (function () {
    try {
        if (typeof globalThis != "undefined" && globalThis)
            return globalThis;
    }
    catch (_e) {
        _appIgnore_(_e, "c.s");
    }
    return {};
})(), APP_DEPLOY_RELEASE = Object.freeze({
    stamp: "commission-v1.2-gas-backend-single-source-2026-08-09-r257",
    channel: "dual-host",
    buildName: "V1.2 GAS Backend Single Source r257",
    releaseDate: "2026-08-09",
    assetStamp: "asset-manifest-r257-gas-backend-single-source",
    sourceFingerprint: "gas-backend-single-source-r257",
    contractStamp: "current-quality-gate-r257",
    transportMode: "api-router-dual-host-postmessage",
    capabilities: Object.freeze({
        canonicalStorageOwner: !0,
        canonicalOwners: !0,
        domainReadModels: !0,
        cacheGovernance: !0,
        frontendCodeSplitting: !0,
        requestLifecycleSingleOwner: !0,
        repositoryRegistrySingleOwner: !0,
        singleCanonicalSource: !0,
        githubPagesTransport: !0,
        instantPageShell: !0
    }),
    requiredGates: Object.freeze([
        "canonical-storage-owner",
        "canonical-owner-contract",
        "route-handler-contract",
        "write-csrf-contract",
        "permission-matrix",
        "asset-integrity",
        "automated-regression",
        "current-quality-gate"
    ]),
    description: "R253 keeps gas-backend as the only editable application source and pre-renders canonical page templates into the host shell so navigation paints immediately while data/controllers hydrate in the background. GitHub output remains generated only during install/deploy preparation."
});


/* ==========================================================================
 * Canonical internal utility owner
 * Compatibility helpers in repository/domain files delegate here.
 * ========================================================================== */

/* Canonical production policy flags — one value owner, semantic accessors remain distinct. */
var APP_PRODUCTION_POLICY_FLAGS_CURRENT = Object.freeze({
    securityProductionGateLockEnabled: !0,
    strictActionTokensEnabled: !0,
    performanceMarkDirtyDomainsEnabled: !0,
    simpleAuthMode: !1,
    simpleAuthNoRateLimit: !1,
    loginPasswordHashBootstrapEnabled: !1,
    migratePlainPasswordOnLoginEnabled: !1
});
function _appTextValue_(value) {
    return String(value == null ? "" : value);
}
function _appAssignObjects_() {
    return Object.assign.apply(Object, arguments);
}
function _appHasOwnProperty_(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function _appNowIso_() {
    return new Date().toISOString();
}
function _appArrayValue_(value) {
    return Array.isArray(value) ? value : [];
}
function _appAddDateKey_(map, value) {
    value = String(value || "").trim();
    if ((/^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{2}-\d{2}$/.test(value)) && map) map[value] = !0;
    return map;
}



function _appIsFn_(value) {
    return typeof value == "function";
}
function _appIsFnName_(name, root) {
    try {
        root = root || (typeof globalThis != "undefined" ? globalThis : this);
        for (var parts = String(name || "").split(".").filter(Boolean), cur = root, i = 0; i < parts.length; i++) {
            if (cur == null || !Object.prototype.hasOwnProperty.call(cur, parts[i]))
                return !1;
            cur = cur[parts[i]];
        }
        return typeof cur == "function";
    }
    catch (e) {
        return !1;
    }
}
function _appWarn_(code, err, detail) {
    try {
        if (_appIsFnName_("_recordWarning_"))
            return _recordWarning_(String(code || "app.warn"), err, detail || {});
        typeof Logger != "undefined" && Logger && Logger.log && Logger.log("[WARN] " + String(code || "app.warn") + " " + String(err && err.message || err || ""));
    }
    catch (_appWarnErr) {
        try {
            typeof Logger != "undefined" && Logger && Logger.log && Logger.log("[WARN] appWarn.failed " + String(_appWarnErr && _appWarnErr.message || _appWarnErr));
        }
        catch (_ignore) {
            typeof console != "undefined" && console.warn && console.warn("AppDataService warning backup failed", _ignore);
        }
    }
    return !1;
}
function _appFail_(code, err, detail) {
    var msg = String(err && err.message ? err.message : err || code || "APP_ERROR");
    try {
        if (_appIsFnName_("err_"))
            return err_(msg, Object.assign({
                errorCode: String(code || "APP_ERROR")
            }, detail || {}));
    }
    catch (_appFailErr) {
        _appWarn_("app.fail.wrapper", _appFailErr, {
            code
        });
    }
    return {
        ok: !1, error: String(code || "APP_ERROR"), msg, detail: detail || {}, generatedAt: new Date().toISOString()
    };
}
function _appIgnore_(e, l) {
    try {
        if (_appIsFnName_("_recordWarning_"))
            return _recordWarning_(l || "c.s", e);
        typeof Logger != "undefined" && Logger && Logger.log && Logger.log("[WARN] " + String(l || "c.s") + " " + String(e && e.message || e || ""));
    }
    catch (x) {
        try {
            typeof Logger != "undefined" && Logger && Logger.log && Logger.log("[WARN] appIgnore.failed " + String(x && x.message || x));
        }
        catch (y) {
            return _appIsFnName_("_recordWarning_") && _recordWarning_("observed.catch", y, {
                file: "C00"
            }), !1;
        }
    }
    return !1;
}
var AppDomain = __APP_GLOBAL__.AppDomain = __APP_GLOBAL__.AppDomain || {}, AppInfra = __APP_GLOBAL__.AppInfra = __APP_GLOBAL__.AppInfra || {}, AppSecurity = __APP_GLOBAL__.AppSecurity = __APP_GLOBAL__.AppSecurity || {};
function _domainRouterAuthAlreadyOk_(p, route) {
    p = p || {};
    try {
        var r;
        if (typeof globalThis == "undefined" || globalThis.__APP_API_ROUTER_CONTEXT__ !== !0 || p.__routerAuthOk !== !0)
            return !1;
        if (!route)
            return !0;
        var s = p._securityContext || {}, m;
        return String(p.__routerAuthorizedMethod || s.method || p.method || "") === String(route || "");
    }
    catch (e) {
        try {
            _appIsFnName_("_recordWarning_") && _recordWarning_("domain.routerAuth.contextCheck", e, {
                route: String(route || "")
            });
        }
        catch (_w) {
            var _domainRouterAuthWarnSuppressed = _w;
        }
        return !1;
    }
}
function requireDomainRequest_(payload, role) {
    return payload = payload || {}, _domainRouterAuthAlreadyOk_(payload) || requireAuth_(payload, role || "viewer"), payload;
}
function safeDomainRequest_(payload, role, route, errorFactory) {
    try {
        return {
            ok: !0, payload: requireDomainRequest_(payload, role)
        };
    }
    catch (e) {
        if (typeof errorFactory == "function")
            return {
                ok: !1, result: errorFactory(e, route)
            };
        var message = String(e && e.message ? e.message : e || "ไม่พบ token การใช้งาน");
        return {
            ok: !1, result: typeof err_ == "function" ? err_(message, {
                authRequired: !0, route: String(route || "")
            }) : {
                ok: !1, error: message, authRequired: !0, route: String(route || "")
            }
        };
    }
}
var APP_DASHBOARD_STATUS_COUNT_STAMP = "dashboard-status-count-s0-default-current-phaseF-read-model-2026-07-05";
var AppBackendCore = __APP_GLOBAL__.AppBackendCore = __APP_GLOBAL__.AppBackendCore || {};
AppBackendCore.CASE_STATUS = Object.freeze([
    "เรื่องเข้าใหม่", "ไม่รับเรื่อง", "อนุฯ พิจารณา", "รอพิจารณา", "กมธ. พิจารณา", "ยุติเรื่อง", "ส่งหน่วยงาน", "จัดทำรายงาน"
]), AppBackendCore.CASE_STATUS_TERMINAL = Object.freeze([
    "ไม่รับเรื่อง", "ยุติเรื่อง", "จัดทำรายงาน"
]), AppBackendCore.CASE_STATUS_ALIASES = Object.freeze({
    ได้รับเรื่อง: "เรื่องเข้าใหม่", เรื่องใหม่: "เรื่องเข้าใหม่", รับใหม่: "เรื่องเข้าใหม่", รับเรื่อง: "เรื่องเข้าใหม่", รับเรื่องแล้ว: "เรื่องเข้าใหม่", รับเข้า: "เรื่องเข้าใหม่", รับ: "เรื่องเข้าใหม่", ไม่รับ: "ไม่รับเรื่อง", ไม่รับไว้พิจารณา: "ไม่รับเรื่อง", อยู่ระหว่างดำเนินการ: "รอพิจารณา", กำลังดำเนินการ: "รอพิจารณา", อยู่ระหว่างพิจารณา: "รอพิจารณา", รอการพิจารณา: "รอพิจารณา", รอติดตาม: "รอพิจารณา", ติดตาม: "รอพิจารณา", ค้างพิจารณา: "รอพิจารณา", รอบรรจุ: "รอพิจารณา", ส่งหน่วยงานที่เกี่ยวข้อง: "ส่งหน่วยงาน", อนุกรรมาธิการพิจารณา: "อนุฯ พิจารณา", คณะอนุกรรมาธิการพิจารณา: "อนุฯ พิจารณา", คณะกรรมาธิการพิจารณา: "กมธ. พิจารณา", ปิดเรื่อง: "ยุติเรื่อง", เสร็จสิ้น: "ยุติเรื่อง"
}), AppBackendCore.normalizeCaseStatus = function (value, options) {
    options = options || {};
    var raw = String(value == null ? "" : value).replace(/\s+/g, " ").trim(), defaultStatus = String(options.defaultStatus || "เรื่องเข้าใหม่").trim();
    if (AppBackendCore.CASE_STATUS.indexOf(defaultStatus) < 0 && (defaultStatus = "เรื่องเข้าใหม่"), !raw)
        return defaultStatus;
    if (AppBackendCore.CASE_STATUS.indexOf(raw) >= 0)
        return raw;
    var compact = raw.replace(/\s+/g, ""), aliases = AppBackendCore.CASE_STATUS_ALIASES || {}, exact = aliases[raw] || aliases[compact];
    if (exact)
        return exact;
    var normalized = /ไม่รับ/.test(raw) ? "ไม่รับเรื่อง" : /อนุฯ|อนุกรรมาธิการ|คณะอนุกรรมาธิการ/.test(raw) ? "อนุฯ พิจารณา" : /จัดทำรายงาน|ทำรายงาน|รายงานผล/.test(raw) ? "จัดทำรายงาน" : /ยุติ|ปิดเรื่อง|เสร็จสิ้น/.test(raw) ? "ยุติเรื่อง" : /ส่ง.*หน่วยงาน|หน่วยงาน.*เกี่ยวข้อง/.test(raw) ? "ส่งหน่วยงาน" : /กมธ|กรรมาธิการ|คณะกรรมาธิการ/.test(raw) ? "กมธ. พิจารณา" : /รอ|ติดตาม|ค้าง|อยู่ระหว่างดำเนินการ|กำลังดำเนินการ/.test(raw) ? "รอพิจารณา" : /ได้รับเรื่อง|เรื่องใหม่|รับเรื่อง|รับเข้า|^รับ$/.test(raw) ? "เรื่องเข้าใหม่" : "";
    if (normalized)
        return normalized;
    if (options.strict === !0) {
        var error = new Error("CASE_STATUS_NOT_CANONICAL: " + raw);
        throw error.errorCode = "CASE_STATUS_NOT_CANONICAL", error.statusRaw = raw, error;
    }
    return options.preserveUnknown === !0 ? raw : defaultStatus;
}, AppBackendCore.isCanonicalCaseStatus = function (value) {
    return AppBackendCore.CASE_STATUS.indexOf(String(value || "").trim()) >= 0;
}, AppBackendCore.isTerminalCaseStatus = function (value) {
    return AppBackendCore.CASE_STATUS_TERMINAL.indexOf(AppBackendCore.normalizeCaseStatus(value)) >= 0;
}, AppBackendCore.isOpenCaseStatus = function (value) {
    return !AppBackendCore.isTerminalCaseStatus(value);
}, AppBackendCore.SINGLE_SOURCE_STAMP_CURRENT = "single-source-contract-current-r257", AppBackendCore.RELEASE_STAMP = APP_DEPLOY_RELEASE.stamp, AppBackendCore.ASSET_STAMP = APP_DEPLOY_RELEASE.assetStamp, AppBackendCore.DEPLOY_CONTRACT_STAMP = APP_DEPLOY_RELEASE.contractStamp, AppBackendCore.CASE_STATUS_FIELD_RULES = Object.freeze({
    เรื่องเข้าใหม่: {
        reasonField: "", visibleReasonDomId: ""
    }, ไม่รับเรื่อง: {
        reasonField: "rejectionReason", visibleReasonDomId: "meeting-div-rejectionReason"
    }, "อนุฯ พิจารณา": {
        reasonField: "", visibleReasonDomId: ""
    }, รอพิจารณา: {
        reasonField: "pendingRemark", visibleReasonDomId: "meeting-div-pendingRemark"
    }, "กมธ. พิจารณา": {
        reasonField: "", visibleReasonDomId: ""
    }, ยุติเรื่อง: {
        reasonField: "closedReason", visibleReasonDomId: "meeting-div-closedReason"
    }, ส่งหน่วยงาน: {
        reasonField: "agencyName", visibleReasonDomId: "meeting-div-agencyName"
    }, จัดทำรายงาน: {
        reasonField: "", visibleReasonDomId: ""
    }
}), AppBackendCore.FIELD_MAP = Object.freeze({
    stamp: AppBackendCore.SINGLE_SOURCE_STAMP_CURRENT, owner: "Code_00_PlatformCore.AppBackendCore.FIELD_MAP", domains: {
        cases: {
            sourceOfTruth: "MainData", identity: [
                "caseId", "caseNum", "recNo", "title"
            ], fields: {
                caseId: {
                    label: "รหัสเรื่อง", aliases: [
                        "caseId", "id"
                    ]
                }, caseNum: {
                    label: "ลำดับเรื่อง", aliases: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"
                    ]
                }, recNo: {
                    label: "เลขรับเรื่อง", aliases: [
                        "recNo", "receiveNo", "receivedNo", "เลขรับเรื่อง", "เลขที่รับเรื่อง", "รับเรื่องเลขที่"
                    ]
                }, offerDate: {
                    label: "วันที่เสนอ", aliases: [
                        "offerDate", "submitDate", "proposeDate", "วันที่เสนอ", "วันที่ยื่น"
                    ]
                }, recDate: {
                    label: "วันที่รับเรื่อง", aliases: [
                        "recDate", "receiveDate", "receivedDate", "วันที่รับเรื่อง"
                    ]
                }, cat: {
                    label: "ประเภทเรื่อง", aliases: [
                        "cat", "caseType", "type", "category", "ประเภทเรื่อง", "ประเภท"
                    ]
                }, subCat: {
                    label: "ประเด็น", aliases: [
                        "subCat", "subCategory", "issue", "topic", "ประเด็นพิจารณา", "ประเด็น"
                    ]
                }, title: {
                    label: "ชื่อเรื่อง", aliases: [
                        "title", "subject", "เรื่อง", "ชื่อเรื่อง"
                    ]
                }, caseTitle: {
                    label: "ชื่อเรื่องพิจารณา", aliases: [
                        "caseTitle", "considerationTitle", "ชื่อเรื่องพิจารณา (ถ้ามี)", "ชื่อเรื่องพิจารณา"
                    ]
                }, petitioners: {
                    label: "ผู้เสนอญัตติ/ผู้ร้อง", aliases: [
                        "petitioners", "petitioner", "petitionerName", "ผู้ร้อง", "ผู้เสนอญัตติ", "ผู้เสนอญัตติ/ผู้ร้อง"
                    ]
                }, petitionerPhone: {
                    label: "เบอร์โทรศัพท์", aliases: [
                        "petitionerPhone", "petitionerTel", "petitionerTelephone", "petitionerMobile", "phone", "tel", "telephone", "mobile", "เบอร์โทรศัพท์ผู้เสนอญัตติ/ผู้ร้อง", "เบอร์โทรศัพท์ผู้ร้อง", "เบอร์โทร", "โทรศัพท์", "มือถือ"
                    ]
                }, respondent: {
                    label: "ผู้ถูกร้อง", aliases: [
                        "respondent", "accused", "ผู้ถูกร้อง"
                    ]
                }, assignees: {
                    label: "คณะกรรมาธิการ", aliases: [
                        "assignees", "owner", "responsibleCommissioners", "responsibleComm", "committeeOwner", "responsibleCommittee", "คณะกรรมาธิการ"
                    ]
                }, coAssignees: {
                    label: "คณะอนุกรรมาธิการ", aliases: [
                        "coAssignees", "coAssignee", "coOwners", "coResponsible", "subcommittee", "คณะอนุกรรมาธิการ"
                    ]
                }, staffs: {
                    label: "เจ้าหน้าที่", aliases: [
                        "staffs", "staff", "officer", "secretariatOfficer", "operationOfficer", "opStaff", "operator", "responsibleOfficer", "operationStaff", "เจ้าหน้าที่", "เจ้าหน้าที่ฝ่ายเลขานุการ"
                    ]
                }, status: {
                    label: "สถานะ", aliases: [
                        "status", "caseStatus", "processStatus", "resultStatus", "currentStatus", "statusText", "caseState", "workflowStatus", "meetingStatus", "สถานะเรื่อง", "สถานะเรื่องพิจารณา", "สถานะ", "สถานะพิจารณา", "สถานะปัจจุบัน", "ผลการพิจารณา", "สถานะการพิจารณา"
                    ]
                }, pendingRemark: {
                    label: "เหตุผลรอการพิจารณา", aliases: [
                        "pendingRemark", "pendingReason", "waitReason", "waitingReason", "statusReason", "decisionReason", "reason", "เหตุผล", "เหตุผลรอพิจารณา", "เหตุผลรอการพิจารณา", "หมายเหตุรอพิจารณา", "หมายเหตุรอการพิจารณา"
                    ]
                }, rejectionReason: {
                    label: "เหตุผลไม่รับเรื่อง", aliases: [
                        "rejectionReason", "rejectReason", "notAcceptedReason", "เหตุผล (ไม่รับเรื่อง)", "เหตุผลไม่รับเรื่อง"
                    ]
                }, closedReason: {
                    label: "เหตุผลยุติเรื่อง", aliases: [
                        "closedReason", "closeReason", "terminateReason", "เหตุผลยุติเรื่อง", "เหตุผล (ยุติเรื่อง)"
                    ]
                }, agencyName: {
                    label: "หน่วยงาน", aliases: [
                        "agencyName", "agency", "accusedAgency", "หน่วยงาน", "หน่วยงานที่ส่ง"
                    ]
                }, keySummary: {
                    label: "สรุปสาระสำคัญ", aliases: [
                        "keySummary", "summary", "สรุปสาระสำคัญของเรื่อง", "สรุปสาระสำคัญ", "สาระสำคัญ"
                    ]
                }, remark: {
                    label: "หมายเหตุ", aliases: [
                        "remark", "note", "หมายเหตุ"
                    ]
                }
            }
        }, meetingLogs: {
            sourceOfTruth: "MeetingLogs", identity: [
                "logId", "caseId", "caseNum", "recNo", "title", "round", "date"
            ], fields: {
                logId: {
                    label: "รหัสประวัติ", aliases: [
                        "logId", "id"
                    ]
                }, caseId: {
                    label: "รหัสเรื่อง", aliases: [
                        "caseId", "id"
                    ]
                }, caseNum: {
                    label: "ลำดับเรื่อง", aliases: [
                        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"
                    ]
                }, recNo: {
                    label: "เลขรับเรื่อง", aliases: [
                        "recNo", "receiveNo", "เลขรับเรื่อง"
                    ]
                }, title: {
                    label: "ชื่อเรื่อง", aliases: [
                        "title", "caseTitle", "considerationTitle", "subject", "ชื่อเรื่อง", "เรื่อง"
                    ]
                }, round: {
                    label: "ครั้งที่", aliases: [
                        "round", "meetingRound", "meetingNo", "ครั้งที่", "ครั้งประชุม", "การประชุมครั้งที่"
                    ]
                }, date: {
                    label: "วันที่ประชุม", aliases: [
                        "date", "meetingDate", "meetingDateText", "วันที่ประชุม", "วันประชุม"
                    ]
                }, committee: {
                    label: "คณะกรรมาธิการ", aliases: [
                        "committee", "comm", "assignees", "คณะกรรมาธิการ"
                    ]
                }, subcommittee: {
                    label: "คณะอนุกรรมาธิการ", aliases: [
                        "subcommittee", "subcomm", "coAssignees", "คณะอนุกรรมาธิการ"
                    ]
                }, result: {
                    label: "ผลการพิจารณา", aliases: [
                        "result", "decision", "summary", "note", "มติ", "ผลการพิจารณา"
                    ]
                }, note: {
                    label: "หมายเหตุ", aliases: [
                        "note", "remark", "summary", "หมายเหตุ"
                    ]
                }
            }
        }
    }
}), AppBackendCore.STATUS_MAP = Object.freeze({
    stamp: AppBackendCore.SINGLE_SOURCE_STAMP_CURRENT, owner: "Code_00_PlatformCore.AppBackendCore.STATUS_MAP", canonical: AppBackendCore.CASE_STATUS.slice(), terminal: AppBackendCore.CASE_STATUS_TERMINAL.slice(), aliases: AppBackendCore.CASE_STATUS_ALIASES, fieldRules: AppBackendCore.CASE_STATUS_FIELD_RULES, normalizeOwner: "AppBackendCore.normalizeCaseStatus"
}), AppBackendCore.getFieldAliases = function (domain, field) {
    var domains = AppBackendCore.FIELD_MAP && AppBackendCore.FIELD_MAP.domains || {}, spec = domains[String(domain || "")] || {}, fields = spec.fields || {}, item = fields[String(field || "")] || {};
    return Array.isArray(item.aliases) ? item.aliases.slice() : [];
}, AppBackendCore.singleSourceContractCurrent = function (options) {
    options = options || {};
    return {
        ok: !0,
        stamp: AppBackendCore.SINGLE_SOURCE_STAMP_CURRENT,
        owner: "Code_00_PlatformCore.AppBackendCore",
        generatedAt: new Date().toISOString(),
        routeOwner: "Code_20_Router._apiRouteRegistry_",
        fieldOwner: "AppBackendCore.FIELD_MAP",
        statusOwner: "AppBackendCore.STATUS_MAP",
        routeContract: _appIsFnName_("_apiRouteContract_") ? _apiRouteContract_({ compact: !0, __skipSingleSourceContract: !0 }) : null,
        fieldMap: AppBackendCore.FIELD_MAP,
        statusMap: AppBackendCore.STATUS_MAP,
        rules: { uiDomChanged: !1, businessLogicChanged: !1, singleOwner: !0 }
    };
};
function _singleSourceContract_(options) {
    return AppBackendCore.singleSourceContractCurrent(options || {});
}
function _getSingleSourceContract_(payload) {
    payload = payload || {};
    var registry = _contractIsFunctionName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {};
    return ok_(_compatibilityContractFacade_("apiGetPhase1Contract", {
        contractStamp: AppBackendCore.API_CONTRACT_STAMP,
        routeCount: Object.keys(registry || {}).length,
        fieldMapOwner: "AppBackendCore.FIELD_MAP",
        statusMapOwner: "AppBackendCore.STATUS_MAP",
        canonicalCaseStatuses: (AppBackendCore.CASE_STATUS || []).slice(),
        compatibilityEndpointRetained: !0
    }), "โหลด Production contract compatibility สำเร็จ");
}
function apiGetPhase1Contract(payload) {
    return _getSingleSourceContract_(payload);
}



function _getUnifiedContract_(payload) {
    return ok_(_compatibilityContractFacade_("apiGetPhase2Contract", {
        canonicalRoot: "gas-backend",
        partialCount: 9,
        apiRouteAllowlistOwner: "Code_20_Router._apiRouteRegistry_",
        apiDtoContractOwner: "AppBackendCore.API_DTO_CONTRACT_BY_METHOD",
        compatibilityEndpointRetained: !0
    }), "โหลด Production single-source compatibility สำเร็จ");
}
function apiGetPhase2Contract(payload) {
    return _getUnifiedContract_(payload);
}


AppBackendCore.VERSION = "backend-contract-current", AppBackendCore.CASE_SEARCH_HEADERS = [
    "ลำดับเรื่อง", "เลขรับเรื่อง", "วันที่รับเรื่อง", "ชื่อเรื่อง", "ชื่อเรื่องพิจารณา (ถ้ามี)", "ผู้เสนอญัตติ/ผู้ร้อง", "สถานะ", "จัดการ"
], AppBackendCore.CASE_SEARCH_ROW_REQUIRED = [
    "seq", "caseNo", "caseNum", "recNo", "recDate", "recDateText", "title", "considerationTitle", "petitioners", "petitionerName", "respondent", "agency", "status", "statusMeta", "reportColumns"
], AppBackendCore.API_ROUTE_CONTRACT_SOURCE = "Code_20_Router._apiRouteRegistry_", AppBackendCore.API_CONTRACT = Object.freeze({}), AppBackendCore.API_CONTRACT_STAMP = "contract-commission-v1.2-production-current-contract-freeze-2026-07-06-r1", AppBackendCore.API_DTO_CONTRACT_BY_METHOD = {
    apiSearchCasesLite: {
        owner: "CaseDomain.searchCases", sourceOfTruth: "MainData", dto: "case-search-flat-main-data-current", required: [
            "rows", "totalRecords", "page", "limit", "pageSize", "totalPages"
        ], columns: AppBackendCore.CASE_SEARCH_HEADERS.slice(), rowRequired: AppBackendCore.CASE_SEARCH_ROW_REQUIRED.slice(), dateField: "recDateText", receiveNoField: "recNo", caseNoField: "caseNo"
    }, apiBudgetGetTypeSummaryByFY: {
        owner: "BudgetDomain.getTypeSummary", sourceOfTruth: "BudgetImports", dto: "budget-type-summary-budgetimports-direct-current", required: [
            "rows", "totalRecords", "page", "limit"
        ], serverPaged: !0
    }, apiGetPeoplePageBundle: {
        owner: "PeopleDomain.getPageBundle", dto: "people-page-bundle-current", required: [
            "rows", "totalRecords"
        ]
    }, apiGetTracking: {
        owner: "TrackingDomain.getTracking", dto: "tracking-server-paged-current", required: [
            "rows", "totalRecords"
        ]
    }, apiAdminListUsers: {
        owner: "AdminDomain.listUsers", required: [
            "rows", "totalRecords"
        ]
    }, apiAdminListSubcommittees: {
        owner: "AdminDomain.listSubcommittees", required: [
            "rows", "totalRecords"
        ]
    }, apiListCommitteeMeetings: {
        owner: "MeetingDomain.listMeetings", dto: "meeting-list-current", required: [
            "rows", "totalRecords", "page", "limit"
        ]
    }, apiGetCommitteeMeetingPrintBundle: {
        owner: "MeetingDomain.getPrintBundle", dto: "meeting-print-bundle-current", required: [
            "overviewRows", "listMeetings", "summaryMeetings"
        ]
    }, apiGetDashboardBundle: {
        owner: "DashboardDomain.getBundle", dto: "dashboard-single-bundle-current", required: [
            "stats", "budget", "cases", "summary"
        ]
    }, apiBudgetSaveImport: {
        owner: "BudgetDomain.saveImport", sourceOfTruth: "BudgetImports", dto: "budget-import-write-envelope-current", required: [
            "ok", "data"
        ], write: !0, security: [
            "auth", "csrf", "actionToken", "writeGateway"
        ]
    }, apiBudgetDeleteImport: {
        owner: "BudgetDomain.deleteImport", sourceOfTruth: "BudgetImports", dto: "budget-import-delete-envelope-current", required: [
            "ok", "data"
        ], write: !0, security: [
            "auth", "csrf", "actionToken", "writeGateway"
        ]
    }, apiGetRouteContract: {
        owner: "Code_20_Router._apiRouteContract_", dto: "router-production-route-contract-current", required: [
            "ok", "routeCount", "handlerCount", "routerIssues", "publicEntrypointPolicy"
        ]
    }, apiGetPhase0ContractGate: {
        owner: "AppBackendCore.currentContractGateStatus", dto: "contract-gate-current", required: [
            "ok", "issues", "contracts", "safetyBaseline", "uiDomChanged", "businessLogicChanged"
        ]
    }
}, AppBackendCore._safeApiContractKey = function (method) {
    return "route_" + String(method || "").replace(/[^A-Za-z0-9_$]/g, "_");
}, AppBackendCore.getDtoContractByMethod = function (method) {
    method = String(method || "").trim();
    var src = AppBackendCore.API_DTO_CONTRACT_BY_METHOD || {}, dto = src[method] || null;
    return dto && typeof dto == "object" ? Object.assign({}, dto) : null;
},  AppBackendCore.getApiContract = function (options) {
    options = options || {};
    var contract = {}, registry = null;
    try {
        registry = _contractIsFunctionName_("_apiRouteRegistry_") ? _apiRouteRegistry_(!!options.refresh) : null;
    }
    catch (e) {
        try {
            _contractIsFunctionName_("_recordWarning_") && _recordWarning_("api.contract.routeRegistry", e, {
                owner: "Code_00_PlatformCore.AppBackendCore.getApiContract", stamp: AppBackendCore.API_CONTRACT_STAMP
            });
        }
        catch (_warn) { _appIgnoreExpected_("Code_00_PlatformCore.gs.ignored", _warn); }
        registry = null;
    }
    return Object.keys(registry || {}).sort().forEach(function (method) {
        var meta = registry[method] || {}, dto = AppBackendCore.getDtoContractByMethod ? AppBackendCore.getDtoContractByMethod(method) : null, key = AppBackendCore._safeApiContractKey(method), required = dto && Array.isArray(dto.required) ? dto.required.slice() : [
            "ok"
        ];
        contract[key] = Object.assign({
            method, owner: String(meta.owner || meta.hotPathOwner || "Code_20_Router"), sourceOfTruth: String(meta.domain || meta.group || "router-registry"), dto: String(meta.dtoContract || "router-route-envelope-current"), required
        }, dto || {}, {
            method, owner: String(dto && dto.owner || meta.owner || meta.hotPathOwner || "Code_20_Router"), sourceOfTruth: String(dto && dto.sourceOfTruth || meta.domain || meta.group || "router-registry"), dto: String(dto && dto.dto || meta.dtoContract || "router-route-envelope-current"), required, routeContractOwner: "Code_20_Router._apiRouteRegistry_", dtoContractOwner: dto ? "AppBackendCore.API_DTO_CONTRACT_BY_METHOD" : "", routeAllowlistSource: "router-registry-only", contractStamp: AppBackendCore.API_CONTRACT_STAMP, routeMeta: {
                group: String(meta.group || ""), domain: String(meta.domain || meta.group || ""), minRole: String(meta.minRole || ""), public: !!meta.public, write: !!meta.write, csrf: !!meta.csrf, serverPaged: !!meta.serverPaged, serverFiltered: !!meta.serverFiltered, maxLimit: Number(meta.maxLimit || 0) || void 0, hotPath: !!meta.hotPath, aiRoute: !!meta.aiRoute, routeSource: String(meta.routeSource || "")
            }
        });
    }), contract;
}, AppBackendCore.CONTRACT_LOCK_CURRENT = {
    stamp: "production-contract-lock-r201",
    owner: "AppBackendCore",
    criticalApiMethods: ["apiGetDashboardBundle", "apiSearchCasesLite", "apiGetCaseReportExportRows", "apiGetPeoplePageBundle", "apiBudgetGetSummary", "apiBudgetGetTypeSummaryByFY", "apiBudgetSaveImport", "apiBudgetDeleteImport", "apiListCommitteeMeetings", "apiGetCommitteeMeetingSystem", "apiGetCommitteeMeetingPrintBundle", "apiGetPetitioners", "apiGetTracking", "apiAiDashboardInsights", "apiAdminListUsers", "apiGetRouteContract"],
    forbiddenChanges: ["DOM_ID_RENAME", "CSS_LAYOUT_CHANGE", "DATA_ACTION_RENAME", "DTO_KEY_RENAME", "SHEET_HEADER_RENAME", "BUSINESS_RULE_CHANGE"],
    requiredSmoke: ["login.dashboard.noBlank", "case.search.receiveDate.status.mapping", "case.save.delete.writeGateway", "petitioner.popup.location.auto", "people.footer.print", "budget.save.invalidate", "meeting.subcommittee.history.delete", "tracking.print.counter", "case.status.canonical.ai", "ai.notification.boundary"]
};
function _contractIsFunctionName_(name) {
    try {
        return name ? !!(typeof _appIsFnName_ == "function" && _appIsFnName_(name) || typeof globalThis != "undefined" && typeof globalThis[name] == "function" || typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ && typeof __APP_GLOBAL__[name] == "function") : !1;
    }
    catch (e) {
        return !1;
    }
}
var APP_COMPATIBILITY_CONTRACT_CURRENT = Object.freeze({
    stamp: "compatibility-contract-current-r257",
    owner: "AppBackendCore.ProductionContract",
    replacement: "APP_QUALITY_CONTRACT_CURRENT",
    retiredContractCount: 10,
    policy: "public compatibility endpoints are thin facades; retired route aliases are removed",
    noApiRouteChange: !0,
    noUiDomChange: !0,
    noDataMigration: !0
});
function _compatibilityContractFacade_(name, extra) {
    return Object.assign({
        ok: !0,
        retired: !0,
        legacyName: String(name || "legacy-contract"),
        stamp: APP_COMPATIBILITY_CONTRACT_CURRENT.stamp,
        owner: APP_COMPATIBILITY_CONTRACT_CURRENT.owner,
        replacedBy: APP_COMPATIBILITY_CONTRACT_CURRENT.replacement,
        issues: [],
        uiDomChanged: !1,
        businessLogicChanged: !1,
        dataMigration: !1
    }, extra || {});
}




AppBackendCore.LOAD_ORDER_DEPENDENCY_CURRENT = Object.freeze({
    stamp: "production-load-order-owner-current",
    owner: "Code_00_PlatformCore.CurrentContract",
    domainOwners: {
        CaseDomain: ["searchCases", "getReportOptions", "quickSummary"],
        TrackingDomain: ["getTracking", "getLetters", "saveLetter", "deleteLetter"],
        MeetingDomain: ["getHistory", "listMeetings", "getSystem"],
        DashboardDomain: ["getBundle"],
        BudgetDomain: ["getSummary", "getTypeSummary"],
        PeopleDomain: ["getPageBundle"],
        PetitionerDomain: ["getList"],
        AdminDomain: ["listUsers", "saveUser", "deleteUser", "listSubcommittees"]
    }
});
AppBackendCore.loadOrderDependencyStatus = function () {
    var spec = AppBackendCore.LOAD_ORDER_DEPENDENCY_CURRENT || {}, root = __APP_GLOBAL__ || {}, owners = {}, issues = [];
    Object.keys(spec.domainOwners || {}).forEach(function (ownerName) {
        var owner = root[ownerName], missing = [];
        (spec.domainOwners[ownerName] || []).forEach(function (method) {
            (!owner || typeof owner[method] != "function") && missing.push(method);
        });
        owners[ownerName] = { ready: !!owner, requiredMethodCount: (spec.domainOwners[ownerName] || []).length, missingMethods: missing };
        (!owner || missing.length) && issues.push({ code: "PRODUCTION_DOMAIN_OWNER_NOT_READY", owner: ownerName, methods: missing });
    });
    return {
        ok: issues.length === 0,
        stamp: spec.stamp,
        owner: spec.owner,
        ownerCount: Object.keys(spec.domainOwners || {}).length,
        owners: owners,
        issues: issues,
        routerResolvesAtInvocation: typeof _routerDomainOwner_ == "function" && typeof _routerInvokeDomain_ == "function",
        uiDomChanged: !1,
        businessLogicChanged: !1
    };
};
AppBackendCore.securityBoundaryStatus = function () {
    var issues = [], policy = typeof _routerDirectEntrypointPolicy_ == "function" ? _routerDirectEntrypointPolicy_() : null;
    (!policy || policy.routerOnlyDefault !== !0 || policy.directApiReadBlocked !== !0 || policy.directApiWriteBlocked !== !0) && issues.push({ code: "SECURITY_ROUTER_POLICY_INCOMPLETE" });
    typeof _routerAuthorizedEntry_ != "function" && issues.push({ code: "SECURITY_ROUTER_ENTRY_OWNER_MISSING" });
    var postSource = typeof doPost == "function" ? String(doPost) : "";
    postSource.indexOf("_apiRouterResolveFunction_") >= 0 && issues.push({ code: "HTTP_INGRESS_DIRECT_HANDLER_FALLBACK_PRESENT" });
    (typeof _loginRateLimitUserKey_ != "function" || typeof _loginRateLimitKeys_ != "function") && issues.push({ code: "LOGIN_USERNAME_RATE_BUCKET_MISSING" });
    var renderSource = typeof renderVue3App_ == "function" ? String(renderVue3App_) : "";
    renderSource.indexOf("ALLOWALL") >= 0 && issues.push({ code: "XFRAME_ALLOWALL_ENABLED" });
    return {
        ok: issues.length === 0,
        stamp: "production-security-boundary-p2-current",
        owner: "AppBackendCore.securityBoundaryStatus",
        issues: issues,
        routerPolicy: policy,
        httpIngress: postSource.indexOf("_apiRouterResolveFunction_") < 0 ? "apiRouter-only-fail-closed" : "direct-handler-fallback",
        loginRateLimit: "username+fingerprint",
        uiDomChanged: !1,
        businessLogicChanged: !1
    };
};



var APP_PRODUCTION_MEASUREMENT_GATE_CURRENT = Object.freeze({
    stamp: "m10-dependency-performance-baseline-2026-08-07-r234",
    owner: "Code_00_PlatformCore.ProductionMeasurementGateCurrent",
    mode: "admin-release-gate-release-isolated-correlated-duration-resource-journey-ux-refresh-concurrency",
    enabledByDefault: !0,
    publicApiAdded: !1,
    businessDataMutation: !1,
    telemetryCacheOnly: !0,
    payloadLogging: !1,
    credentialLogging: !1,
    releaseIsolatedEvidence: !0,
    runCorrelationRequired: !0,
    coldSamplesPerMethod: 10,
    warmSamplesPerMethod: 20,
    sampleTargets: Object.freeze({
        apiLogin: Object.freeze({ cold: 3, warm: 5 }),
        apiGetDashboardBundle: Object.freeze({ cold: 10, warm: 20 }),
        apiSearchCasesLite: Object.freeze({ cold: 10, warm: 20 }),
        apiGetCommitteeMeetingSystem: Object.freeze({ cold: 10, warm: 20 }),
        apiGetTracking: Object.freeze({ cold: 10, warm: 20 }),
        apiBudgetGetSummary: Object.freeze({ cold: 10, warm: 20 })
    }),
    journeyTargets: Object.freeze({ "login-to-dashboard": 3, "route-transition": 10 }),
    requiredMethods: Object.freeze(["apiLogin", "apiGetDashboardBundle", "apiSearchCasesLite", "apiGetCommitteeMeetingSystem", "apiGetTracking", "apiBudgetGetSummary"]),
    requiredJourneys: Object.freeze(["login-to-dashboard", "route-transition"]),
    metrics: Object.freeze(["clientDurationMs", "serverDurationMs", "transportOverheadMs", "p50", "p95", "p99", "rowsRead", "cellsRead", "serviceReads", "spreadsheetServiceOpens", "headerReads", "payloadBytes", "cacheHit", "requestId", "runId", "mutationRefreshExactlyOnce", "concurrentWriteObserved"]),
    qualityTargets: Object.freeze({ minMutationRefreshSamples: 5, minConcurrentWriteScenarios: 1, maxExactlyOnceFailures: 0, maxConcurrentWriteFailures: 0 }),
    budgets: Object.freeze({ apiLogin: 12000, apiGetDashboardBundle: 12000, apiSearchCasesLite: 8000, apiGetCommitteeMeetingSystem: 10000, apiGetTracking: 8000, apiBudgetGetSummary: 10000, loginToDashboard: 30000, routeTransition: 3000 }),
    clientBudgets: Object.freeze({
        apiLogin: Object.freeze({ maxClientP95Ms: 18000, maxTransportP95Ms: 6000 }),
        apiGetDashboardBundle: Object.freeze({ maxClientP95Ms: 18000, maxTransportP95Ms: 6000 }),
        apiSearchCasesLite: Object.freeze({ maxClientP95Ms: 12000, maxTransportP95Ms: 5000 }),
        apiGetCommitteeMeetingSystem: Object.freeze({ maxClientP95Ms: 15000, maxTransportP95Ms: 5000 }),
        apiGetTracking: Object.freeze({ maxClientP95Ms: 12000, maxTransportP95Ms: 5000 }),
        apiBudgetGetSummary: Object.freeze({ maxClientP95Ms: 15000, maxTransportP95Ms: 5000 })
    }),
    uxBudgets: Object.freeze({ minInpSamples: 20, inpP75Ms: 200, minClickToFeedbackSamples: 20, clickToFeedbackP95Ms: 200, longTaskP95Ms: 200 }),
    resourceBudgets: Object.freeze({
        apiLogin: Object.freeze({ maxServiceReadsP95: 4, maxSpreadsheetServiceOpensP95: 1, maxHeaderReadsP95: 2, maxPayloadBytesP95: 250000 }),
        apiGetDashboardBundle: Object.freeze({ maxServiceReadsP95: 24, maxSpreadsheetServiceOpensP95: 1, maxHeaderReadsP95: 12, maxPayloadBytesP95: 1800000 }),
        apiSearchCasesLite: Object.freeze({ maxServiceReadsP95: 10, maxSpreadsheetServiceOpensP95: 1, maxHeaderReadsP95: 6, maxPayloadBytesP95: 900000 }),
        apiGetCommitteeMeetingSystem: Object.freeze({ maxServiceReadsP95: 20, maxSpreadsheetServiceOpensP95: 1, maxHeaderReadsP95: 10, maxPayloadBytesP95: 1600000 }),
        apiGetTracking: Object.freeze({ maxServiceReadsP95: 14, maxSpreadsheetServiceOpensP95: 1, maxHeaderReadsP95: 8, maxPayloadBytesP95: 1100000 }),
        apiBudgetGetSummary: Object.freeze({ maxServiceReadsP95: 20, maxSpreadsheetServiceOpensP95: 1, maxHeaderReadsP95: 10, maxPayloadBytesP95: 1600000 })
    })
}), __APP_PRODUCTION_MEASUREMENT_RELEASE_KEY__ = String(APP_DEPLOY_RELEASE && APP_DEPLOY_RELEASE.sourceFingerprint || "unknown-release").replace(/[^A-Za-z0-9_\-]/g, "_").substring(0, 80), __APP_PRODUCTION_CLIENT_EVIDENCE_CACHE_KEY__ = "APP_PRODUCTION_CLIENT_EVIDENCE_" + __APP_PRODUCTION_MEASUREMENT_RELEASE_KEY__, __APP_PRODUCTION_CLIENT_EVIDENCE_TTL__ = 21600;
function _productionMeasurementSafeEvidenceNumber_(value) {
    value = Number(value || 0);
    return isFinite(value) && value >= 0 ? value : 0;
}
function _productionMeasurementSafeEvidenceText_(value, maxLength) {
    return String(value == null ? "" : value).replace(/[\r\n\t]/g, " ").trim().substring(0, Math.max(1, Number(maxLength || 96)));
}
function _productionMeasurementSampleTarget_(method) {
    var target = APP_PRODUCTION_MEASUREMENT_GATE_CURRENT.sampleTargets && APP_PRODUCTION_MEASUREMENT_GATE_CURRENT.sampleTargets[method] || {};
    return {
        cold: Math.max(1, Number(target.cold || APP_PRODUCTION_MEASUREMENT_GATE_CURRENT.coldSamplesPerMethod || 10)),
        warm: Math.max(1, Number(target.warm || APP_PRODUCTION_MEASUREMENT_GATE_CURRENT.warmSamplesPerMethod || 20))
    };
}
function _productionMeasurementSanitizeStats_(input) {
    input = input && typeof input == "object" && !Array.isArray(input) ? input : {};
    return {
        sampleCount: _productionMeasurementSafeEvidenceNumber_(input.sampleCount),
        p50ClientMs: _productionMeasurementSafeEvidenceNumber_(input.p50ClientMs || input.clientP50Ms),
        p95ClientMs: _productionMeasurementSafeEvidenceNumber_(input.p95ClientMs || input.clientP95Ms),
        p99ClientMs: _productionMeasurementSafeEvidenceNumber_(input.p99ClientMs || input.clientP99Ms),
        p50ServerMs: _productionMeasurementSafeEvidenceNumber_(input.p50ServerMs || input.serverP50Ms),
        p95ServerMs: _productionMeasurementSafeEvidenceNumber_(input.p95ServerMs || input.serverP95Ms),
        p99ServerMs: _productionMeasurementSafeEvidenceNumber_(input.p99ServerMs || input.serverP99Ms),
        p50TransportMs: _productionMeasurementSafeEvidenceNumber_(input.p50TransportMs || input.transportP50Ms),
        p95TransportMs: _productionMeasurementSafeEvidenceNumber_(input.p95TransportMs || input.transportP95Ms),
        p99TransportMs: _productionMeasurementSafeEvidenceNumber_(input.p99TransportMs || input.transportP99Ms),
        requestIdCount: _productionMeasurementSafeEvidenceNumber_(input.requestIdCount),
        requestIdCoverage: Math.max(0, Math.min(1, Number(input.requestIdCoverage || 0) || 0)),
        p95PayloadBytes: _productionMeasurementSafeEvidenceNumber_(input.p95PayloadBytes),
        p99PayloadBytes: _productionMeasurementSafeEvidenceNumber_(input.p99PayloadBytes),
        cacheHitRatio: Math.max(0, Math.min(100, Number(input.cacheHitRatio || 0) || 0))
    };
}
function _productionMeasurementSanitizeUxMetric_(input) {
    input = input && typeof input == "object" && !Array.isArray(input) ? input : {};
    return {
        sampleCount: _productionMeasurementSafeEvidenceNumber_(input.sampleCount),
        p50Ms: _productionMeasurementSafeEvidenceNumber_(input.p50Ms),
        p75Ms: _productionMeasurementSafeEvidenceNumber_(input.p75Ms),
        p95Ms: _productionMeasurementSafeEvidenceNumber_(input.p95Ms),
        p99Ms: _productionMeasurementSafeEvidenceNumber_(input.p99Ms),
        maxMs: _productionMeasurementSafeEvidenceNumber_(input.maxMs)
    };
}
function _productionMeasurementSanitizeQualityEvidence_(input) {
    input = input && typeof input == "object" && !Array.isArray(input) ? input : {};
    var mutation = input.mutation && typeof input.mutation == "object" ? input.mutation : {}, concurrentWrite = input.concurrentWrite && typeof input.concurrentWrite == "object" ? input.concurrentWrite : {}, performance = input.performance && typeof input.performance == "object" ? input.performance : {};
    return {
        mutation: {
            observed: _productionMeasurementSafeEvidenceNumber_(mutation.observed),
            scheduled: _productionMeasurementSafeEvidenceNumber_(mutation.scheduled),
            completed: _productionMeasurementSafeEvidenceNumber_(mutation.completed),
            failed: _productionMeasurementSafeEvidenceNumber_(mutation.failed),
            exactlyOnceVerified: _productionMeasurementSafeEvidenceNumber_(mutation.exactlyOnceVerified),
            exactlyOnceFailures: _productionMeasurementSafeEvidenceNumber_(mutation.exactlyOnceFailures),
            pending: _productionMeasurementSafeEvidenceNumber_(mutation.pending)
        },
        concurrentWrite: {
            sampleCount: _productionMeasurementSafeEvidenceNumber_(concurrentWrite.sampleCount),
            successCount: _productionMeasurementSafeEvidenceNumber_(concurrentWrite.successCount),
            failureCount: _productionMeasurementSafeEvidenceNumber_(concurrentWrite.failureCount),
            lastObservedAt: _productionMeasurementSafeEvidenceText_(concurrentWrite.lastObservedAt || "", 40)
        },
        performance: {
            calls: _productionMeasurementSafeEvidenceNumber_(performance.calls),
            transportStarts: _productionMeasurementSafeEvidenceNumber_(performance.transportStarts),
            dedupHits: _productionMeasurementSafeEvidenceNumber_(performance.dedupHits),
            staleSuppressed: _productionMeasurementSafeEvidenceNumber_(performance.staleSuppressed),
            staleCacheWritesSkipped: _productionMeasurementSafeEvidenceNumber_(performance.staleCacheWritesSkipped),
            peakInFlight: _productionMeasurementSafeEvidenceNumber_(performance.peakInFlight)
        },
        generatedAt: _productionMeasurementSafeEvidenceText_(input.generatedAt || new Date().toISOString(), 40)
    };
}
function _productionMeasurementSanitizeClientEvidence_(input) {
    input = input && typeof input == "object" && !Array.isArray(input) ? input : {};
    var expectedFingerprint = String(APP_DEPLOY_RELEASE && APP_DEPLOY_RELEASE.sourceFingerprint || ""), providedFingerprint = _productionMeasurementSafeEvidenceText_(input.releaseFingerprint || "", 120), releaseMatch = !!providedFingerprint && providedFingerprint === expectedFingerprint, methods = {}, journeys = {}, allowedMethods = APP_PRODUCTION_MEASUREMENT_GATE_CURRENT.requiredMethods || [], allowedJourneys = APP_PRODUCTION_MEASUREMENT_GATE_CURRENT.requiredJourneys || [];
    allowedMethods.forEach(function (method) {
        var row = input.methods && input.methods[method] && typeof input.methods[method] == "object" ? input.methods[method] : {}, target = _productionMeasurementSampleTarget_(method), cold = _productionMeasurementSafeEvidenceNumber_(row.cold), warm = _productionMeasurementSafeEvidenceNumber_(row.warm), requiredCold = _productionMeasurementSafeEvidenceNumber_(row.requiredCold || target.cold), requiredWarm = _productionMeasurementSafeEvidenceNumber_(row.requiredWarm || target.warm), successCount = _productionMeasurementSafeEvidenceNumber_(row.successCount), failureCount = _productionMeasurementSafeEvidenceNumber_(row.failureCount), latestRunId = _productionMeasurementSafeEvidenceText_(row.latestRunId || "", 80);
        methods[method] = {
            latestRunId: latestRunId,
            cold: cold,
            warm: warm,
            successCount: successCount,
            failureCount: failureCount,
            requiredCold: requiredCold,
            requiredWarm: requiredWarm,
            coldStats: _productionMeasurementSanitizeStats_(row.coldStats),
            warmStats: _productionMeasurementSanitizeStats_(row.warmStats),
            complete: releaseMatch && !!latestRunId && cold >= requiredCold && warm >= requiredWarm && failureCount === 0
        };
    });
    allowedJourneys.forEach(function (name) {
        var row = input.journeys && input.journeys[name] && typeof input.journeys[name] == "object" ? input.journeys[name] : {};
        journeys[name] = {
            sampleCount: _productionMeasurementSafeEvidenceNumber_(row.sampleCount),
            successCount: _productionMeasurementSafeEvidenceNumber_(row.successCount),
            failureCount: _productionMeasurementSafeEvidenceNumber_(row.failureCount),
            p50Ms: _productionMeasurementSafeEvidenceNumber_(row.p50Ms),
            p95Ms: _productionMeasurementSafeEvidenceNumber_(row.p95Ms),
            p99Ms: _productionMeasurementSafeEvidenceNumber_(row.p99Ms),
            maxMs: _productionMeasurementSafeEvidenceNumber_(row.maxMs)
        };
    });
    var browser = input.browser && typeof input.browser == "object" ? input.browser : {}, navigation = browser.navigation && typeof browser.navigation == "object" ? browser.navigation : null, device = browser.device && typeof browser.device == "object" ? browser.device : {};
    return {
        ok: input.ok !== !1,
        ready: input.ready === !0 && releaseMatch,
        accepted: releaseMatch,
        stamp: _productionMeasurementSafeEvidenceText_(input.stamp || "", 120),
        releaseFingerprint: providedFingerprint,
        expectedReleaseFingerprint: expectedFingerprint,
        releaseMatch: releaseMatch,
        methods: methods,
        journeys: journeys,
        browser: {
            navigation: navigation ? {
                domInteractive: _productionMeasurementSafeEvidenceNumber_(navigation.domInteractive),
                domContentLoaded: _productionMeasurementSafeEvidenceNumber_(navigation.domContentLoaded),
                loadEventEnd: _productionMeasurementSafeEvidenceNumber_(navigation.loadEventEnd),
                transferSize: _productionMeasurementSafeEvidenceNumber_(navigation.transferSize)
            } : null,
            eventTimingSupported: browser.eventTimingSupported === !0,
            longTaskSupported: browser.longTaskSupported === !0,
            inp: _productionMeasurementSanitizeUxMetric_(browser.inp),
            longTask: _productionMeasurementSanitizeUxMetric_(browser.longTask),
            clickToFeedback: _productionMeasurementSanitizeUxMetric_(browser.clickToFeedback),
            device: {
                viewportWidth: _productionMeasurementSafeEvidenceNumber_(device.viewportWidth),
                viewportHeight: _productionMeasurementSafeEvidenceNumber_(device.viewportHeight),
                devicePixelRatio: _productionMeasurementSafeEvidenceNumber_(device.devicePixelRatio),
                coarsePointer: device.coarsePointer === !0,
                effectiveType: _productionMeasurementSafeEvidenceText_(device.effectiveType || "", 20)
            }
        },
        quality: _productionMeasurementSanitizeQualityEvidence_(input.quality),
        generatedAt: _productionMeasurementSafeEvidenceText_(input.generatedAt || new Date().toISOString(), 40),
        noPayloadLogging: !0,
        noCredentialLogging: !0
    };
}
function _productionMeasurementStoreClientEvidence_(input) {
    try {
        var evidence = _productionMeasurementSanitizeClientEvidence_(input), cache = _AppScriptCache_();
        if (!evidence.releaseMatch)
            return evidence.stored = !1, evidence.rejectReason = "CLIENT_EVIDENCE_RELEASE_MISMATCH", evidence;
        cache && cache.put(__APP_PRODUCTION_CLIENT_EVIDENCE_CACHE_KEY__, JSON.stringify(evidence), __APP_PRODUCTION_CLIENT_EVIDENCE_TTL__);
        return evidence.stored = !!cache, evidence;
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("production.measurement.clientEvidence.store", e), null;
    }
}
function _productionMeasurementReadClientEvidence_() {
    try {
        var cache = _AppScriptCache_(), raw = cache ? cache.get(__APP_PRODUCTION_CLIENT_EVIDENCE_CACHE_KEY__) : "";
        return raw ? _productionMeasurementSanitizeClientEvidence_(JSON.parse(raw)) : _productionMeasurementSanitizeClientEvidence_({ releaseFingerprint: APP_DEPLOY_RELEASE.sourceFingerprint });
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("production.measurement.clientEvidence.read", e), _productionMeasurementSanitizeClientEvidence_({ releaseFingerprint: APP_DEPLOY_RELEASE.sourceFingerprint });
    }
}
function _productionMeasurementResourceWithin_(stats, budget) {
    stats = stats || {}, budget = budget || {};
    var checks = {
        serviceReads: !Number(budget.maxServiceReadsP95 || 0) || Number(stats.p95ServiceReads || 0) <= Number(budget.maxServiceReadsP95),
        spreadsheetServiceOpens: !Number(budget.maxSpreadsheetServiceOpensP95 || 0) || Number(stats.p95SpreadsheetServiceOpens || 0) <= Number(budget.maxSpreadsheetServiceOpensP95),
        headerReads: !Number(budget.maxHeaderReadsP95 || 0) || Number(stats.p95HeaderReads || 0) <= Number(budget.maxHeaderReadsP95),
        payloadBytes: !Number(budget.maxPayloadBytesP95 || 0) || Number(stats.p95PayloadBytes || 0) <= Number(budget.maxPayloadBytesP95)
    };
    return {
        ok: Object.keys(checks).every(function (key) { return checks[key]; }),
        checks: checks,
        observed: {
            p95ServiceReads: Number(stats.p95ServiceReads || 0),
            p95SpreadsheetServiceOpens: Number(stats.p95SpreadsheetServiceOpens || 0),
            p95HeaderReads: Number(stats.p95HeaderReads || 0),
            p95PayloadBytes: Number(stats.p95PayloadBytes || 0)
        },
        budget: Object.assign({}, budget)
    };
}

function _productionPolicyStatus_() {
    var security = _appIsFnName_("_securityProductionGateSnapshot_") ? _securityProductionGateSnapshot_() : null;
    var aiPolicy = _appIsFnName_("_aiProductionPolicy_") ? _aiProductionPolicy_() : null;
    var redactionReady = !1;
    try {
        if (_appIsFnName_("_redactSensitiveAiText_")) {
            var sample = "เลข 1234567890123 email qa@example.com โทร 0812345678", redacted = String(_redactSensitiveAiText_(sample) || "");
            redactionReady = redacted.indexOf("1234567890123") < 0 && redacted.indexOf("qa@example.com") < 0 && redacted.indexOf("0812345678") < 0;
        }
    }
    catch (_p1AiRedactionErr) {
        redactionReady = !1;
    }
    var externalHosts = security && Array.isArray(security.externalHostAllowlist) ? security.externalHostAllowlist : [];
    var checks = {
        productionSecurityProfile: !!(security && security.productionGateLock),
        auditRedaction: !!(security && security.auditRedaction),
        hmacSecret: !!(security && security.hmacSecretConfigured && security.hmacSecretIndependent),
        passwordPepper: !!(security && security.passwordPepperConfigured),
        aiPolicy: !!(aiPolicy && aiPolicy.lazyOnly && aiPolicy.advisoryOnly && aiPolicy.noDataMutation && aiPolicy.initialLoadAllowed === !1),
        aiTextRedaction: redactionReady,
        externalHostAllowlist: externalHosts.indexOf("generativelanguage.googleapis.com") >= 0
    };
    return {
        ok: Object.keys(checks).every(function (key) { return checks[key]; }),
        checks: checks,
        security: security,
        ai: aiPolicy,
        geminiKeyConfigured: _appIsFnName_("_getGeminiKey_") ? !!String(_getGeminiKey_() || "") : !1,
        secretValuesExposed: !1,
        webAppTransportAccess: "ANYONE_ANONYMOUS",
        applicationAuthenticationRequired: !0,
        scriptAppScopeRequiredBySource: !0,
        generatedAt: new Date().toISOString()
    };
}
function _productionMeasurementGateStatus_(options) {
    options = options || {};
    var plan = APP_PRODUCTION_MEASUREMENT_GATE_CURRENT, missing = [], blockers = [], serverBaseline = _appIsFnName_("_apiPerfBaselineSnapshot_") ? _apiPerfBaselineSnapshot_({ methods: plan.requiredMethods.slice(), rawLimit: 0 }) : null, clientEvidence = options.clientEvidence ? _productionMeasurementSanitizeClientEvidence_(options.clientEvidence) : _productionMeasurementReadClientEvidence_(), methodEvidence = {}, journeyEvidence = {}, budgetEvidence = {}, resourceEvidence = {}, clientBudgetEvidence = {}, serverComplete = !0, clientComplete = !0, journeysComplete = !0, budgetsWithinTarget = !0, resourcesWithinTarget = !0, correlationComplete = !0;
    plan.requiredMethods.length || missing.push("requiredMethods");
    plan.requiredJourneys.length || missing.push("requiredJourneys");
    plan.metrics.indexOf("requestId") >= 0 || missing.push("requestId");
    plan.metrics.indexOf("runId") >= 0 || missing.push("runId");
    plan.metrics.indexOf("spreadsheetServiceOpens") >= 0 || missing.push("spreadsheetServiceOpens");
    _appIsFnName_("_apiPerfBaselineSnapshot_") || missing.push("serverBaselineSnapshot");
    clientEvidence.releaseMatch === !0 || blockers.push("client-release-mismatch");
    plan.requiredMethods.forEach(function (method) {
        var target = _productionMeasurementSampleTarget_(method), serverProgress = serverBaseline && serverBaseline.progress && serverBaseline.progress[method] || {}, clientProgress = clientEvidence.methods && clientEvidence.methods[method] || {}, methodStats = serverBaseline && serverBaseline.methods && serverBaseline.methods[method] || {}, stats = methodStats.all || {}, coldStats = methodStats.modes && methodStats.modes.cold || {}, warmStats = methodStats.modes && methodStats.modes.warm || {}, budgetMs = Number(plan.budgets[method] || 0), resourceBudget = plan.resourceBudgets && plan.resourceBudgets[method] || {}, clientBudget = plan.clientBudgets && plan.clientBudgets[method] || {}, serverSuccessful = Number(stats.sampleCount || 0) > 0 && Number(stats.failureCount || 0) === 0, coldWithinBudget = Number(coldStats.sampleCount || 0) >= target.cold && (!budgetMs || Number(coldStats.p95Ms || 0) <= budgetMs), warmWithinBudget = Number(warmStats.sampleCount || 0) >= target.warm && (!budgetMs || Number(warmStats.p95Ms || 0) <= budgetMs), coldResource = _productionMeasurementResourceWithin_(coldStats, resourceBudget), warmResource = _productionMeasurementResourceWithin_(warmStats, resourceBudget), resourceComplete = Number(coldStats.sampleCount || 0) >= target.cold && Number(warmStats.sampleCount || 0) >= target.warm, resourceWithin = resourceComplete && coldResource.ok && warmResource.ok, serverRunId = String(serverProgress.latestRunId || methodStats.latestRunId || ""), clientRunId = String(clientProgress.latestRunId || ""), runCorrelated = !!serverRunId && serverRunId === clientRunId, coldClientStats = clientProgress.coldStats || {}, warmClientStats = clientProgress.warmStats || {}, clientColdWithin = Number(coldClientStats.sampleCount || 0) >= target.cold && (!Number(clientBudget.maxClientP95Ms || 0) || Number(coldClientStats.p95ClientMs || 0) <= Number(clientBudget.maxClientP95Ms)) && (!Number(clientBudget.maxTransportP95Ms || 0) || Number(coldClientStats.p95TransportMs || 0) <= Number(clientBudget.maxTransportP95Ms)) && Number(coldClientStats.requestIdCoverage || 0) >= 1, clientWarmWithin = Number(warmClientStats.sampleCount || 0) >= target.warm && (!Number(clientBudget.maxClientP95Ms || 0) || Number(warmClientStats.p95ClientMs || 0) <= Number(clientBudget.maxClientP95Ms)) && (!Number(clientBudget.maxTransportP95Ms || 0) || Number(warmClientStats.p95TransportMs || 0) <= Number(clientBudget.maxTransportP95Ms)) && Number(warmClientStats.requestIdCoverage || 0) >= 1, clientWithin = clientProgress.complete === !0 && clientColdWithin && clientWarmWithin, withinBudget = serverSuccessful && coldWithinBudget && warmWithinBudget && resourceWithin && clientWithin && runCorrelated;
        methodEvidence[method] = {
            target: target,
            latestRunId: { server: serverRunId, client: clientRunId, correlated: runCorrelated },
            server: { cold: Number(serverProgress.cold || 0), warm: Number(serverProgress.warm || 0), failureCount: Number(serverProgress.failureCount || stats.failureCount || 0), requiredCold: target.cold, requiredWarm: target.warm, complete: serverProgress.complete === !0 },
            client: clientProgress,
            p50Ms: Number(stats.p50Ms || 0),
            p95Ms: Number(stats.p95Ms || 0),
            p99Ms: Number(stats.p99Ms || 0),
            cold: { p50Ms: Number(coldStats.p50Ms || 0), p95Ms: Number(coldStats.p95Ms || 0), p99Ms: Number(coldStats.p99Ms || 0), sampleCount: Number(coldStats.sampleCount || 0), durationWithinBudget: coldWithinBudget, resources: coldResource, client: coldClientStats, clientWithinBudget: clientColdWithin },
            warm: { p50Ms: Number(warmStats.p50Ms || 0), p95Ms: Number(warmStats.p95Ms || 0), p99Ms: Number(warmStats.p99Ms || 0), sampleCount: Number(warmStats.sampleCount || 0), durationWithinBudget: warmWithinBudget, resources: warmResource, client: warmClientStats, clientWithinBudget: clientWarmWithin },
            budgetMs: budgetMs,
            clientBudget: Object.assign({}, clientBudget),
            successful: serverSuccessful,
            resourcesWithinTarget: resourceWithin,
            withinBudget: withinBudget
        };
        serverProgress.complete === !0 || (serverComplete = !1, blockers.push("server-method:" + method));
        clientProgress.complete === !0 || (clientComplete = !1, blockers.push("client-method:" + method));
        runCorrelated || (correlationComplete = !1, blockers.push("run-correlation:" + method));
        coldWithinBudget && warmWithinBudget || (budgetsWithinTarget = !1, blockers.push("server-duration-budget:" + method));
        clientColdWithin && clientWarmWithin || (budgetsWithinTarget = !1, blockers.push("client-duration-transport-budget:" + method));
        resourceWithin || (resourcesWithinTarget = !1, blockers.push("resource-budget:" + method));
        budgetEvidence[method] = { coldP95Ms: Number(coldStats.p95Ms || 0), warmP95Ms: Number(warmStats.p95Ms || 0), budgetMs: budgetMs, coldWithinBudget: coldWithinBudget, warmWithinBudget: warmWithinBudget, withinBudget: coldWithinBudget && warmWithinBudget };
        clientBudgetEvidence[method] = { cold: coldClientStats, warm: warmClientStats, budget: Object.assign({}, clientBudget), coldWithinBudget: clientColdWithin, warmWithinBudget: clientWarmWithin, withinBudget: clientColdWithin && clientWarmWithin };
        resourceEvidence[method] = { cold: coldResource, warm: warmResource, complete: resourceComplete, withinTarget: resourceWithin };
    });
    plan.requiredJourneys.forEach(function (name) {
        var row = clientEvidence.journeys && clientEvidence.journeys[name] || {}, requiredSamples = Math.max(1, Number(plan.journeyTargets && plan.journeyTargets[name] || 1)), budgetKey = name === "route-transition" ? "routeTransition" : "loginToDashboard", budgetMs = Number(plan.budgets[budgetKey] || 0), complete = Number(row.sampleCount || 0) >= requiredSamples && Number(row.failureCount || 0) === 0, withinBudget = complete && (!budgetMs || Number(row.p95Ms || 0) <= budgetMs);
        journeyEvidence[name] = Object.assign({}, row, { requiredSamples: requiredSamples, complete: complete, budgetMs: budgetMs, withinBudget: withinBudget });
        complete || (journeysComplete = !1, blockers.push("journey:" + name));
        withinBudget || (budgetsWithinTarget = !1, blockers.push("journey-budget:" + name));
    });
    var ux = clientEvidence.browser || {}, uxBudget = plan.uxBudgets || {}, click = ux.clickToFeedback || {}, inp = ux.inp || {}, longTask = ux.longTask || {}, clickComplete = Number(click.sampleCount || 0) >= Number(uxBudget.minClickToFeedbackSamples || 0), clickWithin = clickComplete && Number(click.p95Ms || 0) <= Number(uxBudget.clickToFeedbackP95Ms || 0), inpApplicable = ux.eventTimingSupported === !0, inpComplete = !inpApplicable || Number(inp.sampleCount || 0) >= Number(uxBudget.minInpSamples || 0), inpWithin = !inpApplicable || inpComplete && Number(inp.p75Ms || 0) <= Number(uxBudget.inpP75Ms || 0), longWithin = !Number(longTask.sampleCount || 0) || Number(longTask.p95Ms || 0) <= Number(uxBudget.longTaskP95Ms || 0), uxReady = clickWithin && inpWithin && longWithin, requireUxEvidence = options.requireUxEvidence !== !1;
    requireUxEvidence && !uxReady && blockers.push("ux-evidence");
    var quality = clientEvidence.quality || {}, qualityTarget = plan.qualityTargets || {}, mutationQuality = quality.mutation || {}, concurrentQuality = quality.concurrentWrite || {}, mutationComplete = Number(mutationQuality.exactlyOnceVerified || 0) >= Number(qualityTarget.minMutationRefreshSamples || 0), mutationWithin = Number(mutationQuality.exactlyOnceFailures || 0) <= Number(qualityTarget.maxExactlyOnceFailures || 0) && Number(mutationQuality.failed || 0) === 0, concurrentComplete = Number(concurrentQuality.sampleCount || 0) >= Number(qualityTarget.minConcurrentWriteScenarios || 0), concurrentWithin = Number(concurrentQuality.failureCount || 0) <= Number(qualityTarget.maxConcurrentWriteFailures || 0), qualityReady = mutationComplete && mutationWithin && concurrentComplete && concurrentWithin, requireQualityEvidence = options.requireQualityEvidence !== !1;
    requireQualityEvidence && !mutationComplete && blockers.push("mutation-refresh-exactly-once-samples");
    requireQualityEvidence && !mutationWithin && blockers.push("mutation-refresh-exactly-once-failures");
    requireQualityEvidence && !concurrentComplete && blockers.push("concurrent-write-scenario");
    requireQualityEvidence && !concurrentWithin && blockers.push("concurrent-write-failures");
    var policyStatus = _productionPolicyStatus_(), implementationReady = missing.length === 0 && policyStatus.ok, evidenceComplete = serverComplete && clientComplete && journeysComplete && correlationComplete && (!requireUxEvidence || uxReady) && (!requireQualityEvidence || qualityReady), evidenceReady = evidenceComplete && budgetsWithinTarget && resourcesWithinTarget, requireEvidence = options.requireEvidence !== !1;
    policyStatus.ok || blockers.push("production-policy");
    return {
        ok: implementationReady && (!requireEvidence || evidenceReady),
        implementationReady: implementationReady,
        evidenceComplete: evidenceComplete,
        budgetsWithinTarget: budgetsWithinTarget,
        resourcesWithinTarget: resourcesWithinTarget,
        correlationComplete: correlationComplete,
        uxEvidenceReady: uxReady,
        evidenceReady: evidenceReady,
        requireEvidence: requireEvidence,
        requireUxEvidence: requireUxEvidence,
        requireQualityEvidence: requireQualityEvidence,
        qualityEvidenceReady: qualityReady,
        stamp: plan.stamp,
        owner: plan.owner,
        mode: plan.mode,
        releaseStamp: APP_DEPLOY_RELEASE.stamp,
        releaseFingerprint: APP_DEPLOY_RELEASE.sourceFingerprint,
        clientEvidenceCacheKey: __APP_PRODUCTION_CLIENT_EVIDENCE_CACHE_KEY__,
        enabledByDefault: plan.enabledByDefault,
        requiredMethods: plan.requiredMethods.slice(),
        requiredJourneys: plan.requiredJourneys.slice(),
        sampleTargets: Object.assign({}, plan.sampleTargets),
        journeyTargets: Object.assign({}, plan.journeyTargets),
        metrics: plan.metrics.slice(),
        budgets: Object.assign({}, plan.budgets),
        clientBudgets: Object.assign({}, plan.clientBudgets),
        resourceBudgets: Object.assign({}, plan.resourceBudgets),
        uxBudgets: Object.assign({}, plan.uxBudgets),
        qualityTargets: Object.assign({}, plan.qualityTargets),
        methods: methodEvidence,
        journeys: journeyEvidence,
        budgetEvidence: budgetEvidence,
        clientBudgetEvidence: clientBudgetEvidence,
        resourceEvidence: resourceEvidence,
        uxEvidence: { ready: uxReady, eventTimingSupported: ux.eventTimingSupported === !0, clickToFeedback: click, inp: inp, longTask: longTask, checks: { clickComplete: clickComplete, clickWithin: clickWithin, inpApplicable: inpApplicable, inpComplete: inpComplete, inpWithin: inpWithin, longWithin: longWithin } },
        qualityEvidence: { ready: qualityReady, mutation: mutationQuality, concurrentWrite: concurrentQuality, performance: quality.performance || {}, checks: { mutationComplete: mutationComplete, mutationWithin: mutationWithin, concurrentComplete: concurrentComplete, concurrentWithin: concurrentWithin } },
        productionPolicy: policyStatus,
        serverBaseline: serverBaseline,
        clientEvidence: clientEvidence,
        missing: missing,
        blockers: blockers,
        publicApiAdded: !1,
        businessDataMutation: !1,
        telemetryCacheOnly: !0,
        payloadLogging: !1,
        credentialLogging: !1,
        uiDomChanged: !1,
        businessLogicChanged: !1,
        generatedAt: new Date().toISOString()
    };
}
AppBackendCore.currentContractGateStatus = function (options) {
    options = options || {};
    var current = _appIsFnName_("_currentQualityGateStatus_") ? _currentQualityGateStatus_({
        includeCases: options.includeRegressionCases === !0,
        requireLiveEvidence: !1
    }) : null;
    var route = _appIsFnName_("_routerFacadeContract_") ? _routerFacadeContract_() : null;
    var issues = current && Array.isArray(current.issues) ? current.issues.slice() : ["CURRENT_QUALITY_GATE_UNAVAILABLE"];
    return Object.assign(_compatibilityContractFacade_("apiGetPhase0ContractGate", {
        ok: !!(current && current.ok),
        retired: !1,
        stamp: String(current && current.stamp || APP_COMPATIBILITY_CONTRACT_CURRENT.stamp),
        owner: "Code_06_Platform_QualityGates.CurrentQualityGate",
        issues: issues,
        currentQualityGate: current,
        contracts: {
            routeContractOk: !!(route && route.ok),
            exactSetParity: !!(route && route.exactSetParity),
            routeCount: Number(current && current.routeCount || 0),
            writeRouteCount: Number(current && current.writeRouteCount || 0),
            directEntrypointPolicyOk: !0
        },
        safetyBaseline: current,
        automatedRegression: current && current.regression || null,
        generatedAt: new Date().toISOString()
    }), {
        compatibilityFacade: !0,
        canonicalOwner: "Code_06_Platform_QualityGates.CurrentQualityGate"
    });
};












function _contractGateSnapshot_() {
    return AppBackendCore.currentContractGateStatus({
        source: "server-snapshot"
    });
}
function _getContractGate_(payload) {
    var snapshot = _contractGateSnapshot_(), gateOk = !!(snapshot && snapshot.ok), issueCount = snapshot && Array.isArray(snapshot.issues) ? snapshot.issues.length : 0, message = gateOk ? "Current Contract Gate ผ่าน" : "Current Contract Gate ไม่ผ่าน";
    return {
        ok: gateOk, data: snapshot, result: snapshot, msg: message, error: gateOk ? "" : "CURRENT_CONTRACT_GATE_FAILED", meta: {
            contractOwner: "current-contract-gate", route: "apiGetPhase0ContractGate", gateOk, issueCount, contractStamp: String(snapshot && snapshot.stamp || "current-contract-gate")
        }
    };
}
function apiGetPhase0ContractGate(payload) {
    return _getContractGate_(payload);
}

var AppBackendDTO = __APP_GLOBAL__.AppBackendDTO = __APP_GLOBAL__.AppBackendDTO || {};
AppBackendDTO.VERSION = "dto-current", AppBackendDTO.caseSearchRow = function (row, seq) {
    return AppBackendCore.normalizeCaseSearchDto(row || {}, seq || "");
}, AppBackendDTO.caseSearchEnvelope = function (rows, meta) {
    return meta = meta || {}, {
        ok: !0, rows: rows = Array.isArray(rows) ? rows : [], totalRecords: Number(meta.totalRecords || rows.length) || 0, page: Number(meta.page || 1) || 1, limit: Number(meta.limit || meta.pageSize || rows.length || 20) || 20, pageSize: Number(meta.pageSize || meta.limit || rows.length || 20) || 20, totalPages: Number(meta.totalPages || 1) || 1, dto: "case-search-flat-main-data-current", sourceOfTruth: "MainData"
    };
}, AppBackendCore.ok = function (data, meta) {
    return {
        ok: !0, data: data = data || {}, rows: Array.isArray(data.rows) ? data.rows : void 0, totalRecords: data.totalRecords, msg: "สำเร็จ", meta: meta || {}, generatedAt: new Date().toISOString()
    };
}, AppBackendCore.fail = function (code, message, detail) {
    return {
        ok: !1, error: String(code || "APP_ERROR"), msg: String(message || "เกิดข้อผิดพลาด"), detail: detail || null, generatedAt: new Date().toISOString()
    };
}, AppBackendCore.text = function (value) {
    return String(value == null ? "" : value).replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
}, AppBackendCore.pick = function (row, keys, defaultValue) {
    row = row || {}, keys = Array.isArray(keys) ? keys : [
        keys
    ];
    for (var i = 0; i < keys.length; i++) {
        var key, v = row[keys[i]];
        if (v != null && String(v).trim() !== "")
            return v;
    }
    return defaultValue || "";
}, AppBackendCore.normalizedKey = function (value) {
    return String(value == null ? "" : value).replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "").replace(/[\s\n\r\t\-–—_()（）\[\]{}:：\/\.]+/g, "").toLowerCase();
}, AppBackendCore.pickNormalized = function (row, keys, defaultValue) {
    row = row || {}, keys = Array.isArray(keys) ? keys : [
        keys
    ];
    for (var normalized = null, i = 0; i < keys.length; i++) {
        var key = keys[i], v = row[key];
        if (v != null && String(v).trim() !== "")
            return v;
        normalized || (normalized = {}, Object.keys(row).forEach(function (k) {
            var nk = AppBackendCore.normalizedKey(k);
            nk && !Object.prototype.hasOwnProperty.call(normalized, nk) && (normalized[nk] = row[k]);
        }));
        var nkey = AppBackendCore.normalizedKey(key);
        if ((v = nkey ? normalized[nkey] : void 0) != null && String(v).trim() !== "")
            return v;
    }
    return defaultValue || "";
}, AppBackendCore.makePickNormalized = function (row, defaultValue) {
    return function (keys) {
        return AppBackendCore.pickNormalized(row, keys, defaultValue || "");
    };
}, AppBackendCore.matrixToObjects = function (matrix, options) {
    if (options = options || {}, (matrix = Array.isArray(matrix) ? matrix : []).length < 2)
        return [];
    var width = 0;
    matrix.forEach(function (r2) {
        width = Math.max(width, Array.isArray(r2) ? r2.length : 0);
    });
    for (var schema = Array.isArray(options.schema) ? options.schema : [], aliases = options.aliases || {}, appAliases = options.appAliases || {}, normalizeKey = _appIsFn_(options.normalizeKey) ? options.normalizeKey : AppBackendCore.normalizedKey, headerResolver = _appIsFn_(options.headerResolver) ? options.headerResolver : null, headers = (matrix[0] || []).slice(0, width).map(function (h, i) {
        var raw = String(h == null ? "" : h).trim(), nk = normalizeKey(raw);
        return headerResolver ? headerResolver(raw, nk, i, aliases, appAliases, schema) : appAliases && (appAliases[raw] || appAliases[nk]) || aliases && (aliases[raw] || aliases[nk]) || raw || schema[i] || "col" + (i + 1);
    }), rows = [], r = 1; r < matrix.length; r++) {
        for (var line = Array.isArray(matrix[r]) ? matrix[r] : [], obj = {
            __rowNumber: r + 1
        }, any = !1, c = 0; c < width; c++) {
            var key = headers[c] || "col" + (c + 1), value = line[c];
            obj[key] = value, value != null && String(value).trim() !== "" && (any = !0);
        }
        if (any) {
            var deleted = String(obj.isDeleted || obj.deleted || obj.deletedAt || obj.ลบ || "").trim().toLowerCase();
            (options.includeDeleted === !0 || deleted !== "true" && deleted !== "1" && deleted !== "deleted" && deleted !== "ลบ") && rows.push(obj);
        }
    }
    return rows;
}, AppBackendCore.location = function (row) {
    return {
        subdistrict: AppBackendCore.pick(row, [
            "ตำบล", "แขวง", "subdistrict", "tambon", "subDistrict"
        ], ""), district: AppBackendCore.pick(row, [
            "อำเภอ", "เขต", "district", "amphoe", "ampur"
        ], ""), province: AppBackendCore.pick(row, [
            "จังหวัด", "province"
        ], "")
    };
}, AppBackendCore.dateText = function (value) {
    if (_appIsFnName_("_appFormatThaiDate_"))
        return _appFormatThaiDate_(value);
    if (_appIsFnName_("_formatThaiDate_"))
        return _formatThaiDate_(value);
    if (value == null || value === "")
        return "";
    try {
        var d = Object.prototype.toString.call(value) === "[object Date]" ? value : new Date(value), dd, mm, yy;
        return !d || isNaN(d.getTime()) ? String(value || "") : ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + (d.getFullYear() + 543);
    }
    catch (_e) {
        return String(value || "");
    }
}, AppBackendCore.daysSince = function (value) {
    var d = _appIsFnName_("_appParseDate_") ? _appParseDate_(value) : null;
    if (!d && _appIsFnName_("_parseThaiDate_") && (d = _parseThaiDate_(value)), !d)
        try {
            d = new Date(value);
        }
        catch (_e) {
            d = null;
        }
    return !d || isNaN(d.getTime()) ? 0 : Math.floor((new Date().getTime() - d.getTime()) / 864e5);
}, AppBackendCore.statusMeta = function (status, startDate) {
    var st = AppBackendCore.text(status), caseStatus = AppBackendCore.isCanonicalCaseStatus(st) ? st : "", done = caseStatus ? AppBackendCore.isTerminalCaseStatus(caseStatus) : st === "รายงานแล้ว" || st === "คืนเงินแล้ว", age = AppBackendCore.daysSince(startDate);
    return {
        status: st, ageDays: age, isDone: done, isOverdue15Days: !done && age > 15, colorClass: done ? "status-green" : !done && age > 15 ? "status-red" : ""
    };
}, AppBackendCore.reportColumns = function () {
    return [
        {
            key: "caseNo", label: "ลำดับเรื่อง"
        }, {
            key: "recNo", label: "เลขรับเรื่อง"
        }, {
            key: "recDateText", label: "วันที่รับเรื่อง"
        }, {
            key: "title", label: "ชื่อเรื่อง"
        }, {
            key: "considerationTitle", label: "ชื่อเรื่องพิจารณา (ถ้ามี)"
        }, {
            key: "petitioners", label: "ผู้เสนอญัตติ/ผู้ร้อง"
        }, {
            key: "status", label: "สถานะ"
        }, {
            key: "actions", label: "จัดการ"
        }
    ];
}, AppBackendCore.isDateLikeText = function (value) {
    var s = AppBackendCore.text(value);
    return /^\d{1,2}[\/\-.]\d{1,2}[\/\-.](?:19|20|25)\d{2}$/.test(s) || /^(?:19|20|25)\d{2}-\d{1,2}-\d{1,2}/.test(s) || /GMT|เวลาอินโดจีน|^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s/i.test(s);
}, AppBackendCore.normalizeCaseSearchDto = function (row, seq) {
    row = row || {};
    function meetingHistoryText_(value) {
        return String(value == null ? "" : value).replace(/[\u200B-\u200D\uFEFF]/g, "").split(/\r?\n/).map(function (line) {
            return String(line || "").replace(/[\t]+/g, " ").trim();
        }).filter(Boolean).join(`
`);
    }
    var pick = AppBackendCore.pick, caseNo = AppBackendCore.text(pick(row, [
        "caseNo", "caseNum", "runningNo", "orderNo", "ลำดับเรื่อง", "ลำดับ"
    ], "")), recNo = AppBackendCore.text(pick(row, [
        "recNo", "receiveNo", "เลขรับเรื่อง", "เลขที่รับเรื่อง", "ทะเบียนรับ"
    ], "")), recRaw = pick(row, [
        "recDate", "recDateText", "receiveDate", "receivedDate", "dateReceived", "receiveDateText", "receivedDateText", "วันที่รับเรื่อง", "วันรับเรื่อง"
    ], ""), recDateText = AppBackendCore.dateText(recRaw);
    AppBackendCore.isDateLikeText(recNo) && (recNo = "");
    var title = AppBackendCore.text(pick(row, [
        "title", "subject", "caseTitleDisplay", "ชื่อเรื่อง", "เรื่อง", "เรื่องร้องเรียน"
    ], "")), consideration = AppBackendCore.text(pick(row, [
        "considerationTitle", "caseConsiderationTitle", "caseTitle", "ชื่อเรื่องพิจารณา (ถ้ามี)", "ชื่อเรื่องพิจารณา", "เรื่องพิจารณา"
    ], "")), petitioners = AppBackendCore.text(pick(row, [
        "petitioners", "petitionerName", "petitioner", "requester", "complainant", "proposer", "motionProposer", "ผู้เสนอญัตติ/ผู้ร้อง", "ผู้เสนอญัตติ", "ผู้ร้อง"
    ], "")), respondent = AppBackendCore.text(pick(row, [
        "respondent", "agencyName", "accusedAgency", "accused", "agency", "หน่วยงาน / ผู้ถูกร้อง", "หน่วยงาน/ผู้ถูกร้อง", "ผู้ถูกร้อง", "หน่วยงาน"
    ], "")), status = AppBackendCore.text(pick(row, [
        "status", "caseStatus", "processStatus", "currentStatus", "สถานะ", "สถานะเรื่อง", "สถานะปัจจุบัน"
    ], "")), statusRaw = status;
    AppBackendCore.isDateLikeText(status) && (status = ""), status = AppBackendCore.normalizeCaseStatus(status, {
        defaultStatus: "เรื่องเข้าใหม่"
    });
    var loc = AppBackendCore.location(row), coOwners = AppBackendCore.text(pick(row, [
        "coOwners", "coAssignees", "ผู้ร่วมรับผิดชอบ", "ผู้รับผิดชอบร่วม"
    ], "")), offerDateRaw = pick(row, [
        "offerDate", "offerDateText", "bookDate", "letterDate", "documentDate", "dateProposed", "proposalDate", "proposeDate", "submittedDate", "submitDate", "วันที่หนังสือ", "วันที่เสนอ", "วันที่เสนอเรื่อง", "วันที่ยื่น", "วันที่ยื่นเรื่อง"
    ], ""), petitionerPhone = AppBackendCore.text(pick(row, [
        "petitionerPhone", "petitionerTel", "petitionerTelephone", "petitionerMobile", "petitionerContactPhone", "proposerPhone", "proposerTel", "proposerTelephone", "proposerMobile", "requesterPhone", "complainantPhone", "phone", "tel", "mobile", "telephone", "เบอร์โทรศัพท์ผู้เสนอญัตติ/ผู้ร้อง", "เบอร์โทรผู้เสนอญัตติ/ผู้ร้อง", "โทรศัพท์ผู้เสนอญัตติ/ผู้ร้อง", "เบอร์โทรศัพท์ผู้ร้อง", "เบอร์โทรศัพท์", "เบอร์โทร", "โทรศัพท์"
    ], "")), closedReason = AppBackendCore.text(pick(row, [
        "closedReason", "closeReason", "terminateReason", "stopReason", "endReason", "caseCloseReason", "caseEndReason", "statusReason", "decisionReason", "reason", "remark", "note", "เหตุผล", "เหตุผลยุติเรื่อง", "เหตุผลการยุติเรื่อง", "หมายเหตุ"
    ], "")), rejectionReason = AppBackendCore.text(pick(row, [
        "rejectionReason", "rejectReason", "notAcceptedReason", "notReceiveReason", "notAcceptReason", "caseRejectReason", "statusReason", "decisionReason", "reason", "remark", "note", "เหตุผล", "เหตุผล (ไม่รับเรื่อง)", "เหตุผลไม่รับเรื่อง", "เหตุผลการไม่รับเรื่อง", "หมายเหตุ"
    ], "")), remark = AppBackendCore.text(pick(row, [
        "remark", "note", "หมายเหตุ"
    ], "")), keySummary = AppBackendCore.text(pick(row, [
        "keySummary", "summary", "description", "สรุปสาระสำคัญ"
    ], "")), committeeHistory = meetingHistoryText_(pick(row, [
        "committeeHistory", "committeeMeeting", "committeeMeetings", "committeeMeetingHistory", "meetingCommitteeHistory", "คณะกรรมาธิการ"
    ], "")), subcommitteeHistory = meetingHistoryText_(pick(row, [
        "subcommitteeHistory", "subcommitteeMeeting", "subcommitteeMeetings", "subcommitteeMeetingHistory", "meetingSubcommitteeHistory", "คณะอนุกรรมาธิการ"
    ], "")), out = {
        id: AppBackendCore.text(pick(row, [
            "id", "caseId", "รหัส"
        ], "")), caseId: AppBackendCore.text(pick(row, [
            "caseId", "id", "รหัส"
        ], "")), seq: seq || row.seq || "", caseNo, caseNum: caseNo, runningNo: caseNo, recNo, receiveNo: recNo, recDate: recDateText, recDateText, receiveDate: recDateText, receiveDateText: recDateText, offerDate: AppBackendCore.dateText(offerDateRaw), offerDateText: AppBackendCore.dateText(offerDateRaw), letterDate: AppBackendCore.dateText(offerDateRaw), documentDate: AppBackendCore.dateText(offerDateRaw), title, subject: title, considerationTitle: consideration, caseTitle: consideration, petitioners, petitionerName: petitioners, fullName: petitioners, petitionerPhone, phone: petitionerPhone, tel: petitionerPhone, respondent, agency: respondent, agencyName: respondent, status: status || "เรื่องเข้าใหม่", statusRaw, cat: AppBackendCore.text(pick(row, [
            "cat", "caseType", "ประเภทเรื่อง", "ประเภท"
        ], "")), subCat: AppBackendCore.text(pick(row, [
            "subCat", "issue", "ประเด็นพิจารณา", "ประเด็น"
        ], "")), assignees: AppBackendCore.text(pick(row, [
            "assignees", "owner", "กมธ.รับผิดชอบ", "กรรมาธิการรับผิดชอบ"
        ], "")), coAssignees: coOwners, coOwners, opStaff: AppBackendCore.text(pick(row, [
            "opStaff", "staffs", "เจ้าหน้าที่ฝ่ายเลขานุการ", "เจ้าหน้าที่ฝ่ายปฏิบัติการ"
        ], "")), committeeHistory, committeeMeeting: committeeHistory, subcommitteeHistory, subcommitteeMeeting: subcommitteeHistory, closedReason, rejectionReason, reason: closedReason || rejectionReason || remark, remark, note: remark, keySummary, type: "case", typeLabel: "เรื่องพิจารณา", subdistrict: loc.subdistrict, district: loc.district, province: loc.province
    };
    return out.ลำดับเรื่อง = out.caseNo, out.เลขรับเรื่อง = out.recNo, out.วันที่รับเรื่อง = out.recDateText, out.ชื่อเรื่อง = out.title, out["ชื่อเรื่องพิจารณา (ถ้ามี)"] = out.considerationTitle, out["ผู้เสนอญัตติ/ผู้ร้อง"] = out.petitioners, out.ผู้ถูกร้อง = out.respondent, out.หน่วยงาน = out.agencyName, out.คณะกรรมาธิการ = out.committeeHistory, out.คณะอนุกรรมาธิการ = out.subcommitteeHistory, out.สถานะ = out.status, out.statusMeta = AppBackendCore.statusMeta(out.status, out.recDateText), out.reportColumns = {
        caseNo: out.caseNo, recNo: out.recNo, recDateText: out.recDateText, title: out.title, considerationTitle: out.considerationTitle, committeeHistory: out.committeeHistory, subcommitteeHistory: out.subcommitteeHistory, petitioners: out.petitioners, status: out.status
    }, out;
}, AppBackendCore.normalizeCaseSearchResponse = function (res) {
    res = res || {};
    for (var rows = Array.isArray(res.rows) ? res.rows : Array.isArray(res.data) ? res.data : [], i = 0; i < rows.length; i++)
        rows[i] = AppBackendCore.normalizeCaseSearchDto(rows[i], rows[i] && rows[i].seq || i + 1);
    return res.rows = rows, res.data = rows, res.items = rows, res.columns = AppBackendCore.reportColumns(), res.dto = "case-search-flat-main-data-current", res.owner = res.owner || "CaseDomain.searchCases", res.sourceOfTruth = "MainData", res;
};
var AppRepository = __APP_GLOBAL__.AppRepository = __APP_GLOBAL__.AppRepository || {};
AppRepository.bootstrapOwner = "Code_00_PlatformCore:repository-shell-only";
AppDomain.Config = AppDomain.Config || {}, AppDomain.Config.getSpreadsheetId = AppDomain.Config.getSpreadsheetId || function () {
    return _getSpreadsheetId_();
};
var APP_RELEASE = APP_DEPLOY_RELEASE;

var APP_ERROR_TAXONOMY_CURRENT = Object.freeze({
    stamp: "error-taxonomy-p4-2026-07-26",
    owner: "Code_00_PlatformCore.ErrorPolicyCurrent",
    categories: Object.freeze(["IGNORED_EXPECTED", "USER_RECOVERABLE", "AUTH_SECURITY", "DATA_CONTRACT", "TRANSIENT_RETRYABLE", "FATAL_RUNTIME"]),
    noPayloadLogging: !0,
    noCredentialLogging: !0,
    maxTopicLength: 120,
    maxMessageLength: 240
});
function _appErrorCategory_(value, fallback) {
    var key = String(value || fallback || "FATAL_RUNTIME").trim().toUpperCase();
    return APP_ERROR_TAXONOMY_CURRENT.categories.indexOf(key) >= 0 ? key : "FATAL_RUNTIME";
}
function _appErrorSafeText_(value, maxLen) {
    var text = String(value == null ? "" : value).replace(/[\r\n\t]+/g, " ").replace(/((?:token|password|csrf|authorization))\s*[:=]\s*[^ ]+/ig, "$1=[REDACTED]").trim();
    return text.slice(0, Math.max(1, Number(maxLen || 120)));
}
function _appRecordErrorPolicy_(category, topic, error, detail) {
    var item = {
        category: _appErrorCategory_(category),
        topic: _appErrorSafeText_(topic || "app.error", APP_ERROR_TAXONOMY_CURRENT.maxTopicLength),
        errorName: _appErrorSafeText_(error && error.name || "Error", 60),
        message: _appErrorSafeText_(error && error.message || error || "", APP_ERROR_TAXONOMY_CURRENT.maxMessageLength),
        detailKeys: detail && typeof detail === "object" ? Object.keys(detail).slice(0, 12) : [],
        at: new Date().toISOString()
    };
    try {
        if (item.category !== "IGNORED_EXPECTED" && typeof console !== "undefined" && console.warn) console.warn("[" + item.category + "] " + item.topic, item.errorName + ": " + item.message);
    } catch (_logErr) { void _logErr; }
    return item;
}
function _appIgnoreExpected_(topic, error, detail) {
    return _appRecordErrorPolicy_("IGNORED_EXPECTED", topic, error, detail);
}

function _appRelease_() {
    return APP_RELEASE;
}
function _appReleaseCapability_(name) {
    var release = _appRelease_(), capabilities = release && release.capabilities || {};
    return capabilities[String(name || "")] === !0;
}
function _appSharedPad2_(value) {
    return ((value = Number(value) || 0) < 10 ? "0" : "") + String(value);
}
function _appPhoneForDisplay_(value) {
    var raw = String(value == null ? "" : value).replace(/^'+/, "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
    if (!raw)
        return "";
    var digits = raw.replace(/[^0-9]/g, "");
    return /^660[689]\d{8}$/.test(digits) ? digits.slice(2) : /^66[689]\d{8}$/.test(digits) ? "0" + digits.slice(2) : /^[689]\d{8}$/.test(digits) || /^2\d{7}$/.test(digits) ? "0" + digits : /^0\d{7,9}$/.test(digits) ? digits : /^0?\d{8,10}$/.test(digits) && raw === digits ? digits.charAt(0) === "0" ? digits : "0" + digits : raw;
}
function _appPhoneForSheet_(value) {
    var raw = _appPhoneForDisplay_(value);
    return raw ? /^0\d{6,}$/.test(raw) ? "'" + raw : raw : "";
}
function _appNormalizeThaiYear_(value) {
    var y = Number(String(value == null ? "" : value).replace(/[^0-9]/g, "")) || 0;
    return y ? y >= 3600 && y <= 3700 ? y - 1086 : y >= 3000 && y <= 3200 ? y - 543 : y < 2400 ? y + 543 : y : 0;
}
function _appSafeThaiDateText_(day, month, year) {
    day = Number(day);
    month = Number(month);
    year = _appNormalizeThaiYear_(year);
    return day >= 1 && day <= 31 && month >= 1 && month <= 12 && year ? _appSharedPad2_(day) + "/" + _appSharedPad2_(month) + "/" + String(year) : "";
}
function _appFormatThaiDateObject_(value, timeZone) {
    if (!value || Object.prototype.toString.call(value) !== "[object Date]" || isNaN(value.getTime()))
        return "";
    var tz = String(timeZone || "");
    if (!tz)
        try {
            tz = Session.getScriptTimeZone();
        }
        catch (_tzErr) {
            _appIgnore_(_tzErr, "date.timezone");
        }
    tz = tz || "Asia/Bangkok";
    try {
        if (typeof Utilities != "undefined" && Utilities.formatDate)
            return _appSafeThaiDateText_(Utilities.formatDate(value, tz, "dd"), Utilities.formatDate(value, tz, "MM"), Utilities.formatDate(value, tz, "yyyy"));
    }
    catch (_formatErr) {
        _appIgnore_(_formatErr, "date.format");
    }
    return _appSafeThaiDateText_(value.getDate(), value.getMonth() + 1, value.getFullYear());
}
function _appCanonicalThaiDateText_(value, options) {
    options = options || {};
    if (value == null)
        return "";
    if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime()))
        return _appFormatThaiDateObject_(value, options.timeZone);
    if (typeof value == "number" && isFinite(value) && value > 20000 && value < 90000)
        return _appFormatThaiDateObject_(new Date(Math.round(864e5 * (value - 25569))), options.timeZone);
    var raw = String(value == null ? "" : value).replace(/^'+/, "").replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "").trim();
    if (!raw)
        return "";
    if (options.rejectIdentifierLike !== !1 && (/^(?:CASE|MAIN|ROW)[_-]/i.test(raw) || /^\d+\s*\/\s*25\d{2}$/.test(raw) || raw === "-" || raw === "/"))
        return "";
    var dmy = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.]((?:19|20|25|30|31|36)\d{2})$/);
    if (dmy)
        return _appSafeThaiDateText_(dmy[1], dmy[2], dmy[3]);
    var iso = raw.match(/^((?:19|20|25|30|31|36)\d{2})[-\/](\d{1,2})[-\/](\d{1,2})(?:[T\s].*)?$/);
    if (iso)
        return _appSafeThaiDateText_(iso[3], iso[2], iso[1]);
    if (/GMT|เวลาอินโดจีน|T\d{2}:\d{2}:\d{2}/i.test(raw)) {
        var parsed = new Date(raw.replace(/\s*\(.*?\)\s*/g, " ").replace(/เวลาอินโดจีน/g, ""));
        if (!isNaN(parsed.getTime()))
            return _appFormatThaiDateObject_(parsed, options.timeZone);
    }
    if (typeof options.fallback === "function")
        try {
            var converted = String(options.fallback(raw) || "").trim(), parts = converted.match(/^(\d{1,2})\/(\d{1,2})\/((?:19|20|25|30|31|36)\d{2})$/);
            if (parts)
                return _appSafeThaiDateText_(parts[1], parts[2], parts[3]);
        }
        catch (_fallbackErr) {
            _appIgnore_(_fallbackErr, "date.fallback");
        }
    return options.preserveUnknown === !0 ? raw : "";
}
function _appThaiDateText_(value) {
    return _appCanonicalThaiDateText_(value, {
        rejectIdentifierLike: !1, preserveUnknown: !0
    });
}
function getDeploymentProfile_(payload) {
    var env;
    return payload = payload || {}, {
        environment: String(payload.environment || _scriptProp_("APP_ENVIRONMENT", APP_RELEASE.channel || "production") || "production").toLowerCase(), channel: APP_RELEASE.channel, stamp: APP_RELEASE.stamp, assetStamp: APP_RELEASE.assetStamp, generatedAt: new Date().toISOString()
    };
}
function getRuntimeOperationalPolicy_() {
    return {
        contract: "policy-current"
    };
}
function _getRuntimeConfigBundle_() {
    return {
        release: APP_RELEASE, deployment: getDeploymentProfile_({}), policy: getRuntimeOperationalPolicy_()
    };
}
function getProductionContractSpec_() {
    return {
        stamp: "contract-current", generatedAt: new Date().toISOString()
    };
}
function _performanceBudgets_() {
    return {
        maxResponseBytesDefault: 7e5, maxRowsReadDefault: 2500, maxDurationMsDefault: 25e3, maxInitialPayloadBytes: 5e5
    };
}
function _estimateJsonBytes_(value) {
    try {
        return Utilities.newBlob(JSON.stringify(value == null ? null : value)).getBytes().length;
    }
    catch (_e) {
        _recordWarning_("ec", _e);
        try {
            return JSON.stringify(value || "").length;
        }
        catch (_e2) {
            return 0;
        }
    }
}
function _noteResponseBudget_(method, response) {
    try {
        return {
            method: String(method || ""), bytes: _estimateJsonBytes_(response), budgets: _performanceBudgets_()
        };
    }
    catch (_e) {
        return _recordWarning_("responseBudget.note", _e, {
            method
        }), null;
    }
}
var __APP_EXEC_CACHE__ = __APP_GLOBAL__.__APP_EXEC_CACHE__ = __APP_GLOBAL__.__APP_EXEC_CACHE__ || {}, __APP_ACTIVE_EXECUTION_GUARD__ = __APP_GLOBAL__.__APP_ACTIVE_EXECUTION_GUARD__ || null, __APP_EXECUTION_GUARD_STAMP__ = __APP_GLOBAL__.__APP_EXECUTION_GUARD_STAMP__ || "deadline-guard-zero-debt-current";
function createExecutionGuard_(options) {
    options = options || {};
    var startedAt = Date.now(), maxMs = Math.max(1e3, Number(options.maxMs || 33e4)), warningMs = Math.max(0, Math.min(maxMs, Number(options.warningMs || Math.floor(.85 * maxMs)))), checks = [];
    function elapsedMs() {
        return Date.now() - startedAt;
    }
    function timeLeftMs() {
        return Math.max(0, maxMs - elapsedMs());
    }
    function check(stage, detail) {
        var snapshot = {
            stage: String(stage || "check"), elapsedMs: elapsedMs(), timeLeftMs: timeLeftMs(), detail: detail || null
        };
        if (checks.push(snapshot), warningMs && snapshot.elapsedMs >= warningMs && _appIsFnName_("_recordWarning_") && _recordWarning_("r5.1.executionGuard.warning", new Error("execution guard warning"), {
            stage: snapshot.stage, elapsedMs: snapshot.elapsedMs, label: String(options.label || options.route || "")
        }), snapshot.elapsedMs >= maxMs)
            throw new Error("Execution deadline reached: " + snapshot.stage);
        return snapshot;
    }
    return {
        stamp: __APP_EXECUTION_GUARD_STAMP__, label: String(options.label || options.route || "execution"), startedAt, maxMs, warningMs, elapsedMs, timeLeftMs, isNearDeadline: function () {
            return elapsedMs() >= warningMs;
        }, shouldStop: function () {
            return elapsedMs() >= maxMs;
        }, check, throwIfNearDeadline: check, snapshot: function () {
            return {
                stamp: __APP_EXECUTION_GUARD_STAMP__, label: String(options.label || options.route || "execution"), startedAt, elapsedMs: elapsedMs(), timeLeftMs: timeLeftMs(), maxMs, checks: checks.slice(-20)
            };
        }
    };
}
function _setActiveExecutionGuard_(guard) {
    var previous = __APP_GLOBAL__.__APP_ACTIVE_EXECUTION_GUARD__ || null;
    return __APP_GLOBAL__.__APP_ACTIVE_EXECUTION_GUARD__ = guard || null, __APP_ACTIVE_EXECUTION_GUARD__ = guard || null, previous;
}
function _structuredLogEnvelope_(level, label, detail) {
    var now = new Date, raw = detail && typeof detail == "object" ? detail : {
        value: detail == null ? null : String(detail)
    }, safeDetail = null;
    try {
        safeDetail = _appIsFnName_("_redactSecurityAuditValue_") ? _redactSecurityAuditValue_(raw) : raw;
    }
    catch (_redactLogErr) {
        safeDetail = {
            redactionFailed: !0, message: String(_redactLogErr && _redactLogErr.message || _redactLogErr).slice(0, 240)
        };
    }
    var requestId = String(raw.requestId || raw.reqId || raw.correlationId || ""), durationValue = Number(raw.durationMs);
    return {
        schemaVersion: "commission.log.v1", timestamp: now.toISOString(), severity: String(level || "info").toUpperCase(), event: String(label || "app"), eventId: "evt_" + now.getTime() + "_" + Math.floor(1e6 * Math.random()), component: String(raw.component || raw.owner || String(label || "app").split(".")[0] || "app"), requestId, correlationId: String(raw.correlationId || requestId || ""), method: String(raw.method || ""), errorCode: String(raw.errorCode || raw.code || ""), durationMs: isFinite(durationValue) ? durationValue : null, detail: safeDetail
    };
}
function _serverLog_(level, label, detail) {
    level = String(level || "info").toLowerCase(), label = String(label || "app").trim() || "app";
    try {
        var payload = _structuredLogEnvelope_(level, label, detail), line = JSON.stringify(payload), consoleMethod = level === "error" ? "error" : level === "warn" ? "warn" : "log";
        typeof console != "undefined" && console && typeof console[consoleMethod] == "function" ? console[consoleMethod](line) : Logger.log("%s", line);
    }
    catch (_logErr) {
        try {
            Logger.log("[" + level.toUpperCase() + "] " + label + " " + String(_logErr && _logErr.message || _logErr));
        }
        catch (_ignoreLogErr) {
            _appIgnore_(_ignoreLogErr, "c.s");
        }
    }
    return !1;
}
function _logWarn_(label, detail) {
    return _serverLog_("warn", label, detail);
}
function _safeErrorSummary_(error, detail) {
    var message = "", name = "", stack = "";
    try {
        message = String(error && error.message || error || ""), name = String(error && error.name || ""), stack = String(error && error.stack || "").split(`
`).slice(0, 3).join(" | ");
    }
    catch (_summaryErr) {
        message = "unknown error";
    }
    var safeDetail = null;
    try {
        safeDetail = detail == null ? null : JSON.parse(JSON.stringify(detail, function (key, value) {
            return /token|password|csrf|secret|authorization|cookie/i.test(String(key || "")) ? "[REDACTED]" : typeof value == "string" && value.length > 320 ? value.slice(0, 320) + "\u2026" : value;
        }));
    }
    catch (_detailErr) {
        try {
            safeDetail = String(detail || "").slice(0, 320);
        }
        catch (_defaultDetailErr) {
            safeDetail = null;
        }
    }
    return {
        error: message.slice(0, 500), name: name.slice(0, 120), stack: stack.slice(0, 900), detail: safeDetail
    };
}
function _traceEnsureRequestMetrics_() {
    try {
        return __APP_REQUEST_SCOPE_METRICS__ !== void 0 && __APP_REQUEST_SCOPE_METRICS__ ? (__APP_REQUEST_SCOPE_METRICS__.warnings = Number(__APP_REQUEST_SCOPE_METRICS__.warnings || 0), __APP_REQUEST_SCOPE_METRICS__.errors = Number(__APP_REQUEST_SCOPE_METRICS__.errors || 0), __APP_REQUEST_SCOPE_METRICS__.warnLabels = __APP_REQUEST_SCOPE_METRICS__.warnLabels || {}, __APP_REQUEST_SCOPE_METRICS__.errorLabels = __APP_REQUEST_SCOPE_METRICS__.errorLabels || {}, __APP_REQUEST_SCOPE_METRICS__) : null;
    }
    catch (_traceMetricsErr) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("observed.catch", _traceMetricsErr, {
            file: "C00"
        }), null;
    }
}
function _traceMetricLabelBump_(kind, label) {
    try {
        var m = _traceEnsureRequestMetrics_();
        if (!m)
            return !1;
        var bucket = kind === "error" ? "errorLabels" : "warnLabels";
        return m[bucket] = m[bucket] || {}, label = String(label || kind || "event").slice(0, 120), m[bucket][label] = Number(m[bucket][label] || 0) + 1, kind === "error" ? m.errors = Number(m.errors || 0) + 1 : m.warnings = Number(m.warnings || 0) + 1, !0;
    }
    catch (_traceBumpErr) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("observed.catch", _traceBumpErr, {
            file: "C00"
        }), !1;
    }
}
function _traceNoteWarning_(label) {
    return _traceMetricLabelBump_("warn", label);
}
function _traceNoteError_(label) {
    return _traceMetricLabelBump_("error", label);
}
function _traceObservabilityConfig_() {
    function flag(name, defaultValue) {
        try {
            var v = _appIsFnName_("_scriptProp_") ? String(_scriptProp_(name, defaultValue ? "Y" : "N") || "") : "";
            return (v = String(v || "").trim().toUpperCase()) === "Y" || v === "YES" || v === "TRUE" || v === "1" || v === "ON";
        }
        catch (_flagErr) {
            return !!defaultValue;
        }
    }
    var num = __Code_00_PlatformCore_num;
    function __Code_00_PlatformCore_num(name, defaultValue) {
        try {
            var v = _appIsFnName_("_scriptProp_") ? Number(_scriptProp_(name, defaultValue)) : Number(defaultValue);
            return isFinite(v) ? v : Number(defaultValue);
        }
        catch (_numErr) {
            return Number(defaultValue);
        }
    }
    return {
        stamp: "observability-current", logAll: flag("OBSERVABILITY_LOG_ALL", !1), logStart: flag("OBSERVABILITY_LOG_START", !1), slowMs: num("OBSERVABILITY_SLOW_MS", 800), heavyRows: num("OBSERVABILITY_HEAVY_ROWS", 500), warningThreshold: num("OBSERVABILITY_WARNING_THRESHOLD", 1), maxPayloadPreviewBytes: num("OBSERVABILITY_MAX_PREVIEW_BYTES", 900), sampleApiPerf: flag("API_PERF_SAMPLE_ENABLED", !0)
    };
}
function _traceSanitizeValue_(value, depth) {
    if ((depth = Number(depth || 0)) > 3)
        return "[MAX_DEPTH]";
    if (value == null)
        return value;
    if (typeof value == "string")
        return value.length > 260 ? value.slice(0, 260) + "\u2026" : value;
    if (typeof value == "number" || typeof value == "boolean")
        return value;
    if (value instanceof Date)
        return value.toISOString();
    if (Array.isArray(value))
        return value.slice(0, 8).map(function (item) {
            return _traceSanitizeValue_(item, depth + 1);
        });
    if (typeof value == "object") {
        var out = {};
        return Object.keys(value).slice(0, 30).forEach(function (k) {
            if (/token|password|csrf|secret|authorization|cookie|hash/i.test(String(k || "")))
                return out[k] = "[REDACTED]", void 0;
            out[k] = _traceSanitizeValue_(value[k], depth + 1);
        }), out;
    }
    return String(value);
}
function _traceLog_(level, label, detail) {
    try {
        return _serverLog_(level || "info", label || "observability.core", _traceSanitizeValue_(detail || {}, 0));
    }
    catch (_traceLogErr) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("observed.catch", _traceLogErr, {
            file: "C00"
        }), !1;
    }
}
function _routeTraceStart_(ctx) {
    try {
        ctx = ctx || {};
        var cfg = _traceObservabilityConfig_();
        return ctx.traceState = {
            stamp: cfg.stamp, startedAt: Date.now(), method: String(ctx.method || ""), requestId: String(ctx.requestId || ""), group: String(ctx.routeMeta && (ctx.routeMeta.group || ctx.routeMeta.domain) || "general")
        }, cfg.logStart && _traceLog_("info", "observability.api.start", {
            method: ctx.traceState.method, requestId: ctx.traceState.requestId, group: ctx.traceState.group, at: new Date().toISOString()
        }), ctx.traceState;
    }
    catch (_traceStartErr) {
        return _traceNoteWarning_("observability.trace.start.failed"), null;
    }
}
function _routeTraceEnd_(ctx, normalized, status) {
    try {
        ctx = ctx || {}, normalized = normalized && typeof normalized == "object" ? normalized : {};
        var cfg = _traceObservabilityConfig_(), metrics = typeof getRequestScopeMetrics_ == "function" ? getRequestScopeMetrics_() : {}, perf = normalized.perf || {}, durationMs = Number(normalized.latencyMs || perf.durationMs || Date.now() - Number(ctx.startedAt || Date.now())), rowsRead = Number(perf.rowsRead || metrics.rowsRead || 0), warningCount = Number(metrics.warnings || 0), errorCount = Number(metrics.errors || 0), ok = normalized.ok !== !1 && !normalized.errorCode, sample = {
            stamp: cfg.stamp, status: String(status || (ok ? "ok" : "error")), method: String(ctx.method || normalized.method || ""), requestId: String(ctx.requestId || normalized.requestId || ""), group: String(ctx.routeMeta && (ctx.routeMeta.group || ctx.routeMeta.domain) || perf.group || "general"), ok: !!ok, durationMs, rowsRead, payloadBytes: Number(perf.payloadBytes || 0), performanceGateStatus: String(perf.gate && perf.gate.status || normalized.performanceGateStatus || "not-profiled"), cacheHit: !(!perf.cacheHit && !metrics.cacheHit), cacheHits: Number(perf.cacheHits || metrics.cacheHits || 0), cacheMisses: Number(perf.cacheMisses || metrics.cacheMisses || 0), source: String(perf.source || normalized.cacheSource || normalized.source || "apiRouter"), degraded: !(!perf.degraded && !normalized.degraded), warningCount, errorCount, errorCode: String(normalized.errorCode || ""), warnLabels: _traceSanitizeValue_(metrics.warnLabels || {}, 0), errorLabels: _traceSanitizeValue_(metrics.errorLabels || {}, 0), sheetsRead: _traceSanitizeValue_(metrics.sheetsRead || {}, 0), at: new Date().toISOString()
        }, targetMs = _appIsFnName_("_appPerformanceTargetMs_") ? _appPerformanceTargetMs_(sample.method) : 0;
        targetMs && (sample.targetMs = targetMs, sample.overTarget = durationMs >= targetMs, sample.note = sample.overTarget ? "over-target" : "within-target");
        var shouldLog = cfg.logAll || !sample.ok || durationMs >= cfg.slowMs || rowsRead >= cfg.heavyRows || warningCount >= cfg.warningThreshold || errorCount > 0 || targetMs && durationMs >= targetMs;
        return shouldLog && _traceLog_(sample.ok ? "info" : "error", "observability.api.end", sample), cfg.sampleApiPerf !== !0 || !_appIsFnName_("_recordPerformanceSample_") || sample.ok && !shouldLog || _recordPerformanceSample_(sample), sample;
    }
    catch (_traceEndErr) {
        return _traceNoteWarning_("observability.trace.end.failed"), null;
    }
}
function _recordWarning_(label, error, detail) {
    _traceNoteWarning_(label = String(label || "swallowed.error"));
    try {
        var cache = _appIsFnName_("_execCache_") ? _execCache_() : __APP_GLOBAL__.__APP_EXEC_CACHE__ || {};
        cache.warnThrottle = cache.warnThrottle || {};
        var now = Date.now(), prev = Number(cache.warnThrottle[label] || 0);
        if (cache.warnThrottle[label] = now, prev && now - prev < 15e3)
            return !1;
        var critical = /auth|csrf|token|session|login|logout|write|save|delete|print|router|budget|case|meeting|tracking|AppPrint|AppPageController/i.test(label);
        return _serverLog_(critical ? "error" : "warn", label, Object.assign({
            criticalPath: critical,
            errorClass: _classifyOperationalError_(label, error)
        }, _safeErrorSummary_(error, detail) || {}));
    }
    catch (_recordWarningErr) {
        try {
            Logger.log("[WARN] " + label + " " + String(error && error.message || error || "") + " / recordWarningFailed=" + String(_recordWarningErr && _recordWarningErr.message || _recordWarningErr));
        }
        catch (_ignoreWarnErr) {
            return _appIsFnName_("_recordWarning_") && _recordWarning_("observed.catch", _ignoreWarnErr, {
                file: "C00"
            }), !1;
        }
        return !1;
    }
}
function _logApiFailure_(label, error, detail) {
    _traceNoteError_(label = String(label || "api.failure"));
    try {
        return _serverLog_("error", label, Object.assign({
            errorClass: _classifyOperationalError_(label, error)
        }, _safeErrorSummary_(error, detail) || {}));
    }
    catch (_logApiFailureErr) {
        return _recordWarning_("api.failure.log.failed", _logApiFailureErr, {
            label
        });
    }
}
function _execCache_() {
    return __APP_EXEC_CACHE__ || (__APP_GLOBAL__.__APP_EXEC_CACHE__ = {});
}
function _scriptPropertiesService_() {
    return PropertiesService.getScriptProperties();
}
function _scriptPropertiesSnapshot_(forceRefresh) {
    var cache = _execCache_();
    if (!forceRefresh && cache.scriptPropertiesSnapshot && typeof cache.scriptPropertiesSnapshot == "object")
        return cache.scriptPropertiesSnapshot;
    var props = {};
    try {
        props = _scriptPropertiesService_().getProperties() || {};
    }
    catch (err) {
        _logWarn_("properties.snapshot", {
            error: String(err && err.message || err)
        }), props = {};
    }
    return cache.scriptPropertiesSnapshot = props, cache.scriptPropertiesLoadedAt = Date.now(), props;
}
function _scriptProp_(key, defaultValue) {
    if (!(key = String(key || "").trim()))
        return defaultValue;
    var props = _scriptPropertiesSnapshot_();
    return Object.prototype.hasOwnProperty.call(props, key) ? props[key] : defaultValue;
}
function _productionHotPathFullSheetReadAllowed_(owner) {
    owner = String(owner || "").trim() || "unknown";
    var raw = String(_scriptProp_("ALLOW_HOT_PATH_FULL_SHEET_READ", "N") || "N").trim().toUpperCase(), allowed = raw === "Y" || raw === "YES" || raw === "TRUE" || raw === "1" || raw === "ON";
    if (!allowed)
        try {
            _logWarn_("production.hotPath.fullSheetRead.blocked", {
                owner, property: "ALLOW_HOT_PATH_FULL_SHEET_READ", expected: "Y only for emergency migration read"
            });
        }
        catch (_e) {
            _appIgnore_(_e, "c.s");
        }
    return allowed;
}
function _scriptPropertiesGovernancePolicy_() {
    var mode = String(_scriptProp_("SCRIPT_PROPERTIES_WRITE_MODE", "READ_ONLY") || "READ_ONLY").trim().toUpperCase(), allow = String(_scriptProp_("ALLOW_SCRIPT_PROPERTIES_WRITE", _scriptProp_("APP_ALLOW_SCRIPT_PROPERTIES_WRITE", "N")) || "N").trim().toUpperCase(), setupUnlocked = mode === "SETUP_UNLOCKED" || mode === "MIGRATION_UNLOCKED" || mode === "WRITE_UNLOCKED", explicitAllow = allow === "Y" || allow === "YES" || allow === "TRUE" || allow === "1";
    return {
        stamp: "script-properties-read-only-governance-current", mode, readOnly: !(setupUnlocked || explicitAllow), setupUnlocked, explicitAllow, writeOwner: "_setScriptProp_/_setScriptProps_/_deleteScriptProp_", projectSettingsAreSourceOfTruth: !0, runtimeAutoCreateDisabled: !0
    };
}
function _scriptPropertiesReadOnly_() {
    return !!_scriptPropertiesGovernancePolicy_().readOnly;
}
function _scriptPropertiesRuntimeWritesAllowed_() {
    return !_scriptPropertiesReadOnly_();
}
function _scriptPropertyWriteError_(operation, key, context) {
    var ctx = context && typeof context == "object" ? context : {};
    return new Error("Script Properties are read-only in Production Final: " + String(operation || "write") + " " + String(key || "") + ". ตั้งค่าผ่าน Project Settings เท่านั้น หรือเปิด SCRIPT_PROPERTIES_WRITE_MODE=SETUP_UNLOCKED ชั่วคราวเฉพาะช่วง setup. context=" + JSON.stringify(ctx));
}
function _assertScriptPropertiesWriteAllowed_(operation, key, context) {
    if (_scriptPropertiesRuntimeWritesAllowed_())
        return !0;
    throw _scriptPropertyWriteError_(operation, key, context);
}
function _setScriptProp_(key, value, context) {
    if (!(key = String(key || "").trim()))
        return !1;
    _assertScriptPropertiesWriteAllowed_("setProperty", key, context || {}), _scriptPropertiesService_().setProperty(key, String(value == null ? "" : value));
    try {
        _scriptPropertiesSnapshot_(!0);
    }
    catch (_e) {
        _recordWarning_("properties.snapshot.refresh", _e);
    }
    return !0;
}
function _setScriptProps_(values, context) {
    values = values && typeof values == "object" ? values : {};
    var clean = {};
    Object.keys(values).forEach(function (k) {
        var key = String(k || "").trim();
        key && (clean[key] = String(values[k] == null ? "" : values[k]));
    });
    var keys = Object.keys(clean);
    if (!keys.length)
        return !1;
    _assertScriptPropertiesWriteAllowed_("setProperties", keys.join(","), context || {}), _scriptPropertiesService_().setProperties(clean, !1);
    try {
        _scriptPropertiesSnapshot_(!0);
    }
    catch (_e) {
        _recordWarning_("properties.snapshot.refresh", _e);
    }
    return !0;
}
function _deleteScriptProp_(key, context) {
    if (!(key = String(key || "").trim()))
        return !1;
    _assertScriptPropertiesWriteAllowed_("deleteProperty", key, context || {}), _scriptPropertiesService_().deleteProperty(key);
    try {
        _scriptPropertiesSnapshot_(!0);
    }
    catch (_e) {
        _recordWarning_("properties.snapshot.refresh", _e);
    }
    return !0;
}
function _runtimeStateCacheKey_(key) {
    key = String(key || "").trim();
    try {
        return "rt_state_" + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, key, Utilities.Charset.UTF_8)).replace(/=+$/g, "").slice(0, 48);
    }
    catch (_e) {
        return "rt_state_" + key.replace(/[^A-Za-z0-9_\-]/g, "_").slice(0, 80);
    }
}
function _runtimeStateGet_(key, defaultValue) {
    if (!(key = String(key || "").trim()))
        return defaultValue;
    var exec = _execCache_();
    if (exec.runtimeState = exec.runtimeState || {}, Object.prototype.hasOwnProperty.call(exec.runtimeState, key))
        return exec.runtimeState[key];
    try {
        var cache = _appIsFnName_("_AppScriptCache_") ? _AppScriptCache_() : null, raw = cache ? cache.get(_runtimeStateCacheKey_(key)) : null;
        if (raw != null)
            return exec.runtimeState[key] = raw, raw;
    }
    catch (_e) {
        _appIgnore_(_e, "c.s");
    }
    return defaultValue;
}
function _runtimeStateSet_(key, value, ttlSeconds) {
    if (!(key = String(key || "").trim()))
        return !1;
    var raw = String(value == null ? "" : value), exec = _execCache_();
    exec.runtimeState = exec.runtimeState || {}, exec.runtimeState[key] = raw;
    try {
        var cache = _appIsFnName_("_AppScriptCache_") ? _AppScriptCache_() : null;
        cache && cache.put(_runtimeStateCacheKey_(key), raw, Math.max(30, Math.min(Number(ttlSeconds || 21600) || 21600, 21600)));
    }
    catch (_e) {
        _appIgnore_(_e, "c.s");
    }
    return !0;
}
function _hmacSecret_() {
    var secret = String(_scriptProp_("APP_HMAC_SECRET", "") || "").trim(), pepper = String(_scriptProp_("PASSWORD_PEPPER", "") || "").trim();
    if (secret) {
        if (secret.length < 32)
            throw new Error("APP_HMAC_SECRET ต้องมีความยาวอย่างน้อย 32 ตัวอักษร");
        if (pepper && secret === pepper)
            throw new Error("APP_HMAC_SECRET ต้องแยกจาก PASSWORD_PEPPER และห้ามใช้ค่าเดียวกัน");
        return secret;
    }
    var governance = _scriptPropertiesGovernancePolicy_();
    if (!governance || governance.mode !== "SETUP_UNLOCKED")
        throw new Error("APP_HMAC_SECRET ยังไม่ได้ตั้งค่าใน Project Settings; อนุญาตให้สร้างอัตโนมัติเฉพาะเมื่อ SCRIPT_PROPERTIES_WRITE_MODE=SETUP_UNLOCKED เท่านั้น");
    try {
        return _setScriptProp_("APP_HMAC_SECRET", secret = Utilities.base64EncodeWebSafe(Utilities.getUuid() + ":" + Utilities.getUuid() + ":" + Utilities.getUuid() + ":" + Date.now()).replace(/=+$/g, ""), {
            owner: "_hmacSecret_", mode: "setup-unlocked", independentFromPasswordPepper: !0
        }), secret;
    }
    catch (err) {
        throw _recordWarning_("scriptProperties.hmacSecret", err), new Error("APP_HMAC_SECRET unavailable: " + String(err && err.message || err));
    }
}
function _hmacSha256Hex_(message, secret) {
    var bytes;
    return message = String(message == null ? "" : message), (secret = String(secret == null ? "" : secret)) || (secret = _hmacSecret_()), Utilities.computeHmacSha256Signature(message, secret, Utilities.Charset.UTF_8).map(function (b) {
        var v = (b < 0 ? b + 256 : b).toString(16);
        return v.length === 1 ? "0" + v : v;
    }).join("");
}
function _getScriptPropertyNumberCached_(key, defaultValue, ttlMs) {
    key = String(key || "").trim(), ttlMs = Math.max(1e3, Number(ttlMs || 3e5) || 3e5);
    var now = Date.now(), exec = _execCache_();
    if (key) {
        var cache = exec["propnum:" + key];
        if (cache && cache.expiresAt > now && isFinite(cache.value))
            return cache.value;
    }
    var raw = Number(_scriptProp_(key, defaultValue)), value = isFinite(raw) && raw > 0 ? raw : Number(defaultValue || 0) || 0;
    return key && (exec["propnum:" + key] = {
        value, expiresAt: now + ttlMs
    }), value;
}
function _spreadsheetConfigKeys_() {
    return [
        "SPREADSHEET_ID", "MAIN_SPREADSHEET_ID", "MASTER_SPREADSHEET_ID", "DATA_SPREADSHEET_ID", "WORKBOOK_ID", "SHEET_ID", "SPREADSHEET_URL", "MAIN_SPREADSHEET_URL", "WORKBOOK_URL", "SHEET_URL"
    ];
}
function _extractSpreadsheetIdCandidate_(raw) {
    if (!(raw = String(raw || "").trim()))
        return "";
    var match = raw.match(/[-\w]{25,}/);
    return match && match[0] ? String(match[0]).trim() : raw.replace(/^['"]+|['"]+$/g, "").trim();
}
function _isLikelySpreadsheetId_(id) {
    return id = String(id || "").trim(), /^[A-Za-z0-9_-]{25,}$/.test(id);
}
function _maskSpreadsheetCandidate_(value) {
    return (value = String(value || "").trim()) ? value.length <= 12 ? value : value.slice(0, 6) + "\u2026" + value.slice(-6) : "";
}
function _rememberResolvedSpreadsheetId_(id) {
    if (!(id = String(id || "").trim()))
        return "";
    try {
        if (_appIsFnName_("_scriptPropertiesRuntimeWritesAllowed_") && !_scriptPropertiesRuntimeWritesAllowed_())
            return _appIsFnName_("_runtimeStateSet_") && _runtimeStateSet_("SPREADSHEET_ID_RESOLVED_LAST", id, 21600), id;
        _setScriptProp_("SPREADSHEET_ID", id, {
            owner: "_rememberResolvedSpreadsheetId_", mode: "setup-unlocked"
        });
    }
    catch (_e) {
        _recordWarning_("scriptProperties.spreadsheetIdRememberSkipped", _e), _logWarn_("spreadsheet.rememberResolvedId", {
            error: String(_e && _e.message || _e)
        });
    }
    return id;
}
function _resolveSpreadsheetHandle_() {
    if (AppInfra && AppInfra._spreadsheetHandle && AppInfra._spreadsheetHandle.ss && AppInfra._spreadsheetHandle.id)
        return _appIsFnName_("_requestScopeNoteSpreadsheetResolve_") && _requestScopeNoteSpreadsheetResolve_("APP_INFRA_CACHE", !1, !0), AppInfra._spreadsheetHandle;
    var exec = _execCache_();
    if (exec.spreadsheetHandle && exec.spreadsheetHandle.ss && exec.spreadsheetHandle.id)
        return _appIsFnName_("_requestScopeNoteSpreadsheetResolve_") && _requestScopeNoteSpreadsheetResolve_("EXECUTION_CACHE", !1, !0), AppInfra._spreadsheetHandle = exec.spreadsheetHandle, exec.spreadsheetHandle;
    var props = _scriptPropertiesSnapshot_(), keys = _spreadsheetConfigKeys_(), seen = {}, candidates = [], issues = [];
    keys.forEach(function (key) {
        var raw = String(props[key] || "").trim();
        if (raw) {
            var id = _extractSpreadsheetIdCandidate_(raw);
            id && !seen[id] && (seen[id] = !0, candidates.push({
                id, source: key, raw
            }));
        }
    });
    for (var i = 0; i < candidates.length; i++) {
        var candidate = candidates[i];
        if (_isLikelySpreadsheetId_(candidate.id))
            try {
                _appIsFnName_("_requestScopeNoteSpreadsheetResolve_") && _requestScopeNoteSpreadsheetResolve_(candidate.source || "SPREADSHEET_ID", !0, !1);
                var ss = SpreadsheetApp.openById(candidate.id), resolvedId = String(ss.getId() || candidate.id).trim();
                return AppInfra._spreadsheetHandle = exec.spreadsheetHandle = {
                    id: resolvedId, ss, source: candidate.source
                }, candidate.source !== "SPREADSHEET_ID" && _rememberResolvedSpreadsheetId_(resolvedId), AppInfra._spreadsheetHandle;
            }
            catch (openErr) {
                _recordWarning_("ec", openErr), issues.push(candidate.source + "=" + _maskSpreadsheetCandidate_(candidate.id) + " (" + String(openErr && openErr.message || openErr) + ")");
            }
        else
            issues.push(candidate.source + "=" + _maskSpreadsheetCandidate_(candidate.raw || candidate.id) + " (รูปแบบไม่ถูกต้อง)");
    }
    try {
        _appIsFnName_("_requestScopeNoteSpreadsheetResolve_") && _requestScopeNoteSpreadsheetResolve_("ACTIVE_SPREADSHEET", !0, !1);
        var activeSs = SpreadsheetApp.getActiveSpreadsheet ? SpreadsheetApp.getActiveSpreadsheet() : SpreadsheetApp.getActive();
        if (activeSs && activeSs.getId && activeSs.getId()) {
            var activeId = String(activeSs.getId() || "").trim();
            if (activeId)
                return AppInfra._spreadsheetHandle = exec.spreadsheetHandle = {
                    id: activeId, ss: activeSs, source: "ACTIVE_SPREADSHEET"
                }, _rememberResolvedSpreadsheetId_(activeId), AppInfra._spreadsheetHandle;
        }
    }
    catch (activeErr) {
        _recordWarning_("ec", activeErr), issues.push("ACTIVE_SPREADSHEET (" + String(activeErr && activeErr.message || activeErr) + ")");
    }
    throw new Error("ไม่พบ Spreadsheet ที่ใช้งานได้ กรุณาตรวจสอบ Script Properties เช่น SPREADSHEET_ID หรือผูกสคริปต์กับชีตให้ถูกต้อง" + (issues.length ? " | ตรวจพบ: " + issues.join(" ; ") : ""));
}
function _getSpreadsheetId_() {
    return _resolveSpreadsheetHandle_().id;
}
function normalizeDateOutput_(value) {
    return AppDomain.Formatters && AppDomain.Formatters.normalizeDateOutput ? AppDomain.Formatters.normalizeDateOutput(value) : String(value || "");
}
function _getGeminiKey_() {
    return _scriptProp_("GEMINI_API_KEY", "") || "";
}
function _getLineToken_() {
    return _scriptProp_("LINE_TOKEN", "") || "";
}
function _getLineTarget_() {
    var t = _scriptProp_("LINE_TARGET_ID", "");
    return t || "";
}
function _getGeminiModel_() {
    return _validateGeminiModelName_(_scriptProp_("GEMINI_MODEL", "gemini-2.0-flash"));
}
function _allowedGeminiModels_() {
    return {
        "gemini-2.0-flash": !0, "gemini-1.5-flash": !0, "gemini-1.5-pro": !0, "gemini-2.5-flash": !0, "gemini-2.5-pro": !0
    };
}
function _validateGeminiModelName_(model) {
    var value = String(model || "").trim();
    return _allowedGeminiModels_()[value] ? value : (_logWarn_("ai.model.invalid", {
        model: value || "(empty)", default: "gemini-2.0-flash"
    }), "gemini-2.0-flash");
}
var GEMINI_ENDPOINT_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";
function _buildGeminiEndpoint_() {
    return GEMINI_ENDPOINT_BASE + _getGeminiModel_() + ":generateContent?key=";
}
var GEMINI_EMBED_EP = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=";
function _scriptPropBool_(key, defaultValue) {
    var raw = String(_scriptProp_(key, defaultValue ? "true" : "false") || "").trim().toLowerCase();
    return !!/^(1|true|yes|y|on)$/i.test(raw) || !/^(0|false|no|n|off)$/i.test(raw) && !!defaultValue;
}
function _scriptPropNumber_(key, defaultValue, minValue, maxValue) {
    var n = Number(_scriptProp_(key, defaultValue));
    return isFinite(n) || (n = Number(defaultValue || 0)), minValue !== void 0 && (n = Math.max(Number(minValue), n)), maxValue !== void 0 && (n = Math.min(Number(maxValue), n)), n;
}
function _apiPayloadMaxBytes_() {
    return _scriptPropNumber_("API_MAX_PAYLOAD_BYTES", 2097152, 65536, 5242880);
}
function _apiPayloadMaxDepth_() {
    return _scriptPropNumber_("API_MAX_PAYLOAD_DEPTH", 12, 4, 24);
}
function _apiPayloadMaxArrayLength_() {
    return _scriptPropNumber_("API_MAX_ARRAY_LENGTH", 5e3, 100, 5e4);
}
function _apiPayloadMaxStringLength_() {
    return _scriptPropNumber_("API_MAX_STRING_CHARS", 3e5, 1e4, 1e6);
}
function _jsonByteLength_(value) {
    var s = typeof value == "string" ? value : JSON.stringify(value == null ? "" : value);
    return Utilities.newBlob(String(s || "")).getBytes().length;
}
function _redactSecurityAuditValue_(value, depth) {
    if (depth = Number(depth || 0) || 0, value == null)
        return value;
    if (depth > 4)
        return "[depth-limit]";
    if (Array.isArray(value))
        return value.slice(0, 8).map(function (item) {
            return _redactSecurityAuditValue_(item, depth + 1);
        });
    if (typeof value != "object") {
        var text = String(value);
        return /bearer\s+[A-Za-z0-9_\.\-]+/i.test(text) || /^[A-Za-z0-9_\-\.]{48,}$/.test(text) ? "[REDACTED]" : text.length > 220 ? text.slice(0, 220) + "\u2026" : value;
    }
    var out = {};
    return Object.keys(value).slice(0, 40).forEach(function (k) {
        var lk = String(k || "").toLowerCase();
        /token|csrf|password|secret|authorization|cookie|credential|resumehandle/.test(lk) ? out[k] = "[REDACTED]" : out[k] = _redactSecurityAuditValue_(value[k], depth + 1);
    }), out;
}
function _assertApiPayloadEnvelopeSafe_(method, payload, source) {
    method = String(method || "").trim();
    var bytes = _jsonByteLength_(payload == null ? {} : payload);
    if (bytes > _apiPayloadMaxBytes_())
        throw new Error("API payload ใหญ่เกินขนาดที่อนุญาต");
    var maxDepth = _apiPayloadMaxDepth_(), maxArray = _apiPayloadMaxArrayLength_(), maxString = _apiPayloadMaxStringLength_();
    function walk(value, depth, path) {
        if (depth > maxDepth)
            throw new Error("API payload ซ้อนลึกเกินกำหนด: " + path);
        if (typeof value == "string" && value.length > maxString)
            throw new Error("API payload มีข้อความยาวเกินกำหนด: " + path);
        if (value && typeof value == "object")
            if (Array.isArray(value)) {
                if (value.length > maxArray)
                    throw new Error("API payload มีรายการมากเกินกำหนด: " + path);
                for (var i = 0; i < Math.min(value.length, 80); i++)
                    walk(value[i], depth + 1, path + "[" + i + "]");
            }
            else {
                var keys = Object.keys(value);
                if (keys.length > 500)
                    throw new Error("API payload มีจำนวน field มากเกินกำหนด: " + path);
                keys.slice(0, 500).forEach(function (k) {
                    walk(value[k], depth + 1, path ? path + "." + k : k);
                });
            }
    }
    return walk(payload, 0, method || "payload"), {
        ok: !0, bytes, source: String(source || "")
    };
}
function _allowedExternalHosts_() {
    return {
        "generativelanguage.googleapis.com": !0, "api.line.me": !0
    };
}
function _assertTrustedExternalUrl_(url, feature) {
    if (!(url = String(url || "").trim()))
        throw new Error("ไม่พบ external endpoint");
    if (_scriptPropBool_("APP_EXTERNAL_FETCH_ENABLED", !0) !== !0)
        throw new Error("ปิดการเชื่อมต่อ external service ในระบบ");
    var m = url.match(/^https:\/\/([^\/\?#:]+)(?:[\/\?#:]|$)/i), host = m ? String(m[1] || "").toLowerCase() : "";
    if (!host || !_allowedExternalHosts_()[host])
        throw new Error("ไม่อนุญาต external endpoint: " + host);
    try {
        _safeAudit_("security.externalFetch.allowed", {
            feature: String(feature || ""), host
        });
    }
    catch (_auditExternal) {
        _recordWarning_("ec", _auditExternal);
    }
    return !0;
}
function _securityAuditRouteAccess_(eventStage, method, meta, payload, sess, requestId, detail) {
    try {
        meta = meta || {};
        var minRole = String(meta.minRole || "").toLowerCase(), group = String(meta.group || meta.domain || ""), sensitive;
        return !(!meta.write && minRole !== "admin" && !/^admin/.test(group) && group !== "ai" && meta.domain !== "ai") && (_safeAudit_("security.route." + String(eventStage || "event"), {
            method: String(method || ""), requestId: String(requestId || ""), group, write: !!meta.write, admin: minRole === "admin", csrf: !!meta.csrf, actor: String(sess && (sess.username || sess.email || sess.user) || ""), payload: _redactSecurityAuditValue_(payload || {}), detail: _redactSecurityAuditValue_(detail || {})
        }, sess && (sess.username || sess.email || sess.user) || "system"), !0);
    }
    catch (_auditErr) {
        return _recordWarning_("ec", _auditErr), !1;
    }
}
function _securityProductionGateSnapshot_() {
    var pepperConfigured = !1, hmacConfigured = !1, hmacIndependent = !1;
    try {
        var pepper = String(_scriptProp_("PASSWORD_PEPPER", "") || "").trim(), hmac = String(_scriptProp_("APP_HMAC_SECRET", "") || "").trim();
        pepperConfigured = !!pepper, hmacConfigured = hmac.length >= 32, hmacIndependent = hmacConfigured && (!pepper || hmac !== pepper);
    }
    catch (_secretSnapshotErr) {
        pepperConfigured = !1, hmacConfigured = !1, hmacIndependent = !1;
    }
    return {
        stamp: "security-production-gate-current-final-lock", productionGateLock: !0, allowedSecurityProfiles: [
            "production-strict"
        ], payloadGuard: !0, auditRedaction: !0, externalHostAllowlist: Object.keys(_allowedExternalHosts_()), routeContractAudit: !0, aiRoutesRequireCsrf: !0, strictActionTokens: !0, maintenanceToolsDefault: "disabled", passwordPepperConfigured: pepperConfigured, hmacSecretConfigured: hmacConfigured, hmacSecretIndependent: hmacIndependent, hmacPasswordPepperFallback: !1, browserStorage: "deny-sensitive-plus-allowlist-memory-auth"
    };
}
var _ROLE_RANK_ = {
    viewer: 0, staff: 1, admin: 2, administrator: 2
};
function _toErrorText_(value, defaultValue) {
    if (value == null || value === "")
        return String(defaultValue || "เกิดข้อผิดพลาด");
    if (typeof value == "string")
        return value;
    if (value && typeof value == "object") {
        var picked = value.message || value.msg || value.error || value.details;
        if (picked)
            return String(picked);
        try {
            return JSON.stringify(value);
        }
        catch (_e) {
            _recordWarning_("ec", _e);
        }
    }
    return String(value || defaultValue || "เกิดข้อผิดพลาด");
}
function _appPerfCountRows_(value) {
    try {
        if (Array.isArray(value))
            return value.length;
        if (!value || typeof value != "object")
            return 0;
        if (Array.isArray(value.rows))
            return value.rows.length;
        if (Array.isArray(value.data))
            return value.data.length;
        if (Array.isArray(value.items))
            return value.items.length;
        if (Array.isArray(value.records))
            return value.records.length;
        if (value.data && typeof value.data == "object")
            return _appPerfCountRows_(value.data);
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _e) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
            error: String(_e && _e.message || _e)
        });
    }
    return 0;
}
var APP_PERFORMANCE_GATE_CURRENT = Object.freeze({
    stamp: "performance-gate-current-r257", owner: "Code_00_PlatformCore.AppPerformanceGateCurrent", targets: Object.freeze({
        apiGetDashboardBundle: Object.freeze({
            targetMs: 3e3, maxRowsRead: 4e3, maxPayloadBytes: 22e4, cacheOwner: "DashboardDomain", firstPaintCritical: !0
        }), apiSearchCasesLite: Object.freeze({
            targetMs: 5e3, maxRowsRead: 3e3, maxPayloadBytes: 22e4, serverPaged: !0, maxPageSize: 100, compactReadModel: !0
        }), apiGetCaseReportExportRows: Object.freeze({
            targetMs: 15e3, maxRowsRead: 8e3, maxPayloadBytes: 5e6, onDemandOnly: !0, initialLoadAllowed: !1
        }), apiGetPhase4QaGate: Object.freeze({
            targetMs: 8e3, maxRowsRead: 100, maxPayloadBytes: 5e5, onDemandOnly: !0, initialLoadAllowed: !1, noDataMutation: !0
        }), apiGetPhase5ReleaseReadiness: Object.freeze({
            targetMs: 5e3, maxRowsRead: 100, maxPayloadBytes: 65e4, onDemandOnly: !0, initialLoadAllowed: !1, noDataMutation: !0, releaseGate: !0
        }), apiBudgetGetSummary: Object.freeze({
            targetMs: 5e3, maxRowsRead: 5e3, maxPayloadBytes: 35e4
        }), apiBudgetGetTypeSummaryByFY: Object.freeze({
            targetMs: 8e3, maxRowsRead: 7e3, maxPayloadBytes: 85e4
        }), apiGetPeoplePageBundle: Object.freeze({
            targetMs: 8e3, maxRowsRead: 6e3, maxPayloadBytes: 85e4
        }), apiGetCommitteeMeetingSystem: Object.freeze({
            targetMs: 8e3, maxRowsRead: 6e3, maxPayloadBytes: 85e4
        }), apiGetTracking: Object.freeze({
            targetMs: 5e3, maxRowsRead: 4e3, maxPayloadBytes: 7e5
        }), loginDashboardFirstPaint: Object.freeze({
            targetMs: 1500, frontend: !0
        }), printPreview: Object.freeze({
            targetMs: 2e3, frontend: !0
        })
    }), rules: Object.freeze({
        dashboardDomainCacheOnly: !0, boundedTelemetry: !0, noPayloadLogging: !0, uiDomChanged: !1, businessLogicChanged: !1
    })
});
function _appPerformanceProfile_(method) {
    var key = String(method || "");
    return APP_PERFORMANCE_GATE_CURRENT.targets[key] || null;
}
function _appPerformancePayloadBytes_(value) {
    try {
        var text = typeof value == "string" ? value : JSON.stringify(value == null ? null : value);
        return typeof Utilities != "undefined" && Utilities.newBlob ? Utilities.newBlob(String(text || "")).getBytes().length : String(text || "").length;
    }
    catch (_payloadSizeErr) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("performance.payload.size", _payloadSizeErr), 0;
    }
}
function _appPerformanceEvaluate_(method, metrics) {
    metrics = metrics || {};
    var profile = _appPerformanceProfile_(method), durationMs = Math.max(0, Number(metrics.durationMs || 0)), rowsRead = Math.max(0, Number(metrics.rowsRead || 0)), payloadBytes = Math.max(0, Number(metrics.payloadBytes || 0)), violations = [];
    return profile ? (Number(profile.targetMs || 0) > 0 && durationMs > Number(profile.targetMs) && violations.push("DURATION_OVER_TARGET"), Number(profile.maxRowsRead || 0) > 0 && rowsRead > Number(profile.maxRowsRead) && violations.push("ROWS_READ_OVER_BUDGET"), Number(profile.maxPayloadBytes || 0) > 0 && payloadBytes > Number(profile.maxPayloadBytes) && violations.push("PAYLOAD_OVER_BUDGET"), {
        ok: violations.length === 0, status: violations.length ? "over-budget" : "within-budget", method: String(method || ""), stamp: APP_PERFORMANCE_GATE_CURRENT.stamp, targetMs: Number(profile.targetMs || 0), durationMs, maxRowsRead: Number(profile.maxRowsRead || 0), rowsRead, maxPayloadBytes: Number(profile.maxPayloadBytes || 0), payloadBytes, cacheHit: !!metrics.cacheHit, violations
    }) : {
        ok: !0, status: "not-profiled", method: String(method || ""), stamp: APP_PERFORMANCE_GATE_CURRENT.stamp, violations: []
    };
}
function _appPerformanceTargetMs_(method) {
    var profile = _appPerformanceProfile_(method);
    return Number(profile && profile.targetMs || 0);
}
var APP_RELEASE_POLICY_CURRENT = Object.freeze({
    stamp: "release-policy-current-r257", owner: "Code_00_PlatformCore.AppReleasePolicyCurrent", policy: "release-manifest + current-quality-gate + correlated performance/resource/UX evidence + exactly-once refresh + concurrent-write operator gate", requiredRoutes: Object.freeze([
        "apiBootstrap", "apiGetRouteContract", "apiGetPhase1Contract", "apiGetPhase4QaGate", "apiGetPhase5ReleaseReadiness", "apiSearchCasesLite", "apiGetCaseReportOptions", "apiGetCaseReportExportRows", "apiSaveMeetingLog"
    ]), requiredMetadata: Object.freeze([
        "gasDeploymentId", "contractStamp", "cacheBustVersion"
    ]), telemetryClasses: Object.freeze([
        "transport-failure", "route-rejection", "backend-read-failure", "empty-result", "ok-data"
    ]), uiDomChanged: !1, businessLogicChanged: !1, dataMutation: !1
});
function _safeScriptProp_(name, fallback) {
    try {
        return String(_scriptProp_(String(name || ""), fallback || "") || "");
    }
    catch (_releasePropErr) {
        return String(fallback || "");
    }
}
function _releaseManifest_(payload) {
    payload = payload || {};
    var release = null;
    try {
        release = _appIsFnName_("_appRelease_") ? _appRelease_() : null;
    }
    catch (_releaseSnapshotErr) {
        release = null;
    }
    var contractStamp = String(payload.contractStamp || "");
    if (!contractStamp)
        try {
            contractStamp = String(typeof ROUTER_CLEANUP_VERSION != "undefined" && ROUTER_CLEANUP_VERSION || "router-cleanup-current") + "-production-route-contract-current";
        }
        catch (_releaseContractConstErr) {
            contractStamp = "router-cleanup-current-production-route-contract-current";
        }
    var singleSourceStamp = "";
    try {
        singleSourceStamp = _appIsFnName_("_singleSourceContract_") ? String((_singleSourceContract_({
            compact: !0, bootstrapSafe: !0
        }) || {}).stamp || "") : "";
    }
    catch (_releaseSingleSourceErr) {
        singleSourceStamp = "";
    }
    var caseReportIndexStamp = "";
    try {
        caseReportIndexStamp = typeof CASE_REPORT_INDEX_STAMP_CURRENT != "undefined" ? String(CASE_REPORT_INDEX_STAMP_CURRENT || "") : "";
    }
    catch (_releaseCaseReportIndexErr) {
        caseReportIndexStamp = "";
    }
    return {
        ok: !0, stamp: APP_RELEASE_POLICY_CURRENT.stamp, owner: APP_RELEASE_POLICY_CURRENT.owner, gasDeploymentId: String(payload.gasDeploymentId || _safeScriptProp_("GAS_DEPLOYMENT_ID", "") || _safeScriptProp_("DEPLOYMENT_ID", "") || ""), contractStamp, cacheBustVersion: String(payload.cacheBustVersion || _safeScriptProp_("APP_CACHE_BUST_VERSION", "") || release && (release.assetVersion || release.version) || APP_RELEASE_POLICY_CURRENT.stamp), singleSourceContractStamp: singleSourceStamp, caseReportIndexStamp: caseReportIndexStamp, generatedAt: new Date().toISOString(), readOnly: !0, noDataMutation: !0, bootstrapSafe: !0
    };
}
function _releaseQaCheck_(name, ok, detail, severity) {
    return {
        name: String(name || ""), ok: !!ok, severity: String(severity || (ok ? "info" : "error")), detail: detail || {}, at: new Date().toISOString()
    };
}
function _runtimeTelemetryPolicy_() {
    return {
        ok: !0, stamp: APP_RELEASE_POLICY_CURRENT.stamp, owner: APP_RELEASE_POLICY_CURRENT.owner, classes: APP_RELEASE_POLICY_CURRENT.telemetryClasses.slice ? APP_RELEASE_POLICY_CURRENT.telemetryClasses.slice() : [
            "transport-failure", "route-rejection", "backend-read-failure", "empty-result", "ok-data"
        ], boundedRecentEvents: 50, payloadLogging: !1, browserStorage: "localStorage-summary-only", uiDomChanged: !1, businessLogicChanged: !1
    };
}
function _operatorSmokeChecklist_() {
    return [
        {
            id: "smoke.login", title: "เข้าสู่ระบบ", expected: "apiBootstrap ส่ง user, routeContract และ csrfToken"
        }, {
            id: "smoke.search", title: "ค้นหาเรื่องพิจารณา", expected: "apiSearchCasesLite ส่ง rows พร้อม paging ภายในเวลาเป้าหมาย"
        }, {
            id: "smoke.meetingLog.save", title: "บันทึกประวัติการประชุม", expected: "apiSaveMeetingLog ส่ง ok=true และ reload หลัง save ไม่บล็อกผล save"
        }, {
            id: "smoke.report.export", title: "จัดพิมพ์รายงาน", expected: "apiGetCaseReportExportRows includeMeetingHistory=true แสดงคณะกรรมาธิการ/อนุกรรมาธิการ/เหตุผล"
        }, {
            id: "smoke.print.preview", title: "ตัวอย่างก่อนพิมพ์", expected: "เปิด print preview ได้โดยไม่เกิด runtime error"
        }
    ];
}
function _getReleaseReadiness_(payload) {
    payload = payload || {};
    var started = Date.now(), checks = [], routeNames = [], storedClientEvidence = null;
    payload.clientMeasurementEvidence && _appIsFnName_("_productionMeasurementStoreClientEvidence_") && (storedClientEvidence = _productionMeasurementStoreClientEvidence_(payload.clientMeasurementEvidence));
    try {
        _appIsFnName_("_apiRouteRegistry_") && (routeNames = Object.keys(_apiRouteRegistry_() || {}));
    }
    catch (_routeErr) {
        checks.push(_releaseQaCheck_("route.registry.read", !1, { error: String(_routeErr && _routeErr.message || _routeErr) }));
    }
    APP_RELEASE_POLICY_CURRENT.requiredRoutes.forEach(function (route) {
        checks.push(_releaseQaCheck_("route.registered." + route, routeNames.indexOf(route) > -1 || routeNames.length === 0, { route: route }));
    });
    var manifest = _releaseManifest_(payload || {});
    ["gasDeploymentId"].forEach(function (name) {
        checks.push(_releaseQaCheck_("release.metadata." + name, !!String(manifest[name] || "").trim(), { valuePresent: !!String(manifest[name] || "").trim() }, "warning"));
    });
    ["contractStamp", "cacheBustVersion"].forEach(function (name) {
        checks.push(_releaseQaCheck_("release.metadata." + name, !!String(manifest[name] || "").trim(), { valuePresent: !!String(manifest[name] || "").trim() }, "error"));
    });
    var currentQualityGate = _appIsFnName_("_currentQualityGateStatus_") ? _currentQualityGateStatus_({
        includeCases: payload.includeRegressionCases === !0,
        requireLiveEvidence: !1
    }) : null;
    checks.push(_releaseQaCheck_("quality.currentGate", !!(currentQualityGate && currentQualityGate.ok), {
        stamp: String(currentQualityGate && currentQualityGate.stamp || ""),
        routeCount: Number(currentQualityGate && currentQualityGate.routeCount || 0),
        writeRouteCount: Number(currentQualityGate && currentQualityGate.writeRouteCount || 0),
        issues: currentQualityGate && currentQualityGate.issues || []
    }));
    var performanceProfile = _appIsFnName_("_appPerformanceProfile_") ? _appPerformanceProfile_("apiGetPhase5ReleaseReadiness") : null;
    checks.push(_releaseQaCheck_("performance.profile.releaseReadiness", !!performanceProfile, { targetMs: Number(performanceProfile && performanceProfile.targetMs || 0) }));
    var telemetryPolicy = _runtimeTelemetryPolicy_();
    checks.push(_releaseQaCheck_("runtime.telemetry.classes", telemetryPolicy.classes.length >= 5, { classes: telemetryPolicy.classes }));
    var ledger = null;
    try {
        ledger = _appIsFnName_("_cacheInvalidationLedgerStatus_") ? _cacheInvalidationLedgerStatus_() : null;
    }
    catch (_ledgerErr) {
        ledger = { ok: !1, error: String(_ledgerErr && _ledgerErr.message || _ledgerErr) };
    }
    checks.push(_releaseQaCheck_("cacheLedger.available", !!(ledger && ledger.ok), { stamp: String(ledger && ledger.stamp || "") }));
    var productionMeasurementGate = _appIsFnName_("_productionMeasurementGateStatus_") ? _productionMeasurementGateStatus_({
        requireEvidence: payload.requirePerformanceEvidence !== !1 && payload.requireRoundAEvidence !== !1,
        requireQualityEvidence: payload.requireQualityEvidence !== !1,
        clientEvidence: storedClientEvidence || payload.clientMeasurementEvidence || null
    }) : null;
    checks.push(_releaseQaCheck_("performance.productionMeasurement", !!(productionMeasurementGate && productionMeasurementGate.ok), {
        implementationReady: !!(productionMeasurementGate && productionMeasurementGate.implementationReady),
        evidenceComplete: !!(productionMeasurementGate && productionMeasurementGate.evidenceComplete),
        budgetsWithinTarget: !!(productionMeasurementGate && productionMeasurementGate.budgetsWithinTarget),
        resourcesWithinTarget: !!(productionMeasurementGate && productionMeasurementGate.resourcesWithinTarget),
        releaseFingerprint: String(productionMeasurementGate && productionMeasurementGate.releaseFingerprint || ""),
        blockers: productionMeasurementGate && productionMeasurementGate.blockers || []
    }, payload.requirePerformanceEvidence === !1 || payload.requireRoundAEvidence === !1 ? "warning" : "error"));
    var productionPolicy = productionMeasurementGate && productionMeasurementGate.productionPolicy || (_appIsFnName_("_productionPolicyStatus_") ? _productionPolicyStatus_() : null);
    checks.push(_releaseQaCheck_("security.productionPolicy", !!(productionPolicy && productionPolicy.ok), {
        checks: productionPolicy && productionPolicy.checks || {},
        geminiKeyConfigured: !!(productionPolicy && productionPolicy.geminiKeyConfigured),
        secretValuesExposed: !!(productionPolicy && productionPolicy.secretValuesExposed)
    }));
    var automatedRegression = currentQualityGate && currentQualityGate.regression || _automatedRegressionStatus_({ includeCases: payload.includeRegressionCases === !0 });
    checks.push(_releaseQaCheck_("regression.current", !!(automatedRegression && automatedRegression.ok), {
        stamp: String(automatedRegression && automatedRegression.stamp || ""),
        caseCount: Number(automatedRegression && (automatedRegression.caseCount != null ? automatedRegression.caseCount : automatedRegression.total) || 0),
        passCount: Number(automatedRegression && (automatedRegression.passCount != null ? automatedRegression.passCount : automatedRegression.passed) || 0),
        failCount: Number(automatedRegression && (automatedRegression.failCount != null ? automatedRegression.failCount : automatedRegression.failed) || 0),
        failures: automatedRegression && (automatedRegression.failedCases || automatedRegression.failures) || []
    }));
    var hardFailures = checks.filter(function (c) { return !c.ok && c.severity !== "warning"; }).length;
    var warnings = checks.filter(function (c) { return !c.ok && c.severity === "warning"; }).length;
    var passed = checks.filter(function (c) { return c.ok; }).length;
    var score = Math.max(0, Math.round(100 * passed / Math.max(1, checks.length)) - hardFailures * 10);
    var performanceBaseline = payload.includePerformanceBaseline === !1 ? null : _apiPerfBaselineSnapshot_({
        methods: payload.performanceMethods,
        rawLimit: payload.includePerformanceRaw === !0 ? Math.max(1, Math.min(Number(payload.performanceRawLimit || 80), 160)) : 0
    });
    var ready = hardFailures === 0 && warnings <= 2;
    return {
        ok: hardFailures === 0,
        ready: ready,
        readyForProductionCandidate: ready,
        score: score,
        owner: APP_RELEASE_POLICY_CURRENT.owner,
        stamp: APP_RELEASE_POLICY_CURRENT.stamp,
        policy: APP_RELEASE_POLICY_CURRENT.policy,
        manifest: manifest,
        checks: checks,
        passed: passed,
        failed: hardFailures,
        warnings: warnings,
        currentQualityGate: currentQualityGate,
        productionMeasurementGate: productionMeasurementGate,
        productionPolicy: productionPolicy,
        automatedRegression: automatedRegression,
        telemetryPolicy: telemetryPolicy,
        performanceBaseline: performanceBaseline,
        operatorSmokeChecklist: _operatorSmokeChecklist_(),
        /* compatibility response keys; all point to current canonical results */
        phase4QaGate: currentQualityGate,
        roundAProductionMeasurementGate: productionMeasurementGate,
        p1ProductionVerification: { measurement: productionMeasurementGate, policy: productionPolicy },
        f5ProductionQualityGate: currentQualityGate,
        m16MaintainabilityPerformanceQualityGate: currentQualityGate,
        compatibilityFacade: !0,
        canonicalOwner: "Code_06_Platform_QualityGates.CurrentQualityGate",
        readOnly: !0,
        noDataMutation: !0,
        durationMs: Math.max(0, Date.now() - started),
        generatedAt: new Date().toISOString(),
        meta: { source: "CurrentReleaseReadiness", uiDomChanged: !1, businessLogicChanged: !1 }
    };
}
function apiGetPhase5ReleaseReadiness(payload) {
    return _getReleaseReadiness_(payload);
}

function _appPerformanceTargetLabel_(method, durationMs) {
    var t = _appPerformanceTargetMs_(method);
    return t ? Number(durationMs || 0) >= t ? "over-target" : "within-target" : "";
}
function _appPerfMeta_(method, startedAt, data, source, extra) {
    var metrics = {};
    try {
        metrics = typeof getRequestScopeMetrics_ == "function" ? getRequestScopeMetrics_() : {};
    }
    catch (_e) {
        metrics = {};
    }
    var rowsReturned = _appPerfCountRows_(data), payloadBytes = _appIsFnName_("_appPerformancePayloadBytes_") ? _appPerformancePayloadBytes_(data) : 0, meta = {
        method: String(method || ""), durationMs: Math.max(0, Date.now() - Number(startedAt || Date.now())), rowsRead: Number(metrics.rowsRead || extra && extra.rowsRead || rowsReturned || 0), rowsReturned: Number(extra && extra.rowsReturned || rowsReturned || 0), cellsRead: Number(metrics.cellsRead || extra && extra.cellsRead || 0), serviceReads: Number(metrics.serviceReads || extra && extra.serviceReads || 0), projectedColumnsRead: Number(metrics.projectedColumnsRead || extra && extra.projectedColumnsRead || 0), fullWidthColumnsAvoided: Number(metrics.fullWidthColumnsAvoided || extra && extra.fullWidthColumnsAvoided || 0), payloadBytes: Number(extra && extra.payloadBytes || payloadBytes || 0), cacheHit: !!(metrics.cacheHit || extra && extra.cacheHit), source: String(source || extra && extra.source || data && data.source || data && data.meta && data.meta.source || "live"), degraded: !!(extra && extra.degraded || data && data.degraded || data && data.meta && data.meta.degraded)
    }, targetMs = _appIsFnName_("_appPerformanceTargetMs_") ? _appPerformanceTargetMs_(method) : 0;
    return targetMs && (meta.targetMs = targetMs, meta.overTarget = meta.durationMs >= targetMs, meta.targetStatus = _appPerformanceTargetLabel_(method, meta.durationMs)), extra && typeof extra == "object" && Object.keys(extra).forEach(function (k) {
        meta[k] === void 0 && (meta[k] = extra[k]);
    }), meta;
}
function _attachAppPerfMeta_(result, method, startedAt, source, extra) {
    var data, perf = _appPerfMeta_(method, startedAt, ((result = result && typeof result == "object" ? result : {}).data && result.data, result.data), source, extra || {});
    return result.perf = Object.assign({}, result.perf || {}, perf), result.data && typeof result.data == "object" && !Array.isArray(result.data) && (result.data.meta = Object.assign({}, result.data.meta || {}, {
        method: perf.method, durationMs: perf.durationMs, rowsRead: perf.rowsRead, rowsReturned: perf.rowsReturned, cellsRead: perf.cellsRead, serviceReads: perf.serviceReads, projectedColumnsRead: perf.projectedColumnsRead, fullWidthColumnsAvoided: perf.fullWidthColumnsAvoided, payloadBytes: perf.payloadBytes, cacheHit: perf.cacheHit, source: perf.source, degraded: perf.degraded
    })), result;
}
function _withHotApiTelemetry_(method, payload, source, runner) {
    var startedAt = Date.now();
    try {
        var result;
        return _attachAppPerfMeta_(runner(payload || {}), method, startedAt, source || "hot-api", {
            degraded: !1
        });
    }
    catch (e) {
        var out;
        return _attachAppPerfMeta_(err_(e && e.message ? e.message : String(e), {
            rows: [], data: [], meta: {
                degraded: !0, source: source || "hot-api-error"
            }
        }), method, startedAt, source || "hot-api-error", {
            degraded: !0
        });
    }
}
function ok_(data, msg) {
    return {
        ok: !0, data: data === void 0 ? null : data, msg: String(msg || ""), error: ""
    };
}
function err_(msg, data) {
    var txt = _toErrorText_(msg, "เกิดข้อผิดพลาด");
    return {
        ok: !1, data: data === void 0 ? null : data, msg: txt, error: txt
    };
}
function _platformNormalizeResult_(result, successMsg, failureMsg) {
    if (result && typeof result == "object" && (Object.prototype.hasOwnProperty.call(result, "ok") || Object.prototype.hasOwnProperty.call(result, "success"))) {
        var ok = Object.prototype.hasOwnProperty.call(result, "ok") ? !!result.ok : !!result.success, data = Object.prototype.hasOwnProperty.call(result, "data") ? result.data : (src = result, extra = {}, Object.keys(src || {}).forEach(function (k) {
            k !== "ok" && k !== "success" && k !== "msg" && k !== "error" && (extra[k] = src[k]);
        }), Object.keys(extra).length ? extra : null), msg = String(result.msg || result.error || (ok ? successMsg || "" : failureMsg || "เกิดข้อผิดพลาด") || ""), out = {
            ok, data, msg, error: ok ? "" : String(result.error || msg || "เกิดข้อผิดพลาด")
        };
        return Object.keys(result).forEach(function (k) {
            Object.prototype.hasOwnProperty.call(out, k) || k === "success" || (out[k] = result[k]);
        }), out;
    }
    var src, extra;
    return typeof result == "boolean" ? result ? ok_(null, successMsg || "") : err_(failureMsg || "ดำเนินการไม่สำเร็จ") : ok_(result, successMsg || "");
}
var __APP_WRITE_LOCK_DEPTH__ = typeof __APP_WRITE_LOCK_DEPTH__ == "number" ? __APP_WRITE_LOCK_DEPTH__ : 0;
function withWriteLock_(name, fn, timeoutMs) {
    if (typeof fn != "function")
        throw new Error("withWriteLock_ ต้องรับ callback");
    if (__APP_WRITE_LOCK_DEPTH__ > 0) {
        __APP_WRITE_LOCK_DEPTH__++;
        try {
            return fn();
        }
        finally {
            __APP_WRITE_LOCK_DEPTH__ = Math.max(0, __APP_WRITE_LOCK_DEPTH__ - 1);
        }
    }
    var lock = LockService.getScriptLock();
    lock.waitLock(Number(timeoutMs || 2e4)), __APP_WRITE_LOCK_DEPTH__++;
    try {
        return fn();
    }
    finally {
        __APP_WRITE_LOCK_DEPTH__ = Math.max(0, __APP_WRITE_LOCK_DEPTH__ - 1);
        try {
            lock.releaseLock();
        }
        catch (_e) {
            _recordWarning_("lock.release", _e);
        }
    }
}
var APP_BACKEND_BOUNDARY_CURRENT = {
    stamp: "phase3-backend-read-write-boundary-current", owner: "Code_00_PlatformCore.AppBackendBoundary", routerOwner: "Code_20_Router", repositoryOwner: "AppRepository", writeOwner: "writeGateway_", domainWriteOwner: "domainWrite_", policy: "router-read-write-context + one-root-write-gateway + domain-operation-join", uiDomChanged: !1, businessLogicChanged: !1
}, __APP_BACKEND_BOUNDARY_STACK__ = Array.isArray(__APP_BACKEND_BOUNDARY_STACK__) ? __APP_BACKEND_BOUNDARY_STACK__ : [], __APP_WRITE_GATEWAY_DEPTH__ = typeof __APP_WRITE_GATEWAY_DEPTH__ == "number" ? __APP_WRITE_GATEWAY_DEPTH__ : 0, __APP_WRITE_GATEWAY_CHAIN__ = Array.isArray(__APP_WRITE_GATEWAY_CHAIN__) ? __APP_WRITE_GATEWAY_CHAIN__ : [], APP_CACHE_INVALIDATION_LEDGER_CURRENT = Object.freeze({
    stamp: "phase4-cache-invalidation-ledger-current", owner: "Code_00_PlatformCore.AppCacheInvalidationLedger", policy: "one-root-mutation-ledger + canonical-domain-dependencies + one-stamp-bump-per-transaction", canonicalDomains: [
        "case", "letters", "meeting", "budget", "people", "admin", "admin-users", "dashboard"
    ], uiDomChanged: !1, businessLogicChanged: !1
}), __APP_WRITE_INVALIDATION_QUEUE__ = Array.isArray(__APP_WRITE_INVALIDATION_QUEUE__) ? __APP_WRITE_INVALIDATION_QUEUE__ : [], __APP_WRITE_INVALIDATION_CACHE_KEYS__ = __APP_WRITE_INVALIDATION_CACHE_KEYS__ && typeof __APP_WRITE_INVALIDATION_CACHE_KEYS__ == "object" ? __APP_WRITE_INVALIDATION_CACHE_KEYS__ : {}, __APP_WRITE_INVALIDATION_FLUSHING__ = __APP_WRITE_INVALIDATION_FLUSHING__ === !0, __APP_CACHE_LEDGER_TXN__ = __APP_CACHE_LEDGER_TXN__ && typeof __APP_CACHE_LEDGER_TXN__ == "object" ? __APP_CACHE_LEDGER_TXN__ : null;
function _cacheLedgerUniquePush_(list, value) {
    return value = String(value || "").trim(), value && list.indexOf(value) < 0 && list.push(value), value;
}
function _cacheLedgerCanonicalDomain_(domain) {
    domain = String(domain || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
    var aliases = {
        case: "case", cases: "case", maindata: "case", search: "case", reporttrack: "case", reportoptions: "case", letter: "letters", letters: "letters", tracking: "letters", meeting: "meeting", meetings: "meeting", meetinglog: "meeting", meetinglogs: "meeting", committeemeeting: "meeting", committeemeetings: "meeting", committeemeetingagendaitems: "meeting", committeemeetingagenda: "meeting", budget: "budget", budgetimports: "budget", budgetsummary: "budget", budgettypesummary: "budget", budgetsettings: "budget", budgetyearsettings: "budget", budgetyearsettingsitems: "budget", salarysettings: "budget", salarypayments: "budget", adminreports: "admin", people: "people", personnel: "people", personnelcomm: "people", personnelop: "people", personnelstaff: "people", personnelsubcommittees: "people", petitioner: "people", petitioners: "people", subcommittee: "people", subcommittees: "people", meetinglookup: "people", admin: "admin", adminuser: "admin-users", adminusers: "admin-users", apiadminlistusers: "admin-users", user: "admin", users: "admin-users", systemsettings: "admin", config: "admin", auditlog: "admin", dashboard: "dashboard", ai: "general", bootstrap: "general", lookup: "general", lookups: "general", auth: "general", asset: "general", assets: "general"
    };
    return aliases[domain] || domain || "general";
}

var APP_DATA_CONTRACT_CURRENT = Object.freeze({
    stamp: "f2-data-contract-single-owner-2026-08-07-r230",
    owner: "Code_00_PlatformCore.AppDataContract",
    policy: "one-route-data-policy + exact-write-mutation-contract + no-regex-inference",
    entities: Object.freeze({
        case: Object.freeze({ pages: ["dashboard", "meeting", "search", "track", "report"], stampEntities: ["maindata", "cases", "letters", "meetinglogs"] }),
        letters: Object.freeze({ pages: ["dashboard", "meeting", "track", "report"], stampEntities: ["tracking", "letters", "maindata"] }),
        tracking: Object.freeze({ pages: ["dashboard", "meeting", "track", "report"], stampEntities: ["tracking", "letters", "maindata"] }),
        meeting: Object.freeze({ pages: ["dashboard", "meeting", "track", "report"], stampEntities: ["meeting", "meetings", "meetinglogs", "committeemeetings"] }),
        budget: Object.freeze({ pages: ["dashboard", "budget"], stampEntities: ["budgetimports", "budgetsummary", "budgettypesummary", "budgetsettings", "budget"] }),
        people: Object.freeze({ pages: ["people", "budget", "meeting"], stampEntities: ["personnel", "personnel_comm", "personnel_staff", "personnel_op", "budgetsettings"] }),
        petitioner: Object.freeze({ pages: ["petitioner", "dashboard", "meeting"], stampEntities: ["petitioners", "maindata"] }),
        admin: Object.freeze({ pages: ["admin"], stampEntities: ["admin", "systemsettings", "auditlog"] }),
        "admin-users": Object.freeze({ pages: ["admin"], stampEntities: ["admin-users", "users"] }),
        dashboard: Object.freeze({ pages: ["dashboard"], stampEntities: ["dashboard", "maindata", "budgetimports", "budgetsummary", "budgettypesummary", "personnel", "letters", "meetinglogs"] }),
        lookup: Object.freeze({ pages: ["active-page"], stampEntities: ["thailandlocations", "lookups"] }),
        general: Object.freeze({ pages: ["active-page"], stampEntities: ["general"] })
    }),
    methods: Object.freeze({
        apiGetRouteContract: Object.freeze({ domain: "bootstrap", cacheEntity: "general", clientTtlSeconds: 900, serverTtlSeconds: 900 }),
        apiGetPhase1Contract: Object.freeze({ domain: "bootstrap", cacheEntity: "general", clientTtlSeconds: 900, serverTtlSeconds: 0 }),
        apiGetClientDataContract: Object.freeze({ domain: "bootstrap", cacheEntity: "general", clientTtlSeconds: 900, serverTtlSeconds: 900 }),
        apiGetAppTerminology: Object.freeze({ domain: "bootstrap", cacheEntity: "general", clientTtlSeconds: 21600, serverTtlSeconds: 21600 }),
        apiGetDashboardBundle: Object.freeze({ domain: "dashboard", cacheEntity: "dashboard", clientTtlSeconds: 75, serverTtlSeconds: 0, domainOwnedCache: true }),
        apiBudgetGetSummary: Object.freeze({ domain: "budget", cacheEntity: "budget", clientTtlSeconds: 120, serverTtlSeconds: 0, domainOwnedCache: true }),
        apiBudgetGetTypeSummaryByFY: Object.freeze({ domain: "budget", cacheEntity: "budget", clientTtlSeconds: 600, serverTtlSeconds: 900 }),
        apiBudgetGetFiscalYears: Object.freeze({ domain: "budget", cacheEntity: "budget", clientTtlSeconds: 900, serverTtlSeconds: 900 }),
        apiBudgetGetSubcommitteeOptions: Object.freeze({ domain: "budget", cacheEntity: "budget", clientTtlSeconds: 900, serverTtlSeconds: 900 }),
        apiGetPeoplePageBundle: Object.freeze({ domain: "people", cacheEntity: "people", clientTtlSeconds: 180, serverTtlSeconds: 600 }),
        apiGetPersonnelDirectoryBundle: Object.freeze({ domain: "people", cacheEntity: "people", clientTtlSeconds: 300, serverTtlSeconds: 600 }),
        apiGetTracking: Object.freeze({ domain: "tracking", cacheEntity: "tracking", clientTtlSeconds: 60, serverTtlSeconds: 0, domainOwnedCache: true }),
        apiGetPetitioners: Object.freeze({ domain: "petitioners", cacheEntity: "petitioner", clientTtlSeconds: 300, serverTtlSeconds: 600 }),
        apiGetThailandLocations: Object.freeze({ domain: "lookups", cacheEntity: "lookup", clientTtlSeconds: 21600, serverTtlSeconds: 21600 }),
        apiSearchLookup: Object.freeze({ domain: "lookups", cacheEntity: "lookup", clientTtlSeconds: 3600, serverTtlSeconds: 3600 }),
        apiListCommitteeMeetings: Object.freeze({ domain: "meeting", cacheEntity: "meeting", clientTtlSeconds: 0, serverTtlSeconds: 0, domainOwnedCache: true }),
        apiGetCommitteeMeetingSystem: Object.freeze({ domain: "meeting", cacheEntity: "meeting", clientTtlSeconds: 0, serverTtlSeconds: 0, domainOwnedCache: true }),
        apiGetMeetingLookupOptions: Object.freeze({ domain: "meeting", cacheEntity: "meeting", clientTtlSeconds: 0, serverTtlSeconds: 900 }),
        apiSearchCasesLite: Object.freeze({ domain: "cases", cacheEntity: "case", clientTtlSeconds: 0, serverTtlSeconds: 0, domainOwnedCache: true }),

        apiSaveCase: Object.freeze({ write: true, domain: "cases", cacheEntity: "case", mutationEntity: "cases", invalidates: ["case", "dashboard"], pages: ["meeting", "search", "track", "report", "dashboard"] }),
        apiDeleteCase: Object.freeze({ write: true, domain: "cases", cacheEntity: "case", mutationEntity: "cases", invalidates: ["case", "dashboard"], pages: ["meeting", "search", "track", "report", "dashboard"] }),
        apiSavePetitioner: Object.freeze({ write: true, domain: "petitioners", cacheEntity: "petitioner", mutationEntity: "petitioner", invalidates: ["people", "petitioner", "case", "dashboard"], pages: ["petitioner", "meeting"] }),
        apiDeletePetitioner: Object.freeze({ write: true, domain: "petitioners", cacheEntity: "petitioner", mutationEntity: "petitioner", invalidates: ["people", "petitioner", "case", "dashboard"], pages: ["petitioner", "meeting"] }),
        apiSavePersonnelComm: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "people", invalidates: ["people"], pages: ["people", "budget"] }),
        apiSavePersonnelOp: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "people", invalidates: ["people"], pages: ["people", "budget"] }),
        apiSavePersonnelStaff: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "people", invalidates: ["people"], pages: ["people", "budget"] }),
        apiSavePersonnelSubcommittee: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "people", invalidates: ["people"], pages: ["people", "budget"] }),
        apiDeletePersonnelComm: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "people", invalidates: ["people"], pages: ["people", "budget"] }),
        apiDeletePersonnelOp: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "people", invalidates: ["people"], pages: ["people", "budget"] }),
        apiDeletePersonnelStaff: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "people", invalidates: ["people"], pages: ["people", "budget"] }),
        apiDeletePersonnelSubcommittee: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "people", invalidates: ["people"], pages: ["people", "budget"] }),
        apiSaveSalarySettings: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "people", invalidates: ["budget", "people", "dashboard"], pages: ["people", "budget", "dashboard"] }),
        apiSaveCommitteeMeetingSystem: Object.freeze({ write: true, domain: "meeting", cacheEntity: "meeting", mutationEntity: "meeting", invalidates: ["meeting", "dashboard"], pages: ["meeting", "track", "report", "dashboard"] }),
        apiDeleteCommitteeMeetingSystem: Object.freeze({ write: true, domain: "meeting", cacheEntity: "meeting", mutationEntity: "meeting", invalidates: ["meeting", "dashboard"], pages: ["meeting", "track", "report", "dashboard"] }),
        apiSaveMeetingLog: Object.freeze({ write: true, domain: "meeting", cacheEntity: "meeting", mutationEntity: "meeting", invalidates: ["meeting", "dashboard"], pages: ["meeting", "track", "report", "dashboard"] }),
        apiDeleteMeetingLog: Object.freeze({ write: true, domain: "meeting", cacheEntity: "meeting", mutationEntity: "meeting", invalidates: ["meeting", "dashboard"], pages: ["meeting", "track", "report", "dashboard"] }),
        apiSaveLetter: Object.freeze({ write: true, domain: "letters", cacheEntity: "letters", mutationEntity: "tracking", invalidates: ["letters", "dashboard"], pages: ["meeting", "track", "report", "dashboard"] }),
        apiDeleteLetter: Object.freeze({ write: true, domain: "letters", cacheEntity: "letters", mutationEntity: "tracking", invalidates: ["letters", "dashboard"], pages: ["meeting", "track", "report", "dashboard"] }),
        apiCleanupMeetingData: Object.freeze({ write: true, domain: "meeting", cacheEntity: "meeting", mutationEntity: "meeting", invalidates: ["meeting", "dashboard"], pages: ["meeting", "track", "report", "dashboard"] }),
        apiBudgetSaveImport: Object.freeze({ write: true, domain: "budget", cacheEntity: "budget", mutationEntity: "budget", invalidates: ["budget", "dashboard"], pages: ["budget", "dashboard"] }),
        apiBudgetDeleteImport: Object.freeze({ write: true, domain: "budget", cacheEntity: "budget", mutationEntity: "budget", invalidates: ["budget", "dashboard"], pages: ["budget", "dashboard"] }),
        apiAdminSaveUser: Object.freeze({ write: true, domain: "admin-users", cacheEntity: "admin-users", mutationEntity: "admin", invalidates: ["admin-users", "admin"], pages: ["admin"] }),
        apiAdminDeleteUser: Object.freeze({ write: true, domain: "admin-users", cacheEntity: "admin-users", mutationEntity: "admin", invalidates: ["admin-users", "admin"], pages: ["admin"] }),
        apiAdminSaveSubcommittee: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "admin", invalidates: ["people", "admin"], pages: ["admin", "people", "meeting"] }),
        apiAdminDeleteSubcommittee: Object.freeze({ write: true, domain: "personnel", cacheEntity: "people", mutationEntity: "admin", invalidates: ["people", "admin"], pages: ["admin", "people", "meeting"] }),
        apiBudgetAdminSaveYearSettingsRows: Object.freeze({ write: true, domain: "admin-budget", cacheEntity: "budget", mutationEntity: "budget", invalidates: ["budget", "admin", "dashboard"], pages: ["budget", "dashboard"] })
    })
});
function _platformDataContractMethod_(method, meta) {
    method = String(method || "").trim(), meta = meta || {};
    var exact = APP_DATA_CONTRACT_CURRENT.methods[method] || {}, domain = String(exact.domain || meta.domain || meta.group || "general"), cacheEntity = String(exact.cacheEntity || _cacheLedgerCanonicalDomain_(domain) || "general"), entitySpec = APP_DATA_CONTRACT_CURRENT.entities[cacheEntity] || APP_DATA_CONTRACT_CURRENT.entities.general;
    return {
        method: method,
        domain: domain,
        cacheEntity: cacheEntity,
        clientTtlSeconds: Math.max(0, Number(exact.clientTtlSeconds || 0) || 0),
        serverTtlSeconds: Math.max(0, Number(exact.serverTtlSeconds || 0) || 0),
        domainOwnedCache: exact.domainOwnedCache === true,
        write: exact.write === true || meta.write === true,
        mutationEntity: String(exact.mutationEntity || cacheEntity),
        invalidates: Array.isArray(exact.invalidates) ? exact.invalidates.slice() : [],
        pages: Array.isArray(exact.pages) ? exact.pages.slice() : (entitySpec.pages || []).slice(),
        stampEntities: Array.isArray(exact.stampEntities) ? exact.stampEntities.slice() : (entitySpec.stampEntities || [cacheEntity]).slice(),
        owner: APP_DATA_CONTRACT_CURRENT.owner,
        stamp: APP_DATA_CONTRACT_CURRENT.stamp
    };
}
function _platformClientDataContract_(registry) {
    registry = registry || (_appIsFnName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {});
    var methods = {}, writeMethods = {};
    Object.keys(registry || {}).sort().forEach(function (method) {
        var policy = _platformDataContractMethod_(method, registry[method] || {}), compact = {
            domain: policy.domain,
            cacheEntity: policy.cacheEntity,
            clientTtlSeconds: policy.clientTtlSeconds,
            serverTtlSeconds: policy.serverTtlSeconds,
            domainOwnedCache: policy.domainOwnedCache
        };
        if (policy.write) {
            compact.write = true;
            compact.mutation = { entity: policy.mutationEntity, invalidates: policy.invalidates.slice(), pages: policy.pages.slice() };
            writeMethods[method] = compact.mutation;
        }
        methods[method] = compact;
    });
    return {
        ok: true,
        stamp: APP_DATA_CONTRACT_CURRENT.stamp,
        owner: APP_DATA_CONTRACT_CURRENT.owner,
        regexInferenceDisabled: true,
        routeCount: Object.keys(methods).length,
        writeContractCount: Object.keys(writeMethods).length,
        methods: methods,
        writeMethods: writeMethods
    };
}

var APP_CONTRACT_FREEZE_CURRENT = Object.freeze({
    stamp: "contract-freeze-production-lock-current-r257", owner: "Code_00_PlatformCore.PhaseAContractFreeze", contracts: [
        "CACHE_ENTITY_BY_METHOD", "WRITE_INVALIDATION_BY_METHOD", "FRONTEND_PAGE_REFRESH_BY_ENTITY"
    ], uiDomChanged: !1, businessLogicChanged: !1
});
function _platformCacheEntityByMethod_(method, meta) {
    return _platformDataContractMethod_(method, meta || {}).cacheEntity;
}
function _platformWriteInvalidationByMethod_(method) {
    var policy = _platformDataContractMethod_(method, {}), out = [];
    (policy.invalidates || []).forEach(function (domain) {
        var canonical = _cacheLedgerCanonicalDomain_(domain);
        canonical && out.indexOf(canonical) < 0 && out.push(canonical);
    });
    return out.length ? out : [policy.cacheEntity];
}
function _platformFrontendRefreshByEntity_() {
    var out = {};
    Object.keys(APP_DATA_CONTRACT_CURRENT.entities).forEach(function (entity) {
        out[entity] = (APP_DATA_CONTRACT_CURRENT.entities[entity].pages || []).slice();
    });
    return out;
}
function _platformCacheContractStatus_() {
    var entities = (APP_CACHE_INVALIDATION_LEDGER_CURRENT.canonicalDomains || []).slice(), refresh = _platformFrontendRefreshByEntity_(), issues = [];
    [
        "case", "letters", "meeting", "budget", "people", "admin", "admin-users", "dashboard"
    ].forEach(function (name) {
        entities.indexOf(name) < 0 && issues.push({
            code: "PHASEA_CACHE_ENTITY_MISSING", entity: name
        }), !refresh[name] && issues.push({
            code: "PHASEA_FRONTEND_REFRESH_MISSING", entity: name
        });
    });
    return {
        ok: issues.length === 0, stamp: APP_CONTRACT_FREEZE_CURRENT.stamp, owner: APP_CONTRACT_FREEZE_CURRENT.owner, contracts: APP_CONTRACT_FREEZE_CURRENT.contracts.slice(), canonicalDomains: entities, frontendRefreshByEntity: refresh, issues, uiDomChanged: !1, businessLogicChanged: !1
    };
}
/* Historical safety-baseline and parallel production-contract implementations were removed before the current release. */
function _cacheLedgerProfiles_() {
    return {
        case: {
            stamps: [
                "case", "cases", "maindata", "search", "reportoptions", "tracking", "meetinglookup", "dashboard"
            ], sheets: [
                "MainData"
            ], dirty: [
                "cases", "dashboard", "tracking"
            ]
        }, letters: {
            stamps: [
                "letters", "tracking", "cases", "reportoptions", "dashboard"
            ], sheets: [
                "Letters"
            ], dirty: [
                "tracking", "cases", "dashboard"
            ]
        }, meeting: {
            stamps: [
                "meeting", "meetings", "meetinglogs", "meetinglookup", "cases", "dashboard"
            ], sheets: [
                "MeetingLogs", "CommitteeMeetings", "CommitteeMeetingAgendaItems", "CommitteeMeetingAgenda"
            ], dirty: [
                "meetings", "cases", "dashboard"
            ]
        }, budget: {
            stamps: [
                "budget", "budgetimports", "budgetsummary", "budgettypesummary", "budgetsettings", "salarysettings", "salarypayments", "adminreports", "dashboard"
            ], sheets: [
                "BudgetImports"
            ], dirty: [
                "budgetsummary", "budgettypesummary", "dashboard"
            ]
        }, people: {
            stamps: [
                "people", "personnel", "personnel_comm", "personnel_op", "personnel_staff", "personnel_subcommittees", "petitioners", "subcommittees", "meetinglookup", "budgetsummary", "dashboard"
            ], sheets: [], dirty: [
                "people", "dashboard"
            ]
        }, admin: {
            stamps: [
                "admin", "users", "adminreports", "dashboard"
            ], sheets: [], dirty: [
                "admin", "dashboard"
            ]
        }, "admin-users": {
            stamps: [
                "admin-users", "users", "admin", "dashboard"
            ], sheets: [
                "Users"
            ], dirty: [
                "admin-users", "admin", "dashboard"
            ]
        }, dashboard: {
            stamps: [
                "dashboard"
            ], sheets: [], dirty: [
                "dashboard"
            ]
        }, general: {
            stamps: [
                "general", "dashboard"
            ], sheets: [], dirty: [
                "dashboard"
            ]
        }
    };
}
function _cacheLedgerSheetDomains_(sheetName) {
    var map = {
        MainData: [
            "case"
        ], Letters: [
            "letters"
        ], MeetingLogs: [
            "meeting"
        ], CommitteeMeetings: [
            "meeting"
        ], CommitteeMeetingAgendaItems: [
            "meeting"
        ], CommitteeMeetingAgenda: [
            "meeting"
        ], BudgetImports: [
            "budget"
        ], BudgetSummary: [
            "budget"
        ], BudgetYearSettingsItems: [
            "budget"
        ], BudgetYearSettings: [
            "budget"
        ], SalarySettings: [
            "budget", "people"
        ], SalaryPayments: [
            "budget", "people"
        ], Personnel_Comm: [
            "people"
        ], Personnel_Op: [
            "people"
        ], Personnel_Staff: [
            "people", "budget"
        ], Personnel_Subcommittees: [
            "people"
        ], Petitioners: [
            "people", "case"
        ], Subcommittees: [
            "people"
        ], Users: [
            "admin", "admin-users"
        ], SystemSettings: [
            "admin"
        ], Config: [
            "admin"
        ], AuditLog: [
            "admin"
        ]
    };
    return (map[String(sheetName || "").trim()] || []).slice();
}
function _cacheLedgerNewTxn_(rootWriteName) {
    return {
        id: typeof Utilities != "undefined" && Utilities.getUuid ? Utilities.getUuid() : String(Date.now()), stamp: APP_CACHE_INVALIDATION_LEDGER_CURRENT.stamp, owner: APP_CACHE_INVALIDATION_LEDGER_CURRENT.owner, rootWriteName: String(rootWriteName || "write"), startedAt: Date.now(), domains: [], sheets: [], reasons: [], sources: [], stampKeys: [], dirtyDomains: [], cacheKeys: [], bumpedStamps: {}, removedCacheKeys: {}, mutationObserved: !1, flushing: !1, flushCount: 0, flushedAt: ""
    };
}
function _cacheLedgerEnsureTxn_(rootWriteName) {
    return __APP_CACHE_LEDGER_TXN__ || (__APP_CACHE_LEDGER_TXN__ = _cacheLedgerNewTxn_(rootWriteName)), __APP_CACHE_LEDGER_TXN__;
}
function _cacheLedgerQueueDomain_(domain, source, reason) {
    var txn = _cacheLedgerEnsureTxn_(__APP_WRITE_GATEWAY_CHAIN__[0] || "write"), canonical = _cacheLedgerCanonicalDomain_(domain), profile = _cacheLedgerProfiles_()[canonical] || _cacheLedgerProfiles_().general;
    return _cacheLedgerUniquePush_(txn.domains, canonical), canonical !== "dashboard" && (profile.stamps || []).indexOf("dashboard") > -1 && _cacheLedgerUniquePush_(txn.domains, "dashboard"), (profile.stamps || []).forEach(function (k) {
        _cacheLedgerUniquePush_(txn.stampKeys, String(k || "").toLowerCase());
    }), (profile.sheets || []).forEach(function (sh) {
        _cacheLedgerUniquePush_(txn.sheets, sh);
    }), (profile.dirty || []).forEach(function (k) {
        _cacheLedgerUniquePush_(txn.dirtyDomains, k);
    }), source && _cacheLedgerUniquePush_(txn.sources, source), reason && _cacheLedgerUniquePush_(txn.reasons, reason), txn.mutationObserved = !0, _cacheLedgerUniquePush_(__APP_WRITE_INVALIDATION_QUEUE__, canonical), {
        ok: !0, queued: !0, deferred: !0, domain: canonical, source: String(source || ""), owner: APP_CACHE_INVALIDATION_LEDGER_CURRENT.owner, stamp: APP_CACHE_INVALIDATION_LEDGER_CURRENT.stamp
    };
}
function _cacheLedgerQueueSheet_(sheetName, source, reason) {
    if (sheetName = String(sheetName || "").trim(), !sheetName)
        return {
            ok: !1, queued: !1, reason: "empty-sheet", owner: APP_CACHE_INVALIDATION_LEDGER_CURRENT.owner
        };
    var txn = _cacheLedgerEnsureTxn_(__APP_WRITE_GATEWAY_CHAIN__[0] || "write");
    _cacheLedgerUniquePush_(txn.sheets, sheetName);
    var mappedDomains = _cacheLedgerSheetDomains_(sheetName);
    return mappedDomains.length ? mappedDomains.forEach(function (domain) {
        _cacheLedgerQueueDomain_(domain, source || "sheet:" + sheetName, reason || "sheet-mutation");
    }) : _cacheLedgerQueueDomain_("general", source || "sheet:" + sheetName, reason || "sheet-mutation"), source && _cacheLedgerUniquePush_(txn.sources, source), reason && _cacheLedgerUniquePush_(txn.reasons, reason), txn.mutationObserved = !0, {
        ok: !0, queued: !0, deferred: !0, sheetName, domains: mappedDomains.length ? mappedDomains : [
            "general"
        ], owner: APP_CACHE_INVALIDATION_LEDGER_CURRENT.owner, stamp: APP_CACHE_INVALIDATION_LEDGER_CURRENT.stamp
    };
}
function _cacheLedgerQueueWriteProfile_(name, payload) {
    var routeName = String(name || ""), n = routeName.toLowerCase(), matched = !1, exact = _appIsFnName_("_platformWriteInvalidationByMethod_") ? _platformWriteInvalidationByMethod_(routeName) : [];
    function add(domain) {
        matched = !0, _cacheLedgerQueueDomain_(domain, "write:" + (routeName || "write"), "route-mutation");
    }
    return exact && exact.length ? exact.forEach(add) : (/case|maindata|search/.test(n) && add("case"), /letter|tracking/.test(n) && add("letters"), /meeting/.test(n) && add("meeting"), /budget|import|yearsettings/.test(n) && add("budget"), /salary/.test(n) && (add("budget"), add("people")), /people|personnel|subcommittee/.test(n) && add("people"), /petition/.test(n) && (add("people"), add("case")), /admin.*user|user.*admin/.test(n) && (add("admin-users"), add("admin")), /admin/.test(n) && add("admin")), matched || add("general"), _cacheLedgerEnsureTxn_(name);
}
function _cacheLedgerShouldDefer_() {
    return _writeGatewayIsActive_() && !__APP_WRITE_INVALIDATION_FLUSHING__ && !(__APP_CACHE_LEDGER_TXN__ && __APP_CACHE_LEDGER_TXN__.flushing);
}
function _cacheLedgerIsFlushing_() {
    return !!(__APP_CACHE_LEDGER_TXN__ && __APP_CACHE_LEDGER_TXN__.flushing);
}
function _cacheLedgerMarkStamp_(entityName) {
    entityName = String(entityName || "default").trim().toLowerCase() || "default";
    var txn = _cacheLedgerEnsureTxn_(__APP_WRITE_GATEWAY_CHAIN__[0] || "write");
    return _cacheLedgerIsFlushing_() ? txn.bumpedStamps[entityName] ? !1 : (txn.bumpedStamps[entityName] = !0, !0) : !0;
}
function _cacheLedgerHasStamp_(entityName) {
    entityName = String(entityName || "default").trim().toLowerCase() || "default";
    var txn = __APP_CACHE_LEDGER_TXN__;
    return !!(_cacheLedgerIsFlushing_() && txn && txn.bumpedStamps && txn.bumpedStamps[entityName]);
}
function _cacheLedgerMarkCacheKey_(key) {
    if (key = String(key || ""), !key)
        return !1;
    var txn = _cacheLedgerEnsureTxn_(__APP_WRITE_GATEWAY_CHAIN__[0] || "write");
    return _cacheLedgerIsFlushing_() ? txn.removedCacheKeys[key] ? !1 : (txn.removedCacheKeys[key] = !0, _cacheLedgerUniquePush_(txn.cacheKeys, key), !0) : !0;
}
function _cacheLedgerReset_(rootWriteName) {
    return __APP_CACHE_LEDGER_TXN__ = _cacheLedgerNewTxn_(rootWriteName || "write"), __APP_CACHE_LEDGER_TXN__;
}
function _cacheLedgerFlush_(name, payload, options) {
    options = options || {};
    var txn = _cacheLedgerQueueWriteProfile_(name, payload), warnings = [], stampResults = {}, sheetResults = [], cache = null;
    if (txn.flushing)
        return {
            ok: !0, skipped: !0, reason: "already-flushing", owner: APP_CACHE_INVALIDATION_LEDGER_CURRENT.owner, stamp: APP_CACHE_INVALIDATION_LEDGER_CURRENT.stamp
        };
    txn.flushing = !0, txn.flushCount += 1, __APP_WRITE_INVALIDATION_FLUSHING__ = !0;
    try {
        var allStampKeys = txn.stampKeys.slice();
        txn.sheets.slice().forEach(function (sheetName) {
            try {
                _appIsFnName_("_sheetEntityCacheKeys_") && _sheetEntityCacheKeys_(sheetName).forEach(function (entityKey) {
                    entityKey = String(entityKey || "").trim().toLowerCase();
                    entityKey && allStampKeys.indexOf(entityKey) < 0 && allStampKeys.push(entityKey);
                });
            }
            catch (stampPlanErr) {
                warnings.push("stampPlan:" + String(stampPlanErr && stampPlanErr.message || stampPlanErr));
            }
        });
        if (allStampKeys.length && _appIsFnName_("_bumpEntityCacheStamps_"))
            try {
                stampResults = _bumpEntityCacheStamps_(allStampKeys);
            }
            catch (batchStampErr) {
                warnings.push("stampBatch:" + String(batchStampErr && batchStampErr.message || batchStampErr));
            }
        if (txn.domains.indexOf("budget") > -1)
            try {
                _appIsFnName_("_runtimeStateSet_") && _runtimeStateSet_("BudgetTypeSummaryDirty", "Y", 21600);
            }
            catch (e0) {
                warnings.push("budgetDirty:" + String(e0 && e0.message || e0));
            }
        try {
            _appIsFnName_("_current8MarkDirtyDomains_") && _current8MarkDirtyDomains_(txn.dirtyDomains.slice(), String((txn.reasons || [])[0] || name || "write"));
        }
        catch (e1) {
            warnings.push("dirtyDomains:" + String(e1 && e1.message || e1));
        }
        txn.stampKeys.slice().forEach(function (k) {
            try {
                _appIsFnName_("_AppCacheInvalidateDomain_") && (stampResults[k] = _AppCacheInvalidateDomain_(k));
            }
            catch (e2) {
                warnings.push("stamp:" + k + ":" + String(e2 && e2.message || e2));
            }
        }), txn.sheets.slice().forEach(function (sh) {
            try {
                _appIsFnName_("invalidateSheetCache_") && sheetResults.push(invalidateSheetCache_(sh));
            }
            catch (e3) {
                warnings.push("sheet:" + sh + ":" + String(e3 && e3.message || e3));
            }
        });
        try {
            cache = CacheService.getScriptCache(), txn.stampKeys.forEach(function (k) {
                [
                    k, k + ":list", k + ":search", k + ":summary", k + ":bundle"
                ].forEach(function (cacheKey) {
                    try {
                        cacheKey && _cacheLedgerMarkCacheKey_(cacheKey) && cache.remove(String(cacheKey));
                    }
                    catch (_cacheRemoveErr) { _appIgnoreExpected_("Code_00_PlatformCore.gs.ignored", _cacheRemoveErr); }
                });
            }), [
                "dashboard", "dashboard:bundle"
            ].forEach(function (cacheKey) {
                try {
                    _cacheLedgerMarkCacheKey_(cacheKey) && cache.remove(cacheKey);
                }
                catch (_dashboardCacheRemoveErr) { _appIgnoreExpected_("Code_00_PlatformCore.gs.ignored", _dashboardCacheRemoveErr); }
            });
        }
        catch (e4) {
            warnings.push("cacheService:" + String(e4 && e4.message || e4));
        }
        try {
            _appIsFnName_("_requestScopeReset_") && _requestScopeReset_({
                newRequest: !1,
                preserveMetrics: !0,
                invalidateSheets: txn.sheets.slice(),
                source: "write-ledger-flush"
            });
        }
        catch (e5) {
            warnings.push("requestScope:" + String(e5 && e5.message || e5));
        }
        txn.flushedAt = new Date().toISOString();
    }
    finally {
        txn.flushing = !1, __APP_WRITE_INVALIDATION_FLUSHING__ = !1;
    }
    return {
        ok: warnings.length === 0, owner: APP_CACHE_INVALIDATION_LEDGER_CURRENT.owner, stamp: APP_CACHE_INVALIDATION_LEDGER_CURRENT.stamp, transactionId: txn.id, rootWriteName: txn.rootWriteName, canonicalDomains: txn.domains.slice(), stampKeys: txn.stampKeys.slice(), sheets: txn.sheets.slice(), dirtyDomains: txn.dirtyDomains.slice(), removedCacheKeys: txn.cacheKeys.slice(), sources: txn.sources.slice(), reasons: txn.reasons.slice(), mutationObserved: !!txn.mutationObserved, flushCount: txn.flushCount, stampResults, sheetResults, recovery: !!options.recovery, warnings, elapsedMs: Math.max(0, Date.now() - Number(txn.startedAt || Date.now()))
    };
}
function _cacheInvalidationLedgerStatus_() {
    var txn = __APP_CACHE_LEDGER_TXN__;
    return {
        ok: !0, stamp: APP_CACHE_INVALIDATION_LEDGER_CURRENT.stamp, owner: APP_CACHE_INVALIDATION_LEDGER_CURRENT.owner, policy: APP_CACHE_INVALIDATION_LEDGER_CURRENT.policy, active: _writeGatewayIsActive_(), flushing: _cacheLedgerIsFlushing_(), transaction: txn ? {
            id: txn.id, rootWriteName: txn.rootWriteName, domains: txn.domains.slice(), sheets: txn.sheets.slice(), stampKeys: txn.stampKeys.slice(), dirtyDomains: txn.dirtyDomains.slice(), mutationObserved: !!txn.mutationObserved, flushCount: Number(txn.flushCount || 0), flushedAt: String(txn.flushedAt || "")
        } : null, rules: {
            oneRootLedger: !0, canonicalDomains: !0, uniqueStampPerTransaction: !0, sheetInvalidationDeferred: !0, failureRecovery: !0, uiDomChanged: !1, businessLogicChanged: !1
        }
    };
}
function _writeGatewayShouldDeferInvalidation_() {
    return _cacheLedgerShouldDefer_();
}
function _writeGatewayQueueInvalidationDomain_(domain) {
    return domain = String(domain || "").trim(), domain ? _cacheLedgerQueueDomain_(domain, "AppRepository.invalidateDomain", "repository-mutation") : null;
}
function _writeGatewayDeferredDomains_() {
    return __APP_CACHE_LEDGER_TXN__ ? __APP_CACHE_LEDGER_TXN__.domains.slice() : __APP_WRITE_INVALIDATION_QUEUE__.slice();
}
function _writeGatewayMarkCacheKey_(key) {
    return _cacheLedgerMarkCacheKey_(key);
}
function _writeGatewayResetInvalidationQueue_(rootWriteName) {
    __APP_WRITE_INVALIDATION_QUEUE__ = [], __APP_WRITE_INVALIDATION_CACHE_KEYS__ = {}, __APP_WRITE_INVALIDATION_FLUSHING__ = !1, rootWriteName ? _cacheLedgerReset_(rootWriteName) : __APP_CACHE_LEDGER_TXN__ = null;
}
AppBackendCore.cacheInvalidationLedgerStatus = _cacheInvalidationLedgerStatus_, AppRepository.cacheInvalidationLedgerStatus = _cacheInvalidationLedgerStatus_;
function _backendBoundaryEnter_(method, meta) {
    meta = meta || {};
    var ctx = {
        method: String(method || ""), mode: meta.write === !0 ? "write" : "read", domain: String(meta.domain || meta.group || "general"), routeOwner: String(meta.owner || "Code_20_Router"), startedAt: Date.now(), gatewayCalls: 0, rootGatewayCalls: 0, nestedGatewayCalls: 0, gatewayNames: [], domainOperations: [], violations: []
    };
    return __APP_BACKEND_BOUNDARY_STACK__.push(ctx), ctx;
}
function _backendBoundaryCurrent_() {
    return __APP_BACKEND_BOUNDARY_STACK__.length ? __APP_BACKEND_BOUNDARY_STACK__[__APP_BACKEND_BOUNDARY_STACK__.length - 1] : null;
}
function _backendBoundaryNoteGateway_(name, isRoot) {
    var ctx = _backendBoundaryCurrent_();
    if (!ctx)
        return null;
    if (ctx.mode === "read") {
        var code = "READ_ROUTE_WRITE_BOUNDARY_VIOLATION:" + String(ctx.method || "unknown");
        throw ctx.violations.push(code), new Error(code);
    }
    return ctx.gatewayCalls += 1, isRoot ? ctx.rootGatewayCalls += 1 : ctx.nestedGatewayCalls += 1, ctx.gatewayNames.push(String(name || "write")), ctx;
}
function _backendBoundaryNoteDomainWrite_(name) {
    var ctx = _backendBoundaryCurrent_();
    if (!ctx)
        return null;
    if (ctx.mode === "read") {
        var code = "READ_ROUTE_DOMAIN_WRITE_VIOLATION:" + String(ctx.method || "unknown");
        throw ctx.violations.push(code), new Error(code);
    }
    return ctx.domainOperations.push(String(name || "domain-write")), ctx;
}
function _backendBoundarySnapshot_(ctx) {
    return ctx = ctx || _backendBoundaryCurrent_(), ctx ? {
        ok: ctx.violations.length === 0, stamp: APP_BACKEND_BOUNDARY_CURRENT.stamp, owner: APP_BACKEND_BOUNDARY_CURRENT.owner, method: ctx.method, mode: ctx.mode, domain: ctx.domain, routeOwner: ctx.routeOwner, gatewayCalls: Number(ctx.gatewayCalls || 0), rootGatewayCalls: Number(ctx.rootGatewayCalls || 0), nestedGatewayCalls: Number(ctx.nestedGatewayCalls || 0), gatewayNames: ctx.gatewayNames.slice(), domainOperations: ctx.domainOperations.slice(), violations: ctx.violations.slice(), durationMs: Math.max(0, Date.now() - Number(ctx.startedAt || Date.now()))
    } : {
        ok: !0, inactive: !0, stamp: APP_BACKEND_BOUNDARY_CURRENT.stamp, owner: APP_BACKEND_BOUNDARY_CURRENT.owner
    };
}
function _backendBoundaryLeave_(ctx) {
    if (!ctx)
        return null;
    var idx = __APP_BACKEND_BOUNDARY_STACK__.lastIndexOf(ctx);
    return idx > -1 && __APP_BACKEND_BOUNDARY_STACK__.splice(idx, 1), _backendBoundarySnapshot_(ctx);
}
function _backendBoundaryAttachResult_(result, snapshot) {
    if (!result || typeof result != "object" || Array.isArray(result))
        return result;
    var meta = Object.assign({}, result.meta || {});
    return meta.backendBoundary = snapshot || _backendBoundarySnapshot_(), result.meta = meta, result;
}
function _writeGatewayIsActive_() {
    return __APP_WRITE_GATEWAY_DEPTH__ > 0;
}
function domainWrite_(name, payload, handler, successMsg, failureMsg) {
    if (typeof handler != "function")
        throw new Error("domainWrite_ ต้องรับ callback");
    if (!_writeGatewayIsActive_())
        return writeGateway_(name, payload, handler, successMsg, failureMsg);
    var operationName = String(name || "domain-write").trim() || "domain-write";
    _backendBoundaryNoteDomainWrite_(operationName);
    var normalized = _platformNormalizeResult_(handler(payload), successMsg, failureMsg);
    if (normalized && typeof normalized == "object" && !Array.isArray(normalized)) {
        var meta = Object.assign({}, normalized.meta || {});
        meta.domainWriteOwner = "domainWrite_", meta.domainWriteName = operationName, meta.domainWriteJoinedRoot = !0, meta.writeStamp = APP_BACKEND_BOUNDARY_CURRENT.stamp, normalized.meta = meta;
    }
    return normalized;
}
var APP_WRITE_CONTRACT_CURRENT = {
    stamp: "phase6-save-write-contract-current", owner: "writeGateway_", policy: "single-write-owner-lock-normalize-invalidate", uiDomChanged: !1, businessLogicChanged: !1
};
function _writeGatewayInvalidateAfterWrite_(name, payload, result) {
    return _cacheLedgerFlush_(name, payload, {
        resultOk: !result || result.ok !== !1
    });
}
var APP_RUNTIME_METADATA_E = Object.freeze({
    stamp: "runtime-metadata-p2-2026-07-25-r178",
    owner: "Code_00_PlatformCore.CurrentContract",
    defaultMode: "lean-production",
    requiredLeanKeys: ["writeOwner", "writeName", "writeRootName", "writeStamp", "writeLatencyMs", "cacheInvalidation"],
    diagnosticOnlyKeys: [
        "phaseBWriteFlowStamp", "phaseBWriteFlowContract", "phaseGCacheContractStamp", "phaseGCacheContract",
        "phaseHPerformanceStamp", "phaseHPerformanceContract", "phase6ProductionCleanStamp", "phase6ProductionCleanContract",
        "phase7TransitionalFallbackCleanupStamp", "phase7TransitionalFallbackCleanupContract", "writeDepth", "writeRoot", "writeChain",
        "productionContractP2"
    ]
});
function _runtimeMetadataDiagnosticsEnabledE_() {
    return !!(__APP_GLOBAL__ && __APP_GLOBAL__.__APP_RESPONSE_DIAGNOSTICS__ === !0);
}
function _writeGatewayAttachMetadataE_(meta, context) {
    meta = Object.assign({}, meta || {});
    context = context || {};
    var writeName = String(context.writeName || "write"), rootName = String(context.rootName || writeName), diagnostics = _runtimeMetadataDiagnosticsEnabledE_();
    meta.writeOwner = "writeGateway_";
    meta.writeName = writeName;
    meta.writeRootName = rootName;
    meta.writeStamp = APP_WRITE_CONTRACT_CURRENT.stamp;
    meta.writeLatencyMs = Math.max(0, Date.now() - Number(context.startedAt || Date.now()));
    APP_RUNTIME_METADATA_E.diagnosticOnlyKeys.forEach(function (key) { delete meta[key]; });
    return meta;
}


function writeGateway_(name, payload, handler, successMsg, failureMsg) {
    var started = Date.now(), writeName = String(name || "write").trim() || "write", isRoot = __APP_WRITE_GATEWAY_DEPTH__ === 0, chain;
    if (typeof handler != "function")
        throw new Error("writeGateway_ ต้องรับ callback");
    if (isRoot && /^api[A-Z0-9_]/.test(writeName) && !_backendBoundaryCurrent_()) {
        if (!_appIsFnName_("apiRouter") || typeof __APP_WRITE_GATEWAY_ROUTER_REENTRY__ !== "undefined" && __APP_WRITE_GATEWAY_ROUTER_REENTRY__ === !0)
            return err_("ไม่อนุญาตให้เรียก Write API โดยข้าม apiRouter", {
                errorCode: "ROUTER_WRITE_BOUNDARY_REQUIRED", writeOwner: "writeGateway_", writeName, boundaryOwner: "Code_20_Router", directInvocationBlocked: !0
            });
        try {
            __APP_WRITE_GATEWAY_ROUTER_REENTRY__ = !0;
            return apiRouter({
                method: writeName, payload: payload || {}, bridge: "writeGateway-direct-router-reentry", source: "writeGateway-direct-router-reentry"
            });
        }
        finally {
            __APP_WRITE_GATEWAY_ROUTER_REENTRY__ = !1;
        }
    }
    _backendBoundaryNoteGateway_(writeName, isRoot), isRoot && (__APP_WRITE_GATEWAY_CHAIN__ = [], _writeGatewayResetInvalidationQueue_(writeName)), chain = __APP_WRITE_GATEWAY_CHAIN__, chain.push(writeName), __APP_WRITE_GATEWAY_DEPTH__ += 1;
    function executeWrite_() {
        var raw = handler(payload), normalized = _platformNormalizeResult_(raw, successMsg, failureMsg);
        if (normalized && typeof normalized == "object" && !Array.isArray(normalized)) {
            var meta = Object.assign({}, normalized.meta || {});
            meta = _writeGatewayAttachMetadataE_(meta, {
                writeName: isRoot ? writeName : String(meta.writeName || writeName),
                rootName: String(chain[0] || writeName),
                payload: payload,
                startedAt: started,
                depth: __APP_WRITE_GATEWAY_DEPTH__,
                isRoot: isRoot,
                chain: chain
            });
            normalized.writeGateway = !0;
            normalized.writeOwner = "writeGateway_";
            normalized.writeName = isRoot ? writeName : String(normalized.writeName || writeName);
            if (normalized.ok !== !1)
                if (isRoot) {
                    var cacheInfo = _writeGatewayInvalidateAfterWrite_(writeName, payload, normalized);
                    meta.cacheInvalidation = Object.assign({}, meta.cacheInvalidation || {}, cacheInfo || {});
                    try {
                        normalized.data && typeof normalized.data == "object" && !Array.isArray(normalized.data) && (normalized.data.cacheInvalidation = normalized.data.cacheInvalidation || cacheInfo);
                    }
                    catch (_dataMetaErr) {
                        _recordWarning_("phase3.write.dataMeta", _dataMetaErr);
                    }
                }
                else
                    meta.cacheInvalidation = Object.assign({}, meta.cacheInvalidation || {}, {
                        ok: !0, skipped: !0, reason: "nested-write-joined-root", owner: "writeGateway_", rootWriteName: String(chain[0] || writeName), stamp: APP_BACKEND_BOUNDARY_CURRENT.stamp
                    });
            if (!normalized.ok && isRoot && _writeGatewayDeferredDomains_().length) {
                var failedResultRecovery = _writeGatewayInvalidateAfterWrite_(writeName, payload, normalized);
                failedResultRecovery.recovery = !0, failedResultRecovery.reason = "failed-result-after-repository-mutation", meta.cacheInvalidation = Object.assign({}, meta.cacheInvalidation || {}, failedResultRecovery);
            }
            normalized.meta = meta;
        }
        return normalized;
    }
    try {
        return isRoot ? withWriteLock_(writeName, executeWrite_) : executeWrite_();
    }
    catch (e) {
        _recordWarning_("phase3.writeGateway.error", e, {
            writeName, isRoot, writeDepth: __APP_WRITE_GATEWAY_DEPTH__
        });
        var recoveryInfo = null;
        if (isRoot && _writeGatewayDeferredDomains_().length)
            try {
                recoveryInfo = _writeGatewayInvalidateAfterWrite_(writeName, payload, null), recoveryInfo.recovery = !0, recoveryInfo.reason = "exception-after-repository-mutation";
            }
            catch (_recoveryErr) {
                _recordWarning_("phase3.writeGateway.cacheRecovery", _recoveryErr, {
                    writeName
                });
            }
        var phaseDWriteError = typeof _routerClassifyError_ == "function" ? _routerClassifyError_(writeName, {
            write: !0, csrf: !0, group: "write"
        }, e, "WRITE_GATEWAY_EXCEPTION") : null, failed = err_(phaseDWriteError && phaseDWriteError.message || e && e.message ? phaseDWriteError && phaseDWriteError.message || e.message : String(e), {
            writeOwner: "writeGateway_", writeName, writeRootName: String(chain[0] || writeName), writeStamp: APP_WRITE_CONTRACT_CURRENT.stamp, backendBoundaryStamp: APP_BACKEND_BOUNDARY_CURRENT.stamp, cacheInvalidation: recoveryInfo, writeReliabilityStamp: phaseDWriteError && phaseDWriteError.stamp || "phaseK-write-schema-unification-2026-07-02-r1", rawError: phaseDWriteError && phaseDWriteError.rawMessage || String(e && e.message || e)
        });
        return failed.errorCode = phaseDWriteError && phaseDWriteError.errorCode || "WRITE_GATEWAY_EXCEPTION", failed.writeGateway = !0, failed.writeOwner = "writeGateway_", failed.writeName = writeName, failed;
    }
    finally {
        __APP_WRITE_GATEWAY_DEPTH__ = Math.max(0, __APP_WRITE_GATEWAY_DEPTH__ - 1), chain.pop(), isRoot && __APP_WRITE_GATEWAY_DEPTH__ === 0 && (__APP_WRITE_GATEWAY_CHAIN__ = [], _writeGatewayResetInvalidationQueue_());
    }
}
function escapeHtml_(v) {
    return String(v || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function sanitizeRow_(obj) {
    var clean = {};
    return Object.keys(obj).forEach(function (k) {
        var v = obj[k];
        clean[k] = typeof v == "string" ? escapeHtml_(v) : v;
    }), clean;
}
function _shouldPersistSessionMeta_(sess, options) {
    if ((options = options || {}).persistMeta === !1)
        return !1;
    if (options.persistMeta === !0 || options.forcePersist === !0)
        return !0;
    sess = sess && typeof sess == "object" ? sess : {};
    var lastPersistMs = Date.parse(String(sess.persistedAt || sess.lastPersistedAt || ""));
    return !isFinite(lastPersistMs) || lastPersistMs <= 0 || Date.now() - lastPersistMs >= 1e3 * _SESSION_TOUCH_PERSIST_INTERVAL_;
}
function _sessionExpiryIso_(baseIso) {
    if (_appIsFnName_("_sessionExpiryDisabled_") && _sessionExpiryDisabled_())
        return _sessionPersistentUntilIso_();
    var baseMs = Date.parse(String(baseIso || ""));
    return (!isFinite(baseMs) || baseMs <= 0) && (baseMs = Date.now()), new Date(baseMs + 1e3 * _SESSION_TTL_).toISOString();
}
function _normalizeSessionEnvelope_(userObj) {
    var sess = Object.assign({}, userObj && typeof userObj == "object" ? userObj : {}), nowIso = _appNowIso_();
    return sess.issuedAt = String(sess.issuedAt || nowIso), sess.lastSeenAt = String(sess.lastSeenAt || nowIso), sess.touchedAt = nowIso, sess.persistedAt && (sess.persistedAt = String(sess.persistedAt)), sess.persistentSession = !(!_appIsFnName_("_sessionExpiryDisabled_") || !_sessionExpiryDisabled_()), sess.expiresAt = _sessionExpiryIso_(sess.lastSeenAt || nowIso), sess;
}
function _isSessionExpired_(sess) {
    if (!sess || typeof sess != "object")
        return !0;
    var expiresMs = Date.parse(String(sess.expiresAt || ""));
    if (!isFinite(expiresMs) || expiresMs <= 0) {
        var defaultBase = Date.parse(String(sess.lastSeenAt || sess.issuedAt || ""));
        if (!isFinite(defaultBase) || defaultBase <= 0)
            return !0;
        expiresMs = defaultBase + 1e3 * _SESSION_TTL_;
    }
    return expiresMs <= Date.now();
}
function _appSha256Hex_(raw) {
    return raw ? Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(raw), Utilities.Charset.UTF_8).map(function (b) {
        var v = (b < 0 ? b + 256 : b).toString(16);
        return v.length === 1 ? "0" + v : v;
    }).join("") : "";
    var bytes;
}
function _sessionTokenFingerprintForLog_(token) {
    try {
        return _appSha256Hex_(String(token || "")).slice(0, 12);
    }
    catch (_e) {
        return "unavailable";
    }
}
function _storeSession_(token, userObj, options) {
    if (!(token = String(token || "")))
        return !1;
    var normalized = _normalizeSessionEnvelope_(userObj || {}), persistMeta = _shouldPersistSessionMeta_(normalized, options || {});
    persistMeta && (normalized.persistedAt = _appNowIso_());
    try {
        persistMeta && _appIsFnName_("_persistSessionMeta_") && _persistSessionMeta_(token, normalized);
    }
    catch (_e) {
        _recordWarning_("ec", _e), _logWarn_("session.persistMeta", {
            tokenFingerprint: _sessionTokenFingerprintForLog_(token), error: String(_e && _e.message || _e)
        });
    }
    try {
        safeCachePut_(_AppScriptCache_(), "sess_" + token, normalized, _SESSION_TTL_);
    }
    catch (e) {
        _recordWarning_("ec", e), _logWarn_("session.cachePut", {
            tokenFingerprint: _sessionTokenFingerprintForLog_(token), error: String(e && e.message || e)
        });
    }
    return !0;
}
function _getSession_(token) {
    if (!(token = String(token || "")))
        return null;
    try {
        var raw = _AppScriptCache_().get("sess_" + token);
        if (raw) {
            var cached = JSON.parse(raw);
            return _isSessionExpired_(cached) ? (_clearSession_(token), null) : cached;
        }
    }
    catch (e) {
        _recordWarning_("ec", e), _logWarn_("session.cacheGet", {
            tokenFingerprint: _sessionTokenFingerprintForLog_(token), error: String(e && e.message || e)
        });
    }
    try {
        if (_appIsFnName_("_recoverSessionFromMeta_")) {
            var recovered = _recoverSessionFromMeta_(token);
            if (recovered) {
                if (_isSessionExpired_(recovered))
                    return _clearSession_(token), null;
                try {
                    safeCachePut_(_AppScriptCache_(), "sess_" + token, recovered, _SESSION_TTL_);
                }
                catch (_eWarm) {
                    _recordWarning_("ec", _eWarm), _logWarn_("session.cacheWarm", {
                        tokenFingerprint: _sessionTokenFingerprintForLog_(token), error: String(_eWarm && _eWarm.message || _eWarm)
                    });
                }
                return recovered;
            }
        }
    }
    catch (_e2) {
        _recordWarning_("ec", _e2), _logWarn_("session.recoverMeta", {
            tokenFingerprint: _sessionTokenFingerprintForLog_(token), error: String(_e2 && _e2.message || _e2)
        });
    }
    return null;
}
function _clearSession_(token) {
    token = String(token || "");
    try {
        _AppScriptCache_().remove("sess_" + token);
    }
    catch (e) {
        _recordWarning_("ec", e), _logWarn_("session.cacheRemove", {
            tokenFingerprint: _sessionTokenFingerprintForLog_(token), error: String(e && e.message || e)
        });
    }
    try {
        _appIsFnName_("_clearSessionMeta_") && _clearSessionMeta_(token);
    }
    catch (_e) {
        _recordWarning_("ec", _e), _logWarn_("session.clearMeta", {
            tokenFingerprint: _sessionTokenFingerprintForLog_(token), error: String(_e && _e.message || _e)
        });
    }
    return !0;
}
function _rotateSessionToken_(oldToken, sess, payload, reason) {
    if (!(oldToken = String(oldToken || "")) || !sess)
        throw new Error("ไม่พบ session สำหรับหมุน token");
    var nextToken = Utilities.getUuid(), nextSess = Object.assign({}, sess || {}), csrf;
    try {
        _appIsFnName_("_attachSessionBinding_") && _attachSessionBinding_(nextSess, payload || {});
    }
    catch (_bindingErr) {
        _recordWarning_("ec", _bindingErr);
    }
    nextSess.tokenRotatedAt = new Date().toISOString(), nextSess.tokenRotationReason = String(reason || "production"), _storeSession_(nextToken, nextSess, {
        persistMeta: !0
    });
    try {
        _clearSession_(oldToken);
    }
    catch (_clearOldErr) {
        _recordWarning_("ec", _clearOldErr), _logWarn_("session.rotate.clearOld", {
            tokenFingerprint: _sessionTokenFingerprintForLog_(oldToken), error: String(_clearOldErr && _clearOldErr.message || _clearOldErr)
        });
    }
    return {
        token: nextToken, csrfToken: _issueCsrfToken_(nextToken, nextSess), user: nextSess
    };
}
function _apiRouterWriteMethods_() {
    var out = {};
    try {
        if (_appIsFnName_("_apiRouteRegistry_")) {
            var registry = _apiRouteRegistry_() || {};
            Object.keys(registry).forEach(function (name) {
                var meta;
                (registry[name] || {}).write === !0 && (out[name] = !0);
            });
        }
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
    return out;
}
function _isWriteApiMethod_(name) {
    if (!(name = String(name || "").trim()))
        return !1;
    try {
        if (_appIsFnName_("_apiRouteMeta_")) {
            var meta = _apiRouteMeta_(name);
            if (meta)
                return meta.write === !0;
        }
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
    return !!_apiRouterWriteMethods_()[name];
}
function _checkGeminiRateLimit_(token) {
    var key = "rl_gem_" + (token || "anon"), cache = _AppScriptCache_();
    try {
        var c = parseInt(cache.get(key) || "0", 10);
        if (c >= 15)
            throw new Error("เรียกใช้ AI บ่อยเกินไป กรุณารอสักครู่");
        cache.put(key, String(c + 1), 60);
    }
    catch (e) {
        if (_recordWarning_("ec", e), e.message.indexOf("บ่อยเกินไป") !== -1)
            throw e;
    }
}
function apiLogout(payload) {
    try {
        payload = payload || {};
        var token = String(payload && (payload.token || payload._token) || "").trim();
        return payload.resumeHandle && _appIsFnName_("_revokeSessionResumeHandle_") && _revokeSessionResumeHandle_(payload.resumeHandle), token && _clearSession_(token), ok_({
            loggedOut: !0, tokenCleared: !!token, resumeHandleCleared: !!payload.resumeHandle
        });
    }
    catch (e) {
        return _recordWarning_("ec", e), err_(e.message);
    }
}
function _payloadValue_(payload, keys) {
    for (var list = Array.isArray(keys) ? keys : [
        keys
    ], i = 0; i < list.length; i++) {
        var key = list[i];
        if (payload && payload[key] !== void 0 && payload[key] !== null && payload[key] !== "")
            return payload[key];
    }
    return "";
}
function isSoftDeletedRow_(r) {
    if (!r || typeof r != "object")
        return !1;
    var v = r.isDeleted;
    if (v === !0)
        return !0;
    if (typeof v == "string") {
        var s = v.trim().toLowerCase();
        if (s === "true" || s === "1" || s === "yes" || s === "y")
            return !0;
    }
    return !1;
}
function _renderVue3JsonSafe_(value, fallback) {
    try {
        return JSON.stringify(value === void 0 ? fallback : value);
    }
    catch (_e) {
        try {
            _appIsFnName_("_recordWarning_") && _recordWarning_("render.json.safe", _e);
        }
        catch (_ignore) {
            _appIgnore_(_ignore, "c6.C00:1951");
        }
        return JSON.stringify(fallback === void 0 ? {} : fallback);
    }
}
function _renderVue3InvokeSafe_(name, args, fallback) {
    try {
        var root = typeof globalThis != "undefined" ? globalThis : this, fn = root && root[name];
        if (typeof fn == "function")
            return fn.apply(root, args || []);
    }
    catch (e) {
        try {
            _appIsFnName_("_recordWarning_") && _recordWarning_("render.invoke." + name, e);
        }
        catch (_ignore) {
            _appIgnore_(_ignore, "c6.C00:1967");
        }
    }
    return fallback;
}
function _renderVue3BootstrapDefault_(e) {
    var p = "dashboard";
    try {
        var q = e && e.parameter ? e.parameter : {};
        p = String(q.page || q.view || q.route || "dashboard").trim() || "dashboard";
    }
    catch (_e) {
        p = "dashboard";
    }
    return {
        ok: !0, page: p, requestedPage: p, session: null, user: null, source: "Code_00_PlatformCore.renderVue3App_", generatedAt: new Date().toISOString()
    };
}
function renderVue3App_(e) {
    var title = "ระบบบริหารจัดการเรื่องพิจารณา", template = HtmlService.createTemplateFromFile("Index");
    template.appTitle = title;
    var bootstrap = _renderVue3InvokeSafe_("_vue3SessionBootstrapCanonical_", [
        e, {
            securityGate: !1
        }
    ], null);
    return bootstrap || (bootstrap = _renderVue3InvokeSafe_("_vue3ResolveSessionBootstrap_", [
        e
    ], _renderVue3BootstrapDefault_(e))), template.bootstrapJson = _renderVue3JsonSafe_(bootstrap, _renderVue3BootstrapDefault_(e)), template.assetManifestJson = _renderVue3InvokeSafe_("getAppAssetManifestJson_", [], null) || _renderVue3JsonSafe_({}, {}), template.deferredScriptMapJson = _renderVue3InvokeSafe_("getAppDeferredScriptMapJson_", [], null) || _renderVue3JsonSafe_({}, {}), template.coreRuntimeFilesJson = _renderVue3InvokeSafe_("getAppCoreRuntimeFilesJson_", [], null) || _renderVue3JsonSafe_([], []), template.permissionMatrixJson = _renderVue3InvokeSafe_("getAppPermissionMatrixJson_", [], null) || _renderVue3JsonSafe_({}, {}), template.evaluate().setTitle(title).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}
function _cloudflareApiRequestId_(value) {
    value = String(value || "").trim();
    return /^[A-Za-z0-9_.:-]{1,180}$/.test(value) ? value : "";
}
function _cloudflareApiSafeError_(error) {
    var message = "GAS API request failed", code = "GAS_API_REQUEST_FAILED";
    try {
        message = String(error && (error.message || error.error || error) || message);
        code = String(error && (error.code || error.errorCode) || code);
    }
    catch (_e) {
        void _e;
    }
    return { message: message, code: code };
}
function _cloudflareJsonOutput_(value) {
    var json = "{}";
    try {
        json = JSON.stringify(value == null ? {} : value);
    }
    catch (error) {
        json = JSON.stringify({ ok: !1, result: null, error: { message: "ไม่สามารถแปลงผลลัพธ์ GAS เป็น JSON ได้", code: "CLOUDFLARE_GAS_SERIALIZE_FAILED" } });
    }
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
function _cloudflareProxySecret_() {
    try {
        return String(_scriptProp_("CLOUDFLARE_PROXY_SECRET", "") || "");
    }
    catch (_e) {
        return "";
    }
}
function _cloudflareSecureEqual_(left, right) {
    left = String(left || "");
    right = String(right || "");
    if (left.length < 32 || right.length < 32)
        return !1;
    try {
        var a = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, left, Utilities.Charset.UTF_8);
        var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, right, Utilities.Charset.UTF_8);
        if (!a || !b || a.length !== b.length)
            return !1;
        var diff = 0;
        for (var i = 0; i < a.length; i++)
            diff |= (a[i] & 255) ^ (b[i] & 255);
        return diff === 0;
    }
    catch (_e) {
        return !1;
    }
}
function _invokeCloudflareApiPost_(fn, args) {
    fn = String(fn || "").trim();
    args = args == null ? {} : args;
    if (fn === "apiRouter") return apiRouter(args);
    if (fn === "apiLogin") return apiLogin(args);
    if (fn === "apiSessionResume") return apiSessionResume(args);
    if (fn === "apiSessionCheck") return apiSessionCheck(args);
    if (fn === "apiLogout") return apiLogout(args);
    if (fn === "getDeferredInclude") return getDeferredInclude(args);
    throw Object.assign(new Error("Cloudflare transport function not allowed: " + fn), { code: "CLOUDFLARE_GAS_FN_DENIED" });
}
function _handleCloudflareApiPost_(e) {
    var params = e && e.parameter || {};
    var requestId = _cloudflareApiRequestId_(params.id);
    var fn = String(params.fn || "").trim();
    var expectedSecret = _cloudflareProxySecret_();
    var suppliedSecret = String(params.proxySecret || "");
    if (expectedSecret.length < 32) {
        return _cloudflareJsonOutput_({ ok: !1, result: null, error: { message: "GAS Script Property CLOUDFLARE_PROXY_SECRET ยังไม่ได้ตั้งค่า", code: "CLOUDFLARE_PROXY_SECRET_NOT_CONFIGURED" }, meta: { requestId: requestId, release: APP_DEPLOY_RELEASE.stamp } });
    }
    if (!_cloudflareSecureEqual_(suppliedSecret, expectedSecret)) {
        return _cloudflareJsonOutput_({ ok: !1, result: null, error: { message: "Cloudflare proxy secret ไม่ถูกต้อง", code: "CLOUDFLARE_PROXY_UNAUTHORIZED" }, meta: { requestId: requestId, release: APP_DEPLOY_RELEASE.stamp } });
    }
    if (!requestId) {
        return _cloudflareJsonOutput_({ ok: !1, result: null, error: { message: "Cloudflare request id ไม่ถูกต้อง", code: "CLOUDFLARE_REQUEST_ID_INVALID" }, meta: { release: APP_DEPLOY_RELEASE.stamp } });
    }
    var args = {};
    try {
        args = params.args ? JSON.parse(String(params.args)) : {};
    }
    catch (parseError) {
        return _cloudflareJsonOutput_({ ok: !1, result: null, error: { message: "Cloudflare API payload ไม่ใช่ JSON ที่ถูกต้อง", code: "CLOUDFLARE_PAYLOAD_INVALID" }, meta: { requestId: requestId, release: APP_DEPLOY_RELEASE.stamp } });
    }
    try {
        var result = _invokeCloudflareApiPost_(fn, args);
        return _cloudflareJsonOutput_({ ok: !0, result: result, error: null, meta: { requestId: requestId, fn: fn, transport: "cloudflare-pages-function", release: APP_DEPLOY_RELEASE.stamp } });
    }
    catch (error) {
        return _cloudflareJsonOutput_({ ok: !1, result: null, error: _cloudflareApiSafeError_(error), meta: { requestId: requestId, fn: fn, transport: "cloudflare-pages-function", release: APP_DEPLOY_RELEASE.stamp } });
    }
}
function doPost(e) {
    var mode = String(e && e.parameter && e.parameter.mode || "").trim().toLowerCase();
    if (mode === "cloudflare-api-post") return _handleCloudflareApiPost_(e);
    return _cloudflareJsonOutput_({ ok: !1, result: null, error: { message: "Unsupported POST mode", code: "POST_MODE_UNSUPPORTED" }, meta: { release: APP_DEPLOY_RELEASE.stamp } });
}
function doGet(e) {
    return renderVue3App_(e);
}
AppDomain.Formatters = AppDomain.Formatters || {}, AppDomain.Formatters.normalizeDateOutput = AppDomain.Formatters.normalizeDateOutput || function (value) {
    if (!value && value !== 0)
        return "";
    var d = value;
    return typeof value == "number" && value > 3e4 && value < 7e4 ? d = new Date(Math.round(86400 * (value - 25569) * 1e3)) : value instanceof Date || (d = new Date(value)), d instanceof Date && !isNaN(d.getTime()) ? Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd") : String(value || "");
}, AppDomain.Formatters.getFiscalYearFromDate = AppDomain.Formatters.getFiscalYearFromDate || function (value) {
    var d = value instanceof Date ? value : new Date(value || new Date);
    return isNaN(d.getTime()) && (d = new Date), Number(d.getMonth() >= 9 ? d.getFullYear() + 544 : d.getFullYear() + 543);
}, AppDomain.Formatters.formatCaseNo = AppDomain.Formatters.formatCaseNo || function (runningNo, dateValue, explicitYear) {
    var n = String(runningNo == null ? "" : runningNo).trim(), by = String(explicitYear == null ? "" : explicitYear).trim();
    return by || (by = String(AppDomain.Formatters.getFiscalYearFromDate(dateValue || new Date))), [
        n, by
    ].filter(Boolean).join("/");
};
function _routerNumberProp_(name, defaultValue, minValue, maxValue) {
    var raw = "";
    try {
        _appIsFnName_("_scriptProp_") ? raw = _scriptProp_(name, "") : typeof PropertiesService != "undefined" && (raw = PropertiesService.getScriptProperties().getProperty(name) || "");
    }
    catch (_e) {
        raw = "";
    }
    var n = Number(raw || defaultValue);
    return isFinite(n) || (n = Number(defaultValue) || 0), minValue = Number(minValue), maxValue = Number(maxValue), isFinite(minValue) && (n = Math.max(minValue, n)), isFinite(maxValue) && (n = Math.min(maxValue, n)), Math.floor(n);
}
function _buildDigestHex_(input) {
    var digest;
    return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(input || ""), Utilities.Charset.UTF_8).map(function (b) {
        var v = (b < 0 ? b + 256 : b).toString(16);
        return v.length === 1 ? "0" + v : v;
    }).join("");
}
function _cacheGetJson_(key) {
    if (!key)
        return null;
    var value = _AppCacheGetJson_("router:" + String(key));
    try {
        _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("domainBundleCache", value != null, 1);
    }
    catch (_cacheMetricErr) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("performance.domainCache.metric", _cacheMetricErr);
    }
    return value;
}
function _cachePutJson_(key, value, ttlSeconds) {
    if (!key)
        return !1;
    var stored = _AppCachePutJson_("router:" + String(key), value, Math.max(30, Number(ttlSeconds || 120)));
    try {
        stored && _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("domainBundleCacheWrite", !0, 1);
    }
    catch (_cacheMetricErr) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("performance.domainCache.writeMetric", _cacheMetricErr);
    }
    return stored;
}
function _invalidateDerivedCaches_(domain, reason) {
    if (domain = _cacheLedgerCanonicalDomain_(domain), reason = String(reason || domain + "-write"), _cacheLedgerShouldDefer_())
        return _cacheLedgerQueueDomain_(domain, "derived-cache-helper", reason);
    var txnWas = __APP_CACHE_LEDGER_TXN__;
    try {
        return _cacheLedgerReset_(reason), _cacheLedgerQueueDomain_(domain, "derived-cache-helper-direct", reason), _cacheLedgerFlush_(reason, {}, {
            direct: !0
        });
    }
    finally {
        __APP_CACHE_LEDGER_TXN__ = txnWas;
    }
}
function _invalidateDerivedCacheDomains_(domains, reason) {
    domains = Array.isArray(domains) ? domains : [domains];
    var unique = [], results = {};
    domains.forEach(function (domain) { domain = String(domain || "").trim(); domain && unique.indexOf(domain) < 0 && unique.push(domain); });
    unique.forEach(function (domain) { results[domain] = _invalidateDerivedCaches_(domain, reason || domain + "-write"); });
    return { ok: unique.every(function (domain) { var r = results[domain]; return !(r && r.ok === !1); }), owner: "Code_00_PlatformCore._invalidateDerivedCacheDomains_", domains: unique, reason: String(reason || ""), results: results };
}
function _invalidateCaseDerivedCaches_(reason) { return _invalidateDerivedCacheDomains_(["case"], reason || "case-write"); }
function _invalidateLettersDerivedCaches_(reason) { return _invalidateDerivedCacheDomains_(["letters"], reason || "letters-write"); }
function _invalidateMeetingDerivedCaches_(reason) { return _invalidateDerivedCacheDomains_(["meeting"], reason || "meeting-write"); }
function _invalidateBudgetDerivedCaches_(reason) { return _invalidateDerivedCacheDomains_(["budget"], reason || "budget-write"); }
function _invalidateAdminDerivedCaches_(reason) { return _invalidateDerivedCacheDomains_(["admin"], reason || "admin-write"); }
function _dashboardCacheScope_(payload, sess) {
    return payload = payload || {}, sess = sess || {}, {
        r: String(sess.role || payload.userRole || "viewer").toLowerCase(), u: String(sess.username || sess.user || payload.userName || "").toLowerCase(), fy: String(payload.fy || payload.budgetFy || payload.defaultBudgetFY || ""), l: Math.max(0, Math.min(Number(payload.caseLimit || 0) || 0, 120)), b: payload.includeBudget === !0 ? 1 : 0, c: payload.includeCases === !0 ? 1 : 0, mr: payload.includeMeetingRows === !0 ? 1 : 0, ro: payload.includeReportOptions === !0 ? 1 : 0, s: payload.includeSchema === !0 ? 1 : 0, h: payload.includeHealth === !0 ? 1 : 0, rt: String(payload.reportType || "all"), q: String(payload.reportQuery || payload.query || "")
    };
}
function _dashboardBundleCacheKey_(payload, sess) {
    var scope = _dashboardCacheScope_(payload, sess), stamps = [
        "dashboard", "case", "letters", "budget", "meeting"
    ].map(function (entity) {
        return String(entity) + ":" + String(_routerEntityCacheStamp_(entity) || "current");
    }).join("|");
    return "dash_bundle_perf_current_" + _buildDigestHex_(stamps) + "_" + _buildDigestHex_(JSON.stringify(scope));
}

/**
 * Performance F: share summary-only Dashboard bundles across users of the same
 * role.  The bundle contains no user-specific rows in this mode and the key is
 * still bound to all domain entity stamps, so every successful write naturally
 * moves readers to a new cache generation.
 */
function _dashboardSharedBundleCacheKey_(payload, sess) {
    payload = payload || {};
    sess = sess || {};
    var summaryOnly = payload.includeCases !== !0 &&
        payload.includeMeetingRows !== !0 &&
        payload.includeReportOptions !== !0 &&
        payload.includeSchema !== !0 &&
        payload.includeHealth !== !0 &&
        !String(payload.reportQuery || payload.query || "").trim();
    if (!summaryOnly)
        return "";
    var stamps = ["dashboard", "case", "letters", "budget", "meeting"].map(function (entity) {
        return String(entity) + ":" + String(_routerEntityCacheStamp_(entity) || "current");
    }).join("|");
    var scope = {
        role: String(sess.role || payload.userRole || "viewer").toLowerCase(),
        fy: String(payload.fy || payload.budgetFy || payload.defaultBudgetFY || ""),
        includeBudget: payload.includeBudget === !0 ? 1 : 0,
        mode: "summary-only-r161"
    };
    return "dash_bundle_shared_summary_r161_" + _buildDigestHex_(stamps) + "_" + _buildDigestHex_(JSON.stringify(scope));
}
function ensureAuditLogSchema_() {
    if (typeof AppRepository == "undefined" || !AppRepository || typeof AppRepository.ensureSheetWithHeaders != "function")
        throw new Error("AUDIT_REPOSITORY_OWNER_UNAVAILABLE");
    return AppRepository.ensureSheetWithHeaders("AuditLog", ["timestamp", "action", "user", "detail"], {
        domain: "audit",
        frozenRows: 1,
        normalizeHeader: function (value) { return String(value == null ? "" : value).trim().toLowerCase(); }
    }).sheet;
}
function _enterpriseAuditWrite_(rows) {
    if (!(rows = Array.isArray(rows) ? rows : []).length)
        return 0;
    var lock = null;
    try {
        !(lock = typeof LockService != "undefined" && LockService.getDocumentLock ? LockService.getDocumentLock() : null) && typeof LockService != "undefined" && LockService.getScriptLock && (lock = LockService.getScriptLock()), lock && lock.waitLock(_appIsFnName_("_routerNumberProp_") ? _routerNumberProp_("AUDIT_LOG_LOCK_WAIT_MS", 8e3, 1e3, 3e4) : 8e3);
        ensureAuditLogSchema_();
        return AppRepository.appendRangeValues("AuditLog", rows, { domain: "audit", invalidate: !1 }).rows;
    }
    finally {
        try { lock && lock.releaseLock(); }
        catch (_releaseErr) { _appIsFnName_("_recordWarning_") && _recordWarning_("audit.lock.release", _releaseErr); }
    }
}
function _routerAuditSheetWriteEnabled_() {
    try {
        var raw = _appIsFnName_("_scriptProp_") ? String(_scriptProp_("AUDIT_SHEET_WRITE_ENABLED", "N") || "N") : "N";
        return /^(1|true|yes|y|on)$/i.test(String(raw || "").trim());
    }
    catch (_auditPropErr) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _auditPropErr, {
            file: "C20"
        }), !1;
    }
}
function logAudit_(action, detail) {
    try {
        var safeDetail = _appIsFnName_("_redactSecurityAuditValue_") ? _redactSecurityAuditValue_(detail || {}) : detail || {}, entry = {
            ts: new Date().toISOString(), action: String(action || ""), detail: safeDetail
        }, user = "";
        if (detail && typeof detail == "object" && (user = String(detail.user || detail.username || detail.email || "")), !_routerAuditSheetWriteEnabled_()) {
            try {
                _appIsFnName_("_serverLog_") && _serverLog_("info", "audit." + String(action || "event"), {
                    action: entry.action, user, detail: safeDetail
                });
            }
            catch (_logOnlyErr) {
                _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _logOnlyErr) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
                    error: String(_logOnlyErr && _logOnlyErr.message || _logOnlyErr)
                });
            }
            return {
                ok: !0, sheetWrite: !1
            };
        }
        return _enterpriseAuditWrite_([
            [
                entry.ts, entry.action, user, _safeJsonStringify_(safeDetail)
            ]
        ]), {
            ok: !0, sheetWrite: !0
        };
    }
    catch (e) {
        try {
            return !1;
        }
        catch (_e2) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e2);
        }
    }
}
var __APP_API_PERF_RELEASE_KEY__ = String(APP_DEPLOY_RELEASE && APP_DEPLOY_RELEASE.sourceFingerprint || "unknown-release").replace(/[^A-Za-z0-9_\-]/g, "_").substring(0, 80), __APP_API_PERF_CACHE_KEY__ = "APP_API_PERF_SAMPLES_" + __APP_API_PERF_RELEASE_KEY__, __APP_API_PERF_BASELINE_CACHE_PREFIX__ = "APP_API_PERF_BASELINE_" + __APP_API_PERF_RELEASE_KEY__ + "_", __APP_API_PERF_SAMPLE_LIMIT__ = 220, __APP_API_PERF_BASELINE_METHOD_LIMIT__ = 64, __APP_API_PERF_TTL_SECONDS__ = 21600;
var __APP_PERFORMANCE_BASELINE_PLAN__ = Object.freeze({
    stamp: "performance-baseline-release-isolated-correlated-2026-08-06-r224",
    releaseKey: __APP_API_PERF_RELEASE_KEY__,
    coldSamplesPerMethod: 10,
    warmSamplesPerMethod: 20,
    sampleTargets: APP_PRODUCTION_MEASUREMENT_GATE_CURRENT.sampleTargets,
    methods: Object.freeze([
        "apiLogin",
        "apiGetDashboardBundle",
        "apiSearchCasesLite",
        "apiGetCommitteeMeetingSystem",
        "apiGetTracking",
        "apiBudgetGetSummary"
    ]),
    metrics: Object.freeze([
        "durationMs",
        "rowsRead",
        "rowsReturned",
        "cellsRead",
        "serviceReads",
        "spreadsheetServiceOpens",
        "sheetResolveCalls",
        "headerReads",
        "fallbackReadsSuppressed",
        "projectedColumnsRead",
        "fullWidthColumnsAvoided",
        "payloadBytes",
        "cacheHit",
        "cacheHits",
        "cacheMisses",
        "requestId",
        "baselineRunId",
        "loginRateLimitMs",
        "loginPrincipalLookupMs",
        "loginPasswordVerifyMs",
        "loginSessionIssueMs",
        "loginPrincipalDirectoryCacheHit",
        "apiCallsPerJourney"
    ]),
    noPayloadLogging: !0,
    noCredentialsLogging: !0,
    boundedCacheOnly: !0,
    latestRunOnly: !0
});
function _apiPerfJsonParse_(text, defaultValue) {
    try {
        return JSON.parse(String(text || ""));
    }
    catch (_e) {
        return defaultValue;
    }
}
function _apiPerfFlag_(name, defaultValue) {
    try {
        var raw = _appIsFnName_("_scriptProp_") ? String(_scriptProp_(String(name || ""), defaultValue ? "Y" : "N") || "") : defaultValue ? "Y" : "N";
        return /^(1|true|yes|y|on)$/i.test(String(raw || "").trim());
    }
    catch (_e) {
        return !!defaultValue;
    }
}
function _apiPerfSamplingEnabled_() {
    return _apiPerfFlag_("API_PERF_SAMPLE_ENABLED", !0);
}
function _apiPerfSafeLabel_(value, maxLength) {
    return String(value == null ? "" : value).replace(/[\r\n\t]/g, " ").trim().substring(0, Math.max(1, Number(maxLength || 80)));
}
function _apiPerfPercentile_(values, percentile) {
    values = (Array.isArray(values) ? values : []).map(Number).filter(function (value) {
        return isFinite(value) && value >= 0;
    }).sort(function (a, b) {
        return a - b;
    });
    if (!values.length)
        return 0;
    var rank = Math.max(0, Math.min(values.length - 1, Math.ceil(Number(percentile || 0) / 100 * values.length) - 1));
    return Number(values[rank] || 0);
}
function _apiPerfAverage_(values) {
    values = (Array.isArray(values) ? values : []).map(Number).filter(function (value) {
        return isFinite(value) && value >= 0;
    });
    if (!values.length)
        return 0;
    return Math.round(values.reduce(function (sum, value) {
        return sum + value;
    }, 0) / values.length * 100) / 100;
}
function _apiPerfTargetForMethod_(method) {
    var target = __APP_PERFORMANCE_BASELINE_PLAN__.sampleTargets && __APP_PERFORMANCE_BASELINE_PLAN__.sampleTargets[method] || {};
    return {
        cold: Math.max(1, Number(target.cold || __APP_PERFORMANCE_BASELINE_PLAN__.coldSamplesPerMethod || 10)),
        warm: Math.max(1, Number(target.warm || __APP_PERFORMANCE_BASELINE_PLAN__.warmSamplesPerMethod || 20))
    };
}
function _apiPerfLatestRunRows_(rows) {
    rows = (Array.isArray(rows) ? rows : []).filter(function (row) {
        return row && String(row.baselineRunId || "");
    }).sort(function (a, b) {
        return String(b && b.at || "").localeCompare(String(a && a.at || ""));
    });
    var latestRunId = rows.length ? String(rows[0].baselineRunId || "") : "";
    return {
        latestRunId: latestRunId,
        rows: latestRunId ? rows.filter(function (row) { return String(row && row.baselineRunId || "") === latestRunId; }) : []
    };
}
function _apiPerfCacheClass_(sample) {
    sample = sample || {};
    var explicit = _apiPerfSafeLabel_(sample.baselineMode || "", 24).toLowerCase();
    if (explicit)
        return explicit;
    if (sample.cacheBypassRequested)
        return "cold";
    if (sample.cacheHit)
        return "warm";
    return "observed";
}
function _apiPerfReadSamples_() {
    try {
        var cache = _AppScriptCache_(), rows = cache ? _apiPerfJsonParse_(cache.get(__APP_API_PERF_CACHE_KEY__), []) : [];
        return Array.isArray(rows) ? rows : [];
    }
    catch (_e) {
        return [];
    }
}
function _apiPerfBaselineMethodCacheKey_(method) {
    return __APP_API_PERF_BASELINE_CACHE_PREFIX__ + String(method || "").replace(/[^A-Za-z0-9_\-]/g, "_").substring(0, 96);
}
function _apiPerfReadBaselineSamples_(methods) {
    try {
        var cache = _AppScriptCache_(), rows = [];
        if (!cache)
            return rows;
        (Array.isArray(methods) ? methods : __APP_PERFORMANCE_BASELINE_PLAN__.methods).forEach(function (method) {
            var stored = _apiPerfJsonParse_(cache.get(_apiPerfBaselineMethodCacheKey_(method)), []);
            Array.isArray(stored) && (rows = rows.concat(stored));
        });
        return rows.sort(function (a, b) {
            return String(b && b.at || "").localeCompare(String(a && a.at || ""));
        });
    }
    catch (_e) {
        return [];
    }
}
function _apiPerfWriteBaselineSample_(item) {
    try {
        item = item || {};
        var method = String(item.method || ""), allowed = (__APP_PERFORMANCE_BASELINE_PLAN__.methods || []).indexOf(method) >= 0;
        if (!allowed || !String(item.baselineRunId || ""))
            return !1;
        var cache = _AppScriptCache_();
        if (!cache)
            return !1;
        var key = _apiPerfBaselineMethodCacheKey_(method), rows = _apiPerfJsonParse_(cache.get(key), []);
        rows = Array.isArray(rows) ? rows : [];
        var requestId = String(item.requestId || "");
        requestId && (rows = rows.filter(function (row) {
            return String(row && row.requestId || "") !== requestId;
        }));
        rows.unshift(item);
        rows = rows.slice(0, __APP_API_PERF_BASELINE_METHOD_LIMIT__);
        var encoded = JSON.stringify(rows), maxBytes = 88000;
        while (rows.length > 32 && encoded.length > maxBytes) {
            rows.pop();
            encoded = JSON.stringify(rows);
        }
        cache.put(key, encoded, __APP_API_PERF_TTL_SECONDS__);
        return !0;
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("performance.baseline.methodShard", _e, { file: "C00" }), !1;
    }
}
function _apiPerfWriteSamples_(rows) {
    try {
        var cache = _AppScriptCache_();
        if (!cache)
            return !1;
        rows = Array.isArray(rows) ? rows.slice(0, __APP_API_PERF_SAMPLE_LIMIT__) : [];
        var encoded = JSON.stringify(rows), maxBytes = 88000;
        while (rows.length > 20 && encoded.length > maxBytes) {
            rows.pop();
            encoded = JSON.stringify(rows);
        }
        cache.put(__APP_API_PERF_CACHE_KEY__, encoded, __APP_API_PERF_TTL_SECONDS__);
        return !0;
    }
    catch (_e) {
        return !1;
    }
}
function _recordApiPerfSample_(sample) {
    try {
        sample = sample || {};
        if (!sample.method || !_apiPerfSamplingEnabled_())
            return !1;
        var cfg = _apiPerformanceThresholds_(), rows = _apiPerfReadSamples_(), requestId = _apiPerfSafeLabel_(sample.requestId || "", 96), method = _apiPerfSafeLabel_(sample.method || "", 96), item = {
            at: _apiPerfSafeLabel_(sample.at || new Date().toISOString(), 40),
            requestId: requestId,
            method: method,
            group: _apiPerfSafeLabel_(sample.group || sample.domain || "general", 40),
            ok: sample.ok !== !1,
            durationMs: Math.max(0, Number(sample.durationMs || 0)),
            rowsRead: Math.max(0, Number(sample.rowsRead || 0)),
            rowsReturned: Math.max(0, Number(sample.rowsReturned || 0)),
            cellsRead: Math.max(0, Number(sample.cellsRead || 0)),
            serviceReads: Math.max(0, Number(sample.serviceReads || 0)),
            spreadsheetServiceOpens: Math.max(0, Number(sample.spreadsheetServiceOpens || 0)),
            sheetResolveCalls: Math.max(0, Number(sample.sheetResolveCalls || 0)),
            headerReads: Math.max(0, Number(sample.headerReads || 0)),
            fallbackReadsSuppressed: Math.max(0, Number(sample.fallbackReadsSuppressed || 0)),
            projectedColumnsRead: Math.max(0, Number(sample.projectedColumnsRead || 0)),
            fullWidthColumnsAvoided: Math.max(0, Number(sample.fullWidthColumnsAvoided || 0)),
            payloadBytes: Math.max(0, Number(sample.payloadBytes || 0)),
            performanceGateStatus: _apiPerfSafeLabel_(sample.performanceGateStatus || "not-profiled", 40),
            cacheHit: !!sample.cacheHit,
            cacheHits: Math.max(0, Number(sample.cacheHits || 0)),
            cacheMisses: Math.max(0, Number(sample.cacheMisses || 0)),
            source: _apiPerfSafeLabel_(sample.source || "live", 80),
            errorCode: _apiPerfSafeLabel_(sample.errorCode || "", 80),
            slowOrHeavy: !!sample.slowOrHeavy,
            degraded: !!sample.degraded,
            warningCount: Math.max(0, Number(sample.warningCount || 0)),
            errorCount: Math.max(0, Number(sample.errorCount || 0)),
            baselineRunId: _apiPerfSafeLabel_(sample.baselineRunId || "", 80),
            baselineMode: _apiPerfSafeLabel_(sample.baselineMode || "", 24).toLowerCase(),
            journeyId: _apiPerfSafeLabel_(sample.journeyId || "", 80),
            cacheBypassRequested: !!sample.cacheBypassRequested,
            loginRateLimitMs: Math.max(0, Number(sample.loginRateLimitMs || 0)),
            loginPrincipalLookupMs: Math.max(0, Number(sample.loginPrincipalLookupMs || 0)),
            loginPasswordVerifyMs: Math.max(0, Number(sample.loginPasswordVerifyMs || 0)),
            loginSessionIssueMs: Math.max(0, Number(sample.loginSessionIssueMs || 0)),
            loginPostLoginMs: Math.max(0, Number(sample.loginPostLoginMs || 0)),
            loginUsersRowsScanned: Math.max(0, Number(sample.loginUsersRowsScanned || 0)),
            loginUsersColumnsRead: Math.max(0, Number(sample.loginUsersColumnsRead || 0)),
            loginUsersServiceReads: Math.max(0, Number(sample.loginUsersServiceReads || 0)),
            loginPrincipalDirectoryCacheHit: !!sample.loginPrincipalDirectoryCacheHit,
            dashboardAuthMs: Math.max(0, Number(sample.dashboardAuthMs || 0)),
            dashboardCacheReadMs: Math.max(0, Number(sample.dashboardCacheReadMs || 0)),
            dashboardPersistentSnapshotMs: Math.max(0, Number(sample.dashboardPersistentSnapshotMs || 0)),
            dashboardPersistentSnapshotWriteMs: Math.max(0, Number(sample.dashboardPersistentSnapshotWriteMs || 0)),
            dashboardStatsMs: Math.max(0, Number(sample.dashboardStatsMs || 0)),
            dashboardBudgetMs: Math.max(0, Number(sample.dashboardBudgetMs || 0)),
            dashboardSubBundlesMs: Math.max(0, Number(sample.dashboardSubBundlesMs || 0)),
            dashboardBuildMs: Math.max(0, Number(sample.dashboardBuildMs || 0)),
            dashboardCacheWriteMs: Math.max(0, Number(sample.dashboardCacheWriteMs || 0)),
            dashboardBudgetHotPathHit: !!sample.dashboardBudgetHotPathHit,
            dashboardSharedCacheHit: !!sample.dashboardSharedCacheHit,
            dashboardPersistentSnapshotHit: !!sample.dashboardPersistentSnapshotHit,
            dashboardCompactPayload: !!sample.dashboardCompactPayload
        };
        item.cacheClass = _apiPerfCacheClass_(item);
        if (requestId) {
            var existing = -1;
            for (var i = 0; i < rows.length; i++)
                if (String(rows[i] && rows[i].requestId || "") === requestId && String(rows[i] && rows[i].method || "") === method) {
                    existing = i;
                    break;
                }
            if (existing >= 0)
                rows.splice(existing, 1);
        }
        rows.unshift(item);
        var globalStored = _apiPerfWriteSamples_(rows.slice(0, Number(cfg.sampleLimit || __APP_API_PERF_SAMPLE_LIMIT__)));
        item.baselineRunId && _apiPerfWriteBaselineSample_(item);
        return globalStored;
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("performance.baseline.sample", _e, {
            file: "C00"
        }), !1;
    }
}
function _apiPerfAggregateGroup_(rows) {
    rows = Array.isArray(rows) ? rows : [];
    var durations = rows.map(function (row) {
        return Number(row && row.durationMs || 0);
    }), rowsRead = rows.map(function (row) {
        return Number(row && row.rowsRead || 0);
    }), rowsReturned = rows.map(function (row) {
        return Number(row && row.rowsReturned || 0);
    }), cellsRead = rows.map(function (row) {
        return Number(row && row.cellsRead || 0);
    }), serviceReads = rows.map(function (row) {
        return Number(row && row.serviceReads || 0);
    }), spreadsheetServiceOpens = rows.map(function (row) {
        return Number(row && row.spreadsheetServiceOpens || 0);
    }), sheetResolveCalls = rows.map(function (row) {
        return Number(row && row.sheetResolveCalls || 0);
    }), headerReads = rows.map(function (row) {
        return Number(row && row.headerReads || 0);
    }), fallbackReadsSuppressed = rows.map(function (row) {
        return Number(row && row.fallbackReadsSuppressed || 0);
    }), projectedColumnsRead = rows.map(function (row) {
        return Number(row && row.projectedColumnsRead || 0);
    }), fullWidthColumnsAvoided = rows.map(function (row) {
        return Number(row && row.fullWidthColumnsAvoided || 0);
    }), payloadBytes = rows.map(function (row) {
        return Number(row && row.payloadBytes || 0);
    }), cacheHits = rows.filter(function (row) {
        return !!(row && row.cacheHit);
    }).length, success = rows.filter(function (row) {
        return row && row.ok !== !1;
    }).length, overBudget = rows.filter(function (row) {
        return String(row && row.performanceGateStatus || "") === "over-budget";
    }).length;
    return {
        sampleCount: rows.length,
        successCount: success,
        failureCount: rows.length - success,
        successRate: rows.length ? Math.round(success * 10000 / rows.length) / 100 : 0,
        p50Ms: _apiPerfPercentile_(durations, 50),
        p95Ms: _apiPerfPercentile_(durations, 95),
        p99Ms: _apiPerfPercentile_(durations, 99),
        averageMs: _apiPerfAverage_(durations),
        maxMs: durations.length ? Math.max.apply(null, durations) : 0,
        averageRowsRead: _apiPerfAverage_(rowsRead),
        maxRowsRead: rowsRead.length ? Math.max.apply(null, rowsRead) : 0,
        averageRowsReturned: _apiPerfAverage_(rowsReturned),
        averageCellsRead: _apiPerfAverage_(cellsRead),
        maxCellsRead: cellsRead.length ? Math.max.apply(null, cellsRead) : 0,
        averageServiceReads: _apiPerfAverage_(serviceReads),
        p95ServiceReads: _apiPerfPercentile_(serviceReads, 95),
        maxServiceReads: serviceReads.length ? Math.max.apply(null, serviceReads) : 0,
        averageSpreadsheetServiceOpens: _apiPerfAverage_(spreadsheetServiceOpens),
        p95SpreadsheetServiceOpens: _apiPerfPercentile_(spreadsheetServiceOpens, 95),
        maxSpreadsheetServiceOpens: spreadsheetServiceOpens.length ? Math.max.apply(null, spreadsheetServiceOpens) : 0,
        averageSheetResolveCalls: _apiPerfAverage_(sheetResolveCalls),
        p95SheetResolveCalls: _apiPerfPercentile_(sheetResolveCalls, 95),
        averageHeaderReads: _apiPerfAverage_(headerReads),
        p95HeaderReads: _apiPerfPercentile_(headerReads, 95),
        averageFallbackReadsSuppressed: _apiPerfAverage_(fallbackReadsSuppressed),
        averageProjectedColumnsRead: _apiPerfAverage_(projectedColumnsRead),
        averageFullWidthColumnsAvoided: _apiPerfAverage_(fullWidthColumnsAvoided),
        averagePayloadBytes: _apiPerfAverage_(payloadBytes),
        p95PayloadBytes: _apiPerfPercentile_(payloadBytes, 95),
        maxPayloadBytes: payloadBytes.length ? Math.max.apply(null, payloadBytes) : 0,
        cacheHitCount: cacheHits,
        cacheHitRatio: rows.length ? Math.round(cacheHits * 10000 / rows.length) / 100 : 0,
        overBudgetCount: overBudget,
        overBudgetRatio: rows.length ? Math.round(overBudget * 10000 / rows.length) / 100 : 0,
        loginStageAverages: {
            rateLimitMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.loginRateLimitMs || 0); })),
            principalLookupMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.loginPrincipalLookupMs || 0); })),
            passwordVerifyMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.loginPasswordVerifyMs || 0); })),
            sessionIssueMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.loginSessionIssueMs || 0); })),
            postLoginMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.loginPostLoginMs || 0); })),
            usersRowsScanned: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.loginUsersRowsScanned || 0); })),
            usersColumnsRead: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.loginUsersColumnsRead || 0); })),
            usersServiceReads: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.loginUsersServiceReads || 0); })),
            principalDirectoryCacheHitRatio: rows.length ? Math.round(rows.filter(function (row) { return !!(row && row.loginPrincipalDirectoryCacheHit); }).length * 10000 / rows.length) / 100 : 0
        },
        dashboardStageAverages: {
            authMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.dashboardAuthMs || 0); })),
            cacheReadMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.dashboardCacheReadMs || 0); })),
            persistentSnapshotMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.dashboardPersistentSnapshotMs || 0); })),
            persistentSnapshotWriteMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.dashboardPersistentSnapshotWriteMs || 0); })),
            statsMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.dashboardStatsMs || 0); })),
            budgetMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.dashboardBudgetMs || 0); })),
            subBundlesMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.dashboardSubBundlesMs || 0); })),
            buildMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.dashboardBuildMs || 0); })),
            cacheWriteMs: _apiPerfAverage_(rows.map(function (row) { return Number(row && row.dashboardCacheWriteMs || 0); })),
            budgetHotPathHitRatio: rows.length ? Math.round(rows.filter(function (row) { return !!(row && row.dashboardBudgetHotPathHit); }).length * 10000 / rows.length) / 100 : 0,
            sharedCacheHitRatio: rows.length ? Math.round(rows.filter(function (row) { return !!(row && row.dashboardSharedCacheHit); }).length * 10000 / rows.length) / 100 : 0,
            persistentSnapshotHitRatio: rows.length ? Math.round(rows.filter(function (row) { return !!(row && row.dashboardPersistentSnapshotHit); }).length * 10000 / rows.length) / 100 : 0,
            compactPayloadRatio: rows.length ? Math.round(rows.filter(function (row) { return !!(row && row.dashboardCompactPayload); }).length * 10000 / rows.length) / 100 : 0
        }
    };
}
function _apiPerfBaselineSnapshot_(options) {
    options = options || {};
    var methods = Array.isArray(options.methods) && options.methods.length ? options.methods.map(function (name) {
        return String(name || "").trim();
    }).filter(Boolean) : __APP_PERFORMANCE_BASELINE_PLAN__.methods.slice(), requested = {}, rows = _apiPerfReadBaselineSamples_(methods);
    methods.forEach(function (method) {
        requested[method] = !0;
    });
    rows = rows.filter(function (row) {
        return row && requested[String(row.method || "")];
    });
    var byMethod = {}, progress = {}, latestRunByMethod = {};
    methods.forEach(function (method) {
        var allMethodRows = rows.filter(function (row) { return String(row.method || "") === method; }), selected = _apiPerfLatestRunRows_(allMethodRows), methodRows = selected.rows, target = _apiPerfTargetForMethod_(method), modes = {};
        latestRunByMethod[method] = selected.latestRunId;
        methodRows.forEach(function (row) {
            var mode = _apiPerfCacheClass_(row);
            (modes[mode] = modes[mode] || []).push(row);
        });
        var coldRows = methodRows.filter(function (row) {
            return row && row.ok !== !1 && _apiPerfCacheClass_(row) === "cold";
        }), warmRows = methodRows.filter(function (row) {
            return row && row.ok !== !1 && _apiPerfCacheClass_(row) === "warm";
        }), failedRows = methodRows.filter(function (row) {
            return !row || row.ok === !1;
        }), modeStats = {};
        Object.keys(modes).sort().forEach(function (mode) {
            modeStats[mode] = _apiPerfAggregateGroup_(modes[mode]);
        });
        byMethod[method] = {
            latestRunId: selected.latestRunId,
            all: _apiPerfAggregateGroup_(methodRows),
            modes: modeStats,
            latestAt: methodRows.length ? String(methodRows[0].at || "") : "",
            discardedOlderRunSamples: Math.max(0, allMethodRows.length - methodRows.length)
        };
        progress[method] = {
            latestRunId: selected.latestRunId,
            cold: coldRows.length,
            warm: warmRows.length,
            total: methodRows.length,
            failureCount: failedRows.length,
            requiredCold: target.cold,
            requiredWarm: target.warm,
            coldComplete: coldRows.length >= target.cold,
            warmComplete: warmRows.length >= target.warm,
            complete: !!selected.latestRunId && coldRows.length >= target.cold && warmRows.length >= target.warm && failedRows.length === 0
        };
    });
    var ready = methods.every(function (method) {
        return progress[method] && progress[method].complete;
    }), rawLimit = Math.max(0, Math.min(Number(options.rawLimit || 0), 160));
    return {
        ok: !0,
        enabled: _apiPerfSamplingEnabled_(),
        ready: ready,
        stamp: __APP_PERFORMANCE_BASELINE_PLAN__.stamp,
        owner: "Code_00_PlatformCore.production-measurement-gate-r224",
        releaseKey: __APP_API_PERF_RELEASE_KEY__,
        cacheKey: __APP_API_PERF_CACHE_KEY__,
        baselineCachePrefix: __APP_API_PERF_BASELINE_CACHE_PREFIX__,
        retentionSeconds: __APP_API_PERF_TTL_SECONDS__,
        boundedSampleLimit: __APP_API_PERF_SAMPLE_LIMIT__,
        perMethodBaselineSampleLimit: __APP_API_PERF_BASELINE_METHOD_LIMIT__,
        latestRunOnly: !0,
        latestRunByMethod: latestRunByMethod,
        plan: __APP_PERFORMANCE_BASELINE_PLAN__,
        methods: byMethod,
        progress: progress,
        totalTargetSamples: Object.keys(progress).reduce(function (sum, method) { return sum + Number(progress[method].total || 0); }, 0),
        rawSamples: rawLimit ? rows.slice(0, rawLimit) : [],
        generatedAt: new Date().toISOString(),
        noDataMutation: !0,
        noPayloadLogging: !0,
        noCredentialLogging: !0
    };
}
function _apiPerformanceThresholds_() {
    return {
        sampleLimit: __APP_API_PERF_SAMPLE_LIMIT__, maxDurationMsDefault: 1200, maxRowsReadDefault: 1e3, minCacheHitRatio: .2, maxViolationRatio: .1, byGroup: {
            dashboard: {
                maxDurationMs: 900, maxRowsRead: 800
            }, search: {
                maxDurationMs: 1200, maxRowsRead: 600
            }, tracking: {
                maxDurationMs: 1200, maxRowsRead: 600
            }, budget: {
                maxDurationMs: 1300, maxRowsRead: 1500
            }, meeting: {
                maxDurationMs: 1300, maxRowsRead: 1500
            }, personnel: {
                maxDurationMs: 1300, maxRowsRead: 1500
            }, petitioners: {
                maxDurationMs: 1300, maxRowsRead: 1500
            }, admin: {
                maxDurationMs: 1800, maxRowsRead: 2e3
            }, ai: {
                maxDurationMs: 5e3, maxRowsRead: 1e3
            }
        }
    };
}
var ROUTER_PLATFORM_FACADE_STAMP_CURRENT = "router-platform-observability-owner-current-r257";
function _platformRouterEntityNameForRoute_(method, meta) {
    return _platformCacheEntityByMethod_(method, meta);
}
function _platformRouterCacheTelemetryForRoute_(method, meta) {
    var entity = _platformRouterEntityNameForRoute_(method, meta), stamp = "";
    try {
        _appIsFnName_("_entityCacheStamp_") && (stamp = String(_entityCacheStamp_(entity) || ""));
    }
    catch (e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("phase4.router.cacheTelemetry", e, {
            method: String(method || ""), entity
        });
    }
    return {
        entity, entityStamp: stamp, cacheInvalidated: !(!meta || !meta.write), method: String(method || ""), generatedAt: new Date().toISOString(), owner: "Code_00_PlatformCore._platformRouterCacheTelemetryForRoute_", stamp: ROUTER_PLATFORM_FACADE_STAMP_CURRENT
    };
}
function _platformRouterPerfSampleEnabled_() {
    try {
        return _apiPerfSamplingEnabled_();
    }
    catch (propErr) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("phase4.router.perf.prop", propErr), !1;
    }
}
function _platformRouterRecordPerf_(normalized, method, routeMeta, requestId, invokePayload) {
    try {
        if (!_platformRouterPerfSampleEnabled_())
            return !1;
        routeMeta = routeMeta || {};
        normalized = normalized || {};
        invokePayload = invokePayload && typeof invokePayload == "object" && !Array.isArray(invokePayload) ? invokePayload : {};
        var perf = normalized.perf || {}, loginPerformance = perf.loginPerformance && typeof perf.loginPerformance == "object" ? perf.loginPerformance : normalized && normalized.data && normalized.data.loginPerformance && typeof normalized.data.loginPerformance == "object" ? normalized.data.loginPerformance : {}, cacheBypassRequested = invokePayload.forceFresh === !0 || invokePayload.noCache === !0 || invokePayload.bypassCache === !0 || Number(invokePayload.cacheTtlSeconds) === 0, perfSample = {
            method: String(method || ""),
            requestId: String(requestId || ""),
            group: String(routeMeta.group || routeMeta.domain || "general"),
            ok: normalized.ok !== !1,
            durationMs: Number(normalized.latencyMs || 0),
            rowsRead: perf.rowsRead,
            rowsReturned: perf.rowsReturned,
            cellsRead: perf.cellsRead,
            serviceReads: perf.serviceReads,
            spreadsheetServiceOpens: perf.spreadsheetServiceOpens,
            sheetResolveCalls: perf.sheetResolveCalls,
            headerReads: perf.headerReads,
            fallbackReadsSuppressed: perf.fallbackReadsSuppressed,
            projectedColumnsRead: perf.projectedColumnsRead,
            fullWidthColumnsAvoided: perf.fullWidthColumnsAvoided,
            payloadBytes: perf.payloadBytes,
            performanceGateStatus: perf.gate && perf.gate.status,
            cacheHit: !!perf.cacheHit,
            cacheHits: perf.cacheHits,
            cacheMisses: perf.cacheMisses,
            source: perf.source,
            degraded: perf.degraded,
            warningCount: perf.warningCount,
            errorCount: perf.errorCount,
            errorCode: String(normalized.errorCode || ""),
            slowOrHeavy: Number(normalized.latencyMs || 0) >= 800 || Number(perf.rowsRead || 0) >= 500,
            baselineRunId: invokePayload.__perfBaselineRunId,
            baselineMode: invokePayload.__perfBaselineMode,
            journeyId: invokePayload.__perfJourneyId,
            cacheBypassRequested: cacheBypassRequested,
            loginRateLimitMs: Number(loginPerformance.rateLimitMs || 0),
            loginPrincipalLookupMs: Number(loginPerformance.principalLookupMs || 0),
            loginPasswordVerifyMs: Number(loginPerformance.passwordVerifyMs || 0),
            loginSessionIssueMs: Number(loginPerformance.sessionIssueMs || 0),
            loginPostLoginMs: Number(loginPerformance.postLoginMs || 0),
            loginUsersRowsScanned: Number(loginPerformance.usersRowsScanned || 0),
            loginUsersColumnsRead: Number(loginPerformance.usersColumnsRead || 0),
            loginUsersServiceReads: Number(loginPerformance.usersServiceReads || 0),
            loginPrincipalDirectoryCacheHit: !!loginPerformance.principalDirectoryCacheHit,
            dashboardAuthMs: Number(perf.dashboardStageTimings && perf.dashboardStageTimings.authMs || 0),
            dashboardCacheReadMs: Number(perf.dashboardStageTimings && perf.dashboardStageTimings.cacheReadMs || 0),
            dashboardPersistentSnapshotMs: Number(perf.dashboardStageTimings && perf.dashboardStageTimings.persistentSnapshotMs || 0),
            dashboardPersistentSnapshotWriteMs: Number(perf.dashboardStageTimings && perf.dashboardStageTimings.persistentSnapshotWriteMs || 0),
            dashboardStatsMs: Number(perf.dashboardStageTimings && perf.dashboardStageTimings.statsMs || 0),
            dashboardBudgetMs: Number(perf.dashboardStageTimings && perf.dashboardStageTimings.budgetMs || 0),
            dashboardSubBundlesMs: Number(perf.dashboardStageTimings && perf.dashboardStageTimings.subBundlesMs || 0),
            dashboardBuildMs: Number(perf.dashboardStageTimings && perf.dashboardStageTimings.buildMs || 0),
            dashboardCacheWriteMs: Number(perf.dashboardStageTimings && perf.dashboardStageTimings.cacheWriteMs || 0),
            dashboardBudgetHotPathHit: !!(perf.dashboardStageTimings && perf.dashboardStageTimings.budgetHotPathHit),
            dashboardSharedCacheHit: !!(perf.dashboardStageTimings && perf.dashboardStageTimings.sharedCacheHit),
            dashboardPersistentSnapshotHit: !!(perf.dashboardStageTimings && perf.dashboardStageTimings.persistentSnapshotHit),
            dashboardCompactPayload: !!(perf.dashboardStageTimings && perf.dashboardStageTimings.compactPayload),
            at: new Date().toISOString(),
            owner: "Code_00_PlatformCore._platformRouterRecordPerf_",
            stamp: "production-measurement-gate-correlated-r224"
        };
        return _appIsFnName_("_recordApiPerfSample_") && _recordApiPerfSample_(perfSample), _appIsFnName_("_recordPerformanceSample_") && _recordPerformanceSample_(perfSample), !0;
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("phase4.router.perf.record", e, {
            method: String(method || "")
        }), !1;
    }
}
function _platformRouterAuditAccess_(status, method, meta, payload, sess, requestId, detail) {
    try {
        return _appIsFnName_("_securityAuditRouteAccess_") && _securityAuditRouteAccess_(status, method, meta || {}, payload || null, sess || null, requestId, detail || {}), !0;
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("phase4.router.audit.access", e, {
            method: String(method || ""), status: String(status || "")
        }), !1;
    }
}
function _platformRouterLogAudit_(action, detail) {
    try {
        return typeof logAudit_ == "function" && logAudit_(String(action || "api.router"), detail || {}), !0;
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("phase4.router.audit.log", e, {
            action: String(action || "")
        }), !1;
    }
}
function _auditEventTaxonomy_() {
    return {
        auth: "auth", router: "router", admin: "admin", caseData: "case-data", meetingData: "meeting-data", letters: "letters", budget: "budget"
    };
}
function auditEvent_(type, payload) {
    try {
        var taxonomy = _auditEventTaxonomy_(), normalizedType = taxonomy[type] || String(type || "system");
        return logAudit_("app." + normalizedType, payload || {}), !0;
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("phase4.auditEvent", e, {
            type: String(type || "")
        }), !1;
    }
}
var __APP_REQUEST_SCOPE_CACHE__ = __APP_REQUEST_SCOPE_CACHE__ !== void 0 && __APP_REQUEST_SCOPE_CACHE__ ? __APP_REQUEST_SCOPE_CACHE__ : {}, __APP_REQUEST_SCOPE_METRICS__ = {
    hits: 0, misses: 0, rowsRead: 0, cellsRead: 0, serviceReads: 0, spreadsheetResolveCalls: 0, spreadsheetServiceOpens: 0,
    spreadsheetContextCreates: 0, spreadsheetContextHits: 0, sheetResolveCalls: 0, sheetHandleCacheHits: 0, sheetHandleCacheMisses: 0,
    sheetMetaReads: 0, sheetMetaCacheHits: 0, headerReads: 0, headerCacheHits: 0, headerMapBuilds: 0, headerMapCacheHits: 0,
    warnings: 0, errors: 0, sheetsRead: {}, sheetCellsRead: {}, sheetServiceReads: {}, spreadsheetSources: {}, sheetResolveByName: {}, sheetResolveCacheHitsByName: {}, cacheKinds: {}, warnLabels: {}, errorLabels: {}
};
