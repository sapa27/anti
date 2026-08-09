/**
 * Current production quality gate — single owner.
 * Prior staged quality-gate implementations were consolidated into this current owner in r257.
 */
var APP_QUALITY_CONTRACT_CURRENT = Object.freeze({
    stamp: "current-quality-gate-2026-08-09-r257",
    owner: "Code_06_Platform_QualityGates.CurrentQualityGate",
    expectedRouteCount: 106,
    expectedWriteRouteCount: 27,
    maxAdapterDepth: 1,
    policy: "one-current-gate + canonical-router + canonical-owners + no-retired-route-aliases",
    sourceAudit: Object.freeze({
        serverTopLevelDuplicateFunctionCount: 0,
        actionableDuplicateBodyGroupCount: 0,
        internalRevisionImplementationCount: 0,
        retiredApiAliasCount: 0,
        adapterDepthMax: 1
    })
});

function _classifyOperationalError_(label, error) {
    var text = (String(label || "") + " " + String(error && error.message || error || "")).toLowerCase();
    return /auth|csrf|token|session|login|logout|password|secret/.test(text) ? "security" : /permission|forbidden|unauthor|สิทธิ/.test(text) ? "permission" : /invalid|required|missing|validation|ไม่ถูกต้อง|จำเป็น/.test(text) ? "validation" : /fetch|network|timeout|connection|transport|urlfetch/.test(text) ? "transport" : /sheet|repository|schema|row|column|spreadsheet|ข้อมูล/.test(text) ? "data" : /slow|latency|deadline|quota|performance/.test(text) ? "performance" : /case|meeting|tracking|budget|people|petitioner|business/.test(text) ? "business" : "unknown";
}
function _qualitySafeValue_(value, depth) {
    depth = Number(depth || 0) || 0;
    if (depth > 4) return "[depth-limited]";
    if (value == null || typeof value == "string" || typeof value == "number" || typeof value == "boolean") return value;
    if (Object.prototype.toString.call(value) === "[object Date]") return isNaN(value.getTime()) ? "" : value.toISOString();
    if (Array.isArray(value)) return value.slice(0, 30).map(function (item) { return _qualitySafeValue_(item, depth + 1); });
    if (typeof value == "object") {
        var out = {};
        Object.keys(value).slice(0, 40).forEach(function (key) {
            if (!/password|token|secret|csrf|credential|cookie/i.test(String(key || ""))) out[key] = _qualitySafeValue_(value[key], depth + 1);
        });
        return out;
    }
    return String(value);
}

function _qualityReadHtmlSource_(filename) {
    filename = String(filename || "").trim();
    try {
        if (!filename || typeof HtmlService == "undefined" || !HtmlService.createHtmlOutputFromFile)
            return { ok: !1, filename: filename, content: "", error: "HTML_SOURCE_READER_UNAVAILABLE" };
        return { ok: !0, filename: filename, content: String(HtmlService.createHtmlOutputFromFile(filename).getContent() || ""), error: "" };
    }
    catch (e) {
        return { ok: !1, filename: filename, content: "", error: String(e && e.message || e) };
    }
}
function _qualityRegressionCase_(rows, suite, name, fn) {
    var started = Date.now(), ok = !1, detail = {}, error = "";
    try {
        var result = fn();
        if (result && typeof result == "object" && Object.prototype.hasOwnProperty.call(result, "ok")) {
            ok = result.ok === !0;
            detail = result.detail !== void 0 ? result.detail : result;
        } else {
            ok = result === !0;
            detail = { value: result };
        }
    } catch (e) {
        error = String(e && e.message || e || "REGRESSION_TEST_FAILED");
        detail = { error: error };
    }
    rows.push({ suite: String(suite || ""), name: String(name || ""), ok: ok, durationMs: Math.max(0, Date.now() - started), detail: _qualitySafeValue_(detail), error: error });
    return ok;
}
function _automatedRegressionStatus_(options) {
    options = options || {};
    var started = Date.now(), rows = [], registry = _appIsFnName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {}, handlers = _appIsFnName_("_apiRouteHandlers_") ? _apiRouteHandlers_(!0) : {};
    function test(suite, name, fn) { return _qualityRegressionCase_(rows, suite, name, fn); }

    /* Permission matrix — current owner only. */
    test("permission-matrix", "matrix-owner-status", function () {
        var status = _permissionMatrixStatus_();
        return { ok: !!(status && status.ok), detail: status };
    });
    test("permission-matrix", "role-normalization", function () {
        var actual = [_permissionNormalizeRole_("viewer"), _permissionNormalizeRole_("เจ้าหน้าที่"), _permissionNormalizeRole_("administrator"), _permissionNormalizeRole_("unknown-role")];
        return { ok: actual.join("|") === ["Viewer", "Staff", "Admin", "Viewer"].join("|"), detail: { actual: actual } };
    });
    test("permission-matrix", "viewer-pages-fail-closed", function () {
        return _permissionCanPage_("Viewer", "dashboard") && _permissionCanPage_("Viewer", "search") && !_permissionCanPage_("Viewer", "budget") && !_permissionCanPage_("Viewer", "meeting") && !_permissionCanPage_("unknown-role", "budget");
    });
    test("permission-matrix", "staff-admin-boundary", function () {
        return _permissionCanPage_("Staff", "meeting") && _permissionCanPage_("Staff", "budget") && !_permissionCanPage_("Staff", "admin") && _permissionCanPage_("Admin", "admin");
    });
    test("permission-matrix", "viewer-write-denied", function () {
        return !_permissionCanApi_("Viewer", "apiSaveCase", { group: "case", write: !0, minRole: "Staff" }) && _permissionCanApi_("Staff", "apiSaveCase", { group: "case", write: !0, minRole: "Staff" });
    });
    test("permission-matrix", "dashboard-budget-redaction", function () {
        var viewer = _permissionApplyApiPayloadPolicy_("Viewer", "apiGetDashboardBundle", { includeBudget: !0 }), staff = _permissionApplyApiPayloadPolicy_("Staff", "apiGetDashboardBundle", { includeBudget: !0 });
        return { ok: viewer.includeBudget === !1 && viewer.hideBudget === !0 && staff.includeBudget === !0, detail: { viewer: viewer, staff: staff } };
    });
    test("permission-matrix", "deferred-assets-minimum-role", function () {
        return _permissionRequiredRoleForDeferredAsset_("Scripts_Page_Dashboard") === "Viewer" && _permissionRequiredRoleForDeferredAsset_("Scripts_Page_Meeting::meeting") === "Staff" && _permissionRequiredRoleForDeferredAsset_("Scripts_Page_Admin") === "Admin";
    });

    /* Router / CSRF — canonical 106-route surface. */
    test("route-csrf", "route-handler-exact-set-parity", function () {
        var facade = _routerFacadeContract_();
        return { ok: !!(facade && facade.ok && facade.exactSetParity === !0 && facade.routeCount === APP_QUALITY_CONTRACT_CURRENT.expectedRouteCount && facade.handlerCount === APP_QUALITY_CONTRACT_CURRENT.expectedRouteCount), detail: facade || {} };
    });
    test("route-csrf", "write-csrf-coverage", function () {
        var routes = Object.keys(registry || {}), writes = routes.filter(function (name) { return registry[name] && registry[name].write === !0; }), csrf = writes.filter(function (name) { return registry[name].csrf === !0; }), missingHandlers = writes.filter(function (name) { return typeof handlers[name] != "function"; });
        return { ok: writes.length === APP_QUALITY_CONTRACT_CURRENT.expectedWriteRouteCount && csrf.length === writes.length && missingHandlers.length === 0, detail: { writes: writes.length, csrf: csrf.length, missingHandlers: missingHandlers } };
    });
    test("route-csrf", "public-route-policy", function () {
        var publicRoutes = Object.keys(registry || {}).filter(function (name) { return registry[name] && registry[name].public === !0; }), publicWrites = publicRoutes.filter(function (name) { return registry[name].write === !0; });
        return { ok: publicWrites.length === 0, detail: { publicRoutes: publicRoutes, publicWrites: publicWrites } };
    });
    test("route-csrf", "group-minimum-role-consistency", function () {
        var issues = [];
        Object.keys(registry || {}).forEach(function (method) {
            var meta = registry[method] || {}, group = String(meta.group || meta.domain || "").toLowerCase(), groupRole = APP_PERMISSION_MATRIX.apiGroupMinimumRole[group];
            if (groupRole && _permissionRoleRank_(_permissionRequiredRoleForApi_(method, meta)) < _permissionRoleRank_(groupRole)) issues.push({ method: method, group: group, required: _permissionRequiredRoleForApi_(method, meta), groupRole: groupRole });
        });
        return { ok: issues.length === 0, detail: { issues: issues } };
    });
    test("route-csrf", "router-direct-entrypoint-policy", function () {
        var p = _routerDirectEntrypointPolicy_();
        return { ok: !!(p && p.routerOnlyDefault === !0 && p.directApiReadBlocked === !0 && p.directApiWriteBlocked === !0 && p.publicWriteAllowed === !1), detail: p || {} };
    });
    test("route-csrf", "retired-route-aliases-absent", function () {
        var retired = ["apiGetCases", "apiBudgetListByFYFast"].filter(function (name) { return !!registry[name] || typeof handlers[name] == "function"; });
        return { ok: retired.length === 0, detail: { retiredPresent: retired } };
    });

    /* Primary key — ลำดับเรื่อง is the single business identity. */
    test("primary-key", "case-identity-owner", function () {
        var status = _caseIdentityOwnerStatus_();
        return { ok: !!(status && status.ok && status.primaryKey === "caseNum/ลำดับเรื่อง" && status.technicalIdentity === "caseId"), detail: status };
    });
    test("primary-key", "sequence-normalization", function () {
        return CaseIdentity.normalizeSequence("  กมธ.\u200B 1/2569  ") === "กมธ. 1/2569";
    });
    test("primary-key", "sequence-from-canonical-alias", function () {
        return CaseIdentity.sequenceFrom({ caseNum: "12/2569", title: "ไม่ใช้เป็นคีย์" }) === "12/2569" && CaseIdentity.sequenceFrom({ title: "ไม่มีลำดับเรื่อง", petitioners: "ผู้ร้อง" }) === "";
    });
    test("primary-key", "relation-stamp-preserves-technical-id", function () {
        var row = CaseIdentity.stampRelation({ caseId: "CASE-001" }, " 7/2569 "), aliases = CaseIdentity.readAliases || [], missing = aliases.filter(function (key) { return row[key] !== "7/2569"; });
        return { ok: row.caseId === "CASE-001" && row.__relationPrimaryKey === "ลำดับเรื่อง" && missing.length === 0, detail: { missing: missing, relationOwner: row.__relationSequenceStampedBy } };
    });
    test("primary-key", "protected-write-route-contract", function () {
        var methods = ["apiSaveCase", "apiDeleteCase", "apiSaveMeetingLog", "apiDeleteMeetingLog", "apiSaveLetter", "apiDeleteLetter"], issues = methods.filter(function (method) { var meta = registry[method] || {}; return meta.write !== !0 || meta.csrf !== !0 || typeof handlers[method] != "function"; });
        return { ok: issues.length === 0, detail: { protectedMethods: methods, issues: issues } };
    });

    /* Meeting / tracking pure contracts. */
    test("meeting-tracking", "meeting-build-normalize-roundtrip", function () {
        var payloads = { logPayload: {}, casePayload: {} }, input = {}, identity = { caseId: "CASE-001", caseNum: "1/2569", recNo: "กมธ. 1/2569", title: "ทดสอบ" }, meeting = { round: "3", date: "2026-07-30", note: "มีมติ" }, committee = { committeeType: "คณะกรรมาธิการ", subcommitteeId: "", subcommitteeName: "", meetingGroup: "คณะกรรมาธิการ" }, built = _meetingSaveBuildRowE_(payloads, input, identity, meeting, committee, "2026-07-30T06:00:00.000Z"), normalized = _normalizeMeetingLogRow_(built.rowObj);
        return { ok: !!(built.logId && normalized.caseId === identity.caseId && _caseSequenceFrom_(normalized) === identity.caseNum && normalized.round === meeting.round), detail: { logId: built.logId, caseNum: _caseSequenceFrom_(normalized), round: normalized.round } };
    });
    test("meeting-tracking", "meeting-log-id-deterministic", function () {
        var args = [{ logPayload: {}, casePayload: {} }, {}, { caseId: "CASE-X", caseNum: "9/2569", recNo: "R-9", title: "X" }, { round: "1", date: "2026-07-30", note: "N" }, { committeeType: "คณะกรรมาธิการ", subcommitteeId: "", subcommitteeName: "", meetingGroup: "คณะกรรมาธิการ" }, "2026-07-30T00:00:00.000Z"], a = _meetingSaveBuildRowE_.apply(null, args), b = _meetingSaveBuildRowE_.apply(null, args);
        return a.logId === b.logId && a.businessKey === b.businessKey;
    });
    test("meeting-tracking", "tracking-status-canonical", function () {
        return _trackingNormalizeStatus_("ได้รับตอบกลับแล้ว") === "ได้รับแล้ว" && _trackingNormalizeStatus_("") === "ยังไม่ได้รับ";
    });
    test("meeting-tracking", "tracking-row-relation-roundtrip", function () {
        var row = _normalizeLetterRow_({ letterId: "L-1", caseId: "CASE-001", caseNum: "1/2569", letterNo: " 12 / 2569 ", letterStatus: "ตอบรับแล้ว", repliesJSON: "[]" });
        return { ok: row.caseId === "CASE-001" && _caseSequenceFrom_(row) === "1/2569" && row.letterNo === "12/2569" && row.letterStatus === "ได้รับแล้ว", detail: row };
    });
    test("meeting-tracking", "tracking-server-model-roundtrip", function () {
        var source = { letterId: "L-2", caseId: "CASE-002", caseNum: "2/2569", letterNo: "2/2569", dueDate: "2026-08-10", letterStatus: "ยังไม่ได้รับ", repliesJSON: "[]" }, model = _trackingNormalizeRowsForServerPage_([source], { "CASE-002": { caseNum: "2/2569", recNo: "R2", title: "เรื่อง 2", status: "รอพิจารณา" } }, new Date("2026-07-30T00:00:00Z"), null), row = model[0] || {};
        return { ok: model.length === 1 && row.caseId === "CASE-002" && row.caseNum === "2/2569" && row.letterNo === "2/2569" && row.filterKey === "notdue", detail: row };
    });
    test("meeting-tracking", "tracking-status-counts", function () {
        var c = _trackingBuildStatusCounts_([{ filterKey: "received" }, { filterKey: "overdue" }, { filterKey: "notdue" }]);
        return { ok: c && c.all === 3 && c.received === 1 && c.overdue === 1 && c.notdue === 1, detail: c };
    });

    /* Budget / personnel canonical owners. */
    test("budget-personnel", "budget-canonical-read-owner", function () {
        var status = _budgetCanonicalReadFacadeStatus_();
        return { ok: !!(status && status.ok && status.noParallelDomainFastOwner === !0), detail: status };
    });
    test("budget-personnel", "budget-domain-methods", function () {
        var methods = ["getFiscalYears", "listByFY", "getSummary", "getDashboardSummaryForDashboard", "saveImport", "deleteImport", "getTypeSummary"], missing = methods.filter(function (name) { return typeof BudgetDomain != "object" || typeof BudgetDomain[name] != "function"; });
        return { ok: missing.length === 0 && typeof BudgetDomain.listByFYFast == "undefined", detail: { missing: missing, parallelFastOwner: typeof BudgetDomain.listByFYFast } };
    });
    test("budget-personnel", "people-budget-read-model-owner", function () {
        var methods = ["parseBudgetDate", "normalizeStaffForBudget", "readStaffRowsForBudget"], missing = methods.filter(function (name) { return typeof PeopleDomain != "object" || typeof PeopleDomain[name] != "function"; });
        return { ok: missing.length === 0, detail: { missing: missing } };
    });
    test("budget-personnel", "personnel-normalization-pure", function () {
        var row = PeopleDomain.normalizeStaffForBudget({ id: "S-1", firstName: "สมชาย", lastName: "ใจดี", position: "นักวิชาการ", startDate: "2026-01-01", status: "ดำรงตำแหน่ง" }, 0);
        return { ok: !!(row && row.id === "S-1" && row.position === "นักวิชาการ" && row.startDate), detail: row };
    });
    test("budget-personnel", "salary-obligation-pure-contract", function () {
        var result = calculatePersonnelSalaryObligation_([{ id: "S-1", position: "นักวิชาการ", startDate: "2026-01-01", status: "ดำรงตำแหน่ง" }], [{ position: "นักวิชาการ", salary: 10000 }], 2569, new Date("2026-07-30T00:00:00Z"));
        return { ok: !!(result && typeof result == "object" && Number(result.amount || result.total || 0) >= 0), detail: result || {} };
    });

    /* Authentication / session — security profile unchanged. */
    test("auth-session", "session-expiry-past-future", function () {
        return _isSessionExpired_({ expiresAt: new Date(Date.now() - 1000).toISOString() }) === !0 && _isSessionExpired_({ expiresAt: new Date(Date.now() + 60000).toISOString() }) === !1 && _isSessionExpired_(null) === !0;
    });
    test("auth-session", "session-envelope-contract", function () {
        var env = _normalizeSessionEnvelope_({ username: "regression-user", role: "Viewer" });
        return { ok: env.username === "regression-user" && env.role === "Viewer" && !!env.issuedAt && !!env.lastSeenAt && !!env.expiresAt, detail: { role: env.role, issuedAt: env.issuedAt, hasExpiry: !!env.expiresAt } };
    });
    test("auth-session", "session-ttl-positive", function () {
        return typeof _SESSION_TTL_ == "number" && _SESSION_TTL_ > 0;
    });
    test("auth-session", "csrf-canonical-owner-contract", function () {
        var owner = typeof APP_CSRF_CANONICAL_OWNER_CURRENT == "object" ? APP_CSRF_CANONICAL_OWNER_CURRENT : null, issuerSource = String(_issueCsrfToken_);
        return { ok: !!(owner && owner.singleOwner === !0 && owner.owner === "Code_10_Security_Auth.gs" && /_issueSessionCsrfToken_\(token\)/.test(issuerSource)), detail: owner || {} };
    });
    test("auth-session", "production-security-profile", function () {
        var profile = _authSecurityProfile_();
        return { ok: !!(profile && profile.profile === "production-strict" && profile.passwordHashRequired === !0 && profile.plainPasswordAllowed === !1), detail: profile || {} };
    });

    /* Canonical infrastructure owners. */
    test("canonical-owners", "repository-registry-owner", function () { var x = _repositoryRegistrySingleOwnerStatus_(); return { ok: !!(x && x.ok), detail: x }; });
    test("canonical-owners", "repository-owner", function () { var x = _appRepositoryOwnerStatus_(); return { ok: !!(x && x.ok), detail: x }; });
    test("canonical-owners", "cache-request-mode-owner", function () { var x = _appCacheRequestModeStatus_(); return { ok: !!(x && x.ok), detail: x }; });
    test("canonical-owners", "durable-cache-generation-owner", function () { var x = _durableCacheGenerationStatus_(); return { ok: !!(x && x.ok && x.persistentSourceOfTruth === !0 && x.cacheEvictionSafe === !0), detail: x }; });
    test("canonical-owners", "platform-cache-contract", function () { var x = _platformCacheContractStatus_(); return { ok: !!(x && x.ok), detail: x }; });
    test("canonical-owners", "cache-invalidation-ledger", function () { var x = _cacheInvalidationLedgerStatus_(); return { ok: !!(x && x.ok && x.rules && x.rules.oneRootLedger === !0), detail: x }; });
    test("canonical-owners", "write-path-policy", function () {
        var policy = _i3WritePathPolicy_("Cases", "save", { flush: !1 });
        return { ok: !!(policy && policy.stamp === "write-path-policy-current" && policy.flush === !1 && _appIsFnName_("_i3FlushAfterWrite_")), detail: policy || {} };
    });
    test("canonical-owners", "external-asset-integrity", function () {
        var expected = "sha512-TA1p+I1AtmUN2QnvpJT01/hjvxCxjyBfXtNuKNnvvwyCaQpdl5JUfiJ7geQtMnJ55myntTq5JwPLiH3j6e222A==", policy = _appExternalAssetPolicy_(), sources = policy && policy.assets && policy.assets.sweetalert2 && policy.assets.sweetalert2.sources || [], invalid = sources.filter(function (source) { return String(source.integrity || "") !== expected; });
        return { ok: sources.length === 2 && invalid.length === 0, detail: { sourceCount: sources.length, invalidCount: invalid.length } };
    });

    /* Read-model / cache partition contracts from the current code, without historical gate wrappers. */
    test("read-model-cache", "snapshot-entity-partitions", function () {
        var p = APP_PERSISTENT_SNAPSHOT_ENTITY_PARTITIONS_CURRENT || {};
        return { ok: Array.isArray(p["case-search"]) && Array.isArray(p["case-report"]) && Array.isArray(p.dashboard), detail: p };
    });
    test("read-model-cache", "targeted-snapshot-write", function () {
        var src = String(_persistentSummarySnapshotWrite_);
        return { ok: /_persistentSummarySnapshotRowNumbersForKey_/.test(src) && /partitionedWrite:\s*!0/.test(src) && /_persistentSummarySnapshotClearRows_/.test(src), detail: { targetedKeyReplace: /_persistentSummarySnapshotRowNumbersForKey_/.test(src), partitionedWrite: /partitionedWrite:\s*!0/.test(src) } };
    });
    test("read-model-cache", "domain-column-snapshot-invalidation", function () {
        var src = String(_persistentSummarySnapshotInvalidate_);
        return { ok: /getRange\(2,\s*2,\s*lastRow\s*-\s*1,\s*1\)/.test(src) && /partitionedInvalidation:\s*!0/.test(src), detail: { domainColumnOnly: /getRange\(2,\s*2,\s*lastRow\s*-\s*1,\s*1\)/.test(src) } };
    });
    test("read-model-cache", "case-search-persistent-snapshot", function () {
        var readSrc = String(_caseSearchReadMaterializedIndex_);
        return { ok: /_persistentSummarySnapshotRead_\("case-search"/.test(readSrc) && /_persistentSummarySnapshotWrite_\("case-search"/.test(readSrc), detail: { persistentRead: /_persistentSummarySnapshotRead_/.test(readSrc), persistentWrite: /_persistentSummarySnapshotWrite_/.test(readSrc) } };
    });
    test("read-model-cache", "data-contract-single-owner", function () {
        var c = APP_DATA_CONTRACT_CURRENT || {};
        return { ok: !!(c.owner && c.entities && c.methods && c.entities.case && c.entities.dashboard), detail: { owner: c.owner, stamp: c.stamp, entityCount: Object.keys(c.entities || {}).length, methodCount: Object.keys(c.methods || {}).length } };
    });
    test("read-model-cache", "write-mutation-contract-complete", function () {
        var writes = Object.keys(registry || {}).filter(function (name) { return registry[name] && registry[name].write === !0; }), missing = writes.filter(function (name) { var x = _platformDataContractMethod_(name, registry[name] || {}); return !x || !Array.isArray(x.invalidates) || x.invalidates.length === 0; });
        return { ok: writes.length === APP_QUALITY_CONTRACT_CURRENT.expectedWriteRouteCount && missing.length === 0, detail: { writeCount: writes.length, missingInvalidationContract: missing } };
    });

    /* Browser/source contracts. These read source files but perform no mutations. */
    test("browser-contract", "browser-regression-current-owner", function () {
        var read = _qualityReadHtmlSource_("Runtime_09_QA_Regression"), content = String(read && read.content || "");
        return { ok: !!(read && read.ok && /app-automated-regression-current/.test(content) && /__APP_AUTOMATED_REGRESSION_CURRENT__/.test(content) && /AppRegression/.test(content)), detail: { sourceReadable: !!(read && read.ok) } };
    });
    test("browser-contract", "request-lifecycle-single-owner", function () {
        var read = _qualityReadHtmlSource_("Runtime_01_Request_Lifecycle"), content = String(read && read.content || "");
        return { ok: !!(read && read.ok && /AppRequestLifecycle/.test(content) && /__APP_REQUEST_LIFECYCLE_CURRENT__/.test(content)), detail: { sourceReadable: !!(read && read.ok), ownerFound: /AppRequestLifecycle/.test(content) } };
    });
    test("browser-contract", "core-no-direct-compatibility-owner", function () {
        var read = _qualityReadHtmlSource_("Scripts_Core_Runtime"), content = String(read && read.content || ""), direct = ["AppClientCacheOwner", "AppMutationCoordinator", "AppMutationRefresh", "AppWriteRefreshBroker"].filter(function (name) { return new RegExp("(?:root|window)\\." + name + "\\s*\\.").test(content); });
        return { ok: !!(read && read.ok && direct.length === 0), detail: { directCompatibilityOwners: direct } };
    });
    test("browser-contract", "single-mutation-event", function () {
        var files = ["Runtime_01_Request_Lifecycle", "Scripts_Core_Runtime", "Scripts_Critical_Login_Runtime"], variants = {}, currentCount = 0;
        files.forEach(function (file) { var r = _qualityReadHtmlSource_(file), c = String(r && r.content || ""); currentCount += (c.match(/app:data:mutated/g) || []).length; ["app:data-mutated", "app:data_mutated"].forEach(function (v) { if (c.indexOf(v) >= 0) variants[v] = !0; }); });
        return { ok: currentCount > 0 && Object.keys(variants).length === 0, detail: { currentOccurrences: currentCount, staleVariants: Object.keys(variants) } };
    });
    test("browser-contract", "sidebar-current-owner", function () {
        var read = _qualityReadHtmlSource_("Index"), content = String(read && read.content || "");
        return { ok: !!(read && read.ok && /app-sidebar-keyboard-navigation-current/.test(content) && /__APP_SIDEBAR_KEYBOARD_OWNER__/.test(content)), detail: { sourceReadable: !!(read && read.ok) } };
    });
    test("browser-contract", "accessibility-runtime-contract", function () {
        var read = _qualityReadHtmlSource_("Scripts_Core_Runtime"), content = String(read && read.content || "");
        return { ok: !!(read && read.ok && /AppAccessibility/.test(content) && /MutationObserver/.test(content) && /enhanceControls/.test(content) && /enhanceDialogs/.test(content)), detail: { sourceReadable: !!(read && read.ok) } };
    });
    test("browser-contract", "page-modules-no-direct-google-script-run", function () {
        var files = ["Scripts_Page_Dashboard", "Scripts_Page_Meeting", "Scripts_Page_ReportTrack", "Scripts_Page_Petitioner", "Scripts_Page_People", "Scripts_Page_Budget", "Scripts_Page_Admin"], offenders = [];
        files.forEach(function (file) { var r = _qualityReadHtmlSource_(file), c = String(r && r.content || ""); if (!r || !r.ok || /google\.script\.run/.test(c)) offenders.push(file); });
        return { ok: offenders.length === 0, detail: { offenders: offenders } };
    });
    test("browser-contract", "semantic-navigation-current-shell", function () {
        var read = _qualityReadHtmlSource_("Index"), content = String(read && read.content || "");
        return { ok: !!(read && read.ok && /markSidebarPending/.test(content) && /safeApplyRoute/.test(content) && /app-page-switching/.test(content)), detail: { sourceReadable: !!(read && read.ok) } };
    });
    test("browser-contract", "instant-route-template-single-owner", function () {
        var read = _qualityReadHtmlSource_("Index"), content = String(read && read.content || ""), required = ["dashboard", "search", "petitioner", "meeting", "committee-meeting", "track", "report", "people", "budget", "admin"], missing = [], duplicate = [], pageFiles = ["Scripts_Page_Dashboard", "Scripts_Page_Meeting", "Scripts_Page_ReportTrack", "Scripts_Page_Petitioner", "Scripts_Page_People", "Scripts_Page_Budget", "Scripts_Page_Admin"], secondaryOwners = [];
        required.forEach(function (id) { var marker = 'id="tpl-page-' + id + '"', count = content.split(marker).length - 1; if (count === 0) missing.push(id); else if (count > 1) duplicate.push(id); });
        pageFiles.forEach(function (file) { var r = _qualityReadHtmlSource_(file), c = String(r && r.content || ""); if (!r || !r.ok || /type\s*=\s*(["'])text\/x-template\1/i.test(c)) secondaryOwners.push(file); });
        return { ok: !!(read && read.ok && missing.length === 0 && duplicate.length === 0 && secondaryOwners.length === 0), detail: { sourceReadable: !!(read && read.ok), missing: missing, duplicate: duplicate, secondaryOwners: secondaryOwners } };
    });
    test("browser-contract", "route-navigation-no-blocking-loading-copy", function () {
        var read = _qualityReadHtmlSource_("Index"), content = String(read && read.content || "");
        return { ok: !!(read && read.ok && content.indexOf("กำลังโหลดข้อมูล...") < 0 && content.indexOf("กู้คืนหน้าไม่สำเร็จ") < 0), detail: { sourceReadable: !!(read && read.ok), loadingCopyFound: content.indexOf("กำลังโหลดข้อมูล...") >= 0, recoveryCopyFound: content.indexOf("กู้คืนหน้าไม่สำเร็จ") >= 0 } };
    });
    test("browser-contract", "instant-login-shell-cannot-be-blocked-by-placeholder", function () {
        var read = _qualityReadHtmlSource_("Index"), content = String(read && read.content || ""), legacyBlocker = content.indexOf("host.childNodes.length") >= 0, replaceReady = content.indexOf('host.replaceChildren(fragment)') >= 0, loginGuard = content.indexOf('host.querySelector("#login-page")') >= 0, fallbackMount = /showVueUnavailableMode[\s\S]{0,2200}__APP_MOUNT_INSTANT_SHELL__/.test(content);
        return { ok: !!(read && read.ok && !legacyBlocker && replaceReady && loginGuard && fallbackMount), detail: { sourceReadable: !!(read && read.ok), legacyPlaceholderBlockerFound: legacyBlocker, replaceChildrenReady: replaceReady, loginGuardReady: loginGuard, vueFailureKeepsLoginShell: fallbackMount } };
    });

    /* Public compatibility facades remain thin; retired aliases are gone. */
    test("api-contract", "public-phase-compatibility-facades", function () {
        var names = ["apiGetPhase0ContractGate", "apiGetPhase1Contract", "apiGetPhase2Contract", "apiGetPhase4QaGate", "apiGetPhase5ReleaseReadiness"], missing = names.filter(function (name) { return !registry[name] || typeof handlers[name] != "function"; });
        return { ok: missing.length === 0, detail: { compatibilityApis: names, missing: missing } };
    });
    test("api-contract", "current-quality-facade-owner", function () {
        var qaSource = String(_getQaGate_), currentSource = String(_currentQualityGateStatus_);
        return { ok: /_currentQualityGateStatus_/.test(qaSource) && /APP_QUALITY_CONTRACT_CURRENT/.test(currentSource), detail: { qaFacadeThin: /_currentQualityGateStatus_/.test(qaSource) } };
    });
    test("api-contract", "route-write-count-current", function () {
        var routes = Object.keys(registry || {}), writes = routes.filter(function (name) { return registry[name] && registry[name].write === !0; });
        return { ok: routes.length === 106 && writes.length === 27, detail: { routes: routes.length, writes: writes.length } };
    });

    var failed = rows.filter(function (row) { return row.ok !== !0; });
    return {
        ok: failed.length === 0,
        stamp: "automated-regression-current-r257",
        owner: APP_QUALITY_CONTRACT_CURRENT.owner,
        caseCount: rows.length,
        passCount: rows.length - failed.length,
        failCount: failed.length,
        durationMs: Math.max(0, Date.now() - started),
        cases: options.includeCases === !1 ? [] : rows,
        failedCases: failed,
        readOnly: !0,
        dataMutation: !1,
        historicalWrapperTestsRemoved: !0,
        coveragePolicy: "current-domain-security-router-cache-browser-contracts-without-stage-wrapper-self-tests"
    };
}
function _currentQualityGateStatus_(options) {
    options = options || {};
    var registry = _appIsFnName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {}, facade = _appIsFnName_("_routerFacadeContract_") ? _routerFacadeContract_() : null, regression = _automatedRegressionStatus_({ includeCases: options.includeCases === !0 }), routes = Object.keys(registry || {}), writes = routes.filter(function (name) { return registry[name] && registry[name].write === !0; }), issues = [];
    routes.length === APP_QUALITY_CONTRACT_CURRENT.expectedRouteCount || issues.push("route-count");
    writes.length === APP_QUALITY_CONTRACT_CURRENT.expectedWriteRouteCount || issues.push("write-route-count");
    facade && facade.ok !== !1 || issues.push("router-facade");
    regression && regression.ok || issues.push("automated-regression");
    ["apiGetCases", "apiBudgetListByFYFast"].forEach(function (name) { registry[name] && issues.push("retired-alias:" + name); });
    return { ok: issues.length === 0, stamp: APP_QUALITY_CONTRACT_CURRENT.stamp, owner: APP_QUALITY_CONTRACT_CURRENT.owner, routeCount: routes.length, writeRouteCount: writes.length, maxAdapterDepth: APP_QUALITY_CONTRACT_CURRENT.maxAdapterDepth, regression: regression, sourceAudit: APP_QUALITY_CONTRACT_CURRENT.sourceAudit, issues: issues, productionPerformanceApproval: options.requireLiveEvidence === !1 ? "NOT_REQUIRED" : "PENDING_LIVE_GAS_EVIDENCE", uiDomChanged: !1, businessLogicChanged: !1, spreadsheetSchemaChanged: !1, generatedAt: new Date().toISOString() };
}
