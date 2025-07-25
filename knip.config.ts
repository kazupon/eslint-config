import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/index.ts', 'scripts/typegen.ts'],
  ignoreDependencies: [
    'lint-staged',
    '@types/eslint',
    '@eslint/markdown',
    '@eslint/css',
    '@intlify/eslint-plugin-vue-i18n',
    'eslint-config-prettier',
    'eslint-import-resolver-typescript',
    'eslint-plugin-import',
    'eslint-plugin-jsonc',
    'eslint-plugin-jsdoc',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
    'eslint-plugin-regexp',
    'eslint-plugin-svelte',
    'eslint-plugin-promise',
    'eslint-plugin-unused-imports',
    'eslint-plugin-module-interop',
    'eslint-plugin-vue',
    'eslint-plugin-vue-composable',
    'eslint-plugin-vue-scoped-css',
    'eslint-plugin-vuejs-accessibility',
    'typescript-eslint',
    'eslint-plugin-yml',
    'eslint-plugin-toml',
    'eslint-plugin-unicorn',
    'eslint-plugin-toml',
    '@html-eslint/eslint-plugin',
    '@vitest/eslint-plugin'
  ],
  exclude: ['duplicates']
}

export default config
