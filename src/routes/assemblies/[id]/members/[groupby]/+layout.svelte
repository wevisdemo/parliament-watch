<script lang="ts">
	import Header from '$components/Assemblies/Members/Header.svelte';
	import { onMount } from 'svelte';

	export let data;

	let searchQuery = '';
	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<Header {data} {searchQuery} {mounted} />

<b>Assembly member child route:</b>

<slot />
