import * as env from '$env/static/private';
import { createClient } from './genql';

export const graphql = createClient({
	url:
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		env.SERVER_POLITIGRAPH_URL || 'https://politigraph.wevis.info/graphql',
	batch: true
});
