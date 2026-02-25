import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log('[BUILD] Using mode:', mode);

  return {
    mode,
    plugins: [
      react(),
      tsconfigPaths(),
      createHtmlPlugin({
        inject: {
          data: {
            GTM_ID: env.VITE_GTM_ID,
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
    server: {
      headers: {
        'Document-Policy': 'js-profiling',
      },
    },
  };
});
