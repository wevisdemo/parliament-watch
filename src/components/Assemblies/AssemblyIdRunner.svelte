<script lang="ts" module>
	export type AvailableAssembly = {
		id: string;
		term: number | null;
		founding_date: string | null;
	};
</script>

<script lang="ts">
	import AngleRightIcon from '$components/icons/AngleRightIcon.svelte';
	import { formatThaiYear } from '$lib/date';

	interface Props {
		id: string;
		availableAssemblies?: AvailableAssembly[];
		getAssemblyPath: (_: AvailableAssembly) => string;
		termPrefix?: string;
	}

	let { id, availableAssemblies = [], getAssemblyPath, termPrefix = '' }: Props = $props();

	let currentIndex = $derived(
		Array.isArray(availableAssemblies)
			? availableAssemblies.findIndex((assembly) => assembly.id === id)
			: 0
	);

	let prevUrl = $derived(
		currentIndex > 0 ? getAssemblyPath(availableAssemblies[currentIndex - 1]) : null
	);

	let nextUrl = $derived(
		currentIndex < availableAssemblies.length - 1
			? getAssemblyPath(availableAssemblies[currentIndex + 1])
			: null
	);

	let yearString = $derived(
		availableAssemblies[currentIndex]?.founding_date
			? formatThaiYear(availableAssemblies[currentIndex]?.founding_date)
			: null
	);

	let displayString = $derived.by(() => {
		const assembly = availableAssemblies[currentIndex];
		const term = assembly?.term;
		const hasTerm = currentIndex >= 0 && term != null;
		if (hasTerm && yearString) return `ชุดที่ ${term} | ${yearString}`;
		if (hasTerm) return `ชุดที่ ${term}`;
		if (yearString) return `ปี ${yearString}`;
		return '-';
	});
</script>

<div class="ml-[0px] flex items-center md:ml-[16px]">
	<a class={!prevUrl ? 'pointer-events-none cursor-none' : ''} href={prevUrl}>
		<AngleRightIcon
			fill={!prevUrl ? '#16161640' : '#3904E9'}
			class="ml-[0px] mr-[16px] w-[20px] rotate-180"
		/>
	</a>
	<h3 class="fluid-heading-03">{termPrefix} {displayString}</h3>
	<a class={!nextUrl ? 'pointer-events-none cursor-none' : ''} href={nextUrl}>
		<AngleRightIcon fill={!nextUrl ? '#16161640' : '#3904E9'} class="ml-[16px] mr-[0px] w-[20px]" />
	</a>
</div>

<style></style>
