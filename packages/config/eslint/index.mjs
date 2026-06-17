export const baseESLintConfig = [ 
  {
    rules: {
      "brace-style": ["warn", "allman"],
      "quotes": ["warn", "double"],
      "indent": ["warn", 4, { "SwitchCase": 1 }],
      "eol-last": ["warn", "always"]
    }
  },
  {
    files: ["**/*.{mjs,mts}"],
    rules: {
      "indent": ["warn", 2, { "SwitchCase": 1 }]
    }
  }
]