import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import { loadPlugin } from './utils'

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

  test('failure', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(loadPlugin('foo')).rejects.toThrow(
      /Failed to load eslint plugin 'foo'. Please install it!/
    )
  })
})
