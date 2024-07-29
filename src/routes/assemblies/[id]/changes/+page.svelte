<script lang="ts">
	import Header from '$components/Assemblies/Header.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import CabinetMembers from '$components/CabinetMembers/CabinetMembers.svelte';
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';
	import { ShoppingCart } from 'carbon-icons-svelte';

	export let data;

	$: ({ assembly, availableAssemblies, assemblyRoles, cabinetMembers } = data);
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
</div>

<h2 class="font-bold">assembly</h2>
<p class="whitespace-pre">{JSON.stringify(assembly, undefined, 2)}</p>
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

<CabinetMembers members={cabinetMembers} />

<h2 class="font-bold">assembly</h2>
<pre class="whitespace-pre">{JSON.stringify(assembly, undefined, 4)}</pre>

<h2 class="font-bold">availableAssemblies</h2>
<pre class="whitespace-pre">{JSON.stringify(availableAssemblies, undefined, 4)}</pre>

<h2 class="font-bold">assemblyRoles</h2>
<pre class="whitespace-pre">{JSON.stringify(assemblyRoles, undefined, 4)}</pre>

<h2 class="font-bold">members</h2>
<pre class="whitespace-pre">{JSON.stringify(cabinetMembers, undefined, 4)}</pre>
