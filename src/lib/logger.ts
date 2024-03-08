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

	switch (process.env.LOG_TARGET) {
		case LogTarget.Stdout:
			return [
				{
					target: 'pino-pretty',
					options: {
						colorize: true
					}
				}
			];

		case LogTarget.File:
			return [
				{
					target: 'pino/file',
					options: { destination: LOG_FILE, append: false }
				}
			];

		default:
			return [];
	}
}
