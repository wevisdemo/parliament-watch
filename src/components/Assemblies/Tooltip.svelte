<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tooltipText?: string;
		open?: boolean;
		onopen?: () => void;
		onclose?: () => void;
		align?: 'start' | 'center' | 'end';
		direction?: 'top' | 'bottom';
		id?: string;
		ref?: HTMLButtonElement | null;
		tooltipStyle?: string;
		showAllTime?: boolean;
		children?: Snippet;
		tooltip?: Snippet;
		[key: string]: unknown;
	}

	let {
		tooltipText = '',
		open = $bindable(false),
		onopen,
		onclose,
		align = 'center',
		direction = 'bottom',
		id = 'ccs-' + Math.random().toString(36),
		ref = $bindable(null),
		tooltipStyle = '',
		showAllTime = false,
		children,
		tooltip,
		...rest
	}: Props = $props();

	const hide = () => (open = showAllTime);

	const show = () => (open = true);

	$effect(() => {
		if (open) onopen?.();
		else onclose?.();
	});
</script>

<svelte:window
	onkeydown={({ key }) => {
		if (key === 'Escape') hide();
	}}
/>

<span
	class:bx--tooltip--definition={true}
	class:bx--tooltip--a11y={true}
	{...rest}
	onmouseenter={show}
	onmouseleave={hide}
>
	<button
		bind:this={ref}
		type="button"
		aria-describedby={id}
		class:bx--tooltip--a11y={true}
		class:bx--tooltip__trigger={true}
		class:bx--tooltip__trigger--definition={true}
		class:bx--tooltip--hidden={!open}
		class:bx--tooltip--visible={open}
		class:bx--tooltip--top={direction === 'top'}
		class:bx--tooltip--bottom={direction === 'bottom'}
		class:bx--tooltip--align-start={align === 'start'}
		class:bx--tooltip--align-center={align === 'center'}
		class:bx--tooltip--align-end={align === 'end'}
		style="width: 100%;"
		class="cover"
		onfocus={show}
		onblur={hide}
	>
		{@render children?.()}
	</button>
	<div role="tooltip" {id} class="bx--assistive-text" style={tooltipStyle}>
		{#if tooltip}{@render tooltip()}{:else}{tooltipText}{/if}
	</div>
</span>

<!-- add this component to override tooltip style and slot-->
<style>
	.cover {
		border-bottom: 0px solid transparent !important;
	}
</style>
