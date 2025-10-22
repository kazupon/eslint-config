/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

const EXT_JS = '?([cm])js'
const EXT_JSX = '?([cm])jsx'
export const EXT_TS = '?([cm])ts'
export const EXT_TSX = '?([cm])tsx'
const EXT_JSON = 'json'
const EXT_JSON5 = 'json5'
const EXT_JSONC = 'jsonc'
const EXT_YAML = 'y?(a)ml'
const EXT_TOML = 'toml'
const EXT_VUE = 'vue'
const EXT_SVELTE = 'svelte'
const EXT_MD = 'md'
const EXT_HTML = 'html'
const EXT_CSS = 'css'

export const GLOB_JS: string = `**/*.${EXT_JS}`
export const GLOB_JSX: string = `**/*.${EXT_JSX}`
export const GLOB_TS: string = `**/*.${EXT_TS}`
export const GLOB_TSX: string = `**/*.${EXT_TSX}`
export const GLOB_JSON: string = `**/*.${EXT_JSON}`
export const GLOB_JSON5: string = `**/*.${EXT_JSON5}`
export const GLOB_JSONC: string = `**/*.${EXT_JSONC}`
export const GLOB_YAML: string = `**/*.${EXT_YAML}`
export const GLOB_TOML: string = `**/*.${EXT_TOML}`
export const GLOB_VUE: string = `**/*.${EXT_VUE}`
export const GLOB_SVELTE: string = `**/*.${EXT_SVELTE}`
export const GLOB_MARKDOWN: string = `**/*.${EXT_MD}`
export const GLOB_HTML: string = `**/*.${EXT_HTML}`
export const GLOB_CSS: string = `**/*.${EXT_CSS}`

const SRC_EXT = '?([cm])[jt]s?(x)'
export const GLOB_SRC: string = `**/*.${SRC_EXT}`

export const GLOB_TESTS: string[] = [
  `**/test/**/*.${SRC_EXT}`,
  `**/tests/**/*.${SRC_EXT}`,
  `**/spec/**/*.${SRC_EXT}`,
  `**/specs/**/*.${SRC_EXT}`,
  `**/e2e/**/*.${SRC_EXT}`,
  `**/__tests__/**/*.${SRC_EXT}`,
  `**/__test__/**/*.${SRC_EXT}`,
  `**/*.spec.${SRC_EXT}`,
  `**/*.test.${SRC_EXT}`
]

export const GLOB_TESTS_TYPE: string[] = [`**/*.test-d.${SRC_EXT}`, `**/*.spec-d.${SRC_EXT}`]
