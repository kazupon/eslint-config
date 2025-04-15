import { getGlobSourceFiles, loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { OverridesOptions, ReactRules } from '../types/index.ts'
import type { TypeScriptOptions } from './typescript.ts'

/**
 * eslint react configuration options
 */

export interface ReactOptions {
  /**
   * use TypeScript
   * @default true
   */
  typescript?: boolean
  /**
   * enable `eslint-plugin-react-refresh` recommended rules
   * @default false
   */
  refresh?: boolean
}

/**
 * `eslint-plugin-react` and overrides configuration options
 * @param {ReactOptions & OverridesOptions} options
 *  eslint react configuration options for regular expressions
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `eslint-plugin-react` and overrides
 */
export async function react(
  options: ReactOptions & TypeScriptOptions & OverridesOptions<ReactRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {}, settings = {} } = options
  const useTypeScript = !options.typescript
  const enableRefresh = !!options.refresh

  const [react, reactHooks, reactRefresh] = await Promise.all([
    loadPlugin<typeof import('eslint-plugin-react')>('eslint-plugin-react'),
    loadPlugin<typeof import('eslint-plugin-react-hooks')>('eslint-plugin-react-hooks'),
    enableRefresh
      ? loadPlugin<typeof import('eslint-plugin-react-refresh')>('eslint-plugin-react-refresh')
      : // eslint-disable-next-line unicorn/no-null
        null
  ])

  const customConfig: Linter.Config = {
    name: '@kazupon/react',
    files: getGlobSourceFiles(useTypeScript),
    rules: {
      ...overrideRules
    }
  }

  const configs: Linter.Config[] = [
    {
      name: 'react/flat/recommended',
      files: getGlobSourceFiles(useTypeScript),
      settings,
      ...react.configs.flat.recommended
    },
    {
      files: getGlobSourceFiles(useTypeScript),
      ...reactHooks.configs['recommended-latest']
    }
  ] as Linter.Config[]

  if (enableRefresh) {
    configs.push({
      name: 'react-refresh/flat',
      files: getGlobSourceFiles(useTypeScript),
      ...reactRefresh?.configs.recommended
    })
  }

  /**
   * if (enableA11y) {
   *   configs.push({
   *     files: getFiles(),
   *     ...reactA11y.flatConfigs.recommended
   *   })
   * }
   */

  return [...configs, customConfig]
}
