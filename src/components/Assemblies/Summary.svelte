<script lang="ts">
	import type { Summary } from '../../routes/assemblies/[id]/+page';
	import SummaryGroup from './SummaryGroup.svelte';
	import SummaryTotal from './SummaryTotal.svelte';
	export let summary: Summary;
	export let houseLevel: string;
</script>

<div class="grid md:gap-[24px] gap-[16px] md:py-[32px] py-[16px]">
	<SummaryTotal {houseLevel} data={summary.highlightGroup} />
	<div class="grid md:grid-cols-4 grid-cols-1 gap-[8px] w-fit mx-auto w-full">
		<SummaryGroup title="อายุ" data={summary.groupBySex} />
		<SummaryGroup title="รุ่นอายุ" data={summary.groupByAgeRange} />
		<SummaryGroup title="การศึกษา" data={summary.groupByEducation} />
		<SummaryGroup title="ทรัพย์สิน" data={summary.groupByAssetValue} />
	</div>
</div>

<style></style>
