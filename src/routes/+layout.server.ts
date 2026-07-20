import { building } from '$app/environment';
import { PAGE_CACHE_CONTROL } from '$lib/cache-control';

export function load({ setHeaders }) {
	if (!building) {
		setHeaders({ 'cache-control': PAGE_CACHE_CONTROL });
	}
}
