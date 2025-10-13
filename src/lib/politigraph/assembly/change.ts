import { noParty } from './groupby';
import type { AssemblyMember } from './member';
import type { Person } from 'carbon-icons-svelte';

export interface RoleChange {
	date: Date;
	type: 'in' | 'out';
	politician: Pick<Person, 'id' | 'name' | 'image'> & {
		partyLogo: string | null;
	};
	role: string;
}

export function getRoleChanges(
	assemblyId: string,
	members: AssemblyMember[],
	maxChanges?: number
): RoleChange[] {
	return members
		.flatMap((member) =>
			member.memberships
				.filter((membership) => membership.posts[0].organizations[0].id === assemblyId)
				.flatMap((membership) => {
					const politician = {
						image: member.image,
						name: member.name,
						id: member.id,
						partyLogo: getPartyLogoAtDate(member.memberships, membership.start_date)
					};

					return [
						{
							date: new Date(membership.start_date),
							type: 'in' as const,
							role: membership.posts[0].role,
							politician
						},
						...(membership.end_date
							? [
									{
										date: new Date(membership.end_date),
										type: 'out' as const,
										role: membership.posts[0].role,
										politician
									}
								]
							: [])
					];
				})
		)
		.sort((a, b) => b.date.getTime() - a.date.getTime())
		.slice(0, maxChanges);
}

function getPartyLogoAtDate(memberships: AssemblyMember['memberships'], date: string) {
	const { image } =
		memberships
			.filter(
				({ posts, start_date, end_date }) =>
					posts[0].organizations[0].classification === 'POLITICAL_PARTY' &&
					start_date <= date &&
					(!end_date || date < end_date)
			)
			.sort((a, z) => z.start_date.localeCompare(a.start_date))
			.at(-1)?.posts[0].organizations[0] ?? noParty;

	return image;
}
