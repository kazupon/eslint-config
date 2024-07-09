import { loadPlugin } from '../utils'
import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types'

/**
 * eslint jsonc configuration options
 */
export interface JsoncOptions {
  /**
   * whether to enable config `'flat/recommended-with-json'`of `eslint-plugin-jsonc`.
   * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/#usage
   * @default false
   */
  json?: boolean
  /**
   * whether to enable config `'flat/recommended-with-jsonc'`of `eslint-plugin-jsonc`.
   * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/#usage
   * @default false
   */
  jsonc?: boolean
  /**
   * whether to enable config `'flat/recommended-with-json5'`of `eslint-plugin-jsonc`.
   * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/#usage
   * @default false
   */
  json5?: boolean
  /**
   * whether to enable config `'flat/prettier'`of `eslint-plugin-jsonc`.
   * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/#usage
   * @default false
   */
  prettier?: boolean
}

/**
 * `eslint-plugin-jsonc` and overrides configuration options
 * @param {JsoncOptions & OverridesOptions} options
 *  eslint comments configuration options for eslint comment directives
 * @returns {Promise<Linter.FlatConfig[]>}
 *  eslint flat configurations with `eslint-plugin-jsonc` and overrides
 */
export async function jsonc(
  options: JsoncOptions & OverridesOptions = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {} } = options

  const kinds = [
    options.json ? 'json' : '',
    options.jsonc ? 'jsonc' : '',
    options.json5 ? 'json5' : ''
  ]
  const usePrettier = !!options.prettier
  const jsonc = await loadPlugin<typeof import('eslint-plugin-jsonc')>('eslint-plugin-jsonc')

  const configs: Linter.FlatConfig[] = []
  const defaultRules: Linter.FlatConfig['rules'] = {
    // 'jsonc/sort-array-values': '',
    'jsonc/sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: true,
        natural: false,
        minKeys: 2,
        allowLineSeparatedGroups: false
      }
    ]
  }

  for (const kind of kinds) {
    if (kind) {
      configs.push(
        ...jsonc.configs[
          `flat/recommended-with-${kind}` as `flat/recommended-with-${'json' | 'jsonc' | 'json5'}`
        ].map((config, index) => {
          // @ts-expect-error -- ignore
          if (config.name) {
            return config
          } else {
            return {
              name: `jsonc/flat/recommended-with-${kind}/${index}`,
              ...config
            }
          }
        })
      )
    }
  }

  if (usePrettier) {
    configs.push(
      ...jsonc.configs['flat/prettier'].map((config, index) => {
        // @ts-expect-error -- ignore
        if (config.name) {
          return config
        } else {
          return {
            name: `jsonc/flat/prettier/${index}`,
            ...config
          }
        }
      })
    )
  }

  // overrides
  const overridedConfig: Linter.FlatConfig = {
    name: '@kazupon/jsonc',
    files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
    rules: {
      ...defaultRules,
      ...overrideRules
    }
  }

  configs.push(overridedConfig)
  return configs
}
