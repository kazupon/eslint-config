/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

import { isObject } from '@kazupon/jts-utils/object'
import { GLOB_CSS } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { CssRules, OverridesOptions } from '../types/index.ts'

/**
 * eslint css configuration options
 */
export interface CssOptions {
  /**
   * whether to enable strict mode
   *
   * @see https://github.com/eslint/css?tab=readme-ov-file#tolerant-mode
   * @default false
   */
  tolerant?: boolean
  /**
   * whether to enable custom syntax
   *
   * @description if 'tailwind', it will enable [Tailwind Syntax](https://github.com/eslint/css?tab=readme-ov-file#configuring-tailwind-syntax), otherwise it will enable [custom syntax](https://github.com/eslint/css?tab=readme-ov-file#configuring-custom-syntax)
   * @default false
   */
  /**
   * TODO: If this issue is resolved, we should define more strict types for customSyntax
   * https://github.com/eslint/css/issues/56
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- NOTE(kazupon): `customSyntax` can be any object
  customSyntax?: false | 'tailwind' | Record<string, any>
}

/**
 * `@eslint/css` and overrides configuration options
 *
 * @param {CssOptions & OverridesOptions} options
 *  - eslint css configuration options
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `@eslint/css` and overrides
 */
export async function css(
  options: CssOptions & OverridesOptions<CssRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options
  const tolerant = !!options.tolerant
  const customSyntax = !!options.customSyntax

  const css =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- NOTE(kazupon): `@eslint/css` is not yet available in the `@types` package
    (await loadPlugin<typeof import('@eslint/css')>('@eslint/css')) as any

  const core: Linter.Config = {
    name: '@eslint/css/recommended',
    files: [GLOB_CSS],
    language: 'css/css',
    ...css.configs['recommended']
  }

  if (tolerant) {
    core.languageOptions = {
      tolerant
    }
  }

  if (customSyntax) {
    core.languageOptions = core.languageOptions || {}
    if (typeof customSyntax === 'string' && customSyntax === 'tailwind') {
      const { tailwindSyntax } =
        await loadPlugin<typeof import('@eslint/css/syntax')>('@eslint/css/syntax')
      core.languageOptions.customSyntax = tailwindSyntax
    } else if (isObject(customSyntax)) {
      core.languageOptions.customSyntax = customSyntax
    }
  }

  return [
    core,
    {
      name: '@kazupon/css',
      files: [GLOB_CSS],
      rules: {
        ...overrideRules
      }
    }
  ]
}
