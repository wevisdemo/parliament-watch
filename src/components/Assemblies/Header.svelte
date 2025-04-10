<script lang="ts">
	import { Tag } from 'carbon-components-svelte';
	import { Download, TableSplit } from 'carbon-icons-svelte';
	import Share from '$components/Share/Share.svelte';
	import AssemblyIdRunner, { type AvailableAssembly } from './AssemblyIdRunner.svelte';
	import DataPeriodRemark from '$components/DataPeriodRemark/DataPeriodRemark.svelte';
	import type { Assembly } from '$models/assembly';

	export let availableAssemblies: AvailableAssembly[] = [];

	export let assembly: Pick<
		Assembly,
		'id' | 'name' | 'abbreviation' | 'term' | 'startedAt' | 'endedAt' | 'origin'
	>;

	export let postfixLink = '';
	export let headerName: string | null = null;
	export let showStatus = true;
	export let showRemark = true;

	$: isActive = !assembly.endedAt;
	$: startedAtThaiFormat = new Date(assembly.startedAt).toLocaleDateString('th-TH', {
		day: 'numeric',
		month: 'short',
		year: '2-digit'
	});
	$: endedAtThaiFormat = assembly.endedAt
		? new Date(assembly.endedAt).toLocaleDateString('th-TH', {
				day: 'numeric',
				month: 'short',
				year: '2-digit'
			})
		: 'ปัจจุบัน';
</script>

<div
	class="flex w-full flex-col justify-between py-[16px] md:flex-row md:space-x-[32px] md:py-[48px]"
>
	<div class="w-full max-w-[900px]">
		<div class="flex flex-col md:flex-row">
			<h2 class="fluid-heading-05">{headerName ? headerName : assembly.name}</h2>
			<AssemblyIdRunner
				name={assembly.name}
				term={assembly.term}
				startedYear={assembly.startedAt}
				{availableAssemblies}
				postfix={postfixLink}
			/>
		</div>
		{#if showStatus}
			<div class="flex items-center">
				<Tag type={isActive ? 'cyan' : 'warm-gray'}>{isActive ? 'อยูในวาระ' : 'หมดวาระ'}</Tag>
				<p class="body-01 ml-[8px]">
					{startedAtThaiFormat}{assembly.endedAt ? ` - ${endedAtThaiFormat}` : ''}
				</p>
			</div>
		{/if}
		{#if assembly.origin}
			<div class="mt-[16px] md:mt-[32px]">
				<p class="heading-01">ที่มา</p>
				<p class="body-01 mt-[8px]">{assembly.origin}</p>
			</div>
		{/if}
	</div>
	<div class="mt-[16px] grid h-fit w-full max-w-full gap-[8px] md:mt-[0px] md:max-w-[224px]">
		<div class="flex flex-col border border-solid border-gray-20 p-[12px] text-left">
			<div class="flex">
				<Download />
				<span class="heading-01 ml-[4px]">ดาวน์โหลดข้อมูล</span>
			</div>
			<a
				href="/files/download/assemblies/{assembly.id}-members.csv"
				class="mt-[12px] flex items-center"
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
		{#if showRemark}
			<DataPeriodRemark />
			<Share label="แชร์" />
		{/if}
	</div>
</div>
