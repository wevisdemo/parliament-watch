import type { Assembly } from '$models/assembly';
import dayjs from 'dayjs';
import { fetchPoliticians } from '../../../libs/datasheets';

export const fetchAssemblyMembers = async (assembly: Assembly) =>
	(await fetchPoliticians())
		.map(({ assemblyRoles, ...rest }) => ({
			...rest,
			assemblyRole: assemblyRoles.find(({ assembly: a }) => a.id === assembly.id)
		}))
		.filter(({ assemblyRole }) => assemblyRole !== undefined)
		.map(({ partyRoles, ...rest }) => {
			const partyRole = partyRoles.find(
				({ startedAt, endedAt }) =>
					(!assembly.endedAt || dayjs(startedAt).isBefore(assembly.endedAt)) &&
					(!endedAt || dayjs(endedAt).isAfter(assembly.startedAt))
			);

			return {
				...rest,
				partyRole
			};
		});

export type AssemblyMember = Awaited<ReturnType<typeof fetchAssemblyMembers>>[number];
