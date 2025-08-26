import { includeIgnoreFile } from '@eslint/compat'
import { globalIgnores } from 'eslint/config'
import { fileURLToPath } from 'node:url'
import {
  comments,
  css,
  defineConfig,
  deps,
  html,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  prettier,
  promise,
  react,
  regexp,
  stylistic,
  svelte,
  toml,
  typescript,
  unicorn,
  vitest,
  vue,
  yml
} from './src' // eslint-disable-line import/extensions -- NOTE(kazupon): import from local code

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

const config: ReturnType<typeof defineConfig> = defineConfig(
  javascript(),
  typescript(),
  jsdoc({
    typescript: 'flavor'
  }),
  comments({
    kazupon: {
      ignores: [
        'scripts/**/*.ts',
        '**/*.test.{js,cjs,mjs,ts,cts,mts,jsx,tsx}',
        '**/*.spec.{js,cjs,mjs,ts,cts,mts,jsx,tsx}',
        '**/*.test-d.ts'
      ]
    }
  }),
  regexp(),
  promise(),
  imports({
    typescript: true,
    rules: {
      'import/extensions': ['error', 'always', { ignorePackages: true }]
    }
  }),
  unicorn({
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off'
    }
  }),
  jsonc({
    json: true,
    json5: true,
    jsonc: true,
    prettier: true
  }),
  yml({
    prettier: true
  }),
  toml(),
  deps({
    // barrel: true
  }),
  css({
    tolerant: true
  }),
  vue({
    typescript: true,
    composable: true,
    scopedCss: true,
    a11y: true,
    i18n: {
      localeDir: './locales/**/*.json'
    }
  }),
  react({
    refresh: true,
    settings: {
      react: {
        version: 'detect'
      }
    }
  }),
  svelte({
    typescript: true
  }),
  vitest({
    typeTesting: true
  }),
  markdown({
    preferences: true
  }),
  html({
    prettier: true
  }),
  stylistic(),
  prettier(),
  includeIgnoreFile(gitignorePath),
  globalIgnores([
    'src/types/gens/**',
    'tsconfig.json',
    '**/dist/**',
    '**/.eslint-config-inspector/**',
    'CHANGELOG.md'
  ])
)

export default config
