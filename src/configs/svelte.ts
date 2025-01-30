import { GLOB_SVELTE } from '../globs.ts'
import { getTypeScriptParser, loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, SvelteRules } from '../types/index.ts'
import type { TypeScriptOptions } from './typescript.ts'

/**
 * Svelte configuration options
 */
export interface SvelteScriptOptions {
  /**
   * use TypeScript in `template` block
   * @default false
   */
  typescript?: boolean
}

/**
 * `eslint-plugin-svelte` and overrides configuration options
 * @param {SvelteScriptOptions & TypeScriptOptions & OverridesOptions} options
 * eslint configuration options for Vue
 * @returns {Promise<Linter.Config[]>}
 * eslint flat configurations with `eslint-plugin-svelte` and overrides
 */
export async function svelte(
  options: SvelteScriptOptions & TypeScriptOptions & OverridesOptions<SvelteRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {}, parserOptions = { project: true } } = options
  const useTypeScript = !!options.typescript

  const svelte =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-svelte` is not yet type definitions exporting
    await loadPlugin<typeof import('eslint-plugin-svelte')>('eslint-plugin-svelte')

  const svelteParser = svelte.configs['flat/base'][1]['languageOptions']?.parser

  const customConfig: Linter.Config = {
    name: '@kazupon/svelte',
    files: [GLOB_SVELTE],
    rules: {
      ...overrideRules
    }
  }
  if (useTypeScript) {
    customConfig.languageOptions = {
      parser: svelteParser,
      parserOptions: {
        sourceType: 'module',
        parser: await getTypeScriptParser(),
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: ['.svelte'],
        ...parserOptions
      }
    }
  }

  return [...svelte.configs['flat/recommended'], customConfig]
}
