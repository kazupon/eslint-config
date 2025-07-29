/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import { GLOB_TESTS, GLOB_TESTS_TYPE } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, VitestRules } from '../types/index.ts'

/**
 * eslint vitest configuration options
 */
export interface VitestOptions {
  /**
   * use type testing
   *
   * @description about type testing, see https://vitest.dev/guide/testing-types,
   * and about eslint config, see https://github.com/vitest-dev/eslint-plugin-vitest?tab=readme-ov-file#enabling-with-type-testing
   * @default false
   */
  typeTesting?: boolean
}

/**
 * `@vitest/eslint-plugin` and overrides configuration options
 *
 * @param {VitestOptions & OverridesOptions} options
 *  eslint vitest configuration options
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `@vitest/eslint-plugin` and overrides
 */
export async function vitest(
  options: VitestOptions & OverridesOptions<VitestRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {}, files: overrideFiles = [] } = options
  const typeTesting = !!options.typeTesting

  // FIXME: cannot correctly resolve type...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- NOTE(kazupon): `@vitest/eslint-plugin` is not yet available in the `@types` package
  const vitest = (await loadPlugin('@vitest/eslint-plugin')) as any

  const configs: Linter.Config[] = []

  const base: Linter.Config = {
    files: GLOB_TESTS,

    ...vitest.configs['recommended']
  }
  if (base.name == undefined) {
    base.name = '@vitest/eslint-plugin'
  }
  if (typeTesting) {
    base.files = [...base.files!, ...GLOB_TESTS_TYPE]
    base.settings = {
      vitest: {
        typecheck: true
      }
    }

    base.languageOptions = {
      globals: {
        ...vitest.environments.env.globals
      }
    }
  }
  configs.push(base)

  const custom: Linter.Config = {
    name: '@kazupon/vitest',
    rules: {
      ...overrideRules
    }
  }
  if (overrideFiles.length > 0) {
    custom.files = overrideFiles
  }
  configs.push(custom)

  return configs
}
