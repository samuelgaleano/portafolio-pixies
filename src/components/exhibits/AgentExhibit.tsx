'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { agentReplay } from '@/data/agent-replays';
import { t } from '@/i18n';

import type { ReplayStep } from '@/data/agent-replays';

// Diagrama de pipeline + consola replay, sincronizados (§12.B). Datos quemados.
// SSR muestra todos los logs y etapas (fallback estático legible); con JS + movimiento
// permitido, reproduce la secuencia. reduced-motion → estático.
const KIND_COLOR: Record<ReplayStep['kind'], string> = {
  cmd: 'text-data',
  info: 'text-dim',
  skill: 'text-pixel-soft',
  ok: 'text-ok',
  output: 'text-ink',
};

export default function AgentExhibit() {
  const total = agentReplay.steps.length;
  const [count, setCount] = useState(total); // SSR/no-JS: todo visible
  const [done, setDone] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const logRef = useRef<HTMLDivElement>(null);

  const play = () => {
    clearTimeout(timer.current);
    // arranca en el próximo tick: sin setState síncrono dentro del effect (react-hooks/set-state-in-effect)
    timer.current = setTimeout(() => {
      setDone(false);
      setCount(0);
      let i = 0;
      const tick = () => {
        i += 1;
        setCount(i);
        if (i < total) timer.current = setTimeout(tick, 420);
        else setDone(true);
      };
      timer.current = setTimeout(tick, 300);
    }, 0);
  };

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) play();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // autoscroll de la consola al aparecer líneas
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [count]);

  const visible = agentReplay.steps.slice(0, count);
  const activeStage = count > 0 ? agentReplay.steps[Math.min(count, total) - 1].stage : 0;

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* Diagrama de etapas */}
      <ol className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0">
        {agentReplay.pipeline.map((s, i) => {
          const state = i < activeStage ? 'done' : i === activeStage ? 'active' : 'idle';
          return (
            <Fragment key={s.label}>
              <li
                className={`flex-1 rounded-(--radius-s) border p-3 transition-colors ${
                  state === 'active'
                    ? 'border-pixel bg-pixel/10'
                    : state === 'done'
                      ? 'border-pixel/40'
                      : 'border-line'
                }`}
              >
                <p
                  className={`font-mono text-xs [font-variant-numeric:tabular-nums] ${state === 'idle' ? 'text-dim' : 'text-pixel-soft'}`}
                >
                  {String(i + 1).padStart(2, '0')} {s.label}
                </p>
                <p className="mt-1 text-xs text-dim">{s.description}</p>
              </li>
              {i < agentReplay.pipeline.length - 1 && (
                <span className="hidden items-center px-1 text-line md:flex" aria-hidden="true">
                  →
                </span>
              )}
            </Fragment>
          );
        })}
      </ol>

      {/* Consola replay */}
      <div className="overflow-hidden rounded-(--radius-m) border border-line bg-void">
        <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-2">
          <span className="font-mono text-xs text-dim">{t.exhibit.consoleLabel}</span>
          <button
            type="button"
            onClick={play}
            className="rounded-(--radius-s) border border-line px-2 py-1 font-mono text-xs text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
          >
            {done ? t.exhibit.replay : t.exhibit.running}
          </button>
        </div>
        <div ref={logRef} className="max-h-72 overflow-auto p-4">
          {/* solo phrasing content dentro de <pre> (HTML válido): spans en bloque */}
          <pre className="font-mono text-xs leading-relaxed">
            {visible.map((s, i) => (
              <span key={i} className={`block ${KIND_COLOR[s.kind]}`}>
                {s.text}
                {!done && i === visible.length - 1 && <span className="animate-pulse text-pixel">▋</span>}
              </span>
            ))}
          </pre>
        </div>
      </div>

      {agentReplay.repoUrl && (
        <a
          href={agentReplay.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-mono text-xs text-pixel-soft hover:underline"
        >
          {t.exhibit.viewCode}
        </a>
      )}
    </div>
  );
}
