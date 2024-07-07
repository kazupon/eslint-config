import { loadPlugin } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types'

/**
 * jsdoc configuration options
 */
export interface JsDocOptions {
  /**
   * If you want to use TypeScript, you need to set `syntax`, else if you want to use JavaScript and TypeScript flavor in comments, you need to set `flavor`.
   * @see https://github.com/gajus/eslint-plugin-jsdoc?tab=readme-ov-file#configuration
   * @default undfined
   */
  typescript?: 'syntax' | 'flavor'
  /**
   * If you wish to have all linting issues reported as failing errors, you can set this to `true`.
   * @see https://github.com/gajus/eslint-plugin-jsdoc?tab=readme-ov-file#configuration
   * @default false
   */
  error?: boolean
}

/**
 *
 * @param options
 */
export async function jsdoc(
  options: JsDocOptions & OverridesOptions = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {}, typescript, error = false } = options

  const jsdoc =
    await loadPlugin<typeof import('eslint-plugin-jsdoc').default>('eslint-plugin-jsdoc')

  /**
   *
   */
  function resolvePreset() {
    let preset = 'recommended'
    if (typescript === 'syntax') {
      preset = `${preset}-typescript`
    } else if (typescript === 'flavor') {
      preset = `${preset}-typescript-flavor`
    }
    if (error) {
      preset = `${preset}-error`
    }
    return preset
  }

  return [
    jsdoc.configs[`flat/${resolvePreset()}`] as Linter.FlatConfig,
    {
      name: '@kazupon/jsdoc',
      rules: {
        ...overrideRules
      }
    }
  ]
}
