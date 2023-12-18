<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	export let color = '#8D8D8D';
	export let title = '';
	export let subtitle = '';
	export let size: 's' | 'l' = 's';

	$: height = size === 'l' ? 'md:h-[16px] h-[8px]' : 'h-[8px]';
</script>

{#if subtitle === '' && title === ''}
	<div
		class="w-full {height} bg-[var(--color)]"
		style="--color:{color};
  --height:{height};"
		aria-describedby="idTooltipTarget"
	/>
	<p class="flex flex-col justify-center items-center">
		<span class="label-01 text-text-04">{title}</span>
		<span class="label-01 text-text-03">{subtitle}</span>
	</p>
{:else}
	<Tooltip class="w-full">
		<div
			class="w-full {height} bg-[var(--color)]"
			style="--color:{color};
		--height:{height};"
			aria-describedby="idTooltipTarget"
		/>
		<p slot="tooltip" class="flex flex-col justify-center items-center">
			<span class="label-01 text-text-04">{title}</span>
			<span class="label-01 text-text-03">{subtitle}</span>
		</p>
	</Tooltip>
{/if}
