import { loadPlugin } from '../utils'
import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs'

import type { Linter } from 'eslint'
import type { OverridesOptions, JsoncRules } from '../types'

/**
 * eslint jsonc configuration options
 */
export interface JsoncOptions {
  /**
   * whether to enable config `'flat/recommended-with-json'`of `eslint-plugin-jsonc`.
   * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/#usage
   * @default false
   */
  json?: boolean
  /**
   * whether to enable config `'flat/recommended-with-jsonc'`of `eslint-plugin-jsonc`.
   * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/#usage
   * @default false
   */
  jsonc?: boolean
  /**
   * whether to enable config `'flat/recommended-with-json5'`of `eslint-plugin-jsonc`.
   * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/#usage
   * @default false
   */
  json5?: boolean
  /**
   * whether to enable config `'flat/prettier'`of `eslint-plugin-jsonc`.
   * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/#usage
   * @default false
   */
  prettier?: boolean
}

/**
 * `eslint-plugin-jsonc` and overrides configuration options
 * @param {JsoncOptions & OverridesOptions} options
 *  eslint jsonc configuration options for json, jsonc, json5
 * @returns {Promise<Linter.FlatConfig[]>}
 *  eslint flat configurations with `eslint-plugin-jsonc` and overrides
 */
export async function jsonc(
  options: JsoncOptions & OverridesOptions<JsoncRules> = {}
): Promise<Linter.FlatConfig[]> {
  const { rules: overrideRules = {} } = options

  const kinds = [
    options.json ? 'json' : '',
    options.jsonc ? 'jsonc' : '',
    options.json5 ? 'json5' : ''
  ]
  const usePrettier = !!options.prettier
  const jsonc = await loadPlugin<typeof import('eslint-plugin-jsonc')>('eslint-plugin-jsonc')

  const configs: Linter.FlatConfig[] = []

  for (const kind of kinds) {
    if (kind) {
      configs.push(
        ...jsonc.configs[
          `flat/recommended-with-${kind}` as `flat/recommended-with-${'json' | 'jsonc' | 'json5'}`
        ].map((config, index) => {
          // @ts-expect-error -- ignore
          return config.name
            ? config
            : {
                name: `jsonc/flat/recommended-with-${kind}/${index}`,
                ...config
              }
        })
      )
    }
  }

  if (usePrettier) {
    configs.push(
      ...jsonc.configs['flat/prettier'].map((config, index) => {
        // @ts-expect-error -- ignore
        return config.name
          ? config
          : {
              name: `jsonc/flat/prettier/${index}`,
              ...config
            }
      })
    )
  }

  // overrides
  const overriddenConfig: Linter.FlatConfig = {
    name: '@kazupon/jsonc',
    files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
    rules: {
      ...overrideRules
    }
  }

  // for sort
  configs.push(...jsoncSort(), overriddenConfig)

  return configs
}

/**
 * jsonc sort configurations
 * @returns {Linter.FlatConfig[]} jsonc sort configurations
 */
function jsoncSort(): Linter.FlatConfig[] {
  return [
    {
      name: '@kazupon/jsonc/sort/package.json',
      files: ['**/package.json'],
      rules: {
        'jsonc/sort-array-values': [
          'error',
          {
            order: { type: 'asc' },
            pathPattern: '^files$'
          }
        ],
        'jsonc/sort-keys': [
          'error',
          {
            order: [
              'name',
              'description',
              'private',
              'version',
              'author',
              'contributors',
              'license',
              'funding',
              'bugs',
              'repository',
              'keywords',
              'homepage',
              'publishConfig',
              'packageManager',
              'engines',
              'os',
              'cpu',
              'type',
              'sideEffects',
              'bin',
              'files',
              'main',
              'module',
              'browser',
              'unpkg',
              'jsdelivr',
              'directories',
              'exports',
              'types',
              'typesVersions',
              'scripts',
              'dependencies',
              'peerDependencies',
              'peerDependenciesMeta',
              'optionalDependencies',
              'devDependencies',
              'pnpm',
              'overrides',
              'resolutions',
              'workspaces',
              'prettier',
              'buildOptions',
              'lint-staged'
            ],
            pathPattern: '^$'
          },
          {
            order: { type: 'asc' },
            pathPattern: '^scripts$'
          },
          {
            order: { type: 'asc' },
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$'
          },
          {
            order: { type: 'asc' },
            pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$'
          }
        ]
      }
    }
  ]
}
