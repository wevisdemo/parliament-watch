<script lang="ts">
	export let data;
	$: ({ assembly, groupByTabs } = data);
</script>

<b>Assembly member layout:</b>

<div class="whitespace-pre">
	{JSON.stringify(assembly, undefined, 2)}
</div>

<div class="my-6 flex flex-row gap-2">
	{#each groupByTabs as { label, path, isActive }}
		<a href="/assemblies/{assembly.id}/members/{path}" class:underline={isActive}>{label}</a>
	{/each}
</div>

<b>Assembly member child route:</b>

<slot />
