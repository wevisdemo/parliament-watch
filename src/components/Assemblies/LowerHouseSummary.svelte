<script lang="ts">
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page.server';
	import Badge from './Badge.svelte';
	import { getPercentWidth, type PartySelected } from './shared';

	export let data: MemberGroup[] = [];

	$: memberGroups = data;

	$: getTop5OfGroup = (parties: MemberGroup['parties'] = []): PartySelected[] => {
		// sort parties by count DESC
		const sortedParties = [...parties].slice().sort((a, b) => b.count - a.count);
		// get top 5 parties
		const top5Parties = sortedParties.slice(0, 5);
		// map top5Parties to PartySelected
		const result = top5Parties.map((party) => ({
			label: party.name,
			count: party.count,
			color: party.color
		}));
		return result;
	};
</script>

<div class="grid">
	<div class="md:space-y-[24px] space-y-[8px]">
		{#each memberGroups as group}
			<div>
				<div>
					<span class="heading-compact-01">{group.name}</span>
					<span class="body-compact-01 text-gray-60">{group.total} คน</span>
				</div>
				<div
					class="flex gap-x-[4px] w-[--width]"
					style="--width:{getPercentWidth(group.total, memberGroups)}%"
				>
					{#each getTop5OfGroup(group.parties) as party}
						<Badge
							color={party.color}
							title={party.label}
							subtitle={`${party.count} คน`}
							size="l"
							style="flex:{party.count} {party.count} 0%"
						/>
					{/each}
				</div>
				<div class="flex flex-wrap gap-[4px] mt-[8px]">
					{#each group.parties || [] as party}
						<div class="flex justify-between w-[152px] md:mr-[24px] mr-[8px]">
							<div class="flex space-x-[4px] items-center">
								<div
									class="w-[8px] h-[8px] rounded-[100%] bg-[var(--color)]"
									style="--color: {party.color}"
								/>
								<span class="label-01">{party.name}</span>
							</div>
							<span class="label-01 text-gray-60">{party.count}</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
