import { fetchPromises } from '$lib/datasheets';
import { graphql } from '$lib/politigraph/server';
import { PromiseStatus, type Promise, type PromiseSummary } from '$models/promise';
import { groups } from 'd3';

const MAX_PROMISES_SAMPLE = 3;

export type PromiseSample = Pick<Promise, 'id' | 'statements'>;
export type PromiseCountByStatus = {
	[PromiseStatus.inProgress]: number;
	[PromiseStatus.fulfilled]: number;
	[PromiseStatus.unhonored]: number;
};

export interface PromisesByStatus {
	status: PromiseStatus;
	samples: PromiseSample[];
	count: number;
}

export interface PromisesByCategory {
	category: string;
	byStatuses: PromiseCountByStatus;
	count: number;
}

export async function load() {
	const { organizations } = await graphql.query({
		organizations: {
			__args: {
				where: {
					classification: { in: ['CABINET'] }
				},
				sort: [
					{
						founding_date: 'DESC'
					}
				],
				limit: 2
			},
			id: true,
			name: true,
			founding_date: true,
			dissolution_date: true,
			posts: {
				__args: {
					where: {
						role: { contains: 'รัฐมนตรี' },
						membershipsConnection: {
							aggregate: {
								count: { nodes: { gt: 0 } }
							}
						}
					}
				},
				role: true,
				memberships: {
					members: {
						on_Person: {
							name: true,
							image: true,
							memberships: {
								__args: {
									where: {
										end_date: { eq: null },
										posts: {
											some: {
												organizations: {
													some: { classification: { eq: 'POLITICAL_PARTY' } }
												}
											}
										}
									}
								},
								posts: {
									organizations: {
										name: true,
										image: true
									}
								}
							}
						}
					}
				}
			}
		}
	});

	const [cabinet, previousCabinet] = organizations.map(({ posts, ...orgInfo }) => {
		const primeMinister = posts.find((p) => p.role === 'นายกรัฐมนตรี')?.memberships[0]?.members[0];

		return {
			...orgInfo,
			primeMinister:
				primeMinister && 'firstname' in primeMinister
					? {
							firstname: primeMinister.firstname,
							lastname: primeMinister.lastname,
							image: primeMinister.image,
							party: primeMinister.memberships[0]?.posts[0]?.organizations[0]
						}
					: undefined,
			cabinetMemberCount: posts.length,
			cabinetMemberCountsByParty: groups(
				posts.map(
					(p) =>
						p.memberships[0]?.members[0]?.memberships[0]?.posts[0]?.organizations[0] || {
							name: ''
						}
				),
				(p) => p?.name
			)
				.map(([, parties]) => ({ ...parties[0], count: parties.length }))
				.sort((a, z) => z.count - a.count)
		};
	});

	const promises: Promise[] = await fetchPromises();

	const byStatus: PromisesByStatus[] = groups(promises, (p) => p.status).map(
		([status, promisesByStatus]) => ({
			status,
			samples: promisesByStatus
				.slice(0, MAX_PROMISES_SAMPLE)
				.map(({ id, statements }) => ({ id, statements })),
			count: promisesByStatus.length
		})
	);

	const byCategory: PromisesByCategory[] = groups(
		promises.flatMap((p) =>
			p.categories.map((category) => ({
				...p,
				category
			}))
		),
		(p) => p.category
	).map(([category, promisesByCategory]) => ({
		category,
		byStatuses: Object.fromEntries(
			groups(promisesByCategory, (p) => p.status).map(([status, promisesByStatus]) => [
				status,
				promisesByStatus.length
			])
		) as PromiseCountByStatus,
		count: promisesByCategory.length
	}));

	const promiseSummaries: PromiseSummary[] = promises.map(
		({ id, statements, party, keywords, categories, status, progresses }) => ({
			id,
			statements,
			party,
			keywords,
			categories,
			status,
			latestProgressDate: progresses.at(0)?.date
		})
	);

	return {
		cabinet,
		previousCabinet,
		byStatus,
		byCategory,
		activeCount: promises.filter(({ status }) => status !== PromiseStatus.notStarted).length,
		count: promises.length,
		promiseSummaries
	};
}
