import { HstSvelte } from '@histoire/plugin-svelte';
import { defineConfig } from 'histoire';

export default defineConfig({
	plugins: [HstSvelte()],
	setupFile: '/src/histoire.setup.ts',
	outDir: 'build/stories',
	vite: {
		base: process.env.HISTOIRE_BASE || '/',
		publicDir: 'static'
	}
});
