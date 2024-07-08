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
 * resolve module with interop default
 * @param {Awaitable<T>} mod a module
 * @returns {Promise<InteropModuleDefault<T>>} resolved module
 */
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
  try {
    return interopDefault(import(name)) as Promise<T>
  } catch (e) {
    console.error(e)
    throw new Error(`Failed to load eslint plugin '${name}'. Please install it!`)
  }
}
