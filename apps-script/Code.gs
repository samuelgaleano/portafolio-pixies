/**
 * Receptor de leads de Pixies → Google Sheet (plan F5 §2.1).
 * Lo llama SOLO el servidor de Next (/api/leads) con JSON + secret compartido.
 * Despliegue paso a paso: ver DESPLIEGUE.md en esta carpeta.
 */

// ⚠️ Cambia esto por el MISMO valor que pongas en LEADS_SECRET (Vercel / .env.local)
var SECRET = 'CAMBIA-ESTE-SECRETO';

var COLUMNAS = ['timestamp', 'nombre', 'contacto', 'empresa', 'tipoProyecto', 'mensaje', 'desde', 'userAgent'];

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
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      // Encabezados en la primera fila si la hoja está vacía
      if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNAS);
      sheet.appendRow([
        new Date(),
        String(body.nombre || ''),
        String(body.contacto || ''),
        String(body.empresa || ''),
        String(body.tipoProyecto || ''),
        String(body.mensaje || ''),
        String(body.desde || ''),
        String(body.userAgent || ''),
      ]);
    } finally {
      lock.releaseLock();
    }

    return out.setContent(JSON.stringify({ ok: true }));
  } catch (err) {
    return out.setContent(JSON.stringify({ ok: false, error: 'exception' }));
  }
}
