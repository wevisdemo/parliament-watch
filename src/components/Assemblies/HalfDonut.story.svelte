<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import HalfDonut from './HalfDonut.svelte';
	export let Hst: Hst;

	let halfDonuts = [
		{
			percent: 15,
			color: '#3904E9',
			width: 144,
			height: 72
		},
		{
			percent: 50,
			color: '#0F62FE',
			width: 180,
			height: 90
		},
		{
			percent: 85,
			color: '#24A148',
			width: 120,
			height: 60
		}
	];
</script>

<Hst.Story title="Half Donut">
	{#each halfDonuts as halfDonut, i (i)}
		<HalfDonut
			percent={halfDonut.percent}
			color={halfDonut.color}
			width={halfDonut.width}
			height={halfDonut.height}
		/>
	{/each}
	<svelte:fragment slot="controls">
		<Hst.Json bind:value={halfDonuts} title="halfDonuts" />
	</svelte:fragment>
</Hst.Story>
