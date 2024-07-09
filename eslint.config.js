import { tsImport } from 'tsx/esm/api'

/** @type {typeof import('./src/index.ts')} */
const {
  defineConfig,
  javascript,
  comments,
  typescript,
  jsdoc,
  unicorn,
  regexp,
  jsonc,
  prettier,
  vue,
  yml
} = await tsImport('./src/index.ts', import.meta.url)

export default defineConfig(
  javascript({
    rules: {}
  }),
  comments(),
  unicorn(),
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
      'tsdown.config.ts',
      'tsconfig.json',
      'package.json',
      '**/dist/**',
      '**/.eslint-config-inspector/**'
    ]
  }
)
