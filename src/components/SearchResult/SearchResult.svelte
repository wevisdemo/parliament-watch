<script lang="ts">
	import SearchResultGroup from '$components/SearchResultGroup/SearchResultGroup.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import { BillStatus } from '$models/bill';
	import type { SearchIndexes, SearchResultItem } from '$models/search';
	import { DefaultVotingResult } from '$models/voting';

	const searchIndexes: SearchIndexes = {
		politicians: [
			{
				name: 'สุชาติ ชมกลิ่น',
				description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ'
			},
			{
				name: 'สมคิด จาตุศรีพิทักษ์',
				description: 'นายกรัฐมนตรี'
			}
		],

		bills: [
			{
				name: 'ร่าง พ.ร.บ.สุราก้าวหน้า',
				status: BillStatus.Rejected
			},
			{
				name: 'ร่าง พ.ร.บ. งบประมาณรายจ่ายประจําปี 2566',
				status: BillStatus.InProgress
			}
		],

		votings: [
			{
				name: 'ร่าง พ.ร.บ. สุราก้าวหน้า (วาระที่ 1)',
				result: DefaultVotingResult.Failed
			},
			{
				name: 'ร่าง พ.ร.บ. แรงงานสัมพันธ์',
				result: DefaultVotingResult.Passed
			}
		]
	};

	const resultItems: SearchResultItem[] = [
		{
			heading: 'สุชาติ ชมกลิ่น',
			description: 'สส.บัญชีรายชื่อ | รวมไทยสร้างชาติ',
			url: '/politician/1'
		},
		{
			heading: 'สมคิด จาตุศรีพิทักษ์',
			description: 'นายกรัฐมนตรี',
			url: '/politician/2'
		},
		{
			heading: 'ร่าง พ.ร.บ.สุราก้าวหน้า',
			billStatus: BillStatus.InProgress,
			url: '/bill/1'
		},
		{
			heading: 'ร่าง พ.ร.บ. งบประมาณรายจ่ายประจําปี 2566',
			voteResult: DefaultVotingResult.Failed,
			url: '/bill/2'
		}
	];
</script>

<div class="w-[320px] overflow-y-scroll max-h-[calc(100vh-3rem)]">
	<SearchResultGroup heading={'นักการเมือง'} items={resultItems}>
		<PoliticianIcon slot="icon" class="fill-interactive-01" />
	</SearchResultGroup>
	<SearchResultGroup heading={'การออกกฎหมาย'} items={resultItems}>
		<LawIcon slot="icon" class="fill-interactive-01" />
	</SearchResultGroup>
	<SearchResultGroup heading={'การลงมติ'} items={resultItems}>
		<VoteIcon slot="icon" class="fill-interactive-01" />
	</SearchResultGroup>
</div>
