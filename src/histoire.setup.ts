import type { SearchIndexes } from '$models/search';
import { searchIndexes } from './mocks/data/searchIndexes';

import './styles/carbon/pre-compiled.css';
import './styles/index.css';

const SEARCH_INDEXES_PATH = '/files/search-indexes/';

// Intercept fetch to return mock search indexes
const { fetch: origFetch } = window;
window.fetch = async (...args) => {
	if (args[0]?.toString().startsWith(SEARCH_INDEXES_PATH)) {
		const category = args[0]?.toString().replace(SEARCH_INDEXES_PATH, '').replace('.json', '');
		const data = searchIndexes[category as keyof SearchIndexes];

		if (!data) {
			return new Response('[]');
		}

		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	return origFetch(...args);
};
