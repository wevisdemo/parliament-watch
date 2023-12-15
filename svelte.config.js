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
			entries: [
				'*',
				'/files/search-indexes/politicians.json',
				'/files/search-indexes/bills.json',
				'/files/search-indexes/votings.json',
				'/files/search-indexes/billProposers.json'
			]
		}
	}
};

export default config;
