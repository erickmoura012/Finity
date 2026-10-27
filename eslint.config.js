import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // a pasta do build não precisa ser verificada
  { ignores: ['dist'] },

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // confere as regras dos hooks (useEffect com as dependências certas etc.)
      reactHooks.configs.flat.recommended
    ],
    languageOptions: {
      globals: globals.browser
    }
  }
]);
