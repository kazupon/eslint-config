import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors'
import { GLOB_MARKDOWN, GLOB_SRC } from '../globs.ts'
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
  /**
   * enable block extensions
   */
  blockExtensions?: string[]
}

/*
export const parserPlain: Linter.Parser = {
  meta: {
    name: 'parser-plain',
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManager: null, // eslint-disable-line unicorn/no-null
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
}
*/

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
  const { rules: overrideRules = {}, files = [GLOB_MARKDOWN], blockExtensions = [] } = options
  const language = options.language || 'gfm'
  // TODO: remove this option
  // const fencedCodeBlocks =
  //   typeof options.fencedCodeBlocks === 'boolean' ? options.fencedCodeBlocks : true

  const markdown = await loadPlugin<typeof import('@eslint/markdown').default>('@eslint/markdown')

  const recommended = { ...markdown.configs['recommended'][0] }
  const codeblocks = markdown.configs.processor[2]

  recommended.language = `markdown/${language}`

  return [
    recommended,
    // ...(fencedCodeBlocks ? markdown.configs['processor'] : []),
    {
      name: 'markdown/makedown-in-markdown',
      files,
      ignores: [`${GLOB_MARKDOWN}/**`],
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([markdown.processors.markdown, processorPassThrough])
    },
    // {
    //   name: 'markdown/pass-through-parser',
    //   files,
    //   languageOptions: {
    //     parser: parserPlain
    //   },
    // },
    {
      // workaround for typescript-eslint issue
      // see https://github.com/eslint/markdown/issues/114
      name: 'makrdown/ignore-lint-blocks-in-typescript',
      files: ['**/*.md/**'],
      languageOptions: {
        parserOptions: {
          // project: null, // eslint-disable-line unicorn/no-null
        }
      }
    },
    {
      name: '@kazupon/markdown',
      files: [
        `${GLOB_MARKDOWN}/${GLOB_SRC}`,
        ...blockExtensions.map(ext => `${GLOB_MARKDOWN}/**/*.${ext}`)
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true
          }
        }
      },
      // disable rules
      rules: {
        ...codeblocks.rules,
        'import/no-unresolved': 'off',
        'unused-imports/no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        // override rules
        ...overrideRules
      }
    }
  ]
}

// alias
export const md: typeof markdown = markdown
