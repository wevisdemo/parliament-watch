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
			entries: [
				'/assemblies/สมาชิกสภาผู้แทนราษฎร-25/votes',
				'/bills',
				'/bills/1',
				'/bills/search',
				'/legislative-process',
				'/politicians/พริษฐ์-วัชรสินธุ/votes',
				'/votings/1'
			]
		}
	}
};

export default config;
