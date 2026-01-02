<script lang="ts" context="module">
	export type AvailableAssembly = {
		id: string;
		term: number | null;
	};
</script>

<script lang="ts">
	import AngleRightIcon from '$components/icons/AngleRightIcon.svelte';
	import { formatThaiYear } from '$lib/date';

	export let term: number;
	export let startedYear: Date;
	export let availableAssemblies: AvailableAssembly[] = [];
	export let linkPostfix = '';

	$: getSameAssemblyPathFromDifferentTerm = (newTerm: number) => {
		const assembly = availableAssemblies.find((assembly) => assembly.term === newTerm);
		return assembly ? `/assemblies/${assembly.id}${linkPostfix ? `/${linkPostfix}` : ''}` : '';
	};

	$: nextUrl = getSameAssemblyPathFromDifferentTerm(term + 1);
	$: prevUrl = getSameAssemblyPathFromDifferentTerm(term - 1);
</script>

<div class="ml-[0px] flex items-center md:ml-[16px]">
	<a class={!prevUrl ? 'pointer-events-none cursor-none' : ''} href={prevUrl}>
		<AngleRightIcon
			fill={!prevUrl ? '#16161640' : '#3904E9'}
			class="ml-[0px] mr-[16px] w-[20px] rotate-180"
		/>
	</a>
	<h3 class="fluid-heading-03">ชุดที่ {term} | {formatThaiYear(startedYear)}</h3>
	<a class={!nextUrl ? 'pointer-events-none cursor-none' : ''} href={nextUrl}>
		<AngleRightIcon fill={!nextUrl ? '#16161640' : '#3904E9'} class="ml-[16px] mr-[0px] w-[20px]" />
	</a>
</div>

<style></style>
