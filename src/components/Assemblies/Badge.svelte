<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import Tooltip from './Tooltip.svelte';

	export let color = '#8D8D8D';
	export let title = '';
	export let subtitle = '';
	export let size: 's' | 'l' = 's';

	let className = '';
	export { className as class };
	export let style = '';
</script>

{#if subtitle === '' && title === ''}
	<div
		class={twMerge('h-[8px] w-full bg-[--color]', size === 'l' && 'md:h-[16px]', className)}
		style:--color={color || '#8D8D8D'}
		{style}
		aria-describedby="idTooltipTarget"
	/>
	<p class="flex flex-col items-center justify-center">
		<span class="label-01 text-text-04">{title}</span>
		<span class="label-01 text-text-03">{subtitle}</span>
	</p>
{:else}
	<Tooltip class={twMerge('w-full', className)} {style}>
		<div
			class={twMerge('h-[8px] w-full bg-[--color]', size === 'l' && 'md:h-[16px]')}
			style:--color={color || '#8D8D8D'}
			aria-describedby="idTooltipTarget"
		/>
		<p slot="tooltip" class="flex flex-col items-center justify-center">
			<span class="label-01 text-text-04">{title}</span>
			<span class="label-01 text-text-03">{subtitle}</span>
		</p>
	</Tooltip>
{/if}
