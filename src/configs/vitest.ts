import { GLOB_TESTS, GLOB_TESTS_TYPE } from '../globs'
import { loadPlugin } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions, VitestRules } from '../types'

/**
 * eslint vitest configuration options
 */

export interface VitestOptions {
  /**
   * use type testing
   * @description about type testing, see https://vitest.dev/guide/testing-types,
   * and about eslint config, see https://github.com/vitest-dev/eslint-plugin-vitest?tab=readme-ov-file#enabling-with-type-testing
   * @default false
   */
  typeTesting?: boolean
}

/**
 * `@vitest/eslint-plugin` and overrides configuration options
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const vitest = (await loadPlugin('@vitest/eslint-plugin')) as any

  const configs: Linter.Config[] = []

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const base: Linter.Config = {
    files: GLOB_TESTS,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      globals: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
