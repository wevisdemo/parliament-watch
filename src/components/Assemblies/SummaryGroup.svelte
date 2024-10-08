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
	import { ArrowRight } from 'carbon-icons-svelte';
	import Tooltip from './Tooltip.svelte';

	const MAX_GROUP_DISPLAY = 5;

	export let groupBy: GroupByOption;
	export let memberGroups: MemberGroup[];
	export let assemblyId: string;
	export let showHalfCircleChart = true;

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

<div class="m-auto flex h-full w-full min-w-[226px] flex-col bg-ui-01 p-[16px] text-black">
	<div class="flex justify-between">
		<p class="fluid-heading-03">{groupByOptionLabelMap.get(groupBy)}</p>
		<Tooltip direction="top">
			<a href="/assemblies/{assemblyId}/members/{groupBy}" class="hover:opacity-50">
				<ArrowRight />
			</a>
			<p slot="tooltip">
				<span class="label-01 text-text-04">ดูรายชื่อ</span>
			</p>
		</Tooltip>
	</div>
	{#if showHalfCircleChart}
		<HalfDonutWrapper
			chartId="summary-{groupBy}"
			percent={getTopOfGroupsPercent(memberGroups)}
			label={getTopOfGroups(memberGroups).name}
		/>
	{/if}
	<div class="grid gap-[8px] {!showHalfCircleChart ? 'mt-2' : ''}">
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
</div>
