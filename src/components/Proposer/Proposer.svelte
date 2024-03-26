<script lang="ts">
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
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
					<a href="/assemblies/{assembly.id}" class="text-black underline">
						{assembly.abbreviation} ชุดที่ {assembly.term} ({getBudistYear(assembly.startedAt)})
					</a>
				{/if}
			</p>
			<span class="text-sm text-gray-60">พรรค{partyRoles[0].party.name}</span>
		</div>
	{:else if bill.proposedByAssembly}
		{@const { id, name, term, startedAt } = bill.proposedByAssembly}

		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<PoliticianIcon class="stroke-white" size={16} />
		</div>
		<a href="/assemblies/{id}" class="text-sm text-black">
			{name}
			<span class="underline">ชุดที่ {term} ({getBudistYear(startedAt)})</span>
		</a>
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
