import type { StatCardProps } from '$components/Index/StatCard.svelte';

export const OUT_FILE = 'politician-ranking.json';
export const GITHUB_PAGE_URL = 'https://wevisdemo.github.io/parliament-watch/';

export interface ExternalPoliticianRanking {
	politicianWithMostWikipediaVisit: Omit<StatCardProps, 'reason'>;
	updatedAt: Date;
}

export async function fetchExternalPoliticianRanking(): Promise<ExternalPoliticianRanking> {
	const res = await fetch(GITHUB_PAGE_URL + OUT_FILE);

	if (!res.ok) throw new Error(`Failed to fetch ${OUT_FILE}: ${res.status} ${res.statusText}`);

	const { politicianWithMostWikipediaVisit, updatedAt } = (await res.json()) as Omit<
		ExternalPoliticianRanking,
		'updatedAt'
	> & { updatedAt: string };

	const updatedAtDate = new Date(updatedAt);

	if (!politicianWithMostWikipediaVisit || Number.isNaN(updatedAtDate.getTime()))
		throw new Error(`Malformed ${OUT_FILE}`);

	return {
		politicianWithMostWikipediaVisit,
		updatedAt: updatedAtDate
	};
}
