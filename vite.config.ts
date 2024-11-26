import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/core'],
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@ffmpeg')) return 'ffmpeg';
            if (id.includes('pdf-lib')) return 'pdf';
            if (id.includes('docx') || id.includes('mammoth')) return 'doc';
            if (id.includes('react')) return 'react';
            if (id.includes('lucide-react')) return 'icons';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});