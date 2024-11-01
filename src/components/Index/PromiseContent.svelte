<script lang="ts">
	import PromiseStatusCard from '$components/Promise/Home/PromiseStatusCard.svelte';
	import { PromiseStatus } from '$models/promise';
	import { Button } from 'carbon-components-svelte';
	import { promiseBgColorClass, promiseStatusList } from '../../constants/promise';
	import type { PromisesByStatus } from '../../routes/promises/+page.server';
	import { ArrowRight } from 'carbon-icons-svelte';

	const displayedStatuses = [
		PromiseStatus.inProgress,
		PromiseStatus.fulfilled,
		PromiseStatus.unhonored
	] as const;

	export let total: number;
	export let byStatus: PromisesByStatus[];

	$: max = Math.max(...byStatus.map((b) => b.count));
</script>

<div class="flex flex-col gap-1">
	<h3 class="fluid-heading-04">ความคืบหน้าของคำสัญญาทางการเมือง</h3>
	<p class="label-01 text-text-02">
		จากคำสัญญาของพรรคการเมืองฝ่ายรัฐบาลที่ได้ให้ไว้ในช่วงหาเสียงเลือกตั้งปี 2566 จำนวน {total} คำสัญญา
	</p>
</div>

<div class="flex flex-col gap-4 md:flex-row">
	{#each displayedStatuses as status, i}
		{@const promises = byStatus.find((b) => b.status === status)}
		{#if i > 0}
			<div class="solid border-t border-ui-03 md:block md:border-l" />
		{/if}
		<div class="py-2 md:basis-1/3">
			<PromiseStatusCard
				{status}
				statusCount={promises?.count || 0}
				description={promiseStatusList.find(({ label }) => label === status)?.text}
				{max}
				color={promiseBgColorClass[status]}
				samples={promises?.samples}
				hideSeeAll
			/>
		</div>
	{/each}
</div>

<Button href="/promises" kind="secondary" icon={ArrowRight} class="w-full max-w-none">
	ดูคำสัญญาทางการเมืองทั้งหมด
</Button>
