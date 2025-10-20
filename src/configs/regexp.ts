/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

import { GLOB_MARKDOWN } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, RegexpRules } from '../types/index.ts'

/**
 * eslint regexp configuration options
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- NOTE(kazupon): This is a placeholder for future options
export interface RegexpOptions {
  // TODO: if we need to add options in the future, we can define them here
}

/**
 * `eslint-plugin-regexp` and overrides configuration options
 *
 * @param {RegexpOptions & OverridesOptions} options - eslint regexp configuration options for regular expressions
 * @returns {Promise<Linter.Config[]>} eslint flat configurations with `eslint-plugin-regexp` and overrides
 */
export async function regexp(
  options: RegexpOptions & OverridesOptions<RegexpRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options

  const regexp = await loadPlugin<typeof import('eslint-plugin-regexp')>('eslint-plugin-regexp')

  return [
    {
      name: 'regexp/flat/recommended',
      ignores: [GLOB_MARKDOWN],
      ...(regexp.configs['flat/recommended'] as Linter.Config)
    },
    {
      name: '@kazupon/eslint-regexp',
      rules: {
        ...overrideRules
      }
    }
  ]
}
