module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue",
    "plugin:prettier/recommended"
  ],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },

  parserOptions: {
    parser: "babel-eslint"
  }

  // extends: ["eslint:recommended", "plugin:vue/recommended"],
  // parserOptions: {
  //   parser: "babel-eslint"
  // },
  // root: true,
  // env: {
  //   node: true,
  // },
  // rules: {
  //   semi: ["error", "never"]
  // }
};

