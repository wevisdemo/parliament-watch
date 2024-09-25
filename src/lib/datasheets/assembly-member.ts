import type PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
import type { Assembly } from '$models/assembly';
import type { Politician } from '$models/politician';
import dayjs from 'dayjs';
import type { ComponentProps } from 'svelte';

export const getAssemblyMembers = (assembly: Assembly, politicians: Politician[]) =>
	politicians
		.map(({ assemblyRoles, ...rest }) => {
			const filteredAssemblyRoles = assemblyRoles.filter(({ assembly: a }) => a.id === assembly.id);
			return {
				...rest,
				assemblyRoles: filteredAssemblyRoles
			};
		})
		.filter(({ assemblyRoles }) => assemblyRoles.length > 0)
		.map(({ assemblyRoles, ...rest }) =>
			assemblyRoles.map((assemblyRole) => ({
				...rest,
				assemblyRole
			}))
		)
		.flat()
		.map(({ partyRoles, ...rest }) => {
			const partyRole = partyRoles
				.filter(({ startedAt }) => !assembly.endedAt || dayjs(startedAt).isBefore(assembly.endedAt))
				.sort((a, z) => z.startedAt.getTime() - a.startedAt.getTime())[0];

			return {
				...rest,
				partyRole
			};
		});

export type AssemblyMember = ReturnType<typeof getAssemblyMembers>[number];

export interface PoliticianSummary extends Omit<ComponentProps<PoliticianProfile>, 'isLarge'> {
	candidateType?: 'แบ่งเขต' | 'บัญชีรายชื่อ';
	assemblyRoleName?: string;
}

export function getPoliticianSummary(member: AssemblyMember): PoliticianSummary {
	const { id, firstname, lastname, avatar, isActive, partyRole, assemblyRole } = member;
	return {
		id,
		firstname,
		lastname,
		avatar,
		isActive,
		party: partyRole?.party,
		role: !isActive ? 'พ้นสภาพก่อนสภาหมดอายุ' : getAssemblyRoleDescription(assemblyRole),
		candidateType: assemblyRole?.listNumber
			? 'บัญชีรายชื่อ'
			: assemblyRole?.province && assemblyRole.districtNumber
				? 'แบ่งเขต'
				: undefined,
		assemblyRoleName: assemblyRole?.role
	};
}

const getAssemblyRoleDescription = (assemblyRole: AssemblyMember['assemblyRole']) =>
	assemblyRole?.listNumber
		? `บัญชีรายชื่อ ลำดับ ${assemblyRole?.listNumber}`
		: assemblyRole?.province && assemblyRole.districtNumber
			? `${assemblyRole?.province} เขต ${assemblyRole.districtNumber}`
			: assemblyRole?.appointmentMethod;
