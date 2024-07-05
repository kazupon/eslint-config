# @kazupon/eslint-config

[![CI](https://github.com/kazupon/eslint-config/actions/workflows/ci.yml/badge.svg)](https://github.com/kazupon/eslint-config/actions/workflows/ci.yml)
[![CI](https://github.com/kazupon/eslint-config/actions/workflows/ci.yml/badge.svg)](https://github.com/kazupon/eslint-config/actions/workflows/ci.yml)

ESLint config for @kazupon

## 🌟 Features

- Flat configuration via `defineConfig` like [vite](https://vitejs.dev/config/)
- Support built-in configurations
  - `javascript`
  - `typescript`
  - `prettier`
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

// You can put flat configurations (`Linter.FlatConfig | Linter.FlatConfig[]`)
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
  "eslint.validate": ["javascript", "typescript"],
  // Enable flat configuration
  "eslint.experimental.useFlatConfig": true
}
```

## 🔨Built-in configurations

The following built-in configurations are supported:

| Configuration | Powered by eslint plugin or package                                              | Need to install eslint plugin or package? |
| ------------- | -------------------------------------------------------------------------------- | ----------------------------------------- |
| `javascript`  | [`@eslint/js`](https://www.npmjs.com/package/@eslint/js)                         | no (built-in)                             |
| `typescript`  | [`typescript-eslint`](https://www.npmjs.com/package/typescript-eslint)           | yes                                       |
| `prettier`    | [`eslint-config-prettier`](https://www.npmjs.com/package/eslint-config-prettier) | yes                                       |

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

Thank you! ❤️

## ©️ License

[MIT](http://opensource.org/licenses/MIT)
