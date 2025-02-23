<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import PromiseCard from './PromiseCard.svelte';
	import { PromiseStatus, type PromiseSummary } from '$models/promise';

	export let Hst: Hst;

	let statements = [
		'1 กีฬา 1 รัฐวิสาหกิจพลัส (OSOS) จับคู่รัฐวิสาหกิจที่มีกำไรและหน่วยงานรัฐ-เอกชนมาสนับสนุนสมาคมกีฬา'
	];
	let party = {
		name: 'เพื่อไทย',
		color: '#F41724',
		logo: '/images/parties/เพื่อไทย.webp'
	};

	let keywords = ['Soft Power', 'THACCA', 'กีฬา'];
	let categories = ['วัฒนธรรม'];

	let dateString = '2024-10-24T00:00:00.000Z';
	let status = PromiseStatus.fulfilled;

	let statusOptions = [
		{ label: 'notStarted', value: PromiseStatus.notStarted },
		{ label: 'inProgress', value: PromiseStatus.inProgress },
		{ label: 'clarifying', value: PromiseStatus.clarifying },
		{ label: 'fulfilled', value: PromiseStatus.fulfilled },
		{ label: 'unhonored', value: PromiseStatus.unhonored }
	];

	$: promiseSummary = {
		id: 'PST-33',
		status,
		statements,
		keywords,
		categories,
		party,
		latestProgressDate: new Date(dateString)
	};
</script>

<Hst.Story title="PromiseCard">
	<Hst.Variant title="PromiseCard.notList">
		<PromiseCard
			id={promiseSummary.id}
			status={promiseSummary.status}
			latestProgressDate={promiseSummary.latestProgressDate}
			party={promiseSummary.party}
			statements={promiseSummary.statements}
			keywords={promiseSummary.keywords}
			categories={promiseSummary.categories}
			isList={false}
		/>
	</Hst.Variant>
	<Hst.Variant title="PromiseCard.isList">
		<PromiseCard
			id={promiseSummary.id}
			status={promiseSummary.status}
			latestProgressDate={promiseSummary.latestProgressDate}
			party={promiseSummary.party}
			statements={promiseSummary.statements}
			keywords={promiseSummary.keywords}
			categories={promiseSummary.categories}
			isList={true}
		/>
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Select title="status" bind:value={status} options={statusOptions} />
		<Hst.Json title="statements" bind:value={statements} />
		<Hst.Json title="keywords" bind:value={keywords} />
		<Hst.Json title="categories" bind:value={categories} />
		<Hst.Json title="party" bind:value={party} />
		<Hst.Text title="latestProgressDate" bind:value={dateString} />
	</svelte:fragment>
</Hst.Story>
