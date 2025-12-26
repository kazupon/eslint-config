/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

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
  /**
   * An options for `@kazupon/eslint-plugin` comment config
   */
  kazupon?: OverridesOptions<CommentsRules> | false
  /**
   * enforce inline code for specific words on comments
   *
   * @see https://eslint-plugin.kazupon.dev/rules/prefer-inline-code-words-comments#options
   * @default []
   */
  inlineCodeWords?: string[]
}

/**
 * configure comments preset for the below plugins
 *
 * - `@eslint-community/eslint-plugin-eslint-comments`
 *
 * @param {CommentsOptions} options - {@link CommentsOptions | comments preset options}
 * @returns {Promise<Linter.Config[]>} resolved eslint flat configurations
 */
export async function comments(options: CommentsOptions = {}): Promise<Linter.Config[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- NOTE(kazupon): `@eslint-community/eslint-plugin-eslint-comments` is not yet available
  const comments =
    // @ts-ignore -- NOTE(kazupon): `eslint-plugin-eslint-comments` is not yet available in the `@types` package
    await loadPlugin<typeof import('@eslint-community/eslint-plugin-eslint-comments')>(
      '@eslint-community/eslint-plugin-eslint-comments'
    )

  const kazupon =
    await loadPlugin<(typeof import('@kazupon/eslint-plugin'))['default']>('@kazupon/eslint-plugin')

  const directives = options.directives ?? {}
  const kazuponOptions = options.kazupon ?? {}
  const inlineCodeWords = options.inlineCodeWords ?? []

  const configs: Linter.Config[] = [
    {
      name: '@eslint-community/eslint-comments',
      ignores: directives.ignores ? [GLOB_MARKDOWN, ...directives.ignores] : [GLOB_MARKDOWN],
      plugins: {
        '@eslint-community/eslint-comments': comments as NonNullable<Linter.Config['plugins']>
      },
      rules: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- NOTE(kazupon): `@eslint-community/eslint-plugin-eslint-comments` is not yet available in the `@types` package
        ...(comments.configs.recommended.rules as NonNullable<Linter.Config['rules']>),
        // overrides rules
        ...directives.rules,
        '@eslint-community/eslint-comments/require-description': [
          'error',
          {
            ignore: ['eslint-enable']
          }
        ]
      }
    }
  ]

  if (typeof kazuponOptions === 'object') {
    configs.push(
      ...kazupon.configs.comment.map(config => ({
        ...config,
        ignores: [...config.ignores!, ...(kazuponOptions.ignores || [])],
        rules: {
          ...config.rules,
          ...({
            '@kazupon/prefer-inline-code-words-comments': [
              'error',
              {
                words: inlineCodeWords
              }
            ]
          } as unknown as NonNullable<Linter.Config['rules']>),
          ...kazuponOptions.rules
        }
      }))
    )
  }

  return configs
}
