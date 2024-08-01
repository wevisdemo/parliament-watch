import type { AvailableAssembly } from '$components/Assemblies/AssemblyIdRunner.svelte';
import { getAssemblyMembers } from '$lib/datasheets/assembly-member';
import {
	fetchAssemblies,
	fetchAssemblyRoleHistory,
	fetchFromIdOr404,
	fetchPoliticians
} from '$lib/datasheets/index';
import { AssemblyName } from '$models/assembly';
import type { AssemblyRoleHistory, Politician } from '$models/politician';
import type { MainMember, RoleChange } from '../+page.server';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';

export type AssemblyRoleSummary = Pick<
	AssemblyRoleHistory,
	'politicianId' | 'role' | 'startedAt' | 'endedAt'
>;

export type AssemblyMember = Omit<Politician, 'assemblyRoles'>;

function parseMainMember(member: ReturnType<typeof getAssemblyMembers>[number]): MainMember {
	const { id, firstname, lastname, avatar, partyRole, assemblyRole } = member;

	return {
		assemblyRole: assemblyRole?.role || '',
		politician: {
			id,
			firstname,
			lastname,
			avatar
		},
		party: partyRole?.party,
		description: assemblyRole?.appointmentMethod || null
	};
}

export async function load({ params }) {
	const fullAssembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	if (fullAssembly.name !== AssemblyName.Cabinet) {
		error(404, { message: `Currently, changes only available for the cabinet` });
	}

	const { mainRoles, ...assembly } = fullAssembly;

	const availableAssemblies: AvailableAssembly[] = (await fetchAssemblies()).map((a) => ({
		id: a.id,
		name: a.name,
		term: a.term
	}));

	const assemblyRoles: AssemblyRoleSummary[] = (await fetchAssemblyRoleHistory())
		.filter(({ assembly, role }) => assembly.id === fullAssembly.id && role)
		.map((ar) => ({
			politicianId: ar.politicianId,
			role: ar.role,
			startedAt: ar.startedAt,
			endedAt: ar.endedAt
		}));

	const members = (await fetchPoliticians()).filter((p) =>
		assemblyRoles.some((ar) => p.id === ar.politicianId)
	);

	const activeMembers = getAssemblyMembers(fullAssembly, members).filter(
		({ assemblyRole }) =>
			!assemblyRole?.endedAt ||
			(assembly.endedAt && dayjs(assembly.endedAt).isSame(assemblyRole.endedAt))
	);

	return {
		assembly: {
			id: fullAssembly.id,
			name: fullAssembly.name,
			term: fullAssembly.term,
			startedAt: fullAssembly.startedAt,
			endedAt: fullAssembly.endedAt
		},
		availableAssemblies,
		assemblyRoles,
		cabinetMembers: activeMembers.map(parseMainMember),
		changes: mockChanges
	};
}

const mockChanges: RoleChange[] = [
	{
		date: new Date('2024-04-27'),
		type: 'in',
		politician: {
			id: 'มาริษ-เสงี่ยมพงษ์',
			firstname: 'มาริษ',
			lastname: 'เสงี่ยมพงษ์',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รัฐมนตรีว่าการกระทรวงต่างประเทศ'
	},
	{
		date: new Date('2024-04-27'),
		type: 'out',
		politician: {
			id: 'ปานปรีย์-พหิทธานุกร',
			firstname: 'ปานปรีย์',
			lastname: 'พหิทธานุกร',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รัฐมนตรีว่าการกระทรวงต่างประเทศ'
	},
	{
		date: new Date('2024-04-27'),
		type: 'in',
		politician: {
			id: 'สุริยะ-จึงรุ่งเรืองกิจ',
			firstname: 'สุริยะ',
			lastname: 'จึงรุ่งเรืองกิจ',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รองนายกรัฐมนตรี'
	},
	{
		date: new Date('2024-05-20'),
		type: 'out',
		politician: {
			id: 'ปานปรีย์-พหิทธานุกร',
			firstname: 'ปานปรีย์',
			lastname: 'พหิทธานุกร',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รองนายกรัฐมนตรี'
	},
	{
		date: new Date('2024-08-20'),
		type: 'in',
		politician: {
			id: 'สมศักดิ์-เทพสุทิน',
			firstname: 'สมศักดิ์',
			lastname: 'เทพสุทิน',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รัฐมนตรีว่าการกระทรวงสาธารณสุข'
	},
	{
		date: new Date('2024-08-20'),
		type: 'out',
		politician: {
			id: 'สมศักดิ์-เทพสุทิน',
			firstname: 'สมศักดิ์',
			lastname: 'เทพสุทิน',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รองนายกรัฐมนตรี'
	},
	{
		date: new Date('2024-08-20'),
		type: 'out',
		politician: {
			id: 'ชลน่าน-ศรีแก้ว',
			firstname: 'ชลน่าน',
			lastname: 'ศรีแก้ว',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รัฐมนตรีว่าการกระทรวงสาธารณสุข'
	},
	{
		date: new Date('2024-08-20'),
		type: 'in',
		politician: {
			id: 'จิราพร-สินธุไพร',
			firstname: 'จิราพร',
			lastname: 'สินธุไพร',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รัฐมนตรีประจำสำนักนายกรัฐมนตรี'
	},
	{
		date: new Date('2024-08-20'),
		type: 'in',
		politician: {
			id: 'พิชิต-ชื่นบาน',
			firstname: 'พิชิต',
			lastname: 'ชื่นบาน',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รัฐมนตรีประจำสำนักนายกรัฐมนตรี'
	},
	{
		date: new Date('2024-08-20'),
		type: 'out',
		politician: {
			id: 'พวงเพ็ชร-ชุนละเอียด',
			firstname: 'พวงเพ็ชร',
			lastname: 'ชุนละเอียด',
			avatar: 'https://placehold.co/128x128',
			party: {
				name: 'เพื่อไทย',
				logo: 'https://placehold.co/64x64/white/blue?text=PT',
				color: 'blue'
			}
		},
		role: 'รัฐมนตรีประจำสำนักนายกรัฐมนตรี'
	}
];
