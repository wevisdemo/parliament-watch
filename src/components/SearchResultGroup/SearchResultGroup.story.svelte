<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchResultGroup from './SearchResultGroup.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	export let Hst: Hst;

	const resultItems = [{ heading: 'ร่าง พ.ร.บ.สุราก้าวหน้า', url: '' }];
</script>

<Hst.Story title="SearchResultGroup">
	<SearchResultGroup heading={'การลงมติ'} items={resultItems}>
		<VoteIcon />
	</SearchResultGroup>
</Hst.Story>
