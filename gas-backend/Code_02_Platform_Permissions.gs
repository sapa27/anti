/** Canonical — Canonical permission matrix owner. */
function _permissionDeepFreeze_(value) {
    if (!value || typeof value != "object" || Object.isFrozen(value))
        return value;
    Object.keys(value).forEach(function (key) {
        _permissionDeepFreeze_(value[key]);
    });
    return Object.freeze(value);
}
var APP_PERMISSION_MATRIX = _permissionDeepFreeze_({
    stamp: "permission-matrix-p0-2026-07-30-r212",
    owner: "Code_02_Platform_Permissions.APP_PERMISSION_MATRIX",
    defaultRole: "Viewer",
    roles: {
        Viewer: {
            pages: ["dashboard", "search"],
            deniedApiGroups: ["admin-users", "admin-budget", "budget", "personnel", "petitioners"],
            allowWrites: !1
        },
        Staff: {
            pages: ["dashboard", "meeting", "committee-meeting", "search", "track", "report", "people", "petitioner", "budget"],
            deniedApiGroups: ["admin-users", "admin-budget"],
            allowWrites: !0
        },
        Admin: {
            pages: ["*"],
            deniedApiGroups: [],
            allowWrites: !0
        }
    },
    pageAliases: {
        dash: "dashboard",
        personnel: "people",
        committee: "committee-meeting",
        committeemeeting: "committee-meeting",
        committee_meeting: "committee-meeting",
        tracking: "track"
    },
    apiGroupMinimumRole: {
        budget: "Staff",
        personnel: "Staff",
        petitioners: "Staff",
        "admin-users": "Admin",
        "admin-budget": "Admin",
        "admin-diagnostics": "Admin",
        "admin-release": "Admin",
        "admin-go-live": "Admin",
        "admin-maintenance-final": "Admin"
    },
    deferredAssetMinimumRole: {
        "Scripts_Page_Dashboard": "Viewer",
        "Runtime_01_Request_Lifecycle": "Viewer",
        "Runtime_02_Date_Time": "Viewer",
        "Runtime_03_Table_UI": "Viewer",
        "Runtime_04_Thailand_Location": "Staff",
        "Runtime_05_Status_Aging": "Viewer",
        "Runtime_08_AI_Bridge": "Viewer",
        "Runtime_09_QA_Regression": "Admin",
        "Scripts_Page_ReportTrack::search": "Viewer",
        "Scripts_Page_ReportTrack::reporttrack-common": "Viewer",
        "Scripts_Page_ReportTrack::print": "Viewer",
        "Scripts_Page_Meeting": "Staff",
        "Scripts_Page_Meeting::meeting-common": "Staff",
        "Scripts_Page_Meeting::meeting": "Staff",
        "Scripts_Page_Meeting::committee": "Staff",
        "Scripts_Page_ReportTrack::track": "Staff",
        "Scripts_Page_ReportTrack::report": "Staff",
        "Scripts_Page_Petitioner": "Staff",
        "Scripts_Page_People": "Staff",
        "Scripts_Page_Budget": "Staff",
        "Scripts_Page_Admin": "Admin"
    },
    bundleMinimumRole: {
        appCritical: "Viewer",
        appCore: "Viewer",
        runtimeDateTable: "Viewer",
        runtimeThailandLocation: "Staff",
        runtimeStatusAging: "Viewer",
        runtimeAiBridge: "Viewer",
        runtimeQaRegression: "Admin",
        pageDashboard: "Viewer",
        pageMeeting: "Staff",
        pageCommitteeMeeting: "Staff",
        pageTrackReport: "Staff",
        pagePetitioner: "Staff",
        pagePeople: "Staff",
        pageBudget: "Staff",
        pageAdmin: "Admin",
        pageAiPrint: "Viewer"
    }
});
function _permissionNormalizeRole_(role) {
    var raw = String(role == null ? "" : role).trim(), key = raw.toLowerCase();
    return {
        admin: "Admin", administrator: "Admin", owner: "Admin", superadmin: "Admin", "super-admin": "Admin", ผู้ดูแล: "Admin", ผู้ดูแลระบบ: "Admin",
        staff: "Staff", officer: "Staff", user: "Staff", editor: "Staff", operator: "Staff", เจ้าหน้าที่: "Staff", เจ้าหน้าที่ฝ่ายเลขานุการ: "Staff", เจ้าหน้าที่ฝ่ายปฏิบัติการ: "Staff",
        viewer: "Viewer", view: "Viewer", readonly: "Viewer", "read-only": "Viewer", guest: "Viewer", ผู้ดู: "Viewer", ผู้อ่าน: "Viewer", อ่านอย่างเดียว: "Viewer"
    }[key] || (/admin/i.test(raw) || /ผู้ดูแล/.test(raw) ? "Admin" : /staff|officer|editor|operator|เจ้าหน้าที่|เลขานุการ|ปฏิบัติการ/i.test(raw) ? "Staff" : "Viewer");
}
function _permissionRoleRank_(role) {
    return { Viewer: 1, Staff: 2, Admin: 3 }[_permissionNormalizeRole_(role)] || 1;
}
function _permissionNormalizePage_(page) {
    var key = String(page == null ? "" : page).trim().toLowerCase().replace(/^#?\/?/, "");
    return APP_PERMISSION_MATRIX.pageAliases[key] || key || "dashboard";
}
function _permissionCanPage_(role, page) {
    role = _permissionNormalizeRole_(role), page = _permissionNormalizePage_(page);
    var policy = APP_PERMISSION_MATRIX.roles[role] || APP_PERMISSION_MATRIX.roles.Viewer, pages = policy.pages || [];
    return pages.indexOf("*") >= 0 || pages.indexOf(page) >= 0;
}
function _permissionRequiredRoleForApi_(method, meta) {
    meta = meta || {};
    if (meta.public === !0)
        return "public";
    var base = _permissionNormalizeRole_(meta.minRole || (meta.write === !0 ? "Staff" : "Viewer")), group = String(meta.group || meta.domain || "").trim().toLowerCase(), groupRole = APP_PERMISSION_MATRIX.apiGroupMinimumRole[group] || "Viewer";
    return _permissionRoleRank_(groupRole) > _permissionRoleRank_(base) ? _permissionNormalizeRole_(groupRole) : base;
}
function _permissionCanApi_(role, method, meta) {
    meta = meta || {};
    if (meta.public === !0)
        return !0;
    role = _permissionNormalizeRole_(role);
    var group = String(meta.group || meta.domain || "").trim().toLowerCase(), policy = APP_PERMISSION_MATRIX.roles[role] || APP_PERMISSION_MATRIX.roles.Viewer;
    if ((policy.deniedApiGroups || []).indexOf(group) >= 0)
        return !1;
    if (meta.write === !0 && policy.allowWrites !== !0)
        return !1;
    return _permissionRoleRank_(role) >= _permissionRoleRank_(_permissionRequiredRoleForApi_(method, meta));
}
function _permissionApplyApiPayloadPolicy_(role, method, payload) {
    payload = payload && typeof payload == "object" && !Array.isArray(payload) ? payload : {};
    role = _permissionNormalizeRole_(role), method = String(method || "").trim();
    payload.permissionRole = role;
    payload.permissionMatrixStamp = APP_PERMISSION_MATRIX.stamp;
    if (method === "apiGetDashboardBundle" && role === "Viewer") {
        payload.includeBudget = !1;
        payload.permissionIncludeBudget = !1;
        payload.hideBudget = !0;
    }
    return payload;
}
function _permissionRequiredRoleForDeferredAsset_(name) {
    name = String(name || "").trim();
    var bundle = name.replace(/^bundle:/i, "");
    if (/^bundle:/i.test(name) && APP_PERMISSION_MATRIX.bundleMinimumRole[bundle])
        return APP_PERMISSION_MATRIX.bundleMinimumRole[bundle];
    var direct = APP_PERMISSION_MATRIX.deferredAssetMinimumRole[name];
    if (direct)
        return direct;
    var base = name.split("::")[0];
    return APP_PERMISSION_MATRIX.deferredAssetMinimumRole[base] || (/Admin|Diagnostics|Release|Regression/i.test(base) ? "Admin" : "Viewer");
}
function getAppPermissionMatrix_() {
    return JSON.parse(JSON.stringify(APP_PERMISSION_MATRIX));
}
function getAppPermissionMatrixJson_() {
    return _renderVue3JsonSafe_(getAppPermissionMatrix_(), {});
}
function _permissionMatrixStatus_() {
    var failures = [], viewerAllowed = ["dashboard", "search"], staffAllowed = ["dashboard", "meeting", "committee-meeting", "search", "track", "report", "people", "petitioner", "budget"], allPages = staffAllowed.concat(["admin"]);
    viewerAllowed.forEach(function (page) { _permissionCanPage_("Viewer", page) || failures.push("viewer.allow." + page); });
    allPages.filter(function (page) { return viewerAllowed.indexOf(page) < 0; }).forEach(function (page) { !_permissionCanPage_("Viewer", page) || failures.push("viewer.deny." + page); });
    staffAllowed.forEach(function (page) { _permissionCanPage_("Staff", page) || failures.push("staff.allow." + page); });
    !_permissionCanPage_("Staff", "admin") || failures.push("staff.deny.admin");
    allPages.forEach(function (page) { _permissionCanPage_("Admin", page) || failures.push("admin.allow." + page); });
    _permissionRequiredRoleForApi_("apiBudgetGetSummary", { group: "budget", minRole: "viewer" }) === "Staff" || failures.push("api.budget.staff");
    _permissionRequiredRoleForApi_("apiAdminListUsers", { group: "admin-users", minRole: "admin" }) === "Admin" || failures.push("api.admin.admin");
    return { ok: failures.length === 0, stamp: APP_PERMISSION_MATRIX.stamp, owner: APP_PERMISSION_MATRIX.owner, failures: failures, viewerPages: viewerAllowed, staffPages: staffAllowed, adminPages: allPages, noNewApi: !0, noNewFiles: !0 };
}

