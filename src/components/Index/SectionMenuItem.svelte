<script lang="ts">
	import type { CarbonIconProps } from 'carbon-icons-svelte';
	import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';
	import type { Component } from 'svelte';

	interface Props {
		title: string;
		description: string;
		href?: string | undefined;
		icon: Component<CarbonIconProps>;
	}

	let { title, description, href = undefined, icon }: Props = $props();

	const SvelteComponent = $derived(icon);
</script>

<li class="flex w-full flex-1">
	<a
		{href}
		class="body-01 flex w-full items-start gap-3 bg-white p-4 text-[color:inherit] !no-underline md:flex-col md:items-center md:gap-1 md:p-8 md:text-center {href
			? 'hover:bg-ui-01'
			: 'opacity-50'}"
		aria-disabled={!href}
	>
		<SvelteComponent class="aspect-square h-auto w-6 md:w-8" />
		<span class="flex flex-1 flex-col gap-1">
			<span class="fluid-heading-03">{title}</span>
			<span>{description}</span>
		</span>
		<ArrowDown />
	</a>
</li>
