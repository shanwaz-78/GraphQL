/* eslint-disable */
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,ts,mjs,cjs,jsx, tsx}"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      quotes: ["warn", "single"],
      semi: ["warn", "always"],
      eqeqeq: ["error", "always"],
      "no-var": "off",
      "no-console": "off",
      indent: ["error", 2],
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
