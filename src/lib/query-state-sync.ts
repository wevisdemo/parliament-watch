export interface DebouncedSync {
	schedule: () => void;
	flush: () => void;
	cancel: () => void;
}

export function createDebouncedSync(sync: () => void, delayMs: number): DebouncedSync {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const cancel = () => {
		if (timer) {
			clearTimeout(timer);
			timer = undefined;
		}
	};

	return {
		schedule: () => {
			cancel();
			timer = setTimeout(() => {
				timer = undefined;
				sync();
			}, delayMs);
		},
		flush: () => {
			cancel();
			sync();
		},
		cancel
	};
}
