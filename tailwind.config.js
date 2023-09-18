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
		colors: {
			'ui-background': '#FFFFFF',
			'button-separator': '#E0E0E0',
			'danger-01': '#C72502',
			'danger-02': '#C72502',
			'field-01': '#F4F4F4',
			'field-02': '#FFFFFF',
			'interactive-01': '#3904E9',
			'interactive-02': '#393939',
			'interactive-03': '#3904E9',
			'interactive-04': '#3904E9',
			'icon-01': '#161616',
			'icon-02': '#525252',
			'icon-03': '#FFFFFF',
			'inverse-support-01': '#E52900',
			'inverse-support-02': '#00B9C4',
			'inverse-support-03': '#F1C21B',
			'inverse-support-04': '#334FE3',
			'inverse-01': '#FFFFFF',
			'inverse-02': '#393939',
			'inverse-link': '#5075F8',
			'link-01': '#3904E9',
			'link-02': '#2E03BD',
			'overlay-01': 'rgba(22, 22, 22, 0.5)',
			'support-01': '#C72502',
			'support-02': '#00838B',
			'support-03': '#F1C21B',
			'support-04': '#2E03BD',
			'text-01': '#161616',
			'text-02': '#6F6F6F',
			'text-03': '#A8A8A8',
			'text-04': '#FFFFFF',
			'text-error': '#C72502',
			'decorative-01': '#E0E0E0',
			'ui-01': '#F4F4F4',
			'ui-02': '#FFFFFF',
			'ui-03': '#E0E0E0',
			'ui-04': '#8D8D8D',
			'ui-05': '#161616'
		},
		extend: {
			transitionTimingFunction: {
				'productive-in-out': 'cubic-bezier(0.2, 0.2, 0.38, 0.9)'
			}
		}
	},
	plugins: []
};
