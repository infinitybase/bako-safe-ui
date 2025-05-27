import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

let mode = process.env.VERCEL_ENV || 'development';

if (process.env.AWS_BRANCH) {
  console.log('[BUILD] with AWS_BRANCH', process.env.AWS_BRANCH);
  const branchMap = {
    main: 'production',
    '*': 'staging',
  };

  mode = branchMap[process.env.AWS_BRANCH] || branchMap['*'];
}

console.log('[BUILD] Using mode:', mode);

// https://vitejs.dev/config/
export default defineConfig({
  mode,
  plugins: [
    react(),
    tsconfigPaths(),
    createHtmlPlugin({
      inject: {
        data: {
          GTM_ID: process.env.VITE_GTM_ID,
        },
      },
    }),
  ],
  cacheDir: '.vite',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env': process.env,
  },
  server: {
    headers: {
      'Document-Policy': 'js-profiling',
    },
  },
});
