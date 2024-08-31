import { GLOB_VUE } from '../globs'
import { getTypeScriptParser, loadPlugin } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions, VueRules } from '../types'
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
  /**
   * enable `eslint-plugin-vue-composable` rules
   * @default false
   */
  composable?: boolean
  /**
   * enable `eslint-plugin-vue-scoped-css` rules
   * @default false
   */
  scopedCss?: boolean
  /**
   * enable `eslint-plugin-vue-eslint-plugin-vuejs-accessibility` rules
   * @default false
   */
  a11y?: boolean
}

/**
 * `eslint-plugin-vue`, `eslint-plugin-vue-composable`, `eslint-plugin-vue-eslint-plugin-vuejs-accessibility` and overrides configuration options
 * @param {VueScriptOptions & TypeScriptOptions & OverridesOptions} options
 * eslint configuration options for Vue
 * @returns {Promise<Linter.Config[]>}
 * eslint flat configurations with `eslint-plugin-vue`, `eslint-plugin-vue-composable`, `eslint-plugin-vue-eslint-plugin-vuejs-accessibility` and overrides
 */
export async function vue(
  options: VueScriptOptions & TypeScriptOptions & OverridesOptions<VueRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {}, parserOptions = { project: true } } = options

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const vue =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- NOTE: `eslint-plugin-vue` is not yet type definitions exporting
    await loadPlugin<typeof import('eslint-plugin-vue')>('eslint-plugin-vue')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const vueParser = vue.configs['flat/base'][1]['languageOptions']['parser']

  const configs: Linter.Config[] = []
  configs.push(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ...(vue.configs['flat/recommended'] as Linter.Config[])
  )

  if (options.composable) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const composable =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore -- NOTE: `eslint-plugin-vue-composable` is not yet type definitions exporting
      await loadPlugin<typeof import('eslint-plugin-vue-composable')>(
        'eslint-plugin-vue-composable'
      )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const composableBase = { ...composable.configs['flat/recommended'][0] }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete composableBase.languageOptions // NOTE: not use languageOptions, because cannot work if we use it.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    configs.push(composableBase, composable.configs['flat/recommended'][1])
  }

  if (options.scopedCss) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const scopedCss =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore -- NOTE: `eslint-plugin-vue-scoped-css` is not yet type definitions exporting
      await loadPlugin<typeof import('eslint-plugin-vue-scoped-css')>(
        'eslint-plugin-vue-scoped-css'
      )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const scopedCssMapped = scopedCss.configs['flat/recommended'].map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (config: any, index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return config.name
          ? config
          : {
              name: `vue/scoped-css/recommended/${index}`,
              ...config
            }
      }
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    configs.push(scopedCssMapped[0], scopedCssMapped[2])
  }

  if (options.a11y) {
    const a11y = await loadPlugin<typeof import('eslint-plugin-vuejs-accessibility')>(
      'eslint-plugin-vuejs-accessibility'
    )
    const a11yBase = { ...a11y.configs['flat/recommended'][0] }
    // @ts-expect-error -- IGNORE
    delete a11yBase.languageOptions // NOTE: not use languageOptions
    configs.push(a11yBase)
    const a11yRules = { ...a11y.configs['flat/recommended'][1], name: 'vuejs-accessibility:rules' }
    // @ts-expect-error -- IGNORE
    delete a11yRules.languageOptions // NOTE: not use languageOptions
    // @ts-expect-error -- IGNORE
    delete a11yRules.plugins
    configs.push(a11yRules)
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
      parser: vueParser, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
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
