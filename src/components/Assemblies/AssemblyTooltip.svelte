<script lang="ts">
	import { afterUpdate } from 'svelte';
	import type { TooltipProp } from './shared';

	export let tooltipProp: TooltipProp | null = null;
	let tooltipRef: HTMLDivElement;
	let innerWidth: number;

	afterUpdate(() => {
		if (!tooltipProp) return;

		const tooltip = tooltipRef.getBoundingClientRect();
		const { width } = tooltip;

		tooltipProp.x -= width / 2;

		// adjust tooltip position when its size exceed window
		if (innerWidth < tooltipProp.x + width) {
			tooltipProp.x = innerWidth - width;
		} else if (tooltipProp.x < 0) {
			tooltipProp.x = 0;
		}
	});
</script>

<svelte:window bind:innerWidth />

{#if tooltipProp}
	<div
		bind:this={tooltipRef}
		style:left="{tooltipProp.x}px"
		style:top="{tooltipProp.y}px"
		class="label-01 absolute z-10 flex min-w-max flex-col
		rounded-sm bg-[#393939] p-3 text-center text-white"
	>
		<div class="font-semibold">{tooltipProp.title}</div>
		<div>{tooltipProp.additional}</div>
	</div>
{/if}
