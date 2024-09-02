import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, PromiseRules } from '../types/index.ts'

/**
 * eslint promise configuration options
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PromiseOptions {
  // TODO:
}

/**
 * `eslint-plugin-promise` and overrides configuration options
 * @param {PromiseOptions & OverridesOptions} options
 *  eslint promise configuration options
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `eslint-plugin-promise` and overrides
 */
export async function promise(
  options: PromiseOptions & OverridesOptions<PromiseRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const promise =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-promise` is not yet type definitions exporting
    await loadPlugin<typeof import('eslint-plugin-promise')>('eslint-plugin-promise')

  return [
    {
      name: 'promise/flat/recommended',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
