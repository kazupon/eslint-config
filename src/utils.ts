import type { Awaitable, InteropModuleDefault } from './types'

// TODO: move to `@kazupon/utils
/**
 * convert to array
 * @param {T[]} value a value
 * @returns {T[]} convrted array
 */
export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

// TODO: move to `@kazupon/utils
/**
 * pascalize string
 * @param {string} value a string value
 * @returns {string} pascalized string
 */
export function pascalize(value: string): string {
  return value.replaceAll(/\w+/g, function (w) {
    return w[0].toUpperCase() + w.slice(1).toLowerCase()
  })
}

// TODO: move to `@kazupon/utils
/**
 * resolve module with interop default
 * @param {Awaitable<T>} mod a module
 * @returns {Promise<InteropModuleDefault<T>>} resolved module
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export async function interopDefault<T>(mod: Awaitable<T>): Promise<InteropModuleDefault<T>> {
  const resolved = await mod
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return (resolved as any).default || resolved
}

/**
 * load eslint plugin
 * @param {string} name plugin name
 * @returns {Promise<T>} loaded plugin
 */
export async function loadPlugin<T = unknown>(name: string): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, unicorn/prevent-abbreviations
  const mod = await import(name).catch(error => {
    console.error(error)
    throw new Error(`Failed to load eslint plugin '${name}'. Please install it!`)
  })
  return interopDefault(mod) as Promise<T>
}

/**
 * get TypeScript parser
 * @description get the parser, which is `typescript-eslint` parser
 * @returns {Promise<typeof import('typescript-eslint')['parser']>} TypeScript parser
 */
export async function getTypeScriptParser(): Promise<
  (typeof import('typescript-eslint'))['parser']
> {
  const ts = await loadPlugin<typeof import('typescript-eslint')>('typescript-eslint')
  return ts.parser
}
