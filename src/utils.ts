import { interopDefault } from '@kazupon/jts-utils/module'
import { GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX } from './globs.ts'

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

/**
 * get glob source files
 * @param {boolean} useTypeScript use TypeScript, default `false`
 * @returns {string[]} files
 */
export function getGlobSourceFiles(useTypeScript = false): string[] {
  return [GLOB_JS, GLOB_JSX, ...(useTypeScript ? [GLOB_TS, GLOB_TSX] : [])]
}
