// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PUBLIC_POLITIGRAPH_ENDPOINT } from '$env/static/public';
import { createClient } from './genql';

export const graphql = createClient({
	url: PUBLIC_POLITIGRAPH_ENDPOINT || 'https://politigraph.wevis.info/graphql',
	batch: {
		maxBatchSize: 10,
		batchInterval: 200
	}
});
