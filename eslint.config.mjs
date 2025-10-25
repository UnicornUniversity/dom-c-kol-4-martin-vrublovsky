import prettier from "eslint-plugin-prettier";
import globals from "globals";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  js.configs.recommended,
  jsdoc.configs['flat/recommended'],
  {
    plugins: {
      prettier,
	   jsdoc
    },

    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...globals.jest,
      },

      ecmaVersion: 2023,
      sourceType: "module",
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
	  "complexity": ["error", 20],
	  "complexity": ["warn", 12],
	  "max-lines-per-function": ["warn", 50],
	  "max-depth": ["error", 4],
	  "jsdoc/require-description": "error",
      "jsdoc/check-values": "error",
	  
      
      "prettier/prettier": "off",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
    },
  },
];
