<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, Search, Tag } from 'carbon-components-svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import Minimize from 'carbon-icons-svelte/lib/Minimize.svelte';
	import { DefaultVoteOption, type CustomVoteOption } from '$models/voting.js';

	export let data;

	function getVoteColor(vote: DefaultVoteOption | CustomVoteOption | string) {
		switch (vote) {
			case DefaultVoteOption.Agreed:
				return 'bg-teal-50';
			case DefaultVoteOption.Disagreed:
				return 'bg-red-50 text-white';
			case DefaultVoteOption.Novote:
				return 'bg-gray-80 text-white';
			case DefaultVoteOption.Abstain:
				return 'bg-gray-50';
			case DefaultVoteOption.Absent:
				return 'bg-gray-20';
			default:
				return 'bg-purple-70';
		}
	}
</script>

<div class="flex flex-col min-h-screen">
	<Breadcrumb
		noTrailingSlash
		class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
	>
		<BreadcrumbItem href="#">หน้าแรก</BreadcrumbItem>
		<BreadcrumbItem href="#">การลงมติ</BreadcrumbItem>
		<BreadcrumbItem href="#">{data.voting.title}</BreadcrumbItem>
		<BreadcrumbItem>ผลการลงมติรายคน</BreadcrumbItem>
	</Breadcrumb>
	<header class="px-16 pt-3 pb-4 bg-ui-01 md:px-16">
		<div class="flex flex-col gap-1 md:flex-row md:gap-16 md:items-center">
			<div class="flex-1">
				<p class="heading-01">ผลการลงมติรายคน</p>
				<h1 class="fluid-heading-03">
					{data.voting.title}
				</h1>
				<p class="label-01 text-gray-60">หมายเหตุ: ข้อมูลตำแหน่งและสังกัดพรรค ยึดตามวันที่ลงมติ</p>
			</div>
			<div
				class="w-[224px] flex flex-col gap-2 border border-solid border-ui-03 rounded-sm p-3 md:self-end"
			>
				<div class="flex items-center gap-1">
					<Download />
					<h2 class="heading-01">ดาวน์โหลดข้อมูล</h2>
				</div>
				<!-- TODO: add link -->
				<a href="/" class="flex items-center gap-1 mr-auto helper-text-01">
					<TableSplit />
					<span>ผลการลงมติรายคน</span>
				</a>
			</div>
		</div>
	</header>
	<div class="flex-1 flex gap-1 bg-ui-01 w-full border-t border-ui-03">
		<div
			class="fixed w-full h-screen md:h-auto md:max-h-screen overscroll-none md:sticky top-0 flex flex-col bg-white md:w-[250px] flex-[0_0_250px] z-50 md:z-30"
		>
			<div
				class="sticky top-0 md:top-12 flex w-full pl-6 duration-300 z-30 bg-white"
				class:md:top-12={true}
			>
				<Search class="flex-1" placeholder="ชื่อ-นามสกุล" light />
				<Button
					kind="ghost"
					icon={Minimize}
					iconDescription="ซ่อนตัวเลือก"
					tooltipPosition="right"
					tooltipAlignment="end"
				/>
			</div>
			<div class="flex-[1_1_auto] h-0 overflow-y-scroll py-4 px-6" />
			<div class="flex space-x-[-1px] sticky bottom-0 body-compact-01 bg-white">
				<Button class="flex-[2_2_0%] min-w-0 pr-4" kind="tertiary">ล้างตัวเลือก</Button>
			</div>
		</div>
		<div class="flex-1 flex flex-col bg-white">
			<div class="flex w-full">
				<div class="w-1/4 heading-compact-01 py-[15px] px-4">ชื่อ-นามสกุล</div>
				<div class="w-1/4 heading-compact-01 py-[15px] px-4">ตำแหน่ง</div>
				<div class="w-1/4 heading-compact-01 py-[15px] px-4">สังกัดพรรค</div>
				<div class="w-1/4 heading-compact-01 py-[15px] px-4">การลงมติ</div>
			</div>
			{#each data.votes as voter}
				<div class="flex w-full border-t border-gray-30">
					<div class="w-1/4 body-01 underline py-[15px] px-4">
						{voter.firstname}
						{voter.lastname}
					</div>
					<div class="w-1/4 text-gray-60 body-compact-01 py-[15px] px-4">{voter.position}</div>
					<div class="w-1/4 text-gray-60 body-compact-01 py-[15px] px-4">
						{voter.party ? voter.party : ''}
					</div>
					<div class="w-1/4 py-[15px] px-4">
						<Tag class={getVoteColor(voter.voteOption)}>{voter.voteOption}</Tag>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
<!-- <div class="whitespace-pre">
	{JSON.stringify(data, undefined, 2)}
</div> -->
