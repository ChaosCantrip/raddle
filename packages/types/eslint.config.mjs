import { defineConfig } from "eslint/config";

import { baseESLintConfig } from "@raddle/config/eslint";

const eslintConfig = defineConfig([
  ...baseESLintConfig
]);

export default eslintConfig;
