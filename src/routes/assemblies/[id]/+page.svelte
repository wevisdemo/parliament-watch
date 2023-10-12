<script lang="ts">
	import Header from '$components/assemblies/header.svelte';

	export let data;
</script>

<div class="md:px-[64px] px-[16px]">
	<Header data={data.assembly} />
</div>

<!-- <div class="whitespace-pre">
	{JSON.stringify(data, undefined, 2)}
</div> -->
