import globals from 'globals'
import { loadPlugin } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions, JavascriptRules } from '../types'

/**
 * JavaScript configuration options
 */
export interface JavaScriptOptions {
  // TODO:
}

/**
 * `@eslint/js` and overrides configuration options
 * @param {JavaScriptOptions & OverridesOptions} options
 * eslint configuration options for JavaScript
 * @returns {Promise<Linter.FlatConfig[]>}
 * eslint flat configurations with `@eslint/js` and overrides
 */
export async function javascript(
  options: JavaScriptOptions & OverridesOptions<JavascriptRules> = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {} } = options

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore -- NOTE: `@eslint/js` is not yet available in the `@types` package
  const js = await loadPlugin<typeof import('@eslint/js')>('@eslint/js') // eslint-disable-line @typescript-eslint/no-unsafe-assignment

  return [
    {
      name: 'eslint/defaults/rules',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...(js.configs.recommended as Linter.FlatConfig)
    },
    {
      name: '@kazupon/javascript/@eslint/js',
      languageOptions: {
        ecmaVersion: 2022,
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.es2022,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly'
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          ecmaVersion: 2022,
          sourceType: 'module'
        },
        sourceType: 'module'
      },
      linterOptions: {
        reportUnusedDisableDirectives: true
      },
      rules: {
        ...overrideRules
      }
    }
  ]
}
