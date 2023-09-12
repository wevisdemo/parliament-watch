<script lang="ts">
	export let data;

	const { politician } = data;
</script>

<h1 class="fluid-heading-05">{politician.firstname} {politician.lastname}</h1>

<p class="whitespace-pre">
	{JSON.stringify(politician, undefined, 4)}
</p>
