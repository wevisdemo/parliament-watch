export interface Assembly {
	id: string;
	name: string;
	abbreviation?: string;
	term: number;
	startedAt: Date;
	endedAt?: Date;
	origin: string;
	mainRoles: string[];
}
