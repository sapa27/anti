/** Canonical — Tracking/Letters domain function owner extracted from Code_30; behavior preserved. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {};
function _letterIsDateLikeValue_(value) {
    if (value == null || value === "")
        return !1;
    if (value instanceof Date && !isNaN(value.getTime()))
        return !0;
    var raw = _s_(value).trim();
    if (!raw)
        return !1;
    if (/^\d{4}-\d{1,2}-\d{1,2}(?:[T\s]|$)/.test(raw))
        return !0;
    if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s/i.test(raw) ||
        /GMT[+-]\d{4}|เวลาอินโดจีน/i.test(raw)) {
        var parsed = new Date(raw);
        return !isNaN(parsed.getTime());
    }
    return !1;
}

function _formatLetterNoFromDateValue_(value) {
    function toLetterNoFromParts(day, year) {
        var d = Number(day || 0), y = Number(year || 0);
        return d && y ? String(d) + "/" + String(y >= 2400 ? y : y + 543) : "";
    }
    if (value instanceof Date && !isNaN(value.getTime()))
        return toLetterNoFromParts(value.getDate(), value.getFullYear());
    var raw = _c30S_(value).trim();
    if (!raw)
        return "";
    var isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s]|$)/);
    if (isoMatch)
        return toLetterNoFromParts(isoMatch[3], isoMatch[1]);
    var parsed = new Date(raw);
    return isNaN(parsed.getTime())
        ? ""
        : toLetterNoFromParts(parsed.getDate(), parsed.getFullYear());
}

function _normalizeLetterNumberDisplay_(value) {
    if (value == null)
        return "";
    var textValue = _s_(value).trim();
    return textValue || value instanceof Date
        ? /^\d{1,5}\s*\/\s*\d{2,4}$/.test(textValue)
            ? textValue.replace(/\s*\/\s*/, "/")
            : (_letterIsDateLikeValue_(value) &&
                _formatLetterNoFromDateValue_(value)) ||
                textValue
        : "";
}

function _normalizeLetterDateFromFields_(letterDate, letterNo, bookNo) {
    return (_caseDateText_(letterDate || "", {
        context: "letterDate"
    }) ||
        (_letterIsDateLikeValue_(letterNo)
            ? _caseDateText_(letterNo || "", {
                context: "letterNo"
            })
            : _letterIsDateLikeValue_(bookNo)
                ? _caseDateText_(bookNo || "", {
                    context: "bookNo"
                })
                : ""));
}

function _normalizeLetterStatusCanonical_(status) {
    var s = _c30S_(status).replace(/\s+/g, "").trim();
    return s
        ? s === "ได้รับตอบกลับแล้ว" || s === "ตอบรับแล้ว" || s === "ได้รับแล้ว"
            ? "ได้รับแล้ว"
            : s
        : "ยังไม่ได้รับ";
}

function _isReceivedLetterStatusCanonical_(status) {
    return _normalizeLetterStatusCanonical_(status) === "ได้รับแล้ว";
}

function _normalizeLetterRow_(row) {
    row = row || {};
    var rawLetterNo = row.letterNo || row.bookNo || "", rawBookNo = row.bookNo || row.letterNo || "", letterNoWasDate = _letterIsDateLikeValue_(row.letterNo || ""), bookNoWasDate = _letterIsDateLikeValue_(row.bookNo || ""), rowCaseNum = _caseSequenceFrom_(row);
    return sanitizeRow_({
        letterId: _s_(row.letterId),
        caseId: _s_(row.caseId).trim(),
        caseNum: rowCaseNum,
        caseNo: rowCaseNum,
        runningNo: rowCaseNum,
        ลำดับเรื่อง: rowCaseNum,
        letterNo: _normalizeLetterNumberDisplay_(rawLetterNo),
        letterNoRaw: _c30S_(rawLetterNo),
        letterNoSchemaIssue: letterNoWasDate || bookNoWasDate ? "date-like-letter-number" : "",
        letterDate: _normalizeLetterDateFromFields_(row.letterDate || "", row.letterNo || "", row.bookNo || ""),
        agency: _s_(row.agency),
        subject: _s_(row.subject),
        issue: _s_(row.issue),
        dueDate: normalizeDateOutput_(row.dueDate || ""),
        extendDate: normalizeDateOutput_(row.extendDate || ""),
        remark: _s_(row.remark),
        letterStatus: _normalizeLetterStatusCanonical_(row.letterStatus || row.status || ""),
        repliesJSON: String(row.repliesJSON || row.repliesJson || "[]"),
        extensionsJSON: String(row.extensionsJSON || row.extensionJSON || row.extensionsJson || "[]"),
        opStaff: _s_(row.opStaff || row.officer),
        bookNo: _normalizeLetterNumberDisplay_(rawBookNo),
        bookNoRaw: _c30S_(rawBookNo),
        officer: _s_(row.officer || row.opStaff),
    });
}

function _safeLetterIdentityKey_(row) {
    row = row || {};
    var id = _s_(row.letterId || row.id || row.recordId || row.rowId).trim();
    if (id)
        return "id:" + id;
    return [
        "key", _caseSequenceFrom_(row), _s_(row.caseId).trim(),
        _s_(row.letterNo || row.bookNo).trim(),
        normalizeDateOutput_(row.letterDate || row.date || ""),
        _normalizeIdentityTextSafe_(row.subject || row.issue || ""),
        _normalizeIdentityTextSafe_(row.agency || "")
    ].join("|");
}

function _safeDedupeLatestRowsBy_(rows, keyFn) {
    if (((rows = _c30A_(rows) ? rows.slice() : []),
        _appIsFnName_("_dedupeLatestRowsBy_")))
        try {
            return _dedupeLatestRowsBy_(rows, keyFn);
        }
        catch (_e) {
            _recordWarning_("ec", _e);
        }
    var map = {};
    return (rows.forEach(function (row) {
        if (row) {
            var key = "";
            try {
                key = String((typeof keyFn == "function" ? keyFn(row) : "") || "");
            }
            catch (_eKey) {
                (_recordWarning_("ec", _eKey), (key = ""));
            }
            key ||
                (key = String(row.id ||
                    row.caseId ||
                    row.logId ||
                    row.letterId ||
                    JSON.stringify(row)));
            var current = map[key], rowStamp, curStamp;
            if (!current)
                return ((map[key] = row), void 0);
            _s_(row.updatedAt || row.modifiedAt || row.timestamp || row.createdAt) >=
                _s_(current.updatedAt ||
                    current.modifiedAt ||
                    current.timestamp ||
                    current.createdAt) && (map[key] = row);
        }
    }),
        Object.keys(map).map(function (key) {
            return map[key];
        }));
}

function _trackingProjectedFields_() {
    var relation = ["caseId", "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง", "เลขลำดับเรื่อง", "ลำดับเรื่องพิจารณา", "เลขที่ลำดับเรื่อง", "หมายเลขลำดับเรื่อง"];
    return {
        letters: _caseUniqueFieldList_(relation.concat([
            "letterId", "letterNo", "bookNo", "agency", "subject", "issue", "letterStatus", "status", "officer", "opStaff", "letterDate", "dueDate", "extendDate",
            "repliesJSON", "repliesJson", "replyRows", "replyItems", "replyList", "replyJSON", "replyJson", "ข้อมูลหนังสือตอบรับ", "replyDate", "receivedDate", "receiveDate", "วันที่รับ", "replyBookNo", "replyLetterNo", "replyNo", "receiveNo", "เลขที่หนังสือตอบรับ", "replyTitle", "replySubjectTitle", "replySubject", "เรื่องหนังสือตอบรับ", "เรื่องตอบรับ", "replySummary", "replyNote", "สาระตอบกลับ", "หมายเหตุ",
            "extensionsJSON", "extensionsJson", "extensionRows", "extensionItems", "extendItems", "extensionList", "extensionJSON", "extensionJson", "กรณีขยายระยะเวลา", "extensionBookNo", "extensionLetterNo", "extensionNo", "extendNo", "เลขที่หนังสือขยายเวลา", "extensionDate", "extensionLetterDate", "extendedDate", "วันเดือนปีขยายเวลา", "extensionTitle", "extensionSubject", "extendTitle", "เรื่องขยายเวลา", "extendedDueDate", "extensionDueDate", "newDueDate", "วันครบกำหนดขยายเวลา",
            "updatedAt", "createdAt", "isDeleted", "deletedAt"
        ])),
        cases: _caseUniqueFieldList_(relation.concat(["recNo", "title", "caseTitle", "status", "updatedAt", "isDeleted", "deletedAt"]))
    };
}

function TrackingRepository_() {
    var fields = _trackingProjectedFields_();
    function projected(sheetName, selectedFields, ttl) {
        return _caseReadProjectedRowsStrict_(sheetName, selectedFields, {
            includeDeleted: !1,
            ttl: ttl || 120,
            failedCode: "TRACKING_PROJECTED_READER_FAILED"
        });
    }
    return {
        repositoryOwner: !0,
        strictErrorMode: !0,
        listLetters: function (options) {
            options = options || {};
            return _caseReadProjectedRowsStrict_("Letters", fields.letters, _appAssignObjects_({
                includeDeleted: !1,
                ttl: 120,
                failedCode: "TRACKING_PROJECTED_READER_FAILED"
            }, options));
        },
        listCases: function () {
            return projected("MainData", fields.cases, 120);
        },
        searchIndex: function (lettersRows, caseMap) {
            return _getLettersSearchIndex_(lettersRows, caseMap);
        },
    };
}

function _trackingReadLettersRows_(options) {
    return TrackingRepository_().listLetters(options || {});
}

function _trackingNormalizeLetterNo_(value) {
    return _appIsFnName_("_normalizeLetterNumberDisplay_")
        ? _normalizeLetterNumberDisplay_(value)
        : _c30S_(value).trim();
}

function _trackingNormalizeStatus_(status) {
    if (_appIsFnName_("_normalizeLetterStatusCanonical_"))
        return _normalizeLetterStatusCanonical_(status);
    var s = _c30S_(status).replace(/\s+/g, "").trim();
    return s
        ? s === "ได้รับตอบกลับแล้ว" || s === "ตอบรับแล้ว"
            ? "ได้รับแล้ว"
            : s
        : "ยังไม่ได้รับ";
}

function _trackingIsReceived_(status) {
    return _appIsFnName_("_isReceivedLetterStatusCanonical_")
        ? _isReceivedLetterStatusCanonical_(status)
        : _trackingNormalizeStatus_(status) === "ได้รับแล้ว";
}

function _trackingQueryCacheKey_(payload) {
    payload = payload || {};
    var todayKey = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "Asia/Bangkok", "yyyy-MM-dd"), raw = {
        query: _s_(payload.query || payload.search),
        filterType: String(payload.filterType || payload.type || "all"),
        status: _s_(payload.status),
        opStaff: _s_(payload.opStaff || payload.staff),
        agency: _s_(payload.agency || payload.agencyFilter || payload.agencyName),
        caseId: _s_(payload.caseId),
        sortBy: String(payload.sortBy || "sequence"),
        sortDir: String(payload.sortDir || "asc"),
        page: Math.max(1, Number(payload.page || 1) || 1),
        limit: Math.max(1, Math.min(Number(payload.limit || 25) || 25, 25)),
        date: todayKey,
        release: String(((_appIsFnName_("_appRelease_") && _appRelease_()) || {}).assetStamp ||
            ((_appIsFnName_("_appRelease_") && _appRelease_()) || {}).stamp ||
            ""),
    };
    return ("tracking_query_status_filter_v8_" +
        (_appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("letters")
            : "1") +
        "_" +
        (_appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("maindata")
            : "1") +
        "_" +
        _appSha256Hex_(JSON.stringify(raw)).substring(0, 24));
}

function _trackingCaseMapCacheKey_() {
    return ("tracking_case_map_current_" +
        (_appIsFnName_("_entityCacheStamp_") ? _entityCacheStamp_("maindata") : "1"));
}

function _trackingBuildCaseMap_(cases, guardShouldYield, guardMarkPartial) {
    var caseMap = {};
    cases = _c30A_(cases) ? cases : [];
    for (var caseIndex = 0; caseIndex < cases.length; caseIndex++) {
        if (typeof guardShouldYield == "function" && guardShouldYield(650)) {
            typeof guardMarkPartial == "function" &&
                guardMarkPartial({
                    stage: "case-map",
                    processedCases: caseIndex,
                    totalCases: cases.length,
                });
            break;
        }
        var r = cases[caseIndex];
        r &&
            !isSoftDeletedRow_(r) &&
            (caseMap[_s_(r.caseId)] = {
                caseNum: _s_(r.caseNum),
                recNo: _s_(r.recNo),
                title: _s_(r.title || r.caseTitle),
                status: _s_(r.status),
            });
    }
    return caseMap;
}

function _trackingGetCaseMap_(trackingRepo, guardShouldYield, guardMarkPartial, forceFresh) {
    var key = _trackingCaseMapCacheKey_(), requestHit = _requestScopeGet_("trackingCaseMap", key);
    if (requestHit && typeof requestHit == "object")
        return requestHit;
    if (forceFresh !== !0 && _appIsFnName_("_cacheGetJson_")) {
        var cached = _cacheGetJson_(key);
        if (cached && cached.map && typeof cached.map == "object")
            return _requestScopePut_("trackingCaseMap", key, cached.map);
    }
    var map = _trackingBuildCaseMap_(trackingRepo.listCases(), guardShouldYield, guardMarkPartial);
    if (_appIsFnName_("_cachePutJson_"))
        try {
            _cachePutJson_(key, {
                map
            }, 180);
        }
        catch (_cacheErr) {
            _recordWarning_("ec", _cacheErr);
        }
    return _requestScopePut_("trackingCaseMap", key, map);
}

function _trackingEmptyResult_(payload, message, code) {
    payload = payload || {};
    var limit = Math.max(1, Math.min(Number(payload.limit || 25) || 25, 25)), page;
    return {
        rows: [],
        data: [],
        page: Math.max(1, Number(payload.page || 1) || 1),
        limit,
        totalRecords: 0,
        totalPages: 1,
        generatedAt: new Date().toISOString(),
        cached: !1,
        cacheStatus: "safe-empty",
        serverPaged: !0,
        serverFiltered: !0,
        statusCounts: {
            all: 0, received: 0, overdue: 0, notdue: 0
        },
        maxPageSize: 25,
        contract: "tracking-server-paged-current",
        dataQuality: {
            letterNoSchemaIssues: 0
        },
        filterType: String(payload.filterType || payload.type || "all"),
        sortBy: String(payload.sortBy || "sequence"),
        sortDir: String(payload.sortDir || "asc"),
        warning: _s_(message),
        errorCode: _s_(code),
        authoritative: !1,
        authoritativeEmpty: !1,
        fallbackAllowed: !0,
        performanceHTracking: !0,
    };
}

function _trackingParseReplies_(row) {
    try {
        var raw = String((row && (row.repliesJSON || row.repliesJson)) || "[]").trim();
        return raw && raw.charAt(0) === "[" ? JSON.parse(raw) : [];
    }
    catch (_e) {
        return (_recordWarning_("ec", _e), []);
    }
}


function _trackingReceivedFreezeDate_(normalized, replies, today) {
    ((normalized = normalized || {}), (replies = _c30A_(replies) ? replies : []));
    for (var i = 0; i < replies.length; i++) {
        var rd = _caseDateOnly_(replies[i] &&
            (replies[i].date || replies[i].replyDate || replies[i].receivedDate));
        if (rd)
            return rd;
    }
    return (_caseDateOnly_(normalized.receivedDate ||
        normalized.replyDate ||
        normalized.statusUpdatedAt ||
        normalized.updatedAt ||
        normalized.modifiedAt) ||
        _caseDateOnly_(today) ||
        null);
}

function _trackingSequenceNumber_(value) {
    var text = _trackingNormalizeLetterNo_(value), m = _s_(text).match(/\d+/);
    return m ? Number(m[0]) : Number.MAX_SAFE_INTEGER;
}

function _trackingBuildStatusCounts_(items) {
    var counts = {
        all: 0, received: 0, overdue: 0, notdue: 0
    };
    return ((_c30A_(items) ? items : []).forEach(function (item) {
        counts.all += 1;
        var key = String((item && item.filterKey) || "notdue");
        (counts[key] || (counts[key] = 0), (counts[key] += 1));
    }),
        counts);
}

function _trackingApplyServerFilters_(items, filters) {
    var matchedLetterIds = (filters = filters || {}).matchedLetterIds || null, query = _s_(filters.query), statusFilter = _s_(filters.statusFilter), staffFilter = _s_(filters.staffFilter).toLowerCase(), agencyFilter = _s_(filters.agencyFilter).toLowerCase(), caseIdFilter = _s_(filters.caseIdFilter);
    return (_c30A_(items) ? items : []).filter(function (item) {
        return (!(!item || isSoftDeletedRow_(item)) &&
            (!caseIdFilter || _s_(item.caseId) === caseIdFilter) &&
            (!statusFilter ||
                _s_(item.letterStatus) === statusFilter ||
                _s_(item.status) === statusFilter) &&
            (!staffFilter ||
                _s_(item.opStaff || item.officer)
                    .toLowerCase()
                    .indexOf(staffFilter) !== -1) &&
            (!agencyFilter ||
                _s_(item.agency).toLowerCase().indexOf(agencyFilter) !== -1) &&
            !(query && matchedLetterIds && !matchedLetterIds[_s_(item.letterId)]));
    });
}

function _trackingGuardAdapters_(guard) {
    function shouldYield(bufferMs) {
        return (!!guard &&
            (_appIsFn_(guard.shouldYield)
                ? guard.shouldYield(bufferMs)
                : !!_appIsFn_(guard.timeLeftMs) &&
                    guard.timeLeftMs() <= Math.max(Number(bufferMs || 0) || 0, 1500)));
    }
    function markPartial(detail) {
        if (guard) {
            if (_appIsFn_(guard.markPartial))
                try {
                    guard.markPartial(detail || {});
                }
                catch (_markErr) {
                    _recordWarning_("tracking.guard.markPartial", _markErr);
                }
            else if (_appIsFn_(guard.check))
                try {
                    guard.check("partial", detail || {});
                }
                catch (_checkErr) {
                    _recordWarning_("tracking.guard.checkPartial", _checkErr);
                }
        }
    }
    return {
        shouldYield, markPartial
    };
}

function _trackingBuildQueryMatchMap_(query, letterIndex) {
    if (!(query = _s_(query).trim().toLowerCase()))
        return null;
    var matchedLetterIds = {}, queryTokens = query
        .split(/[^0-9a-zA-Zก-๙]+/)
        .map(function (x) {
        return _s_(x).trim();
    })
        .filter(Boolean);
    return ((letterIndex || []).forEach(function (entry) {
        if (entry) {
            var hit = _s_(entry.text).indexOf(query) !== -1;
            if (!hit && queryTokens.length) {
                var tokenMap = {};
                ((entry.tokens || []).forEach(function (t) {
                    tokenMap[t] = 1;
                }),
                    (hit = queryTokens.every(function (t) {
                        return tokenMap[t] || _s_(entry.text).indexOf(t) !== -1;
                    })));
            }
            hit && (matchedLetterIds[_s_(entry.letterId)] = 1);
        }
    }),
        matchedLetterIds);
}

function _trackingNormalizeRowsForServerPage_(rows, caseMap, today, guardApi) {
    var normalizedItems = [];
    rows = _c30A_(rows) ? rows : [];
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        if (guardApi && guardApi.shouldYield && guardApi.shouldYield(650)) {
            guardApi.markPartial &&
                guardApi.markPartial({
                    stage: "normalize-letters",
                    processedRows: rowIndex,
                    totalRows: rows.length,
                });
            break;
        }
        var r = rows[rowIndex] || {}, normalized = _appIsFnName_("_normalizeLetterRow_")
            ? _normalizeLetterRow_(r)
            : r, due = _caseDateOnly_(normalized.extendDate || normalized.dueDate), daysLeft = due ? Math.round((due - today) / 864e5) : null, letterStatus = _trackingNormalizeStatus_(normalized.letterStatus || normalized.status || ""), received = _trackingIsReceived_(letterStatus), repliesParsed = _trackingParseReplies_(normalized), receivedFreezeDate = received
            ? _trackingReceivedFreezeDate_(normalized, repliesParsed, today)
            : null;
        received &&
            due &&
            receivedFreezeDate &&
            (daysLeft = Math.round((due - receivedFreezeDate) / 864e5));
        var filterKey = received
            ? "received"
            : due && daysLeft <= 0
                ? "overdue"
                : "notdue", caseInfo = (caseMap || {})[_s_(normalized.caseId)] || {
            caseNum: "-",
            recNo: "",
            title: "-",
            status: "",
        };
        normalizedItems.push(sanitizeRow_({
            letterId: normalized.letterId || "",
            caseId: normalized.caseId || "",
            caseNum: caseInfo.caseNum,
            recNo: caseInfo.recNo,
            caseTitle: caseInfo.title,
            title: caseInfo.title,
            caseStatus: caseInfo.status,
            letterNo: _trackingNormalizeLetterNo_(normalized.letterNo || normalized.bookNo || ""),
            bookNo: _trackingNormalizeLetterNo_(normalized.bookNo || normalized.letterNo || ""),
            letterNoRaw: normalized.letterNoRaw || "",
            letterNoSchemaIssue: normalized.letterNoSchemaIssue || "",
            agency: normalized.agency || "",
            subject: normalized.subject || normalized.title || "",
            issue: normalized.issue || "",
            daysLeft: daysLeft === null ? "" : daysLeft,
            frozenDaysLeft: received && daysLeft !== null ? daysLeft : "",
            stoppedDayCount: received,
            receivedDate: receivedFreezeDate
                ? Utilities.formatDate(receivedFreezeDate, Session.getScriptTimeZone() || "Asia/Bangkok", "yyyy-MM-dd")
                : "",
            status: letterStatus,
            letterStatus,
            filterKey,
            officer: normalized.officer || normalized.opStaff || "",
            opStaff: normalized.opStaff || normalized.officer || "",
            letterDate: normalized.letterDate || "",
            dueDate: normalized.dueDate || "",
            extendDate: normalized.extendDate || "",
            repliesJSON: normalized.repliesJSON || "[]",
            replies: repliesParsed,
        }));
    }
    return normalizedItems;
}

function _trackingSortServerItems_(items, sortBy, sortDir) {
    return ((items = _c30A_(items) ? items : []).sort(function (a, b) {
        var av, bv;
        if (sortBy === "caseNum" || sortBy === "sequence" || sortBy === "seq")
            return (av = _trackingSequenceNumber_(a && (a.caseNum || a.recNo || a.letterNo))) ===
                (bv = _trackingSequenceNumber_(b && (b.caseNum || b.recNo || b.letterNo)))
                ? _s_(a.caseNum || a.letterNo).localeCompare(_s_(b.caseNum || b.letterNo), "th", {
                    numeric: !0, sensitivity: "base"
                })
                : sortDir === "desc"
                    ? bv - av
                    : av - bv;
        if (((av = a && a[sortBy]),
            (bv = b && b[sortBy]),
            sortBy === "daysLeft"
                ? ((av = Number(av === "" || av == null ? 999999 : av)),
                    (bv = Number(bv === "" || bv == null ? 999999 : bv)))
                : sortBy === "letterDate" ||
                    sortBy === "dueDate" ||
                    sortBy === "extendDate"
                    ? ((av = av ? new Date(av).getTime() : 0),
                        (bv = bv ? new Date(bv).getTime() : 0))
                    : ((av = _c30S_(av).toLowerCase()),
                        (bv = _c30S_(bv).toLowerCase())),
            av === bv))
            return 0;
        var cmp = av > bv ? 1 : -1;
        return sortDir === "desc" ? -cmp : cmp;
    }),
        items);
}

function _trackingPaginateServerItems_(items, payload) {
    var trackingPayload = _appAssignObjects_({}, payload, {
        limit: Math.max(1, Math.min(Number(payload.limit || 25) || 25, 25)),
        page: Math.max(1, Number(payload.page || 1) || 1),
    });
    return _appIsFnName_("_paginateArrayResult_")
        ? _paginateArrayResult_(items.map(sanitizeRow_), trackingPayload, 25, 25, {
            source: "tracking-core-server-filtered",
        })
        : {
            rows: items.map(sanitizeRow_).slice(0, 25),
            totalRecords: items.length,
            page: 1,
            limit: Math.min(items.length, 25),
            totalPages: Math.max(1, Math.ceil(items.length / 25)),
        };
}

function _trackingRequestOptions_(payload) {
    payload = payload || {};
    var query = _s_(payload.query || payload.search)
        .trim()
        .toLowerCase(), rawType = String(payload.filterType || payload.type || payload.statusType || "all")
        .replace(/[ ​-‍\uFEFF]/g, "")
        .trim()
        .toLowerCase(), compact = rawType.replace(/[\s_\-\/]+/g, ""), thai = _s_(payload.filterType || payload.type).replace(/\s+/g, ""), typeFilter = "all";
    rawType && compact !== "all" && thai !== "หนังสือทั้งหมด"
        ? compact === "received" ||
            compact === "done" ||
            compact === "reply" ||
            compact === "replied" ||
            thai.indexOf("ตอบรับ") > -1 ||
            thai.indexOf("ได้รับแล้ว") > -1
            ? (typeFilter = "received")
            : compact === "overdue" ||
                compact === "due" ||
                compact === "late" ||
                compact === "expired" ||
                compact === "ครบเลยกำหนด" ||
                thai.indexOf("เลยกำหนด") > -1 ||
                thai.indexOf("ครบกำหนด") > -1
                ? (typeFilter = "overdue")
                : (compact === "notdue" ||
                    compact === "notyetdue" ||
                    compact === "pending" ||
                    compact === "soon" ||
                    compact === "ยังไม่ครบกำหนด" ||
                    compact === "ไม่ครบกำหนด" ||
                    thai.indexOf("ไม่ครบกำหนด") > -1) &&
                    (typeFilter = "notdue")
        : (typeFilter = "all");
    var sortBy = String(payload.sortBy || "sequence").trim(), allowedSorts;
    return ({
        sequence: !0,
        seq: !0,
        caseNum: !0,
        letterNo: !0,
        letterDate: !0,
        dueDate: !0,
        extendDate: !0,
        daysLeft: !0,
        agency: !0,
        opStaff: !0,
        status: !0,
        letterStatus: !0,
    }[sortBy] || (sortBy = "sequence"),
        {
            query,
            typeFilter,
            statusFilter: _s_(payload.status).trim(),
            staffFilter: _s_(payload.opStaff || payload.staff)
                .trim()
                .toLowerCase(),
            agencyFilter: _s_(payload.agency || payload.agencyFilter || payload.agencyName)
                .trim()
                .toLowerCase(),
            caseIdFilter: _s_(payload.caseId).trim(),
            sortBy,
            sortDir: String(payload.sortDir || "asc")
                .trim()
                .toLowerCase() === "desc"
                ? "desc"
                : "asc",
        });
}

function _trackingReadCachedPage_(cacheKey) {
    if (!_appIsFnName_("_cacheGetJson_"))
        return null;
    var cachedTracking = _cacheGetJson_(cacheKey);
    return cachedTracking &&
        _c30A_(cachedTracking.rows) &&
        cachedTracking.serverPaged === !0 &&
        cachedTracking.serverFiltered === !0 &&
        cachedTracking.contract === "tracking-server-paged-current" &&
        cachedTracking.rows.length <= 25 &&
        Number(cachedTracking.limit || 25) <= 25
        ? ((cachedTracking.cached = !0),
            (cachedTracking.cacheStatus = "hit"),
            cachedTracking)
        : null;
}

function _trackingBuildServerPageData_(payload, guardApi) {
    var opts = _trackingRequestOptions_((payload = payload || {})), trackingRepo = TrackingRepository_(), rows = trackingRepo.listLetters(), caseMap = _trackingGetCaseMap_(trackingRepo, guardApi && guardApi.shouldYield, guardApi && guardApi.markPartial, payload.forceFresh === !0), today = new Date();
    today.setHours(0, 0, 0, 0);
    var matchedLetterIds = _trackingBuildQueryMatchMap_(opts.query, trackingRepo.searchIndex(rows, caseMap)), normalizedItems = _trackingNormalizeRowsForServerPage_(rows, caseMap, today, guardApi || {}), baseItems = _trackingApplyServerFilters_(normalizedItems, {
        query: opts.query,
        matchedLetterIds,
        statusFilter: opts.statusFilter,
        staffFilter: opts.staffFilter,
        agencyFilter: opts.agencyFilter,
        caseIdFilter: opts.caseIdFilter,
    }), statusCounts = _trackingBuildStatusCounts_(baseItems), items = baseItems.filter(function (item) {
        return (!opts.typeFilter ||
            opts.typeFilter === "all" ||
            _s_(item.filterKey) === opts.typeFilter);
    });
    return ((items = _trackingSortServerItems_(items, opts.sortBy, opts.sortDir)),
        {
            opts,
            rows,
            normalizedItems,
            baseItems,
            items,
            paged: _trackingPaginateServerItems_(items, payload),
            statusCounts,
        });
}

function _trackingBuildServerOutput_(payload, result, cacheKey, guard) {
    var opts = (result = result || {}).opts || _trackingRequestOptions_(payload || {}), baseItems = _c30A_(result.baseItems) ? result.baseItems : [], paged = result.paged || {}, generatedAt = new Date().toISOString(), out = _appAssignObjects_({}, paged, {
        generatedAt,
        cached: !1,
        cacheStatus: "miss",
        serverPaged: !0,
        serverFiltered: !0,
        statusCounts: result.statusCounts || _trackingBuildStatusCounts_(baseItems),
        maxPageSize: 25,
        contract: "tracking-server-paged-current",
        contractEnvelope: "rows-totalRecords-page-limit-meta-current",
        meta: {
            source: "tracking-core-server-filtered",
            generatedAt,
            filterType: opts.typeFilter || "all",
            sortBy: opts.sortBy,
            sortDir: opts.sortDir,
        },
        dataQuality: {
            letterNoSchemaIssues: baseItems.filter(function (x) {
                return !(!x || !x.letterNoSchemaIssue);
            }).length,
        },
        filterType: opts.typeFilter || "all",
        sortBy: opts.sortBy,
        sortDir: opts.sortDir,
        partial: !!(guard && guard.report && guard.report().yielded),
        warning: guard && guard.report && guard.report().yielded
            ? "PARTIAL_RESULT_TIMEOUT_GUARD"
            : "",
        authoritative: !(guard && guard.report && guard.report().yielded),
        authoritativeEmpty: !(guard && guard.report && guard.report().yielded) && (!_c30A_(paged.rows) || paged.rows.length === 0),
        fallbackAllowed: !!(guard && guard.report && guard.report().yielded),
        performanceHTracking: !0,
    });
    return (guard &&
        _appIsFnName_("_executionGuardAttachMeta_") &&
        (out = _executionGuardAttachMeta_(out, guard, {
            rowsRead: (result.rows || []).length,
            normalizedRows: (result.normalizedItems || []).length,
        })),
        _appIsFnName_("_noteResponseBudget_") &&
            (out.responseBudget = _noteResponseBudget_("apiGetTracking", out)),
        out);
}

function _getTrackingCore_(payload) {
    payload = payload || {};
    var guard = typeof createExecutionGuard_ == "function"
        ? createExecutionGuard_({
            label: "_getTrackingCore_",
            route: "apiGetTracking",
            maxMs: Number(payload.hardLimitMs || 28e3) || 28e3,
            warningMs: Number(payload.softLimitMs || 24e3) || 24e3,
        })
        : null, guardApi = _trackingGuardAdapters_(guard);
    try {
        var cacheTtlSeconds = Math.max(10, Math.min(Number(payload.cacheTtlSeconds || 45) || 45, 180)), cacheKey = _trackingQueryCacheKey_(payload);
        if (payload.forceFresh !== !0) {
            var cachedTracking = _trackingReadCachedPage_(cacheKey);
            if (cachedTracking)
                return ok_(cachedTracking, "โหลดข้อมูลติดตามหนังสือสำเร็จ");
        }
        var pageData, out = _trackingBuildServerOutput_(payload, _trackingBuildServerPageData_(payload, guardApi), cacheKey, guard);
        return (_appIsFnName_("_cachePutJson_") &&
            _cachePutJson_(cacheKey, out, cacheTtlSeconds),
            ok_(out, "โหลดข้อมูลติดตามหนังสือสำเร็จ"));
    }
    catch (e) {
        _recordWarning_("ec", e);
        var userMessage = _appIsFnName_("_aiUserFacingError_")
            ? _aiUserFacingError_(e)
            : e && e.message
                ? e.message
                : String(e);
        try {
            typeof logAudit_ == "function" &&
                logAudit_("tracking.strict_error", {
                    message: _s_(userMessage).substring(0, 240),
                });
        }
        catch (_auditErr) {
            _recordWarning_("ec", _auditErr);
        }
        var empty = _trackingEmptyResult_(payload, userMessage, "TRACKING_PROJECTED_READER_REQUIRED");
        return ((empty.partial = !0),
            (empty.cacheStatus = "error"),
            (empty.strictErrorMode = !0),
            err_("โหลดข้อมูลติดตามหนังสือไม่สำเร็จ:" + userMessage, empty));
    }
}

function _letterReadIdentity_(row) {
    row = row || {};
    var id = _s_(row.letterId || row.id || row.recordId || row.rowId).trim();
    return id ? "id:" + id : [
        "key", _s_(row.caseId), _s_(row.letterNo || row.bookNo),
        normalizeDateOutput_(row.letterDate || row.date || ""),
        _normalizeIdentityTextSafe_(row.subject || row.issue || ""),
        _normalizeIdentityTextSafe_(row.agency || "")
    ].join("|");
}

function _letterReadFullRows_() {
    try {
        return sheetToObjects_(getSheet_("Letters")) || [];
    }
    catch (_fullErr) {
        _recordWarning_("letters.fullRead.p1", _fullErr);
        return [];
    }
}

function _letterReadMergeSources_(projectedRows, fullRows) {
    projectedRows = _c30A_(projectedRows) ? projectedRows : [];
    fullRows = _c30A_(fullRows) ? fullRows : [];
    var fullByKey = {}, seen = {};
    fullRows.forEach(function (row) {
        fullByKey[_letterReadIdentity_(row)] = row;
    });
    var rows = (projectedRows.length ? projectedRows : fullRows).map(function (row) {
        var key = _letterReadIdentity_(row), full = fullByKey[key];
        seen[key] = !0;
        return full ? _caseMergeNonEmpty_(row, full) : row;
    });
    fullRows.forEach(function (row) {
        var key = _letterReadIdentity_(row);
        if (!seen[key]) {
            seen[key] = !0;
            rows.push(row);
        }
    });
    return rows;
}

function _letterReadNormalizeDetailed_(row, context) {
    row = row || {};
    context = context || {};
    var normalized = _normalizeLetterRow_(row);
    ["caseNum", "caseNo", "recNo", "receiveNo", "title", "caseTitle", "petitioners"].forEach(function (key) {
        if (row[key] !== void 0 && normalized[key] === void 0)
            normalized[key] = row[key];
    });
    var replies = _caseFirstArrayField_(row, normalized, [
        "replies", "replyRows", "replyItems", "replyList", "repliesJSON", "repliesJson", "replyJSON", "replyJson", "ข้อมูลหนังสือตอบรับ"
    ]), extensions = _caseFirstArrayField_(row, normalized, [
        "extensions", "extensionRows", "extensionItems", "extendItems", "extensionList", "extensionsJSON", "extensionsJson", "extensionJSON", "extensionJson", "กรณีขยายระยะเวลา"
    ]);
    if (!replies.length) {
        var reply = _letterSaveNormalizeReplyD_({
            date: _casePick_(row, ["replyDate", "receivedDate", "receiveDate", "วันที่รับ"]),
            bookNo: _casePick_(row, ["replyBookNo", "replyLetterNo", "replyNo", "receiveNo", "เลขที่หนังสือตอบรับ"]),
            title: _casePick_(row, ["replyTitle", "replySubjectTitle", "replySubject", "เรื่องหนังสือตอบรับ", "เรื่องตอบรับ"]),
            subject: _casePick_(row, ["replySummary", "replyNote", "สาระตอบกลับ", "หมายเหตุ"])
        });
        if (_s_(reply.date || reply.bookNo || reply.title || reply.subject).trim())
            replies = [reply];
    }
    else
        replies = replies.map(_letterSaveNormalizeReplyD_).filter(function (item) {
            return !!_s_(item.date || item.bookNo || item.title || item.subject).trim();
        });
    if (!extensions.length) {
        var extension = _letterSaveNormalizeExtensionD_({
            bookNo: _casePick_(row, ["extensionBookNo", "extensionLetterNo", "extensionNo", "extendNo", "เลขที่หนังสือขยายเวลา"]),
            date: _casePick_(row, ["extensionDate", "extensionLetterDate", "extendedDate", "วันเดือนปีขยายเวลา"]),
            title: _casePick_(row, ["extensionTitle", "extensionSubject", "extendTitle", "เรื่องขยายเวลา"]),
            dueDate: _casePick_(row, ["extendedDueDate", "extensionDueDate", "newDueDate", "วันครบกำหนดขยายเวลา"])
        });
        if (_s_(extension.bookNo || extension.date || extension.title || extension.dueDate).trim())
            extensions = [extension];
    }
    else
        extensions = extensions.map(_letterSaveNormalizeExtensionD_).filter(function (item) {
            return !!_s_(item.bookNo || item.date || item.title || item.dueDate).trim();
        });
    normalized.repliesJSON = _safeJsonStringify_(replies);
    normalized.extensionsJSON = _safeJsonStringify_(extensions);
    normalized.replies = normalized.replyRows = normalized.replyItems = replies;
    normalized.extensions = normalized.extensionRows = normalized.extensionItems = extensions;
    normalized.detailsAuthoritative = normalized.letterDetailsComplete = !0;
    normalized.relatedDetailsSource = context.fullRowsAvailable ? "letters-full-row-r163" : "letters-projected-json-r163";
    if (context.relation)
        normalized = _caseStampResolvedRelation_(normalized, context.relation, "letter-case-sequence-or-caseid-resolved-r146");
    if (context.canonicalCaseId)
        normalized.caseId = context.canonicalCaseId;
    return normalized;
}

function _Domain_getLetters(caseId) {
    try {
        getCanonicalHeaderAudit_("Letters");
        var payload = caseId && typeof caseId === "object" && !_c30A_(caseId) ? caseId : {}, listMode = _s_(payload.__meetingListMode || payload.listMode || "").trim(), requestedLetterId = _s_(payload.letterId || payload.id || payload.recordId || payload.rowId || "").trim(), preferCaseList = /caseLetters|allLetters|case/i.test(listMode) || payload.__meetingListRefreshOwner || payload.__meetingAfterSaveRefreshOwner || payload.includeLetters === !0, letterId = preferCaseList ? "" : requestedLetterId, forceFresh = payload.forceFresh === !0 || payload.forceRefresh === !0 || payload.noCache === !0 || payload.bypassCache === !0 || payload.cacheTtlSeconds === 0 || !!letterId, targetCaseNum = _caseSequenceFrom_(payload), relation = null, canonicalCaseId = "";
        if (!targetCaseNum && !letterId)
            throw new Error("กรุณาระบุลำดับเรื่องสำหรับหนังสือติดตาม");
        if (!letterId) {
            var resolved = _requireUniqueCaseBySequence_(_caseSequenceIdentityPayload_(targetCaseNum)), caseRow = resolved && resolved.row || {};
            canonicalCaseId = _s_(caseRow.caseId || caseRow.id).trim();
            relation = { caseNum: targetCaseNum, caseId: canonicalCaseId, row: caseRow };
        }
        var projectedRows = [];
        try {
            projectedRows = _trackingReadLettersRows_(letterId ? {
                selectKeyField: "letterId",
                selectKeyValues: [letterId],
                selectionMode: "exact-letter-id",
                selectionFallbackOnEmpty: !0,
                batchSize: 500,
                forceFresh: forceFresh
            } : {
                selectKeyField: "caseNum",
                selectKeyValues: [targetCaseNum],
                selectionMode: "primary-key-case-sequence",
                selectionFallbackOnEmpty: !0,
                batchSize: 500,
                forceFresh: forceFresh
            }) || [];
        }
        catch (_projectedErr) {
            _recordWarning_("letters.projectedRead.p1", _projectedErr);
        }
        var projectionMeta = projectedRows && projectedRows.__projectionMeta || {}, projectedAuthoritative = projectionMeta.authoritative === !0 && !(projectionMeta.requestedMissingFields || []).length,
            needsLegacyFullFallback = (forceFresh || !!letterId) && (!projectedRows.length || !projectedAuthoritative),
            fullRows = needsLegacyFullFallback ? _letterReadFullRows_() : [], allRows = _letterReadMergeSources_(projectedRows, fullRows), rows = letterId
            ? allRows.filter(function (row) {
                return _s_(row.letterId || row.id || row.recordId || row.rowId).trim() === letterId;
            })
            : allRows.filter(function (row) {
                return !!row && !isSoftDeletedRow_(row) && _caseChildRowBelongsToResolvedCase_(row, relation);
            }), context = {
                relation: relation,
                canonicalCaseId: canonicalCaseId,
                fullRowsAvailable: fullRows.length > 0
            };
        return _safeDedupeLatestRowsBy_(rows, _safeLetterIdentityKey_)
            .map(function (row) {
                return _letterReadNormalizeDetailed_(row, context);
            })
            .sort(function (a, b) {
                var av = _s_(a.letterDate || a.dueDate), bv = _s_(b.letterDate || b.dueDate);
                return av === bv ? _s_(b.letterId).localeCompare(_s_(a.letterId), "th") : av > bv ? -1 : 1;
            });
    }
    catch (e) {
        _recordWarning_("ec", e);
        logAudit_("letters.strict_error", { error: String(e && e.message ? e.message : e) });
        throw e;
    }
}

function deleteLetter(payload) {
    var input;
    return domainWrite_("deleteLetter", payload && typeof payload == "object" ? payload : {
        letterId: payload
    }, function (req) {
        req = req && typeof req === "object" ? req : {};
        var letterId = String(_payloadValue_(req, [
            "letterId", "id"
        ]) || "").trim();
        if (!letterId)
            throw new Error("ไม่พบรหัสหนังสือติดตามที่ต้องการลบ");
        var p0Identity = _assertCaseWritePrimaryKeyConsistency_(req, "deleteLetter");
        var caseNum = p0Identity.caseNum;
        if (!caseNum)
            throw new Error("ไม่พบลำดับเรื่องสำหรับลบหนังสือติดตาม");
        var targetLetter = (_meetingLettersRows_("Letters", !0) || []).filter(function (row) {
            return _s_(row && (row.letterId || row.id || row.recordId || row.rowId)).trim() === letterId;
        })[0] || null, targetCaseNum = _caseSequenceFrom_(targetLetter || {});
        if (!targetCaseNum && targetLetter && targetLetter.caseId) {
            if (_casePrimaryKeyStrictReadEnabled_())
                throw new Error("หนังสือติดตามไม่มีลำดับเรื่องและถูกกักกันหลัง Primary Key Migration");
            if (_s_(targetLetter.caseId).trim() !== p0Identity.caseId)
                throw new Error("หนังสือติดตาม legacy ไม่ตรงกับเรื่องที่เลือก");
            var targetRelation = _safeResolveCaseIdentityAliases_({
                caseId: targetLetter.caseId
            });
            targetCaseNum = _caseSequenceNormalizeStrict_(targetRelation && targetRelation.caseNum || "");
        }
        if (targetCaseNum && targetCaseNum !== caseNum)
            throw new Error("หนังสือติดตามไม่ตรงกับลำดับเรื่องที่เลือก");
        var res = getCanonicalRepository_("letters.main").softDelete(letterId, {
            isDeleted: !0,
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }), cacheInvalidation = _appIsFnName_("_invalidateLettersDerivedCaches_")
            ? _invalidateLettersDerivedCaches_("deleteLetter")
            : {};
        return ok_({
            letterId: letterId,
            primaryKey: "ลำดับเรื่อง",
            caseNum: caseNum,
            cacheInvalidation: cacheInvalidation,
            result: res,
        }, "ลบหนังสือติดตามสำเร็จ");
    });
}

function _fetchAllLettersWithCaseInfoImpl_(payload) {
    payload = payload || {};
    var allCases = _safeDedupeLatestRowsBy_(_meetingLettersRows_("MainData", !1), _safeCaseIdentityKey_), caseMap = {}, caseSeqMap = {};
    allCases.forEach(function (row) {
        if (row && !isSoftDeletedRow_(row)) {
            var id = _s_(row.caseId).trim(), seq = _caseSequenceFrom_(row);
            id && (caseMap[id] = row);
            seq && (caseSeqMap[seq] = row);
        }
    });
    var letters = _safeDedupeLatestRowsBy_(_meetingLettersRows_("Letters", !1), _safeLetterIdentityKey_)
        .filter(function (row) {
        return row && !isSoftDeletedRow_(row);
    })
        .map(function (row) {
        var normalized = _normalizeLetterRow_(row), rowCaseNum = _caseSequenceFrom_(row) || _caseSequenceFrom_(normalized), rowCaseId = _s_(normalized.caseId || row.caseId || "").trim(), owner = rowCaseNum ? caseSeqMap[rowCaseNum] || null : caseMap[rowCaseId] || null;
        if (rowCaseNum && owner && _caseSequenceFrom_(owner) !== rowCaseNum)
            owner = null;
        owner &&
            ((normalized.caseNum = _caseSequenceFrom_(owner) || _s_(owner.caseNum)),
                (normalized.caseNo = normalized.caseNum),
                (normalized.runningNo = normalized.caseNum),
                (normalized["ลำดับเรื่อง"] = normalized.caseNum),
                (normalized.recNo = _s_(owner.recNo)),
                (normalized.caseTitle = _s_(owner.caseTitle || owner.title)),
                (normalized.title = _s_(owner.title || owner.caseTitle)),
                (normalized.petitioners = _s_(owner.petitioners || owner.petitionerName)),
                (normalized.assignees = _s_(owner.assignees)),
                (normalized.status = _s_(owner.status)));
        try {
            var repliesJson = normalized.repliesJSON || "[]";
            normalized.replies =
                repliesJson && String(repliesJson).trim().charAt(0) === "["
                    ? JSON.parse(repliesJson)
                    : [];
        }
        catch (_e) {
            (_recordWarning_("ec", _e), (normalized.replies = []));
        }
        return normalized;
    }), filterType = String(payload.filterType || payload.type || "all").trim();
    if (filterType === "received")
        letters = letters.filter(function (row) {
            return (_s_(row.letterStatus).trim() === "ได้รับแล้ว" ||
                _s_(row.letterStatus).trim() === "ได้รับตอบกลับแล้ว");
        });
    else if (filterType === "overdue" || filterType === "notdue") {
        var today = new Date();
        (today.setHours(0, 0, 0, 0),
            (letters = letters.filter(function (row) {
                var status = _s_(row.letterStatus).trim();
                if (status === "ได้รับแล้ว" || status === "ได้รับตอบกลับแล้ว")
                    return !1;
                var target = row.extendDate || row.dueDate;
                if (!target)
                    return filterType === "notdue";
                var d = _caseDateOnly_(target);
                return d
                    ? filterType === "overdue"
                        ? today >= d
                        : today < d
                    : filterType === "notdue";
            })));
    }
    return (letters.sort(function (a, b) {
        var av = _s_(a.letterDate || a.dueDate), bv = _s_(b.letterDate || b.dueDate);
        return av === bv
            ? _s_(a.caseNum).localeCompare(_s_(b.caseNum), "th")
            : av > bv
                ? -1
                : 1;
    }),
        ok_(letters, "โหลดหนังสือติดตามพร้อมข้อมูลเรื่องสำเร็จ"));
}

function _letterSaveNormalizeReplyD_(row) {
    row = row || {};
    var date = normalizeDateOutput_(row.date || row.replyDate || row.receivedDate || row.receiveDate || row["วันที่รับ"] || ""), bookNo = _normalizeLetterNumberDisplay_(row.bookNo || row.letterNo || row.replyBookNo || row.replyLetterNo || row.replyNo || row.receiveNo || row["เลขที่หนังสือ"] || row["เลขที่หนังสือตอบรับ"] || ""), title = _s_(row.title || row.replyTitle || row.subjectTitle || row.replySubjectTitle || row["เรื่อง"] || row["เรื่องหนังสือตอบรับ"] || row["เรื่องตอบรับ"] || ""), subject = _s_(row.subject || row.summary || row.note || row.replySubject || row.replySummary || row.replyNote || row["สาระตอบกลับ"] || row["หมายเหตุ"] || "");
    return {
        date: date,
        replyDate: date,
        receivedDate: date,
        bookNo: bookNo,
        letterNo: bookNo,
        title: title,
        subject: subject,
        summary: subject,
        note: subject
    };
}

function _letterSaveNormalizeExtensionD_(row) {
    row = row || {};
    var bookNo = _normalizeLetterNumberDisplay_(row.bookNo || row.letterNo || row.extensionBookNo || row.extensionLetterNo || row.extensionNo || row.extendNo || row["เลขที่หนังสือ"] || row["เลขที่หนังสือขยายเวลา"] || ""), date = normalizeDateOutput_(row.date || row.letterDate || row.extensionDate || row.extensionLetterDate || row.extendedDate || row["วันเดือนปี"] || row["วันเดือนปีขยายเวลา"] || ""), title = _s_(row.title || row.subject || row.extensionTitle || row.extensionSubject || row.extendTitle || row.topic || row.issue || row["เรื่อง"] || row["เรื่องขยายเวลา"] || ""), dueDate = normalizeDateOutput_(row.extendedDueDate || row.dueDate || row.extensionDueDate || row.newDueDate || row.extendDate || row["วันครบกำหนดขยายเวลา"] || "");
    return {
        bookNo: bookNo,
        letterNo: bookNo,
        date: date,
        letterDate: date,
        extensionDate: date,
        title: title,
        subject: title,
        dueDate: dueDate,
        extendedDueDate: dueDate,
        newDueDate: dueDate
    };
}

function _letterSaveNormKeyD_(value) {
    try {
        if (typeof _normalizedHeaderKey_ === "function")
            return _normalizedHeaderKey_(value);
    }
    catch (_nkErr) { _appIgnoreExpected_("Code_30_Domain_Cases.gs.ignored", _nkErr); }
    return String(value == null ? "" : value).replace(/[\s\u00A0\u200B-\u200D\uFEFF_\-\/().:：]+/g, "").toLowerCase();
}

function _letterSaveCleanD_(value) {
    return _s_(value).replace(/[\u00A0\u200B-\u200D\uFEFF]/g, " ").replace(/\s+/g, " ").trim();
}

function _letterSaveReadHeadersD_(sheet) {
    var lastCol = Math.max(1, Number(sheet.getLastColumn && sheet.getLastColumn()) || 1);
    return AppRepository.getRangeValues("Letters", 1, 1, 1, lastCol)[0].map(function (header) {
        return String(header || "").trim();
    });
}

function _letterSaveEnsureHeadersD_(sheet, required) {
    var headers = _letterSaveReadHeadersD_(sheet), seen = {};
    headers.forEach(function (header) {
        var key = _letterSaveNormKeyD_(header);
        key && (seen[key] = !0);
    });
    var missing = [];
    required.forEach(function (header) {
        var key = _letterSaveNormKeyD_(header);
        if (key && !seen[key]) {
            seen[key] = !0;
            missing.push(header);
        }
    });
    if (missing.length) {
        AppRepository.setRangeValues("Letters", 1, headers.length + 1, [missing], { domain: "letters", invalidate: !1 });
        headers = headers.concat(missing);
    }
    return headers;
}

function _letterSaveBuildIndexD_(headers) {
    var exact = {}, normalized = {};
    headers.forEach(function (header, index) {
        header && (exact[header] = index);
        var key = _letterSaveNormKeyD_(header);
        key && normalized[key] == null && (normalized[key] = index);
    });
    return {
        exact: exact,
        normalized: normalized,
        idx: function (names) {
            names = Array.isArray(names) ? names : [names];
            for (var i = 0; i < names.length; i++) {
                var name = String(names[i] || "");
                if (this.exact[name] != null)
                    return this.exact[name];
                var key = _letterSaveNormKeyD_(name);
                if (key && this.normalized[key] != null)
                    return this.normalized[key];
            }
            return -1;
        }
    };
}

function _letterSaveColumnValuesD_(sheet, index, lastRow) {
    if (index < 0 || lastRow <= 1)
        return [];
    return AppRepository.getRangeValues("Letters", 2, index + 1, lastRow - 1, 1).map(function (row) {
        return row && row[0];
    });
}

function _letterSaveCollectionsE_(input) {
    var replies = (_c30A_(input.replies) ? input.replies : []).map(_letterSaveNormalizeReplyD_).filter(function (item) {
        return _s_(item.date || item.bookNo || item.title || item.subject).trim() !== "";
    }), extensions = (_c30A_(input.extensions) ? input.extensions : []).map(_letterSaveNormalizeExtensionD_).filter(function (item) {
        return _s_(item.bookNo || item.date || item.title || item.dueDate).trim() !== "";
    }), latestExtendDate = "";
    extensions.forEach(function (item) {
        if (item && item.dueDate)
            latestExtendDate = item.dueDate;
    });
    return {
        replies: replies,
        extensions: extensions,
        latestExtendDate: latestExtendDate
    };
}

function _letterSaveRequiredHeadersE_() {
    return [
        "letterId", "caseId", "caseNum", "caseNo", "runningNo", "ลำดับเรื่อง", "เลขลำดับเรื่อง", "ลำดับเรื่องพิจารณา", "เลขที่ลำดับเรื่อง", "หมายเลขลำดับเรื่อง",
        "letterNo", "bookNo", "letterDate", "agency", "subject", "issue", "dueDate", "extendDate", "remark", "letterStatus", "repliesJSON", "extensionsJSON", "opStaff", "officer", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ];
}

function _letterSaveBuildRowE_(input, caseNum, caseId, collections, now) {
    var incomingLetterNo = input.letterNo || input.bookNo || "", incomingBookNo = input.bookNo || input.letterNo || "", letterId = String(input.letterId || "LTR-" + Date.now()).trim(), normalizedLetterNo = _normalizeLetterNumberDisplay_(incomingLetterNo), normalizedBookNo = _normalizeLetterNumberDisplay_(incomingBookNo), normalizedLetterDate = _normalizeLetterDateFromFields_(input.letterDate || "", input.letterNo || "", input.bookNo || "");
    return {
        letterId: letterId,
        normalizedLetterNo: normalizedLetterNo,
        normalizedBookNo: normalizedBookNo,
        row: _caseSequenceIdentityPayload_(caseNum, {
            letterId: letterId,
            caseId: caseId,
            letterNo: normalizedLetterNo,
            letterDate: normalizedLetterDate,
            agency: _s_(input.agency).trim(),
            subject: _s_(input.subject).trim(),
            issue: _s_(input.issue).trim(),
            dueDate: input.dueDate || "",
            extendDate: input.extendDate || collections.latestExtendDate || "",
            remark: _s_(input.remark).trim(),
            letterStatus: _normalizeLetterStatusCanonical_(input.letterStatus || "ยังไม่ได้รับ"),
            repliesJSON: _safeJsonStringify_(collections.replies),
            extensionsJSON: _safeJsonStringify_(collections.extensions),
            opStaff: _s_(input.opStaff).trim(),
            bookNo: normalizedBookNo,
            officer: _s_(input.officer || input.opStaff).trim(),
            updatedAt: now,
            isDeleted: !1,
            deletedAt: ""
        })
    };
}

function _letterSaveStorageE_(ctx) {
    var sheet = getSheet_("Letters"), headers = _letterSaveEnsureHeadersD_(sheet, ctx.required), index = _letterSaveBuildIndexD_(headers), width = headers.length, meta = AppRepository.getSheetMeta("Letters", { forceFresh: !0 }), lastRow = Math.max(1, Number(meta.lastRow || 0)), found = _letterSaveFindRowD_(ctx, sheet, index, lastRow), values = found.rowNumber > 1 ? AppRepository.getRangeValues("Letters", found.rowNumber, 1, 1, width)[0] : headers.map(function () { return ""; });
    return {
        sheet: sheet,
        headers: headers,
        index: index,
        width: width,
        lastRow: lastRow,
        rowNumber: found.rowNumber,
        serviceReads: found.serviceReads + (found.rowNumber > 1 ? 1 : 0),
        values: values
    };
}

function _letterSaveApplyRowE_(ctx, storage) {
    function setField(names, value) {
        var column = storage.index.idx(names);
        if (column >= 0)
            storage.values[column] = value == null ? "" : value;
    }
    Object.keys(ctx.row).forEach(function (key) {
        setField(key, ctx.row[key]);
    });
    var isUpdate = storage.rowNumber > 0;
    if (!isUpdate) {
        setField("createdAt", ctx.now);
        ctx.row.createdAt = ctx.now;
        storage.rowNumber = storage.lastRow + 1;
    }
    return {
        rowNumber: storage.rowNumber,
        values: storage.values,
        isUpdate: isUpdate
    };
}

function _letterSaveInvalidateE_(rowNumber) {
    try {
        if (typeof invalidateSheetCache_ === "function")
            invalidateSheetCache_("Letters");
    }
    catch (_invSheetErr) {
        _c30W_("letters.save.fast.invalidateSheet.r90", _invSheetErr, { row: rowNumber });
    }
    try {
        return _appIsFnName_("_invalidateLettersDerivedCaches_")
            ? _invalidateLettersDerivedCaches_("saveLetter.fast.r90") || {}
            : {};
    }
    catch (_invErr) {
        _c30W_("letters.save.fast.invalidate.r90", _invErr, { row: rowNumber });
        return {};
    }
}

function _letterSaveResultE_(ctx, storage, written, cacheInvalidation) {
    ctx.row._rowNumber = written.rowNumber;
    return ok_({
        letterId: ctx.letterId,
        caseId: ctx.caseId,
        row: ctx.row,
        letter: ctx.row,
        savedRow: ctx.row,
        replies: ctx.replies,
        extensions: ctx.extensions,
        cacheInvalidation: cacheInvalidation || {},
        mode: written.isUpdate ? "update" : "append",
        primaryKey: "ลำดับเรื่อง",
        caseNum: ctx.caseNum,
        relationResolvedFrom: "case-sequence-p0-safety-baseline",
        perf: {
            owner: "saveLetter.fastDirectSheet.r90",
            durationMs: Date.now() - ctx.startedAt,
            serviceReads: storage.serviceReads,
            serviceWrites: 1,
            rowNumber: written.rowNumber
        }
    }, written.isUpdate ? "อัปเดตหนังสือติดตามสำเร็จ" : "บันทึกหนังสือติดตามสำเร็จ");
}

function _letterSavePrepareD_(input, p0Identity, startedAt) {
    input = input && typeof input === "object" ? input : {};
    var caseNum = p0Identity.caseNum;
    if (!caseNum)
        return { ok: !1, result: err_("ไม่พบลำดับเรื่องสำหรับหนังสือติดตาม", {
            primaryKey: "ลำดับเรื่อง",
            receivedCaseId: _s_(input.caseId || input.id).trim()
        }) };
    _caseApplySequenceIdentity_(input, caseNum, !1);
    var caseId = p0Identity.caseId;
    if (!caseId)
        return { ok: !1, result: err_("ไม่พบ caseId ของลำดับเรื่อง: " + caseNum) };
    var collections = _letterSaveCollectionsE_(input), now = new Date().toISOString(), built = _letterSaveBuildRowE_(input, caseNum, caseId, collections, now);
    return {
        ok: !0,
        owner: "LetterDomain.savePipelineE.r176",
        input: input,
        startedAt: startedAt,
        caseNum: caseNum,
        caseId: caseId,
        replies: collections.replies,
        extensions: collections.extensions,
        now: now,
        letterId: built.letterId,
        normalizedLetterNo: built.normalizedLetterNo,
        normalizedBookNo: built.normalizedBookNo,
        row: built.row,
        required: _letterSaveRequiredHeadersE_()
    };
}

function _letterSaveFindRowD_(ctx, sheet, index, lastRow) {
    var idCol = index.idx(["letterId", "id"]), caseCol = index.idx(["caseId"]), caseNumCol = index.idx(["caseNum", "caseNo", "runningNo", "ลำดับเรื่อง", "เลขลำดับเรื่อง", "ลำดับเรื่องพิจารณา", "เลขที่ลำดับเรื่อง", "หมายเลขลำดับเรื่อง"]), letterNoCol = index.idx(["letterNo", "bookNo"]), bookNoCol = index.idx(["bookNo", "letterNo"]), agencyCol = index.idx(["agency", "หน่วยงาน"]), deletedCol = index.idx(["isDeleted", "deleted"]), deletedAtCol = index.idx(["deletedAt"]), rowNumber = 0, serviceReads = 0;
    if (ctx.letterId && idCol >= 0) {
        var ids = _letterSaveColumnValuesD_(sheet, idCol, lastRow);
        serviceReads += ids.length ? 1 : 0;
        for (var i = 0; i < ids.length; i++)
            if (_letterSaveCleanD_(ids[i]) === ctx.letterId) {
                rowNumber = i + 2;
                break;
            }
    }
    if (!rowNumber && lastRow > 1 && (ctx.normalizedLetterNo || ctx.normalizedBookNo)) {
        var caseVals = _letterSaveColumnValuesD_(sheet, caseCol, lastRow), caseNumVals = _letterSaveColumnValuesD_(sheet, caseNumCol, lastRow), noVals = _letterSaveColumnValuesD_(sheet, letterNoCol, lastRow), bookVals = bookNoCol === letterNoCol ? noVals : _letterSaveColumnValuesD_(sheet, bookNoCol, lastRow), agencyVals = _letterSaveColumnValuesD_(sheet, agencyCol, lastRow), delVals = _letterSaveColumnValuesD_(sheet, deletedCol, lastRow), delAtVals = _letterSaveColumnValuesD_(sheet, deletedAtCol, lastRow);
        serviceReads += 1 + (caseNumCol >= 0 ? 1 : 0) + (bookNoCol === letterNoCol ? 0 : 1) + (agencyCol >= 0 ? 1 : 0) + (deletedCol >= 0 ? 1 : 0) + (deletedAtCol >= 0 ? 1 : 0);
        var legacyCandidateRows = [];
        for (var j = 0; j < caseVals.length; j++) {
            var deleted = deletedCol >= 0 && /^(true|1|yes|deleted|ลบ)$/i.test(_letterSaveCleanD_(delVals[j])) || deletedAtCol >= 0 && !!_letterSaveCleanD_(delAtVals[j]);
            if (deleted)
                continue;
            var storedCaseNum = _caseSequenceNormalizeStrict_(caseNumVals[j] || ""), storedCaseId = _letterSaveCleanD_(caseVals[j]), sameCase = storedCaseNum ? storedCaseNum === ctx.caseNum : !!(ctx.caseId && storedCaseId === ctx.caseId), no1 = _letterSaveCleanD_(noVals[j]), no2 = _letterSaveCleanD_(bookVals[j]), sameNo = ctx.normalizedLetterNo && (no1 === ctx.normalizedLetterNo || no2 === ctx.normalizedLetterNo) || ctx.normalizedBookNo && (no1 === ctx.normalizedBookNo || no2 === ctx.normalizedBookNo), sameAgency = !ctx.row.agency || !_letterSaveCleanD_(agencyVals[j]) || _letterSaveCleanD_(agencyVals[j]) === ctx.row.agency;
            if (sameCase && sameNo && sameAgency) {
                if (storedCaseNum) {
                    rowNumber = j + 2;
                    break;
                }
                legacyCandidateRows.push(j + 2);
            }
        }
        if (!rowNumber && legacyCandidateRows.length > 1) {
            var ambiguousLegacy = new Error("พบหนังสือติดตาม legacy มากกว่าหนึ่งรายการที่ตรงกัน ระบบยกเลิกการบันทึกเพื่อป้องกันการเขียนทับผิดรายการ");
            ambiguousLegacy.errorCode = "PRIMARY_KEY_LEGACY_RELATION_AMBIGUOUS";
            ambiguousLegacy.detail = {
                caseNum: ctx.caseNum,
                caseId: ctx.caseId,
                candidateRows: legacyCandidateRows.slice(0, 20)
            };
            throw ambiguousLegacy;
        }
        if (!rowNumber && legacyCandidateRows.length === 1)
            rowNumber = legacyCandidateRows[0];
    }
    return { rowNumber: rowNumber, serviceReads: serviceReads };
}

function _letterSavePersistD_(ctx) {
    var storage = _letterSaveStorageE_(ctx), written = _letterSaveApplyRowE_(ctx, storage);
    AppRepository.setRangeValues("Letters", written.rowNumber, 1, [written.values], { domain: "letters", invalidate: !1 });
    return _letterSaveResultE_(ctx, storage, written, _letterSaveInvalidateE_(written.rowNumber));
}

function saveLetter(payload) {
    return domainWrite_("saveLetter", payload, function (input) {
        input = input && typeof input === "object" ? input : {};
        var startedAt = Date.now(), p0Identity = _assertCaseWritePrimaryKeyConsistency_(input, "saveLetter"), ctx = _letterSavePrepareD_(input, p0Identity, startedAt);
        return ctx.ok ? _letterSavePersistD_(ctx) : ctx.result;
    });
}

function apiGetLetters(payload) {
    return TrackingDomain.getLetters(payload || {});
}

function apiSaveLetter(payload) {
    return writeGateway_("apiSaveLetter", payload || {}, function (input) {
        return TrackingDomain.saveLetter(input || {});
    }, "บันทึกหนังสือติดตามสำเร็จ", "บันทึกหนังสือติดตามไม่สำเร็จ");
}

function apiDeleteLetter(payload) {
    return writeGateway_("apiDeleteLetter", payload || {}, function (input) {
        return TrackingDomain.deleteLetter(input || {});
    }, "ลบหนังสือติดตามสำเร็จ", "ลบหนังสือติดตามไม่สำเร็จ");
}

function _trackingMaterializedIndexScope_(payload) {
    return ((payload = payload || {}),
        {
            stamp: TRACKING_MATERIALIZED_INDEX_STAMP,
            dateKey: _hotRouteDateKey_(),
            lettersStamp: _appIsFnName_("_entityCacheStamp_")
                ? String(_entityCacheStamp_("letters") || "1")
                : "1",
            caseStamp: _appIsFnName_("_entityCacheStamp_")
                ? String(_entityCacheStamp_("maindata") || "1")
                : "1",
        });
}

function _trackingMaterializedIndexKey_(payload) {
    return ("tracking_materialized_index_v2_" +
        _hotRouteDigest_(JSON.stringify(_trackingMaterializedIndexScope_(payload || {}))));
}

function _trackingIndexSearchText_(item) {
    return ((item = item || {}),
        [
            item.letterId,
            item.caseId,
            item.caseNum,
            item.recNo,
            item.caseTitle,
            item.title,
            item.letterNo,
            item.bookNo,
            item.agency,
            item.subject,
            item.issue,
            item.status,
            item.letterStatus,
            item.officer,
            item.opStaff,
            item.letterDate,
            item.dueDate,
            item.extendDate,
        ]
            .join(" ")
            .toLowerCase());
}

function _trackingPublicMaterializedItem_(item) {
    var out = {}, src = item || {};
    return (Object.keys(src).forEach(function (k) {
        String(k).substring(0, 2) !== "__" && (out[k] = src[k]);
    }),
        out);
}

function _trackingReadMaterializedIndex_(payload, guardApi) {
    payload = payload || {};
    var started = Date.now(), allowCache = payload.forceFresh !== !0 &&
        payload.noCache !== !0 &&
        payload.bypassCache !== !0, key = _trackingMaterializedIndexKey_(payload), cached = allowCache ? _hotRouteCacheGet_(key) : null;
    if (cached && _c30A_(cached.rows))
        return ((cached.cacheHit = !0),
            (cached.cacheStatus = String(cached.cacheStatus || "materialized-hit")),
            (cached.rowsRead = 0),
            (cached.durationMs = Math.max(0, Date.now() - started)),
            cached);
    if (allowCache && _appIsFnName_("_persistentSummarySnapshotRead_"))
        try {
            var persistent = _persistentSummarySnapshotRead_("tracking", JSON.stringify(_trackingMaterializedIndexScope_(payload)), "viewer", { requestId: payload.requestId || "" });
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
        catch (_trackingPersistentReadErr) {
            _c30W_("tracking.persistent.read", _trackingPersistentReadErr, { scope: _trackingMaterializedIndexScope_(payload) });
        }
    var trackingRepo = TrackingRepository_(), sourceRows = trackingRepo.listLetters(), caseMap = _trackingGetCaseMap_(trackingRepo, guardApi && guardApi.shouldYield, guardApi && guardApi.markPartial, payload.forceFresh === !0), today = new Date();
    today.setHours(0, 0, 0, 0);
    var normalizedItems = _trackingNormalizeRowsForServerPage_(sourceRows, caseMap, today, guardApi || {}).map(function (item) {
        return ((item = item || {}),
            (item.__searchText = _trackingIndexSearchText_(item)),
            item);
    }), model = {
        ok: !0,
        rows: normalizedItems,
        totalRecords: normalizedItems.length,
        source: "TrackingMaterializedIndex.v2",
        readModel: TRACKING_MATERIALIZED_INDEX_STAMP,
        cacheHit: !1,
        cacheStatus: allowCache ? "materialized-miss" : "materialized-bypass",
        cacheKey: key,
        rowsRead: _c30A_(sourceRows) ? sourceRows.length : normalizedItems.length,
        rowsReturned: normalizedItems.length,
        durationMs: Math.max(0, Date.now() - started),
        generatedAt: new Date().toISOString(),
        scope: _trackingMaterializedIndexScope_(payload),
        meta: {
            source: "TrackingMaterializedIndex.v2",
            readModelOwner: "Code_30_Domain_Cases.trackingMaterializedIndex",
            sourceOfTruth: "Letters+MainData",
            rowsRead: _c30A_(sourceRows)
                ? sourceRows.length
                : normalizedItems.length,
            rowsReturned: normalizedItems.length,
            uiDomChanged: !1,
            businessLogicChanged: !1,
        },
    };
    if (allowCache) {
        _hotRouteCachePut_(key, model, Math.max(300, Math.min(Number(payload.indexTtlSeconds || 21600) || 21600, 21600)));
        if (_appIsFnName_("_persistentSummarySnapshotWrite_"))
            try {
                var trackingStored = _persistentSummarySnapshotWrite_("tracking", JSON.stringify(_trackingMaterializedIndexScope_(payload)), "viewer", model, {
                    ttlSeconds: Math.max(300, Math.min(Number(payload.persistentTtlSeconds || 1800) || 1800, 3600)),
                    source: "tracking-materialized-live-r163"
                });
                model.persistentSnapshotStored = !!(trackingStored && trackingStored.stored);
            }
            catch (_trackingPersistentWriteErr) {
                _c30W_("tracking.persistent.write", _trackingPersistentWriteErr, { scope: _trackingMaterializedIndexScope_(payload) });
            }
    }
    return model;
}

function _trackingQueryMatchMapFromMaterialized_(query, items) {
    if (((query = _s_(query).trim().toLowerCase()), !query))
        return null;
    var tokens = query
        .split(/[^0-9a-zA-Zก-๙]+/)
        .map(function (x) {
        return _s_(x).trim();
    })
        .filter(Boolean), map = {};
    return ((_c30A_(items) ? items : []).forEach(function (item) {
        var text = String((item && item.__searchText) || _trackingIndexSearchText_(item)).toLowerCase(), hit = text.indexOf(query) > -1;
        (!hit &&
            tokens.length &&
            (hit = tokens.every(function (t) {
                return text.indexOf(t) > -1;
            })),
            hit && (map[_s_(item && item.letterId)] = 1));
    }),
        map);
}

function _trackingBuildServerPageDataFromMaterialized_(payload, guardApi) {
    var opts = _trackingRequestOptions_((payload = payload || {})), idx = _trackingReadMaterializedIndex_(payload, guardApi), normalizedItems = _c30A_(idx.rows) ? idx.rows : [], matchedLetterIds = _trackingQueryMatchMapFromMaterialized_(opts.query, normalizedItems), baseItems = _trackingApplyServerFilters_(normalizedItems, {
        query: opts.query,
        matchedLetterIds,
        statusFilter: opts.statusFilter,
        staffFilter: opts.staffFilter,
        agencyFilter: opts.agencyFilter,
        caseIdFilter: opts.caseIdFilter,
    }), statusCounts = _trackingBuildStatusCounts_(baseItems), items = baseItems.filter(function (item) {
        return (!opts.typeFilter ||
            opts.typeFilter === "all" ||
            _s_(item.filterKey) === opts.typeFilter);
    });
    return ((items = _trackingSortServerItems_(items, opts.sortBy, opts.sortDir).map(_trackingPublicMaterializedItem_)),
        {
            opts,
            rows: idx.cacheHit ? [] : normalizedItems,
            normalizedItems,
            baseItems,
            items,
            paged: _trackingPaginateServerItems_(items, payload),
            statusCounts,
            materializedIndex: idx,
        });
}

function _getTrackingMaterializedCore_(payload) {
    payload = payload || {};
    var guard = typeof createExecutionGuard_ == "function"
        ? createExecutionGuard_({
            label: "_getTrackingMaterializedCore_",
            route: "apiGetTracking",
            maxMs: Number(payload.hardLimitMs || 28e3) || 28e3,
            warningMs: Number(payload.softLimitMs || 24e3) || 24e3,
        })
        : null, guardApi = _trackingGuardAdapters_(guard);
    try {
        var out = _trackingBuildServerOutput_(payload, _trackingBuildServerPageDataFromMaterialized_(payload, guardApi), _trackingMaterializedIndexKey_(payload), guard), idx = (out && out.materializedIndex) || null;
        return ((out.readModel = TRACKING_MATERIALIZED_INDEX_STAMP),
            (out.materializedIndex = TRACKING_MATERIALIZED_INDEX_STAMP),
            (out.materializedIndexHit = !!(idx && idx.cacheHit)),
            (out.rowsRead =
                idx && idx.cacheHit
                    ? 0
                    : Number((idx && idx.rowsRead) || out.rowsRead || 0) || 0),
            (out.rowsReturned = _c30A_(out.rows) ? out.rows.length : 0),
            (out.cacheHit = !!(idx && idx.cacheHit)),
            (out.cacheStatus = String((idx && idx.cacheStatus) || out.cacheStatus || "materialized")),
            (out.meta = _appAssignObjects_({}, out.meta || {}, {
                source: "tracking-materialized-index-query",
                readModelOwner: "Code_30_Domain_Cases._getTrackingMaterializedCore_",
                materializedIndex: TRACKING_MATERIALIZED_INDEX_STAMP,
                materializedIndexHit: !!(idx && idx.cacheHit),
                rowsRead: out.rowsRead,
                rowsReturned: out.rowsReturned,
                cacheHit: out.cacheHit,
                cacheStatus: out.cacheStatus,
                uiDomChanged: !1,
                businessLogicChanged: !1,
            })),
            ok_(out, "โหลดข้อมูลติดตามหนังสือสำเร็จ"));
    }
    catch (e) {
        return (_recordWarning_("tracking.materialized.error", e),
            _getTrackingCore_(payload));
    }
}
