/* eslint-disable prettier/prettier */
module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        }
    },
    settings: {
        react: {
            version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    extends: [
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    rules: {
        'prettier/prettier': [
            'warn',
            {
                semi: false,
                trailingComma: 'none',
                singleQuote: true,
                printWidth: 120,
                tabWidth: 4,
                arrowPerins: 'always',
                endOfLine: 'auto'
            }
        ],
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        '@typescript-eslint/explicit-function-return-type': 'off',
        'prefer-const': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        "@typescript-eslint/no-this-alias": [
            "error",
            {
                allowDestructuring: true, // Allow `const { props, state } = this`; false by default
                allowedNames: ["self"], // Allow `const self = this`; `[]` by default
            },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off'
    }
}
