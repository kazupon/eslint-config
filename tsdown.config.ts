import { defineConfig } from 'tsdown'

const config: ReturnType<typeof defineConfig> = defineConfig({
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

export default config
