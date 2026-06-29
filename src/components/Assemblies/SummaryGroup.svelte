<script lang="ts">
	import { GroupByOption, groupByOptionLabelMap } from '$models/assembly';
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page.server';
	import Badge from './Badge.svelte';
	import HalfDonutWrapper from './HalfDonutWrapper.svelte';
	import Tooltip from './Tooltip.svelte';
	import {
		getPercentWidth,
		getSumOfGroupsTotal,
		getTopOfGroups,
		getTopOfGroupsPercent,
		type SubgroupSelected
	} from './shared';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

	const MAX_GROUP_DISPLAY = 5;

	interface Props {
		groupBy: GroupByOption;
		memberGroups: MemberGroup[];
		assemblyId: string;
		showHalfCircleChart?: boolean;
	}

	let { groupBy, memberGroups, assemblyId, showHalfCircleChart = true }: Props = $props();

	let getRenderPartyList = $derived(
		(parties: MemberGroup['subgroups'] = []): SubgroupSelected[] => {
			const result = [...parties].sort((a, b) => b.count - a.count).slice(0, MAX_GROUP_DISPLAY);

			if (parties.length > MAX_GROUP_DISPLAY) {
				const otherCount = parties
					.slice(MAX_GROUP_DISPLAY)
					.reduce((acc, party) => acc + party.count, 0);
				result.push({
					name: 'อื่นๆ',
					count: otherCount,
					color: '#8D8D8D'
				});
			}
			return result;
		}
	);
</script>

<div class="m-auto flex h-full w-full min-w-[226px] flex-col bg-ui-01 p-[16px] text-black">
	<div class="flex justify-between">
		<p class="fluid-heading-03">{groupByOptionLabelMap.get(groupBy)}</p>
		<Tooltip direction="top">
			<a href="/assemblies/{assemblyId}/members/{groupBy}" class="hover:opacity-50">
				<ArrowRight />
			</a>
			{#snippet tooltip()}
				<p>
					<span class="label-01 text-text-04">ดูรายชื่อ</span>
				</p>
			{/snippet}
		</Tooltip>
	</div>
	{#if showHalfCircleChart}
		<HalfDonutWrapper
			percent={getTopOfGroupsPercent(memberGroups)}
			label={getTopOfGroups(memberGroups).name}
		/>
	{/if}
	<div class="grid gap-[8px] {!showHalfCircleChart ? 'mt-2' : ''}">
		{#each memberGroups as group (group.name)}
			<div>
				<div class="flex">
					<p class="heading-01">{group.name}</p>
					<p class="body-compact-01 ml-[4px] text-gray-70">
						{((group.total / getSumOfGroupsTotal(memberGroups)) * 100).toFixed(1)}%
					</p>
				</div>
				<div
					class="flex w-[--width] gap-x-[1px]"
					style="--width:{Math.max(getPercentWidth(group.total, memberGroups), 1)}%;"
				>
					{#each getRenderPartyList(group.subgroups || []) as party (party.name)}
						<Badge
							color={party.color}
							title={party.name}
							subtitle="{party.count} คน"
							style="flex:{party.count} {party.count} 0%"
						/>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
