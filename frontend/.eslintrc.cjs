module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh"],
	rules: {
		"react-refresh/only-export-components": [
			"warn",
			{ allowConstantExport: true },
		],
		//problems
		"array-callback-return": "error",
		"no-duplicate-imports": "error",
		//formatting
		quotes: ["error", "double", { allowTemplateLiterals: true }],
		"jsx-quotes": ["error", "prefer-double"],
		"comma-dangle": [
			"warn",
			{
				arrays: "always-multiline",
				objects: "always-multiline",
				functions: "only-multiline",
				imports: "only-multiline",
				exports: "only-multiline",
			},
		],
		"comma-spacing": ["warn", { before: false, after: true }],
		"func-call-spacing": ["error", "never"],
		indent: ["warn", "tab", { SwitchCase: 1 }],
		"key-spacing": ["warn", { beforeColon: false }],
		"keyword-spacing": ["warn"],
		semi: ["error"],
		"space-before-function-paren": [
			"error",
			{ anonymous: "always", named: "never", asyncArrow: "always" },
		],
		//plugins
		"react/react-in-jsx-scope": "off",
		"react/display-name": "off",
		"react-hooks/exhaustive-deps": "warn",
		"react-hooks/rules-of-hooks": "error",
		"@typescript-eslint/no-unused-vars": "warn",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
	},
};
