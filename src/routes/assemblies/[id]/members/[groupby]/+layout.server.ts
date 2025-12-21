import { graphql } from '$lib/politigraph/server';
import { GroupByOption, groupByOptionLabelMap } from '$models/assembly';
import { error } from '@sveltejs/kit';

export interface GroupByTab {
	path: string;
	label: string;
	isActive: boolean;
}

export async function load({ params }) {
	const {
		organizations: [assembly]
	} = await graphql.query({
		organizations: {
			__args: {
				where: {
					id_EQ: params.id
				}
			},
			classification: true,
			id: true,
			name: true,
			term: true,
			founding_date: true
		}
	});

	if (!assembly) {
		error(404);
	}

	const groupByTabs = Object.values(GroupByOption)
		.filter(
			assembly.classification === 'HOUSE_OF_SENATE'
				? (path) => [GroupByOption.Party, GroupByOption.Province].every((option) => option !== path)
				: assembly.classification === 'CABINET'
					? (path) =>
							[GroupByOption.AppointmentMethod, GroupByOption.Province].every(
								(option) => option !== path
							)
					: (path) => path !== GroupByOption.AppointmentMethod
		)
		.map<GroupByTab>((path) => ({
			path,
			label: groupByOptionLabelMap.get(path) as string,
			isActive: path === params.groupby
		}));

	return { assembly, groupByTabs };
}
