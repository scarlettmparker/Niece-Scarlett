import tseslint from "typescript-eslint";

const config = [
  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.ts"],
    ignores: ["dist/", "node_modules/"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
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
