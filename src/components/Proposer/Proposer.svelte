<script lang="ts">
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import type { Assembly } from '$models/assembly';
	import dayjs from 'dayjs';

	type CommonProposer = {
		name: string;
		description?: string;
	};

	export let assembly: Assembly | undefined = undefined;
	export let common: CommonProposer | undefined = undefined;

	$: proposerName = () => {
		if (assembly) {
			return assembly.name;
		} else if (common) {
			return common.name;
		}

		return '';
	};

	$: proposerTerm = () => {
		if (assembly) {
			return `ชุดที่ ${assembly.term} (${dayjs(assembly.startedAt).year()})`;
		}

		return '';
	};
</script>

<div class="flex flex-col sm:flex-row items-start sm:items-center">
	<div class="w-6 h-6">
		<!-- <img
			class="w-full h-full rounded-full object-cover"
			loading="lazy"
			decoding="async"
			alt="proposer avatar"
		/> -->
		{#if assembly}
			<div class="flex items-center justify-center w-full h-full rounded-full bg-black">
				<PoliticianIcon class="text-white" />
			</div>
		{/if}
		{#if common}
			<div class="flex items-center justify-center w-full h-full rounded-full bg-black">
				<PeopleIcon class="text-white" />
			</div>
		{/if}
	</div>
	<div class="mt-1 sm:ml-1 break-words">
		<span class="text-text-01">{proposerName()} {proposerTerm()}</span>
		{#if common?.description}
			<span class="text-text-02">{common.description}</span>
		{/if}
	</div>
</div>
