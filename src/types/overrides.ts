/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

import type { ESLint, Linter } from 'eslint'

export interface OverridesOptions<Rules = Linter.Config['rules']> {
  files?: Linter.Config['files']
  ignores?: Linter.Config['ignores']
  rules?: Rules
  parserOptions?: ESLint.Environment['parserOptions']
  settings?: Linter.Config['settings']
}
