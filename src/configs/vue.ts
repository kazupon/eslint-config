import { loadPlugin } from '../utils'
import { GLOB_VUE } from '../globs'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types'
import type { TypeScriptOptions } from './typescript'

/**
 * Vue configuration options
 */
export interface VueScriptOptions {
  /**
   * use TypeScript in `template` block
   * @default false
   */
  typescript?: boolean
}

/**
 *
 * @param options
 */
export async function vue(
  options: VueScriptOptions & TypeScriptOptions & OverridesOptions = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {}, parserOptions = { project: true } } = options
  const useTypeScript = !!options.typescript

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const vue =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-vue` is not yet type definitions exporting
    await loadPlugin<typeof import('eslint-plugin-vue')>('eslint-plugin-vue')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const vueParser = vue.configs['flat/base'][1]['languageOptions']['parser']

  /**
   *
   */
  async function getTypeScriptParser() {
    const ts = await loadPlugin<typeof import('typescript-eslint')>('typescript-eslint')
    return ts.parser
  }

  const customConfig: Linter.FlatConfig = {
    name: '@kazupon/vue',
    files: [GLOB_VUE],
    rules: {
      ...overrideRules
    }
  }
  if (useTypeScript) {
    customConfig.languageOptions = {
      parser: vueParser as Linter.FlatConfigParserModule,
      parserOptions: {
        sourceType: 'module',
        parser: await getTypeScriptParser(),
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: ['.vue'],
        ...parserOptions
      }
    }
  }

  return [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ...(vue.configs['flat/recommended'] as Linter.FlatConfig[]),
    customConfig
  ]
}
