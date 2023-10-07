import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	corePlugins: {
		preflight: false
	},
	theme: {
		screens: {
			sm: '576px', // Small screens
			md: '672px', // Medium screens
			lg: '992px', // Large screens
			xl: '1200px', // Extra-large screens
			'2xl': '1400px' // Extra-extra-large screens
		},
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
			'ui-05': '#161616',
			white: '#FFF',
			black: '#000',
			blue: {
				10: '#cbdaff',
				20: '#aac2fe',
				30: '#7b9bee',
				40: '#5075f8',
				50: '#334fe3',
				60: '#3904e9',
				70: '#2e03bd',
				80: '#2600a3',
				90: '#1e027e',
				100: '#16015c'
			},
			'cool-gray': {
				10: '#f2f4f8',
				20: '#dde1e6',
				30: '#c1c7cd',
				40: '#a2a9b0',
				50: '#878d96',
				60: '#697077',
				70: '#4d5358',
				80: '#343a3f',
				90: '#21272a',
				100: '#121619'
			},
			cyan: {
				10: '#e5f6ff',
				20: '#bae6ff',
				30: '#82cfff',
				40: '#33b1ff',
				50: '#1192e8',
				60: '#0072c3',
				70: '#00539a',
				80: '#003a6d',
				90: '#012749',
				100: '#061727'
			},
			gray: {
				10: '#f4f4f4',
				20: '#e0e0e0',
				30: '#c6c6c6',
				40: '#a8a8a8',
				50: '#8d8d8d',
				60: '#6f6f6f',
				70: '#525252',
				80: '#393939',
				90: '#262626',
				100: '#161616'
			},
			green: {
				10: '#defbe6',
				20: '#a7f0ba',
				30: '#6fdc8c',
				40: '#42be65',
				50: '#24a148',
				60: '#198038',
				70: '#0e6027',
				80: '#044317',
				90: '#022d0d',
				100: '#071908'
			},
			magenta: {
				10: '#fff0f7',
				20: '#ffd6e8',
				30: '#ffafd2',
				40: '#ff7eb6',
				50: '#ee5396',
				60: '#d02670',
				70: '#9f1853',
				80: '#740937',
				90: '#510224',
				100: '#2a0a18'
			},
			orange: {
				10: '#fff2e8',
				20: '#ffd9be',
				30: '#ffb784',
				40: '#ff832b',
				50: '#eb6200',
				60: '#ba4e00',
				70: '#8a3800',
				80: '#5e2900',
				90: '#3e1a00',
				100: '#231000'
			},
			purple: {
				10: '#f6f2ff',
				20: '#e8daff',
				30: '#d4bbff',
				40: '#be95ff',
				50: '#a56eff',
				60: '#8a3ffc',
				70: '#6929c4',
				80: '#491d8b',
				90: '#31135e',
				100: '#1c0f30'
			},
			red: {
				10: '#fdece8',
				20: '#ffcdc2',
				30: '#fca08c',
				40: '#ff4d26',
				50: '#e52900',
				60: '#c72502',
				70: '#b12000',
				80: '#981b00',
				90: '#801700',
				100: '#631200'
			},
			teal: {
				10: '#eaf8f8',
				20: '#abf4f4',
				30: '#0ee2e2',
				40: '#00b9c4',
				50: '#00a1ab',
				60: '#00838b',
				70: '#007279',
				80: '#006268',
				90: '#005257',
				100: '#003f43'
			},
			'warm-gray': {
				10: '#f7f3f2',
				20: '#e5e0df',
				30: '#cac5c4',
				40: '#ada8a8',
				50: '#8f8b8b',
				60: '#726e6e',
				70: '#565151',
				80: '#3c3838',
				90: '#272525',
				100: '#171414'
			},
			yellow: {
				10: '#fcf4d6',
				20: '#fddc69',
				30: '#f1c21b',
				40: '#d2a106',
				50: '#b28600',
				60: '#8e6a00',
				70: '#684e00',
				80: '#483700',
				90: '#302400',
				100: '#1c1500'
			}
		},
		extend: {}
	},
	plugins: []
};
