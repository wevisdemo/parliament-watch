import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getPoliticianWithMostViewLastMonth } from './wikipedia';
import { getPoliticianWithMostGun } from './gun';
import { fetchPoliticians } from '$lib/datasheets';
import { OUT_FILE, type ExternalPoliticianRanking } from '.';

const OUT_DIR = './out';

async function writePoliticianRankingFile() {
	console.info('Fetching politicians...');
	const activePoliticians = (await fetchPoliticians()).filter(({ isActive }) => isActive);

	console.info('Fetching wikipedia views...');
	const politicianWithMostWikipediaVisit = await getPoliticianWithMostViewLastMonth(
		activePoliticians
	);

	console.info('Fetching gun ownership...');
	const politicianWithMostGun = await getPoliticianWithMostGun(activePoliticians);

	const rankingFile: ExternalPoliticianRanking = {
		politicianWithMostWikipediaVisit,
		politicianWithMostGun,
		updatedAt: new Date()
	};

	if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);

	writeFileSync(join(OUT_DIR, OUT_FILE), JSON.stringify(rankingFile));
}

writePoliticianRankingFile();
