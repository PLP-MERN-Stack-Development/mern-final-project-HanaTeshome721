module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'import/order': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
