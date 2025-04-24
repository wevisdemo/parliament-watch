<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import CabinetMembers from '$components/CabinetMembers/CabinetMembers.svelte';
	import DatePicker from '$components/DatePicker/DatePicker.svelte';
	import RoleChanges from '$components/Assemblies/RoleChanges/RoleChanges.svelte';
	import TimeLineArea from '$components/Assemblies/CabinetChanges/TimeLineArea.svelte';
	import { group } from 'd3';
	import ChangeModal from '$components/Assemblies/CabinetChanges/ChangeModal.svelte';
	import { isDateInRange } from '$components/Assemblies/CabinetChanges/TimeLine.js';
	import { formatThaiDate } from '$lib/date-parser';
	import BackToTopButton from '$components/BackToTopButton/BackToTopButton.svelte';

	export let data;
	interface Tab {
		id: number;
		name: string;
		comp: typeof CabinetMembers | typeof RoleChanges;
		props?: any;
	}

	$: ({ assembly, availableAssemblies, cabinetMembers, changes } = data);

	$: selectedDate = assembly.endedAt || new Date();
	const handleSelectDate = (date: Date) => {
		selectedDate = date;
	};

	$: membersAtSelectTime = cabinetMembers.filter(({ profile }) => {
		const start = changes.find((c) => c.politician.id === profile.id && c.type === 'in')?.date;
		const end = changes.find((c) => c.politician.id === profile.id && c.type === 'out')?.date;

		return start && isDateInRange(selectedDate, start, end ?? new Date());
	});

	$: tabs = [
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
	] as Tab[];
	$: curIndexTab = 0;

	$: groupChangeData = group(changes, (d) => d?.date.toISOString());
	$: timeLineData = Array.from(groupChangeData, ([date, value]) => ({
		date: new Date(date),
		in: value.filter((d) => d.type === 'in').length,
		out: value.filter((d) => d.type === 'out').length
	}));

	let openModal = false;
	let innerWidth = 0;
	$: isMD = innerWidth > 671;
	let showSideNav = false;
	let previousFromTop = 0;

	let stickyElement: HTMLElement;
	let isSticky = false;

	const scrollEventHandler = () => {
		const currentFromTop = window.scrollY;
		showSideNav = currentFromTop <= previousFromTop;
		previousFromTop = currentFromTop;

		const rect = stickyElement.getBoundingClientRect();
		isSticky = rect.top == 0 || (rect.top <= 48 && currentFromTop <= previousFromTop);
	};
</script>

<svelte:window bind:innerWidth on:scroll={scrollEventHandler} />
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
			on:click={() => {
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
				on:click={() => (curIndexTab = tab.id)}
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
	<svelte:component this={tabs[curIndexTab].comp} {...tabs[curIndexTab].props} />
</div>

<BackToTopButton margin={0} />
