/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import { GLOB_YAML } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, YmlRules } from '../types/index.ts'

/**
 * eslint yml configuration options
 */
export interface YmlOptions {
  /**
   * whether to enable config `'flat/prettier'`of `eslint-plugin-jsonc`.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-yml/user-guide/#configuration
   * @default false
   */
  prettier?: boolean
}

/**
 * `eslint-plugin-yml` and overrides configuration options
 *
 * @param {YmlOptions & OverridesOptions} options - eslint yml configuration options for yml, yaml
 * @returns {Promise<Linter.Config[]>} eslint flat configurations with `eslint-plugin-yml` and overrides
 */
export async function yml(
  options: YmlOptions & OverridesOptions<YmlRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {} } = options

  const usePrettier = !!options.prettier
  const yml = await loadPlugin<typeof import('eslint-plugin-yml')>('eslint-plugin-yml')

  const configs: Linter.Config[] = []

  configs.push(
    ...yml.configs['flat/standard'].map((config, index) => {
      // @ts-expect-error -- NOTE(kazupon): `eslint-plugin-yml` does not have a `name` property in the config
      return config.name
        ? config
        : {
            name: `yml/flat/standard/${index}`,
            ...config
          }
    })
  )

  if (usePrettier) {
    configs.push(
      ...yml.configs['flat/prettier'].map((config, index) => {
        // @ts-expect-error -- NOTE(kazupon): `eslint-plugin-yml` does not have a `name` property in the config
        return config.name
          ? config
          : {
              name: `yml/flat/prettier/${index}`,
              ...config
            }
      })
    )
  }

  // overrides
  const overriddenConfig: Linter.Config = {
    name: '@kazupon/yml',
    files: [GLOB_YAML],
    rules: {
      ...overrideRules
    }
  }

  configs.push(overriddenConfig)
  return configs
}

// alias
export const yaml: typeof yml = yml
