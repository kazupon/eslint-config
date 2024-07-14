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
  yml
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
  vue({ typescript: true }),
  prettier(),
  {
    ignores: [
      'src/types/gens/*.ts',
      'tsdown.config.ts',
      'tsconfig.json',
      '**/dist/**',
      '**/.eslint-config-inspector/**'
    ]
  }
)
