import { load as l } from '../+page';

export async function load({ params }) {
	const [firstname, lastname] = params.id.split('-');

	const votelog = {
		firstname,
		lastname
	};

	return { votelog };
}
