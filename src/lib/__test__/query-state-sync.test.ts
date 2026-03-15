import { createDebouncedSync } from '../query-state-sync';
import { describe, expect, it, vi } from 'vitest';

describe('query-state-sync debounce helper', () => {
	it('runs sync only after delay while typing', () => {
		vi.useFakeTimers();
		const sync = vi.fn();
		const debounced = createDebouncedSync(sync, 300);

		debounced.schedule();
		vi.advanceTimersByTime(200);
		debounced.schedule();
		vi.advanceTimersByTime(299);
		expect(sync).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(sync).toHaveBeenCalledTimes(1);
		vi.useRealTimers();
	});

	it('flushes pending schedule immediately', () => {
		vi.useFakeTimers();
		const sync = vi.fn();
		const debounced = createDebouncedSync(sync, 300);

		debounced.schedule();
		vi.advanceTimersByTime(100);
		debounced.flush();

		expect(sync).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(300);
		expect(sync).toHaveBeenCalledTimes(1);
		vi.useRealTimers();
	});

	it('cancels pending sync', () => {
		vi.useFakeTimers();
		const sync = vi.fn();
		const debounced = createDebouncedSync(sync, 300);

		debounced.schedule();
		debounced.cancel();
		vi.advanceTimersByTime(500);

		expect(sync).not.toHaveBeenCalled();
		vi.useRealTimers();
	});
});
