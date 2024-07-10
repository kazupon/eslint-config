import {
  defineConfig,
  javascript,
  typescript,
  jsdoc,
  promise,
  regexp,
  unicorn,
  prettier,
  jsonc,
  vue,
  yml,
  comments
} from './src'

export default defineConfig(
  javascript(),
  comments(),
  promise(),
  unicorn(),
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
  yml({
    prettier: true
  }),
  vue({
    typescript: true
  }),
  prettier()
)
