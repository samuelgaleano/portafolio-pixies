import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Blog/foro (§7.4). Publicar = crear un .mdx en src/content/posts/ + commit.
const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');

export interface Post {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  tags?: string[];
  draft: boolean;
  content: string;
}

function invalid(filename: string, field: string, why: string): never {
  throw new Error(`Post inválido "${filename}": campo "${field}" ${why}.`);
}

// Valida el frontmatter y FALLA el build con un post mal formado (contrato §7.4),
// nombrando archivo y campo — nada de strings vacíos ni Invalid Date silenciosos.
export function parsePost(raw: string, filename: string): Post {
  const { data, content } = matter(raw);
  if (typeof data.title !== 'string' || !data.title.trim()) invalid(filename, 'title', 'es obligatorio');
  if (typeof data.description !== 'string' || !data.description.trim())
    invalid(filename, 'description', 'es obligatorio');
  if (data.pubDate === undefined) invalid(filename, 'pubDate', 'es obligatorio');
  const pubDate = new Date(data.pubDate);
  if (Number.isNaN(pubDate.getTime())) invalid(filename, 'pubDate', 'no es una fecha válida');
  return {
    slug: filename.replace(/\.mdx?$/, ''),
    title: data.title,
    description: data.description,
    pubDate,
    tags: data.tags,
    draft: Boolean(data.draft),
    content,
  };
}

// Guard contra path traversal: el slug viene de la URL. Solo kebab-case.
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

function readPost(file: string): Post {
  return parsePost(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'), file);
}

// Publicados, más recientes primero.
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPost)
    .filter((p) => !p.draft)
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export function getPost(slug: string): Post | undefined {
  if (!isValidSlug(slug)) return undefined;
  const file = ['.mdx', '.md'].map((ext) => `${slug}${ext}`).find((f) => fs.existsSync(path.join(POSTS_DIR, f)));
  const post = file ? readPost(file) : undefined;
  return post && !post.draft ? post : undefined;
}
