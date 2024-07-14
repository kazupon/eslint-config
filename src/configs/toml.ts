import { loadPlugin } from '../utils'
import { GLOB_TOML } from '../globs'

import type { Linter } from 'eslint'
import type { OverridesOptions, TomlRules } from '../types'

/**
 * eslint toml configuration options
 */
export interface TomlOptions {}

/**
 * `eslint-plugin-yml` and overrides configuration options
 * @param {YmlOptions & OverridesOptions} options
 *  eslint yml configuration options for yml, yaml
 * @returns {Promise<Linter.FlatConfig[]>}
 *  eslint flat configurations with `eslint-plugin-yml` and overrides
 */
export async function toml(
  options: TomlOptions & OverridesOptions<TomlRules> = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {} } = options

  const toml = await loadPlugin<typeof import('eslint-plugin-toml')>('eslint-plugin-toml')

  const configs: Linter.FlatConfig[] = []

  configs.push(
    ...toml.configs['flat/standard'].map((config, index) => {
      // @ts-expect-error -- ignore
      return config.name
        ? config
        : {
            name: `toml/flat/standard/${index}`,
            ...config
          }
    })
  )

  // overrides
  const overriddenConfig: Linter.FlatConfig = {
    name: '@kazupon/toml',
    files: [GLOB_TOML],
    rules: {
      ...overrideRules
    }
  }

  configs.push(overriddenConfig)
  return configs
}
