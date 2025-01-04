// @ts-check

import { FlatCompat } from '@eslint/eslintrc';
import perfectionist from 'eslint-plugin-perfectionist';
import tailwind from 'eslint-plugin-tailwindcss';
import { dirname as pathDirname } from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = pathDirname(filename);

const compat = new FlatCompat({
  baseDirectory: dirname,
});

const eslintConfig = [
  ...tseslint.config({
    rules: {
      '@typescript-eslint/consistent-generic-constructors': 'warn',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          format: ['PascalCase'],
          selector: ['class', 'interface', 'typeAlias', 'enum'],
        },
        {
          format: ['camelCase'],
          selector: ['function'],
        },
        {
          format: ['camelCase', 'PascalCase'],
          modifiers: ['exported'],
          selector: ['function'],
        },
        {
          format: ['camelCase', 'UPPER_CASE'],
          selector: ['method'],
        },
        {
          format: ['UPPER_CASE'],
          selector: ['method', 'enumMember'],
        },
        {
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
          selector: 'variable',
        },
        {
          format: ['camelCase'],
          leadingUnderscore: 'allowSingleOrDouble',
          selector: 'parameter',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
    },
  }),
  perfectionist.configs['recommended-alphabetical'],
  ...tailwind.configs['flat/recommended'],
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'import/no-anonymous-default-export': 'off',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              from: './src/lib/ui',
              message:
                'API module should not import from UI. Instead move to shared folder.',
              target: ['./src/lib/api', './src/app/api'],
            },
            {
              from: './src/lib/api',
              message:
                'UI module should not import from API. Instead move to shared folder.',
              target: ['./src/lib/ui', './src/app/(?!api)'],
            },
            {
              from: ['./src/lib/ui', './src/lib/api'],
              message:
                'Shared module should not import from UI or API. Instead move to shared folder.',
              target: './src/lib/shared',
            },
          ],
        },
      ],
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      'no-unused-vars': 'off',
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', next: 'return', prev: '*' },
        { blankLine: 'always', next: 'export', prev: '*' },
        { blankLine: 'always', next: 'if', prev: '*' },
        { blankLine: 'always', next: '*', prev: 'if' },
        {
          blankLine: 'any',
          next: ['if', 'try'],
          prev: ['singleline-let', 'singleline-const', 'if', 'try'],
        },
      ],
      'perfectionist/sort-decorators': 'off',
      'perfectionist/sort-modules': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];

export default eslintConfig;
