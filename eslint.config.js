import { tsImport } from 'tsx/esm/api'

/** @type {typeof import('./src/index.ts')} */
const {
  defineConfig,
  javascript,
  comments,
  typescript,
  jsdoc,
  unicorn,
  promise,
  regexp,
  jsonc,
  prettier,
  vue,
  react,
  svelte,
  yml,
  toml
} = await tsImport('./src/index.ts', import.meta.url)

export default defineConfig(
  javascript(),
  comments(),
  promise(),
  unicorn({
    rules: {
      'unicorn/filename-case': 'off'
    }
  }),
  typescript(),
  jsdoc({
    typescript: 'flavor'
  }),
  regexp(),
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
  vue({ typescript: true }),
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
  prettier(),
  {
    ignores: [
      'src/types/gens/*.ts',
      'tsdown.config.ts',
      'eslint.config.js',
      'tsconfig.json',
      '**/dist/**',
      '**/.eslint-config-inspector/**'
    ]
  }
)
