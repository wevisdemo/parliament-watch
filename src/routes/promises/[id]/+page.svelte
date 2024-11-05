<script lang="ts">
	import DataPeriodRemark from '$components/DataPeriodRemark/DataPeriodRemark.svelte';
	import PromiseProgressTimeline from '$components/PromiseDetail/PromiseProgressTimeline.svelte';
	import PromiseStatusModal from '$components/PromiseDetail/PromiseStatusModal.svelte';
	import PromiseStatusTag from '$components/PromiseDetail/PromiseStatusTag.svelte';
	import Share from '$components/Share/Share.svelte';
	import { Breadcrumb, BreadcrumbItem, Button } from 'carbon-components-svelte';
	import { SendAlt } from 'carbon-icons-svelte';
	import PromiseClarificationLog from '$components/PromiseDetail/PromiseClarificationLog.svelte';
	import { promiseStatusList } from '../../../constants/promise.js';

	export let data;

	$: ({ promise } = data);

	let showStatusListModal = false;

	const TITLE_MAX_LENGTH = 45;

	$: pageTitle =
		promise?.statements?.[0]?.length > TITLE_MAX_LENGTH
			? promise.statements[0].slice(0, TITLE_MAX_LENGTH) + '...'
			: promise.statements?.[0];

	$: promiseText = promiseStatusList.find((status) => status.label === promise.status)?.text;
</script>

<Breadcrumb
	noTrailingSlash
	class="body-compact-01 px-4 py-2 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/promises">ติดตามคำสัญญา</BreadcrumbItem>
	<BreadcrumbItem>{pageTitle}</BreadcrumbItem>
</Breadcrumb>
{#if promise.coverImageUrl}
	<img class="max-h-[300px] w-full object-cover" src={promise.coverImageUrl} alt="coverImageUrl" />
{/if}
<div class="px-4 py-8 md:px-16 md:py-12">
	<div class="heading-01 text-text-03">คำสัญญาของพรรคการเมือง</div>
	<div class="mt-1 flex items-center gap-2">
		<img
			src={promise.party.logo}
			alt=""
			class="h-8 w-8 rounded-full border border-gray-30 object-cover"
		/>
		<div class="body-01">พรรค{promise.party.name}</div>
	</div>
	<div
		class="-mx-4 mt-4 flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden px-4 md:mx-0 md:px-0"
	>
		{#each promise.statements as statement}
			<div class="flex min-w-[80%] gap-3">
				<div class="flex flex-none flex-col items-center gap-2">
					<img src="/images/promises/quote.svg" alt="" class="w-6" />
					<div class="w-1 flex-1 bg-ui-03"></div>
				</div>
				<div class="heading-03 text-text-primary">
					{statement}
				</div>
			</div>
		{/each}
	</div>
	<div class="mt-4 flex flex-col gap-2 xl:flex-row xl:items-center">
		<PromiseStatusTag isLarge status={promise.status} />
		<div class="body-01 text-text-01">
			{promiseText}
		</div>
		<button
			class="helper-text-01 w-fit flex-none text-link-01 underline"
			on:click={() => (showStatusListModal = true)}
		>
			ดูความหมายสถานะอื่นๆ
		</button>
	</div>
	{#if promise.clarificationLogs && promise.clarificationLogs?.length > 0}
		<div class="mt-4">
			<PromiseClarificationLog
				partyName={promise.party.name}
				clarificationLogs={promise.clarificationLogs}
			/>
		</div>
	{/if}
	<div class="mt-8 flex flex-col justify-between gap-8 xl:flex-row">
		<div class="flex flex-col gap-2">
			<div class="flex flex-wrap gap-1">
				<div class="heading-01 mt-1">คีย์เวิร์ด</div>
				{#each promise.keywords as keyword}
					<a
						href="/promises/explore?keyword={keyword}"
						class="label-01 rounded-3xl bg-gray-10 px-2 py-1 text-text-01"
					>
						{keyword}
					</a>
				{/each}
			</div>
			<div class="flex flex-wrap gap-1">
				<div class="heading-01 mt-1">หมวด</div>
				{#each promise.categories as category}
					<a
						href="/promises/explore?category={category}"
						class="label-01 rounded-3xl border border-black px-2 py-1 text-text-01">{category}</a
					>
				{/each}
			</div>
			<div class="flex flex-col gap-1 md:flex-row">
				<div class="heading-01">ที่มา</div>
				<div>
					{#each promise.references as reference}
						<div class="leading-4">
							<a href={reference.url} target="_blank" class="helper-text-01 text-link-01 underline">
								{reference.label}
							</a>
							{#if reference.description}
								<span class="label-01 text-gray-60">{reference.description}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="flex max-w-[224px] flex-col items-start gap-3 md:mt-0">
			<DataPeriodRemark />
			<Share label="แชร์คำสัญญา" />
		</div>
	</div>
</div>
<div class="px-4 py-8 md:px-16 md:py-12">
	<div class="fluid-heading-04">ความคืบหน้าที่เกี่ยวข้อง</div>
	<hr class="mt-4 border-gray-20" />
	<div class="mb-4 mt-3 flex justify-between">
		<div class="heading-02 flex flex-col gap-1 md:flex-row md:items-center">
			สถานะ <PromiseStatusTag isLarge status={promise.status} />
		</div>
		<button
			class="helper-text-01 h-fit text-link-01 underline"
			on:click={() => (showStatusListModal = true)}
		>
			คำสัญญามีสถานะอะไรบ้าง?
		</button>
	</div>
	<PromiseProgressTimeline {promise} />
	<div class="mt-8 flex flex-col justify-between gap-4 bg-gray-10 p-6 md:flex-row">
		<div class="text-01">
			<div class="heading-02">
				พบความเคลื่อนไหวที่อัพเดตกว่านี้ หรือ มีข้อทักท้วงการจัดสถานะของนโยบายนี้?
			</div>
			<div class="body-01 mt-1">
				ทีมงานยินดีรับฟังเพื่อนำไปปรับปรุงข้อมูลในเว็บไซต์ให้สมบูรณ์และสมเหตุสมผลที่สุด
			</div>
		</div>
		<Button
			target="_blank"
			href="https://forms.gle/feikqf5TFDqjVKPx6"
			icon={SendAlt}
			kind="secondary"
		>
			แจ้ง/ทักท้วงข้อมูล
		</Button>
	</div>
</div>
<PromiseStatusModal open={showStatusListModal} onClose={() => (showStatusListModal = false)} />
