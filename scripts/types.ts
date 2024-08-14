import type { Linter } from 'eslint'
export type PresetModule = { [key: string]: (...parameters: unknown[]) => Promise<Linter.Config[]> }
