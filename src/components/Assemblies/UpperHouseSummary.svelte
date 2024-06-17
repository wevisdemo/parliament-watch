<script lang="ts">
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page.server';
	import Badge from './Badge.svelte';
	import { getPercentWidth, getSenateColorByTitle } from './shared';

	export let data: MemberGroup[] = [];

	$: memberGroups = data;
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
					<Badge color={getSenateColorByTitle(group.name)} size="l" />
				</div>
			</div>
		{/each}
	</div>
</div>
