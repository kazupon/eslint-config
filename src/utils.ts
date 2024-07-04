import type { Awaitable, InteropModuleDefault } from './types'

// TODO: move to `@kazupon/utils
export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

// TODO: move to `@kazupon/utils
export async function interopDefault<T>(mod: Awaitable<T>): Promise<InteropModuleDefault<T>> {
  const resolved = await mod
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return (resolved as any).default || resolved
}

export async function loadPlugin<T = unknown>(name: string): Promise<T> {
  try {
    return interopDefault(import(name)) as Promise<T>
  } catch (e) {
    console.error(e)
    throw new Error(`Failed to load eslint plugin '${name}'. Please install it!`)
  }
}
