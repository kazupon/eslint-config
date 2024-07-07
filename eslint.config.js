import { tsImport } from 'tsx/esm/api'

/** @type {typeof import('./src/index.ts')} */
const { defineConfig, javascript, comments, typescript, prettier, vue } = await tsImport(
  './src/index.ts',
  import.meta.url
)

export default defineConfig(
  javascript({
    rules: {}
  }),
  comments(),
  typescript(),
  vue({ typescript: true }),
  {
    ignores: ['**/dist/**', '**/.eslint-config-inspector/**']
  },
  prettier()
)
