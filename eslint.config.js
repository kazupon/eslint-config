import { tsImport } from 'tsx/esm/api'

/** @type {typeof import('./src/index.ts')} */
const { defineConfig, javascript, comments, typescript, jsdoc, regexp, prettier, vue } =
  await tsImport('./src/index.ts', import.meta.url)

export default defineConfig(
  javascript({
    rules: {}
  }),
  comments(),
  typescript(),
  jsdoc({
    typescript: 'flavor'
  }),
  regexp(),
  vue({ typescript: true }),
  prettier(),
  {
    ignores: ['**/dist/**', '**/.eslint-config-inspector/**']
  }
)
