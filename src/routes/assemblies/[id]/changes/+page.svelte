<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';

	export let data;

	$: ({ assembly, availableAssemblies, assemblyRoles, members } = data);
</script>

<div class="px-[16px] md:px-[64px]">
	<Breadcrumb
		noTrailingSlash
		class="my-[8px] [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
		<BreadcrumbItem class="hidden md:block">นักการเมือง</BreadcrumbItem>
		<BreadcrumbItem class="hidden md:block" href="/assemblies/{assembly.id}"
			>{assembly.name}</BreadcrumbItem
		>
		<BreadcrumbItem class="hidden md:block">การปรับ ครม.</BreadcrumbItem>
	</Breadcrumb>
	<Header
		headerName="การปรับคณะรัฐมนตรี"
		{assembly}
		{availableAssemblies}
		showStatus={false}
		showRemark={false}
		postfixLink="changes"
	/>
</div>

<h2 class="font-bold">assembly</h2>
<p class="whitespace-pre">{JSON.stringify(assembly, undefined, 2)}</p>

<h2 class="font-bold">availableAssemblies</h2>
<p class="whitespace-pre">{JSON.stringify(availableAssemblies, undefined, 2)}</p>

<h2 class="font-bold">assemblyRoles</h2>
<p class="whitespace-pre">{JSON.stringify(assemblyRoles, undefined, 2)}</p>

<h2 class="font-bold">members</h2>
<p class="whitespace-pre">{JSON.stringify(members, undefined, 2)}</p>
