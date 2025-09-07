module.exports = {
  ...require('./packages/config/eslint'),
  overrides: [
    {
      files: ['apps/backend/**/*.ts'],
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'prettier'
      ],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off'
      }
    },
    {
      files: ['apps/frontend/**/*.{ts,tsx}'],
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier'
      ]
    }
  ]
};
