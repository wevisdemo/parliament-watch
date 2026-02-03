import type { Bill, BillGenqlSelection } from '../genql';

export function createBillFieldsForProposer<S extends BillGenqlSelection>(
	proposalDate: Bill['proposal_date']
): S {
	return {
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
							start_date: { lte: proposalDate },
							OR: [{ end_date: { eq: null } }, { end_date: { gte: proposalDate } }],
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

export function getBillProposer({
	creators: [creator],
	people_signature_count
}: Pick<Bill, 'creators' | 'people_signature_count'>) {
	if (!creator) {
		return undefined;
	}

	if (creator?.__typename === 'Organization') {
		return creator;
	}

	if (people_signature_count) {
		return {
			id: creator.id,
			name: creator.name,
			signatoryCount: people_signature_count
		};
	}

	const assemblyMembership = creator.memberships.find(
		(m) => m.posts[0]?.organizations[0]?.classification !== 'POLITICAL_PARTY'
	);
	const partyMembership = creator.memberships.find(
		(m) => m.posts[0]?.organizations[0]?.classification === 'POLITICAL_PARTY'
	);

	return {
		id: creator.id,
		name: creator.name,
		image: creator.image,
		assemblyPost: assemblyMembership?.posts[0]?.label,
		assembly: assemblyMembership?.posts[0]?.organizations[0],
		party: partyMembership?.posts[0]?.organizations[0]
	};
}
