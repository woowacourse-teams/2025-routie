/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: '.',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', '@emotion'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'plugin:storybook/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // 일반 JS/React 규칙
    'max-params': ['error', 3],
    'arrow-body-style': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/jsx-filename-extension': ['error', { extensions: ['.ts', '.tsx'] }],
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function' },
    ],
    'react/require-default-props': 'off',
    'react/no-unknown-property': ['error', { ignore: ['css'] }],

    // import 정리
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: 'react*',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '{pages/**,layouts/**,components/**,stories/**}',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '{store/**,mocks/**,hooks/**,services/**,utils/**}',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '{types/**,assets/**,styles/**}',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '{./*.module,*.css,*.scss}',
            group: 'sibling',
            position: 'after',
          },
        ],

        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: [],
        alphabetize: { order: 'asc' },
      },
    ],

    // TypeScript 규칙
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Emotion 룰
    '@emotion/import-from-emotion': 'error',
    '@emotion/no-vanilla': 'error',
    
    // test 룰
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.ts', '**/*.test.tsx'],
      },
    ],
  },
  ignorePatterns: ['dist', 'webpack.config.js'],
};
