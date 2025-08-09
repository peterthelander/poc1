import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import unusedImports from 'eslint-plugin-unused-imports';
import ts from 'typescript-eslint';

const compat = new FlatCompat({ baseDirectory: process.cwd() });
const SRC_FILES = ['src/**/*.{ts,tsx,js,jsx}', 'App.tsx'];

export default [
  // Global ignore (applies to everything below)
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**', '.expo/**'],
  },

  // Scope flat-ready configs
  { ...js.configs.recommended, files: SRC_FILES },
  ...ts.configs.recommended.map((c) => ({ ...c, files: SRC_FILES })),

  // Scope legacy shareable configs from compat
  ...compat
    .extends('plugin:react-native/all', 'plugin:import/recommended', 'plugin:import/typescript')
    .map((c) => ({ ...c, files: SRC_FILES })),

  // Your project rules/plugins (also scoped)
  {
    files: SRC_FILES,
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
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
      'prettier/prettier': ['warn'],
    },
  },
];
