// ใส่ ID ของ Google Sheet ฐานข้อมูลหลัก
const SPREADSHEET_ID = "1iz9PYJHey4Zhry5DHEE1AQK-jco0cDcWe4PdFFwRG9U";

const STATUS_GROUP_NEW = 'new';
const STATUS_GROUP_IN_PROGRESS = 'inProgress';
const STATUS_GROUP_COMPLETED = 'completed';
const STATUS_GROUP_OTHER = 'other';

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('สืบค้นสถานะเรื่องพิจารณา - คณะกรรมาธิการ ป.ป.ช.')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function searchByRecNo(inputRecNo) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const mainSheet = ss.getSheetByName('MainData');
    if (!mainSheet) return { found: false, msg: 'ไม่พบฐานข้อมูล' };

    const data = mainSheet.getDataRange().getValues();
    const targetRecNo = normalizeRecNo_(inputRecNo);
    let foundCase = null;

    // ค้นหาข้อมูลจากคอลัมน์เลขรับเรื่อง (Index 3)
    for (let i = 1; i < data.length; i++) {
      const currentRecNo = normalizeRecNo_(data[i][3]);
      if (currentRecNo === targetRecNo) {
        const originalStatus = cleanText_(data[i][8]);
        const normalizedStatus = normalizeCaseStatus_(originalStatus);
        const statusGroup = getStatusGroup_(normalizedStatus);
        const agencyName = cleanText_(data[i][16] || '');
        const reason = cleanText_(data[i][17] || '');

        foundCase = {
          caseId: cleanText_(data[i][0]),
          recNo: currentRecNo,
          recDate: data[i][5] instanceof Date ? Utilities.formatDate(data[i][5], 'GMT+7', 'yyyy-MM-dd') : cleanText_(data[i][5]),
          caseTitle: cleanText_(data[i][15]) || cleanText_(data[i][6]),
          originalStatus: originalStatus,
          normalizedStatus: normalizedStatus,
          statusGroup: statusGroup,
          displayStatus: makeDisplayStatus_(normalizedStatus, agencyName, reason)
        };
        break;
      }
    }

    if (!foundCase) {
      return { found: false, msg: 'ไม่มีเลขรับเรื่องดังกล่าว' };
    }

    foundCase.meetings = readMeetingsByCaseId_(ss, foundCase.caseId);
    return { found: true, data: foundCase };

  } catch (e) {
    return { found: false, msg: e && e.message ? e.message : String(e) };
  }
}

function readMeetingsByCaseId_(ss, caseId) {
  const meetings = [];
  const targetCaseId = cleanText_(caseId);
  const logSheet = ss.getSheetByName('MeetingLogs');

  if (!logSheet || !targetCaseId) {
    return meetings;
  }

  const logData = logSheet.getDataRange().getValues();
  const seen = {};

  for (let j = 1; j < logData.length; j++) {
    const rowCaseId = cleanText_(logData[j][0]);
    if (rowCaseId !== targetCaseId) {
      continue;
    }

    const round = cleanText_(logData[j][1]);
    const date = logData[j][2] instanceof Date
      ? Utilities.formatDate(logData[j][2], 'GMT+7', 'yyyy-MM-dd')
      : cleanText_(logData[j][2]);

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

  meetings.sort(function (a, b) {
    const ar = Number(String(a.round || '').replace(/[^0-9]/g, '')) || 0;
    const br = Number(String(b.round || '').replace(/[^0-9]/g, '')) || 0;
    if (ar !== br) return ar - br;
    return normalizeDateKey_(a.date).localeCompare(normalizeDateKey_(b.date));
  });

  return meetings;
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

function getStatusContractForExternalLookup() {
  return {
    new: ['เรื่องเข้าใหม่'],
    inProgress: ['อนุฯ พิจารณา', 'รอพิจารณา', 'กมธ. พิจารณา'],
    completed: ['ไม่รับเรื่อง', 'ยุติเรื่อง', 'ส่งหน่วยงาน', 'จัดทำรายงาน']
  };
}
