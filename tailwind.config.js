import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	corePlugins: {
		preflight: false
	},
	theme: {
		fontFamily: {
			serif: ['Kondolar Thai', ...defaultTheme.fontFamily.serif],
			sans: ['IBM Plex Sans Thai Looped', ...defaultTheme.fontFamily.sans]
		},
		extend: {}
	},
	plugins: []
};
