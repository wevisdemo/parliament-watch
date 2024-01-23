import { fetchPoliticians } from '$lib/datasheets';
import type { Politician } from '$models/politician';

let gunResult:
	| {
			politician: Politician;
			value: number;
	  }
	| undefined;

export const getMostGun = async () => {
	if (gunResult) return gunResult;

	// Get latest files
	const datasetJson = await fetch(
		'https://storage.googleapis.com/act_datacatalog/corrupt0/co_003/001/nacc/co003_opendata_path.json'
	).then((resp) => resp.json());
	const datasetEntries = datasetJson.path_database_format_by_name as Record<
		string,
		string | undefined
	>[];

	const assetUrl = Object.values(
		datasetEntries.find((entry) => Object.keys(entry)[0] === 'asset') ?? {}
	)[0];
	const submitterInfoUrl = Object.values(
		datasetEntries.find((entry) => Object.keys(entry)[0] === 'submitter_info') ?? {}
	)[0];

	if (!assetUrl) throw new Error('[GUN] Asset URL Not Found');
	if (!submitterInfoUrl) throw new Error('[GUN] Submitter Info URL Not Found');

	const submitterInfoCsv = await fetch(submitterInfoUrl).then((resp) => resp.text());
	const submitterInfoData = Object.fromEntries(
		submitterInfoCsv
			.split('\n')
			.slice(1)
			.map((row) => {
				const cols = row.split(',');
				return [cols[0], { firstname: cols[2], lastname: cols[3] }];
			})
	);

	const assetCsv = await fetch(assetUrl).then((resp) => resp.text());

	// Count ID that has gun
	const gunData: Record<string, number> = {};
	for (const row of assetCsv.split('\n').slice(1)) {
		// NOTE - Assuming that all values before `[1]`(submitter_id) and
		// `[4]`(asset_type_id) are always numeric, hence no escaped `,`
		const cols = row.split(',');
		if (cols[4] !== '29') continue;
		const submitterId = cols[1];
		gunData[submitterId] = (gunData[submitterId] ?? 0) + 1;
	}

	// Sort gun owner
	const sortedGunOwner = Object.entries(gunData)
		.sort((a, z) => {
			if (z[1] === a[1]) return +a[0] - +z[0]; // Sort by ID if equal
			return z[1] - a[1];
		})
		.map(([id, value]) => {
			return {
				...(submitterInfoData[id] ?? {}),
				value
			};
		});

	// Match politician data
	const activePoliticians = (await fetchPoliticians()).filter(({ isActive }) => isActive);

	for (const { firstname: gFirst, lastname: gLast, value } of sortedGunOwner) {
		const searchResult = activePoliticians.find(
			({ firstname: pFirst, lastname: pLast }) => pFirst === gFirst && pLast === gLast
		);
		if (searchResult) {
			gunResult = {
				politician: searchResult,
				value
			};
			break;
		}
	}

	if (!gunResult) throw 'Could not find politician with most gun';

	return gunResult;
};
