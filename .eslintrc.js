/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:perfectionist/recommended-alphabetical-legacy',
    'plugin:tailwindcss/recommended',
  ],
  plugins: [
    'no-relative-import-paths',
    '@stylistic/js',
    'react-hooks',
    '@tanstack/query',
    '@typescript-eslint',
  ],
  rules: {
    '@stylistic/js/padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: 'if', next: '*' },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'class',
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'method',
        format: ['camelCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
    ],
    '@typescript-eslint/ban-ts-comment': ['warn'],
    '@typescript-eslint/explicit-function-return-type': ['warn'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/typedef': ['warn'],
    '@typescript-eslint/typedef': [
      'warn',
      {
        arrowParameter: true,
        memberVariableDeclaration: true,
        parameter: true,
        propertyDeclaration: true,
      },
    ],
    'no-anonymous-default-export': ['off'],
    'no-console': ['warn'],
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      {
        allowSameFolder: false,
        prefix: '@',
        rootDir: 'src',
      },
    ],
    semi: ['warn', 'always'],
    'import/no-anonymous-default-export': ['off'],
    'react-hooks/exhaustive-deps': ['off'],
  },
};
