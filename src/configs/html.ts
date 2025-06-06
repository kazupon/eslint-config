/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import { GLOB_HTML, GLOB_MARKDOWN } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { HtmlRules, OverridesOptions } from '../types/index.ts'

/**
 * html configuration options
 */
export interface HtmlOptions {
  /**
   * whether to enable template engine syntax
   * @default undefined
   */
  templateEngineSyntax?: 'erb' | 'handlebar' | 'twig' | { [syntax: string]: string }
  /**
   * whether to enable frontmatter in html files
   * @see https://html-eslint.org/docs/integrating-template-engine#skip-frontmatter
   * @default false
   */
  frontmatter?: boolean
  /**
   * whether to disalbe stylistic rules for prettier, if set `true`
   * @default false
   */
  prettier?: boolean
}

/**
 * `@html-eslint/eslint-plugin` and overrides configuration options
 * @param {HtmlOptions & OverridesOptions} options eslint configuration options for HTML
 * @returns {Promise<Linter.Config[]>}
 * eslint flat configurations with `@html-eslint/eslint-plugin` and overrides
 */
export async function html(
  options: HtmlOptions & OverridesOptions<HtmlRules> = {}
): Promise<Linter.Config[]> {
  const {
    rules: overrideRules = {},
    prettier = false,
    frontmatter = false,
    templateEngineSyntax
  } = options

  const html = await loadPlugin<typeof import('@html-eslint/eslint-plugin')>(
    '@html-eslint/eslint-plugin'
  )
  const htmlParser = html.configs['flat/recommended'].languageOptions['parser']

  // TODO: template literals settings on eslint settings
  // https://html-eslint.org/docs/getting-started#lint-html-in-javascript-template-literals

  const configs: Linter.Config[] = [
    {
      name: '@html-eslint/flat/recommended',
      files: [GLOB_HTML, `${GLOB_MARKDOWN}/**/${GLOB_HTML}`],
      // files: [GLOB_HTML],
      ...html.configs['flat/recommended']
    }
  ]

  const customConfig: Linter.Config = {
    name: '@kazupon/@html-eslint',
    files: [GLOB_HTML, `${GLOB_MARKDOWN}/**/${GLOB_HTML}`],
    // files: [GLOB_HTML],
    languageOptions: {
      parser: htmlParser,
      parserOptions: {
        frontmatter
      }
    },
    rules: {
      ...overrideRules
    }
  }
  if (templateEngineSyntax) {
    customConfig.languageOptions!.parserOptions!.templateEngineSyntax = resolveTemplateEngineSyntax(
      templateEngineSyntax,
      htmlParser
    )
  }
  configs.push(customConfig)

  if (prettier) {
    // disalbe stylistic rules for prettier
    configs.push({
      name: '@html-eslint/prettier',
      files: [GLOB_HTML],
      rules: {
        '@html-eslint/attrs-newline': 'off',
        '@html-eslint/element-newline': 'off',
        '@html-eslint/id-naming-convention': 'off',
        '@html-eslint/indent': 'off',
        '@html-eslint/lowercase': 'off',
        '@html-eslint/max-element-depth': 'off',
        '@html-eslint/no-extra-spacing-attrs': 'off',
        '@html-eslint/no-multiple-empty-lines': 'off',
        '@html-eslint/no-trailing-spaces': 'off',
        '@html-eslint/quotes': 'off',
        '@html-eslint/sort-attrs': 'off'
      }
    })
  }

  return configs
}

/**
 * Resolve template engine syntax for html-eslint parser
 * @param {HtmlOptions['templateEngineSyntax']} syntax - template engine syntax
 * @param {typeof import('@html-eslint/eslint-plugin').configs['flat/recommended']['languageOptions']['parser']} parser - html-eslint parser
 * @returns {{ [syntax: string]: string } | undefined} resolved template engine syntax, or undefined if no syntax is provided
 */
function resolveTemplateEngineSyntax(
  syntax: HtmlOptions['templateEngineSyntax'],
  parser: (typeof import('@html-eslint/eslint-plugin').configs)['flat/recommended']['languageOptions']['parser']
): { [syntax: string]: string } | undefined {
  if (!syntax) {
    return undefined
  }

  switch (syntax) {
    case 'erb': {
      return parser.TEMPLATE_ENGINE_SYNTAX.ERB
    }
    case 'handlebar': {
      return parser.TEMPLATE_ENGINE_SYNTAX.HANDLEBAR
    }
    case 'twig': {
      return parser.TEMPLATE_ENGINE_SYNTAX.TWIG
    }
  }

  return syntax
}
