import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog/foro de Samuel (§7.4). Publicar = crear un .mdx en src/content/posts/ + commit.
// El schema Zod falla el build si un post está mal formado → protege la calidad.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
