module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: [
    // 'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    '@vue/airbnb',
    'plugin:json/recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/require-prop-types': 0,
  },
  settings: {
    'json/sort-package-json': 'standard',
    'json/ignore-files': ['**/package-lock.json'],
    'json/json-with-comments-files': ['**/tsconfig.json', '.vscode/**'],
  },
};
