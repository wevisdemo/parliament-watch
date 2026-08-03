export interface MemberFilterOptions {
	searchQuery: string;
	isByDistrict: boolean;
	isByPartylist: boolean;
}

export type CandidateType = 'แบ่งเขต' | 'บัญชีรายชื่อ';

export interface FilterableMember {
	name: string;
	candidateType?: CandidateType;
}

export function matchMember(
	{ name, candidateType }: FilterableMember,
	{ searchQuery, isByDistrict, isByPartylist }: MemberFilterOptions
): boolean {
	if (!name.includes(searchQuery)) return false;

	if (candidateType === 'แบ่งเขต') return isByDistrict;
	if (candidateType === 'บัญชีรายชื่อ') return isByPartylist;

	return true;
}
