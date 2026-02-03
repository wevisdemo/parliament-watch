import { formatDateRange } from '$lib/date';
import { ALL_CATEGORY_KEY, MP_OTHER_TERMS } from '../../../constants/bills';
import { graphql } from '../client';

export async function getBillCategoryOptions() {
	return [
		ALL_CATEGORY_KEY,
		...new Set(
			(
				await graphql.query({
					bills: {
						__args: {
							where: {
								NOT: { categories: { eq: null } }
							}
						},
						categories: true
					}
				})
			).bills.flatMap((bill) => bill.categories ?? [])
		)
	].sort((a, z) => a.localeCompare(z));
}

export async function getRepresentativeTermOptions() {
	return (
		await graphql.query({
			organizations: {
				__args: {
					where: {
						classification: { eq: 'HOUSE_OF_REPRESENTATIVE' }
					},
					sort: [{ founding_date: 'DESC' }]
				},
				id: true,
				name: true,
				term: true,
				founding_date: true,
				dissolution_date: true
			}
		})
	).organizations
		.filter((org) => org.founding_date)
		.map((org) => {
			return {
				id: org.id,
				founding_date: org.founding_date ?? undefined,
				dissolution_date: org.dissolution_date ?? undefined,
				value: `สส. ชุดที่ ${org.term} (ปี ${formatDateRange(org.founding_date, org.dissolution_date, { hideMonth: true, shortYear: true })})`
			};
		})
		.concat([
			{
				id: MP_OTHER_TERMS.id,
				founding_date: '',
				dissolution_date: MP_OTHER_TERMS.dissolution_date,
				value: 'สส. ชุดอื่น ๆ (ก่อนปี 62)'
			}
		]);
}
