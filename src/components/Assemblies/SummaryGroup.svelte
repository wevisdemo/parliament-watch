<script lang="ts">
	import type { Party } from '$models/party';
	import Badge from './Badge.svelte';
	import HalfDonutWrapper from './HalfDonutWrapper.svelte';
	import {
		getPercentWidth,
		getRoundedPercent,
		getSumOfGroupsTotal,
		getTopOfGroups,
		getTopOfGroupsPercent,
		type PartySelected
	} from './shared';
	import { GroupByOption, groupByOptionLabelMap } from '$models/assembly';

	const MAX_GROUP_DISPLAY = 5;

	export let groupBy: GroupByOption;
	export let memberGroups: MemberGroup[];
	export let assemblyId: string;

	interface MemberGroup {
		name: string;
		total: number;
		parties?: (Pick<Party, 'name' | 'color'> & { count: number })[];
	}

	$: getRenderPartyList = (parties: MemberGroup['parties'] = []): PartySelected[] => {
		const result = [...parties]
			.sort((a, b) => b.count - a.count)
			.slice(0, MAX_GROUP_DISPLAY)
			.map((party) => ({
				label: party.name,
				count: party.count,
				color: party.color
			}));
		// if parties has more than MAX_GROUP_DISPLAY parties, add "อื่นๆ" to result
		if (parties.length > MAX_GROUP_DISPLAY) {
			const otherCount = parties
				.slice(MAX_GROUP_DISPLAY)
				.reduce((acc, party) => acc + party.count, 0);
			result.push({
				label: 'อื่นๆ',
				count: otherCount,
				color: '#8D8D8D'
			});
		}
		return result;
	};
</script>

<a
	href="/assemblies/{assemblyId}/members/{groupBy}"
	class="bg-ui-01 hover:bg-ui-03 text-black p-[16px] m-auto min-w-[226px] w-full flex flex-col h-full"
>
	<p class="fluid-heading-03">{groupByOptionLabelMap.get(groupBy)}</p>
	<HalfDonutWrapper
		chartId="summary-{groupBy}"
		percent={getTopOfGroupsPercent(memberGroups)}
		label={getTopOfGroups(memberGroups).name}
	/>
	<div class="grid gap-[8px]">
		{#each memberGroups as group}
			<div>
				<div class="flex">
					<p class="heading-01">{group.name}</p>
					<!-- TODO: consult tooltips with designer
					<Information class="text-gray-70" /> -->
					<p class="body-compact-01 ml-[4px] text-gray-70">
						{getRoundedPercent(group.total, getSumOfGroupsTotal(memberGroups))}%
					</p>
				</div>
				<div
					class="flex w-[--width] gap-x-[2px]"
					style="--width:{getPercentWidth(group.total, memberGroups)}%;"
				>
					{#each getRenderPartyList(group.parties || []) as party}
						<Badge
							color={party.color}
							title={party.label}
							subtitle="{party.count} คน"
							style="flex:{party.count} {party.count} 0%"
						/>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</a>
