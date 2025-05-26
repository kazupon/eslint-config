import { defineConfig } from 'tsdown'

const config: ReturnType<typeof defineConfig> = defineConfig({
  entry: 'src/index.ts',
  platform: 'node',
  outDir: 'dist',
  clean: true,
  dts: true
})

export default config
