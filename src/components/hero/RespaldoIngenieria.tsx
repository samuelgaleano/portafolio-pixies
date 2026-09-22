import Link from 'next/link';
import Image from 'next/image';
import { t } from '@/i18n';

// Bloque de apoyo del hero de /web: el RESPALDO de ingeniería.
//
// Samuel (2026-09-22): "ese botón ponerlo como algo en relación al ingeniero que soporta o
// respalda este trabajo; no quiero que se vea muy importante la persona, sino darle enfoque
// a los productos". Antes era una tarjeta con un retrato grande y el nombre en titular — la
// persona mandaba. Ahora encabeza lo que importa (que cada producto lo construye y lo
// mantiene un ingeniero) y el nombre va abajo, chico, como firma. Sigue enlazando a
// /samuel, así que el barrido global (EngineerTransition) lo sigue interceptando.
//
// Ocupa el mismo lugar que los tres frentes en /marketing: los dos heros comparten
// estructura y cambian el contenido.
export default function RespaldoIngenieria() {
  return (
    <aside className="respaldo" aria-label={t.hero.respaldoEyebrow}>
      <span className="respaldo__eyebrow">{t.hero.respaldoEyebrow}</span>
      <p className="respaldo__linea">{t.hero.respaldoLinea}</p>
      <Link href="/samuel" data-desde="hero-portal" className="respaldo__quien">
        <Image
          src="/samuel/samuel-avatar.webp"
          alt=""
          width={80}
          height={80}
          sizes="40px"
          className="respaldo__avatar"
        />
        <span className="respaldo__texto">
          <span className="respaldo__nombre">{t.hero.respaldoQuien}</span>
          <span className="respaldo__rol">{t.hero.respaldoRol}</span>
        </span>
        <span className="respaldo__ir" aria-hidden="true">
          →
        </span>
      </Link>
    </aside>
  );
}
