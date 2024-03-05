import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

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
			// TODO: non-released route for internal testing without a public link from any page
			entries: ['/bills', '/bills/1', '/bills/explore', '/legislative-process']
		}
	}
};

export default config;
