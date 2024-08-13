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
  comments,
  toml,
  svelte
} from './src'

const config: ReturnType<typeof defineConfig> = defineConfig(
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
  toml(),
  vue({
    typescript: true
  }),
  svelte({
    typescript: true
  }),
  prettier()
)

export default config
