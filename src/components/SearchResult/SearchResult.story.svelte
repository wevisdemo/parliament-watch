<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchResult from './SearchResult.svelte';
	import type { SearchResults } from '$models/search';
	import { BillStatus } from '$models/bill';
	import { DefaultVotingResult } from '$models/voting';
	export let Hst: Hst;

	const noResults: SearchResults = {
		politicians: [],
		bills: [],
		votings: []
	};

	const hasPoliticains: SearchResults = {
		politicians: [
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '' },
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '' }
		],
		bills: [],
		votings: []
	};

	const searchResults: SearchResults = {
		politicians: [
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '' },
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '' }
		],
		bills: [
			{ heading: 'ร่าง พ.ร.บ.สุราก้าวหน้า', billStatus: BillStatus.InProgress, url: '' },
			{ heading: 'ร่าง พ.ร.บ.สุขภาพจิต', billStatus: BillStatus.Merged, url: '' },
			{ heading: 'ร่าง พ.ร.บ.สุขภาพแห่งชาติ', billStatus: BillStatus.Rejected, url: '' },
			{ heading: 'ร่าง พ.ร.บ.สุขาภิบาล', billStatus: BillStatus.Rejected, url: '' },
			{ heading: 'ร่าง พ.ร.บ.สุสานและฌาปนสถาน', billStatus: BillStatus.Success, url: '' }
		],
		votings: [
			{
				heading: 'ร่าง พ.ร.บ. สุราก้าวหน้า (วาระที่ 1)',
				voteResult: DefaultVotingResult.Passed,
				url: ''
			},
			{
				heading: 'อภิปรายไม่ไว้วางใจ พลเอก ประวิตร วงษ์สุวรรณ (ก.พ. 65)',
				voteResult: DefaultVotingResult.Failed,
				url: ''
			},
			{
				heading: 'อภิปรายไม่ไว้วางใจสุชาติ ชมกลิ่น (ก.ค.65)',
				voteResult: DefaultVotingResult.Passed,
				url: ''
			}
		]
	};
</script>

<Hst.Story title="SearchResult" layout={{ type: 'grid', width: '350px' }}>
	<Hst.Variant title="No Results">
		<SearchResult searchResults={noResults} />
	</Hst.Variant>

	<Hst.Variant title="Has only one group">
		<SearchResult searchResults={hasPoliticains} />
	</Hst.Variant>

	<Hst.Variant title="Has all groups">
		<SearchResult {searchResults} />
	</Hst.Variant>
</Hst.Story>
