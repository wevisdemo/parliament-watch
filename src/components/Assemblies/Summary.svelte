<script lang="ts">
	import type { Summary } from '../../routes/assemblies/[id]/+page';
	import SummaryGroup from './SummaryGroup.svelte';
	import SummaryTotal from './SummaryTotal.svelte';
	export let summary: Summary;
	export let houseLevel: string;
	export let assemblyId: string;
</script>

<div class="grid md:gap-[24px] gap-[16px] md:py-[32px] py-[16px]">
	<SummaryTotal {houseLevel} data={summary.highlightGroup} />
	<div class="grid md:grid-cols-3 grid-cols-1 gap-[8px] mx-auto w-full">
		<!-- TODO: chnage this when change phase -->
		<!-- <div class="grid md:grid-cols-4 grid-cols-1 gap-[8px] w-fit mx-auto w-full"> -->
		<SummaryGroup title="อายุ" data={{ memberGroups: summary.groupBySex, assemblyId }} />
		<SummaryGroup title="รุ่นอายุ" data={{ memberGroups: summary.groupByAgeRange, assemblyId }} />
		<SummaryGroup title="การศึกษา" data={{ memberGroups: summary.groupByEducation, assemblyId }} />
		<!-- TODO: not release asset value in phase 1 -->
		<!-- <SummaryGroup title="ทรัพย์สิน" data={summary.groupByAssetValue} /> -->
	</div>
</div>
