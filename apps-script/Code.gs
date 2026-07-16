/**
 * Receptor de leads de Pixies → Google Sheet (plan F5 §2.1).
 * Lo llama SOLO el servidor de Next (/api/leads) con JSON + secret compartido.
 * Despliegue: crear un Sheet → Extensiones → Apps Script → pegar esto → guardar el
 * secreto en Configuración del proyecto → Propiedades del script (clave SECRET) →
 * Implementar como App web (Ejecutar como: yo, Acceso: cualquiera). La URL /exec va en
 * LEADS_WEBHOOK_URL de Vercel; SECRET debe coincidir con LEADS_SECRET.
 */

// El secreto vive en Propiedades del script (Configuración del proyecto), NO en el código:
// así el repo puede ser público sin filtrar nada. Debe ser el MISMO valor que LEADS_SECRET
// en Vercel / .env.local.
var SECRET = PropertiesService.getScriptProperties().getProperty('SECRET');

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

    // sin SECRET configurado, o secret que no coincide → se rechaza (no se guarda nada)
    if (!SECRET || !body.secret || body.secret !== SECRET) {
      return out.setContent(JSON.stringify({ ok: false, error: 'auth' }));
    }

    // Lock: evita filas corruptas si llegan dos leads al mismo tiempo
    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      // Por nombre, no por posición: si se añaden/reordenan pestañas, los leads no se pierden
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
