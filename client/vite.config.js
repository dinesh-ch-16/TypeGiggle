import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import generateRobotsTxt from 'vite-plugin-robots-txt'
import fs from 'fs'
import path from 'path'

const getBlogRoutes = () => {
  const blogDir = path.resolve(__dirname, 'src/blog');
  if (!fs.existsSync(blogDir)) return [];

  return fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.md'))
    .map(file => `/blog/${file.replace('.md', '')}`);
};

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://typegiggle.com',
      dynamicRoutes: [
        '/leaderboard',
        '/custom',
        '/about',
        '/blog',
        '/privacy-policy',
        '/1-minute-typing-test',
        '/typing-test-for-beginners',
        '/wpm-calculator',
        ...getBlogRoutes()
      ],
      priority: {
        '/': 1.0,
        '/blog': 0.8,
        '/leaderboard': 0.7,
        '/about': 0.5,
        '/privacy-policy': 0.3
      }
    }),
    generateRobotsTxt({
      sitemaps: ['https://typegiggle.com/sitemap.xml'],
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    }),
  ],
  assetsInclude: ['**/*.md'],
})