import { defineConfig } from "eslint/config";
import { baseESLintConfig } from "./eslint/index.mjs";

const eslintConfig = defineConfig([
  ...baseESLintConfig
]);

export default eslintConfig;
