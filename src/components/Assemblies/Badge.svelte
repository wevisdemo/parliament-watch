<script lang="ts">
	// import { TooltipDefinition } from 'carbon-components-svelte';
	// import Tooltip from './Tooltip.svelte';
	export let color = '#8D8D8D';
	// export let title: string = '';
	// export let subtitle: string = '';
	export let size = 's'; // l and s

	const getHeight = () => {
		switch (size) {
			case 'l':
				return 'md:h-[16px] h-[8px]';
			case 's':
				return 'h-[8px]';
			default:
				return 'h-[8px]';
		}
	};
</script>

<!-- 
<Tooltip class="w-full">
	<div
		class={`w-full ${getHeight()} bg-[var(--color)] bx--tooltip__trigger`}
		style="--color:{color};
  --height:{getHeight()}"
		aria-describedby="idTooltipTarget"
	>
		<button />
	</div>
	<div slot="tooltip" class="flex flex-col">
		<span class="label-01 text-text-03">{title}</span>
		<span class="label-01 text-text-04">{subtitle}</span>
	</div>
</Tooltip> -->

<!-- TODO: implement tooltip -->
<div
	class={`w-full ${getHeight()} bg-[var(--color)] rounded-[2px]`}
	style="--color:{color};
  --height:{getHeight()}"
	aria-describedby="idTooltipTarget"
/>
