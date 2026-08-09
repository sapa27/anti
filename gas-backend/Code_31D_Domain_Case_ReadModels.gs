/** Canonical — Case search/report/hot-read-model function owner extracted from Code_30; behavior preserved. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {};
function apiSearch(payload) {
    payload = payload || {};
    try {
        (_appIsFnName_("_domainRouterAuthAlreadyOk_") &&
            _domainRouterAuthAlreadyOk_(payload)) ||
            requireAuth_(payload, "viewer");
        var q = _s_(payload.q || payload.query || payload.keyword)
            .trim()
            .toLowerCase(), type = String(payload.type || "all")
            .toLowerCase()
            .trim() || "all", limit = Math.max(1, Math.min(Number(payload.limit || payload.pageSize || 25) || 25, 100)), sourceRows = _appIsFnName_("_caseReadMainDataRowsForSearch_")
            ? _caseReadMainDataRowsForSearch_(_caseSearchProjectedFields_(), {
                forceFresh: !0,
                noCache: !0,
                bypassCache: !0,
                cacheTtlSeconds: 0,
                source: "apiSearch.displaySafeDefaultValue",
            })
            : _caseDomainMainDataProjectedRows_(!1), cases = (_c30A_(sourceRows) ? sourceRows : []).map(function (r) {
            var dto = _caseCanonicalDto_(r || {});
            _appIsFnName_("_caseSearchEnsureReceiveNo_") &&
                (dto = _caseSearchEnsureReceiveNo_(dto));
            var caseNum = _caseManualNumericText_(dto.caseNum || dto.caseNo || dto.runningNo || dto.ลำดับเรื่อง || ""), recNo = _caseManualReceiveNoText_(dto.recNo || dto.receiveNo || dto.เลขรับเรื่อง || ""), title = _s_(dto.title || dto.subject).trim(), caseTitle = String(dto.caseTitle ||
                dto.considerationTitle ||
                dto["ชื่อเรื่องพิจารณา(ถ้ามี)"] ||
                "").trim();
            return {
                id: dto.caseId || dto.id || "",
                caseId: dto.caseId || dto.id || "",
                type: "case",
                typeLabel: "เรื่องพิจารณา",
                caseNum,
                caseNo: caseNum,
                runningNo: caseNum,
                ลำดับเรื่อง: caseNum,
                recNo,
                receiveNo: recNo,
                เลขรับเรื่อง: recNo,
                title: title || caseTitle || "",
                subject: title || caseTitle || "",
                caseTitle: caseTitle || title || "",
                considerationTitle: caseTitle || "",
                "ชื่อเรื่องพิจารณา(ถ้ามี)": caseTitle || title || "",
                detail: dto.petitioners || dto.petitionerName || dto.petitioner || "",
                petitioners: dto.petitioners || dto.petitionerName || dto.petitioner || "",
                respondent: dto.respondent || dto.agencyName || "",
                agencyName: dto.agencyName || dto.respondent || "",
                status: dto.status || "",
                offerDate: dto.offerDate ||
                    dto.bookDate ||
                    dto.letterDate ||
                    dto.dateProposed ||
                    "",
                dateProposed: dto.dateProposed || dto.offerDate || "",
                bookDate: dto.bookDate || dto.offerDate || "",
                closedReason: dto.closedReason || "",
                rejectionReason: dto.rejectionReason || "",
                rejectReason: dto.rejectReason || dto.rejectionReason || "",
                notAcceptedReason: dto.notAcceptedReason || dto.rejectionReason || "",
                "เหตุผล(ไม่รับเรื่อง)": dto["เหตุผล(ไม่รับเรื่อง)"] || dto.rejectionReason || "",
                cat: dto.cat || dto.caseType || "",
                caseType: dto.caseType || dto.cat || "",
                subCat: dto.subCat || "",
                assignees: dto.assignees || "",
                owner: dto.owner || dto.assignees || "",
                staffs: dto.staffs || dto.opStaff || "",
                coAssignees: dto.coAssignees || "",
                updatedAt: dto.updatedAt || dto.createdAt || "",
            };
        }), letters = _caseDomainLettersProjectedRows_(!1).map(function (r) {
            return {
                id: r.letterId || "",
                type: "letter",
                typeLabel: "หนังสือ",
                title: r.subject || r.issue || "",
                detail: r.agency || "",
                status: r.letterStatus || r.status || "",
                updatedAt: r.updatedAt || r.createdAt || "",
            };
        }), all = cases.concat(letters);
        return (type !== "all" &&
            (all = all.filter(function (r) {
                return r.type === type;
            })),
            q &&
                (all = all.filter(function (r) {
                    return [
                        r.title, r.detail, r.typeLabel, r.status
                    ].some(function (v) {
                        return _s_(v).toLowerCase().indexOf(q) !== -1;
                    });
                })),
            all.sort(function (a, b) {
                return _s_(b.updatedAt).localeCompare(_s_(a.updatedAt));
            }),
            ok_(all.slice(0, limit).map(sanitizeRow_), "ค้นหาข้อมูลสำเร็จ"));
    }
    catch (e) {
        return (_recordWarning_("ec", e),
            err_(e.message || String(e), {
                rows: [],
                data: [],
                totalRecords: 0,
                technicalDebtFix: "apiSearch-projected-reader",
            }));
    }
}

function _normalizeSearchText_(value) {
    return _c30S_(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function _caseSearchPickReceiveAlias_(row, keys) {
    ((row = row || {}), (keys = _c30A_(keys) ? keys : []));
    for (var i = 0; i < keys.length; i++) {
        var key, value = row[keys[i]];
        if (value != null &&
            String(value).trim() !== "" &&
            !_caseLooksLikeInternalId_(value))
            return value;
    }
    return "";
}

function _caseSearchCleanReceiveCandidate_(value) {
    return _caseManualReceiveNoText_(value);
}

function _caseSearchReceiveAliasKeys_() {
    return [
        "recNo",
        "receiveNo",
        "receivedNo",
        "receive_no",
        "caseReceiveNo",
        "caseRecNo",
        "receiptNo",
        "receiveNumber",
        "registrationNo",
        "registrationNumber",
        "receiveRegistrationNo",
        "receiveCode",
        "receiveBookNo",
        "bookReceiveNo",
        "petitionReceiveNo",
        "complaintReceiveNo",
        "documentReceiveNo",
        "canonicalReceiveNo",
        "receiveNoDisplay",
        "displayReceiveNo",
        "เลขรับเรื่อง",
        "เลขที่รับเรื่อง",
        "รับเรื่องเลขที่",
        "เลขรับเรื่องพิจารณา",
        "เลขรับที่",
        "เลขรับคำร้อง",
        "เลขรับหนังสือ",
        "เลขทะเบียนรับ",
        "ทะเบียนรับ",
        "ทะเบียนหนังสือรับ",
        "เลขหนังสือรับ",
        "รับเลขที่",
        "รับที่",
        "เลขรับ",
    ];
}

function _caseSearchReceiveNoCandidateFromAnyKey_(row) {
    row = row || {};
    var best = "";
    return (Object.keys(row).forEach(function (key) {
        if (!best || !/^\d+\s*[\/\-–—]\s*25\d{2}$/.test(best)) {
            var normalizedKey = _s_(key)
                .replace(/[\s_\-–—()（）\[\]{}:：/\.]+/g, "")
                .toLowerCase(), isReceiveKey;
            if ((normalizedKey === "recno" ||
                normalizedKey.indexOf("receive") !== -1 ||
                normalizedKey.indexOf("receipt") !== -1 ||
                normalizedKey.indexOf("registration") !== -1 ||
                String(key).indexOf("เลขรับ") !== -1 ||
                String(key).indexOf("ทะเบียนรับ") !== -1 ||
                String(key).indexOf("รับเลข") !== -1) &&
                !/date|วันที่|วันรับ|receiveddate|receivedat/i.test(normalizedKey)) {
                var candidate = _caseSearchCleanReceiveCandidate_(row[key]);
                candidate &&
                    (!best ||
                        /^\d+\s*[\/\-–—]\s*25\d{2}$/.test(candidate) ||
                        (/^\d+$/.test(candidate) && !/^\d+$/.test(best))) &&
                    (best = candidate);
            }
        }
    }),
        best);
}

function _caseSearchReceiveNoText_(row) {
    var recRaw = _caseSearchCleanReceiveCandidate_((row = row || {}).recNo), aliasRaw = "", raw;
    return (recRaw ||
        (aliasRaw = _caseSearchCleanReceiveCandidate_(_caseSearchPickReceiveAlias_(row, _caseSearchReceiveAliasKeys_()))),
        _caseManualReceiveNoText_(recRaw || aliasRaw || _caseSearchReceiveNoCandidateFromAnyKey_(row)));
}

function _caseSearchReceiveDateAliasKeys_() {
    return [
        "MainData.recDate",
        "MainData/recDate",
        "MainData_recDate",
        "mainData.recDate",
        "mainData/recDate",
        "mainData_recDate",
        "recDate",
        "rec_date",
        "rec date",
        "receiveDate",
        "receive_date",
        "receive date",
        "receiptDate",
        "receipt_date",
        "registrationDate",
        "registration_date",
        "caseReceiveDate",
        "caseRecDate",
        "petitionReceiveDate",
        "complaintReceiveDate",
        "documentReceiveDate",
        "receiveAt",
        "receivedAt",
        "receiveOn",
        "receivedOn",
        "recDateText",
        "receiveDateText",
        "receiveDateDisplay",
        "วันที่รับเรื่อง",
        "วันที่รับเรื่อง (พ.ศ.)",
        "วันที่รับเรื่อง(พ.ศ.)",
        "วันเดือนปีที่รับเรื่อง",
        "วันเดือนปีรับเรื่อง",
        "วันที่รับ",
        "วันรับเรื่อง",
        "วันรับ",
        "รับเรื่องวันที่",
        "วันที่ลงรับ",
        "วันที่ลงทะเบียนรับ",
        "วันที่รับคำร้อง",
        "วันที่รับหนังสือ",
        "วันเดือนปีที่รับ",
        "วันเดือนปีรับ",
        "รับวันที่",
        "วันที่รับเรื่องร้องเรียน",
        "วันรับคำร้อง",
        "วันรับหนังสือ",
    ];
}

function _caseSearchReceiveDateCandidateFromAnyKey_(source) {
    source = source || {};
    var best = "";
    return (Object.keys(source).forEach(function (key) {
        if (!best) {
            var rawKey = _s_(key), normalizedKey = _caseSearchFieldKey_(rawKey), thaiDateKey = rawKey.indexOf("วัน") !== -1 || rawKey.indexOf("วันที่") !== -1, thaiReceiveKey = rawKey.indexOf("รับ") !== -1 ||
                rawKey.indexOf("ลงรับ") !== -1 ||
                rawKey.indexOf("ทะเบียนรับ") !== -1, enReceiveDateKey = /^(maindata)?(recdate|receivedate|receiveddate|receiptdate|registrationdate|datereceived|datereceive|receivedat|receiveat|receivedon|receiveon|casereceivedate|caserecdate|petitionreceivedate|complaintreceivedate|documentreceivedate)$/i.test(normalizedKey), excluded;
            if (!(/offer|propose|submit|book|letter|due|deadline|extend|delete|deleted|update|updated|create|created|meeting|reply|response|closed|close|refund|report|status/i.test(normalizedKey) ||
                rawKey.indexOf("เสนอ") !== -1 ||
                (rawKey.indexOf("หนังสือ") !== -1 &&
                    rawKey.indexOf("รับหนังสือ") === -1) ||
                rawKey.indexOf("ครบกำหนด") !== -1 ||
                rawKey.indexOf("ประชุม") !== -1 ||
                rawKey.indexOf("แก้ไข") !== -1 ||
                rawKey.indexOf("สร้าง") !== -1 ||
                rawKey.indexOf("ลบ") !== -1 ||
                rawKey.indexOf("สถานะ") !== -1) &&
                (enReceiveDateKey || (thaiDateKey && thaiReceiveKey))) {
                var text = _caseSearchReceiveDateText_(source[key]);
                text && (best = text);
            }
        }
    }),
        best);
}

function _caseSearchFieldKey_(value) {
    return _c30S_(value)
        .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "")
        .replace(/[\s\n\r\t\-–—_()（）\[\]{}:：\/\.]+/g, "")
        .toLowerCase();
}

function _caseSearchPickField_(source, keys) {
    ((source = source || {}), (keys = _c30A_(keys) ? keys : []));
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (_appHasOwnProperty_(source, key) &&
            source[key] !== void 0 &&
            source[key] !== null &&
            String(source[key]).trim() !== "")
            return source[key];
    }
    var dict = {};
    Object.keys(source).forEach(function (key2) {
        var nk = _caseSearchFieldKey_(key2);
        nk && !_appHasOwnProperty_(dict, nk) && (dict[nk] = source[key2]);
    });
    for (var j = 0; j < keys.length; j++) {
        var nkey = _caseSearchFieldKey_(keys[j]);
        if (nkey &&
            dict[nkey] !== void 0 &&
            dict[nkey] !== null &&
            String(dict[nkey]).trim() !== "")
            return dict[nkey];
    }
    return "";
}

function _caseSearchReceiveDateText_(value) {
    return _appCanonicalThaiDateText_(value, {
        rejectIdentifierLike: true,
        preserveUnknown: false,
    });
}

function _caseSearchMainDataObject_(row) {
    var raw = (row = row || {}).raw && typeof row.raw == "object"
        ? row.raw
        : row.__raw && typeof row.__raw == "object"
            ? row.__raw
            : {};
    return row.MainData &&
        typeof row.MainData == "object" &&
        !_c30A_(row.MainData)
        ? row.MainData
        : row.mainData && typeof row.mainData == "object" && !_c30A_(row.mainData)
            ? row.mainData
            : raw.MainData && typeof raw.MainData == "object" && !_c30A_(raw.MainData)
                ? raw.MainData
                : raw.mainData &&
                    typeof raw.mainData == "object" &&
                    !_c30A_(raw.mainData)
                    ? raw.mainData
                    : {};
}

function _caseSearchIdentityKeysForMainDataRecDate_(row) {
    row = row || {};
    var keys = [], seen = {};
    function addCaseIdentityKey_(prefix, value) {
        var key = (value = _c30S_(value).replace(/^'+/, "").trim())
            ? prefix + ":" + value
            : "";
        return (key && !seen[key] && ((seen[key] = 1), keys.push(key)), value);
    }
    function firstValue(list) {
        return _caseSearchPickField_(row, list) || "";
    }
    var caseId = addCaseIdentityKey_("caseId", firstValue([
        "caseId", "id", "uid", "rowId", "_id"
    ])), caseNum = addCaseIdentityKey_("caseNum", firstValue([
        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"
    ])), recNo = addCaseIdentityKey_("recNo", firstValue([
        "recNo", "receiveNo", "เลขรับเรื่อง"
    ]));
    if (caseNum && recNo) {
        var pair = "caseNumRecNo:" + caseNum + "|" + recNo;
        seen[pair] || ((seen[pair] = 1), keys.push(pair));
    }
    return keys;
}

function _caseSearchMainDataRecDateIndex_() {
    var cacheNs = "MainData.recDate.owner", cached = _appIsFnName_("_requestScopeGet_")
        ? _requestScopeGet_("caseSearchMainDataRecDateIndex", cacheNs)
        : null;
    if (cached && typeof cached == "object")
        return cached;
    var map = {};
    function addKey(prefix, value, text) {
        return ((value = _c30S_(value).replace(/^'+/, "").trim()) &&
            text &&
            !map[prefix + ":" + value] &&
            (map[prefix + ":" + value] = text),
            value);
    }
    function addDirectKey(key, text) {
        key && text && !map[key] && (map[key] = text);
    }
    try {
        var fields = [
            "caseId",
            "id",
            "uid",
            "rowId",
            "_id",
            "caseNum",
            "caseNo",
            "runningNo",
            "ลำดับเรื่อง",
            "recNo",
            "receiveNo",
            "เลขรับเรื่อง",
            "isDeleted",
        ].concat(_caseSearchReceiveDateAliasKeys_()), rows = typeof readSheetProjectedObjectsCached_ == "function"
            ? readSheetProjectedObjectsCached_("MainData", fields, {
                includeDeleted: !1,
                requireCanonical: !1,
                ttl: 180,
                batchSize: 500,
            })
            : [];
        (_c30A_(rows) ? rows : []).forEach(function (row) {
            var text = _caseSearchReceiveDateText_(_caseSearchPickField_((row = row || {}), _caseSearchReceiveDateAliasKeys_())) || _caseSearchReceiveDateCandidateFromAnyKey_(row);
            if (text) {
                var dateIndexCaseId = addKey("caseId", _caseSearchPickField_(row, [
                    "caseId", "id", "uid", "rowId", "_id"
                ]), text), dateIndexCaseNum = addKey("caseNum", _caseSearchPickField_(row, [
                    "caseNum",
                    "caseNo",
                    "runningNo",
                    "ลำดับเรื่อง",
                ]), text), dateIndexRecNo = addKey("recNo", _caseSearchPickField_(row, [
                    "recNo", "receiveNo", "เลขรับเรื่อง"
                ]), text);
                dateIndexCaseNum &&
                    dateIndexRecNo &&
                    addDirectKey("caseNumRecNo:" + dateIndexCaseNum + "|" + dateIndexRecNo, text);
                /* r146: receive-date lookup intentionally excludes title/petitioner keys. */
            }
        });
    }
    catch (e) {
        _c30W_("case.search.maindata.recDate.index.owner", e);
    }
    return (_appIsFnName_("_requestScopePut_") &&
        _requestScopePut_("caseSearchMainDataRecDateIndex", cacheNs, map),
        map);
}

function _caseSearchReceiveDateValueFromRow_(row) {
    row = row || {};
    var keys = _caseSearchReceiveDateAliasKeys_();
    function read(source) {
        var value2 = _caseSearchPickField_((source = source || {}), keys);
        return value2 !== "" && value2 != null
            ? value2
            : _caseSearchReceiveDateCandidateFromAnyKey_(source);
    }
    var rawObj = row.raw && typeof row.raw == "object"
        ? row.raw
        : row.__raw && typeof row.__raw == "object"
            ? row.__raw
            : {}, value = read(row), main, data;
    if ((value !== "" && _caseSearchReceiveDateText_(value)) ||
        ((value = read(rawObj)) !== "" && _caseSearchReceiveDateText_(value)) ||
        ((value = read(_caseSearchMainDataObject_(row))) !== "" &&
            _caseSearchReceiveDateText_(value)) ||
        ((value = read(row.data && typeof row.data == "object" && !_c30A_(row.data)
            ? row.data
            : {})) !== "" &&
            _caseSearchReceiveDateText_(value)))
        return value;
    for (var idx = _caseSearchMainDataRecDateIndex_(), identityKeys = _caseSearchIdentityKeysForMainDataRecDate_(row), i = 0; i < identityKeys.length; i++)
        if (idx && idx[identityKeys[i]])
            return idx[identityKeys[i]];
    return "";
}

function _caseSearchReceiveDateTextFromRow_(row) {
    return _caseSearchReceiveDateText_(_caseSearchReceiveDateValueFromRow_(row || {}));
}

function _caseSearchEnsureReceiveNo_(row) {
    row = row || {};
    var out = _appAssignObjects_({}, row), receiveNo = _caseSearchReceiveNoText_(out), receiveDateText = _caseSearchReceiveDateTextFromRow_(out), caseNum = _caseManualNumericText_(_casePick_(out, _C30K_CASE_NUM_) || ""), title = String(_casePick_(out, _C30K_TITLE_) || "").trim(), consideration = String(_casePick_(out, [
        "considerationTitle",
        "caseConsiderationTitle",
        "caseTitle",
        "ชื่อเรื่องพิจารณา (ถ้ามี)",
        "ชื่อเรื่องพิจารณา",
        "เรื่องพิจารณา",
    ]) || "").trim(), petitioners = String(_casePick_(out, [
        "petitioners",
        "petitionerName",
        "petitioner",
        "requester",
        "complainant",
        "proposer",
        "motionProposer",
        "ผู้เสนอญัตติ/ผู้ร้อง",
        "ผู้เสนอญัตติ",
        "ผู้ร้อง",
    ]) || "").trim(), respondent = String(_casePick_(out, _C30K_RESPONDENT_SPACED_) || "").trim();
    return (caseNum
        ? _stampCaseSequenceIdentity_(out, caseNum)
        : ((out.caseNum = ""),
            (out.caseNo = ""),
            (out.runningNo = ""),
            (out.ลำดับเรื่อง = "")),
        receiveNo
            ? ((out.receiveNo = receiveNo),
                (out.recNo = receiveNo),
                (out.receiveNoDisplay = receiveNo),
                (out.canonicalReceiveNo = receiveNo),
                (out.เลขรับเรื่อง = receiveNo))
            : ((out.receiveNo = ""),
                (out.recNo = ""),
                (out.receiveNoDisplay = ""),
                (out.canonicalReceiveNo = ""),
                (out.เลขรับเรื่อง = "")),
        receiveDateText
            ? ((out.recDate = receiveDateText),
                (out.receiveDate = receiveDateText),
                (out.recDateText = receiveDateText),
                (out.receiveDateText = receiveDateText),
                (out.วันที่รับเรื่อง = receiveDateText))
            : ((out.recDate = out.recDate || ""),
                (out.receiveDate = out.receiveDate || ""),
                (out.recDateText = out.recDateText || ""),
                (out.receiveDateText = out.receiveDateText || ""),
                (out.วันที่รับเรื่อง = out.วันที่รับเรื่อง || "")),
        title &&
            ((out.title = title),
                (out.subject = out.subject || title),
                (out.ชื่อเรื่อง = title)),
        consideration &&
            ((out.caseTitle = consideration),
                (out.considerationTitle = consideration),
                (out["ชื่อเรื่องพิจารณา (ถ้ามี)"] = consideration)),
        petitioners &&
            ((out.petitioners = petitioners),
                (out.petitionerName = out.petitionerName || petitioners),
                (out["ผู้เสนอญัตติ/ผู้ร้อง"] = petitioners)),
        respondent &&
            ((out.respondent = respondent),
                (out.agencyName = out.agencyName || respondent)),
        (out.type = "case"),
        (out.typeLabel = "เรื่องพิจารณา"),
        out);
}

function _caseSearchVisibleProjectedFields_() {
    return _caseFieldsWithSequence_([
        "caseId", "id",
        "recNo", "receiveNo", "เลขรับเรื่อง", "เลขที่รับเรื่อง",
        "recDate", "receiveDate", "recDateText", "receiveDateText", "วันที่รับเรื่อง",
        "title", "subject", "caseSubject", "ชื่อเรื่อง", "เรื่อง",
        "caseTitle", "considerationTitle", "caseConsiderationTitle",
        "ชื่อเรื่องพิจารณา (ถ้ามี)", "ชื่อเรื่องพิจารณา", "เรื่องพิจารณา",
        "petitioners", "petitionerName", "ผู้เสนอญัตติ/ผู้ร้อง", "ผู้เสนอญัตติ", "ผู้ร้อง",
        "respondent", "agencyName", "หน่วยงาน/ผู้ถูกร้อง", "ผู้ถูกร้อง", "หน่วยงาน",
        "status", "cat", "caseType", "subCat", "subCategory",
        "assignees", "owner", "staffs", "opStaff", "coAssignees",
        "pendingRemark", "pendingReason", "statusReason", "reason", "เหตุผล",
        "closedReason", "rejectionReason", "petitionerPhone", "sentAgency",
        "isDeleted", "deletedAt", "updatedAt"
    ]);
}

function _caseSearchCompactProjectedFields_() {
    return _caseSearchVisibleProjectedFields_();
}

function _caseSearchProjectedFields_() {
    return _caseUniqueFieldList_(_caseSearchVisibleProjectedFields_().concat([
        "offerDate", "bookDate", "letterDate", "dateProposed", "วันที่หนังสือ",
        "subcommittee", "committeeHistory", "subcommitteeHistory",
        "dueDate", "createdAt", "meetingStatus", "keySummary",
        "sendToAgency", "sentToAgency", "ส่งให้หน่วยงาน", "หน่วยงานที่เกี่ยวข้อง"
    ]));
}

function _caseSearchStatusText_(value) {
    var text = _c30S_(value).replace(/[\u00A0\u200B-\u200D\uFEFF]/g, " ").replace(/\s+/g, " ").trim();
    if (!text || text === "-" || _caseValueLooksLikeDate_(text))
        return "";
    return _caseNormalizeStatusForDisplay_(text);
}

function _caseSearchStatusValue_(row) {
    row = row || {};
    var raw = row.raw && typeof row.raw === "object" ? row.raw : row.__raw && typeof row.__raw === "object" ? row.__raw : {}, main = _caseSearchMainDataObject_(row), flat = [
        "MainData/status", "MainData.status", "MainData_status", "mainData/status", "mainData.status", "mainData_status", "Main Data/status", "Main Data.status"
    ], keys = [
        "status", "สถานะ", "สถานะเรื่อง", "สถานะปัจจุบัน", "ผลการพิจารณา", "สถานะการพิจารณา", "สถานะพิจารณา", "สถานะเรื่องพิจารณา", "caseStatus", "processStatus", "currentStatus", "statusText", "caseState", "workflowStatus", "meetingStatus", "resultStatus"
    ], sources = [row, raw, main];
    for (var i = 0; i < sources.length; i++) {
        var value = _caseSearchPickField_(sources[i], i < 2 ? flat.concat(keys) : keys), status = _caseSearchStatusText_(value);
        if (status)
            return status;
    }
    return "";
}

function _caseSearchCanonicalRow_(row, index) {
    row = row || {};
    var source = _appAssignObjects_({}, row), status = _caseSearchStatusValue_(source);
    if (status)
        source.status = status;
    var out = _caseCanonicalDto_(source), id = _s_(_caseSearchPickField_(source, ["caseId", "id", "uid", "rowId", "_id"])).trim() || "MAIN-" + String(source.__rowNumber || index + 2), caseNum = _caseManualNumericText_(_caseSearchPickField_(source, _C30K_CASE_NUM_) || out.caseNum || ""), recNo = _caseSearchReceiveNoText_(source) || out.recNo || "", title = _s_(_caseSearchPickField_(source, _C30K_TITLE_) || out.title).trim(), caseTitle = _s_(_caseSearchPickField_(source, _C30K_CASE_TITLE_) || out.caseTitle || title).trim(), petitioners = _s_(_caseSearchPickField_(source, _C30K_PETITIONERS_) || out.petitioners).trim(), respondent = _s_(_caseSearchPickField_(source, _C30K_RESPONDENT_SPACED_) || out.respondent).trim(), sentAgency = _s_(_caseSearchPickField_(source, _C30K_SENT_AGENCY_) || out.sentAgency).trim(), staffs = _s_(_caseSearchPickField_(source, _C30K_STAFFS_) || out.staffs).trim(), coAssignees = _s_(_caseSearchPickField_(source, _C30K_CO_ASSIGNEES_) || out.coAssignees).trim(), phone = _appPhoneForDisplay_(_caseSearchPickField_(source, _C30K_PETITIONER_PHONE_) || out.petitionerPhone || ""), offerDate = _s_(_caseSearchPickField_(source, _C30K_OFFER_DATE_) || out.offerDate).trim();
    out = _appAssignObjects_({}, source, out, {
        caseId: id, id: source.id || id,
        caseNum: caseNum, caseNo: caseNum, runningNo: caseNum,
        recNo: recNo, receiveNo: recNo,
        title: title || caseTitle, subject: source.subject || title || caseTitle,
        caseTitle: caseTitle || title, considerationTitle: source.considerationTitle || caseTitle || title,
        petitioners: petitioners, petitionerName: source.petitionerName || petitioners,
        respondent: respondent, agencyName: source.agencyName || respondent,
        sentAgency: sentAgency, sendToAgency: sentAgency,
        status: status || out.status || "เรื่องเข้าใหม่", statusRaw: _s_(status || out.statusRaw).trim(),
        offerDate: offerDate, dateProposed: offerDate, bookDate: offerDate,
        letterDate: source.letterDate || offerDate, documentDate: source.documentDate || offerDate,
        petitionerPhone: phone, petitionerTel: phone, phone: phone,
        staffs: staffs, opStaff: source.opStaff || staffs,
        coAssignees: coAssignees,
        type: "case", typeLabel: "เรื่องพิจารณา"
    });
    out.closedReason = out.closedReason || out.reason || "";
    out.rejectionReason = out.rejectionReason || out.closedReason || out.reason || "";
    out.rejectReason = out.rejectionReason;
    out.notAcceptedReason = out.rejectionReason;
    out.ลำดับเรื่อง = caseNum;
    out.เลขรับเรื่อง = recNo;
    out["ชื่อเรื่องพิจารณา (ถ้ามี)"] = out["ชื่อเรื่องพิจารณา (ถ้ามี)"] || caseTitle || title;
    out["ผู้เสนอญัตติ/ผู้ร้อง"] = out["ผู้เสนอญัตติ/ผู้ร้อง"] || petitioners;
    out["เบอร์โทรศัพท์ผู้เสนอญัตติ/ผู้ร้อง"] = phone;
    out["ส่งให้หน่วยงาน"] = sentAgency;
    return _caseSearchEnsureReceiveNo_(out);
}

function _caseSearchHasIdentity_(row) {
    row = row || {};
    var values = [row.caseNum || row.caseNo || row.runningNo || row.ลำดับเรื่อง, row.recNo || row.receiveNo || row.เลขรับเรื่อง, row.title || row.subject || row.caseTitle || row.considerationTitle, row.petitioners || row.petitionerName || row["ผู้เสนอญัตติ/ผู้ร้อง"]], score = 0;
    values.forEach(function (value) {
        if (_s_(value).trim())
            score++;
    });
    return score >= 2;
}

function _caseSearchProjectRows_(rows, requested) {
    if (!requested.length)
        return rows;
    return rows.map(function (row) {
        var out = {};
        requested.forEach(function (field) {
            out[field] = row[field] !== void 0 && row[field] !== null ? row[field] : "";
        });
        _C30K_CANONICAL_REPORT_BASE_.forEach(function (key) {
            if ((!_s_(out[key]).trim()) && row[key] !== void 0 && row[key] !== null && _s_(row[key]).trim())
                out[key] = row[key];
        });
        return out;
    });
}

function _caseSearchCanonicalRows_(rows, requested) {
    var canonical = (_c30A_(rows) ? rows : []).map(function (row, index) {
        return _caseSearchCanonicalRow_(_appAssignObjects_({ __rowNumber: index + 2 }, row || {}), index);
    }).filter(function (row) {
        return !isSoftDeletedRow_(row);
    }), identityRows = canonical.filter(_caseSearchHasIdentity_);
    return _caseSearchProjectRows_(identityRows.length ? identityRows : canonical, requested);
}

function _caseReportMatchRows_(payload) {
    payload = payload || {};
    var projectedFields = payload.fullList === !0 || payload.exportMode || payload.includeMeetingHistory === !0
        ? _caseSearchProjectedFields_()
        : _caseSearchCompactProjectedFields_(), rows = _appIsFnName_("_caseReadMainDataRowsForSearch_")
        ? _caseReadMainDataRowsForSearch_(projectedFields, payload)
        : [];
    ((rows = (_c30A_(rows) ? rows : []).map(function (row) {
        return _appIsFnName_("_caseSearchEnsureReceiveNo_")
            ? _caseSearchEnsureReceiveNo_(row || {})
            : row || {};
    })),
        payload.includeMeetingHistory === !0 &&
            _appIsFnName_("_caseAttachMeetingHistoryCurrent_") &&
            (rows = _caseAttachMeetingHistoryCurrent_(rows)));
    var query = _normalizeSearchText_(payload.query || payload.q || payload.keyword || ""), reportType = String(payload.reportType || payload.groupType || payload.type || "all")
        .toLowerCase()
        .trim(), reportValue = _s_(payload.reportValue || payload.groupValue || payload.value).trim();
    function rowMatchesQuery(r) {
        return (!query ||
            [
                r.caseNum,
                r.recNo,
                r.receiveNo,
                r.title,
                r.subject,
                r.caseTitle,
                r.considerationTitle,
                r.petitioners,
                r.petitionerName,
                r.status,
                r.assignees,
                r.staffs,
                r.coAssignees,
                r.subCat,
                r.cat,
                r.agencyName,
                r.respondent,
            ].some(function (v) {
                return _normalizeSearchText_(v).indexOf(query) !== -1;
            }));
    }
    function rowMatchesGroup(r) {
        return (!reportValue ||
            (reportType === "cat"
                ? _s_(r.cat || r.caseType) === reportValue
                : reportType === "sub"
                    ? _s_(r.subCat || r.subCategory || r.issue) === reportValue
                    : reportType === "comm"
                        ? _s_(r.assignees || r.owner).indexOf(reportValue) !== -1
                        : reportType === "status"
                            ? _s_(r.status) === reportValue
                            : [
                                r.caseNum,
                                r.recNo,
                                r.title,
                                r.caseTitle,
                                r.petitioners,
                                r.respondent,
                                r.status,
                                r.cat,
                                r.subCat,
                                r.assignees,
                                r.staffs,
                                r.coAssignees,
                            ].some(function (v) {
                                return _c30S_(v).indexOf(reportValue) !== -1;
                            })));
    }
    return ((rows = rows
        .filter(rowMatchesQuery)
        .filter(rowMatchesGroup)
        .filter(function (row) {
        var type = _s_(row.type).trim().toLowerCase(), label = _s_(row.typeLabel).trim();
        return (type !== "letter" &&
            label !== "หนังสือ" &&
            label !== "หนังสือติดตามมติ");
    })),
        _appIsFnName_("_requestScopePut_") &&
            (rows =
                _requestScopePut_("caseReportRows", "MainData.recDate.directOwner", rows) || rows),
        rows.slice());
}

function _caseReportText_(value) {
    return value == null
        ? ""
        : Object.prototype.toString.call(value) === "[object Date]"
            ? isNaN(value.getTime())
                ? ""
                : _appIsFnName_("_committeeMeetingDateText_")
                    ? _committeeMeetingDateText_(value)
                    : Utilities.formatDate(value, Session.getScriptTimeZone() || "Asia/Bangkok", "yyyy-MM-dd")
            : String(value)
                .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, " ")
                .replace(/\s+/g, " ")
                .trim();
}

function _caseReportThaiDigits_(value) {
    return _caseReportText_(value).replace(/[๐-๙]/g, function (ch) {
        return String("๐๑๒๓๔๕๖๗๘๙".indexOf(ch));
    });
}

function _caseReportNormKey_(value) {
    return _caseReportThaiDigits_(value)
        .toLowerCase()
        .replace(/[\s\n\r\t\-–—_()（）\[\]{}:：\/\\\.]+/g, "");
}

function _caseReportCompact_(value) {
    return _caseReportThaiDigits_(value)
        .toLowerCase()
        .replace(/[\s\u00A0\u1680\u180E\u2000-\u200F\u2028\u2029\u202F\u205F\u2060\u3000\uFEFF\-–—_()（）\[\]{}:：\/\\\.]+/g, "");
}

function _caseReportUnique_(list) {
    var out = [], seen = {};
    return ((_c30A_(list) ? list : []).forEach(function (value) {
        ((value = _caseReportText_(value)),
            value && !seen[value] && ((seen[value] = !0), out.push(value)));
    }),
        out);
}

function _caseReportAliases_(domain, field, fallback) {
    var list = [];
    try {
        typeof AppBackendCore != "undefined" &&
            AppBackendCore.getFieldAliases &&
            (list = AppBackendCore.getFieldAliases(domain, field) || []);
    }
    catch (_aliasErr) {
        _c30W_("case.report.phase3.alias", _aliasErr, {
            domain, field
        });
    }
    return _caseReportUnique_((_c30A_(list) ? list : []).concat(_c30A_(fallback) ? fallback : [
        field
    ]));
}

function _caseReportPickObj_(row, names) {
    ((row = row || {}), (names = _c30A_(names) ? names : [
        names
    ]));
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        if (_appHasOwnProperty_(row, name)) {
            var value = _caseReportText_(row[name]);
            if (value)
                return value;
        }
    }
    var normalized = {};
    Object.keys(row).forEach(function (key2) {
        normalized[_caseReportNormKey_(key2)] = row[key2];
    });
    for (var j = 0; j < names.length; j++) {
        var key = _caseReportNormKey_(names[j]);
        if (_appHasOwnProperty_(normalized, key)) {
            var v = _caseReportText_(normalized[key]);
            if (v)
                return v;
        }
    }
    return "";
}

function _caseReportValueAt_(row, index) {
    return index >= 0 ? _caseReportText_((row || [])[index]) : "";
}

function _caseReportStatus_(value) {
    return _caseStatusNormalize_(value, {
        defaultStatus: "เรื่องเข้าใหม่",
        warningKey: "case.report.phase3.status",
    });
}

function _caseReportIsDeleted_(row) {
    var marker = _caseReportText_(row && (row.isDeleted || row.deleted || row.ลบ || row.สถานะลบ || "")).toLowerCase(), deletedAt = _caseReportText_(row && (row.deletedAt || row.วันที่ลบ || ""));
    return !!deletedAt || /^(true|1|yes|deleted|ลบ)$/i.test(marker);
}

function _caseReportFirstNumber_(value) {
    var m = _caseReportThaiDigits_(value).replace(/^'+/, "").match(/^\d+/);
    return m ? Number(m[0]) : Number.POSITIVE_INFINITY;
}

function _caseReportSortText_(value) {
    return _caseReportText_(value).toLowerCase();
}

function _caseReportSplitLines_(value) {
    return _caseReportUnique_(_caseReportText_(value)
        .split(/[\n;,]+/)
        .map(function (x) {
        return _caseReportText_(x);
    })
        .filter(Boolean));
}

function _caseReportMergeLines_(existing, incoming) {
    return _caseReportUnique_(_caseReportSplitLines_(existing).concat(_c30A_(incoming) ? incoming : _caseReportSplitLines_(incoming))).join(`
`);
}

function _caseReportMeetingType_(log) {
    log = log || {};
    var raw = _caseReportText_(log.committeeType ||
        log.meetingType ||
        log.type ||
        log.meetingGroup ||
        log.ประเภทการประชุม ||
        ""), sub = _caseReportText_(log.subcommitteeName ||
        log.subcommittee ||
        log.subCommitteeName ||
        log.คณะอนุกรรมาธิการ ||
        "");
    return /อนุกรรมาธิการ/.test(raw) || sub ? "subcommittee" : "committee";
}

function _caseReportMeetingText_(log) {
    log = log || {};
    function cleanRound(v) {
        return _caseReportText_(v)
            .replace(/^ครั้งที่\s*/i, "")
            .replace(/^ครั้งประชุม\s*/i, "")
            .trim();
    }
    var round = cleanRound(log.round ||
        log.meetingRound ||
        log.meetingNo ||
        log.relatedMeetingNo ||
        log.roundNo ||
        log.ครั้งที่ ||
        log.ครั้งที่ประชุม ||
        log.การประชุมครั้งที่ ||
        ""), dateRaw = log.date ||
        log.meetingDate ||
        log.relatedMeetingDate ||
        log.dateRaw ||
        log.วันที่ประชุม ||
        log.วันประชุม ||
        "", date = "";
    try {
        date = _appIsFnName_("_committeeMeetingDateText_")
            ? _committeeMeetingDateText_(dateRaw)
            : "";
    }
    catch (_dateErr) {
        date = "";
    }
    date = _caseReportText_(date || dateRaw);
    var parts = [];
    if ((round && parts.push("ครั้งที่ " + round),
        date && parts.push("วันที่ประชุม " + date),
        !parts.length)) {
        var note = _caseReportText_(log.summary || log.result || log.note || log.title || "");
        note && parts.push(note);
    }
    return parts.join(" / ");
}

function _caseReportCaseIdentityKeys_(row) {
    row = row || {};
    var out = [], caseId = _caseReportText_(row.caseId || row.case_id || row.recordId || row.uid || ""), caseNum = _caseReportText_(row.caseNum || row.caseNo || row.runningNo || row.ลำดับเรื่อง || "");
    function put(prefix, value) {
        ((value = _caseReportCompact_(value)),
            value && out.push(prefix + value));
    }
    return (caseId &&
        !/^MAIN-\d+$/i.test(caseId) &&
        !/^ROW-\d+$/i.test(caseId) &&
        put("id:", caseId),
        caseNum && put("n:", caseNum),
        _caseReportUnique_(out));
}

function _caseReportLogIdentityKeys_(log) {
    log = log || {};
    var seed = {
        caseId: _caseReportText_(log.caseId || log.case_id || ""),
        caseNum: _caseReportText_(log.caseNum || log.caseNo || log.runningNo || log.ลำดับเรื่อง || ""),
    }, bk = _caseReportText_(log.phase2BusinessKey || "");
    if (bk) {
        var parts = bk.split("|").map(_caseReportText_);
        ((seed.caseId = seed.caseId || parts[0] || ""),
            (seed.caseNum = seed.caseNum || parts[1] || ""));
    }
    return _caseReportCaseIdentityKeys_(seed);
}

function _caseReportMeetingHistoryIndex_() {
    var idx = {}, logs = [];
    try {
        logs = _appIsFnName_("_meetingHistoryProjectedRows_")
            ? _meetingHistoryProjectedRows_()
            : [];
    }
    catch (_histErr) {
        (_c30W_("case.report.phase3.meetingRead", _histErr), (logs = []));
    }
    function put(key, kind, text, sortKey) {
        if (((key = _caseReportText_(key)),
            (text = _caseReportText_(text)),
            !(!key || !text))) {
            var slot = idx[key] || (idx[key] = {
                committee: [], subcommittee: []
            }), arr = slot[kind] || (slot[kind] = []);
            arr.some(function (item) {
                return item.text === text;
            }) || arr.push({
                text, sortKey: sortKey || text
            });
        }
    }
    return ((_c30A_(logs) ? logs : []).forEach(function (log) {
        if (((log = log || {}), !_caseReportIsDeleted_(log))) {
            var kind = _caseReportMeetingType_(log), text = _caseReportMeetingText_(log), sortKey = [
                _caseReportText_(log.dateRaw || log.date || log.meetingDate || ""),
                _caseReportText_(log.round || log.meetingRound || log.meetingNo || ""),
                text,
            ].join("|");
            text &&
                _caseReportLogIdentityKeys_(log).forEach(function (key) {
                    put(key, kind, text, sortKey);
                });
        }
    }),
        Object.keys(idx).forEach(function (key) {
            [
                "committee", "subcommittee"
            ].forEach(function (kind) {
                idx[key][kind] = (idx[key][kind] || [])
                    .sort(function (a, b) {
                    return _s_(a.sortKey).localeCompare(_s_(b.sortKey), "th", {
                        numeric: !0,
                        sensitivity: "base",
                    });
                })
                    .map(function (item) {
                    return item.text;
                });
            });
        }),
        idx);
}

function _caseReportApplyMeetingHistory_(rows) {
    rows = _c30A_(rows) ? rows : [];
    var idx = _caseReportMeetingHistoryIndex_(), matched = 0;
    return ((rows = rows.map(function (row) {
        row = row || {};
        var comm = [], sub = [];
        return (_caseReportCaseIdentityKeys_(row).forEach(function (key) {
            var slot = idx[key];
            slot &&
                ((comm = comm.concat(slot.committee || [])),
                    (sub = sub.concat(slot.subcommittee || [])));
        }),
            (comm = _caseReportUnique_(comm)),
            (sub = _caseReportUnique_(sub)),
            (comm.length || sub.length) && (matched += 1),
            (row.committeeHistory = _caseReportMergeLines_(row.committeeHistory ||
                row.committeeMeeting ||
                row.คณะกรรมาธิการ ||
                "", comm)),
            (row.committeeMeeting = row.committeeHistory),
            (row.คณะกรรมาธิการ = row.committeeHistory),
            (row.subcommitteeHistory = _caseReportMergeLines_(row.subcommitteeHistory ||
                row.subcommitteeMeeting ||
                row.คณะอนุกรรมาธิการ ||
                "", sub)),
            (row.subcommitteeMeeting = row.subcommitteeHistory),
            (row.คณะอนุกรรมาธิการ = row.subcommitteeHistory),
            row);
    })),
        (rows.__meetingHistoryMatchedCurrent = matched),
        rows);
}

function _caseReportMainFields_() {
    return {
        caseId: _caseReportAliases_("cases", "caseId", [
            "caseId",
            "id",
            "รหัส",
            "รหัสเรื่อง",
            "รหัสเรื่องพิจารณา",
        ]),
        caseNum: _caseReportAliases_("cases", "caseNum", [
            "ลำดับเรื่อง",
            "เลขลำดับเรื่อง",
            "caseNum",
            "caseNo",
            "runningNo",
        ]),
        recNo: _caseReportAliases_("cases", "recNo", [
            "เลขรับเรื่อง",
            "เลขรับ",
            "เลขที่รับเรื่อง",
            "รับเรื่องเลขที่",
            "ทะเบียนรับ",
            "recNo",
            "receiveNo",
            "receivedNo",
            "receiptNo",
        ]),
        recDate: _caseReportAliases_("cases", "recDate", [
            "วันที่รับเรื่อง",
            "วันที่รับ",
            "วันรับเรื่อง",
            "recDate",
            "receiveDate",
            "receivedDate",
            "dateReceived",
        ]),
        title: _caseReportAliases_("cases", "title", [
            "ชื่อเรื่อง",
            "เรื่อง",
            "subject",
            "title",
            "เรื่องร้องเรียน",
        ]),
        caseTitle: _caseReportAliases_("cases", "caseTitle", [
            "ชื่อเรื่องพิจารณา (ถ้ามี)",
            "ชื่อเรื่องพิจารณา",
            "เรื่องพิจารณา",
            "caseTitle",
            "considerationTitle",
        ]),
        petitioners: _caseReportAliases_("cases", "petitioners", [
            "ผู้เสนอญัตติ/ผู้ร้อง",
            "ผู้เสนอญัตติ",
            "ผู้ร้อง",
            "ผู้ร้องเรียน",
            "ผู้เสนอ",
            "petitioners",
            "petitionerName",
            "proposer",
            "complainant",
        ]),
        respondent: _caseReportAliases_("cases", "respondent", [
            "ผู้ถูกร้อง",
            "หน่วยงาน / ผู้ถูกร้อง",
            "หน่วยงาน/ผู้ถูกร้อง",
            "respondent",
            "agencyName",
            "accusedAgency",
            "agency",
        ]),
        agencyName: _caseReportAliases_("cases", "agencyName", [
            "หน่วยงาน",
            "agency",
            "agencyName",
            "accusedAgency",
            "หน่วยงานที่ส่ง",
        ]),
        sentAgency: [
            "sentAgency",
            "sendToAgency",
            "sentAgencyName",
            "forwardAgency",
            "หน่วยงานที่ส่ง",
            "ส่งให้หน่วยงาน",
            "หน่วยงานที่เกี่ยวข้อง",
        ],
        assignees: _caseReportAliases_("cases", "assignees", [
            "กมธ.รับผิดชอบ",
            "กมธ. รับผิดชอบ",
            "กรรมาธิการรับผิดชอบ",
            "คณะกรรมาธิการรับผิดชอบ",
            "ผู้รับผิดชอบ",
            "ผู้รับผิดชอบหลัก",
            "assignees",
            "owner",
            "responsibleCommittee",
            "committeeOwner",
        ]),
        coAssignees: _caseReportAliases_("cases", "coAssignees", [
            "ผู้ร่วมรับผิดชอบ",
            "ผู้รับผิดชอบร่วม",
            "coAssignees",
            "coOwners",
            "coResponsible",
            "subcommittee",
        ]),
        opStaff: _caseReportAliases_("cases", "staffs", [
            "เจ้าหน้าที่ฝ่ายเลขานุการ",
            "เจ้าหน้าที่ฝ่ายปฏิบัติการ",
            "opStaff",
            "staffs",
            "operationOfficer",
            "secretariatOfficer",
            "officer",
            "staff",
        ]),
        cat: _caseReportAliases_("cases", "cat", [
            "ประเภทเรื่อง",
            "ประเภท",
            "cat",
            "caseType",
            "category",
            "type",
        ]),
        subCat: _caseReportAliases_("cases", "subCat", [
            "ประเด็นพิจารณา",
            "ประเด็น",
            "หัวข้อประเด็น",
            "subCat",
            "subCategory",
            "issue",
            "topic",
        ]),
        status: _caseReportAliases_("cases", "status", [
            "สถานะ",
            "สถานะเรื่อง",
            "สถานะเรื่องพิจารณา",
            "สถานะปัจจุบัน",
            "ผลการพิจารณา",
            "status",
            "caseStatus",
            "processStatus",
            "currentStatus",
        ]),
        reason: [
            "เหตุผล",
            "เหตุผลสถานะ",
            "เหตุผลการพิจารณา",
            "reason",
            "statusReason",
            "decisionReason",
        ],
        pendingRemark: _caseReportAliases_("cases", "pendingRemark", [
            "เหตุผลรอพิจารณา",
            "เหตุผลรอการพิจารณา",
            "หมายเหตุรอพิจารณา",
            "หมายเหตุรอการพิจารณา",
            "pendingRemark",
            "pendingReason",
            "waitReason",
            "waitingReason",
        ]),
        rejectionReason: _caseReportAliases_("cases", "rejectionReason", [
            "เหตุผล (ไม่รับเรื่อง)",
            "เหตุผลไม่รับเรื่อง",
            "rejectionReason",
            "rejectReason",
            "notAcceptedReason",
        ]),
        closedReason: _caseReportAliases_("cases", "closedReason", [
            "เหตุผลยุติเรื่อง",
            "เหตุผลการยุติเรื่อง",
            "closedReason",
            "closeReason",
            "terminateReason",
        ]),
        sentAgencyReason: [
            "sentAgencyReason",
            "sendAgencyReason",
            "sendReason",
            "forwardReason",
            "transferReason",
            "เหตุผลส่งหน่วยงาน",
            "เหตุผลการส่งหน่วยงาน",
            "เหตุผลที่ส่งหน่วยงาน",
        ],
        committeeHistory: [
            "คณะกรรมาธิการ",
            "committeeHistory",
            "committeeMeeting",
            "committeeMeetings",
            "meetingCommitteeHistory",
        ],
        subcommitteeHistory: [
            "คณะอนุกรรมาธิการ",
            "subcommitteeHistory",
            "subcommitteeMeeting",
            "subcommitteeMeetings",
            "meetingSubcommitteeHistory",
        ],
        updatedAt: [
            "updatedAt", "แก้ไขล่าสุด"
        ],
        createdAt: [
            "createdAt", "วันที่สร้าง"
        ],
        isDeleted: [
            "isDeleted", "deleted", "ลบ", "สถานะลบ"
        ],
        deletedAt: [
            "deletedAt", "วันที่ลบ"
        ],
    };
}

function _caseReportNormalizeMainRow_(raw, rowNumber, headers, indexes) {
    var fields = _caseReportMainFields_(), source = null;
    function pick(field) {
        return source
            ? _caseReportPickObj_(source, fields[field] || [
                field
            ])
            : _caseReportValueAt_(raw, indexes[field]);
    }
    raw && typeof raw == "object" && !_c30A_(raw) && (source = raw);
    var rawStatus = pick("status"), status = _caseReportStatus_(rawStatus), reason = pick("reason"), pendingReason = pick("pendingRemark"), closedReason = pick("closedReason"), rejectionReason = pick("rejectionReason"), sentAgencyReason = pick("sentAgencyReason");
    (status === "รอพิจารณา" && !pendingReason && (pendingReason = reason),
        status === "ยุติเรื่อง" && !closedReason && (closedReason = reason),
        status === "ไม่รับเรื่อง" && !rejectionReason && (rejectionReason = reason),
        status === "ส่งหน่วยงาน" &&
            !sentAgencyReason &&
            (sentAgencyReason = reason));
    var caseNum = pick("caseNum"), recNo = pick("recNo"), recDate = pick("recDate"), title = pick("title"), caseTitle = pick("caseTitle"), displayTitle = title || caseTitle, respondent = pick("respondent") || pick("agencyName"), id = pick("caseId") || "MAIN-" + _s_(rowNumber), statusReason = status === "รอพิจารณา"
        ? pendingReason
        : status === "ไม่รับเรื่อง"
            ? rejectionReason
            : status === "ยุติเรื่อง"
                ? closedReason
                : status === "ส่งหน่วยงาน"
                    ? sentAgencyReason
                    : "", row = {
        id,
        caseId: id,
        seq: Number(rowNumber || 1) - 1,
        __rowNumber: rowNumber || "",
        caseNo: caseNum,
        caseNum,
        runningNo: caseNum,
        recNo,
        receiveNo: recNo,
        recDate,
        recDateText: recDate,
        receiveDate: recDate,
        receiveDateText: recDate,
        title: displayTitle,
        subject: displayTitle,
        caseTitle: caseTitle || displayTitle,
        considerationTitle: caseTitle || displayTitle,
        petitioners: pick("petitioners"),
        petitionerName: pick("petitioners"),
        respondent,
        agency: respondent,
        agencyName: respondent,
        sentAgency: pick("sentAgency"),
        sendToAgency: pick("sentAgency"),
        assignees: pick("assignees"),
        owner: pick("assignees"),
        coAssignees: pick("coAssignees"),
        coOwners: pick("coAssignees"),
        opStaff: pick("opStaff"),
        operationOfficer: pick("opStaff"),
        staffs: pick("opStaff"),
        cat: pick("cat"),
        caseType: pick("cat"),
        subCat: pick("subCat"),
        subCategory: pick("subCat"),
        committeeHistory: pick("committeeHistory"),
        committeeMeeting: pick("committeeHistory"),
        subcommitteeHistory: pick("subcommitteeHistory"),
        subcommitteeMeeting: pick("subcommitteeHistory"),
        status,
        statusRaw: rawStatus,
        reason: statusReason ||
            reason ||
            pendingReason ||
            closedReason ||
            rejectionReason ||
            sentAgencyReason,
        pendingRemark: pendingReason,
        pendingReason,
        closedReason,
        rejectionReason,
        sentAgencyReason,
        statusReason: statusReason || reason,
        decisionReason: statusReason || reason,
        updatedAt: pick("updatedAt"),
        createdAt: pick("createdAt"),
        type: "case",
        typeLabel: "เรื่องพิจารณา",
    };
    return ((row.ลำดับเรื่อง = row.caseNum),
        (row.เลขรับเรื่อง = row.recNo),
        (row.วันที่รับเรื่อง = row.recDateText),
        (row.ชื่อเรื่อง = row.title),
        (row["ชื่อเรื่องพิจารณา (ถ้ามี)"] = row.considerationTitle),
        (row["ผู้เสนอญัตติ/ผู้ร้อง"] = row.petitioners),
        (row.ผู้ถูกร้อง = row.respondent),
        (row.คณะกรรมาธิการ = row.committeeHistory),
        (row.คณะอนุกรรมาธิการ = row.subcommitteeHistory),
        (row.สถานะ = row.status),
        (row.เหตุผล = row.reason),
        (row.reportColumns = {
            caseNo: row.caseNo,
            recNo: row.recNo,
            recDateText: row.recDateText,
            title: row.title,
            considerationTitle: row.considerationTitle,
            committeeHistory: row.committeeHistory || "",
            subcommitteeHistory: row.subcommitteeHistory || "",
            petitioners: row.petitioners,
            respondent: row.respondent,
            assignees: row.assignees,
            coAssignees: row.coAssignees,
            status: row.status,
            reason: row.reason || "",
        }),
        row);
}

function _caseReportProjectedFieldsK_() {
    return _caseReportUnique_([
        "caseId", "id", "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง",
        "recNo", "receiveNo", "เลขรับเรื่อง", "เลขที่รับเรื่อง",
        "recDate", "receiveDate", "วันที่รับเรื่อง",
        "title", "subject", "ชื่อเรื่อง", "เรื่อง",
        "caseTitle", "considerationTitle", "ชื่อเรื่องพิจารณา (ถ้ามี)", "ชื่อเรื่องพิจารณา",
        "petitioners", "petitionerName", "ผู้เสนอญัตติ/ผู้ร้อง", "ผู้ร้อง", "ผู้เสนอญัตติ",
        "respondent", "agencyName", "ผู้ถูกร้อง", "หน่วยงาน/ผู้ถูกร้อง", "หน่วยงาน",
        "sentAgency", "sendToAgency", "หน่วยงานที่ส่ง", "ส่งให้หน่วยงาน",
        "assignees", "owner", "ผู้รับผิดชอบ", "กมธ.รับผิดชอบ",
        "coAssignees", "coOwners", "ผู้รับผิดชอบร่วม",
        "opStaff", "staffs", "operationOfficer", "เจ้าหน้าที่ฝ่ายเลขานุการ",
        "cat", "caseType", "ประเภทเรื่อง", "ประเภท",
        "subCat", "subCategory", "ประเด็นพิจารณา", "ประเด็น",
        "status", "caseStatus", "processStatus", "สถานะ", "สถานะเรื่อง",
        "reason", "statusReason", "decisionReason", "เหตุผล",
        "pendingRemark", "pendingReason", "เหตุผลรอพิจารณา", "เหตุผลรอการพิจารณา", "หมายเหตุรอพิจารณา",
        "rejectionReason", "rejectReason", "เหตุผล (ไม่รับเรื่อง)", "เหตุผลไม่รับเรื่อง",
        "closedReason", "closeReason", "เหตุผลยุติเรื่อง",
        "sentAgencyReason", "sendAgencyReason", "เหตุผลส่งหน่วยงาน",
        "updatedAt", "createdAt", "isDeleted", "deletedAt"
    ]);
}

function _caseReportCompactBaseRowK_(row) {
    row = row || {};
    var keys = [
        "id", "caseId", "seq", "__rowNumber", "caseNo", "caseNum", "runningNo",
        "recNo", "receiveNo", "recDate", "recDateText", "receiveDate", "receiveDateText",
        "title", "subject", "caseTitle", "considerationTitle", "petitioners",
        "petitionerName", "respondent", "agency", "agencyName", "sentAgency",
        "sendToAgency", "assignees", "owner", "coAssignees", "coOwners", "opStaff",
        "operationOfficer", "staffs", "cat", "caseType", "subCat", "subCategory",
        "committeeHistory", "committeeMeeting", "subcommitteeHistory", "subcommitteeMeeting",
        "status", "statusRaw", "reason", "pendingRemark", "pendingReason", "closedReason",
        "rejectionReason", "sentAgencyReason", "statusReason", "decisionReason", "updatedAt",
        "createdAt", "type", "typeLabel", "reportColumns", "ลำดับเรื่อง", "เลขรับเรื่อง",
        "วันที่รับเรื่อง", "ชื่อเรื่อง", "ชื่อเรื่องพิจารณา (ถ้ามี)", "ผู้เสนอญัตติ/ผู้ร้อง",
        "ผู้ถูกร้อง", "คณะกรรมาธิการ", "คณะอนุกรรมาธิการ", "สถานะ", "เหตุผล"
    ], out = {};
    keys.forEach(function (key) {
        row[key] !== void 0 && row[key] !== null && (out[key] = row[key]);
    });
    return out;
}

function _caseReportReadMainRows_(payload) {
    payload = payload || {};
    var started = Date.now(), projectedFields = _caseReportProjectedFieldsK_(), ttl = payload.forceFresh === !0 || payload.noCache === !0 || payload.bypassCache === !0
        ? 0
        : Math.max(60, Math.min(Number(payload.cacheTtlSeconds || 300) || 300, 600)), projected;
    if (typeof readSheetProjectedObjectsCached_ != "function")
        throw new Error("CASE_REPORT_PROJECTED_READER_UNAVAILABLE");
    try {
        var caseSequence = _caseSequenceFrom_(payload), projectedReadOptions = {
            includeDeleted: !0,
            requireCanonical: !1,
            ttl: ttl,
            sparseRead: !0,
            projectedReadMode: "sparse",
            maxColumnSpans: 4,
            batchSize: 500
        };
        caseSequence && (projectedReadOptions.selectKeyField = "caseNum",
            projectedReadOptions.selectKeyValues = [caseSequence],
            projectedReadOptions.selectionMode = "primary-key-case-sequence",
            projectedReadOptions.selectionFallbackOnEmpty = !0);
        projected = readSheetProjectedObjectsCached_("MainData", projectedFields, projectedReadOptions) || [];
    }
    catch (e) {
        _c30W_("case.report.performanceK.projectedRead", e, {
            source: _s_(payload.source),
            fullMatrixFallback: !1
        });
        throw e;
    }
    if (!_c30A_(projected))
        throw new Error("CASE_REPORT_PROJECTED_READER_INVALID_RESULT");
    var activeSourceRows = 0, identityRows = 0, rows = [], defs = _caseReportMainFields_(), probeFields = [
        "caseId", "caseNum", "recNo", "title", "caseTitle", "petitioners", "status", "isDeleted", "updatedAt"
    ];
    projected.forEach(function (raw, idx) {
        raw = raw || {};
        var hasAny = probeFields.some(function (field) {
            return _caseReportText_(_caseReportPickObj_(raw, defs[field] || [field])) !== "";
        });
        if (!hasAny)
            return;
        activeSourceRows++;
        var deletionProbe = {
            isDeleted: _caseReportPickObj_(raw, defs.isDeleted || ["isDeleted"]),
            deletedAt: _caseReportPickObj_(raw, defs.deletedAt || ["deletedAt"])
        };
        if (_caseReportIsDeleted_(deletionProbe))
            return;
        var normalized = _caseReportNormalizeMainRow_(raw, idx + 2, [], {}), hasIdentity = !!_caseReportText_(normalized.caseNum || normalized.caseNo || normalized.recNo || normalized.title || normalized.petitioners || "");
        if (!hasIdentity)
            return;
        identityRows++;
        rows.push(_caseReportCompactBaseRowK_(normalized));
    });
    if (activeSourceRows > 0 && identityRows === 0) {
        var schemaErr = new Error("CASE_REPORT_PROJECTED_SCHEMA_MISMATCH");
        _c30W_("case.report.performanceK.projectedSchemaMismatch", schemaErr, {
            activeSourceRows: activeSourceRows,
            projectedFieldCount: projectedFields.length,
            fullMatrixFallback: !1
        });
        throw schemaErr;
    }
    try {
        rows.__performanceK = {
            stamp: PERFORMANCE_K_CASE_REPORT_STAMP,
            source: "MainData.projected-sparse",
            fullMatrixFallback: !1,
            projectedFieldCount: projectedFields.length,
            projectionMeta: projected.__projectionMeta || {},
            activeSourceRows: activeSourceRows,
            identityRows: identityRows,
            durationMs: Math.max(0, Date.now() - started)
        };
    }
    catch (_metaErr) {
        _c30W_("case.report.performanceK.meta", _metaErr);
    }
    return rows;
}

function _caseReportRoleK_(payload) {
    payload = payload || {};
    var security = payload._securityContext || payload.__securityContext || {};
    return _caseReportText_(security.role || payload.role || "viewer").toLowerCase() || "viewer";
}

function _caseReportBaseRowsK_(payload) {
    payload = payload || {};
    var started = Date.now(), includeMeetingHistory = payload.includeMeetingHistory === !0, allowCache = payload.forceFresh !== !0 && payload.noCache !== !0 && payload.bypassCache !== !0, role = _caseReportRoleK_(payload), targetKey = includeMeetingHistory ? "base-with-meeting-history" : "base-core", persistent = null;
    if (allowCache && _appIsFnName_("_persistentSummarySnapshotRead_"))
        try {
            persistent = _persistentSummarySnapshotRead_("case-report", targetKey, role, {
                requestId: payload.requestId || "",
                ttlSeconds: 1800
            });
            if (persistent && persistent.bundle && _c30A_(persistent.bundle.rows))
                return {
                    rows: persistent.bundle.rows,
                    rowsRead: 0,
                    meetingHistoryMatchedRows: Number(persistent.bundle.meetingHistoryMatchedRows || 0) || 0,
                    persistentSnapshotHit: !0,
                    persistentSnapshotMeta: persistent.meta || {},
                    source: "CaseReportPersistentSnapshot.performanceK.r166",
                    durationMs: Math.max(0, Date.now() - started),
                    fullMatrixFallback: !1
                };
        }
        catch (_persistentReadErr) {
            _c30W_("case.report.performanceK.persistentRead", _persistentReadErr, { targetKey: targetKey, role: role });
        }
    var rows = _caseReportReadMainRows_(payload), rowsRead = rows.length, meetingMatched = 0;
    if (includeMeetingHistory) {
        rows = _caseReportApplyMeetingHistory_(rows);
        meetingMatched = Number(rows.__meetingHistoryMatchedCurrent || 0) || 0;
        rows = rows.map(_caseReportCompactBaseRowK_);
    }
    if (allowCache && _appIsFnName_("_persistentSummarySnapshotWrite_"))
        try {
            var stored = _persistentSummarySnapshotWrite_("case-report", targetKey, role, {
                rows: rows,
                meetingHistoryMatchedRows: meetingMatched,
                authoritative: !0,
                authoritativeEmpty: rows.length === 0
            }, {
                ttlSeconds: 1800,
                source: "CaseReportPersistentSnapshot.performanceK.r166",
                stamp: PERFORMANCE_K_CASE_REPORT_STAMP
            });
            rows.__persistentSnapshotStored = !!(stored && stored.stored);
        }
        catch (_persistentWriteErr) {
            _c30W_("case.report.performanceK.persistentWrite", _persistentWriteErr, { targetKey: targetKey, role: role });
        }
    return {
        rows: rows,
        rowsRead: rowsRead,
        meetingHistoryMatchedRows: meetingMatched,
        persistentSnapshotHit: !1,
        source: "CaseReportProjectedRead.performanceK.r166",
        durationMs: Math.max(0, Date.now() - started),
        fullMatrixFallback: !1,
        projectionMeta: rows.__performanceK || {}
    };
}

function _caseReportMatches_(row, payload) {
    ((payload = payload || {}), (row = row || {}));
    var q = _caseReportText_(payload.query || payload.q || payload.keyword || "").toLowerCase(), reportType = _caseReportText_(payload.reportType || payload.groupType || payload.type || "all").toLowerCase(), reportValue = _caseReportText_(payload.reportValue || payload.groupValue || payload.value || "");
    if (q) {
        var hay = [
            row.caseNo,
            row.caseNum,
            row.recNo,
            row.receiveNo,
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
            row.owner,
            row.coOwners,
            row.coAssignees,
            row.opStaff,
            row.operationOfficer,
            row.staffs,
            row.committeeHistory,
            row.subcommitteeHistory,
            row.status,
            row.cat,
            row.subCat,
            row.reason,
            row.pendingReason,
            row.pendingRemark,
        ]
            .join(" ")
            .toLowerCase();
        if (hay.indexOf(q) < 0)
            return !1;
    }
    if (reportType && reportType !== "all" && reportValue) {
        var field = reportType === "cat"
            ? row.cat
            : reportType === "sub"
                ? row.subCat
                : reportType === "comm"
                    ? row.assignees
                    : reportType === "status"
                        ? row.status
                        : "";
        if (reportType === "status") {
            if (_caseReportStatus_(field) !==
                _caseReportStatus_(reportValue))
                return !1;
        }
        else if (reportType === "comm") {
            if (_caseReportText_(field).indexOf(reportValue) < 0)
                return !1;
        }
        else if (_caseReportText_(field) !== reportValue)
            return !1;
    }
    return !0;
}

function _caseReportSortRows_(rows, payload) {
    payload = payload || {};
    var sortBy = _caseReportText_(payload.sortBy || "caseNum") || "caseNum", desc = _caseReportText_(payload.sortDir || "asc").toLowerCase() === "desc";
    return (_c30A_(rows) ? rows : []).slice().sort(function (a, b) {
        var av, bv;
        if ((sortBy === "caseNum" || sortBy === "caseNo" || sortBy === "runningNo"
            ? ((av = _caseReportFirstNumber_(a && (a.caseNum || a.caseNo || a.runningNo))),
                (bv = _caseReportFirstNumber_(b && (b.caseNum || b.caseNo || b.runningNo))))
            : sortBy === "recNo" || sortBy === "receiveNo"
                ? ((av = _caseReportFirstNumber_(a && (a.recNo || a.receiveNo))),
                    (bv = _caseReportFirstNumber_(b && (b.recNo || b.receiveNo))))
                : ((av = _caseReportSortText_(a && a[sortBy])),
                    (bv = _caseReportSortText_(b && b[sortBy]))),
            av !== bv))
            return (av > bv ? 1 : -1) * (desc ? -1 : 1);
        var ar = Number((a && a.__rowNumber) || 0) || 0, br = Number((b && b.__rowNumber) || 0) || 0;
        return ar !== br
            ? ar - br
            : _caseReportSortText_(a && a.recNo).localeCompare(_caseReportSortText_(b && b.recNo), "th", {
                numeric: !0, sensitivity: "base"
            });
    });
}

function _caseReportReadModelBase_(payload) {
    payload = payload || {};
    var started = Date.now(), includeMeetingHistory = payload.includeMeetingHistory === !0, noPage = payload.noPage === !0 ||
        payload.fullList === !0 ||
        payload.serverPaged === !1, requestedLimit = Math.max(1, Math.min(Number(payload.limit || payload.pageSize || 20) || 20, noPage ? 5e3 : 100)), page = Math.max(1, Number(payload.page || 1) || 1), allowCache = payload.forceFresh !== !0 &&
        payload.noCache !== !0 &&
        payload.bypassCache !== !0, cacheScope = {
        q: _caseReportText_(payload.query || payload.q || payload.keyword || "").toLowerCase(),
        reportType: _caseReportText_(payload.reportType || payload.groupType || payload.type || "all").toLowerCase(),
        reportValue: _caseReportText_(payload.reportValue || payload.groupValue || payload.value || ""),
        sortBy: _caseReportText_(payload.sortBy || "caseNum"),
        sortDir: _caseReportText_(payload.sortDir || "asc"),
        page: noPage ? 1 : page,
        limit: requestedLimit,
        includeMeetingHistory: includeMeetingHistory ? 1 : 0,
        noPage: noPage ? 1 : 0,
        mainStamp: _appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("maindata")
            : "1",
        meetingStamp: includeMeetingHistory && _appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("meeting")
            : "0",
        model: CASE_REPORT_READ_MODEL_STAMP_CURRENT,
    }, cacheKey = "case_report_read_model_current_" +
        (_appIsFnName_("_buildDigestHex_")
            ? _buildDigestHex_(JSON.stringify(cacheScope))
            : String(cacheScope.page) + "_" + String(cacheScope.limit));
    if (allowCache && _appIsFnName_("_cacheGetJson_")) {
        var hit = _cacheGetJson_(cacheKey);
        if (hit && typeof hit == "object")
            return ((hit.cacheHit = !0),
                (hit.cacheStatus = "hit"),
                (hit.durationMs = Math.max(0, Date.now() - started)),
                hit);
    }
    var baseRows = _caseReportBaseRowsK_(payload), allRows = _c30A_(baseRows && baseRows.rows) ? baseRows.rows.slice() : [], rowsRead = Number(baseRows && baseRows.rowsRead || allRows.length || 0) || 0, meetingMatched = Number(baseRows && baseRows.meetingHistoryMatchedRows || 0) || 0;
    var filtered = allRows.filter(function (row) {
        return _caseReportMatches_(row, payload);
    });
    filtered = _caseReportSortRows_(filtered, payload);
    var totalRecords = filtered.length, pageSize = noPage
        ? Math.max(1, Math.min(Number(payload.maxRows || payload.limit || totalRecords || 5e3) ||
            5e3, 5e3))
        : requestedLimit, totalPages = noPage ? 1 : Math.max(1, Math.ceil(totalRecords / pageSize)), safePage = noPage ? 1 : Math.max(1, Math.min(page, totalPages)), start = noPage ? 0 : (safePage - 1) * pageSize, outRows = noPage
        ? filtered.slice(0, pageSize)
        : filtered.slice(start, start + pageSize), res = {
        ok: !0,
        rows: outRows,
        data: outRows,
        items: outRows,
        totalRecords,
        total: totalRecords,
        page: safePage,
        limit: pageSize,
        pageSize,
        totalPages,
        columns: typeof AppBackendCore != "undefined" && AppBackendCore.reportColumns
            ? AppBackendCore.reportColumns()
            : [],
        owner: "CaseDomain.searchCases",
        source: "CaseReportReadModel.phase3",
        readModel: CASE_REPORT_READ_MODEL_STAMP_CURRENT,
        serverPaged: !noPage,
        serverFiltered: !0,
        rowsRead,
        returnedRows: outRows.length,
        durationMs: Math.max(0, Date.now() - started),
        cacheHit: !1,
        cacheStatus: allowCache ? "miss" : "bypass",
        meetingHistoryAttached: includeMeetingHistory,
        meetingHistoryMatchedRows: meetingMatched,
        meta: {
            source: "CaseReportReadModel.phase3",
            sourceOfTruth: "MainData+MeetingLogs",
            readModelOwner: "Code_30_Domain_Cases._caseReportReadModelBase_",
            serverPaged: !noPage,
            serverFiltered: !0,
            rowsRead,
            returnedRows: outRows.length,
            durationMs: Math.max(0, Date.now() - started),
            includeMeetingHistory,
            meetingHistoryMatchedRows: meetingMatched,
            readModelStamp: CASE_REPORT_READ_MODEL_STAMP_CURRENT,
            performanceK: {
                stamp: PERFORMANCE_K_CASE_REPORT_STAMP,
                source: String(baseRows && baseRows.source || ""),
                persistentSnapshotHit: !!(baseRows && baseRows.persistentSnapshotHit),
                fullMatrixFallback: !1,
                projectionMeta: baseRows && baseRows.projectionMeta || {},
                baseReadDurationMs: Number(baseRows && baseRows.durationMs || 0) || 0
            },
        },
        persistentSnapshotHit: !!(baseRows && baseRows.persistentSnapshotHit),
        fullMatrixFallback: !1,
    };
    if ((typeof AppBackendCore != "undefined" &&
        AppBackendCore.normalizeCaseSearchResponse &&
        (res = AppBackendCore.normalizeCaseSearchResponse(res)),
        allowCache && _appIsFnName_("_cachePutJson_")))
        try {
            _cachePutJson_(cacheKey, res, Math.max(30, Math.min(Number(payload.cacheTtlSeconds || 120) || 120, 300)));
        }
        catch (_putErr) {
            _c30W_("case.report.phase3.cachePut", _putErr);
        }
    return res;
}

function _caseReportFacets_(payload) {
    payload = payload || {};
    var started = Date.now(), model = _caseReportReadModel_(_appAssignObjects_({}, payload, {
        noPage: !0,
        fullList: !0,
        serverPaged: !1,
        includeMeetingHistory: !1,
        limit: 5e3,
        pageSize: 5e3,
        __caseReportIndexMode: "reportOptions",
        __route: "CaseDomain.getReportOptions",
        source: "case-report-options-phase4",
    })), rows = _c30A_(model.rows) ? model.rows : [];
    function values(key) {
        var seen = {}, out = [];
        return (rows.forEach(function (row) {
            _caseReportText_((row && row[key]) || "")
                .split(",")
                .map(_caseReportText_)
                .filter(Boolean)
                .forEach(function (v) {
                seen[v] || ((seen[v] = 1), out.push(v));
            });
        }),
            out.sort(function (a, b) {
                return a.localeCompare(b, "th");
            }));
    }
    return {
        filteredTotal: rows.length,
        reportType: String(payload.reportType || "all"),
        query: _s_(payload.query || payload.q || payload.keyword),
        cat: values("cat"),
        sub: values("subCat"),
        comm: values("assignees"),
        status: values("status"),
        generatedAt: new Date().toISOString(),
        source: "CaseReportFacets.phase4",
        readModel: CASE_REPORT_INDEX_STAMP_CURRENT,
        cacheHit: !!model.cacheHit,
        cacheStatus: model.cacheStatus || "bypass",
        rowsRead: Number(model.rowsRead || rows.length || 0),
        durationMs: Math.max(0, Date.now() - started),
        meta: {
            source: "CaseReportFacets.phase4",
            readModel: CASE_REPORT_INDEX_STAMP_CURRENT,
            domainOwner: "CaseDomain",
        },
    };
}

function _caseSearchReadModel_(payload) {
    return ((payload = payload || {}),
        typeof AppDataService != "undefined" &&
            AppDataService &&
            AppDataService.readCaseSearchModel
            ? AppDataService.readCaseSearchModel(payload)
            : _caseReportReadModelBase_(payload));
}

function _caseSearchReportFacets_(payload) {
    return _caseReportFacets_(payload || {});
}

function _caseReportIndexPolicy_() {
    return {
        ok: !0,
        stamp: CASE_REPORT_INDEX_STAMP_CURRENT,
        owner: "Code_30_Domain_Cases.CaseReportIndexCurrent",
        sourceOfTruth: "MainData+MeetingLogs",
        cachePrefix: "case_report_index_current_",
        ttlSeconds: {
            search: 180, reportOptions: 240, export: 90, max: 300
        },
        invalidatedByRoutes: [
            "apiSaveCase",
            "apiDeleteCase",
            "apiSaveMeetingLog",
            "apiDeleteMeetingLog",
            "apiSaveCommitteeMeetingSystem",
            "apiDeleteCommitteeMeetingSystem",
        ],
        qaMethods: [
            "apiSearchCasesLite",
            "apiGetCaseReportOptions",
            "apiGetCaseReportExportRows",
        ],
        uiDomChanged: !1,
        businessLogicChanged: !1,
    };
}

function _caseReportIndexStamp_(domain) {
    domain = String(domain || "case")
        .trim()
        .toLowerCase();
    try {
        if (_appIsFnName_("_entityCacheStamp_"))
            return String(_entityCacheStamp_(domain) || "1");
    }
    catch (_stampErr) {
        _c30W_("case.report.phase4.stamp", _stampErr, {
            domain
        });
    }
    try {
        if (_appIsFnName_("_routerEntityCacheStamp_"))
            return String(_routerEntityCacheStamp_(domain) || "1");
    }
    catch (_routerStampErr) {
        _c30W_("case.report.phase4.routerStamp", _routerStampErr, {
            domain
        });
    }
    return "1";
}

function _caseReportIndexScope_(payload) {
    payload = payload || {};
    var noPage = payload.noPage === !0 ||
        payload.fullList === !0 ||
        payload.serverPaged === !1, includeMeetingHistory = payload.includeMeetingHistory === !0, limit = Math.max(1, Math.min(Number(payload.limit ||
        payload.pageSize ||
        (noPage ? payload.maxRows || 5e3 : 20)) || (noPage ? 5e3 : 20), noPage ? 5e3 : 100));
    return {
        stamp: CASE_REPORT_INDEX_STAMP_CURRENT,
        phase3: typeof CASE_REPORT_READ_MODEL_STAMP_CURRENT != "undefined"
            ? CASE_REPORT_READ_MODEL_STAMP_CURRENT
            : "phase3-unknown",
        q: _caseReportText_(payload.query || payload.q || payload.keyword || "").toLowerCase(),
        reportType: _caseReportText_(payload.reportType || payload.groupType || payload.type || "all").toLowerCase(),
        reportValue: _caseReportText_(payload.reportValue || payload.groupValue || payload.value || ""),
        sortBy: _caseReportText_(payload.sortBy || "caseNum"),
        sortDir: _caseReportText_(payload.sortDir || "asc").toLowerCase(),
        page: noPage ? 1 : Math.max(1, Number(payload.page || 1) || 1),
        limit,
        maxRows: Math.max(1, Math.min(Number(payload.maxRows || limit) || limit, 5e3)),
        includeMeetingHistory: includeMeetingHistory ? 1 : 0,
        noPage: noPage ? 1 : 0,
        exportMode: _caseReportText_(payload.exportMode || payload.mode || ""),
        compactReadModel: payload.compactReadModel === !0 ? 1 : 0,
        mainStamp: _caseReportIndexStamp_("maindata"),
        caseStamp: _caseReportIndexStamp_("case"),
        meetingStamp: includeMeetingHistory
            ? _caseReportIndexStamp_("meeting")
            : "0",
        route: _caseReportText_(payload.__route || payload.route || payload.source || "case-report-index"),
    };
}

function _caseReportIndexKey_(payload) {
    var scope = _caseReportIndexScope_(payload), digest = _appIsFnName_("_buildDigestHex_")
        ? _buildDigestHex_(JSON.stringify(scope))
        : String(scope.page) +
            "_" +
            String(scope.limit) +
            "_" +
            String(Date.now());
    return {
        key: "case_report_index_current_" + digest, scope
    };
}

function _caseReportIndexTtl_(payload) {
    return ((payload = payload || {}),
        payload.noPage === !0 ||
            payload.fullList === !0 ||
            payload.serverPaged === !1
            ? 90
            : _s_(payload.__caseReportIndexMode) === "reportOptions"
                ? 240
                : Math.max(30, Math.min(Number(payload.cacheTtlSeconds || 180) || 180, 300)));
}

function _caseReportTelemetry_(res, payload, started, cacheInfo) {
    ((res =
        res && typeof res == "object"
            ? res
            : {
                ok: !1, rows: [], data: [], totalRecords: 0
            }),
        (payload = payload || {}));
    var rows = _c30A_(res.rows) ? res.rows : _c30A_(res.data) ? res.data : [], total = Math.max(0, Number(res.totalRecords || res.total || rows.length) || 0), ok = res.ok !== !1, errorCode = _s_(res.errorCode || res.code).trim(), empty = ok && total === 0, meta = _appAssignObjects_({}, res.meta || {});
    return ((meta.phase4Index = {
        stamp: CASE_REPORT_INDEX_STAMP_CURRENT,
        owner: "Code_30_Domain_Cases.CaseReportIndexCurrent",
        source: "CaseReportIndex.phase4",
        sourceOfTruth: "MainData+MeetingLogs",
        cacheKey: (cacheInfo && cacheInfo.key) || "",
        cacheStatus: (cacheInfo && cacheInfo.status) || String(res.cacheStatus || "bypass"),
        cacheHit: !!((cacheInfo && cacheInfo.hit) || res.cacheHit),
        scope: (cacheInfo && cacheInfo.scope) || _caseReportIndexScope_(payload),
        rowsRead: Number(res.rowsRead || meta.rowsRead || rows.length || 0) || 0,
        returnedRows: rows.length,
        totalRecords: total,
        includeMeetingHistory: payload.includeMeetingHistory === !0,
        meetingHistoryMatchedRows: Number(res.meetingHistoryMatchedRows || meta.meetingHistoryMatchedRows || 0) || 0,
        status: ok ? (empty ? "ok-empty" : "ok-data") : "read-error",
        errorCode: ok ? "" : errorCode || "CASE_REPORT_INDEX_READ_FAILED",
        emptyReason: empty ? "filter-or-dataset-empty" : "",
        durationMs: Math.max(0, Date.now() - Number(started || Date.now())),
        uiDomChanged: !1,
        businessLogicChanged: !1,
    }),
        (res.meta = meta),
        (res.indexPolicy = _caseReportIndexPolicy_()),
        (res.readModel = CASE_REPORT_INDEX_STAMP_CURRENT),
        (res.source = "CaseReportIndex.phase4"),
        (res.cacheStatus = meta.phase4Index.cacheStatus),
        (res.cacheHit = meta.phase4Index.cacheHit),
        (res.errorState = meta.phase4Index.status),
        (res.durationMs = meta.phase4Index.durationMs),
        res);
}

function _caseReportReadModel_(payload) {
    payload = payload || {};
    var started = Date.now(), allowCache = payload.forceFresh !== !0 &&
        payload.noCache !== !0 &&
        payload.bypassCache !== !0, idx = _caseReportIndexKey_(payload), cacheInfo = {
        key: idx.key,
        scope: idx.scope,
        status: allowCache ? "miss" : "bypass",
        hit: !1,
    };
    if (allowCache && _appIsFnName_("_cacheGetJson_")) {
        var hit = _cacheGetJson_(idx.key);
        if (hit && typeof hit == "object")
            return ((cacheInfo.status = "hit"),
                (cacheInfo.hit = !0),
                (hit.cacheHit = !0),
                (hit.cacheStatus = "hit"),
                _caseReportTelemetry_(hit, payload, started, cacheInfo));
    }
    var res;
    try {
        res = _caseReportReadModelBase_(_appAssignObjects_({}, payload, {
            noCache: !0,
            bypassCache: !0,
            forceFresh: !1,
            __caseReportIndexOwner: CASE_REPORT_INDEX_STAMP_CURRENT,
        }));
    }
    catch (e) {
        (_c30W_("case.report.phase4.readModel", e, {
            source: _s_(payload.source)
        }),
            (res = {
                ok: !1,
                rows: [],
                data: [],
                items: [],
                records: [],
                totalRecords: 0,
                total: 0,
                error: String((e && e.message) || e),
                msg: "อ่านข้อมูลรายงานไม่สำเร็จ",
                errorCode: "CASE_REPORT_INDEX_READ_FAILED",
                meta: {
                    exception: String((e && e.message) || e)
                },
            }));
    }
    if (((res = _caseReportTelemetry_(res, payload, started, cacheInfo)),
        allowCache && res.ok !== !1 && _appIsFnName_("_cachePutJson_")))
        try {
            _cachePutJson_(idx.key, res, _caseReportIndexTtl_(payload));
        }
        catch (_putErr) {
            _c30W_("case.report.phase4.cachePut", _putErr, {
                key: idx.key
            });
        }
    return res;
}

function _hotRouteDigest_(seed) {
    seed = _s_(seed);
    try {
        if (_appIsFnName_("_buildDigestHex_"))
            return _buildDigestHex_(seed);
    }
    catch (_digestErr) {
        _c30W_("hotRoute.digest", _digestErr);
    }
    try {
        return Utilities.base64EncodeWebSafe(seed).substring(0, 96);
    }
    catch (_utilErr) {
        return seed.replace(/[^A-Za-z0-9_-]/g, "_").substring(0, 96);
    }
}

function _hotRouteCacheGet_(key) {
    try {
        if (typeof AppDataService != "undefined" &&
            AppDataService &&
            AppDataService.cacheGet)
            return AppDataService.cacheGet(key);
    }
    catch (_adsGetErr) {
        _c30W_("hotRoute.cacheGet.appDataService", _adsGetErr, {
            key
        });
    }
    try {
        return _appIsFnName_("_cacheGetJson_") ? _cacheGetJson_(key) : null;
    }
    catch (_cacheErr) {
        _c30W_("hotRoute.cacheGet", _cacheErr, {
            key
        });
    }
    return null;
}

function _hotRouteCachePut_(key, value, ttlSeconds) {
    ttlSeconds = Math.max(30, Math.min(Number(ttlSeconds || 180) || 180, 21600));
    try {
        if (typeof AppDataService != "undefined" &&
            AppDataService &&
            AppDataService.cachePut)
            return AppDataService.cachePut(key, value, ttlSeconds);
    }
    catch (_adsPutErr) {
        _c30W_("hotRoute.cachePut.appDataService", _adsPutErr, {
            key
        });
    }
    try {
        return _appIsFnName_("_cachePutJson_")
            ? _cachePutJson_(key, value, ttlSeconds)
            : !1;
    }
    catch (_cachePutErr) {
        _c30W_("hotRoute.cachePut", _cachePutErr, {
            key
        });
    }
    return !1;
}

function _hotRouteDateKey_() {
    try {
        return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "Asia/Bangkok", "yyyy-MM-dd");
    }
    catch (_e) {
        return new Date().toISOString().slice(0, 10);
    }
}

function _caseSearchIndexScope_(payload) {
    return ((payload = payload || {}),
        {
            stamp: CASE_SEARCH_MATERIALIZED_INDEX_STAMP,
            compactReadModel: payload.compactReadModel !== !1 ? 1 : 0,
            includeMeetingHistory: payload.includeMeetingHistory === !0 ? 1 : 0,
            caseStamp: _appIsFnName_("_entityCacheStamp_")
                ? String(_entityCacheStamp_("maindata") || "1")
                : "1",
            meetingStamp: payload.includeMeetingHistory === !0 &&
                _appIsFnName_("_entityCacheStamp_")
                ? String(_entityCacheStamp_("meeting") ||
                    _entityCacheStamp_("meetinglogs") ||
                    "1")
                : "0",
            sessionScope: _casePayloadSessionScope_(payload),
            caseSequenceScope: _casePayloadSequenceScope_(payload),
        });
}

function _caseSearchMaterializedIndexKey_(payload) {
    return ("case_search_materialized_index_v2_" +
        _hotRouteDigest_(JSON.stringify(_caseSearchIndexScope_(payload || {}))));
}

function _caseSearchReadMaterializedIndex_(payload) {
    payload = payload || {};
    var started = Date.now(), allowCache = payload.forceFresh !== !0 &&
        payload.noCache !== !0 &&
        payload.bypassCache !== !0, key = _caseSearchMaterializedIndexKey_(payload), cached = allowCache ? _hotRouteCacheGet_(key) : null;
    if (cached && _c30A_(cached.rows))
        return ((cached.cacheHit = !0),
            (cached.cacheStatus = String(cached.cacheStatus || "materialized-hit")),
            (cached.rowsRead = 0),
            (cached.durationMs = Math.max(0, Date.now() - started)),
            cached);
    if (allowCache && _appIsFnName_("_persistentSummarySnapshotRead_"))
        try {
            var persistent = _persistentSummarySnapshotRead_("case-search", JSON.stringify(_caseSearchIndexScope_(payload)), "viewer", { requestId: payload.requestId || "" });
            if (persistent && persistent.ok && persistent.bundle && _c30A_(persistent.bundle.rows)) {
                var persistentModel = persistent.bundle;
                persistentModel.cacheHit = !0;
                persistentModel.cacheStatus = "persistent-materialized-hit";
                persistentModel.rowsRead = 0;
                persistentModel.durationMs = Math.max(0, Date.now() - started);
                persistentModel.persistentSnapshotHit = !0;
                persistentModel.persistentSnapshotMeta = persistent.meta || {};
                _hotRouteCachePut_(key, persistentModel, Math.max(300, Math.min(Number(payload.indexTtlSeconds || 21600) || 21600, 21600)));
                return persistentModel;
            }
        }
        catch (_caseSearchPersistentReadErr) {
            _c30W_("caseSearch.persistent.read", _caseSearchPersistentReadErr, { scope: _caseSearchIndexScope_(payload) });
        }
    var maxRows = Math.max(100, Math.min(Number(payload.materializedLimit || payload.maxMaterializedRows || 5e3) || 5e3, 5e3)), source = _caseReportReadModel_(_appAssignObjects_({}, payload, {
        query: "",
        q: "",
        keyword: "",
        reportType: "all",
        groupType: "all",
        type: "all",
        reportValue: "",
        groupValue: "",
        value: "",
        page: 1,
        limit: maxRows,
        pageSize: maxRows,
        maxRows,
        noPage: !0,
        fullList: !0,
        serverPaged: !1,
        compactReadModel: payload.compactReadModel !== !1,
        includeMeetingHistory: payload.includeMeetingHistory === !0,
        noCache: !0,
        bypassCache: !0,
        forceFresh: !1,
        __route: "apiSearchCasesLite.materialized-index-base",
        source: "case-search-materialized-index-base",
    })), rows = _c30A_(source && source.rows)
        ? source.rows
        : _c30A_(source && source.data)
            ? source.data
            : [];
    rows = (_c30A_(rows) ? rows : []).filter(function (row) {
        var type = _s_(row && row.type)
            .trim()
            .toLowerCase(), label = _s_(row && row.typeLabel).trim(), deleted = String((row && (row.isDeleted || row.deleted || row.deletedAt || row.ลบ)) ||
            "")
            .trim()
            .toLowerCase();
        return (deleted !== "true" &&
            deleted !== "1" &&
            deleted !== "deleted" &&
            deleted !== "ลบ" &&
            type !== "letter" &&
            label !== "หนังสือ" &&
            label !== "หนังสือติดตามมติ");
    });
    var model = {
        ok: !0,
        rows,
        totalRecords: rows.length,
        source: "CaseSearchMaterializedIndex.v2",
        readModel: CASE_SEARCH_MATERIALIZED_INDEX_STAMP,
        cacheHit: !1,
        cacheStatus: allowCache ? "materialized-miss" : "materialized-bypass",
        cacheKey: key,
        rowsRead: Number((source && (source.rowsRead || source.totalRecords)) ||
            rows.length ||
            0) || 0,
        rowsReturned: rows.length,
        durationMs: Math.max(0, Date.now() - started),
        generatedAt: new Date().toISOString(),
        scope: _caseSearchIndexScope_(payload),
        meta: {
            source: "CaseSearchMaterializedIndex.v2",
            readModelOwner: "Code_30_Domain_Cases.caseSearchMaterializedIndex",
            rowsRead: Number((source && (source.rowsRead || source.totalRecords)) ||
                rows.length ||
                0) || 0,
            rowsReturned: rows.length,
            baseSource: String((source && source.source) || "CaseReportIndex.phase4"),
            uiDomChanged: !1,
            businessLogicChanged: !1,
        },
    };
    if (allowCache) {
        _hotRouteCachePut_(key, model, Math.max(300, Math.min(Number(payload.indexTtlSeconds || 21600) || 21600, 21600)));
        if (_appIsFnName_("_persistentSummarySnapshotWrite_"))
            try {
                var caseSearchStored = _persistentSummarySnapshotWrite_("case-search", JSON.stringify(_caseSearchIndexScope_(payload)), "viewer", model, {
                    ttlSeconds: Math.max(300, Math.min(Number(payload.persistentTtlSeconds || 1800) || 1800, 3600)),
                    source: "case-search-materialized-live-f4-r232"
                });
                model.persistentSnapshotStored = !!(caseSearchStored && caseSearchStored.stored);
            }
            catch (_caseSearchPersistentWriteErr) {
                _c30W_("caseSearch.persistent.write", _caseSearchPersistentWriteErr, { scope: _caseSearchIndexScope_(payload) });
            }
    }
    return model;
}

function _caseSearchRowsMatch_(rows, payload) {
    return ((payload = payload || {}),
        (rows = _c30A_(rows) ? rows : []),
        rows.filter(function (row) {
            try {
                return _caseReportMatches_(row || {}, payload);
            }
            catch (_matchErr) {
                var query = _caseReportText_(payload.query || payload.q || payload.keyword || "").toLowerCase();
                return (!query ||
                    [
                        row.caseNo,
                        row.caseNum,
                        row.recNo,
                        row.receiveNo,
                        row.title,
                        row.subject,
                        row.considerationTitle,
                        row.caseTitle,
                        row.petitioners,
                        row.respondent,
                        row.status,
                        row.cat,
                        row.subCat,
                        row.assignees,
                    ]
                        .join(" ")
                        .toLowerCase()
                        .indexOf(query) > -1);
            }
        }));
}

function _caseSearchMaterializedQuery_(payload) {
    payload = payload || {};
    var started = Date.now(), idx = _caseSearchReadMaterializedIndex_(payload), noPage = payload.noPage === !0 ||
        payload.fullList === !0 ||
        payload.serverPaged === !1, page = Math.max(1, Number(payload.page || 1) || 1), limit = Math.max(1, Math.min(Number(payload.limit || payload.pageSize || 20) || 20, noPage ? 5e3 : 100)), filtered = _caseSearchRowsMatch_(idx.rows || [], payload);
    filtered = _caseReportSortRows_(filtered, payload);
    var totalRecords = filtered.length, totalPages = noPage ? 1 : Math.max(1, Math.ceil(totalRecords / limit)), safePage = noPage ? 1 : Math.max(1, Math.min(page, totalPages)), start = noPage ? 0 : (safePage - 1) * limit, outRows = noPage
        ? filtered.slice(0, limit)
        : filtered.slice(start, start + limit), rowsRead = idx.cacheHit
        ? 0
        : Number(idx.rowsRead || idx.totalRecords || 0) || 0, duration = Math.max(0, Date.now() - started), res = {
        ok: !0,
        rows: outRows,
        data: outRows,
        items: outRows,
        records: outRows,
        totalRecords,
        total: totalRecords,
        page: safePage,
        limit,
        pageSize: limit,
        totalPages,
        columns: typeof AppBackendCore != "undefined" && AppBackendCore.reportColumns
            ? AppBackendCore.reportColumns()
            : [],
        owner: "CaseDomain.searchCases",
        source: "CaseSearchMaterializedIndex.v2.query",
        readModel: CASE_SEARCH_MATERIALIZED_INDEX_STAMP,
        serverPaged: !noPage,
        serverFiltered: !0,
        rowsRead,
        returnedRows: outRows.length,
        rowsReturned: outRows.length,
        durationMs: duration,
        cacheHit: !!idx.cacheHit,
        cacheStatus: String(idx.cacheStatus || "materialized"),
        materializedIndexHit: !!idx.cacheHit,
        materializedIndexRows: Number(idx.totalRecords || (idx.rows || []).length || 0),
        meta: {
            source: "CaseSearchMaterializedIndex.v2.query",
            sourceOfTruth: "MainData+MeetingLogs",
            readModelOwner: "Code_30_Domain_Cases._caseSearchMaterializedQuery_",
            materializedIndex: CASE_SEARCH_MATERIALIZED_INDEX_STAMP,
            materializedIndexHit: !!idx.cacheHit,
            materializedIndexRows: Number(idx.totalRecords || (idx.rows || []).length || 0),
            serverPaged: !noPage,
            serverFiltered: !0,
            rowsRead,
            rowsReturned: outRows.length,
            returnedRows: outRows.length,
            totalRecords,
            durationMs: duration,
            cacheHit: !!idx.cacheHit,
            cacheStatus: String(idx.cacheStatus || "materialized"),
            uiDomChanged: !1,
            businessLogicChanged: !1,
        },
    };
    return (typeof AppBackendCore != "undefined" &&
        AppBackendCore.normalizeCaseSearchResponse &&
        (res = AppBackendCore.normalizeCaseSearchResponse(res)),
        res);
}

function _hotRouteReadModelPayloadScope_(payload) {
    return ((payload = payload || {}),
        {
            q: _s_(payload.query || payload.q || payload.keyword)
                .trim()
                .toLowerCase(),
            reportType: String(payload.reportType || payload.groupType || payload.type || "all")
                .trim()
                .toLowerCase(),
            reportValue: _s_(payload.reportValue || payload.groupValue || payload.value).trim(),
            filterType: String(payload.filterType || payload.statusType || "all")
                .trim()
                .toLowerCase(),
            status: _s_(payload.status).trim(),
            staff: _s_(payload.opStaff || payload.staff).trim(),
            agency: _s_(payload.agency || payload.agencyFilter || payload.agencyName).trim(),
            sortBy: String(payload.sortBy || "caseNum").trim(),
            sortDir: String(payload.sortDir || "asc")
                .trim()
                .toLowerCase(),
            page: Math.max(1, Number(payload.page || 1) || 1),
            limit: Math.max(1, Math.min(Number(payload.limit || payload.pageSize || 20) || 20, 100)),
            caseIndexStamp: _caseSearchIndexScope_(payload).caseStamp,
            trackingIndexDate: _hotRouteDateKey_(),
            model: HOT_ROUTE_READ_MODEL_STAMP,
            sessionScope: _casePayloadSessionScope_(payload),
            caseSequenceScope: _casePayloadSequenceScope_(payload),
        });
}

function _hotRouteReadModelCacheKey_(method, payload) {
    var scope = _hotRouteReadModelPayloadScope_(payload || {}), seed = JSON.stringify({
        method: _s_(method), scope
    });
    return ("hot_route_query_window_v2_" +
        String(method || "api") +
        "_" +
        _hotRouteDigest_(seed));
}

function _hotRouteRowsReturned_(res) {
    var data = res && res.data && typeof res.data == "object" ? res.data : res, rows = _c30A_(data && data.rows)
        ? data.rows
        : _c30A_(res && res.rows)
            ? res.rows
            : _c30A_(data && data.items)
                ? data.items
                : [];
    return rows.length;
}

function _hotRouteAttachReadModelMeta_(res, method, payload, started, cacheInfo) {
    res = res && typeof res == "object" ? res : {
        ok: !1, data: {
            rows: []
        }
    };
    var data = res.data && typeof res.data == "object" && !_c30A_(res.data)
        ? res.data
        : res, rowsReturned = _hotRouteRowsReturned_(res), rowsRead = Number(data.rowsRead || res.rowsRead || rowsReturned || 0) || 0, meta = _appAssignObjects_({}, data.meta || res.meta || {}, {
        method: _s_(method),
        readModel: HOT_ROUTE_READ_MODEL_STAMP,
        readModelOwner: "Code_30_Domain_Cases.hotRouteMaterializedReadModel",
        durationMs: Math.max(0, Date.now() - Number(started || Date.now())),
        rowsRead,
        rowsReturned,
        cacheHit: !!(cacheInfo && cacheInfo.hit),
        cacheStatus: (cacheInfo && cacheInfo.status) || "bypass",
        cacheKey: (cacheInfo && cacheInfo.key) || "",
        source: String(method || "hot-route") + ".materializedQueryWindow",
        payloadScope: _hotRouteReadModelPayloadScope_(payload || {}),
    });
    return ((data.meta = meta),
        (data.readModel = HOT_ROUTE_READ_MODEL_STAMP),
        (data.cacheHit = meta.cacheHit),
        (data.cacheStatus = meta.cacheStatus),
        (data.durationMs = meta.durationMs),
        (data.rowsRead = rowsRead),
        (data.rowsReturned = rowsReturned),
        (res.meta = _appAssignObjects_({}, res.meta || {}, meta)),
        (res.readModel = HOT_ROUTE_READ_MODEL_STAMP),
        (res.cacheHit = meta.cacheHit),
        (res.cacheStatus = meta.cacheStatus),
        (res.durationMs = meta.durationMs),
        (res.rowsRead = rowsRead),
        (res.rowsReturned = rowsReturned),
        res);
}

function _hotRouteReadThrough_(method, payload, ttlSeconds, builder) {
    payload = payload || {};
    var started = Date.now(), allowCache = payload.forceFresh !== !0 &&
        payload.noCache !== !0 &&
        payload.bypassCache !== !0, key = _hotRouteReadModelCacheKey_(method, payload), cacheInfo = {
        key,
        status: allowCache ? "query-miss" : "query-bypass",
        hit: !1,
    };
    if (allowCache)
        try {
            var hit = _hotRouteCacheGet_(key);
            if (hit && typeof hit == "object")
                return ((cacheInfo.status = "query-hit"),
                    (cacheInfo.hit = !0),
                    _hotRouteAttachReadModelMeta_(hit, method, payload, started, cacheInfo));
        }
        catch (cacheErr) {
            ((cacheInfo.status = "query-read-error"),
                _c30W_("hotRoute.query.cacheGet", cacheErr, {
                    method
                }));
        }
    var res = builder(payload || {});
    if (((res = _hotRouteAttachReadModelMeta_(res, method, payload, started, cacheInfo)),
        allowCache && res.ok !== !1))
        try {
            _hotRouteCachePut_(key, res, Math.max(60, Math.min(Number(ttlSeconds || payload.cacheTtlSeconds || 600) || 600, 21600)));
        }
        catch (cachePutErr) {
            _c30W_("hotRoute.query.cachePut", cachePutErr, {
                method
            });
        }
    return res;
}
