<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		color?: string;
		title?: string;
		subtitle?: string;
		size?: 's' | 'l';
		class?: string;
		style?: string;
	}

	let {
		color = '#8D8D8D',
		title = '',
		subtitle = '',
		size = 's',
		class: className = '',
		style = ''
	}: Props = $props();
</script>

{#if subtitle === '' && title === ''}
	<div
		class={twMerge('h-[8px] w-full bg-[--color]', size === 'l' && 'md:h-[16px]', className)}
		style:--color={color || '#8D8D8D'}
		{style}
		aria-describedby="idTooltipTarget"
	></div>
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
		></div>
		{#snippet tooltip()}
			<p class="flex flex-col items-center justify-center">
				<span class="label-01 text-text-04">{title}</span>
				<span class="label-01 text-text-03">{subtitle}</span>
			</p>
		{/snippet}
	</Tooltip>
{/if}
