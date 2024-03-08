<script lang="ts">
	import AngleRightIcon from '$components/icons/AngleRightIcon.svelte';
	import dayjs from 'dayjs';
	import 'dayjs/locale/th';
	import buddhistEra from 'dayjs/plugin/buddhistEra';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');

	export let currentId = '';
	export let startedYear: Date;
	export let term: number;
	export let assemblyIds: string[] = [];
	export let postfix = '';

	$: formattedYear = dayjs(startedYear).format('BBBB');

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

<div class="ml-[0px] flex items-center md:ml-[16px]">
	<a
		class={`${!prevUrl ? 'pointer-events-none' : ''} ${!prevUrl ? 'cursor-none' : ''}`}
		href={prevUrl}
	>
		<AngleRightIcon
			fill={!prevUrl ? '#16161640' : '#3904E9'}
			class="ml-[0px] mr-[16px] w-[20px] rotate-180"
		/>
	</a>
	<h3 class="fluid-heading-03">ชุดที่ {term} | {formattedYear}</h3>
	<a
		class={`${!nextUrl ? 'pointer-events-none' : ''} ${!nextUrl ? 'cursor-none' : ''}`}
		href={nextUrl}
	>
		<AngleRightIcon fill={!nextUrl ? '#16161640' : '#3904E9'} class="ml-[16px] mr-[0px] w-[20px]" />
	</a>
</div>

<style></style>
