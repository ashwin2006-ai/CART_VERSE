import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_PROXY_TARGET': JSON.stringify(
      process.env.VITE_API_PROXY_TARGET || 'http://localhost:5000'
    )
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true, // Guarantees Vite will always run strictly on port 3000
    open: false,
    allowedHosts: true, // allow the preview's external hostname
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
