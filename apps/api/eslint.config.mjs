import { defineConfig } from "eslint/config";

import { baseESLintConfig } from "@raddle/config/eslint";

import raddleApiEslintPlugin from "./eslint-plugins/custom/plugin.js";

const eslintConfig = defineConfig([
  {
    ignores: ["dist/**", "node_modules/**"]
  },
  ...baseESLintConfig,
  {
    files: ["**/*.{js,ts}"],
    plugins: {
      raddleApi: raddleApiEslintPlugin
    },
    rules: {
      "raddleApi/no-deep-imports": "warn"
    }
  },
]);

export default eslintConfig;
