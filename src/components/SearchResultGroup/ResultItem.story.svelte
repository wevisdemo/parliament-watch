<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import ResultItem from './ResultItem.svelte';
	import type { SearchResultItem } from '$models/search';
	import { DefaultVotingResult } from '$models/voting';
	export let Hst: Hst;

	interface ResultItemType {
		title: string;
		item: SearchResultItem;
	}

	const resultItems: ResultItemType[] = [
		{
			title: 'Heading and description',
			item: { heading: 'ชื่อหัวข้อ', description: 'คำอธิบาย', url: '' }
		},
		{
			title: 'Heading and billStatus',
			item: { heading: 'ชื่อกฎหมาย', billStatus: 'IN_PROGRESS', url: '' }
		},
		{
			title: 'Heading and voteResult',
			item: { heading: 'ชื่อการลงมติ', voteResult: DefaultVotingResult.Failed, url: '' }
		},
		{
			title: 'Highlight heading',
			item: {
				heading: 'ชื่อหัวข้อ',
				headingHighlight: [
					{ text: 'ชื่อ', highlight: false },
					{ text: 'หัวข้อ', highlight: true }
				],
				description: 'คำอธิบาย',
				url: ''
			}
		}
	];
</script>

<Hst.Story title="ResultItem" layout={{ type: 'grid', width: '350px' }}>
	{#each resultItems as { title, item }}
		<Hst.Variant {title}>
			<ResultItem {item} />
		</Hst.Variant>
	{/each}
</Hst.Story>
