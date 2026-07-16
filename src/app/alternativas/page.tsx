import type { Metadata } from 'next';

// Exploración VISUAL de direcciones de diseño/color (paso 5 de instrucciones_cambios hoy):
// 5 alternativas + la actual como referencia, en maquetas estáticas SIN interacción.
// No está enlazada desde la navegación: se visita directo en /alternativas para evaluar
// un posible cambio futuro. El diseño vigente del sitio no se toca.
export const metadata: Metadata = {
  title: 'Alternativas de diseño (exploración)',
  description: 'Maquetas estáticas de posibles direcciones de color para el portafolio.',
  robots: { index: false, follow: false },
};

interface Theme {
  id: string;
  name: string;
  note: string;
  vars: {
    bg: string;
    surface: string;
    line: string;
    ink: string;
    dim: string;
    accent: string; // reemplaza al violeta de marca
    accentSoft: string;
    signal: string; // CTA de conversión
  };
}

const themes: Theme[] = [
  {
    id: 'actual',
    name: 'Actual · Ensamblaje de píxeles',
    note: 'La referencia: negro azulado + violeta. Es la identidad vigente del sitio.',
    vars: { bg: '#0b0d12', surface: '#141824', line: '#262c3d', ink: '#f2f3f7', dim: '#9aa3b8', accent: '#7c5cff', accentSoft: '#a78bff', signal: '#ff5d73' },
  },
  {
    id: 'papel',
    name: 'A · Papel técnico (claro)',
    note: 'Modo claro editorial: papel frío, tinta densa y el mismo violeta. Se siente estudio de diseño diurno.',
    vars: { bg: '#f5f5fa', surface: '#ffffff', line: '#e2e4ef', ink: '#15171f', dim: '#5b6274', accent: '#6d4aff', accentSoft: '#7f63f0', signal: '#e8465f' },
  },
  {
    id: 'ambar',
    name: 'B · Ámbar terminal',
    note: 'Fósforo ámbar sobre negro cálido: vibra retro-terminal, muy "ingeniería de los 80" sin dejar de ser premium.',
    vars: { bg: '#0d0b07', surface: '#181309', line: '#2f2614', ink: '#f6f0e3', dim: '#b4a887', accent: '#ffb224', accentSoft: '#ffc95e', signal: '#ff5d73' },
  },
  {
    id: 'esmeralda',
    name: 'C · Esmeralda técnica',
    note: 'Verde señal sobre carbón azulado: lee "sistemas en producción" (monitoreo, terminales, uptime).',
    vars: { bg: '#071010', surface: '#0e1a18', line: '#16302a', ink: '#eef7f4', dim: '#93aca4', accent: '#2fd6a3', accentSoft: '#5fe4bb', signal: '#ff6b5e' },
  },
  {
    id: 'tinta',
    name: 'D · Tinta monocroma',
    note: 'Casi blanco y negro, con el coral reservado para convertir. Máxima sobriedad: el trabajo es el color.',
    vars: { bg: '#0a0a0c', surface: '#131318', line: '#26262e', ink: '#f4f4f6', dim: '#9a9aa6', accent: '#c9c9d6', accentSoft: '#e2e2ea', signal: '#ff5d73' },
  },
  {
    id: 'lavanda',
    name: 'E · Lavanda de día',
    note: 'La marca violeta llevada a claro: lavanda de fondo, tinta morada oscura. Amable y muy reconocible.',
    vars: { bg: '#f2eefc', surface: '#ffffff', line: '#ded6f3', ink: '#1c1533', dim: '#665e8c', accent: '#7c5cff', accentSoft: '#5f3ee0', signal: '#ff4d6d' },
  },
];

// Maqueta estática (sin interacción): mini-hero + chips + tarjeta, pintados con las
// variables del tema. pointer-events-none: aquí no se navega, solo se mira.
function Preview({ t: th }: { t: Theme }) {
  const v = th.vars;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none overflow-hidden rounded-(--radius-m) border"
      style={{ background: v.bg, borderColor: v.line }}
    >
      {/* mini header */}
      <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: v.line }}>
        <span className="font-display text-sm font-bold" style={{ color: v.ink }}>pixies</span>
        <span className="rounded-(--radius-s) px-2.5 py-1 font-display text-xs font-semibold" style={{ background: v.signal, color: v.bg }}>
          Trabajemos juntos
        </span>
      </div>
      {/* mini hero */}
      <div className="px-5 pb-6 pt-5">
        <p className="font-mono text-[10px]" style={{ color: v.accentSoft }}>/digital·web·design</p>
        <p className="mt-1 font-display text-4xl font-bold tracking-tight" style={{ color: v.ink }}>
          PIX<span style={{ color: v.accent }}>IES</span>
        </p>
        <p className="mt-2 max-w-[36ch] text-xs leading-relaxed" style={{ color: v.dim }}>
          Ingeniería que se ve: sitios, sistemas y datos que corren en producción.
        </p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-(--radius-s) px-3 py-1.5 font-mono text-[10px] font-semibold" style={{ background: v.signal, color: v.bg }}>
            Quiero trabajar con Pixies
          </span>
          <span className="rounded-(--radius-s) border px-3 py-1.5 font-mono text-[10px]" style={{ borderColor: v.accent, color: v.accentSoft }}>
            Conócelo →
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['landing pages', 'e-commerce', 'erp a medida', 'datos', 'ia'].map((c) => (
            <span key={c} className="rounded-(--radius-s) border px-2 py-0.5 font-mono text-[9px]" style={{ borderColor: v.line, color: v.dim }}>
              {c}
            </span>
          ))}
        </div>
        {/* mini tarjeta de proyecto */}
        <div className="mt-4 overflow-hidden rounded-(--radius-s) border" style={{ borderColor: v.line, background: v.surface }}>
          <div className="h-14" style={{ background: `linear-gradient(120deg, ${v.accent}33, transparent 60%), ${v.surface}` }} />
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-display text-xs font-semibold" style={{ color: v.ink }}>Sistema POS</span>
            <span className="rounded-(--radius-s) border px-2 py-0.5 font-mono text-[9px]" style={{ borderColor: v.accent, color: v.accentSoft }}>
              Ver demo →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AlternativasPage() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pt-28 pb-20 sm:px-6">
      <p className="font-mono text-sm text-data">/exploración · solo visual · sin interacción</p>
      <h1 className="mt-3 font-display text-hero font-bold text-ink">Alternativas de diseño</h1>
      <p className="mt-4 max-w-2xl text-dim">
        Cinco direcciones de color en maqueta estática, junto a la identidad actual como referencia. Nada de
        esto está aplicado al sitio: es material para decidir con calma si algún día cambiamos de piel.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {themes.map((th) => (
          <article key={th.id}>
            <Preview t={th} />
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-base font-semibold text-ink">{th.name}</h2>
                <p className="mt-1 text-xs text-dim">{th.note}</p>
              </div>
              <div className="mt-1 flex shrink-0 gap-1" aria-hidden="true">
                {[th.vars.bg, th.vars.surface, th.vars.accent, th.vars.signal, th.vars.ink].map((c, i) => (
                  <span key={i} className="size-4 rounded-[3px] border border-line" style={{ background: c }} />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-12 font-mono text-xs text-dim">
        Para elegir: dime la letra (A–E) y preparo la migración de tokens en una rama aparte — el sitio actual
        no se toca hasta que lo apruebes.
      </p>
    </section>
  );
}
