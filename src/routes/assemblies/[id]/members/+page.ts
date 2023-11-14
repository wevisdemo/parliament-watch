import { redirect } from '@sveltejs/kit';
import { sen12 } from '../../../../mocks/data/assembly.js';
import { GroupByOption } from './[groupby]/groupby-options.js';

export function load({ params }) {
	throw redirect(
		307,
		`/assemblies/${params.id}/members/${
			params.id === sen12.id ? GroupByOption.Origin : GroupByOption.Party
		}`
	);
}
