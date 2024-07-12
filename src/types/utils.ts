// TODO: move to `@kazupon/utils`
export type Awaitable<T> = T | Promise<T>

// TODO: move to `@kazupon/utils`
export type InteropModuleDefault<T> = T extends { default: infer U } ? U : T
