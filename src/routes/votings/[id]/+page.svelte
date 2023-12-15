<script lang="ts">
	export let data;
</script>

<a href="{data.voting.id}/votes">Votes page</a>

<div class="whitespace-pre">
	{JSON.stringify(data, undefined, 2)}
</div>
