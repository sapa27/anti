/** Canonical — Meeting domain function owner extracted from Code_30; behavior preserved. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {};
function _meetingHistoryTypeText_(row) {
    row = row || {};
    var raw = _s_(row.committeeType ||
        row.meetingType ||
        row.type ||
        row.meetingGroup ||
        row.ประเภทการประชุม)
        .replace(/\s+/g, "")
        .trim(), sub = _s_(row.subcommitteeName ||
        row.subcommittee ||
        row.subCommitteeName ||
        row.คณะอนุกรรมาธิการ)
        .replace(/\s+/g, "")
        .trim();
    return /อนุกรรมาธิการ/.test(raw) || sub
        ? "คณะอนุกรรมาธิการ"
        : (/กรรมาธิการ/.test(raw), "คณะกรรมาธิการ");
}

function _normalizeMeetingLogRow_(row) {
    row = row || {};
    var rowCaseNumCanonical = _caseSequenceFrom_(row);
    var meetingDateText = _committeeMeetingDateText_(_caseRowPick_(row, [
        "date", "meetingDate", "dateRaw", "วันที่ประชุม"
    ], "")), meetingTypeText = _meetingHistoryTypeText_(row), subcommitteeName = String(_caseRowPick_(row, _C30K_SUBCOMMITTEE_NAME_, ""))
        .replace(/\s+/g, "")
        .trim();
    return sanitizeRow_({
        logId: _s_(row.logId || row.meetingLogId || row.id),
        caseId: _s_(row.caseId).trim(),
        caseNum: rowCaseNumCanonical,
        caseNo: rowCaseNumCanonical,
        runningNo: rowCaseNumCanonical,
        ลำดับเรื่อง: rowCaseNumCanonical,
        recNo: _s_(row.recNo ||
            row.receiveNo ||
            row.receiptNo ||
            row.เลขรับเรื่อง ||
            row.เลขรับ).trim(),
        receiveNo: _s_(row.receiveNo ||
            row.recNo ||
            row.receiptNo ||
            row.เลขรับเรื่อง ||
            row.เลขรับ).trim(),
        round: _s_(row.round ||
            row.meetingRound ||
            row.meetingNo ||
            row.ครั้งที่ ||
            row.ครั้งที่ประชุม),
        date: meetingDateText,
        meetingDate: meetingDateText,
        dateRaw: meetingDateText,
        วันที่ประชุม: meetingDateText,
        meetingType: meetingTypeText,
        committeeType: meetingTypeText,
        ประเภทการประชุม: meetingTypeText,
        subcommitteeName: meetingTypeText === "คณะอนุกรรมาธิการ" ? subcommitteeName : "",
        meetingGroup: meetingTypeText === "คณะอนุกรรมาธิการ"
            ? subcommitteeName || "คณะอนุกรรมาธิการ"
            : "คณะกรรมาธิการ",
        note: _s_(row.note || row.result || row.summary || row.มติ || row.ผลการประชุม),
        title: _s_(row.title || row.caseTitle || row.subject || row.เรื่อง || row.ชื่อเรื่อง),
        location: _s_(row.location || row.meetingLocation || row.สถานที่ประชุม),
        attendees: _s_(row.attendees || row.participants || row.ผู้เข้าร่วมประชุม),
        summary: _s_(row.summary || row.note || row.result),
        result: _s_(row.result || row.note || row.summary),
    });
}

function _safeMeetingLogIdentityKey_(row) {
    row = row || {};
    var caseNum = _caseSequenceFrom_(row), caseId = _s_(row.caseId || row.caseID || row.case_id).trim(), caseKey = caseNum ? "seq:" + caseNum : caseId ? "id:" + caseId : "missing-sequence", logId = _s_(row.logId || row.meetingLogId || row.id).trim(), meetingId = _s_(row.meetingId || row.committeeMeetingId).trim(), round = _s_(row.round ||
        row.meetingRound ||
        row.meetingNo ||
        row.relatedMeetingNo ||
        row.roundNo ||
        row.ครั้งที่ ||
        row.ครั้งที่ประชุม)
        .replace(/^ครั้งที่\s*/i, "")
        .replace(/^ครั้งประชุม\s*/i, "")
        .replace(/\s+/g, "")
        .trim(), date = _committeeMeetingDateText_(row.date ||
        row.meetingDate ||
        row.relatedMeetingDate ||
        row.dateRaw ||
        row.วันที่ประชุม ||
        ""), meetingType = _meetingHistoryTypeText_(row), subcommitteeName = meetingType === "คณะอนุกรรมาธิการ"
        ? _normalizeIdentityTextSafe_(row.subcommitteeName ||
            row.subcommittee ||
            row.subCommitteeName ||
            row.คณะอนุกรรมาธิการ ||
            row.meetingGroup ||
            "")
        : "";
    if (round || date)
        return [
            caseKey, "event", round, date, meetingType, subcommitteeName
        ].join("|");
    if (meetingId)
        return [
            caseKey, "meeting", meetingId, meetingType, subcommitteeName
        ].join("|");
    return [
        caseKey, "log", logId || _rowFreshnessScore_(row)
    ].join("|");
}

function _meetingHistoryRowPreferenceScore_(row) {
    row = row || {};
    var logId = _s_(row.logId || row.meetingLogId || row.id).trim(), syntheticAgendaRow = /^CMI-/i.test(logId), score = syntheticAgendaRow ? 100 : logId ? 1000 : 10;
    _caseSequenceFrom_(row) && (score += 100);
    _s_(row.round || row.meetingRound || row.meetingNo).trim() && (score += 20);
    _s_(row.date || row.meetingDate || row.dateRaw).trim() && (score += 20);
    _s_(row.note || row.result || row.summary).trim() && (score += 15);
    _s_(row.subcommitteeName || row.subcommittee).trim() && (score += 5);
    return score;
}

function _meetingHistoryMergePreferredRow_(preferred, fallback) {
    var out = {}, source;
    [
        fallback || {}, preferred || {}
    ].forEach(function (row) {
        Object.keys(row || {}).forEach(function (key) {
            var value = row[key];
            if (value !== void 0 && value !== null && String(value).trim() !== "")
                out[key] = value;
            else if (!Object.prototype.hasOwnProperty.call(out, key))
                out[key] = value;
        });
    });
    return out;
}

function _dedupeMeetingHistoryRows_(rows) {
    var map = {}, order = [];
    (_c30A_(rows) ? rows : []).forEach(function (row) {
        if (!row)
            return;
        var key = _safeMeetingLogIdentityKey_(row), current = map[key];
        if (!current) {
            map[key] = row;
            order.push(key);
            return;
        }
        var incomingScore = _meetingHistoryRowPreferenceScore_(row), currentScore = _meetingHistoryRowPreferenceScore_(current), incomingStamp = _s_(row.updatedAt || row.modifiedAt || row.createdAt), currentStamp = _s_(current.updatedAt || current.modifiedAt || current.createdAt), preferIncoming = incomingScore > currentScore ||
            (incomingScore === currentScore && incomingStamp >= currentStamp);
        map[key] = preferIncoming
            ? _meetingHistoryMergePreferredRow_(row, current)
            : _meetingHistoryMergePreferredRow_(current, row);
    });
    return order.map(function (key) {
        return map[key];
    });
}

function _meetingLettersProjectedFields_(name) {
    name = _s_(name).trim();
    if (name === "MainData")
        return _caseFieldsWithSequence_(["caseId", "id", "recNo", "title", "caseTitle", "subject", "petitioners", "petitionerName", "status", "updatedAt", "createdAt", "isDeleted", "deletedAt"]);
    if (name === "MeetingLogs")
        return _caseFieldsWithSequence_(["logId", "meetingId", "caseId", "round", "meetingRound", "meetingNo", "relatedMeetingNo", "date", "meetingDate", "relatedMeetingDate", "วันที่ประชุม", "title", "caseTitle", "considerationTitle", "subject", "location", "attendees", "summary", "result", "note", "committeeType", "meetingType", "ประเภทการประชุม", "subcommitteeId", "subcommitteeName", "subcommittee", "คณะอนุกรรมาธิการ", "meetingGroup", "recNo", "receiveNo", "updatedAt", "createdAt", "isDeleted", "deletedAt"]);
    if (name === "Letters")
        return _trackingProjectedFields_().letters.slice();
    return [];
}

function _meetingLettersRows_(name, includeDeleted) {
    name = _s_(name).trim();
    return _caseReadProjectedRowsStrict_(name, _meetingLettersProjectedFields_(name), {
        includeDeleted: includeDeleted === !0,
        ttl: 120,
        unavailableCode: "MEETING_LETTERS_PROJECTED_READER_UNAVAILABLE",
        failedCode: "MEETING_LETTERS_PROJECTED_READER_FAILED"
    });
}

function _meetingHistoryFields_(name) {
    if (name === "CommitteeMeetings")
        return ["meetingId", "id", "meetingNo", "meetingNumber", "no", "roundNo", "ครั้งที่", "ครั้งประชุม", "การประชุมครั้งที่", "meetingDate", "date", "วันที่ประชุม", "วันประชุม", "title", "ชื่อการประชุม", "status", "note", "committeeType", "meetingType", "ประเภทการประชุม", "subcommitteeId", "subcommitteeName", "subcommittee", "คณะอนุกรรมาธิการ", "meetingGroup", "updatedAt", "isDeleted", "deletedAt"];
    if (name === "CommitteeMeetingAgendaItems")
        return _caseFieldsWithSequence_(["itemId", "id", "meetingId", "agendaNo", "seq", "agenda", "title", "เรื่อง", "ชื่อเรื่อง", "เรื่องพิจารณา", "considerationTitle", "relatedMeetingNo", "relatedMeetingDate", "caseId", "recNo", "receiveNo", "caseTitle", "agencyOrPresenter", "หน่วยงาน", "ผู้เสนอ", "result", "ผลการประชุม", "มติ", "note", "committeeType", "meetingType", "ประเภทการประชุม", "subcommitteeId", "subcommitteeName", "subcommittee", "คณะอนุกรรมาธิการ", "meetingGroup", "updatedAt", "isDeleted", "deletedAt"]);
    return [];
}

function _meetingHistoryCommitteeMap_(rows) {
    var map = {};
    (_c30A_(rows) ? rows : []).forEach(function (row) {
        var id = _s_(row && (row.meetingId || row.id)).trim();
        if (id && !isSoftDeletedRow_(row))
            map[id] = row;
    });
    return map;
}

function _meetingHistoryAgendaRow_(item, meeting) {
    item = item || {};
    meeting = meeting || {};
    if (isSoftDeletedRow_(item))
        return null;
    var caseNum = _caseSequenceFrom_(item), caseId = _s_(item.caseId).trim(), recNo = _s_(item.recNo || item.receiveNo).trim(), title = _s_(item.caseTitle || item.considerationTitle || item.title || item.ชื่อเรื่อง || item.เรื่อง || item.เรื่องพิจารณา).trim();
    if (!caseNum)
        return null;
    var sub = _s_(item.subcommitteeName || item.subcommittee || item.คณะอนุกรรมาธิการ || meeting.subcommitteeName || meeting.subcommittee || meeting.คณะอนุกรรมาธิการ || item.meetingGroup || meeting.meetingGroup).trim(), typeProbe = _s_(item.committeeType || item.meetingType || item.ประเภทการประชุม || meeting.committeeType || meeting.meetingType || meeting.ประเภทการประชุม).trim(), committeeType = /อนุกรรมาธิการ/.test([typeProbe, sub, meeting.title || meeting.ชื่อการประชุม || ""].join("")) || sub ? "คณะอนุกรรมาธิการ" : "คณะกรรมาธิการ", round = _s_(item.relatedMeetingNo || item.meetingNo || item.roundNo || item.ครั้งที่ || meeting.meetingNo || meeting.meetingNumber || meeting.roundNo || meeting.ครั้งที่).trim(), date = item.relatedMeetingDate || item.meetingDate || item.date || item.วันที่ประชุม || meeting.meetingDate || meeting.date || meeting.วันที่ประชุม || "", sourceId = item.itemId || item.id || item.meetingId || caseId || caseNum || recNo || title;
    return {
        logId: "CMI-" + String(sourceId).replace(/[^A-Za-z0-9_-]/g, "").slice(0, 60),
        meetingId: item.meetingId || "", caseId: caseId, caseNum: caseNum, caseNo: caseNum,
        recNo: recNo, receiveNo: recNo, round: round, meetingNo: round,
        date: date, meetingDate: date,
        title: title || meeting.title || "", caseTitle: title || "", considerationTitle: title || "",
        note: item.result || item.ผลการประชุม || item.มติ || item.note || item.agencyOrPresenter || meeting.note || "",
        summary: [_s_(item.agendaNo || item.agenda).trim() ? "วาระ" + _s_(item.agendaNo || item.agenda).trim() : "", item.agencyOrPresenter || item.หน่วยงาน || item.ผู้เสนอ || ""].filter(function (value) { return !!_s_(value).trim(); }).join("/"),
        result: item.result || item.ผลการประชุม || item.มติ || item.note || "",
        committeeType: committeeType, meetingType: committeeType, ประเภทการประชุม: committeeType,
        subcommitteeId: item.subcommitteeId || meeting.subcommitteeId || "",
        subcommitteeName: committeeType === "คณะอนุกรรมาธิการ" ? sub : "",
        meetingGroup: committeeType === "คณะอนุกรรมาธิการ" ? sub || "คณะอนุกรรมาธิการ" : "คณะกรรมาธิการ",
        updatedAt: item.updatedAt || meeting.updatedAt || ""
    };
}

function _meetingHistoryDedupe_(rows) {
    var seen = {};
    return (_c30A_(rows) ? rows : []).filter(function (row) {
        var key = [row.logId, row.caseId, row.caseNum, row.recNo, row.round, row.date, row.note, row.committeeType, row.subcommitteeName].join("|");
        return !seen[key] && (seen[key] = !0);
    });
}

function _meetingHistoryProjectedRows_(relation) {
    var rows = [], caseNum = _caseSequenceFrom_(relation || {}), selectedRead = caseNum ? {
        includeDeleted: !1,
        ttl: 120,
        selectKeyField: "caseNum",
        selectKeyValues: [caseNum],
        selectionMode: "primary-key-case-sequence",
        selectionFallbackOnEmpty: !0,
        batchSize: 500
    } : { includeDeleted: !1, ttl: 120 };
    function append(row) {
        if (row && !isSoftDeletedRow_(row))
            rows.push(row);
    }
    try {
        (_caseDomainSharedRows_("MeetingLogs", _meetingLettersProjectedFields_("MeetingLogs"), selectedRead) || []).forEach(append);
    }
    catch (_logErr) {
        _c30W_("meetingHistory.logs.read", _logErr);
    }
    try {
        var meetings = _caseDomainSharedRows_("CommitteeMeetings", _meetingHistoryFields_("CommitteeMeetings"), { includeDeleted: !1, ttl: 120 }) || [], byId = _meetingHistoryCommitteeMap_(meetings), agenda = _caseDomainSharedRows_("CommitteeMeetingAgendaItems", _meetingHistoryFields_("CommitteeMeetingAgendaItems"), selectedRead) || [];
        agenda.forEach(function (item) {
            append(_meetingHistoryAgendaRow_(item, byId[_s_(item && item.meetingId).trim()] || {}));
        });
    }
    catch (_agendaErr) {
        _c30W_("meetingHistory.agenda.read", _agendaErr);
    }
    return _meetingHistoryDedupe_(rows);
}

function _Domain_getMeetingHistory(payload) {
    try {
        var relation = _caseResolvedRelationContext_(payload || {}), caseNum = relation.caseNum, rows = (_meetingHistoryProjectedRows_(relation) || [])
            .filter(function (row) {
            return _caseChildRowBelongsToResolvedCase_(row, relation);
        })
            .map(function (row) {
            return _caseStampResolvedRelation_(row, relation, "meeting-history-case-sequence-primary-key-r148");
        });
        return _dedupeMeetingHistoryRows_(rows)
            .map(function (row) {
            return _normalizeMeetingLogRow_(row);
        })
            .sort(function (a, b) {
            var av = _s_(a.dateRaw), bv = _s_(b.dateRaw);
            return av === bv
                ? _s_(a.round).localeCompare(_s_(b.round), "th", {
                    numeric: true
                })
                : av > bv
                    ? 1
                    : -1;
        });
    }
    catch (e) {
        _recordWarning_("meeting_history.case_relation_resolved_guard", e);
        throw e;
    }
}

function _meetingSaveEnsureSheetD_() {
    var requiredHeaders = [
        "caseId",
        "round",
        "date",
        "note",
        "logId",
        "meetingId",
        "meetingDate",
        "title",
        "location",
        "attendees",
        "summary",
        "result",
        "committeeType",
        "subcommitteeId",
        "subcommitteeName",
        "meetingGroup",
        "createdAt",
        "updatedAt",
        "isDeleted",
        "deletedAt",
        "caseNum",
        "caseNo",
        "recNo",
        "receiveNo",
        "phase2BusinessKey",
    ], ensured = AppRepository.ensureSheetWithHeaders("MeetingLogs", requiredHeaders, {
        domain: "meeting",
        normalizeHeader: function (value) { return _meetingSaveNormE_(value); }
    });
    return ensured.sheet;
}

function _meetingSaveInvalidateD_(rowNumber) {
    if (_appIsFnName_("_afterSheetWrite_"))
        try {
            _afterSheetWrite_("MeetingLogs", {
                operation: "saveMeetingLog",
                rows: 1,
                row: rowNumber,
                owner: "domainPipelineD.meetingHistory.singleSavePath",
            });
        }
        catch (_afterErr) {
            _c30W_("meeting.saveLog.phase2.afterWrite", _afterErr, {
                row: rowNumber,
            });
        }
    if (_appIsFnName_("_invalidateMeetingDerivedCaches_"))
        try {
            _invalidateMeetingDerivedCaches_("saveMeetingLog.domainPipelineD");
        }
        catch (_cacheErr) {
            _c30W_("meeting.saveLog.phase2.invalidate", _cacheErr, {
                row: rowNumber,
            });
        }
    else if (typeof invalidateSheetCache_ == "function")
        try {
            invalidateSheetCache_("MeetingLogs");
        }
        catch (_cacheErr2) {
            _c30W_("meeting.saveLog.phase2.invalidateSheet", _cacheErr2, {
                row: rowNumber,
            });
        }
    if (_appIsFnName_("_invalidateCaseDerivedCaches_"))
        try {
            _invalidateCaseDerivedCaches_("saveMeetingLog.domainPipelineD.reportReadModel");
        }
        catch (_caseCacheErr) {
            _c30W_("meeting.saveLog.phase3.invalidateCaseReport", _caseCacheErr, {
                row: rowNumber
            });
        }
}

function _meetingSaveTextE_(value) {
    return _c30S_(value)
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/\s+/g, "")
        .trim();
}

function _meetingSaveNormE_(value) {
    return _meetingSaveTextE_(value)
        .toLowerCase()
        .replace(/[\s_\-\/().:]+/g, "");
}

function _meetingSaveUniqueE_(list) {
    var out = [], seen = {};
    (_c30A_(list) ? list : []).forEach(function (value) {
        value = _meetingSaveTextE_(value);
        if (value && !seen[value]) {
            seen[value] = !0;
            out.push(value);
        }
    });
    return out;
}

function _meetingSaveAliasesE_(domain, field, fallback) {
    var list = [];
    try {
        if (typeof AppBackendCore != "undefined" && AppBackendCore.getFieldAliases)
            list = AppBackendCore.getFieldAliases(domain, field) || [];
        else if (typeof AppBackendCore != "undefined" && AppBackendCore.FIELD_MAP) {
            var domains = AppBackendCore.FIELD_MAP.domains || {}, spec = domains[domain] || {}, fields = spec.fields || {}, item = fields[field] || {};
            list = item.aliases || [];
        }
    }
    catch (_aliasErr) {
        _c30W_("meeting.saveLog.alias", _aliasErr, { domain: domain, field: field });
    }
    return _meetingSaveUniqueE_((_c30A_(list) ? list : []).concat(_c30A_(fallback) ? fallback : [field]));
}

function _meetingSavePickE_(scopes, keys) {
    scopes = _c30A_(scopes) ? scopes : [scopes];
    keys = _meetingSaveUniqueE_(_c30A_(keys) ? keys : [keys]);
    for (var s = 0; s < scopes.length; s++)
        for (var obj = scopes[s] || {}, i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (_appHasOwnProperty_(obj, key) && obj[key] != null && String(obj[key]).trim() !== "")
                return obj[key];
        }
    return "";
}

function _meetingSavePayloadsE_(input) {
    input = input && typeof input == "object" ? input : {};
    return {
        casePayload: input.caseIdentity && typeof input.caseIdentity == "object"
            ? input.caseIdentity
            : input.case && typeof input.case == "object" ? input.case : {},
        logPayload: input.log && typeof input.log == "object"
            ? input.log
            : input.meetingLog && typeof input.meetingLog == "object"
                ? input.meetingLog
                : input.history && typeof input.history == "object" ? input.history : {}
    };
}

function _meetingSaveCaseValueE_(payloads, input, field, aliases) {
    return _meetingSaveTextE_(_meetingSavePickE_([
        payloads.casePayload, input, payloads.logPayload
    ], _meetingSaveAliasesE_("cases", field, aliases || [field])));
}

function _meetingSaveLogValueE_(payloads, input, field, aliases) {
    return _meetingSaveTextE_(_meetingSavePickE_([
        payloads.logPayload, input, payloads.casePayload
    ], _meetingSaveAliasesE_("meetingLogs", field, aliases || [field])));
}

function _meetingSaveCaseSeedE_(payloads, input) {
    return {
        caseId: _meetingSaveCaseValueE_(payloads, input, "caseId", ["caseId", "id", "case_id"]),
        caseNum: _meetingSaveTextE_(_meetingSavePickE_([
            payloads.casePayload, input, payloads.logPayload
        ], ["caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"])),
        recNo: _meetingSaveCaseValueE_(payloads, input, "recNo", [
            "recNo", "receiveNo", "receiptNo", "เลขรับเรื่อง", "เลขรับ"
        ]),
        title: _meetingSaveCaseValueE_(payloads, input, "title", [
            "title", "caseTitle", "subject", "เรื่อง", "ชื่อเรื่อง"
        ]),
        caseTitle: _meetingSaveCaseValueE_(payloads, input, "caseTitle", [
            "caseTitle", "title", "subject", "เรื่อง", "ชื่อเรื่อง"
        ]),
        petitioners: _meetingSaveCaseValueE_(payloads, input, "petitioners", [
            "petitioners", "petitioner", "petitionerName", "ผู้เสนอญัตติ/ผู้ร้อง", "ผู้ร้อง"
        ])
    };
}

function _meetingSaveResolveCaseE_(caseSeed, p0Identity) {
    if (!caseSeed.caseNum)
        throw new Error("กรุณาระบุลำดับเรื่องก่อนบันทึกประวัติการประชุม");
    var caseInfo = p0Identity && p0Identity.case || {}, realCaseId = _meetingSaveTextE_(caseInfo.caseId || caseInfo.id || ""), caseNum = _meetingSaveTextE_(caseSeed.caseNum || caseInfo.caseNum || caseInfo.caseNo || caseInfo.runningNo || ""), recNo = _meetingSaveTextE_(caseSeed.recNo || caseInfo.recNo || caseInfo.receiveNo || caseInfo.receiptNo || ""), title = _meetingSaveTextE_(caseSeed.title || caseSeed.caseTitle || caseInfo.title || caseInfo.caseTitle || caseInfo.subject || ""), petitioners = _meetingSaveTextE_(caseSeed.petitioners || caseInfo.petitioners || caseInfo.petitionerName || caseInfo.petitioner || "");
    if (!realCaseId || !caseNum)
        throw new Error("ไม่พบเรื่องพิจารณาที่ตรงกับลำดับเรื่อง กรุณาเลือกเรื่องใหม่ก่อนบันทึกประวัติการประชุม");
    if (caseSeed.caseId && caseSeed.caseId !== realCaseId)
        _recordWarning_("meeting.saveLog.clientCaseIdIgnored.sequenceStrict", null, {
            clientCaseId: caseSeed.caseId,
            canonicalCaseId: realCaseId,
            caseNum: caseNum
        });
    return {
        caseId: realCaseId,
        caseNum: caseNum,
        recNo: recNo,
        title: title,
        petitioners: petitioners,
        syntheticCaseId: !1
    };
}

function _meetingSaveCommitteeE_(payloads, input) {
    var committeeType = _meetingSaveLogValueE_(payloads, input, "committeeType", [
        "committeeType", "meetingType", "committeeKind", "ประเภทการประชุม"
    ]) || _meetingSaveTextE_(input.committeeType || input.meetingType || "") || "คณะกรรมาธิการ", subcommitteeId = _meetingSaveLogValueE_(payloads, input, "subcommitteeId", [
        "subcommitteeId", "subCommitteeId"
    ]), subcommitteeName = _meetingSaveLogValueE_(payloads, input, "subcommitteeName", _C30K_SUBCOMMITTEE_NAME_);
    if (committeeType !== "คณะอนุกรรมาธิการ") {
        subcommitteeId = "";
        subcommitteeName = "";
    }
    else {
        if (!subcommitteeName && subcommitteeId)
            subcommitteeName = subcommitteeId;
        if (!subcommitteeId && subcommitteeName)
            subcommitteeId = subcommitteeName;
        if (!subcommitteeName)
            throw new Error("กรุณาเลือกคณะอนุกรรมาธิการ");
    }
    return {
        committeeType: committeeType,
        subcommitteeId: subcommitteeId,
        subcommitteeName: subcommitteeName,
        meetingGroup: committeeType === "คณะอนุกรรมาธิการ" ? subcommitteeName : committeeType
    };
}

function _meetingSaveHashKeyE_(parts) {
    var raw = (parts || []).map(_meetingSaveTextE_).join("|").toLowerCase(), hash = 2166136261;
    for (var i = 0; i < raw.length; i++) {
        hash ^= raw.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(36).toUpperCase();
}

function _meetingSaveBuildRowE_(payloads, input, caseIdentity, meeting, committee, now) {
    var businessKey = [
        caseIdentity.caseId, caseIdentity.caseNum, caseIdentity.recNo, caseIdentity.title,
        meeting.round, meeting.date, committee.committeeType, committee.subcommitteeName
    ].map(_meetingSaveTextE_).join("|"), suppliedLogId = _meetingSaveTextE_(_meetingSavePickE_([
        payloads.logPayload, input
    ], ["logId", "currentLogId", "meetingLogId"])), logId = suppliedLogId || "LOGH-" + _meetingSaveHashKeyE_([businessKey, meeting.note]);
    return {
        businessKey: businessKey,
        suppliedLogId: suppliedLogId,
        logId: logId,
        rowObj: {
            caseId: caseIdentity.caseId,
            caseNum: caseIdentity.caseNum,
            caseNo: caseIdentity.caseNum,
            recNo: caseIdentity.recNo,
            receiveNo: caseIdentity.recNo,
            round: meeting.round,
            meetingRound: meeting.round,
            meetingNo: meeting.round,
            date: meeting.date,
            meetingDate: meeting.date,
            note: meeting.note,
            logId: logId,
            id: logId,
            meetingLogId: logId,
            meetingId: _meetingSaveLogValueE_(payloads, input, "meetingId", ["meetingId"]),
            title: caseIdentity.title,
            caseTitle: caseIdentity.title,
            subject: caseIdentity.title,
            location: _meetingSaveLogValueE_(payloads, input, "location", ["location", "meetingLocation", "สถานที่ประชุม"]),
            attendees: _meetingSaveLogValueE_(payloads, input, "attendees", ["attendees", "participants", "ผู้เข้าร่วมประชุม"]),
            summary: _meetingSaveLogValueE_(payloads, input, "summary", ["summary"]) || meeting.note,
            result: _meetingSaveLogValueE_(payloads, input, "result", ["result"]) || meeting.note,
            committeeType: committee.committeeType,
            meetingType: committee.committeeType,
            subcommitteeId: committee.subcommitteeId,
            subcommitteeName: committee.subcommitteeName,
            subcommittee: committee.subcommitteeName,
            meetingGroup: committee.meetingGroup,
            phase2BusinessKey: businessKey,
            updatedAt: now,
            isDeleted: !1,
            deletedAt: ""
        }
    };
}

function _meetingSaveColumnIndexE_(headers, names) {
    names = _meetingSaveUniqueE_(_c30A_(names) ? names : [names]);
    for (var n = 0; n < names.length; n++)
        for (var wanted = _meetingSaveNormE_(names[n]), column = 0; column < headers.length; column++)
            if (_meetingSaveNormE_(headers[column]) === wanted)
                return column;
    return -1;
}

function _meetingSaveCellE_(storage, row, names) {
    var index = _meetingSaveColumnIndexE_(storage.headers, names);
    return index >= 0 ? _meetingSaveTextE_(row[index]) : "";
}

function _meetingSaveRowDeletedE_(storage, row) {
    return storage.deletedColumn >= 0 && /^true|1|yes|deleted$/i.test(_meetingSaveTextE_(row[storage.deletedColumn])) || storage.deletedAtColumn >= 0 && !!_meetingSaveTextE_(row[storage.deletedAtColumn]);
}

function _meetingSaveSameBusinessE_(ctx, storage, row) {
    var rowCaseNum = _meetingSaveCellE_(storage, row, ["caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"]), sameCaseNum = ctx.caseNum && rowCaseNum === ctx.caseNum;
    if (storage.businessColumn >= 0 && sameCaseNum && _meetingSaveTextE_(row[storage.businessColumn]) && _meetingSaveTextE_(row[storage.businessColumn]) === ctx.businessKey)
        return !0;
    var sameRound = !ctx.round || _meetingSaveCellE_(storage, row, _meetingSaveAliasesE_("meetingLogs", "round", ["round", "meetingRound", "meetingNo", "ครั้งที่", "ครั้งที่ประชุม"])) === ctx.round, sameDate = !ctx.date || _meetingSaveCellE_(storage, row, _meetingSaveAliasesE_("meetingLogs", "date", ["date", "meetingDate", "วันที่ประชุม"])) === ctx.date, rowType = _meetingSaveCellE_(storage, row, ["committeeType", "meetingType", "ประเภทการประชุม"]), sameType = !rowType || rowType === ctx.committeeType, rowSub = _meetingSaveCellE_(storage, row, ["subcommitteeName", "subcommittee", "คณะอนุกรรมาธิการ", "meetingGroup"]), sameSub = ctx.committeeType !== "คณะอนุกรรมาธิการ" || rowSub === ctx.subcommitteeName;
    return sameCaseNum && sameRound && sameDate && sameType && sameSub;
}

function _meetingSaveStorageE_() {
    var sheet = _meetingSaveEnsureSheetD_(), meta = AppRepository.getSheetMeta("MeetingLogs", { forceFresh: !0 }), width = Math.max(Number(meta.lastColumn || 0), 1), lastRow = Math.max(Number(meta.lastRow || 0), 1), headers = (AppRepository.getRangeValues("MeetingLogs", 1, 1, 1, width)[0] || []).map(_meetingSaveTextE_);
    return {
        sheet: sheet,
        width: width,
        lastRow: lastRow,
        headers: headers,
        logColumn: _meetingSaveColumnIndexE_(headers, _meetingSaveAliasesE_("meetingLogs", "logId", ["logId", "meetingLogId", "id"])),
        businessColumn: _meetingSaveColumnIndexE_(headers, ["phase2BusinessKey"]),
        deletedColumn: _meetingSaveColumnIndexE_(headers, ["isDeleted", "deleted"]),
        deletedAtColumn: _meetingSaveColumnIndexE_(headers, ["deletedAt"])
    };
}

function _meetingSaveReadCandidateE_(storage, rowNumber) {
    rowNumber = Number(rowNumber || 0) || 0;
    return rowNumber > 1 && rowNumber <= storage.lastRow
        ? AppRepository.getRangeValues("MeetingLogs", rowNumber, 1, 1, storage.width)[0] || []
        : null;
}

function _meetingSaveAdoptExistingIdE_(ctx, storage, row) {
    var existingId = storage.logColumn >= 0 ? _meetingSaveTextE_(row[storage.logColumn]) : "";
    if (existingId) {
        ctx.logId = existingId;
        ctx.rowObj.logId = existingId;
        ctx.rowObj.id = existingId;
        ctx.rowObj.meetingLogId = existingId;
    }
}

function _meetingSaveLegacyFieldsE_() {
    return _meetingSaveUniqueE_([
        "logId", "meetingLogId", "id", "phase2BusinessKey",
        "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง",
        "round", "meetingRound", "meetingNo", "ครั้งที่", "ครั้งที่ประชุม",
        "date", "meetingDate", "วันที่ประชุม",
        "committeeType", "meetingType", "ประเภทการประชุม",
        "subcommitteeName", "subcommittee", "คณะอนุกรรมาธิการ", "meetingGroup",
        "isDeleted", "deleted", "deletedAt"
    ]);
}

function _meetingSaveFindTargetE_(ctx, storage) {
    var result = {
        rowNumber: -1,
        values: null,
        lookupMode: "append",
        indexServiceReads: 0,
        legacySparseScan: !1
    }, logIndex = null, businessIndex = null;
    if (ctx.suppliedLogId && storage.logColumn >= 0 && _appIsFnName_("_i3SheetRowIndexByKey_")) {
        logIndex = _i3SheetRowIndexByKey_("MeetingLogs", storage.headers[storage.logColumn] || "logId", storage.logColumn, {
            headers: storage.headers,
            forceFresh: !0,
            allowScriptCache: !1,
            readBatchRows: 5000
        });
        result.indexServiceReads += Number(logIndex && logIndex.serviceReads || 0) || 0;
        var logRow = Number(logIndex && logIndex.map && logIndex.map[ctx.logId] || 0) || 0, logValues = _meetingSaveReadCandidateE_(storage, logRow);
        if (logValues && !_meetingSaveRowDeletedE_(storage, logValues) && _meetingSaveTextE_(logValues[storage.logColumn]) === ctx.logId) {
            result.rowNumber = logRow;
            result.values = logValues;
            result.lookupMode = "logId-index";
        }
    }
    if (result.rowNumber < 0 && storage.businessColumn >= 0 && _appIsFnName_("_i3SheetRowIndexByKey_")) {
        businessIndex = _i3SheetRowIndexByKey_("MeetingLogs", storage.headers[storage.businessColumn] || "phase2BusinessKey", storage.businessColumn, {
            headers: storage.headers,
            forceFresh: !0,
            allowScriptCache: !1,
            readBatchRows: 5000
        });
        result.indexServiceReads += Number(businessIndex && businessIndex.serviceReads || 0) || 0;
        var businessRow = Number(businessIndex && businessIndex.map && businessIndex.map[ctx.businessKey] || 0) || 0, businessValues = _meetingSaveReadCandidateE_(storage, businessRow);
        if (businessValues && !_meetingSaveRowDeletedE_(storage, businessValues) && _meetingSaveSameBusinessE_(ctx, storage, businessValues)) {
            result.rowNumber = businessRow;
            result.values = businessValues;
            result.lookupMode = "business-key-index";
            _meetingSaveAdoptExistingIdE_(ctx, storage, businessValues);
        }
    }
    var indexedCount = businessIndex && businessIndex.map ? Object.keys(businessIndex.map).length : 0, indexedRows = Number(businessIndex && businessIndex.rowCount || Math.max(0, storage.lastRow - 1)) || 0, needsLegacy = result.rowNumber < 0 && (storage.businessColumn < 0 || !businessIndex || businessIndex.ok === !1 || indexedCount < indexedRows);
    if (!needsLegacy || storage.lastRow <= 1 || !_appIsFnName_("readSheetProjectedObjectsCached_"))
        return result;
    result.legacySparseScan = !0;
    var legacyRows = readSheetProjectedObjectsCached_("MeetingLogs", _meetingSaveLegacyFieldsE_(), {
        includeDeleted: !0,
        ttl: 0,
        sparseRead: !0,
        maxColumnSpans: 4,
        readBatchRows: 5000
    }) || [];
    for (var offset = 0; offset < legacyRows.length; offset++) {
        var legacyObject = legacyRows[offset] || {}, legacyValues = new Array(storage.width).fill("");
        Object.keys(legacyObject).forEach(function (field) {
            var column = _meetingSaveColumnIndexE_(storage.headers, field);
            if (column >= 0 && column < storage.width)
                legacyValues[column] = legacyObject[field];
        });
        if (_meetingSaveRowDeletedE_(storage, legacyValues))
            continue;
        var logMatch = ctx.suppliedLogId && storage.logColumn >= 0 && _meetingSaveTextE_(legacyValues[storage.logColumn]) === ctx.suppliedLogId;
        if (logMatch || _meetingSaveSameBusinessE_(ctx, storage, legacyValues)) {
            result.rowNumber = offset + 2;
            result.values = legacyValues;
            result.lookupMode = logMatch ? "legacy-logId-sparse" : "legacy-business-sparse";
            _meetingSaveAdoptExistingIdE_(ctx, storage, legacyValues);
            break;
        }
    }
    return result;
}

function _meetingSaveSetColumnsE_(storage, output, names, value) {
    names = _meetingSaveUniqueE_(_c30A_(names) ? names : [names]);
    for (var i = 0; i < names.length; i++) {
        var column = _meetingSaveColumnIndexE_(storage.headers, names[i]);
        if (column >= 0)
            output[column] = value;
    }
}

function _meetingSaveRowMappingsE_(row) {
    return [
        [_meetingSaveAliasesE_("meetingLogs", "caseId", ["caseId"]), row.caseId],
        [["caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"], row.caseNum],
        [_meetingSaveAliasesE_("meetingLogs", "recNo", ["recNo", "receiveNo", "receiptNo", "เลขรับเรื่อง", "เลขรับ"]), row.recNo],
        [_meetingSaveAliasesE_("meetingLogs", "round", ["round", "meetingRound", "meetingNo", "ครั้งที่", "ครั้งที่ประชุม"]), row.round],
        [_meetingSaveAliasesE_("meetingLogs", "date", ["date", "meetingDate", "วันที่ประชุม"]), row.date],
        [["note", "newNote", "มติ", "ผลการพิจารณา", "ผลการประชุม"], row.note],
        [["summary"], row.summary],
        [["result"], row.result],
        [_meetingSaveAliasesE_("meetingLogs", "logId", ["logId", "meetingLogId", "id"]), row.logId],
        [["meetingId"], row.meetingId],
        [_meetingSaveAliasesE_("meetingLogs", "title", ["title", "caseTitle", "subject", "เรื่อง", "ชื่อเรื่อง"]), row.title],
        [["location", "meetingLocation", "สถานที่ประชุม"], row.location],
        [["attendees", "participants", "ผู้เข้าร่วมประชุม"], row.attendees],
        [["committeeType", "meetingType", "ประเภทการประชุม"], row.committeeType],
        [["subcommitteeId", "subCommitteeId"], row.subcommitteeId],
        [_C30K_SUBCOMMITTEE_NAME_, row.subcommitteeName],
        [["meetingGroup"], row.meetingGroup],
        [["phase2BusinessKey"], row.phase2BusinessKey],
        [["createdAt"], row.createdAt],
        [["updatedAt"], row.updatedAt],
        [["isDeleted", "deleted"], row.isDeleted],
        [["deletedAt"], row.deletedAt]
    ];
}

function _meetingSaveBuildOutputE_(ctx, storage, target) {
    var createdColumn = _meetingSaveColumnIndexE_(storage.headers, ["createdAt"]), existingCreated = target.rowNumber > 1 && createdColumn >= 0 && target.values ? target.values[createdColumn] || "" : "";
    ctx.rowObj.createdAt = existingCreated || ctx.now;
    var isCreate = target.rowNumber < 1, rowNumber = isCreate ? Math.max(storage.sheet.getLastRow(), 1) + 1 : target.rowNumber, output = target.values ? target.values.slice(0, storage.width) : [];
    while (output.length < storage.width)
        output.push("");
    _meetingSaveRowMappingsE_(ctx.rowObj).forEach(function (mapping) {
        _meetingSaveSetColumnsE_(storage, output, mapping[0], mapping[1]);
    });
    return {
        rowNumber: rowNumber,
        output: output,
        isCreate: isCreate
    };
}

function _meetingSaveResultE_(ctx, target, written) {
    return ok_({
        logId: ctx.logId,
        caseId: ctx.caseId,
        syntheticCaseId: ctx.syntheticCaseId,
        rowNumber: written.rowNumber,
        mode: written.isCreate ? "create" : "update",
        source: "MeetingLogs.phase2.indexed-single-save-path",
        phase2BusinessKey: ctx.businessKey,
        lookupMode: target.lookupMode,
        indexServiceReads: target.indexServiceReads,
        legacySparseScan: target.legacySparseScan,
        fullMatrixScan: !1
    }, "บันทึกประวัติการประชุมสำเร็จ");
}

function _meetingSavePrepareD_(input, p0Identity, now) {
    input = input && typeof input == "object" ? input : {};
    var payloads = _meetingSavePayloadsE_(input), caseIdentity = _meetingSaveResolveCaseE_(_meetingSaveCaseSeedE_(payloads, input), p0Identity), meeting = {
        round: _meetingSaveLogValueE_(payloads, input, "round", ["round", "newRound", "meetingRound", "meetingNo", "roundNo", "ครั้งที่", "ครั้งที่ประชุม"]),
        date: _meetingSaveLogValueE_(payloads, input, "date", ["date", "newDate", "meetingDate", "meetingDateText", "วันที่ประชุม"]),
        note: _meetingSaveLogValueE_(payloads, input, "result", ["note", "newNote", "result", "summary", "decision", "มติ", "ผลการพิจารณา", "ผลการประชุม"])
    };
    if (!meeting.round && !meeting.date && !meeting.note)
        throw new Error("กรุณากรอกข้อมูลประวัติการประชุม");
    var committee = _meetingSaveCommitteeE_(payloads, input), built = _meetingSaveBuildRowE_(payloads, input, caseIdentity, meeting, committee, now);
    return {
        owner: "MeetingDomain.savePipelineE.r176",
        input: input,
        p0Identity: p0Identity,
        now: now,
        caseNum: caseIdentity.caseNum,
        caseId: caseIdentity.caseId,
        syntheticCaseId: caseIdentity.syntheticCaseId,
        round: meeting.round,
        date: meeting.date,
        committeeType: committee.committeeType,
        subcommitteeName: committee.subcommitteeName,
        businessKey: built.businessKey,
        suppliedLogId: built.suppliedLogId,
        logId: built.logId,
        rowObj: built.rowObj
    };
}

function _meetingSavePersistD_(ctx) {
    var storage = _meetingSaveStorageE_(), target = _meetingSaveFindTargetE_(ctx, storage), written = _meetingSaveBuildOutputE_(ctx, storage, target);
    AppRepository.setRangeValues("MeetingLogs", written.rowNumber, 1, [written.output], { domain: "meeting", invalidate: !1 });
    _meetingSaveInvalidateD_(written.rowNumber);
    return _meetingSaveResultE_(ctx, target, written);
}

function _meetingSaveExecuteD_(input) {
    input = input && typeof input == "object" ? input : {};
    var p0Identity = _assertCaseWritePrimaryKeyConsistency_(input, "saveMeetingLog"), now = new Date().toISOString(), lock = null, locked = !1;
    try {
        if (typeof LockService != "undefined" && LockService.getDocumentLock && ((lock = LockService.getDocumentLock()), (locked = lock && lock.tryLock ? lock.tryLock(15e3) : !1), lock && !locked))
            throw new Error("ระบบกำลังบันทึกประวัติการประชุมจากคำสั่งก่อนหน้า กรุณาลองอีกครั้ง");
        return _meetingSavePersistD_(_meetingSavePrepareD_(input, p0Identity, now));
    }
    finally {
        try {
            lock && locked && lock.releaseLock && lock.releaseLock();
        }
        catch (_releaseErr) {
            _c30W_("meeting.saveLog.domainPipelineD.releaseLock", _releaseErr);
        }
    }
}

function saveMeetingLog(payload) {
    return domainWrite_("saveMeetingLog", payload, function (input) {
        return _meetingSaveExecuteD_(input);
    }, "บันทึกประวัติการประชุมสำเร็จ", "บันทึกประวัติการประชุมไม่สำเร็จ");
}

function _meetingDeleteFindTarget_(logId) {
    var rows = _meetingLettersRows_("MeetingLogs", !0) || [];
    for (var i = 0; i < rows.length; i++)
        if (_s_(rows[i] && (rows[i].logId || rows[i].id || rows[i].recordId || rows[i].rowId)).trim() === logId)
            return rows[i];
    return null;
}

function _meetingDeleteSheetFallback_(logId, identity, caseNum, now) {
    var sheet = typeof AppRepository !== "undefined" && AppRepository.getSheet ? AppRepository.getSheet("MeetingLogs") : getSheet_("MeetingLogs");
    if (!sheet)
        return null;
    function read() {
        return typeof AppRepository !== "undefined" && AppRepository.readMatrix ? AppRepository.readMatrix("MeetingLogs") : getSheetMatrix_(sheet);
    }
    var matrix = read();
    if (!_c30A_(matrix) || matrix.length < 2)
        return null;
    var required = ["isDeleted", "deletedAt", "updatedAt"], headers = matrix[0].map(function (value) { return _s_(value).trim(); }), missing = required.filter(function (name) { return headers.indexOf(name) < 0; });
    if (missing.length && _appIsFnName_("ensureHeaderColumn_")) {
        missing.forEach(function (name) { ensureHeaderColumn_("MeetingLogs", name); });
        matrix = read();
        headers = matrix[0].map(function (value) { return _s_(value).trim(); });
    }
    var col = _caseHeaderIndex_(headers), cLog = col(["logId", "id", "rowId", "meetingLogId"]), cCase = col(["caseId"]), cCaseNum = col(["caseNum", "caseNo", "runningNo", "ลำดับเรื่อง"]), cRound = col(["round", "meetingNo", "ครั้งที่"]), cDate = col(["date", "meetingDate", "วันที่ประชุม"]), cDeleted = col(["isDeleted"]), cDeletedAt = col(["deletedAt"]), cUpdated = col(["updatedAt"]);
    for (var rowIndex = 1; rowIndex < matrix.length; rowIndex++) {
        var row = matrix[rowIndex], rowCaseNum = cCaseNum >= 0 ? _caseSequenceNormalizeStrict_(row[cCaseNum]) : "", rowCaseId = cCase >= 0 ? _s_(row[cCase]).trim() : "", relationMatches = rowCaseNum ? rowCaseNum === caseNum : !!(identity.caseId && rowCaseId === identity.caseId), match = relationMatches && cLog >= 0 && _s_(row[cLog]).trim() === logId;
        if (!match && relationMatches && identity.caseId && logId.indexOf("LOG-") < 0)
            match = cRound >= 0 && _s_(row[cRound]).trim() === logId || cDate >= 0 && _s_(row[cDate]).trim() === logId;
        if (!match)
            continue;
        if (cDeleted >= 0) AppRepository.setCellValue("MeetingLogs", rowIndex + 1, cDeleted + 1, !0, { invalidate: !1 });
        if (cDeletedAt >= 0) AppRepository.setCellValue("MeetingLogs", rowIndex + 1, cDeletedAt + 1, now, { invalidate: !1 });
        if (cUpdated >= 0) AppRepository.setCellValue("MeetingLogs", rowIndex + 1, cUpdated + 1, now, { invalidate: !1 });
        return { ok: !0, mode: "softDeleteFallback", row: rowIndex + 1 };
    }
    return null;
}

function deleteMeetingLog(payload) {
    return domainWrite_("deleteMeetingLog", payload && typeof payload === "object" ? payload : { logId: payload }, function (req) {
        req = req && typeof req === "object" ? req : {};
        var logId = _s_(_payloadValue_(req, ["logId", "id", "rowId", "meetingLogId"])).trim();
        if (!logId)
            throw new Error("ไม่พบรหัสประวัติการประชุมที่ต้องการลบ");
        var identity = _assertCaseWritePrimaryKeyConsistency_(req, "deleteMeetingLog"), caseNum = identity.caseNum, target = _meetingDeleteFindTarget_(logId), targetCaseNum = _caseSequenceFrom_(target || {});
        if (!caseNum)
            throw new Error("ไม่พบลำดับเรื่องสำหรับลบประวัติการประชุม");
        if (!targetCaseNum && target && target.caseId) {
            if (_casePrimaryKeyStrictReadEnabled_())
                throw new Error("ประวัติการประชุมไม่มีลำดับเรื่องและถูกกักกันหลัง Primary Key Migration");
            if (_s_(target.caseId).trim() !== identity.caseId)
                throw new Error("ประวัติการประชุม legacy ไม่ตรงกับเรื่องที่เลือก");
            var relation = _safeResolveCaseIdentityAliases_({ caseId: target.caseId });
            targetCaseNum = _caseSequenceNormalizeStrict_(relation && relation.caseNum || "");
        }
        if (targetCaseNum && targetCaseNum !== caseNum)
            throw new Error("ประวัติการประชุมไม่ตรงกับลำดับเรื่องที่เลือก");
        var now = new Date().toISOString(), result = null;
        try {
            result = getCanonicalRepository_("meeting.logs").softDelete(logId, { isDeleted: !0, deletedAt: now, updatedAt: now });
        }
        catch (_repoDeleteErr) {
            _c30W_("meeting.delete.repo", _repoDeleteErr, { logId: logId });
        }
        var deleted = !!(result && (result.ok !== !1 || result.deleted || result.mode));
        if (!deleted)
            try {
                result = _meetingDeleteSheetFallback_(logId, identity, caseNum, now);
                deleted = !!result;
            }
            catch (_fallbackDeleteErr) {
                _c30W_("meeting.delete.sheetFallback", _fallbackDeleteErr, { logId: logId });
            }
        if (!deleted)
            throw new Error("ไม่พบข้อมูลประวัติการประชุมที่ต้องการลบ");
        var cacheInvalidation = _appIsFnName_("_invalidateMeetingDerivedCaches_") ? _invalidateMeetingDerivedCaches_("deleteMeetingLog") : {};
        return ok_({ logId: logId, cacheInvalidation: cacheInvalidation, result: result }, "ลบประวัติการประชุมสำเร็จ");
    });
}

function apiGetMeetingLookupOptions(payload) {
    return MeetingDomain.getLookupOptions(payload || {});
}

function apiGetMeetingHistory(payload) {
    return MeetingDomain.getHistory(payload || {});
}

function apiSaveMeetingLog(payload) {
    return writeGateway_("apiSaveMeetingLog", payload || {}, function (input) {
        return MeetingDomain.saveLog(input || {});
    }, "บันทึกประวัติการประชุมสำเร็จ", "บันทึกประวัติการประชุมไม่สำเร็จ");
}

function apiDeleteMeetingLog(payload) {
    return writeGateway_("apiDeleteMeetingLog", payload || {}, function (input) {
        return MeetingDomain.deleteLog(input || {});
    }, "ลบประวัติการประชุมสำเร็จ", "ลบประวัติการประชุมไม่สำเร็จ");
}

function _committeeMeetingSheetSpec_() {
    return {
        sheets: {
            CommitteeMeetings: {
                purpose: "ข้อมูลหัวการประชุมของคณะกรรมาธิการ",
                key: "meetingId",
                headers: [
                    "meetingId",
                    "meetingNo",
                    "meetingDate",
                    "title",
                    "status",
                    "note",
                    "createdAt",
                    "updatedAt",
                    "isDeleted",
                    "deletedAt",
                ],
            },
            CommitteeMeetingAgendaItems: {
                purpose: "รายการระเบียบวาระการประชุม 1-4 แบบหลายรายการ",
                key: "itemId",
                headers: [
                    "itemId",
                    "meetingId",
                    "agendaNo",
                    "seq",
                    "title",
                    "relatedMeetingNo",
                    "relatedMeetingDate",
                    "caseId",
                    "caseNum",
                    "recNo",
                    "caseTitle",
                    "letterId",
                    "letterNo",
                    "letterSubject",
                    "agencyOrPresenter",
                    "result",
                    "note",
                    "createdAt",
                    "updatedAt",
                    "isDeleted",
                    "deletedAt",
                ],
            },
        },
        sync: {
            targetSheet: "MeetingLogs",
            rule: "รายการระเบียบวาระที่ 1 และ 3 ที่เชื่อม caseId จะบันทึก/อัปเดตประวัติการพิจารณาของคณะกรรมาธิการอัตโนมัติ โดยใช้ครั้งที่=meetingNo, วันประชุม=meetingDate, ผลการประชุม/มติที่ประชุม=result",
        },
    };
}

function _committeeMeetingRows_(sheetName, includeDeleted) {
    try {
        return (ensureCanonicalHeadersForNewSheet_(sheetName),
            _caseDomainSharedRows_(sheetName, [], {
                includeDeleted: includeDeleted === !0,
                requireCanonical: !0,
                ttl: 180,
            }));
    }
    catch (e) {
        throw new Error("ไม่สามารถอ่านชีต " +
            sheetName +
            " ได้: " +
            String((e && e.message) || e));
    }
}

function _committeeMeetingRepo_(name) {
    return getCanonicalRepository_(name);
}

function _committeeMeetingIsDate_(v) {
    return (Object.prototype.toString.call(v) === "[object Date]" && !isNaN(v.getTime()));
}

function _committeeMeetingDateText_(v) {
    return _caseDateText_(v, {
        preserveRaw: !0,
        context: "committeeMeeting",
    });
}

function _committeeMeetingText_(v) {
    return _committeeMeetingIsDate_(v)
        ? _committeeMeetingDateText_(v)
        : _c30S_(v).trim();
}

function _committeeMeetingCaseRefText_(v) {
    if (v == null)
        return "";
    var raw = _c30S_(v).trim();
    if (!raw && !_committeeMeetingIsDate_(v))
        return "";
    if (/^\d{1,6}\s*\/\s*(?:19|20|25)\d{2}$/.test(raw))
        return raw.replace(/\s*\/\s*/, "/");
    if (/^\d{1,6}\s*[-–—]\s*(?:19|20|25)\d{2}$/.test(raw))
        return raw.replace(/\s*[-–—]\s*/, "/");
    var mixed = raw.match(/^(\d{1,6})\s*\/\s*(.+)$/), dateLike;
    if (mixed) {
        var tail = _s_(mixed[2]).trim(), tailLooksDate;
        if (/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s/i.test(tail) ||
            /GMT[+-]\d{4}|เวลาอินโดจีน/i.test(tail) ||
            /^\d{4}-\d{1,2}-\d{1,2}(?:[T\s]|$)/.test(tail) ||
            /^\d{1,2}[\/\-]\d{1,2}[\/\-](?:19|20|25)\d{2}$/.test(tail)) {
            var tailDate = new Date(tail
                .replace(/\s*\(.*?\)\s*/g, " ")
                .replace(/เวลาอินโดจีน/g, "")
                .trim());
            if (!isNaN(tailDate.getTime())) {
                var ty = tailDate.getFullYear();
                return (ty < 2400 && (ty += 543), mixed[1] + "/" + String(ty));
            }
        }
    }
    if (_committeeMeetingIsDate_(v) ||
        /^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s/i.test(raw) ||
        /GMT[+-]\d{4}|เวลาอินโดจีน/i.test(raw) ||
        /^\d{4}-\d{1,2}-\d{1,2}(?:[T\s]|$)/.test(raw)) {
        try {
            if (_appIsFnName_("_formatLetterNoFromDateValue_")) {
                var no = _formatLetterNoFromDateValue_(v);
                if (no)
                    return no;
            }
        }
        catch (_e) {
            _c30W_("ec", _e);
        }
        var dt = _committeeMeetingDateText_(v), dm = _s_(dt).match(/^0?(\d{1,2})\/\d{1,2}\/((?:19|20|25)\d{2})$/);
        if (dm)
            return dm[1] + "/" + dm[2];
    }
    return raw;
}

function _committeeMeetingPublicMeeting_(row) {
    row = row || {};
    var out = {};
    return (Object.keys(row).forEach(function (k) {
        out[k] = row[k];
    }),
        (out.meetingId = _committeeMeetingText_(row.meetingId || "")),
        (out.meetingNo = _committeeMeetingText_(row.meetingNo || "")),
        (out.meetingDate = _committeeMeetingDateText_(row.meetingDate || row.date || "")),
        (out.title = _committeeMeetingText_(row.title || "การประชุมคณะกรรมาธิการ")),
        (out.status = _committeeMeetingText_(row.status || "")),
        (out.note = _committeeMeetingText_(row.note || "")),
        (out.readOnlyLegacy =
            !!row.__legacyReadOnly || /^LEGACY-/.test(out.meetingId)),
        out);
}

function _committeeMeetingPublicItem_(row) {
    row = row || {};
    var out = {};
    return (Object.keys(row).forEach(function (k) {
        out[k] = row[k];
    }),
        (out.itemId = _committeeMeetingText_(row.itemId || "")),
        (out.meetingId = _committeeMeetingText_(row.meetingId || "")),
        (out.agendaNo = _committeeMeetingText_(row.agendaNo || "")),
        (out.seq = Number(row.seq || 0) || 0),
        (out.title = _committeeMeetingText_(row.title || "")),
        (out.relatedMeetingNo = _committeeMeetingText_(row.relatedMeetingNo || "")),
        (out.relatedMeetingDate = _committeeMeetingDateText_(row.relatedMeetingDate || "")),
        (out.caseId = _committeeMeetingText_(row.caseId || "")),
        (out.caseNum = _committeeMeetingCaseRefText_(row.caseNum || "")),
        (out.recNo = _committeeMeetingCaseRefText_(row.recNo || "")),
        (out.caseTitle = _committeeMeetingText_(row.caseTitle || "")),
        (out.letterId = ""),
        (out.letterNo = ""),
        (out.letterSubject = ""),
        (out.agencyOrPresenter = _committeeMeetingText_(row.agencyOrPresenter || "")),
        (out.result = _committeeMeetingText_(row.result || "")),
        (out.note = _committeeMeetingText_(row.note || "")),
        out);
}

function _committeeMeetingId_(prefix) {
    return (String(prefix || "CM") +
        "-" +
        Utilities.getUuid().replace(/-/g, "").slice(0, 16).toUpperCase());
}

function _committeeMeetingNormalizeItem_(raw, meetingId, idx) {
    var agendaNo = _committeeMeetingText_((raw = raw || {}).agendaNo || raw.agenda || ""), itemId;
    return {
        itemId: _committeeMeetingText_(raw.itemId || "") || _committeeMeetingId_("CMI"),
        meetingId,
        agendaNo,
        seq: Number(raw.seq || idx || 1) || 1,
        title: _committeeMeetingText_(raw.title || raw.caseTitle || raw.subject || ""),
        relatedMeetingNo: _committeeMeetingText_(raw.relatedMeetingNo || raw.certifyMeetingNo || ""),
        relatedMeetingDate: _committeeMeetingDateText_(raw.relatedMeetingDate || raw.certifyMeetingDate || ""),
        caseId: _committeeMeetingText_(raw.caseId || ""),
        caseNum: _committeeMeetingCaseRefText_(raw.caseNum || ""),
        recNo: _committeeMeetingCaseRefText_(raw.recNo || ""),
        caseTitle: _committeeMeetingText_(raw.caseTitle || raw.title || ""),
        letterId: "",
        letterNo: "",
        letterSubject: "",
        agencyOrPresenter: _committeeMeetingText_(raw.agencyOrPresenter || raw.agency || raw.presenter || ""),
        result: _committeeMeetingText_(raw.result || raw.resolution || raw.note || ""),
        note: _committeeMeetingText_(raw.note || ""),
        isDeleted: !1,
        deletedAt: "",
    };
}

function _committeeMeetingItemHasContent_(item) {
    return !!(_committeeMeetingText_(item.title) ||
        _committeeMeetingText_(item.relatedMeetingNo) ||
        _committeeMeetingText_(item.relatedMeetingDate) ||
        _committeeMeetingText_(item.caseId) ||
        _committeeMeetingText_(item.caseTitle) ||
        _committeeMeetingText_(item.agencyOrPresenter) ||
        _committeeMeetingText_(item.result) ||
        _committeeMeetingText_(item.note));
}

function _committeeMeetingLinkCaseInfo_(item) {
    if ((item = item || {}).caseId)
        try {
            var found = _safeResolveCaseIdentityAliases_({
                caseId: item.caseId,
                caseNum: item.caseNum,
                recNo: item.recNo,
                title: item.title,
                caseTitle: item.caseTitle,
            }).case;
            found &&
                ((item.caseId = _committeeMeetingText_(found.caseId || item.caseId)),
                    (item.caseNum = _committeeMeetingCaseRefText_(found.caseNum || item.caseNum)),
                    (item.recNo = _committeeMeetingCaseRefText_(found.recNo || item.recNo)),
                    (item.caseTitle = _committeeMeetingText_(found.caseTitle || found.title || item.caseTitle || item.title)),
                    item.title || (item.title = item.caseTitle));
        }
        catch (_e) {
            _recordWarning_("committee.meeting.case.link", _e);
        }
    return item;
}

function _committeeMeetingSyncAgenda1And3ToHistory_(meeting, items) {
    var synced = [];
    return ((items || []).forEach(function (item) {
        var agendaNo = _s_(item.agendaNo);
        if ((agendaNo === "1" || agendaNo === "3" || agendaNo === "4") &&
            _s_(item.caseId).trim()) {
            var logId = "MSYS-" +
                _s_(item.itemId)
                    .replace(/[^A-Za-z0-9_-]/g, "")
                    .slice(0, 40), res = saveMeetingLog({
                logId,
                currentLogId: logId,
                caseId: item.caseId,
                caseNum: item.caseNum,
                recNo: item.recNo,
                title: item.caseTitle || item.title,
                round: meeting.meetingNo,
                date: _committeeMeetingDateText_(meeting.meetingDate),
                note: item.result || item.note,
                result: item.result || item.note,
                summary: [
                    _committeeMeetingAgendaLabel_(item.agendaNo),
                    item.agencyOrPresenter,
                ]
                    .filter(function (v) {
                    return !!_committeeMeetingText_(v);
                })
                    .join(" / "),
                meetingId: meeting.meetingId,
            });
            synced.push({
                itemId: item.itemId,
                caseId: item.caseId,
                logId,
                result: res && res.data ? res.data : res,
            });
        }
    }),
        synced);
}

function _committeeMeetingSortableDate_(value) {
    if (_committeeMeetingIsDate_(value))
        return value.getTime();
    var raw = _s_(value).trim();
    if (!raw)
        return 0;
    var m = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (m) {
        var y = Number(m[3]);
        return (y > 2400 && (y -= 543),
            new Date(y, Number(m[2]) - 1, Number(m[1])).getTime() || 0);
    }
    var iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) {
        var y2 = Number(iso[1]);
        return (y2 > 2400 && (y2 -= 543),
            new Date(y2, Number(iso[2]) - 1, Number(iso[3])).getTime() || 0);
    }
    var d = new Date(raw.replace(/\s*\(.*?\)\s*/g, " ").replace(/เวลาอินโดจีน/g, ""));
    return isNaN(d.getTime()) ? 0 : d.getTime();
}

function _committeeMeetingMeetingHeaderMatch_(meeting, q) {
    return (!q ||
        [
            (meeting = meeting || {}).meetingNo,
            _committeeMeetingDateText_(meeting.meetingDate),
            meeting.title,
            meeting.status,
            meeting.note,
        ]
            .join(" ")
            .toLowerCase()
            .indexOf(q) > -1);
}

function _committeeMeetingItemMatch_(meeting, item, q, agendaFilter) {
    if (((item = item || {}),
        agendaFilter && _s_(item.agendaNo) !== String(agendaFilter)))
        return !1;
    if (!q)
        return !0;
    var title = _committeeMeetingAgendaTitle_(item), hay;
    return ([
        meeting && meeting.meetingNo,
        meeting && _committeeMeetingDateText_(meeting.meetingDate),
        meeting && meeting.title,
        title,
        item.title,
        item.caseTitle,
        item.caseNum,
        item.recNo,
        item.agencyOrPresenter,
        item.result,
        item.note,
        _committeeMeetingAgendaLabel_(item.agendaNo),
    ]
        .join(" ")
        .toLowerCase()
        .indexOf(q) > -1);
}

function _committeeMeetingLegacyHash_(value) {
    var s = _committeeMeetingText_(value), h = 0;
    for (var i = 0; i < s.length; i += 1)
        h = (h * 31 + s.charCodeAt(i)) | 0;
    return String(Math.abs(h || 1));
}

function _committeeMeetingLegacyBundle_() {
    var logs = [];
    try {
        logs =
            _caseDomainSharedRows_("MeetingLogs", [], {
                includeDeleted: !1,
                requireCanonical: !1,
                ttl: 60,
            }) || [];
    }
    catch (_legacyMeetingReadErr) {
        _c30W_("MeetingDomain.compatibilityProjectedRead", _legacyMeetingReadErr, {
            sheetName: "MeetingLogs",
            source: "MeetingLogs-compat-read",
        });
        return {
            meetings: [],
            items: [],
            source: "MeetingLogs-compat-read",
            degraded: !0,
        };
    }
    var groups = {}, items = [];
    return (logs.forEach(function (row, idx) {
        if (!row || isSoftDeletedRow_(row))
            return;
        var round = _committeeMeetingText_(row.round || row.meetingNo || row["ครั้งที่"] || ""), date = _committeeMeetingDateText_(row.dateRaw ||
            row.date ||
            row.meetingDate ||
            row["วันที่ประชุม"] ||
            ""), sourceId = _committeeMeetingText_(row.meetingId || ""), signature = [
            round, date
        ].join("|");
        if (!round && !date)
            return;
        var id = sourceId || "LEGACY-" + _committeeMeetingLegacyHash_(signature), meetingTitle = _committeeMeetingText_(row.meetingTitle ||
            row.meetingName ||
            row.name ||
            row.summaryTitle ||
            row.displayTitle ||
            row["ชื่อการประชุม"] ||
            row["หัวข้อการประชุม"] ||
            "") ||
            [
                "การประชุมคณะกรรมาธิการ", round ? "ครั้งที่ " + round : ""
            ]
                .filter(function (v) {
                return !!_committeeMeetingText_(v);
            })
                .join(" ");
        groups[id] ||
            (groups[id] = {
                meetingId: id,
                meetingNo: round,
                meetingDate: date,
                title: meetingTitle,
                status: "legacy",
                note: "",
                __legacyReadOnly: !sourceId,
                readOnlyLegacy: !sourceId,
            });
        var item = {
            itemId: _committeeMeetingText_(row.logId || row.id || row.rowId || "") ||
                "LEGACY-ITEM-" + _committeeMeetingLegacyHash_(signature + "|" + idx),
            meetingId: id,
            agendaNo: "3",
            seq: idx + 1,
            title: _committeeMeetingText_(row.caseTitle || row.title || row.subject || ""),
            caseId: _committeeMeetingText_(row.caseId || ""),
            caseNum: _committeeMeetingCaseRefText_(row.caseNum || row.caseNo || ""),
            recNo: _committeeMeetingCaseRefText_(row.recNo || row.receiveNo || ""),
            caseTitle: _committeeMeetingText_(row.caseTitle || row.title || row.subject || ""),
            agencyOrPresenter: _committeeMeetingText_(row.agencyName || row.respondent || ""),
            result: _committeeMeetingText_(row.result || row.note || row.summary || ""),
            note: _committeeMeetingText_(row.note || ""),
        };
        items.push(_committeeMeetingPublicItem_(item));
    }),
        {
            meetings: Object.keys(groups).map(function (k) {
                return _committeeMeetingPublicMeeting_(groups[k]);
            }),
            items: items,
            source: "MeetingLogs-compat-read",
            degraded: !1,
        });
}

function _committeeMeetingSafeCanonicalRows_(sheetName, asItems, context) {
    try {
        var rows = _committeeMeetingRows_(sheetName, !1) || [];
        return asItems ? rows.map(_committeeMeetingPublicItem_) : rows;
    }
    catch (_canonicalMeetingReadErr) {
        return (_c30W_(context, _canonicalMeetingReadErr, {
            sheetName: sheetName
        }),
            []);
    }
}

function _committeeMeetingBuildCompactList_(payload) {
    payload = payload || {};
    var rows = _caseDomainSharedRows_("CommitteeMeetings", [
        "meetingId", "id", "meetingNo", "meetingNumber", "roundNo", "ครั้งที่",
        "meetingDate", "date", "วันที่ประชุม", "title", "meetingTitle", "name",
        "note", "status", "committeeType", "meetingType", "subcommitteeId",
        "subcommitteeName", "meetingGroup", "updatedAt", "isDeleted", "deletedAt"
    ], {
        includeDeleted: !1,
        requireCanonical: !0,
        ttl: Number(payload.cacheTtlSeconds || 300) || 300
    }) || [];
    var meetings = rows.filter(function (row) {
        return !_appIsFnName_("isSoftDeletedRow_") || !isSoftDeletedRow_(row);
    }).sort(function (a, b) {
        var an = Number(_s_(a.meetingNo || a.meetingNumber || a.roundNo).replace(/[^0-9.\-]/g, "")),
            bn = Number(_s_(b.meetingNo || b.meetingNumber || b.roundNo).replace(/[^0-9.\-]/g, ""));
        if (!isNaN(an) && !isNaN(bn) && an !== bn)
            return an - bn;
        var cmp = _s_(a.meetingNo || a.meetingNumber || a.roundNo).localeCompare(_s_(b.meetingNo || b.meetingNumber || b.roundNo), "th", { numeric: !0, sensitivity: "base" });
        return cmp !== 0 ? cmp : _committeeMeetingSortableDate_(a.meetingDate || a.date) - _committeeMeetingSortableDate_(b.meetingDate || b.date);
    }).map(_committeeMeetingPublicMeeting_);
    meetings.forEach(function (meeting) {
        var displayTitle = _committeeMeetingText_(meeting.title || meeting.meetingTitle || meeting.name || "การประชุมคณะกรรมาธิการ");
        meeting.displayTitle = displayTitle;
        meeting.summaryTitle = displayTitle;
    });
    return {
        meetings: meetings,
        items: [],
        itemsByMeetingId: {},
        spec: _committeeMeetingSheetSpec_(),
        filters: { query: "", agendaNo: "", agendaLabel: "ทุกวาระ" },
        meta: {
            compactList: !0,
            authoritative: !0,
            performanceHMeetingList: !0,
            source: "CommitteeMeetings.projected-compact-r163",
            rowsReturned: meetings.length
        }
    };
}

function _committeeMeetingBuildBundle_(payload) {
    var meetingId = _committeeMeetingText_((payload = payload || {}).meetingId || payload.id || ""), q = _committeeMeetingText_(payload.query || payload.q || payload.keyword || "").toLowerCase(), agendaFilter = _committeeMeetingText_(payload.agendaNo || payload.agenda || ""), meetingsAll = _committeeMeetingSafeCanonicalRows_("CommitteeMeetings", !1, "committee.meeting.canonicalMeetingsRead"), itemsAll = _committeeMeetingSafeCanonicalRows_("CommitteeMeetingAgendaItems", !0, "committee.meeting.canonicalItemsRead"), includeLegacyReadOnly = payload.includeLegacyReadOnly === !0 || payload.compatLegacy === !0, legacy = includeLegacyReadOnly
        ? _committeeMeetingLegacyBundle_()
        : {
            meetings: [], items: []
        }, canonicalMeetings = {}, canonicalItems = {};
    meetingsAll.forEach(function (m) {
        canonicalMeetings[_s_(m.meetingId)] = !0;
    });
    itemsAll.forEach(function (it) {
        canonicalItems[_s_(it.itemId)] = !0;
    });
    includeLegacyReadOnly &&
        (legacy.meetings || []).forEach(function (m) {
            var id = _s_(m.meetingId);
            canonicalMeetings[id] ||
                ((canonicalMeetings[id] = !0), meetingsAll.push(m));
        });
    includeLegacyReadOnly &&
        (legacy.items || []).forEach(function (it) {
            var id = _s_(it.itemId);
            canonicalItems[id] || ((canonicalItems[id] = !0), itemsAll.push(it));
        });
    var allGrouped = {};
    (itemsAll.forEach(function (item) {
        var id = _s_(item.meetingId);
        (allGrouped[id] || (allGrouped[id] = []), allGrouped[id].push(item));
    }),
        Object.keys(allGrouped).forEach(function (id) {
            allGrouped[id].sort(function (a, b) {
                return (Number(a.agendaNo || 0) - Number(b.agendaNo || 0) ||
                    Number(a.seq || 0) - Number(b.seq || 0));
            });
        }));
    var meetingsRaw, meetings = meetingsAll
        .filter(function (meeting) {
        var id = _s_(meeting.meetingId);
        if (meetingId)
            return id === meetingId;
        if (!q && !agendaFilter)
            return !0;
        var rows = allGrouped[id] || [], hasAgenda = !agendaFilter ||
            rows.some(function (item) {
                return _s_(item.agendaNo) === String(agendaFilter);
            });
        return (!(agendaFilter && !hasAgenda) &&
            (q
                ? !!_committeeMeetingMeetingHeaderMatch_(meeting, q) ||
                    rows.some(function (item) {
                        return _committeeMeetingItemMatch_(meeting, item, q, agendaFilter);
                    })
                : hasAgenda));
    })
        .sort(function (a, b) {
        var an = Number(_s_(a.meetingNo).replace(/[^0-9.\-]/g, "")), bn = Number(_s_(b.meetingNo).replace(/[^0-9.\-]/g, ""));
        if (!isNaN(an) && !isNaN(bn) && an !== bn)
            return an - bn;
        var cmp = _s_(a.meetingNo).localeCompare(_s_(b.meetingNo), "th", {
            numeric: !0,
            sensitivity: "base",
        }), av, bv;
        return cmp !== 0
            ? cmp
            : _committeeMeetingSortableDate_(a.meetingDate) -
                _committeeMeetingSortableDate_(b.meetingDate);
    })
        .map(_committeeMeetingPublicMeeting_), ids = {};
    meetings.forEach(function (m) {
        ids[_s_(m.meetingId)] = !0;
    });
    var items = itemsAll.filter(function (item) {
        return ids[_s_(item.meetingId)] === !0;
    }), grouped = {};
    return (items.forEach(function (item) {
        var id = _s_(item.meetingId);
        (grouped[id] || (grouped[id] = []), grouped[id].push(item));
    }),
        Object.keys(grouped).forEach(function (id) {
            grouped[id].sort(function (a, b) {
                return (Number(a.agendaNo || 0) - Number(b.agendaNo || 0) ||
                    Number(a.seq || 0) - Number(b.seq || 0));
            });
        }),
        meetings.forEach(function (meeting) {
            var displayTitle = _committeeMeetingText_(meeting.title ||
                meeting.meetingTitle ||
                meeting.name ||
                "การประชุมคณะกรรมาธิการ");
            ((meeting.displayTitle = displayTitle),
                (meeting.summaryTitle = displayTitle));
        }),
        {
            meetings,
            items,
            itemsByMeetingId: grouped,
            spec: _committeeMeetingSheetSpec_(),
            filters: {
                query: q,
                agendaNo: agendaFilter,
                agendaLabel: agendaFilter
                    ? _committeeMeetingAgendaLabel_(agendaFilter)
                    : "ทุกวาระ",
            },
        });
}

function apiGetCommitteeMeetingSystemSpec(payload) {
    return MeetingDomain.getSystemSpec(payload || {});
}

function apiListCommitteeMeetings(payload) {
    return MeetingDomain.listMeetings(payload || {});
}

function apiGetCommitteeMeetingSystem(payload) {
    return MeetingDomain.getSystem(payload || {});
}

function _committeeMeetingAgendaTitle_(item) {
    item = item || {};
    var agendaNo = _s_(item.agendaNo), label;
    return agendaNo === "2"
        ? [
            "การประชุมครั้งที่ " +
                _committeeMeetingText_(item.relatedMeetingNo || ""),
            _committeeMeetingText_(item.relatedMeetingDate || ""),
        ]
            .filter(function (v) {
            return v && v !== "การประชุมครั้งที่ ";
        })
            .join(" / ") ||
            _committeeMeetingText_(item.title || "รับรองบันทึกการประชุม")
        : _committeeMeetingText_(agendaNo === "3" || agendaNo === "4"
            ? item.caseTitle || item.title || ""
            : item.title || item.caseTitle || "");
}

function _committeeMeetingAgendaLabel_(agendaNo) {
    var m;
    return ({
        1: "ระเบียบวาระที่ 1 เรื่องแจ้ง",
        2: "ระเบียบวาระที่ 2 รับรองบันทึกการประชุม",
        3: "ระเบียบวาระที่ 3 เรื่องพิจารณา",
        4: "ระเบียบวาระที่ 4 เรื่องอื่น ๆ",
    }[_s_(agendaNo)] || "ระเบียบวาระ");
}

function _committeeMeetingPrintBundle_(payload) {
    var q = _committeeMeetingText_((payload = payload || {}).query || payload.keyword || "").toLowerCase(), agendaFilter = _committeeMeetingText_(payload.agendaNo || payload.agenda || ""), bundle = _committeeMeetingBuildBundle_({
        query: q,
        agendaNo: agendaFilter,
        includeLegacyReadOnly: !1,
    }), overviewRows = [], summaryMeetings = [], listMeetings = [];
    return ((bundle.meetings || []).forEach(function (meeting) {
        var meetingId = _s_(meeting.meetingId), displayTitle = _committeeMeetingText_(meeting.title ||
            meeting.meetingTitle ||
            meeting.name ||
            meeting.displayTitle ||
            meeting.summaryTitle ||
            "การประชุมคณะกรรมาธิการ");
        listMeetings.push({
            meetingId,
            meetingNo: _committeeMeetingText_(meeting.meetingNo || ""),
            meetingDate: _committeeMeetingText_(meeting.meetingDate || ""),
            title: displayTitle,
            displayTitle,
            summaryTitle: displayTitle,
            note: _committeeMeetingText_(meeting.note || ""),
        });
        var meetingItems = ((bundle.itemsByMeetingId && bundle.itemsByMeetingId[meetingId]) ||
            []).filter(function (item) {
            return !agendaFilter || _s_(item.agendaNo) === agendaFilter;
        }), agenda13 = meetingItems
            .filter(function (item) {
            var agendaNo = _s_(item.agendaNo);
            return ((agendaNo === "1" || agendaNo === "3" || agendaNo === "4") &&
                !!_s_(item.caseId).trim());
        })
            .map(function (item) {
            return {
                meetingId,
                meetingNo: _committeeMeetingText_(meeting.meetingNo || ""),
                meetingDate: _committeeMeetingText_(meeting.meetingDate || ""),
                meetingTitle: displayTitle,
                displayTitle,
                agendaNo: _committeeMeetingText_(item.agendaNo || ""),
                agendaLabel: _committeeMeetingAgendaLabel_(item.agendaNo),
                title: _committeeMeetingAgendaTitle_(item),
                caseId: _committeeMeetingText_(item.caseId || ""),
                caseNum: _committeeMeetingCaseRefText_(item.caseNum || ""),
                recNo: _committeeMeetingCaseRefText_(item.recNo || ""),
                agencyOrPresenter: _committeeMeetingText_(item.agencyOrPresenter || ""),
                result: _committeeMeetingText_(item.result || item.note || ""),
            };
        });
        ((overviewRows = overviewRows.concat(agenda13)),
            summaryMeetings.push({
                meetingId,
                meetingNo: _committeeMeetingText_(meeting.meetingNo || ""),
                meetingDate: _committeeMeetingText_(meeting.meetingDate || ""),
                title: displayTitle,
                displayTitle,
                note: _committeeMeetingText_(meeting.note || ""),
                items: meetingItems.map(function (item) {
                    return {
                        itemId: _committeeMeetingText_(item.itemId || ""),
                        agendaNo: _committeeMeetingText_(item.agendaNo || ""),
                        agendaLabel: _committeeMeetingAgendaLabel_(item.agendaNo),
                        seq: Number(item.seq || 0) || 0,
                        title: _committeeMeetingAgendaTitle_(item),
                        relatedMeetingNo: _committeeMeetingText_(item.relatedMeetingNo || ""),
                        relatedMeetingDate: _committeeMeetingText_(item.relatedMeetingDate || ""),
                        caseId: _committeeMeetingText_(item.caseId || ""),
                        caseNum: _committeeMeetingCaseRefText_(item.caseNum || ""),
                        recNo: _committeeMeetingCaseRefText_(item.recNo || ""),
                        agencyOrPresenter: _committeeMeetingText_(item.agencyOrPresenter || ""),
                        result: _committeeMeetingText_(item.result || item.note || ""),
                    };
                }),
            }));
    }),
        {
            overviewRows,
            listMeetings,
            tableMeetings: listMeetings,
            summaryMeetings,
            filters: {
                query: q,
                agendaNo: agendaFilter,
                agendaLabel: agendaFilter
                    ? _committeeMeetingAgendaLabel_(agendaFilter)
                    : "ทุกวาระ",
            },
            generatedAt: new Date().toISOString(),
            totalOverviewRows: overviewRows.length,
            totalListMeetings: listMeetings.length,
            totalSummaryMeetings: summaryMeetings.length,
        });
}

function apiGetCommitteeMeetingPrintBundle(payload) {
    return MeetingDomain.getPrintBundle(payload || {});
}

function apiSearchMeetingAgendaCases(payload) {
    return MeetingDomain.searchAgendaCases(payload || {});
}

function apiSaveCommitteeMeetingSystem(payload) {
    return writeGateway_("apiSaveCommitteeMeetingSystem", payload || {}, function (input) {
        return MeetingDomain.saveSystem(input || {});
    }, "บันทึกการประชุมสำเร็จ", "บันทึกการประชุมไม่สำเร็จ");
}

function apiDeleteCommitteeMeetingSystem(payload) {
    return writeGateway_("apiDeleteCommitteeMeetingSystem", payload || {}, function (input) {
        return MeetingDomain.deleteSystem(input || {});
    }, "ลบการประชุมสำเร็จ", "ลบการประชุมไม่สำเร็จ");
}

function _meetingReadCacheScope_(payload, mode) {
    payload = payload || {};
    var stamp = function (name) {
        try { return _appIsFnName_("_entityCacheStamp_") ? String(_entityCacheStamp_(name) || "1") : "1"; }
        catch (_e) { return "1"; }
    };
    return {
        mode: String(mode || "system"),
        meetingId: _committeeMeetingText_(payload.meetingId || payload.id || ""),
        query: _committeeMeetingText_(payload.query || payload.q || payload.keyword || "").toLowerCase(),
        agendaNo: _committeeMeetingText_(payload.agendaNo || payload.agenda || ""),
        compactList: payload.compactList !== !1,
        sessionScope: _casePayloadSessionScope_(payload),
        meetingStamp: stamp("meeting"),
        meetingLogsStamp: stamp("meetinglogs"),
        committeeMeetingsStamp: stamp("committeemeetings"),
        agendaItemsStamp: stamp("committeemeetingagendaitems"),
        model: MEETING_READ_MODEL_STAMP_CURRENT
    };
}

function _meetingReadCacheKey_(payload, mode) {
    return "meeting_read_model_r210_" + _hotRouteDigest_(JSON.stringify(_meetingReadCacheScope_(payload || {}, mode)));
}

function _meetingReadAttachMeta_(result, started, cacheInfo) {
    result = result && typeof result == "object" ? result : ok_({}, "");
    var data = result.data && typeof result.data == "object" && !Array.isArray(result.data) ? result.data : result;
    var meta = _appAssignObjects_({}, data.meta || result.meta || {}, {
        readModel: MEETING_READ_MODEL_STAMP_CURRENT,
        readModelOwner: "Code_30_Domain_Cases.MeetingDomain",
        cacheHit: !!(cacheInfo && cacheInfo.hit),
        cacheStatus: String(cacheInfo && cacheInfo.status || "bypass"),
        cacheKey: String(cacheInfo && cacheInfo.key || ""),
        durationMs: Math.max(0, Date.now() - Number(started || Date.now())),
        source: "MeetingDomain.generationStampedReadModel.r210"
    });
    data.meta = meta;
    data.cacheHit = meta.cacheHit;
    data.cacheStatus = meta.cacheStatus;
    result.meta = _appAssignObjects_({}, result.meta || {}, meta);
    result.cacheHit = meta.cacheHit;
    result.cacheStatus = meta.cacheStatus;
    return result;
}

function _meetingReadThrough_(mode, payload, ttlSeconds, builder) {
    payload = payload || {};
    var started = Date.now(), allowCache = payload.forceFresh !== !0 && payload.noCache !== !0 && payload.bypassCache !== !0, key = _meetingReadCacheKey_(payload, mode), cacheInfo = {
        key: key,
        status: allowCache ? "miss" : "bypass",
        hit: !1
    };
    if (allowCache) {
        try {
            var hit = _hotRouteCacheGet_(key);
            if (hit && typeof hit == "object") {
                cacheInfo.status = "hit";
                cacheInfo.hit = !0;
                return _meetingReadAttachMeta_(hit, started, cacheInfo);
            }
        }
        catch (cacheErr) {
            cacheInfo.status = "read-error";
            _c30W_("meeting.readModel.cacheGet", cacheErr, { mode: mode });
        }
    }
    var result = _meetingReadAttachMeta_(builder(payload || {}), started, cacheInfo);
    if (allowCache && result && result.ok !== !1) {
        try { _hotRouteCachePut_(key, result, Math.max(60, Math.min(Number(ttlSeconds || 180) || 180, 600))); }
        catch (cachePutErr) { _c30W_("meeting.readModel.cachePut", cachePutErr, { mode: mode }); }
    }
    return result;
}
