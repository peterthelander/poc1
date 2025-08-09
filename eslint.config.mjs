import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import unusedImports from 'eslint-plugin-unused-imports';
import ts from 'typescript-eslint';

const compat = new FlatCompat({
  // base dir for resolving legacy "extends"
  baseDirectory: process.cwd(),
});

export default [
  { ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', '.expo/'] },

  // Flat-ready configs
  js.configs.recommended,
  ...ts.configs.recommended,

  // Legacy shareable configs, loaded via compat
  ...compat.extends(
    'plugin:react-native/all',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ),

  // Your project rules/plugins (flat format)
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      import: importPlugin,
      prettier,
      'unused-imports': unusedImports,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'off',
      'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
      'prettier/prettier': ['warn'],
      // remove unused imports & relax unused vars (allow _var)
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // keep imports tidy (auto-fixable)
      'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
    },
  },
];
