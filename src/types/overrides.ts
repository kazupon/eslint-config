import type { Linter, ESLint } from 'eslint'

export interface OverridesOptions<Rules = Linter.FlatConfig['rules']> {
  files?: Linter.FlatConfig['files']
  rules?: Rules
  parserOptions?: ESLint.Environment['parserOptions']
}
