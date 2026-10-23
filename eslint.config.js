const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  { ignores: ['.expo/**', 'dist/**'] },
  {
    files: ['scripts/**/*.cjs', 'tests/**/*.cjs'],
    languageOptions: { globals: { require: 'readonly', module: 'readonly', __dirname: 'readonly', process: 'readonly', setTimeout: 'readonly' } },
  },
]);
