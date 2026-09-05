const shim = require("./eslint-parser-shim.cjs");

module.exports = [
  {
    ignores: ["node_modules/**", "build/**", "src/templates/**"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parser: shim,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [require.resolve("babel-preset-react-app/prod")],
        },
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    rules: {},
  },
];
