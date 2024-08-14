import { loadPlugin, getTypeScriptParser } from '../utils'
import { GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX } from '../globs'

import type { Linter } from 'eslint'
import type { TypeScriptOptions } from './typescript'
import type { OverridesOptions, ReactRules } from '../types'

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
  const { rules: overrideRules = {}, parserOptions = { project: true }, settings = {} } = options
  const useTypeScript = !options.typescript
  const enableRefresh = !!options.refresh

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [react, reactHooks, reactRefresh] = await Promise.all([
    // @ts-expect-error -- NOTE: `TS7016` error, we need to ignore this error, because `eslint-plugin-react` is not yet type definitions exporting
    loadPlugin<typeof import('eslint-plugin-react')>('eslint-plugin-react'),
    // @ts-expect-error -- NOTE: `TS7016` error, we need to ignore this error, because `eslint-plugin-react-hooks` is not yet type definitions exporting
    loadPlugin<typeof import('eslint-plugin-react-hooks')>('eslint-plugin-react-hooks'),
    enableRefresh
      ? // @ts-expect-error -- NOTE: `TS7016` error, we need to ignore this error, because `eslint-plugin-react-refresh` is not yet type definitions exporting
        loadPlugin<typeof import('eslint-plugin-react-refresh')>('eslint-plugin-react-refresh')
      : // eslint-disable-next-line unicorn/no-null
        null
  ])

  /**
   * get files
   * @returns {string[]} files
   */
  function getFiles() {
    return [GLOB_JS, GLOB_JSX, ...(useTypeScript ? [GLOB_TS, GLOB_TSX] : [])]
  }

  const customConfig: Linter.Config = {
    name: '@kazupon/react',
    files: getFiles(),
    rules: {
      ...overrideRules
    }
  }
  if (useTypeScript) {
    customConfig.languageOptions = {
      parser: (await getTypeScriptParser()) as NonNullable<
        Linter.Config['languageOptions']
      >['parser'],
      parserOptions: {
        // sourceType: 'module',
        // ecmaFeatures: {
        //   jsx: true
        // },
        ...parserOptions
      }
    }
  }

  const configs: Linter.Config[] = [
    {
      name: 'react/flat/recommended',
      files: getFiles(),
      settings,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...react.configs.flat.recommended
    },
    {
      name: 'react-hooks/flat',
      files: getFiles(),
      plugins: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        'react-hooks': reactHooks
      }
    }
  ] as Linter.Config[]

  if (enableRefresh) {
    configs.push({
      name: 'react-refresh/flat',
      files: getFiles(),
      plugins: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        'react-refresh': reactRefresh
      }
    })
  }

  // if (enableA11y) {
  //   configs.push({
  //     files: getFiles(),
  //     ...reactA11y.flatConfigs.recommended
  //   })
  // }

  return [...configs, customConfig]
}
