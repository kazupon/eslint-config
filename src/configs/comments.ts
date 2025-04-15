import { GLOB_MARKDOWN } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { CommentsRules, OverridesOptions } from '../types/index.ts'

/**
 * comments preset options
 */
export interface CommentsOptions {
  /**
   * An options for `@eslint-community/eslint-plugin-eslint-comments`
   */
  directives?: OverridesOptions<CommentsRules>
}

/**
 * configure comments preset for the below plugins
 * - `@eslint-community/eslint-plugin-eslint-comments`
 * @param {CommentsOptions} options {@link CommentsOptions | comments preset options}
 * @returns {Promise<Linter.Config[]>} resolved eslint flat configurations
 */
export async function comments(options: CommentsOptions = {}): Promise<Linter.Config[]> {
  const comments =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-eslint-comments` is not yet available in the `@types` package
    await loadPlugin<typeof import('@eslint-community/eslint-plugin-eslint-comments')>(
      '@eslint-community/eslint-plugin-eslint-comments'
    )

  const directives = options.directives ?? {}

  return [
    {
      name: '@eslint-community/eslint-comments',
      ignores: directives.ignores ? [GLOB_MARKDOWN, ...directives.ignores] : [GLOB_MARKDOWN],
      plugins: {
        '@eslint-community/eslint-comments': comments as NonNullable<Linter.Config['plugins']>
      },
      rules: {
        ...(comments.configs.recommended.rules as NonNullable<Linter.Config['rules']>),
        // overrides rules
        ...directives.rules
      }
    }
  ]
}
