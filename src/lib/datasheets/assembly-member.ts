import type { ComponentProps } from 'svelte';
import dayjs from 'dayjs';
import type PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
import type { Assembly } from '$models/assembly';
import { fetchPoliticians } from '.';
import type { Politician } from '$models/politician';

export const fetchAssemblyMembers = async (assembly: Assembly) =>
	getAssemblyMembers(assembly, await fetchPoliticians());

export const getAssemblyMembers = (assembly: Assembly, politicians: Politician[]) =>
	politicians
		.map(({ assemblyRoles, ...rest }) => ({
			...rest,
			assemblyRole: assemblyRoles.find(({ assembly: a }) => a.id === assembly.id)
		}))
		.filter(({ assemblyRole }) => assemblyRole !== undefined)
		.map(({ partyRoles, ...rest }) => {
			const partyRole = partyRoles
				.filter(({ startedAt }) => !assembly.endedAt || dayjs(startedAt).isBefore(assembly.endedAt))
				.sort((a, z) => z.startedAt.getTime() - a.startedAt.getTime())[0];

			return {
				...rest,
				partyRole
			};
		});

export type AssemblyMember = Awaited<ReturnType<typeof fetchAssemblyMembers>>[number];

export interface PoliticianSummary extends Omit<ComponentProps<PoliticianProfile>, 'isLarge'> {
	candidateType?: 'แบ่งเขต' | 'บัญชีรายชื่อ';
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
		role: !isActive
			? 'พ้นสภาพก่อนสภาหมดอายุ'
			: assemblyRole?.listNumber
			? `บัญชีรายชื่อลำดับ ${assemblyRole?.listNumber}`
			: assemblyRole?.province && assemblyRole.districtNumber
			? `${assemblyRole?.province} เขต ${assemblyRole.districtNumber}`
			: assemblyRole?.appointmentMethod
	};
}
