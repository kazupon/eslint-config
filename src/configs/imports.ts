import { GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX } from '../globs.ts'
import { loadPlugin } from '../utils.ts'

import type { Linter } from 'eslint'
import type { ImportsRules, OverridesOptions } from '../types/index.ts'

const IMPORTS_FILES = [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX]

/**
 * imports configuration options
 */
export interface ImportsOptions {
  /**
   * use typescript
   * @default false
   */
  typescript?: boolean
  /**
   * use `eslint-plugin-module-interop`
   * @default true
   */
  interop?: boolean
}

/**
 * `eslint-plugin-import-x`, `eslint-plugin-unused-imports` and overrides configuration options
 * @description **if you want to use this preset, you need to put after `javascirpt` and `typescript` presets**
 * @param {ImportsOptions & OverridesOptions} options
 *  import configuration options
 * @returns {Promise<Linter.Config[]>}
 *  eslint flat configurations with `eslint-plugin-import-x`, `eslint-plugin-unused-imports` and overrides
 */
export async function imports(
  options: ImportsOptions & OverridesOptions<ImportsRules> = {}
): Promise<Linter.Config[]> {
  const { rules: overrideRules = {}, interop = true } = options

  // FIXME: cannot correctly resolve type...
  const unused = (await loadPlugin<typeof import('eslint-plugin-unused-imports')>(
    'eslint-plugin-unused-imports'
  )) as any // eslint-disable-line @typescript-eslint/no-explicit-any

  // @ts-expect-error -- NOTE: `eslint-config-prettier` is not yet available in the`@types` package
  const imports = await loadPlugin<typeof import('eslint-plugin-import')>('eslint-plugin-import')

  const configs: Linter.Config[] = [imports.flatConfigs.recommended as Linter.Config]

  if (options.typescript) {
    try {
      // check if the resolver is installed
      await loadPlugin<typeof import('eslint-import-resolver-typescript')>(
        'eslint-import-resolver-typescript'
      )
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore -- NOTE: add typescript resolver
      imports.flatConfigs.typescript.settings['import/resolver']['typescript'] = true
      configs.push({
        name: 'import/typescript',
        ...imports.flatConfigs.typescript
      })
    } catch (error: unknown) {
      throw new Error(`Not found eslint-import-resolver-typescript: ${(error as Error).message}`)
    }
  }

  if (interop) {
    try {
      // check if the resolver is installed
      const modInterop = await loadPlugin<typeof import('eslint-plugin-module-interop')>(
        'eslint-plugin-module-interop'
      )
      configs.push({
        name: 'module-interop',
        ...(modInterop.configs.recommended as Linter.Config)
      })
    } catch (error: unknown) {
      throw new Error(`Not found eslint-plugin-module-interop: ${(error as Error).message}`)
    }
  }

  configs.push({
    name: 'unused-imports',
    plugins: {
      'unused-imports': unused
    },
    files: IMPORTS_FILES,
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ]
    }
  })

  // overrides
  const overriddenConfig: Linter.Config = {
    name: '@kazupon/imports',
    files: IMPORTS_FILES,
    rules: {
      ...overrideRules
    }
  }

  configs.push(overriddenConfig)
  return configs
}
