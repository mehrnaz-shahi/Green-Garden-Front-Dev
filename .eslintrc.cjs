module.exports = {
  root: true,
  extends: ["react-app"],
  parser: require.resolve("./eslint-parser-shim.cjs"),
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
};
