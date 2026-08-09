var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {}, AppDomain = __APP_GLOBAL__.AppDomain = __APP_GLOBAL__.AppDomain || {}, AppDataService = __APP_GLOBAL__.AppDataService = __APP_GLOBAL__.AppDataService || {};
var APP_SPREADSHEET_CONTEXT_B = Object.freeze({
    stamp: "request-scoped-spreadsheet-context-b-2026-07-25-r173",
    owner: "Code_01_Platform_SheetRepo.SpreadsheetContext",
    policy: "one Spreadsheet handle, one sheet handle, one sheet metadata read and one header read per sheet per request unless forceFresh or a write invalidates that sheet",
    maxSpreadsheetServiceOpensPerRequest: 1,
    cacheSheetHandles: !0,
    cacheSheetMetadata: !0,
    cacheHeaders: !0,
    cacheHeaderMaps: !0,
    preserveMetricsAcrossWriteInvalidation: !0,
    uiDomChanged: !1,
    businessLogicChanged: !1
});
var APP_REPOSITORY_PROJECTION_C = Object.freeze({
    stamp: "repository-projection-consolidation-c-2026-07-25-r174",
    owner: "Code_01_Platform_SheetRepo.RepositoryProjectionPlan",
    policy: "one canonical body projection per sheet and named read plan per request; narrower field shapes are derived from the canonical rows without another Spreadsheet body read",
    canonicalizeRequestedAliases: !0,
    authoritativeEmptyResults: !0,
    suppressEmptyFullReadFallback: !0,
    requestScopedPlanCache: !0,
    uiDomChanged: !1,
    businessLogicChanged: !1,
    dataMigration: !1
});
var __APP_SPREADSHEET_CONTEXT__ = typeof __APP_SPREADSHEET_CONTEXT__ != "undefined" && __APP_SPREADSHEET_CONTEXT__ || null;
function _spreadsheetContextMetricBump_(field, amount) {
    try {
        __APP_REQUEST_SCOPE_METRICS__ = __APP_REQUEST_SCOPE_METRICS__ || {};
        __APP_REQUEST_SCOPE_METRICS__[String(field || "contextEvents")] = Number(__APP_REQUEST_SCOPE_METRICS__[String(field || "contextEvents")] || 0) + Number(amount || 1);
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("spreadsheetContext.metric", _e);
    }
}
function _spreadsheetContextCreate_(handle) {
    handle = handle && handle.ss ? handle : _resolveSpreadsheetHandle_();
    var previous = __APP_SPREADSHEET_CONTEXT__, generation = Math.max(0, Number(previous && previous.generation || 0) || 0) + 1, ctx = {
        stamp: APP_SPREADSHEET_CONTEXT_B.stamp,
        owner: APP_SPREADSHEET_CONTEXT_B.owner,
        generation: generation,
        createdAtMs: Date.now(),
        id: String(handle && handle.id || ""),
        ss: handle && handle.ss || null,
        source: String(handle && handle.source || "unknown"),
        sheets: {},
        sheetMeta: {},
        headers: {},
        headerMaps: {},
        invalidatedSheets: {},
        invalidationCount: 0
    };
    if (!ctx.ss)
        throw new Error("SPREADSHEET_CONTEXT_UNAVAILABLE");
    return __APP_SPREADSHEET_CONTEXT__ = ctx, AppInfra && (AppInfra._requestSpreadsheetContext = ctx), _spreadsheetContextMetricBump_("spreadsheetContextCreates", 1), ctx;
}
function _spreadsheetContext_() {
    var ctx = __APP_SPREADSHEET_CONTEXT__;
    return ctx && ctx.ss && ctx.id ? (_spreadsheetContextMetricBump_("spreadsheetContextHits", 1), ctx) : _spreadsheetContextCreate_();
}
function _spreadsheetContextReset_(options) {
    options = options || {};
    var previous = __APP_SPREADSHEET_CONTEXT__, retainHandle = options.retainHandle === !0 && previous && previous.ss;
    if (retainHandle) {
        var retained = {
            id: previous.id,
            ss: previous.ss,
            source: previous.source
        };
        __APP_SPREADSHEET_CONTEXT__ = null;
        _spreadsheetContextCreate_(retained);
    }
    else
        __APP_SPREADSHEET_CONTEXT__ = null, AppInfra && (AppInfra._requestSpreadsheetContext = null);
    return _spreadsheetContextMetricBump_("spreadsheetContextResets", 1), !0;
}
function _spreadsheetContextRegisterSheet_(sheetName, sh) {
    sheetName = String(sheetName || sh && sh.getName && sh.getName() || "").trim();
    if (!sheetName || !sh)
        return sh || null;
    var ctx = _spreadsheetContext_();
    return ctx.sheets[sheetName] = sh, delete ctx.sheetMeta[sheetName], delete ctx.invalidatedSheets[sheetName], sh;
}
function _spreadsheetContextInvalidateSheet_(sheetName, options) {
    options = options || {};
    sheetName = String(sheetName || "").trim();
    var ctx = __APP_SPREADSHEET_CONTEXT__;
    if (!ctx || !sheetName)
        return !1;
    delete ctx.sheetMeta[sheetName];
    Object.keys(ctx.headers || {}).forEach(function (key) {
        key.indexOf(sheetName + "|") === 0 && delete ctx.headers[key];
    });
    Object.keys(ctx.headerMaps || {}).forEach(function (key) {
        key.indexOf(sheetName + "|") === 0 && delete ctx.headerMaps[key];
    });
    options.dropSheetHandle === !0 && delete ctx.sheets[sheetName];
    return ctx.invalidatedSheets[sheetName] = Date.now(), ctx.invalidationCount = Number(ctx.invalidationCount || 0) + 1, _spreadsheetContextMetricBump_("spreadsheetContextSheetInvalidations", 1), !0;
}
function _spreadsheetContextGetSheet_(name, options) {
    options = options || {};
    name = String(name || "").trim();
    if (!name) {
        if (options.optional === !0)
            return null;
        throw new Error("ไม่พบชื่อชีต");
    }
    var ctx = _spreadsheetContext_(), own = Object.prototype.hasOwnProperty.call(ctx.sheets, name), sh;
    if (own) {
        sh = ctx.sheets[name];
        _spreadsheetContextMetricBump_("sheetHandleCacheHits", 1);
        _appIsFnName_("_requestScopeNoteSheetResolve_") && _requestScopeNoteSheetResolve_(name, !0);
    }
    else {
        sh = ctx.ss.getSheetByName(name);
        ctx.sheets[name] = sh || null;
        _spreadsheetContextMetricBump_("sheetHandleCacheMisses", 1);
        _appIsFnName_("_requestScopeNoteSheetResolve_") && _requestScopeNoteSheetResolve_(name, !1);
    }
    if (!sh && options.optional !== !0)
        throw new Error("ไม่พบชีต: " + name);
    return sh || null;
}
function _spreadsheetContextSheetMeta_(sheetName, sh, options) {
    options = options || {};
    sheetName = String(sheetName || sh && sh.getName && sh.getName() || "").trim();
    var ctx = _spreadsheetContext_(), cached = sheetName && ctx.sheetMeta[sheetName];
    if (cached && options.forceFresh !== !0)
        return _spreadsheetContextMetricBump_("sheetMetaCacheHits", 1), cached;
    sh = sh || _spreadsheetContextGetSheet_(sheetName, {
        optional: options.optional === !0
    });
    if (!sh)
        return {
            sheetName: sheetName,
            exists: !1,
            lastRow: 0,
            lastColumn: 0,
            readAtMs: Date.now()
        };
    var meta = {
        sheetName: sheetName,
        exists: !0,
        lastRow: Math.max(0, Number(sh.getLastRow && sh.getLastRow()) || 0),
        lastColumn: Math.max(0, Number(sh.getLastColumn && sh.getLastColumn()) || 0),
        readAtMs: Date.now()
    };
    return sheetName && (ctx.sheetMeta[sheetName] = meta), _spreadsheetContextMetricBump_("sheetMetaReads", 1), meta;
}
function getSpreadsheet_() {
    return _spreadsheetContext_().ss;
}
function getSheet_(name) {
    return _spreadsheetContextGetSheet_(name, {
        optional: !1
    });
}
function getSheetOptional_(name) {
    return _spreadsheetContextGetSheet_(name, {
        optional: !0
    });
}

/* ROUND B — canonical repository facade owner.
 * Code_00 keeps only the global shell so all read/write/cache behavior is owned here.
 */
var AppRepository = __APP_GLOBAL__.AppRepository = __APP_GLOBAL__.AppRepository || {};
AppRepository.owner = "Code_01_Platform_SheetRepo:canonical-repository-facade-r205";
AppRepository.bootstrapOwner = "Code_00_PlatformCore:global-platform-shell-only";

/* P1-3 — Code_01 is the sole writer of AppDomain.Repositories.
 * Domain files may register an implementation, but the actual shared-facade write occurs only
 * inside _repositoryRegistryPublish_ in this file. This makes collisions explicit and fail-fast.
 */
var AppRepositoryRegistry = __APP_GLOBAL__.AppRepositoryRegistry = {};
var _APP_DOMAIN_REPOSITORY_FACADE_ = AppDomain.Repositories && typeof AppDomain.Repositories == "object" ? AppDomain.Repositories : {};
var _appRepositoryFacadeDescriptor_ = Object.getOwnPropertyDescriptor(AppDomain, "Repositories");
if (!_appRepositoryFacadeDescriptor_)
    Object.defineProperty(AppDomain, "Repositories", { value: _APP_DOMAIN_REPOSITORY_FACADE_, enumerable: !0, configurable: !1, writable: !1 });
else if (_appRepositoryFacadeDescriptor_.value !== _APP_DOMAIN_REPOSITORY_FACADE_)
    throw new Error("REPOSITORY_FACADE_OWNER_CONFLICT");
var AppRepositories = _APP_DOMAIN_REPOSITORY_FACADE_, EnterpriseRepositories = AppRepositories;
var __APP_REPOSITORY_REGISTRY_META__ = {};
var __APP_REPOSITORY_REGISTRY_CONFLICTS__ = [];
function _repositoryRegistryName_(name) {
    name = String(name || "").trim();
    if (!name || name === "__proto__" || name === "prototype" || name === "constructor")
        throw new Error("INVALID_REPOSITORY_REGISTRATION_NAME");
    return name;
}
function _repositoryRegistryPublish_(name, value, options) {
    name = _repositoryRegistryName_(name), options = options || {};
    var owner = String(options.owner || "").trim(), kind = String(options.kind || "domain-repository").trim() || "domain-repository";
    if (!owner)
        throw new Error("REPOSITORY_REGISTRATION_OWNER_REQUIRED: " + name);
    if (value == null || typeof value != "object" && typeof value != "function")
        throw new Error("INVALID_REPOSITORY_REGISTRATION_VALUE: " + name);
    var hasCurrent = Object.prototype.hasOwnProperty.call(_APP_DOMAIN_REPOSITORY_FACADE_, name), current = hasCurrent ? _APP_DOMAIN_REPOSITORY_FACADE_[name] : void 0, existing = __APP_REPOSITORY_REGISTRY_META__[name] || null;
    if (hasCurrent && current !== value) {
        var conflict = {
            name: name,
            existingOwner: String(existing && existing.owner || "unknown"),
            requestedOwner: owner,
            kind: kind,
            detectedAt: new Date().toISOString()
        };
        __APP_REPOSITORY_REGISTRY_CONFLICTS__.push(conflict);
        throw new Error("REPOSITORY_REGISTRY_OWNER_CONFLICT: " + name + " [" + conflict.existingOwner + " -> " + owner + "]");
    }
    if (!hasCurrent)
        Object.defineProperty(_APP_DOMAIN_REPOSITORY_FACADE_, name, { value: value, enumerable: !0, configurable: !1, writable: !1 });
    __APP_REPOSITORY_REGISTRY_META__[name] = {
        name: name,
        owner: owner,
        kind: kind,
        registeredAt: existing && existing.registeredAt || new Date().toISOString()
    };
    return value;
}
AppRepositoryRegistry.owner = "Code_01_Platform_SheetRepo:domain-repository-registry-r205";
AppRepositoryRegistry.register = function (name, implementation, options) {
    options = Object.assign({}, options || {}, { kind: "domain-repository" });
    return _repositoryRegistryPublish_(name, implementation, options);
};
AppRepositoryRegistry.registerSystemMethod = function (name, method, options) {
    if (typeof method != "function")
        throw new Error("REPOSITORY_SYSTEM_METHOD_REQUIRED: " + String(name || ""));
    options = Object.assign({}, options || {}, { kind: "registry-system-method" });
    return _repositoryRegistryPublish_(name, method, options);
};
AppRepositoryRegistry.resolve = function (name) {
    name = String(name || "").trim();
    return name && Object.prototype.hasOwnProperty.call(_APP_DOMAIN_REPOSITORY_FACADE_, name) ? _APP_DOMAIN_REPOSITORY_FACADE_[name] : null;
};
AppRepositoryRegistry.has = function (name) {
    return AppRepositoryRegistry.resolve(name) != null;
};
AppRepositoryRegistry.list = function (kind) {
    kind = String(kind || "").trim();
    return Object.keys(__APP_REPOSITORY_REGISTRY_META__).filter(function (name) {
        return !kind || __APP_REPOSITORY_REGISTRY_META__[name].kind === kind;
    }).sort().map(function (name) {
        var meta = __APP_REPOSITORY_REGISTRY_META__[name];
        return { name: meta.name, owner: meta.owner, kind: meta.kind, registeredAt: meta.registeredAt };
    });
};
AppRepositoryRegistry.status = function () {
    var required = ["CaseRepository", "BudgetRepository"], missing = required.filter(function (name) {
        return !AppRepositoryRegistry.has(name);
    }), domainEntries = AppRepositoryRegistry.list("domain-repository");
    return {
        ok: missing.length === 0 && __APP_REPOSITORY_REGISTRY_CONFLICTS__.length === 0,
        stamp: "repository-registry-single-writer-r205",
        owner: AppRepositoryRegistry.owner,
        facadeOwner: "Code_01_Platform_SheetRepo",
        registeredDomainRepositories: domainEntries,
        registeredDomainRepositoryCount: domainEntries.length,
        required: required.slice(),
        missing: missing,
        conflicts: __APP_REPOSITORY_REGISTRY_CONFLICTS__.slice(),
        directDomainWritersAllowed: !1,
        uiDomChanged: !1,
        businessLogicChanged: !1,
        publicApiChanged: !1
    };
};
Object.freeze(AppRepositoryRegistry);
 AppRepository.getSpreadsheet = function () {
    if (!_appIsFnName_("getSpreadsheet_"))
        throw new Error("SPREADSHEET_REPOSITORY_OWNER_UNAVAILABLE");
    return getSpreadsheet_();
}, AppRepository.getSheet = function (name) {
    if (!_appIsFnName_("getSheet_"))
        throw new Error("SHEET_REPOSITORY_OWNER_UNAVAILABLE");
    return getSheet_(name);
}, AppRepository.readMatrix = function (name) {
    var r = AppRepository.getSheet(name).getDataRange();
    return r ? r.getValues() : [];
}, AppRepository.getRangeValues = function (sheetName, row, col, numRows, numCols) {
    return AppRepository.getSheet(sheetName).getRange(Number(row) || 1, Number(col) || 1, Math.max(1, Number(numRows) || 1), Math.max(1, Number(numCols) || 1)).getValues();
}, AppRepository.setRangeValues = function (sheetName, row, col, values, options) {
    if (!(values = Array.isArray(values) ? values : []).length)
        return 0;
    var width = values.reduce(function (w, r) {
        return Math.max(w, Array.isArray(r) ? r.length : 1);
    }, 1), matrix = values.map(function (r) {
        for (r = Array.isArray(r) ? r : [
            r
        ]; r.length < width;)
            r.push("");
        return r;
    });
    return AppRepository.getSheet(sheetName).getRange(Number(row) || 1, Number(col) || 1, matrix.length, width).setValues(matrix), _appIsFnName_("_spreadsheetContextInvalidateSheet_") && _spreadsheetContextInvalidateSheet_(sheetName), options && options.invalidate === !1 || AppRepository.invalidateDomain(String(options && options.domain || sheetName || "").toLowerCase()), matrix.length;
}, AppRepository.getSheetMeta = function (sheetName, options) {
    options = options || {};
    var sh = options.optional === !0 ? getSheetOptional_(sheetName) : AppRepository.getSheet(sheetName);
    return _spreadsheetContextSheetMeta_(sheetName, sh, { optional: options.optional === !0, forceFresh: options.forceFresh === !0 });
}, AppRepository.ensureSheetWithHeaders = function (sheetName, requiredHeaders, options) {
    options = options || {};
    sheetName = String(sheetName || "").trim();
    requiredHeaders = Array.isArray(requiredHeaders) ? requiredHeaders.slice() : [];
    if (!sheetName)
        throw new Error("REPOSITORY_SHEET_NAME_REQUIRED");
    var ss = AppRepository.getSpreadsheet(), sh = getSheetOptional_(sheetName), created = !1;
    if (!sh) {
        sh = ss.insertSheet(sheetName);
        _spreadsheetContextRegisterSheet_(sheetName, sh);
        created = !0;
    }
    var meta = _spreadsheetContextSheetMeta_(sheetName, sh, { forceFresh: !0 }), width = Math.max(0, Number(meta.lastColumn || 0)), current = width > 0 ? AppRepository.getRangeValues(sheetName, 1, 1, 1, width)[0] || [] : [], normalize = typeof options.normalizeHeader === "function" ? options.normalizeHeader : function (value) { return String(value == null ? "" : value).trim().toLowerCase(); }, seen = {};
    current.forEach(function (header) { var key = normalize(header); key && (seen[key] = !0); });
    var missing = [];
    requiredHeaders.forEach(function (header) { var key = normalize(header); if (key && !seen[key]) { seen[key] = !0; missing.push(header); } });
    if (missing.length)
        AppRepository.setRangeValues(sheetName, 1, current.length + 1, [missing], { domain: String(options.domain || sheetName).toLowerCase(), invalidate: options.invalidate !== !1 });
    if (options.frozenRows && sh.setFrozenRows)
        sh.setFrozenRows(Math.max(0, Number(options.frozenRows) || 0));
    _spreadsheetContextInvalidateSheet_(sheetName);
    return { sheet: sh, headers: current.concat(missing), created: created, addedHeaders: missing.slice() };
}, AppRepository.appendRangeValues = function (sheetName, values, options) {
    options = options || {};
    values = Array.isArray(values) ? values : [];
    if (!values.length)
        return { rows: 0, startRow: 0 };
    var meta = AppRepository.getSheetMeta(sheetName, { forceFresh: !0 }), startRow = Math.max(1, Number(meta.lastRow || 0) + 1);
    AppRepository.setRangeValues(sheetName, startRow, Number(options.startColumn || 1) || 1, values, options);
    return { rows: values.length, startRow: startRow };
}, AppRepository.setCellValue = function (sheetName, row, col, value, options) {
    return AppRepository.setRangeValues(sheetName, row, col, [
        [
            value
        ]
    ], options || {});
}, AppRepository.setRangeNumberFormat = function (sheetName, row, col, numRows, numCols, format) {
    return AppRepository.getSheet(sheetName).getRange(Number(row) || 1, Number(col) || 1, Math.max(1, Number(numRows) || 1), Math.max(1, Number(numCols) || 1)).setNumberFormat(String(format || "@")), !0;
}, AppRepository.clearSheetContents = function (sheetName) {
    return AppRepository.getSheet(sheetName).clearContents(), _appIsFnName_("_spreadsheetContextInvalidateSheet_") && _spreadsheetContextInvalidateSheet_(sheetName), AppRepository.invalidateDomain(String(sheetName || "").toLowerCase()), !0;
}, AppRepository.clearRangeContent = function (sheetName, row, col, numRows, numCols) {
    return AppRepository.getSheet(sheetName).getRange(Number(row) || 1, Number(col) || 1, Math.max(1, Number(numRows) || 1), Math.max(1, Number(numCols) || 1)).clearContent(), _appIsFnName_("_spreadsheetContextInvalidateSheet_") && _spreadsheetContextInvalidateSheet_(sheetName), AppRepository.invalidateDomain(String(sheetName || "").toLowerCase()), !0;
}, AppRepository.flush = function () {
    try {
        return typeof SpreadsheetApp != "undefined" && SpreadsheetApp.flush && SpreadsheetApp.flush(), !0;
    }
    catch (e) {
        return _appWarn_("repository.flush.failed", e, {
            owner: AppRepository.owner
        }), !1;
    }
}, AppRepository.readObjects = function (sheetName, options) {
    return _appIsFnName_("readSheetObjects_") ? readSheetObjects_(sheetName, options || {}) : AppBackendCore.matrixToObjects(AppRepository.readMatrix(sheetName), Object.assign({
        includeDeleted: !0
    }, options || {}));
}, AppRepository.page = function (rows, payload, defaultLimit, maxLimit) {
    rows = Array.isArray(rows) ? rows : [], payload = payload || {};
    var page = Math.max(1, Number(payload.page || 1) || 1), limit = Math.max(1, Number(payload.limit || payload.pageSize || defaultLimit || 20) || 20);
    if (maxLimit && (limit = Math.min(limit, Number(maxLimit))), payload.noPage === !0)
        return {
            rows, totalRecords: rows.length, page: 1, limit: rows.length || limit, pageSize: rows.length || limit, totalPages: 1, serverPaged: !1
        };
    var st = (page - 1) * limit;
    return {
        rows: rows.slice(st, st + limit), totalRecords: rows.length, page, limit, pageSize: limit, totalPages: Math.max(1, Math.ceil(rows.length / limit)), serverPaged: !0
    };
}, AppRepository.invalidateDomain = function (domain) {
    if (domain = String(domain || "").toLowerCase(), _appIsFnName_("_writeGatewayShouldDeferInvalidation_") && _writeGatewayShouldDeferInvalidation_()) {
        var queued = _writeGatewayQueueInvalidationDomain_(domain);
        return queued ? [
            queued
        ] : [];
    }
    var out = [];
    try {
        __APP_GLOBAL__.AppDataService && AppDataService.invalidate && out.push(AppDataService.invalidate(domain, "AppRepository.invalidateDomain"));
    }
    catch (e) {
        _appWarn_("repository.invalidateDomain.AppDataService", e, {
            domain
        });
    }
    try {
        _appIsFnName_("_AppCacheInvalidateDomain_") && out.push(_AppCacheInvalidateDomain_(domain));
    }
    catch (e2) {
        _appWarn_("repository.invalidateDomain.cacheStamp", e2, {
            domain
        });
    }
    try {
        var c = CacheService.getScriptCache();
        [
            domain, domain + ":list", domain + ":search", domain + ":summary", domain + ":bundle", "dashboard", "dashboard:bundle"
        ].forEach(function (k) {
            try {
                k && (!_appIsFnName_("_writeGatewayMarkCacheKey_") || _writeGatewayMarkCacheKey_(k)) && c.remove(String(k));
            }
            catch (_e) {
                _appIgnore_(_e, "c6.C00:460");
            }
        });
    }
    catch (e3) {
        _appWarn_("repository.invalidateDomain.cacheService", e3, {
            domain
        });
    }
    return out;
}, AppRepository.afterWrite = function (domains) {
    domains = Array.isArray(domains) ? domains : [
        domains
    ];
    var out = [];
    return domains.forEach(function (d) {
        out = out.concat(AppRepository.invalidateDomain(d));
    }), out;
}, AppRepository.withWriteLock = function (label, fn) {
    if (typeof fn != "function")
        throw new Error("AppRepository.withWriteLock ต้องรับ callback");
    if (typeof withWriteLock_ == "function")
        return withWriteLock_("repository:" + String(label || "write"), fn, 3e4);
    var lock = null, locked = !1;
    try {
        if (!(locked = (lock = LockService.getScriptLock()).tryLock(3e4)))
            throw new Error("WRITE_LOCK_TIMEOUT: " + String(label || "repository"));
        return fn();
    }
    finally {
        try {
            locked && lock && lock.releaseLock();
        }
        catch (e) {
            _appIgnore_(e, "repository.lock.release");
        }
    }
}, AppRepository.writeObject = function (sheetName, idField, obj, options) {
    return options = options || {}, obj = obj || {}, idField = String(idField || "id"), AppRepository.withWriteLock("writeObject:" + sheetName, function () {
        var id = String(obj[idField] || "").trim();
        if (id || (id = Utilities.getUuid(), obj[idField] = id), _appIsFnName_("findSheetObjectByKey_") && _appIsFnName_("updateSheetObjectByKey_") && _appIsFnName_("appendSheetObject_")) {
            var exists = findSheetObjectByKey_(sheetName, idField, id, {
                includeDeleted: !0
            });
            return exists ? updateSheetObjectByKey_(sheetName, idField, id, options.replace === !0 ? obj : Object.assign({}, exists, obj)) : appendSheetObject_(sheetName, obj), AppRepository.invalidateDomain(String(options.domain || sheetName || "").toLowerCase()), obj;
        }
        var sh = AppRepository.getSheet(sheetName), lastRow = Math.max(1, sh.getLastRow() || 1), lastCol = Math.max(1, sh.getLastColumn() || 1), headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
            return String(h || "").trim();
        }), idCol = headers.indexOf(idField);
        if (idCol < 0)
            throw new Error("SHEET_ID_FIELD_NOT_FOUND: " + sheetName + "." + idField);
        var target = 0, existing = [];
        if (lastRow > 1) {
            for (var ids = sh.getRange(2, idCol + 1, lastRow - 1, 1).getValues(), r = 0; r < ids.length; r++)
                if (String(ids[r][0] || "").trim() === id) {
                    target = r + 2;
                    break;
                }
            target && (existing = sh.getRange(target, 1, 1, headers.length).getValues()[0] || []);
        }
        var row = headers.map(function (h, i) {
            return obj[h] !== void 0 ? obj[h] : options.replace !== !0 && target && existing[i] || "";
        });
        return sh.getRange(target || lastRow + 1, 1, 1, headers.length).setValues([
            row
        ]), AppRepository.invalidateDomain(String(options.domain || sheetName || "").toLowerCase()), obj;
    });
};
function _i3WritePathPolicy_(sheetName, operation, opts) {
    opts = opts || {};
    var mode = String(_scriptProp_("APP_WRITE_FLUSH_POLICY", "AUTO") || "AUTO").trim().toUpperCase(), force = opts.flush === !0 || String(opts.flush || "").toUpperCase() === "Y", never = opts.flush === !1 || mode === "NONE" || mode === "OFF", op = String(operation || "write"), critical = /repair|canonical|schema|security|password|admin/i.test(op) || /Users|SystemSettings|Config/i.test(String(sheetName || "")), beforeRead = opts.beforeReadAfterWrite === !0 || opts.readAfterWrite === !0, flush = force && !never || !never && (mode === "ALWAYS" || mode === "STRICT" || mode === "AUTO" && (critical || beforeRead));
    return {
        stamp: "write-path-policy-current", sheetName: String(sheetName || ""), operation: op, mode, flush: !!flush, reason: flush ? force ? "forced" : critical ? "critical-write" : "read-after-write" : "deferred"
    };
}
function _i3FlushAfterWrite_(sheetName, operation, opts) {
    var policy = _i3WritePathPolicy_(sheetName, operation, opts || {});
    if (!policy.flush)
        return {
            flushed: !1, policy
        };
    try {
        return typeof AppRepository != "undefined" && AppRepository.flush && AppRepository.flush(), {
            flushed: !0, policy
        };
    }
    catch (e) {
        return _recordWarning_("i3.write.flush.failed", e, {
            sheetName, operation
        }), {
            flushed: !1, policy, error: String(e && e.message || e)
        };
    }
}
function _i3InvalidateReadModelsForSheet_(sheetName, reason) {
    return AppDataService.invalidateReadModelsForSheet(sheetName, reason);
}
function _afterSheetWrite_(sheetName, context) {
    context = context || {};
    var operation = String(context.operation || "write"), invalidated = null;
    try {
        invalidated = invalidateSheetCache_(sheetName);
    }
    catch (e) {
        _recordWarning_("i3.afterWrite.invalidate.failed", e, {
            sheetName, operation
        });
    }
    var flush = _i3FlushAfterWrite_(sheetName, operation, context);
    return {
        stamp: "write-path-current", sheetName: String(sheetName || ""), operation, cacheInvalidation: invalidated || null, flush
    };
}
function _i3SheetRowIndexRequestKey_(sheetName, keyField, stamp, lastRow) {
    return JSON.stringify({
        s: String(sheetName || ""), k: String(keyField || ""), v: String(stamp || "1"), r: Math.max(1, Number(lastRow || 1) || 1)
    });
}
function _i3AdaptiveReadBatchRows_(totalRows, width, opts) {
    opts = opts || {}, totalRows = Math.max(0, Number(totalRows || 0) || 0), width = Math.max(1, Number(width || 1) || 1);
    var explicit = Number(opts.readBatchRows || opts.serviceBatchRows || opts.batchSize || 0) || 0;
    if (explicit > 0)
        return Math.max(100, Math.min(explicit, 1e4, Math.max(totalRows, 100)));
    var targetCells = Math.max(2e4, Math.min(Number(opts.targetCellsPerRead || 1e5) || 1e5, 25e4)), byCells = Math.floor(targetCells / width), rows = Math.max(250, Math.min(byCells || 250, 5e3));
    return totalRows > 0 ? Math.min(totalRows, rows) : rows;
}
function _i3SheetRowIndexCacheKey_(sheetName, keyField, stamp, lastRow) {
    var seed = _i3SheetRowIndexRequestKey_(sheetName, keyField, stamp, lastRow), digest = _appIsFnName_("_appSha256Hex_") ? _appSha256Hex_(seed).substring(0, 32) : seed;
    return "sheet_row_index_current_" + String(digest || "").replace(/[^A-Za-z0-9:_-]/g, "_").substring(0, 120);
}
function _i3SheetRowIndexCacheGet_(cacheKey) {
    try {
        var cache = _AppScriptCache_(), raw = cache && cache.get(_AppCacheKey_(cacheKey));
        if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.rows))
                return parsed;
        }
        var partitioned = _AppCacheGetPartitionedRows_(cacheKey);
        if (partitioned && Array.isArray(partitioned.rows))
            return {
                rows: partitioned.rows, meta: partitioned.manifest && partitioned.manifest.meta || {}, partitioned: !0
            };
    }
    catch (e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("i3.rowIndex.cacheGet", e, {
            cacheKey
        });
    }
    return null;
}
function _i3SheetRowIndexCachePut_(cacheKey, idxMap, ttl, meta) {
    try {
        var rows = Object.keys(idxMap || {}).map(function (key) {
            var value = idxMap[key];
            return [
                key, Array.isArray(value) ? value.map(function (row) { return Number(row || 0) || 0; }).filter(function (row) { return row >= 2; }) : Number(value || 0)
            ];
        }), envelope = {
            rows, meta: meta || {}
        }, text = JSON.stringify(envelope), cache = _AppScriptCache_();
        return cache ? _cacheByteLength_(text) <= _cacheSoftLimitBytes_() ? safeCachePut_(cache, _AppCacheKey_(cacheKey), text, ttl) : _AppCachePutPartitionedRows_(cacheKey, rows, ttl, Object.assign({
            owner: "i3-sheet-row-index-current"
        }, meta || {})) : !1;
    }
    catch (e) {
        return _appIsFnName_("_recordWarning_") && _recordWarning_("i3.rowIndex.cachePut", e, {
            cacheKey
        }), !1;
    }
}
function _i3SheetRowIndexByKey_(sheetName, keyField, keyIndex, opts) {
    opts = opts || {};
    var bypassRequestCache = opts.bypassRequestCache === !0 || opts.forceFresh === !0, sh = getSheet_(sheetName), sheetMeta = _spreadsheetContextSheetMeta_(sheetName, sh, {
        forceFresh: opts.forceFresh === !0
    }), lastRow = Math.max(Number(sheetMeta && sheetMeta.lastRow || 0) || 0, 1), stamp = "1";
    try {
        _appIsFnName_("_entityCacheStamp_") && (stamp = _entityCacheStamp_(String(sheetName || "").toLowerCase()));
    }
    catch (_e) {
        _appIgnore_(_e, "c.s");
    }
    var reqKey = _i3SheetRowIndexRequestKey_(sheetName, keyField, stamp, lastRow), cacheKey = _i3SheetRowIndexCacheKey_(sheetName, keyField, stamp, lastRow);
    if (!bypassRequestCache) {
        var hit = _requestScopeGet_("i3SheetRowIndex", reqKey);
        if (hit && hit.map)
            return hit;
    }
    var headers = opts.headers || _sheetHeaders_(sheetName), map = opts.headerMap || _canonicalHeaderIndexMap_(sheetName, headers);
    if ((keyIndex == null || keyIndex < 0) && (keyIndex = map[keyField]) === void 0 && (keyIndex = map[_normalizedHeaderKey_(keyField)]), keyIndex == null || keyIndex < 0) {
        var missingKeyResult = {
            ok: !1, map: {}, keyIndex: -1, reason: "key field not found", cacheBypassed: bypassRequestCache
        };
        return bypassRequestCache ? missingKeyResult : _requestScopePut_("i3SheetRowIndex", reqKey, missingKeyResult);
    }
    if (!bypassRequestCache && opts.allowScriptCache !== !1) {
        var cached = _i3SheetRowIndexCacheGet_(cacheKey);
        if (cached && Array.isArray(cached.rows)) {
            var cachedMap = {};
            return cached.rows.forEach(function (pair) {
                Array.isArray(pair) && pair.length > 1 && String(pair[0] || "") && (cachedMap[String(pair[0])] = Number(pair[1] || 0));
            }), _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_(cached.partitioned ? "sheetRowIndexPartition" : "sheetRowIndex", !0, 1), _requestScopePut_("i3SheetRowIndex", reqKey, {
                ok: !0, sheetName: String(sheetName || ""), keyField: String(keyField || ""), keyIndex: Number(keyIndex), map: cachedMap, rowCount: Math.max(0, lastRow - 1), stamp, mode: cached.partitioned ? "script-cache-partition-index" : "script-cache-index", cacheBypassed: !1, cacheHit: !0, serviceReads: 0
            });
        }
        _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("sheetRowIndex", !1, 1);
    }
    for (var totalRows = Math.max(0, lastRow - 1), batchSize = _i3AdaptiveReadBatchRows_(totalRows, 1, opts), idxMap = {}, rowsRead = 0, serviceReads = 0, row = 2; row <= lastRow; row += batchSize) {
        var take = Math.min(batchSize, lastRow - row + 1);
        if (take <= 0)
            break;
        var values = sh.getRange(row, Number(keyIndex) + 1, take, 1).getValues() || [];
        serviceReads++, rowsRead += values.length;
        for (var i = 0; i < values.length; i++) {
            var key = String(values[i][0] == null ? "" : values[i][0]);
            key === "" || Object.prototype.hasOwnProperty.call(idxMap, key) || (idxMap[key] = row + i);
        }
    }
    try {
        _requestScopeNoteRowsRead_(sheetName, rowsRead);
    }
    catch (_n) {
        _appIgnore_(_n, "c.s");
    }
    var result = {
        ok: !0, sheetName: String(sheetName || ""), keyField: String(keyField || ""), keyIndex: Number(keyIndex), map: idxMap, rowCount: rowsRead, stamp, mode: bypassRequestCache ? "key-column-direct-fresh-index" : "key-column-adaptive-index", cacheBypassed: bypassRequestCache, cacheHit: !1, serviceReads, readBatchRows: batchSize
    };
    return !bypassRequestCache && opts.allowScriptCache !== !1 && _i3SheetRowIndexCachePut_(cacheKey, idxMap, Math.max(30, Math.min(Number(opts.cacheTtlSeconds || 180) || 180, 600)), {
        sheetName: String(sheetName || ""), keyField: String(keyField || ""), stamp, lastRow, rowCount: rowsRead
    }), bypassRequestCache ? result : _requestScopePut_("i3SheetRowIndex", reqKey, result);
}
function _i3FindRowNumberByKey_(sheetName, keyField, keyValue, keyIndex, opts) {
    var idx = _i3SheetRowIndexByKey_(sheetName, keyField, keyIndex, opts || {});
    if (!idx || !idx.ok)
        return 0;
    var key = String(keyValue == null ? "" : keyValue);
    return Number(idx.map[key] || 0) || 0;
}
function _i3SheetRowMultiIndexCacheKey_(sheetName, keyField, stamp, lastRow) {
    var seed = _i3SheetRowIndexRequestKey_(sheetName, keyField + "|multi", stamp, lastRow), digest = _appIsFnName_("_appSha256Hex_") ? _appSha256Hex_(seed).substring(0, 32) : seed;
    return "sheet_row_multi_index_current_" + String(digest || "").replace(/[^A-Za-z0-9:_-]/g, "_").substring(0, 120);
}
function _i3SheetRowMultiIndexByKey_(sheetName, keyField, keyIndex, opts) {
    opts = opts || {};
    var bypassRequestCache = opts.bypassRequestCache === !0 || opts.forceFresh === !0, sh = getSheet_(sheetName), sheetMeta = _spreadsheetContextSheetMeta_(sheetName, sh, {
        forceFresh: opts.forceFresh === !0
    }), lastRow = Math.max(Number(sheetMeta && sheetMeta.lastRow || 0) || 0, 1), stamp = "1";
    try {
        _appIsFnName_("_entityCacheStamp_") && (stamp = _entityCacheStamp_(String(sheetName || "").toLowerCase()));
    }
    catch (_e) {
        _appIgnore_(_e, "c.s");
    }
    var reqKey = _i3SheetRowIndexRequestKey_(sheetName, keyField + "|multi", stamp, lastRow), cacheKey = _i3SheetRowMultiIndexCacheKey_(sheetName, keyField, stamp, lastRow);
    if (!bypassRequestCache) {
        var hit = _requestScopeGet_("i3SheetRowMultiIndex", reqKey);
        if (hit && hit.map)
            return hit;
    }
    var headers = opts.headers || _sheetHeaders_(sheetName), map = opts.headerMap || _canonicalHeaderIndexMap_(sheetName, headers);
    if ((keyIndex == null || keyIndex < 0) && (keyIndex = map[keyField]) === void 0 && (keyIndex = map[_normalizedHeaderKey_(keyField)]), keyIndex == null || keyIndex < 0) {
        var missingKeyResult = { ok: !1, map: {}, keyIndex: -1, reason: "key field not found", cacheBypassed: bypassRequestCache };
        return bypassRequestCache ? missingKeyResult : _requestScopePut_("i3SheetRowMultiIndex", reqKey, missingKeyResult);
    }
    if (!bypassRequestCache && opts.allowScriptCache !== !1) {
        var cached = _i3SheetRowIndexCacheGet_(cacheKey);
        if (cached && Array.isArray(cached.rows)) {
            var cachedMap = {};
            cached.rows.forEach(function (pair) {
                if (!Array.isArray(pair) || pair.length < 2 || !String(pair[0] || ""))
                    return;
                var values = Array.isArray(pair[1]) ? pair[1] : [pair[1]];
                cachedMap[String(pair[0])] = values.map(function (row) { return Number(row || 0) || 0; }).filter(function (row) { return row >= 2; });
            });
            _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_(cached.partitioned ? "sheetRowMultiIndexPartition" : "sheetRowMultiIndex", !0, 1);
            return _requestScopePut_("i3SheetRowMultiIndex", reqKey, {
                ok: !0, sheetName: String(sheetName || ""), keyField: String(keyField || ""), keyIndex: Number(keyIndex), map: cachedMap, rowCount: Math.max(0, lastRow - 1), stamp, mode: cached.partitioned ? "script-cache-partition-multi-index" : "script-cache-multi-index", cacheBypassed: !1, cacheHit: !0, serviceReads: 0
            });
        }
        _appIsFnName_("_requestScopeNoteCacheAccess_") && _requestScopeNoteCacheAccess_("sheetRowMultiIndex", !1, 1);
    }
    for (var totalRows = Math.max(0, lastRow - 1), batchSize = _i3AdaptiveReadBatchRows_(totalRows, 1, opts), idxMap = {}, rowsRead = 0, serviceReads = 0, row = 2; row <= lastRow; row += batchSize) {
        var take = Math.min(batchSize, lastRow - row + 1);
        if (take <= 0)
            break;
        var values = sh.getRange(row, Number(keyIndex) + 1, take, 1).getValues() || [];
        serviceReads++, rowsRead += values.length;
        for (var i = 0; i < values.length; i++) {
            var key = String(values[i][0] == null ? "" : values[i][0]);
            key === "" || ((idxMap[key] = idxMap[key] || []).push(row + i));
        }
    }
    try {
        _requestScopeNoteRowsRead_(sheetName, rowsRead);
    }
    catch (_n) {
        _appIgnore_(_n, "c.s");
    }
    var result = {
        ok: !0, sheetName: String(sheetName || ""), keyField: String(keyField || ""), keyIndex: Number(keyIndex), map: idxMap, rowCount: rowsRead, stamp, mode: bypassRequestCache ? "key-column-direct-fresh-multi-index" : "key-column-adaptive-multi-index", cacheBypassed: bypassRequestCache, cacheHit: !1, serviceReads, readBatchRows: batchSize
    };
    return !bypassRequestCache && opts.allowScriptCache !== !1 && _i3SheetRowIndexCachePut_(cacheKey, idxMap, Math.max(30, Math.min(Number(opts.cacheTtlSeconds || 180) || 180, 600)), {
        sheetName: String(sheetName || ""), keyField: String(keyField || ""), stamp, lastRow, rowCount: rowsRead, multiRow: !0
    }), bypassRequestCache ? result : _requestScopePut_("i3SheetRowMultiIndex", reqKey, result);
}
function ensureHeaderColumn_(sheetName, headerName) {
    var sh = getSheet_(sheetName), headerRow = _sheetHeaders_(sheetName), idx = headerRow.indexOf(headerName);
    if (idx !== -1)
        return idx + 1;
    var nextCol = Math.max(1, headerRow.length) + 1;
    return sh.getRange(1, nextCol).setValue(headerName), _spreadsheetContextInvalidateSheet_(sheetName), invalidateSheetCache_(sheetName), nextCol;
}
function deleteRowById_(sheetName, id, idColumnIndex) {
    ensureCanonicalHeadersForNewSheet_(sheetName);
    var audit = getCanonicalHeaderAudit_(sheetName);
    if (audit.missing.length && sheetName !== "Users")
        throw new Error("ชีต " + sheetName + " ยังไม่เป็น canonical: " + audit.missing.join(", "));
    var sh = getSheet_(sheetName), headers = _sheetHeaders_(sheetName), col = Number(idColumnIndex || 0), keyField = headers[col] || "id";
    if (headers.indexOf("isDeleted") !== -1)
        return softDeleteSheetObjectByKey_(sheetName, keyField, id);
    var activeCol = headers.indexOf("active"), updatedAtCol = headers.indexOf("updatedAt");
    activeCol === -1 && (activeCol = ensureHeaderColumn_(sheetName, "active") - 1, headers = _sheetHeaders_(sheetName)), updatedAtCol === -1 && (updatedAtCol = ensureHeaderColumn_(sheetName, "updatedAt") - 1, headers = _sheetHeaders_(sheetName));
    var rowNumber = _i3FindRowNumberByKey_(sheetName, keyField, id, col, {
        headers, forceFresh: !0
    });
    if (!rowNumber)
        return !1;
    var width = Math.max(headers.length, Number(sh.getLastColumn && sh.getLastColumn()) || headers.length || 1), row = sh.getRange(rowNumber, 1, 1, width).getValues()[0] || [];
    return row[activeCol] = "N", row[updatedAtCol] = new Date, sh.getRange(rowNumber, 1, 1, width).setValues([
        row.slice(0, width)
    ]), _afterSheetWrite_(sheetName, {
        operation: "deleteRowById_", rows: 1
    }), !0;
}
function sheetToObjects_(sh) {
    var rows = typeof getSheetMatrixCached_ == "function" ? getSheetMatrixCached_(sh) : getSheetMatrix_(sh);
    if (rows.length < 2)
        return [];
    var headers = rows[0];
    return rows.slice(1).map(function (row) {
        var obj = {};
        return headers.forEach(function (h, i) {
            obj[String(h).trim()] = row[i];
        }), obj;
    });
}
function _isMeaningfulCellValue_(value) {
    return value != null && (typeof value != "string" || String(value).trim() !== "");
}
function _trimMatrixTail_(matrix, minCols) {
    if (!(matrix = Array.isArray(matrix) ? matrix : []).length)
        return [];
    for (var lastRow = matrix.length - 1; lastRow > 0;) {
        for (var row = matrix[lastRow] || [], rowHasValue = !1, i = 0; i < row.length; i++)
            if (_isMeaningfulCellValue_(row[i])) {
                rowHasValue = !0;
                break;
            }
        if (rowHasValue)
            break;
        lastRow--;
    }
    var trimmed = matrix.slice(0, lastRow + 1).map(function (row2) {
        return Array.isArray(row2) ? row2.slice() : [];
    }), lastCol = Math.max(Number(minCols) || 0, 1);
    return trimmed.forEach(function (row2) {
        for (var c = row2.length - 1; c >= 0; c--)
            if (_isMeaningfulCellValue_(row2[c])) {
                c + 1 > lastCol && (lastCol = c + 1);
                break;
            }
    }), trimmed.map(function (row2) {
        for (; row2.length < lastCol;)
            row2.push("");
        return row2.slice(0, lastCol);
    });
}
function _readSheetMatrixBodyPartitioned_(sh, startRow, width, opts) {
    opts = opts || {};
    var out = [];
    if (!sh || !sh.getRange)
        return out;
    var sheetName = String(opts.sheetName || sh.getName && sh.getName() || "").trim(), meta = opts.sheetMeta || _spreadsheetContextSheetMeta_(sheetName, sh, {
        forceFresh: opts.forceFresh === !0
    }), lastRow = Math.max(Number(meta && meta.lastRow || 0) || 0, 1);
    if (startRow = Math.max(2, Number(startRow || 2) || 2), width = Math.max(1, Number(width || 1) || 1), lastRow < startRow)
        return out;
    for (var batchSize = Math.max(50, Math.min(Number(opts.batchSize || opts.partitionBatchSize || 300) || 300, 1e3)), maxRows = Number(opts.maxRows || opts.maxScanRows || 0) || 0, scanned = 0, row = startRow; row <= lastRow; row += batchSize) {
        var take = Math.min(batchSize, lastRow - row + 1);
        if (maxRows > 0 && (take = Math.min(take, maxRows - scanned)), take <= 0)
            break;
        for (var chunk = sh.getRange(row, 1, take, width).getValues() || [], i = 0; i < chunk.length; i++)
            out.push(chunk[i]);
        if (scanned += chunk.length, maxRows > 0 && scanned >= maxRows)
            break;
    }
    try {
        _appIsFnName_("_requestScopeNoteRowsRead_") && _requestScopeNoteRowsRead_(sh.getName ? sh.getName() : "sheet", scanned);
    }
    catch (_n) {
        _appIgnore_(_n, "c.s");
    }
    return out;
}
function getSheetMatrix_(sh, minCols, opts) {
    if (!sh)
        return [];
    opts = opts || {};
    var sheetName = String(opts.sheetName || sh.getName && sh.getName() || "").trim(), meta = opts.sheetMeta || _spreadsheetContextSheetMeta_(sheetName, sh, {
        forceFresh: opts.forceFresh === !0
    }), lr = Math.max(Number(meta && meta.lastRow || 0) || 0, 1), raw = Math.max(Number(meta && meta.lastColumn || 0) || 0, Number(minCols) || 0, 1), schema = [];
    try {
        schema = SHEET_SCHEMAS[sheetName] || [];
    }
    catch (_e) {
        _recordWarning_("ec", _e);
    }
    var header = _sheetHeaders_(sheetName, {
        sheet: sh,
        sheetMeta: meta,
        widthHint: raw,
        forceFresh: opts.forceFresh === !0
    }), w = opts.allowFullMatrix === !0 ? raw : Math.max(Number(minCols) || 0, schema.length, 1);
    for (var c = header.length - 1; c >= 0; c--)
        if (_isMeaningfulCellValue_(header[c])) {
            w = Math.max(w, c + 1);
            break;
        }
    w = Math.max(1, Math.min(w, Math.max(raw, header.length, 1)));
    var values = [
        header.slice(0, w)
    ];
    if (lr > 1) {
        var bodyOpts = Object.assign({}, opts, {
            sheetName: sheetName,
            sheetMeta: meta
        });
        for (var body = _readSheetMatrixBodyPartitioned_(sh, 2, w, bodyOpts), r = 0; r < body.length; r++)
            values.push(body[r]);
    }
    return _trimMatrixTail_(values, minCols);
}
function filterDeleted_(rows) {
    return rows = Array.isArray(rows) ? rows : [], _appIsFnName_("_isDeletedCanonical_") ? rows.filter(function (r) {
        return !_isDeletedCanonical_(r);
    }) : rows.filter(function (r) {
        var v = r && r.isDeleted;
        return v !== !0 && (typeof v != "string" || v.trim().toUpperCase() !== "TRUE");
    });
}
var BUDGET_IMPORT_SCHEMA = [
    "id", "fy", "entryType", "committeeType", "startDate", "endDate", "activityDate", "seminarDate", "committeeName", "roundNo", "topic", "visitLocations", "seminarLocations", "countriesText", "meetingAllowance", "snackCost", "lunchCost", "travelCost", "receptionCost", "seminarCost", "foreignTripCost", "foreignGuestCost", "amount", "committeeResponsible", "staffResponsible", "note", "createdAt", "updatedAt", "refundStatus", "refundDate", "reportStatus", "reportDate", "visitLocationsJson", "seminarLocationsJson", "countriesJson", "totalAmount", "payloadJson", "category", "item", "supportCost", "visitLocationsText", "seminarLocationsText", "isDeleted", "deletedAt"
], BUDGET_IMPORT_HEADER_ALIASES = {
    payloadjson: "payloadJson", payload_json: "payloadJson", visitlocationsjson: "visitLocationsJson", seminarlocationsjson: "seminarLocationsJson", countriesjson: "countriesJson", returndate: "refundDate", refunddate: "refundDate", reportdate: "reportDate", ปีงบประมาณ: "fy", ปีงบ: "fy", fiscalyear: "fy", budgetfy: "fy", year: "fy", ประเภท: "entryType", ประเภทรายการ: "entryType", ประเภทรายการงบประมาณ: "entryType", category: "category", entrytype: "entryType", itemtype: "entryType", รายการ: "item", ชื่อรายการ: "item", รายการงบประมาณ: "item", itemname: "item", topic: "topic", เรื่อง: "topic", วันที่: "activityDate", วันเดือนปี: "activityDate", วันที่ดำเนินการ: "activityDate", activitydate: "activityDate", startdate: "startDate", enddate: "endDate", seminardate: "seminarDate", จำนวนเงิน: "amount", ยอดรวม: "amount", รวมเป็นเงิน: "amount", totalamount: "totalAmount", spent: "amount", ค่าเบี้ยประชุมกรรมาธิการ: "meetingAllowance", meetingallowance: "meetingAllowance", ค่าอาหารว่าง: "snackCost", snackcost: "snackCost", ค่าอาหารกลางวัน: "lunchCost", lunchcost: "lunchCost", ค่าเบี้ยเลี้ยงค่าเช่าที่พักค่าพาหนะ: "travelCost", "ค่าเบี้ยเลี้ยง/ค่าเช่าที่พัก/ค่าพาหนะ": "travelCost", travelcost: "travelCost", ค่าใช้จ่ายในการส่งเสริมและสนับสนุนการทำงานของคณะกรรมาธิการ: "supportCost", supportcost: "supportCost", ค่าใช้จ่ายในการจัดสัมมนาของคณะกรรมาธิการสามัญ: "seminarCost", seminarcost: "seminarCost", ค่าใช้จ่ายเพื่อรับรองแขกต่างประเทศของคณะกรรมาธิการ: "foreignGuestCost", foreignguestcost: "foreignGuestCost", foreigntripcost: "foreignTripCost", สถานะการคืนเงิน: "refundStatus", refundstatus: "refundStatus", วันที่คืนเงิน: "refundDate", สถานะรายงาน: "reportStatus", สถานะรายงานค่าใช้จ่าย: "reportStatus", reportstatus: "reportStatus", วันที่รายงาน: "reportDate", isdeleted: "isDeleted", deleted: "isDeleted", deletedat: "deletedAt"
}, SHEET_SCHEMAS = {
    Users: [
        "username", "name", "role", "email", "passwordHash", "active", "lastLoginAt", "updatedAt"
    ], AuditLog: [
        "timestamp", "action", "user", "detail"
    ], MainData: [
        "caseId", "cat", "subCat", "recNo", "offerDate", "recDate", "title", "petitioners", "status", "assignees", "staffs", "respondent", "coAssignees", "caseNum", "remark", "caseTitle", "agencyName", "closedReason", "rejectionReason", "petitionerPhone", "subject", "caseType", "topic", "subcommittee", "owner", "dueDate", "createdAt", "updatedAt", "meetingStatus", "isDeleted", "deletedAt", "keySummary"
    ], Letters: [
        "letterId", "caseId", "caseNum", "letterNo", "letterDate", "agency", "subject", "issue", "dueDate", "extendDate", "remark", "letterStatus", "repliesJSON", "opStaff", "bookNo", "officer", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ], MeetingLogs: [
        "caseId", "caseNum", "round", "date", "note", "logId", "meetingId", "meetingDate", "title", "location", "attendees", "summary", "result", "committeeType", "subcommitteeId", "subcommitteeName", "meetingGroup", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ], CommitteeMeetings: [
        "meetingId", "meetingNo", "meetingDate", "title", "status", "note", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ], CommitteeMeetingAgendaItems: [
        "itemId", "meetingId", "agendaNo", "seq", "title", "relatedMeetingNo", "relatedMeetingDate", "caseId", "caseNum", "recNo", "caseTitle", "letterId", "letterNo", "letterSubject", "agencyOrPresenter", "result", "note", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ], Petitioners: [
        "petId", "name", "phone", "addressLine", "subDistrict", "district", "province", "postalCode", "address", "petitionerId", "idCard", "caseId", "remark", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ], Personnel_Comm: [
        "id", "sortOrder", "name", "position", "phone", "startDate", "endDate", "status", "note", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ], Personnel_Op: [
        "id", "name", "position", "phone", "startDate", "endDate", "status", "note", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ], Personnel_Staff: [
        "id", "name", "position", "personnelType", "phone", "proposedBy", "startDate", "endDate", "status", "orderRef", "remark", "createdAt", "updatedAt", "isGov", "commandRef", "isDeleted", "deletedAt"
    ], Personnel_Subcommittees: [
        "id", "sortOrder", "personId", "name", "subcommitteeId", "subcommitteeName", "position", "phone", "startDate", "endDate", "status", "appointmentDate", "note", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ], Subcommittees: [
        "id", "name", "status", "appointmentDate", "dutyStartDate", "endDate", "activeDays", "dueDays", "dueDate", "extensionDays", "totalExtensionDays", "extendedDueDate", "extensionHistory", "remark", "updatedAt", "isDeleted", "deletedAt"
    ], SalarySettings: [
        "fy", "Key", "Value", "UpdatedAt", "isDeleted", "deletedAt"
    ], SalaryPayments: [
        "id", "fy", "personId", "personName", "position", "monthlyRate", "months", "amount", "createdAt", "updatedAt", "isDeleted", "deletedAt"
    ], BudgetYearSettingsItems: [
        "fy", "category", "item", "budget", "remark", "active", "planGroup", "sortNo", "updatedAt", "isDeleted", "deletedAt"
    ], BudgetYearSettings: [
        "fy", "category", "item", "budget", "remark", "active", "planGroup", "sortNo", "updatedAt"
    ], BudgetImports: BUDGET_IMPORT_SCHEMA.slice(), BudgetSummary: [
        "id", "fy", "planGroup", "item", "budget", "spent", "remain", "updatedAt"
    ], SystemSettings: [
        "key", "value", "updatedAt", "isDeleted", "deletedAt"
    ], Config: [
        "key", "value", "updatedAt"
    ], ThailandLocations: [
        "province", "district", "subDistrict", "zip"
    ]
}, SHEET_HEADER_ALIASES = Object.assign({
    Users: {
        passwordhash: "passwordHash", updatedat: "updatedAt", lastloginat: "lastLoginAt"
    }, BudgetImports: Object.assign({}, BUDGET_IMPORT_HEADER_ALIASES), MainData: {
        เลขรับเรื่อง: "recNo", เลขรับ: "recNo", เลขที่รับเรื่อง: "recNo", เลขที่รับ: "recNo", รับเรื่องเลขที่: "recNo", เลขรับเรื่องพิจารณา: "recNo", เลขรับที่: "recNo", เลขรับคำร้อง: "recNo", เลขรับหนังสือ: "recNo", เลขทะเบียนรับ: "recNo", ทะเบียนรับ: "recNo", ทะเบียนหนังสือรับ: "recNo", เลขหนังสือรับ: "recNo", รับเลขที่: "recNo", รับที่: "recNo", receiveno: "recNo", receivedno: "recNo", receive_no: "recNo", recno: "recNo", casereceiveno: "recNo", caserecno: "recNo", receiptno: "recNo", receivenumber: "recNo", registrationno: "recNo", registrationnumber: "recNo", receiveregistrationno: "recNo", receivecode: "recNo", receivebookno: "recNo", bookreceiveno: "recNo", petitionreceiveno: "recNo", complaintreceiveno: "recNo", documentreceiveno: "recNo", ลำดับเรื่อง: "caseNum", ลำดับ: "caseNum", ลำดับที่: "caseNum", caseno: "caseNum", casenum: "caseNum", casenumber: "caseNum", runningno: "caseNum", sequence: "caseNum", seq: "caseNum", วันที่รับเรื่อง: "recDate", วันที่รับ: "recDate", วันรับเรื่อง: "recDate", วันรับ: "recDate", รับเรื่องวันที่: "recDate", วันที่ลงรับ: "recDate", วันที่ลงทะเบียนรับ: "recDate", วันที่รับคำร้อง: "recDate", วันที่รับหนังสือ: "recDate", วันเดือนปีที่รับ: "recDate", วันเดือนปีรับ: "recDate", รับวันที่: "recDate", วันที่รับเรื่องร้องเรียน: "recDate", receivedate: "recDate", receiveddate: "recDate", recdate: "recDate", receive_date: "recDate", received_date: "recDate", dateReceived: "recDate", datereceived: "recDate", date_received: "recDate", receiptdate: "recDate", registrationdate: "recDate", casereceivedate: "recDate", caserecdate: "recDate", petitionreceivedate: "recDate", complaintreceivedate: "recDate", documentreceivedate: "recDate", วันที่เสนอ: "offerDate", วันเสนอ: "offerDate", วันที่ยื่น: "offerDate", วันที่หนังสือ: "offerDate", offerdate: "offerDate", proposeddate: "offerDate", submitteddate: "offerDate", เรื่อง: "title", ชื่อเรื่อง: "title", subject: "title", เรื่องพิจารณา: "caseTitle", ชื่อเรื่องพิจารณา: "caseTitle", casetitle: "caseTitle", considerationtitle: "caseTitle", ประเภท: "cat", category: "cat", ประเภทรื่อง: "cat", ประเภทเรื่อง: "cat", ประเด็นพิจารณา: "subCat", ประเด็น: "subCat", หัวข้อประเด็น: "subCat", subcategory: "subCat", subcat: "subCat", issue: "subCat", topic: "subCat", ผู้ร้อง: "petitioners", ผู้ร้องเรียน: "petitioners", ผู้เสนอ: "petitioners", petitioner: "petitioners", petitioners: "petitioners", proposer: "petitioners", proposedby: "petitioners", หน่วยงาน: "respondent", ผู้ถูกร้อง: "respondent", respondent: "respondent", agency: "respondent", agencyname: "agencyName", ผู้รับผิดชอบ: "assignees", ผู้รับผิดชอบหลัก: "assignees", "กมธ.รับผิดชอบ": "assignees", กมธรับผิดชอบ: "assignees", กรรมาธิการรับผิดชอบ: "assignees", คณะกรรมาธิการรับผิดชอบ: "assignees", responsiblecommissioners: "assignees", responsiblecomm: "assignees", owner: "assignees", assignee: "assignees", assignees: "assignees", ผู้รับผิดชอบร่วม: "coAssignees", coassignee: "coAssignees", coassignees: "coAssignees", เจ้าหน้าที่ฝ่ายเลขานุการ: "staffs", เจ้าหน้าที่ฝ่ายเลขานุการ: "staffs", operationofficer: "staffs", secretariatofficer: "staffs", staffs: "staffs", staff: "staffs", officer: "staffs", สถานะ: "status", สถานะเรื่อง: "status", สถานะเรื่องพิจารณา: "status", casestatus: "status", processstatus: "status", meetingstatus: "meetingStatus", "เหตุผล (ไม่รับเรื่อง)": "rejectionReason", เหตุผลไม่รับเรื่อง: "rejectionReason", rejectionreason: "rejectionReason", rejectreason: "rejectionReason", notacceptedreason: "rejectionReason", updatedat: "updatedAt", createdat: "createdAt", deletedat: "deletedAt", isdeleted: "isDeleted"
    }, Petitioners: {
        fullname: "name", name: "name", ชื่อสกุล: "name", "ชื่อ-สกุล": "name", ชื่อ: "name", tel: "phone", telephone: "phone", mobile: "phone", เบอร์โทร: "phone", เบอร์โทรศัพท์: "phone", โทรศัพท์: "phone", location: "addressLine", addressline: "addressLine", line1: "addressLine", สถานที่: "addressLine", บ้านเลขที่ถนนหมู่บ้าน: "addressLine", subdistrict: "subDistrict", subdistrictname: "subDistrict", tambon: "subDistrict", ตำบล: "subDistrict", แขวง: "subDistrict", district: "district", amphoe: "district", amphur: "district", อำเภอ: "district", เขต: "district", province: "province", changwat: "province", จังหวัด: "province", postalcode: "postalCode", postcode: "postalCode", zipcode: "postalCode", zip: "postalCode", รหัสไปรษณีย์: "postalCode", address: "address", fulladdress: "address", ที่อยู่: "address", petitionerid: "petitionerId", idcard: "idCard", citizenid: "idCard", nationalid: "idCard", caseid: "caseId", updatedat: "updatedAt", createdat: "createdAt", deletedat: "deletedAt"
    }, Letters: {
        casenum: "caseNum", caseno: "caseNum", runningno: "caseNum", sequence: "caseNum", seq: "caseNum", ลำดับเรื่อง: "caseNum", ลำดับ: "caseNum", ลำดับที่: "caseNum", caseid: "caseId", letterid: "letterId", bookid: "letterId", rowid: "letterId", id: "letterId"
    }, MeetingLogs: {
        casenum: "caseNum", caseno: "caseNum", runningno: "caseNum", sequence: "caseNum", seq: "caseNum", ลำดับเรื่อง: "caseNum", ลำดับ: "caseNum", ลำดับที่: "caseNum", caseid: "caseId", ครั้งที่: "round", ครั้งประชุม: "round", รอบ: "round", round: "round", วันที่: "date", วันที่ประชุม: "date", "วันที่ (พ.ศ.)": "date", meetingdate: "meetingDate", การประชุม: "meetingGroup", ชื่อการประชุม: "meetingGroup", คณะ: "committeeType", ประเภทการประชุม: "committeeType", committeetype: "committeeType", meetinggroup: "meetingGroup", "คณะกรรมาธิการ/คณะอนุกรรมาธิการ": "meetingGroup", คณะกรรมาธิการ: "committeeType", คณะอนุกรรมาธิการ: "subcommitteeName", ชื่อคณะอนุกรรมาธิการ: "subcommitteeName", subcommittee: "subcommitteeName", subcommitteename: "subcommitteeName", subcommitteeid: "subcommitteeId", มติสรุปผล: "note", "ผลการประชุม / มติที่ประชุม": "note", ผลการประชุม: "result", มติที่ประชุม: "note", note: "note", summary: "summary", result: "result", logid: "logId", meetinglogid: "logId", rowid: "logId", id: "logId"
    }, Personnel_Subcommittees: {
        personnelsubcommitteeid: "id", membershipid: "id", recordid: "id", personid: "personId", personnelid: "personId", รหัสบุคคล: "personId", name: "name", fullname: "name", ชื่อสกุล: "name", "ชื่อ-สกุล": "name", ชื่อ: "name", subcommitteeid: "subcommitteeId", รหัสคณะอนุกรรมาธิการ: "subcommitteeId", subcommitteename: "subcommitteeName", subcommittee: "subcommitteeName", คณะอนุกรรมาธิการ: "subcommitteeName", ชื่อคณะอนุกรรมาธิการ: "subcommitteeName", position: "position", role: "position", ตำแหน่ง: "position", phone: "phone", tel: "phone", mobile: "phone", เบอร์โทร: "phone", เบอร์โทรศัพท์: "phone", startdate: "startDate", วันเริ่ม: "startDate", วันที่เริ่ม: "startDate", enddate: "endDate", วันสิ้นสุด: "endDate", วันที่สิ้นสุด: "endDate", status: "status", สถานะ: "status", appointmentdate: "appointmentDate", appointeddate: "appointmentDate", วันแต่งตั้ง: "appointmentDate", วันที่แต่งตั้ง: "appointmentDate", note: "note", remark: "note", หมายเหตุ: "note", createdat: "createdAt", updatedat: "updatedAt", isdeleted: "isDeleted", deletedat: "deletedAt"
    }, Subcommittees: {
        subcommitteeid: "id", name: "name", active: "status", status: "status", สถานะ: "status", appointmentdate: "appointmentDate", appointeddate: "appointmentDate", วันแต่งตั้ง: "appointmentDate", วันที่แต่งตั้ง: "appointmentDate", startdate: "dutyStartDate", dutystartdate: "dutyStartDate", startworkingdate: "dutyStartDate", effectivedate: "dutyStartDate", วันเริ่มทำหน้าที่: "dutyStartDate", วันที่เริ่มทำหน้าที่: "dutyStartDate", enddate: "endDate", finishdate: "endDate", expiredate: "endDate", วันสิ้นสุด: "endDate", วันที่สิ้นสุด: "endDate", activedays: "activeDays", daycount: "activeDays", จำนวนวัน: "activeDays", duedays: "dueDays", due_day_count: "dueDays", จำนวนวันครบกำหนด: "dueDays", "วันครบกำหนด(จำนวนวัน)": "dueDays", duedate: "dueDate", deadline: "dueDate", deadlinedate: "dueDate", วันครบกำหนด: "dueDate", วันที่ครบกำหนด: "dueDate", extensiondays: "extensionDays", extenddays: "extensionDays", extension_day_count: "extensionDays", ขยายระยะเวลา: "extensionDays", จำนวนวันขยาย: "extensionDays", totalextensiondays: "totalExtensionDays", totalextenddays: "totalExtensionDays", รวมวันขยาย: "totalExtensionDays", extendedduedate: "extendedDueDate", finalduedate: "extendedDueDate", latestduedate: "extendedDueDate", วันครบกำหนดหลังขยาย: "extendedDueDate", วันที่ครบกำหนดหลังขยาย: "extendedDueDate", extensionhistory: "extensionHistory", ประวัติการขยายเวลา: "extensionHistory", sortno: "remark", remark: "remark", หมายเหตุ: "remark", updatedat: "updatedAt"
    }
});
function _normFieldKey_(value) {
    return String(value == null ? "" : value).replace(/[\u200B-\u200D\uFEFF]/g, "").trim().toLowerCase().replace(/[\s\n\r\t\-–—_()（）\[\]{}:：\/\\.]+/g, "");
}
function _appCanonicalOwn_(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj || {}, key);
}
function _appCanonicalFreeze_(obj) {
    try {
        return Object.freeze(obj);
    }
    catch (_e) {
        return obj;
    }
}
function _appCanonicalAliasMapFrom_(source, schema) {
    var out = {};
    function addAliasKey_(rawKey, canonicalValue) {
        var raw = String(rawKey == null ? "" : rawKey).trim();
        if (raw) {
            var canonical = String(canonicalValue == null ? raw : canonicalValue).trim() || raw;
            _appCanonicalOwn_(out, raw) || (out[raw] = canonical);
            var headerKey = "";
            try {
                headerKey = _normalizedHeaderKey_(raw);
            }
            catch (_e) {
                headerKey = raw.toLowerCase().replace(/\s/g, "");
            }
            headerKey && !_appCanonicalOwn_(out, headerKey) && (out[headerKey] = canonical);
            var normalized = _normFieldKey_(raw);
            normalized && !_appCanonicalOwn_(out, normalized) && (out[normalized] = canonical);
        }
    }
    return Object.keys(source || {}).forEach(function (k) {
        addAliasKey_(k, source[k]);
    }), (Array.isArray(schema) ? schema : []).forEach(function (field) {
        addAliasKey_(field, field);
    }), _appCanonicalFreeze_(out);
}
function _appBuildFieldAliases_() {
    var aliasSource = typeof SHEET_HEADER_ALIASES == "object" && SHEET_HEADER_ALIASES ? SHEET_HEADER_ALIASES : {}, schemas = typeof SHEET_SCHEMAS == "object" && SHEET_SCHEMAS ? SHEET_SCHEMAS : {}, out = {};
    function appBuildFieldAliasPut_(name, sheetName) {
        var canonicalName = String(name || "").trim(), sheet = String(sheetName || name || "").trim();
        canonicalName && (out[canonicalName] = _appCanonicalAliasMapFrom_(aliasSource[sheet] || {}, schemas[sheet] || []));
    }
    function mergeAliases(sheet, extra) {
        out[sheet] = _appCanonicalAliasMapFrom_(Object.assign({}, out[sheet] || {}, extra || {}), []);
    }
    [
        "Users", "MainData", "MeetingLogs", "Letters", "Petitioners", "Personnel_Comm", "Personnel_Op", "Personnel_Staff", "Personnel_Subcommittees", "Subcommittees", "SalarySettings", "SalaryPayments", "BudgetYearSettingsItems", "BudgetYearSettings", "BudgetImports", "BudgetSummary", "CommitteeMeetings", "CommitteeMeetingAgendaItems", "SystemSettings", "Config", "ThailandLocations"
    ].forEach(function (sheet) {
        appBuildFieldAliasPut_(sheet, sheet);
    });
    mergeAliases("MainData", APP_CASE_MAIN_DATA_ALIAS_MAP_CURRENT);
    var peopleCommonAliases = {
        name: "name", fullname: "name", ชื่อสกุล: "name", "ชื่อ-สกุล": "name", "ชื่อ - สกุล": "name", "ชื่อ-นามสกุล": "name", ชื่อ: "name", ชื่อบุคลากร: "name", ชื่อและสกุล: "name", position: "position", role: "position", ตำแหน่ง: "position", ตำแหน่งในคณะ: "position", ตำแหน่งงาน: "position", phone: "phone", tel: "phone", mobile: "phone", เบอร์โทร: "phone", เบอร์โทรศัพท์: "phone", โทรศัพท์: "phone", หมายเลขโทรศัพท์: "phone", startdate: "startDate", วันที่เริ่ม: "startDate", วันเริ่ม: "startDate", วันเริ่มต้น: "startDate", วันเริ่มดำรงตำแหน่ง: "startDate", วันที่แต่งตั้ง: "startDate", enddate: "endDate", วันที่สิ้นสุด: "endDate", วันสิ้นสุด: "endDate", วันสิ้นสุดตำแหน่ง: "endDate", วันที่พ้นตำแหน่ง: "endDate", status: "status", สถานะ: "status", สถานะการดำรงตำแหน่ง: "status", note: "note", remark: "remark", หมายเหตุ: "remark", createdat: "createdAt", วันที่สร้าง: "createdAt", updatedat: "updatedAt", วันที่แก้ไข: "updatedAt", isdeleted: "isDeleted", deleted: "isDeleted", ลบแล้ว: "isDeleted", deletedat: "deletedAt", วันที่ลบ: "deletedAt"
    };
    return mergeAliases("Personnel_Comm", Object.assign({
        sortorder: "sortOrder", ลำดับ: "sortOrder", ลำดับที่: "sortOrder"
    }, peopleCommonAliases)), mergeAliases("Personnel_Op", peopleCommonAliases), mergeAliases("Personnel_Staff", Object.assign({
        personneltype: "personnelType", ประเภทบุคลากร: "personnelType", ประเภท: "personnelType", proposedby: "proposedBy", ผู้เสนอ: "proposedBy", กรรมาธิการผู้เสนอ: "proposedBy", ผู้เสนอชื่อ: "proposedBy", orderref: "orderRef", คำสั่ง: "orderRef", เลขที่คำสั่ง: "orderRef", isgov: "isGov", ข้าราชการ: "isGov", commandref: "commandRef", commandfileurl: "commandRef", ไฟล์คำสั่ง: "commandRef", ลิงก์คำสั่ง: "commandRef"
    }, peopleCommonAliases)), out.cases = out.MainData, out.mainData = out.MainData, out.letters = out.Letters, out.petitioners = out.Petitioners, out.budget = out.BudgetImports, out.budgetImports = out.BudgetImports, out["budget.imports"] = out.BudgetImports, out.budgetSummary = out.BudgetSummary, out["budget.summary"] = out.BudgetSummary, out.people = out.Personnel_Staff, out.peopleStaff = out.Personnel_Staff, out["people.staff"] = out.Personnel_Staff, out.peopleComm = out.Personnel_Comm, out["people.comm"] = out.Personnel_Comm, out.peopleOp = out.Personnel_Op, out["people.op"] = out.Personnel_Op, out.peopleSubcommittees = out.Personnel_Subcommittees, out["people.subcommittees"] = out.Personnel_Subcommittees, out.subcommittees = out.Subcommittees, _appCanonicalFreeze_(out);
}

var APP_CASE_MAIN_DATA_ALIAS_LISTS_CURRENT = _appCanonicalFreeze_({
    "caseNum": [
        "caseNum",
        "caseNo",
        "runningNo",
        "ลำดับเรื่อง",
        "เลขลำดับเรื่อง",
        "ลำดับเรื่องพิจารณา",
        "เลขที่ลำดับเรื่อง",
        "หมายเลขลำดับเรื่อง",
        "เลขที่เรื่องพิจารณา",
        "เลขลำดับเรื่องพิจารณา",
        "หมายเลขเรื่องพิจารณา"
    ],
    "pendingRemark": [
        "pendingRemark",
        "pendingReason",
        "waitReason",
        "waitingReason",
        "statusReason",
        "decisionReason",
        "reason",
        "เหตุผล",
        "เหตุผลรอพิจารณา",
        "เหตุผลรอการพิจารณา",
        "หมายเหตุรอพิจารณา",
        "หมายเหตุรอการพิจารณา"
    ],
    "petitionerPhone": [
        "petitionerPhone",
        "petitionerTel",
        "petitionerTelephone",
        "petitionerMobile",
        "petitionerContactPhone",
        "proposerPhone",
        "proposerTel",
        "proposerTelephone",
        "proposerMobile",
        "complainantPhone",
        "complainantTel",
        "complainantTelephone",
        "complainantMobile",
        "phone",
        "tel",
        "telephone",
        "mobile",
        "contactPhone",
        "phoneNumber",
        "เบอร์โทรศัพท์ผู้เสนอญัตติ/ผู้ร้อง",
        "เบอร์โทรผู้เสนอญัตติ/ผู้ร้อง",
        "โทรศัพท์ผู้เสนอญัตติ/ผู้ร้อง",
        "เบอร์โทรศัพท์ผู้ร้อง",
        "เบอร์โทรผู้ร้อง",
        "โทรศัพท์ผู้ร้อง",
        "เบอร์โทรศัพท์ผู้เสนอ",
        "เบอร์โทรผู้เสนอ",
        "โทรศัพท์ผู้เสนอ",
        "เบอร์โทรศัพท์",
        "เบอร์โทร",
        "โทรศัพท์",
        "หมายเลขโทรศัพท์",
        "มือถือ"
    ],
    "sentAgency": [
        "sentAgency",
        "sendToAgency",
        "sentToAgency",
        "forwardedAgency",
        "forwardAgency",
        "forwardToAgency",
        "sentAgencyName",
        "หน่วยงานที่ส่ง",
        "ส่งให้หน่วยงาน",
        "ส่งหน่วยงาน",
        "หน่วยงานที่เกี่ยวข้อง"
    ],
    "coAssignees": [
        "coAssignees",
        "coAssignee",
        "coOwners",
        "coResponsible",
        "ผู้รับผิดชอบร่วม",
        "ผู้ร่วมรับผิดชอบ"
    ],
    "subcommitteeName": [
        "subcommitteeName",
        "subcommittee",
        "คณะอนุกรรมาธิการ"
    ],
    "caseTitle": [
        "caseTitle",
        "considerationTitle",
        "caseConsiderationTitle",
        "titleConsider",
        "considerTitle",
        "ชื่อเรื่องพิจารณา (ถ้ามี)",
        "ชื่อเรื่องพิจารณา",
        "เรื่องพิจารณา"
    ],
    "title": [
        "title",
        "subject",
        "caseSubject",
        "เรื่อง",
        "ชื่อเรื่อง",
        "เรื่องร้องเรียน",
        "caseName",
        "name",
        "หัวข้อเรื่อง"
    ],
    "petitioners": [
        "petitioners",
        "petitioner",
        "petitionerName",
        "ผู้ร้อง",
        "ผู้เสนอญัตติ",
        "ผู้เสนอญัตติ/ผู้ร้อง",
        "requester",
        "complainant",
        "proposer",
        "motionProposer"
    ],
    "offerDate": [
        "offerDate",
        "bookDate",
        "letterDate",
        "dateProposed",
        "proposalDate",
        "proposeDate",
        "proposedDate",
        "submittedDate",
        "submitDate",
        "dateSubmitted",
        "วันที่หนังสือ",
        "วันที่เสนอ",
        "วันที่เสนอเรื่อง",
        "วันเดือนปีที่เสนอ",
        "วันที่ยื่น",
        "วันที่ยื่นเรื่อง"
    ],
    "closedReason": [
        "closedReason",
        "closeReason",
        "terminateReason",
        "stopReason",
        "endReason",
        "caseCloseReason",
        "caseEndReason",
        "statusReason",
        "decisionReason",
        "reason",
        "เหตุผล",
        "เหตุผลยุติเรื่อง",
        "เหตุผลการยุติเรื่อง"
    ],
    "respondent": [
        "respondent",
        "agencyName",
        "accusedAgency",
        "accused",
        "agency",
        "หน่วยงาน/ผู้ถูกร้อง",
        "ผู้ถูกร้อง",
        "หน่วยงาน"
    ],
    "staffs": [
        "staffs",
        "secretariatOfficer",
        "operationOfficer",
        "opStaff",
        "operator",
        "responsibleOfficer",
        "operationStaff",
        "staff",
        "officer",
        "เจ้าหน้าที่ฝ่ายเลขานุการ"
    ]
});
function _appAliasIndexFromListsCurrent_(lists) {
    var ownersByKey = {}, rawByKey = {}, map = {}, ambiguities = {};
    function registerKey_(key, canonical, raw) {
        var normalized = String(key == null ? "" : key).trim();
        if (!normalized)
            return;
        ownersByKey[normalized] || (ownersByKey[normalized] = {});
        ownersByKey[normalized][canonical] = !0;
        rawByKey[normalized] || (rawByKey[normalized] = {});
        rawByKey[normalized][String(raw == null ? key : raw)] = !0;
    }
    Object.keys(lists || {}).forEach(function (canonical) {
        registerKey_(canonical, canonical, canonical);
        registerKey_(_normalizedHeaderKey_(canonical), canonical, canonical);
        registerKey_(_normFieldKey_(canonical), canonical, canonical);
        (lists[canonical] || []).forEach(function (alias) {
            var raw = String(alias == null ? "" : alias).trim();
            if (!raw)
                return;
            registerKey_(raw, canonical, raw);
            registerKey_(_normalizedHeaderKey_(raw), canonical, raw);
            registerKey_(_normFieldKey_(raw), canonical, raw);
        });
    });
    Object.keys(ownersByKey).forEach(function (key) {
        var owners = Object.keys(ownersByKey[key] || {}).sort();
        if (owners.length === 1)
            map[key] = owners[0];
        else if (owners.length > 1)
            ambiguities[key] = {
                aliasKey: key,
                canonicalFields: owners,
                rawAliases: Object.keys(rawByKey[key] || {}).sort()
            };
    });
    return {
        map: _appCanonicalFreeze_(map),
        ambiguities: _appCanonicalFreeze_(ambiguities)
    };
}
var APP_CASE_MAIN_DATA_ALIAS_INDEX_CURRENT = _appAliasIndexFromListsCurrent_(APP_CASE_MAIN_DATA_ALIAS_LISTS_CURRENT),
    APP_CASE_MAIN_DATA_ALIAS_MAP_CURRENT = APP_CASE_MAIN_DATA_ALIAS_INDEX_CURRENT.map,
    APP_CASE_MAIN_DATA_ALIAS_AMBIGUITIES_CURRENT = APP_CASE_MAIN_DATA_ALIAS_INDEX_CURRENT.ambiguities;
function _aliasTelemetryState_() {
    var root = typeof globalThis != "undefined" ? globalThis : this;
    return root.__APP_ALIAS_TELEMETRY_CURRENT__ || (root.__APP_ALIAS_TELEMETRY_CURRENT__ = { total: 0, canonical: 0, alias: 0, unknown: 0, domains: {}, fields: {}, rawHeaderKeys: {}, observationWindows: 0, firstObservedAt: "", lastObservedAt: "" });
}
function _aliasTelemetryRecord_(domain, raw, canonical, known) {
    var state = _aliasTelemetryState_(), d = String(domain || "unknown"), r = String(raw || ""), c = String(canonical || r), type = known ? (_normalizedHeaderKey_(r) === _normalizedHeaderKey_(c) ? "canonical" : "alias") : "unknown";
    var nowIso = new Date().toISOString(), rawKey = _normalizedHeaderKey_(r);
    state.total += 1;
    state[type] += 1;
    state.domains[d] = (state.domains[d] || 0) + 1;
    state.fields[c] = (state.fields[c] || 0) + 1;
    rawKey && (state.rawHeaderKeys[rawKey] = (state.rawHeaderKeys[rawKey] || 0) + 1);
    state.firstObservedAt || (state.firstObservedAt = nowIso);
    state.lastObservedAt = nowIso;
    return c;
}
function getAppFieldAliasList_(domain, field) {
    var d = String(domain == null ? "" : domain).trim(), f = String(field == null ? "" : field).trim();
    if ((d === "MainData" || d === "cases" || d === "mainData") && APP_CASE_MAIN_DATA_ALIAS_LISTS_CURRENT[f])
        return APP_CASE_MAIN_DATA_ALIAS_LISTS_CURRENT[f].slice();
    var map = getAppFieldAliases_(d), out = [f];
    Object.keys(map || {}).forEach(function (alias) {
        map[alias] === f && out.indexOf(alias) < 0 && out.push(alias);
    });
    return out;
}

var APP_FIELD_ALIASES = typeof APP_FIELD_ALIASES == "object" && APP_FIELD_ALIASES ? APP_FIELD_ALIASES : _appBuildFieldAliases_();
function getAppFieldAliases_(domain, field) {
    var aliases = typeof APP_FIELD_ALIASES == "object" && APP_FIELD_ALIASES ? APP_FIELD_ALIASES : {}, rawDomain = String(domain == null ? "" : domain).trim(), domainKey = rawDomain, map = aliases[domainKey] || aliases[_normFieldKey_(domainKey)] || aliases[rawDomain.toLowerCase()] || {};
    if (field === void 0)
        return Object.assign({}, map);
    var raw = String(field == null ? "" : field).trim();
    if (!raw)
        return "";
    var headerKey = "";
    try {
        headerKey = _normalizedHeaderKey_(raw);
    }
    catch (_e) {
        headerKey = raw.toLowerCase().replace(/\s/g, "");
    }
    var canonical = map[raw] || map[headerKey] || map[_normFieldKey_(raw)] || raw, known = Object.prototype.hasOwnProperty.call(map, raw) || Object.prototype.hasOwnProperty.call(map, headerKey) || Object.prototype.hasOwnProperty.call(map, _normFieldKey_(raw));
    return _aliasTelemetryRecord_(rawDomain, raw, canonical, known);
}
function _isDeletedFlagValue_(value) {
    if (value === !0)
        return !0;
    if (value === !1 || value == null)
        return !1;
    if (Object.prototype.toString.call(value) === "[object Date]")
        return !isNaN(value.getTime());
    var raw = String(value).trim();
    if (!raw)
        return !1;
    var lower = raw.toLowerCase(), norm = _normFieldKey_(raw), falseTokens = {
        false: !0, 0: !0, n: !0, no: !0, none: !0, active: !0, normal: !0, ไม่: !0, ไม่ลบ: !0, ยังไม่ลบ: !0, ปกติ: !0, ใช้งาน: !0, คงไว้: !0
    };
    if (falseTokens[lower] || falseTokens[norm])
        return !1;
    var trueTokens = {
        true: !0, 1: !0, y: !0, yes: !0, delete: !0, deleted: !0, remove: !0, removed: !0, ลบ: !0, ลบแล้ว: !0, ถูกลบ: !0, ใช่: !0, deletedrow: !0, softdeleted: !0
    };
    return !(!trueTokens[lower] && !trueTokens[norm]);
}
function _isDeletedCanonical_(row) {
    if (!row)
        return !1;
    if (typeof row != "object")
        return _isDeletedFlagValue_(row);
    var normalizedIndex = null;
    function valueFor(key) {
        if (_appCanonicalOwn_(row, key))
            return {
                found: !0, value: row[key]
            };
        normalizedIndex || (normalizedIndex = {}, Object.keys(row || {}).forEach(function (k) {
            var nk = _normFieldKey_(k);
            nk && !_appCanonicalOwn_(normalizedIndex, nk) && (normalizedIndex[nk] = row[k]);
        }));
        var target = _normFieldKey_(key);
        return target && _appCanonicalOwn_(normalizedIndex, target) ? {
            found: !0, value: normalizedIndex[target]
        } : {
            found: !1, value: null
        };
    }
    for (var flagKeys = [
        "isDeleted", "deleted", "deleteFlag", "deletedFlag", "is_deleted", "removed", "ลบ", "ลบแล้ว", "สถานะลบ", "สถานะการลบ"
    ], i = 0; i < flagKeys.length; i++) {
        var flag = valueFor(flagKeys[i]);
        if (flag.found && _isDeletedFlagValue_(flag.value))
            return !0;
    }
    for (var dateKeys = [
        "deletedAt", "deleted_at", "deletedDate", "removedAt", "วันที่ลบ", "วันลบ"
    ], d = 0; d < dateKeys.length; d++) {
        var date = valueFor(dateKeys[d]);
        if (date.found) {
            if (_isDeletedFlagValue_(date.value))
                return !0;
            if (date.value !== null && date.value !== void 0 && String(date.value).trim() !== "") {
                var norm = _normFieldKey_(date.value);
                if (norm && norm !== "false" && norm !== "0" && norm !== "no" && norm !== "ไม่ลบ")
                    return !0;
            }
        }
    }
    return !1;
}
function _headerMap_(headers) {
    var map = {};
    return (headers || []).forEach(function (h, i) {
        h !== null && h !== "" && (map[String(h).trim()] = i);
    }), map;
}
function _normalizedHeaderKey_(value) {
    return _appIsFnName_("_normFieldKey_") ? _normFieldKey_(value) : String(value == null ? "" : value).replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "").trim().toLowerCase().replace(/[\s\n\r\t\-–—_()（）\[\]{}:：\/\.]+/g, "");
}
function _canonicalHeaderNameForSheet_(sheetName, header) {
    var raw = String(header == null ? "" : header).trim(), aliasMap;
    return raw ? typeof getAppFieldAliases_ == "function" ? getAppFieldAliases_(sheetName, raw) || raw : (SHEET_HEADER_ALIASES[String(sheetName || "")] || {})[_normalizedHeaderKey_(raw)] || raw : "";
}
function _canonicalHeaderIndexMap_(sheetName, headers) {
    sheetName = String(sheetName || "").trim(), headers = Array.isArray(headers) ? headers : [];
    var ctx = _spreadsheetContext_(), cacheKey = sheetName + "|" + headers.map(function (h) {
        return String(h == null ? "" : h).trim();
    }).join("\u001f"), cached = ctx.headerMaps[cacheKey];
    if (cached)
        return _spreadsheetContextMetricBump_("headerMapCacheHits", 1), cached;
    var map = {};
    return headers.forEach(function (h, i) {
        var raw = String(h == null ? "" : h).trim();
        if (raw) {
            var canonical = _canonicalHeaderNameForSheet_(sheetName, raw);
            Object.prototype.hasOwnProperty.call(map, raw) || (map[raw] = i), canonical && !Object.prototype.hasOwnProperty.call(map, canonical) && (map[canonical] = i);
            var normalized = _normalizedHeaderKey_(raw);
            normalized && !Object.prototype.hasOwnProperty.call(map, normalized) && (map[normalized] = i);
        }
    }), ctx.headerMaps[cacheKey] = map, _spreadsheetContextMetricBump_("headerMapBuilds", 1), map;
}
function _sheetHeaders_(sheetName, opts) {
    opts = opts || {}, sheetName = String(sheetName || "").trim();
    var sh = opts.sheet || getSheet_(sheetName), meta = opts.sheetMeta || _spreadsheetContextSheetMeta_(sheetName, sh, {
        forceFresh: opts.forceFresh === !0
    }), width = Math.max(Number(opts.widthHint || 0) || 0, Number(meta && meta.lastColumn || 0) || 0, (SHEET_SCHEMAS[sheetName] || []).length, 1), cacheKey = sheetName + "|" + width, ctx = _spreadsheetContext_(), cached = opts.forceFresh === !0 ? null : ctx.headers[cacheKey], headers;
    if (cached && Array.isArray(cached))
        headers = cached.slice(), _spreadsheetContextMetricBump_("headerCacheHits", 1);
    else {
        headers = (sh.getRange(1, 1, 1, width).getValues()[0] || []).map(function (v) {
            return String(v || "").trim();
        });
        ctx.headers[cacheKey] = headers.slice(), _requestScopePut_("sheetHeaders", cacheKey, headers.slice()), _spreadsheetContextMetricBump_("headerReads", 1);
    }
    return opts.includeMeta ? {
        rawHeaders: headers.slice(), normalizedHeaders: headers.map(function (v) {
            return String(v || "").trim();
        }), widthUsed: width
    } : headers;
}
function getCanonicalHeaderAudit_(sheetName) {
    var expected = (SHEET_SCHEMAS[sheetName] || []).slice(), aliasMap = SHEET_HEADER_ALIASES[sheetName] || {}, info = _sheetHeaders_(sheetName, {
        includeMeta: !0
    }), headers = info && info.rawHeaders || [], normalizedMap = {}, duplicateHeaders = [];
    headers.forEach(function (h, i) {
        var key = String(h || "").trim().toLowerCase().replace(/\s/g, "");
        key && (Object.prototype.hasOwnProperty.call(normalizedMap, key) && duplicateHeaders.push(String(h || "").trim()), Object.prototype.hasOwnProperty.call(normalizedMap, key) || (normalizedMap[key] = i));
    });
    var missing = [], aliasesDetected = [];
    expected.forEach(function (h) {
        if (!(headers.indexOf(h) > -1)) {
            var key = String(h || "").trim().toLowerCase().replace(/\s/g, "");
            if (Object.prototype.hasOwnProperty.call(normalizedMap, key))
                return aliasesDetected.push({
                    expected: h, actual: headers[normalizedMap[key]]
                }), void 0;
            var aliasKey = Object.keys(aliasMap).filter(function (k) {
                return aliasMap[k] === h && Object.prototype.hasOwnProperty.call(normalizedMap, k);
            })[0];
            if (aliasKey)
                return aliasesDetected.push({
                    expected: h, actual: headers[normalizedMap[aliasKey]]
                }), void 0;
            missing.push(h);
        }
    });
    var unexpected = headers.filter(function (h) {
        if (!h || expected.indexOf(h) !== -1)
            return !1;
        var aliasKey = String(h || "").trim().toLowerCase().replace(/\s/g, "");
        return !(aliasMap[aliasKey] && expected.indexOf(aliasMap[aliasKey]) !== -1);
    }), orderDrift = [];
    expected.forEach(function (h, expectedIndex) {
        var actualIndex = headers.indexOf(h);
        actualIndex > -1 && actualIndex !== expectedIndex && orderDrift.push({
            header: h, expectedIndex: expectedIndex + 1, actualIndex: actualIndex + 1
        });
    });
    var dangerousFindings = [];
    String(sheetName) === "Users" && headers.forEach(function (h, i) {
        var key;
        String(h || "").trim().toLowerCase().replace(/\s/g, "") === "password" && dangerousFindings.push({
            severity: "critical", header: h, column: i + 1, issue: "Users.password ต้องไม่มี plaintext และห้ามใช้สำหรับ login"
        });
    });
    var securityCritical = dangerousFindings.some(function (item) {
        return String(item.severity || "") === "critical";
    });
    return {
        sheetName, headers, expected, missing, unexpected, duplicateHeaders, orderDrift, dangerousFindings, securityCritical, aliasesDetected, ok: missing.length === 0 && unexpected.length === 0 && duplicateHeaders.length === 0 && orderDrift.length === 0 && !securityCritical
    };
}
function ensureCanonicalHeadersForNewSheet_(sheetName) {
    var sh = getSheet_(sheetName), expected = SHEET_SCHEMAS[sheetName] || [], headers;
    return expected.length && (_sheetHeaders_(sheetName)[0] || (sh.getRange(1, 1, 1, expected.length).setValues([
        expected
    ]), sh.setFrozenRows(1))), sh;
}
function readSheetObjects_(sheetName, opts) {
    opts = opts || {};
    var sh = getSheet_(sheetName);
    if (opts.requireCanonical === !0) {
        var audit = getCanonicalHeaderAudit_(sheetName);
        if (audit.missing.length)
            throw new Error("ชีต " + sheetName + " ขาดหัวตารางสำคัญ: " + audit.missing.join(", "));
    }
    var data = typeof getSheetMatrixCached_ == "function" ? getSheetMatrixCached_(sh) : getSheetMatrix_(sh);
    if (data.length <= 1)
        return [];
    var aliasMap = SHEET_HEADER_ALIASES[sheetName] || {}, appAliasMap = typeof getAppFieldAliases_ == "function" ? getAppFieldAliases_(sheetName) : aliasMap, headers = data[0].map(function (v) {
        return String(v || "").trim();
    }).map(function (h) {
        var key = _appIsFnName_("_normFieldKey_") ? _normFieldKey_(h) : String(h || "").trim().toLowerCase().replace(/\s/g, "");
        return appAliasMap && (appAliasMap[h] || appAliasMap[key]) || aliasMap[key] || h;
    }), rows = data.slice(1).map(function (row) {
        var obj = {};
        return headers.forEach(function (h, i) {
            h && (obj[h] = row[i]);
        }), sheetName === "Subcommittees" && (obj.id = obj.id || obj.SubcommitteeId || row[0] || "", obj.name = obj.name || obj.Name || row[1] || "", obj.status = obj.status || (String(obj.Active || row[2] || "").trim() === "Y" ? "ใช้งาน" : obj.Active || row[2] || "ใช้งาน"), obj.appointmentDate = obj.appointmentDate || obj.appointedDate || obj.วันแต่งตั้ง || obj.วันที่แต่งตั้ง || "", obj.dutyStartDate = obj.dutyStartDate || obj.startDate || obj.startWorkingDate || obj.effectiveDate || obj.วันเริ่มทำหน้าที่ || obj.วันที่เริ่มทำหน้าที่ || obj.appointmentDate || "", obj.startDate = obj.startDate || obj.dutyStartDate || "", obj.endDate = obj.endDate || obj.finishDate || obj.expireDate || obj.วันสิ้นสุด || obj.วันที่สิ้นสุด || "", obj.activeDays = obj.activeDays || obj.dayCount || obj.จำนวนวัน || "", obj.remark = obj.remark || obj.SortNo || row[3] || "", obj.updatedAt = obj.updatedAt || obj.UpdatedAt || row[4] || ""), sheetName === "BudgetImports" && (obj.payloadJson = obj.payloadJson || obj.payloadJSON || "", obj.payloadJSON = obj.payloadJSON || obj.payloadJson || "", obj.visitLocationsJson = obj.visitLocationsJson || obj.visitLocationsJSON || "", obj.visitLocationsJSON = obj.visitLocationsJSON || obj.visitLocationsJson || "", obj.seminarLocationsJson = obj.seminarLocationsJson || obj.seminarLocationsJSON || "", obj.seminarLocationsJSON = obj.seminarLocationsJSON || obj.seminarLocationsJson || "", obj.countriesJson = obj.countriesJson || obj.countriesJSON || "", obj.countriesJSON = obj.countriesJSON || obj.countriesJson || ""), obj;
    });
    return opts.includeDeleted ? rows : filterDeleted_(rows);
}
function buildIndexMap_(rows, keyFieldOrFn, opts) {
    rows = Array.isArray(rows) ? rows : [], opts = opts || {};
    var map = {};
    return rows.forEach(function (row) {
        if (row) {
            var key = "";
            try {
                key = typeof keyFieldOrFn == "function" ? keyFieldOrFn(row) : row[String(keyFieldOrFn || "")];
            }
            catch (_eKey) {
                _recordWarning_("ec", _eKey), key = "";
            }
            if (key = String(key == null ? "" : key).trim())
                return opts.allowMultiple ? (Array.isArray(map[key]) || (map[key] = []), map[key].push(row), void 0) : (Object.prototype.hasOwnProperty.call(map, key) && opts.override !== !0 || (map[key] = row), void 0);
        }
    }), map;
}
function groupRowsBy_(rows, keyFieldOrFn) {
    return buildIndexMap_(rows, keyFieldOrFn, {
        allowMultiple: !0
    });
}
function findSheetObjectByKey_(sheetName, keyField, keyValue, opts) {
    opts = opts || {};
    var target = String(keyValue == null ? "" : keyValue).trim();
    if (!target)
        return null;
    if (opts.requireCanonical === !0) {
        var audit = getCanonicalHeaderAudit_(sheetName);
        if (audit.missing.length)
            throw new Error("ชีต " + sheetName + " ยังไม่เป็น canonical: " + audit.missing.join(", "));
    }
    var sh = getSheet_(sheetName), headers = _sheetHeaders_(sheetName), map = _canonicalHeaderIndexMap_(sheetName, headers), keyIndex = map[keyField] !== void 0 ? map[keyField] : map[_normalizedHeaderKey_(keyField)];
    if (keyIndex === void 0)
        return null;
    var rowNumber = _i3FindRowNumberByKey_(sheetName, keyField, target, keyIndex, {
        headers, headerMap: map, partitionBatchSize: Number(opts.partitionBatchSize || 500) || 500, bypassRequestCache: opts.bypassRequestCache === !0, forceFresh: opts.forceFresh === !0
    });
    if (!rowNumber)
        return null;
    var width = Math.max(headers.length, Number(sh.getLastColumn && sh.getLastColumn()) || headers.length || 1), row = sh.getRange(rowNumber, 1, 1, width).getValues()[0] || [], obj = {};
    return headers.forEach(function (h, i) {
        h && (obj[String(h).trim()] = row[i]);
    }), opts.includeDeleted !== !0 && _isDeletedCanonical_(obj) ? null : (obj._rowNumber = rowNumber, opts.bypassRequestCache === !0 && (obj._readSource = "direct-fresh-key-index"), obj);
}
function makeSheetRepository_(sheetName, keyField, opts) {
    opts = opts || {};
    var createdAtField = Object.prototype.hasOwnProperty.call(opts, "createdAtField") ? String(opts.createdAtField || "") : "createdAt", updatedAtField = Object.prototype.hasOwnProperty.call(opts, "updatedAtField") ? String(opts.updatedAtField || "") : "updatedAt";
    function _list_(override) {
        return readSheetObjectsCached_(sheetName, {
            includeDeleted: (override = override || {}).includeDeleted === !0, requireCanonical: override.requireCanonical === !0 || opts.requireCanonical === !0
        });
    }
    function _findByKey_(key, override) {
        return findSheetObjectByKey_(sheetName, keyField, key, {
            includeDeleted: !(!override || !override.includeDeleted), requireCanonical: !(!override || !override.requireCanonical)
        });
    }
    function _upsert_(key, patch, override) {
        var now = (override = override || {}).now || new Date().toISOString(), resolvedKey = String(key == null ? "" : key).trim() || String((patch || {})[keyField] || "").trim();
        if (!resolvedKey)
            throw new Error("ไม่พบค่า key ของ " + String(keyField || "id"));
        var existing = _findByKey_(resolvedKey, {
            includeDeleted: !0, requireCanonical: !0
        }), merged = Object.assign({}, existing || {}, patch || {});
        return merged[keyField] = resolvedKey, createdAtField && (existing && Object.prototype.hasOwnProperty.call(existing, createdAtField) ? merged[createdAtField] = existing[createdAtField] || merged[createdAtField] || now : Object.prototype.hasOwnProperty.call(merged, createdAtField) && merged[createdAtField] || (merged[createdAtField] = now)), updatedAtField && override.autoUpdatedAt !== !1 && (merged[updatedAtField] = now), existing ? (updateSheetObjectByKey_(sheetName, keyField, resolvedKey, merged), {
            mode: "update", key: resolvedKey, row: merged, previous: existing
        }) : (appendSheetObject_(sheetName, merged), {
            mode: "create", key: resolvedKey, row: merged, previous: null
        });
    }
    function _softDelete_(key, patch) {
        var resolvedKey = String(key == null ? "" : key).trim();
        return !!resolvedKey && softDeleteSheetObjectByKey_(sheetName, keyField, resolvedKey, patch || {});
    }
    return {
        sheetName, keyField, list: function (override) {
            return _list_(override || {});
        }, listAll: function () {
            return _list_({
                includeDeleted: !0
            });
        }, listActive: function () {
            return _list_({
                includeDeleted: !1
            });
        }, findByKey: _findByKey_, indexBy: function (keyFieldOrFn, override) {
            return buildIndexMap_(_list_(override || {}), keyFieldOrFn || keyField, {
                override: !0
            });
        }, groupBy: function (keyFieldOrFn, override) {
            return groupRowsBy_(_list_(override || {}), keyFieldOrFn || keyField);
        }, upsert: _upsert_, upsertMany: function (rows, override) {
            return upsertSheetObjectsByKey_(sheetName, keyField, rows || [], override || {});
        }, appendMany: function (rows, override) {
            return appendSheetObjects_(sheetName, rows || [], override || {});
        }, softDelete: _softDelete_
    };
}
function _canonicalRepositorySpecs_() {
    return AppInfra && AppInfra._canonicalRepositorySpecs || (AppInfra._canonicalRepositorySpecs = {
        "cases.mainData": {
            sheetName: "MainData", keyField: "caseId", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "cases"
        }, "meeting.logs": {
            sheetName: "MeetingLogs", keyField: "logId", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "meeting"
        }, "committee.meetings": {
            sheetName: "CommitteeMeetings", keyField: "meetingId", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "meeting"
        }, "committee.meetingAgendaItems": {
            sheetName: "CommitteeMeetingAgendaItems", keyField: "itemId", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "meeting"
        }, "letters.main": {
            sheetName: "Letters", keyField: "letterId", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "letters"
        }, "budget.imports": {
            sheetName: "BudgetImports", keyField: "id", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "budget"
        }, "budget.summary": {
            sheetName: "BudgetSummary", keyField: "id", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "budget"
        }, "budget.yearSettingsItems": {
            sheetName: "BudgetYearSettingsItems", keyField: "fy", createdAtField: "", updatedAtField: "updatedAt", requireCanonical: !0, domain: "budget", compositeKeyFields: [
                "fy", "category", "item"
            ]
        }, "budget.salarySettings": {
            sheetName: "SalarySettings", keyField: "Key", createdAtField: "", updatedAtField: "UpdatedAt", requireCanonical: !1, domain: "budget", compositeKeyFields: [
                "fy", "Key"
            ]
        }, "people.personnelComm": {
            sheetName: "Personnel_Comm", keyField: "id", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "people"
        }, "people.personnelOp": {
            sheetName: "Personnel_Op", keyField: "id", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "people"
        }, "people.personnelStaff": {
            sheetName: "Personnel_Staff", keyField: "id", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "people"
        }, "people.personnelSubcommittees": {
            sheetName: "Personnel_Subcommittees", keyField: "id", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "people"
        }, "people.subcommittees": {
            sheetName: "Subcommittees", keyField: "id", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "people"
        }, "people.petitioners": {
            sheetName: "Petitioners", keyField: "petId", createdAtField: "createdAt", updatedAtField: "updatedAt", requireCanonical: !0, domain: "people"
        }
    }), AppInfra._canonicalRepositorySpecs;
}
function _canonicalRepositoryAliases_() {
    return {
        MainData: "cases.mainData", MeetingLogs: "meeting.logs", CommitteeMeetings: "committee.meetings", CommitteeMeetingAgendaItems: "committee.meetingAgendaItems", Letters: "letters.main", BudgetImports: "budget.imports", BudgetSummary: "budget.summary", BudgetYearSettingsItems: "budget.yearSettingsItems", SalarySettings: "budget.salarySettings", Personnel_Comm: "people.personnelComm", Personnel_Op: "people.personnelOp", Personnel_Staff: "people.personnelStaff", Personnel_Subcommittees: "people.personnelSubcommittees", Subcommittees: "people.subcommittees", Petitioners: "people.petitioners"
    };
}
function _resolveCanonicalRepositoryName_(nameOrAlias) {
    var raw = String(nameOrAlias || "").trim();
    if (!raw)
        return "";
    var specs = _canonicalRepositorySpecs_(), aliases;
    return Object.prototype.hasOwnProperty.call(specs, raw) ? raw : _canonicalRepositoryAliases_()[raw] || raw;
}
function _getCanonicalRepositorySpec_(nameOrAlias) {
    var key = _resolveCanonicalRepositoryName_(nameOrAlias), specs;
    return _canonicalRepositorySpecs_()[key] || null;
}
function getCanonicalRepository_(nameOrAlias) {
    var key, spec = _getCanonicalRepositorySpec_(_resolveCanonicalRepositoryName_(nameOrAlias));
    if (!spec)
        throw new Error("ไม่พบ canonical repository: " + String(nameOrAlias || ""));
    return makeSheetRepository_(spec.sheetName, spec.keyField, {
        createdAtField: spec.createdAtField, updatedAtField: spec.updatedAtField, requireCanonical: spec.requireCanonical === !0
    });
}
function appendSheetObject_(sheetName, obj) {
    var sh = getSheet_(sheetName), audit = getCanonicalHeaderAudit_(sheetName);
    if (audit.missing.length)
        throw new Error("ชีต " + sheetName + " ยังไม่เป็น canonical: " + audit.missing.join(", "));
    var headers = _sheetHeaders_(sheetName), source = obj || {}, row = headers.map(function (h) {
        var canonical = _canonicalHeaderNameForSheet_(sheetName, h);
        return Object.prototype.hasOwnProperty.call(source, h) ? source[h] : canonical && Object.prototype.hasOwnProperty.call(source, canonical) ? source[canonical] : "";
    }), nextRow = Math.max(sh.getLastRow(), 1) + 1;
    return sh.getRange(nextRow, 1, 1, row.length).setValues([
        row
    ]), _afterSheetWrite_(sheetName, {
        operation: "appendSheetObject_", rows: 1
    }), row;
}
function _asBooleanDeleted_(value) {
    if (value === !0)
        return !0;
    var s = String(value || "").trim().toLowerCase();
    return s === "true" || s === "y" || s === "yes" || s === "1";
}
function _ensureTimestampValue_(value) {
    return value || new Date;
}
function _canonicalizeSubcommitteeRecord_(row) {
    row = row || {};
    var rawStatus = String(row.status || row.Active || row.active || "").trim(), status = rawStatus;
    status || (status = String(row.isDeleted || "").trim() ? "ยกเลิก" : "ใช้งาน"), /^(y|yes|true|1)$/i.test(rawStatus) && (status = "ใช้งาน"), /^(n|no|false|0)$/i.test(rawStatus) && (status = "ยกเลิก");
    var appointmentDate = row.appointmentDate || row.appointedDate || row.วันแต่งตั้ง || row.วันที่แต่งตั้ง || "", startDate = row.dutyStartDate || row.startDate || row.startWorkingDate || row.effectiveDate || row.วันเริ่มทำหน้าที่ || row.วันที่เริ่มทำหน้าที่ || appointmentDate || "", endDate = row.endDate || row.finishDate || row.expireDate || row.วันสิ้นสุด || row.วันที่สิ้นสุด || "", activeDays = _appIsFnName_("_subcommitteeActiveDays_") ? _subcommitteeActiveDays_(startDate, endDate) : Number(row.activeDays || 0) || 0;
    return sanitizeRow_({
        id: row.id || row.SubcommitteeId || row.subcommitteeId || "", name: row.name || row.Name || "", status, appointmentDate: appointmentDate || startDate, dutyStartDate: startDate, startDate, endDate, activeDays, dueDays: row.dueDays || row.จำนวนวันครบกำหนด || "", dueDate: row.dueDate || row.deadline || row.วันครบกำหนด || "", extensionDays: row.extensionDays || row.extendDays || row.ขยายระยะเวลา || "", totalExtensionDays: row.totalExtensionDays || row.totalExtendDays || row.รวมวันขยาย || "", extendedDueDate: row.extendedDueDate || row.finalDueDate || row.latestDueDate || row.วันครบกำหนดหลังขยาย || "", extensionHistory: row.extensionHistory || row.ประวัติการขยายเวลา || "", remark: row.remark || row.SortNo || row.sortNo || "", updatedAt: _ensureTimestampValue_(row.updatedAt || row.UpdatedAt), isDeleted: _asBooleanDeleted_(row.isDeleted) || status === "ยกเลิก", deletedAt: row.deletedAt || (_asBooleanDeleted_(row.isDeleted) || status === "ยกเลิก" ? _ensureTimestampValue_(row.deletedAt) : "")
    });
}
function _canonicalizeBudgetImportRecord_(row) {
    var payloadJson = (row = row || {}).payloadJson || row.payloadJSON || "", visitJson = row.visitLocationsJson || row.visitLocationsJSON || "", seminarJson = row.seminarLocationsJson || row.seminarLocationsJSON || "", countriesJson = row.countriesJson || row.countriesJSON || "";
    return sanitizeRow_(Object.assign({}, row, {
        id: row.id || row.budgetImportId || "", payloadJson, payloadJSON: payloadJson, visitLocationsJson: visitJson, visitLocationsJSON: visitJson, seminarLocationsJson: seminarJson, seminarLocationsJSON: seminarJson, countriesJson, countriesJSON: countriesJson, category: row.category || "", item: row.item || "", supportCost: row.supportCost || "", visitLocationsText: row.visitLocationsText || row.visitLocations || "", seminarLocationsText: row.seminarLocationsText || row.seminarLocations || "", createdAt: row.createdAt || new Date, updatedAt: _ensureTimestampValue_(row.updatedAt), isDeleted: _asBooleanDeleted_(row.isDeleted), deletedAt: row.deletedAt || (_asBooleanDeleted_(row.isDeleted) ? _ensureTimestampValue_(row.deletedAt) : "")
    }));
}
function _canonicalizeMainDataRecord_(row) {
    row = row || {};
    var pick = AppBackendCore && AppBackendCore.makePickNormalized ? AppBackendCore.makePickNormalized(row, "") : function () {
        return "";
    }, receiveDate = pick([
        "recDate", "receiveDate", "receivedDate", "dateReceived", "dateReceive", "receiptDate", "registrationDate", "caseReceiveDate", "caseRecDate", "petitionReceiveDate", "complaintReceiveDate", "documentReceiveDate", "MainData.recDate", "MainData/recDate", "MainData_recDate", "mainData.recDate", "mainData/recDate", "mainData_recDate", "วันที่รับเรื่อง", "วันที่รับ", "วันรับเรื่อง", "วันรับ", "รับเรื่องวันที่", "วันที่ลงรับ", "วันที่ลงทะเบียนรับ", "วันที่รับคำร้อง", "วันที่รับหนังสือ", "วันเดือนปีที่รับ", "วันเดือนปีรับ", "รับวันที่", "วันที่รับเรื่องร้องเรียน"
    ]), title = String(pick([
        "title", "caseTitle", "subject", "เรื่อง", "ชื่อเรื่อง"
    ]) || "").trim(), cat = String(pick([
        "cat", "caseType", "category", "ประเภทเรื่อง", "ประเภท"
    ]) || "").trim(), subCat = String(pick([
        "subCat", "subCategory", "issue", "topic", "topicName", "considerIssue", "caseIssue", "ประเด็นพิจารณา", "ประเด็น"
    ]) || "").trim(), respondent = String(pick([
        "respondent", "agencyName", "accusedAgency", "accused", "agency", "หน่วยงาน / ผู้ถูกร้อง", "หน่วยงาน/ผู้ถูกร้อง", "ผู้ถูกร้อง", "หน่วยงาน"
    ]) || "").trim(), assignees = String(pick([
        "assignees", "owner", "responsibleCommissioners", "responsibleComm", "committeeOwner", "responsibleCommittee", "กมธ.รับผิดชอบ", "กมธ. รับผิดชอบ", "กรรมาธิการรับผิดชอบ", "คณะกรรมาธิการรับผิดชอบ", "ผู้รับผิดชอบ", "ผู้รับผิดชอบหลัก"
    ]) || "").trim(), coAssignees = String(pick([
        "coAssignees", "coAssignee", "coOwners", "coResponsible", "ผู้รับผิดชอบร่วม", "ผู้ร่วมรับผิดชอบ"
    ]) || "").trim(), staffs = String(pick([
        "staffs", "secretariatOfficer", "operationOfficer", "opStaff", "operator", "responsibleOfficer", "operationStaff", "staff", "officer", "เจ้าหน้าที่ฝ่ายเลขานุการ", "เจ้าหน้าที่ฝ่ายเลขานุการ"
    ]) || "").trim();
    return sanitizeRow_(Object.assign({}, row, {
        caseId: row.caseId || row.id || "", createdAt: row.createdAt || new Date, updatedAt: _ensureTimestampValue_(row.updatedAt), meetingStatus: row.meetingStatus || "", isDeleted: _asBooleanDeleted_(row.isDeleted), deletedAt: row.deletedAt || (_asBooleanDeleted_(row.isDeleted) ? _ensureTimestampValue_(row.deletedAt) : ""), keySummary: row.keySummary || "", recDate: row.recDate || receiveDate || "", receiveDate: row.receiveDate || receiveDate || "", receivedDate: row.receivedDate || receiveDate || "", dateReceived: row.dateReceived || receiveDate || "", owner: assignees || row.owner || "", responsibleCommissioners: assignees || row.responsibleCommissioners || "", subcommittee: row.subcommittee || "", dueDate: row.dueDate || "", title, caseTitle: row.caseTitle || title, subject: row.subject || title, cat, caseType: row.caseType || cat, subCat, subCategory: row.subCategory || subCat, issue: row.issue || subCat, topic: subCat, respondent, agencyName: row.agencyName || respondent, accusedAgency: row.accusedAgency || respondent, assignees, coAssignees, staffs, secretariatOfficer: row.secretariatOfficer || staffs, operationOfficer: row.operationOfficer || staffs
    }));
}
function _canonicalizeSheetRecord_(sheetName, row) {
    return sheetName === "Subcommittees" ? _canonicalizeSubcommitteeRecord_(row) : sheetName === "BudgetImports" ? _canonicalizeBudgetImportRecord_(row) : sheetName === "MainData" ? _canonicalizeMainDataRecord_(row) : sanitizeRow_(row || {});
}
function _normalizedText_(value) {
    return String(value == null ? "" : value).replace(/[​-‍\uFEFF]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}
function _caseIdentityKey_(row) {
    return row = row || {}, [
        String(row.caseId || row.id || "").trim(), String(row.caseNum || "").trim(), String(row.recNo || "").trim(), _normalizedText_(row.title || row.caseTitle || ""), _normalizedText_(row.petitioners || row.petitionerName || "")
    ].join("|");
}
function _rowFreshnessScore_(row) {
    return row = row || {}, [
        String(row.updatedAt || row.modifiedAt || row.timestamp || "").trim(), String(row.createdAt || row.date || row.meetingDate || row.letterDate || "").trim(), String(row.caseId || row.logId || row.letterId || row.id || "").trim()
    ].join("|");
}
function _dedupeLatestRowsBy_(rows, keyFn) {
    rows = Array.isArray(rows) ? rows.slice() : [];
    var map = {};
    return rows.forEach(function (row) {
        if (row && !isSoftDeletedRow_(row)) {
            var key = "";
            try {
                key = String((typeof keyFn == "function" ? keyFn(row) : "") || "").trim();
            }
            catch (_eKey) {
                _recordWarning_("ec", _eKey), key = "";
            }
            key || (key = String(row.caseId || row.logId || row.letterId || row.id || JSON.stringify(row)));
            var current = map[key], rowScore, curScore;
            if (!current)
                return map[key] = row, void 0;
            _rowFreshnessScore_(row) >= _rowFreshnessScore_(current) && (map[key] = row);
        }
    }), Object.keys(map).map(function (key) {
        return map[key];
    });
}
function rewriteSheetObjectsCanonical_(sheetName, rows) {
    var sh = getSheet_(sheetName), audit = getCanonicalHeaderAudit_(sheetName);
    if (audit.missing.length)
        throw new Error("ชีต " + sheetName + " ยังไม่เป็น canonical: " + audit.missing.join(", "));
    var headers = _sheetHeaders_(sheetName), lastRow = sh.getLastRow();
    lastRow > 1 && sh.getRange(2, 1, lastRow - 1, headers.length).clearContent();
    var sourceRows, normalized = (rows || readSheetObjects_(sheetName, {
        includeDeleted: !0
    })).map(function (row) {
        var obj = _canonicalizeSheetRecord_(sheetName, row || {});
        return headers.map(function (h) {
            return Object.prototype.hasOwnProperty.call(obj, h) ? obj[h] : "";
        });
    });
    return normalized.length && sh.getRange(2, 1, normalized.length, headers.length).setValues(normalized), _afterSheetWrite_(sheetName, {
        operation: "rewriteSheetObjectsCanonical_", rows: normalized.length, flush: !0
    }), normalized.length;
}
function _systemDateParseMetaForAudit_(value) {
    if (value == null || value === "")
        return {
            valid: !0, empty: !0, date: null, reason: "empty"
        };
    if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime()))
        return {
            valid: !0, date: value, reason: "date-object"
        };
    if (typeof value == "number" && isFinite(value))
        return value > 3e4 && value < 7e4 ? {
            valid: !0, date: new Date(Math.round(86400 * (value - 25569) * 1e3)), reason: "excel-serial"
        } : {
            valid: !1, date: null, reason: "numeric-date-out-of-range"
        };
    var raw = String(value || "").trim();
    if (!raw)
        return {
            valid: !0, empty: !0, date: null, reason: "empty"
        };
    if (/^\d+(?:\.\d+)?$/.test(raw)) {
        var numeric = Number(raw);
        return numeric > 3e4 && numeric < 7e4 ? {
            valid: !0, date: new Date(Math.round(86400 * (numeric - 25569) * 1e3)), reason: "excel-serial-string"
        } : {
            valid: !1, date: null, reason: "numeric-date-out-of-range"
        };
    }
    var iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) {
        var y = Number(iso[1]);
        y > 2400 && (y -= 543);
        var dIso = new Date(y, Number(iso[2]) - 1, Number(iso[3]));
        return isNaN(dIso.getTime()) ? {
            valid: !1, date: null, reason: "invalid-iso"
        } : {
            valid: !0, date: dIso, reason: "iso"
        };
    }
    var dmy = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
    if (dmy) {
        var yy = Number(dmy[3]);
        yy < 100 && (yy += 2500), yy > 2400 && (yy -= 543);
        var dDmy = new Date(yy, Number(dmy[2]) - 1, Number(dmy[1]));
        return isNaN(dDmy.getTime()) ? {
            valid: !1, date: null, reason: "invalid-dmy"
        } : {
            valid: !0, date: dDmy, reason: "dmy"
        };
    }
    var parsed = new Date(raw);
    return isNaN(parsed.getTime()) ? {
        valid: !1, date: null, reason: "unparseable"
    } : {
        valid: !0, date: parsed, reason: "date-parse"
    };
}
function updateSheetObjectByKey_(sheetName, keyField, keyValue, patchObj) {
    var sh = getSheet_(sheetName), audit = getCanonicalHeaderAudit_(sheetName);
    if (audit.missing.length)
        throw new Error("ชีต " + sheetName + " ยังไม่เป็น canonical: " + audit.missing.join(", "));
    var headers = _sheetHeaders_(sheetName);
    if (!headers.length)
        return !1;
    var map = _canonicalHeaderIndexMap_(sheetName, headers), keyIndex = map[keyField] !== void 0 ? map[keyField] : map[_normalizedHeaderKey_(keyField)];
    if (keyIndex === void 0)
        return !1;
    var rowNumber = _i3FindRowNumberByKey_(sheetName, keyField, keyValue, keyIndex, {
        headers, headerMap: map, forceFresh: !0
    });
    if (!rowNumber)
        return !1;
    var width = Math.max(headers.length, Number(sh.getLastColumn && sh.getLastColumn()) || headers.length || 1), row = sh.getRange(rowNumber, 1, 1, width).getValues()[0] || [];
    return Object.keys(patchObj || {}).forEach(function (k) {
        var idx = map[k];
        idx === void 0 && (idx = map[_normalizedHeaderKey_(k)]), idx !== void 0 && idx < width && (row[idx] = patchObj[k]);
    }), sh.getRange(rowNumber, 1, 1, width).setValues([
        row.slice(0, width)
    ]), _afterSheetWrite_(sheetName, {
        operation: "updateSheetObjectByKey_", rows: 1
    }), !0;
}
function softDeleteSheetObjectByKey_(sheetName, keyField, keyValue, patchObj) {
    var basePatch = {
        isDeleted: !0, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    return updateSheetObjectByKey_(sheetName, keyField, keyValue, Object.assign(basePatch, patchObj || {}));
}
AppRepositoryRegistry.registerSystemMethod("listSpecs", function () {
    var specs = _canonicalRepositorySpecs_();
    return Object.keys(specs).map(function (key) {
        var spec = specs[key] || {};
        return {
            name: key, domain: spec.domain || "", sheetName: spec.sheetName || "", keyField: spec.keyField || "", createdAtField: Object.prototype.hasOwnProperty.call(spec, "createdAtField") ? spec.createdAtField : "createdAt", updatedAtField: Object.prototype.hasOwnProperty.call(spec, "updatedAtField") ? spec.updatedAtField : "updatedAt", requireCanonical: spec.requireCanonical === !0
        };
    });
}, { owner: "Code_01_Platform_SheetRepo:canonical-spec-list" });
AppRepositoryRegistry.registerSystemMethod("get", function (nameOrAlias) {
    return getCanonicalRepository_(nameOrAlias);
}, { owner: "Code_01_Platform_SheetRepo:canonical-sheet-repository-resolver" });
AppRepositoryRegistry.registerSystemMethod("getSpec", function (nameOrAlias) {
    return _getCanonicalRepositorySpec_(nameOrAlias);
}, { owner: "Code_01_Platform_SheetRepo:canonical-spec-resolver" });
var _CACHE_TTL_DATA_ = 300, _CACHE_TTL_GEMINI_ = 900;
function getSheetRepositoryPerformancePolicy_() {
    return {
        stamp: "sheet-repository-indexed-hot-path-r225", owner: "Code_01_Platform_SheetRepo/readRepositoryRows_", defaultTtlSeconds: 240, maxTtlSeconds: 600, requestScopeCache: !0, scriptCache: !0, projectedColumns: !0, boundedSparseSpans: !0, indexedExactKeyReads: !0, batchSizeAliasSupported: !0, selectorFallbackExplicitOnly: !0, maxColumnSpans: 4, fullMatrixDefault: !1, metrics: [
            "rowsRead", "cellsRead", "serviceReads", "projectedColumnsRead", "fullWidthColumnsAvoided", "cacheHit", "durationMs", "sheetName", "fieldCount"
        ]
    };
}
function _repositoryNormalizeFieldList_(fields) {
    var seen = {};
    return (Array.isArray(fields) ? fields : []).map(function (f) {
        return String(f || "").trim();
    }).filter(function (f) {
        return !(!f || seen[f]) && (seen[f] = !0, !0);
    });
}
var APP_REPOSITORY_HOT_PATH_CURRENT = Object.freeze({
    stamp: "repository-indexed-row-selection-2026-08-06-r225",
    owner: "Code_01_Platform_SheetRepo.IndexedRowSelection",
    policy: "exact-key reads use the cached key-column index and fetch only matching projected body rows; legacy or incomplete key coverage may explicitly fall back to the canonical full projected read",
    maxSelectorValues: 250,
    batchSizeAliasSupported: !0,
    requestScopeCache: !0,
    scriptIndexCache: !0,
    uiDomChanged: !1,
    businessLogicChanged: !1,
    dataMigration: !1
});
function _repositorySelectionNormalizeValue_(value) {
    return String(value == null ? "" : value)
        .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, "")
        .replace(/^'+/, "")
        .replace(/\s+/g, " ")
        .trim();
}
function _repositorySelectionValues_(values) {
    var seen = {}, max = Number(APP_REPOSITORY_HOT_PATH_CURRENT.maxSelectorValues || 250) || 250;
    values = Array.isArray(values) ? values : values == null || values === "" ? [] : [values];
    return values.map(_repositorySelectionNormalizeValue_).filter(function (value) {
        return !!value && !seen[value] && (seen[value] = !0, !0);
    }).slice(0, max);
}
function _repositoryProjectedSelectionSeed_(opts) {
    opts = opts || {};
    var keyField = String(opts.selectKeyField || opts.keyField || "").trim(), keyValues = _repositorySelectionValues_(opts.selectKeyValues != null ? opts.selectKeyValues : opts.keyValues), rowNumbers = (Array.isArray(opts.selectRowNumbers) ? opts.selectRowNumbers : []).map(function (row) {
        return Math.floor(Number(row || 0) || 0);
    }).filter(function (row, index, list) {
        return row >= 2 && list.indexOf(row) === index;
    }).sort(function (a, b) { return a - b; });
    return {
        requested: !!(rowNumbers.length || keyField && keyValues.length),
        mode: String(opts.selectionMode || (rowNumbers.length ? "explicit-row-numbers" : keyField && keyValues.length ? "exact-key" : "full-projection")),
        keyField: keyField,
        keyValues: keyValues,
        rowNumbers: rowNumbers,
        fallbackOnEmpty: opts.selectionFallbackOnEmpty === !0
    };
}
function _repositoryContiguousRowSpans_(rowNumbers) {
    var spans = [];
    (Array.isArray(rowNumbers) ? rowNumbers : []).forEach(function (row) {
        row = Math.floor(Number(row || 0) || 0);
        if (row < 2)
            return;
        var last = spans.length ? spans[spans.length - 1] : null;
        last && row === last.end + 1 ? last.end = row : spans.push({ start: row, end: row });
    });
    return spans;
}
function _repositoryResolveProjectedSelection_(sheetName, selection, lastRow, keyIndex, opts) {
    selection = selection || { requested: !1 };
    opts = opts || {};
    var result = {
        requested: selection.requested === !0,
        active: !1,
        mode: String(selection.mode || "full-projection"),
        keyField: String(selection.keyField || ""),
        keyValues: (selection.keyValues || []).slice(),
        rowNumbers: [],
        missingValues: [],
        fallbackOnEmpty: selection.fallbackOnEmpty === !0,
        fallbackUsed: !1,
        indexCacheHit: !1,
        indexRowsRead: 0,
        indexServiceReads: 0,
        indexMode: "none"
    };
    if (!result.requested)
        return result;
    if (selection.rowNumbers && selection.rowNumbers.length) {
        result.rowNumbers = selection.rowNumbers.filter(function (row) { return row >= 2 && row <= lastRow; });
        result.active = result.rowNumbers.length > 0;
        result.mode = "explicit-row-numbers";
    }
    else if (result.keyField && result.keyValues.length && keyIndex >= 0) {
        var idx = _i3SheetRowMultiIndexByKey_(sheetName, result.keyField, keyIndex, {
            forceFresh: opts.forceFresh === !0,
            bypassRequestCache: opts.bypassRequestCache === !0,
            allowScriptCache: opts.allowIndexScriptCache !== !1,
            cacheTtlSeconds: opts.indexCacheTtlSeconds || opts.ttl || 180,
            readBatchRows: opts.readBatchRows || opts.batchSize || 0,
            targetCellsPerRead: opts.targetCellsPerRead || 0
        }), normalizedMap = {}, rowsSeen = {};
        result.indexCacheHit = !!(idx && idx.cacheHit);
        result.indexRowsRead = result.indexCacheHit ? 0 : Number(idx && idx.rowCount || 0) || 0;
        result.indexServiceReads = Number(idx && idx.serviceReads || 0) || 0;
        result.indexMode = String(idx && idx.mode || "unavailable");
        Object.keys(idx && idx.map || {}).forEach(function (rawKey) {
            var normalized = _repositorySelectionNormalizeValue_(rawKey), rows = Array.isArray(idx.map[rawKey]) ? idx.map[rawKey] : [idx.map[rawKey]];
            if (!normalized)
                return;
            normalizedMap[normalized] = (normalizedMap[normalized] || []).concat(rows);
        });
        result.keyValues.forEach(function (value) {
            var rows = idx && idx.map && idx.map[value] || normalizedMap[_repositorySelectionNormalizeValue_(value)] || [];
            rows = Array.isArray(rows) ? rows : [rows];
            var matched = !1;
            rows.forEach(function (row) {
                row = Number(row || 0) || 0;
                row >= 2 && row <= lastRow && !rowsSeen[row] && (rowsSeen[row] = !0, result.rowNumbers.push(row), matched = !0);
            });
            matched || result.missingValues.push(value);
        });
        result.active = result.rowNumbers.length > 0;
    }
    if (!result.active && result.fallbackOnEmpty)
        result.fallbackUsed = !0;
    return result;
}
function _repositoryAttachMeta_(rows, meta) {
    rows = Array.isArray(rows) ? rows : [];
    try {
        rows.__repositoryMeta = meta || {};
    }
    catch (_e) {
        _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _e) : _appIsFnName_("_logWarn_") && _logWarn_("ec", {
            error: String(_e && _e.message || _e)
        });
    }
    return rows;
}
function readRepositoryRows_(sheetName, fields, opts) {
    opts = opts || {};
    var started = Date.now();
    sheetName = String(sheetName || "").trim(), fields = _repositoryNormalizeFieldList_(fields);
    var policy = getSheetRepositoryPerformancePolicy_(), ttl = opts.forceFresh === !0 ? 0 : Math.max(0, Math.min(Number(opts.ttl != null ? opts.ttl : policy.defaultTtlSeconds) || 0, Number(policy.maxTtlSeconds) || 600)), before = {};
    try {
        before = typeof getRequestScopeMetrics_ == "function" ? getRequestScopeMetrics_() : {};
    }
    catch (_m0) {
        before = {};
    }
    var rows = [];
    rows = fields.length && typeof readSheetProjectedObjectsCached_ == "function" ? readSheetProjectedObjectsCached_(sheetName, fields, {
        includeDeleted: opts.includeDeleted === !0, requireCanonical: opts.requireCanonical === !0, ttl, forceFresh: opts.forceFresh === !0, bypassRequestCache: opts.bypassRequestCache === !0, sparseRead: opts.sparseRead === !0, projectedReadMode: opts.projectedReadMode || "", maxColumnSpans: opts.maxColumnSpans || 4, projectionPlan: opts.projectionPlan || "", projectionPlanFields: opts.projectionPlanFields || [], selectKeyField: opts.selectKeyField || opts.keyField || "", selectKeyValues: opts.selectKeyValues != null ? opts.selectKeyValues : opts.keyValues, selectRowNumbers: opts.selectRowNumbers || [], selectionMode: opts.selectionMode || "", selectionFallbackOnEmpty: opts.selectionFallbackOnEmpty === !0, indexCacheTtlSeconds: opts.indexCacheTtlSeconds || 0, batchSize: opts.batchSize || 0, readBatchRows: opts.readBatchRows || 0
    }) || [] : typeof readSheetObjectsCached_ == "function" ? readSheetObjectsCached_(sheetName, {
        includeDeleted: opts.includeDeleted === !0, requireCanonical: opts.requireCanonical === !0
    }) || [] : readSheetObjects_(sheetName, {
        includeDeleted: opts.includeDeleted === !0, requireCanonical: opts.requireCanonical === !0
    }) || [];
    var after = {}, meta;
    try {
        after = typeof getRequestScopeMetrics_ == "function" ? getRequestScopeMetrics_() : {};
    }
    catch (_m1) {
        after = {};
    }
    return _repositoryAttachMeta_(rows, {
        stamp: policy.stamp, sheetName, owner: String(opts.owner || "repository"), projected: !!fields.length, fieldCount: fields.length, ttlSeconds: ttl, rowsReturned: rows.length, rowsReadDelta: Math.max(0, Number(after.rowsRead || 0) - Number(before.rowsRead || 0)), cacheHitDelta: Math.max(0, Number(after.cacheHits || 0) - Number(before.cacheHits || 0)), cacheMissDelta: Math.max(0, Number(after.cacheMisses || 0) - Number(before.cacheMisses || 0)), durationMs: Math.max(0, Date.now() - started), projectionPlan: String(opts.projectionPlan || ""), projectionPlanHit: !!(rows && rows.__projectionMeta && rows.__projectionMeta.projectionPlanHit), authoritativeEmpty: !!(rows && rows.__projectionMeta && rows.__projectionMeta.authoritativeEmpty), selection: rows && rows.__projectionMeta ? Object.assign({}, rows.__projectionMeta.selection || {}) : _repositoryProjectedSelectionSeed_(opts)
    });
}

/* Canonical implementation lives in Code_05_Repository_Cache_Performance.gs. */

/* Canonical implementation lives in Code_09_Repository_Maintenance_Batch.gs. */
