<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	export let color = '#8D8D8D';
	export let title = '';
	export let subtitle = '';
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

<Tooltip class="w-full">
	<div
		class={`w-full ${getHeight()} bg-[var(--color)]`}
		style="--color:{color};
  --height:{getHeight()};"
		aria-describedby="idTooltipTarget"
	/>
	<p slot="tooltip" class="flex flex-col justify-center items-center">
		<span class="label-01 text-text-04">{title}</span>
		<span class="label-01 text-text-03">{subtitle}</span>
	</p>
</Tooltip>
