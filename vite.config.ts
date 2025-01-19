import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/vidsrc': {
        target: 'https://vidsrc.cc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vidsrc/, ''),  // This rewrites the path to match the endpoint
      },
    },
  },
});


