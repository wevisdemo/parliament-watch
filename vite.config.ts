/// <reference types="vitest/config" />
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	test: {
		// e2e tests run separately via vitest.e2e.config.ts (pnpm run test:e2e)
		include: ['tests/lib/**/*.test.ts']
	},
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
