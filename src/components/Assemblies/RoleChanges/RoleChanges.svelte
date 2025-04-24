<script lang="ts">
	import { group } from 'd3';
	import RoleChangeGroup from './RoleChangeGroup.svelte';
	import type { RoleChange } from '$lib/assembly/change';

	export let changes: RoleChange[];
	export let selectedDate: Date | undefined = undefined;

	$: groupChangeData = group(changes, (d) => d?.date.toISOString());
	$: convertAndSortChangeData = Array.from(groupChangeData, ([time, value]) => ({
		time: new Date(time).getTime(),
		value
	}))
		.sort((a, b) => b.time - a.time)
		.filter((changeGroup) => {
			if (!selectedDate) return true;
			return changeGroup.time <= selectedDate?.getTime();
		});
</script>

<div>
	{#each convertAndSortChangeData as roleChanges}
		{#if roleChanges}
			<RoleChangeGroup changeData={roleChanges.value} {selectedDate} />
		{/if}
	{/each}
</div>
