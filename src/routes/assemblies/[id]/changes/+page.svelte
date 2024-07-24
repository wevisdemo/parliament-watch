<script lang="ts">
	export let data;

	$: ({ assembly, availableAssemblies, assemblyRoles, members } = data);
</script>

<h2 class="font-bold">assembly</h2>
<p class="whitespace-pre">{JSON.stringify(assembly, undefined, 2)}</p>

<h2 class="font-bold">availableAssemblies</h2>
<p class="whitespace-pre">{JSON.stringify(availableAssemblies, undefined, 2)}</p>

<h2 class="font-bold">assemblyRoles</h2>
<p class="whitespace-pre">{JSON.stringify(assemblyRoles, undefined, 2)}</p>

<h2 class="font-bold">members</h2>
<p class="whitespace-pre">{JSON.stringify(members, undefined, 2)}</p>
