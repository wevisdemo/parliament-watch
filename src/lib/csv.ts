import { csvFormat } from 'd3';

export const createCsvFileResponse = (...csvFormatParams: Parameters<typeof csvFormat>) =>
	new Response(csvFormat(...csvFormatParams), {
		headers: {
			'Content-Type': 'text/csv'
		}
	});
