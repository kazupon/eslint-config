import type { Linter } from 'eslint'

/**
 * define eslint configurations
 *
 * @param {Linter.FlatConfig | Linter.FlatConfig[]} config eslint flat configurations
 * @returns
 */
export function defineConfig(
  config: Linter.FlatConfig | Linter.FlatConfig[] = []
): Linter.FlatConfig[] {
  const configs: Linter.FlatConfig[] = []

  // merge configurations
  configs.push(...toArray(config))

  return configs
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
