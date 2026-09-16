'use client';

import { useRef } from 'react';
import { escuchaProduct } from '@/data/escucha-comprendiendo';
import { buildWhatsAppUrl } from '@/lib/leads';
import { site } from '@/data/site';
import Pending from '@/components/ui/Pending';
import { t } from '@/i18n';
import EscuchaResultView from './EscuchaResultView';

// Ejemplo real ya procesado con la app de escritorio (§ plan "productos propios") — pestaña
// por defecto: sin red, siempre funciona, nunca depende de que el pipeline en vivo esté sano.
export default function EscuchaCuratedTour({ onTryLive }: { onTryLive: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { example } = escuchaProduct;

  if (!example.ready) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-(--radius-m) border border-dashed border-line p-6">
        <Pending>{t.escucha.curadaPendingTitle}</Pending>
        <p className="max-w-md text-sm text-dim">{t.escucha.curadaPendingBody}</p>
        <button
          type="button"
          onClick={onTryLive}
          className="font-mono text-sm text-pixel-soft hover:underline"
        >
          {t.escucha.curadaPendingCta}
        </button>
      </div>
    );
  }

  const waUrl = buildWhatsAppUrl(site.whatsapp, {
    nombre: 'Samuel',
    tipoProyecto: 'Producto propio (escuchacomprendiendo.ai)',
    mensaje: 'Vi la demo de escuchacomprendiendo.ai en el portafolio — quiero la app de escritorio.',
  });

  return (
    <div className="flex flex-col gap-5">
      <audio ref={audioRef} src={example.audioSrc} controls className="w-full" />
      <EscuchaResultView
        structured={example.structured}
        onCiteClick={(s) => {
          if (audioRef.current) audioRef.current.currentTime = s;
        }}
      />
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="press inline-flex w-fit items-center rounded-(--radius-s) bg-signal px-4 py-2.5 font-mono text-xs font-medium text-void transition hover:brightness-110"
      >
        {t.escucha.pedirApp}
      </a>
    </div>
  );
}
