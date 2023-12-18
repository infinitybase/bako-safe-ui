import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const mode = process.env.VERCEL_ENV || 'development';

if (mode !== 'development') {
  console.log('[BUILD] Env:', mode);
}

// https://vitejs.dev/config/
export default defineConfig({
  mode,
  plugins: [react(), tsconfigPaths()],
  cacheDir: '.vite',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env': process.env,
  },
});
