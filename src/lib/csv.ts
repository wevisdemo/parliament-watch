import { csvFormat } from 'd3-dsv';

export const createCsvFileResponse = (...csvFormatParams: Parameters<typeof csvFormat>) =>
	new Response(csvFormat(...csvFormatParams), {
		headers: {
			'Content-Type': 'text/csv'
		}
	});
