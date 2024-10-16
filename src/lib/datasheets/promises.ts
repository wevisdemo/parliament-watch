import type { Party } from '$models/party';
import {
	PromiseStatus,
	type promiseTable,
	type Promise,
	type promiseProgressTable,
	type PromiseProgress
} from '$models/promise';
import { safeFind } from './processor';
import type { RowType } from 'sheethuahua';

export async function transformPromises(
	rawPromises: RowType<typeof promiseTable>[],
	rawPromiseProgresses: RowType<typeof promiseProgressTable>[],
	parties: Party[]
) {
	return rawPromises
		.filter((p) => !p.parentPromiseId)
		.map<Promise>(({ id, statement, party, categories, keywords, references }) => {
			const relatedRawProgresses = rawPromiseProgresses
				.filter(({ promiseId }) => promiseId === id)
				.sort((a, z) => z.date.getTime() - a.date.getTime());

			return {
				id,
				party: safeFind(parties, ({ name }) => name === party),
				statements: [
					statement,
					...rawPromises.filter((p) => p.parentPromiseId === id).map((p) => p.statement)
				],
				categories: categories?.split(',').map((c) => c.trim()) || [],
				keywords: keywords?.split(',').map((c) => c.trim()) || [],
				status: relatedRawProgresses.at(0)?.status || PromiseStatus.notStarted,
				progresses: relatedRawProgresses.map<PromiseProgress>(
					({ description, url, ...rest }, i) => ({
						id: `${i}`,
						type: 'checkpoint',
						...(description ? { description } : {}),
						...(url ? { url } : {}),
						...rest
					})
				),
				references:
					references?.split('\n').map((ref) => {
						const [label, url] = ref
							.trim()
							.split(',')
							.map((str) => str.trim());

						return { label, url };
					}) || []
			};
		})
		.sort(
			(a, z) =>
				(z.progresses.at(0)?.date.getTime() || 0) - (a.progresses.at(0)?.date.getTime() || 0)
		);
}
