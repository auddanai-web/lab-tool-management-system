const SHEETS = {
  TOOLS: 'Tools',
  SERVICE: 'ServiceRecords',
  CATEGORIES: 'Categories',
  LOCATIONS: 'Locations',
  USERS: 'Users',
  SETTINGS: 'Settings'
};

const DATABASE_SPREADSHEET_ID = '1GTDhKyjVeEvR4-Fhf1NtMZW6rLQJgn0fvlYehpF-VA8';
const SERVICE_RECORD_HEADERS = [
  'RecordID',
  'DateTime',
  'ToolID',
  'ToolName',
  'WorkType',
  'ProblemReason',
  'ActionDetail',
  'PerformedBy',
  'InspectionResult',
  'ReturnDateTime',
  'DocumentFileID',
  'RecordedBy',
  'CreatedAt'
];

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('ระบบจัดการเครื่องมือห้องปฏิบัติการ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(DATABASE_SPREADSHEET_ID);
}

function getSheet(name) {
  const sheet = getSpreadsheet().getSheetByName(name);

  if (!sheet) {
    throw new Error('ไม่พบชีต ' + name);
  }

  return sheet;
}

function getOrCreateSheet(name, headers) {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  if (headers && headers.length) {
    const currentHeaders = sheet.getLastColumn()
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : [];
    const hasHeaders = currentHeaders.some(header => header !== '');

    if (!hasHeaders) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      headers.forEach(header => {
        if (!currentHeaders.includes(header)) {
          sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
          currentHeaders.push(header);
        }
      });
    }
  }

  return sheet;
}

function getRows(sheetName) {
  const sheet = sheetName === SHEETS.SERVICE
    ? getOrCreateSheet(sheetName, SERVICE_RECORD_HEADERS)
    : getSheet(sheetName);
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) return [];

  const headers = values[0];
  return values.slice(1)
    .filter(row => row.some(cell => cell !== ''))
    .map(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = normalizeCellValue_(row[index]);
      });
      return item;
    });
}

function appendRow(sheetName, data) {
  const sheet = sheetName === SHEETS.SERVICE
    ? getOrCreateSheet(sheetName, SERVICE_RECORD_HEADERS)
    : getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => data[header] || '');
  sheet.appendRow(row);
}

function updateRowById(sheetName, idColumn, idValue, data) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf(idColumn);

  if (idIndex === -1) {
    throw new Error('ไม่พบคอลัมน์ ' + idColumn);
  }

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(idValue)) {
      headers.forEach((header, index) => {
        if (data[header] !== undefined) {
          sheet.getRange(i + 1, index + 1).setValue(data[header]);
        }
      });
      return true;
    }
  }

  return false;
}

function generateId(prefix, sheetName, idColumn) {
  if (sheetName === SHEETS.SERVICE) {
    getOrCreateSheet(sheetName, SERVICE_RECORD_HEADERS);
  }

  const rows = getRows(sheetName);
  const numbers = rows
    .map(row => String(row[idColumn] || ''))
    .filter(id => id.startsWith(prefix + '-'))
    .map(id => Number(id.replace(prefix + '-', '')))
    .filter(num => !isNaN(num));

  const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1;
  return prefix + '-' + String(nextNumber).padStart(4, '0');
}

function getDashboardData() {
  const tools = getRows(SHEETS.TOOLS);
  const serviceRecords = getRows(SHEETS.SERVICE);

  const statusCount = {};
  let calibrationRequiredCount = 0;
  let maintenanceRequiredCount = 0;
  const workTypeCount = {};

  tools.forEach(tool => {
    const status = tool.Status || 'ไม่ระบุ';
    statusCount[status] = (statusCount[status] || 0) + 1;

    if (isTruthy_(tool.Calibration)) calibrationRequiredCount++;
    if (isTruthy_(tool['Preventive Maintenance'])) maintenanceRequiredCount++;
  });

  serviceRecords.forEach(record => {
    const workType = record.WorkType || 'Other';
    workTypeCount[workType] = (workTypeCount[workType] || 0) + 1;
  });

  return {
    totalTools: tools.length,
    statusCount,
    calibrationRequiredCount,
    maintenanceRequiredCount,
    workTypeCount,
    recentTools: tools.slice(-10).reverse(),
    recentServiceRecords: serviceRecords.slice(-10).reverse()
  };
}

function getMasterData() {
  return {
    categories: getRows(SHEETS.CATEGORIES).filter(item => item.Active === true || item.Active === 'TRUE'),
    locations: getRows(SHEETS.LOCATIONS).filter(item => item.Active === true || item.Active === 'TRUE')
  };
}

function getTools() {
  return getRows(SHEETS.TOOLS);
}

function getServiceRecords() {
  return getRows(SHEETS.SERVICE);
}

function addTool(data) {
  const now = getTodayText_();

  data.ToolID = generateId('EQ', SHEETS.TOOLS, 'ToolID');
  data.Status = data.Status || 'พร้อมใช้งาน';
  data.CreatedAt = now;
  data.UpdatedAt = now;

  appendRow(SHEETS.TOOLS, data);

  return {
    success: true,
    toolId: data.ToolID
  };
}

function updateTool(data) {
  if (!data.ToolID) {
    throw new Error('ไม่พบรหัสเครื่องมือ');
  }

  data.UpdatedAt = getTodayText_();

  const updated = updateRowById(SHEETS.TOOLS, 'ToolID', data.ToolID, data);

  return {
    success: updated
  };
}

function addServiceRecord(data) {
  if (!data.DateTime) {
    throw new Error('กรุณาระบุวันเวลา ที่ดำเนินการ');
  }

  const tools = getRows(SHEETS.TOOLS);
  const tool = tools.find(item => item.ToolID === data.ToolID);

  data.RecordID = generateId('SR', SHEETS.SERVICE, 'RecordID');
  data.ToolName = data.ToolName || (tool ? formatToolDisplayName_(tool) : '');
  data.CreatedAt = getTodayText_();

  appendRow(SHEETS.SERVICE, data);

  if (data.ToolID && data.WorkType === 'Repair') {
    updateTool({
      ToolID: data.ToolID,
      Status: data.InspectionResult === 'ผ่าน' && data.ReturnDateTime ? 'พร้อมใช้งาน' : 'ซ่อมบำรุง'
    });
  }

  return {
    success: true,
    recordId: data.RecordID
  };
}

function getSetting(key) {
  const settings = getRows(SHEETS.SETTINGS);
  const setting = settings.find(item => item.Key === key);
  return setting ? setting.Value : '';
}

function normalizeCellValue_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (isNaN(value.getTime())) return '';
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  return value;
}

function getTodayText_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function formatToolDisplayName_(tool) {
  const thaiName = String(tool.ToolThaiName || '').trim();
  const englishName = String(tool.ToolName || '').trim();
  if (thaiName && englishName) return thaiName + ' (' + englishName + ')';
  return thaiName || englishName || '';
}

function isDateWithinAlert_(value, today, alertDays) {
  if (!value) return false;

  const date = new Date(value);
  if (isNaN(date.getTime())) return false;

  const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= alertDays;
}

function isTruthy_(value) {
  const text = String(value || '').trim().toLowerCase();
  if (!text) return false;
  if (['false', 'no', 'none', 'ไม่มี', 'ไม่', '0'].includes(text)) return false;
  return true;
}
