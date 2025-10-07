import { env } from '$env/dynamic/public';
import * as staticEnv from '$env/static/public';
import { createClient } from './genql';

export const graphql = createClient({
	url:
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		staticEnv.PUBLIC_POLITIGRAPH_ENDPOINT ||
		env.PUBLIC_POLITIGRAPH_ENDPOINT ||
		'https://politigraph.wevis.info/graphql',
	batch: {
		maxBatchSize: 10,
		batchInterval: 200
	}
});
