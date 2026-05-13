/**
 * LOS AMIGOS — SEATING APP BACKEND v2
 * Adds: Layouts (per-staffing section maps), Servers (roster + rotation state), Shift (current state)
 *
 * IF YOU ALREADY DEPLOYED v1: Just paste this whole file over the old code,
 * save, then Deploy → Manage deployments → pencil icon → New version → Deploy.
 * The Web App URL stays the same.
 */

const SHEET_TABLES        = 'Tables';
const SHEET_WAITLIST      = 'Waitlist';
const SHEET_RESERVATIONS  = 'Reservations';
const SHEET_LAYOUTS       = 'Layouts';
const SHEET_SERVERS       = 'Servers';
const SHEET_SHIFT         = 'Shift';
const SHEET_LOG           = 'Log';

const TABLE_HEADERS    = ['id','label','seats','shape','x','y','width','height','status','section','assignedServerId','updated'];
const WAITLIST_HEADERS = ['id','name','partySize','phone','notes','addedAt','status','seatedAt','tableId','serverIdAtSeat','walkReason'];
const RES_HEADERS      = ['id','name','partySize','phone','time','date','notes','status','tableId'];
const LAYOUT_HEADERS   = ['layoutKey','name','staffing','tableId','section'];
const SERVER_HEADERS   = ['id','name','section','active','tablesOwn','tablesHandoff','covers','skips','lastSeatedAt','skippedAt','startedAt','tablesTotal'];
const SHIFT_HEADERS    = ['key','value'];
const LOG_HEADERS      = ['ts','event','data'];

function doGet(e)  { return handle(e); }
function doPost(e) { return handle(e); }

function handle(e) {
  try {
    ensureSheets_();
    const action = (e.parameter && e.parameter.action) || 'getAll';
    let payload = {};
    if (e.postData && e.postData.contents) {
      try { payload = JSON.parse(e.postData.contents); } catch (_) {}
    }
    let result;
    switch (action) {
      case 'getAll':            result = getAll_(); break;
      case 'saveTables':        result = saveSheet_(SHEET_TABLES, TABLE_HEADERS, payload.items || []); break;
      case 'saveWaitlist':      result = saveSheet_(SHEET_WAITLIST, WAITLIST_HEADERS, payload.items || []); break;
      case 'saveReservations':  result = saveSheet_(SHEET_RESERVATIONS, RES_HEADERS, payload.items || []); break;
      case 'saveLayouts':       result = saveSheet_(SHEET_LAYOUTS, LAYOUT_HEADERS, payload.items || []); break;
      case 'saveServers':       result = saveSheet_(SHEET_SERVERS, SERVER_HEADERS, payload.items || []); break;
      case 'saveShift':         result = saveSheet_(SHEET_SHIFT, SHIFT_HEADERS, payload.items || []); break;
      case 'appendLog':         result = appendLog_(payload.entries || []); break;
      default: result = { error: 'unknown action: ' + action };
    }
    return json_(result);
  } catch (err) {
    return json_({ error: String(err && err.message || err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function ensureSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureTab_(ss, SHEET_TABLES, TABLE_HEADERS);
  ensureTab_(ss, SHEET_WAITLIST, WAITLIST_HEADERS);
  ensureTab_(ss, SHEET_RESERVATIONS, RES_HEADERS);
  ensureTab_(ss, SHEET_LAYOUTS, LAYOUT_HEADERS);
  ensureTab_(ss, SHEET_SERVERS, SERVER_HEADERS);
  ensureTab_(ss, SHEET_SHIFT, SHIFT_HEADERS);
  ensureTab_(ss, SHEET_LOG, LOG_HEADERS);
}

function ensureTab_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
  } else {
    const cur = sh.getRange(1, 1, 1, Math.max(headers.length, sh.getLastColumn() || 1)).getValues()[0];
    const empty = cur.every(c => c === '' || c === null);
    if (empty) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sh.setFrozenRows(1);
    } else if (sh.getLastColumn() < headers.length) {
      sh.getRange(1, sh.getLastColumn() + 1, 1, headers.length - sh.getLastColumn())
        .setValues([headers.slice(sh.getLastColumn())]).setFontWeight('bold');
    }
  }
}

function getAll_() {
  return {
    tables:       readSheet_(SHEET_TABLES, TABLE_HEADERS),
    waitlist:     readSheet_(SHEET_WAITLIST, WAITLIST_HEADERS),
    reservations: readSheet_(SHEET_RESERVATIONS, RES_HEADERS),
    layouts:      readSheet_(SHEET_LAYOUTS, LAYOUT_HEADERS),
    servers:      readSheet_(SHEET_SERVERS, SERVER_HEADERS),
    shift:        readSheet_(SHEET_SHIFT, SHIFT_HEADERS),
    fetchedAt:    Date.now()
  };
}

function readSheet_(name, headers) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) return [];
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return [];
  const values = sh.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values
    .filter(row => row.some(c => c !== '' && c !== null))
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
}

function saveSheet_(name, headers, items) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  const lastRow = sh.getLastRow();
  if (lastRow > 1) {
    sh.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }
  if (!items.length) return { ok: true, count: 0 };
  const rows = items.map(item => headers.map(h => item[h] === undefined ? '' : item[h]));
  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  return { ok: true, count: rows.length };
}

function appendLog_(entries) {
  if (!entries.length) return { ok: true, count: 0 };
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_LOG);
  const rows = entries.map(e => [e.ts || Date.now(), e.event || '', JSON.stringify(e.data || {})]);
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, 3).setValues(rows);
  return { ok: true, count: rows.length };
}
