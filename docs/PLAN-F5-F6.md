# Plan de ejecución F5–F6 (v2, arquitectura Next.js)

> **Estado:** PROPUESTO — esperando aprobación de Samuel para ejecutar.
> Reevalúa las fases restantes del [PLAN-MAESTRO](./PLAN-MAESTRO-FASE-0.md) (§8 leads, F5/F6 de §11) sobre la arquitectura actual: Next.js 16 + React 19 en Vercel, con ESLint/Vitest/CI ya operativos (auditoría 2026-07-12, main `e8c1483`).

---

## 1. Punto de partida (verificado)

- **Fases 0–4 completas y auditadas** (2 auditorías con subagente aplicadas: post-F2 y post-migración). Gates verdes: lint 0 · tests 13/13 · tsc · build 7/7 rutas.
- Fundamentos operativos: ESLint flat, Vitest, CI (check+lint+test+build en cada PR), README, .editorconfig.
- Preparado para F5 desde la auditoría: CTAs con `data-desde` (hero/header/samuel/midCta), tipos estrictos, `site.ts` centraliza `[COMPLETAR]`.
- Deuda visual del propio DESIGN.md §Motion: los **fade-up al entrar al viewport nunca se implementaron** (solo existe la secuencia del hero). Se salda en F6.

## 2. FASE 5 — Captación de leads, rediseñada para Next (decisión A)

### 2.1 El cambio de arquitectura y por qué

El plan original (§8) era: navegador → `fetch no-cors` → Apps Script → Sheet. Ese diseño cargaba tres riesgos documentados (§15): **respuesta opaca** (nunca sabes si guardó), validación solo en cliente, y URL del Apps Script expuesta en el bundle. Con servidor real disponible, lo correcto es:

```
CTA [data-desde] ─► listener global (≈15 líneas, client) ─► sessionStorage
                                                                │
Usuario llena LeadForm (client component en #contacto) ─────────┤
                                                                ▼
                                   POST /api/leads (Route Handler, servidor)
                                   ├─ valida payload (Zod-lite propio, TDD)
                                   ├─ honeypot + rate-limit básico
                                   ├─ fetch → Apps Script (server-to-server,
                                   │   SIN CORS, respuesta LEGIBLE)
                                   └─ responde { ok: true } | { error }
                                                                │
UI: "Recibido ✓ — abriendo WhatsApp…" ◄─────────────────────────┘
     └─► redirect a wa.me/<numero>?text=<resumen> (SOLO tras ok o timeout de gracia 2.5s)
```

| Aspecto | Original (no-cors) | **Route Handler (propuesto)** |
|---|---|---|
| Confirmación de guardado | Imposible (opaca) | **Real** — se lee la respuesta del Apps Script |
| Validación en frontera de confianza | Solo cliente | **Servidor** (+ cliente para UX) |
| URL del Apps Script | Expuesta en el bundle | **Oculta** en env var del servidor |
| CORS | Hack `no-cors` form-encoded | No aplica (server-to-server, JSON limpio) |
| Testeable | Difícil | **Unit + handler tests** con fetch mockeado |

**La regla de oro del plan se conserva:** el lead queda guardado ANTES de redirigir a WhatsApp, y si el guardado falla se muestran contacto directo (correo + botón wa.me) — un lead nunca se pierde en silencio.

Google Sheets sigue siendo el almacenamiento (requisito: Samuel ve sus leads en una hoja, costo $0). El Apps Script se simplifica: recibe JSON directo, valida token compartido (`LEADS_SECRET`), `LockService`, `appendRow`, responde JSON.

### 2.2 Contratos (cerrados antes de codificar)

```ts
// src/lib/leads.ts
export interface LeadPayload {
  nombre: string;            // requerido, 2..80 chars
  contacto: string;          // requerido: email válido O teléfono (7-15 dígitos, +opcional)
  empresa?: string;          // opcional, ≤120
  tipoProyecto: string;      // uno de categories.projectType | 'Otro'
  mensaje?: string;          // opcional, ≤1000
  desde: string;             // origen del clic (sessionStorage), default 'directo'
  website?: string;          // honeypot: si viene con contenido → descartar como ok "silencioso"
}
// POST /api/leads → 200 {ok:true} | 400 {error:'validacion', campos:[...]} | 502 {error:'guardado'}
```

- **Env:** `LEADS_WEBHOOK_URL` y `LEADS_SECRET` (server-only, sin `NEXT_PUBLIC`). Se añade `.env.example` documentado; en Vercel se configuran al desplegar.
- **Sheet columnas** (igual §8): `timestamp | nombre | contacto | empresa | tipoProyecto | mensaje | desde | userAgent`.
- **Pre-selección:** `desde` (id de categoría) → `categories.projectType` para el select.

### 2.3 Plan TDD (obligatorio por §17; rojo→verde como en la auditoría)

| Test (primero) | Implementación (después) |
|---|---|
| `validateLead`: nombre corto/vacío, email válido, teléfono válido, contacto inválido, límites de longitud, honeypot lleno | `src/lib/leads.ts` validación pura |
| `buildWhatsAppUrl`: número limpio, texto URL-encoded con nombre/tipo/mensaje, sin `undefined` | helper puro |
| `desdeToProjectType`: ids de categoría → label; desconocido → 'Otro' | helper puro |
| `POST /api/leads` (handler importado, `fetch` saliente mockeado — única frontera mockeada): 200 feliz, 400 por campo, honeypot→200 sin forward, 502 si Apps Script falla | `src/app/api/leads/route.ts` |
| Smoke Playwright (si se aprueba §4): flujo del form con API respondiendo mock | — |

### 2.4 Entregables F5

1. `apps-script/Code.gs` (JSON + secret + LockService) y `apps-script/DESPLIEGUE.md` paso a paso.
2. `src/lib/leads.ts` + tests (TDD).
3. `src/app/api/leads/route.ts` + tests de handler.
4. `LeadForm.tsx` (client): campos §8, validación con mensajes accesibles (`aria-invalid`/`aria-describedby`/`aria-live`), estados enviar→guardando→éxito→error honesto, pre-selección por `desde`, redirect wa.me.
5. Listener global `data-desde` → sessionStorage (componente client mínimo en layout).
6. `.env.example` + README sección leads.
7. **Gate:** unit+handler verdes, flujo verificado en navegador con endpoint real local (Apps Script simulado), auditoría de la fase (§5). **E2E real** (Sheet + WhatsApp verdaderos) queda con checklist lista, bloqueado solo por datos de Samuel (#2 WhatsApp, #3 correo, #5 Sheet — no bloquean el desarrollo).

## 3. FASE 6 — Pulido + paquete visual/innovación (decisión B)

Pendientes del plan original: OG images, banda **EngineerTeaser** (§5), auditoría a11y completa, QA responsivo matriz §10, README de operación final, inventario `[COMPLETAR]`, Lighthouse en producción real.

**Nuevo requerimiento explícito de Samuel:** el portafolio debe ser *innovador y visualmente llamativo* (es la carta de presentación de la empresa Y del ingeniero). Propuesta evaluada contra el presupuesto de performance (≥90) y la disciplina del DESIGN.md ("boldness concentrado"):

| # | Mejora visual | Qué aporta | Costo | Veredicto |
|---|---|---|---|---|
| V1 | **View Transitions** (flag experimental de Next 16) | Navegación home↔samuel↔posts con transición suave tipo app — se siente premium | ~0 KB (nativo) + fallback automático | ✅ Recomendado |
| V2 | **Scroll-reveals** (fade-up al entrar secciones) | Deuda del propio DESIGN.md §Motion; da ritmo narrativo al one-page | CSS + observer ~1 KB | ✅ Recomendado |
| V3 | **OG images generadas con `next/og`** | Al compartir por WhatsApp/LinkedIn cada página muestra tarjeta con identidad pixel (título dinámico en posts) — pro e "innovador" donde más se ve | 0 KB cliente (se genera en servidor/build) | ✅ Recomendado |
| V4 | **Hero ambiente: retícula pixel reactiva al cursor** (los píxeles cercanos al mouse se iluminan en violeta; desktop only, rAF throttled, off con reduced-motion) | Extiende la firma #1 (hero) con interactividad memorable — el "wow" de estudio boutique | ~6 KB vanilla | 🟡 Opcional — decide Samuel |
| V5 | framer-motion en exhibits | Poco que CSS no haga ya aquí | +30 KB gz | ❌ No recomendado |

Con V1–V3 (+V4 si quieres) el sitio gana el factor "llama la atención" sin romper presupuesto ni disciplina de marca.

## 4. Tests generales del entorno (decisión C) — smoke E2E con Playwright

Hoy la pirámide es: unit (Vitest) + validación en build + detector impeccable + Lighthouse + verificación manual en navegador. El hueco: **nada automatizado ejercita el navegador** (ejemplo real: el scroll-spy quedó pendiente de re-verificación porque el panel de preview se suspendió). Propuesta: **4 smoke tests Playwright** (chromium headless, corren en CI):

1. Home renderiza: hero + 6 categorías + tarjetas visibles.
2. `/samuel` y un post renderizan (título, fecha, código con highlight).
3. Scroll-spy: al scrollear a #erp, el chip gana `aria-current`.
4. LeadForm: validación en cliente + envío feliz contra `/api/leads` mockeado.

Costo: +1 dep dev (~2 min de CI), mantenimiento bajo (4 tests). Beneficio: regresiones de navegador cazadas en CI + señal de ingeniería seria en un repo público. 🟡 Recomendado, decide Samuel.

## 5. Loop de calidad por fase (se aplica a F5 y F6, como pediste)

```
construir (TDD donde hay lógica) → gates locales (lint+test+tsc+build)
→ verificación real en navegador → detector impeccable
→ AUDITORÍA con subagente de contexto aislado → aplicar fixes por severidad
→ documentar (DECISIONES.md + bitácora) → PR → CI verde → merge
```

Además, al cierre de F6: auditoría **final global** (arquitectura+a11y+perf+copy contra los 8 criterios de aceptación del prompt maestro) + opcionalmente tu `/code-review ultra` sobre el estado final.

## 6. Orden de ejecución propuesto

| Paso | Contenido | Gate |
|---|---|---|
| 1 | **F5 completa** (§2, con TDD) | gates + navegador + auditoría F5 → PR |
| 2 | **Playwright smoke** (si se aprueba) | 4 tests verdes en CI |
| 3 | **F6 parte visual** (V1–V3 ±V4) + EngineerTeaser | gates + Lighthouse ≥90 + detector |
| 4 | **F6 pulido final** (a11y, QA matriz, README ops, inventario [COMPLETAR], docs) | auditoría global final → PR |
| 5 | *(fin, cuando tú digas)* deploy Vercel + env vars + E2E real de leads + revocar token | Lighthouse en URL real |

**Datos tuyos que NO bloquean el desarrollo pero sí el E2E final:** WhatsApp (+57…), correo de contacto, y crear el Google Sheet (te guío con DESPLIEGUE.md, 10 min).

---

## 7. Decisiones que requieren tu aprobación

- **A. Arquitectura de leads:** Route Handler `/api/leads` (recomendada) vs diseño original no-cors directo.
- **B. Paquete visual:** V1+V2+V3 recomendados; V4 (hero reactivo al cursor) opcional; V5 descartado salvo que lo pidas.
- **C. Smoke tests Playwright:** sí/no.

Con tu respuesta, la ejecución arranca por el paso 1 sin re-planificar.
