import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

// Treat .js files as JSX — needed because this codebase uses JSX in .js files (CRA convention)
function jsxInJs() {
  return {
    name: 'treat-js-as-jsx',
    async transform(code, id) {
      if (!/src\/.*\.js$/.test(id)) return null;
      return transformWithEsbuild(code, id + '.jsx', {
        jsx: 'automatic',
        loader: 'jsx',
      });
    },
  };
}

export default defineConfig({
  plugins: [
    jsxInJs(),
    react(),
  ],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    esbuild: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
