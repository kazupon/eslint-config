import { interopDefault } from '@kazupon/jts-utils/module'
import { pascalize } from '@kazupon/jts-utils/string'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { URL } from 'node:url'

import type { Linter } from 'eslint'
import type { PresetModule } from './types.ts'

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
 * @returns {Promise<PresetModule>} javascript preset module
 */
function javascript(): Promise<PresetModule> {
  return {
    // @ts-expect-error -- FIXME
    javascript: async (): Promise<Linter.Config[]> => {
      const { builtinRules } = await interopDefault(await import('eslint/use-at-your-own-risk'))
      const configs = {
        plugins: {
          '': {
            rules: Object.fromEntries(builtinRules.entries())
          }
        }
      }
      return [configs]
    }
  }
}

/**
 * @returns {Promise<PresetModule>} markdown preset module
 */
function markdown(): Promise<PresetModule> {
  return {
    // @ts-expect-error -- FIXME
    markdown: async (): Promise<Linter.Config[]> => {
      const { rules } = await interopDefault(await import('@eslint/markdown'))
      const configs = {
        plugins: {
          markdown: {
            rules
          }
        }
      }
      return [configs]
    }
  }
}

/**
 * @returns {Promise<PresetModule>} css preset module
 */
function css(): Promise<PresetModule> {
  return {
    // @ts-expect-error -- FIXME
    css: async (): Promise<Linter.Config[]> => {
      const { rules } = await interopDefault(await import('@eslint/css'))
      const configs = {
        plugins: {
          css: {
            rules
          }
        }
      }
      return [configs]
    }
  }
}

/**
 * @returns {Promise<PresetModule>} react preset module
 */
function react(): Promise<PresetModule> {
  return {
    // @ts-expect-error -- FIXME
    react: async (): Promise<Linter.Config[]> => {
      const module_ = await import(path.resolve(__dirname, `../src/configs/react`))
      return module_['react']({ refresh: true })
    }
  }
}

/**
 * resolve preset module
 * @param {string} preset a preset
 * @returns {Promise<Linter.Config[]>} resolved preset module
 */
async function resolvePresetModule(preset: string): Promise<PresetModule> {
  switch (preset) {
    case 'javascript': {
      return await javascript()
    }
    case 'markdown': {
      return await markdown()
    }
    case 'css': {
      return await css()
    }
    case 'react': {
      return await react()
    }
    default: {
      return await import(path.resolve(__dirname, `../src/configs/${preset}`))
    }
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
    jsonc: true,
    // for vue
    composable: true,
    scopedCss: true,
    a11y: true
  }
  for (const preset of presets) {
    console.log(`Generating types for ${preset} ...`)
    const module_ = await resolvePresetModule(preset)
    // eslint-disable-next-line unicorn/no-await-expression-member
    const resolvedModule = (await interopDefault(module_))[preset]
    const configs = await resolvedModule(parameters)
    let dts = await flatConfigsToRulesDTS(configs, {
      includeTypeImports: preset !== 'prettier',
      includeAugmentation: false,
      exportTypeName: `${pascalize(preset)}Rules`
    })
    // NOTE: workaround for vitest type gen errors with eslint-typegen
    if (preset === 'vitest') {
      dts = `// @ts-nocheck\n` + dts
    }
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
