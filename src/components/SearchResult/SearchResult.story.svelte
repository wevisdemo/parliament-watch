<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchResult from './SearchResult.svelte';
	import type { SearchResults } from '$models/search';
	import { BillStatus } from '$models/bill';
	import { DefaultVotingResult } from '$models/voting';
	export let Hst: Hst;

	const noResults: SearchResults = {};

	const hasPoliticains: SearchResults = {
		politicians: [
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '' },
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '' }
		]
	};

	const searchResults: SearchResults = {
		politicians: [
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '' },
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '' }
		],
		bills: [
			{ heading: 'ร่าง พรบ.สุราก้าวหน้า', billStatus: BillStatus.InProgress, url: '' },
			{ heading: 'ร่าง พรบ.สุขภาพจิต', billStatus: BillStatus.Merged, url: '' },
			{ heading: 'ร่าง พรบ.สุขภาพแห่งชาติ', billStatus: BillStatus.Rejected, url: '' },
			{ heading: 'ร่าง พรบ.สุขาภิบาล', billStatus: BillStatus.Rejected, url: '' },
			{ heading: 'ร่าง พรบ.สุสานและฌาปนสถาน', billStatus: BillStatus.Enacted, url: '' }
		],
		votings: [
			{
				heading: 'ร่าง พรบ.สุราก้าวหน้า (วาระที่ 1)',
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
		],
		billProposers: [
			{
				heading: 'สุชาติ ชมกลิ่น',
				description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ',
				proposedBillsCount: 1,
				url: ''
			},
			{
				heading: 'สุชาติ ชมกลิ่น',
				description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ',
				proposedBillsCount: 1,
				url: ''
			}
		]
	};
</script>

<Hst.Story title="SearchResult" layout={{ type: 'grid', width: '350px' }}>
	<Hst.Variant title="No Results">
		<SearchResult searchResults={noResults} />
	</Hst.Variant>

	<Hst.Variant title="Has some group">
		<SearchResult searchResults={hasPoliticains} />
	</Hst.Variant>

	<Hst.Variant title="Has all groups">
		<SearchResult {searchResults} />
	</Hst.Variant>
</Hst.Story>
