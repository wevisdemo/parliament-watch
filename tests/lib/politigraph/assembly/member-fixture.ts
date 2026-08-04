import type { AssemblyMember } from '$lib/politigraph/assembly/member';

interface MembershipFixture {
	organizationId?: string;
	classification?: string;
	organizationName?: string;
	organizationImage?: string;
	province?: string | null;
	label?: string;
	role?: string;
	start_date?: string;
	end_date?: string | null;
}

interface MemberFixture {
	id?: string;
	name?: string;
	image?: string;
	gender?: string | null;
	birth_date?: string | null;
	educations?: string[] | null;
	memberships?: MembershipFixture[];
}

export function createMembership({
	organizationId = 'assembly-1',
	classification = 'HOUSE_OF_REPRESENTATIVE',
	organizationName = '',
	organizationImage = '',
	province = null,
	label = '',
	role = 'สมาชิกสภาผู้แทนราษฎร',
	start_date = '2023-01-01',
	end_date = null
}: MembershipFixture = {}) {
	return {
		label,
		list_number: null,
		district_number: null,
		province,
		start_date,
		end_date,
		posts: [
			{
				role,
				organizations: [
					{
						id: organizationId,
						classification,
						name: organizationName,
						image: organizationImage,
						color: '',
						memberships: []
					}
				]
			}
		]
	};
}

export function createMember({
	id = 'person-1',
	name = 'สมชาย ใจดี',
	image = '',
	gender = null,
	birth_date = null,
	educations = null,
	memberships = [{}]
}: MemberFixture = {}): AssemblyMember {
	return {
		id,
		name,
		image,
		gender,
		birth_date,
		educations,
		memberships: memberships.map((membership) => createMembership(membership))
	} as unknown as AssemblyMember;
}
