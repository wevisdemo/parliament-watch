<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import HalfDonut from './HalfDonut.svelte';
	export let Hst: Hst;

	let halfDonuts = [
		{
			percent: 0,
			color: '#3904E9'
		},
		{
			percent: 50,
			color: '#3904E9'
		},
		{
			percent: 100,
			color: '#3904E9'
		}
	];
</script>

<Hst.Story title="Half Donut">
	{#each halfDonuts as halfDonut}
		<HalfDonut
			id="demo-half-donut-{halfDonut.percent}"
			percent={halfDonut.percent}
			color={halfDonut.color}
		/>
	{/each}
	<svelte:fragment slot="controls">
		<Hst.Json bind:value={halfDonuts} title="halfDonuts" />
	</svelte:fragment>
</Hst.Story>
