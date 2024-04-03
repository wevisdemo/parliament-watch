import { createCsvFileResponse } from '$lib/csv';
import { fetchFromIdOr404, fetchPoliticians, fetchVotes, fetchVotings } from '$lib/datasheets';
import { safeFind } from '$lib/datasheets/processor.js';

export const prerender = true;

export async function GET({ params }) {
	const politician = await fetchFromIdOr404(fetchPoliticians, params.id);
	const votings = await fetchVotings();
	const votes = await fetchVotes();

	return createCsvFileResponse(
		votes
			.filter(({ politicianId }) => politicianId === politician.id)
			.map(({ votingId, voteOption }) => {
				const { nickname, result, date } = safeFind(votings, (voting) => voting.id === votingId);
				return {
					date,
					nickname,
					result,
					voteOption
				};
			})
			.sort((a, z) => z.date.getTime() - a.date.getTime())
	);
}
