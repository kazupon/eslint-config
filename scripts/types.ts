import type { Linter } from 'eslint'

/**
 * Preset module type definition
 */
export type PresetModule = { [key: string]: (...parameters: unknown[]) => Promise<Linter.Config[]> }
