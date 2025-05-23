module.exports = {
  root: true,
  extends: [
    '@react-native',
    'prettier',
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
  plugins: ['prettier'],
}; 