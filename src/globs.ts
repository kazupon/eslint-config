export const GLOB_JS = '**/*.?([cm])js'
export const GLOB_JSX = '**/*.?([cm])jsx'

export const GLOB_TS = '**/*.?([cm])ts'
export const GLOB_TSX = '**/*.?([cm])tsx'

export const GLOB_JSON = '**/*.json'
export const GLOB_JSON5 = '**/*.json5'
export const GLOB_JSONC = '**/*.jsonc'

export const GLOB_YAML = '**/*.y?(a)ml'
export const GLOB_TOML = '**/*.toml'
export const GLOB_VUE = '**/*.vue'

export const GLOB_SVELTE = '**/*.svelte'

export const GLOB_MARKDOWN = '**/*.md'

const GLOB_SRC_EXT = '?([cm])[jt]s?(x)'

export const GLOB_TESTS: string[] = [
  `**/test/**/*.${GLOB_SRC_EXT}`,
  `**/tests/**/*.${GLOB_SRC_EXT}`,
  `**/spec/**/*.${GLOB_SRC_EXT}`,
  `**/specs/**/*.${GLOB_SRC_EXT}`,
  `**/e2e/**/*.${GLOB_SRC_EXT}`,
  `**/__tests__/**/*.${GLOB_SRC_EXT}`,
  `**/__test__/**/*.${GLOB_SRC_EXT}`,
  `**/*.spec.${GLOB_SRC_EXT}`,
  `**/*.test.${GLOB_SRC_EXT}`
]

export const GLOB_TESTS_TYPE: string[] = [
  `**/*.test-d.${GLOB_SRC_EXT}`,
  `**/*.spec-d.${GLOB_SRC_EXT}`
]
