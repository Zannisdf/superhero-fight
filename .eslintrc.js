module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {},
};
