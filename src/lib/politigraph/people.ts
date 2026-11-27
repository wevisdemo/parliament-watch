import { graphql, type NamedQueryClient } from '$lib/politigraph/client';
import type { FieldsSelection } from '$lib/politigraph/genql';
import type { Person, PersonGenqlSelection, PersonWhere } from '$lib/politigraph/genql/schema';

const PEOPLE_PAGE_SIZE = 1000;

type PeoplePage<TSelection extends PersonGenqlSelection> = {
	peopleConnection: {
		edges: { node: FieldsSelection<Person, NonNullable<TSelection>> }[];
		pageInfo: {
			hasNextPage: boolean;
			endCursor: string | null;
		};
	};
};

type QueryAllPeopleOptions = {
	where?: PersonWhere;
	client?: NamedQueryClient;
};

export async function queryAllPeople<TSelection extends PersonGenqlSelection>(
	name: string,
	selection: TSelection,
	options: QueryAllPeopleOptions = {}
): Promise<Array<FieldsSelection<Person, NonNullable<TSelection>>>> {
	const { client = graphql, where } = options;
	const people: Array<FieldsSelection<Person, NonNullable<TSelection>>> = [];
	let after: string | undefined = undefined;
	let hasNextPage: boolean;

	do {
		const { peopleConnection } = (await client.query({
			__name: name,
			peopleConnection: {
				__args: {
					first: PEOPLE_PAGE_SIZE,
					after,
					where,
					sort: [{ id: 'ASC' }]
				},
				edges: {
					node: selection
				},
				pageInfo: {
					hasNextPage: true,
					endCursor: true
				}
			}
		})) as PeoplePage<TSelection>;

		people.push(...peopleConnection.edges.map(({ node }) => node));
		after = peopleConnection.pageInfo.endCursor ?? undefined;
		hasNextPage = peopleConnection.pageInfo.hasNextPage;
	} while (hasNextPage);

	return people;
}
