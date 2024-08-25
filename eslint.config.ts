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
  svelte,
  react,
  vitest
} from './src'

const config: ReturnType<typeof defineConfig> = defineConfig(
  javascript(),
  comments(),
  promise(),
  unicorn({
    rules: {
      'unicorn/filename-case': 'off'
    }
  }),
  typescript(),
  jsdoc({
    typescript: 'flavor'
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
  react({
    refresh: true,
    settings: {
      react: {
        version: 'detect'
      }
    }
  }),
  svelte({
    typescript: true
  }),
  vitest({
    // typeTesting: true
  }),
  prettier(),
  {
    ignores: [
      'src/types/gens/*.ts',
      'tsdown.config.ts',
      'eslint.config.js',
      'tsconfig.json',
      '**/dist/**',
      '**/.eslint-config-inspector/**'
    ]
  }
)

export default config
