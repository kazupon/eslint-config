import { defineConfig, javascript, typescript, prettier, vue } from './src'

export default defineConfig(
  javascript(),
  typescript(),
  vue({
    typescript: true
  }),
  prettier()
)
