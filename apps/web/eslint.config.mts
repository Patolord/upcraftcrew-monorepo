import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  ...(pluginReact.configs.flat?.recommended ? [pluginReact.configs.flat.recommended] : []),
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Disable react-in-jsx-scope rule for React 17+ new JSX transform
      "react/react-in-jsx-scope": "off",
      // Disable unescaped entities rule
      "react/no-unescaped-entities": "off",
    },
  },
]);
