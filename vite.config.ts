import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // WCAG & Production Optimization
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
          firebase: ['firebase/app', 'firebase/database', 'firebase/auth'],
        },
      },
    },
    sourcemap: false,
    minify: 'esbuild',
  },
  esbuild: {
    // Remove console and debugger in production for security and performance
    drop: ['console', 'debugger'],
  },
  // Ensure base path is set for flexible deployment (e.g., GitHub Pages or custom domains)
  base: '/',
})
