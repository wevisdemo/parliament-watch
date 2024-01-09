import dayjs from 'dayjs';
import { AssemblyName, GroupByOption } from '$models/assembly';
import type { Party } from '$models/party';
import type { Politician } from '$models/politician';
import { DefaultVotingResult, type Voting } from '$models/voting';
import { fetchAssemblies, fetchFromIdOr404 } from '$lib/datasheets';
import { fetchAssemblyMembers } from '$lib/datasheets/assembly-member';
import { getMemberGroup } from './members/[groupby]/groupby';
import { createSeo } from '../../../utils/seo';

export interface Summary {
	totalMembers: number;
	highlightGroup: MemberGroup[];
	groupBySex: MemberGroup[];
	groupByAgeRange: MemberGroup[];
	groupByEducation: MemberGroup[];
	// TODO: not release asset value in phase 1
	// groupByAssetValue: MemberGroup[];
}

export interface MemberGroup {
	name: string;
	total: number;
	parties?: (Pick<Party, 'name' | 'color'> & { count: number })[];
}

export interface MainMember {
	assemblyRole: string;
	politician: Pick<Politician, 'id' | 'firstname' | 'lastname' | 'avatar'>;
	party?: Party;
	description?: string;
}

export interface VoteCardProps {
	voting: Pick<Voting, 'id' | 'title' | 'date' | 'result'>;
	highlightedVoteByGroups: {
		name: string;
		count: number;
		total: number;
	}[];
}

export async function load({ params }) {
	const fullAssembly = await fetchFromIdOr404(fetchAssemblies, params.id);

	const { mainRoles, ...assembly } = fullAssembly;
	const isSenates = assembly.name === AssemblyName.Senates;

	const activeMembers = (await fetchAssemblyMembers(fullAssembly)).filter(
		({ assemblyRole }) =>
			!assemblyRole?.endedAt ||
			(assembly.endedAt && dayjs(assembly.endedAt).isSame(assemblyRole.endedAt))
	);

	const mainMembers = mainRoles.reduce((list, mainRole) => {
		const member = activeMembers.find(({ assemblyRole }) => assemblyRole?.role === mainRole);

		if (!member) return list;

		const { id, firstname, lastname, avatar, partyRole, assemblyRole } = member;

		return [
			...list,
			{
				assemblyRole: mainRole,
				politician: {
					id,
					firstname,
					lastname,
					avatar
				},
				party: partyRole?.party,
				description: assemblyRole?.appointmentMethod
			}
		];
	}, [] as MainMember[]);

	const parseMemberGroup = (groupBy: GroupByOption) =>
		getMemberGroup(fullAssembly, activeMembers, groupBy, isSenates).map((group) => ({
			name: group.name,
			...('subgroups' in group
				? {
						parties: group.subgroups.map((party) => ({
							...party,
							color: party.members[0].partyRole?.party.color as string,
							count: party.members.length
						})),
						total: group.subgroups.reduce((sum, subGroup) => sum + subGroup.members.length, 0)
				  }
				: {
						total: group.members.length
				  })
		}));

	const summary: Summary = {
		totalMembers: activeMembers.length,
		highlightGroup: parseMemberGroup(
			isSenates ? GroupByOption.AppointmentMethod : GroupByOption.Party
		),
		groupBySex: parseMemberGroup(GroupByOption.Sex),
		groupByAgeRange: parseMemberGroup(GroupByOption.Age),
		groupByEducation: parseMemberGroup(GroupByOption.Education)
		// groupByAssetValue: [],
	};

	const latestVotes: VoteCardProps[] = new Array(5)
		.fill([
			{ name: 'สส. ฝ่ายรัฐบาล', count: 160, total: 315 },
			{ name: 'สส. ฝ่ายค้าน', count: 164, total: 185 },
			{ name: 'สว.', count: 200, total: 250 }
		])
		.map<VoteCardProps>((highlightedVoteByGroups, i) => ({
			voting: {
				id: `${i + 1}`,
				date: new Date(`09/${i + 1}/2023`),
				title:
					i % 3 < 2 ? 'ร่าง พ.ร.บ. สุราก้าวหน้า (ส่งไป ครม.)' : 'เลือกนายกรัฐมนตรีไทย คนที่ 29',
				result: [DefaultVotingResult.Passed, DefaultVotingResult.Failed, 'ชื่อแคนดิเดต'][i % 3]
			},
			highlightedVoteByGroups
		}));

	const assemblyIds: string[] = (await fetchAssemblies()).map(({ id }) => id);

	return {
		assemblyIds,
		assembly,
		summary,
		mainMembers,
		latestVotes,
		seo: createSeo({
			title: `${assembly.name} ${assembly.term}`
		})
	};
}
