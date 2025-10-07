import { graphql } from '$lib/politigraph';
import { OUT_FILE, type ExternalPoliticianRanking } from '.';
import { getPoliticianWithMostGun } from './gun';
import { getPoliticianWithMostViewLastMonth } from './wikipedia';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUT_DIR = './out';

async function writePoliticianRankingFile() {
	console.info('Fetching politicians...');

	const { people } = await graphql.query({
		people: {
			__args: {
				where: {
					memberships_SOME: {
						end_date_EQ: null,
						posts_ALL: {
							organizations_ALL: {
								classification_IN: ['CABINET', 'HOUSE_OF_REPRESENTATIVE', 'HOUSE_OF_SENATE']
							}
						}
					}
				}
			},
			id: true,
			name: true
		}
	});

	console.info('Fetching wikipedia views...');
	const politicianWithMostWikipediaVisit = await getPoliticianWithMostViewLastMonth(people);

	console.info('Fetching gun ownership...');
	const politicianWithMostGun = await getPoliticianWithMostGun(people);

	const highlightPoliticians = (
		await graphql.query({
			people: {
				__args: {
					where: {
						id_IN: [politicianWithMostWikipediaVisit.id, politicianWithMostGun.id]
					}
				},
				id: true,
				image: true,
				memberships: {
					__args: {
						where: {
							end_date_EQ: null,
							posts_ALL: {
								organizations_ALL: {
									classification_IN: [
										'CABINET',
										'HOUSE_OF_REPRESENTATIVE',
										'HOUSE_OF_SENATE',
										'POLITICAL_PARTY'
									]
								}
							}
						}
					},
					posts: {
						role: true,
						organizations: {
							classification: true,
							name: true,
							image: true
						}
					}
				}
			}
		})
	).people.map(({ id, image, memberships }) => {
		const assembly = memberships.find(
			(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
		);
		const party = memberships.find(
			(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
		);

		return {
			id,
			avatar: image ?? '/images/politicians/_placeholder.webp',
			label: assembly?.posts[0].role ?? '',
			partyName: party?.posts[0].organizations[0].name ?? '',
			partyLogo: party?.posts[0].organizations[0].image ?? '/images/parties/_placeholder.webp'
		};
	});

	const rankingFile: ExternalPoliticianRanking = {
		politicianWithMostWikipediaVisit: {
			...politicianWithMostWikipediaVisit,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			...highlightPoliticians.find((p) => p.id === politicianWithMostWikipediaVisit.id)!
		},
		politicianWithMostGun: {
			...politicianWithMostGun,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			...highlightPoliticians.find((p) => p.id === politicianWithMostGun.id)!
		},
		updatedAt: new Date()
	};

	if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);

	writeFileSync(join(OUT_DIR, OUT_FILE), JSON.stringify(rankingFile));
}

writePoliticianRankingFile();
