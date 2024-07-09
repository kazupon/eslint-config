import { loadPlugin } from '../utils'

import type { Linter } from 'eslint'
import type { OverridesOptions } from '../types'

/**
 * jsdoc configuration options
 */
export interface JsDocumentOptions {
  /**
   * If you want to use TypeScript, you need to set `syntax`, else if you want to use JavaScript and TypeScript flavor in comments, you need to set `flavor`.
   * @see https://github.com/gajus/eslint-plugin-jsdoc?tab=readme-ov-file#configuration
   * @default undefined
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
 * `eslint-plugin-jsdoc` and overrides configuration options
 * @param {JsDocOptions & OverridesOptions} options
 * eslint configuration options for JavaScript
 * @returns {Promise<Linter.FlatConfig[]>}
 * eslint flat configurations with `eslint-plugin-jsdoc` and overrides
 */
export async function jsdoc(
  options: JsDocumentOptions & OverridesOptions = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {}, typescript, error = false } = options

  const jsdoc =
    await loadPlugin<typeof import('eslint-plugin-jsdoc').default>('eslint-plugin-jsdoc')

  // eslint-disable-next-line jsdoc/require-jsdoc
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
