import { building } from '$app/environment';
import { PAGE_CACHE_CONTROL } from '$lib/cache-control';
import { graphql } from '$lib/politigraph/client';

export async function load({ setHeaders }) {
	if (!building) {
		setHeaders({ 'cache-control': PAGE_CACHE_CONTROL });
	}

	const { lastUpdatedAt } = await graphql.query({ lastUpdatedAt: true });

	return { lastUpdatedAt: lastUpdatedAt ?? null };
}
