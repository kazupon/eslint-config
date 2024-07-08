import { defineConfig, javascript, typescript, jsdoc, prettier, vue, comments } from './src'

export default defineConfig(
  javascript(),
  comments(),
  typescript(),
  jsdoc({
    typescript: 'syntax'
  }),
  vue({
    typescript: true
  }),
  prettier()
)
