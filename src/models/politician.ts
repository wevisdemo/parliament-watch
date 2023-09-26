import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Party } from './party';

export interface Politician {
	id: string;
	prefix?: string;
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
	contacts: Link[];
	assemblyRoles: AssemblyRole[];
	partyRoles: PartyRole[];
}

interface AssemblyRole extends Role {
	assembly: Assembly;
}

export interface PartyRole extends Role {
	party: Party;
}

interface Role {
	role: string | undefined;
	startedAt: Date;
	endedAt?: Date;
}
