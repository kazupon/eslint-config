/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types/index.ts'

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

  type OxlintModule = typeof import('eslint-plugin-oxlint').default
  const oxlint = await loadPlugin<OxlintModule>('eslint-plugin-oxlint')

  const customConfig: Linter.Config = {
    name: '@kazupon/oxlint',
    rules: {
      ...overrideRules
    }
  }

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
          customConfig
        ]
      : [...configsFromFile, customConfig]
  } else {
    return [...oxlint.configs['flat/all'], customConfig]
  }
}
