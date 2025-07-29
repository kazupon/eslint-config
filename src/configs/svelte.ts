/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import { GLOB_MARKDOWN, GLOB_SVELTE } from '../globs.ts'
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
   *
   * @default false
   */
  typescript?: boolean
  /**
   * `svelte.config.js` configuration
   *
   * @default {}
   */
  svelteConfig?: Record<string, unknown>
}

/**
 * `eslint-plugin-svelte` and overrides configuration options
 *
 * @param {SvelteScriptOptions & TypeScriptOptions & OverridesOptions} options
 * eslint configuration options for Vue
 * @returns {Promise<Linter.Config[]>}
 * eslint flat configurations with `eslint-plugin-svelte` and overrides
 */
export async function svelte(
  options: SvelteScriptOptions & TypeScriptOptions & OverridesOptions<SvelteRules> = {}
): Promise<Linter.Config[]> {
  const {
    rules: overrideRules = {},
    parserOptions = { projectService: true },
    svelteConfig = {}
  } = options
  const useTypeScript = !!options.typescript

  const svelte =
    // @ts-ignore -- NOTE(kazupon): `eslint-plugin-svelte` is not yet type definitions exporting
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
        svelteConfig,
        ...parserOptions
      }
    }
  }

  return [
    ...svelte.configs['flat/recommended'].map(config => ({ ...config, ignores: [GLOB_MARKDOWN] })),
    customConfig
  ]
}
