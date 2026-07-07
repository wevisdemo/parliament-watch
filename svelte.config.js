import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/components',
			'$components/*': './src/components/*',
			$models: './src/models',
			'$models/*': './src/models/*'
		},
		prerender: {
			handleHttpError: ({ path, status, message, referrer }) => {
				console.error(`[prerender] ${status} ${path}`);
				if (referrer) console.error(`  referrer: ${referrer}`);
				console.error(`  ${message}`);
				throw new Error(`Prerender failed: ${status} ${path} - ${message}`);
			}
		}
	}
};

export default config;
