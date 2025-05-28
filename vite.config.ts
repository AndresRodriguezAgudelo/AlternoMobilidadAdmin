import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api/sign/v1/files/file': {
        target: 'https://back-app-equisoft-production.up.railway.app',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/sign\/v1\/files\/file/, '/api/sign/v1/files/file')
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['equirent-admin-production.up.railway.app']
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          if (/\.(woff|woff2)$/.test(assetInfo.name)) {
            return `assets/fonts/[name][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    }
  }
})
