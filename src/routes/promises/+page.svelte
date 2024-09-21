<script lang="ts">
	import PromiseList from '$components/PromiseList/PromiseList.svelte';

	export let data;
	console.log(JSON.stringify(data, null, 2));

	$: filterStatusData = data.promiseSummaries.filter(
		(summary) =>
			summary.status !== 'รอคำชี้แจงเพิ่มเติม' && summary.status !== 'ไม่พบความเคลื่อนไหว'
	);
</script>

<ul>
	<li><a href={`/promises/1`}>Detail page</a></li>
	<li><a href="promises/explore">Explore page</a></li>
</ul>

<div class="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-6">
	<PromiseList summaries={filterStatusData} />
</div>
