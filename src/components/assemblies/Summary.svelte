<script lang="ts">
	import type { Party } from '$models/party';
	import SummaryGroup from './SummaryGroup.svelte';
	export let summary: Summary;
	interface Summary {
		totalMembers: number;
		highlightGroup: MemberGroup[];
		groupBySex: MemberGroup[];
		groupByAgeRange: MemberGroup[];
		groupByEducation: MemberGroup[];
		groupByAssetValue: MemberGroup[];
	}

	interface MemberGroup {
		name: string;
		total: number;
		parties?: (Pick<Party, 'name' | 'color'> & { count: number })[];
	}
</script>

<div>
	<SummaryGroup title="อายุ" data={summary.groupBySex} />
	<SummaryGroup title="รุ่นอายุ" data={summary.groupByAgeRange} />
	<!-- <SummaryGroup title="การศึกษา" data={summary.groupByEducation} />
	<SummaryGroup title="ทรัพย์สิน" data={summary.groupByAssetValue} /> -->
</div>

<style></style>
