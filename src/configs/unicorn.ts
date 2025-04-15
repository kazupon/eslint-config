import { getGlobSourceFiles, loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, UnicornRules } from '../types/index.ts'

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

  const unicorn =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-unicorn` is not yet type definitions exporting
    await loadPlugin<(typeof import('eslint-plugin-unicorn'))['default']>('eslint-plugin-unicorn')

  return [
    {
      files: getGlobSourceFiles(useTypeScript),
      /**
       * ...(unicorn.configs['recommended'] as Linter.Config)
       * NOTE: workaround for the issue
       * https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2546
       */
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
