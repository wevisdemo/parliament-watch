<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import CabinetMembers from '$components/CabinetMembers/CabinetMembers.svelte';
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';
	import { ShoppingCart } from 'carbon-icons-svelte';
	import RoleChanges from '$components/Assemblies/RoleChanges/RoleChanges.svelte';

	export let data;

	$: ({ assembly, availableAssemblies, assemblyRoles, cabinetMembers } = data);
	console.log(data);

	interface Tab {
		name: string;
		comp: typeof CabinetMembers | typeof RoleChanges;
		props?: any;
	}

	let selectedDate = new Date('2024-05-27');

	let tabs: Tab[] = [
		{
			name: 'รายชื่อรัฐมนตรีในเวลานั้น',
			comp: CabinetMembers,
			props: { members: data.cabinetMembers }
		},
		{
			name: 'ลำดับการปรับเปลี่ยน',
			comp: RoleChanges,
			props: { changes: data.changes, selectedDate: selectedDate }
		}
	];
	let curTab = tabs[0];
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
<div class="bg-ui-01 px-[16px] md:px-[64px]">
	<Header
		headerName="การปรับคณะรัฐมนตรี"
		{assembly}
		{availableAssemblies}
		showStatus={false}
		showRemark={false}
		postfixLink="changes"
	/>

	<div class="flex flex-row-reverse flex-wrap justify-between gap-4">
		<div>
			<DatePicker
				datePickerType="single"
				locale={{
					weekdays: {
						shorthand: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
						longhand: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
					},
					months: {
						shorthand: [
							'ม.ค.',
							'ก.พ.',
							'มี.ค.',
							'เม.ย.',
							'พ.ค.',
							'มิ.ย.',
							'ก.ค.',
							'ส.ค.',
							'ก.ย.',
							'ต.ค.',
							'พ.ย.',
							'ธ.ค.'
						],
						longhand: [
							'มกราคม',
							'กุมภาพันธ์',
							'มีนาคม',
							'เมษายน',
							'พฤษภาคม',
							'มิถุนายน',
							'กรกฎาคม',
							'สิงหาคม',
							'กันยายน',
							'ตุลาคม',
							'พฤศจิกายน',
							'ธันวาคม'
						]
					}
				}}
			>
				<DatePickerInput />
			</DatePicker>
		</div>
		<div class="flex w-full lg:w-fit">
			{#each tabs as tab}
				<button
					class="heading-compact-01 w-full p-[16px] lg:w-fit {curTab === tab
						? 'border-t-2 border-t-interactive-01 bg-ui-background'
						: 'border-t-2 border-t-ui-03 bg-ui-03 text-text-02'}"
					on:click={() => (curTab = tab)}
				>
					{tab.name}
				</button>
			{/each}
		</div>
	</div>
</div>
<div
	class="px-[16px] md:px-[64px] {curTab.name == 'ลำดับการปรับเปลี่ยน'
		? 'py-[16px] md:py-[32px]'
		: ''}"
>
	<svelte:component this={curTab.comp} {...curTab.props} />
</div>
