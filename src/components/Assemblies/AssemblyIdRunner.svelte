<script lang="ts">
	import AngleRightIcon from '$components/icons/AngleRightIcon.svelte';

	export let currentId = '';
	export let startedYear: number;
	export let term: number;
	export let assemblyIds: string[] = [];
	export let postfix = '';

	$: nextUrl = (() => {
		const current = assemblyIds.findIndex((id) => id === currentId);
		if (current === assemblyIds.length - 1) return '';
		const next = assemblyIds[current + 1];
		return next ? `/assemblies/${next}${postfix ? `/${postfix}` : ''}` : '';
	})();

	$: prevUrl = (() => {
		const current = assemblyIds.findIndex((id) => id === currentId);
		if (current === 0) return '';
		const prev = assemblyIds[current - 1];
		return prev ? `/assemblies/${prev}${postfix ? `/${postfix}` : ''}` : '';
	})();
</script>

<div class="flex items-center md:ml-[16px] ml-[0px]">
	<a
		class={`${!prevUrl ? 'pointer-events-none' : ''} ${!prevUrl ? 'cursor-none' : ''}`}
		href={prevUrl}
	>
		<AngleRightIcon
			fill={!prevUrl ? '#16161640' : '#3904E9'}
			class="rotate-180 w-[20px] mr-[16px] ml-[0px]"
		/>
	</a>
	<h3 class="fluid-heading-03">ชุดที่ {term} | {startedYear}</h3>
	<a
		class={`${!nextUrl ? 'pointer-events-none' : ''} ${!nextUrl ? 'cursor-none' : ''}`}
		href={nextUrl}
	>
		<AngleRightIcon fill={!nextUrl ? '#16161640' : '#3904E9'} class="w-[20px] ml-[16px] mr-[0px]" />
	</a>
</div>

<style></style>
