/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, PromiseRules } from '../types/index.ts'

/**
 * eslint promise configuration options
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- NOTE(kazupon): This is a placeholder for future options
export interface PromiseOptions {
  // TODO: if we need to add options in the future, we can define them here
}

/**
 * `eslint-plugin-promise` and overrides configuration options
 *
 * @param {PromiseOptions & OverridesOptions} options
 *  eslint promise configuration options
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `eslint-plugin-promise` and overrides
 */
export async function promise(
  options: PromiseOptions & OverridesOptions<PromiseRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options

  const promise =
    // @ts-ignore -- NOTE(kazupon): `eslint-plugin-promise` is not yet type definitions exporting
    await loadPlugin<typeof import('eslint-plugin-promise')>('eslint-plugin-promise')

  return [
    {
      name: 'promise/flat/recommended',
      ...(promise.configs['flat/recommended'] as Linter.Config)
    },
    {
      name: '@kazupon/promise',
      rules: {
        ...overrideRules
      }
    }
  ]
}
