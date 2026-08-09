function _authScriptProp_(key, defaultValue) {
    try {
        return _appIsFnName_("_scriptProp_") ? _scriptProp_(key, defaultValue) : PropertiesService.getScriptProperties().getProperty(String(key)) || defaultValue;
    }
    catch (_e) {
        return defaultValue;
    }
}
function _securityProductionGateLockEnabled_() {
    return APP_PRODUCTION_POLICY_FLAGS_CURRENT.securityProductionGateLockEnabled;
}
function _securityAllowedProfiles_() {
    return [
        "production-strict"
    ];
}
function _assertProductionStrictProfile_(profile, source) {
    if (profile = String(profile || "").trim(), !_securityProductionGateLockEnabled_())
        return profile;
    if (profile !== "production-strict")
        throw new Error("SECURITY_PROFILE_REQUIRED: Production อนุญาตเฉพาะ APP_SECURITY_PROFILE=production-strict เท่านั้น" + (source ? " (" + source + ")" : ""));
    return profile;
}
function _normalizeSecurityProfileName_(value) {
    var s = String(value || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-");
    return s && (s === "strict" || s === "production" || s === "prod" || s === "production-strict" || s === "hash" || s === "hash-only") ? "production-strict" : "";
}
function _finalSecurityProfileName_() {
    return "production-strict";
}
function _authSecurityFinalLockSource_(raw) {
    return String(_authScriptProp_("APP_SECURITY_PROFILE", "") || "").trim() ? "APP_SECURITY_PROFILE" : String(_authScriptProp_("SECURITY_PROFILE", "") || "").trim() ? "SECURITY_PROFILE" : "PRODUCTION_SECURITY_LOCK";
}
function _authSecurityProfile_() {
    var raw = String(_authScriptProp_("APP_SECURITY_PROFILE", "") || _authScriptProp_("SECURITY_PROFILE", "") || "").trim(), rawNormalized = _normalizeSecurityProfileName_(raw);
    if (raw && !rawNormalized)
        throw new Error("SECURITY_PROFILE_INVALID: Production อนุญาตเฉพาะ production-strict เท่านั้น");
    var profile, data = {
        ok: !0, contractStamp: "production-security-single-owner-current", profile: _assertProductionStrictProfile_(rawNormalized || _finalSecurityProfileName_(), _authSecurityFinalLockSource_(raw)), rawProfile: raw, rawProfileNormalized: rawNormalized, label: "Production Strict", lockedBy: _authSecurityFinalLockSource_(raw), finalLock: !0, explicitScriptLock: !!raw, codeFinalLock: !raw, allowedProfiles: _securityAllowedProfiles_(), simpleAuth: !1, passwordHashRequired: !0, plainPasswordAllowed: !1, rateLimitEnabled: !0, activeUserRequired: !0, sessionExpiryDisabled: !1, sessionBindingStrict: !0, minPasswordLength: Math.max(12, Math.min(64, Number(_authScriptProp_("PASSWORD_MIN_LENGTH", 12)) || 12)), publicBridgeFlagsIgnored: {
            SIMPLE_AUTH_MODE: String(_authScriptProp_("SIMPLE_AUTH_MODE", "") || ""), SIMPLE_AUTH_NO_RATE_LIMIT: String(_authScriptProp_("SIMPLE_AUTH_NO_RATE_LIMIT", "") || ""), SIMPLE_AUTH_IGNORE_ACTIVE: String(_authScriptProp_("SIMPLE_AUTH_IGNORE_ACTIVE", "") || ""), SESSION_EXPIRY_DISABLED: String(_authScriptProp_("SESSION_EXPIRY_DISABLED", "") || ""), SESSION_BINDING_STRICT: String(_authScriptProp_("SESSION_BINDING_STRICT", "") || "")
        }, finalPolicy: {
            singleOwner: "_authSecurityProfile_", productionStrictOnly: !0, publicBridgeFlagsAreReadOnly: !0, defaultProfile: "production-strict", plainPasswordDirectRejectsStrongHash: !0, oneTimePasswordHashBootstrap: !1
        }, summary: "ใช้รหัสผ่าน hash current, เปิด rate limit, บังคับ active user, เปิด session expiry, strict session binding และ single-use action token สำหรับ write action"
    };
    return data;
}
function _simpleAuthMode_() {
    return APP_PRODUCTION_POLICY_FLAGS_CURRENT.simpleAuthMode;
}
function _simpleAuthNoRateLimit_() {
    return APP_PRODUCTION_POLICY_FLAGS_CURRENT.simpleAuthNoRateLimit;
}
function validatePasswordPolicy_(password) {
    password = String(password || "").trim();
    var profile = _authSecurityProfile_(), minLen = Number(profile.minPasswordLength || 4);
    if (password.length < minLen)
        throw new Error("รหัสผ่านต้องอย่างน้อย " + minLen + " ตัวอักษร");
    if (profile.passwordHashRequired && (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)))
        throw new Error("โหมด Production Strict ต้องใช้รหัสผ่านที่มีทั้งตัวอักษรและตัวเลข");
    return !0;
}
function _normalizeSimplePassword_(v) {
    return String(v == null ? "" : v).replace(/^'/, "").trim();
}
function _simplePasswordMatches_(candidate, stored) {
    return candidate = _normalizeSimplePassword_(candidate), stored = _normalizeSimplePassword_(stored), !(!candidate || !stored) && (candidate === stored || !(!/^\d+$/.test(candidate) || !/^\d+$/.test(stored)) && Number(candidate) === Number(stored));
}
function _plainUserPasswordFromRow_(row, indexes) {
    row = row || [];
    var direct = (indexes = indexes || {}).password > -1 ? _normalizeSimplePassword_(row[indexes.password]) : "";
    if (direct)
        return direct;
    var maybeHash = indexes.passwordHash > -1 ? _normalizeSimplePassword_(row[indexes.passwordHash]) : "";
    return maybeHash && !_isStrongPasswordHash_(maybeHash) ? maybeHash : "";
}
function _ensureUsersPasswordHashColumn_(sh, headers, indexes) {
    if (headers = headers || [], (indexes = indexes || _userHeaderIndexes_(headers)).passwordHash > -1)
        return indexes.passwordHash;
    var nextCol = headers.length + 1;
    return AppRepository.setCellValue("Users", 1, nextCol, "passwordHash", {
        invalidate: !1
    }), indexes.passwordHash = nextCol - 1, indexes.passwordHash;
}
function _loginPasswordHashBootstrapEnabled_() {
    return APP_PRODUCTION_POLICY_FLAGS_CURRENT.loginPasswordHashBootstrapEnabled;
}
function _migratePlainPasswordOnLoginDisabled_(sh, rowIndex, indexes, rawPassword, reason) {
    return APP_PRODUCTION_POLICY_FLAGS_CURRENT.migratePlainPasswordOnLoginEnabled;
}
var _SECURE_PASSWORD_SCHEME_ = "v3", _SECURE_PASSWORD_ROUNDS_ = 3600, _SESSION_TOUCH_TTL_ = typeof _appIsFnName_ == "function" && _appIsFnName_("_sessionCacheTtlSeconds_") ? _sessionCacheTtlSeconds_() : 3600, _SESSION_DURABLE_TTL_SECONDS_ = typeof _appIsFnName_ == "function" && _appIsFnName_("_sessionDurableTtlSeconds_") ? _sessionDurableTtlSeconds_() : 86400;
function _passwordHashMinRounds_() {
    return 1200;
}
function _passwordHashMaxRounds_() {
    return 12e3;
}
function _passwordHashDefaultRounds_() {
    var n = Number(_scriptProp_("PASSWORD_HASH_ROUNDS", _SECURE_PASSWORD_ROUNDS_));
    return Math.max(_passwordHashMinRounds_(), Math.min(_passwordHashMaxRounds_(), isFinite(n) ? n : _SECURE_PASSWORD_ROUNDS_));
}
function _loginRateLimitWindowSeconds_() {
    if (_simpleAuthNoRateLimit_())
        return 0;
    var raw = Number(_scriptProp_("LOGIN_RATE_LIMIT_WINDOW_SECONDS", 900));
    return (!isFinite(raw) || raw <= 0) && (raw = 900), Math.max(60, Math.min(3600, Math.floor(raw)));
}
function _loginRateLimitMaxAttempts_() {
    if (_simpleAuthNoRateLimit_())
        return 999999;
    var raw = Number(_scriptProp_("LOGIN_RATE_LIMIT_MAX_ATTEMPTS", 5));
    return (!isFinite(raw) || raw <= 0) && (raw = 5), Math.max(3, Math.min(20, Math.floor(raw)));
}
function _loginRateLimitNamespace_() {
    var runtimeNs = _appIsFnName_("_runtimeStateGet_") ? String(_runtimeStateGet_("LOGIN_RATE_LIMIT_NAMESPACE", "") || "").trim() : "", configuredNs = String(_scriptProp_("LOGIN_RATE_LIMIT_NAMESPACE", "prod-current-login-recovery") || "").trim();
    return runtimeNs || configuredNs || "prod-current-login-recovery";
}
function _loginRateLimitKey_(username, payload) {
    payload = payload && typeof payload == "object" ? payload : {};
    var who = String(username || "").trim().toLowerCase(), ctx = payload.clientContext && typeof payload.clientContext == "object" ? payload.clientContext : {}, fp = [
        payload.clientFingerprint || "", payload.userAgent || payload.ua || ctx.userAgent || "", payload.language || ctx.language || "", payload.platform || ctx.platform || "", payload.timezone || ctx.timezone || ""
    ].map(function (v) {
        return String(v || "").trim().toLowerCase();
    }).join("|");
    return "login_attempts_fp_" + _appSha256Hex_(_loginRateLimitNamespace_() + "|" + who + "|" + fp).substring(0, 24);
}
function _loginRateLimitUserKey_(username) {
    var who = String(username || "").trim().toLowerCase();
    return "login_attempts_user_" + _appSha256Hex_(_loginRateLimitNamespace_() + "|" + who).substring(0, 24);
}
function _loginRateLimitKeys_(username, payload) {
    return [
        _loginRateLimitUserKey_(username), _loginRateLimitKey_(username, payload)
    ].filter(function (key, index, rows) {
        return !!key && rows.indexOf(key) === index;
    });
}
var __AUTH_RATE_DURABLE_CACHE__ = null;
function _loginRateDurablePropertyName_() {
    return "APP_SECURITY_LOGIN_RATE_STATE_V1";
}
function _loginRateStateDefault_() {
    return {
        count: 0, blockedUntil: 0, nextAllowedAt: 0, windowStartedAt: Date.now(), updatedAtMs: Date.now()
    };
}
function _loginRateStateExpired_(state, now) {
    state = state && typeof state == "object" ? state : {}, now = Number(now || Date.now()) || Date.now();
    var activeUntil = Math.max(Number(state.blockedUntil || 0), Number(state.nextAllowedAt || 0), Number(state.windowStartedAt || 0) + 1e3 * _loginRateLimitWindowSeconds_());
    return activeUntil > 0 && activeUntil <= now;
}
function _loadLoginRateDurableMap_(forceFresh) {
    if (!forceFresh && __AUTH_RATE_DURABLE_CACHE__ && typeof __AUTH_RATE_DURABLE_CACHE__ == "object")
        return __AUTH_RATE_DURABLE_CACHE__;
    var raw = "", map = {};
    try {
        raw = PropertiesService.getScriptProperties().getProperty(_loginRateDurablePropertyName_()) || "", map = raw ? JSON.parse(raw) : {}, map && typeof map == "object" && !Array.isArray(map) || (map = {});
    }
    catch (e) {
        throw _appIsFnName_("_recordWarning_") && _recordWarning_("login.rateLimit.durable.read", e), new Error("ระบบป้องกันการเข้าสู่ระบบไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง");
    }
    var now = Date.now();
    return Object.keys(map).forEach(function (key) {
        _loginRateStateExpired_(map[key], now) && delete map[key];
    }), __AUTH_RATE_DURABLE_CACHE__ = map, map;
}
function _saveLoginRateDurableMap_(map) {
    map = map && typeof map == "object" ? map : {};
    var keys = Object.keys(map), maxEntries = 250;
    keys.length > maxEntries && keys.sort(function (a, b) {
        return Number(map[b] && map[b].updatedAtMs || 0) - Number(map[a] && map[a].updatedAtMs || 0);
    }).slice(maxEntries).forEach(function (key) {
        delete map[key];
    });
    try {
        PropertiesService.getScriptProperties().setProperty(_loginRateDurablePropertyName_(), JSON.stringify(map)), __AUTH_RATE_DURABLE_CACHE__ = map;
    }
    catch (e) {
        throw _appIsFnName_("_recordWarning_") && _recordWarning_("login.rateLimit.durable.write", e), new Error("ไม่สามารถบันทึกสถานะการป้องกันการเข้าสู่ระบบได้");
    }
    return !0;
}
function _mergeLoginRateStates_(a, b) {
    return a = a && typeof a == "object" ? a : _loginRateStateDefault_(), b = b && typeof b == "object" ? b : _loginRateStateDefault_(), {
        count: Math.max(Number(a.count || 0), Number(b.count || 0)), blockedUntil: Math.max(Number(a.blockedUntil || 0), Number(b.blockedUntil || 0)), nextAllowedAt: Math.max(Number(a.nextAllowedAt || 0), Number(b.nextAllowedAt || 0)), windowStartedAt: Math.min(Number(a.windowStartedAt || Date.now()) || Date.now(), Number(b.windowStartedAt || Date.now()) || Date.now()), lastFailedAt: String(b.lastFailedAt || a.lastFailedAt || ""), updatedAtMs: Math.max(Number(a.updatedAtMs || 0), Number(b.updatedAtMs || 0), Date.now())
    };
}
function _readLoginRateState_(key) {
    if (!key)
        return _loginRateStateDefault_();
    var cacheState = null, durableState = null, cacheReadOk = !1, durableReadOk = !1;
    try {
        var raw = _AppScriptCache_().get(String(key));
        cacheState = raw ? JSON.parse(raw) : null, cacheReadOk = !0;
    }
    catch (_cacheErr) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("login.rateLimit.cache.read", _cacheErr);
    }
    try {
        durableState = _loadLoginRateDurableMap_()[String(key)] || null, durableReadOk = !0;
    }
    catch (_durableErr) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("login.rateLimit.durable.readState", _durableErr);
    }
    if (!cacheReadOk && !durableReadOk)
        throw new Error("ระบบป้องกันการเข้าสู่ระบบไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง");
    var state = _mergeLoginRateStates_(cacheState, durableState);
    return _loginRateStateExpired_(state, Date.now()) ? _loginRateStateDefault_() : state;
}
function _writeLoginRateStateUnlocked_(key, state, durableMap) {
    if (!key)
        return !1;
    state = state && typeof state == "object" ? state : _loginRateStateDefault_(), state.updatedAtMs = Date.now();
    try {
        _AppScriptCache_().put(String(key), JSON.stringify(state), _loginRateLimitWindowSeconds_());
    }
    catch (_cacheErr) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("login.rateLimit.cache.write", _cacheErr);
    }
    return durableMap = durableMap && typeof durableMap == "object" ? durableMap : _loadLoginRateDurableMap_(!0), durableMap[String(key)] = state, !0;
}
function _clearLoginRateState_(username, payload) {
    try {
        var keys = _loginRateLimitKeys_(username, payload);
        if (!keys.length)
            return !0;
        var cache = _AppScriptCache_(), map = _loadLoginRateDurableMap_(!1), hasDurableState = !1;
        keys.forEach(function (key) {
            try {
                cache.remove(key);
            }
            catch (_cacheErr) {
                _appIsFnName_("_recordWarning_") &&
                    _recordWarning_("login.rateLimit.cache.clear", _cacheErr);
            }
            map &&
                Object.prototype.hasOwnProperty.call(map, key) &&
                (hasDurableState = !0);
        });
        if (!hasDurableState)
            return !0;
        _withScriptLock_(3e3, function () {
            var lockedMap = _loadLoginRateDurableMap_(!0), changed = !1;
            keys.forEach(function (key) {
                try {
                    cache.remove(key);
                }
                catch (_cacheErr2) {
                    _appIsFnName_("_recordWarning_") &&
                        _recordWarning_("login.rateLimit.cache.clear.locked", _cacheErr2);
                }
                lockedMap &&
                    Object.prototype.hasOwnProperty.call(lockedMap, key) &&
                    (delete lockedMap[key], (changed = !0));
            });
            changed && _saveLoginRateDurableMap_(lockedMap);
        });
        return !0;
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") &&
            _recordWarning_("login.rateLimit.clear", _e);
        return !1;
    }
}
function _assertLoginRateLimit_(username, payload) {
    if (_simpleAuthNoRateLimit_())
        return !0;
    if (username = String(username || "").trim().toLowerCase()) {
        var now = Date.now(), blockedState = null, backoffState = null;
        if (_loginRateLimitKeys_(username, payload || {}).forEach(function (key) {
            var state = _readLoginRateState_(key);
            Number(state.blockedUntil || 0) > now && (!blockedState || Number(state.blockedUntil || 0) > Number(blockedState.blockedUntil || 0)) && (blockedState = state), Number(state.nextAllowedAt || 0) > now && (!backoffState || Number(state.nextAllowedAt || 0) > Number(backoffState.nextAllowedAt || 0)) && (backoffState = state);
        }), blockedState) {
            _safeAudit_("auth.blocked", {
                username, blockedUntil: new Date(Number(blockedState.blockedUntil || 0)).toISOString(), reason: "rate-limit-user-or-fingerprint-durable"
            });
            var waitMinutes = Math.max(1, Math.ceil((Number(blockedState.blockedUntil || 0) - now) / 6e4));
            throw new Error("พยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่อีกครั้งภายใน " + waitMinutes + " นาที");
        }
        if (backoffState)
            throw _safeAudit_("auth.backoff", {
                username, nextAllowedAt: new Date(Number(backoffState.nextAllowedAt || 0)).toISOString(), failedAttempts: Number(backoffState.count || 0), boundary: "username+fingerprint-durable"
            }), new Error("กรุณารอสักครู่ก่อนลองเข้าสู่ระบบอีกครั้ง");
    }
}
function _recordLoginFailure_(username, payload) {
    !_simpleAuthNoRateLimit_() && (username = String(username || "").trim().toLowerCase()) && _withScriptLock_(5e3, function () {
        var now = Date.now(), map = _loadLoginRateDurableMap_(!0);
        _loginRateLimitKeys_(username, payload || {}).forEach(function (key) {
            var state = _mergeLoginRateStates_(_readLoginRateState_(key), map[key]);
            Number(state.windowStartedAt || 0) + 1e3 * _loginRateLimitWindowSeconds_() <= now && (state = _loginRateStateDefault_()), state.count = Number(state.count || 0) + 1, state.lastFailedAt = new Date(now).toISOString(), state.windowStartedAt = Number(state.windowStartedAt || now) || now;
            var backoffSeconds = Math.min(120, Math.pow(2, Math.max(0, state.count - 1)));
            state.nextAllowedAt = now + 1e3 * backoffSeconds, state.count >= _loginRateLimitMaxAttempts_() && (state.blockedUntil = now + 1e3 * _loginRateLimitWindowSeconds_()), _writeLoginRateStateUnlocked_(key, state, map), state.blockedUntil && _safeAudit_("auth.blocked", {
                username, blockedUntil: new Date(Number(state.blockedUntil || 0)).toISOString(), failedAttempts: Number(state.count || 0), reason: "max-attempts-user-or-fingerprint-durable"
            });
        }), _saveLoginRateDurableMap_(map);
    });
}
function _safeAudit_(action, detail, actor) {
    try {
        if (typeof logAudit_ == "function")
            return logAudit_(action, detail, actor);
        if (_appIsFnName_("_coreWriteAuditLog_"))
            return _coreWriteAuditLog_(action, detail, actor);
        try {
            Logger.log("[AUDIT:AUTH_DIRECT] " + String(action || "") + " | " + JSON.stringify(detail || {}));
        }
        catch (_e) {
            _recordWarning_("ec", _e);
        }
        return {
            ok: !0, directAudit: !0
        };
    }
    catch (_err) {
        try {
            Logger.log("[AUDIT:ERROR] " + String(_err && _err.message ? _err.message : _err));
        }
        catch (_e2) {
            _recordWarning_("ec", _e2);
        }
        return {
            ok: !1, auditOnly: !0, msg: String(_err && _err.message ? _err.message : _err)
        };
    }
}
function _authCacheBackedPropertyStore_(prefix, ttlSeconds) {
    function k_(key) {
        return prefix + String(key || "").replace(/[^A-Za-z0-9_\-]/g, "_").slice(0, 160);
    }
    return prefix = String(prefix || "auth_store_"), ttlSeconds = Math.max(30, Math.min(Number(ttlSeconds || 21600) || 21600, 21600)), {
        getProperty: function (key) {
            try {
                return _AppScriptCache_().get(k_(key));
            }
            catch (_e) {
                return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
                    file: "C10"
                }), null;
            }
        }, setProperty: function (key, value) {
            try {
                return _AppScriptCache_().put(k_(key), String(value == null ? "" : value), ttlSeconds), !0;
            }
            catch (_e) {
                return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
                    file: "C10"
                }), !1;
            }
        }, deleteProperty: function (key) {
            try {
                return _AppScriptCache_().remove(k_(key)), !0;
            }
            catch (_e) {
                return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
                    file: "C10"
                }), !1;
            }
        }, getProperties: function () {
            return {};
        }
    };
}
function _sessionMetaStore_() {
    return _authCacheBackedPropertyStore_("sess_meta_ro_", _sessionMetaCacheTtlSeconds_());
}
function _sessionMetaStoreMode_() {
    return "cache-service-current-hash-legacy-raw-disabled-default";
}
function _sessionMetaDurablePrefix_() {
    return "sess_meta_h_";
}
function _sessionMetaTokenFingerprint_(token) {
    try {
        return _appSha256Hex_(String(token || "")).substring(0, 12);
    }
    catch (_e) {
        return "unavailable";
    }
}
function _sessionMetaKey_(token) {
    token = String(token || "");
    try {
        return _sessionMetaDurablePrefix_() + _appSha256Hex_(token).substring(0, 48);
    }
    catch (_e) {
        return _recordWarning_("ec", _e), _sessionMetaDurablePrefix_() + token.replace(/[^A-Za-z0-9_\-]/g, "").slice(0, 48);
    }
}
function _sessionMetaPreviousHashedKey_(token) {
    token = String(token || "");
    try {
        return "sess_meta_" + _appSha256Hex_(token).substring(0, 48);
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C10"
        }), "";
    }
}
function _sessionMetaPreviousKey_(token) {
    return "sess_meta_" + String(token || "");
}
function _sessionMetaLegacyReadMode_() {
    var raw = String(_scriptProp_("SESSION_META_LEGACY_READ_MODE", "previous-hash-only") || "").trim().toLowerCase().replace(/_/g, "-");
    if (raw === "none" || raw === "off" || raw === "disabled" || raw === "current-only")
        return "current-only";
    if (raw === "raw" || raw === "all" || raw === "previous-hash-and-raw")
        return "previous-hash-and-raw";
    return "previous-hash-only";
}
function _sessionMetaLegacyHashedReadEnabled_() {
    return _sessionMetaLegacyReadMode_() !== "current-only";
}
function _sessionMetaLegacyRawReadEnabled_() {
    return _sessionMetaLegacyReadMode_() === "previous-hash-and-raw";
}
function _sessionMetaLegacyTelemetryKey_() {
    return "session_meta_legacy_read_r227";
}
function _noteSessionMetaLegacyRead_(kind) {
    kind = String(kind || "unknown").replace(/[^A-Za-z0-9_\-]/g, "_").slice(0, 40);
    try {
        var cache = _sessionMetaCache_(), key = _sessionMetaLegacyTelemetryKey_(), state = cache ? _parseAuthStoreJson_(cache.get(key)) : null;
        state = state && typeof state == "object" ? state : { total: 0, byKind: {}, firstObservedAt: "", lastObservedAt: "" };
        var now = new Date().toISOString();
        state.total = Number(state.total || 0) + 1, state.byKind = state.byKind && typeof state.byKind == "object" ? state.byKind : {}, state.byKind[kind] = Number(state.byKind[kind] || 0) + 1, state.firstObservedAt || (state.firstObservedAt = now), state.lastObservedAt = now;
        cache && cache.put(key, JSON.stringify(state), 21600);
        return state;
    }
    catch (_telemetryErr) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("session.meta.legacyTelemetry", _telemetryErr), null;
    }
}
function _promoteSessionMetaLegacyRecord_(token, raw, sourceKey, sourceKind) {
    if (!(token = String(token || "")) || !raw)
        return null;
    var parsed = JSON.parse(String(raw));
    parsed && typeof parsed == "object" || (parsed = {}), parsed.metaStamp = "current", parsed.migratedFrom = String(sourceKind || "legacy").slice(0, 40), parsed.migratedAt = new Date().toISOString();
    var serialized = JSON.stringify(parsed), store = _sessionMetaStore_(), currentKey = _sessionMetaKey_(token), cache = _sessionMetaCache_();
    store.setProperty(currentKey, serialized);
    sourceKey && sourceKey !== currentKey && store.deleteProperty(sourceKey);
    cache && cache.put(_sessionMetaCacheKey_(token), serialized, _sessionMetaCacheTtlSeconds_());
    _noteSessionMetaLegacyRead_(sourceKind || "legacy");
    _safeAudit_("security.sessionMeta.promoted", {
        sourceKind: String(sourceKind || "legacy"), tokenFingerprint: _sessionMetaTokenFingerprint_(token), rawTokenKeyRead: String(sourceKind || "") === "previous-raw"
    });
    return parsed;
}
function _sessionMetaCacheKey_(token) {
    token = String(token || "");
    try {
        var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token, Utilities.Charset.UTF_8);
        return "sess_meta_cache_" + Utilities.base64EncodeWebSafe(digest).replace(/=+$/g, "").slice(0, 48);
    }
    catch (_e) {
        return _recordWarning_("ec", _e), "sess_meta_cache_" + token.replace(/[^A-Za-z0-9_\-]/g, "").slice(0, 80);
    }
}
function _sessionMetaCacheTtlSeconds_() {
    return _appIsFnName_("_sessionCacheTtlSeconds_") ? _sessionCacheTtlSeconds_() : Math.max(300, Math.min(Number(_SESSION_TOUCH_TTL_ || 3600) || 3600, 3600));
}
function _sessionMetaCache_() {
    try {
        return _appIsFnName_("_AppScriptCache_") ? _AppScriptCache_() : null;
    }
    catch (_e) {
        return _recordWarning_("ec", _e), null;
    }
}
function _sessionMetaMaxEntries_() {
    return Math.max(100, Math.min(1e3, Number(_scriptProp_("SESSION_META_MAX_ENTRIES", 400)) || 400));
}
function _sessionMetaCleanupEveryMs_() {
    return 216e5;
}
function _parseAuthStoreJson_(raw) {
    try {
        return raw ? JSON.parse(String(raw || "{}")) : null;
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C10"
        }), null;
    }
}
function _authRecordTimeMs_(rec) {
    return rec = rec || {}, Date.parse(rec.lastSeenAt || rec.persistedAt || rec.issuedAt || rec.expiresAt || 0) || 0;
}
function _sessionResumeMaxEntries_() {
    return Math.max(100, Math.min(5e3, Number(_scriptProp_("SESSION_RESUME_MAX_ENTRIES", 800)) || 800));
}
function _sessionResumeMaxPerUser_() {
    return Math.max(1, Math.min(50, Number(_scriptProp_("SESSION_RESUME_MAX_PER_USER", 5)) || 5));
}
function _sessionRecordUserKey_(rec) {
    return rec = rec || {}, String(rec.username || rec.email || rec.user || "").trim().toLowerCase();
}
function _cleanupDurableResumeHandles_(store, props, now) {
    var prefix = _appIsFnName_("_sessionResumeDurablePrefix_") ? _sessionResumeDurablePrefix_() : "sess_resume_h_", maxEntries = _appIsFnName_("_sessionResumeMaxEntries_") ? _sessionResumeMaxEntries_() : 800, maxPerUser = _appIsFnName_("_sessionResumeMaxPerUser_") ? _sessionResumeMaxPerUser_() : 5, all = [], remove = {};
    Object.keys(props || {}).forEach(function (k) {
        if (String(k || "").indexOf(prefix) === 0) {
            var rec = _parseAuthStoreJson_(props[k]);
            if (!rec || !rec.token || !_sessionRecordUserKey_(rec))
                return remove[k] = "invalid-resume-record", void 0;
            var expiry = Date.parse(rec.expiresAt || 0) || 0, touched = _authRecordTimeMs_(rec);
            if (expiry && expiry < now)
                return remove[k] = "expired-resume-record", void 0;
            all.push({
                key: k, rec, user: _sessionRecordUserKey_(rec), touched, expiry
            });
        }
    });
    var byUser = {};
    all.forEach(function (r) {
        byUser[r.user] || (byUser[r.user] = []), byUser[r.user].push(r);
    }), Object.keys(byUser).forEach(function (u) {
        byUser[u].sort(function (a, b) {
            return (b.touched || 0) - (a.touched || 0);
        }).slice(maxPerUser).forEach(function (r) {
            remove[r.key] = "over-user-resume-limit";
        });
    }), all.sort(function (a, b) {
        return (b.touched || 0) - (a.touched || 0);
    }).slice(maxEntries).forEach(function (r) {
        remove[r.key] = remove[r.key] || "over-global-resume-limit";
    });
    var removed = 0;
    return Object.keys(remove).forEach(function (k) {
        try {
            var rec = _parseAuthStoreJson_(props[k]);
            rec && rec.token && _appIsFnName_("_clearSession_") && _clearSession_(String(rec.token || ""));
        }
        catch (_clearErr) {
            _recordWarning_("session.resume.cleanupClearToken", _clearErr);
        }
        try {
            store.deleteProperty(k), removed += 1;
        }
        catch (_delErr) {
            _recordWarning_("session.resume.cleanupDelete", _delErr);
        }
    }), {
        scanned: all.length + Object.keys(remove).length, removed, maxEntries, maxPerUser
    };
}
function _cleanupSessionMetaStore_(force) {
    try {
        var store = _sessionMetaStore_(), props = store.getProperties() || {}, now = Date.now(), last = Number(props.__sess_meta_cleanup_at || 0) || 0;
        if (!force && last && now - last < _sessionMetaCleanupEveryMs_())
            return !1;
        var metas = Object.keys(props).filter(function (k) {
            return k.indexOf(_sessionMetaDurablePrefix_()) === 0 || k.indexOf("sess_meta_") === 0;
        }).map(function (k) {
            var parsed = _parseAuthStoreJson_(props[k]) || {}, expiry, touched;
            return {
                key: k, expiry: Date.parse(parsed.expiresAt || parsed.lastSeenAt || parsed.issuedAt || 0) || 0, touched: Date.parse(parsed.lastSeenAt || parsed.persistedAt || parsed.issuedAt || 0) || 0
            };
        }), remove = {};
        metas.forEach(function (m) {
            (!m.expiry || m.expiry < now) && (remove[m.key] = !0);
        }), metas.sort(function (a, b) {
            return (b.touched || 0) - (a.touched || 0);
        }).slice(_sessionMetaMaxEntries_()).forEach(function (m) {
            remove[m.key] = !0;
        }), Object.keys(remove).forEach(function (k) {
            try {
                store.deleteProperty(k);
            }
            catch (_delErr) {
                _recordWarning_("ec", _delErr);
            }
        });
        var resumeCleanup = _appIsFnName_("_cleanupDurableResumeHandles_") ? _cleanupDurableResumeHandles_(store, props, now) : null;
        return store.setProperty("__sess_meta_cleanup_at", String(now)), {
            ok: !0, sessionMetaRemoved: Object.keys(remove).length, resumeCleanup
        };
    }
    catch (_e) {
        return _recordWarning_("ec", _e), _appIsFnName_("_logWarn_") && _logWarn_("auth.cleanupSessionMeta", {
            error: String(_e && _e.message || _e)
        }), !1;
    }
}
function _persistSessionMeta_(token, sess) {
    if (!(token = String(token || "")) || !sess || typeof sess != "object")
        return !1;
    try {
        var nowIso = new Date().toISOString(), safe = {
            username: String(sess.username || ""), name: String(sess.name || ""), email: String(sess.email || ""), role: String(sess.role || ""), clientBinding: String(sess.clientBinding || ""), issuedAt: String(sess.issuedAt || nowIso), lastSeenAt: String(sess.lastSeenAt || nowIso), expiresAt: String(sess.expiresAt || (_appIsFnName_("_sessionExpiryIso_") ? _sessionExpiryIso_(sess.lastSeenAt || nowIso) : nowIso)), persistedAt: String(sess.persistedAt || nowIso), sessionRecovered: !!sess.sessionRecovered, csrfStored: !1, storeMode: _sessionMetaStoreMode_(), metaStamp: "current"
        }, raw = JSON.stringify(safe), cache = _sessionMetaCache_();
        if (cache)
            try {
                cache.put(_sessionMetaCacheKey_(token), raw, _sessionMetaCacheTtlSeconds_());
            }
            catch (_cachePutErr) {
                _appIsFnName_("_recordWarning_") && _recordWarning_("session.meta.cachePut", _cachePutErr);
            }
        return _cleanupSessionMetaStore_(!1), _sessionMetaStore_().setProperty(_sessionMetaKey_(token), raw), !0;
    }
    catch (_e) {
        return _recordWarning_("ec", _e), _appIsFnName_("_logWarn_") && _logWarn_("auth.persistSessionMeta", {
            error: String(_e && _e.message || _e), tokenFingerprint: _sessionMetaTokenFingerprint_(token), storeMode: _sessionMetaStoreMode_()
        }), !1;
    }
}
function _readSessionMeta_(token) {
    if (!(token = String(token || "")))
        return null;
    try {
        var cache = _sessionMetaCache_();
        if (cache) {
            var cached = cache.get(_sessionMetaCacheKey_(token));
            if (cached)
                return JSON.parse(cached);
        }
        var store = _sessionMetaStore_(), currentKey = _sessionMetaKey_(token), raw = store.getProperty(currentKey);
        if (raw) {
            var current = JSON.parse(raw);
            if (cache)
                try {
                    cache.put(_sessionMetaCacheKey_(token), JSON.stringify(current), _sessionMetaCacheTtlSeconds_());
                }
                catch (_cachePromoteErr) {
                    _appIsFnName_("_recordWarning_") && _recordWarning_("session.meta.currentCache", _cachePromoteErr);
                }
            return current;
        }
        if (_sessionMetaLegacyHashedReadEnabled_()) {
            var previousHashedKey = _sessionMetaPreviousHashedKey_(token), previousHashedRaw = previousHashedKey ? store.getProperty(previousHashedKey) : "";
            if (previousHashedRaw)
                return _promoteSessionMetaLegacyRecord_(token, previousHashedRaw, previousHashedKey, "previous-hash");
        }
        if (_sessionMetaLegacyRawReadEnabled_()) {
            var previousRawKey = _sessionMetaPreviousKey_(token), previousRaw = store.getProperty(previousRawKey);
            if (previousRaw)
                return _promoteSessionMetaLegacyRecord_(token, previousRaw, previousRawKey, "previous-raw");
        }
        return null;
    }
    catch (_e) {
        return _recordWarning_("ec", _e), _appIsFnName_("_logWarn_") && _logWarn_("auth.readSessionMeta", {
            error: String(_e && _e.message || _e), tokenFingerprint: _sessionMetaTokenFingerprint_(token), storeMode: _sessionMetaStoreMode_(), legacyMode: _sessionMetaLegacyReadMode_()
        }), null;
    }
}
function _clearSessionMeta_(token) {
    if (!(token = String(token || "")))
        return !1;
    var ok = !1;
    try {
        var cache = _sessionMetaCache_();
        cache && (cache.remove(_sessionMetaCacheKey_(token)), ok = !0);
    }
    catch (_cacheErr) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("session.meta.removeCache", _cacheErr);
    }
    try {
        var store = _sessionMetaStore_();
        if (store.deleteProperty(_sessionMetaKey_(token)), _appIsFnName_("_sessionMetaPreviousHashedKey_")) {
            var oldHashedKey = _sessionMetaPreviousHashedKey_(token);
            oldHashedKey && store.deleteProperty(oldHashedKey);
        }
        _appIsFnName_("_sessionMetaPreviousKey_") && store.deleteProperty(_sessionMetaPreviousKey_(token)), ok = !0;
    }
    catch (_e) {
        _appIsFnName_("_logWarn_") && _logWarn_("auth.clearSessionMeta", {
            error: String(_e && _e.message || _e), tokenFingerprint: _sessionMetaTokenFingerprint_(token), storeMode: _sessionMetaStoreMode_()
        });
    }
    return ok;
}
function _extractAuthToken_(payload) {
    return payload && typeof payload == "object" ? String(payload.token || payload._token || payload.authToken || payload.sessionToken || payload.auth && payload.auth.token || payload.session && payload.session.token || "").trim() : "";
}
function _recoverSessionFromMeta_(token) {
    var meta = _readSessionMeta_(token);
    if (!meta)
        return null;
    if (_appIsFnName_("_isSessionExpired_") && _isSessionExpired_(meta))
        return _clearSessionMeta_(token), null;
    if (meta.sessionRecovered = !0, meta.sessionRecoveryMode = "durable_meta_current", meta.lastSeenAt = String(meta.lastSeenAt || meta.touchedAt || new Date().toISOString()), !meta.expiresAt && _appIsFnName_("_sessionExpiryIso_") && (meta.expiresAt = _sessionExpiryIso_(meta.lastSeenAt)), !meta.csrfToken && _appIsFnName_("_issueCsrfToken_"))
        try {
            _issueCsrfToken_(token, meta);
        }
        catch (_csrfRecoverErr) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("session.meta.recoverCsrf", _csrfRecoverErr);
        }
    return meta;
}
function _randomSalt_() {
    return Utilities.base64EncodeWebSafe(Utilities.getUuid()).replace(/[^a-zA-Z0-9]/g, "").slice(0, 24);
}
function _passwordPepper_(opts) {
    opts = opts || {};
    try {
        var pepper = String(_scriptProp_("PASSWORD_PEPPER", "") || "").trim();
        if (pepper || opts.create === !1)
            return pepper;
        if (_appIsFnName_("_scriptPropertiesRuntimeWritesAllowed_") && _scriptPropertiesRuntimeWritesAllowed_())
            return pepper = Utilities.base64EncodeWebSafe(Utilities.getUuid() + ":" + Utilities.getUuid()).replace(/=+$/g, ""), _setScriptProp_("PASSWORD_PEPPER", pepper, {
                owner: "_passwordPepper_", mode: "setup-unlocked"
            }), _appIsFnName_("_scriptPropertiesSnapshot_") && _scriptPropertiesSnapshot_(!0), _safeAudit_("security.passwordPepper.created", {
                scheme: _SECURE_PASSWORD_SCHEME_, mode: "setup-unlocked"
            }), pepper;
        throw new Error("PASSWORD_PEPPER ยังไม่ได้ตั้งค่าใน Project Settings; Production Final ห้ามสร้าง Script Properties อัตโนมัติ");
    }
    catch (e) {
        if (_recordWarning_("auth.scriptProperties.passwordPepper", e), opts.create === !1)
            return "";
        throw new Error("PASSWORD_PEPPER unavailable: " + String(e && e.message || e));
    }
}
function _hashPasswordCore_(raw, salt, rounds, pepper) {
    raw = String(raw || ""), salt = String(salt || ""), rounds = Number(rounds || _passwordHashDefaultRounds_());
    for (var value = raw + "::" + salt + "::" + String(pepper || ""), i = 0; i < rounds; i++)
        value = _appSha256Hex_(value);
    return value;
}
function _hashPasswordCurrentWithPepper_(raw, salt, rounds, pepper) {
    rounds = Math.max(_passwordHashMinRounds_(), Math.min(_passwordHashMaxRounds_(), Number(rounds || _passwordHashDefaultRounds_()) || _SECURE_PASSWORD_ROUNDS_));
    var saltValue = String(salt || ""), value = _hashPasswordCore_(raw, saltValue, rounds, String(pepper || ""));
    return _SECURE_PASSWORD_SCHEME_ + "$" + rounds + "$" + saltValue + "$" + value;
}
function _hashPasswordProduction_(raw, salt, rounds) {
    return _hashPasswordCurrentWithPepper_(raw, salt, rounds, _passwordPepper_({
        create: !0
    }));
}
function _verifyStampedPasswordHash_(candidate, stored) {
    candidate = String(candidate || ""), stored = String(stored || "").trim();
    try {
        _verifyStampedPasswordHash_._lastPepperMode = "";
    }
    catch (_resetMode) {
        _recordWarning_("auth.password.verify.resetMode", _resetMode);
    }
    if (!candidate || stored.indexOf(_SECURE_PASSWORD_SCHEME_ + "$") !== 0)
        return !1;
    var parts = stored.split("$");
    if (parts.length !== 4)
        return !1;
    var rounds = Number(parts[1] || _SECURE_PASSWORD_ROUNDS_), salt = parts[2] || "", current = "";
    try {
        current = _passwordPepper_({
            create: !1
        });
    }
    catch (_pepperReadErr) {
        _recordWarning_("auth.password.verify.pepperRead", _pepperReadErr), current = "";
    }
    if (!current)
        return !1;
    var ok = _hashPasswordCurrentWithPepper_(candidate, salt, rounds, current) === stored;
    if (ok)
        try {
            _verifyStampedPasswordHash_._lastPepperMode = "current";
        }
        catch (_modeErr) {
            _recordWarning_("auth.password.verify.mode", _modeErr);
        }
    return ok;
}
function _verifyPasswordEnhanced_(raw, stored, opts) {
    return raw = String(raw || ""), stored = String(stored || "").trim(), !(!raw || !stored) && _verifyStampedPasswordHash_(raw, stored);
}
function _isStrongPasswordHash_(stored) {
    return (stored = String(stored || "")).indexOf(_SECURE_PASSWORD_SCHEME_ + "$") === 0;
}
function _passwordHashStoredRounds_(stored) {
    var p = String(stored || "").split("$");
    return p.length === 4 ? Number(p[1] || 0) : 0;
}
function _passwordHashNeedsRehash_(stored) {
    var r = _passwordHashStoredRounds_(stored), d = _passwordHashDefaultRounds_();
    return new RegExp("^" + _SECURE_PASSWORD_SCHEME_ + "\\$").test(String(stored || "")) && r > 0 && r !== d;
}
function _sessionBindingHash_(payload) {
    var ctx = (payload = payload || {}).clientContext || {}, raw = [
        String(ctx.userAgent || ""), String(ctx.language || ""), String(ctx.platform || ""), String(ctx.timezone || "")
    ].join("|");
    return _appSha256Hex_(raw);
}
function _attachSessionBinding_(sessObj, payload) {
    return (sessObj = sessObj || {}).clientBinding = _sessionBindingHash_(payload || {}), sessObj.lastSeenAt = new Date().toISOString(), sessObj;
}
function _sessionBindingStrictMode_() {
    return !!_authSecurityProfile_().sessionBindingStrict;
}
function _isStrictSessionBindingRequired_(payload, minRole) {
    var ctx = (payload = payload || {})._securityContext || {}, role = String(minRole || payload.requiredRole || "").toLowerCase();
    return _sessionBindingStrictMode_() && (!!ctx.write || !!ctx.admin || role === "admin" || !!payload.requireStrictBinding);
}
function _verifySessionBinding_(sessObj, payload, options) {
    sessObj = sessObj || {}, payload = payload || {};
    var strict = (options = options || {}).strict === !0;
    if (!sessObj.clientBinding)
        return {
            ok: !0, strict, skipped: "no-session-binding"
        };
    var ctx = payload.clientContext || {}, hasCtx;
    if (!(ctx.userAgent || ctx.language || ctx.platform || ctx.timezone))
        return {
            ok: !0, strict, skipped: "no-client-context"
        };
    var nowBinding = _sessionBindingHash_(payload);
    if (nowBinding && sessObj.clientBinding !== nowBinding) {
        if (strict) {
            try {
                _safeAudit_("auth.sessionBinding.strictMismatch", {
                    mode: "production-strict", route: String(payload.method || payload.route || payload.requestId || ""), minRole: String(options.minRole || "")
                });
            }
            catch (_strictAuditErr) {
                _recordWarning_("ec", _strictAuditErr);
            }
            throw new Error("session binding ไม่ตรงกับอุปกรณ์หรือเบราว์เซอร์ กรุณาเข้าสู่ระบบใหม่");
        }
        sessObj.clientBindingPrevious = sessObj.clientBinding, sessObj.clientBinding = nowBinding, sessObj.clientBindingSoftMismatchAt = new Date().toISOString();
        try {
            _safeAudit_("auth.sessionBinding.softMismatch", {
                mode: "production-soft", route: String(payload.method || payload.route || payload.requestId || "")
            });
        }
        catch (_auditErr) {
            _recordWarning_("ec", _auditErr);
        }
        return {
            ok: !1, strict: !1, rotatedBinding: !0
        };
    }
    return {
        ok: !0, strict
    };
}
function _sessionTouchThrottleMs_() {
    try {
        var v = Number(_appIsFnName_("_scriptProp_") ? _scriptProp_("SESSION_TOUCH_THROTTLE_MS", 120000) : 120000) || 120000;
        return Math.max(30000, Math.min(v, 300000));
    }
    catch (_e) {
        return 120000;
    }
}
function _touchSession_(token, sess, payload) {
    if (token && sess) {
        _verifySessionBinding_(sess, payload || {}, {
            strict: !1, source: "touch"
        });
        var now = Date.now(), lastMs = Date.parse(sess.lastSeenAt || sess.touchedAt || sess.issuedAt || 0) || 0, force = payload && payload.forceSessionTouch === !0, throttle = _sessionTouchThrottleMs_();
        if (!force && lastMs && now - lastMs < throttle) {
            try {
                sess.__touchSkippedAt = new Date(now).toISOString(), sess.__touchThrottleMs = throttle;
            }
            catch (_skip) { _appIgnoreExpected_("Code_10_Security_Auth.gs.ignored", _skip); }
            return sess;
        }
        var nowIso = new Date(now).toISOString();
        sess.lastSeenAt = nowIso, _appIsFnName_("_sessionExpiryIso_") && (sess.expiresAt = _sessionExpiryIso_(nowIso)), _storeSession_(token, sess);
    }
}
function _withScriptLock_(waitMs, fn) {
    if (typeof fn != "function")
        throw new Error("_withScriptLock_ ต้องรับ callback");
    if (typeof __APP_WRITE_LOCK_DEPTH__ == "number" && __APP_WRITE_LOCK_DEPTH__ > 0)
        return fn(null);
    var lock = LockService.getScriptLock();
    lock.waitLock(Number(waitMs || 1e4));
    try {
        return fn(lock);
    }
    finally {
        try {
            lock.releaseLock();
        }
        catch (_e) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("lock.release.auth", _e);
        }
    }
}
function _normalizeActiveFlag_(v) {
    var s = String(v == null ? "Y" : v).trim().toUpperCase();
    return !(s === "N" || s === "FALSE" || s === "0" || s === "NO" || s === "INACTIVE" || s === "DISABLED" || s === "SUSPENDED" || s === "ระงับ" || s === "ปิด" || s === "ไม่ใช้งาน");
}
function _getUsersRepository_() {
    return makeSheetRepository_("Users", "username", {
        createdAtField: "", updatedAtField: "updatedAt"
    });
}
function _listUserObjects_() {
    return readSheetObjectsCached_("Users", {
        includeDeleted: !0
    });
}
function _findUserObjectByUsername_(username) {
    var target = String(username || "").trim().toLowerCase();
    if (!target)
        return null;
    var rows, matches = _listUserObjects_().filter(function (row) {
        return String(row && row.username || "").trim().toLowerCase() === target;
    });
    return matches.length ? (matches.sort(function (a, b) {
        return _rowFreshnessScore_(b).localeCompare(_rowFreshnessScore_(a));
    }), matches[0] || null) : null;
}
function _assertUserWriteUniqueness_(payload) {
    payload = payload || {};
    var action = String(payload.action || "").toLowerCase();
    if (action !== "add" && action !== "edit")
        return !0;
    var username = String(payload.username || payload.u || "").trim().toLowerCase(), email = String(payload.email || "").trim().toLowerCase(), oldUsername = String(payload.oldUsername || payload.oldU || "").trim().toLowerCase(), rows;
    return _listUserObjects_().forEach(function (row) {
        if (_normalizeActiveFlag_((row = row || {}).active)) {
            var existingUser = String(row.username || "").trim().toLowerCase(), existingEmail = String(row.email || "").trim().toLowerCase();
            if (action !== "edit" || existingUser !== oldUsername) {
                if (username && existingUser && username === existingUser)
                    throw new Error("Username ซ้ำในระบบ");
                if (email && existingEmail && email === existingEmail)
                    throw new Error("Email ซ้ำในระบบ");
            }
        }
    }), !0;
}
function _validateUserPayload_(payload, mode) {
    payload = payload || {}, mode = String(mode || payload.action || "").toLowerCase();
    var username = String(payload.username || payload.u || "").trim(), name = String(payload.name || payload.n || "").trim(), email = String(payload.email || "").trim(), role = String(payload.role || "Viewer").trim(), password = String(payload.password || payload.p || ""), allowed = {
        admin: "Admin", staff: "Staff", viewer: "Viewer"
    };
    if (!username)
        throw new Error("กรุณาระบุชื่อผู้ใช้");
    if (!/^[A-Za-z0-9_.@-]{3,100}$/.test(username))
        throw new Error("ชื่อผู้ใช้ต้องยาวอย่างน้อย 3 ตัว และใช้ได้เฉพาะ a-z, 0-9, _ . @ -");
    if (!name)
        throw new Error("กรุณาระบุชื่อ-สกุล");
    var normalizedRole = _normalizeUserRole_(role);
    if (!allowed[String(normalizedRole).toLowerCase()])
        throw new Error("ระดับสิทธิ์ไม่ถูกต้อง");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error("รูปแบบอีเมลไม่ถูกต้อง");
    return mode === "add" && validatePasswordPolicy_(password), {
        action: mode || "edit", username, oldUsername: String(payload.oldUsername || payload.oldU || username).trim(), password, name, email, role: allowed[String(normalizedRole).toLowerCase()] || "Viewer", active: _normalizeActiveFlag_(payload.active === void 0 ? "Y" : payload.active) ? "Y" : "N"
    };
}
function _userHeaderIndexes_(headers) {
    function userHeaderNorm_(name) {
        return String(name || "").toLowerCase().replace(/\s/g, "");
    }
    function idxAny(names, opt) {
        names = Array.isArray(names) ? names : [
            names
        ];
        for (var i = 0; i < names.length; i++) {
            var found = headers.indexOf(userHeaderNorm_(names[i]));
            if (found > -1)
                return found;
        }
        if (!opt || !opt.optional)
            throw new Error("ไม่พบคอลัมน์ " + names[0] + " ในชีต Users");
        return -1;
    }
    return headers = (headers || []).map(function (h) {
        return String(h || "").trim().toLowerCase().replace(/\s/g, "");
    }), {
        username: idxAny([
            "username", "user", "login", "account", "userid", "ชื่อผู้ใช้", "ชื่อผู้ใช้งาน", "ผู้ใช้งาน", "ผู้ใช้", "บัญชีผู้ใช้"
        ]), name: idxAny([
            "name", "displayname", "fullname", "fullName", "ชื่อ", "ชื่อสกุล"
        ], {
            optional: !0
        }), role: idxAny([
            "role", "permission", "permissions", "level", "สิทธิ์", "บทบาท"
        ], {
            optional: !0
        }), email: idxAny([
            "email", "mail", "อีเมล"
        ], {
            optional: !0
        }), password: idxAny([
            "password", "pass", "pwd", "pin", "รหัสผ่าน", "รหัส", "รหัสผู้ใช้"
        ], {
            optional: !0
        }), passwordHash: idxAny([
            "passwordhash", "passwordHash", "hash", "password_hash", "รหัสผ่านhash"
        ], {
            optional: !0
        }), active: idxAny([
            "active", "status", "enabled", "isactive", "สถานะ", "ใช้งาน"
        ], {
            optional: !0
        }), updatedAt: idxAny([
            "updatedat", "updatedAt", "updated", "แก้ไขล่าสุด"
        ], {
            optional: !0
        }), lastLoginAt: idxAny([
            "lastloginat", "lastLoginAt", "lastlogin", "เข้าสู่ระบบล่าสุด"
        ], {
            optional: !0
        })
    };
}
function _normalizeUserRole_(role) {
    var raw = String(role == null ? "" : role).trim(), key, map;
    return {
        admin: "Admin", administrator: "Admin", ผู้ดูแลระบบ: "Admin", staff: "Staff", เจ้าหน้าที่: "Staff", viewer: "Viewer", "read-only": "Viewer", readonly: "Viewer", ผู้อ่าน: "Viewer"
    }[raw.toLowerCase()] || (/admin/i.test(raw) ? "Admin" : /viewer/i.test(raw) ? "Viewer" : raw || "Viewer");
}
function _verifyAndMigrateUserPassword_(sh, rowIndex, row, indexes, rawPassword) {
    row = row || [], indexes = indexes || {}, rawPassword = String(rawPassword || "");
    try {
        _verifyAndMigrateUserPassword_._lastTouched = !1;
    }
    catch (_touchResetErr) {
        _recordWarning_("auth.password.touchReset", _touchResetErr);
    }
    var strong = indexes.passwordHash > -1 ? String(row[indexes.passwordHash] || "").trim() : "", hasStrongHash = !(!strong || !_isStrongPasswordHash_(strong)), bootstrapPlain = _plainUserPasswordFromRow_(row, indexes), bootstrapPlainMatched = !!(_loginPasswordHashBootstrapEnabled_() && bootstrapPlain && _simplePasswordMatches_(rawPassword, bootstrapPlain));
    if (!hasStrongHash) {
        if (bootstrapPlainMatched)
            return _migratePlainPasswordOnLoginDisabled_(sh, rowIndex, indexes, rawPassword, "missing-or-invalid-passwordHash");
        try {
            _safeAudit_("security.password.loginBlockedNoCanonicalHash", {
                row: rowIndex, hasPasswordHashColumn: indexes.passwordHash > -1, bootstrapAvailable: !!bootstrapPlain
            });
        }
        catch (_auditNoHash) {
            _recordWarning_("auth.password.auditNoHash", _auditNoHash);
        }
        return !1;
    }
    if (!_verifyPasswordEnhanced_(rawPassword, strong, {
        allowPreviousMigration: !1
    })) {
        if (bootstrapPlainMatched)
            return _migratePlainPasswordOnLoginDisabled_(sh, rowIndex, indexes, rawPassword, "hash-mismatch-plain-password-matched");
        try {
            _safeAudit_("security.password.loginHashMismatch", {
                row: rowIndex, bootstrapAvailable: !!bootstrapPlain
            });
        }
        catch (_auditMismatch) {
            _recordWarning_("auth.password.auditMismatch", _auditMismatch);
        }
        return !1;
    }
    var touched = !1;
    if (indexes.passwordHash > -1 && _passwordHashNeedsRehash_(strong)) {
        AppRepository.setCellValue("Users", rowIndex, indexes.passwordHash + 1, _hashPasswordProduction_(rawPassword, _randomSalt_(), _passwordHashDefaultRounds_()), {
            invalidate: !1
        }), touched = !0;
        try {
            _safeAudit_("security.password.rehashOnLogin", {
                row: rowIndex, reason: "rounds-policy", fromRounds: _passwordHashStoredRounds_(strong), toRounds: _passwordHashDefaultRounds_()
            });
        }
        catch (_auditRehash) {
            _recordWarning_("auth.password.auditRehash", _auditRehash);
        }
    }
    touched && indexes.updatedAt > -1 && AppRepository.setCellValue("Users", rowIndex, indexes.updatedAt + 1, new Date().toISOString(), {
        invalidate: !1
    });
    try {
        _verifyAndMigrateUserPassword_._lastTouched = !!touched;
    }
    catch (_touchFlagErr) {
        _recordWarning_("auth.password.touchFlag", _touchFlagErr);
    }
    return !0;
}
function _buildSessionUser_(row, indexes) {
    row = row || [];
    var user = {
        username: (indexes = indexes || {}).username > -1 ? String(row[indexes.username] || "").trim() : "", name: indexes.name > -1 ? String(row[indexes.name] || "").trim() : "", email: indexes.email > -1 ? String(row[indexes.email] || "").trim() : "", role: indexes.role > -1 ? _normalizeUserRole_(row[indexes.role]) : String(indexes.username > -1 ? row[indexes.username] : "").trim().toLowerCase() === "admin" ? "Admin" : "Viewer"
    };
    return user.name || (user.name = user.username || user.email || ""), user;
}
function _sessionResumeTtlSeconds_() {
    return _appIsFnName_("_sessionResumeTtlDefaultSeconds_") ? _sessionResumeTtlDefaultSeconds_() : Math.max(300, Math.min(Number(_SESSION_DURABLE_TTL_SECONDS_ || 21600) || 21600, 21600));
}
function _sessionResumePersistent_() {
    return !(!_appIsFnName_("_sessionExpiryDisabled_") || !_sessionExpiryDisabled_());
}
function _sessionResumeExpiresAt_() {
    return _sessionResumePersistent_() && _appIsFnName_("_sessionPersistentUntilIso_") ? _sessionPersistentUntilIso_() : new Date(Date.now() + 1e3 * _sessionResumeTtlSeconds_()).toISOString();
}
function _sessionResumeCacheKey_(h) {
    return "sess_resume_" + _appSha256Hex_(String(h || "")).substring(0, 48);
}
function _sessionResumeDurablePrefix_() {
    return "sess_resume_h_";
}
function _sessionResumeDurableKey_(h) {
    return (h = String(h || "").trim()) ? _sessionResumeDurablePrefix_() + _appSha256Hex_(h).substring(0, 48) : "";
}
function _sessionResumeDurableStore_() {
    return _authCacheBackedPropertyStore_("sess_resume_ro_", _sessionResumeTtlSeconds_());
}
function _persistSessionResumeRecord_(handle, record) {
    if (!(handle = String(handle || "").trim()) || !record || !_sessionResumePersistent_())
        return !1;
    var key = _sessionResumeDurableKey_(handle), nowIso = new Date().toISOString(), safe = Object.assign({}, record || {}, {
        username: String(record && record.username || ""), token: String(record && record.token || ""), clientBinding: String(record && record.clientBinding || ""), issuedAt: String(record && record.issuedAt || nowIso), persistedAt: nowIso, expiresAt: String(record && record.expiresAt || _sessionResumeExpiresAt_()), resumeStoreStamp: "durable-resume-current"
    });
    try {
        return _sessionResumeDurableStore_().setProperty(key, JSON.stringify(safe)), !0;
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("session.resumeHandle.durablePut.first", _e);
        try {
            return _cleanupSessionMetaStore_(!0), _sessionResumeDurableStore_().setProperty(key, JSON.stringify(safe)), !0;
        }
        catch (_retryErr) {
            return _appIsFnName_("_recordWarning_") && _recordWarning_("session.resumeHandle.durablePut.retry", _retryErr), !1;
        }
    }
}
function _readSessionResumeRecordDurable_(handle) {
    if (!(handle = String(handle || "").trim()))
        return null;
    try {
        var raw = _sessionResumeDurableStore_().getProperty(_sessionResumeDurableKey_(handle));
        return raw ? JSON.parse(raw || "{}") : null;
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C10"
        }), null;
    }
}
function _deleteSessionResumeRecordDurable_(handle) {
    if (!(handle = String(handle || "").trim()))
        return !1;
    try {
        return _sessionResumeDurableStore_().deleteProperty(_sessionResumeDurableKey_(handle)), !0;
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C10"
        }), !1;
    }
}
function _publicSessionUser_(s) {
    return s = s || {}, {
        id: String(s.id || ""), username: String(s.username || ""), email: String(s.email || ""), name: String(s.name || s.username || s.email || ""), role: _normalizeUserRole_(s.role || "Viewer")
    };
}
function _issueSessionResumeHandle_(token, sess, payload) {
    if (!(token = String(token || "").trim()) || !sess)
        return {
            resumeHandle: "", resumeExpiresAt: ""
        };
    var handle = "srh_" + Utilities.getUuid().replace(/-/g, "") + "_" + _appSha256Hex_(token + "|" + Date.now()).substring(0, 16), record = {
        token, username: String(sess.username || ""), clientBinding: String(sess.clientBinding || _sessionBindingHash_(payload || {})), issuedAt: new Date().toISOString(), expiresAt: _sessionResumeExpiresAt_(), mode: "opaque-sessionStorage-resume-handle"
    };
    try {
        safeCachePut_(_AppScriptCache_(), _sessionResumeCacheKey_(handle), record, _sessionResumeTtlSeconds_());
    }
    catch (_resumePutErr) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("session.resumeHandle.cachePut", _resumePutErr);
    }
    return _persistSessionResumeRecord_(handle, record), {
        resumeHandle: handle, resumeExpiresAt: record.expiresAt
    };
}
function _readSessionResumeHandle_(h) {
    if (!(h = String(h || "").trim()))
        return null;
    try {
        var raw = _AppScriptCache_().get(_sessionResumeCacheKey_(h)), rec = raw ? JSON.parse(raw || "{}") : null;
        if (rec && rec.token || !_sessionResumePersistent_() || (rec = _readSessionResumeRecordDurable_(h)), !rec || !rec.token)
            return null;
        if (!_sessionResumePersistent_() && (Date.parse(String(rec.expiresAt || "")) || 0) <= Date.now())
            return _revokeSessionResumeHandle_(h), null;
        try {
            safeCachePut_(_AppScriptCache_(), _sessionResumeCacheKey_(h), rec, _sessionResumeTtlSeconds_());
        }
        catch (_warmErr) {
            _appIsFnName_("_recordWarning_") && _recordWarning_("session.resumeHandle.cacheWarm", _warmErr);
        }
        return rec;
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C10"
        }), null;
    }
}
function _revokeSessionResumeHandle_(h) {
    var ok = !1;
    try {
        _AppScriptCache_().remove(_sessionResumeCacheKey_(h)), ok = !0;
    }
    catch (_e) {
        ok = !1;
    }
    try {
        _deleteSessionResumeRecordDurable_(h) && (ok = !0);
    }
    catch (_e2) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e2);
    }
    return ok;
}
function apiSessionResume(payload) {
    typeof globalThis != "undefined" && globalThis.__APP_API_ROUTER_CONTEXT__ === !0 || !_appIsFnName_("_requestScopeReset_") || _requestScopeReset_({
        newRequest: !0,
        preserveMetrics: !1,
        source: "apiSessionResume-direct"
    });
    payload = payload || {};
    try {
        var handle = String(payload.resumeHandle || payload.sessionResumeHandle || "").trim(), record = _readSessionResumeHandle_(handle);
        if (!record)
            throw new Error("session resume หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        var token = String(record.token || ""), session = _getSession_(token);
        if (!session)
            throw new Error("session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        if (record.clientBinding && session.clientBinding && String(record.clientBinding) !== String(session.clientBinding)) {
            try {
                _safeAudit_("auth.sessionBinding.resumeStoredMismatch", {
                    mode: "strict-resume-current"
                });
            }
            catch (_auditErrResume) {
                _appIsFnName_("_recordWarning_") && _recordWarning_("auth.sessionResume.auditMismatch", _auditErrResume);
            }
            throw new Error("session resume ไม่ตรงกับ session เดิม กรุณาเข้าสู่ระบบใหม่");
        }
        _verifySessionBinding_(session, payload || {}, {
            strict: !0, source: "resume"
        });
        var rotated = _appIsFnName_("_rotateSessionToken_") ? _rotateSessionToken_(token, session, payload, "session-resume") : {
            token, csrfToken: _issueCsrfToken_(token, session)
        }, next = _issueSessionResumeHandle_(rotated.token, session, payload);
        return _revokeSessionResumeHandle_(handle), _safeAudit_("session.resume", {
            username: session.username || session.email || "", mode: "opaque-handle-current-rotated"
        }), ok_(_withClientRouteContract_({
            token: rotated.token, csrfToken: rotated.csrfToken, user: _publicSessionUser_(session), resumeHandle: next.resumeHandle, resumeExpiresAt: next.resumeExpiresAt, modules: [
                "dashboard", "meeting", "budget", "ai"
            ]
        }), "กู้คืน session สำเร็จ");
    }
    catch (e) {
        return _recordWarning_("ec", e), err_(e && e.message ? e.message : String(e));
    }
}
function apiSessionCheck(payload) {
    payload = payload || {};
    try {
        if (payload.resumeHandle || payload.sessionResumeHandle) {
            var record = _readSessionResumeHandle_(payload.resumeHandle || payload.sessionResumeHandle), session = record && _getSession_(record.token);
            return session && _verifySessionBinding_(session, payload || {}, {
                strict: !0, source: "session-check-resume"
            }), ok_({
                authenticated: !!session, user: session ? _publicSessionUser_(session) : null, resumeExpiresAt: record && record.expiresAt || ""
            }, "ตรวจ session สำเร็จ");
        }
        var authSession = requireAuth_(payload, "viewer");
        return ok_({
            authenticated: !0, user: _publicSessionUser_(authSession), csrfToken: String(authSession.csrfToken || "")
        }, "ตรวจ session สำเร็จ");
    }
    catch (e) {
        return _recordWarning_("ec", e), ok_({
            authenticated: !1, reason: String(e && e.message ? e.message : e)
        }, "ไม่พบ session ที่ใช้งานได้");
    }
}
function _requireSessionHmacSecret_() {
    if (!_appIsFnName_("_hmacSecret_") || !_appIsFnName_("_hmacSha256Hex_")) {
        var unavailable = new Error("SESSION_HMAC_UNAVAILABLE: ระบบลงนาม session ไม่พร้อมใช้งาน");
        throw unavailable.errorCode = "SESSION_HMAC_UNAVAILABLE", unavailable;
    }
    var secret = String(_hmacSecret_() || "").trim(), pepper = String(_scriptProp_("PASSWORD_PEPPER", "") || "").trim();
    if (secret.length < 32 || pepper && secret === pepper) {
        var weak = new Error("SESSION_HMAC_SECRET_INVALID: APP_HMAC_SECRET ต้องถูกตั้งค่าอย่างปลอดภัยและแยกจาก PASSWORD_PEPPER");
        throw weak.errorCode = "SESSION_HMAC_SECRET_INVALID", weak;
    }
    return secret;
}
function _issueSessionCsrfToken_(sessionToken) {
    sessionToken = String(sessionToken || "").trim();
    if (!sessionToken) {
        var missing = new Error("SESSION_TOKEN_REQUIRED_FOR_CSRF");
        throw missing.errorCode = "SESSION_TOKEN_REQUIRED_FOR_CSRF", missing;
    }
    var nonce = Utilities.getUuid() + "|" + Utilities.getUuid() + "|" + Date.now(), signature = _hmacSha256Hex_(sessionToken + "|" + nonce, _requireSessionHmacSecret_());
    if (!/^[0-9a-f]{64}$/i.test(String(signature || ""))) {
        var invalid = new Error("SESSION_CSRF_SIGNATURE_INVALID");
        throw invalid.errorCode = "SESSION_CSRF_SIGNATURE_INVALID", invalid;
    }
    return Utilities.getUuid() + "-" + String(signature).slice(0, 16);
}
var APP_CSRF_CANONICAL_OWNER_CURRENT = Object.freeze({
    stamp: "csrf-canonical-owner-2026-08-06-r223",
    owner: "Code_10_Security_Auth.gs",
    sessionTokenIssuer: "_issueSessionCsrfToken_",
    persistedIssuer: "_issueCsrfToken_",
    actionTokenIssuer: "_issueSingleUseCsrfToken_",
    actionTokenVerifier: "_verifySingleUseCsrfToken_",
    requestVerifier: "_verifyCsrfToken_",
    singleOwner: !0
});
function _issueCsrfToken_(token, sess) {
    token = String(token || "").trim();
    if (!token)
        throw new Error("SESSION_TOKEN_REQUIRED_FOR_CSRF");
    sess = sess || _getSession_(token) || {};
    var next = _issueSessionCsrfToken_(token);
    sess.csrfToken = next;
    sess.csrfIssuedAt = new Date().toISOString();
    _storeSession_(token, sess, { persistMeta: !0 });
    return next;
}
function _singleUseCsrfKey_(token) {
    return "csrf_action_" + _hmacSha256Hex_(String(token || ""), _hmacSecret_()).slice(0, 32);
}
function _issueSingleUseCsrfToken_(parentToken, sess, action) {
    parentToken = String(parentToken || "");
    sess = sess || _getSession_(parentToken) || {};
    if (!parentToken || !sess)
        throw new Error("ไม่พบ session สำหรับออก action token");
    var actionToken = "act_" + Utilities.getUuid() + "_" + _hmacSha256Hex_(parentToken + "|" + String(action || "") + "|" + Date.now(), _hmacSecret_()).slice(0, 12), payload = {
        parentTokenHash: _hmacSha256Hex_(parentToken, _hmacSecret_()).slice(0, 32),
        action: String(action || ""),
        issuedAt: new Date().toISOString()
    };
    safeCachePut_(_AppScriptCache_(), _singleUseCsrfKey_(actionToken), payload, 300);
    return actionToken;
}
function _verifySingleUseCsrfToken_(actionToken, parentToken, action) {
    actionToken = String(actionToken || "");
    if (actionToken.indexOf("act_") !== 0)
        return !1;
    var consume = function () {
        var key = _singleUseCsrfKey_(actionToken), raw = "";
        try {
            raw = _AppScriptCache_().get(key);
        }
        catch (_e) {
            _recordWarning_("csrf.action.cacheRead", _e);
            raw = "";
        }
        if (!raw)
            throw new Error("CSRF action token หมดอายุหรือถูกใช้แล้ว");
        var data = {};
        try {
            data = JSON.parse(raw);
        }
        catch (_e2) {
            _recordWarning_("csrf.action.parse", _e2);
            throw new Error("CSRF action token ไม่ถูกต้อง");
        }
        var expectedParent = _hmacSha256Hex_(String(parentToken || ""), _hmacSecret_()).slice(0, 32);
        if (String(data.parentTokenHash || "") !== expectedParent)
            throw new Error("CSRF action token ไม่ตรงกับ session");
        if (data.action && action && String(data.action) !== String(action))
            throw new Error("CSRF action token ไม่ตรงกับ action");
        try {
            _AppScriptCache_().remove(key);
        }
        catch (_removeErr) {
            _recordWarning_("csrf.action.cacheRemove", _removeErr);
            throw new Error("ไม่สามารถยืนยันการใช้ CSRF action token ได้");
        }
        return !0;
    };
    if (_appIsFnName_("_withScriptLock_"))
        return _withScriptLock_(5e3, function () { return consume(); });
    var lock = LockService.getScriptLock();
    lock.waitLock(5e3);
    try {
        return consume();
    }
    finally {
        try {
            lock.releaseLock();
        }
        catch (_releaseErr) {
            _recordWarning_("csrf.action.lockRelease", _releaseErr);
        }
    }
}
function _verifyCsrfToken_(payload, sess, options) {
    payload = payload || {};
    sess = sess || {};
    options = options || {};
    var sent = String(payload.csrfActionToken || payload.actionToken || payload._actionToken || payload.csrfToken || payload.csrf || payload._csrf || "").trim(), expected = String(sess.csrfToken || "").trim();
    if (!expected)
        throw new Error("CSRF token ไม่มีใน session");
    if (sent && sent.indexOf("act_") === 0)
        return _verifySingleUseCsrfToken_(sent, String(payload.token || payload._token || ""), options.action || payload.actionMethod || "");
    if (options.requireAction === !0)
        throw new Error("CSRF action token จำเป็นสำหรับ write action");
    if (!sent || sent !== expected)
        throw new Error("CSRF token ไม่ถูกต้องหรือหมดอายุ");
    return !0;
}
function _issueLoginSession_(sessObj, payload) {
    var token = Utilities.getUuid(), stored = Object.assign({}, sessObj || {});
    _attachSessionBinding_(stored, payload || {}), stored.csrfToken = _issueSessionCsrfToken_(token), stored.csrfIssuedAt = new Date().toISOString(), _storeSession_(token, stored, {
        persistMeta: !0
    });
    var resume = _issueSessionResumeHandle_(token, stored, payload || {});
    return {
        token, csrfToken: String(stored.csrfToken || ""), user: stored, resumeHandle: resume.resumeHandle, resumeExpiresAt: resume.resumeExpiresAt
    };
}
function _touchLastLoginAt_(sh, rowIndex, indexes) {
    var now = new Date().toISOString();
    indexes.lastLoginAt > -1 && AppRepository.setCellValue("Users", rowIndex, indexes.lastLoginAt + 1, now, {
        invalidate: !1
    }), indexes.updatedAt > -1 && AppRepository.setCellValue("Users", rowIndex, indexes.updatedAt + 1, now, {
        invalidate: !1
    });
}
function _findUserForRecoveryInMatrix_(principal, data, indexes) {
    if (!(principal = String(principal || "").trim().toLowerCase()) || !Array.isArray(data) || !indexes)
        return null;
    for (var i = 1; i < data.length; i++) {
        var row = data[i] || [], byUser = indexes.username > -1 && String(row[indexes.username] || "").trim().toLowerCase() === principal, byMail = indexes.email > -1 && String(row[indexes.email] || "").trim().toLowerCase() === principal;
        if (byUser || byMail)
            return {
                row, rowIndex: i + 1
            };
    }
    return null;
}
function _rotateLoginRateLimitNamespaceForRecovery_(reason) {
    var ns = "prod-current-auth-recovery-" + Utilities.getUuid().replace(/[^A-Za-z0-9]/g, "").slice(0, 18);
    try {
        _appIsFnName_("_runtimeStateSet_") && _runtimeStateSet_("LOGIN_RATE_LIMIT_NAMESPACE", ns, _loginRateLimitWindowSeconds_() + 600), _safeAudit_("auth.rateLimitNamespace.rotated", {
            namespace: ns, reason: String(reason || "recovery"), store: "runtime-cache"
        });
    }
    catch (e) {
        _recordWarning_("auth.rateLimitNamespace.rotateRecovery", e);
    }
    return ns;
}
function _resetUserPasswordForRecovery_(username, newPassword, reason) {
    if (username = String(username || "").trim(), newPassword = String(newPassword || ""), reason = String(reason || "manual-recovery"), !username)
        throw new Error("กรุณาระบุ username สำหรับ recovery");
    validatePasswordPolicy_(newPassword);
    var pepper = String(_passwordPepper_({
        create: !1
    }) || "").trim();
    if (!pepper)
        throw new Error("PASSWORD_PEPPER_MISSING: กรุณาตั้ง PASSWORD_PEPPER ใน Script Properties ก่อนทำ recovery");
    var sh = getSheet_("Users"), data = getSheetMatrix_(sh);
    if (data.length < 2)
        throw new Error("ไม่พบข้อมูลผู้ใช้");
    var indexes = _userHeaderIndexes_(data[0] || []);
    if (indexes.passwordHash < 0) {
        var nextCol = (data[0] || []).length + 1;
        AppRepository.setCellValue("Users", 1, nextCol, "passwordHash", {
            invalidate: !1
        }), indexes.passwordHash = nextCol - 1;
    }
    var found = _findUserForRecoveryInMatrix_(username, data, indexes);
    if (!found)
        throw new Error("ไม่พบผู้ใช้สำหรับ recovery");
    var role = indexes.role > -1 ? _normalizeUserRole_(found.row[indexes.role]) : "", principalIsAdmin = String(username || "").trim().toLowerCase() === "admin" || String(found.row[indexes.username] || "").trim().toLowerCase() === "admin";
    if (String(role || "").toLowerCase() !== "admin" && !principalIsAdmin)
        throw new Error("recovery อนุญาตเฉพาะบัญชี Admin");
    var newHash = _hashPasswordCurrentWithPepper_(newPassword, _randomSalt_(), _passwordHashDefaultRounds_(), pepper);
    AppRepository.setCellValue("Users", found.rowIndex, indexes.passwordHash + 1, newHash, {
        invalidate: !1
    }), indexes.password > -1 && AppRepository.clearRangeContent("Users", found.rowIndex, indexes.password + 1, 1, 1), indexes.active > -1 && AppRepository.setCellValue("Users", found.rowIndex, indexes.active + 1, "Y", {
        invalidate: !1
    }), indexes.updatedAt > -1 && AppRepository.setCellValue("Users", found.rowIndex, indexes.updatedAt + 1, new Date().toISOString(), {
        invalidate: !1
    });
    try {
        typeof AppRepository != "undefined" && AppRepository && typeof AppRepository.flush == "function" && AppRepository.flush();
    }
    catch (_flushRecovery) {
        _recordWarning_("auth.recovery.flush", _flushRecovery);
    }
    invalidateSheetCache_("Users");
    var verifyData = getSheetMatrix_(sh), verifyIndexes = _userHeaderIndexes_(verifyData[0] || []), verifyFound = _findUserForRecoveryInMatrix_(username, verifyData, verifyIndexes);
    if (!verifyFound)
        throw new Error("ADMIN_RECOVERY_VERIFY_FAILED: ไม่พบผู้ใช้หลังบันทึกรหัสผ่าน");
    var storedHash = verifyIndexes.passwordHash > -1 ? String(verifyFound.row[verifyIndexes.passwordHash] || "").trim() : "", activeOk = _normalizeActiveFlag_(verifyIndexes.active > -1 ? verifyFound.row[verifyIndexes.active] : "Y"), verified = _verifyPasswordEnhanced_(newPassword, storedHash, {
        allowPreviousMigration: !1
    });
    if (!activeOk || !verified)
        throw new Error("ADMIN_RECOVERY_VERIFY_FAILED: บันทึก hash แล้วแต่ตรวจยืนยันรหัสผ่านไม่ผ่าน กรุณาตรวจ PASSWORD_PEPPER และ Spreadsheet ที่ Deployment ใช้งาน");
    var namespace = _rotateLoginRateLimitNamespaceForRecovery_(reason);
    try {
        _clearLoginRateState_(username, {
            clientContext: {
                userAgent: "", language: "", platform: "", timezone: ""
            }
        });
    }
    catch (_clearRecoveryRate) {
        _recordWarning_("auth.recovery.clearRate", _clearRecoveryRate);
    }
    try {
        _safeAudit_("security.password.recoveryReset", {
            username, reason, activated: activeOk, namespace, mode: "strict-hash", verificationOk: verified, hashRounds: _passwordHashStoredRounds_(storedHash)
        });
    }
    catch (_auditRecovery) {
        _recordWarning_("ec", _auditRecovery);
    }
    return ok_({
        username, role: role || (principalIsAdmin ? "Admin" : ""), active: "Y", namespace, reason, simpleAuth: !1, verificationOk: verified, passwordHashScheme: _SECURE_PASSWORD_SCHEME_, passwordHashRounds: _passwordHashStoredRounds_(storedHash), pepperConfigured: !!pepper
    }, "ตั้งรหัสผ่านผู้ดูแลระบบใหม่ ตรวจยืนยัน hash และปลดล็อกบัญชีสำเร็จ");
}
function _oneTimeSecuritySetupKey_() {
    return String(_authScriptProp_("ONE_TIME_SECURITY_SETUP_KEY", "") || _authScriptProp_("ADMIN_RECOVERY_KEY", "") || "").trim();
}
function _assertOneTimeSecuritySetupKey_(payload, owner) {
    payload = payload || {};
    var expected = _oneTimeSecuritySetupKey_(), supplied = String(payload.setupKey || payload.recoveryKey || payload.key || "").trim();
    if (!expected || !supplied || supplied !== expected)
        throw new Error("ONE_TIME_SECURITY_SETUP_LOCKED: ต้องส่ง setupKey/recoveryKey ให้ตรงกับ Script Property ONE_TIME_SECURITY_SETUP_KEY");
    return !0;
}
function _cleanupOneTimeSecuritySetupKeys_(owner) {
    [
        "ONE_TIME_SECURITY_SETUP_KEY", "ADMIN_RECOVERY_KEY"
    ].forEach(function (k) {
        try {
            _deleteScriptProp_(k, {
                owner: owner || "one-time-security-setup", mode: "setup-locked"
            });
        }
        catch (_del) {
            _recordWarning_("oneTimeSecuritySetup.keyCleanupSkipped", _del);
        }
    });
}
function runOneTimeLoginLockoutReset(payload) {
    _assertOneTimeSecuritySetupKey_(payload = payload || {}, "runOneTimeLoginLockoutReset");
    var ns = _rotateLoginRateLimitNamespaceForRecovery_("manual-lockout-reset");
    return _cleanupOneTimeSecuritySetupKeys_("runOneTimeLoginLockoutReset"), ok_({
        namespace: ns
    }, "ปลดล็อก rate-limit namespace สำเร็จ");
}
function runOneTimeAdminPasswordRecovery(payload) {
    _assertOneTimeSecuritySetupKey_(payload = payload || {}, "runOneTimeAdminPasswordRecovery");
    var username = String(_scriptProp_("ADMIN_RECOVERY_USERNAME", "admin") || "admin").trim(), newPassword = String(_scriptProp_("ADMIN_RECOVERY_NEW_PASSWORD", "") || "").trim();
    if (!newPassword)
        throw new Error("กรุณาตั้ง Script Property ADMIN_RECOVERY_NEW_PASSWORD ก่อน");
    var result = _resetUserPasswordForRecovery_(username, newPassword, "script-editor-one-time");
    return [
        "ADMIN_RECOVERY_NEW_PASSWORD", "ADMIN_RECOVERY_USERNAME"
    ].forEach(function (k) {
        try {
            _deleteScriptProp_(k, {
                owner: "runOneTimeAdminPasswordRecovery", mode: "setup-locked"
            });
        }
        catch (_del) {
            _recordWarning_("admin.recovery.propertyCleanupSkipped", _del);
        }
    }), _cleanupOneTimeSecuritySetupKeys_("runOneTimeAdminPasswordRecovery"), result;
}
function _saveUserCanonical_(payload) {
    return _assertUserWriteUniqueness_(payload = _validateUserPayload_(payload, payload && payload.action)), domainWrite_("saveUserCanonical", payload, function (input) {
        var repo = _getUsersRepository_(), now = new Date().toISOString(), username = String(input.username || "").trim(), oldUsername = String(input.oldUsername || username).trim(), simpleMode = _simpleAuthMode_(), credential = input.password ? String(input.password).trim() : "", strongHash = !simpleMode && credential ? _hashPasswordProduction_(credential, _randomSalt_(), _passwordHashDefaultRounds_()) : "", existing = input.action === "add" ? null : _findUserObjectByUsername_(oldUsername);
        if (input.action !== "add" && !existing)
            return err_("ไม่พบผู้ใช้งาน");
        var record = Object.assign({}, existing || {}, {
            username, name: input.name, role: input.role, email: input.email, active: input.active || "Y", updatedAt: now, lastLoginAt: existing && existing.lastLoginAt || ""
        }), renamed;
        if (simpleMode ? (credential ? (record.password = credential, record.passwordHash = credential) : (record.password = existing && (existing.password || existing.pass || existing.pwd || existing.pin || existing.passwordHash) || "", record.passwordHash = existing && existing.passwordHash || record.password || ""), record.authSchemaStamp = "simple-auth-plain-current") : (record.passwordHash = strongHash || existing && existing.passwordHash || "", record.password = "", record.pass = "", record.pwd = "", record.authSchemaStamp = "production-memory-token-current"), input.action === "add")
            return repo.upsert(username, record), invalidateSheetCache_("Users"), ok_({
                action: "add", username, email: input.email, role: input.role, simpleAuth: simpleMode
            }, "เพิ่มผู้ใช้งานสำเร็จ");
        if (String(oldUsername).trim().toLowerCase() !== username.toLowerCase()) {
            if (!updateSheetObjectByKey_("Users", "username", oldUsername, record))
                return err_("ไม่สามารถเปลี่ยนชื่อผู้ใช้ได้");
        }
        else
            repo.upsert(username, record);
        return invalidateSheetCache_("Users"), ok_({
            action: "edit", username, email: input.email, role: input.role, simpleAuth: simpleMode
        }, "บันทึกผู้ใช้งานสำเร็จ");
    });
}
function _deactivateUserCanonical_(payload) {
    payload = payload || {};
    var target = String(payload.oldUsername || payload.username || payload.oldU || payload.u || "").trim();
    if (!target)
        throw new Error("กรุณาระบุชื่อผู้ใช้ที่ต้องการระงับ");
    return domainWrite_("deactivateUserCanonical", {
        target
    }, function (ctx) {
        var existing = _findUserObjectByUsername_(ctx.target);
        if (!existing)
            return err_("ไม่พบผู้ใช้งาน");
        var now = new Date().toISOString(), ok;
        return updateSheetObjectByKey_("Users", "username", existing.username, Object.assign({}, existing, {
            active: "N", updatedAt: now
        })) ? (invalidateSheetCache_("Users"), ok_({
            action: "deactivate", username: String(existing.username || ""), active: "N"
        }, "ระงับผู้ใช้งานสำเร็จ")) : err_("ไม่พบผู้ใช้งาน");
    }, "ระงับผู้ใช้งานสำเร็จ", "ระงับผู้ใช้งานไม่สำเร็จ");
}
function _safeJsonStringify_(value) {
    try {
        return JSON.stringify(value || {});
    }
    catch (e) {
        return _recordWarning_("ec", e), "{}";
    }
}
function _clientRouteContractForAuth_() {
    try {
        return _appIsFnName_("_apiRouteContract_") ? _apiRouteContract_({
            compact: !0, client: !0
        }) : null;
    }
    catch (_e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("ec", _e, {
            file: "C10"
        }), null;
    }
}
function _withClientRouteContract_(data) {
    data = data && typeof data == "object" ? data : {};
    var c = _clientRouteContractForAuth_(), dataPolicy = _appIsFnName_("_platformClientDataContract_") ? _platformClientDataContract_(_appIsFnName_("_apiRouteRegistry_") ? _apiRouteRegistry_() : {}) : null, phase1 = _appIsFnName_("_singleSourceContract_") ? _singleSourceContract_({
        compact: !0, client: !0
    }) : null;
    return c && (data.routeContract = c, (data.dataContract = data.dataContract || {}).routeContract = c, (data.appConfig = data.appConfig || {}).routeContract = c), dataPolicy && (data.dataPolicy = dataPolicy, (data.dataContract = data.dataContract || {}).dataPolicy = dataPolicy, (data.appConfig = data.appConfig || {}).dataPolicy = dataPolicy), phase1 && (data.phase1SingleSourceContract = phase1, (data.dataContract = data.dataContract || {}).phase1SingleSourceContract = phase1, data.fieldMap = phase1.fieldMap || data.fieldMap || {}, data.statusMap = phase1.statusMap || data.statusMap || {}, (data.appConfig = data.appConfig || {}).phase1SingleSourceContract = phase1), data;
}
/**
 * Performance E login read model.
 *
 * The directory contains only normalized principal -> active row indexes and
 * header indexes. Passwords and password hashes are never stored in the
 * directory cache. A successful lookup reads only the selected Users row and
 * only the columns needed by authentication.
 */
function _loginPrincipalDirectoryTtlSeconds_() {
    var raw = _appIsFnName_("_scriptProp_") ? _scriptProp_("LOGIN_PRINCIPAL_INDEX_TTL_SECONDS", 300) : 300;
    return Math.max(60, Math.min(Number(raw || 600) || 600, 1800));
}
function _loginPrincipalDirectoryCacheKey_() {
    var stamp = "1";
    try {
        _appIsFnName_("_entityCacheStamp_") && (stamp = String(_entityCacheStamp_("users") || "1"));
    }
    catch (_stampErr) {
        _recordWarning_("auth.loginPrincipalDirectory.stamp", _stampErr);
    }
    return "auth:login-principal-directory:r160:" + stamp;
}
function _loginUniqueColumnIndexes_(indexes, fields) {
    var seen = {}, out = [];
    (fields || []).forEach(function (name) {
        var index = Number(indexes && indexes[name]);
        if (index >= 0 && !seen[index]) {
            seen[index] = !0;
            out.push(index);
        }
    });
    return out.sort(function (a, b) {
        return a - b;
    });
}
function _loginColumnSpans_(columns, maxSpans) {
    var spans = [];
    (columns || []).forEach(function (column) {
        var last = spans.length ? spans[spans.length - 1] : null;
        if (last && column === last.end + 1)
            last.end = column;
        else
            spans.push({
                start: column,
                end: column
            });
    });
    maxSpans = Math.max(1, Math.min(Number(maxSpans || 3) || 3, 6));
    while (spans.length > maxSpans) {
        var bestIndex = 0, bestGap = Infinity;
        for (var i = 0; i < spans.length - 1; i++) {
            var gap = spans[i + 1].start - spans[i].end - 1;
            if (gap < bestGap) {
                bestGap = gap;
                bestIndex = i;
            }
        }
        spans.splice(bestIndex, 2, {
            start: spans[bestIndex].start,
            end: spans[bestIndex + 1].end
        });
    }
    return spans;
}
function _loginReadSelectedColumns_(sh, startRow, rowCount, columnIndexes, options) {
    options = options || {};
    startRow = Math.max(1, Number(startRow || 1) || 1);
    rowCount = Math.max(0, Number(rowCount || 0) || 0);
    var columns = (columnIndexes || []).slice().sort(function (a, b) {
        return a - b;
    });
    if (!sh || !rowCount || !columns.length)
        return {
            columns: {},
            columnsRead: 0,
            serviceReads: 0,
            spanCount: 0
        };
    var spans = _loginColumnSpans_(columns, options.maxSpans || 3), valuesByColumn = {}, serviceReads = 0, columnsRead = 0;
    columns.forEach(function (column) {
        valuesByColumn[column] = new Array(rowCount);
    });
    spans.forEach(function (span) {
        var width = span.end - span.start + 1;
        columnsRead += width;
        var rows = AppRepository.getRangeValues("Users", startRow, span.start + 1, rowCount, width) || [];
        serviceReads++;
        for (var r = 0; r < rows.length; r++)
            columns.forEach(function (column) {
                if (column >= span.start && column <= span.end)
                    valuesByColumn[column][r] = rows[r][column - span.start];
            });
    });
    if (options.noteMetrics !== !1) {
        try {
            _appIsFnName_("_requestScopeNoteRowsRead_") && _requestScopeNoteRowsRead_("Users", rowCount);
            _appIsFnName_("_requestScopeNoteProjectionRead_") && _requestScopeNoteProjectionRead_("Users", rowCount, columnsRead, serviceReads, Math.max(Number(sh.getLastColumn && sh.getLastColumn()) || columnsRead, columnsRead));
        }
        catch (_metricErr) {
            _recordWarning_("auth.loginSelectedColumns.metrics", _metricErr);
        }
    }
    return {
        columns: valuesByColumn,
        columnsRead: columnsRead,
        serviceReads: serviceReads,
        spanCount: spans.length
    };
}
function _buildLoginPrincipalDirectory_() {
    var sh = getSheet_("Users"), sheetMeta = _appIsFnName_("_spreadsheetContextSheetMeta_")
        ? _spreadsheetContextSheetMeta_("Users", sh, { forceFresh: !1 })
        : null, lastRow = Math.max(Number(sheetMeta && sheetMeta.lastRow || sh.getLastRow && sh.getLastRow()) || 0, 1), lastColumn = Math.max(Number(sheetMeta && sheetMeta.lastColumn || sh.getLastColumn && sh.getLastColumn()) || 0, 1), headers = _appIsFnName_("_sheetHeaders_")
            ? _sheetHeaders_("Users", { sheet: sh, sheetMeta: sheetMeta, widthHint: lastColumn })
            : AppRepository.getRangeValues("Users", 1, 1, 1, lastColumn)[0] || [], indexes = _userHeaderIndexes_(headers), rowCount = Math.max(0, lastRow - 1), read = _loginReadSelectedColumns_(sh, 2, rowCount, _loginUniqueColumnIndexes_(indexes, [
        "username", "email", "active"
    ]), {
        maxSpans: 3,
        noteMetrics: !0
    }), byPrincipal = Object.create(null), activeRows = 0;
    function addPrincipal(principal, rowIndex) {
        principal = String(principal || "").trim().toLowerCase();
        if (!principal)
            return;
        var rows = Object.prototype.hasOwnProperty.call(byPrincipal, principal) ? byPrincipal[principal] : byPrincipal[principal] = [];
        rows.indexOf(rowIndex) < 0 && rows.push(rowIndex);
    }
    for (var offset = 0; offset < rowCount; offset++) {
        var activeValue = indexes.active > -1 && read.columns[indexes.active] ? read.columns[indexes.active][offset] : "Y";
        if (!_normalizeActiveFlag_(activeValue))
            continue;
        activeRows++;
        var rowIndex = offset + 2;
        addPrincipal(indexes.username > -1 && read.columns[indexes.username] ? read.columns[indexes.username][offset] : "", rowIndex);
        addPrincipal(indexes.email > -1 && read.columns[indexes.email] ? read.columns[indexes.email][offset] : "", rowIndex);
    }
    return {
        owner: "Code_10_Security_Auth._buildLoginPrincipalDirectory_",
        stamp: "performance-login-metadata-reuse-r210",
        entityStamp: _appIsFnName_("_entityCacheStamp_") ? String(_entityCacheStamp_("users") || "1") : "1",
        builtAt: new Date().toISOString(),
        indexes: indexes,
        headers: headers.slice(),
        headerWidth: lastColumn,
        rowCount: rowCount,
        activeRows: activeRows,
        principalCount: Object.keys(byPrincipal).length,
        columnsRead: Number(read.columnsRead || 0),
        serviceReads: Number(read.serviceReads || 0) + 1,
        byPrincipal: byPrincipal,
        cacheHit: !1
    };
}
function _getLoginPrincipalDirectory_(options) {
    options = options || {};
    var key = _loginPrincipalDirectoryCacheKey_(), cached = null;
    if (options.forceFresh !== !0)
        try {
            cached = _appIsFnName_("_AppCacheGetJson_") ? _AppCacheGetJson_(key) : null;
        }
        catch (_cacheReadErr) {
            _recordWarning_("auth.loginPrincipalDirectory.cacheRead", _cacheReadErr);
        }
    if (cached && cached.byPrincipal && cached.indexes) {
        cached.cacheHit = !0;
        try {
            _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("loginPrincipalDirectory", !0, 1);
        }
        catch (_cacheMetricHitErr) {
            _recordWarning_("auth.loginPrincipalDirectory.cacheHitMetric", _cacheMetricHitErr);
        }
        return cached;
    }
    try {
        _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("loginPrincipalDirectory", !1, 1);
    }
    catch (_cacheMetricMissErr) {
        _recordWarning_("auth.loginPrincipalDirectory.cacheMissMetric", _cacheMetricMissErr);
    }
    var directory = _buildLoginPrincipalDirectory_();
    try {
        _appIsFnName_("_AppCachePutJson_") && _AppCachePutJson_(key, directory, _loginPrincipalDirectoryTtlSeconds_());
    }
    catch (_cacheWriteErr) {
        _recordWarning_("auth.loginPrincipalDirectory.cacheWrite", _cacheWriteErr);
    }
    return directory;
}
function _readLoginUserRowByIndex_(sh, rowIndex, indexes) {
    rowIndex = Math.max(2, Number(rowIndex || 0) || 0);
    var fields = [
        "username", "name", "role", "email", "password", "passwordHash", "active", "updatedAt", "lastLoginAt"
    ], columns = _loginUniqueColumnIndexes_(indexes, fields), read = _loginReadSelectedColumns_(sh, rowIndex, 1, columns, {
        maxSpans: 3,
        noteMetrics: !0
    }), maxColumn = columns.length ? Math.max.apply(null, columns) : 0, row = new Array(maxColumn + 1);
    columns.forEach(function (column) {
        row[column] = read.columns[column] ? read.columns[column][0] : "";
    });
    return {
        row: row,
        columnsRead: Number(read.columnsRead || 0),
        serviceReads: Number(read.serviceReads || 0),
        spanCount: Number(read.spanCount || 0)
    };
}
function _resolveActiveLoginPrincipal_(principal, options) {
    options = options || {};
    principal = String(principal || "").trim().toLowerCase();
    if (!principal)
        return null;
    var forceFresh = options.forceFresh === !0, directoryMs = 0, rowReadMs = 0;
    for (var attempt = 0; attempt < 2; attempt++) {
        var directoryStartedAt = Date.now(), directory = _getLoginPrincipalDirectory_({
            forceFresh: forceFresh || attempt > 0
        });
        directoryMs += Date.now() - directoryStartedAt;
        var candidates = Object.prototype.hasOwnProperty.call(directory.byPrincipal || {}, principal) ? directory.byPrincipal[principal].slice() : [];
        if (candidates.length > 1) {
            if (directory.cacheHit && attempt === 0)
                continue;
            throw new Error("พบผู้ใช้งานซ้ำสำหรับ principal นี้ กรุณาแก้ข้อมูลผู้ใช้ก่อนเข้าสู่ระบบ");
        }
        if (!candidates.length) {
            if (directory.cacheHit && attempt === 0)
                continue;
            return null;
        }
        var sh = getSheet_("Users"), rowStartedAt = Date.now(), selected = _readLoginUserRowByIndex_(sh, candidates[0], directory.indexes);
        rowReadMs += Date.now() - rowStartedAt;
        var row = selected.row || [], indexes = directory.indexes || {}, byUsername = indexes.username > -1 && String(row[indexes.username] || "").trim().toLowerCase() === principal, byEmail = indexes.email > -1 && String(row[indexes.email] || "").trim().toLowerCase() === principal, active = _normalizeActiveFlag_(indexes.active > -1 ? row[indexes.active] : "Y");
        if ((byUsername || byEmail) && active)
            return {
                sh: sh,
                row: row,
                rowIndex: candidates[0],
                indexes: indexes,
                directory: directory,
                rowRead: selected,
                directoryMs: directoryMs,
                rowReadMs: rowReadMs
            };
        if (!(directory.cacheHit && attempt === 0))
            return null;
    }
    return null;
}
function _recordLoginPerformance_(payload, response, loginPerf, loginStartedAt) {
    try {
        payload = payload && typeof payload == "object" && !Array.isArray(payload) ? payload : {};
        var baselineRunId = String(payload.__perfBaselineRunId || "").trim();
        if (!baselineRunId || !_appIsFnName_("_recordApiPerfSample_"))
            return !1;
        var metrics = _appIsFnName_("getRequestScopeMetrics_") ? getRequestScopeMetrics_() : {}, requestId = "login-" + (typeof Utilities != "undefined" && Utilities.getUuid ? Utilities.getUuid() : String(Date.now())), resultOk = !!(response && response.ok !== !1), durationMs = Math.max(0, Number(loginPerf && loginPerf.totalMs || Date.now() - Number(loginStartedAt || Date.now()))), cacheBypassRequested = payload.forceFresh === !0 || payload.noCache === !0 || payload.bypassCache === !0 || Number(payload.cacheTtlSeconds) === 0;
        return _recordApiPerfSample_({
            at: new Date().toISOString(),
            method: "apiLogin",
            requestId: requestId,
            group: "auth",
            ok: resultOk,
            durationMs: durationMs,
            rowsRead: Number(metrics.rowsRead || loginPerf && loginPerf.usersRowsScanned || 0),
            rowsReturned: resultOk ? 1 : 0,
            cellsRead: Number(metrics.cellsRead || 0),
            serviceReads: Number(metrics.serviceReads || loginPerf && loginPerf.usersServiceReads || 0),
            spreadsheetServiceOpens: Number(metrics.spreadsheetServiceOpens || 0),
            sheetResolveCalls: Number(metrics.sheetResolveCalls || 0),
            headerReads: Number(metrics.headerReads || 0),
            fallbackReadsSuppressed: Number(metrics.fallbackReadsSuppressed || 0),
            projectedColumnsRead: Number(metrics.projectedColumnsRead || loginPerf && loginPerf.usersColumnsRead || 0),
            fullWidthColumnsAvoided: Number(metrics.fullWidthColumnsAvoided || 0),
            payloadBytes: _appIsFnName_("_appPerformancePayloadBytes_") ? _appPerformancePayloadBytes_(response || {}) : 0,
            cacheHit: !!(loginPerf && loginPerf.principalDirectoryCacheHit),
            cacheHits: Number(metrics.cacheHits || 0),
            cacheMisses: Number(metrics.cacheMisses || 0),
            source: "apiLogin.direct.p1-r210",
            errorCode: resultOk ? "" : String(response && (response.errorCode || response.error) || "LOGIN_FAILED").substring(0, 80),
            warningCount: Number(metrics.warnings || 0),
            errorCount: Number(metrics.errors || (resultOk ? 0 : 1)),
            baselineRunId: baselineRunId,
            baselineMode: String(payload.__perfBaselineMode || "").toLowerCase(),
            journeyId: String(payload.__perfJourneyId || "").substring(0, 80),
            cacheBypassRequested: cacheBypassRequested,
            loginRateLimitMs: Number(loginPerf && loginPerf.rateLimitMs || 0),
            loginPrincipalLookupMs: Number(loginPerf && loginPerf.principalLookupMs || 0),
            loginPasswordVerifyMs: Number(loginPerf && loginPerf.passwordVerifyMs || 0),
            loginSessionIssueMs: Number(loginPerf && loginPerf.sessionIssueMs || 0),
            loginPostLoginMs: Number(loginPerf && loginPerf.postLoginMs || 0),
            loginUsersRowsScanned: Number(loginPerf && loginPerf.usersRowsScanned || 0),
            loginUsersColumnsRead: Number(loginPerf && loginPerf.usersColumnsRead || 0),
            loginUsersServiceReads: Number(loginPerf && loginPerf.usersServiceReads || 0),
            loginPrincipalDirectoryCacheHit: !!(loginPerf && loginPerf.principalDirectoryCacheHit)
        });
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("p1.login.performance", e, { file: "C10" }), !1;
    }
}
function apiLogin(payload) {
    typeof globalThis != "undefined" && globalThis.__APP_API_ROUTER_CONTEXT__ === !0 || !_appIsFnName_("_requestScopeReset_") || _requestScopeReset_({
        newRequest: !0,
        preserveMetrics: !1,
        source: "apiLogin-direct"
    });
    var inputUser = "", loginPerf = {
        owner: "Code_10_Security_Auth.apiLogin.performance-e-r160",
        stamp: "performance-login-e-r160",
        rateLimitMs: 0,
        principalLookupMs: 0,
        principalDirectoryMs: 0,
        principalRowReadMs: 0,
        passwordVerifyMs: 0,
        sessionIssueMs: 0,
        postLoginMs: 0,
        totalMs: 0,
        principalDirectoryCacheHit: !1,
        usersRowsScanned: 0,
        usersColumnsRead: 0,
        usersServiceReads: 0
    }, loginStartedAt = Date.now();
    try {
        payload = payload || {}, inputUser = String(payload.email || payload.username || "").trim().toLowerCase();
        var password = String(payload.password || "").trim();
        if (!inputUser || !password)
            throw new Error("กรุณากรอก username และ password");
        var stageStartedAt = Date.now();
        _assertLoginRateLimit_(inputUser, payload);
        loginPerf.rateLimitMs = Date.now() - stageStartedAt;
        stageStartedAt = Date.now();
        var forcePrincipalRefresh = payload.forceFresh === !0 || payload.noCache === !0 || payload.bypassCache === !0 || String(payload.__perfBaselineMode || "").toLowerCase() === "cold", found = _resolveActiveLoginPrincipal_(inputUser, {
            forceFresh: forcePrincipalRefresh
        });
        loginPerf.principalLookupMs = Date.now() - stageStartedAt;
        if (!found)
            throw _recordLoginFailure_(inputUser, payload), new Error("username หรือ password ไม่ถูกต้อง หรือบัญชีถูกระงับ");
        var indexes = found.indexes || {}, sh = found.sh;
        loginPerf.principalDirectoryCacheHit = !!(found.directory && found.directory.cacheHit);
        loginPerf.usersRowsScanned = Number(found.directory && found.directory.cacheHit ? 0 : found.directory && found.directory.rowCount || 0);
        loginPerf.usersColumnsRead = Number(found.directory && found.directory.cacheHit ? 0 : found.directory && found.directory.columnsRead || 0) + Number(found.rowRead && found.rowRead.columnsRead || 0);
        loginPerf.usersServiceReads = Number(found.directory && found.directory.cacheHit ? 0 : found.directory && found.directory.serviceReads || 0) + Number(found.rowRead && found.rowRead.serviceReads || 0);
        loginPerf.principalDirectoryMs = Math.max(0, Number(found.directoryMs || 0));
        loginPerf.principalRowReadMs = Math.max(0, Number(found.rowReadMs || 0));
        if (!_simpleAuthMode_() && indexes.passwordHash < 0) {
            if (!(indexes.password > -1 && _loginPasswordHashBootstrapEnabled_()))
                throw new Error("Users schema ต้องมีคอลัมน์ passwordHash สำหรับ Production Current");
            _ensureUsersPasswordHashColumn_(sh, found.directory && found.directory.headers || [], indexes), invalidateSheetCache_("Users"), found = _resolveActiveLoginPrincipal_(inputUser, {
                forceFresh: !0
            }), indexes = found && found.indexes || indexes, sh = found && found.sh || sh;
        }
        if (_simpleAuthMode_() && indexes.password < 0 && indexes.passwordHash < 0)
            throw new Error("Users schema ต้องมีคอลัมน์ password, pass, pin หรือ passwordHash สำหรับ Simple Auth");
        stageStartedAt = Date.now();
        if (!found || !_verifyAndMigrateUserPassword_(sh, found.rowIndex, found.row, indexes, password))
            throw _recordLoginFailure_(inputUser, payload), new Error("username หรือ password ไม่ถูกต้อง หรือบัญชีถูกระงับ");
        loginPerf.passwordVerifyMs = Date.now() - stageStartedAt;
        _clearLoginRateState_(inputUser, payload);
        var sessObj = _buildSessionUser_(found.row, indexes);
        sessObj.role = _normalizeUserRole_(sessObj.role || "Viewer");
        stageStartedAt = Date.now();
        var issued = _issueLoginSession_(sessObj, payload);
        loginPerf.sessionIssueMs = Date.now() - stageStartedAt;
        issued && issued.user && (issued.user.role = _normalizeUserRole_(issued.user.role || sessObj.role || "Viewer"));
        stageStartedAt = Date.now();
        var passwordTouched = !(!_verifyAndMigrateUserPassword_ || !_verifyAndMigrateUserPassword_._lastTouched), shouldTouchLogin = !1;
        try {
            var lastLoginRaw = indexes.lastLoginAt > -1 ? String(found.row[indexes.lastLoginAt] || "") : "", lastLoginMs = Date.parse(lastLoginRaw || "");
            shouldTouchLogin = !lastLoginMs || Date.now() - lastLoginMs > 432e5;
        }
        catch (_lastLoginCheckErr) {
            _recordWarning_("ec", _lastLoginCheckErr), shouldTouchLogin = !1;
        }
        var touchLoginEnabled = String(_appIsFnName_("_scriptProp_") ? _scriptProp_("LOGIN_TOUCH_LAST_LOGIN_ENABLED", "N") : "N").toUpperCase() === "Y";
        touchLoginEnabled && shouldTouchLogin && _touchLastLoginAt_(sh, found.rowIndex, indexes), passwordTouched && invalidateSheetCache_("Users");
        try {
            _safeAudit_("login", {
                user: sessObj.username || sessObj.email,
                role: sessObj.role,
                source: "apiLogin.performance-e-r160",
                fastPath: !passwordTouched,
                principalDirectoryCacheHit: loginPerf.principalDirectoryCacheHit
            });
        }
        catch (_auditLoginErr) {
            _recordWarning_("ec", _auditLoginErr);
        }
        loginPerf.postLoginMs = Date.now() - stageStartedAt;
        loginPerf.totalMs = Date.now() - loginStartedAt;
        var loginResponse = ok_({
            token: issued.token,
            csrfToken: issued.csrfToken,
            user: issued.user,
            resumeHandle: issued.resumeHandle,
            resumeExpiresAt: issued.resumeExpiresAt,
            modules: [
                "dashboard", "meeting", "budget", "ai"
            ],
            routeContractDeferred: !0,
            dataContractDeferred: !0,
            bootstrapAfterDashboard: !0,
            loginPerformance: loginPerf,
            source: "apiLogin.principal-index-projected-row-r160",
            lastLoginTouchSkipped: !touchLoginEnabled
        });
        _recordLoginPerformance_(payload, loginResponse, loginPerf, loginStartedAt);
        return loginResponse;
    }
    catch (e) {
        loginPerf.totalMs = Date.now() - loginStartedAt;
        _recordWarning_("ec", e);
        _safeAudit_("login.error", {
            user: inputUser,
            message: String(e && e.message || e)
        });
        var loginErrorResponse = err_(e.message || String(e), {
            loginPerformance: loginPerf
        });
        _recordLoginPerformance_(payload, loginErrorResponse, loginPerf, loginStartedAt);
        return loginErrorResponse;
    }
}
function requireAuth_(payload, minRole) {
    minRole = (minRole || "staff").toLowerCase();
    var token = _extractAuthToken_(payload = payload && typeof payload == "object" ? payload : {});
    if (!token)
        throw _safeAudit_("auth.anomaly", {
            reason: "missing-token", route: String(payload.requestId || payload.route || payload.method || "")
        }), new Error("ไม่พบ token การใช้งาน");
    payload.token = payload.token || token;
    var sess = _getSession_(token), userRank, minRank;
    if (!sess)
        throw _safeAudit_("auth.anomaly", {
            reason: "expired-session", tokenFingerprint: _sessionMetaTokenFingerprint_(token)
        }), new Error("session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
    if (_verifySessionBinding_(sess, payload || {}, {
        strict: _isStrictSessionBindingRequired_(payload || {}, minRole), minRole, source: "requireAuth"
    }), (_ROLE_RANK_[String(sess.role || "viewer").toLowerCase()] || 0) < (_ROLE_RANK_[minRole] || 0))
        throw new Error("สิทธิ์ไม่เพียงพอ ต้องการ: " + minRole);
    return _touchSession_(token, sess, payload || {}), sess;
}
function _getThaiHolidayKeys_() {
    var map = {};
    try {
        var rows;
        readSheetObjects_("SystemSettings", {
            includeDeleted: !1
        }).forEach(function (r) {
            var key = String(r.key || r.name || "").trim(), val = String(r.value || r.date || "").trim(), active = String(r.active == null ? "Y" : r.active).trim().toUpperCase();
            if (active !== "N" && active !== "FALSE" && active !== "0") {
                if (/^(thaiHoliday|holiday|systemHoliday)/i.test(key)) {
                    _appAddDateKey_(map, val);
                    try {
                        var parsed = JSON.parse(val);
                        Array.isArray(parsed) && parsed.forEach(function (value) { _appAddDateKey_(map, value); });
                    }
                    catch (_json) {
                        _recordWarning_("ec", _json);
                    }
                }
                add(key), _appAddDateKey_(map, val);
            }
        });
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
    return Object.keys(map).sort();
}
function apiBootstrap(payload) {
    try {
        var token = (payload = payload || {}).token || payload._token || "";
        if (!token)
            throw new Error("ไม่พบ token การใช้งาน");
        var sess = requireAuth_(Object.assign({}, payload, {
            token: token
        }), "viewer"), fastBootstrap = payload.fast === !0 ||
            payload.compact === !0 ||
            String(payload.reason || "") === "post-login-contract-hydrate";
        sess.role = _normalizeUserRole_(sess.role || "Viewer");
        var bootstrapData = {
            user: {
                id: String(sess.id || ""),
                username: String(sess.username || ""),
                email: String(sess.email || ""),
                name: String(sess.name || sess.username || ""),
                role: String(sess.role || "Viewer"),
            },
            csrfToken: String(sess.csrfToken || ""),
            appConfig: {
                stamp: (_appIsFnName_("_appRelease_") &&
                    (_appRelease_().assetVersion || _appRelease_().version)) ||
                    "current",
                productionContract: typeof getProductionContractSpec_ == "function"
                    ? getProductionContractSpec_()
                    : null,
                itemsPerPageMeeting: 10,
                itemsPerPageBudget: 10,
                aiEnabled: fastBootstrap ? !1 : !!_getGeminiKey_(),
                appName: fastBootstrap
                    ? "ระบบบริหารจัดการเรื่องพิจารณา"
                    : (function () {
                        try {
                            var found = readSheetObjects_("SystemSettings", {
                                includeDeleted: !1,
                            }).filter(function (r) {
                                return String(r.key || "").trim() === "appName";
                            })[0];
                            return String((found && found.value) || "ระบบบริหารจัดการเรื่องพิจารณา");
                        }
                        catch (_cfgErr) {
                            return (_recordWarning_("ec", _cfgErr),
                                "ระบบบริหารจัดการเรื่องพิจารณา");
                        }
                    })(),
                defaultBudgetFY: fastBootstrap
                    ? ""
                    : (function () {
                        try {
                            var found = readSheetObjects_("Config", {
                                includeDeleted: !0,
                            }).filter(function (r) {
                                return String(r.key || "").trim() === "defaultBudgetFY";
                            })[0];
                            return String((found && found.value) || "");
                        }
                        catch (_cfgErrAppConfig) {
                            return _recordWarning_("ec", _cfgErrAppConfig), "";
                        }
                    })(),
                thaiHolidayKeys: fastBootstrap
                    ? []
                    : _appIsFnName_("_getThaiHolidayKeys_")
                        ? _getThaiHolidayKeys_()
                        : [],
                releaseManifest: _appIsFnName_("_releaseManifest_")
                    ? _releaseManifest_({
                        client: !0
                    })
                    : null,
                fastBootstrap: fastBootstrap,
                bootstrapMode: fastBootstrap ? "fast-no-contract" : "full-contract",
                routeContractDeferred: fastBootstrap,
                dataContractDeferred: fastBootstrap,
            },
            modules: [
                "dashboard", "meeting", "budget", "ai"
            ],
            dashboard: null,
            routeContractDeferred: fastBootstrap,
            dataContractDeferred: fastBootstrap,
            source: fastBootstrap
                ? "apiBootstrap.fast-no-contract-r146"
                : "apiBootstrap.full-contract-r146",
        };
        return ok_(fastBootstrap ? bootstrapData : _withClientRouteContract_(bootstrapData));
    }
    catch (e) {
        return _recordWarning_("ec", e), err_(e.message || String(e));
    }
}
function _listUsersEnvelope_() {
    try {
        var rows = cachedSheetObjects_("Users").filter(function (r) {
            return String(r && r.username || "").trim();
        }).map(function (r) {
            return {
                username: String(r.username || "").trim(), email: String(r.email || "").trim(), name: String(r.name || r.username || "").trim(), role: String(r.role || "Staff").trim(), active: String(r.active || "Y").trim()
            };
        });
        return ok_({
            rows, users: rows
        }, "โหลดรายชื่อผู้ใช้งานสำเร็จ");
    }
    catch (e) {
        return _recordWarning_("ec", e), err_(e.message || String(e), {
            rows: [], users: []
        });
    }
}
function runOneTimeSimpleAdminPasswordSetup(payload) {
    _assertOneTimeSecuritySetupKey_(payload = payload || {}, "runOneTimeSimpleAdminPasswordSetup");
    var username = String(_scriptProp_("ADMIN_SIMPLE_USERNAME", _scriptProp_("ADMIN_RECOVERY_USERNAME", "admin")) || "admin").trim(), newPassword = String(_scriptProp_("ADMIN_SIMPLE_PASSWORD", _scriptProp_("ADMIN_RECOVERY_NEW_PASSWORD", "")) || "").trim();
    if (!newPassword)
        throw new Error("กรุณาตั้ง Script Property ADMIN_SIMPLE_PASSWORD หรือ ADMIN_RECOVERY_NEW_PASSWORD เป็นรหัสผ่านก่อน");
    validatePasswordPolicy_(newPassword);
    _hmacSecret_();
    var result = _resetUserPasswordForRecovery_(username, newPassword, "production-strict-password-reset");
    [
        "ADMIN_SIMPLE_PASSWORD", "ADMIN_SIMPLE_USERNAME", "ADMIN_RECOVERY_NEW_PASSWORD", "ADMIN_RECOVERY_USERNAME"
    ].forEach(function (k) {
        try {
            _deleteScriptProp_(k, {
                owner: "production-strict-cleanup"
            });
        }
        catch (_del) {
            _recordWarning_("security.production.propertyCleanupSkipped", _del);
        }
    });
    try {
        _setScriptProps_({
            APP_SECURITY_PROFILE: "production-strict", SIMPLE_AUTH_MODE: "N", SIMPLE_AUTH_NO_RATE_LIMIT: "N", SIMPLE_AUTH_IGNORE_ACTIVE: "N", SESSION_EXPIRY_DISABLED: "N", SESSION_BINDING_STRICT: "Y", REQUIRE_STRICT_ACTION_TOKENS: "true", ENABLE_ADMIN_MAINTENANCE_TOOLS: "false"
        }, {
            owner: "production-strict-security"
        });
    }
    catch (_propErr) {
        _recordWarning_("security.production.props", _propErr);
    }
    _cleanupOneTimeSecuritySetupKeys_("runOneTimeSimpleAdminPasswordSetup");
    try {
        _safeAudit_("security.production.simpleAdminSetupBlocked", {
            username, profile: "production-strict", note: "Simple setup now only resets password and locks production-strict settings."
        });
    }
    catch (_auditErr) {
        _recordWarning_("security.production.simpleAdminSetup.audit", _auditErr);
    }
    try {
        result && typeof result == "object" && (result.productionStrictOnly = !0, result.simpleSetupLocked = !0);
    }
    catch (_resultMarkerErr) {
        _recordWarning_("security.production.simpleAdminSetup.resultMarker", _resultMarkerErr);
    }
    return result;
}
