<script lang="ts">
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import type { SearchResultItem } from '$models/search';
	import { DefaultVotingResult } from '$models/voting';
	import SearchResultGroup from './SearchResultGroup.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	let { Hst }: { Hst: HstStory } = $props();

	const resultItems: SearchResultItem[] = [
		{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '#a' },
		{ heading: 'ร่าง พ.ร.บ.สุขาภิบาล', billStatus: 'IN_PROGRESS', url: '#b' },
		{
			heading: 'อภิปรายไม่ไว้วางใจ พลเอก ประวิตร วงษ์สุวรรณ (ก.พ. 65)',
			voteResult: DefaultVotingResult.Passed,
			url: '#c'
		}
	];
</script>

<Hst.Story title="SearchResultGroup">
	<SearchResultGroup heading="การลงมติ" items={resultItems}>
		{#snippet icon()}
			<VoteIcon />
		{/snippet}
	</SearchResultGroup>
</Hst.Story>
