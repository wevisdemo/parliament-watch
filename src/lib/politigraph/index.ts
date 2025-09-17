import { createClient } from './genql';

export const graphql = createClient({
	url: import.meta.env.POLITIGRAPH_GRAPHQL_URL || 'https://politigraph.wevis.info/graphql',
	batch: {
		maxBatchSize: 10,
		batchInterval: 200
	}
});
