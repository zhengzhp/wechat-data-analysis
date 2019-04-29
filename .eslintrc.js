module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["airbnb", "prettier", "plugin:compat/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    it: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["redux-saga", "react", "jsx-a11y"],
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".js"] }],
    "react/jsx-wrap-multilines": 0,
    "react/prop-types": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-one-expression-per-line": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "linebreak-style": 0,
  },
};
