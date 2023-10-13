<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import Overall from '$components/Assemblies/Overall.svelte';

	export let data;
</script>

<div class="md:px-[64px] px-[16px]">
	<Header data={data.assembly} />
	<Overall />
</div>

<!-- <div class="whitespace-pre">
	{JSON.stringify(data, undefined, 2)}
</div> -->
