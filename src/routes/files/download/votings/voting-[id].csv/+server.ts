import { createCsvFileResponse } from '$lib/csv';
import { fetchFromIdOr404, fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import { getVoteResultsByPerson } from '$lib/datasheets/voting.js';

export const prerender = true;

export async function GET({ params }) {
	const voting = await fetchFromIdOr404(fetchVotings, params.id);
	const politicians = await fetchPoliticians();

	return createCsvFileResponse(
		getVoteResultsByPerson(
			voting,
			(await fetchVotes()).filter(({ votingId }) => votingId === voting.id),
			politicians
		).map(({ firstname, lastname, party, role, voteOption }) => ({
			politician: `${firstname} ${lastname}`,
			role,
			party: party?.name || '',
			voteOption
		}))
	);
}
