module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    es2020: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
};
