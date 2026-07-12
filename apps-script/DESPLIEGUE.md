# Desplegar el receptor de leads (Google Sheet + Apps Script)

**10 minutos, una sola vez.** El resultado: una URL secreta que escribe cada lead en tu hoja de cálculo.

## 1. Crear el Sheet

1. Ve a [sheets.new](https://sheets.new) → nómbralo **"Leads Pixies"**.
2. No hace falta crear encabezados: el script los crea solos con el primer lead.

## 2. Pegar el script

1. En el Sheet: menú **Extensiones → Apps Script**.
2. Borra el contenido del editor y pega TODO el contenido de [`Code.gs`](./Code.gs).
3. En la línea `var SECRET = 'CAMBIA-ESTE-SECRETO'` pon un secreto tuyo (ej. una frase larga sin espacios). **Guárdalo: lo vas a necesitar en el paso 4.**
4. Guarda (Ctrl+S).

## 3. Desplegar como Web App

1. Botón **Implementar → Nueva implementación**.
2. En el engranaje ⚙ elige **Aplicación web**.
3. Configura exactamente:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier persona
4. **Implementar** → autoriza los permisos que pida (es tu propio script escribiendo en tu propia hoja).
5. Copia la **URL de la aplicación web** (termina en `/exec`).

## 4. Conectar con el sitio

Dos variables de entorno (ver `.env.example` en la raíz):

| Variable | Valor |
|---|---|
| `LEADS_WEBHOOK_URL` | la URL `/exec` del paso 3 |
| `LEADS_SECRET` | el secreto del paso 2 |

- **Local:** crea `.env.local` en la raíz del proyecto con ambas líneas.
- **Vercel:** Project → Settings → Environment Variables → agrega ambas (Production + Preview).

## 5. Probar

Con el sitio corriendo (`npm run dev`), llena el formulario de `/#contacto` y envía. Debe aparecer una fila nueva en el Sheet con timestamp. Si no:
- ¿La URL termina en `/exec` (no `/dev`)?
- ¿El SECRET es idéntico en ambos lados?
- ¿Autorizaste el script al desplegar?

## ⚠️ Si editas Code.gs después

**Implementar → Administrar implementaciones → ✏️ editar → Versión: Nueva → Implementar.**
Así la URL `/exec` se mantiene. (Una "Nueva implementación" desde cero genera OTRA URL y tendrías que actualizar la env var.)
