<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchResultGroup from './SearchResultGroup.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import { BillStatus } from '$models/bill';
	import { DefaultVotingResult } from '$models/voting';
	import type { SearchResultItem } from '$models/search';
	export let Hst: Hst;

	const resultItems: SearchResultItem[] = [
		{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '#a' },
		{ heading: 'ร่าง พ.ร.บ.สุขาภิบาล', billStatus: BillStatus.InProgress, url: '#b' },
		{
			heading: 'อภิปรายไม่ไว้วางใจ พลเอก ประวิตร วงษ์สุวรรณ (ก.พ. 65)',
			voteResult: DefaultVotingResult.Passed,
			url: '#c'
		}
	];
</script>

<Hst.Story title="SearchResultGroup">
	<SearchResultGroup heading={'การลงมติ'} items={resultItems}>
		<VoteIcon slot="icon" />
	</SearchResultGroup>
</Hst.Story>
