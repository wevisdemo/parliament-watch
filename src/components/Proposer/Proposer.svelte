<script context="module" lang="ts">
	export type PoliticianProposer = {
		id: string;
		name: string;
		image: string | null;
		assembly?: {
			id: string;
			abbreviation: string | null;
			term: number | null;
			startedAt: Date | string | null;
		};
		partyName?: string;
	};

	export type AssemblyProposer = {
		id: string;
		abbreviation: string;
		term: number;
		startedAt: Date | string | null;
	};

	export type PeopleProposer = {
		ledBy: string;
		signatoryCount: number;
	};
</script>

<script lang="ts">
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import dayjs from 'dayjs';
	import 'dayjs/locale/th';
	import buddhistEra from 'dayjs/plugin/buddhistEra';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');

	export let proposer: PoliticianProposer | AssemblyProposer | PeopleProposer | undefined =
		undefined;
	export let orientation: 'landscape' | 'portrait' = 'landscape';

	$: isLandscape = orientation === 'landscape';

	function getBudistYear(date: string | Date) {
		return dayjs(date).format('BBBB');
	}
</script>

<div class="flex items-center {isLandscape ? 'flex-col gap-x-2 md:flex-row' : 'flex-col'}">
	{#if proposer === undefined}
		<p class="text-sm text-gray-60">ไม่พบข้อมูล</p>
	{:else if 'image' in proposer}
		{@const { id, name, image, assembly, partyName } = proposer}
		<figure class="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-20">
			<img
				src={image || '/images/politicians/_placeholder.webp'}
				alt=""
				class="h-full w-full"
				loading="lazy"
			/>
		</figure>
		<p class="text-sm">
			<a href="/politicians/{id}" class="text-black">
				{name}
			</a>
			{#if assembly}
				<a href="/assemblies/{assembly.id}" class="text-sm text-black underline">
					{assembly.abbreviation} ชุดที่ {assembly.term}
					{#if assembly.startedAt}
						({getBudistYear(assembly.startedAt)})
					{/if}
				</a>
			{/if}
		</p>
		{#if partyName}
			<span class="text-sm text-gray-60">พรรค{partyName}</span>
		{/if}
	{:else if 'term' in proposer}
		{@const { id, abbreviation, term, startedAt } = proposer}
		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<svelte:component
				this={abbreviation === 'ครม.' ? GeneralIcon : PoliticianIcon}
				class="stroke-white"
				size={16}
			/>
		</div>
		<a href="/assemblies/{id}" class="text-sm text-black">
			{abbreviation}
			<span class="underline"
				>ชุดที่ {term}
				{#if startedAt}
					({getBudistYear(startedAt)})
				{/if}
			</span>
		</a>
	{:else}
		{@const { ledBy, signatoryCount } = proposer}
		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<PeopleIcon class="stroke-white" size={16} />
		</div>
		<p class="text-sm text-black">
			{ledBy}
			{#if signatoryCount}
				<span class="text-gray-60">และประชาชน {signatoryCount.toLocaleString()} คน</span>
			{/if}
		</p>
	{/if}
</div>
