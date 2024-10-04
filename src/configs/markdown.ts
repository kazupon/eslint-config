import { GLOB_MARKDOWN } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { MarkdownRules, OverridesOptions } from '../types/index.ts'

/**
 * eslint unicorn configuration options
 */

export interface MarkdownOptions {
  /**
   * makrdown language
   * @see https://github.com/eslint/markdown?tab=readme-ov-file#languages
   * @default 'gfm'
   */
  language?: 'commonmark' | 'gfm'
  /**
   * enable fenced code blocks
   * @see https://github.com/eslint/markdown/blob/main/docs/processors/markdown.md
   * @default true
   */
  fencedCodeBlocks?: boolean
}

/**
 * `@eslint/markdown` and overrides configuration options
 * @param {MarkdownOptions & OverridesOptions} options
 *  eslint unicorn configuration options
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `@eslint/markdown` and overrides
 */
export async function markdown(
  options: MarkdownOptions & OverridesOptions<MarkdownRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options
  const language = options.language || 'gfm'
  const fencedCodeBlocks =
    typeof options.fencedCodeBlocks === 'boolean' ? options.fencedCodeBlocks : true

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const markdown =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (await loadPlugin<typeof import('@eslint/markdown')>('@eslint/markdown')) as any

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const recommended = markdown.configs['recommended'][0]
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  recommended.language = `markdown/${language}`
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return [
    recommended,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    ...(fencedCodeBlocks ? markdown.configs['processor'] : []),
    {
      name: '@kazupon/markdown',
      files: [GLOB_MARKDOWN],
      rules: {
        ...overrideRules
      }
    }
  ]
}

// alias
export const md: typeof markdown = markdown
