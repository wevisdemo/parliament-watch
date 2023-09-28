import { defineConfig } from 'histoire';
import { HstSvelte } from '@histoire/plugin-svelte';

export default defineConfig({
	plugins: [HstSvelte()],
	outDir: 'build/stories',
	vite: {
		base: process.env.HISTOIRE_BASE || '/'
	}
});
