import { globalIgnores } from 'eslint/config'
import {
  comments,
  css,
  defineConfig,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
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
  typescript(),
  jsdoc({
    typescript: 'flavor'
  }),
  comments(),
  regexp(),
  promise(),
  imports({
    typescript: true,
    rules: {
      'import/extensions': ['error', 'always', { ignorePackages: true }]
    }
  }),
  unicorn({
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off'
    }
  }),
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
  css({
    tolerant: true
  }),
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
  markdown(),
  prettier(),
  globalIgnores([
    'src/types/gens/**',
    'tsconfig.json',
    '**/dist/**',
    '**/.eslint-config-inspector/**'
  ])
)

export default config
