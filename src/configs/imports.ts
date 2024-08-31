import { loadPlugin } from '../utils'
import { GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX } from '../globs'

import type { Linter } from 'eslint'
import type { OverridesOptions, ImportsRules } from '../types'

const IMPORTS_FILES = [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX]

/**
 * imports configuration options
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImportsOptions {
  // TODO:
}

/**
 * `eslint-plugin-unused-imports` and overrides configuration options
 * @description **if you want to use this preset, you need to put after `javascirpt` and `typescript` presets**
 * @param {ImportsOptions & OverridesOptions} options
 *  import configuration options
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `eslint-plugin-unused-imports` and overrides
 */
export async function imports(
  options: ImportsRules & OverridesOptions<ImportsRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options

  // TODO: cannot correctly resolve type...
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const unused = (await loadPlugin<typeof import('eslint-plugin-unused-imports')>(
    'eslint-plugin-unused-imports'
  )) as any // eslint-disable-line @typescript-eslint/no-explicit-any

  const configs: Linter.Config[] = [
    {
      name: 'unused-imports',
      plugins: {
        'unused-imports': unused // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      },
      files: IMPORTS_FILES,
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            vars: 'all',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true
          }
        ]
      }
    }
  ]

  // overrides
  const overriddenConfig: Linter.Config = {
    name: '@kazupon/imports',
    files: IMPORTS_FILES,
    rules: {
      ...overrideRules
    }
  }

  configs.push(overriddenConfig)
  return configs
}
