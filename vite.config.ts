import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/core', '@ffmpeg/util'],
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
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ffmpeg: ['@ffmpeg/ffmpeg', '@ffmpeg/core', '@ffmpeg/util'],
          pdf: ['pdf-lib', '@pdf-lib/fontkit'],
          doc: ['docx', 'mammoth', 'marked'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast'],
        }
      }
    },
    chunkSizeWarningLimit: 2000,
    sourcemap: true,
    minify: 'esbuild',
  }
});
