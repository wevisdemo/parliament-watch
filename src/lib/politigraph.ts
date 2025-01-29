import { createClient } from './genql';

export const graphql = createClient({
	url: 'https://politigraph.wevis.info/graphql'
});
