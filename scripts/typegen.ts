import { interopDefault } from '@kazupon/jts-utils/module'
import { pascalize } from '@kazupon/jts-utils/string'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { URL } from 'node:url'

import type { Linter } from 'eslint'
import type { PresetModule } from './types.ts'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

async function loadPresets() {
  const files = await fs.readdir(path.resolve(__dirname, '../src/configs'))
  return files
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => file.replace(/\.ts$/, ''))
}

function javascript(): Promise<PresetModule> {
  return {
    // @ts-expect-error -- FIXME: `eslint/use-at-your-own-risk` is not yet type definitions exporting
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

function markdown(): Promise<PresetModule> {
  return {
    // @ts-expect-error -- FIXME: `@eslint/markdown` is not yet type definitions exporting
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

function css(): Promise<PresetModule> {
  return {
    // @ts-expect-error -- FIXME: `@eslint/css` is not yet type definitions exporting
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

function react(): Promise<PresetModule> {
  return {
    // @ts-expect-error -- FIXME: `eslint-plugin-react` is not yet type definitions exporting
    react: async (): Promise<Linter.Config[]> => {
      const module_ = await import(path.resolve(__dirname, `../src/configs/react`))
      return module_['react']({ refresh: true })
    }
  }
}

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

async function main() {
  const presets = await loadPresets()

  // typegen for presets
  const parameters = {
    // for comments
    directives: {},
    // for jsonc
    json: true,
    json5: true,
    jsonc: true,
    // for vue
    composable: true,
    scopedCss: true,
    a11y: true,
    i18n: {},
    // for module-interop
    interop: true
  }
  for (const preset of presets) {
    console.log(`Generating types for ${preset} ...`)
    const module_ = await resolvePresetModule(preset)
    // eslint-disable-next-line unicorn/no-await-expression-member -- NOTE(kazupon): `interopDefault` is used to resolve the default export of the module
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

// eslint-disable-next-line unicorn/prefer-top-level-await -- NOTE(kazupon): run typegen as a script
main().catch(error => {
  console.error(error)
  // eslint-disable-next-line unicorn/no-process-exit -- NOTE(kazupon): exit with error code
  process.exit(1)
})
