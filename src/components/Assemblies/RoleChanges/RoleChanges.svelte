<script lang="ts">
	import type { RoleChange } from '$lib/politigraph/assembly/change';
	import RoleChangeGroup from './RoleChangeGroup.svelte';
	import { group } from 'd3';

	interface Props {
		changes: RoleChange[];
		selectedDate?: Date | undefined;
	}

	let { changes, selectedDate = undefined }: Props = $props();

	let groupChangeData = $derived(group(changes, (d) => d?.date.toISOString()));
	let convertAndSortChangeData = $derived(
		Array.from(groupChangeData, ([time, value]) => ({
			time: new Date(time).getTime(),
			value
		}))
			.sort((a, b) => b.time - a.time)
			.filter((changeGroup) => {
				if (!selectedDate) return true;
				return changeGroup.time <= selectedDate?.getTime();
			})
	);
</script>

<div>
	{#each convertAndSortChangeData as roleChanges}
		{#if roleChanges}
			<RoleChangeGroup changeData={roleChanges.value} {selectedDate} />
		{/if}
	{/each}
</div>
