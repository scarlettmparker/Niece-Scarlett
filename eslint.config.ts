import tseslint from "typescript-eslint";

const config = [
  ...tseslint.configs.recommended,

  {
    ignores: ["dist/", "node_modules/"],
  },

  {
    files: [
      "src/**/*.ts",
      "tests/**/*.ts",
      "config.ts",
      "server.ts",
      "codegen.ts",
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];

export default config;
