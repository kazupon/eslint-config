import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { loadPlugin } from './utils.ts'

afterEach(() => {
  vi.clearAllMocks()
})

describe('loadPlugin', () => {
  beforeEach(() => {
    // suppress console.error
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('success', async () => {
    const plugin = await loadPlugin('typescript-eslint')
    expect(plugin).toBeDefined()
  })

  test('failure', async () => {
    await expect(loadPlugin('foo')).rejects.toThrow(
      /Failed to load eslint plugin 'foo'. Please install it!/
    )
  })
})
