module.exports = {
    root: true,
    env: {
        node: true,
        browser: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        "plugin:vue/vue3-recommended",
        "plugin:prettier/recommended"
    ],
    plugins: ['@typescript-eslint'],
    parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 6,
        requireConfigFile: false
    },
    rules: {
        "vue/no-multiple-template-root": "off"
    }
};