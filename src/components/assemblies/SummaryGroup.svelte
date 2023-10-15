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
	export let title = '';
	export let data: MemberGroup[] = [];
	interface MemberGroup {
		name: string;
		total: number;
		parties?: (Pick<Party, 'name' | 'color'> & { count: number })[];
	}

	const getRenderPartyList = (parties: MemberGroup['parties'] = []): PartySelected[] => {
		// sort parties by count DESC
		const sortedParties = parties.sort((a, b) => b.count - a.count);
		// get top 5 parties
		const top5Parties = sortedParties.slice(0, 5);
		// map top5Parties to PartySelected
		const result = top5Parties.map((party) => ({
			label: party.name,
			count: party.count,
			color: party.color
		}));
		// if parties has more than 5 parties, add "อื่นๆ" to result
		if (parties.length > 5) {
			const otherCount = parties.slice(5).reduce((acc, party) => acc + party.count, 0);
			result.push({
				label: 'อื่นๆ',
				count: otherCount,
				color: '#8D8D8D'
			});
		}
		return result;
	};
</script>

<div class="bg-ui-01 p-[16px] m-auto min-w-[226px] w-full flex flex-col h-full">
	<p class="fluid-heading-03">{title}</p>
	<HalfDonutWrapper
		chartId="summary-{title}"
		percent={getTopOfGroupsPercent(data)}
		label={getTopOfGroups(data).name}
	/>
	<div class="grid gap-[8px]">
		{#each data as group}
			<div>
				<div class="flex">
					<p class="heading-01">{group.name}</p>
					<p class="body-compact-01 ml-[4px]">
						{getRoundedPercent(group.total, getSumOfGroupsTotal(data))}%
					</p>
				</div>
				<div
					class="flex w-[var(--width)] space-x-[2px]"
					style="--width: {getPercentWidth(group.total, data)}%;"
				>
					{#each getRenderPartyList(group.parties || []) as party}
						<!-- <Badge color={party.color} title={party.label} subtitle={`${party.count} คน`} /> -->
						<Badge color={party.color} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style></style>
