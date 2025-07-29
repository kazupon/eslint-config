/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import globals from 'globals'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { JavascriptRules, OverridesOptions } from '../types/index.ts'

/**
 * JavaScript configuration options
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- NOTE(kazupon): This is a placeholder for future options
export interface JavaScriptOptions {
  // TODO: if we need to add options in the future, we can define them here
}

/**
 * `@eslint/js` and overrides configuration options
 *
 * @param {JavaScriptOptions & OverridesOptions} options eslint configuration options for JavaScript
 * @returns {Promise<Linter.Config[]>} eslint flat configurations with `@eslint/js` and overrides
 */
export async function javascript(
  options: JavaScriptOptions & OverridesOptions<JavascriptRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options

  // @ts-ignore -- NOTE(kazupon): `@eslint/js` is not yet available in the `@types` package
  const js = await loadPlugin<typeof import('@eslint/js')>('@eslint/js')

  return [
    /**
     * {
     *   name: 'eslint/defaults/rules',
     *   ...(js.configs.recommended as Linter.Config)
     * },
     */
    {
      name: '@kazupon/javascript/markdown-block',
      files: ['**/*.md/*.{js,cjs,mjs}'],
      ...(js.configs.recommended as Linter.Config)
    },
    {
      name: '@kazupon/javascript/overrides',
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
