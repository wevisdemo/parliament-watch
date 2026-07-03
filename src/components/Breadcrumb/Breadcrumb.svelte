<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	export interface BreadcrumbEntry {
		label: string;
		url?: string;
		hiddenMobile?: boolean;
		hiddenDesktop?: boolean;
	}

	interface Props {
		items: BreadcrumbEntry[];
		noTrailingSlash?: boolean;
		class?: string;
		collapseMobile?: boolean;
		children?: Snippet;
	}

	let {
		items,
		noTrailingSlash = true,
		class: className = '',
		collapseMobile = false,
		children
	}: Props = $props();

	let isMobile = $state(false);

	onMount(() => {
		const mql = window.matchMedia('(min-width: 672px)');
		isMobile = !mql.matches;
		const handler = (e: MediaQueryListEvent) => (isMobile = !e.matches);
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	});
</script>

<Breadcrumb
	{noTrailingSlash}
	class="body-compact-01 w-full overflow-hidden px-4 py-2 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap {className}"
>
	{#if children}
		{@render children()}
	{:else if collapseMobile && isMobile}
		<BreadcrumbItem href={items[0].url} class="min-w-0 max-w-[40vw] shrink">
			<span class="block truncate align-middle">{items[0].label}</span>
		</BreadcrumbItem>
		{#if items.length > 2}
			<BreadcrumbItem class="shrink-0">...</BreadcrumbItem>
		{/if}
		<BreadcrumbItem
			href={items[items.length - 1].url}
			isCurrentPage={items.length === 1}
			class="min-w-0 max-w-[50vw] shrink"
		>
			<span class="block truncate align-middle">{items[items.length - 1].label}</span>
		</BreadcrumbItem>
	{:else}
		{#each items as item, idx (item.label)}
			{@const isLast = idx === items.length - 1}
			{@const hiddenClass = item.hiddenMobile
				? 'hidden md:block'
				: item.hiddenDesktop
					? 'md:hidden'
					: ''}
			<BreadcrumbItem
				href={item.url}
				isCurrentPage={isLast}
				class="min-w-0 max-w-[50vw] shrink md:max-w-none {hiddenClass}"
			>
				<span class="block truncate align-middle">{item.label}</span>
			</BreadcrumbItem>
		{/each}
	{/if}
</Breadcrumb>
