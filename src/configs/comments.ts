import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { CommentsRules, OverridesOptions } from '../types/index.ts'

/**
 * eslint comments configuration options
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CommentsOptions {
  // TODO:
}

/**
 * `@eslint-community/eslint-plugin-eslint-comments` and overrides configuration options
 * @param {CommentsOptions & OverridesOptions} options
 *  eslint comments configuration options for eslint comment directives
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `@eslint-community/eslint-plugin-eslint-comments` and overrides
 */
export async function comments(
  options: CommentsOptions & OverridesOptions<CommentsRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const comments =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-eslint-comments` is not yet available in the `@types` package
    await loadPlugin<typeof import('@eslint-community/eslint-plugin-eslint-comments')>(
      '@eslint-community/eslint-plugin-eslint-comments'
    )

  return [
    {
      name: '@eslint-community/eslint-comments/recommended',
      plugins: {
        '@eslint-community/eslint-comments': comments as NonNullable<Linter.Config['plugins']>
      },
      rules: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...(comments.configs.recommended.rules as NonNullable<Linter.Config['rules']>)
      }
    },
    {
      name: '@kazupon/eslint-comments',
      rules: {
        ...overrideRules
      }
    }
  ]
}
