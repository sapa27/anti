/** Canonical — People budget read model, petitioner read model and admin-domain extensions. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {}, AppDomain = __APP_GLOBAL__.AppDomain = __APP_GLOBAL__.AppDomain || {}, PeopleDomain = __APP_GLOBAL__.PeopleDomain = __APP_GLOBAL__.PeopleDomain || {}, PetitionerDomain = __APP_GLOBAL__.PetitionerDomain = __APP_GLOBAL__.PetitionerDomain || {}, AdminDomain = __APP_GLOBAL__.AdminDomain = __APP_GLOBAL__.AdminDomain || {};
/* ==========================================================================
 * r214 Personnel budget read-model owner
 * PeopleDomain owns header alias resolution, date parsing, row normalization
 * and source deduplication. BudgetDomain supplies its optimized reader and
 * remains the owner of salary-rate and obligation calculations.
 * ========================================================================== */
function _peopleBudgetParseDate_(value) {
    if (value == null || value === "") return null;
    if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
        var dateYear = value.getFullYear();
        return dateYear > 2400 ? new Date(dateYear - 543, value.getMonth(), value.getDate()) : value;
    }
    var raw = String(value || "").trim(), match, dateValue, yearValue;
    if (!raw) return null;
    if (/^\d{5,6}(?:\.\d+)?$/.test(raw)) {
        var serial = Number(raw);
        if (serial > 30000 && serial < 70000) {
            dateValue = new Date(Math.round((serial - 25569) * 86400 * 1000));
            return isNaN(dateValue.getTime()) ? null : new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
        }
    }
    match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (match) {
        yearValue = Number(match[1]);
        if (yearValue > 2400) yearValue -= 543;
        dateValue = new Date(yearValue, Number(match[2]) - 1, Number(match[3]));
        return isNaN(dateValue.getTime()) ? null : dateValue;
    }
    match = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
    if (match) {
        yearValue = Number(match[3]);
        if (yearValue < 100) yearValue += 2500;
        if (yearValue > 2400) yearValue -= 543;
        dateValue = new Date(yearValue, Number(match[2]) - 1, Number(match[1]));
        return isNaN(dateValue.getTime()) ? null : dateValue;
    }
    dateValue = new Date(raw);
    if (isNaN(dateValue.getTime())) return null;
    yearValue = dateValue.getFullYear();
    return yearValue > 2400 ? new Date(yearValue - 543, dateValue.getMonth(), dateValue.getDate()) : dateValue;
}
function _peopleNormalizeStaffForBudget_(row, idx) {
    row = row || {};
    function first(aliasText) {
        return _peopleFirstValue_(row, String(aliasText || "").split("|"));
    }
    var rawStart = first("startDate|workStartDate|appointedDate|วันที่เริ่ม|วันเริ่ม|วันที่เริ่มดำรงตำแหน่ง|วันเริ่มดำรงตำแหน่ง|วันที่แต่งตั้ง|วันแต่งตั้ง|วันเริ่มทำหน้าที่|วันเริ่ม-สิ้นสุด|วันเริ่ม - สิ้นสุด");
    var rawEnd = first("endDate|workEndDate|retireDate|วันที่สิ้นสุด|วันสิ้นสุด|วันที่พ้นตำแหน่ง|วันพ้นตำแหน่ง|วันสิ้นสุดตำแหน่ง");
    if (rawStart && !rawEnd && !/^\s*\d{4}-\d{1,2}-\d{1,2}\s*$/.test(String(rawStart)) && /\s+(?:-|–|—|ถึง)\s+/.test(String(rawStart))) {
        var parts = String(rawStart).split(/\s+(?:-|–|—|ถึง)\s+/);
        rawStart = parts[0] || rawStart;
        rawEnd = parts.slice(1).join(" ").trim();
    }
    var salary = first("salaryAmount|monthlySalary|salary|salaryBaht|compensation|amount|rate|monthlyRate|allowance|เงินเดือน (บาท)|เงินเดือน|เงินเดือนบาท|ค่าตอบแทน|ค่าตอบแทนรายเดือน|จำนวนเงิน");
    var fiscalYear = String(first("fy|fiscalYear|FiscalYear|budgetFy|budgetYear|ปีงบประมาณ|ปีงบ|ปี") || "").replace(/[^0-9]/g, "");
    return {
        id: String(first("id|ID|รหัส|ลำดับ|เลขที่|รหัสบุคลากร") || "S-" + (Number(idx || 0) + 1)),
        name: String(first("name|fullName|ชื่อ-สกุล|ชื่อสกุล|ชื่อ - สกุล|ชื่อ-นามสกุล|ชื่อ|ชื่อบุคลากร|ชื่อและสกุล") || ""),
        position: String(first("position|role|title|personnelType|ตำแหน่ง|ตำแหน่งในคณะ|ตำแหน่งงาน|ประเภทบุคลากร|ประเภท|สถานภาพ|Position") || ""),
        personnelType: String(first("personnelType|ประเภทบุคลากร|ประเภท|สถานภาพ") || ""),
        isGov: String(first("isGov|ข้าราชการ|เป็นข้าราชการ|สถานะข้าราชการ") || ""),
        status: String(first("status|workStatus|activeStatus|สถานะ|สถานะการดำรงตำแหน่ง|Status") || "ดำรงตำแหน่ง"),
        startDate: _peopleBudgetParseDate_(rawStart),
        endDate: _peopleBudgetParseDate_(rawEnd),
        fy: fiscalYear, salaryAmount: salary, monthlySalary: salary, salary: salary, compensation: salary, __raw: row
    };
}
function _peopleReadStaffRowsForBudget_(options) {
    options = options || {};
    var rawRows = [], source = "", readers = Array.isArray(options.readers) ? options.readers.slice() : [];
    readers = readers.concat([
        { label: "people-direct", read: function () { return _readPeopleSheetRowsDirect_("Personnel_Staff"); } },
        { label: "people-domain", read: function () { return _Domain_getPersonnelStaffs(); } },
        { label: "readObjects", read: function () { return typeof _readObjects_ == "function" ? _readObjects_("Personnel_Staff") : []; } }
    ]);
    function warn(label, err) {
        if (typeof options.warn == "function") return options.warn(label, err);
        if (_appIsFnName_("_recordWarning_")) _recordWarning_("people.budget." + String(label || "read"), err);
    }
    readers.some(function (entry) {
        if (!entry || typeof entry.read != "function") return false;
        try {
            var candidate = entry.read();
            if (Array.isArray(candidate) && candidate.length) {
                rawRows = candidate;
                source = String(entry.label || "reader");
                return true;
            }
        } catch (err) {
            warn(entry.label || "reader", err);
        }
        return false;
    });
    var seen = {}, out = [];
    rawRows.forEach(function (raw, idx) {
        if (!raw) return;
        var row = raw;
        try {
            if (source === "people-domain" && typeof normalizePersonnelStaffRow_ == "function") row = normalizePersonnelStaffRow_(raw);
        } catch (_normalizeErr) {
            row = raw;
        }
        row = _peopleNormalizeStaffForBudget_(row, idx);
        if (!String(row.name || "").trim() && !String(row.position || "").trim()) return;
        var key = String(row.id || "").trim() || [
            String(row.name || "").replace(/\s+/g, " ").trim(),
            String(row.position || "").replace(/\s+/g, " ").trim(),
            String(row.startDate || ""), idx
        ].join("|");
        if (seen[key]) return;
        seen[key] = true;
        row.__salarySource = source || "Personnel_Staff";
        out.push(row);
    });
    return out;
}
PeopleDomain.parseBudgetDate = _peopleBudgetParseDate_;
PeopleDomain.normalizeStaffForBudget = _peopleNormalizeStaffForBudget_;
PeopleDomain.readStaffRowsForBudget = _peopleReadStaffRowsForBudget_;

/* ==========================================================================
 * r214 People/reference-data owner
 * Meeting lookup bundles and Thailand location reference data are owned by
 * Code_33 because they are composed from People, Petitioner and reference
 * sheets. Code_30 consumes these contracts but no longer implements them.
 * ========================================================================== */
var _LOOKUP_BUNDLE_CACHE_TTL_ = 600;
function getLookupBundle_(type, query, scope, limit) {
    var normalizedType;
    if (_normalizeLookupText_(type || "meeting") === "meeting") {
        var base = _getMeetingLookupBundle_(scope);
        return ((limit = Math.max(20, Math.min(Number(limit || 120) || 120, 300))),
            {
                petitioners: _filterLookupRows_(base.petitioners, query, limit),
                proposer: _filterLookupRows_(base.proposer, query, limit),
                assignees: _filterLookupRows_(base.assignees, query, limit),
                coAssignees: _filterLookupRows_(base.coAssignees, query, limit),
                staffs: _filterLookupRows_(base.staffs, query, limit),
                opStaff: _filterLookupRows_(base.opStaff, query, limit),
                subcommittees: _filterLookupRows_(base.subcommittees, query, limit),
                bundles: {
                    petitioners: _filterLookupRows_(base.bundles.petitioners, query, limit),
                    comms: _filterLookupRows_(base.bundles.comms, query, limit),
                    staffs: _filterLookupRows_(base.bundles.staffs, query, limit),
                    ops: _filterLookupRows_(base.bundles.ops, query, limit),
                    subcommittees: _filterLookupRows_(base.bundles.subcommittees, query, limit),
                },
            });
    }
    return {
        rows: []
    };
}
function _normalizeLookupContractPayload_(payload) {
    payload = payload || {};
    var limit = Math.max(1, Math.min(Number(payload.limit || 80) || 80, 300)), page = Math.max(1, Number(payload.page || 1) || 1), cursor = _appTextValue_(payload.cursor).trim();
    return {
        type: String(payload.type || "meeting").trim() || "meeting",
        key: _appTextValue_(payload.key || payload.kind || payload.target).trim(),
        q: _appTextValue_(payload.q || payload.query || payload.keyword).trim(),
        scope: _appTextValue_(payload.scope || payload.category || payload.group).trim(),
        limit,
        page,
        cursor,
        offset: cursor && /^\d+$/.test(cursor) ? Number(cursor) : (page - 1) * limit,
        contractStamp: "lookup-contract-current",
    };
}
function apiSearchLookup(payload) {
    payload = payload || {};
    var boundary = _routerAuthorizedEntry_("apiSearchLookup", payload, "viewer");
    if (!boundary.ok)
        return boundary.result;
    var bundle = getLookupBundle_((payload = _normalizeLookupContractPayload_(payload)).type, payload.q, payload.scope, Math.max(payload.limit + payload.offset + 1, payload.limit)), rows = (payload.key &&
        (bundle[payload.key] || (bundle.bundles || {})[payload.key])) ||
        [];
    rows.length ||
        payload.key ||
        Object.keys(bundle || {}).forEach(function (k) {
            Array.isArray(bundle[k]) && (rows = rows.concat(bundle[k]));
        });
    var sliced = (rows = Array.isArray(rows) ? rows : []).slice(payload.offset, payload.offset + payload.limit), nextOffset = payload.offset + sliced.length;
    return {
        ok: !0,
        data: {
            rows: sliced,
            items: sliced,
            records: sliced,
            key: payload.key,
            type: payload.type,
            q: payload.q,
            scope: payload.scope,
            limit: payload.limit,
            cursor: payload.cursor,
            nextCursor: nextOffset < rows.length ? String(nextOffset) : "",
            totalRecords: rows.length,
            contractStamp: payload.contractStamp,
        },
    };
}
function _normalizeLookupText_(value) {
    return _appTextValue_(value).trim();
}
function _normalizeLookupQuery_(value) {
    return _normalizeLookupText_(value).toLowerCase();
}
function _activeLookupNameRows_(rows, source) {
    return (Array.isArray(rows) ? rows : [])
        .map(function (r) {
        return {
            name: _normalizeLookupText_((r && (r.name || r.fullName)) || ""),
            phone: _normalizeLookupText_((r && (r.phone || r.tel)) || "").replace(/'/g, ""),
            position: _normalizeLookupText_((r && r.position) || ""),
            status: _normalizeLookupText_((r && r.status) || ""),
            source: _normalizeLookupText_(source || ""),
        };
    })
        .filter(function (x) {
        return (!!x.name &&
            (!x.status ||
                x.status === "ดำรงตำแหน่ง" ||
                x.status === "ใช้งาน" ||
                x.status.toLowerCase() === "active"));
    });
}
function _distinctLookupRowsByName_(rows) {
    var map = {};
    return ((Array.isArray(rows) ? rows : []).forEach(function (x) {
        var key = _normalizeLookupQuery_((x = x || {}).name);
        if (key) {
            if (!map[key])
                return ((map[key] = {
                    name: _normalizeLookupText_(x.name),
                    phone: _normalizeLookupText_(x.phone),
                    position: _normalizeLookupText_(x.position),
                    source: _normalizeLookupText_(x.source),
                }),
                    void 0);
            (!map[key].phone &&
                x.phone &&
                (map[key].phone = _normalizeLookupText_(x.phone)),
                !map[key].position &&
                    x.position &&
                    (map[key].position = _normalizeLookupText_(x.position)),
                !map[key].source &&
                    x.source &&
                    (map[key].source = _normalizeLookupText_(x.source)));
        }
    }),
        Object.keys(map)
            .map(function (key) {
            return map[key];
        })
            .sort(function (a, b) {
            return _appTextValue_(a.name).localeCompare(_appTextValue_(b.name), "th");
        }));
}
function _filterLookupRows_(rows, query, limit) {
    var q = _normalizeLookupQuery_(query), out = Array.isArray(rows) ? rows.slice() : [];
    return (q &&
        (out = out.filter(function (x) {
            return (_normalizeLookupQuery_(x.name).indexOf(q) !== -1 ||
                _normalizeLookupQuery_(x.phone).indexOf(q) !== -1 ||
                _normalizeLookupQuery_(x.position).indexOf(q) !== -1 ||
                _normalizeLookupQuery_(x.source).indexOf(q) !== -1);
        })),
        out.slice(0, Math.max(1, Number(limit || 120) || 120)));
}
function _meetingLookupBundleCacheKey_(category) {
    var cacheTokens = [
        _appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("petitioners")
            : "na",
        _appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("personnel_comm")
            : "na",
        _appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("personnel_staff")
            : "na",
        _appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("personnel_op")
            : "na",
        _appIsFnName_("_entityCacheStamp_")
            ? _entityCacheStamp_("subcommittees")
            : "na",
    ].join("_");
    return ("meeting_lookup_bundle_current_" +
        _normalizeLookupText_(category || "all") +
        "_" +
        cacheTokens);
}
function _getMeetingLookupBundle_(category) {
    var cache = _AppScriptCache_(), cacheKey = _meetingLookupBundleCacheKey_(category);
    try {
        var cached = cache.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
    }
    catch (_cacheReadErr) {
        _recordWarning_("ec", _cacheReadErr);
    }
    var petitioners = _distinctLookupRowsByName_(_Domain_getPetitioners().map(function (x) {
        return {
            name: _normalizeLookupText_(x && x.name),
            phone: _normalizeLookupText_(x && x.phone),
            position: "",
            source: "petitioners",
        };
    })), comms = _distinctLookupRowsByName_(_activeLookupNameRows_(_Domain_getPersonnelComms(), "comms")), staffs = _distinctLookupRowsByName_(_activeLookupNameRows_(_Domain_getPersonnelStaffs(), "staffs")), ops = _distinctLookupRowsByName_(_activeLookupNameRows_(_Domain_getPersonnelOps(), "ops")), subcommittees = _distinctLookupRowsByName_((typeof _Domain_getSubcommitteeList == "function" ? _Domain_getSubcommitteeList() : [])
        .map(function (x) {
        return {
            name: _normalizeLookupText_(x && x.name),
            phone: "",
            position: "subcommittee",
            source: "subcommittees",
        };
    })
        .filter(function (x) {
        return x.name;
    })), proposer, bundle = {
        petitioners,
        proposer: _appTextValue_(category).trim() === "กรรมาธิการเสนอญัตติ" ? comms : petitioners,
        assignees: comms,
        coAssignees: staffs,
        staffs: ops,
        opStaff: ops,
        subcommittees,
        bundles: {
            petitioners, comms, staffs, ops, subcommittees
        },
    };
    try {
        safeCachePut_(cache, cacheKey, bundle, _LOOKUP_BUNDLE_CACHE_TTL_);
    }
    catch (_cacheWriteErr) {
        _recordWarning_("ec", _cacheWriteErr);
    }
    return bundle;
}
function _Domain_getMeetingLookupOptions(payload) {
    var category = _normalizeLookupText_((payload = payload || {}).category || payload.cat), query = _normalizeLookupText_(payload.query || payload.q), limit = Math.max(20, Math.min(Number(payload.limit || 120) || 120, 300)), result = getLookupBundle_("meeting", query, category, limit);
    return ((result.meta = {
        category,
        query: _normalizeLookupQuery_(query),
        limit,
        generatedAt: new Date().toISOString(),
        cacheTtlSec: _LOOKUP_BUNDLE_CACHE_TTL_,
    }),
        Object.keys(result).forEach(function (key) {
            Array.isArray(result[key]) && (result[key] = result[key].slice(0, limit));
        }),
        result);
}
var THAILAND_LOCATION_SHEET_NAME_ = "ThailandLocations", THAILAND_LOCATION_INDEX_ = null;
function _getThailandLocationFlatRows_() {
    var cacheKey = "th_loc_flat_current|" + _entityCacheStamp_("thailandlocations"), cache = _AppScriptCache_();
    try {
        var cached = cache.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
    }
    catch (_cacheReadErr) {
        _recordWarning_("ec", _cacheReadErr);
    }
    var sh = getSheet_(THAILAND_LOCATION_SHEET_NAME_), data = getSheetMatrix_(sh, 4), rows = [];
    if (data.length > 1)
        for (var headerMap = _headerMap_((data[0] || []).map(function (v) {
            return _appTextValue_(v).trim();
        })), cProvince = headerMap.province, cDistrict = headerMap.district, cSubDistrict = headerMap.subDistrict > -1
            ? headerMap.subDistrict
            : headerMap.subdistrict, cZip = headerMap.zip > -1 ? headerMap.zip : headerMap.postalCode, i = 1; i < data.length; i++) {
            var province = String(cProvince > -1 ? data[i][cProvince] : "").trim(), district = String(cDistrict > -1 ? data[i][cDistrict] : "").trim(), subDistrict = String(cSubDistrict > -1 ? data[i][cSubDistrict] : "").trim(), zip = String(cZip > -1 ? data[i][cZip] : "").trim();
            province &&
                district &&
                subDistrict &&
                rows.push({
                    province, district, subDistrict, zip
                });
        }
    try {
        safeCachePut_(cache, cacheKey, rows, 21600);
    }
    catch (_cacheWriteErr) {
        _recordWarning_("ec", _cacheWriteErr);
    }
    return rows;
}
function _thailandLocationTree_() {
    var rows = _getThailandLocationFlatRows_();
    if (!rows.length)
        return [];
    var provinceMap = {};
    return (rows.forEach(function (row) {
        var province = provinceMap[row.province];
        province ||
            (province = provinceMap[row.province] =
                {
                    name: row.province, districts: []
                });
        for (var district = null, i = 0; i < province.districts.length; i++)
            if (_appTextValue_(province.districts[i].name) === row.district) {
                district = province.districts[i];
                break;
            }
        (district ||
            ((district = {
                name: row.district, subDistricts: []
            }),
                province.districts.push(district)),
            district.subDistricts.push({
                name: row.subDistrict, zip: row.zip
            }));
    }),
        Object.keys(provinceMap).map(function (key) {
            return provinceMap[key];
        }));
}
function _buildThailandLocationIndex_() {
    if (THAILAND_LOCATION_INDEX_)
        return THAILAND_LOCATION_INDEX_;
    var tree = _thailandLocationTree_(), index = {
        provinces: {},
        districts: {},
        subDistricts: {},
        postalCodeMap: {},
    };
    return ((Array.isArray(tree) ? tree : []).forEach(function (province) {
        var provinceName = _appTextValue_(province && province.name).trim();
        provinceName &&
            ((index.provinces[provinceName] = province),
                (Array.isArray(province && province.districts)
                    ? province.districts
                    : []).forEach(function (district) {
                    var districtName = _appTextValue_(district && district.name).trim();
                    if (districtName) {
                        var districtKey = provinceName + "|" + districtName;
                        ((index.districts[districtKey] = district),
                            (Array.isArray(district && district.subDistricts)
                                ? district.subDistricts
                                : []).forEach(function (subDistrict) {
                                var subName = _appTextValue_(subDistrict && subDistrict.name).trim();
                                if (subName) {
                                    var subKey = districtKey + "|" + subName;
                                    ((index.subDistricts[subKey] = subDistrict),
                                        (index.postalCodeMap[subKey] = _appTextValue_(subDistrict && subDistrict.zip).trim()));
                                }
                            }));
                    }
                }));
    }),
        (THAILAND_LOCATION_INDEX_ = index),
        index);
}
function _thailandLocationRowsFromIndex_(payload) {
    payload = payload || {};
    var province = _appTextValue_(payload.province).trim(), district = _appTextValue_(payload.district).trim(), subDistrict = _appTextValue_(payload.subDistrict || payload.subdistrict).trim(), index = _buildThailandLocationIndex_();
    if (province && !district && !subDistrict && index.provinces[province])
        return [
            index.provinces[province]
        ];
    if (province && district && !subDistrict) {
        var districtKey = province + "|" + district;
        if (index.districts[districtKey])
            return [
                {
                    name: province, districts: [
                        index.districts[districtKey]
                    ]
                }
            ];
    }
    if (province && district && subDistrict) {
        var subKey = province + "|" + district + "|" + subDistrict;
        if (index.subDistricts[subKey])
            return [
                {
                    name: province,
                    districts: [
                        {
                            name: district, subDistricts: [
                                index.subDistricts[subKey]
                            ]
                        },
                    ],
                },
            ];
    }
    return null;
}
function _thailandLocationCacheKey_(payload) {
    return ((payload = payload || {}),
        "th_loc_current|" +
            [
                _appTextValue_(payload.province),
                _appTextValue_(payload.district),
                _appTextValue_(payload.subDistrict || payload.subdistrict),
                _appTextValue_(payload.query || payload.q),
                payload.summaryOnly ? "1" : "0",
                _entityCacheStamp_("thailandlocations"),
            ].join("|"));
}
function _thailandLocationSummary_(rows) {
    return (rows = Array.isArray(rows) ? rows : []).map(function (p) {
        var districts = Array.isArray(p && p.districts) ? p.districts : [], subDistrictCount = districts.reduce(function (total, district) {
            return (total +
                (Array.isArray(district && district.subDistricts)
                    ? district.subDistricts.length
                    : 0));
        }, 0);
        return {
            name: _appTextValue_(p && p.name),
            districtCount: districts.length,
            subDistrictCount,
        };
    });
}
function _thailandLocationFilter_(payload) {
    payload = payload || {};
    var province = _appTextValue_(payload.province).trim(), district = _appTextValue_(payload.district).trim(), subDistrict = _appTextValue_(payload.subDistrict || payload.subdistrict).trim(), query = _appTextValue_(payload.query || payload.q)
        .trim()
        .toLowerCase(), rows = _thailandLocationRowsFromIndex_(payload) || _thailandLocationTree_();
    return (province &&
        (rows = rows.filter(function (p) {
            return _appTextValue_(p && p.name) === province;
        })),
        district &&
            (rows = rows
                .map(function (p) {
                var districts = (Array.isArray(p && p.districts) ? p.districts : []).filter(function (d) {
                    return _appTextValue_(d && d.name) === district;
                });
                return {
                    name: _appTextValue_(p && p.name), districts
                };
            })
                .filter(function (p) {
                return p.districts.length;
            })),
        subDistrict &&
            (rows = rows
                .map(function (p) {
                var districts = (Array.isArray(p && p.districts) ? p.districts : [])
                    .map(function (d) {
                    var subs = (Array.isArray(d && d.subDistricts) ? d.subDistricts : []).filter(function (s) {
                        return _appTextValue_(s && s.name) === subDistrict;
                    });
                    return {
                        name: _appTextValue_(d && d.name), subDistricts: subs
                    };
                })
                    .filter(function (d) {
                    return d.subDistricts.length;
                });
                return {
                    name: _appTextValue_(p && p.name), districts
                };
            })
                .filter(function (p) {
                return p.districts.length;
            })),
        query &&
            (rows = rows
                .map(function (p) {
                var provinceName = _appTextValue_(p && p.name), districts = (Array.isArray(p && p.districts) ? p.districts : [])
                    .map(function (d) {
                    var districtName = _appTextValue_(d && d.name), subs = (Array.isArray(d && d.subDistricts) ? d.subDistricts : []).filter(function (s) {
                        return ([
                            provinceName,
                            districtName,
                            _appTextValue_(s && s.name),
                            _appTextValue_(s && s.zip),
                        ]
                            .join(" ")
                            .toLowerCase()
                            .indexOf(query) !== -1);
                    });
                    return (districtName.toLowerCase().indexOf(query) === -1 ||
                        subs.length ||
                        (subs = Array.isArray(d && d.subDistricts) ? d.subDistricts : []),
                        {
                            name: districtName, subDistricts: subs
                        });
                })
                    .filter(function (d) {
                    return (d.subDistricts.length ||
                        d.name.toLowerCase().indexOf(query) !== -1);
                });
                return (provinceName.toLowerCase().indexOf(query) === -1 ||
                    districts.length ||
                    (districts = Array.isArray(p && p.districts) ? p.districts : []),
                    {
                        name: provinceName, districts
                    });
            })
                .filter(function (p) {
                return (p.districts.length || p.name.toLowerCase().indexOf(query) !== -1);
            })),
        rows);
}
function _Domain_getThailandLocations(payload) {
    payload = payload || {};
    var cache = _AppScriptCache_(), cacheKey = _thailandLocationCacheKey_(payload);
    try {
        var cached = cache.get(cacheKey);
        if (cached)
            return ok_(JSON.parse(cached), "โหลดข้อมูลจังหวัด/อำเภอสำเร็จ");
    }
    catch (_cacheReadErr) {
        _recordWarning_("ec", _cacheReadErr);
    }
    var rows = _thailandLocationFilter_(payload), summaryOnly = !!payload.summaryOnly, province = _appTextValue_(payload.province).trim(), result;
    result = summaryOnly
        ? {
            provinces: _thailandLocationSummary_(rows),
            totalProvinces: rows.length,
        }
        : {
            rows,
            provinces: rows,
            totalProvinces: rows.length,
            province: province || "",
            districtOptions: rows[0] && Array.isArray(rows[0].districts)
                ? rows[0].districts.map(function (d) {
                    return _appTextValue_(d && d.name);
                })
                : [],
            subDistrictOptions: rows[0] &&
                rows[0].districts &&
                rows[0].districts[0] &&
                Array.isArray(rows[0].districts[0].subDistricts)
                ? rows[0].districts[0].subDistricts.map(function (s) {
                    return {
                        name: _appTextValue_(s && s.name), zip: _appTextValue_(s && s.zip)
                    };
                })
                : [],
        };
    try {
        safeCachePut_(cache, cacheKey, result, 1800);
    }
    catch (_cacheWriteErr) {
        _recordWarning_("ec", _cacheWriteErr);
    }
    return ok_(result, province && !rows.length
        ? "ไม่พบข้อมูลจังหวัด"
        : "โหลดข้อมูลจังหวัด/อำเภอสำเร็จ");
}

PeopleDomain.getMeetingLookupOptions = function (payload) {
    return _Domain_getMeetingLookupOptions(payload || {});
};
PetitionerDomain.getThailandLocations = function (payload) {
    return _Domain_getThailandLocations(payload || {});
};
PeopleDomain.referenceDataStatus = function () {
    return {
        ok: true,
        owner: "Code_33_Domain_People.gs",
        meetingLookupOwner: true,
        thailandLocationOwner: true,
        noNewFiles: true,
        stamp: "r214-people-reference-data-owner"
    };
};

PetitionerDomain.OWNER_CONTRACT_CURRENT = Object.assign({}, PeopleDomain.OWNER_CONTRACT_CURRENT, {
    owner: "PetitionerDomain",
    sourceOfTruth: [
        "Petitioners", "MainData-related-counts"
    ],
    readOwner: "PetitionerDomain.getList",
    writeOwner: "PetitionerDomain.save/delete"
});
PeopleDomain.status = PeopleDomain.status || function () {
    return {
        ok: !0,
        owner: "PeopleDomain",
        version: PeopleDomain.VERSION || "people-domain-final-current",
        contract: PeopleDomain.OWNER_CONTRACT,
        phase5: PeopleDomain.OWNER_CONTRACT_CURRENT,
        uiDomChanged: !1,
        businessLogicChanged: !1,
        apiNamesPreserved: !0
    };
};
PetitionerDomain.status = function () {
    return {
        ok: !0,
        owner: "PetitionerDomain",
        phase5: PetitionerDomain.OWNER_CONTRACT_CURRENT,
        uiDomChanged: !1,
        businessLogicChanged: !1,
        apiNamesPreserved: !0
    };
};
function apiGetPeoplePageBundle(payload) {
    return _appIsFnName_("_withHotApiTelemetry_") ? _withHotApiTelemetry_("apiGetPeoplePageBundle", payload || {}, "people.pageBundle", function (p) {
        return PeopleDomain.getPageBundle(p || {});
    }) : PeopleDomain.getPageBundle(payload || {});
}
function _peopleInvalidatePersonnelDomains_(reason) {
    try {
        _appIsFnName_("_AppCacheInvalidateDomain_") && (_AppCacheInvalidateDomain_("personnel"), _AppCacheInvalidateDomain_("dashboard"));
    }
    catch (_cacheErr) {
        _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _cacheErr) : _appIsFnName_("_logWarn_") ? _logWarn_("ec", {
            error: String(_cacheErr && _cacheErr.message || _cacheErr)
        }) : void _cacheErr;
    }
    try {
        _peopleMarkDirtyDomains_([
            "people", "dashboard"
        ], reason || "people-write");
    }
    catch (_dirtyErr) {
        _appIsFnName_("_recordWarning_") ? _recordWarning_("ec", _dirtyErr) : _appIsFnName_("_logWarn_") ? _logWarn_("ec", {
            error: String(_dirtyErr && _dirtyErr.message || _dirtyErr)
        }) : void _dirtyErr;
    }
}
function apiDeletePersonnelComm(payload) {
    return _peopleApiMutatePersonnel_(payload, "comms", "delete");
}
function apiDeletePersonnelOp(payload) {
    return _peopleApiMutatePersonnel_(payload, "ops", "delete");
}
function apiDeletePersonnelStaff(payload) {
    return _peopleApiMutatePersonnel_(payload, "staffs", "delete");
}
function apiDeletePersonnelSubcommittee(payload) {
    return _peopleApiMutatePersonnel_(payload, "subcommitteeMembers", "delete");
}
function apiSavePersonnelComm(payload) {
    return _peopleApiMutatePersonnel_(payload, "comms", "save");
}
function apiSavePersonnelSubcommittee(payload) {
    return _peopleApiMutatePersonnel_(payload, "subcommitteeMembers", "save");
}
function apiSavePersonnelOp(payload) {
    return _peopleApiMutatePersonnel_(payload, "ops", "save");
}
function apiSavePersonnelStaff(payload) {
    return _peopleApiMutatePersonnel_(payload, "staffs", "save");
}
function _petitionerRelatedNormalizeText_(value) {
    return String(null == value ? "" : value).replace(/\s+/g, " ").trim().toLowerCase();
}
function _petitionerRelatedMainDataRows_() {
    var rows = [];
    try {
        _appIsFnName_("_caseProjectedRows_") && (rows = _caseProjectedRows_([
            "caseId", "id", "caseNum", "recNo", "receiveNo", "title", "caseTitle", "subject", "petitioners", "petitioner", "petitionerName", "requester", "complainant", "ผู้ร้อง", "ผู้ร้องเรียน", "ชื่อผู้ร้อง", "ชื่อผู้ร้องเรียน", "ผู้ร้อง/ผู้ร้องเรียน", "petitionerPhone", "phone", "tel", "mobile", "address", "fullAddress", "addressLine", "subDistrict", "subdistrict", "district", "province", "postalCode", "ตำบล", "แขวง", "อำเภอ", "เขต", "จังหวัด", "รหัสไปรษณีย์", "status", "recDate", "receiveDate", "dateReceived", "createdAt", "updatedAt", "isDeleted", "deletedAt"
        ], 60) || []);
    }
    catch (_caseProjectedErr) {
        rows = [];
    }
    if (!Array.isArray(rows) || !rows.length)
        try {
            _appIsFnName_("_listMainDataRows_") && (rows = _listMainDataRows_(!1) || []);
        }
        catch (_listErr) {
            rows = [];
        }
    if (!Array.isArray(rows) || !rows.length)
        try {
            rows = _peopleDataServiceRows_("MainData", [], {
                includeDeleted: !1, ttl: 60, owner: "people.mainDataRead"
            }) || [];
        }
        catch (_cachedErr) {
            rows = [];
        }
    if (!Array.isArray(rows) || !rows.length)
        try {
            "function" == typeof readSheetObjects_ && (rows = readSheetObjects_("MainData", {
                includeDeleted: !1
            }) || []);
        }
        catch (_readErr) {
            rows = [];
        }
    return (Array.isArray(rows) ? rows : []).filter(function (row) {
        return !(row && (!0 === row.isDeleted || "true" === String(row.isDeleted || row.deleted || "").toLowerCase() || "1" === String(row.isDeleted || row.deleted || "")));
    });
}
function _petitionerRelatedCaseHaystack_(row) {
    return _petitionerRelatedNormalizeText_([
        (row = row || {}).petitioners, row.petitioner, row.petitionerName, row.requester, row.complainant, row["ผู้ร้อง"], row["ผู้ร้องเรียน"], row["ชื่อผู้ร้อง"], row["ชื่อผู้ร้องเรียน"], row["ผู้ร้อง/ผู้ร้องเรียน"], row.title, row.caseTitle, row.subject, row.recNo, row.caseNum
    ].join(" "));
}
function _petitionerRelatedCaseDto_(row) {
    return row = row || {}, {
        caseId: String(row.caseId || row.id || "").trim(), caseNum: String(row.caseNum || row.caseNo || "").trim(), recNo: String(row.recNo || row.receiveNo || row["เลขรับ"] || row["เลขรับเรื่อง"] || "").trim(), title: String(row.title || row.caseTitle || row.subject || row["เรื่อง"] || row["เรื่องพิจารณา"] || "").trim(), caseTitle: String(row.caseTitle || row.title || row.subject || "").trim(), petitioners: String(row.petitioners || row.petitioner || row.petitionerName || row["ผู้ร้อง"] || row["ผู้ร้องเรียน"] || "").trim(), status: String(row.status || row.caseStatus || row["สถานะ"] || row["สถานะเรื่อง"] || "").trim(), recDate: row.recDate || row.receiveDate || row.dateReceived || row["วันที่รับเรื่อง"] || "", receiveDate: row.receiveDate || row.recDate || row.dateReceived || "", updatedAt: row.updatedAt || row.createdAt || "", createdAt: row.createdAt || ""
    };
}
/** Performance J: persistent petitioner and related-case indexes. */
function _peoplePetitionerSnapshot_(forceFresh) {
    var role = "viewer", targetKey = "complainants-only-current";
    if (!forceFresh && _appIsFnName_("_persistentSummarySnapshotRead_")) {
        var persisted = _persistentSummarySnapshotRead_("petitioners", targetKey, role, { ttlSeconds: 1800 });
        if (persisted && persisted.ok && persisted.bundle && Array.isArray(persisted.bundle.rows))
            return { rows: persisted.bundle.rows, source: "PetitionerPersistentSnapshot.current", persistentSnapshotHit: !0 };
    }
    var rows = _Domain_getPetitioners();
    rows = (Array.isArray(rows) ? rows : []).map(_peoplePetitionerNormalize_).filter(function (row) { return row && row.name; });
    try {
        _appIsFnName_("_persistentSummarySnapshotWrite_") && _persistentSummarySnapshotWrite_("petitioners", targetKey, role, { rows: rows }, { ttlSeconds: 1800, source: "PetitionerPersistentSnapshot.current" });
    }
    catch (_snapshotErr) { _appIsFnName_("_recordWarning_") && _recordWarning_("petitioner.snapshot.write", _snapshotErr); }
    return { rows: rows, source: "PetitionerLiveRead.current", persistentSnapshotHit: !1 };
}
function _peoplePetitionerRelatedSnapshot_(forceFresh) {
    var role = "viewer", targetKey = "related-cases-complainants-only-current";
    if (!forceFresh && _appIsFnName_("_persistentSummarySnapshotRead_")) {
        var persisted = _persistentSummarySnapshotRead_("petitioners", targetKey, role, { ttlSeconds: 1800 });
        if (persisted && persisted.ok && persisted.bundle && Array.isArray(persisted.bundle.rows))
            return { rows: persisted.bundle.rows, source: "PetitionerRelatedPersistentSnapshot.current", persistentSnapshotHit: !0 };
    }
    var rows = _petitionerRelatedMainDataRows_().map(function (row) {
        return { hay: _petitionerRelatedCaseHaystack_(row), dto: _petitionerRelatedCaseDto_(row) };
    }).filter(function (item) { return item.hay; });
    try {
        _appIsFnName_("_persistentSummarySnapshotWrite_") && _persistentSummarySnapshotWrite_("petitioners", targetKey, role, { rows: rows }, { ttlSeconds: 1800, source: "PetitionerRelatedPersistentSnapshot.current" });
    }
    catch (_snapshotErr) { _appIsFnName_("_recordWarning_") && _recordWarning_("petitioner.relatedSnapshot.write", _snapshotErr); }
    return { rows: rows, source: "PetitionerRelatedLiveRead.current", persistentSnapshotHit: !1 };
}
function _peoplePetitionerSearchText_(row) {
    return _peopleNormalizedSearchKey_([row && row.petId, row && row.name, row && row.phone, row && row.address, row && row.addressLine, row && row.subDistrict, row && row.district, row && row.province, row && row.postalCode]);
}
function _peoplePetitionerCountsForNames_(names, includeRows, limit, forceFresh) {
    var snapshot = _peoplePetitionerRelatedSnapshot_(forceFresh), counts = {}, rowsByName = {};
    names.forEach(function (name) { counts[name] = 0; rowsByName[name] = []; });
    snapshot.rows.forEach(function (item) {
        names.forEach(function (name) {
            var normalized = _petitionerRelatedNormalizeText_(name);
            if (normalized && (item.hay.indexOf(normalized) !== -1 || normalized.indexOf(item.hay) !== -1)) {
                counts[name] += 1;
                if (includeRows && rowsByName[name].length < limit)
                    rowsByName[name].push(item.dto);
            }
        });
    });
    return { counts: counts, rowsByName: rowsByName, source: snapshot.source, persistentSnapshotHit: snapshot.persistentSnapshotHit };
}
function apiGetPetitionerRelatedCounts(payload) {
    var _auth = _peopleSafeReq_(payload || {}, "viewer", "apiGetPetitionerRelatedCounts");
    if (!_auth.ok)
        return _auth.result;
    payload = _auth.payload;
    var names = Array.isArray(payload.names) ? payload.names.map(function (name) { return String(name || "").trim(); }).filter(Boolean) : [],
        includeRows = !0 === payload.includeRows || "true" === String(payload.includeRows || "").toLowerCase(),
        limit = Math.max(1, Math.min(Number(payload.limit || 50) || 50, 100));
    if (!names.length)
        return ok_({ counts: {}, rowsByName: {}, rows: [], total: 0, authoritative: !0, authoritativeEmpty: !0 }, "โหลดจำนวนเรื่องที่เกี่ยวข้องสำเร็จ");
    try {
        var result = _peoplePetitionerCountsForNames_(names, includeRows, limit, !0 === payload.forceFresh), first = names[0];
        return ok_({
            counts: result.counts, rowsByName: result.rowsByName, rows: result.rowsByName[first] || [], total: result.counts[first] || 0,
            source: result.source, persistentSnapshotHit: result.persistentSnapshotHit, authoritative: !0,
            authoritativeEmpty: !(result.counts[first] || 0), fallbackAllowed: !1
        }, "โหลดจำนวนเรื่องที่เกี่ยวข้องสำเร็จ");
    }
    catch (e) {
        return ok_({ counts: {}, rowsByName: {}, rows: [], total: 0, loadOk: !1, authoritative: !1, fallbackAllowed: !0, warning: String(e && e.message || e) }, "โหลดจำนวนเรื่องที่เกี่ยวข้องแบบจำกัด");
    }
}
function _peoplePetitionerText_(v) {
    return null == v ? "" : String(v).trim();
}
function _peoplePetitionerPick_(row, keys) {
    row = row && "object" == typeof row ? row : {};
    for (var i = 0; i < keys.length; i++) {
        var v = row[keys[i]];
        if (null != v && "" !== String(v).trim())
            return v;
    }
    return "";
}
function _peoplePetitionerSplit_(value) {
    return _peoplePetitionerText_(value).split(/[\n,;、]+/).map(function (x) {
        return String(x || "").trim();
    }).filter(Boolean);
}
function _peoplePetitionerNormalize_(row, idx) {
    row = row && "object" == typeof row ? row : {};
    var name = _peoplePetitionerPick_(row, [
        "name", "fullName", "fullname", "personName", "petitionerName", "requester", "complainant", "petitioners", "ผู้ร้อง", "ผู้ร้องเรียน", "ชื่อผู้ร้อง", "ชื่อผู้ร้องเรียน", "ผู้ร้อง/ผู้ร้องเรียน", "ชื่อ-สกุล"
    ]), addr = _peopleCanonicalPetitionerAddress_(row);
    return Object.assign({}, row, {
        petId: _peoplePetitionerText_(_peoplePetitionerPick_(row, [
            "petId", "id", "uid", "rowId", "เลขที่"
        ]) || "PET-" + (idx + 1)),
        name: _peoplePetitionerText_(name),
        phone: _appPhoneForDisplay_(_peoplePetitionerPick_(row, [
            "phone", "tel", "mobile", "petitionerPhone", "เบอร์โทรศัพท์", "โทรศัพท์"
        ])),
        addressLine: addr.addressLine,
        subDistrict: addr.subDistrict,
        district: addr.district,
        province: addr.province,
        postalCode: addr.postalCode,
        address: addr.address,
        relatedCount: Number(row.relatedCount || row.caseCount || 0) || 0
    });
}
function _peoplePetitionerRowsFromMainData_() {
    var rows = [];
    try {
        var cases = [];
        _appIsFnName_("_peopleDataServiceRows_") ? cases = _peopleDataServiceRows_("MainData", [], {
            includeDeleted: !1, ttl: 120, owner: "people.petitionerMainData"
        }) || [] : _appIsFnName_("_listMainDataRows_") && (cases = _listMainDataRows_(!1) || []);
        var map = {};
        (Array.isArray(cases) ? cases : []).forEach(function (row) {
            row = row && "object" == typeof row ? row : {};
            var names = [], nameFields = [
                "petitioners", "petitioner", "petitionerName", "requester", "complainant", "ผู้ร้อง", "ผู้ร้องเรียน", "ชื่อผู้ร้อง", "ชื่อผู้ร้องเรียน", "ผู้ร้อง/ผู้ร้องเรียน"
            ];
            nameFields.forEach(function (field) {
                _peoplePetitionerSplit_(row[field]).forEach(function (name) {
                    names.push(name);
                });
            });
            var uniqueNames = [], seenNames = {};
            names.forEach(function (name) {
                var normalizedName = String(name || "").replace(/\s+/g, " ").trim().toLowerCase();
                normalizedName && !seenNames[normalizedName] && (seenNames[normalizedName] = !0, uniqueNames.push(name));
            });
            names = uniqueNames;
            var addr = _peopleCanonicalPetitionerAddress_(row), phone = _appPhoneForDisplay_(_peoplePetitionerPick_(row, [
                "petitionerPhone", "phone", "tel", "mobile", "เบอร์โทรศัพท์", "โทรศัพท์"
            ]));
            names.forEach(function (name) {
                var key = name.replace(/\s+/g, " ").trim().toLowerCase();
                if (!key)
                    return;
                map[key] || (map[key] = {
                    petId: "PET-" + (Object.keys(map).length + 1), name: name, phone: phone,
                    addressLine: addr.addressLine, subDistrict: addr.subDistrict, district: addr.district,
                    province: addr.province, postalCode: addr.postalCode, address: addr.address, relatedCount: 0
                });
                phone && !map[key].phone && (map[key].phone = phone);
                ["addressLine", "subDistrict", "district", "province", "postalCode", "address"].forEach(function (field) {
                    !map[key][field] && addr[field] && (map[key][field] = addr[field]);
                });
                map[key].relatedCount = (Number(map[key].relatedCount) || 0) + 1;
            });
        });
        rows = Object.keys(map).map(function (key) { return map[key]; });
    }
    catch (e) {
        _appIsFnName_("_recordWarning_") && _recordWarning_("people.petitioner.mainDataRead", e);
    }
    return rows;
}
function _petitionerGetListDomainOwner_(payload) {
    var _auth = _peopleSafeReq_(payload, "viewer", "apiGetPetitioners");
    if (!_auth.ok)
        return _auth.result;
    payload = _auth.payload;
    var explicitPaging = Object.prototype.hasOwnProperty.call(payload, "page") || Object.prototype.hasOwnProperty.call(payload, "limit") || Object.prototype.hasOwnProperty.call(payload, "pageSize") || !0 === payload.serverPaged,
        page = Math.max(1, Number(payload.page || 1) || 1), limit = Math.max(10, Math.min(Number(payload.limit || payload.pageSize || 25) || 25, 100)),
        query = _peopleNormalizedSearchKey_(payload.query || payload.q || payload.keyword || ""), snapshot;
    try { snapshot = _peoplePetitionerSnapshot_(!0 === payload.forceFresh); }
    catch (e) { snapshot = { rows: [], source: "PetitionerReadFailed.current", persistentSnapshotHit: !1, warning: String(e && e.message || e) }; }
    var rows = (snapshot.rows || []).filter(function (row) { return !query || _peoplePetitionerSearchText_(row).indexOf(query) !== -1; }).sort(function (a, b) {
        var an = Number(String(a.petId || "").replace(/[^0-9]/g, "")) || 0, bn = Number(String(b.petId || "").replace(/[^0-9]/g, "")) || 0;
        return an !== bn ? an - bn : String(a.name || "").localeCompare(String(b.name || ""), "th");
    }), total = rows.length, totalPages, start, pageRows;
    if (explicitPaging) {
        totalPages = Math.max(1, Math.ceil(total / limit));
        page = Math.min(page, totalPages);
        start = (page - 1) * limit;
        pageRows = rows.slice(start, start + limit);
    }
    else {
        page = 1;
        limit = Math.max(1, total || 1);
        totalPages = 1;
        start = 0;
        pageRows = rows.slice();
    }
    var names = pageRows.map(function (row) { return String(row.name || "").trim(); }).filter(Boolean);
    try {
        var related = _peoplePetitionerCountsForNames_(names, !1, 1, !1);
        pageRows = pageRows.map(function (row) { row = Object.assign({}, row); row.relatedCount = Number(related.counts[row.name] || row.relatedCount || 0) || 0; return row; });
    }
    catch (_relatedErr) { _appIsFnName_("_recordWarning_") && _recordWarning_("petitioner.list.relatedCounts", _relatedErr); }
    var data = {
        rows: pageRows, items: pageRows, records: pageRows, data: pageRows, totalRecords: total, total: total, page: page, limit: limit,
        pageSize: limit, totalPages: totalPages, serverPaged: explicitPaging, authoritative: !0, authoritativeEmpty: total === 0, fallbackAllowed: !1,
        query: query, source: snapshot.source, persistentSnapshotHit: !!snapshot.persistentSnapshotHit, relatedCountsIncluded: !0,
        loadOk: !0, degraded: !1, performancePetitionerServerPagingJ: !0
    }, res = ok_(data, "โหลดข้อมูลผู้ร้องเรียนสำเร็จ");
    res.rows = pageRows; res.items = pageRows; res.records = pageRows; res.totalRecords = total; res.total = total; res.page = page; res.limit = limit; res.totalPages = totalPages; res.serverPaged = explicitPaging;
    return res;
}
PetitionerDomain.getList = function (payload) {
    return _petitionerGetListDomainOwner_(payload || {});
};
function apiGetPetitioners(payload) {
    return PetitionerDomain.getList(payload || {});
}
AdminDomain.VERSION = "admin-domain-final-current", AdminDomain.normalizeUserRows = function (result) {
    var data = result && result.data && "object" == typeof result.data ? result.data : result, rows;
    return (Array.isArray(data) ? data : Array.isArray(data && data.rows) ? data.rows : Array.isArray(data && data.data) ? data.data : Array.isArray(data && data.items) ? data.items : []).map(function (row, idx) {
        return row = row || {}, {
            username: String(row.username || row.user || row.email || row["ชื่อผู้ใช้"] || "").trim(), name: String(row.name || row.fullName || row.displayName || row["ชื่อ-สกุล"] || row["ชื่อ"] || "").trim(), email: String(row.email || row.mail || row["อีเมล"] || "").trim(), role: String(row.role || row.userRole || row["ระดับสิทธิ์"] || (0 === idx ? "Admin" : "Viewer")).trim() || "Viewer", active: String(row.active || row.isActive || row.status || row["สถานะ"] || "Y").trim() || "Y"
        };
    }).filter(function (row) {
        return row.username || row.name || row.email;
    });
}, AdminDomain.listUsers = function (payload) {
    payload = payload || {};
    try {
        _appIsFnName_("_routerReq_") && (payload = _routerReq_(payload, "admin"));
        var stamp = _appIsFnName_("_entityCacheStamp_") ? _entityCacheStamp_("users") : "1", cacheKey = "admin_users_current_" + String(stamp || "1");
        if (!payload.forceFresh && !payload.noCache && !payload.bypassCache && _appIsFnName_("_AppCacheGetJson_")) {
            var cached = _AppCacheGetJson_(cacheKey);
            if (cached && Array.isArray(cached.rows)) {
                var hit = AdminDomain.rowsEnvelope(cached.rows, "AdminDomain.listUsers", "โหลดรายชื่อผู้ใช้งานสำเร็จ");
                hit.cached = !0;
                hit.cacheStatus = "hit";
                return hit;
            }
        }
        var rows = [];
        try { "function" == typeof _listUsersEnvelope_ && (rows = AdminDomain.normalizeUserRows(_listUsersEnvelope_(payload))); }
        catch (domainErr) { _appIsFnName_("_recordWarning_") && _recordWarning_("AdminDomain.listUsers.domain", domainErr); }
        !rows.length && "undefined" != typeof AppRepository && AppRepository.readObjects && (rows = AdminDomain.normalizeUserRows(AppRepository.readObjects("Users")));
        try { _appIsFnName_("_AppCachePutJson_") && _AppCachePutJson_(cacheKey, { rows: rows }, 300); }
        catch (_cacheErr) { _appIsFnName_("_recordWarning_") && _recordWarning_("admin.users.cachePut", _cacheErr); }
        var out = AdminDomain.rowsEnvelope(rows, "AdminDomain.listUsers", "โหลดรายชื่อผู้ใช้งานสำเร็จ");
        out.cacheStatus = "miss"; out.cached = !1; out.performanceAdminCacheFirstJ = !0;
        return out;
    }
    catch (e) {
        return err_(e && e.message ? e.message : String(e), { rows: [], data: [], items: [], totalRecords: 0, total: 0, owner: "AdminDomain.listUsers" });
    }
}, AdminDomain.saveUser = function (payload) {
    payload = payload || {};
    try {
        return _appIsFnName_("_routerReq_") && (payload = _routerReq_(payload, "admin")), "function" == typeof auditEvent_ && auditEvent_("admin", {
            route: "apiAdminSaveUser", action: String(payload.action || "save")
        }), "function" == typeof _saveUserCanonical_ ? normalizeResult_(_saveUserCanonical_(payload), "บันทึกผู้ใช้งานสำเร็จ", "บันทึกผู้ใช้งานไม่สำเร็จ") : err_("ADMIN_USER_SAVE_OWNER_UNAVAILABLE");
    }
    catch (e) {
        return err_(e && e.message ? e.message : String(e));
    }
}, AdminDomain.deleteUser = function (payload) {
    payload = payload || {};
    try {
        return _appIsFnName_("_routerReq_") && (payload = _routerReq_(payload, "admin")), "function" == typeof auditEvent_ && auditEvent_("admin", {
            route: "apiAdminDeleteUser", username: payload.username || payload.oldUsername || ""
        }), "function" == typeof _deactivateUserCanonical_ ? normalizeResult_(_deactivateUserCanonical_(payload), "ลบ/ระงับผู้ใช้งานสำเร็จ", "ลบ/ระงับผู้ใช้งานไม่สำเร็จ") : err_("ADMIN_USER_DELETE_OWNER_UNAVAILABLE");
    }
    catch (e) {
        return err_(e && e.message ? e.message : String(e));
    }
}, AdminDomain.rowsEnvelope = function (rows, owner, msg) {
    return rows = Array.isArray(rows) ? rows : [], ok_({
        rows: rows, data: rows, items: rows, totalRecords: rows.length, total: rows.length, owner: owner, domainOwner: "AdminDomain"
    }, msg || "โหลดข้อมูลสำเร็จ");
}, AdminDomain.listSubcommittees = function (payload) {
    payload = payload || {};
    try {
        var rows = "function" == typeof _Domain_getSubcommitteeList ? _Domain_getSubcommitteeList() : [];
        return AdminDomain.rowsEnvelope(rows, "AdminDomain.listSubcommittees", "โหลดรายการคณะอนุกรรมาธิการสำเร็จ");
    }
    catch (e) {
        return err_(e && e.message ? e.message : String(e), {
            rows: [], data: [], items: [], totalRecords: 0, total: 0, owner: "AdminDomain.listSubcommittees"
        });
    }
}, AdminDomain.saveSubcommittee = function (payload) {
    return payload = payload || {}, "function" == typeof _Domain_saveSubcommittee ? normalizeResult_(_Domain_saveSubcommittee(payload), "บันทึกคณะอนุกรรมาธิการสำเร็จ", "บันทึกคณะอนุกรรมาธิการไม่สำเร็จ") : err_("ADMIN_SUBCOMMITTEE_SAVE_OWNER_UNAVAILABLE");
}, AdminDomain.deleteSubcommittee = function (payload) {
    payload = payload || {};
    var id = _appIsFnName_("_payloadValue_") ? _payloadValue_(payload, [
        "id", "subcommitteeId"
    ]) : payload.id || payload.subcommitteeId;
    return "function" == typeof _Domain_deleteSubcommittee ? normalizeResult_(_Domain_deleteSubcommittee(id), "ลบคณะอนุกรรมาธิการสำเร็จ", "ลบคณะอนุกรรมาธิการไม่สำเร็จ") : err_("ADMIN_SUBCOMMITTEE_DELETE_OWNER_UNAVAILABLE");
};
