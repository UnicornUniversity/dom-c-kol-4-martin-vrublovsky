import prettier from "eslint-plugin-prettier";
import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...globals.jest,
      },

      ecmaVersion: 2023,
      sourceType: "commonjs",
    },

    rules: {
      "no-const-assign": "warn",
      "no-this-before-super": "warn",
      "no-undef": "warn",
      "no-unreachable": "warn",

      "no-unused-vars": [
        "warn",
        {
          args: "none",
          ignoreRestSiblings: true,
        },
      ],

      "no-use-before-define": [
        "warn",
        {
          functions: false,
        },
      ],

      "constructor-super": "warn",
      "valid-typeof": "warn",
      "no-console": "off",
      
      "prettier/prettier": "warn",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
    },
  },
];
