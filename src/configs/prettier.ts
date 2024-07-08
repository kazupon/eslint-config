import { loadPlugin } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types'

/**
 * Prettier configuration options
 */
export interface PrettierOptions {
  // TODO:
}

/**
 * `eslint-config-prettier` and overrides configuration options
 * @param {PrettierOptions & OverridesOptions} options
 * eslint configuration options for Prettier
 * @returns {Promise<Linter.FlatConfig[]>}
 * eslint flat configurations with `eslint-config-prettier` and overrides
 */
export async function prettier(
  options: PrettierOptions & OverridesOptions = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {} } = options

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const prettier =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-config-prettier` is not yet available in the `@types` package
    await loadPlugin<typeof import('eslint-config-prettier')>('eslint-config-prettier')

  return [
    prettier as Linter.FlatConfig,
    {
      name: '@kazupon/prettier',
      rules: {
        ...overrideRules
      }
    }
  ]
}
