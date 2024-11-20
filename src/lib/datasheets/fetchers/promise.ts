import { PromiseStatus, type PromiseProgress, type Promise as TPromise } from '$models/promise';
import { asCsvLinks, asValidParty } from '../transformers';
import { sheets, withCache } from './shared';
import { asArray, asDate, asOneOf, asString, Column, Object } from 'sheethuahua';

export const fetchPromises = withCache('Promises', async (): Promise<TPromise[]> => {
	const promiseTable = Object({
		id: Column('id', asString()),
		statement: Column('statement', asString()),
		party: Column('party', await asValidParty()),
		categories: Column('categories', asArray(asString()).optional([])),
		keywords: Column('keywords', asArray(asString()).optional([])),
		parentPromiseId: Column('parentPromiseId', asString().optional()),
		references: Column('references', asCsvLinks().optional([]))
	});

	const rawPromises = await sheets.get('Promises', promiseTable);
	const rawPromiseProgresses = await fetchPromiseProgresses();

	return rawPromises
		.filter((p) => !p.parentPromiseId)
		.map<TPromise>(({ statement, ...promise }) => {
			const relatedRawProgresses = rawPromiseProgresses
				.filter(({ promiseId }) => promiseId === promise.id)
				.sort((a, z) => z.date.getTime() - a.date.getTime());

			return {
				...promise,
				statements: [
					statement,
					...rawPromises.filter((p) => p.parentPromiseId === promise.id).map((p) => p.statement)
				],
				status: relatedRawProgresses.at(0)?.status ?? PromiseStatus.notStarted,
				progresses: relatedRawProgresses.map<PromiseProgress>(({ ...rest }, i) => ({
					id: `${i}`,
					type: 'checkpoint',
					...rest
				}))
			};
		})
		.sort(
			(a, z) =>
				(z.progresses.at(0)?.date.getTime() || 0) - (a.progresses.at(0)?.date.getTime() || 0)
		);
});

export const fetchPromiseProgresses = withCache('Promise Progress', () => {
	const promiseProgressSchema = Object({
		title: Column('title', asString()),
		description: Column('description', asString().optional()),
		promiseId: Column('promiseId', asString()),
		status: Column('status', asOneOf(global.Object.values(PromiseStatus))),
		date: Column('date', asDate()),
		url: Column('url', asString().optional())
	});

	return sheets.get('Promise Progress', promiseProgressSchema);
});
