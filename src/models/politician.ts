import type { Assembly } from './assembly';
import type { Link } from './link';
import type { Party } from './party';

export type Politician = {
	avatar: string;
	isActive: boolean;
	educations: string[];
	previousOccupations: string[];
	prefix?: string;
	firstname: string;
	lastname: string;
	sex?: string;
	birthdate?: Date;
	id: string;
	partyRoles: Omit<PartyRoleHistory, 'politicianId'>[];
	assemblyRoles: Omit<AssemblyRoleHistory, 'politicianId'>[];
	contacts: Link[];
};

export type AssemblyRoleHistory = {
	role: string;
	assembly: Assembly;
	politicianId: string;
	appointmentMethod?: string;
	province?: string;
	districtNumber?: number;
	listNumber?: number;
	startedAt: Date;
	endedAt?: Date;
};

export type PartyRoleHistory = {
	role: string;
	party: Party;
	politicianId: string;
	startedAt: Date;
	endedAt?: Date;
};
