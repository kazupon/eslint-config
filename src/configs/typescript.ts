import { loadPlugin } from '../utils'
import { GLOB_TS, GLOB_TSX, GLOB_JS, GLOB_JSX } from '../globs'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types'

/**
 * TypeScript configuration options
 */
export interface TypeScriptOptions {
  /**
   * Additional extensions for files.
   * @see https://typescript-eslint.io/packages/parser/#extrafileextensions
   */
  extraFileExtensions?: string[]
  /**
   * typescript-eslint parser options
   */
  parserOptions?: TypeScriptParserOptions
}

/**
 * @see https://typescript-eslint.io/getting-started/typed-linting
 */
export interface TypeScriptParserOptions {
  /**
   * @see https://typescript-eslint.io/packages/parser#project
   * @default true
   */
  project?: boolean | string | string[]
  /**
   * @see https://typescript-eslint.io/packages/parser#tsconfigrootdir
   */
  tsconfigRootDir?: string
}

/**
 * `typescript-eslint` and overrides configuration options
 * @param {TypeScriptOptions & OverridesOptions} options
 * eslint configuration options for TypeScript
 * @returns {Promise<Linter.FlatConfig[]>}
 * eslint flat configurations with `typescript-eslint` and overrides
 */
export async function typescript(
  options: TypeScriptOptions & OverridesOptions = {}
): Promise<Linter.FlatConfig[]> {
  const {
    rules: overrideRules = {},
    extraFileExtensions = [],
    parserOptions = { project: true }
  } = options

  const ts = await loadPlugin<typeof import('typescript-eslint')>('typescript-eslint')
  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...extraFileExtensions.map(ext => `**/*${ext}`)
  ]

  return [
    ...(ts.configs.recommendedTypeChecked as Linter.FlatConfig[]), // FIXME:
    {
      files: [GLOB_JS, GLOB_JSX],
      ...(ts.configs.disableTypeChecked as Linter.FlatConfig) // FIXME:
    },
    {
      name: '@kazupon/typescipt/typescript-eslint',
      files,
      languageOptions: {
        parser: ts.parser as Linter.FlatConfigParserModule,
        parserOptions: {
          extraFileExtensions: extraFileExtensions.map(ext => `${ext}`),
          sourceType: 'module',
          ...parserOptions
        }
      },
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true
          }
        ],
        ...overrideRules
      }
    }
  ]
}
