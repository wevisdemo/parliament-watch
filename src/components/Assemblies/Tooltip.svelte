<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { run, createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();

	interface Props {
		tooltipText?: string;
		open?: boolean;
		align?: 'start' | 'center' | 'end';
		direction?: 'top' | 'bottom';
		id?: string;
		ref?: HTMLButtonElement | null;
		tooltipStyle?: string;
		showAllTime?: boolean;
		children?: import('svelte').Snippet;
		tooltip?: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let {
		tooltipText = '',
		open = $bindable(false),
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

	const dispatch = createEventDispatcher();

	const hide = () => (open = false || showAllTime);

	const show = () => (open = true);

	run(() => {
		dispatch(open ? 'open' : 'close');
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
		onclick={bubble('click')}
		onmouseover={bubble('mouseover')}
		onmouseenter={bubble('mouseenter')}
		onmouseleave={bubble('mouseleave')}
		onfocus={handlers(bubble('focus'), show)}
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
