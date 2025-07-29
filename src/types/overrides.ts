/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import type { ESLint, Linter } from 'eslint'

/**
 * Overrides configuration options
 */
export interface OverridesOptions<Rules = Linter.Config['rules']> {
  /**
   * Override files
   */
  files?: Linter.Config['files']
  /**
   * Override ignores
   */
  ignores?: Linter.Config['ignores']
  /**
   * Override rules
   */
  rules?: Rules
  /**
   * Override parser options
   */
  parserOptions?: ESLint.Environment['parserOptions']
  /**
   * Override language options
   */
  settings?: Linter.Config['settings']
}
