<script lang="ts">
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import type { Assembly } from '$models/assembly';
	import type { Party } from '$models/party';
	import type { Politician } from '$models/politician';
	import dayjs from 'dayjs';
	import 'dayjs/locale/th';
	import buddhistEra from 'dayjs/plugin/buddhistEra';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');

	type CommonProposer = {
		name: string;
		description?: string;
	};

	type PartyPolitician = {
		politician: Politician;
		assembly: Assembly;
		party: Party;
	};

	export let partyPolitician: PartyPolitician | undefined = undefined;
	export let assembly: Assembly | undefined = undefined;
	export let common: CommonProposer | undefined = undefined;

	$: proposerName = () => {
		if (partyPolitician) {
			const { politician } = partyPolitician;
			return [politician.prefix ?? '', politician.firstname, politician.lastname].join(' ');
		} else if (assembly) {
			return assembly.name;
		} else if (common) {
			return common.name;
		}

		return '';
	};

	const getAssemblyTermText = (assembly: Assembly) =>
		`ชุดที่ ${assembly.term} (${dayjs(assembly.startedAt).format('BBBB')})`;

	$: proposerTerm = () => {
		if (partyPolitician?.assembly) {
			return `${partyPolitician.assembly.abbreviation} ${getAssemblyTermText(
				partyPolitician.assembly
			)}`;
		} else if (assembly) {
			return getAssemblyTermText(assembly);
		}

		return '';
	};
</script>

<div class="flex flex-col sm:flex-row justify-start items-start">
	<div class="w-6 h-6 mb-1">
		{#if partyPolitician}
			<img
				class="w-full h-full rounded-full object-cover"
				loading="lazy"
				decoding="async"
				alt={`${partyPolitician.politician.firstname} ${partyPolitician.politician.lastname}`}
				src={partyPolitician.politician.avatar}
			/>
		{:else if assembly}
			<div class="flex items-center justify-center w-full h-full rounded-full bg-black">
				<PoliticianIcon class="text-white" />
			</div>
		{:else if common}
			<div class="flex items-center justify-center w-full h-full rounded-full bg-black">
				<PeopleIcon class="text-white" />
			</div>
		{/if}
	</div>
	<p class="body-01 sm:ml-1 break-words">
		<span class="text-text-01">{proposerName()} {proposerTerm()}</span>
		{#if common?.description}
			<span class="text-text-02">{common.description}</span>
		{/if}
		{#if partyPolitician?.party.name}
			<br /><span class="text-text-02">พรรค{partyPolitician?.party.name}</span>
		{/if}
	</p>
</div>
