import {
  defineConfig,
  javascript,
  typescript,
  jsdoc,
  regexp,
  prettier,
  jsonc,
  vue,
  comments
} from './src'

export default defineConfig(
  javascript(),
  comments(),
  typescript(),
  jsdoc({
    typescript: 'syntax'
  }),
  regexp(),
  jsonc({
    json: true,
    json5: true,
    jsonc: true,
    prettier: true
  }),
  vue({
    typescript: true
  }),
  prettier()
)
