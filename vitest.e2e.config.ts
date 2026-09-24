import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/e2e/**/*.test.ts'],
		testTimeout: 70_000,
		hookTimeout: 60_000,
		retry: 2
	}
});
