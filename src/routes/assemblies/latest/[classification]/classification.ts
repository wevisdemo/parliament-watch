import { type LatestAssemblyClassification } from '$lib/politigraph/assembly/term';
import { enumOrganizationType } from '$lib/politigraph/genql';

export function getLatestAssemblyClassification(
	classification: string
): LatestAssemblyClassification | undefined {
	switch (classification) {
		case 'representative':
			return enumOrganizationType.HOUSE_OF_REPRESENTATIVE;
		case 'senate':
			return enumOrganizationType.HOUSE_OF_SENATE;
		case 'cabinet':
			return enumOrganizationType.CABINET;
		default:
			return undefined;
	}
}
