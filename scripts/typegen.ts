import fs from 'node:fs/promises'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import path from 'node:path'
import { URL } from 'node:url'
import { pascalize, interopDefault } from '../src/utils'

import type { Linter } from 'eslint'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

/**
 * @returns {Promise<string[]>} loaded presets
 */
async function loadPresets() {
  const files = await fs.readdir(path.resolve(__dirname, '../src/configs'))
  return files
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => file.replace(/\.ts$/, ''))
}

/**
 * resolve preset module
 * @param {string} preset a preset
 * @returns {Promise<Linter.FlatConfig[]>} resolved preset module
 */
async function resolvePresetModule(
  preset: string
): Promise<{ [key: string]: (...parameters: unknown[]) => Promise<Linter.FlatConfig[]> }> {
  if (preset === 'javascript') {
    const { builtinRules } = await interopDefault(await import('eslint/use-at-your-own-risk'))
    return {
      javascript: (): Promise<Linter.FlatConfig[]> => {
        const configs = {
          plugins: {
            '': {
              rules: Object.fromEntries(builtinRules.entries())
            }
          }
        }
        return Promise.resolve([configs])
      }
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await import(path.resolve(__dirname, `../src/configs/${preset}`))
  }
}

/**
 *
 */
async function main() {
  const presets = await loadPresets()

  // typegen for presets
  const parameters = {
    // for jsonc
    json: true,
    json5: true,
    jsonc: true
  }
  for (const preset of presets) {
    console.log(`Generating types for ${preset} ...`)
    const module_ = await resolvePresetModule(preset)
    // eslint-disable-next-line unicorn/no-await-expression-member
    const resolvedModule = (await interopDefault(module_))[preset]
    const configs = await resolvedModule(parameters)
    const dts = await flatConfigsToRulesDTS(configs, {
      includeAugmentation: false,
      exportTypeName: `${pascalize(preset)}Rules`
    })
    await fs.writeFile(path.resolve(__dirname, `../src/types/gens/${preset}.ts`), dts)
  }

  // typegen for eslint `RulesRecord`
  const eslintDts = [
    ...presets.map(p => `import type { ${`${pascalize(p)}Rules`} } from './${p}'`),
    ``,
    `declare module 'eslint' {`,
    `  namespace Linter {`,
    `    interface RulesRecord extends ${presets.map(p => `${pascalize(p)}Rules`).join(', ')} {}`,
    `  }`,
    `}`
  ]
  await fs.writeFile(path.resolve(__dirname, `../src/types/gens/eslint.ts`), eslintDts.join('\n'))
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(error => {
  console.error(error)
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
})
