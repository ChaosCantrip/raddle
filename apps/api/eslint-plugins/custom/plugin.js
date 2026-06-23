import noDeepImportsRule from "./no-deep-imports.js";

const plugin = {
    meta: {
        name: "raddle-api-eslint-plugin",
        version: "1.0.0",
        namespace: "raddle-api-eslint-plugin"
    },
    rules: {
        "no-deep-imports": noDeepImportsRule
    }
}

export default plugin;
