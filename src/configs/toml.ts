/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

import { GLOB_MARKDOWN, GLOB_TOML } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, TomlRules } from '../types/index.ts'

/**
 * eslint toml configuration options
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- NOTE(kazupon): This is a placeholder for future options
export interface TomlOptions {
  // TODO: if we need to add options in the future, we can define them here
}

/**
 * `eslint-plugin-yml` and overrides configuration options
 *
 * @param {YmlOptions & OverridesOptions} options - eslint yml configuration options for yml, yaml
 * @returns {Promise<Linter.Config[]>} eslint flat configurations with `eslint-plugin-yml` and overrides
 */
export async function toml(
  options: TomlOptions & OverridesOptions<TomlRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options

  const toml = await loadPlugin<typeof import('eslint-plugin-toml')>('eslint-plugin-toml')

  const configs: Linter.Config[] = []

  configs.push(
    ...toml.configs['flat/standard'].map((config, index) => {
      const mapped = { ...config, ignores: [GLOB_MARKDOWN] } as Linter.Config
      // @ts-expect-error -- NOTE(kazupon): `eslint-plugin-toml` does not have a `name` property in the config
      if (!config.name) {
        mapped.name = `toml/flat/standard/${index}`
      }
      return mapped
    })
  )

  // overrides
  const overriddenConfig: Linter.Config = {
    name: '@kazupon/toml',
    files: [GLOB_TOML],
    rules: {
      ...overrideRules
    }
  }

  configs.push(overriddenConfig)
  return configs
}
