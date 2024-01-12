import {
	fetchFromIdOr404,
	fetchPoliticians,
	fetchVotes,
	fetchVotings
} from '$lib/datasheets/index.js';
import { getVoteResultsByPerson } from '$lib/datasheets/voting.js';

interface FilterOptions {
	parties: string[];
	roles: string[];
}

export async function load({ params }) {
	const voting = await fetchFromIdOr404(fetchVotings, params.id);
	const politicians = await fetchPoliticians();

	const votes = getVoteResultsByPerson(
		voting,
		(await fetchVotes()).filter(({ votingId }) => votingId === voting.id),
		politicians
	).map(({ id, firstname, lastname, party, ...vote }) => ({
		id,
		party: party?.name,
		politician: { id, firstname, lastname },
		...vote
	}));

	const filterOptions: FilterOptions = {
		parties: getSortedUniqueValue(votes, 'party'),
		roles: getSortedUniqueValue(votes, 'role').reverse()
	};

	return { voting, filterOptions, votes };
}

const getSortedUniqueValue = (list: { [key: string]: unknown }[], key: string): string[] =>
	[...new Set(list.map((item) => item[key]).filter((item) => item) as string[])].sort((a, z) =>
		a.localeCompare?.(z)
	);
