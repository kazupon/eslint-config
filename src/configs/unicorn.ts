import { loadPlugin, getGlobSourceFiles } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions, UnicornRules } from '../types'

/**
 * eslint unicorn configuration options
 */

export interface UnicornOptions {
  /**
   * use TypeScript
   * @default true
   */
  typescript?: boolean
}

/**
 * `eslint-plugin-unicorn` and overrides configuration options
 * @param {UnicornOptions & OverridesOptions} options
 *  eslint unicorn configuration options
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `eslint-plugin-unicorn` and overrides
 */
export async function unicorn(
  options: UnicornOptions & OverridesOptions<UnicornRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options
  const useTypeScript = !options.typescript

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const unicorn =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-unicorn` is not yet type definitions exporting
    await loadPlugin<typeof import('eslint-plugin-unicorn')>('eslint-plugin-unicorn')

  return [
    {
      files: getGlobSourceFiles(useTypeScript),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...(unicorn.configs['flat/recommended'] as Linter.Config)
    },
    {
      name: '@kazupon/unicorn',
      files: getGlobSourceFiles(useTypeScript),
      rules: {
        ...overrideRules
      }
    }
  ]
}
