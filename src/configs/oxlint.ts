/**
 * @author kazuya kawaguchi (a.k.a. `@kazupon`)
 * @license MIT
 */

import { loadPlugin } from '../utils.ts'

// @ts-nocheck -- FIXME: avoid typecheck error on CI
import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types/index.ts'

/**
 * oxlint configuration options
 */

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
  type OxlintModule = typeof import('eslint-plugin-oxlint').default
  const oxlint = await loadPlugin<OxlintModule>('eslint-plugin-oxlint')

  const customConfig: Linter.Config = {
    name: '@kazupon/oxlint',
    rules: {
      ...overrideRules
    }
  }

  return [
    ...(options.configFile
      ? oxlint.buildFromOxlintConfigFile(options.configFile, { withNursery: options.withNursery })
      : oxlint.configs['flat/all']),
    customConfig
  ]
}
