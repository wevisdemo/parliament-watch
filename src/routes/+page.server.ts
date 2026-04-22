import StatCard, { HighlightedReason } from '$components/Index/StatCard.svelte';
import { getLatestTerm } from '$lib/politigraph/assembly/term';
import {
	getBillCategoryOptions,
	getRepresentativeTermOptions
} from '$lib/politigraph/bill/overview';
import { graphql } from '$lib/politigraph/client';
import type { ComponentProps } from 'svelte';

const CHUAN_ID = '891ea463-c463-4f76-840d-e7d24a97d70c';
const BANYAT_ID = 'e26bbc32-f2d5-41f1-8006-2ea439576771';

enum PoliticialPosition {
	MP = 'สส.',
	Senate = 'สว.',
	Cabinet = 'รัฐมนตรี'
}

interface LongestServedInPoliticalPositionsPolitician extends ComponentProps<StatCard> {
	position: PoliticialPosition;
	year: number;
}

interface MostFrequentlyServedAsMinisterPolitician extends ComponentProps<StatCard> {
	cabinetTerms: number[];
}

function buildAssemblyLabel(
	title: string,
	shortTitle: string | undefined,
	term: number | null | undefined
) {
	const displayTitle = shortTitle ? `${title} (${shortTitle})` : title;

	return term ? `${displayTitle} ชุดที่ ${term} (ชุดล่าสุด)` : `${displayTitle} ชุดล่าสุด`;
}

export async function load() {
	const [latestRepresentativeTerm, latestSenateTerm, latestCabinetTerm] = await Promise.all([
		getLatestTerm('HOUSE_OF_REPRESENTATIVE'),
		getLatestTerm('HOUSE_OF_SENATE'),
		getLatestTerm('CABINET')
	]);

	const highlightPoliticians = (
		await graphql.query({
			people: {
				__args: {
					where: {
						id: { in: [CHUAN_ID, BANYAT_ID] }
					}
				},
				id: true,
				name: true,
				image: true,
				memberships: {
					__args: {
						where: {
							end_date: { eq: null },
							posts: {
								some: {
									organizations: {
										some: {
											classification: {
												in: [
													'CABINET',
													'HOUSE_OF_REPRESENTATIVE',
													'HOUSE_OF_SENATE',
													'POLITICAL_PARTY'
												]
											}
										}
									}
								}
							}
						}
					},
					posts: {
						label: true,
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
	).people.map(({ image, memberships, ...rest }) => {
		const assembly = memberships.find(
			(m) => m.posts[0].organizations[0].classification !== 'POLITICAL_PARTY'
		);
		const party = memberships.find(
			(m) => m.posts[0].organizations[0].classification === 'POLITICAL_PARTY'
		);

		return {
			...rest,
			avatar: image ?? '',
			label: assembly?.posts[0].label ?? '',
			partyImage: party?.posts[0].organizations[0].name ?? '',
			partyLogo: party?.posts[0].organizations[0].image ?? '',
			partyName: party?.posts[0].organizations[0].name ?? ''
		};
	});

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const chuanLeekpai = highlightPoliticians.find((p) => p.id === CHUAN_ID)!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const banyatBantadtan = highlightPoliticians.find((p) => p.id === BANYAT_ID)!;

	const highlightedPoliticians: ComponentProps<StatCard>[] = [
		{
			reason: HighlightedReason.LongestServedInPoliticalPositions,
			value: 54,
			...chuanLeekpai,
			position: PoliticialPosition.MP,
			year: 2512
		} as LongestServedInPoliticalPositionsPolitician,
		{
			reason: HighlightedReason.MostFrequentlyElectedInConstituency,
			value: 12,
			...banyatBantadtan
		},
		{
			reason: HighlightedReason.MostFrequentlyServedAsMinister,
			value: 5,
			...chuanLeekpai,
			cabinetTerms: [38, 42, 43, 45, 53]
		} as MostFrequentlyServedAsMinisterPolitician,
		{
			reason: HighlightedReason.MostDiverseServedAsMinister,
			value: 6,
			...chuanLeekpai
		}
	];

	const billCategories = await getBillCategoryOptions();
	const mpTermChoices = await getRepresentativeTermOptions();
	const latestAssemblyLabels = {
		representative: buildAssemblyLabel(
			'สมาชิกสภาผู้แทนราษฎร',
			'สส.',
			latestRepresentativeTerm?.term
		),
		senate: buildAssemblyLabel('สมาชิกวุฒิสภา', 'สว.', latestSenateTerm?.term),
		cabinet: buildAssemblyLabel('คณะรัฐมนตรี', 'ครม.', latestCabinetTerm?.term),
		representativeVotes: `ดูการลงมติของ ${buildAssemblyLabel(
			'สมาชิกสภาผู้แทนราษฎร',
			'สส.',
			latestRepresentativeTerm?.term
		)}`,
		senateVotes: `ดูการลงมติของ ${buildAssemblyLabel(
			'สมาชิกวุฒิสภา',
			'สว.',
			latestSenateTerm?.term
		)}`
	};

	// const promiseSummary = {
	// 	total: promises.length,
	// 	byStatus: groups(
	// 		promises.filter((p) =>
	// 			[PromiseStatus.inProgress, PromiseStatus.fulfilled, PromiseStatus.unhonored].includes(
	// 				p.status
	// 			)
	// 		),
	// 		(p) => p.status
	// 	).map<PromisesByStatus>(([status, promisesByStatus]) => ({
	// 		status,
	// 		samples: promisesByStatus
	// 			.slice(0, MAX_PROMISES_SAMPLE)
	// 			.map(({ id, statements }) => ({ id, statements })),
	// 		count: promisesByStatus.length
	// 	}))
	// };

	return {
		highlightedPoliticians,
		billCategories,
		mpTermChoices,
		latestAssemblyLabels
	};
}
