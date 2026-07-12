import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // El contenido MDX se procesa con next-mdx-remote en runtime de build (lib/posts.ts),
  // no via @next/mdx: los posts viven en src/content/posts como archivos, no como rutas.
};

export default nextConfig;
