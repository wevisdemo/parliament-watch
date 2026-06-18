import svelteConfig from './svelte.config.js';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '*.svelte', '**/*.svelte.js', '**/*.svelte.ts'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: ts.parser,
				project: './tsconfig.json',
				extraFileExtensions: ['.svelte'],
				svelteConfig
			}
		}
	},
	{
		files: ['*story.svelte'],
		rules: {
			'no-import-assign': 'off'
		}
	},
	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'node_modules/**',
			'src/lib/politigraph/genql/**',
			'static/**',
			'storybook-static/**',
			'vite-profile-*.cpuprofile'
		]
	},
	{
		rules: {
			'svelte/require-each-key': 'warn',
			'@typescript-eslint/no-shadow': 'warn',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/no-useless-mustaches': 'off',
			'svelte/prefer-svelte-reactivity': 'off'
		}
	}
);
