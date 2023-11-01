<script lang="ts">
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page';
	import Badge from './Badge.svelte';
	import { getPercentWidth, getSenateColorByTitle } from './shared';

	export let data: MemberGroup[] = [];
</script>

<div class="grid">
	<div class="md:space-y-[24px] space-y-[8px]">
		{#each data as group}
			<div>
				<div>
					<span class="heading-compact-01">{group.name}</span>
					<span class="body-compact-01 text-gray-60">{group.total} คน</span>
				</div>
				<div
					class="flex space-x-[4px] w-[var(--width)]"
					style="--width: {getPercentWidth(group.total, data)}%"
				>
					<Badge color={getSenateColorByTitle(group.name)} size="l" />
				</div>
			</div>
		{/each}
	</div>
</div>
