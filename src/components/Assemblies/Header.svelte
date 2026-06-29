<script lang="ts">
	import DataPeriodRemark from '$components/DataPeriodRemark/DataPeriodRemark.svelte';
	import Share from '$components/Share/Share.svelte';
	import { formatDateRange } from '$lib/date';
	import AssemblyIdRunner, { type AvailableAssembly } from './AssemblyIdRunner.svelte';
	import { Tag } from 'carbon-components-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';

	interface Props {
		availableAssemblies?: AvailableAssembly[];
		id: string;
		name: string;
		startedAt: Date;
		endedAt: Date | undefined;
		description: string | null;
		linkPostfix?: string;
		showStatus?: boolean;
		showRemark?: boolean;
	}

	let {
		availableAssemblies = [],
		id,
		name,
		startedAt,
		endedAt,
		description,
		linkPostfix = '',
		showStatus = true,
		showRemark = true
	}: Props = $props();

	let isActive = $derived(!endedAt);

	const getAssemblyPath = (assembly: AvailableAssembly) =>
		assembly ? `/assemblies/${assembly.id}/${linkPostfix}` : '';
</script>

<div
	class="flex w-full flex-col justify-between py-[16px] md:flex-row md:space-x-[32px] md:py-[48px]"
>
	<div class="w-full max-w-[900px]">
		<div class="flex flex-col md:flex-row">
			<h2 class="fluid-heading-05">{name}</h2>
			<AssemblyIdRunner {id} {availableAssemblies} {getAssemblyPath} />
		</div>
		{#if showStatus}
			<div class="flex items-center">
				<Tag type={isActive ? 'cyan' : 'warm-gray'}>{isActive ? 'อยูในวาระ' : 'หมดวาระ'}</Tag>
				<p class="body-01 ml-[8px]">
					{formatDateRange(startedAt, endedAt, { shortMonth: true, shortYear: true })}
				</p>
			</div>
		{/if}
		{#if description}
			<div class="mt-[16px] md:mt-[32px]">
				<p class="heading-01">ที่มา</p>
				<p class="body-01 mt-[8px]">{description}</p>
			</div>
		{/if}
	</div>
	<div class="mt-[16px] grid h-fit w-full max-w-full gap-[8px] md:mt-[0px] md:max-w-[224px]">
		<div class="flex flex-col border border-solid border-gray-20 p-[12px] text-left">
			<div class="flex">
				<Download />
				<span class="heading-01 ml-[4px]">ดาวน์โหลดข้อมูล</span>
			</div>
			<a href="/files/download/assemblies/{id}-members.csv" class="mt-[12px] flex items-center">
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
