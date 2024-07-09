import { loadPlugin } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types'

/**
 * eslint regexp configuration options
 */
export interface RegexpOptions {
  // TODO:
}

/**
 * `eslint-plugin-regexp` and overrides configuration options
 * @param {RegexpOptions & OverridesOptions} options
 *  eslint comments configuration options for eslint comment directives
 * @returns {Promise<Linter.FlatConfig[]>}
 *  eslint flat configurations with `eslint-plugin-regexp` and overrides
 */
export async function regexp(
  options: RegexpOptions & OverridesOptions = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {} } = options

  const regexp = await loadPlugin<typeof import('eslint-plugin-regexp')>('eslint-plugin-regexp')

  return [
    {
      name: 'regexp/flat/recommended',
      ...(regexp.configs['flat/recommended'] as Linter.FlatConfig)
    },
    {
      name: '@kazupon/eslint-regexp',
      rules: {
        ...overrideRules
      }
    }
  ]
}
