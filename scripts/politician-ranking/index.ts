import type { HighlightedPolitician } from '$components/Index/StatCard.svelte';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getPoliticianWithMostViewLastMonth } from './wikipedia';
import { getPoliticianWithMostGun } from './gun';
import { fetchPoliticians } from '$lib/datasheets';

const OUT_DIR = './out';
const OUT_FILE = 'politician-ranking.json';

export interface RankingFile {
	politicianWithMostWikipediaVisit: Omit<HighlightedPolitician, 'reason'>;
	politicianWithMostGun: Omit<HighlightedPolitician, 'reason'>;
	updatedAt: Date;
}

export async function writePoliticianRankingFile() {
	console.info('Fetching politicians...');
	const activePoliticians = (await fetchPoliticians()).filter(({ isActive }) => isActive);

	console.info('Fetching wikipedia views...');
	const politicianWithMostWikipediaVisit = await getPoliticianWithMostViewLastMonth(
		activePoliticians
	);

	console.info('Fetching gun ownership...');
	const politicianWithMostGun = await getPoliticianWithMostGun(activePoliticians);

	const rankingFile: RankingFile = {
		politicianWithMostWikipediaVisit,
		politicianWithMostGun,
		updatedAt: new Date()
	};

	if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);

	writeFileSync(join(OUT_DIR, OUT_FILE), JSON.stringify(rankingFile));
}
