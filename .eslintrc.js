module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    "plugin:prettier/recommended"
  ],
  globals: {
    DESCRIPT: false
  },
  rules: {
    "indent": 0,
    "no-multi-spaces": 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'quotes': 'off',
    'comma-dangle': 'off',
    'no-multiple-empty-lines': 'off',
    "eqeqeq": 'off',
    "no-eval": 'off',
    "prettier/prettier":"error",
    "no-unused-vars":'off',
    "no-new":"off",
    "handle-callback-err": "off",
    "camelcase":"off",
    "prefer-const":"off",
    "no-new-func":"off",
    "no-undef":"off"
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
