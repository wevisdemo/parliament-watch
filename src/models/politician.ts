import type { Assembly } from './assembly';
import type { Party } from './party';

export interface Politician {
	firstname: string;
	lastname: string;
	isActive: boolean;
	avatar: string;
	sex: string;
	birthdate: Date;
	educations: string[];
	previousOccupations: string[];
	assetValue: number;
	debtValue: number;
	contacts: Contact[];
	assemblyHistories: AssemblyHistory[];
	partyHistories: PartyHistory[];
}

interface Contact {
	label: string;
	href: string;
}

interface AssemblyHistory extends History {
	assembly: Assembly;
}

interface PartyHistory extends History {
	party: Party;
}

interface History {
	role: string | undefined;
	from: Date;
	to?: Date;
}
