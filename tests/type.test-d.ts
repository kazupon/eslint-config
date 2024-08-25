import { expectTypeOf, test } from 'vitest'

test('check vitest linting types', () => {
  expectTypeOf<number>().toEqualTypeOf<number>()
})
