# @kazupon/eslint-config

[![npm version][npm-version-src]][npm-version-href]
[![CI][ci-src]][ci-href]

ESLint config for @kazupon

## 🌟 Features

- Flat configuration via [vite](https://vitejs.dev/config/) flavor `defineConfig`
- Support [built-in configurations](#built-in-configurations)
  - `javascript`
  - `comments`
  - `typescript`
  - `jsdoc`
  - `regexp`
  - `promise`
  - `unicorn`
  - `prettier`
  - `jsonc`
  - `vue`,
  - `yml`
  - `toml`
- Support primitive eslint flat configuration
- Support overrides for built-in configurations
  - `rules`

## 💿 Installation

```sh
npm i -D @kazupon/eslint-config
```

## 🚀 Usage

### Configurations

Add create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import { defineConfig, javascript } from '@kazupon/eslint-config'

// You can put flat configurations (`Linter.Config | Linter.Config[]`)
export default defineConfig(
  // built-in configurations
  javascript({
    // override rules
    rules: {
      'no-console': 'error'
    }
  }),
  // You can put primitive flat configuration, and override it!
  {
    ignores: ['**/dist/**' /* something ignores ... */]
  }
)
```

> [!IMPORTANT]
> Support flat configuration only, **not supported Legacy style (`.eslintrc`)**

### Lint with npm scripts `package.json`

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Lint with VS Code `settings.json`

You can lint and auto fix.

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  // Enable eslint for supported languages
  "eslint.validate": ["javascript", "typescript", "json", "jsonc", "json5", "vue", "yaml", "toml"],
  // Enable flat configuration
  "eslint.useFlatConfig": true
}
```

## 🔨Built-in configurations

The following built-in configurations are supported:

| Configuration | Powered by eslint plugin or package                                                                                                | Need to install eslint plugin or package? |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `javascript`  | [`@eslint/js`](https://www.npmjs.com/package/@eslint/js)                                                                           | no (built-in)                             |
| `comments`    | [`@eslint-community/eslint-plugin-eslint-comments`](https://www.npmjs.com/package/@eslint-community/eslint-plugin-eslint-comments) | no (built-in)                             |
| `typescript`  | [`typescript-eslint`](https://www.npmjs.com/package/typescript-eslint)                                                             | yes                                       |
| `jsdoc`       | [`eslint-plugin-jsdoc`](https://www.npmjs.com/package/eslint-plugin-jsdoc)                                                         | yes                                       |
| `regexp`      | [`eslint-plugin-regexp`](https://www.npmjs.com/package/eslint-plugin-regexp)                                                       | yes                                       |
| `promise`     | [`eslint-plugin-promise`](https://www.npmjs.com/package/eslint-plugin-promise)                                                     | yes                                       |
| `unicorn`     | [`eslint-plugin-unicorn`](https://www.npmjs.com/package/eslint-plugin-unicorn)                                                     | yes                                       |
| `prettier`    | [`eslint-config-prettier`](https://www.npmjs.com/package/eslint-config-prettier)                                                   | yes                                       |
| `jsonc`       | [`eslint-plugin-jsonc`](https://www.npmjs.com/package/eslint-plugin-jsonc)                                                         | yes                                       |
| `vue`         | [`eslint-plugin-vue`](https://www.npmjs.com/package/eslint-plugin-vue)                                                             | yes                                       |
| `yml`         | [`eslint-plugin-yml`](https://www.npmjs.com/package/eslint-plugin-yml)                                                             | yes                                       |
| `toml`        | [`eslint-plugin-toml`](https://www.npmjs.com/package/eslint-plugin-toml)                                                           | yes                                       |

You can use `import` syntax:

```js
import { defineConfig, javascript, typescript } from '@kazupon/eslint-config'

export default defineConfig(
  javascript(/* ... */),
  typescript(/* ... */)
  // ...
)
```

## ⚖️ Comparing to [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) and others

- Respect the recommended config by the eslint plugin in built-in configurations
- Customization is overriding it only

## 💖 Credit

This eslint config is inspired by:

- [`@antfu/eslint-config`](https://github.com/antfu/eslint-config), created by [Anthony Fu](https://github.com/antfu)
- [`@sxzz/eslint-config`](https://github.com/sxzz/eslint-config), created by [Kevin Deng 三咲智子](https://github.com/sxzz)
- [Vite](https://github.com/vitejs/vite), created by [Evan You](https://github.com/yyx990803) and Vite community

Thank you! ❤️

## ©️ License

[MIT](http://opensource.org/licenses/MIT)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@kazupon/eslint-config?style=flat
[npm-version-href]: https://npmjs.com/package/@kazupon/eslint-config
[npm-downloads-src]: https://img.shields.io/npm/dm/@kazupon/eslint-config?style=flat
[npm-downloads-href]: https://npmjs.com/package/@kazupon/eslint-config
[ci-src]: https://github.com/kazupon/eslint-config/actions/workflows/ci.yml/badge.svg
[ci-href]: https://github.com/kazupon/eslint-config/actions/workflows/ci.yml
