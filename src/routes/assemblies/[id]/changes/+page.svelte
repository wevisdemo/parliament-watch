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

	export let data;
	interface Tab {
		id: number;
		name: string;
		comp: typeof CabinetMembers | typeof RoleChanges;
		props?: any;
	}

	$: ({ assembly, availableAssemblies, assemblyRoles, cabinetMembers, changes } = data);

	$: selectedDate = new Date();
	const handleSelectDate = (date: Date) => {
		selectedDate = date;
	};

	$: getMembersAtSelectTime = () => {
		const currentDate = new Date();
		let assemblyRolesFilter = assemblyRoles
			.filter((assembly) =>
				isDateInRange(
					selectedDate,
					assembly.startedAt,
					assembly.endedAt ? assembly.endedAt : currentDate
				)
			)
			.map((assembly) => assembly.politicianId);

		let activeMember = cabinetMembers.filter((member) =>
			assemblyRolesFilter.includes(member.politician.id)
		);
		return activeMember;
	};
	$: membersAtSelectTime = getMembersAtSelectTime();

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

	$: openModal = false;
	$: innerWidth = 0;
	$: isSM = innerWidth > 671;
</script>

<svelte:window bind:innerWidth />
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
			headerName="การปรับคณะรัฐมนตรี"
			{assembly}
			{availableAssemblies}
			showStatus={false}
			showRemark={false}
			postfixLink="changes"
		/>
	</div>

	<ChangeModal
		{timeLineData}
		startedAt={assembly.startedAt}
		endedAt={assembly.endedAt}
		{selectedDate}
		{handleSelectDate}
		open={openModal && !isSM}
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

	<div class="flex flex-row-reverse flex-wrap justify-between gap-4 px-[16px] md:px-[64px]">
		<div class="flex flex-col md:flex-row md:items-center md:gap-2">
			<p class="label-02">กำลังแสดงข้อมูล ณ วันที่</p>
			<button on:click={() => (isSM ? {} : (openModal = true))}>
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
</div>

<div
	class="px-[16px] md:px-[64px] {tabs[curIndexTab].name == 'ลำดับการปรับเปลี่ยน'
		? 'py-[16px] md:py-[32px]'
		: ''}"
>
	<svelte:component this={tabs[curIndexTab].comp} {...tabs[curIndexTab].props} />
</div>
