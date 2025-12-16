<script context="module" lang="ts">
	export type PoliticianProposer = {
		id: string;
		name: string;
		image?: string | null;
		assemblyPost?: string;
		assembly?: AssemblyProposer;
		partyName?: string;
	};

	export type AssemblyProposer = {
		id: string;
		name: string;
		founding_date: Date | string | null;
	};

	export type PeopleProposer = {
		name: string;
		signatoryCount: number;
	};
</script>

<script lang="ts">
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import { BillProposerType } from '$models/bill';
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
		<p class="text-sm text-gray-60">{BillProposerType.Unknown}</p>
	{:else if 'founding_date' in proposer}
		<!-- Assembly -->
		{@const { id, name, founding_date } = proposer}
		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<PoliticianIcon class="stroke-white" size={16} />
		</div>
		<a href="/assemblies/{id}" class="text-sm text-black underline">
			{name}
			{#if founding_date}
				({getBudistYear(founding_date)})
			{/if}
		</a>
	{:else if 'signatoryCount' in proposer}
		<!-- People -->
		{@const { name, signatoryCount } = proposer}
		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<PeopleIcon class="stroke-white" size={16} />
		</div>
		<p class="text-sm text-black">
			{name}
			{#if signatoryCount}
				<span class="text-gray-60">และประชาชน {signatoryCount.toLocaleString()} คน</span>
			{/if}
		</p>
	{:else}
		<!-- Politicians -->
		{@const { id, name, image, assemblyPost, assembly, partyName } = proposer}
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
					{assemblyPost || assembly.name}
					{#if assembly.founding_date}
						({getBudistYear(assembly.founding_date)})
					{/if}
				</a>
			{/if}
		</p>
		{#if partyName}
			<p class="text-sm text-gray-60">พรรค{partyName}</p>
		{/if}
	{/if}
</div>
