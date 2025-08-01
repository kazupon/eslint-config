/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 *
 * @license MIT
 */

import { GLOB_MARKDOWN, GLOB_SRC } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { JsdocRules, OverridesOptions } from '../types/index.ts'

/**
 * jsdoc configuration options
 */
export interface JsDocumentOptions {
  /**
   * If you want to use TypeScript, you need to set `syntax`, else if you want to use JavaScript and TypeScript flavor in comments, you need to set `flavor`.
   *
   * @see https://github.com/gajus/eslint-plugin-jsdoc?tab=readme-ov-file#configuration
   *
   * @default undefined
   */
  typescript?: 'syntax' | 'flavor'
  /**
   * If you wish to have all linting issues reported as failing errors, you can set this to `true`.
   *
   * @see https://github.com/gajus/eslint-plugin-jsdoc?tab=readme-ov-file#configuration
   *
   * @default false
   */
  error?: boolean
}

/**
 * `eslint-plugin-jsdoc` and overrides configuration options
 *
 * @param {JsDocOptions & OverridesOptions} options
 * eslint configuration options for JavaScript
 *
 * @returns {Promise<Linter.Config[]>}
 * eslint flat configurations with `eslint-plugin-jsdoc` and overrides
 */
export async function jsdoc(
  options: JsDocumentOptions & OverridesOptions<JsdocRules> = {}
): Promise<Linter.Config[]> {
  const {
    rules: overrideRules = {},
    ignores: overrideIgnores = [],
    typescript,
    error = false
  } = options

  const jsdoc =
    await loadPlugin<typeof import('eslint-plugin-jsdoc').default>('eslint-plugin-jsdoc')

  function resolvePreset() {
    let preset = 'recommended'
    if (typescript === 'syntax') {
      preset = `${preset}-typescript`
    } else if (typescript === 'flavor') {
      preset = `${preset}-typescript-flavor`
    }
    if (error) {
      preset = `${preset}-error`
    }
    return preset
  }

  return [
    {
      files: [GLOB_SRC],
      ignores: [`${GLOB_MARKDOWN}/${GLOB_SRC}`, ...overrideIgnores],
      ...(jsdoc.configs[`flat/${resolvePreset()}`] as Linter.Config)
    },
    {
      name: '@kazupon/jsdoc',
      files: [GLOB_SRC],
      ignores: [`${GLOB_MARKDOWN}/${GLOB_SRC}`, ...overrideIgnores],
      plugins: {
        jsdoc
      },
      rules: {
        'jsdoc/require-jsdoc': [
          'error',
          {
            publicOnly: true,
            require: {
              ArrowFunctionExpression: true,
              ClassDeclaration: true,
              ClassExpression: true,
              FunctionDeclaration: true,
              FunctionExpression: true,
              MethodDefinition: true
            },
            contexts: [
              'TSInterfaceDeclaration',
              'TSTypeAliasDeclaration',
              'TSPropertySignature',
              'TSMethodSignature'
            ]
          }
        ],
        'jsdoc/require-description': [
          'error',
          {
            contexts: [
              'ArrowFunctionExpression',
              'ClassDeclaration',
              'ClassExpression',
              'FunctionDeclaration',
              'FunctionExpression',
              'MethodDefinition',
              'PropertyDefinition',
              'VariableDeclaration',
              'TSInterfaceDeclaration',
              'TSTypeAliasDeclaration',
              'TSPropertySignature',
              'TSMethodSignature'
            ]
          }
        ],
        'jsdoc/tag-lines': [
          'error',
          'any',
          {
            startLines: 1,
            applyToEndTag: false
          }
        ],
        ...overrideRules
      }
    }
  ]
}
