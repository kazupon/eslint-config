import { tsImport } from 'tsx/esm/api'

/** @type {typeof import('./src/index.ts')} */
const { defineConfig, javascript, typescript } = await tsImport('./src/index.ts', import.meta.url)

export default defineConfig(javascript(), typescript(), {
  ignores: ['**/dist/**', '**/.eslint-config-inspector/**']
})
