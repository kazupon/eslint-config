/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

import { GLOB_SRC } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { DepsRules, OverridesOptions } from '../types/index.ts'

/**
 * Deps configuration options
 */
export interface DepsOptions {
  /**
   * use `eslint-pluing-barrel-files`
   *
   * @default false
   */
  barrel?: boolean
}

/**
 * `eslint-plugin-barrel-files` and overrides configuration options
 *
 * @param {DepsOptions & OverridesOptions} options - deps configuration options
 * @returns {Promise<Linter.Config[]>} eslint flat configurations with `eslint-plugin-barrel-files` and overrides
 */
export async function deps(
  options: DepsOptions & OverridesOptions<DepsRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {}, barrel = false } = options

  const configs: Linter.Config[] = []

  if (barrel) {
    // @ts-ignore -- NOTE(kazupon): `eslint-plugin-barrel-files` is not yet available in the `@types` package
    const barrelPlugin = await loadPlugin<typeof import('eslint-plugin-barrel-files')>( // eslint-disable-line @typescript-eslint/no-unsafe-assignment -- NOTE(kazupon): `eslint-plugin-barrel-files` is not yet available in the `@types` package
      'eslint-plugin-barrel-files'
    )

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- NOTE(kazupon): `eslint-plugin-barrel-files` is not yet available in the `@types` package
    const barrelConfig: Linter.Config = {
      name: 'barrel-files/recommended',
      files: [GLOB_SRC],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- NOTE(kazupon): `eslint-plugin-barrel-files` is not yet available in the `@types` package
      ...barrelPlugin.configs['recommended']
    }
    configs.push(barrelConfig)

    if (Object.keys(overrideRules).length > 0) {
      configs.push({
        name: '@kazupon/barrel-files',
        files: [GLOB_SRC],
        rules: overrideRules as Linter.RulesRecord
      })
    }
  }

  return configs
}
