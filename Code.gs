// Google Sheet ฐานข้อมูลหลัก
const SPREADSHEET_ID = "1iz9PYJHey4Zhry5DHEE1AQK-jco0cDcWe4PdFFwRG9U";
const PUBLIC_API_VERSION = '1';
const PUBLIC_JSONP_CALLBACK_MAX_LENGTH = 128;
const PUBLIC_REC_NO_MAX_LENGTH = 80;
const DASHBOARD_CACHE_TTL_SECONDS = 60;
const DASHBOARD_READ_COLUMN_COUNT = 9;
const DASHBOARD_CACHE_KEY = 'dashboard:v' + PUBLIC_API_VERSION + ':' + SPREADSHEET_ID;
const SEARCH_CACHE_TTL_SECONDS = 60;
const SEARCH_CACHE_KEY_PREFIX = 'search:v' + PUBLIC_API_VERSION + ':' + SPREADSHEET_ID + ':';
const SEARCH_CACHE_GENERATION_PROPERTY = 'SEARCH_CACHE_GENERATION';
const SEARCH_CACHE_GENERATION_KEY = 'search:cache-generation';
const SEARCH_CACHE_GENERATION_TTL_SECONDS = 21600;
const SEARCH_CASE_COLUMN_COUNT = 18;
const SEARCH_RECNO_COLUMN = 4;
const MEETING_CASE_ID_COLUMN = 1;
const MEETING_DATA_START_COLUMN = 2;
const MEETING_DATA_COLUMN_COUNT = 2;
const PERFORMANCE_LOG_PREFIX = '[PERF]';

const STATUS_GROUP_NEW = 'new';
const STATUS_GROUP_IN_PROGRESS = 'inProgress';
const STATUS_GROUP_COMPLETED = 'completed';
const STATUS_GROUP_OTHER = 'other';

/**
 * Single canonical GET entrypoint.
 *
 * - ไม่มี action: แสดงหน้า GAS เดิม
 * - action=dashboard: ส่ง JSONP dashboard contract
 * - action=search: ส่ง JSONP search contract
 */
function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const action = cleanText_(params.action).toLowerCase();

  if (!action) {
    return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('สืบค้นสถานะเรื่องพิจารณา - คณะกรรมาธิการ ป.ป.ช.')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  const requestId = createRequestId_();
  const callbackName = cleanText_(params.callback);

  // Reject malformed callback before touching Spreadsheet.
  if (!isValidJsonpCallback_(callbackName)) {
    return jsonpResponse_(callbackName, makeApiEnvelope_(false, requestId, {
      code: 'INVALID_CALLBACK',
      msg: 'รูปแบบ callback ไม่ถูกต้อง'
    }));
  }

  const requestedVersion = cleanText_(params.v);
  if (requestedVersion !== PUBLIC_API_VERSION) {
    return jsonpResponse_(callbackName, makeApiEnvelope_(false, requestId, {
      code: 'API_VERSION_MISMATCH',
      msg: 'เวอร์ชัน API ระหว่าง GitHub และ GAS ไม่ตรงกัน',
      expectedVersion: PUBLIC_API_VERSION
    }));
  }

  try {
    let payload;

    switch (action) {
      case 'dashboard':
        payload = apiDashboard_(params, requestId);
        break;
      case 'search':
        payload = apiSearch_(params, requestId);
        break;
      default:
        payload = makeApiEnvelope_(false, requestId, {
          code: 'ACTION_NOT_SUPPORTED',
          msg: 'ไม่รองรับคำสั่งที่ร้องขอ'
        });
        break;
    }

    return jsonpResponse_(callbackName, payload);
  } catch (error) {
    console.error('[PUBLIC_API][' + requestId + '] ' + (error && error.stack ? error.stack : error));
    return jsonpResponse_(callbackName, makeApiEnvelope_(false, requestId, {
      code: 'INTERNAL_ERROR',
      msg: 'ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง'
    }));
  }
}

function apiDashboard_(params, requestId) {
  const startedAt = Date.now();
  const snapshot = getDashboardSnapshot_();
  const durationMs = elapsedMs_(startedAt);

  if (!snapshot.ok) {
    logPerformance_({
      action: 'dashboard',
      requestId: requestId,
      ok: false,
      cacheHit: false,
      durationMs: durationMs
    });
    return makeApiEnvelope_(false, requestId, {
      code: snapshot.code || 'DASHBOARD_READ_FAILED',
      msg: snapshot.msg || 'ไม่สามารถโหลดข้อมูล Dashboard ได้',
      meta: {
        cacheHit: false,
        cacheTtlSeconds: DASHBOARD_CACHE_TTL_SECONDS,
        durationMs: durationMs
      }
    });
  }

  const payload = makeApiEnvelope_(true, requestId, {
    data: {
      counts: snapshot.counts
    },
    meta: {
      cacheHit: snapshot.cacheHit === true,
      generatedAt: snapshot.generatedAt || '',
      cacheTtlSeconds: DASHBOARD_CACHE_TTL_SECONDS,
      durationMs: durationMs
    }
  });

  logPerformance_({
    action: 'dashboard',
    requestId: requestId,
    ok: true,
    cacheHit: snapshot.cacheHit === true,
    durationMs: durationMs
  });
  return payload;
}

/**
 * P1-B Dashboard hot path.
 * Cache hit returns without opening Spreadsheet. Cache miss reads only A:I,
 * which preserves the original A/D/I business rules without scanning all columns.
 */
function getDashboardSnapshot_() {
  const cache = CacheService.getScriptCache();
  const cached = readDashboardCache_(cache);
  if (cached) {
    return {
      ok: true,
      counts: cached.counts,
      generatedAt: cached.generatedAt,
      cacheHit: true
    };
  }

  const fresh = computeDashboardCounts_();
  if (!fresh.ok) {
    return fresh;
  }

  const snapshot = {
    counts: fresh.counts,
    generatedAt: new Date().toISOString()
  };

  try {
    cache.put(DASHBOARD_CACHE_KEY, JSON.stringify(snapshot), DASHBOARD_CACHE_TTL_SECONDS);
  } catch (error) {
    console.warn('[DashboardCache] put failed: ' + (error && error.message ? error.message : error));
  }

  return {
    ok: true,
    counts: snapshot.counts,
    generatedAt: snapshot.generatedAt,
    cacheHit: false
  };
}

function readDashboardCache_(cache) {
  try {
    const raw = cache.get(DASHBOARD_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !isDashboardCountsValid_(parsed.counts)) {
      cache.remove(DASHBOARD_CACHE_KEY);
      return null;
    }

    return {
      counts: parsed.counts,
      generatedAt: cleanText_(parsed.generatedAt)
    };
  } catch (error) {
    try {
      cache.remove(DASHBOARD_CACHE_KEY);
    } catch (ignore) {}
    return null;
  }
}

function computeDashboardCounts_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName('MainData');

  if (!mainSheet) {
    return {
      ok: false,
      code: 'MAIN_DATA_NOT_FOUND',
      msg: 'ไม่พบฐานข้อมูล MainData'
    };
  }

  const counts = {
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
    users: 0
  };
  const lastRow = mainSheet.getLastRow();

  if (lastRow < 2) {
    return { ok: true, counts: counts };
  }

  const data = mainSheet.getRange(2, 1, lastRow - 1, DASHBOARD_READ_COLUMN_COUNT).getValues();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const caseId = cleanText_(row[0]);
    const recNo = normalizeRecNo_(row[3]);

    if (!caseId && !recNo) {
      continue;
    }

    counts.total += 1;

    const statusGroup = getStatusGroup_(normalizeCaseStatus_(row[8]));
    if (statusGroup === STATUS_GROUP_NEW) {
      counts.new += 1;
    } else if (statusGroup === STATUS_GROUP_IN_PROGRESS) {
      counts.inProgress += 1;
    } else if (statusGroup === STATUS_GROUP_COMPLETED) {
      counts.completed += 1;
    }
  }

  return { ok: true, counts: counts };
}

function isDashboardCountsValid_(counts) {
  if (!counts || typeof counts !== 'object') return false;

  const keys = ['total', 'new', 'inProgress', 'completed', 'users'];
  return keys.every(function (key) {
    return typeof counts[key] === 'number'
      && isFinite(counts[key])
      && counts[key] >= 0;
  });
}

function apiSearch_(params, requestId) {
  const startedAt = Date.now();
  const recNo = cleanText_(params.recNo);

  if (!isValidRecNoInput_(recNo)) {
    const invalidDurationMs = elapsedMs_(startedAt);
    logPerformance_({
      action: 'search',
      requestId: requestId,
      ok: false,
      found: false,
      cacheHit: false,
      durationMs: invalidDurationMs,
      outcome: 'invalid-input'
    });
    return makeApiEnvelope_(false, requestId, {
      code: 'INVALID_REC_NO',
      msg: 'เลขรับเรื่องไม่ถูกต้อง',
      meta: {
        cacheHit: false,
        cacheTtlSeconds: SEARCH_CACHE_TTL_SECONDS,
        durationMs: invalidDurationMs,
        source: 'validation'
      }
    });
  }

  const diagnostics = {};
  const result = searchByRecNo(recNo, diagnostics);
  const durationMs = elapsedMs_(startedAt);
  const meta = {
    cacheHit: diagnostics.searchCacheHit === true,
    cacheTtlSeconds: SEARCH_CACHE_TTL_SECONDS,
    durationMs: durationMs,
    source: diagnostics.searchCacheHit === true ? 'cache' : 'fresh'
  };
  let payload;

  if (!result || !result.found) {
    const isNotFound = result && result.msg === 'ไม่มีเลขรับเรื่องดังกล่าว';

    if (isNotFound) {
      payload = makeApiEnvelope_(true, requestId, {
        found: false,
        msg: result.msg,
        meta: meta
      });
    } else {
      payload = makeApiEnvelope_(false, requestId, {
        code: 'SEARCH_FAILED',
        msg: result && result.msg ? result.msg : 'ไม่สามารถค้นหาข้อมูลได้',
        meta: meta
      });
    }
  } else {
    payload = makeApiEnvelope_(true, requestId, {
      found: true,
      data: result.data,
      meta: meta
    });
  }

  logPerformance_({
    action: 'search',
    requestId: requestId,
    ok: payload.ok === true,
    found: payload.found === true,
    cacheHit: diagnostics.searchCacheHit === true,
    durationMs: durationMs,
    cacheLookupMs: numberOrZero_(diagnostics.cacheLookupMs),
    freshDurationMs: numberOrZero_(diagnostics.freshDurationMs),
    mainLookup: cleanText_(diagnostics.mainLookup),
    mainLookupMs: numberOrZero_(diagnostics.mainLookupMs),
    meetingLookup: cleanText_(diagnostics.meetingLookup),
    meetingLookupMs: numberOrZero_(diagnostics.meetingLookupMs)
  });
  return payload;
}

function makeApiEnvelope_(ok, requestId, extra) {
  const payload = {
    ok: Boolean(ok),
    apiVersion: PUBLIC_API_VERSION,
    requestId: requestId
  };

  Object.keys(extra || {}).forEach(function (key) {
    payload[key] = extra[key];
  });

  return payload;
}

function jsonpResponse_(callback, payload) {
  const callbackName = cleanText_(callback);

  if (!isValidJsonpCallback_(callbackName)) {
    const fallback = makeApiEnvelope_(false, payload && payload.requestId ? payload.requestId : createRequestId_(), {
      code: 'INVALID_CALLBACK',
      msg: 'รูปแบบ callback ไม่ถูกต้อง'
    });

    return ContentService
      .createTextOutput(JSON.stringify(fallback))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(callbackName + '(' + JSON.stringify(payload) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function isValidJsonpCallback_(value) {
  const callbackName = cleanText_(value);
  return callbackName.length > 0
    && callbackName.length <= PUBLIC_JSONP_CALLBACK_MAX_LENGTH
    && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callbackName);
}

function isValidRecNoInput_(value) {
  const recNo = cleanText_(value);
  return recNo.length > 0
    && recNo.length <= PUBLIC_REC_NO_MAX_LENGTH
    && !/[\u0000-\u001F\u007F<>`"'\\]/.test(recNo);
}

function createRequestId_() {
  return 'REQ-' + Utilities.getUuid().replace(/-/g, '').slice(0, 16).toUpperCase();
}

function elapsedMs_(startedAt) {
  const start = Number(startedAt);
  if (!isFinite(start)) return 0;
  return Math.max(0, Date.now() - start);
}

function numberOrZero_(value) {
  const number = Number(value);
  return isFinite(number) && number >= 0 ? number : 0;
}

function logPerformance_(entry) {
  try {
    console.log(PERFORMANCE_LOG_PREFIX + ' ' + JSON.stringify(entry || {}));
  } catch (ignore) {}
}

function searchByRecNo(inputRecNo, diagnostics) {
  diagnostics = diagnostics || {};
  const startedAt = Date.now();
  const normalizedRecNo = normalizeRecNo_(inputRecNo);
  const cache = CacheService.getScriptCache();
  const cacheKey = getSearchCacheKey_(normalizedRecNo);
  const cacheStartedAt = Date.now();

  try {
    const cached = cache.get(cacheKey);
    diagnostics.cacheLookupMs = elapsedMs_(cacheStartedAt);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.found === true && parsed.data
        && normalizeRecNo_(parsed.data.recNo) === normalizedRecNo) {
        diagnostics.searchCacheHit = true;
        diagnostics.searchDurationMs = elapsedMs_(startedAt);
        return parsed;
      }
      cache.remove(cacheKey);
    }
  } catch (ignore) {
    diagnostics.cacheLookupMs = elapsedMs_(cacheStartedAt);
  }

  diagnostics.searchCacheHit = false;
  const freshStartedAt = Date.now();
  const result = searchByRecNoFresh_(inputRecNo, diagnostics);
  diagnostics.freshDurationMs = elapsedMs_(freshStartedAt);

  // Cache only successful hits. Not-found stays uncached so newly-added cases
  // are visible immediately without waiting for negative-cache expiry.
  if (result && result.found === true && result.data) {
    try {
      cache.put(cacheKey, JSON.stringify(result), SEARCH_CACHE_TTL_SECONDS);
    } catch (error) {
      console.warn('[SearchCache] put failed: ' + (error && error.message ? error.message : error));
    }
  }

  diagnostics.searchDurationMs = elapsedMs_(startedAt);
  return result;
}

function searchByRecNoFresh_(inputRecNo, diagnostics) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const mainSheet = ss.getSheetByName('MainData');
    if (!mainSheet) return { found: false, msg: 'ไม่พบฐานข้อมูล' };

    const targetRecNo = normalizeRecNo_(inputRecNo);
    const mainLookupStartedAt = Date.now();
    const rowNumber = findCaseRowByRecNo_(mainSheet, inputRecNo, diagnostics);
    if (diagnostics) diagnostics.mainLookupMs = elapsedMs_(mainLookupStartedAt);

    if (!rowNumber) {
      return { found: false, msg: 'ไม่มีเลขรับเรื่องดังกล่าว' };
    }

    const row = mainSheet.getRange(rowNumber, 1, 1, SEARCH_CASE_COLUMN_COUNT).getValues()[0];
    const currentRecNo = normalizeRecNo_(row[3]);

    if (currentRecNo !== targetRecNo) {
      return { found: false, msg: 'ไม่มีเลขรับเรื่องดังกล่าว' };
    }

    const originalStatus = cleanText_(row[8]);
    const normalizedStatus = normalizeCaseStatus_(originalStatus);
    const statusGroup = getStatusGroup_(normalizedStatus);
    const agencyName = cleanText_(row[16] || '');
    const reason = cleanText_(row[17] || '');

    const foundCase = {
      caseId: cleanText_(row[0]),
      recNo: currentRecNo,
      recDate: row[5] instanceof Date ? Utilities.formatDate(row[5], 'GMT+7', 'yyyy-MM-dd') : cleanText_(row[5]),
      caseTitle: cleanText_(row[15]) || cleanText_(row[6]),
      originalStatus: originalStatus,
      normalizedStatus: normalizedStatus,
      statusGroup: statusGroup,
      displayStatus: makeDisplayStatus_(normalizedStatus, agencyName, reason)
    };

    if (diagnostics) {
      diagnostics.caseRowNumber = rowNumber;
      diagnostics.caseRowCellsRead = SEARCH_CASE_COLUMN_COUNT;
    }

    const meetingLookupStartedAt = Date.now();
    foundCase.meetings = readMeetingsByCaseId_(ss, foundCase.caseId, diagnostics);
    if (diagnostics) diagnostics.meetingLookupMs = elapsedMs_(meetingLookupStartedAt);
    return { found: true, data: foundCase };

  } catch (e) {
    console.error('[searchByRecNo] ' + (e && e.stack ? e.stack : e));
    return { found: false, msg: 'ไม่สามารถค้นหาข้อมูลได้' };
  }
}

function getSearchCacheKey_(recNo) {
  return SEARCH_CACHE_KEY_PREFIX
    + getSearchCacheGeneration_()
    + ':'
    + normalizeRecNo_(recNo);
}

function getSearchCacheGeneration_() {
  const cache = CacheService.getScriptCache();
  try {
    const cached = Number(cache.get(SEARCH_CACHE_GENERATION_KEY));
    if (isFinite(cached) && cached >= 1) return Math.floor(cached);
  } catch (ignore) {}

  const properties = PropertiesService.getScriptProperties();
  let generation = Number(properties.getProperty(SEARCH_CACHE_GENERATION_PROPERTY));
  if (!isFinite(generation) || generation < 1) {
    generation = 1;
    properties.setProperty(SEARCH_CACHE_GENERATION_PROPERTY, String(generation));
  }

  try {
    cache.put(SEARCH_CACHE_GENERATION_KEY, String(Math.floor(generation)), SEARCH_CACHE_GENERATION_TTL_SECONDS);
  } catch (ignore) {}
  return Math.floor(generation);
}

function invalidateSearchCacheByRecNo_(recNo) {
  const normalizedRecNo = normalizeRecNo_(recNo);
  if (!normalizedRecNo) return false;
  try {
    CacheService.getScriptCache().remove(getSearchCacheKey_(normalizedRecNo));
    return true;
  } catch (error) {
    return false;
  }
}

function invalidateAllSearchCaches_(reason) {
  return advanceSearchCacheGeneration_(reason, false);
}

/**
 * Canonical broad invalidation owner. Call AFTER successful MainData writes,
 * bulk imports, or any write where the affected recNo is not known.
 */
function invalidatePublicDataCaches_(reason) {
  return advanceSearchCacheGeneration_(reason, true);
}

function advanceSearchCacheGeneration_(reason, clearDashboard) {
  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    locked = lock.tryLock(5000);
    if (!locked) return { ok: false, code: 'CACHE_INVALIDATION_LOCK_TIMEOUT' };

    const properties = PropertiesService.getScriptProperties();
    let previous = Number(properties.getProperty(SEARCH_CACHE_GENERATION_PROPERTY));
    if (!isFinite(previous) || previous < 1) previous = 1;
    previous = Math.floor(previous);
    const generation = previous + 1;
    properties.setProperty(SEARCH_CACHE_GENERATION_PROPERTY, String(generation));

    const cache = CacheService.getScriptCache();
    try {
      cache.put(SEARCH_CACHE_GENERATION_KEY, String(generation), SEARCH_CACHE_GENERATION_TTL_SECONDS);
      if (clearDashboard) cache.remove(DASHBOARD_CACHE_KEY);
    } catch (ignore) {}

    return {
      ok: true,
      previousGeneration: previous,
      generation: generation,
      dashboardInvalidated: clearDashboard === true,
      reason: cleanText_(reason)
    };
  } finally {
    if (locked) {
      try { lock.releaseLock(); } catch (ignore) {}
    }
  }
}

/**
 * P1-E single write-path invalidation hook.
 * Call only AFTER the real write owner reports a successful Spreadsheet write.
 *
 * MainData   -> invalidate Dashboard + all Search generations.
 * MeetingLogs with recNo -> invalidate only that Search result.
 * MeetingLogs without recNo -> invalidate all Search generations only.
 */
function afterPublicDataWrite_(writeInfo) {
  const info = writeInfo || {};
  const sheetKey = cleanText_(info.sheetName || info.source).toLowerCase();
  const recNo = normalizeRecNo_(info.recNo);
  const reason = cleanText_(info.reason) || (sheetKey ? sheetKey + ' write' : 'public data write');

  if (sheetKey === 'meetinglogs') {
    if (recNo) {
      const targetedOk = invalidateSearchCacheByRecNo_(recNo);
      return {
        ok: targetedOk,
        scope: 'search-record',
        recNo: recNo,
        reason: reason
      };
    }

    const searchAll = invalidateAllSearchCaches_(reason);
    searchAll.scope = 'search-all';
    return searchAll;
  }

  if (sheetKey === 'maindata') {
    const publicAll = invalidatePublicDataCaches_(reason);
    publicAll.scope = 'public-all';
    return publicAll;
  }

  return {
    ok: false,
    code: 'UNSUPPORTED_WRITE_SOURCE',
    msg: 'รองรับการ invalidate หลังเขียนข้อมูลเฉพาะ MainData หรือ MeetingLogs'
  };
}

/**
 * Fast path: TextFinder searches only MainData column D on the server.
 * Correctness fallback: if legacy formatting prevents an exact match, scan D only
 * and apply the canonical normalizeRecNo_ rule used by the original implementation.
 */
function findCaseRowByRecNo_(mainSheet, inputRecNo, diagnostics) {
  const lastRow = mainSheet.getLastRow();
  if (lastRow < 2) return 0;

  const targetRecNo = normalizeRecNo_(inputRecNo);
  const recNoRange = mainSheet.getRange(2, SEARCH_RECNO_COLUMN, lastRow - 1, 1);
  const candidates = [];
  const rawCandidate = cleanText_(inputRecNo);

  [rawCandidate, targetRecNo].forEach(function (candidate) {
    if (candidate && candidates.indexOf(candidate) < 0) {
      candidates.push(candidate);
    }
  });

  for (let i = 0; i < candidates.length; i++) {
    const match = recNoRange
      .createTextFinder(candidates[i])
      .matchEntireCell(true)
      .findNext();

    if (match && normalizeRecNo_(match.getValue()) === targetRecNo) {
      if (diagnostics) {
        diagnostics.mainLookup = 'textfinder';
        diagnostics.mainFallbackRowsScanned = 0;
      }
      return match.getRow();
    }
  }

  // Legacy-safe fallback: transfer only column D, never the full MainData range.
  const values = recNoRange.getValues();
  if (diagnostics) {
    diagnostics.mainLookup = 'column-fallback';
    diagnostics.mainFallbackRowsScanned = values.length;
  }

  for (let i = 0; i < values.length; i++) {
    if (normalizeRecNo_(values[i][0]) === targetRecNo) {
      return i + 2;
    }
  }

  return 0;
}

function readMeetingsByCaseId_(ss, caseId, diagnostics) {
  const meetings = [];
  const targetCaseId = cleanText_(caseId);
  const logSheet = ss.getSheetByName('MeetingLogs');

  if (!logSheet || !targetCaseId) {
    if (diagnostics) diagnostics.meetingLookup = 'none';
    return meetings;
  }

  const rowNumbers = findMeetingRowsByCaseId_(logSheet, targetCaseId, diagnostics);
  if (!rowNumbers.length) {
    return meetings;
  }

  const seen = {};
  const blocks = groupContiguousRows_(rowNumbers);
  if (diagnostics) {
    diagnostics.meetingMatchedRows = rowNumbers.length;
    diagnostics.meetingReadBlocks = blocks.length;
  }

  blocks.forEach(function (block) {
    const values = logSheet
      .getRange(block.startRow, MEETING_DATA_START_COLUMN, block.rowCount, MEETING_DATA_COLUMN_COUNT)
      .getValues();

    for (let i = 0; i < values.length; i++) {
      const round = cleanText_(values[i][0]);
      const date = values[i][1] instanceof Date
        ? Utilities.formatDate(values[i][1], 'GMT+7', 'yyyy-MM-dd')
        : cleanText_(values[i][1]);

      if (!round && !date) {
        continue;
      }

      const key = normalizeMeetingRoundKey_(round) + '|' + normalizeDateKey_(date);
      if (seen[key]) {
        continue;
      }
      seen[key] = true;

      meetings.push({
        round: round,
        date: date
      });
    }
  });

  meetings.sort(function (a, b) {
    const ar = Number(String(a.round || '').replace(/[^0-9]/g, '')) || 0;
    const br = Number(String(b.round || '').replace(/[^0-9]/g, '')) || 0;
    if (ar !== br) return ar - br;
    return normalizeDateKey_(a.date).localeCompare(normalizeDateKey_(b.date));
  });

  return meetings;
}

/**
 * Find MeetingLogs rows by caseId without loading the whole table.
 * Exact TextFinder is the normal hot path; column-A normalization is a safe fallback.
 */
function findMeetingRowsByCaseId_(logSheet, targetCaseId, diagnostics) {
  const lastRow = logSheet.getLastRow();
  if (lastRow < 2) {
    if (diagnostics) diagnostics.meetingLookup = 'empty';
    return [];
  }

  const caseIdRange = logSheet.getRange(2, MEETING_CASE_ID_COLUMN, lastRow - 1, 1);
  const matches = caseIdRange
    .createTextFinder(targetCaseId)
    .matchEntireCell(true)
    .findAll();

  const exactRows = (matches || [])
    .filter(function (match) {
      return cleanText_(match.getValue()) === targetCaseId;
    })
    .map(function (match) {
      return match.getRow();
    });

  if (exactRows.length) {
    if (diagnostics) {
      diagnostics.meetingLookup = 'textfinder';
      diagnostics.meetingFallbackRowsScanned = 0;
    }
    return uniqueSortedNumbers_(exactRows);
  }

  // Legacy-safe fallback scans only column A, not MeetingLogs.getDataRange().
  const ids = caseIdRange.getValues();
  const rows = [];
  for (let i = 0; i < ids.length; i++) {
    if (cleanText_(ids[i][0]) === targetCaseId) {
      rows.push(i + 2);
    }
  }

  if (diagnostics) {
    diagnostics.meetingLookup = 'column-fallback';
    diagnostics.meetingFallbackRowsScanned = ids.length;
  }

  return rows;
}

function groupContiguousRows_(rowNumbers) {
  const rows = uniqueSortedNumbers_(rowNumbers);
  const blocks = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const current = blocks.length ? blocks[blocks.length - 1] : null;

    if (!current || row !== current.startRow + current.rowCount) {
      blocks.push({ startRow: row, rowCount: 1 });
    } else {
      current.rowCount += 1;
    }
  }

  return blocks;
}

function uniqueSortedNumbers_(values) {
  const seen = {};
  const result = [];

  (values || []).forEach(function (value) {
    const number = Number(value);
    if (!isFinite(number) || number < 1 || seen[number]) return;
    seen[number] = true;
    result.push(number);
  });

  result.sort(function (a, b) { return a - b; });
  return result;
}

function cleanText_(value) {
  return String(value == null ? '' : value)
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeDigits_(value) {
  const thaiDigits = '๐๑๒๓๔๕๖๗๘๙';
  return cleanText_(value).replace(/[๐-๙]/g, function (ch) {
    return String(thaiDigits.indexOf(ch));
  });
}

function normalizeRecNo_(value) {
  return normalizeDigits_(value)
    .replace(/^'+/, '')
    .replace(/\\/g, '/')
    .replace(/[–—−-]/g, '/')
    .replace(/\s+/g, '')
    .trim();
}

function statusKey_(value) {
  return normalizeDigits_(value)
    .replace(/^'+/, '')
    .replace(/[()（）\[\]{}:：._\-\/\\|"'“”‘’]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function normalizeCaseStatus_(status) {
  const raw = cleanText_(status);
  const key = statusKey_(raw);

  const aliases = {
    // เรื่องเข้าใหม่
    'รับเรื่อง': 'เรื่องเข้าใหม่',
    'เรื่องเข้าใหม่': 'เรื่องเข้าใหม่',

    // อยู่ระหว่างการพิจารณา
    'อยู่ระหว่างการพิจารณาของคณะอนุกรรมาธิการ': 'อนุฯ พิจารณา',
    'อยู่ระหว่างการพิจารณาของอนุกรรมาธิการ': 'อนุฯ พิจารณา',
    'อนุกรรมาธิการพิจารณา': 'อนุฯ พิจารณา',
    'อนุฯพิจารณา': 'อนุฯ พิจารณา',
    'อนุพิจารณา': 'อนุฯ พิจารณา',
    'รอการพิจารณา': 'รอพิจารณา',
    'รอพิจารณา': 'รอพิจารณา',
    'อยู่ระหว่างการพิจารณาของคณะกรรมาธิการ': 'กมธ. พิจารณา',
    'คณะกรรมาธิการพิจารณา': 'กมธ. พิจารณา',
    'กมธพิจารณา': 'กมธ. พิจารณา',
    'กมธ.พิจารณา': 'กมธ. พิจารณา',

    // พิจารณาแล้วเสร็จ / พิจารณาเสร็จแล้ว
    'ไม่รับเรื่อง': 'ไม่รับเรื่อง',
    'ไม่รับเรื่องไว้พิจารณา': 'ไม่รับเรื่อง',
    'ยุติเรื่อง': 'ยุติเรื่อง',
    'ส่งหน่วยงาน': 'ส่งหน่วยงาน',
    'ส่งให้หน่วยงาน': 'ส่งหน่วยงาน',
    'ส่งหน่วยงานที่เกี่ยวข้อง': 'ส่งหน่วยงาน',
    'จัดทำรายงาน': 'จัดทำรายงาน',
    'จัดทํารายงาน': 'จัดทำรายงาน',
    'พิจารณาแล้วเสร็จ': 'จัดทำรายงาน',
    'พิจารณาเสร็จแล้ว': 'จัดทำรายงาน',
    'คณะกรรมาธิการพิจารณาเสร็จแล้ว': 'จัดทำรายงาน',
    'ดำเนินการเสร็จสิ้น': 'จัดทำรายงาน',
    'ดําเนินการเสร็จสิ้น': 'จัดทำรายงาน'
  };

  if (aliases[raw]) {
    return aliases[raw];
  }
  if (aliases[key]) {
    return aliases[key];
  }
  return raw;
}

function getStatusGroup_(normalizedStatus) {
  const status = cleanText_(normalizedStatus);

  if (status === 'เรื่องเข้าใหม่') {
    return STATUS_GROUP_NEW;
  }

  if (status === 'อนุฯ พิจารณา'
    || status === 'รอพิจารณา'
    || status === 'กมธ. พิจารณา') {
    return STATUS_GROUP_IN_PROGRESS;
  }

  if (status === 'ไม่รับเรื่อง'
    || status === 'ยุติเรื่อง'
    || status === 'ส่งหน่วยงาน'
    || status === 'จัดทำรายงาน') {
    return STATUS_GROUP_COMPLETED;
  }

  return STATUS_GROUP_OTHER;
}

function makeDisplayStatus_(normalizedStatus, agencyName, reason) {
  const status = cleanText_(normalizedStatus);
  const agency = cleanText_(agencyName) || 'หน่วยงานที่เกี่ยวข้อง';
  const reasonText = cleanText_(reason);

  if (status === 'เรื่องเข้าใหม่') {
    return 'เรื่องเข้าใหม่';
  }

  if (status === 'อนุฯ พิจารณา'
    || status === 'รอพิจารณา'
    || status === 'กมธ. พิจารณา') {
    return 'อยู่ระหว่างการพิจารณา';
  }

  if (status === 'ไม่รับเรื่อง') {
    return reasonText
      ? 'ไม่รับเรื่อง เนื่องจาก ' + reasonText
      : 'ไม่รับเรื่อง';
  }

  if (status === 'ยุติเรื่อง') {
    return reasonText
      ? 'คณะกรรมาธิการมีมติยุติเรื่อง เนื่องจาก ' + reasonText
      : 'คณะกรรมาธิการมีมติยุติเรื่อง';
  }

  if (status === 'ส่งหน่วยงาน') {
    return 'ส่งให้ ' + agency + ' พิจารณาตรวจสอบ';
  }

  if (status === 'จัดทำรายงาน') {
    return 'คณะกรรมาธิการพิจารณาเสร็จแล้ว';
  }

  return status || 'ไม่ระบุสถานะ';
}

function normalizeMeetingRoundKey_(value) {
  return normalizeDigits_(value)
    .replace(/^ครั้งที่\s*/i, '')
    .replace(/[^0-9ก-๙a-zA-Z]+/g, '')
    .toLowerCase();
}

function normalizeDateKey_(value) {
  const text = normalizeDigits_(value);
  if (!text) return '';

  const ymd = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymd) {
    return ymd[1] + '-' + ('0' + ymd[2]).slice(-2) + '-' + ('0' + ymd[3]).slice(-2);
  }

  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (dmy) {
    let year = Number(dmy[3]);
    if (year < 100) year += 2500;
    return year + '-' + ('0' + dmy[2]).slice(-2) + '-' + ('0' + dmy[1]).slice(-2);
  }

  return text;
}

/**
 * P0-B live-contract self-test for Apps Script editor.
 * Reads the current MainData sheet and exercises the same dashboard/search owners
 * used by the public JSONP router. It does not create or modify spreadsheet data.
 */
function runP0BContractSelfTest_() {
  const tests = [];
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName('MainData');

  function record_(name, passed, detail) {
    tests.push({
      name: name,
      passed: Boolean(passed),
      detail: cleanText_(detail)
    });
  }

  if (!mainSheet) {
    return {
      ok: false,
      apiVersion: PUBLIC_API_VERSION,
      tests: [{ name: 'MainData', passed: false, detail: 'ไม่พบฐานข้อมูล MainData' }]
    };
  }

  const dashboard = apiDashboard_({}, createRequestId_());
  const dashboardCounts = dashboard && dashboard.data && dashboard.data.counts;
  record_(
    'dashboard contract',
    dashboard && dashboard.ok === true
      && dashboard.apiVersion === PUBLIC_API_VERSION
      && !!dashboard.requestId
      && dashboardCounts
      && typeof dashboardCounts.total === 'number'
      && typeof dashboardCounts.new === 'number'
      && typeof dashboardCounts.inProgress === 'number'
      && typeof dashboardCounts.completed === 'number',
    dashboard && dashboard.ok ? 'ผ่าน' : (dashboard && dashboard.code ? dashboard.code : 'ไม่ผ่าน')
  );

  const rows = mainSheet.getDataRange().getValues();
  let sampleRecNo = '';
  for (let i = 1; i < rows.length; i++) {
    const candidate = cleanText_(rows[i][3]);
    if (isValidRecNoInput_(candidate)) {
      sampleRecNo = candidate;
      break;
    }
  }

  if (sampleRecNo) {
    const found = apiSearch_({ recNo: sampleRecNo }, createRequestId_());
    record_(
      'search found contract',
      found && found.ok === true
        && found.found === true
        && found.apiVersion === PUBLIC_API_VERSION
        && !!found.requestId
        && found.data
        && !!found.data.recNo,
      found && found.ok ? 'ทดสอบด้วยเลขรับเรื่อง ' + sampleRecNo : (found && found.code ? found.code : 'ไม่ผ่าน')
    );
  } else {
    record_('search found contract', false, 'ไม่พบเลขรับเรื่องตัวอย่างใน MainData');
  }

  const missingRecNo = 'P0B-NOT-FOUND-' + Date.now();
  const notFound = apiSearch_({ recNo: missingRecNo }, createRequestId_());
  record_(
    'search not-found contract',
    notFound && notFound.ok === true
      && notFound.found === false
      && notFound.apiVersion === PUBLIC_API_VERSION
      && !!notFound.requestId,
    notFound && notFound.msg ? notFound.msg : 'ไม่ผ่าน'
  );

  const badInput = apiSearch_({ recNo: '<script>' }, createRequestId_());
  record_(
    'invalid recNo contract',
    badInput && badInput.ok === false
      && badInput.code === 'INVALID_REC_NO'
      && badInput.apiVersion === PUBLIC_API_VERSION
      && !!badInput.requestId,
    badInput && badInput.code ? badInput.code : 'ไม่ผ่าน'
  );

  const versionOutput = doGet({
    parameter: {
      action: 'dashboard',
      callback: 'p0bVersionTest',
      v: '0'
    }
  }).getContent();
  record_(
    'api version mismatch contract',
    versionOutput.indexOf('API_VERSION_MISMATCH') >= 0
      && versionOutput.indexOf('p0bVersionTest(') === 0,
    versionOutput.indexOf('API_VERSION_MISMATCH') >= 0 ? 'ผ่าน' : 'ไม่ผ่าน'
  );

  const invalidCallbackOutput = doGet({
    parameter: {
      action: 'dashboard',
      callback: 'bad.callback()',
      v: PUBLIC_API_VERSION
    }
  }).getContent();
  record_(
    'invalid callback contract',
    invalidCallbackOutput.indexOf('"code":"INVALID_CALLBACK"') >= 0,
    invalidCallbackOutput.indexOf('"code":"INVALID_CALLBACK"') >= 0 ? 'ผ่าน' : 'ไม่ผ่าน'
  );

  return {
    ok: tests.every(function (test) { return test.passed; }),
    apiVersion: PUBLIC_API_VERSION,
    sampleRecNo: sampleRecNo,
    tests: tests
  };
}

/**
 * P1-B hot-path self-test. Read-only to Spreadsheet; it only clears/rebuilds
 * the Script Cache entry and compares cache-hit data with a fresh computation.
 */
function runP1BDashboardHotPathSelfTest_() {
  const cache = CacheService.getScriptCache();
  cache.remove(DASHBOARD_CACHE_KEY);

  const first = getDashboardSnapshot_();
  const second = getDashboardSnapshot_();
  const fresh = computeDashboardCounts_();

  const sameCounts = first.ok && second.ok && fresh.ok
    && JSON.stringify(first.counts) === JSON.stringify(second.counts)
    && JSON.stringify(first.counts) === JSON.stringify(fresh.counts);

  return {
    ok: Boolean(
      first.ok
      && second.ok
      && fresh.ok
      && first.cacheHit === false
      && second.cacheHit === true
      && sameCounts
    ),
    cacheTtlSeconds: DASHBOARD_CACHE_TTL_SECONDS,
    readColumnCount: DASHBOARD_READ_COLUMN_COUNT,
    firstRequestCacheHit: first.cacheHit === true,
    secondRequestCacheHit: second.cacheHit === true,
    countsMatchFresh: sameCounts,
    counts: first.ok ? first.counts : null
  };
}

/**
 * P1-C search hot-path self-test. Read-only: finds a real sample recNo,
 * exercises the production search path, and verifies normalization compatibility.
 */
function runP1CSearchHotPathSelfTest_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName('MainData');

  if (!mainSheet || mainSheet.getLastRow() < 2) {
    return {
      ok: false,
      msg: 'ไม่พบข้อมูล MainData สำหรับทดสอบ'
    };
  }

  const recNoValues = mainSheet
    .getRange(2, SEARCH_RECNO_COLUMN, mainSheet.getLastRow() - 1, 1)
    .getValues();
  let sampleRecNo = '';

  for (let i = 0; i < recNoValues.length; i++) {
    const candidate = cleanText_(recNoValues[i][0]);
    if (isValidRecNoInput_(candidate)) {
      sampleRecNo = candidate;
      break;
    }
  }

  if (!sampleRecNo) {
    return {
      ok: false,
      msg: 'ไม่พบเลขรับเรื่องตัวอย่างสำหรับทดสอบ'
    };
  }

  invalidateSearchCacheByRecNo_(sampleRecNo);
  const diagnostics = {};
  const result = searchByRecNo(sampleRecNo, diagnostics);
  const normalizedVariant = sampleRecNo.indexOf('/') >= 0
    ? sampleRecNo.replace('/', ' - ')
    : sampleRecNo;
  invalidateSearchCacheByRecNo_(sampleRecNo);
  const variantDiagnostics = {};
  const variantResult = searchByRecNo(normalizedVariant, variantDiagnostics);

  const primaryOk = result && result.found === true && result.data
    && normalizeRecNo_(result.data.recNo) === normalizeRecNo_(sampleRecNo);
  const variantOk = variantResult && variantResult.found === true && variantResult.data
    && normalizeRecNo_(variantResult.data.recNo) === normalizeRecNo_(sampleRecNo);

  return {
    ok: Boolean(primaryOk && variantOk),
    sampleRecNo: sampleRecNo,
    normalizedVariant: normalizedVariant,
    primaryLookup: diagnostics.mainLookup || '',
    variantLookup: variantDiagnostics.mainLookup || '',
    meetingLookup: diagnostics.meetingLookup || '',
    caseRowCellsRead: diagnostics.caseRowCellsRead || 0,
    mainFallbackRowsScanned: diagnostics.mainFallbackRowsScanned || 0,
    meetingMatchedRows: diagnostics.meetingMatchedRows || 0,
    meetingReadBlocks: diagnostics.meetingReadBlocks || 0,
    meetingFallbackRowsScanned: diagnostics.meetingFallbackRowsScanned || 0,
    meetingCount: primaryOk && Array.isArray(result.data.meetings) ? result.data.meetings.length : 0,
    normalizedCompatibility: variantOk
  };
}

/**
 * P1-D cache self-test. Spreadsheet stays read-only; cache generation is advanced
 * once to verify that a global invalidation makes the next search cold again.
 */
function runP1DSearchCacheSelfTest_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName('MainData');
  if (!mainSheet || mainSheet.getLastRow() < 2) {
    return { ok: false, msg: 'ไม่พบข้อมูล MainData สำหรับทดสอบ' };
  }

  const values = mainSheet
    .getRange(2, SEARCH_RECNO_COLUMN, mainSheet.getLastRow() - 1, 1)
    .getValues();
  let sampleRecNo = '';
  for (let i = 0; i < values.length; i++) {
    const candidate = cleanText_(values[i][0]);
    if (isValidRecNoInput_(candidate)) {
      sampleRecNo = candidate;
      break;
    }
  }
  if (!sampleRecNo) return { ok: false, msg: 'ไม่พบเลขรับเรื่องตัวอย่างสำหรับทดสอบ' };

  invalidateSearchCacheByRecNo_(sampleRecNo);
  const firstDiagnostics = {};
  const first = searchByRecNo(sampleRecNo, firstDiagnostics);
  const secondDiagnostics = {};
  const second = searchByRecNo(sampleRecNo, secondDiagnostics);

  const beforeGeneration = getSearchCacheGeneration_();
  const invalidation = invalidatePublicDataCaches_('P1-D self-test');
  const afterGeneration = getSearchCacheGeneration_();
  const thirdDiagnostics = {};
  const third = searchByRecNo(sampleRecNo, thirdDiagnostics);

  const sameData = first && second && third
    && first.found === true && second.found === true && third.found === true
    && JSON.stringify(first.data) === JSON.stringify(second.data)
    && JSON.stringify(first.data) === JSON.stringify(third.data);

  return {
    ok: Boolean(
      sameData
      && firstDiagnostics.searchCacheHit === false
      && secondDiagnostics.searchCacheHit === true
      && invalidation && invalidation.ok === true
      && afterGeneration > beforeGeneration
      && thirdDiagnostics.searchCacheHit === false
    ),
    sampleRecNo: sampleRecNo,
    cacheTtlSeconds: SEARCH_CACHE_TTL_SECONDS,
    firstRequestCacheHit: firstDiagnostics.searchCacheHit === true,
    secondRequestCacheHit: secondDiagnostics.searchCacheHit === true,
    afterInvalidationCacheHit: thirdDiagnostics.searchCacheHit === true,
    beforeGeneration: beforeGeneration,
    afterGeneration: afterGeneration,
    dataMatchesAfterInvalidation: sameData
  };
}

/**
 * P1-E self-test. No Spreadsheet data is changed; only cache entries/generation
 * are invalidated to verify write-hook wiring and public observability metadata.
 */
function runP1EWriteHookAndObservabilitySelfTest_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const mainSheet = ss.getSheetByName('MainData');
  if (!mainSheet || mainSheet.getLastRow() < 2) {
    return { ok: false, msg: 'ไม่พบข้อมูล MainData สำหรับทดสอบ' };
  }

  const values = mainSheet
    .getRange(2, SEARCH_RECNO_COLUMN, mainSheet.getLastRow() - 1, 1)
    .getValues();
  let sampleRecNo = '';
  for (let i = 0; i < values.length; i++) {
    const candidate = cleanText_(values[i][0]);
    if (isValidRecNoInput_(candidate)) {
      sampleRecNo = candidate;
      break;
    }
  }
  if (!sampleRecNo) return { ok: false, msg: 'ไม่พบเลขรับเรื่องตัวอย่างสำหรับทดสอบ' };

  invalidateSearchCacheByRecNo_(sampleRecNo);
  const firstDiagnostics = {};
  const first = searchByRecNo(sampleRecNo, firstDiagnostics);
  const secondDiagnostics = {};
  const second = searchByRecNo(sampleRecNo, secondDiagnostics);

  const targeted = afterPublicDataWrite_({
    sheetName: 'MeetingLogs',
    recNo: sampleRecNo,
    reason: 'P1-E targeted self-test'
  });
  const thirdDiagnostics = {};
  const third = searchByRecNo(sampleRecNo, thirdDiagnostics);

  const generationBefore = getSearchCacheGeneration_();
  const broad = afterPublicDataWrite_({
    sheetName: 'MainData',
    reason: 'P1-E broad self-test'
  });
  const generationAfter = getSearchCacheGeneration_();
  const observed = apiSearch_({ recNo: sampleRecNo }, createRequestId_());
  const observedMeta = observed && observed.meta ? observed.meta : {};

  const sameData = first && second && third && observed
    && first.found === true && second.found === true && third.found === true && observed.found === true
    && JSON.stringify(first.data) === JSON.stringify(second.data)
    && JSON.stringify(first.data) === JSON.stringify(third.data)
    && JSON.stringify(first.data) === JSON.stringify(observed.data);

  return {
    ok: Boolean(
      sameData
      && firstDiagnostics.searchCacheHit === false
      && secondDiagnostics.searchCacheHit === true
      && targeted && targeted.ok === true && targeted.scope === 'search-record'
      && thirdDiagnostics.searchCacheHit === false
      && broad && broad.ok === true && broad.scope === 'public-all'
      && generationAfter > generationBefore
      && observedMeta.cacheHit === false
      && typeof observedMeta.durationMs === 'number'
      && observedMeta.durationMs >= 0
      && observedMeta.source === 'fresh'
    ),
    sampleRecNo: sampleRecNo,
    firstRequestCacheHit: firstDiagnostics.searchCacheHit === true,
    secondRequestCacheHit: secondDiagnostics.searchCacheHit === true,
    afterMeetingWriteCacheHit: thirdDiagnostics.searchCacheHit === true,
    targetedInvalidationScope: targeted && targeted.scope ? targeted.scope : '',
    broadInvalidationScope: broad && broad.scope ? broad.scope : '',
    generationBefore: generationBefore,
    generationAfter: generationAfter,
    observedCacheHit: observedMeta.cacheHit === true,
    observedSource: cleanText_(observedMeta.source),
    observedDurationMs: numberOrZero_(observedMeta.durationMs),
    dataMatches: sameData
  };
}

function getStatusContractForExternalLookup() {
  return {
    new: ['เรื่องเข้าใหม่'],
    inProgress: ['อนุฯ พิจารณา', 'รอพิจารณา', 'กมธ. พิจารณา'],
    completed: ['ไม่รับเรื่อง', 'ยุติเรื่อง', 'ส่งหน่วยงาน', 'จัดทำรายงาน']
  };
}