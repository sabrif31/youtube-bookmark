module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "airbnb",
    "prettier"
  ],
  parserOptions: {
    ecmaFeatures: {
        jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
      'react',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    },
  ],
  rules: {
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'eslint-plugin-jsx-a11y': 'off',
    'react/jsx-props-no-spreading': 0,
    'react/react-in-jsx-scope': "off",
    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1,
    'react/prop-types': 0,
    'no-unused-vars': 0,
    'no-plusplus': 0
  },
}
