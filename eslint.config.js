import { tsImport } from 'tsx/esm/api'

/** @type {typeof import('./src/index.ts')} */
const { defineConfig, javascript, typescript, prettier, vue } = await tsImport(
  './src/index.ts',
  import.meta.url
)

export default defineConfig(
  javascript({
    rules: {}
  }),
  typescript(),
  vue({ typescript: true }),
  {
    ignores: ['**/dist/**', '**/.eslint-config-inspector/**']
  },
  prettier()
)
