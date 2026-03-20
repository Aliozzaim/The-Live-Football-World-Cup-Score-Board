module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended', // core ESLint recommended rules
    'plugin:@typescript-eslint/recommended', // recommended TS rules
    'plugin:prettier/recommended', // integrates Prettier formatting rules
  ],
  rules: {
    'prettier/prettier': ['error'],

    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // ignore unused args starting with _
    '@typescript-eslint/no-explicit-any': 'warn', // warn for 'any' type
    '@typescript-eslint/explicit-function-return-type': 'off', // don't require return types everywhere
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // optional boundary return types
    '@typescript-eslint/consistent-type-imports': 'error', // enforce `import type` where possible

    // General JS rules
    'no-console': 'off', // allow console logs
    'prefer-const': 'error', // use const whenever possible
    eqeqeq: ['error', 'always'], // enforce === and !==
    'no-var': 'error', // disallow var
  },
};
