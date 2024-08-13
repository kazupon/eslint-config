import type { Linter, ESLint } from 'eslint'

export interface OverridesOptions<Rules = Linter.Config['rules']> {
  files?: Linter.Config['files']
  rules?: Rules
  parserOptions?: ESLint.Environment['parserOptions']
}
