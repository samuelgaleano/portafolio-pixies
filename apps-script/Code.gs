/**
 * Receptor de leads de Pixies → Google Sheet (plan F5 §2.1).
 * Lo llama SOLO el servidor de Next (/api/leads) con JSON + secret compartido.
 * Despliegue paso a paso: ver DESPLIEGUE.md en esta carpeta.
 */

// ⚠️ Cambia esto por el MISMO valor que pongas en LEADS_SECRET (Vercel / .env.local)
var SECRET = 'CAMBIA-ESTE-SECRETO';

var COLUMNAS = ['timestamp', 'nombre', 'contacto', 'empresa', 'tipoProyecto', 'mensaje', 'desde', 'userAgent'];

// Anti formula-injection: un valor que empieza con = + - @ o tab se interpretaría como
// fórmula en Sheets (=IMPORTXML exfiltra datos, =HYPERLINK phishea). El apóstrofe lo
// neutraliza sin mostrarse, y protege también un futuro export a CSV/Excel.
function safe(v) {
  var s = String(v || '');
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  var out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);

  try {
    var body = JSON.parse(e.postData.contents);

    if (!body.secret || body.secret !== SECRET) {
      return out.setContent(JSON.stringify({ ok: false, error: 'auth' }));
    }

    // Lock: evita filas corruptas si llegan dos leads al mismo tiempo
    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      // Por nombre, no por posición: si Samuel añade/reordena pestañas, los leads no se pierden
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
      // Encabezados en la primera fila si la hoja está vacía
      if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNAS);
      sheet.appendRow([
        new Date(),
        safe(body.nombre),
        safe(body.contacto),
        safe(body.empresa),
        safe(body.tipoProyecto),
        safe(body.mensaje),
        safe(body.desde),
        safe(body.userAgent),
      ]);
    } finally {
      lock.releaseLock();
    }

    return out.setContent(JSON.stringify({ ok: true }));
  } catch (err) {
    return out.setContent(JSON.stringify({ ok: false, error: 'exception' }));
  }
}
