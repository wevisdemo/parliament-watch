<script lang="ts">
	import type { TooltipProp } from './shared';

	export let tooltipProp: TooltipProp | null = null;
</script>

{#if tooltipProp}
	<div
		style:left="{tooltipProp.x}px"
		style:top="{tooltipProp.y}px"
		class="label-01 absolute z-10 flex min-w-max flex-col
		rounded-sm bg-[#393939] p-3 text-center text-white"
	>
		<div class="font-semibold">{tooltipProp.title}</div>
		<div>{tooltipProp.additional}</div>
	</div>
{/if}
