module.exports = {
  env: { browser: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  rules: {
    'react/prop-types': 'off',         // "We'll fix this when we add TypeScript"
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off',
    'no-console': 'off',               // Console.logs everywhere
    'react/display-name': 'off',
  },
  settings: { react: { version: 'detect' } },
};
