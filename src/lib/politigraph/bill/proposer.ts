import type { ProposerProps } from '$components/Proposer/Proposer.svelte';
import { type Bill, type BillGenqlSelection } from '../genql';

/**
 * Selects the fields `getBillProposer` needs. Omit `proposalDate` to fetch memberships of every
 * period, then narrow them per bill with `keepProposerMembershipsOnDate`.
 */
export function createBillFieldsForProposer<S extends BillGenqlSelection>(
	proposalDate?: Bill['proposal_date']
): S {
	return {
		creator_type: true,
		creators: {
			__typename: true,
			on_Organization: {
				id: true,
				name: true,
				founding_date: true
			},
			on_Person: {
				id: true,
				name: true,
				image: true,
				memberships: {
					__args: {
						where: {
							...(proposalDate !== undefined && {
								start_date: { lte: proposalDate },
								OR: [{ end_date: { eq: null } }, { end_date: { gte: proposalDate } }]
							}),
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
					start_date: true,
					end_date: true,
					posts: {
						label: true,
						organizations: {
							id: true,
							classification: true,
							name: true,
							image: true,
							founding_date: true
						}
					}
				}
			}
		},
		people_signature_count: true
	} as S;
}

interface MembershipPeriod {
	start_date: string | null;
	end_date: string | null;
}

function isMembershipActiveOn({ start_date, end_date }: MembershipPeriod, date: string | null) {
	if (!date || !start_date) return false;

	return start_date <= date && (end_date === null || end_date >= date);
}

/** JS equivalent of the membership date filter in `createBillFieldsForProposer`. */
export function keepProposerMembershipsOnDate<
	B extends { creators: { memberships?: MembershipPeriod[] }[] }
>(bill: B, proposalDate: string | null): B {
	return {
		...bill,
		creators: bill.creators.map((creator) =>
			creator.memberships
				? {
						...creator,
						memberships: creator.memberships.filter((membership) =>
							isMembershipActiveOn(membership, proposalDate)
						)
					}
				: creator
		)
	};
}

export function getBillProposer<
	P extends Pick<Bill, 'creator_type' | 'creators' | 'people_signature_count'>
>({ creator_type, creators: [creator], people_signature_count }: P): ProposerProps['proposer'] {
	if (creator_type === 'ASSEMBLY' && creator?.__typename === 'Organization') {
		return { type: creator_type, ...creator };
	}

	if (creator_type === 'PEOPLE') {
		return {
			type: creator_type,
			name: creator?.name,
			signatoryCount: people_signature_count
		};
	}

	if (creator_type === 'POLITICIAN') {
		if (!creator) return undefined;
		const assemblyMembership = creator.memberships.find(
			(m) => m.posts[0]?.organizations[0]?.classification !== 'POLITICAL_PARTY'
		);
		const partyMembership = creator.memberships.find(
			(m) => m.posts[0]?.organizations[0]?.classification === 'POLITICAL_PARTY'
		);

		return {
			type: creator_type,
			id: creator.id,
			name: creator.name,
			image: creator.image,
			assemblyPost: assemblyMembership?.posts[0]?.label,
			assembly: assemblyMembership?.posts[0]?.organizations[0],
			party: partyMembership?.posts[0]?.organizations[0]
		};
	}

	return undefined;
}
