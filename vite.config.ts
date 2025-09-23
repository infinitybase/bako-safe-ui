import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); //load environments
  let resolvedMode = process.env.VERCEL_ENV || 'development';

  if (process.env.AWS_BRANCH) {
    const branchMap: Record<string, string> = {
      main: 'production',
      '*': 'preview',
    };
    resolvedMode = branchMap[process.env.AWS_BRANCH] || branchMap['*'];
  }

  console.log('[MODE]:', resolvedMode);

  return {
    mode: resolvedMode,
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
