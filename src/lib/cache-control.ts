/**
 * Shared cache-control policies for SSR responses. The app has no CDN in
 * front by default, but these let any reverse proxy or future CDN absorb
 * traffic spikes without app changes.
 */

/** Pages and file endpoints: always revalidate at the browser, cacheable by proxies. */
export const PAGE_CACHE_CONTROL = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600';

/** Search indexes run the heaviest queries; allow short browser caching too. */
export const SEARCH_INDEX_CACHE_CONTROL = 'public, max-age=300, s-maxage=900';
