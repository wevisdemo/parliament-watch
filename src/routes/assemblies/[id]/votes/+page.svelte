<script lang="ts">
	import VotesBody from '$components/Votes/VotesBody.svelte';
	import VotesHeader from '$components/Votes/VotesHeader.svelte';

	export let data;
</script>

<div>
	<VotesHeader {data} />
	<VotesBody votes={data.votings} />
</div>

<div class="whitespace-pre">{JSON.stringify(data, undefined, 2)}</div>
