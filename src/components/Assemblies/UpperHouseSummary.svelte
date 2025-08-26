<script lang="ts">
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page.server';
	import Badge from './Badge.svelte';
	import { getPercentWidth } from './shared';

	export let data: MemberGroup[] = [];

	$: memberGroups = data;
</script>

<div class="flex flex-col gap-3">
	{#each memberGroups as group}
		<div>
			<div class="body-compact-01">
				<span class="font-bold">{group.name}</span>
				<span class="text-gray-60">{group.total} คน</span>
			</div>
			<div class="flex" style="width: max({getPercentWidth(group.total, memberGroups)}%, 2px)">
				<Badge color={group.color} />
			</div>
		</div>
	{/each}
</div>
