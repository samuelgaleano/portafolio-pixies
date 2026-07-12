'use client';

// Error boundary con voz de marca (los error.tsx deben ser client components).
export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="grid-bg flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-data">error_inesperado</p>
      <h1 className="mt-4 font-display text-h2 font-bold">Algo se desensambló</h1>
      <p className="mt-4 max-w-md text-dim">
        No es tu culpa: un error nuestro. Puedes intentar de nuevo, y si persiste, el resto del sitio sigue
        funcionando.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-10 rounded-(--radius-s) border border-line px-6 py-3 font-medium text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
      >
        Intentar de nuevo
      </button>
    </section>
  );
}
