<script lang="ts">
	import { GroupByOption } from '$models/assembly';
	import type { Summary } from '../../routes/assemblies/[id]/+page.server';
	import SummaryGroup from './SummaryGroup.svelte';
	import SummaryTotal from './SummaryTotal.svelte';

	export let summary: Summary;
	export let houseLevel: string;
	export let assemblyId: string;
	$: isCabinet = houseLevel === 'cabinet';
</script>

<div class="grid gap-[16px] py-[16px] md:gap-[24px] md:py-[32px]">
	<SummaryTotal {houseLevel} data={summary.highlightGroup} />
	<div class="mx-auto grid w-full grid-cols-1 gap-[8px] md:grid-cols-3">
		<SummaryGroup
			{assemblyId}
			groupBy={GroupByOption.Sex}
			memberGroups={summary.groupBySex}
			showHalfCircleChart={!isCabinet}
		/>
		<SummaryGroup
			{assemblyId}
			groupBy={GroupByOption.Age}
			memberGroups={summary.groupByAgeRange}
			showHalfCircleChart={!isCabinet}
		/>
		<SummaryGroup
			{assemblyId}
			groupBy={GroupByOption.Education}
			memberGroups={summary.groupByEducation}
			showHalfCircleChart={!isCabinet}
		/>
	</div>
</div>
