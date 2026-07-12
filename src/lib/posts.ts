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

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.mdx?$/, ''),
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    pubDate: new Date(data.pubDate),
    tags: data.tags,
    draft: Boolean(data.draft),
    content,
  };
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
  const file = ['.mdx', '.md'].map((ext) => `${slug}${ext}`).find((f) => fs.existsSync(path.join(POSTS_DIR, f)));
  const post = file ? readPost(file) : undefined;
  return post && !post.draft ? post : undefined;
}
