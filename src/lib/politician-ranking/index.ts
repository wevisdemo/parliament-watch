import type StatCard from '$components/Index/StatCard.svelte';
import type { ComponentProps } from 'svelte';

export const OUT_FILE = 'politician-ranking.json';
export const GITHUB_PAGE_URL = 'https://wevisdemo.github.io/parliament-watch/';

export interface ExternalPoliticianRanking {
	politicianWithMostWikipediaVisit: Omit<ComponentProps<StatCard>, 'reason'>;
	politicianWithMostGun: Omit<ComponentProps<StatCard>, 'reason'>;
	updatedAt: Date;
}

export async function fetchExternalPoliticianRanking() {
	const res = await fetch(GITHUB_PAGE_URL + OUT_FILE);

	if (!res.ok) throw res.statusText;

	return res.json() as Promise<ExternalPoliticianRanking>;
}
