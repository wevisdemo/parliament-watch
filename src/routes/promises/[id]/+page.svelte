<script lang="ts">
	import DataPeriodRemark from '$components/DataPeriodRemark.svelte';
	import PromiseProgressTimeline from '$components/PromiseDetail/PromiseProgressTimeline.svelte';
	import PromiseStatusModal from '$components/PromiseDetail/PromiseStatusModal.svelte';
	import PromiseStatusTag from '$components/PromiseDetail/PromiseStatusTag.svelte';
	import Share from '$components/Share/Share.svelte';
	import { Breadcrumb, BreadcrumbItem, Button } from 'carbon-components-svelte';
	import { SendAlt } from 'carbon-icons-svelte';

	export let data;
	console.log('data:', data);

	$: ({ promise } = data);

	let showStatusListModal = false;
</script>

<Breadcrumb
	noTrailingSlash
	class="body-compact-01 px-4 py-2 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/promises">ติดตามคำสัญญา</BreadcrumbItem>
	<BreadcrumbItem>title</BreadcrumbItem>
</Breadcrumb>
{#if promise.coverImageUrl}
	<img class="max-h-[300px] w-full object-cover" src={promise.coverImageUrl} alt="coverImageUrl" />
{/if}
<div class="px-4 py-8 md:px-16 md:py-12">
	<div class="heading-01 text-text-03">คำสัญญาของพรรคการเมือง</div>
	<div class="mt-1 flex items-center gap-2">
		<img
			src={promise.party.logo}
			alt="partyLogo"
			class="h-8 w-8 rounded-full border border-gray-30 object-cover"
		/>
		<div class="body-01">พรรค{promise.party.name}</div>
	</div>
	<div class="mt-4 flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden">
		{#each promise.statements as statement}
			<div class="flex min-w-[80%] gap-3">
				<div class="flex flex-none flex-col items-center gap-2">
					<img src="/images/promises/quote.svg" alt="quote" class="w-6" />
					<div class="w-1 flex-1 bg-ui-03"></div>
				</div>
				<div class="heading-03 text-text-primary">
					{statement}
				</div>
			</div>
		{/each}
	</div>
	<div class="mt-4 flex flex-col gap-2 xl:flex-row xl:items-center">
		<PromiseStatusTag status={promise.status} />
		<div class="body-01 text-text-01">
			[A definition that helps viewers understand the meaning and criteria of the status]
		</div>
		<button
			class="helper-text-01 w-fit flex-none text-link-01 underline"
			on:click={() => (showStatusListModal = true)}
		>
			ดูความหมายสถานะอื่นๆ
		</button>
	</div>
	<div class="mt-4 border border-gray-30 p-3"></div>
	<div class="mt-8 flex flex-col justify-between gap-8 xl:flex-row">
		<div class="flex flex-col gap-2">
			<div class="flex flex-wrap gap-1">
				<div class="heading-01 mt-1">คีย์เวิร์ด</div>
				{#each promise.keywords as keyword}
					<span class="label-01 rounded-3xl bg-gray-10 px-2 py-1">{keyword}</span>
				{/each}
			</div>
			<div class="flex flex-wrap gap-1">
				<div class="heading-01 mt-1">หมวด</div>
				{#each promise.categories as category}
					<span class="label-01 rounded-3xl border px-2 py-1">{category}</span>
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
							<span class="label-01 text-gray-60">{reference.description}</span>
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
			สถานะ <PromiseStatusTag status={promise.status} />
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
		<Button href="#" icon={SendAlt} kind="secondary">แจ้ง/ทักท้วงข้อมูล</Button>
	</div>
</div>
<PromiseStatusModal open={showStatusListModal} onClose={() => (showStatusListModal = false)} />
