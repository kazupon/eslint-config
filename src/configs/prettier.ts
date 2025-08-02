/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, PrettierRules } from '../types/index.ts'

/**
 * Prettier configuration options
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- NOTE(kazupon): This is a placeholder for future options
export interface PrettierOptions {
  // TODO: if we need to add options in the future, we can define them here
}

/**
 * `eslint-config-prettier` and overrides configuration options
 *
 * @param {PrettierOptions & OverridesOptions} options - eslint configuration options for Prettier
 * @returns {Promise<Linter.Config[]>} eslint flat configurations with `eslint-config-prettier` and overrides
 */
export async function prettier(
  options: PrettierOptions & OverridesOptions<PrettierRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options

  const prettier =
    // @ts-ignore -- NOTE: `eslint-config-prettier` is not yet available in the `@types` package
    await loadPlugin<typeof import('eslint-config-prettier')>('eslint-config-prettier')

  return [
    {
      name: 'config-prettier',
      ...(prettier as Linter.Config)
    },
    {
      name: '@kazupon/prettier',
      rules: {
        ...overrideRules
      }
    }
  ]
}
