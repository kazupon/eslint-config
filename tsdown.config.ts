import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: 'esm',
  platform: 'node',
  outDir: 'dist',
  clean: true,
  dts: {
    // NOTE: currently, `oxc` does not support jsdoc comments outputting
    transformer: 'typescript'
  }
})
