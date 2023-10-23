import type { proposingALaw } from '$models/legislative-process';
import { mockProposingALawTable } from '../../mocks/data/legislative-process';

export async function load() {
	const proposingALawTable: proposingALaw[] = mockProposingALawTable;
	return { proposingALawTable };
}
