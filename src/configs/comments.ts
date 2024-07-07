import { loadPlugin } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types'

/**
 * eslint comments configuration options
 */
export interface CommentsOptions {
  // TODO:
}

export async function comments(
  options: CommentsOptions & OverridesOptions = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {} } = options

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const comments =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-eslint-comments` is not yet available in the `@types` package
    await loadPlugin<typeof import('eslint-plugin-eslint-comments')>(
      'eslint-plugin-eslint-comments'
    )

  return [
    {
      name: 'eslint-comments/recommended',
      plugins: {
        'eslint-comments': comments as NonNullable<Linter.FlatConfig['plugins']>
      },
      rules: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...(comments.configs.recommended.rules as NonNullable<Linter.FlatConfig['rules']>)
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
