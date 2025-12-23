<script lang="ts" context="module">
	export type AvailableAssembly = {
		id: string;
		term: number | null;
		founding_date: string | null;
	};
</script>

<script lang="ts">
	import AngleRightIcon from '$components/icons/AngleRightIcon.svelte';
	import { formatThaiYear } from '$lib/date';

	export let id: string;
	export let availableAssemblies: AvailableAssembly[] = [];
	export let getAssemblyPath: (_: AvailableAssembly) => string;
	export let overwriteDisplayString: string | undefined = undefined;

	$: currentIndex = Array.isArray(availableAssemblies)
		? availableAssemblies.findIndex((assembly) => assembly.id === id)
		: 0;

	$: prevUrl = currentIndex > 0 ? getAssemblyPath(availableAssemblies[currentIndex - 1]) : null;

	$: nextUrl =
		currentIndex < availableAssemblies.length - 1
			? getAssemblyPath(availableAssemblies[currentIndex + 1])
			: null;

	$: yearString = availableAssemblies[currentIndex]?.founding_date
		? formatThaiYear(availableAssemblies[currentIndex]?.founding_date)
		: null;

	let displayString = '-';
	$: {
		if (overwriteDisplayString) {
			displayString = overwriteDisplayString;
		} else if (currentIndex >= 0 && availableAssemblies[currentIndex]?.term != null && yearString) {
			displayString = `ชุดที่ ${availableAssemblies[currentIndex].term} | ${yearString}`;
		} else if (currentIndex >= 0 && availableAssemblies[currentIndex]?.term != null) {
			displayString = `ชุดที่ ${availableAssemblies[currentIndex].term}`;
		} else if (yearString) {
			displayString = `ปี ${yearString}`;
		} else {
			displayString = '-';
		}
	}
</script>

<div class="ml-[0px] flex items-center md:ml-[16px]">
	<a class={!prevUrl ? 'pointer-events-none cursor-none' : ''} href={prevUrl}>
		<AngleRightIcon
			fill={!prevUrl ? '#16161640' : '#3904E9'}
			class="ml-[0px] mr-[16px] w-[20px] rotate-180"
		/>
	</a>
	<h3 class="fluid-heading-03">{displayString}</h3>
	<a class={!nextUrl ? 'pointer-events-none cursor-none' : ''} href={nextUrl}>
		<AngleRightIcon fill={!nextUrl ? '#16161640' : '#3904E9'} class="ml-[16px] mr-[0px] w-[20px]" />
	</a>
</div>

<style></style>
