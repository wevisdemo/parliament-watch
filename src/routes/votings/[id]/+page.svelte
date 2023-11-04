<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import DownloadData from '$components/DownloadData/DownloadData.svelte';
	import BillCategoryTag from '$components/BillCategoryTag/BillCategoryTag.svelte';
	import BillCard from '$components/BillCard/BillCard.svelte';
	export let data;

	function dateConvertor(date: Date) {
		const convertedDate = Intl.DateTimeFormat('th', {
			dateStyle: 'medium',
			calendar: 'buddhist'
		}).format(date);
		return convertedDate;
	}
</script>

<div class="flex flex-col min-h-screen">
	<Breadcrumb
		noTrailingSlash
		class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		<BreadcrumbItem href="/home">หน้าแรก</BreadcrumbItem>
		<BreadcrumbItem href="/voting">การลงมติ</BreadcrumbItem>
		<BreadcrumbItem>{data.voting.title}</BreadcrumbItem>
	</Breadcrumb>
	<div class="flex flex-col gap-y-8 w-full bg-teal-10 px-12 py-16">
		<div class="flex flex-col">
			<h1 class="fluid-heading-05">{data.voting.title}</h1>
			<div class="flex items-center text-gray-60 gap-x-1">
				<p class="heading-01">ชื่อทางการ</p>
				<p class="body-01">{data.relatedBill.nickname}</p>
			</div>
			<div class="flex items-center text-01 gap-x-1">
				<VotingResultTag result={data.voting.result} isLarge />
				<p class="heading-compact-02">
					เห็นด้วย {data.results.find((v) => v.voteOption === 'เห็นด้วย')?.total || 0}/<span
						class="text-gray-60"
						>{data.results.find((v) => v.voteOption === 'ไม่เห็นด้วย')?.total || 0}</span
					>
				</p>
			</div>
		</div>
		<div class="flex gap-x-16">
			<div class="flex flex-col flex-1">
				<div class="flex justify-between">
					<div>
						<p class="heading-01">วันที่</p>
						<p class="body-01">{dateConvertor(data.voting.date)}</p>
					</div>
					<div>
						<p class="heading-01">ประเภทการประชุม</p>
						<p class="body-01">{data.voting.meetingType}</p>
					</div>
					<div>
						<p class="heading-01">องค์ประชุม</p>
						<p class="body-01">
							{#each data.voting.participatedAssembleIds as id}
								<p class="underline">{id}</p>
							{/each}
						</p>
					</div>
				</div>
				<div class="w-full my-4 h-[1px] bg-gray-20" />
				<p class="heading-01">สรุปเนื้อหา</p>
				<p class="body-01">{data.relatedBill.description}</p>
				<div class="flex items-center gap-x-1 mt-4">
					<p class="heading-01">หมวด</p>
					{#each data.voting.categories as category}
						<BillCategoryTag isLarge label={category} />
					{/each}
				</div>
				<p class="heading-01 mt-4 mb-1">ดูเส้นทางของร่างกฏหมายนี้</p>
				<BillCard
					title={data.relatedBill.title}
					nickname={data.relatedBill.nickname}
					proposedOn={data.relatedBill.proposedOn}
					status={data.relatedBill.status}
					currentState={data.relatedBill.status}
					daySinceProposed={100}
					billUrl={data.relatedBill.title}
					proposedBy={{
						avatar: 'https://placehold.co/24x24',
						name: 'ดวงฤทธิ์ เบ็ญจาธิกุล ชัยรุ่งเรือง',
						description: 'สส. ชุดที่ 26 (2566) พรรคก้าวไกล'
					}}
				/>
			</div>
			<div>
				<DownloadData links={data.voting.files} />
			</div>
		</div>
	</div>
	<div class="whitespace-pre">
		{JSON.stringify(data, undefined, 2)}
	</div>
</div>
