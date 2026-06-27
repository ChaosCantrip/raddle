import raddleConfigPlugin from "./raddle-plugin.mjs";

export const base = [ 
  {
    files: ["**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}"],
    plugins: {
      raddleConfig: raddleConfigPlugin
    },
    rules: {
      "brace-style": ["warn", "allman"],
      "quotes": ["warn", "double"],
      "indent": ["warn", 4, { "SwitchCase": 1 }],
      "eol-last": ["warn", "always"],
      "raddleConfig/import-order": "warn"
    }
  },
  {
    files: ["**/*.{mjs,mts}"],
    rules: {
      "indent": ["warn", 2, { "SwitchCase": 1 }]
    }
  }
]
