<script lang="ts">
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import { AssemblyName } from '$models/assembly';
	import type { Bill } from '$models/bill';
	import dayjs from 'dayjs';
	import 'dayjs/locale/th';
	import buddhistEra from 'dayjs/plugin/buddhistEra';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');

	export let bill: Bill;
	export let orientation: 'landscape' | 'portrait' = 'landscape';

	$: isLandscape = orientation === 'landscape';

	function getBudistYear(date: Date) {
		return dayjs(date).format('BBBB');
	}
</script>

<div class="flex {isLandscape ? 'flex-col gap-x-2 md:flex-row' : 'flex-col'}">
	{#if bill.proposedLedByPolitician}
		{@const { id, firstname, lastname, avatar, assemblyRoles, partyRoles } =
			bill.proposedLedByPolitician}

		{@const matchedAssemblyRole = assemblyRoles.find(
			({ startedAt, endedAt }) =>
				bill.proposedOn.getTime() >= startedAt.getTime() &&
				(!endedAt || bill.proposedOn.getTime() <= endedAt.getTime())
		)}

		{@const matchedPartyRoles = partyRoles.find(
			({ startedAt, endedAt }) =>
				bill.proposedOn.getTime() >= startedAt.getTime() &&
				(!endedAt || bill.proposedOn.getTime() <= endedAt.getTime())
		)}

		<figure class="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-20">
			<img src={avatar} alt="{firstname} {lastname}" class="h-full w-full" loading="lazy" />
		</figure>
		<div>
			<p class="text-sm">
				<a href="/politicians/{id}" class="text-black">
					{firstname}
					{lastname}
				</a>
				{#if matchedAssemblyRole}
					{@const { assembly } = matchedAssemblyRole}
					<!-- TODO: cabinet is not released yet -->
					{@const isCabinet = assembly.name === AssemblyName.Cabinet}
					<svelte:element
						this={isCabinet ? 'p' : 'a'}
						href={isCabinet ? undefined : `/assemblies/${assembly.id}`}
						class="text-sm text-black {isCabinet ? '' : 'underline'}"
					>
						{assembly.abbreviation} ชุดที่ {assembly.term} ({getBudistYear(assembly.startedAt)})
					</svelte:element>
				{/if}
			</p>
			{#if matchedPartyRoles}
				<span class="text-sm text-gray-60">พรรค{matchedPartyRoles.party.name}</span>
			{/if}
		</div>
	{:else if bill.proposedByAssembly}
		{@const { id, name, term, startedAt } = bill.proposedByAssembly}
		<!-- TODO: cabinet is not released yet -->
		{@const isCabinet = name === AssemblyName.Cabinet}
		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<svelte:component
				this={isCabinet ? GeneralIcon : PoliticianIcon}
				class="stroke-white"
				size={16}
			/>
		</div>
		<svelte:element
			this={isCabinet ? 'p' : 'a'}
			href={isCabinet ? undefined : `/assemblies/${id}`}
			class="text-sm text-black"
		>
			{name}
			<span class="underline">ชุดที่ {term} ({getBudistYear(startedAt)})</span>
		</svelte:element>
	{:else if bill.proposedByPeople}
		{@const { ledBy, signatoryCount } = bill.proposedByPeople}

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
