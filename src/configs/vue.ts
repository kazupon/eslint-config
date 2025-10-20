/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

import { GLOB_MARKDOWN, GLOB_VUE } from '../globs.ts'
import { getTypeScriptParser, loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, VueRules } from '../types/index.ts'
import type { TypeScriptOptions } from './typescript.ts'

/**
 * Vue configuration options
 */
export interface VueScriptOptions {
  /**
   * use TypeScript in `template` block
   *
   * @default false
   */
  typescript?: boolean
  /**
   * enable `eslint-plugin-vue-composable` rules
   *
   * @default false
   */
  composable?: boolean
  /**
   * enable `eslint-plugin-vue-scoped-css` rules
   *
   * @default false
   */
  scopedCss?: boolean
  /**
   * enable `eslint-plugin-vue-eslint-plugin-vuejs-accessibility` rules
   *
   * @default false
   */
  a11y?: boolean
  /**
   * enable `@intlify/eslint-plugin-vue-i18n` rules
   *
   * @default false
   */
  i18n?: VueI18nOptions
}

/**
 * `@intlify/eslint-plugin-vue-i18n` configuration options.
 * same `settings['vue-i18n']`
 * see https://eslint-plugin-vue-i18n.intlify.dev/started.html#settings-vue-i18n
 */
export interface VueI18nOptions {
  /**
   * A directory path to the locale files
   */
  localeDir?: string
  /**
   * The version of the intlify message syntax to use
   */
  messageSyntaxVersion?: string
}

/**
 * `eslint-plugin-vue`, `eslint-plugin-vue-composable`, `eslint-plugin-vue-eslint-plugin-vuejs-accessibility` and overrides configuration options
 *
 * @param {VueScriptOptions & TypeScriptOptions & OverridesOptions} options - eslint configuration options for Vue
 * @returns {Promise<Linter.Config[]>} eslint flat configurations with `eslint-plugin-vue`, `eslint-plugin-vue-composable`, `eslint-plugin-vue-eslint-plugin-vuejs-accessibility` and overrides
 */
export async function vue(
  options: VueScriptOptions & TypeScriptOptions & OverridesOptions<VueRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {}, parserOptions = { projectService: true } } = options

  const vue =
    // @ts-ignore -- NOTE(kazupon): `eslint-plugin-vue` is not yet type definitions exporting
    await loadPlugin<typeof import('eslint-plugin-vue')>('eslint-plugin-vue')

  const vueParser = vue.configs['flat/base'][1]['languageOptions']?.parser

  const configs: Linter.Config[] = []
  configs.push(
    ...(vue.configs['flat/recommended'] as Linter.Config[]).map(config => ({
      ...config,
      ignores: [GLOB_MARKDOWN]
    }))
  )

  if (options.composable) {
    const composable =
      // @ts-ignore -- NOTE(kazupon): `eslint-plugin-vue-composable` is not yet type definitions exporting
      await loadPlugin<typeof import('eslint-plugin-vue-composable')>(
        'eslint-plugin-vue-composable'
      )

    const composableBase = { ...composable.configs['flat/recommended'][0] }

    delete composableBase.languageOptions // NOTE(kazupon): not use languageOptions, because cannot work if we use it.

    configs.push(composableBase, composable.configs['flat/recommended'][1])
  }

  if (options.scopedCss) {
    const scopedCss =
      // @ts-ignore -- NOTE(kazupon): `eslint-plugin-vue-scoped-css` is not yet type definitions exporting
      await loadPlugin<typeof import('eslint-plugin-vue-scoped-css')>(
        'eslint-plugin-vue-scoped-css'
      )

    const scopedCssMapped = scopedCss.configs['flat/recommended'].map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- NOTE(kazupon): `eslint-plugin-vue-scoped-css` is not yet type definitions exporting
      (config: any, index: number) => {
        const mapped = { ...config, ignores: [GLOB_MARKDOWN] } as Linter.Config
        if (!config.name) {
          mapped.name = `vue/scoped-css/recommended/${index}`
        }
        return mapped
      }
    )

    configs.push(scopedCssMapped[0], scopedCssMapped[2])
  }

  if (options.a11y) {
    const a11y = await loadPlugin<typeof import('eslint-plugin-vuejs-accessibility')>(
      'eslint-plugin-vuejs-accessibility'
    )
    const a11yBase = { ...a11y.configs['flat/recommended'][0] }
    // @ts-expect-error -- NOTE(kazupon): `eslint-plugin-vuejs-accessibility` does not have a `languageOptions` property in the config
    delete a11yBase.languageOptions // NOTE(kazupon): not use languageOptions
    configs.push(a11yBase)
    const a11yRules = { ...a11y.configs['flat/recommended'][1], name: 'vuejs-accessibility:rules' }
    // @ts-expect-error -- NOTE(kazupon): `eslint-plugin-vuejs-accessibility` does not have a `languageOptions` property in the config
    delete a11yRules.languageOptions // NOTE(kazupon): not use languageOptions
    // @ts-expect-error -- NOTE(kazupon): `eslint-plugin-vuejs-accessibility` does not have a `plugins` property in the config
    delete a11yRules.plugins
    configs.push(a11yRules)
  }

  if (options.i18n) {
    const i18n = await loadPlugin<typeof import('@intlify/eslint-plugin-vue-i18n')>(
      '@intlify/eslint-plugin-vue-i18n'
    )
    configs.push(
      ...(i18n.configs['recommended'] as Linter.Config[]).map(config => ({
        ...config,
        ignores: [GLOB_MARKDOWN]
      })),
      {
        name: '@intlify/vue-i18n/settings',
        settings: {
          'vue-i18n': options.i18n
        }
      }
    )
  }

  const customConfig: Linter.Config = {
    name: '@kazupon/vue',
    files: [GLOB_VUE],
    rules: {
      ...overrideRules
    }
  }
  if (options.typescript) {
    customConfig.languageOptions = {
      parser: vueParser,
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
  configs.push(customConfig)

  return configs
}
