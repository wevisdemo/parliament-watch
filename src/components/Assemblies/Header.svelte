<script lang="ts">
	import { Tag } from 'carbon-components-svelte';
	import { Download, TableSplit } from 'carbon-icons-svelte';
	import Share from '$components/Share/Share.svelte';
	import AssemblyIdRunner from './AssemblyIdRunner.svelte';

	export let assemblyIds: string[] = [];

	export let data: {
		id: string;
		name: string;
		abbreviation?: string;
		term: number;
		startedAt: Date;
		endedAt?: Date;
		origin: string;
	};

	$: isActive = data.endedAt === undefined;
	$: startedAtThaiFormat = new Date(data.startedAt).toLocaleDateString('th-TH', {
		day: 'numeric',
		month: 'short',
		year: '2-digit'
	});
	$: endedAtThaiFormat = data.endedAt
		? new Date(data.endedAt).toLocaleDateString('th-TH', {
				day: 'numeric',
				month: 'short',
				year: '2-digit'
		  })
		: 'ปัจจุบัน';
</script>

<div
	class="flex md:flex-row flex-col w-full justify-between md:py-[48px] py-[16px] md:space-x-[32px]"
>
	<div class="w-full max-w-[900px]">
		<div class="flex md:flex-row flex-col">
			<h2 class="fluid-heading-05">{data.name}</h2>
			<AssemblyIdRunner
				currentId={data.id}
				startedYear={data.startedAt}
				term={data.term}
				{assemblyIds}
			/>
		</div>
		<div class="flex items-center">
			<Tag type={isActive ? 'cyan' : 'warm-gray'}>{isActive ? 'อยูในวาระ' : 'หมดวาระ'}</Tag>
			<p class="body-01 ml-[8px]">
				{startedAtThaiFormat}{data.endedAt ? `- ${endedAtThaiFormat}` : ''}
			</p>
		</div>
		<div class="md:mt-[32px] mt-[16px]">
			<p class="heading-01">ที่มา</p>
			<p class="body-01 mt-[8px]">{data.origin}</p>
		</div>
	</div>
	<div class="grid gap-[8px] w-full md:max-w-[224px] max-w-full mt-[16px] md:mt-[0px] h-fit">
		<div class="flex flex-col border border-gray-20 border-solid p-[12px] text-left">
			<div class="flex">
				<Download />
				<span class="heading-01 ml-[4px]">ดาวน์โหลดข้อมูล</span>
			</div>
			<a
				href="/files/download/assemblies/{data.id}-members.csv"
				class="flex items-center mt-[12px]"
			>
				<TableSplit />
				<span class="helper-text-01 ml-[4px]">รายชื่อสมาชิก</span>
			</a>
			<!-- TODO:fill link-->
			<!-- <a href="/" class="flex items-center mt-[12px]">
				<TableSplit />
				<span class="helper-text-01 ml-[4px]">ประวัติการลงมติ</span>
			</a> -->
		</div>
		<p class="label-01 text-gray-60">อัพเดทข้อมูล: 20 ส.ค. 2566</p>
		<a href="/" class="helper-text-01">ที่มาและข้อจำกัดข้อมูล</a>
		<Share label="แชร์" />
	</div>
</div>
