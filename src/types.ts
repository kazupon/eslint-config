import type { Linter, ESLint } from 'eslint'

// TODO: move to `@kazupon/utils`
export type Awaitable<T> = T | Promise<T>

// TODO: move to `@kazupon/utils`
export type InteropModuleDefault<T> = T extends { default: infer U } ? U : T

export interface OverridesOptions {
  files?: Linter.FlatConfig['files']
  rules?: Linter.FlatConfig['rules']
  parserOptions?: ESLint.Environment['parserOptions']
}
