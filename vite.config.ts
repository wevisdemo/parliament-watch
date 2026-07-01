import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	optimizeDeps: {
		exclude: ['carbon-components-svelte', 'carbon-icons-svelte']
	},
	ssr: {
		noExternal: ['carbon-components-svelte', 'carbon-icons-svelte']
	},
	css: {
		preprocessorOptions: {
			scss: {
				loadPaths: ['src']
			}
		}
	}
});
