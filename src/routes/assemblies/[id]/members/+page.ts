import { redirect } from '@sveltejs/kit';

export function load({ params }) {
	throw redirect(307, `/assemblies/${params.id}/members/party`);
}
