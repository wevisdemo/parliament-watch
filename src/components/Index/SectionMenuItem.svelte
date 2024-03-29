<script lang="ts">
	import { ArrowDown } from 'carbon-icons-svelte';
	import type { ComponentType } from 'svelte';

	export let title: string;
	export let description: string;
	export let href: string;
	export let icon: ComponentType;
</script>

<li class="flex-1">
	<a
		{href}
		class="body-01 flex items-start gap-3 bg-white p-4 text-[color:inherit] !no-underline hover:bg-ui-01 md:flex-col md:items-center md:gap-1 md:p-8 md:text-center"
	>
		<svelte:component this={icon} class="aspect-square h-auto w-6 md:w-8" />
		<span class="flex flex-1 flex-col gap-1">
			<span class="fluid-heading-03">{title}</span>
			<span>{description}</span>
		</span>
		<ArrowDown />
	</a>
</li>
