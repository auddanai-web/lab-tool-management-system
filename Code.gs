const SHEETS = {
  TOOLS: 'Tools',
  MAINTENANCE: 'MaintenanceRecords',
  CALIBRATION: 'CalibrationRecords',
  CATEGORIES: 'Categories',
  LOCATIONS: 'Locations',
  USERS: 'Users',
  SETTINGS: 'Settings'
};

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('ระบบจัดการเครื่องมือห้องปฏิบัติการ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function getRows(sheetName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) return [];

  const headers = values[0];
  return values.slice(1)
    .filter(row => row.some(cell => cell !== ''))
    .map(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index];
      });
      return item;
    });
}

function appendRow(sheetName, data) {
  const sheet = getSheet(sheetName);
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
  const maintenance = getRows(SHEETS.MAINTENANCE);
  const calibration = getRows(SHEETS.CALIBRATION);

  const today = new Date();
  const calibrationAlertDays = Number(getSetting('CALIBRATION_ALERT_DAYS') || 30);
  const maintenanceAlertDays = Number(getSetting('MAINTENANCE_ALERT_DAYS') || 30);

  const statusCount = {};
  tools.forEach(tool => {
    const status = tool.Status || 'ไม่ระบุ';
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  const calibrationAlerts = calibration.filter(item => {
    if (!item.ExpireDate) return false;
    const expireDate = new Date(item.ExpireDate);
    const diffDays = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= calibrationAlertDays;
  });

  const maintenanceAlerts = maintenance.filter(item => {
    if (!item.NextMaintenanceDate) return false;
    const nextDate = new Date(item.NextMaintenanceDate);
    const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= maintenanceAlertDays;
  });

  return {
    totalTools: tools.length,
    statusCount,
    calibrationAlerts,
    maintenanceAlerts,
    recentTools: tools.slice(-10).reverse()
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

function addTool(data) {
  const now = new Date();

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

  data.UpdatedAt = new Date();

  const updated = updateRowById(SHEETS.TOOLS, 'ToolID', data.ToolID, data);

  return {
    success: updated
  };
}

function addMaintenanceRecord(data) {
  data.MaintenanceID = generateId('MT', SHEETS.MAINTENANCE, 'MaintenanceID');
  data.CreatedAt = new Date();

  appendRow(SHEETS.MAINTENANCE, data);

  if (data.ToolID) {
    updateTool({
      ToolID: data.ToolID,
      Status: data.Type === 'ซ่อม' ? 'ซ่อมบำรุง' : 'พร้อมใช้งาน'
    });
  }

  return {
    success: true,
    maintenanceId: data.MaintenanceID
  };
}

function addCalibrationRecord(data) {
  data.CalibrationID = generateId('CAL', SHEETS.CALIBRATION, 'CalibrationID');
  data.CreatedAt = new Date();

  appendRow(SHEETS.CALIBRATION, data);

  return {
    success: true,
    calibrationId: data.CalibrationID
  };
}

function getSetting(key) {
  const settings = getRows(SHEETS.SETTINGS);
  const setting = settings.find(item => item.Key === key);
  return setting ? setting.Value : '';
}
