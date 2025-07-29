/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import { FlatConfigComposer } from 'eslint-flat-config-utils'
// import { javascript } from './configs'

import type { Awaitable } from '@kazupon/jts-utils/types'
import type { Linter } from 'eslint'

/**
 * define eslint configurations
 *
 * @param {Awaitable<Linter.Config | Linter.Config[]>[]} configs eslint flat configurations
 * @returns {FlatConfigComposer} eslint flat configuration composer
 */
export function defineConfig(
  ...configs: Awaitable<Linter.Config | Linter.Config[]>[]
): FlatConfigComposer {
  const baseConfigs: Awaitable<Linter.Config[]>[] = []
  /**
   * built-in configurations
   * baseConfigs.push(javascript().then(c => c))
   */
  return new FlatConfigComposer().append(...baseConfigs, ...configs)
}
