import { FlatConfigComposer } from 'eslint-flat-config-utils'
// import { javascript } from './configs'

import type { Linter } from 'eslint'
import type { Awaitable } from './types'

/**
 * define eslint configurations
 * @param {Awaitable<Linter.FlatConfig | Linter.FlatConfig[]>[]} configs eslint flat configurations
 * @returns {FlatConfigComposer} eslint flat configuration composer
 */
export function defineConfig(
  ...configs: Awaitable<Linter.FlatConfig | Linter.FlatConfig[]>[]
): FlatConfigComposer {
  const baseConfigs: Awaitable<Linter.FlatConfig[]>[] = []
  // built-in configurations
  // baseConfigs.push(javascript().then(c => c))
  return new FlatConfigComposer().append(...baseConfigs, ...configs)
}
