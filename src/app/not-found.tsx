import Link from 'next/link';
import { t } from '@/i18n';

export default function NotFound() {
  return (
    <section className="grid-bg flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-data">error_404</p>
      <h1 className="mt-4 font-display text-h2 font-bold">{t.notFound.title}</h1>
      <p className="mt-4 max-w-md text-dim">{t.notFound.body}</p>
      <Link
        href="/"
        className="mt-10 rounded-(--radius-s) border border-line px-6 py-3 font-medium text-ink transition-colors hover:border-pixel hover:text-pixel-soft"
      >
        {t.notFound.back}
      </Link>
    </section>
  );
}
