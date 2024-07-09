import { defineConfig, javascript, typescript, jsdoc, regexp, prettier, vue, comments } from './src'

export default defineConfig(
  javascript(),
  comments(),
  typescript(),
  jsdoc({
    typescript: 'syntax'
  }),
  regexp(),
  vue({
    typescript: true
  }),
  prettier()
)
