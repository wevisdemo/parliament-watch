<script lang="ts">
	import { TableSplit } from 'carbon-icons-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import type { AssemblySummary, VoteSummary } from '../../routes/assemblies/[id]/votes/+page';
	import AssemblyIdRunner from '$components/Assemblies/AssemblyIdRunner.svelte';

	export let assembly: AssemblySummary;
	export let assemblyIds: string[] = [];

	const startedYear = assembly.startedAt.getFullYear() + 543;
</script>

<div
	class="flex md:flex-row flex-col w-full justify-between md:py-[48px] py-[16px] md:px-[64px] px-[16px] bg-field-01"
>
	<div class="w-full max-w-[900px] flex items-center">
		<div class="flex md:flex-row flex-col">
			<h2 class="fluid-heading-04">{assembly.name}</h2>
			<AssemblyIdRunner
				currentId={assembly.id}
				{startedYear}
				term={assembly.term}
				{assemblyIds}
				postfix="votes"
			/>
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
