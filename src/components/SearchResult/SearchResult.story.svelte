<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import SearchResult from './SearchResult.svelte';
	import type { SearchResults } from '$models/search';
	import { BillStatus } from '$models/bill';
	import { DefaultVotingResult } from '$models/voting';
	export let Hst: Hst;

	const noResults: SearchResults = {};

	const positicians: SearchResults = {
		politicians: [
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '#a' },
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '#b' }
		]
	};

	const searchResults: SearchResults = {
		politicians: [
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '#c' },
			{ heading: 'สุชาติ ชมกลิ่น', description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ', url: '#d' }
		],
		bills: [
			{ heading: 'ร่าง พ.ร.บ.สุราก้าวหน้า', billStatus: BillStatus.InProgress, url: '#e' },
			{ heading: 'ร่าง พ.ร.บ.สุขภาพจิต', billStatus: BillStatus.Merged, url: '#f' },
			{ heading: 'ร่าง พ.ร.บ.สุขภาพแห่งชาติ', billStatus: BillStatus.Rejected, url: '#g' },
			{ heading: 'ร่าง พ.ร.บ.สุขาภิบาล', billStatus: BillStatus.Rejected, url: '#h' },
			{ heading: 'ร่าง พ.ร.บ.สุสานและฌาปนสถาน', billStatus: BillStatus.Enacted, url: '#i' }
		],
		votings: [
			{
				heading: 'ร่าง พ.ร.บ.สุราก้าวหน้า (วาระที่ 1)',
				voteResult: DefaultVotingResult.Passed,
				url: '#j'
			},
			{
				heading: 'อภิปรายไม่ไว้วางใจ พลเอก ประวิตร วงษ์สุวรรณ (ก.พ. 65)',
				voteResult: DefaultVotingResult.Failed,
				url: '#k'
			},
			{
				heading: 'อภิปรายไม่ไว้วางใจสุชาติ ชมกลิ่น (ก.ค.65)',
				voteResult: DefaultVotingResult.Passed,
				url: '#l'
			}
		],
		billProposers: [
			{
				heading: 'สุชาติ ชมกลิ่น',
				description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ',
				proposedBillsCount: 1,
				url: '#m'
			},
			{
				heading: 'สุชาติ ชมกลิ่น',
				description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ',
				proposedBillsCount: 1,
				url: '#n'
			}
		]
	};
</script>

<Hst.Story title="SearchResult" layout={{ type: 'grid', width: '350px' }}>
	<Hst.Variant title="No Results">
		<SearchResult searchResults={noResults} />
	</Hst.Variant>

	<Hst.Variant title="Has some group">
		<SearchResult searchResults={positicians} />
	</Hst.Variant>

	<Hst.Variant title="Has all groups">
		<SearchResult {searchResults} />
	</Hst.Variant>
</Hst.Story>
