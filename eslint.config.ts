import { defineConfig, javascript, typescript, prettier, vue, comments } from './src'

export default defineConfig(
  javascript(),
  comments(),
  typescript(),
  vue({
    typescript: true
  }),
  prettier()
)
