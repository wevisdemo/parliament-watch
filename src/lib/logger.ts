import { browser } from '$app/environment';
import pino from 'pino';

enum LogTarget {
	Stdout = 'stdout',
	File = 'file'
}

const LOG_FILE = 'log.json';

export const logger = pino({
	transport: {
		targets: getSelectedTransport()
	}
});

function getSelectedTransport(): pino.TransportTargetOptions[] {
	if (browser) return [];

	if (import.meta.env.DEV || process.env.LOG_TARGET === LogTarget.Stdout) {
		return [
			{
				target: 'pino-pretty',
				options: {
					colorize: true
				}
			}
		];
	}

	if (process.env.LOG_TARGET === LogTarget.File) {
		return [
			{
				target: 'pino/file',
				options: { destination: LOG_FILE, append: false }
			}
		];
	}

	return [];
}
