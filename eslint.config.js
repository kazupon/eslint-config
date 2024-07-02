import { tsImport } from 'tsx/esm/api'
import tseslint from 'typescript-eslint'

/**@type {typeof import('./src/index.ts')} */
const { defineConfig } = await tsImport('./src/index.ts', import.meta.url)

export default defineConfig([
  // for typescript
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['*.{ts,tsx}', '**/*.{ts,tsx}'],
    languageOptions: {
      // parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ]
    }
  },
  {
    files: ['*.{js,cjs,mjs}', '**/*.{js,cjs,mjs}'],
    ...tseslint.configs.disableTypeChecked
  },

  {
    ignores: ['**/dist/**', '**/.eslint-config-inspector/**']
  }
])
