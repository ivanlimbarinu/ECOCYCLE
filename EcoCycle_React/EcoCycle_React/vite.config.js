import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/external-api': { 
        target: 'https://mock-api-server-production-7f5d.up.railway.app/ecocycle/api', 
        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/external-api/, '') 
      },
      '/api/auth/login': { target: 'http://localhost', changeOrigin: true, rewrite: () => '/ecocycle-api/api/auth/login.php' },
      '/api/auth/register': { target: 'http://localhost', changeOrigin: true, rewrite: () => '/ecocycle-api/api/auth/register.php' },
      '/api/users/list': { target: 'http://localhost', changeOrigin: true, rewrite: () => '/ecocycle-api/api/users/list.php' },
      '/api/dashboard/kpi': { target: 'http://localhost', changeOrigin: true, rewrite: () => '/ecocycle-api/api/dashboard/kpi.php' },
      '/api/dashboard/alerts': { target: 'http://localhost', changeOrigin: true, rewrite: () => '/ecocycle-api/api/dashboard/alerts.php' },
    }
  }
})