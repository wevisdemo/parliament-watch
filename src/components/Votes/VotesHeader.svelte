<script lang="ts">
	import { TableSplit } from 'carbon-icons-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import type { AssemblySummary, VoteSummary } from '../../routes/assemblies/[id]/votes/+page';

	export let assembly: AssemblySummary;

	const startedYear = assembly.startedAt.getFullYear() + 543;
</script>

<div
	class="flex md:flex-row flex-col w-full justify-between md:py-[48px] py-[16px] md:px-[64px] px-[16px] bg-field-01"
>
	<div class="w-full max-w-[900px] flex items-center">
		<div class="flex md:flex-row flex-col">
			<h2 class="fluid-heading-04">{assembly.name}</h2>
			<div class="flex items-center md:ml-[16px] ml-[0px]">
				<!-- TODO: handler buttom next and prev-->
				<img
					src="/icons/angle-right.svg"
					alt="angle-left"
					class="rotate-180 w-[20px] mr-[16px] ml-[0px] fill-gray-300"
				/>
				<h3 class="fluid-heading-03">ชุดที่ {assembly.term} | {startedYear}</h3>
				<img src="/icons/angle-right.svg" alt="angle-right" class="w-[20px] ml-[16px] mr-[0px]" />
			</div>
		</div>
	</div>
	<div class="grid gap-[8px] w-full md:max-w-[224px] max-w-full mt-[16px] md:mt-[0px]">
		<div class="flex flex-col border border-gray-20 border-solid p-[12px] text-left">
			<div class="flex">
				<Download />
				<span class="heading-01 ml-[4px]">ดาวน์โหลดข้อมูล</span>
			</div>
			<!-- TODO:fill link-->
			<a href="/" class="flex items-center mt-[12px]">
				<TableSplit />
				<span class="helper-text-01 ml-[4px]">ประวัติการลงมติ</span>
			</a>
		</div>
	</div>
</div>
