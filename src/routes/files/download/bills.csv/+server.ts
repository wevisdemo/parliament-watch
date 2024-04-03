import { createCsvFileResponse } from '$lib/csv';
import { fetchBills } from '$lib/datasheets';

export const prerender = true;

export async function GET() {
	const bills = await fetchBills();

	return createCsvFileResponse(
		bills.map(
			({
				title,
				nickname,
				description,
				status,
				categories,
				proposedOn,
				attachment,
				lisUrl,
				...bill
			}) => ({
				title,
				nickname,
				description,
				status,
				categories,
				proposedOn,
				proposedLedByPolitician:
					bill.proposedLedByPolitician &&
					`${bill.proposedLedByPolitician.firstname} ${bill.proposedLedByPolitician.lastname}`,
				coProposedByPoliticians: bill.coProposedByPoliticians?.map((co) =>
					typeof co === 'string'
						? co
						: [co.prefix, co.firstname, co.lastname].filter((term) => term).join(' ')
				),
				proposedByAssembly:
					bill.proposedByAssembly &&
					`${bill.proposedByAssembly.name} ชุดที่ ${bill.proposedByAssembly.term}`,
				proposedLedByPeople: bill.proposedByPeople?.ledBy,
				peopleSignatureCount: bill.proposedByPeople?.signatoryCount,
				attachment: attachment?.url,
				source: lisUrl
			})
		)
	);
}
