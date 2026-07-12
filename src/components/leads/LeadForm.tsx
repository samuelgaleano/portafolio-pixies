'use client';

import { useEffect, useState } from 'react';
import { buildWhatsAppUrl, desdeToProjectType, validateLead, PROJECT_TYPES } from '@/lib/leads';
import { site } from '@/data/site';
import { t } from '@/i18n';

type Status = 'idle' | 'sending' | 'success' | 'error-guardado' | 'error-rate';

const waDigits = site.whatsapp.replace(/\D/g, '');
const waReady = waDigits.length >= 10; // placeholder [COMPLETAR] → sin redirección
const emailReady = !site.email.startsWith('[COMPLETAR');

const inputCls =
  'w-full rounded-(--radius-s) border border-line bg-surface px-4 py-3 text-ink placeholder:text-dim/70 focus:border-pixel focus:outline-none';

export default function LeadForm() {
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [tipoProyecto, setTipoProyecto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [desde, setDesde] = useState('directo');
  const [campos, setCampos] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  // Pre-selección según la sección de origen del clic (§8).
  // Diferida al próximo tick: sin setState síncrono en el effect (react-hooks/set-state-in-effect).
  useEffect(() => {
    const id = setTimeout(() => {
      const origen = sessionStorage.getItem('pixies-desde') ?? 'directo';
      setDesde(origen);
      const tipo = desdeToProjectType(origen);
      if (tipo) setTipoProyecto(tipo);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const err = (campo: string) => campos.includes(campo);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { nombre, contacto, empresa, tipoProyecto, mensaje, desde, website };
    const valid = validateLead(payload);
    if (!valid.ok) {
      setCampos(valid.campos);
      // llevar el foco al primer campo con error (lectores de pantalla incluidos)
      const first = valid.campos[0] === 'tipoProyecto' ? 'tipo' : valid.campos[0];
      document.getElementById(`lead-${first}`)?.focus();
      return;
    }
    setCampos([]);
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 429) return setStatus('error-rate');
      if (!res.ok) return setStatus('error-guardado');
      setStatus('success');
      // Regla de oro (§8): el lead YA está guardado; la redirección es un extra.
      if (waReady) {
        setTimeout(() => {
          window.location.href = buildWhatsAppUrl(site.whatsapp, { nombre, tipoProyecto, mensaje });
        }, 1200);
      }
    } catch {
      setStatus('error-guardado');
    }
  }

  const disabled = status === 'sending' || status === 'success';

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 flex max-w-xl flex-col gap-5">
      <div>
        <label htmlFor="lead-nombre" className="mb-1.5 block font-mono text-xs text-dim">
          {t.form.nombre}
        </label>
        <input
          id="lead-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder={t.form.nombrePh}
          autoComplete="name"
          aria-invalid={err('nombre')}
          aria-describedby={err('nombre') ? 'err-nombre' : undefined}
          className={inputCls}
        />
        {err('nombre') && (
          <p id="err-nombre" className="mt-1.5 font-mono text-xs text-err">
            {t.form.errores.nombre}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lead-contacto" className="mb-1.5 block font-mono text-xs text-dim">
          {t.form.contacto}
        </label>
        <input
          id="lead-contacto"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
          placeholder={t.form.contactoPh}
          autoComplete="email"
          inputMode="email"
          aria-invalid={err('contacto')}
          aria-describedby={err('contacto') ? 'err-contacto' : undefined}
          className={inputCls}
        />
        {err('contacto') && (
          <p id="err-contacto" className="mt-1.5 font-mono text-xs text-err">
            {t.form.errores.contacto}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-empresa" className="mb-1.5 block font-mono text-xs text-dim">
            {t.form.empresa}
          </label>
          <input
            id="lead-empresa"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            placeholder={t.form.empresaPh}
            autoComplete="organization"
            maxLength={120}
            aria-invalid={err('empresa')}
            aria-describedby={err('empresa') ? 'err-empresa' : undefined}
            className={inputCls}
          />
          {err('empresa') && (
            <p id="err-empresa" className="mt-1.5 font-mono text-xs text-err">
              {t.form.errores.empresa}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="lead-tipo" className="mb-1.5 block font-mono text-xs text-dim">
            {t.form.tipo}
          </label>
          <select
            id="lead-tipo"
            value={tipoProyecto}
            onChange={(e) => setTipoProyecto(e.target.value)}
            aria-invalid={err('tipoProyecto')}
            aria-describedby={err('tipoProyecto') ? 'err-tipo' : undefined}
            className={inputCls}
          >
            <option value="" disabled>
              {t.form.tipoPh}
            </option>
            {PROJECT_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {err('tipoProyecto') && (
            <p id="err-tipo" className="mt-1.5 font-mono text-xs text-err">
              {t.form.errores.tipoProyecto}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="lead-mensaje" className="mb-1.5 block font-mono text-xs text-dim">
          {t.form.mensaje}
        </label>
        <textarea
          id="lead-mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder={t.form.mensajePh}
          rows={4}
          maxLength={1000}
          aria-invalid={err('mensaje')}
          aria-describedby={err('mensaje') ? 'err-mensaje' : undefined}
          className={inputCls}
        />
        {err('mensaje') && (
          <p id="err-mensaje" className="mt-1.5 font-mono text-xs text-err">
            {t.form.errores.mensaje}
          </p>
        )}
      </div>

      {/* honeypot: invisible para humanos; los bots lo llenan y el servidor los descarta */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input
          id="lead-website"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={disabled}
          className="rounded-(--radius-s) bg-signal px-6 py-3 font-semibold text-void transition hover:brightness-110 disabled:opacity-60"
        >
          {status === 'sending' ? t.form.enviando : t.form.enviar}
        </button>
      </div>

      {/* estado anunciado a lectores de pantalla */}
      <div aria-live="polite" className="min-h-6">
        {status === 'success' && (
          <p className="font-mono text-sm text-ok">{waReady ? t.form.exito : t.form.exitoSinWa}</p>
        )}
        {status === 'error-rate' && <p className="font-mono text-sm text-err">{t.form.errorRate}</p>}
        {status === 'error-guardado' && (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-sm text-err">{t.form.errorGuardado}</p>
            <p className="flex flex-wrap gap-4 font-mono text-xs">
              {waReady && (
                <a
                  href={`https://wa.me/${waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pixel-soft underline"
                >
                  {t.form.waDirecto}
                </a>
              )}
              {emailReady ? (
                <a href={`mailto:${site.email}`} className="text-pixel-soft underline">
                  {t.form.correo}: {site.email}
                </a>
              ) : (
                <span className="text-dim">{site.email}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
