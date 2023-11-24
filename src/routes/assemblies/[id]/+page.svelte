<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import LatestVotes from '$components/Assemblies/LatestVotes.svelte';
	import MainMembers from '$components/Assemblies/MainMembers.svelte';
	import Summary from '$components/Assemblies/Summary.svelte';

	export let data;
</script>

<div class="md:px-[64px] px-[16px]">
	<Header data={data.assembly} />
	<Summary
		summary={data.summary}
		houseLevel={data.assembly.abbreviation === 'สส.' ? 'lower' : 'upper'}
	/>
	<MainMembers members={data.mainMembers} assemblyId={data.assembly.id} />
	<LatestVotes votes={data.latestVotes} assemblyId={data.assembly.id} />
</div>
