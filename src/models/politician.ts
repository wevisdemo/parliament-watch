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
	assemblyRoles: AssemblyRole[];
	partyRoles: PartyRole[];
}

interface Contact {
	label: string;
	href: string;
}

interface AssemblyRole extends Role {
	assembly: Assembly;
}

export interface PartyRole extends Role {
	party: Party;
}

interface Role {
	role: string | undefined;
	from: Date;
	to?: Date;
}
