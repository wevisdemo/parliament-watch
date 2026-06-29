<script lang="ts">
	import SearchInput from '$components/SearchInput/SearchInput.svelte';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';
	import type { SearchIndexCategory, SearchResults } from '$models/search';
	import { Search } from 'carbon-components-svelte';
	import type { CarbonIconProps } from 'carbon-icons-svelte';
	import type { Component } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		title: string;
		icon: Component<CarbonIconProps>;
		searchPlaceholder: string;
		searchCategories?: SearchIndexCategory[];
		class?: string;
		description?: Snippet;
		children?: Snippet;
	}

	let {
		id,
		title,
		icon: Icon,
		searchPlaceholder,
		searchCategories = [],
		class: className = '',
		description,
		children
	}: Props = $props();

	let searchResults: SearchResults | null = $state(null);
</script>

<section {id} class={className}>
	<div class="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-[72px] text-text-01">
		<div class="flex flex-col items-start gap-2 md:flex-row">
			<div class="flex items-center gap-2 md:flex-1">
				<Icon width="32" height="32" />
				<h2 class="fluid-heading-05">{title}</h2>
			</div>
			<div class="body-01 flex items-center self-stretch md:flex-1">
				{@render description?.()}
			</div>
		</div>
		{#if searchCategories.length > 0}
			<div class="relative">
				<SearchInput
					as={Search}
					size="lg"
					placeholder={searchPlaceholder}
					categories={searchCategories}
					bind:searchResults
				/>
				{#if searchResults}
					<SearchResult {searchResults} class="absolute left-0 z-10 w-full" />
				{/if}
			</div>
		{/if}
		{@render children?.()}
	</div>
</section>
