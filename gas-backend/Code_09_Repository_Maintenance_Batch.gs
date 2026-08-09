/** Canonical — Repository maintenance and batch-write owner. */
var __APP_GLOBAL__ = typeof __APP_GLOBAL__ != "undefined" && __APP_GLOBAL__ || typeof globalThis != "undefined" && globalThis || this || {};
/* ==========================================================================
 * r214 Repository maintenance owner
 * Data-quality audit, primary-key migration planning, duplicate cleanup and
 * maintenance-only APIs live with the repository/schema owner. Runtime case
 * CRUD remains in Code_30_Domain_Cases.gs.
 * ========================================================================== */
var AppRepositoryMaintenance = __APP_GLOBAL__.AppRepositoryMaintenance = __APP_GLOBAL__.AppRepositoryMaintenance || {};
function _repoMaintenanceIsArray_(value) {
    return Array.isArray(value);
}
function _meetingDuplicateRowMeta_(sheetName) {
    var sh = getSheet_(sheetName), data = getSheetMatrix_(sh);
    if (!data || data.length <= 1)
        return [];
    var headers = (data[0] || []).map(function (v) {
        return _appTextValue_(v).trim();
    });
    return data
        .slice(1)
        .map(function (row, idx) {
        var obj = {};
        return (headers.forEach(function (h, i) {
            h && (obj[h] = row[i]);
        }),
            (obj._sheetName = sheetName),
            (obj._rowNumber = idx + 2),
            (obj._rowValues = row),
            obj);
    })
        .filter(function (row) {
        return !isSoftDeletedRow_(row);
    });
}
function _meetingDuplicateBusinessKey_(sheetName, row) {
    return ((row = row || {}),
        sheetName === "MainData"
            ? [
                _appTextValue_(row.caseId).trim(),
                _appTextValue_(row.caseNum).trim(),
                _appTextValue_(row.recNo).trim(),
                _normalizedText_(row.title || row.caseTitle || row.subject || ""),
                _normalizedText_(row.petitioners || row.petitionerName || ""),
            ].join("|")
            : sheetName === "MeetingLogs"
                ? [
                    _appTextValue_(row.caseId).trim(),
                    _appTextValue_(row.round).trim(),
                    normalizeDateOutput_(row.meetingDate || row.date || ""),
                    _normalizedText_(row.title || ""),
                    _normalizedText_(row.result || row.note || row.summary || ""),
                ].join("|")
                : sheetName === "Letters"
                    ? [
                        _appTextValue_(row.caseId).trim(),
                        _appTextValue_(row.letterNo || row.bookNo).trim(),
                        normalizeDateOutput_(row.letterDate || ""),
                        _normalizedText_(row.agency || ""),
                        _normalizedText_(row.subject || row.issue || ""),
                    ].join("|")
                    : "");
}
function _meetingDuplicatePrimaryKey_(sheetName, row) {
    return ((row = row || {}),
        sheetName === "MainData"
            ? _appTextValue_(row.caseId).trim()
            : sheetName === "MeetingLogs"
                ? _appTextValue_(row.logId || row.meetingId).trim()
                : sheetName === "Letters"
                    ? _appTextValue_(row.letterId).trim()
                    : "");
}
function _meetingDuplicateSheetReport_(sheetName) {
    var rows = _meetingDuplicateRowMeta_(sheetName), primaryGroups = {}, businessGroups = {};
    function buildDuplicateItems(map, kind) {
        return Object.keys(map)
            .filter(function (key) {
            return key && map[key] && map[key].length > 1;
        })
            .map(function (key) {
            var items = map[key].slice().sort(function (a, b) {
                return _rowFreshnessScore_(b).localeCompare(_rowFreshnessScore_(a));
            }), keep = items[0] || null, remove = items.slice(1);
            return {
                type: kind,
                key,
                count: items.length,
                keepRowNumber: keep ? keep._rowNumber : 0,
                removeRowNumbers: remove.map(function (row) {
                    return row._rowNumber;
                }),
                keepId: keep ? _meetingDuplicatePrimaryKey_(sheetName, keep) : "",
                ids: items.map(function (row) {
                    return _meetingDuplicatePrimaryKey_(sheetName, row);
                }),
            };
        });
    }
    rows.forEach(function (row) {
        var primaryKey = _meetingDuplicatePrimaryKey_(sheetName, row), businessKey = _meetingDuplicateBusinessKey_(sheetName, row);
        (primaryKey &&
            (primaryGroups[primaryKey] || (primaryGroups[primaryKey] = []),
                primaryGroups[primaryKey].push(row)),
            businessKey &&
                (businessGroups[businessKey] || (businessGroups[businessKey] = []),
                    businessGroups[businessKey].push(row)));
    });
    var primaryDuplicates = buildDuplicateItems(primaryGroups, "primary"), businessDuplicates = buildDuplicateItems(businessGroups, "business").filter(function (item) {
        return !primaryGroups[item.key] || primaryGroups[item.key].length <= 1;
    }), duplicateItems = primaryDuplicates.concat(businessDuplicates);
    return {
        sheetName,
        totalRows: rows.length,
        duplicateGroups: duplicateItems.length,
        duplicates: duplicateItems.reduce(function (sum, item) {
            return sum + Math.max(0, Number(item.count || 0) - 1);
        }, 0),
        items: duplicateItems,
    };
}
function _casePrimaryKeyMigrationReadSheet_(sheetName) {
    var sh = getSheet_(sheetName), values = getSheetMatrix_(sh) || [], headers = (values[0] || []).map(function (value) {
        return _appTextValue_(value).trim();
    }), rows = [];
    for (var rowIndex = 1; rowIndex < values.length; rowIndex++) {
        var rowValues = values[rowIndex] || [], hasValue = rowValues.some(function (value) {
            return _appTextValue_(value).trim() !== "";
        });
        if (!hasValue)
            continue;
        var row = {
            __rowNumber: rowIndex + 1
        };
        headers.forEach(function (header, columnIndex) {
            if (header)
                row[header] = rowValues[columnIndex];
        });
        if (!_appIsFnName_("isSoftDeletedRow_") || !isSoftDeletedRow_(row))
            rows.push(row);
    }
    return {
        sheetName: sheetName,
        sheet: sh,
        headers: headers,
        values: values,
        rows: rows,
        lastRow: Number(sh.getLastRow ? sh.getLastRow() : values.length) || 0,
        lastColumn: Number(sh.getLastColumn ? sh.getLastColumn() : headers.length) || 0,
        activeRows: rows.length,
    };
}
function _casePrimaryKeyMigrationMainModel_(rows) {
    rows = _repoMaintenanceIsArray_(rows) ? rows : [];
    var idToSeq = {}, seqToIds = {}, caseIdRowCounts = {}, sequenceRowCounts = {}, identityPairRowCounts = {}, missingCaseId = 0, missingSequence = 0;
    function add(map, key, value) {
        key = _appTextValue_(key).trim();
        value = _appTextValue_(value).trim();
        if (!key || !value)
            return;
        (map[key] || (map[key] = [])).indexOf(value) < 0 && map[key].push(value);
    }
    rows.forEach(function (row) {
        var seq = _caseSequenceFrom_(row), id = _appTextValue_((row && (row.caseId || row.id)) || "").trim();
        if (!id)
            missingCaseId++;
        if (!seq)
            missingSequence++;
        if (id)
            caseIdRowCounts[id] = (caseIdRowCounts[id] || 0) + 1;
        if (seq)
            sequenceRowCounts[seq] = (sequenceRowCounts[seq] || 0) + 1;
        if (id && seq) {
            var pairKey = id + "|" + seq;
            identityPairRowCounts[pairKey] =
                (identityPairRowCounts[pairKey] || 0) + 1;
        }
        add(idToSeq, id, seq);
        add(seqToIds, seq, id);
    });
    function duplicateList(map, maxSamples) {
        return Object.keys(map)
            .filter(function (key) {
            return (map[key] || []).length > 1;
        })
            .sort()
            .map(function (key) {
            return {
                key: key, values: (map[key] || []).slice().sort()
            };
        })
            .slice(0, maxSamples || 50);
    }
    function duplicateStats(countMap) {
        var groups = 0, extraRows = 0;
        Object.keys(countMap).forEach(function (key) {
            var count = Number(countMap[key] || 0);
            if (count > 1) {
                groups++;
                extraRows += count - 1;
            }
        });
        return {
            groups: groups, extraRows: extraRows
        };
    }
    var ambiguousCaseIdCount = Object.keys(idToSeq).filter(function (key) {
        return (idToSeq[key] || []).length > 1;
    }).length, ambiguousCaseSequenceCount = Object.keys(seqToIds).filter(function (key) {
        return (seqToIds[key] || []).length > 1;
    }).length, duplicateCaseIdRows = duplicateStats(caseIdRowCounts), duplicateSequenceRows = duplicateStats(sequenceRowCounts), duplicateIdentityRows = duplicateStats(identityPairRowCounts), ambiguousCaseIds = duplicateList(idToSeq, 50), ambiguousCaseSequences = duplicateList(seqToIds, 50), report = {
        total: rows.length,
        missingCaseId: missingCaseId,
        missingSequence: missingSequence,
        caseIdCount: Object.keys(idToSeq).length,
        caseSequenceCount: Object.keys(seqToIds).length,
        ambiguousCaseIds: ambiguousCaseIds,
        ambiguousCaseSequences: ambiguousCaseSequences,
        ambiguousCaseIdCount: ambiguousCaseIdCount,
        ambiguousCaseSequenceCount: ambiguousCaseSequenceCount,
        duplicateCaseIdGroups: duplicateCaseIdRows.groups,
        duplicateCaseIdExtraRows: duplicateCaseIdRows.extraRows,
        duplicateSequenceGroups: duplicateSequenceRows.groups,
        duplicateSequenceExtraRows: duplicateSequenceRows.extraRows,
        duplicateIdentityGroups: duplicateIdentityRows.groups,
        duplicateIdentityExtraRows: duplicateIdentityRows.extraRows,
    };
    report.blockingCount =
        missingCaseId +
            missingSequence +
            ambiguousCaseIdCount +
            ambiguousCaseSequenceCount +
            duplicateIdentityRows.extraRows;
    report.safe = report.blockingCount === 0;
    return {
        idToSeq: idToSeq, seqToIds: seqToIds, report: report
    };
}
function _casePrimaryKeyMigrationClassifyRow_(row, mainModel, sheetName) {
    row = row || {};
    mainModel = mainModel || {
        idToSeq: {}, seqToIds: {}
    };
    var seq = _caseSequenceFrom_(row), id = _appTextValue_(row.caseId || row.caseID || row.case_id || "").trim(), rowId = _appTextValue_(row.logId ||
        row.letterId ||
        row.recordId ||
        row.rowId ||
        row.id ||
        sheetName + "#" + row.__rowNumber).trim(), knownIds, mappings;
    if (seq) {
        knownIds = mainModel.seqToIds[seq] || [];
        if (!knownIds.length)
            return {
                status: "QUARANTINED_ORPHAN_SEQUENCE",
                reason: "ลำดับเรื่องไม่มีอยู่ใน MainData",
                rowNumber: row.__rowNumber,
                rowId: rowId,
                caseId: id,
                caseNum: seq,
            };
        if (knownIds.length > 1)
            return {
                status: "QUARANTINED_AMBIGUOUS_SEQUENCE",
                reason: "ลำดับเรื่องเชื่อมกับ caseId มากกว่าหนึ่งค่า: " + knownIds.join("|"),
                rowNumber: row.__rowNumber,
                rowId: rowId,
                caseId: id,
                caseNum: seq,
                candidateCaseIds: knownIds.slice(),
            };
        if (id && knownIds.indexOf(id) < 0)
            return {
                status: "QUARANTINED_IDENTITY_CONFLICT",
                reason: "caseId ไม่ตรงกับลำดับเรื่อง; expected=" +
                    knownIds.join("|") +
                    "; actual=" +
                    id,
                rowNumber: row.__rowNumber,
                rowId: rowId,
                caseId: id,
                caseNum: seq,
                candidateCaseIds: knownIds.slice(),
            };
        return {
            status: "CANONICAL",
            reason: "",
            rowNumber: row.__rowNumber,
            rowId: rowId,
            caseId: id,
            caseNum: seq,
        };
    }
    if (!id)
        return {
            status: "QUARANTINED_MISSING_IDENTITY",
            reason: "ไม่พบทั้งลำดับเรื่องและ caseId",
            rowNumber: row.__rowNumber,
            rowId: rowId,
            caseId: "",
            caseNum: "",
        };
    mappings = mainModel.idToSeq[id] || [];
    if (mappings.length === 1)
        return {
            status: "BACKFILL_ONE_TO_ONE",
            reason: "เติมลำดับเรื่องจาก caseId แบบ one-to-one",
            rowNumber: row.__rowNumber,
            rowId: rowId,
            caseId: id,
            caseNum: "",
            targetCaseNum: mappings[0],
        };
    if (mappings.length > 1)
        return {
            status: "QUARANTINED_AMBIGUOUS_CASE_ID",
            reason: "caseId เชื่อมกับลำดับเรื่องหลายค่า: " + mappings.join("|"),
            rowNumber: row.__rowNumber,
            rowId: rowId,
            caseId: id,
            caseNum: "",
            candidateCaseNums: mappings.slice(),
        };
    return {
        status: "QUARANTINED_ORPHAN_CASE_ID",
        reason: "caseId ไม่มีอยู่ใน MainData",
        rowNumber: row.__rowNumber,
        rowId: rowId,
        caseId: id,
        caseNum: "",
    };
}
function _casePrimaryKeyMigrationChildPlan_(sheetSnapshot, mainModel) {
    var operations = [], statusCounts = {}, maxSamples = 50, samples = {
        missingSequence: [],
        ambiguousCaseId: [],
        orphanCaseId: [],
        orphanSequence: [],
        sequenceCaseIdConflict: [],
        quarantine: [],
        backfill: [],
    }, report = {
        sheet: sheetSnapshot.sheetName,
        total: sheetSnapshot.rows.length,
        withSequence: 0,
        missingSequence: 0,
        missingBoth: 0,
        uniqueMappableByCaseId: 0,
        ambiguousCaseId: 0,
        orphanCaseId: 0,
        orphanSequence: 0,
        sequenceCaseIdConflict: 0,
        backfillCount: 0,
        quarantineCount: 0,
        statusCounts: statusCounts,
        samples: samples,
    };
    sheetSnapshot.rows.forEach(function (row) {
        var item = _casePrimaryKeyMigrationClassifyRow_(row, mainModel, sheetSnapshot.sheetName);
        statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
        if (_caseSequenceFrom_(row))
            report.withSequence++;
        else {
            report.missingSequence++;
            if (samples.missingSequence.length < maxSamples)
                samples.missingSequence.push({
                    row: item.rowId,
                    rowNumber: item.rowNumber,
                    caseId: item.caseId,
                });
        }
        if (item.status === "CANONICAL")
            return;
        operations.push(item);
        if (item.status === "BACKFILL_ONE_TO_ONE") {
            report.uniqueMappableByCaseId++;
            report.backfillCount++;
            if (samples.backfill.length < maxSamples)
                samples.backfill.push(item);
            return;
        }
        report.quarantineCount++;
        if (samples.quarantine.length < maxSamples)
            samples.quarantine.push(item);
        if (item.status === "QUARANTINED_MISSING_IDENTITY")
            report.missingBoth++;
        else if (item.status === "QUARANTINED_AMBIGUOUS_CASE_ID") {
            report.ambiguousCaseId++;
            if (samples.ambiguousCaseId.length < maxSamples)
                samples.ambiguousCaseId.push(item);
        }
        else if (item.status === "QUARANTINED_ORPHAN_CASE_ID") {
            report.orphanCaseId++;
            if (samples.orphanCaseId.length < maxSamples)
                samples.orphanCaseId.push(item);
        }
        else if (item.status === "QUARANTINED_ORPHAN_SEQUENCE" ||
            item.status === "QUARANTINED_AMBIGUOUS_SEQUENCE") {
            report.orphanSequence++;
            if (samples.orphanSequence.length < maxSamples)
                samples.orphanSequence.push(item);
        }
        else if (item.status === "QUARANTINED_IDENTITY_CONFLICT") {
            report.sequenceCaseIdConflict++;
            if (samples.sequenceCaseIdConflict.length < maxSamples)
                samples.sequenceCaseIdConflict.push(item);
        }
    });
    report.blockingCount = report.quarantineCount;
    report.safeForAutomaticBackfill =
        report.missingSequence === report.uniqueMappableByCaseId &&
            report.quarantineCount === 0;
    return {
        report: report, operations: operations
    };
}
function _casePrimaryKeyMigrationFingerprintRows_(items) {
    return (Array.isArray(items) ? items : []).map(function (item) {
        return [ item.rowNumber, item.status, item.caseId, item.caseNum, item.targetCaseNum || "" ];
    });
}
function _casePrimaryKeyMigrationFingerprint_(plan) {
    var input = {
        stamp: CASE_DOMAIN_PRIMARY_KEY_MIGRATION_STAMP_CURRENT,
        mainData: plan.mainData,
        mainIdentityRows: plan.mainIdentityRows || [],
        rowCounts: plan.rowCounts,
        meetingLogs: _casePrimaryKeyMigrationFingerprintRows_(plan.operations.MeetingLogs),
        letters: _casePrimaryKeyMigrationFingerprintRows_(plan.operations.Letters),
    };
    var raw = _safeJsonStringify_(input), digest = "";
    if (_appIsFnName_("_appSha256Hex_"))
        digest = _appSha256Hex_(raw);
    else
        digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw)
            .map(function (value) {
            return (value + 256).toString(16).slice(-2);
        })
            .join("");
    return String(digest || "").toLowerCase();
}
function _casePrimaryKeyBuildMigrationPlan_() {
    var mainSnapshot = _casePrimaryKeyMigrationReadSheet_("MainData"), meetingSnapshot = _casePrimaryKeyMigrationReadSheet_("MeetingLogs"), letterSnapshot = _casePrimaryKeyMigrationReadSheet_("Letters"), mainModel = _casePrimaryKeyMigrationMainModel_(mainSnapshot.rows), meetingPlan = _casePrimaryKeyMigrationChildPlan_(meetingSnapshot, mainModel), letterPlan = _casePrimaryKeyMigrationChildPlan_(letterSnapshot, mainModel), plan = {
        stamp: CASE_DOMAIN_PRIMARY_KEY_MIGRATION_STAMP_CURRENT,
        mode: "read-only-dry-run",
        primaryKey: "ลำดับเรื่อง",
        generatedAt: new Date().toISOString(),
        migrationState: _casePrimaryKeyMigrationState_(!0),
        mainData: mainModel.report,
        meetingLogs: meetingPlan.report,
        letters: letterPlan.report,
        operations: {
            MeetingLogs: meetingPlan.operations,
            Letters: letterPlan.operations,
        },
        mainIdentityRows: mainSnapshot.rows.map(function (row) {
            return [
                Number(row.__rowNumber || 0),
                _appTextValue_(row.caseId || row.id || "").trim(),
                _caseSequenceFrom_(row),
            ];
        }),
        rowCounts: {
            MainData: {
                lastRow: mainSnapshot.lastRow,
                activeRows: mainSnapshot.activeRows,
            },
            MeetingLogs: {
                lastRow: meetingSnapshot.lastRow,
                activeRows: meetingSnapshot.activeRows,
            },
            Letters: {
                lastRow: letterSnapshot.lastRow,
                activeRows: letterSnapshot.activeRows,
            },
        },
        writesPerformed: 0,
    };
    plan.backfillCount =
        meetingPlan.report.backfillCount + letterPlan.report.backfillCount;
    plan.quarantineCount =
        meetingPlan.report.quarantineCount + letterPlan.report.quarantineCount;
    plan.blockingCount = mainModel.report.blockingCount + plan.quarantineCount;
    plan.safeToStartMigration = mainModel.report.safe;
    plan.cleanForEnforcement = plan.blockingCount === 0 && plan.backfillCount === 0;
    plan.fingerprint = _casePrimaryKeyMigrationFingerprint_(plan);
    return plan;
}
function _casePrimaryKeyMigrationPublicReport_(plan) {
    plan = plan || _casePrimaryKeyBuildMigrationPlan_();
    return {
        stamp: plan.stamp,
        mode: plan.mode,
        primaryKey: plan.primaryKey,
        generatedAt: plan.generatedAt,
        migrationState: plan.migrationState,
        fingerprint: plan.fingerprint,
        mainData: plan.mainData,
        meetingLogs: plan.meetingLogs,
        letters: plan.letters,
        rowCounts: plan.rowCounts,
        backfillCount: plan.backfillCount,
        quarantineCount: plan.quarantineCount,
        blockingCount: plan.blockingCount,
        safeToStartMigration: plan.safeToStartMigration,
        cleanForEnforcement: plan.cleanForEnforcement,
        applyRequirements: {
            api: "apiCleanupMeetingData",
            action: "primary-key-migration-apply",
            confirmation: CASE_PRIMARY_KEY_MIGRATION_CONFIRMATION,
            expectedFingerprint: plan.fingerprint,
        },
        writesPerformed: Number(plan.writesPerformed || 0),
    };
}
function _casePrimaryKeyCreateBackups_(sheetNames) {
    var ss = getSpreadsheet_(), timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss"), suffix = Utilities.getUuid().replace(/-/g, "").slice(0, 6), backups = [];
    (sheetNames || []).forEach(function (sheetName) {
        var source = getSheet_(sheetName), backupName = ("_PKB_" + sheetName + "_" + timestamp + "_" + suffix).slice(0, 99), copy = source.copyTo(ss);
        copy.setName(backupName);
        try {
            copy.hideSheet();
        }
        catch (hideErr) {
            _recordWarning_("case.primaryKeyMigration.backup.hide", hideErr, {
                backupName: backupName,
            });
        }
        backups.push({
            source: sheetName, backupSheet: backupName
        });
    });
    return backups;
}
function _casePrimaryKeyWriteSheetPlan_(sheetName, operations, migratedAt) {
    operations = _repoMaintenanceIsArray_(operations) ? operations : [];
    if (!operations.length)
        return {
            sheet: sheetName, rowsTouched: 0, backfilled: 0, quarantined: 0
        };
    [
        "caseNum",
        "pkMigrationStatus",
        "pkMigrationReason",
        "pkMigratedAt",
        "pkMigrationStamp",
    ].forEach(function (header) {
        ensureHeaderColumn_(sheetName, header);
    });
    var sh = getSheet_(sheetName), lastRow = Number(sh.getLastRow()) || 0, headers = sh
        .getRange(1, 1, 1, Math.max(1, sh.getLastColumn()))
        .getValues()[0]
        .map(function (value) {
        return _appTextValue_(value).trim();
    }), columns = {}, rollback = [], changes = {
        caseNum: {},
        pkMigrationStatus: {},
        pkMigrationReason: {},
        pkMigratedAt: {},
        pkMigrationStamp: {},
    }, backfilled = 0, quarantined = 0;
    Object.keys(changes).forEach(function (header) {
        var index = headers.indexOf(header);
        if (index < 0)
            throw new Error("ไม่พบคอลัมน์ migration: " + header);
        columns[header] = index + 1;
    });
    operations.forEach(function (item) {
        var rowNumber = Number(item.rowNumber || 0);
        if (rowNumber < 2 || rowNumber > lastRow)
            throw new Error("ตำแหน่งแถว migration ไม่ถูกต้อง: " + sheetName + "#" + rowNumber);
        if (item.status === "BACKFILL_ONE_TO_ONE") {
            changes.caseNum[rowNumber] = item.targetCaseNum;
            backfilled++;
        }
        else
            quarantined++;
        changes.pkMigrationStatus[rowNumber] = item.status;
        changes.pkMigrationReason[rowNumber] = item.reason || "";
        changes.pkMigratedAt[rowNumber] = migratedAt;
        changes.pkMigrationStamp[rowNumber] = CASE_DOMAIN_PRIMARY_KEY_MIGRATION_STAMP_CURRENT;
    });
    function writeColumn(header) {
        var count = Math.max(0, lastRow - 1);
        if (!count)
            return;
        var range = sh.getRange(2, columns[header], count, 1), values = range.getValues(), formulas = range.getFormulas(), original = values.map(function (row, index) {
            return [
                formulas[index] && formulas[index][0] ? formulas[index][0] : row[0]
            ];
        }), output = original.map(function (row) {
            return [
                row[0]
            ];
        });
        Object.keys(changes[header]).forEach(function (rowNumberText) {
            var offset = Number(rowNumberText) - 2;
            output[offset][0] = changes[header][rowNumberText];
        });
        range.setValues(output);
        rollback.push({
            range: range, values: original
        });
    }
    try {
        Object.keys(changes).forEach(writeColumn);
        SpreadsheetApp.flush();
    }
    catch (writeErr) {
        for (var index = rollback.length - 1; index >= 0; index--)
            try {
                rollback[index].range.setValues(rollback[index].values);
            }
            catch (rollbackErr) {
                _recordWarning_("case.primaryKeyMigration.rollback.column", rollbackErr, {
                    sheetName: sheetName,
                });
            }
        throw writeErr;
    }
    invalidateSheetCache_(sheetName);
    return {
        sheet: sheetName,
        rowsTouched: operations.length,
        backfilled: backfilled,
        quarantined: quarantined,
        lastRow: lastRow,
        _rollback: function () {
            for (var rollbackIndex = rollback.length - 1; rollbackIndex >= 0; rollbackIndex--)
                rollback[rollbackIndex].range.setValues(rollback[rollbackIndex].values);
            SpreadsheetApp.flush();
            invalidateSheetCache_(sheetName);
            return !0;
        },
    };
}
function _casePrimaryKeyApplyMigration_(input) {
    input = input || {};
    if (String(input.confirmation || input.confirm || "").trim() !==
        CASE_PRIMARY_KEY_MIGRATION_CONFIRMATION) {
        var confirmErr = new Error("ต้องยืนยันการย้าย Primary Key ด้วยข้อความที่กำหนด");
        confirmErr.errorCode = "PRIMARY_KEY_MIGRATION_CONFIRMATION_REQUIRED";
        throw confirmErr;
    }
    var gatewayOwnsLock = _appIsFnName_("_writeGatewayIsActive_") && _writeGatewayIsActive_(), lock = gatewayOwnsLock ? null : LockService.getDocumentLock(), locked = gatewayOwnsLock
        ? !1
        : lock && lock.tryLock
            ? lock.tryLock(30000)
            : !1;
    if (!gatewayOwnsLock && lock && !locked)
        throw new Error("ระบบกำลังย้าย Primary Key จากคำสั่งก่อนหน้า กรุณาลองอีกครั้ง");
    try {
        var planBefore = _casePrimaryKeyBuildMigrationPlan_(), expectedFingerprint = String(input.expectedFingerprint || "").trim();
        if (!expectedFingerprint || expectedFingerprint !== planBefore.fingerprint) {
            var staleErr = new Error("ข้อมูลเปลี่ยนจากรอบ Dry-run กรุณาตรวจสอบใหม่ก่อนย้าย Primary Key");
            staleErr.errorCode = "PRIMARY_KEY_MIGRATION_STALE_PLAN";
            staleErr.expectedFingerprint = expectedFingerprint;
            staleErr.actualFingerprint = planBefore.fingerprint;
            throw staleErr;
        }
        if (!planBefore.mainData.safe) {
            var mainErr = new Error("MainData ยังมี Primary Key กำกวม ระบบไม่อนุญาตให้ Backfill อัตโนมัติ");
            mainErr.errorCode = "PRIMARY_KEY_MIGRATION_MAIN_DATA_UNSAFE";
            mainErr.detail = planBefore.mainData;
            throw mainErr;
        }
        var operationsTotal = planBefore.operations.MeetingLogs.length +
            planBefore.operations.Letters.length, backups = operationsTotal
            ? _casePrimaryKeyCreateBackups_([
                "MainData", "MeetingLogs", "Letters"
            ])
            : [], migratedAt = new Date().toISOString(), writes = [];
        var planAfter;
        try {
            if (operationsTotal) {
                writes.push(_casePrimaryKeyWriteSheetPlan_("MeetingLogs", planBefore.operations.MeetingLogs, migratedAt));
                writes.push(_casePrimaryKeyWriteSheetPlan_("Letters", planBefore.operations.Letters, migratedAt));
            }
            _appIsFnName_("_invalidateMeetingDerivedCaches_") &&
                _invalidateMeetingDerivedCaches_("primaryKeyMigration");
            _appIsFnName_("_invalidateLettersDerivedCaches_") &&
                _invalidateLettersDerivedCaches_("primaryKeyMigration");
            planAfter = _casePrimaryKeyBuildMigrationPlan_();
            [
                "MainData", "MeetingLogs", "Letters"
            ].forEach(function (sheetName) {
                if (Number(planBefore.rowCounts[sheetName].lastRow || 0) !==
                    Number(planAfter.rowCounts[sheetName].lastRow || 0))
                    throw new Error("จำนวนแถวเปลี่ยนระหว่าง Migration: " + sheetName);
            });
            if (planAfter.backfillCount !== 0)
                throw new Error("ยังมีแถว one-to-one ที่ไม่ได้ Backfill ครบ กรุณาใช้ชีตสำรองเพื่อตรวจสอบ");
        }
        catch (migrationWriteErr) {
            for (var writeIndex = writes.length - 1; writeIndex >= 0; writeIndex--)
                try {
                    writes[writeIndex]._rollback && writes[writeIndex]._rollback();
                }
                catch (crossRollbackErr) {
                    _recordWarning_("case.primaryKeyMigration.rollback.crossSheet", crossRollbackErr, {
                        sheet: writes[writeIndex].sheet
                    });
                }
            _appIsFnName_("_invalidateMeetingDerivedCaches_") &&
                _invalidateMeetingDerivedCaches_("primaryKeyMigrationRollback");
            _appIsFnName_("_invalidateLettersDerivedCaches_") &&
                _invalidateLettersDerivedCaches_("primaryKeyMigrationRollback");
            throw migrationWriteErr;
        }
        writes.forEach(function (item) {
            delete item._rollback;
        });
        var nextState = planAfter.blockingCount === 0 ? "ENFORCED" : "QUARANTINE_PENDING", stateResult = _casePrimaryKeySetMigrationState_(nextState, {
            stamp: CASE_DOMAIN_PRIMARY_KEY_MIGRATION_STAMP_CURRENT,
            fingerprintBefore: planBefore.fingerprint,
            fingerprintAfter: planAfter.fingerprint,
            backups: backups,
            writes: writes,
            quarantineCount: planAfter.quarantineCount,
            blockingCount: planAfter.blockingCount,
        });
        planAfter.migrationState = nextState;
        planAfter.mode = "apply-one-to-one-and-quarantine";
        planAfter.writesPerformed = writes.reduce(function (sum, item) {
            return sum + Number(item.rowsTouched || 0);
        }, 0);
        return {
            stamp: CASE_DOMAIN_PRIMARY_KEY_MIGRATION_STAMP_CURRENT,
            mode: planAfter.mode,
            state: stateResult,
            backups: backups,
            writes: writes,
            before: _casePrimaryKeyMigrationPublicReport_(planBefore),
            after: _casePrimaryKeyMigrationPublicReport_(planAfter),
            fallbackClosed: nextState === "ENFORCED",
            manualReviewRequired: nextState !== "ENFORCED",
        };
    }
    finally {
        try {
            lock && locked && lock.releaseLock && lock.releaseLock();
        }
        catch (releaseErr) {
            _recordWarning_("case.primaryKeyMigration.lock.release", releaseErr);
        }
    }
}
function _casePrimaryKeySafetyAudit_() {
    return _casePrimaryKeyMigrationPublicReport_(_casePrimaryKeyBuildMigrationPlan_());
}
function _meetingDuplicateAuditReport_() {
    return {
        generatedAt: new Date().toISOString(),
        p0SafetyBaseline: {
            stamp: CASE_DOMAIN_SAFETY_FREEZE_STAMP_CURRENT,
            releaseStamp: typeof APP_DEPLOY_RELEASE != "undefined" && APP_DEPLOY_RELEASE
                ? APP_DEPLOY_RELEASE.stamp
                : "",
            primaryKey: "ลำดับเรื่อง",
            protectedWriteMethods: [
                "apiSaveMeetingLog",
                "apiDeleteMeetingLog",
                "apiSaveLetter",
                "apiDeleteLetter",
            ],
            writesPerformed: 0,
        },
        primaryKeySafety: _casePrimaryKeySafetyAudit_(),
        cases: _meetingDuplicateSheetReport_("MainData"),
        meetingLogs: _meetingDuplicateSheetReport_("MeetingLogs"),
        letters: _meetingDuplicateSheetReport_("Letters"),
    };
}
function _meetingDuplicateAuditCsv_(audit) {
    audit = audit || _meetingDuplicateAuditReport_();
    var rows = [
        [
            "sheet",
            "duplicateType",
            "key",
            "count",
            "keepRowNumber",
            "removeRowNumbers",
            "ids",
        ],
    ];
    return ([
        "cases", "meetingLogs", "letters"
    ].forEach(function (section) {
        var report = audit[section] || {}, items;
        (_repoMaintenanceIsArray_(report.items) ? report.items : []).forEach(function (item) {
            rows.push([
                String(report.sheetName || section),
                _appTextValue_(item.type),
                _appTextValue_(item.key),
                Number(item.count || 0),
                Number(item.keepRowNumber || 0),
                String((item.removeRowNumbers || []).join("|")),
                String((item.ids || []).join("|")),
            ]);
        });
    }),
        (function () {
            var migrationPlan = _casePrimaryKeyBuildMigrationPlan_();
            [
                "MeetingLogs", "Letters"
            ].forEach(function (sheetName) {
                (migrationPlan.operations[sheetName] || []).forEach(function (item) {
                    rows.push([
                        sheetName,
                        "primaryKey:" + item.status,
                        "row:" + item.rowNumber,
                        1,
                        item.status === "BACKFILL_ONE_TO_ONE" ? item.rowNumber : "",
                        item.status === "BACKFILL_ONE_TO_ONE" ? "" : item.rowNumber,
                        [
                            item.rowId || "",
                            item.caseId || "",
                            item.caseNum || "",
                            item.targetCaseNum || "",
                            item.reason || "",
                        ].join("|"),
                    ]);
                });
            });
        })(),
        rows.map(function (row) {
            return row
                .map(function (cell) {
                var value = _appTextValue_(cell);
                return /[",\n]/.test(value)
                    ? '"' + value.replace(/"/g, '""') + '"'
                    : value;
            })
                .join(",");
        }).join(`
`));
}
function _softDeleteSheetRowsByNumber_(sheetName, rowNumbers, patchObj) {
    if (!(rowNumbers = _repoMaintenanceIsArray_(rowNumbers) ? rowNumbers.slice() : []).length)
        return 0;
    var sh = getSheet_(sheetName), audit = getCanonicalHeaderAudit_(sheetName);
    if (audit.missing.length)
        throw new Error("ชีต " + sheetName + " ยังไม่เป็น canonical: " + audit.missing.join(", "));
    var data = getSheetMatrix_(sh);
    if (data.length <= 1)
        return 0;
    var map = _headerMap_(data[0].map(function (v) {
        return _appTextValue_(v).trim();
    })), patch = _appAssignObjects_({
        isDeleted: !0,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }, patchObj || {}), touched = 0;
    return (rowNumbers.forEach(function (rowNumber) {
        var rowIndex = Number(rowNumber || 0) - 1;
        rowIndex < 1 ||
            rowIndex >= data.length ||
            (Object.keys(patch).forEach(function (key) {
                map[key] !== void 0 && (data[rowIndex][map[key]] = patch[key]);
            }),
                touched++);
    }),
        touched &&
            (AppRepository.setRangeValues(sheetName, 2, 1, data.slice(1), {
                invalidate: !1,
            }),
                invalidateSheetCache_(sheetName)),
        touched);
}
function apiAuditMeetingData(payload) {
    return ((payload = requireDomainRequest_(payload, "admin")),
        ok_(_meetingDuplicateAuditReport_(), "ตรวจสอบข้อมูลซ้ำสำเร็จ"));
}
function apiExportMeetingDuplicateAuditCsv(payload) {
    payload = requireDomainRequest_(payload, "admin");
    var audit = _meetingDuplicateAuditReport_();
    return ok_({
        fileName: "meeting_duplicate_audit_" +
            Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss") +
            ".csv",
        csv: _meetingDuplicateAuditCsv_(audit),
        audit,
    }, "สร้างไฟล์รายงานข้อมูลซ้ำสำเร็จ");
}
function apiCleanupMeetingData(payload) {
    return writeGateway_("apiCleanupMeetingData", payload || {}, function (input) {
        input = requireDomainRequest_(input, "admin");
        var action = String(input.action || input.operation || input.mode || "duplicate-cleanup")
            .trim()
            .toLowerCase();
        if (action === "primary-key-migration-apply" ||
            action === "primarykeymigrationapply" ||
            action === "migrate-primary-key")
            return ok_(_casePrimaryKeyApplyMigration_(input), "ย้าย Primary Key แบบ one-to-one และกักกันรายการกำกวมสำเร็จ");
        var audit = _meetingDuplicateAuditReport_(), result = {
            cases: 0,
            meetingLogs: 0,
            letters: 0,
            generatedAt: new Date().toISOString(),
        };
        return ([
            {
                section: "cases", sheetName: "MainData"
            },
            {
                section: "meetingLogs", sheetName: "MeetingLogs"
            },
            {
                section: "letters", sheetName: "Letters"
            },
        ].forEach(function (entry) {
            var report = audit[entry.section] || {}, rowNumbers = [];
            ((report.items || []).forEach(function (item) {
                rowNumbers = rowNumbers.concat(item.removeRowNumbers || []);
            }),
                (result[entry.section] = _softDeleteSheetRowsByNumber_(entry.sheetName, rowNumbers, {
                    remark: "duplicate-cleanup", note: "duplicate-cleanup"
                })));
        }),
            _appIsFnName_("_invalidateMeetingDerivedCaches_") &&
                _invalidateMeetingDerivedCaches_("cleanupDuplicates"),
            _appIsFnName_("_invalidateLettersDerivedCaches_") &&
                _invalidateLettersDerivedCaches_("cleanupDuplicates"),
            ok_(result, "รวมข้อมูลซ้ำสำเร็จ"));
    }, "ดำเนินการข้อมูลประชุมสำเร็จ", "ดำเนินการข้อมูลประชุมไม่สำเร็จ");
}

AppRepositoryMaintenance.owner = "Code_01_Platform_SheetRepo.gs";
AppRepositoryMaintenance.auditMeetingData = _meetingDuplicateAuditReport_;
AppRepositoryMaintenance.planPrimaryKeyMigration = _casePrimaryKeyBuildMigrationPlan_;
AppRepositoryMaintenance.applyPrimaryKeyMigration = _casePrimaryKeyApplyMigration_;
AppRepositoryMaintenance.cleanupMeetingData = apiCleanupMeetingData;
AppRepositoryMaintenance.status = function () {
    return {
        ok: true,
        owner: AppRepositoryMaintenance.owner,
        maintenanceOnly: true,
        caseRuntimeOwner: "Code_30_Domain_Cases.gs",
        noNewFiles: true,
        businessLogicChanged: false,
        stamp: "r214-repository-maintenance-owner"
    };
};

var SHEET_REPO_BATCH_CONTRACT_STAMP = "sheetrepo-batch-owner-safety-gate-2026-06-19", AppSheetBatch = __APP_GLOBAL__.AppSheetBatch = __APP_GLOBAL__.AppSheetBatch || {};
AppSheetBatch.objectToRow = function (sheetName, headers, obj) {
    return obj = obj || {}, headers = Array.isArray(headers) ? headers : [], headers.map(function (h) {
        var canonical = typeof _canonicalHeaderNameForSheet_ == "function" ? _canonicalHeaderNameForSheet_(sheetName, h) : h;
        return Object.prototype.hasOwnProperty.call(obj, h) ? obj[h] : canonical && Object.prototype.hasOwnProperty.call(obj, canonical) ? obj[canonical] : "";
    });
}, AppSheetBatch._mergePatchIntoRow = function (row, patch, map, width) {
    return row = Array.isArray(row) ? row : [], Object.keys(patch || {}).forEach(function (k) {
        var i = map[k];
        i === void 0 && (i = map[_normalizedHeaderKey_(k)]), i !== void 0 && i < width && (row[i] = patch[k]);
    }), row.slice(0, width);
}, AppSheetBatch._contiguousSegments = function (rowNumbers, maxRowsPerSegment) {
    var rows = (Array.isArray(rowNumbers) ? rowNumbers : []).map(function (n) {
        return Number(n || 0) || 0;
    }).filter(function (n) {
        return n > 1;
    }).sort(function (a, b) {
        return a - b;
    }), unique = [], segments = [], maxRows = Math.max(1, Math.min(Number(maxRowsPerSegment || 500) || 500, 1e3));
    return rows.forEach(function (n) {
        (!unique.length || unique[unique.length - 1] !== n) && unique.push(n);
    }), unique.forEach(function (n) {
        var current = segments.length ? segments[segments.length - 1] : null;
        !current || n !== current.endRow + 1 || current.endRow - current.startRow + 1 >= maxRows ? segments.push({
            startRow: n, endRow: n, rowNumbers: [
                n
            ]
        }) : (current.endRow = n, current.rowNumbers.push(n));
    }), segments;
}, AppSheetBatch.appendObjects = function (sheetName, objects, opts) {
    return objects = Array.isArray(objects) ? objects : [], opts = opts || {}, objects.length ? withWriteLock_("sheetBatch.append:" + String(sheetName || ""), function () {
        var sh = getSheet_(sheetName), audit = getCanonicalHeaderAudit_(sheetName);
        if (audit.missing.length)
            throw new Error("ชีต " + sheetName + " ยังไม่เป็น canonical: " + audit.missing.join(", "));
        var headers = _sheetHeaders_(sheetName), matrix = objects.map(function (o) {
            return AppSheetBatch.objectToRow(sheetName, headers, o || {});
        }), startRow = Math.max(sh.getLastRow(), 1) + 1;
        return sh.getRange(startRow, 1, matrix.length, headers.length).setValues(matrix), !opts.deferAfterWrite && _afterSheetWrite_(sheetName, {
            operation: "AppSheetBatch.appendObjects", rows: matrix.length, flush: !!opts.flush
        }), {
            ok: !0, rows: matrix.length, startRow, mode: "append", sheetName: String(sheetName || ""), stamp: SHEET_REPO_BATCH_CONTRACT_STAMP, serviceWrites: 1
        };
    }, Number(opts.lockTimeoutMs || 3e4) || 3e4) : {
        ok: !0, rows: 0, mode: "append", sheetName: String(sheetName || ""), stamp: SHEET_REPO_BATCH_CONTRACT_STAMP, serviceWrites: 0
    };
}, AppSheetBatch.updateObjectsByKey = function (sheetName, keyField, objects, opts) {
    return objects = Array.isArray(objects) ? objects : [], opts = opts || {}, objects.length ? withWriteLock_("sheetBatch.update:" + String(sheetName || ""), function () {
        var sh = getSheet_(sheetName), audit = getCanonicalHeaderAudit_(sheetName);
        if (audit.missing.length)
            throw new Error("ชีต " + sheetName + " ยังไม่เป็น canonical: " + audit.missing.join(", "));
        var headers = Array.isArray(opts.headers) ? opts.headers.slice() : _sheetHeaders_(sheetName), map = opts.headerMap && typeof opts.headerMap == "object" ? opts.headerMap : _canonicalHeaderIndexMap_(sheetName, headers), keyIndex = map[keyField];
        if (keyIndex === void 0 && (keyIndex = map[_normalizedHeaderKey_(keyField)]), keyIndex === void 0)
            throw new Error("ไม่พบ key field: " + keyField);
        var width = Math.max(headers.length, Number(sh.getLastColumn && sh.getLastColumn()) || headers.length || 1), suppliedIndex = opts.rowIndex && opts.rowIndex.map ? opts.rowIndex : null, idx = suppliedIndex || _i3SheetRowIndexByKey_(sheetName, keyField, keyIndex, {
            headers, headerMap: map, forceFresh: !0, readBatchRows: opts.indexReadBatchRows || 0
        }), patchesByRow = {}, rowNumbers = [], missingKeys = [];
        objects.forEach(function (patch) {
            var key = String(patch && patch[keyField] || "").trim();
            if (key) {
                var rowNumber = Number(idx && idx.map && idx.map[key] || 0) || 0;
                if (!rowNumber)
                    return missingKeys.push(key);
                patchesByRow[rowNumber] = Object.assign(patchesByRow[rowNumber] || {}, patch || {}), rowNumbers.push(rowNumber);
            }
        });
        var segments = AppSheetBatch._contiguousSegments(rowNumbers, opts.maxRowsPerSegment || 500), touched = 0, serviceReads = 0, serviceWrites = 0;
        return segments.forEach(function (segment) {
            var range = sh.getRange(segment.startRow, 1, segment.endRow - segment.startRow + 1, width), values = range.getValues();
            serviceReads++, segment.rowNumbers.forEach(function (rowNumber) {
                var offset = rowNumber - segment.startRow, patch = patchesByRow[rowNumber];
                values[offset] = AppSheetBatch._mergePatchIntoRow(values[offset] || [], patch, map, width), touched++;
            }), range.setValues(values), serviceWrites++;
        }), touched && !opts.deferAfterWrite && _afterSheetWrite_(sheetName, {
            operation: "AppSheetBatch.updateObjectsByKey", rows: touched, flush: !!opts.flush, batchRanges: segments.length
        }), {
            ok: !0, rows: touched, missing: missingKeys.length, missingKeys, mode: "update", sheetName: String(sheetName || ""), stamp: SHEET_REPO_BATCH_CONTRACT_STAMP, serviceReads: serviceReads + (suppliedIndex ? 0 : Number(idx && idx.serviceReads || 0)), serviceWrites, batchRanges: segments.length, indexReused: !!suppliedIndex
        };
    }, Number(opts.lockTimeoutMs || 3e4) || 3e4) : {
        ok: !0, rows: 0, mode: "update", sheetName: String(sheetName || ""), stamp: SHEET_REPO_BATCH_CONTRACT_STAMP, serviceReads: 0, serviceWrites: 0, batchRanges: 0, indexReused: !1
    };
}, AppSheetBatch.upsertObjects = function (sheetName, keyField, objects, opts) {
    return objects = Array.isArray(objects) ? objects : [], opts = opts || {}, objects.length ? withWriteLock_("sheetBatch.upsert:" + String(sheetName || ""), function () {
        var headers = _sheetHeaders_(sheetName), map = _canonicalHeaderIndexMap_(sheetName, headers), keyIndex = map[keyField];
        if (keyIndex === void 0 && (keyIndex = map[_normalizedHeaderKey_(keyField)]), keyIndex === void 0)
            throw new Error("ไม่พบ key field: " + keyField);
        var idx = _i3SheetRowIndexByKey_(sheetName, keyField, keyIndex, {
            headers, headerMap: map, forceFresh: !0, readBatchRows: opts.indexReadBatchRows || 0
        }), creates = [], updates = [];
        objects.forEach(function (o) {
            var key = String(o && o[keyField] || "").trim();
            key && (idx && idx.map && idx.map[key] ? updates : creates).push(o);
        });
        var u = updates.length ? AppSheetBatch.updateObjectsByKey(sheetName, keyField, updates, {
            flush: !1, deferAfterWrite: !0, maxRowsPerSegment: opts.maxRowsPerSegment || 500, headers, headerMap: map, rowIndex: idx
        }) : {
            rows: 0, serviceReads: 0, serviceWrites: 0, batchRanges: 0, indexReused: !0
        }, c = creates.length ? AppSheetBatch.appendObjects(sheetName, creates, {
            flush: !1, deferAfterWrite: !0
        }) : {
            rows: 0, serviceWrites: 0
        }, totalRows = (u.rows || 0) + (c.rows || 0);
        return totalRows && _afterSheetWrite_(sheetName, {
            operation: "AppSheetBatch.upsertObjects", rows: totalRows, flush: !!opts.flush, batchRanges: Number(u.batchRanges || 0) + (c.rows ? 1 : 0)
        }), {
            ok: !0, created: c.rows || 0, updated: u.rows || 0, rows: totalRows, mode: "upsert", sheetName: String(sheetName || ""), stamp: SHEET_REPO_BATCH_CONTRACT_STAMP, serviceReads: Number(idx && idx.serviceReads || 0) + Number(u.serviceReads || 0), serviceWrites: Number(u.serviceWrites || 0) + Number(c.serviceWrites || 0), batchRanges: Number(u.batchRanges || 0) + (c.rows ? 1 : 0), indexReused: !0
        };
    }, Number(opts.lockTimeoutMs || 3e4) || 3e4) : {
        ok: !0, created: 0, updated: 0, rows: 0, mode: "upsert", sheetName: String(sheetName || ""), stamp: SHEET_REPO_BATCH_CONTRACT_STAMP, serviceReads: 0, serviceWrites: 0, indexReused: !1
    };
};
function appendSheetObjects_(sheetName, objects, opts) {
    return AppSheetBatch.appendObjects(sheetName, objects, opts || {});
}
function upsertSheetObjectsByKey_(sheetName, keyField, objects, opts) {
    return AppSheetBatch.upsertObjects(sheetName, keyField, objects, opts || {});
}

