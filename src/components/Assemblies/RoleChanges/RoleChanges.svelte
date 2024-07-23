<script lang="ts">
	import { group } from 'd3';
	import type { RoleChange } from '../../../routes/assemblies/[id]/+page.server';
	import RoleChangeGroup from './RoleChangeGroup.svelte';
	export let changes: Array<RoleChange>;
	export let selectedDate: Date | undefined;

	$: groupChangeData = group(changes, (d) => d?.date.toISOString());
	$: convertAndSortChangeData = Array.from(groupChangeData, ([time, value]) => ({
		time: new Date(time).getTime(),
		value
	})).sort((a, b) => a.time - b.time);
</script>

<div>
	{#each convertAndSortChangeData as roleChanges}
		{#if roleChanges}
			<RoleChangeGroup changeData={roleChanges.value} {selectedDate} />
		{/if}
	{/each}
</div>
