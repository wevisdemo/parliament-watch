<script lang="ts">
	import Sidebar from '$components/LegislativeProcess/Sidebar.svelte';
	import { sections } from '$components/LegislativeProcess/data';
	import DutiesSection from '$components/LegislativeProcess/sections/DutiesSection.svelte';
	import OverviewSection from '$components/LegislativeProcess/sections/OverviewSection.svelte';
	import ProcessSection from '$components/LegislativeProcess/sections/ProcessSection.svelte';
	import VotingSection from '$components/LegislativeProcess/sections/VotingSection.svelte';
	import { HEADING_CLASS } from '$components/LegislativeProcess/styles';
	import { formatThaiDate } from '$lib/date.js';
	import scrollama from 'scrollama';
	import { onMount } from 'svelte';

	let { data } = $props();

	let bodyContainer: HTMLElement | undefined = $state();
	let currentNavElementId = $state('');
	onMount(() => {
		if (!bodyContainer) return;
		if (window.matchMedia('(min-width: 672px)').matches) {
			const scroller = scrollama();

			scroller
				.setup({
					step: bodyContainer.querySelectorAll('h2,h1'),
					// @ts-expect-error Documentation บอกว่าใช้ string ที่มี px ได้ https://github.com/russellsamora/scrollama#:~:text=number%20(0%20%2D%201%2C%20or%20string%20with%20%22px%22)
					offset: '33px'
				})
				.onStepEnter((response) => {
					currentNavElementId = response.element.id;
				});

			return scroller.destroy;
		}
	});
</script>

<div class="flex w-full flex-col">
	<header class="bg-teal-20">
		<div class="mx-auto w-full max-w-[800px] px-10 py-10 md:py-20">
			<h1 class="fluid-heading-05 {HEADING_CLASS}">ร่างกฎหมายกลายเป็นกฎหมายได้อย่างไร</h1>
			<p>
				<span class="font-bold text-text-primary">อัปเดตเนื้อหาล่าสุด :</span>
				<span class="text-helper-text-01">{formatThaiDate('2024-06-19', { shortMonth: true })}</span
				>
			</p>
		</div>
	</header>
	<main class="flex flex-col items-center justify-center md:flex-row md:items-start">
		<div
			class="legislative-process-sidebar w-full gap-10 bg-ui-01 px-4 py-8 md:sticky md:top-0 md:w-auto md:bg-white md:px-10 md:py-0"
		>
			<div class="flex w-full items-center justify-center bg-white py-10">
				<Sidebar {currentNavElementId} {sections} />
			</div>
		</div>
		<div
			class="flex w-full max-w-[800px] flex-1 flex-col gap-10 bg-ui-01 px-4 py-8 md:bg-white md:px-10"
			bind:this={bodyContainer}
		>
			<OverviewSection legislations={data.legislations} />
			<ProcessSection />
			<VotingSection />
			<DutiesSection {...data.dutySection} />
		</div>
		<div class="hidden w-[250px] md:block"></div>
	</main>
</div>
