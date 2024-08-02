<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import CabinetMembers from '$components/CabinetMembers/CabinetMembers.svelte';
	import DatePicker from '$components/DatePicker/DatePicker.svelte';
	import RoleChanges from '$components/Assemblies/RoleChanges/RoleChanges.svelte';
	import TimeLineArea from '$components/Assemblies/CabinetChanges/TimeLineArea.svelte';

	export let data;
	interface Tab {
		id: number;
		name: string;
		comp: typeof CabinetMembers | typeof RoleChanges;
		props?: any;
	}

	$: ({ assembly, availableAssemblies, assemblyRoles, cabinetMembers, changes } = data);

	$: selectedDate = new Date();
	const handleSelectDate = (event: CustomEvent<{ value: Date }>) => {
		selectedDate = event.detail.value;
	};

	$: tabs = [
		{
			id: 0,
			name: 'รายชื่อรัฐมนตรีในเวลานั้น',
			comp: CabinetMembers,
			props: { members: cabinetMembers }
		},
		{
			id: 1,
			name: 'ลำดับการปรับเปลี่ยน',
			comp: RoleChanges,
			props: { changes: changes, selectedDate }
		}
	] as Tab[];
	$: curIndexTab = 0;
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

	<div class="hidden md:block">
		<TimeLineArea {changes} {selectedDate} {handleSelectDate} />
	</div>

	<div class="flex flex-row-reverse flex-wrap justify-between gap-4 px-[16px] md:px-[64px]">
		<div>
			<DatePicker />
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
