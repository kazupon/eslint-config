import {
  comments,
  defineConfig,
  imports,
  javascript,
  jsdoc,
  jsonc,
  prettier,
  promise,
  react,
  regexp,
  svelte,
  toml,
  typescript,
  unicorn,
  vitest,
  vue,
  yml
} from './src' // eslint-disable-line import/extensions

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
  imports({
    typescript: true,
    rules: {
      'import/extensions': ['error', 'always', { ignorePackages: true }]
    }
  }),
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
    typescript: true,
    composable: true,
    scopedCss: true,
    a11y: true
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
    typeTesting: true
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
