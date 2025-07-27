import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Basic rules (Prettier handles most formatting)
    'no-console': 'warn',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],

    // Vue-specific rules
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: { max: 5 } }],
    'vue/html-self-closing': 'off',

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'off'
  }
})
