import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  fmt: {
    ignorePatterns: [
      'public/mockServiceWorker.js',
      'playwright-report/**/*',
      'test-results/**/*',
    ],

    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
  },
  lint: {
    ignorePatterns: [
      'node_modules/*',
      'public/mockServiceWorker.js',
      'generators/*',
      'playwright-report/**/*',
      'test-results/**/*',
    ],

    env: {
      browser: true,
      node: true,
      es6: true,
    },

    plugins: [
      'typescript',
      'react',
      'jsx-a11y',
      'import',
      'vitest',
      'unicorn',
      'oxc',
    ],

    options: {
      typeAware: true,
      typeCheck: true,
    },

    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],

    rules: {
      'typescript/no-unused-vars': 'error',

      'react/rules-of-hooks': 'error',
      'react/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'react/react-in-jsx-scope': 'off',

      'import/no-cycle': 'error',

      'jsx-a11y/anchor-is-valid': 'off',

      'vitest/expect-expect': 'off',

      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],

      'vite-plus/prefer-vite-plus-imports': 'error',
    },

    overrides: [
      {
        files: ['src/components/ui/**/*'],
        rules: {
          'react/only-export-components': 'off',
        },
      },
    ],
  },
  plugins: lazyPlugins(() => [react(), tailwindcss()]),
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    setupFiles: ['./src/testing/setup.ts'],
    exclude: ['e2e/**/*', 'node_modules/**/*'],
  },
});
