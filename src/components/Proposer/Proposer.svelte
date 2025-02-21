<script context="module" lang="ts">
	export type PoliticianProposer = {
		id: string;
		firstname: string;
		lastname: string;
		avatar: string;
		assembly?: {
			id: string;
			name: string;
			term: number;
			startedAt: Date;
		};
		partyName?: string;
	};

	export type AssemblyProposer = {
		id: string;
		isCabinet: boolean;
		name: string;
		term: number;
		startedAt: Date;
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

	export let politician: PoliticianProposer | undefined = undefined;
	export let assembly: AssemblyProposer | undefined = undefined;
	export let people: PeopleProposer | undefined = undefined;

	export let orientation: 'landscape' | 'portrait' = 'landscape';

	$: isLandscape = orientation === 'landscape';

	function getBudistYear(date: Date) {
		return dayjs(date).format('BBBB');
	}
</script>

<div class="flex {isLandscape ? 'flex-col gap-x-2 md:flex-row' : 'flex-col'}">
	{#if politician}
		{@const { id, firstname, lastname, avatar, assembly, partyName } = politician}
		<figure class="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-20">
			<img src={avatar} alt="{firstname} {lastname}" class="h-full w-full" loading="lazy" />
		</figure>
		<div>
			<p class="text-sm">
				<a href="/politicians/{id}" class="text-black">
					{firstname}
					{lastname}
				</a>
				{#if assembly}
					<a href={`/assemblies/${assembly.id}`} class="text-sm text-black underline">
						{assembly.name} ชุดที่ {assembly.term} ({getBudistYear(assembly.startedAt)})
					</a>
				{/if}
			</p>
			{#if partyName}
				<span class="text-sm text-gray-60">พรรค{partyName}</span>
			{/if}
		</div>
	{:else if assembly}
		{@const { id, name, term, isCabinet, startedAt } = assembly}
		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<svelte:component
				this={isCabinet ? GeneralIcon : PoliticianIcon}
				class="stroke-white"
				size={16}
			/>
		</div>
		<a href={`/assemblies/${id}`} class="text-sm text-black">
			{name}
			<span class="underline">ชุดที่ {term} ({getBudistYear(startedAt)})</span>
		</a>
	{:else if people}
		{@const { ledBy, signatoryCount } = people}

		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<PeopleIcon class="stroke-white" size={16} />
		</div>
		<p class="text-sm text-black">
			{ledBy}
			{#if signatoryCount}
				<span class="text-gray-60">และประชาชน {signatoryCount} คน</span>
			{/if}
		</p>
	{:else}
		<p class="text-sm text-gray-60">ไม่พบข้อมูล</p>
	{/if}
</div>
