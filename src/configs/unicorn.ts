import { loadPlugin } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions, UnicornRules } from '../types'

/**
 * eslint unicorn configuration options
 */
export interface UnicornOptions {
  // TODO:
}

/**
 * `eslint-plugin-unicorn` and overrides configuration options
 * @param {UnicornOptions & OverridesOptions} options
 *  eslint unicorn configuration options
 * @returns {Promise<Linter.FlatConfig[]>}
 *  eslint flat configurations with `eslint-plugin-unicorn` and overrides
 */
export async function unicorn(
  options: UnicornOptions & OverridesOptions<UnicornRules> = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {} } = options

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const unicorn =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-unicorn` is not yet type definitions exporting
    await loadPlugin<typeof import('eslint-plugin-unicorn')>('eslint-plugin-unicorn')

  return [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    unicorn.configs['flat/recommended'] as Linter.FlatConfig,
    {
      name: '@kazupon/unicorn',
      rules: {
        ...overrideRules
      }
    }
  ]
}
