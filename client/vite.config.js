import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import generateRobotsTxt from 'vite-plugin-robots-txt'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://typegiggle.com',
      dynamicRoutes: [
        '/',
        '/leaderboard',
        '/custom',
        '/about',
        '/blog',
        '/privacy-policy',
      ],
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
  // Tell Vite to treat .md files as assets
  assetsInclude: ['**/*.md'],
})