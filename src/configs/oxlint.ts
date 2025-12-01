/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types/index.ts'

/**
 * Oxlint configuration preset names
 */
type OxlintConfigPreset =
  | 'recommended'
  | 'all'
  | 'import'
  | 'unicorn'
  | 'jsdoc'
  | 'node'
  | 'jest'
  | 'vitest'
  | 'typescript'
  | 'vue'
  | 'react'
  | 'react-perf'
  | 'jsx-a11y'
  | 'tree-shaking'
  | 'nextjs'
  | 'pedantic'
  | 'style'
  | 'correctness'
  | 'restriction'
  | 'suspicious'

/**
 * Oxlint configuration options
 */
export interface OxlintOptions {
  /**
   * oxlint config file path
   */
  configFile?: string
  /**
   * enable nursery rules
   */
  withNursery?: boolean
  /**
   * enable global ignore patterns
   *
   * if true, it will use oxlint configure `ignorePatterns` as global ignore for ESLint flat config
   *
   * if the below PR released, this option will be removed and enabled by default
   *
   * @see https://github.com/oxc-project/eslint-plugin-oxlint/pull/564
   *
   * @default false
   */
  enableGlobalIgnore?: boolean
  /**
   * configuration preset name, which is one of `eslint-plugin-oxlint`'s provided presets
   *
   * @see https://github.com/oxc-project/eslint-plugin-oxlint?tab=readme-ov-file#all-configs
   *
   * @default `[]`
   */
  presets?: OxlintConfigPreset[]
}

/**
 * `eslint-plugin-oxlint` and overrides configuration options
 *
 * @param {OxlintOptions & OverridesOptions} options - eslint configuration options for oxlint
 * @returns {Promise<Linter.Config[]>} eslint flat configurations with `eslint-plugin-oxlint` and overrides
 */
export async function oxlint(
  options: OxlintOptions & OverridesOptions = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options
  const enableGlobalIgnore = options.enableGlobalIgnore ?? false
  const presets = options.presets ?? []

  type OxlintModule = typeof import('eslint-plugin-oxlint').default
  const oxlint = await loadPlugin<OxlintModule>('eslint-plugin-oxlint')

  const customConfig: Linter.Config = {
    name: '@kazupon/oxlint',
    rules: {
      ...overrideRules
    }
  }

  const presetConfigs = collectOxlintPresetConfig(oxlint, presets)

  if (options.configFile) {
    const configsFromFile = oxlint.buildFromOxlintConfigFile(options.configFile, {
      withNursery: options.withNursery
    })
    const oxlintBaseConfig = configsFromFile.find(
      config => config.name === 'oxlint/from-oxlint-config'
    )
    let ignores: string[] | undefined = undefined
    if (oxlintBaseConfig && enableGlobalIgnore && oxlintBaseConfig.ignores) {
      ignores = oxlintBaseConfig.ignores
      delete oxlintBaseConfig.ignores
    }

    return enableGlobalIgnore && ignores
      ? [
          {
            name: '@kazupon/oxlint-global-ignore',
            ignores
          },
          ...configsFromFile,
          ...presetConfigs,
          customConfig
        ]
      : [...configsFromFile, ...presetConfigs, customConfig]
  } else {
    return [...presetConfigs, customConfig]
  }
}

function collectOxlintPresetConfig(
  oxlint: typeof import('eslint-plugin-oxlint').default,
  presets: OxlintConfigPreset[]
): Linter.Config[] {
  const results: Linter.Config[] = []
  for (const preset of presets) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access -- NOTE(kazupon): generic access
    const presetConfigs = (oxlint.configs as any)[`flat/${preset}`] as Linter.Config[] | undefined
    if (presetConfigs) {
      results.push(presetConfigs[0])
    }
  }
  return results
}
