var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {}, AppAiGateway = __APP_GLOBAL__.AppAiGateway = __APP_GLOBAL__.AppAiGateway || {}, AI_GATEWAY_NORMALIZATION_STAMP = "ai-gateway-normalize-before-sheet-refactor-2026-06-15";
AppAiGateway.normalizeForSheet = AppAiGateway.normalizeForSheet || function (data, feature) {
    var src = data && typeof data == "object" && !Array.isArray(data) ? data : {}, out = {};
    return Object.keys(src).forEach(function (key) {
        var nk = String(key || "").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[\s\n\r\t\-–—_()（）\[\]{}:：\/\\.]+/g, "").toLowerCase(), v = src[key];
        if (!(v === void 0 || typeof v == "function")) {
            if (v && typeof v == "object" && !Array.isArray(v) && Object.prototype.toString.call(v) !== "[object Date]")
                try {
                    v = JSON.stringify(v);
                }
                catch (_e) {
                    v = String(v);
                }
            typeof v == "string" && (v = v.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim()), out[key] = v, nk && !Object.prototype.hasOwnProperty.call(out, nk) && (out[nk] = v);
        }
    }), out.aiNormalizedForSheet = !0, out.aiNormalizationStamp = AI_GATEWAY_NORMALIZATION_STAMP, out.aiFeature = String(feature || src.aiFeature || "ai"), out;
}, AppAiGateway.prepareSheetDto = AppAiGateway.prepareSheetDto || function (data, feature) {
    return {
        raw: data || {}, normalized: AppAiGateway.normalizeForSheet(data || {}, feature), stamp: AI_GATEWAY_NORMALIZATION_STAMP, feature: String(feature || "ai"), readyForSheet: !0
    };
};
AppAiGateway.VERSION = "ai-readonly-lazy-advisory-current", AppAiGateway.guard = AppAiGateway.guard || function (payload, feature) {
    return payload = payload || {}, (payload.initialLoad === !0 || payload.autoLoad === !0 || payload.pageLoad === !0 || payload.backgroundAuto === !0) && (payload.aiInitialLoadBlockedByRouter = !0), payload.aiAdvisoryOnly = !0, payload.aiNoDataMutation = !0, payload.aiReadOnly = !0, payload.aiFeature = String(feature || "ai"), payload;
}, AppAiGateway.envelope = AppAiGateway.envelope || function (result, feature) {
    return result = result || {}, result && typeof result == "object" && (result.aiProduction = {
        stamp: AppAiGateway.VERSION, feature: String(feature || ""), readOnly: !0, lazyOnly: !0, advisoryOnly: !0, noDataMutation: !0
    }, result.data && typeof result.data == "object" && (result.data.aiProduction = result.aiProduction)), result;
}, AppAiGateway.invoke = AppAiGateway.invoke || function (feature, payload, runner) {
    payload = AppAiGateway.guard(payload || {}, feature);
    var res = runner(payload);
    return AppAiGateway.envelope(res, feature);
}, AppAiGateway.publicApis = AppAiGateway.publicApis || Object.freeze([
    "apiAiAssistantAsk", "apiAiAssistantStartJob", "apiAiAssistantGetJob", "apiAiAssistantSummarizeCase", "apiSuggestCaseStatus", "apiSuggestCaseClassification", "apiSemanticSearch", "apiMeetingSmartSummary", "apiDraftReplyLetter", "apiExtractTrackingPdf", "apiExtractDocumentPdf", "apiGenerateExecutiveSummary", "apiPredictOverdueRisk", "apiPredictiveBudgeting", "apiAnalyzePersonnelWorkload", "apiAnalyzeWorkloadBottlenecks", "apiRecommendWorkloadDistribution", "apiCheckDuplicateCase", "apiDetectBudgetAnomalies", "apiGetDailyBriefing", "apiGenerateBudgetTrendSummary", "apiAiDashboardInsights", "apiExtractMeetingAgendaPdf", "apiChat"
]), AppAiGateway.routePolicy = AppAiGateway.routePolicy || Object.freeze({
    owner: "Code_22_AiGateway.gs", routerOwner: "Code_20_Router.gs", readOnly: !0, lazyOnly: !0, advisoryOnly: !0, noDataMutation: !0, initialLoadAllowed: !1, requiresUserAction: !0, quotaRequired: !0, structuredError: !0
}), AppAiGateway.isPublicApi = AppAiGateway.isPublicApi || function (name) {
    return AppAiGateway.publicApis.indexOf(String(name || "")) >= 0;
}, AppAiGateway.safePayload = AppAiGateway.safePayload || function (payload, feature) {
    return payload = AppAiGateway.guard(payload || {}, feature), payload.aiGatewayOwner = "Code_22_AiGateway.gs", payload.aiGatewayPolicy = AppAiGateway.routePolicy, payload;
}, AppAiGateway.safeError = AppAiGateway.safeError || function (err, feature) {
    var msg = typeof _aiUserFacingError_ == "function" ? _aiUserFacingError_(err) : String(err && err.message || err || "AI วิเคราะห์ไม่สำเร็จ");
    return typeof _recordWarning_ == "function" && _recordWarning_("ai.gateway." + String(feature || "unknown") + ".structuredError", err), err_(msg, {
        aiProduction: AppAiGateway.routePolicy, feature: String(feature || "ai"), errorCode: String(err && (err.errorCode || err.code) || "AI_GATEWAY_ERROR")
    });
};
function _aiNormalizeCaseStatus_(value, options) {
    if (options = options || {}, typeof AppBackendCore != "undefined" && AppBackendCore && typeof AppBackendCore.normalizeCaseStatus == "function")
        return AppBackendCore.normalizeCaseStatus(value, {
            defaultStatus: String(options.defaultStatus || "เรื่องเข้าใหม่"), strict: options.strict === !0
        });
    var raw = String(value || "").trim();
    return raw ? raw === "รับเรื่อง" || raw === "ได้รับเรื่อง" || raw === "เรื่องใหม่" ? "เรื่องเข้าใหม่" : raw === "อยู่ระหว่างดำเนินการ" || raw === "รอติดตาม" ? "รอพิจารณา" : raw : String(options.defaultStatus || "เรื่องเข้าใหม่");
}
function _aiIsOpenCaseStatus_(value) {
    return typeof AppBackendCore != "undefined" && AppBackendCore && typeof AppBackendCore.isOpenCaseStatus == "function" ? AppBackendCore.isOpenCaseStatus(value) : [
        "ไม่รับเรื่อง", "ยุติเรื่อง", "จัดทำรายงาน"
    ].indexOf(_aiNormalizeCaseStatus_(value)) < 0;
}
function _aiCanonicalizeStatusResult_(result, fallbackStatus) {
    result = result && typeof result == "object" && !Array.isArray(result) ? result : {};
    var raw = String(result.status || fallbackStatus || "เรื่องเข้าใหม่").trim();
    return result.statusRaw = raw, result.status = _aiNormalizeCaseStatus_(raw, {
        defaultStatus: String(fallbackStatus || "เรื่องเข้าใหม่")
    }), result;
}
function _aiGatewayEnabled_() {
    return _appIsFnName_("_scriptPropBool_") ? _scriptPropBool_("AI_GATEWAY_ENABLED", !0) : !0;
}
var AI_PRODUCTION_OWNER_VERSION = "ai-production-lazy-advisory-no-write-current";
function _aiProductionPolicy_() {
    return {
        ok: !0, stamp: AI_PRODUCTION_OWNER_VERSION, owner: "Code_22_AiGateway.gs", mode: "lazy-user-action-advisory-no-write", productionMode: "lazy-user-action-advisory-no-write", lazyOnly: !0, advisoryOnly: !0, noDataMutation: !0, initialLoadAllowed: !1, sourceOfTruth: "system-data-read-only", routeOwner: "Code_20_Router.gs", gateway: "Gemini via cached gateway", requiresUserAction: !0, mutationPolicy: "forbid-data-mutation"
    };
}
function _aiIsInitialLoadPayload_(payload) {
    if (payload = payload || {}, !payload || typeof payload != "object" || Array.isArray(payload))
        return !1;
    if (payload.initialLoad === !0 || payload.autoLoad === !0 || payload.pageLoad === !0 || payload.backgroundAuto === !0 || payload.aiInitialLoadBlockedByRouter === !0)
        return !0;
    var src = String(payload.source || payload.requestSource || payload.trigger || "").toLowerCase();
    return /initial|autoload|page-load|boot|dashboard-fast-first-paint|first-paint/.test(src);
}
function _aiAdvisoryMeta_(feature) {
    var p = _aiProductionPolicy_();
    return {
        owner: p.owner, stamp: p.stamp, feature: String(feature || ""), mode: p.mode, lazyOnly: !0, advisoryOnly: !0, noDataMutation: !0, initialLoadAllowed: !1
    };
}
function _aiWithAdvisoryMeta_(data, feature) {
    var out = data && typeof data == "object" && !Array.isArray(data) ? data : {};
    return out.aiProduction = Object.assign({}, _aiAdvisoryMeta_(feature || out.aiFeature || "ai"), out.aiProduction || {}), out;
}
function _aiLazyDeferredResult_(feature, message) {
    return ok_(_aiWithAdvisoryMeta_({
        deferred: !0, aiDeferred: !0, feature: String(feature || "ai"), reason: "AI_INITIAL_LOAD_BLOCKED_USE_USER_ACTION"
    }, feature), message || "เลื่อนการประมวลผล AI เป็น lazy load เพื่อไม่ให้กระทบการโหลดหน้าหลัก");
}
function _aiAssertLazyInvocation_(payload, feature) {
    if (_aiIsInitialLoadPayload_(payload)) {
        var e = new Error("AI_LAZY_INITIAL_LOAD_BLOCKED: AI ต้องถูกเรียกแบบ lazy/user action เท่านั้น");
        throw e.errorCode = "AI_LAZY_INITIAL_LOAD_BLOCKED", e.feature = String(feature || "ai"), e;
    }
    return !0;
}
function _aiOk_(data, msg, feature) {
    var normalized = AppAiGateway.prepareSheetDto(data || {}, feature);
    return ok_(_aiWithAdvisoryMeta_(Object.assign({}, data || {}, {
        aiSheetDto: normalized
    }), feature), msg || "ประมวลผล AI สำเร็จ");
}
function _aiGatewayMaxPromptChars_() {
    return _appIsFnName_("_scriptPropNumber_") ? _scriptPropNumber_("AI_GATEWAY_MAX_PROMPT_CHARS", 24e3, 1e3, 12e4) : 24e3;
}
function _aiGatewayMaxPdfBytes_() {
    return _appIsFnName_("_scriptPropNumber_") ? _scriptPropNumber_("AI_GATEWAY_MAX_PDF_BYTES", 6291456, 262144, 10485760) : 6291456;
}
function _assertAiGatewayAllowed_(mode, value, feature) {
    if (!_aiGatewayEnabled_())
        throw new Error("AI gateway ถูกปิดในระบบ");
    var textValue = String(value || "");
    if (mode === "pdf") {
        var approxBytes = Math.ceil(textValue.length * 3 / 4);
        if (approxBytes > _aiGatewayMaxPdfBytes_())
            throw new Error("ไฟล์ PDF มีขนาดใหญ่เกินกำหนดสำหรับ AI gateway");
    }
    else if (textValue.length > _aiGatewayMaxPromptChars_())
        throw new Error("ข้อความสำหรับ AI gateway ยาวเกินกำหนด");
    if (_appIsFnName_("_assertTrustedExternalUrl_")) {
        var ep = mode === "embed" && typeof GEMINI_EMBED_EP != "undefined" ? GEMINI_EMBED_EP : _appIsFnName_("_buildGeminiEndpoint_") ? _buildGeminiEndpoint_() : "";
        _assertTrustedExternalUrl_(ep, feature || "ai." + mode);
    }
    return !0;
}
function parseGeminiJsonText_(txt, defaultValue) {
    if (defaultValue = defaultValue || {}, !txt)
        return defaultValue;
    var cleaned = String(txt).trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    try {
        return JSON.parse(cleaned);
    }
    catch (e) {
        var match = cleaned.match(/\{[\s\S]*\}/);
        if (match)
            try {
                return JSON.parse(match[0]);
            }
            catch (_e) {
                _appIsFnName_("_recordWarning_") && _recordWarning_("ai.silent.code_40_ai_services.001", _e);
            }
    }
    return defaultValue;
}
function _aiIsQuotaOrLargeDataError_(err) {
    var msg = String(err && err.message || err || "").toLowerCase();
    return msg.indexOf("429") !== -1 || msg.indexOf("quota") !== -1 || msg.indexOf("rate limit") !== -1 || msg.indexOf("too many") !== -1;
}
function _aiUserFacingError_(err) {
    var msg = String(err && err.message || err || "").trim(), low = msg.toLowerCase();
    return msg ? low.indexOf("gemini_api_key") !== -1 || low.indexOf("api key") !== -1 || low.indexOf("key not valid") !== -1 ? "ยังไม่ได้ตั้งค่า GEMINI_API_KEY หรือ API Key ไม่ถูกต้อง กรุณาตั้งค่าใน Script Properties แล้วลองใหม่" : low.indexOf("403") !== -1 || low.indexOf("permission") !== -1 || low.indexOf("forbidden") !== -1 ? "บัญชี/API Key ไม่มีสิทธิ์เรียกใช้ Gemini API กรุณาตรวจสอบสิทธิ์และ billing/project" : low.indexOf("404") !== -1 || low.indexOf("model") !== -1 ? "ไม่พบโมเดล Gemini ที่ตั้งค่าไว้ กรุณาตรวจ GEMINI_MODEL เช่น gemini-2.0-flash" : _aiIsQuotaOrLargeDataError_(err) ? "กรุณาลองใหม่อีกครั้ง เนื่องจากโควตา AI เต็มหรือข้อมูลมีจำนวนมาก" : low.indexOf("ยาวเกิน") !== -1 || low.indexOf("too large") !== -1 || low.indexOf("ขนาดใหญ่") !== -1 ? "ข้อมูลที่ส่งให้ AI มีขนาดใหญ่เกินกำหนด กรุณาลดจำนวนข้อมูลหรือเลือกช่วงข้อมูลให้แคบลง" : msg : "AI วิเคราะห์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
}
function buildAiCacheKey_(mode, text, rows) {
    mode = String(mode || "default").toLowerCase(), text = String(text || "").replace(/\s+/g, " ").trim(), rows = Array.isArray(rows) ? rows : [];
    var payload = mode + "|" + text.substring(0, 1200) + "|" + _safeJsonStringify_(rows.slice(0, 30)), digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payload, Utilities.Charset.UTF_8), hash = digest.map(function (b) {
        var v = (b < 0 ? b + 256 : b).toString(16);
        return v.length === 1 ? "0" + v : v;
    }).join("");
    return "ai_" + mode + "_" + hash.substring(0, 32);
}
function _redactSensitiveAiText_(value) {
    return value = String(value || ""), value = value.replace(/\b\d{13}\b/g, "[REDACTED-ID]"), value = value.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig, "[REDACTED-EMAIL]"), value = value.replace(/(?:\+?66|0)\d{8,9}/g, "[REDACTED-PHONE]"), value;
}
function _aiLocalRuleResultEnabled_() {
    return _appIsFnName_("_scriptPropBool_") ? _scriptPropBool_("AI_LOCAL_DEFAULT_ENABLED", !0) : !0;
}
function _aiJsonParse_(raw, defaultValue) {
    if (defaultValue = defaultValue || {}, typeof parseGeminiJsonText_ == "function") {
        var parsed = parseGeminiJsonText_(raw, defaultValue);
        if (parsed && typeof parsed == "object")
            return parsed;
    }
    try {
        return JSON.parse(String(raw || "").replace(/```json|```/g, "").trim());
    }
    catch (_jsonErr) {
        return defaultValue;
    }
}

function _aiExtractTextValue_(value) {
    if (value == null)
        return "";
    if (Array.isArray(value))
        return value.map(_aiExtractTextValue_).filter(Boolean).join(", ").trim();
    if (typeof value == "object") {
        var objectKeys = ["name", "fullName", "title", "text", "value", "label", "subject"];
        for (var i = 0; i < objectKeys.length; i++) {
            var nested = _aiExtractTextValue_(value[objectKeys[i]]);
            if (nested)
                return nested;
        }
        return "";
    }
    return String(value).replace(/\s+/g, " ").trim();
}
function _aiExtractPickText_(source, aliases) {
    source = source && typeof source == "object" ? source : {};
    aliases = Array.isArray(aliases) ? aliases : [];
    for (var i = 0; i < aliases.length; i++) {
        var key = aliases[i];
        if (!Object.prototype.hasOwnProperty.call(source, key))
            continue;
        var text = _aiExtractTextValue_(source[key]);
        if (text)
            return text;
    }
    return "";
}
function _aiExtractPayloadScore_(source) {
    if (!source || typeof source != "object")
        return 0;
    var keys = [
        "title", "subject", "caseTitle", "documentTitle", "ชื่อเรื่อง", "เรื่อง",
        "petitioner", "petitioners", "proposer", "requester", "complainant", "ผู้เสนอญัตติ", "ผู้ร้อง",
        "respondent", "agency", "agencyName", "organization", "ผู้ถูกร้อง", "หน่วยงาน",
        "summary", "abstract", "synopsis", "keySummary", "สรุป", "สรุปเรื่อง",
        "bookNo", "bookNumber", "เลขที่หนังสือ", "dueDate"
    ], score = 0;
    keys.forEach(function (key) {
        _aiExtractTextValue_(source[key]) && score++;
    });
    return score;
}
function _aiExtractUnwrapPayload_(parsed) {
    var current = parsed, best = parsed && typeof parsed == "object" ? parsed : {}, bestScore = _aiExtractPayloadScore_(best), wrappers = [
        "data", "result", "document", "extracted", "extraction", "fields", "payload", "output", "response"
    ];
    for (var depth = 0; depth < 5; depth++) {
        if (Array.isArray(current))
            current = current.length ? current[0] : {};
        if (!current || typeof current != "object")
            break;
        var currentScore = _aiExtractPayloadScore_(current);
        if (currentScore > bestScore)
            best = current, bestScore = currentScore;
        var next = null;
        for (var i = 0; i < wrappers.length; i++) {
            var candidate = current[wrappers[i]];
            if (candidate && typeof candidate == "object") {
                next = candidate;
                break;
            }
        }
        if (!next)
            break;
        current = next;
    }
    return best && typeof best == "object" ? best : {};
}
function _normalizeAiDocumentPdfResult_(parsed, mode) {
    var source = _aiExtractUnwrapPayload_(parsed), out = {
        title: _aiExtractPickText_(source, [
            "title", "subject", "caseTitle", "documentTitle", "caseSubject", "matter", "topic",
            "ชื่อเรื่อง", "เรื่อง", "เรื่องพิจารณา", "หัวข้อ"
        ]),
        petitioner: _aiExtractPickText_(source, [
            "petitioner", "petitioners", "petitionerName", "proposer", "proposerName", "motionProposer",
            "requester", "complainant", "submittedBy", "ผู้เสนอญัตติ", "ชื่อผู้เสนอญัตติ", "ผู้ร้อง",
            "ผู้ร้องเรียน", "ผู้เสนอ", "ผู้ยื่นญัตติ", "ผู้เสนอญัตติ/ผู้ร้อง"
        ]),
        respondent: _aiExtractPickText_(source, [
            "respondent", "respondentName", "respondentAgency", "targetAgency", "agency", "agencyName", "department", "office", "organization", "organizationName",
            "addressee", "recipient", "หน่วยงาน", "ชื่อหน่วยงาน", "หน่วยงานที่เกี่ยวข้อง", "ผู้ถูกร้อง", "หน่วยงาน/ผู้ถูกร้อง"
        ]),
        summary: _aiExtractPickText_(source, [
            "summary", "abstract", "synopsis", "description", "keySummary", "details", "contentSummary",
            "สรุป", "สรุปเรื่อง", "สาระสำคัญ", "รายละเอียด", "ข้อสรุป"
        ]),
        bookNo: _aiExtractPickText_(source, [
            "bookNo", "bookNumber", "documentNo", "letterNo", "referenceNo", "เลขที่หนังสือ", "เลขหนังสือ"
        ]),
        agency: _aiExtractPickText_(source, [
            "agency", "agencyName", "organization", "organizationName", "senderAgency", "หน่วยงาน", "ชื่อหน่วยงาน"
        ]),
        dueDate: _aiExtractPickText_(source, [
            "dueDate", "deadline", "deadlineDate", "ครบกำหนด", "วันครบกำหนด"
        ])
    };
    if (!out.respondent && out.agency)
        out.respondent = out.agency;
    if (!out.agency && out.respondent)
        out.agency = out.respondent;
    var fields = mode === "case" ? ["title", "petitioner", "respondent", "summary"] : ["bookNo", "agency", "title", "dueDate"], count = 0;
    fields.forEach(function (key) {
        out[key] && count++;
    });
    out.extractedFieldCount = count;
    out.extractionMode = String(mode || "letter");
    out.hasExtractedData = count > 0;
    return out;
}
function _assertAiPdfExtractionResult_(result, mode) {
    if (result && result.hasExtractedData)
        return result;
    throw new Error(mode === "case" ? "AI อ่านเอกสารสำเร็จแต่ไม่พบชื่อเรื่อง ผู้เสนอญัตติ/ผู้ร้อง หน่วยงาน หรือสรุป กรุณาตรวจสอบว่า PDF มีข้อความชัดเจนแล้วลองใหม่" : "AI อ่านหนังสือสำเร็จแต่ไม่พบเลขที่หนังสือ หน่วยงาน เรื่อง หรือวันครบกำหนด กรุณาตรวจสอบ PDF แล้วลองใหม่");
}

function _aiLocalPersonnelReport_(info) {
    info = info || {};
    var lines = [];
    return lines.push("สรุปภาระงานของ " + String(info.personName || "บุคลากร") + " จากข้อมูลในระบบ"), lines.push("มีเรื่องพิจารณาที่เกี่ยวข้อง " + Number(info.totalCases || 0).toLocaleString("th-TH") + " เรื่อง และหนังสือที่เกี่ยวข้อง " + Number(info.totalLetters || 0).toLocaleString("th-TH") + " ฉบับ"), lines.push("หนังสือเลยกำหนด " + Number(info.overdueLetters || 0).toLocaleString("th-TH") + " ฉบับ และใกล้ครบกำหนด " + Number(info.soonLetters || 0).toLocaleString("th-TH") + " ฉบับ"), lines.push("ระดับความเสี่ยงประเมินเป็น " + String(info.riskLevel || "ต่ำ") + " (Risk Score " + Number(info.riskScore || 0) + "/100)"), Number(info.overdueLetters || 0) > 0 ? lines.push("ข้อเสนอแนะ: เร่งติดตามหนังสือที่เลยกำหนดก่อน และจัดลำดับงานตามวันครบกำหนด") : Number(info.soonLetters || 0) > 0 ? lines.push("ข้อเสนอแนะ: ตรวจรายการใกล้ครบกำหนดภายใน 7 วันและกำหนดผู้รับผิดชอบให้ชัดเจน") : lines.push("ข้อเสนอแนะ: ติดตามภาระงานตามรอบปกติ และทบทวนงานค้างทุกสัปดาห์"), lines.join(`
`);
}
function _aiLocalDuplicateCheck_(newTitle, allTitles) {
    newTitle = String(newTitle || "").trim(), allTitles = Array.isArray(allTitles) ? allTitles : [];
    function aiLocalTitleNorm_(v) {
        return String(v || "").toLowerCase().replace(/\s+/g, " ").trim();
    }
    function tokens(v) {
        var seen = {};
        return aiLocalTitleNorm_(v).split(/[^0-9a-zA-Zก-๙]+/).filter(function (x) {
            return !x || seen[x] ? !1 : (seen[x] = 1, !0);
        });
    }
    var target = aiLocalTitleNorm_(newTitle), targetTokens = tokens(newTitle), best = {
        title: "", score: 0, exact: !1
    };
    return allTitles.forEach(function (title) {
        var n = aiLocalTitleNorm_(title), score = 0;
        if (n && n === target)
            score = 1;
        else if (n && (n.indexOf(target) !== -1 || target.indexOf(n) !== -1))
            score = .9;
        else {
            var other = tokens(title), hit = 0;
            targetTokens.forEach(function (t) {
                other.indexOf(t) !== -1 && hit++;
            }), score = targetTokens.length ? hit / targetTokens.length : 0;
        }
        score > best.score && (best = {
            title: String(title || ""), score, exact: score >= 1
        });
    }), {
        isDuplicate: best.score >= .75, reason: best.score >= .75 ? "พบชื่อเรื่องเดิมหรือข้อความใกล้เคียงในระบบจากการตรวจแบบ local rule-based result" : "ไม่พบชื่อเรื่องซ้ำจากการตรวจแบบ local rule-based result", matchedTitle: best.score >= .75 ? best.title : "", similarity: Number(best.score.toFixed(2)), source: "local-rule-result"
    };
}
function _aiBudgetAnomalyLocal_(rows, fy) {
    rows = Array.isArray(rows) ? rows : [];
    var amounts = rows.map(function (r) {
        return Number(r.amount || r.budget || r.budgetAmount || r.totalAmount || 0);
    }).filter(function (n) {
        return isFinite(n) && n > 0;
    });
    if (!amounts.length)
        return {
            anomalies: [], summary: "ไม่มีข้อมูลงบประมาณสำหรับวิเคราะห์", avgAmount: 0, stdAmount: 0, usedLocalResult: !0
        };
    var sum = amounts.reduce(function (a, b) {
        return a + b;
    }, 0), avg = sum / amounts.length, variance = amounts.reduce(function (a, b) {
        return a + Math.pow(b - avg, 2);
    }, 0) / amounts.length, std = Math.sqrt(variance), threshold = avg + std * 2, anomalies = rows.map(function (r) {
        var amount = Number(r.amount || r.budget || r.budgetAmount || r.totalAmount || 0);
        return {
            row: r, amount
        };
    }).filter(function (x) {
        return x.amount > threshold && x.amount > 0;
    }).sort(function (a, b) {
        return b.amount - a.amount;
    }).slice(0, 10).map(function (x) {
        var r = x.row || {};
        return {
            id: r.id || r.importId || "", type: r.entryType || r.type || r.category || r.item || "รายการงบประมาณ", amount: x.amount, reason: "จำนวนเงินสูงกว่าค่าเฉลี่ยมากกว่าประมาณ 2 SD"
        };
    }), summary = anomalies.length ? "พบรายการที่ควรตรวจสอบ " + anomalies.length + " รายการ จากข้อมูล " + rows.length + " รายการ ค่าเฉลี่ยประมาณ " + Math.round(avg).toLocaleString("th-TH") + " บาท ควรตรวจรายการวงเงินสูงผิดปกติและเอกสารประกอบก่อนอนุมัติ" : "ไม่พบรายการงบประมาณที่ผิดปกติเด่นชัดจากข้อมูล " + rows.length + " รายการ ค่าเฉลี่ยประมาณ " + Math.round(avg).toLocaleString("th-TH") + " บาท";
    return {
        fy: String(fy || ""), anomalies, summary, avgAmount: Math.round(avg), stdAmount: Math.round(std), usedLocalResult: !0
    };
}
function _aiGatewayPerUserQuotaPerHour_() {
    var raw = _appIsFnName_("_getScriptPropertyNumberCached_") ? _getScriptPropertyNumberCached_("AI_GATEWAY_PER_USER_QUOTA_PER_HOUR", 24, 3e5) : Number(_scriptProp_("AI_GATEWAY_PER_USER_QUOTA_PER_HOUR", 24) || 24);
    return isFinite(raw) && raw > 0 ? raw : 24;
}
function _aiQuotaCache_() {
    return _AppScriptCache_();
}
function _aiQuotaHourBucket_(when) {
    return Utilities.formatDate(when || new Date, Session.getScriptTimeZone() || "Asia/Bangkok", "yyyyMMddHH");
}
function _aiQuotaCacheTtlSeconds_(when) {
    var now = when || new Date, ttl = Math.ceil((60 - Number(now.getMinutes() || 0)) * 60 - Number(now.getSeconds() || 0) + 300);
    return Math.max(300, Math.min(7200, ttl));
}
function _aiQuotaArchiveCleanup_() {
    try {
        if (typeof __APP_EXEC_CACHE__ != "undefined" && __APP_EXEC_CACHE__ && __APP_EXEC_CACHE__.aiQuotaArchiveCleanupAt && Date.now() - __APP_EXEC_CACHE__.aiQuotaArchiveCleanupAt < 6e4)
            return !1;
        var props = PropertiesService.getScriptProperties(), markerKey = "AI_GATEWAY_ARCHIVED_BUCKETS_CLEANED_AT", nowMs = Date.now(), lastMs = Number((_appIsFnName_("_runtimeStateGet_") ? _runtimeStateGet_(markerKey, "") : "") || (_appIsFnName_("_scriptProp_") ? _scriptProp_(markerKey, 0) : 0) || 0) || 0;
        if (lastMs && nowMs - lastMs < 360 * 60 * 1e3)
            return !1;
        var keep = {}, now = new Date, prev = new Date(now.getTime() - 3600 * 1e3);
        keep["AI_GATEWAY_BUCKET_" + _aiQuotaHourBucket_(now)] = !0, keep["AI_GATEWAY_BUCKET_" + _aiQuotaHourBucket_(prev)] = !0;
        var all = props.getProperties() || {};
        return Object.keys(all).forEach(function (key) {
            if (/^AI_GATEWAY_(?:USER_)?BUCKET_/.test(String(key || "")) && !keep[key])
                try {
                    _appIsFnName_("_deleteScriptProp_") && _deleteScriptProp_(key, {
                        owner: "_aiQuotaArchiveCleanup_", telemetry: "setup-unlocked"
                    });
                }
                catch (_cleanupErr) {
                    _appIsFnName_("_recordWarning_") && _recordWarning_("ai.silent.code_40_ai_services.002", _cleanupErr);
                }
        }), _appIsFnName_("_runtimeStateSet_") && _runtimeStateSet_(markerKey, String(nowMs), 21600), typeof __APP_EXEC_CACHE__ != "undefined" && __APP_EXEC_CACHE__ && (__APP_EXEC_CACHE__.aiQuotaArchiveCleanupAt = nowMs), !0;
    }
    catch (_e) {
        return _recordWarning_("current.silent.code.40.ai.001", _e), _appIsFnName_("_logWarn_") && _logWarn_("ai.archiveCleanup", {
            error: String(_e && _e.message || _e)
        }), !1;
    }
}
function _aiQuotaIncrementOrThrow_(key, limit, message) {
    if (key = String(key || "").trim(), limit = Number(limit || 0) || 0, !key || limit <= 0)
        return 0;
    var lock = LockService.getScriptLock();
    lock.waitLock(5e3);
    try {
        var cache = _aiQuotaCache_(), used = Number(cache.get(key) || 0) || 0;
        if (used >= limit)
            throw new Error(String(message || "AI quota เต็ม"));
        return cache.put(key, String(used + 1), _aiQuotaCacheTtlSeconds_(new Date)), used + 1;
    }
    finally {
        try {
            lock.releaseLock();
        }
        catch (_eRelease) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("ai.silent.code_40_ai_services.003", _eRelease);
        }
    }
}
function _aiGatewayCheckUserQuota_(username) {
    if (username = String(username || "").trim().toLowerCase(), !!username) {
        var bucket = _aiQuotaHourBucket_(new Date), key = "AI_GATEWAY_USER_BUCKET_" + _appSha256Hex_(username).substring(0, 20) + "_" + bucket;
        _aiQuotaIncrementOrThrow_(key, _aiGatewayPerUserQuotaPerHour_(), "โควตา AI ของผู้ใช้งานรายนี้เต็มในชั่วโมงนี้"), _aiQuotaArchiveCleanup_();
    }
}
function _aiGatewayQuotaPerHour_() {
    var raw = _appIsFnName_("_getScriptPropertyNumberCached_") ? _getScriptPropertyNumberCached_("AI_GATEWAY_QUOTA_PER_HOUR", 120, 3e5) : Number(_scriptProp_("AI_GATEWAY_QUOTA_PER_HOUR", 120) || 120);
    return isFinite(raw) && raw > 0 ? raw : 120;
}
function _aiGatewayCheckQuota_() {
    var bucket = _aiQuotaHourBucket_(new Date), key = "AI_GATEWAY_BUCKET_" + bucket;
    _aiQuotaIncrementOrThrow_(key, _aiGatewayQuotaPerHour_(), "AI gateway quota เต็มในชั่วโมงนี้"), _aiQuotaArchiveCleanup_();
}
function _safeAiGatewayAudit_(detail) {
    detail = detail || {};
    try {
        var policy = _appIsFnName_("_aiProductionPolicy_") ? _aiProductionPolicy_() : {};
        detail.owner = detail.owner || policy.owner || "Code_20_Router.gs", detail.stamp = detail.stamp || policy.stamp || AI_PRODUCTION_OWNER_VERSION, detail.lazyOnly = detail.lazyOnly !== !1, detail.advisoryOnly = detail.advisoryOnly !== !1, detail.noDataMutation = detail.noDataMutation !== !1, typeof logAudit_ == "function" && logAudit_("ai.gateway", detail || {});
    }
    catch (_e) {
        _recordWarning_("current.silent.code.40.ai.002", _e), _appIsFnName_("_logWarn_") && _logWarn_("ai.audit", {
            error: String(_e && _e.message || _e)
        });
    }
}
function _runAiGatewayText_(promptText, config, meta) {
    meta = meta || {}, _assertAiGatewayAllowed_("text", promptText, meta.feature || "gemini.generateContent"), _aiGatewayCheckQuota_();
    var safePrompt = _redactSensitiveAiText_(promptText), startedAt = Date.now();
    try {
        var result = _callGeminiRaw_(safePrompt, config || {});
        return _safeAiGatewayAudit_({
            mode: "text", feature: meta.feature || "", ok: !0, latencyMs: Date.now() - startedAt, requestId: meta.requestId || ""
        }), result;
    }
    catch (e) {
        if (_recordWarning_("current.silent.code.40.ai.003", e), _safeAiGatewayAudit_({
            mode: "text", feature: meta.feature || "", ok: !1, latencyMs: Date.now() - startedAt, requestId: meta.requestId || "", error: String(e && e.message || e).substring(0, 180)
        }), meta && meta.defaultText)
            return String(meta.defaultText);
        throw e;
    }
}
function _runAiGatewayPdf_(b64, promptText, meta) {
    meta = meta || {}, _assertAiGatewayAllowed_("pdf", b64, meta.feature || "gemini.pdf"), _aiGatewayCheckQuota_();
    var safePrompt = _redactSensitiveAiText_(promptText), startedAt = Date.now();
    try {
        var result = _callGeminiWithPdfRaw_(b64, safePrompt, meta || {});
        return _safeAiGatewayAudit_({
            mode: "pdf", feature: meta.feature || "", ok: !0, latencyMs: Date.now() - startedAt, requestId: meta.requestId || ""
        }), result;
    }
    catch (e) {
        throw _recordWarning_("current.silent.code.40.ai.004", e), _safeAiGatewayAudit_({
            mode: "pdf", feature: meta.feature || "", ok: !1, latencyMs: Date.now() - startedAt, requestId: meta.requestId || "", error: String(e && e.message || e).substring(0, 180)
        }), e;
    }
}
function _runAiGatewayEmbed_(text, meta) {
    meta = meta || {}, _assertAiGatewayAllowed_("embed", text, meta.feature || "gemini.embed"), _aiGatewayCheckQuota_();
    var startedAt = Date.now();
    try {
        var result = _callGeminiEmbedRaw_(_redactSensitiveAiText_(text));
        return _safeAiGatewayAudit_({
            mode: "embed", feature: meta.feature || "", ok: !0, latencyMs: Date.now() - startedAt, requestId: meta.requestId || ""
        }), result;
    }
    catch (e) {
        throw _recordWarning_("current.silent.code.40.ai.005", e), _safeAiGatewayAudit_({
            mode: "embed", feature: meta.feature || "", ok: !1, latencyMs: Date.now() - startedAt, requestId: meta.requestId || "", error: String(e && e.message || e).substring(0, 180)
        }), e;
    }
}
function _callGeminiRaw_(promptText, config) {
    _assertAiGatewayAllowed_("text", promptText, "gemini.generateContent");
    var key = _getGeminiKey_();
    if (!key)
        throw new Error("ยังไม่ได้ตั้งค่า GEMINI_API_KEY");
    config = config || {};
    var req = {
        contents: [
            {
                parts: [
                    {
                        text: promptText
                    }
                ]
            }
        ], generationConfig: {
            temperature: config.temperature || .3, topP: config.topP || .9, maxOutputTokens: config.maxOutputTokens || 1024
        }
    }, resp = UrlFetchApp.fetch(_buildGeminiEndpoint_() + encodeURIComponent(key), {
        method: "POST", contentType: "application/json", payload: JSON.stringify(req), muteHttpExceptions: !0
    });
    if (resp.getResponseCode() !== 200)
        throw resp.getResponseCode() === 429 ? new Error("กรุณาลองใหม่อีกครั้ง เนื่องจากข้อมูลมีจำนวนมาก") : new Error("Gemini HTTP " + resp.getResponseCode() + ": " + resp.getContentText().substring(0, 200));
    var j = JSON.parse(resp.getContentText());
    try {
        return (j.candidates[0].content.parts[0].text || "").trim();
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.006", e), "";
    }
}
function _sanitizeAiBase64_(value) {
    var raw = String(value || "").trim(), comma = raw.indexOf(",");
    if (/^data:/i.test(raw) && comma > -1 && (raw = raw.substring(comma + 1)), raw = raw.replace(/\s+/g, ""), !raw)
        throw new Error("ไม่พบข้อมูล base64");
    if (!/^[A-Za-z0-9+/=]+$/.test(raw))
        throw new Error("ข้อมูล PDF base64 ไม่ถูกต้อง");
    return raw;
}
function _extractGeminiText_(j) {
    j = j || {};
    var cand = j.candidates && j.candidates[0] || {}, parts = cand.content && cand.content.parts || [], out = [];
    if (parts.forEach(function (part) {
        part && part.text != null && out.push(String(part.text));
    }), out.join("").trim())
        return out.join(`
`).trim();
    throw cand.finishReason && cand.finishReason !== "STOP" ? new Error("Gemini no result: finishReason=" + cand.finishReason) : new Error("Gemini no result");
}
function _callGeminiWithPdfRaw_(b64, promptText, config) {
    config = config || {};
    var safeB64 = _sanitizeAiBase64_(b64);
    _assertAiGatewayAllowed_("pdf", safeB64, "gemini.pdf"), _assertAiGatewayAllowed_("text", promptText, "gemini.pdfPrompt");
    var key = _getGeminiKey_();
    if (!key)
        throw new Error("ไม่พบ GEMINI_API_KEY");
    var generationConfig = {
        temperature: Number(config.temperature == null ? .1 : config.temperature), topP: Number(config.topP || .9), maxOutputTokens: Math.max(512, Math.min(8192, Number(config.maxOutputTokens || 2048) || 2048))
    };
    config.responseMimeType !== !1 && (generationConfig.responseMimeType = String(config.responseMimeType || "application/json"));
    var body = JSON.stringify({
        contents: [
            {
                role: "user", parts: [
                    {
                        text: String(promptText || "")
                    }, {
                        inlineData: {
                            mimeType: "application/pdf", data: safeB64
                        }
                    }
                ]
            }
        ], generationConfig
    }), r = UrlFetchApp.fetch(_buildGeminiEndpoint_() + encodeURIComponent(key), {
        method: "POST", contentType: "application/json", payload: body, muteHttpExceptions: !0
    });
    if (r.getResponseCode() !== 200) {
        var bodyText = String(r.getContentText() || "");
        throw r.getResponseCode() === 429 ? new Error("กรุณาลองใหม่อีกครั้ง เนื่องจากข้อมูลมีจำนวนมาก") : r.getResponseCode() === 400 && /inline_data|inlineData|mime|base64|invalid/i.test(bodyText) ? new Error("Gemini อ่าน PDF ไม่สำเร็จ: รูปแบบไฟล์ PDF/base64 ไม่ถูกต้อง หรือไฟล์ถูกสแกนเป็นภาพคุณภาพต่ำ") : new Error("Gemini HTTP " + r.getResponseCode() + ": " + bodyText.substring(0, 500));
    }
    var j = JSON.parse(r.getContentText());
    return _extractGeminiText_(j);
}
function _callGeminiEmbedRaw_(text) {
    _assertAiGatewayAllowed_("embed", text, "gemini.embed");
    var key = _getGeminiKey_();
    if (!key)
        throw new Error("ไม่พบ GEMINI_API_KEY");
    var resp = UrlFetchApp.fetch(GEMINI_EMBED_EP + encodeURIComponent(key), {
        method: "POST", contentType: "application/json", payload: JSON.stringify({
            model: "models/text-embedding-004", content: {
                parts: [
                    {
                        text: String(text || "")
                    }
                ]
            }
        }), muteHttpExceptions: !0
    });
    if (resp.getResponseCode() !== 200)
        throw new Error("Embed HTTP " + resp.getResponseCode());
    var j = JSON.parse(resp.getContentText());
    return j.embedding && j.embedding.values ? j.embedding.values : [];
}
function _cosineSim_(a, b) {
    if (!a.length || !b.length || a.length !== b.length)
        return 0;
    for (var dot = 0, normA = 0, normB = 0, i = 0; i < a.length; i++)
        dot += a[i] * b[i], normA += a[i] * a[i], normB += b[i] * b[i];
    return normA === 0 || normB === 0 ? 0 : dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
function _generateCaseSummary_(title, petitioner, respondent) {
    var prompt = [
        "คุณเป็นผู้ช่วยฝ่ายเลขานุการคณะกรรมาธิการฯ", "โปรดสร้างสรุปย่อเรื่อง (ไม่เกิน 3 ประโยค) สำหรับเรื่องร้องเรียนต่อไปนี้:", "ชื่อเรื่อง: " + title, petitioner ? "ผู้ร้อง: " + petitioner : "", respondent ? "ผู้ถูกร้อง: " + respondent : "", "ตอบเป็นภาษาไทย กระชับ เป็นทางการ ไม่ต้องมีหัวข้อนำ"
    ].filter(Boolean).join(`
`);
    return _runAiGatewayText_(prompt, {
        temperature: .3, maxOutputTokens: 300
    });
}
function apiSuggestCaseStatus(payload) {
    payload = payload || {};
    try {
        var _aiSess = requireAuth_(payload, "viewer");
        _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || "")), _checkGeminiRateLimit_(payload.token || payload._token || "");
        var caseId = String(payload.caseId || ""), history = payload.history || [];
        if (!caseId)
            throw new Error("ไม่พบ caseId");
        if (!_getGeminiKey_())
            throw new Error("ยังไม่ได้ตั้งค่า GEMINI_API_KEY");
        var cacheKey = "status_suggest_" + _appSha256Hex_(caseId + JSON.stringify(history)).substring(0, 16), result = cachedGeminiCall_(cacheKey, function () {
            var prompt = [
                "คุณเป็นระบบแนะนำสถานะเรื่องพิจารณาอัตโนมัติ", "ประวัติการประชุม:", history.map(function (h, i) {
                    return i + 1 + ". ครั้งที่ " + (h.round || "") + " วันที่ " + (h.date || "") + " \u2014 " + (h.note || "");
                }).join(`
`), "", "โปรดแนะนำสถานะที่เหมาะสมที่สุด 1 รายการ จากตัวเลือก:", "เรื่องเข้าใหม่ | ไม่รับเรื่อง | อนุฯ พิจารณา | รอพิจารณา | กมธ. พิจารณา | ยุติเรื่อง | ส่งหน่วยงาน | จัดทำรายงาน", 'ตอบเป็น JSON: {"status":"...","reason":"..."}'
            ].join(`
`), raw = _runAiGatewayText_(prompt, {
                temperature: .1, maxOutputTokens: 200
            });
            return parseGeminiJsonText_(raw, {
                status: "รอพิจารณา", reason: "แนะนำตามค่าเริ่มต้น"
            });
        }, 600);
        return result = _aiCanonicalizeStatusResult_(result, "รอพิจารณา"), ok_(result);
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.007", e), err_(_aiUserFacingError_(e));
    }
}
function apiSemanticSearch(payload) {
    payload = payload || {};
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    try {
        _checkGeminiRateLimit_(payload.token);
        var q = String(payload.q || "").trim();
        if (!q)
            return ok_([]);
        if (!_getGeminiKey_())
            return apiSearch(payload);
        var queryEmbed = _runAiGatewayEmbed_(q);
        if (!queryEmbed.length)
            return apiSearch(payload);
        var cases = filterDeleted_(cachedSheetObjects_("MainData")), scored = cases.map(function (r) {
            var text = [
                r.title || "", r.petitioners || "", r.remark || ""
            ].join(" "), embRaw = r._embed ? r._embed : null, embed = embRaw ? Array.isArray(embRaw) ? embRaw : JSON.parse(String(embRaw)) : [], score = embed.length ? _cosineSim_(queryEmbed, embed) : 0;
            return !embed.length && text.toLowerCase().indexOf(q.toLowerCase()) !== -1 && (score = .5), {
                id: r.caseId || "", type: "case", typeLabel: "เรื่องพิจารณา", title: r.title || "", detail: r.petitioners || "", status: r.status || "", score
            };
        });
        scored.sort(function (a, b) {
            return b.score - a.score;
        });
        var results = scored.filter(function (r) {
            return r.score > .3;
        }).slice(0, 10);
        return ok_(results.map(sanitizeRow_));
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.008", e), apiSearch(payload);
    }
}
function _lettersSearchIndexSignature_() {
    try {
        var rows = [];
        typeof readSheetProjectedObjectsCached_ == "function" ? rows = readSheetProjectedObjectsCached_("Letters", [
            "letterId", "bookNo", "letterNo", "updatedAt", "isDeleted", "deletedAt"
        ], {
            includeDeleted: !1, ttl: 180, requireCanonical: !1
        }) || [] : rows = filterDeleted_(cachedSheetObjects_("Letters"));
        var last = rows.length ? rows[rows.length - 1] : {};
        return String(rows.length) + "|" + String(last.updatedAt || last.letterId || last.bookNo || last.letterNo || "");
    }
    catch (_e) {
        return _recordWarning_("current.silent.code.40.ai.009", _e), "0|";
    }
}
function _lettersSearchIndexCacheKey_() {
    return "letters_search_index_current_" + (_appIsFnName_("_routerEntityCacheStamp_") ? _routerEntityCacheStamp_("letters") : "1") + "_" + (_appIsFnName_("_routerEntityCacheStamp_") ? _routerEntityCacheStamp_("maindata") : "1") + "_" + _appSha256Hex_(_lettersSearchIndexSignature_()).substring(0, 24);
}
function _buildLettersSearchIndex_(lettersRows, caseMap) {
    lettersRows = Array.isArray(lettersRows) ? lettersRows : [], caseMap = caseMap || {};
    function normalize(value) {
        return String(value == null ? "" : value).toLowerCase().replace(/\s+/g, " ").trim();
    }
    function tokenize(value) {
        var seen = {};
        return normalize(value).split(/[^0-9a-zA-Zก-๙]+/).map(function (x) {
            return String(x || "").trim();
        }).filter(function (x) {
            return !x || seen[x] ? !1 : (seen[x] = 1, !0);
        });
    }
    return lettersRows.map(function (r) {
        var caseInfo = caseMap[String(r.caseId || "")] || {
            caseNum: "", title: ""
        }, joined = [
            r.letterId, r.caseId, caseInfo.caseNum, caseInfo.title, r.bookNo, r.letterNo, r.agency, r.subject, r.issue, r.officer, r.opStaff, r.letterStatus, r.status
        ].join(" ");
        return {
            letterId: String(r.letterId || ""), text: normalize(joined), tokens: tokenize(joined), agency: normalize(r.agency), bookNo: normalize(r.bookNo || r.letterNo), caseNum: normalize(caseInfo.caseNum), caseTitle: normalize(caseInfo.title), status: normalize(r.letterStatus || r.status)
        };
    });
}
function _getLettersSearchIndex_(lettersRows, caseMap) {
    var key = _lettersSearchIndexCacheKey_();
    try {
        var hit = _AppScriptCache_().get(String(key));
        if (hit) {
            var parsed = JSON.parse(hit);
            if (parsed && Array.isArray(parsed.rows))
                return parsed.rows;
        }
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("ai.silentLocalResult", _e);
    }
    var rows = _buildLettersSearchIndex_(lettersRows, caseMap);
    try {
        safeCachePut_(_AppScriptCache_(), String(key), {
            rows
        }, 300);
    }
    catch (_e2) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("ai.silent.code_40_ai_services.004", _e2);
    }
    return rows;
}
function apiPredictOverdueRisk(payload) {
    payload = payload || {};
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    try {
        if (_checkGeminiRateLimit_(payload.token), !_getGeminiKey_())
            throw new Error("ยังไม่ได้ตั้งค่า GEMINI_API_KEY");
        var rows = filterDeleted_(cachedSheetObjects_("Letters")), today = new Date;
        today.setHours(0, 0, 0, 0);
        var atRisk = rows.filter(function (r) {
            if (String(r.letterStatus || "") === "ได้รับแล้ว" || !r.dueDate)
                return !1;
            var due = new Date(r.dueDate);
            due.setHours(0, 0, 0, 0);
            var d = Math.round((due - today) / 864e5);
            return d >= 0 && d <= 14;
        }).slice(0, 15);
        if (!atRisk.length)
            return ok_({
                risk: [], summary: "ไม่มีหนังสือที่ใกล้ครบกำหนดในช่วง 14 วัน"
            });
        var listText = atRisk.map(function (r, i) {
            var due = r.dueDate ? new Date(r.dueDate) : null, d = due ? Math.round((due - today) / 864e5) : 0;
            return i + 1 + ". " + String(r.agency || "") + " \u2014 " + String(r.subject || r.issue || "") + " (ครบกำหนดอีก " + d + " วัน) เจ้าหน้าที่: " + String(r.opStaff || r.officer || "-");
        }).join(`
`), cacheKey = "overdue_risk_" + _appSha256Hex_(listText).substring(0, 16), summary = cachedGeminiCall_(cacheKey, function () {
            var prompt = [
                "วิเคราะห์ความเสี่ยงหนังสือติดตามที่ใกล้ครบกำหนดต่อไปนี้:", listText, "", "สรุปเป็นภาษาไทย 2-3 ประโยค: ระบุรายการที่เร่งด่วนที่สุดและข้อแนะนำ"
            ].join(`
`);
            return _runAiGatewayText_(prompt, {
                temperature: .3, maxOutputTokens: 400
            });
        }, 1800);
        return ok_({
            risk: atRisk.map(sanitizeRow_), summary
        });
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.010", e), err_(_aiUserFacingError_(e));
    }
}
function apiDraftReplyLetter(payload) {
    payload = payload || {};
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    try {
        _checkGeminiRateLimit_(payload.token);
        var letterId = String(payload.letterId || ""), context = String(payload.context || "");
        if (!_getGeminiKey_())
            throw new Error("ยังไม่ได้ตั้งค่า GEMINI_API_KEY");
        var letters = cachedSheetObjects_("Letters"), letter = letters.filter(function (r) {
            return String(r.letterId) === letterId;
        })[0];
        if (!letter && !context)
            throw new Error("ไม่พบข้อมูลหนังสือ");
        var agency = letter ? String(letter.agency || "") : "", subject = letter ? String(letter.subject || letter.issue || "") : "", cacheKey = "draft_reply_" + _appSha256Hex_(letterId + context).substring(0, 16), draft = cachedGeminiCall_(cacheKey, function () {
            var prompt = [
                "คุณเป็นเลขานุการคณะกรรมาธิการการป้องกันและปราบปรามการทุจริตประพฤติมิชอบ สภาผู้แทนราษฎร", "โปรดร่างหนังสือตอบกลับสำหรับ:", agency ? "หน่วยงาน: " + agency : "", subject ? "เรื่อง: " + subject : "", context ? "บริบทเพิ่มเติม: " + context : "", "", "ร่างหนังสือราชการในรูปแบบมาตรฐาน ภาษาทางการ กระชับ", "ระบุเฉพาะเนื้อหาจดหมาย ไม่ต้องใส่หัวกระดาษหรือลายเซ็น"
            ].filter(Boolean).join(`
`);
            return _runAiGatewayText_(prompt, {
                temperature: .4, maxOutputTokens: 800
            });
        }, 600);
        return ok_({
            draft, agency, subject
        });
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.011", e), err_(_aiUserFacingError_(e));
    }
}
function apiCheckDuplicateCase(titleOrPayload) {
    var payload = titleOrPayload && typeof titleOrPayload == "object" && !Array.isArray(titleOrPayload) ? titleOrPayload : {
        title: String(titleOrPayload || "")
    }, boundary = _routerAuthorizedEntry_("apiCheckDuplicateCase", payload, "viewer");
    if (!boundary.ok)
        return boundary.result;
    try {
        var newTitle = String(payload.title || "").trim(), token = payload.token || payload._token || "";
        if (!newTitle)
            throw new Error("กรุณากรอกชื่อเรื่องก่อนตรวจสอบ");
        var rows = filterDeleted_(cachedSheetObjects_("MainData")), allTitles = rows.map(function (r) {
            return String(r.title || r.caseTitle || "").trim();
        }).filter(function (t) {
            return !!t;
        }), local = _aiLocalDuplicateCheck_(newTitle, allTitles);
        if (!_getGeminiKey_() || !_aiGatewayEnabled_())
            return ok_({
                isDuplicate: !!local.isDuplicate, reason: local.reason, matchedTitle: local.matchedTitle, semanticDupes: [], checkedTitle: newTitle, sampleSize: allTitles.length, usedLocalResult: !0, similarity: local.similarity, source: local.source
            });
        _checkGeminiRateLimit_(token);
        var semanticDupes = [];
        try {
            if (allTitles.length > 0) {
                var queryEmbed = _runAiGatewayEmbed_(newTitle);
                queryEmbed.length && rows.forEach(function (r) {
                    var t = String(r.title || "").trim(), emb = r._embed ? Array.isArray(r._embed) ? r._embed : JSON.parse(String(r._embed)) : [];
                    if (!(!emb.length || !t)) {
                        var sim = _cosineSim_(queryEmbed, emb);
                        sim > .85 && semanticDupes.push({
                            title: t, similarity: sim.toFixed(2)
                        });
                    }
                });
            }
        }
        catch (embedErr) {
            _recordWarning_("current.silent.code.40.ai.012", embedErr);
        }
        var recentTitles = allTitles.slice(-200), cacheKey = "dup_" + _appSha256Hex_(newTitle + recentTitles.join("|")).substring(0, 20), parsed = cachedGeminiCall_(cacheKey, function () {
            var prompt = [
                "ตรวจสอบว่าชื่อเรื่องใหม่ซ้ำหรือใกล้เคียงกับรายการเดิมหรือไม่", "ชื่อเรื่องใหม่: " + newTitle, "รายการเดิม " + recentTitles.length + " รายการ:", recentTitles.map(function (t, i) {
                    return i + 1 + ". " + t;
                }).join(`
`), 'ตอบเป็น JSON: {"isDuplicate":true/false,"reason":"...","matchedTitle":"..."}', "ถ้าเนื้อหาใกล้เคียงมากแม้ถ้อยคำต่างกัน ให้ถือว่าซ้ำ"
            ].join(`

`), raw = _runAiGatewayText_(prompt, {
                temperature: .1, maxOutputTokens: 300
            });
            return parseGeminiJsonText_(raw, {
                isDuplicate: local.isDuplicate, reason: local.reason, matchedTitle: local.matchedTitle
            });
        }, 300);
        return ok_({
            isDuplicate: !!parsed.isDuplicate || semanticDupes.length > 0 || !!local.isDuplicate, reason: parsed.reason || local.reason || "", matchedTitle: parsed.matchedTitle || local.matchedTitle || "", semanticDupes, checkedTitle: newTitle, sampleSize: recentTitles.length, usedLocalResult: !1
        });
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.013", e), err_(_aiUserFacingError_(e));
    }
}
function apiAnalyzePersonnelWorkload(payload) {
    payload = payload || {};
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    try {
        var personName = String(payload.personName || "").trim();
        if (!personName)
            throw new Error("กรุณาระบุชื่อบุคลากร");
        var cases = filterDeleted_(cachedSheetObjects_("MainData")), letters = filterDeleted_(cachedSheetObjects_("Letters")), today = new Date;
        today.setHours(0, 0, 0, 0);
        var relatedCases = cases.filter(function (r) {
            return [
                r.assignees, r.staffs, r.coAssignees, r.owner
            ].join(" ").indexOf(personName) !== -1;
        }), relatedLetters = letters.filter(function (r) {
            return String(r.opStaff || r.officer || "").indexOf(personName) !== -1;
        }), overdueLetters = relatedLetters.filter(function (r) {
            if (String(r.letterStatus || "") === "ได้รับแล้ว" || !r.dueDate)
                return !1;
            var due = new Date(r.dueDate);
            return due.setHours(0, 0, 0, 0), today > due;
        }), soonLetters = relatedLetters.filter(function (r) {
            if (String(r.letterStatus || "") === "ได้รับแล้ว" || !r.dueDate)
                return !1;
            var due = new Date(r.dueDate);
            due.setHours(0, 0, 0, 0);
            var d = Math.round((due - today) / 864e5);
            return d >= 0 && d <= 7;
        }), riskScore = 0;
        relatedCases.length > 10 && (riskScore += 30), overdueLetters.length > 3 && (riskScore += 40), soonLetters.length > 2 && (riskScore += 20), relatedCases.length > 20 && (riskScore += 10), riskScore = Math.min(riskScore, 100);
        var riskLevel = riskScore >= 70 ? "สูง" : riskScore >= 40 ? "ปานกลาง" : "ต่ำ", baseResult = {
            personName, totalCases: relatedCases.length, totalLetters: relatedLetters.length, overdueLetters: overdueLetters.length, soonLetters: soonLetters.length, riskScore, riskLevel
        }, localReport = _aiLocalPersonnelReport_(baseResult);
        if (!_getGeminiKey_() || !_aiGatewayEnabled_()) {
            if (!_aiLocalRuleResultEnabled_())
                throw new Error(_getGeminiKey_() ? "AI gateway ถูกปิดในระบบ" : "ไม่พบ GEMINI_API_KEY");
            return baseResult.report = localReport, baseResult.usedLocalResult = !0, baseResult.warning = _getGeminiKey_() ? "AI gateway ถูกปิด จึงใช้ผลวิเคราะห์แบบ local rule-based result" : "ยังไม่ได้ตั้งค่า GEMINI_API_KEY จึงใช้ผลวิเคราะห์แบบ local rule-based result", ok_(baseResult, "วิเคราะห์ภาระงานสำเร็จ");
        }
        _checkGeminiRateLimit_(payload.token);
        var casesSummary = relatedCases.slice(0, 20).map(function (r, i) {
            return i + 1 + ". " + String(r.title || "").substring(0, 60) + " [" + String(r.status || "") + "]";
        }).join(`
`), lettersSummary = relatedLetters.slice(0, 10).map(function (r) {
            var due = r.dueDate ? String(r.dueDate).substring(0, 10) : "ไม่มีกำหนด";
            return "- " + String(r.agency || "") + " (ครบกำหนด:" + due + " สถานะ:" + String(r.letterStatus || "") + ")";
        }).join(`
`), cacheKey = "workload_" + _appSha256Hex_(personName).substring(0, 12) + "_" + today.toDateString().replace(/\s/g, "");
        try {
            var report = cachedGeminiCall_(cacheKey, function () {
                var prompt = [
                    'วิเคราะห์ภาระงานของบุคลากรชื่อ "' + personName + '"', "เรื่องพิจารณา (" + relatedCases.length + " เรื่อง):", casesSummary || "(ไม่พบ)", "", "หนังสือ (" + relatedLetters.length + " ฉบับ เลยกำหนด " + overdueLetters.length + " ใกล้ครบ " + soonLetters.length + "):", lettersSummary || "(ไม่พบ)", "", "Risk Score: " + riskScore + "/100 (ระดับ" + riskLevel + ")", "", "สรุป 4 ด้าน: 1)ภาพรวมภาระงาน 2)เรื่องเร่งด่วน 3)ความเสี่ยง 4)ข้อเสนอแนะ", "ตอบภาษาไทย กระชับ ไม่เกิน 500 คำ"
                ].join(`
`);
                return _runAiGatewayText_(prompt, {
                    temperature: .3, maxOutputTokens: 1024
                });
            }, 900);
            return baseResult.report = report || localReport, baseResult.usedLocalResult = !report, ok_(baseResult, "วิเคราะห์ภาระงานสำเร็จ");
        }
        catch (aiErr) {
            return _recordWarning_("ai.personnelWorkload.defaultValue", aiErr), baseResult.report = localReport, baseResult.usedLocalResult = !0, baseResult.warning = _aiUserFacingError_(aiErr), ok_(baseResult, "วิเคราะห์ภาระงานสำเร็จ");
        }
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.014", e), err_(_aiUserFacingError_(e));
    }
}
function apiRecommendWorkloadDistribution(payload) {
    payload = payload || {};
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    try {
        if (_checkGeminiRateLimit_(payload.token), !_getGeminiKey_())
            throw new Error("ยังไม่ได้ตั้งค่า GEMINI_API_KEY");
        var cases = filterDeleted_(cachedSheetObjects_("MainData")), comms = cachedSheetObjects_("Personnel_Comm"), ops = cachedSheetObjects_("Personnel_Op"), today = new Date;
        today.setHours(0, 0, 0, 0);
        var workloadMap = {}, allPersonnel = comms.concat(ops).map(function (p) {
            return String(p.name || "").trim();
        }).filter(Boolean);
        allPersonnel.forEach(function (name) {
            workloadMap[name] = cases.filter(function (c) {
                return [
                    c.assignees, c.staffs, c.coAssignees
                ].join(" ").indexOf(name) !== -1;
            }).length;
        });
        var unassigned = cases.filter(function (c) {
            return !String(c.assignees || "").trim() && _aiNormalizeCaseStatus_(c.status) === "เรื่องเข้าใหม่";
        }).slice(0, 5), workloadText = Object.keys(workloadMap).map(function (n) {
            return n + ": " + workloadMap[n] + " เรื่อง";
        }).join(", "), cacheKey = "wl_dist_" + _appSha256Hex_(workloadText).substring(0, 16), recommendation = cachedGeminiCall_(cacheKey, function () {
            var prompt = [
                "แนะนำการกระจายภาระงานสำหรับทีมต่อไปนี้:", "ภาระงานปัจจุบัน: " + workloadText, "", unassigned.length ? "เรื่องที่รอมอบหมาย: " + unassigned.map(function (c) {
                    return c.title;
                }).join(", ") : "", "", "แนะนำว่าควรมอบหมายเรื่องใหม่ให้ใคร และเหตุผล ตอบภาษาไทยกระชับ"
            ].filter(Boolean).join(`
`);
            return _runAiGatewayText_(prompt, {
                temperature: .4, maxOutputTokens: 500
            });
        }, 1800);
        return ok_({
            workloadMap, recommendation
        });
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.015", e), err_(_aiUserFacingError_(e));
    }
}
function apiExtractTrackingPdf(payload) {
    payload = payload || {};
    try {
        var _aiSess = requireAuth_(payload, "viewer");
        _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
        var b64 = String(payload.base64 || "").trim();
        if (!b64)
            throw new Error("ไม่พบข้อมูล base64");
        var p = `สกัดข้อมูลจากหนังสือราชการใน PDF ตอบ JSON เท่านั้น ไม่มี markdown และห้ามครอบด้วย data/result
ใช้ชื่อ key ตรงตามนี้เท่านั้น:{"bookNo":"...","agency":"...","title":"...","dueDate":"..."}
bookNo=เลขที่หนังสือ agency=หน่วยงาน title=เรื่อง dueDate=ครบกำหนดรูปแบบ yyyy-MM-dd ถ้าไม่พบให้ใส่ค่าว่าง`, raw = _runAiGatewayPdf_(b64, p, {
            feature: "tracking.pdf.extract", maxOutputTokens: 2048, responseMimeType: "application/json"
        }), normalized = _normalizeAiDocumentPdfResult_(_aiJsonParse_(raw, {}), "letter");
        return ok_(_assertAiPdfExtractionResult_(normalized, "letter"));
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.016", e), err_(_aiUserFacingError_(e));
    }
}
function apiExtractDocumentPdf(payload) {
    payload = payload || {};
    try {
        var _aiSess = requireAuth_(payload, "viewer");
        _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
        var b64 = String(payload.base64 || "").trim(), mode = String(payload.mode || "letter");
        if (!b64)
            throw new Error("ไม่พบข้อมูล base64");
        var p = mode === "case" ? `สกัดข้อมูลจากเอกสารราชการใน PDF ตอบ JSON เท่านั้น ไม่มี markdown และห้ามครอบด้วย data/result
ใช้ชื่อ key ตรงตามนี้เท่านั้น:{"title":"...","petitioner":"...","respondent":"...","summary":"...","bookNo":"...","agency":"..."}
title=ชื่อเรื่อง petitioner=ผู้เสนอญัตติหรือผู้ร้อง respondent=หน่วยงานหรือผู้ถูกร้อง summary=สรุปสาระสำคัญ ถ้าไม่พบให้ใส่ค่าว่าง` : `สกัดข้อมูลจากหนังสือราชการใน PDF ตอบ JSON เท่านั้น ไม่มี markdown และห้ามครอบด้วย data/result
ใช้ชื่อ key ตรงตามนี้เท่านั้น:{"bookNo":"...","agency":"...","title":"...","dueDate":"..."} ถ้าไม่พบให้ใส่ค่าว่าง`, raw = _runAiGatewayPdf_(b64, p, {
            feature: "document.pdf.extract", maxOutputTokens: 3072, responseMimeType: "application/json"
        }), normalized = _normalizeAiDocumentPdfResult_(_aiJsonParse_(raw, {}), mode);
        return ok_(_assertAiPdfExtractionResult_(normalized, mode));
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.017", e), err_(_aiUserFacingError_(e));
    }
}
function _normalizeAiMeetingAgendaItems_(items, agendaNo) {
    return items = Array.isArray(items) ? items : [], agendaNo = String(agendaNo || ""), items.map(function (it, idx) {
        return it = it || {}, {
            agendaNo, seq: Number(it.seq || idx + 1) || idx + 1, title: String(it.title || it.caseTitle || "").trim(), caseTitle: String(it.caseTitle || it.title || "").trim(), agencyOrPresenter: String(it.agencyOrPresenter || it.agency || it.presenter || "").trim(), result: String(it.result || it.note || it.resolution || "").trim(), relatedMeetingNo: String(it.relatedMeetingNo || "").trim(), relatedMeetingDate: String(it.relatedMeetingDate || "").trim()
        };
    }).filter(function (it) {
        return String(it.title || it.caseTitle || it.agencyOrPresenter || it.result || it.relatedMeetingNo || it.relatedMeetingDate || "").trim() !== "";
    }).slice(0, 50);
}
function _normalizeAiMeetingAgendaPayload_(parsed) {
    parsed = parsed || {};
    var meeting = parsed.meeting || {};
    return {
        meeting: {
            meetingNo: String(meeting.meetingNo || parsed.meetingNo || "").trim(), meetingDate: String(meeting.meetingDate || parsed.meetingDate || "").trim(), title: String(meeting.title || parsed.title || "").trim(), note: String(meeting.note || parsed.note || "").trim()
        }, agenda1: _normalizeAiMeetingAgendaItems_(parsed.agenda1 || parsed.agendaOne || parsed.noticeItems, "1"), agenda2: _normalizeAiMeetingAgendaItems_(parsed.agenda2 || parsed.agendaTwo || parsed.approvalItems, "2"), agenda3: _normalizeAiMeetingAgendaItems_(parsed.agenda3 || parsed.agendaThree || parsed.considerationItems, "3"), agenda4: _normalizeAiMeetingAgendaItems_(parsed.agenda4 || parsed.agendaFour || parsed.otherItems, "4")
    };
}
function apiExtractMeetingAgendaPdf(payload) {
    payload = payload || {};
    try {
        var _aiSess = requireAuth_(payload, "viewer");
        _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || "")), _checkGeminiRateLimit_(payload.token || payload._token || "");
        var b64 = String(payload.base64 || "").trim();
        if (!b64)
            throw new Error("ไม่พบข้อมูลไฟล์สำหรับให้ AI สแกน");
        if (b64.length > 10 * 1024 * 1024)
            throw new Error("ไฟล์ PDF ใหญ่เกิน 10MB กรุณาลดขนาดไฟล์ก่อนสแกนด้วย AI");
        var fileName = String(payload.fileName || "").trim(), p = [
            "สกัดข้อมูลระเบียบวาระการประชุมคณะกรรมาธิการจากเอกสาร PDF ภาษาไทย", "ตอบเป็น JSON เท่านั้น ห้ามมี markdown หรือคำอธิบายอื่น", "รูปแบบ JSON:", '{"meeting":{"meetingNo":"","meetingDate":"","title":"","note":""},"agenda1":[{"title":"","agencyOrPresenter":"","result":""}],"agenda2":[{"relatedMeetingNo":"","relatedMeetingDate":"","result":""}],"agenda3":[{"title":"","caseTitle":"","agencyOrPresenter":"","result":""}],"agenda4":[{"title":"","agencyOrPresenter":"","result":""}]}', "กติกา:", "- แยกตามหัวข้อ ระเบียบวาระที่ 1, 2, 3, 4 เท่านั้น", "- agenda1 = เรื่องแจ้ง", "- agenda2 = รับรองบันทึกการประชุม ให้ใส่ครั้งที่/วันที่เดิมถ้าพบ", "- agenda3 = เรื่องพิจารณา ให้ title/caseTitle เป็นชื่อเรื่องพิจารณา", "- agenda4 = เรื่องอื่น ๆ", "- ถ้าไม่พบค่าใดให้ใส่ string ว่าง ไม่ต้องเดา", "- จำกัดแต่ละวาระไม่เกิน 50 รายการ", fileName ? "ชื่อไฟล์: " + fileName : ""
        ].filter(Boolean).join(`
`), raw = _runAiGatewayPdf_(b64, p, {
            feature: "meeting.agenda.extract", maxOutputTokens: 4096, responseMimeType: "application/json"
        }), parsed = _aiJsonParse_(raw, {}), normalized = _normalizeAiMeetingAgendaPayload_(parsed);
        return ok_(normalized, "AI สแกนระเบียบวาระการประชุมสำเร็จ");
    }
    catch (e) {
        return _recordWarning_("ai.meetingAgenda.extract", e), err_(_aiUserFacingError_(e));
    }
}
function apiChat(payload) {
    if (payload = typeof AppAiGateway != "undefined" && AppAiGateway.guard ? AppAiGateway.guard(payload || {}, "apiChat") : payload || {}, payload = payload || {}, _aiIsInitialLoadPayload_(payload))
        return _aiLazyDeferredResult_("chat", "เลื่อน AI Chat เป็น lazy load เพื่อไม่ให้กระทบการโหลดหน้าหลัก");
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    try {
        if (_aiAssertLazyInvocation_(payload, "chat"), _checkGeminiRateLimit_(payload.token), !_getGeminiKey_())
            throw new Error("ไม่พบ GEMINI_API_KEY");
        var message = String(payload.message || "").trim(), history = Array.isArray(payload.history) ? payload.history : [], sysCtx = String(payload.systemContext || "");
        if (!message)
            throw new Error("ไม่พบข้อความ");
        var historyText = history.slice(-6).map(function (h) {
            var role = String(h && h.role || "user"), content = String(h && h.content || "").trim();
            return content ? role + ": " + content : "";
        }).filter(Boolean).join(`
`), fullMsg = [
            sysCtx, historyText ? `ประวัติสนทนาล่าสุด:
` + historyText : "", "คำถาม: " + message
        ].filter(Boolean).join(`

`), reply = _runAiGatewayText_(fullMsg, {
            temperature: .3, maxOutputTokens: 512
        }, {
            feature: "chat"
        });
        return _aiOk_({
            reply: String(reply || "").trim() || "ขออภัย ไม่สามารถประมวลผลได้"
        }, "ประมวลผล AI Chat สำเร็จ", "chat");
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.018", e), err_(_aiUserFacingError_(e));
    }
}
function _buildDailyBriefingData_(options) {
    if (options = options || {}, !_getGeminiKey_())
        throw new Error("ไม่พบ GEMINI_API_KEY");
    var today = new Date;
    today.setHours(0, 0, 0, 0);
    var cases = filterDeleted_(cachedSheetObjects_("MainData")), letters = filterDeleted_(cachedSheetObjects_("Letters")), overdueLetters = letters.filter(function (row) {
        if (String(row.letterStatus || "") === "ได้รับแล้ว" || !row.dueDate)
            return !1;
        var due = new Date(row.dueDate);
        return due.setHours(0, 0, 0, 0), due < today;
    }), soonLetters = letters.filter(function (row) {
        if (String(row.letterStatus || "") === "ได้รับแล้ว" || !row.dueDate)
            return !1;
        var due = new Date(row.dueDate);
        due.setHours(0, 0, 0, 0);
        var days = Math.round((due - today) / 864e5);
        return days >= 0 && days <= 3;
    }), pendingCases = cases.filter(function (row) {
        return _aiIsOpenCaseStatus_(row.status);
    }), categoryCounts = {};
    cases.forEach(function (row) {
        var key = String(row.cat || row.category || row.caseCategory || "ไม่ระบุ");
        categoryCounts[key] = Number(categoryCounts[key] || 0) + 1;
    });
    var topCategories = Object.keys(categoryCounts).sort(function (a, b) {
        return categoryCounts[b] - categoryCounts[a];
    }).slice(0, 5).map(function (name) {
        return {
            name, count: categoryCounts[name]
        };
    }), anomalySummary = {
        overdueSpike: overdueLetters.length >= 10, pendingSpike: pendingCases.length >= 25, urgentWindow: soonLetters.length >= 5
    }, dateStr = Utilities.formatDate(today, "GMT+7", "dd/MM/yyyy"), cacheKey = "briefing_" + dateStr.replace(/\//g, ""), briefing = cachedGeminiCall_(cacheKey, function () {
        var prompt = [
            "สร้าง Daily Briefing สำหรับ " + dateStr, "คณะกรรมาธิการการป้องกันและปราบปรามการทุจริตประพฤติมิชอบ", "", "ข้อมูลระบบ:", "- เรื่องพิจารณาที่รอดำเนินการ: " + pendingCases.length + " เรื่อง", "- หนังสือเลยกำหนด: " + overdueLetters.length + " ฉบับ", "- หนังสือครบกำหนดวันนี้ถึง 3 วัน: " + soonLetters.length + " ฉบับ", soonLetters.length > 0 ? "หนังสือเร่งด่วน: " + soonLetters.slice(0, 3).map(function (row) {
                return String(row.agency || "") + " \u2014 " + String(row.subject || row.issue || "");
            }).join("; ") : "", "", "เขียน Daily Briefing สั้น กระชับ ภาษาทางการ 2-3 ประโยค", "เน้นสิ่งที่ต้องดำเนินการวันนี้"
        ].filter(Boolean).join(`
`);
        return _runAiGatewayText_(prompt, {
            temperature: .4, maxOutputTokens: 400
        });
    }, 3600);
    return {
        date: dateStr, briefing, pendingCases: pendingCases.length, overdueLetters: overdueLetters.length, soonLetters: soonLetters.length, trends: {
            topCategories, pendingCases: pendingCases.length, overdueLetters: overdueLetters.length
        }, anomalies: anomalySummary, recommendations: [
            anomalySummary.overdueSpike ? "เร่งติดตามหนังสือค้างตอบโดยจัดลำดับตามวันครบกำหนด" : "คงจังหวะการติดตามตามแผนปกติ", anomalySummary.pendingSpike ? "พิจารณากระจายภาระงานหรือจัดประชุมเพิ่มเพื่อลด backlog" : "ติดตาม backlog รายสัปดาห์", soonLetters.length ? "จัดการรายการใกล้ครบกำหนดภายใน 3 วันก่อนรายการอื่น" : "ไม่พบหนังสือเร่งด่วนในช่วง 3 วัน"
        ], source: String(options.source || "ai.dailyBriefing"), caseStatusOwner: "AppBackendCore.normalizeCaseStatus"
    };
}
function apiGetDailyBriefing(payload) {
    payload = payload || {};
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    try {
        return _aiAssertLazyInvocation_(payload, "daily.briefing"), _checkGeminiRateLimit_(payload.token || payload._token || ""), ok_(_buildDailyBriefingData_({
            source: "apiGetDailyBriefing"
        }));
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.019", e), err_(_aiUserFacingError_(e));
    }
}
function apiDetectBudgetAnomalies(payload) {
    if (payload = payload || {}, _aiIsInitialLoadPayload_(payload))
        return _aiLazyDeferredResult_("budget.anomaly", "เลื่อน AI Budget Risk เป็น lazy load เพื่อไม่ให้กระทบการโหลดงบประมาณ");
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    try {
        var fy = String(payload.fy || ""), rows = Array.isArray(payload.rows) ? payload.rows : [];
        if (!rows.length && Array.isArray(payload.budgetData) && (rows = payload.budgetData), !rows.length && fy) {
            var imports = normalizeResult_(listBudgetImportRecordsByFY(fy), "โหลดข้อมูลงบประมาณสำเร็จ", "โหลดข้อมูลงบประมาณไม่สำเร็จ");
            rows = imports && imports.ok && imports.data && Array.isArray(imports.data.rows) ? imports.data.rows : [];
        }
        var local = _aiBudgetAnomalyLocal_(rows, fy);
        if (!rows.length)
            return ok_(local);
        if (!_getGeminiKey_() || !_aiGatewayEnabled_())
            return _aiLocalRuleResultEnabled_() ? ok_(local) : err_(_getGeminiKey_() ? "AI gateway ถูกปิดในระบบ" : "ไม่พบ GEMINI_API_KEY");
        _checkGeminiRateLimit_(payload.token);
        var amounts = rows.map(function (r) {
            return Number(r.amount || r.budget || r.budgetAmount || r.totalAmount || 0);
        }).filter(function (n) {
            return isFinite(n) && n > 0;
        }), avg = amounts.reduce(function (a, b) {
            return a + b;
        }, 0) / Math.max(1, amounts.length), variance = amounts.reduce(function (a, b) {
            return a + Math.pow(b - avg, 2);
        }, 0) / Math.max(1, amounts.length), std = Math.sqrt(variance), anomalies = rows.filter(function (r) {
            var amount = Number(r.amount || r.budget || r.budgetAmount || r.totalAmount || 0);
            return amount > avg + 2 * std && amount > 0;
        }).slice(0, 10).map(function (r) {
            return {
                id: r.id || r.importId || "", type: r.entryType || r.type || r.category || r.item || "รายการงบประมาณ", amount: Number(r.amount || r.budget || r.budgetAmount || r.totalAmount || 0), reason: "จำนวนเงินเบี่ยงเบนจากค่าเฉลี่ย " + (Math.abs(Number(r.amount || r.budget || r.budgetAmount || r.totalAmount || 0) - avg) / (std || 1)).toFixed(1) + " SD"
            };
        }), cacheKey = "anomaly_" + fy + "_" + rows.length + "_" + anomalies.length, summary = cachedGeminiCall_(cacheKey, function () {
            if (!anomalies.length)
                return local.summary;
            var text = anomalies.slice(0, 5).map(function (a) {
                return "- " + a.type + ": " + Number(a.amount).toLocaleString() + " บาท (" + a.reason + ")";
            }).join(`
`), prompt = [
                "วิเคราะห์รายการงบประมาณผิดปกติต่อไปนี้:", text, "ค่าเฉลี่ยรายการ: " + Math.round(avg).toLocaleString() + " บาท", "", "สรุปความเสี่ยงและข้อแนะนำ ภาษาไทย 2-3 ประโยค"
            ].join(`
`);
            return _runAiGatewayText_(prompt, {
                temperature: .3, maxOutputTokens: 400
            });
        }, 3600);
        return ok_({
            anomalies, summary: summary || local.summary, avgAmount: Math.round(avg), stdAmount: Math.round(std), usedLocalResult: !summary
        });
    }
    catch (e) {
        _recordWarning_("current.silent.code.40.ai.020", e);
        var defaultValue = _aiBudgetAnomalyLocal_(Array.isArray(payload.rows) ? payload.rows : [], payload.fy);
        return defaultValue.warning = _aiUserFacingError_(e), _aiOk_(defaultValue, "วิเคราะห์ความผิดปกติงบประมาณสำเร็จ", "budget.anomaly");
    }
}
function _budgetTrendSummaryLocal_(rows) {
    if (rows = Array.isArray(rows) ? rows : [], !rows.length)
        return "ไม่มีข้อมูลงบประมาณสำหรับวิเคราะห์";
    var totalBudget = 0, totalSpent = 0, top = rows.slice().map(function (row) {
        var amount = Number(row.amount || row.budget || row.budgetAmount || 0), spent = Number(row.spentAmount || row.spent || row.disbursedAmount || 0);
        return totalBudget += amount, totalSpent += spent, {
            name: String(row.projectName || row.project || row.title || row.item || row.category || "ไม่ระบุรายการ"), amount, spent, status: String(row.status || row.state || "").trim()
        };
    }).sort(function (a, b) {
        return b.amount - a.amount;
    }), remaining = Math.max(totalBudget - totalSpent, 0), spentPct = totalBudget > 0 ? Math.round(totalSpent / totalBudget * 100) : 0, statusCounts = {};
    top.forEach(function (item) {
        var key = item.status || "ไม่ระบุสถานะ";
        statusCounts[key] = Number(statusCounts[key] || 0) + 1;
    });
    var topStatus = Object.keys(statusCounts).sort(function (a, b) {
        return statusCounts[b] - statusCounts[a];
    }).slice(0, 3).map(function (name) {
        return name + " " + statusCounts[name] + " รายการ";
    }).join(", "), topItems = top.slice(0, 3).map(function (item, idx) {
        return idx + 1 + ") " + item.name + " " + Number(item.amount || 0).toLocaleString("th-TH") + " บาท";
    }).join(`
`);
    return [
        "สรุปงบประมาณรวม " + Number(totalBudget || 0).toLocaleString("th-TH") + " บาท เบิกจ่ายแล้ว " + Number(totalSpent || 0).toLocaleString("th-TH") + " บาท (" + spentPct + "%) คงเหลือ " + Number(remaining || 0).toLocaleString("th-TH") + " บาท", topStatus ? "สถานะที่พบมาก: " + topStatus : "", topItems ? `รายการวงเงินสูงสุด:
` + topItems : ""
    ].filter(Boolean).join(`
`);
}
function apiGenerateBudgetTrendSummary(payload) {
    if (payload = payload || {}, _aiIsInitialLoadPayload_(payload))
        return _aiLazyDeferredResult_("budget.trend", "เลื่อน AI Budget Summary เป็น lazy load เพื่อไม่ให้กระทบการโหลดงบประมาณ");
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    var rows = Array.isArray(payload.budgetData) ? payload.budgetData : [];
    if (!rows.length && payload.fy) {
        var imports = normalizeResult_(listBudgetImportRecordsByFY(String(payload.fy || "")), "โหลดข้อมูลงบประมาณสำเร็จ", "โหลดข้อมูลงบประมาณไม่สำเร็จ");
        rows = imports && imports.ok && imports.data && Array.isArray(imports.data.rows) ? imports.data.rows : [];
    }
    var localSummary = _budgetTrendSummaryLocal_(rows);
    if (!rows.length)
        return ok_({
            summary: localSummary, totalRows: 0, usedLocalResult: !0
        }, "ไม่มีข้อมูลงบประมาณสำหรับวิเคราะห์");
    try {
        if (!_getGeminiKey_())
            return ok_({
                summary: localSummary, totalRows: rows.length, usedLocalResult: !0
            }, "สรุปข้อมูลงบประมาณสำเร็จ");
        _checkGeminiRateLimit_(payload.token);
        var prompt = [
            "สรุปแนวโน้มงบประมาณภาษาไทยแบบผู้บริหาร", "จำนวนรายการ: " + rows.length, localSummary, "เขียนสรุปสั้น 2-4 ประโยค พร้อมข้อเสนอแนะ 1-2 ข้อ โดยอิงจากข้อมูลที่ให้เท่านั้น"
        ].join(`

`), summary = _runAiGatewayText_(prompt, {
            temperature: .3, maxOutputTokens: 400
        });
        return ok_({
            summary: summary || localSummary, totalRows: rows.length, usedLocalResult: !summary
        }, "สรุปข้อมูลงบประมาณสำเร็จ");
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.021", e), ok_({
            summary: localSummary, totalRows: rows.length, usedLocalResult: !0, warning: e && e.message ? e.message : String(e)
        }, "สรุปข้อมูลงบประมาณสำเร็จ");
    }
}
function apiAiDashboardInsights(payload) {
    if (payload = typeof AppAiGateway != "undefined" && AppAiGateway.guard ? AppAiGateway.guard(payload || {}, "apiAiDashboardInsights") : payload || {}, payload = payload || {}, _aiIsInitialLoadPayload_(payload))
        return _aiLazyDeferredResult_("dashboard.insights", "เลื่อน AI Dashboard insights เป็น lazy load เพื่อไม่ให้กระทบการโหลด Dashboard");
    var _aiSess = requireAuth_(payload, "viewer");
    _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
    var bundleRes = apiGetDashboardBundle({
        includeSchema: !1, includeHealth: !1, includeReportOptions: !1, includeBudget: !1, includeCases: !1, cacheTtlSeconds: 90, token: payload.token, _token: payload._token
    }), bundle = bundleRes && bundleRes.data ? bundleRes.data : bundleRes || {}, summary = bundle.summary || {}, stats = bundle.stats || {}, localInsightLines = [
        "ภาพรวมระบบ: เรื่องทั้งหมด " + Number(summary.totalCases || 0).toLocaleString("th-TH") + " เรื่อง อยู่ระหว่างดำเนินการ " + Number(summary.pendingCases || 0).toLocaleString("th-TH") + " เรื่อง", "หนังสือติดตามเลยกำหนด " + Number(summary.overdueLetters || stats.letters && stats.letters.overdue || 0).toLocaleString("th-TH") + " ฉบับ และใกล้ครบกำหนด " + Number(summary.soonOverdue || stats.letters && stats.letters.soonDue || 0).toLocaleString("th-TH") + " ฉบับ", Number(summary.overdueLetters || 0) > 0 ? "ควรเร่งติดตามรายการเลยกำหนดก่อน และจัดลำดับงานตามวันครบกำหนด" : "ยังไม่พบสัญญาณเร่งด่วนระดับสูงในหนังสือติดตาม"
    ].join(`
`);
    try {
        if (_aiAssertLazyInvocation_(payload, "dashboard.insights"), !_getGeminiKey_())
            return _aiOk_({
                aiInsights: localInsightLines, dashboard: summary, stats, usedLocalResult: !0
            }, "โหลด AI Dashboard insights สำเร็จ", "dashboard.insights");
        _checkGeminiRateLimit_(payload.token);
        var prompt = [
            "สรุป Dashboard สำหรับผู้บริหาร ภาษาไทย 2-3 ประโยค", localInsightLines, "ให้ระบุสิ่งที่ควรทำก่อน 1-2 ข้อ โดยอิงจากข้อมูลนี้เท่านั้น"
        ].join(`

`), aiInsights = _runAiGatewayText_(prompt, {
            temperature: .3, maxOutputTokens: 300
        }, {
            feature: "dashboard.insights", defaultText: localInsightLines
        });
        return _aiOk_({
            aiInsights: aiInsights || localInsightLines, dashboard: summary, stats, usedLocalResult: !aiInsights
        }, "โหลด AI Dashboard insights สำเร็จ", "dashboard.insights");
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.022", e), _aiOk_({
            aiInsights: localInsightLines, dashboard: summary, stats, usedLocalResult: !0, warning: e && e.message ? e.message : String(e)
        }, "โหลด AI Dashboard insights สำเร็จ", "dashboard.insights");
    }
}
function apiGenerateExecutiveSummary(budgetData) {
    return apiGenerateBudgetTrendSummary({
        budgetData
    });
}
var AppNotificationGateway = __APP_GLOBAL__.AppNotificationGateway = __APP_GLOBAL__.AppNotificationGateway || {};
AppNotificationGateway.VERSION = "notification-line-scheduled-owner-current", AppNotificationGateway.policy = Object.freeze({
    owner: "Code_22_AiGateway.gs.AppNotificationGateway", channel: "LINE", scheduledOnly: !0, acceptsExternalTokenArgument: !1, secretsOwner: "ScriptProperties.LINE_TOKEN/LINE_TARGET_ID", aiRouteMutation: !1
}), AppNotificationGateway.isConfigured = function () {
    return !!(_getLineToken_() && _getLineTarget_());
}, AppNotificationGateway.sendLineText = function (textMsg) {
    var token = _getLineToken_(), targetId = _getLineTarget_(), text = String(textMsg || "").trim();
    if (!token || !targetId)
        throw new Error("LINE_NOTIFICATION_NOT_CONFIGURED");
    if (!text)
        throw new Error("LINE_NOTIFICATION_EMPTY_MESSAGE");
    text.length > 5e3 && (text = text.slice(0, 4990) + `
\u2026`), _appIsFnName_("_assertTrustedExternalUrl_") && _assertTrustedExternalUrl_("https://api.line.me/current/bot/message/push", "line.push");
    var response = UrlFetchApp.fetch("https://api.line.me/current/bot/message/push", {
        method: "post", headers: {
            "Content-Type": "application/json", Authorization: "Bearer " + token
        }, payload: JSON.stringify({
            to: targetId, messages: [
                {
                    type: "text", text
                }
            ]
        }), muteHttpExceptions: !0
    }), status = Number(response && response.getResponseCode ? response.getResponseCode() : 0);
    if (status < 200 || status >= 300) {
        var error = new Error("LINE_NOTIFICATION_HTTP_" + status);
        throw error.errorCode = "LINE_NOTIFICATION_HTTP_ERROR", error;
    }
    return {
        ok: !0, status, owner: AppNotificationGateway.policy.owner
    };
};
function checkOverdueLettersAndNotify() {
    if (!AppNotificationGateway.isConfigured())
        return {
            ok: !1, skipped: !0, reason: "LINE_NOTIFICATION_NOT_CONFIGURED"
        };
    try {
        var today = new Date;
        today.setHours(0, 0, 0, 0);
        var letters = filterDeleted_(cachedSheetObjects_("Letters")), months = [
            "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
        ], overdueLetters = [], soonLetters = [];
        letters.forEach(function (row) {
            if (!(String(row.letterStatus || "") === "ได้รับแล้ว" || !row.dueDate)) {
                var due = new Date(row.dueDate);
                due.setHours(0, 0, 0, 0);
                var diff = Math.round((due - today) / 864e5);
                diff < 0 ? overdueLetters.push({
                    agency: String(row.agency || ""), subject: String(row.subject || row.issue || ""), opStaff: String(row.opStaff || row.officer || "-"), dueDate: due.getDate() + " " + months[due.getMonth()] + " " + (due.getFullYear() + 543), overdueDays: Math.abs(diff)
                }) : diff <= 3 && soonLetters.push({
                    agency: String(row.agency || ""), subject: String(row.subject || row.issue || ""), daysLeft: diff
                });
            }
        });
        var lines = [];
        return overdueLetters.length > 0 && (lines.push("\u{1F6A8} หนังสือเลยกำหนด " + overdueLetters.length + " รายการ:"), overdueLetters.slice(0, 5).forEach(function (letter, index) {
            lines.push(index + 1 + ". " + letter.agency + " \u2014 " + letter.subject + `
\u{1F464}` + letter.opStaff + " \u23F0 " + letter.dueDate + " (เกิน " + letter.overdueDays + " วัน)");
        })), soonLetters.length > 0 && (lines.push(`
\u26A0\uFE0F ใกล้ครบกำหนด` + soonLetters.length + " รายการ:"), soonLetters.forEach(function (letter, index) {
            lines.push(index + 1 + ". " + letter.agency + " \u2014 " + letter.subject + " (อีก " + letter.daysLeft + " วัน)");
        })), lines.length ? AppNotificationGateway.sendLineText(lines.join(`
`)) : {
            ok: !0, skipped: !0, reason: "NO_NOTIFICATION_ITEMS"
        };
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("notification.line.overdue", e), {
            ok: !1, error: String(e && e.message || e)
        };
    }
}
function sendDailyBriefingToLine() {
    if (!AppNotificationGateway.isConfigured() || !_getGeminiKey_())
        return {
            ok: !1, skipped: !0, reason: "DAILY_BRIEFING_NOT_CONFIGURED"
        };
    try {
        _checkGeminiRateLimit_("system-scheduled-daily-briefing");
        var data = _buildDailyBriefingData_({
            source: "system-scheduled-line-briefing"
        }), message = "\u{1F4CB} Daily Briefing " + data.date + `

` + data.briefing + `

\u{1F4CA}เรื่องรอดำเนินการ:` + data.pendingCases + " | หนังสือเลยกำหนด: " + data.overdueLetters;
        return AppNotificationGateway.sendLineText(message);
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("notification.line.dailyBriefing", e), {
            ok: !1, error: String(e && e.message || e)
        };
    }
}
function _bFormatDate(d) {
    if (!d)
        return "";
    try {
        return Object.prototype.toString.call(d) === "[object Date]" && !isNaN(d.getTime()) ? Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd") : String(d).trim();
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.023", e), String(d || "").trim();
    }
}
function apiMeetingSmartSummary(payload) {
    payload = payload || {};
    var _aiSess;
    try {
        _aiSess = requireAuth_(payload, "staff");
    }
    catch (authErr) {
        return err_("ไม่สามารถสรุปการประชุมได้: ไม่พบ token การใช้งาน กรุณาเข้าสู่ระบบใหม่แล้วลองอีกครั้ง", {
            authRequired: !0, route: "apiMeetingSmartSummary", error: String(authErr && authErr.message || authErr)
        });
    }
    try {
        _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
        var text = String(payload.text || payload.meetingText || "").trim(), context = String(payload.context || "").trim();
        if (!text && !context)
            return err_("ไม่มีข้อมูลการประชุมสำหรับสรุป");
        var combined = [
            context, text
        ].filter(Boolean).join(`

`), ai = EnterpriseAiService.summarize({
            mode: "meeting", text: combined, rows: Array.isArray(payload.rows) ? payload.rows : []
        }), draft = "";
        try {
            draft = cachedGeminiCall_(buildAiCacheKey_("meeting-draft", combined, []), function () {
                var prompt = `คุณคือผู้ช่วยร่างหนังสือราชการภาษาไทย ให้จัดทำ"ร่างหนังสือ"แบบกระชับจากข้อมูลการประชุมต่อไปนี้

` + combined;
                return _runAiGatewayText_(prompt, {
                    temperature: .2, maxOutputTokens: 768
                });
            }, 3600);
        }
        catch (_e) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("ai.silentLocalResult", _e);
        }
        return ok_({
            summary: ai.summary || "", generatedAt: ai.generatedAt || new Date().toISOString(), draftLetter: draft || "", mode: "meeting"
        }, "สรุปการประชุมสำเร็จ");
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.024", e), err_(_aiUserFacingError_(e));
    }
}
function apiPredictiveBudgeting(payload) {
    payload = payload || {};
    var _aiSess;
    try {
        _aiSess = requireAuth_(payload, "viewer"), _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
        var fy = String(payload.fy || ""), summary = getBudgetSummaryByFY({
            fy, limit: 500
        });
        if (!summary || !summary.ok)
            return err_("ไม่สามารถโหลดข้อมูลงบประมาณได้");
        var rows = summary.data && summary.data.rows || [], alerts = rows.map(function (r) {
            var budget = Number(r.budget || 0), spent = Number(r.spent || r.expense || 0), remain = Number(r.remain != null ? r.remain : budget - spent), burnRate = budget > 0 ? spent / budget : 0;
            return {
                planGroup: String(r.planGroup || r.category || ""), item: String(r.item || ""), budget, spent, remain, burnRate, riskLevel: burnRate >= .9 ? "critical" : burnRate >= .75 ? "high" : burnRate >= .5 ? "medium" : "low"
            };
        }).filter(function (r) {
            return r.budget > 0;
        }).sort(function (a, b) {
            return b.burnRate - a.burnRate;
        }).slice(0, 20), narrative = "";
        try {
            narrative = EnterpriseAiService.summarize({
                mode: "budget-trend", rows: alerts, text: "วิเคราะห์แนวโน้มการใช้งบประมาณ FY " + fy
            }), narrative = narrative.summary || "";
        }
        catch (_e) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("ai.silentLocalResult", _e);
        }
        return ok_({
            fy, rows: alerts, narrative
        }, "วิเคราะห์แนวโน้มงบประมาณสำเร็จ");
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.025", e), err_(_aiUserFacingError_(e));
    }
}
function apiSuggestCaseClassification(payload) {
    payload = payload || {};
    var _aiSess;
    try {
        _aiSess = requireAuth_(payload, "viewer"), _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
        var title = String(payload.title || payload.caseTitle || "").trim(), description = String(payload.description || payload.detail || "").trim(), text = [
            title, description
        ].join(" ").toLowerCase();
        if (!text)
            throw new Error("กรุณาระบุชื่อเรื่องหรือรายละเอียด");
        var suggestedCategory = "เรื่องร้องเรียนทั่วไป", suggestedStatus = "เรื่องเข้าใหม่", riskLevel = "ปกติ";
        /ทุจริต|ประพฤติมิชอบ|ผลประโยชน์ทับซ้อน/.test(text) ? suggestedCategory = "ทุจริตและประพฤติมิชอบ" : /งบประมาณ|จัดซื้อ|จัดจ้าง|โครงการ/.test(text) ? suggestedCategory = "งบประมาณและโครงการ" : /บุคลากร|เจ้าหน้าที่|ข้าราชการ|วินัย/.test(text) && (suggestedCategory = "บุคลากรและวินัย"), /ด่วน|เร่งด่วน|เสียหายร้ายแรง|ทันที/.test(text) ? (suggestedStatus = "รอพิจารณา", riskLevel = "สูง") : /ติดตาม|ทวงถาม|ค้าง/.test(text) && (suggestedStatus = /ส่ง.*หน่วยงาน|ทำหนังสือ|หนังสือติดตาม/.test(text) ? "ส่งหน่วยงาน" : "รอพิจารณา", riskLevel = "ปานกลาง");
        var aiAdvice = "";
        if (_getGeminiKey_())
            try {
                aiAdvice = cachedGeminiCall_("casecls_" + _appSha256Hex_(title + "|" + description).substring(0, 16), function () {
                    var prompt = [
                        "ช่วยจัดกลุ่มเรื่องร้องเรียนเบื้องต้นจากข้อมูลนี้", "ชื่อเรื่อง: " + title, "รายละเอียด: " + description, "ตอบ JSON เท่านั้น โดยมี key: category,status,riskLevel,reason"
                    ].join(`
`);
                    return _runAiGatewayText_(prompt, {
                        temperature: .1, maxOutputTokens: 300
                    });
                }, 1800);
            }
            catch (_aiErr) {
                _appIsFnName_("_recordWarning_") && _recordWarning_("ai.silent.code_40_ai_services.008", _aiErr);
            }
        var parsed = parseGeminiJsonText_ ? parseGeminiJsonText_(aiAdvice, {}) : {};
        return ok_({
            suggested: {
                category: parsed.category || suggestedCategory, status: _aiNormalizeCaseStatus_(parsed.status || suggestedStatus, {
                    defaultStatus: suggestedStatus
                }), statusRaw: String(parsed.status || suggestedStatus), riskLevel: parsed.riskLevel || riskLevel
            }, reason: parsed.reason || "ใช้กฎ heuristic + AI advisory", source: parsed.category ? "ai+heuristic" : "heuristic"
        }, "วิเคราะห์หมวดหมู่เรื่องสำเร็จ");
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.026", e), err_(_aiUserFacingError_(e));
    }
}
function apiAnalyzeWorkloadBottlenecks(payload) {
    payload = payload || {};
    var _aiSess;
    try {
        _aiSess = requireAuth_(payload, "viewer"), _aiGatewayCheckUserQuota_(String(_aiSess && (_aiSess.username || _aiSess.email) || payload.username || payload.email || ""));
        var comms = filterDeleted_(cachedSheetObjects_("Personnel_Comm")), ops = filterDeleted_(cachedSheetObjects_("Personnel_Op")), staffs = filterDeleted_(cachedSheetObjects_("Personnel_Staff")), cases = filterDeleted_(cachedSheetObjects_("MainData")), letters = filterDeleted_(cachedSheetObjects_("Letters")), openCases = cases.filter(function (r) {
            return _aiIsOpenCaseStatus_(r.status);
        }), overdueLetters = letters.filter(function (r) {
            return String(r.letterStatus || "") !== "ได้รับแล้ว" && r.dueDate && new Date(r.dueDate) < new Date;
        }), workloadPerStaff = openCases.length / Math.max(1, staffs.length + comms.length + ops.length), bottleneckScore = Math.min(100, Math.round(workloadPerStaff * 8 + overdueLetters.length * 4)), staffingAdvice = [];
        return workloadPerStaff > 5 && staffingAdvice.push("ควรเพิ่มกำลังเจ้าหน้าที่ฝ่ายเลขานุการหรือกระจายงานค้าง"), overdueLetters.length > 10 && staffingAdvice.push("จัดชุดติดตามหนังสือเฉพาะกิจเพื่อลดรายการเกินกำหนด"), staffingAdvice.length || staffingAdvice.push("กำลังคนปัจจุบันเพียงพอในระดับเบื้องต้น แต่ควรติดตามแนวโน้มรายสัปดาห์"), ok_({
            openCases: openCases.length, overdueLetters: overdueLetters.length, personnel: {
                comms: comms.length, ops: ops.length, staffs: staffs.length
            }, workloadPerStaff: Number(workloadPerStaff.toFixed(2)), bottleneckScore, staffingRecommendations: staffingAdvice
        }, "วิเคราะห์ bottleneck และ staffing สำเร็จ");
    }
    catch (e) {
        return _recordWarning_("current.silent.code.40.ai.027", e), err_(_aiUserFacingError_(e));
    }
}
function apiAiAssistantAsk(payload) {
    if (payload = typeof AppAiGateway != "undefined" && AppAiGateway.guard ? AppAiGateway.guard(payload || {}, "apiAiAssistantAsk") : payload || {}, payload = payload || {}, _aiIsInitialLoadPayload_(payload))
        return _aiLazyDeferredResult_("assistant.ask", "เลื่อนผู้ช่วย AI เป็น lazy load เพื่อไม่ให้กระทบการโหลดหน้าหลัก");
    var question = String(payload.question || payload.message || "").trim(), context = payload.context || {};
    if (!question)
        return {
            ok: !1, msg: "กรุณาระบุคำถาม"
        };
    try {
        var safeQuestion = _aiAssistantTrimText_(question, 2400), safeContext = _aiAssistantTrimContext_(context, 3600);
        if (typeof apiChat != "function")
            return {
                ok: !1, msg: "AI gateway ยังไม่พร้อมใช้งาน กรุณาตั้งค่าและเปิดใช้ apiChat/Gemini gateway ก่อนใช้งานผู้ช่วย AI", data: {
                    aiMode: "gateway-required", contextUsed: safeContext
                }
            };
        var chatPayload = Object.assign({}, payload, {
            message: safeQuestion, question: safeQuestion, systemContext: _aiAssistantBuildSystemContext_(safeContext), history: Array.isArray(payload.history) ? payload.history.slice(-6) : []
        }), chat = apiChat(chatPayload), chatData = chat && chat.data ? chat.data : chat;
        if (chat && chat.ok === !1)
            throw new Error(chat.msg || chat.error || "AI gateway ไม่สำเร็จ");
        var answer = String(chatData && (chatData.reply || chatData.answer || chatData.text) || "").trim();
        if (!answer)
            throw new Error("AI gateway ไม่ได้ส่งคำตอบกลับมา");
        return {
            ok: !0, data: {
                answer, aiMode: "gemini-gateway", suggestedQuestions: _aiAssistantSuggestedQuestions_(safeContext), contextUsed: safeContext, tokenBudget: {
                    questionChars: safeQuestion.length, contextTrimmed: !!safeContext.trimmed
                }
            }
        };
    }
    catch (error) {
        return _recordWarning_("current.silent.code.40.ai.028", error), {
            ok: !1, msg: _aiAssistantUserFacingError_(error), data: {
                aiMode: "gateway-error"
            }
        };
    }
}
function _aiAssistantJobCacheKey_(jobId) {
    return "ai-job:" + String(jobId || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 80);
}
function _aiAssistantJobOwner_(session, payload) {
    session = session || {}, payload = payload || {};
    var principal = String(session.userId || session.username || session.email || "").trim().toLowerCase(), token = String(payload.token || payload._token || "").trim();
    return {
        principalHash: _appSha256Hex_("ai-job-owner|" + principal).substring(0, 24), sessionFingerprint: _appIsFnName_("_sessionMetaTokenFingerprint_") ? _sessionMetaTokenFingerprint_(token) : _appSha256Hex_("ai-job-session|" + token).substring(0, 12), role: String(session.role || "viewer").toLowerCase(), ownerStamp: "ai-job-owner-session-v1"
    };
}
function _aiAssistantJobOwnedBy_(job, owner) {
    var stored = job && job._securityOwner || {};
    return owner = owner || {}, !!stored.principalHash && stored.principalHash === owner.principalHash && !!stored.sessionFingerprint && stored.sessionFingerprint === owner.sessionFingerprint;
}
function _aiAssistantPublicJob_(job) {
    var out = Object.assign({}, job || {});
    return delete out._securityOwner, out;
}
function _aiAssistantPutJob_(job) {
    try {
        _AppScriptCache_().put(_aiAssistantJobCacheKey_(job.jobId), JSON.stringify(job || {}), 900);
    }
    catch (_cacheErr) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("ai.silent.code_40_ai_services.009", _cacheErr);
    }
    return job;
}
function _aiAssistantGetJob_(jobId) {
    try {
        var raw = _AppScriptCache_().get(_aiAssistantJobCacheKey_(jobId));
        return raw ? JSON.parse(raw) : null;
    }
    catch (_cacheErr) {
        return _recordWarning_("current.ai.systemPrompt.cacheRead", _cacheErr), null;
    }
}
function apiAiAssistantStartJob(payload) {
    payload = payload || {};
    var boundary = _routerAuthorizedEntry_("apiAiAssistantStartJob", payload, "viewer");
    if (!boundary.ok)
        return boundary.result;
    if (_aiIsInitialLoadPayload_(payload))
        return _aiLazyDeferredResult_("assistant.job.start", "เลื่อนงาน AI เป็น lazy load เพื่อไม่ให้กระทบการโหลดหน้าหลัก");
    var jobId = "ai_" + Utilities.getUuid().replace(/-/g, "").slice(0, 24), startedAt = new Date().toISOString(), job = {
        jobId, status: "running", progress: 10, startedAt, updatedAt: startedAt, aiStreamingPolicy: "gas-no-native-streaming-use-job-polling", message: "เริ่มประมวลผล AI", _securityOwner: _aiAssistantJobOwner_(boundary.session, payload)
    };
    _aiAssistantPutJob_(job);
    try {
        var result = apiAiAssistantAsk(payload);
        return job.status = result && result.ok ? "complete" : "error", job.progress = 100, job.result = result, job.updatedAt = new Date().toISOString(), job.message = job.status === "complete" ? "ประมวลผล AI สำเร็จ" : result && (result.msg || result.error) || "AI ไม่สำเร็จ", _aiAssistantPutJob_(job), {
            ok: !0, data: _aiAssistantPublicJob_(job), msg: "สร้างงาน AI แบบ polling สำเร็จ"
        };
    }
    catch (error) {
        return _recordWarning_("current.silent.code.40.ai.029", error), job.status = "error", job.progress = 100, job.error = _aiAssistantUserFacingError_(error), job.updatedAt = new Date().toISOString(), job.message = job.error, _aiAssistantPutJob_(job), {
            ok: !0, data: _aiAssistantPublicJob_(job), msg: "สร้างงาน AI แล้วแต่ประมวลผลไม่สำเร็จ"
        };
    }
}
function apiAiAssistantGetJob(payload) {
    payload = payload || {};
    var boundary = _routerAuthorizedEntry_("apiAiAssistantGetJob", payload, "viewer");
    if (!boundary.ok)
        return boundary.result;
    var jobId = String(payload.jobId || payload.id || "").trim();
    if (!jobId)
        return {
            ok: !1, msg: "กรุณาระบุ jobId"
        };
    var job = _aiAssistantGetJob_(jobId), owner = _aiAssistantJobOwner_(boundary.session, payload);
    if (!job || !_aiAssistantJobOwnedBy_(job, owner)) {
        try {
            job && _appIsFnName_("_safeAudit_") && _safeAudit_("security.aiJobOwnershipDenied", {
                jobIdHash: _appSha256Hex_(jobId).substring(0, 16), reason: "owner-or-session-mismatch"
            });
        }
        catch (_auditErr) {
            _recordWarning_("ai.job.ownership.audit", _auditErr);
        }
        return {
            ok: !1, msg: "ไม่พบงาน AI หรือหมดอายุแล้ว", data: {
                jobId, status: "expired"
            }, errorCode: "AI_JOB_NOT_AVAILABLE"
        };
    }
    return {
        ok: !0, data: _aiAssistantPublicJob_(job), msg: "โหลดสถานะงาน AI สำเร็จ"
    };
}
function apiAiAssistantSummarizeCase(payload) {
    if (payload = payload || {}, _aiIsInitialLoadPayload_(payload))
        return _aiLazyDeferredResult_("assistant.case.summary", "เลื่อน AI สรุปเรื่องเป็น lazy load เพื่อไม่ให้กระทบการโหลดหน้าหลัก");
    var caseId = String(payload.caseId || "").trim();
    if (!caseId)
        return {
            ok: !1, msg: "กรุณาระบุ caseId"
        };
    try {
        var bundle = typeof apiGetCanonicalCaseBundle == "function" ? apiGetCanonicalCaseBundle({
            caseId, id: caseId
        }) : {
            ok: !1, msg: "Canonical bundle API not available"
        }, data = bundle && bundle.data ? bundle.data : bundle, summary = _aiAssistantSummarizeCanonicalBundle_(data, payload.question || "");
        return {
            ok: !0, data: {
                answer: summary, suggestedQuestions: _aiAssistantSuggestedQuestions_({
                    caseId
                }), contextUsed: {
                    caseId
                }
            }
        };
    }
    catch (error) {
        return _recordWarning_("current.silent.code.40.ai.030", error), {
            ok: !1, msg: error && error.message ? error.message : String(error || "Case summary failed")
        };
    }
}
function _aiAssistantTrimText_(value, maxChars) {
    maxChars = Math.max(200, Number(maxChars || 2e3));
    var text = String(value == null ? "" : value);
    return text.length > maxChars ? text.substring(0, maxChars) + `
...[ตัดข้อความเพื่อควบคุม token budget]...` : text;
}
function _aiAssistantTrimContext_(context, maxChars) {
    maxChars = Math.max(500, Number(maxChars || 3600));
    var json = "";
    try {
        json = JSON.stringify(context || {});
    }
    catch (_jsonErr) {
        _recordWarning_("current.silent.code.40.ai.031", _jsonErr), json = String(context || "");
    }
    if (json.length > maxChars)
        return {
            summary: json.substring(0, maxChars) + "...[trimmed]", trimmed: !0
        };
    try {
        return JSON.parse(json);
    }
    catch (_parseErr) {
        return _recordWarning_("current.silent.code.40.ai.032", _parseErr), {
            summary: json
        };
    }
}
function _aiAssistantBuildSystemContext_(context) {
    var brief = "";
    try {
        brief = JSON.stringify(context || {}).substring(0, 3600);
    }
    catch (_ctxErr) {
        _recordWarning_("current.silent.code.40.ai.033", _ctxErr), brief = String(context || "").substring(0, 3600);
    }
    return `คุณคือผู้ช่วยระบบคณะกรรมาธิการ ตอบภาษาไทยแบบกระชับ ถูกต้อง และยึดข้อมูลระบบเป็นหลัก
บริบทระบบ:
` + brief;
}
function _aiAssistantUserFacingError_(error) {
    var message = String(error && error.message || error || "AI assistant failed");
    return /quota|429|rate/i.test(message) ? "โควตา AI เต็มหรือมีการใช้งานหนาแน่น กรุณาลองใหม่อีกครั้ง" : /GEMINI_API_KEY|key/i.test(message) ? "ยังไม่ได้ตั้งค่า GEMINI_API_KEY สำหรับ AI" : /timeout|network|fetch/i.test(message) ? "เชื่อมต่อบริการ AI ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" : message;
}
function _aiAssistantSummarizeCanonicalBundle_(bundle, question) {
    bundle = bundle || {};
    var c = bundle.case || {}, history = Array.isArray(bundle.history) ? bundle.history : [], letters = Array.isArray(bundle.letters) ? bundle.letters : [], latestMeeting = history.length ? history[0] : null, latestLetter = letters.length ? letters[0] : null, lines = [];
    return lines.push("สรุปเรื่อง: " + (c.title || c.caseTitle || c.subject || "-")), lines.push("เลขคดี/เลขรับเรื่อง: " + (c.caseId || c.recNo || "-")), lines.push("สถานะปัจจุบัน: " + (c.status || "-")), latestMeeting && lines.push("มติ/ผลการประชุมล่าสุด: " + (latestMeeting.resolution || latestMeeting.topic || latestMeeting.notes || "-")), latestLetter && lines.push("หนังสือติดตามล่าสุด: " + (latestLetter.letterNo || "-") + " / " + (latestLetter.status || "-")), question && lines.push("คำถาม: " + question), lines.join(`
`);
}
function _aiAssistantSuggestedQuestions_(context) {
    var list = [
        "ช่วยสรุปมติประชุมล่าสุดให้หน่อย", "เรื่องนี้มีหนังสือติดตามค้างกี่ฉบับ", "ควรดำเนินการขั้นตอนถัดไปอย่างไร"
    ];
    return context && context.caseId && list.unshift("ช่วยสรุปเรื่อง " + context.caseId + " แบบย่อ"), list;
}
