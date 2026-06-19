<script lang="ts">
	import ChangeModal from '$components/Assemblies/CabinetChanges/ChangeModal.svelte';
	import TimeLineArea from '$components/Assemblies/CabinetChanges/TimeLineArea.svelte';
	import Header from '$components/Assemblies/Header.svelte';
	import RoleChanges from '$components/Assemblies/RoleChanges/RoleChanges.svelte';
	import BackToTopButton from '$components/BackToTopButton/BackToTopButton.svelte';
	import CabinetMembers from '$components/CabinetMembers/CabinetMembers.svelte';
	import DatePicker from '$components/DatePicker/DatePicker.svelte';
	import { formatThaiDate, isDateInRange } from '$lib/date';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import { group } from 'd3';

	let { data } = $props();
	interface Tab {
		id: number;
		name: string;
		comp: typeof CabinetMembers | typeof RoleChanges;
		props?: Record<string, unknown>;
	}

	let { assembly, availableAssemblies, cabinetPositions: cabinetMembers, changes } = $derived(data);

	let selectedDate = $derived(assembly.endedAt || new Date());
	const handleSelectDate = (date: Date) => {
		selectedDate = date;
	};

	let membersAtSelectTime = $derived(
		cabinetMembers.filter(({ profile }) => {
			const start = changes.find((c) => c.politician.id === profile.id && c.type === 'in')?.date;
			const end = changes.find((c) => c.politician.id === profile.id && c.type === 'out')?.date;

			return start && isDateInRange(selectedDate, start, end ?? new Date());
		})
	);

	let tabs = $derived([
		{
			id: 0,
			name: 'รายชื่อรัฐมนตรีในเวลานั้น',
			comp: CabinetMembers,
			props: { members: membersAtSelectTime }
		},
		{
			id: 1,
			name: 'ลำดับการปรับเปลี่ยน',
			comp: RoleChanges,
			props: { changes, selectedDate }
		}
	] as Tab[]);
	let curIndexTab = $state(0);

	let groupChangeData = $derived(group(changes, (d) => d?.date.toISOString()));
	let timeLineData = $derived(
		Array.from(groupChangeData, ([date, value]) => ({
			date: new Date(date),
			in: value.filter((d) => d.type === 'in').length,
			out: value.filter((d) => d.type === 'out').length
		}))
	);

	let openModal = $state(false);
	let innerWidth = $state(0);
	let isMD = $derived(innerWidth > 671);
	let showSideNav = $state(false);
	let previousFromTop = 0;

	let stickyElement: HTMLElement | undefined = $state();
	let isSticky = $state(false);

	const scrollEventHandler = () => {
		if (!stickyElement) return;
		const currentFromTop = window.scrollY;
		showSideNav = currentFromTop <= previousFromTop;
		previousFromTop = currentFromTop;

		const rect = stickyElement.getBoundingClientRect();
		isSticky = rect.top == 0 || (rect.top <= 48 && currentFromTop <= previousFromTop);
	};
</script>

<svelte:window bind:innerWidth onscroll={scrollEventHandler} />
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
</div>

<div class="bg-ui-01">
	<div class="px-[16px] md:px-[64px]">
		<Header
			{...assembly}
			name="การปรับคณะรัฐมนตรี"
			{availableAssemblies}
			showStatus={false}
			showRemark={false}
			linkPostfix="changes"
		/>
	</div>

	<ChangeModal
		{timeLineData}
		startedAt={assembly.startedAt}
		endedAt={assembly.endedAt}
		{selectedDate}
		{handleSelectDate}
		open={openModal && !isMD}
		onClose={() => (openModal = false)}
	/>

	<div class="hidden md:block">
		<TimeLineArea
			{timeLineData}
			startedAt={assembly.startedAt}
			endedAt={assembly.endedAt}
			{selectedDate}
			{handleSelectDate}
		/>
	</div>
</div>
<div
	class="sticky {showSideNav
		? 'top-12'
		: 'top-0'} z-10 flex flex-row-reverse flex-wrap justify-between gap-4 bg-ui-01 px-[16px] pt-4 md:px-[64px]"
	bind:this={stickyElement}
>
	<div class="flex flex-col md:flex-row md:items-center md:gap-2">
		<div class="flex gap-2">
			<p class="label-02">กำลังแสดงข้อมูล ณ วันที่</p>
			<p class="heading-compact-01 {isSticky && !isMD ? '' : 'hidden'}">
				{formatThaiDate(selectedDate)}
			</p>
		</div>
		<button
			onclick={() => {
				if (!isMD) openModal = true;
			}}
			class={isSticky && !isMD ? 'hidden' : ''}
		>
			<DatePicker {selectedDate} {handleSelectDate} />
		</button>
	</div>
	<div class="flex w-full lg:w-fit">
		{#each tabs as tab}
			<button
				class="heading-compact-01 w-full p-[16px] lg:w-fit {curIndexTab === tab.id
					? 'border-t-2 border-t-interactive-01 bg-ui-background'
					: 'border-t-2 border-t-ui-03 bg-ui-03 text-text-02'}"
				onclick={() => (curIndexTab = tab.id)}
			>
				{tab.name}
			</button>
		{/each}
	</div>
</div>

<div
	class="px-[16px] md:px-[64px] {tabs[curIndexTab].name == 'ลำดับการปรับเปลี่ยน'
		? 'py-[16px] md:py-[32px]'
		: ''}"
>
	{#if curIndexTab === 0}
		<CabinetMembers members={membersAtSelectTime} />
	{:else}
		<RoleChanges {changes} {selectedDate} />
	{/if}
</div>

<BackToTopButton margin={0} />
