import { defineConfig } from 'tsdown'

import type { UserConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  entry: 'src/index.ts',
  platform: 'node',
  outDir: 'dist',
  clean: true,
  dts: true
})

export default config
