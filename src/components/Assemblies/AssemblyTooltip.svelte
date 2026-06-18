<script lang="ts">
	import type { TooltipProp } from './shared';

	interface Props {
		tooltipProp?: TooltipProp | null;
	}

	let { tooltipProp }: Props = $props();

	let tooltipRef: HTMLDivElement | undefined = $state();
	let innerWidth = $state(0);
	let left = $state(0);
	let top = $state(0);

	$effect(() => {
		if (!tooltipProp || !tooltipRef) return;

		const width = tooltipRef.getBoundingClientRect().width;
		let x = tooltipProp.x - width / 2;

		if (innerWidth < x + width) {
			x = innerWidth - width;
		} else if (x < 0) {
			x = 0;
		}

		left = x;
		top = tooltipProp.y;
	});
</script>

<svelte:window bind:innerWidth />

{#if tooltipProp}
	<div
		bind:this={tooltipRef}
		style:left="{left}px"
		style:top="{top}px"
		class="label-01 absolute z-10 flex min-w-max flex-col rounded-sm bg-[#393939] p-3 text-center text-white"
	>
		<div class="font-semibold">{tooltipProp.title}</div>
		<div>{tooltipProp.additional}</div>
	</div>
{/if}
