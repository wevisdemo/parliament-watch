import type {
	AssemblyProposer,
	PeopleProposer,
	PoliticianProposer
} from '$components/Proposer/Proposer.svelte';
import { AssemblyName } from '$models/assembly';
import { type Bill } from '$models/bill';
import { getRoleHistoryAtTime } from '$models/politician';

export function getProposerFromBill(
	bill: Bill
): PoliticianProposer | AssemblyProposer | PeopleProposer | undefined {
	if (bill.proposedLedByPolitician) {
		return {
			...bill.proposedLedByPolitician,
			assembly: getRoleHistoryAtTime(bill.proposedLedByPolitician.assemblyRoles, bill.proposedOn)
				?.assembly,
			partyName: getRoleHistoryAtTime(bill.proposedLedByPolitician.partyRoles, bill.proposedOn)
				?.party.name
		};
	}

	if (bill.proposedByAssembly) {
		return {
			...bill.proposedByAssembly,
			isCabinet: bill.proposedByAssembly.name === AssemblyName.Cabinet
		};
	}

	return bill.proposedByPeople;
}
