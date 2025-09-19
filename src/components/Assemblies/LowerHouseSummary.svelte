<script lang="ts">
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page.server';
	import Badge from './Badge.svelte';
	import { getPercentWidth, type SubgroupSelected } from './shared';

	export let data: MemberGroup[] = [];

	$: memberGroups = data;

	const getTop5OfGroup = (parties: MemberGroup['subgroups'] = []): SubgroupSelected[] =>
		[...parties].sort((a, b) => b.count - a.count).slice(0, 5);
</script>

<div class="grid">
	<div class="space-y-[8px] md:space-y-[24px]">
		{#each memberGroups as group}
			<div>
				<div>
					<span class="heading-compact-01">{group.name}</span>
					<span class="body-compact-01 text-gray-60">{group.total} คน</span>
				</div>
				<div
					class="flex w-[--width] gap-x-[4px]"
					style="--width:{getPercentWidth(group.total, memberGroups)}%"
				>
					{#each getTop5OfGroup(group.subgroups) as party}
						<Badge
							color={party.color}
							title={party.name}
							subtitle={`${party.count} คน`}
							size="l"
							style="flex:{party.count} {party.count} 0%"
						/>
					{/each}
				</div>
				<div class="mt-[8px] flex flex-wrap gap-[4px]">
					{#each group.subgroups || [] as party}
						<div class="mr-[8px] flex w-[152px] justify-between md:mr-[24px]">
							<div class="flex items-center space-x-[4px]">
								<div
									class="h-[8px] w-[8px] rounded-[100%]"
									style="background-color: {party.color || '#8D8D8D'}"
								/>
								<span class="label-01">{party.name || 'ไม่สังกัดพรรค'}</span>
							</div>
							<span class="label-01 text-gray-60">{party.count}</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
