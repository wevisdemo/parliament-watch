<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Modal,
		Tab,
		Tabs,
		Tag,
		TextInput,
		ToggleSkeleton
	} from 'carbon-components-svelte';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import DownloadData from '$components/DownloadData/DownloadData.svelte';
	import BillCategoryTag from '$components/BillCategoryTag/BillCategoryTag.svelte';
	import BillCard from '$components/BillCard/BillCard.svelte';
	import { DefaultVoteOption, type CustomVoteOption } from '$models/voting.js';
	export let data;

	let open = false;
	let selectedTab = '';

	function dateConvertor(date: Date) {
		const convertedDate = Intl.DateTimeFormat('th', {
			dateStyle: 'medium',
			calendar: 'buddhist'
		}).format(date);
		return convertedDate;
	}

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

	function getWidthPercent(voteCount: number, totalVote = 750) {
		return Math.round((voteCount / totalVote) * 100);
	}
</script>

<div class="flex flex-col min-h-screen">
	<Breadcrumb
		noTrailingSlash
		class="w-full px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex text-ellipsis overflow-hidden truncate"
	>
		<BreadcrumbItem href="#">หน้าแรก</BreadcrumbItem>
		<BreadcrumbItem href="#">การลงมติ</BreadcrumbItem>
		<BreadcrumbItem>{data.voting.title}</BreadcrumbItem>
	</Breadcrumb>
	<div class="flex flex-col gap-y-4 md:gap-y-8 w-full bg-teal-10 px-4 md:px-12 py-8 md:py-16">
		<div class="flex flex-col">
			<h1 class="fluid-heading-05">{data.voting.title}</h1>
			<div class="flex items-center text-gray-60 gap-x-1">
				<p class="flex-none heading-01">ชื่อทางการ</p>
				<p class="flex-initial body-01 truncate">{data.relatedBill.nickname}</p>
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
		<div class="flex flex-col gap-y-4 md:gap-y-0 md:flex-row md:gap-x-16">
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
	<div class="flex flex-col w-full py-6 px-4 md:px-12 md:py-16">
		<h1 class="fluid-heading-05 text-center">ผลการลงมติ</h1>
		<Tabs class="w-full">
			<Tab>สรุป</Tab>
			<Tab>รายสังกัด</Tab>
			<Tab>รายคน</Tab>
		</Tabs>
		<h2 class="fluid-heading-04 mt-6 md:mt-10">สรุปผลการลงมติ</h2>
		<div class="flex flex-col mt-4">
			<div class="flex items-center text-teal-50 gap-x-1">
				<p class="fluid-heading-05 ml-0 md:ml-1">
					{(
						((data.results.find((v) => v.voteOption === 'เห็นด้วย')?.total || 0) / 750) *
						100
					).toFixed(0)}%
				</p>
				<p class="fluid-heading-05">เห็นด้วย</p>
			</div>
			<div class="mt-3 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-x-4">
				<div class="flex items-center gap-x-1">
					<p class="heading-02">สมาชิกสภา</p>
					<p class="body-02">750</p>
				</div>
				{#each data.results as result}
					<div class="flex items-center gap-x-1">
						<div class="w-4 h-4 rounded-sm {getVoteColor(result.voteOption)}" />
						<p class="heading-02">{result.voteOption}</p>
						<p class="body-02">{result.total}</p>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex w-full h-[50px] my-2">
			{#each data.results as result}
				<div
					class="rounded-sm h-full {getVoteColor(result.voteOption)}"
					style="width: {getWidthPercent(result.total)}%"
				/>
			{/each}
		</div>
		<div class="flex flex-col md:flex-row items-start md:items-center gap-x-2 text-gray-60">
			<VotingResultTag result={data.voting.result} isLarge />
			<p class="heading-01 mt-2 md:mt-0">เงื่อนไข</p>
			<span class="body-01 flex items-center gap-x-1">
				<p class="heading-01">1.</p>
				ได้เสียงเกินกึ่งหนึ่งของสภา
			</span>
			<span class="body-01 flex items-center gap-x-1">
				<p class="heading-01">2.</p>
				ได้เสียงฝ่ายค้านอย่างน้อย 20%
			</span>
			<span class="body-01 flex items-center gap-x-1">
				<p class="heading-01">3.</p>
				ได้เสียง สว. อย่างน้อย 1 ใน 3
			</span>
		</div>
		<Modal passiveModal bind:open modalHeading="งดออกเสียง vs. ไม่ลงคะแนน" on:open on:close>
			<p class="body-01">
				งดออกเสียง เกิดจากการเสียบบัตรยืนยันตัวตน และลงคะแนนว่า “งดออกเสียง” <br />
				ไม่ลงคะแนน เกิดจากการเสียบบัตรยืนยันตัวตนแล้ว แต่ไม่กดลงคะแนน
			</p>
		</Modal>
		<button
			class="cursor-pointer helper-text-01 mt-2 text-blue-60 underline text-left w-[260px]"
			on:click={() => (open = false)}
		>
			งดออกเสียง และ ไม่ลงคะแนน ต่างกันอย่างไร?
		</button>
	</div>
	<div class="flex flex-col w-full px-4 md:px-12">
		<div class="flex flex-col md:flex-row items-start md:items-center gap-x-3">
			<h1 class="fluid-heading-04">ผลการลงมติรายสังกัด</h1>
			<div class="flex items-center">
				<ToggleSkeleton />
				<p class="body-compact-01">ดูร้อยละ</p>
			</div>
		</div>
		<p class="label-01">*หมายเหตุ: ข้อมูลสังกัด ยึดตามวันที่ลงมติ</p>
	</div>
	<div class="flex flex-col md:flex-row w-full px-4 md:px-12 mt-4 mb-10 gap-x-8">
		{#each data.resultsByAffiliation as { affiliationName, resultSummary, byParties }}
			{@const totalVote = resultSummary.reduce((acc, vote) => acc + vote.total, 0)}
			<div class="flex flex-col w-full md:w-1/3 border-t border-gray-30 pb-4 md:pb-0">
				<div class="mt-2 flex items-center gap-x-1">
					<p class="heading-02">{affiliationName}</p>
					<p class="body-02 text-gray-60">{totalVote} คน</p>
					<div class="flex md:hidden flex-1" />
					<Add
						on:click={() => (selectedTab = affiliationName)}
						class="justify-self-start self-start flex md:hidden"
					/>
				</div>
				<div class="mt-1 flex items-center gap-x-1 text-teal-50">
					<p class="heading-03">
						{resultSummary.find((vote) => vote.voteOption === 'เห็นด้วย')?.total} คน
					</p>
					<p class="heading-03">เห็นด้วย</p>
				</div>
				<div class="mt-1 flex items-center gap-x-3 text-teal-50">
					{#each resultSummary as vote}
						<div class="flex items-center gap-x-1">
							<div class="w-1 h-3 {getVoteColor(vote.voteOption)}" />
							<p class="label-01">{vote.total}</p>
						</div>
					{/each}
				</div>
				<div class="flex w-full h-[30px] mt-1">
					{#each resultSummary as vote}
						<div
							class="rounded-sm h-full {getVoteColor(vote.voteOption)}"
							style="width: {getWidthPercent(vote.total, totalVote)}%"
						/>
					{/each}
				</div>
				{#if byParties}
					<div
						class="{selectedTab === affiliationName
							? 'flex'
							: 'hidden'} md:flex flex-col w-full mt-4 gap-y-4"
					>
						{#each byParties as partyDetails}
							<div class="flex items-start gap-x-1">
								<img
									class="rounded-full border border-gray-30 w-8 h-8"
									src={partyDetails.party.logo}
									alt={partyDetails.party.name}
									loading="lazy"
									decoding="async"
								/>
								<div class="flex justify-start items-start flex-col w-full">
									<div class="flex items-center gap-x-1">
										<p class="heading-02">{partyDetails.party.name}</p>
										<p class="body-02 text-gray-60">
											{partyDetails.resultSummary.reduce((acc, vote) => acc + vote.total, 0)} คน
										</p>
									</div>
									<div class="mt-1 flex items-center gap-x-3 text-teal-50">
										{#each partyDetails.resultSummary as partyVote}
											<div class="flex items-center gap-x-1">
												<div class="w-1 h-3 {getVoteColor(partyVote.voteOption)}" />
												<p class="label-01">{partyVote.total}</p>
											</div>
										{/each}
									</div>
									<div class="flex w-full h-[20px] mt-1">
										{#each partyDetails.resultSummary as partyVote}
											<div
												class="rounded-sm h-full {getVoteColor(partyVote.voteOption)}"
												style="width: {getWidthPercent(partyVote.total, totalVote)}%"
											/>
										{/each}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<div class="flex flex-col w-full px-4 md:px-12 mt-0 md:mt-10">
		<p class="hidden md:block text-right label-01">
			หมายเหตุ: ข้อมูลตำแหน่งและสังกัดพรรค ยึดตามวันที่ลงมติ
		</p>
		<div class="px-4 pt-4 pb-6 fluid-heading-04 bg-gray-10">ผลการลงมติรายคน</div>
		<div class="flex">
			<TextInput size="xl" placeholder="ค้นด้วยชื่อ-นามสกุล" />
			<Button>สำรวจแบบละเอียด</Button>
		</div>
		<div class="flex w-full border-t border-gray-30">
			<div class="w-[112px] md:w-1/4 heading-compact-01 py-[11px] md:py-[15px] px-4">
				ชื่อ-นามสกุล
			</div>
			<div class="w-[112px] md:w-1/4 heading-compact-01 py-[11px] md:py-[15px] px-4">ตำแหน่ง</div>
			<div class="w-[112px] md:w-1/4 heading-compact-01 py-[11px] md:py-[15px] px-4">
				สังกัดพรรค
			</div>
			<div
				class="hidden md:block w-[112px] md:w-1/4 heading-compact-01 py-[11px] md:py-[15px] px-4"
			>
				การลงมติ
			</div>
		</div>
		{#each data.resultsByPerson as voter}
			<div class="flex w-full border-t border-gray-30">
				<div class="w-[112px] md:w-1/4 body-01 underline py-[11px] md:py-[15px] px-4">
					{voter.firstname}
					{voter.lastname}
				</div>
				<div class="w-[112px] md:w-1/4 text-gray-60 body-compact-01 py-[11px] md:py-[15px] px-4">
					{voter.position}
				</div>
				<div class="w-[112px] md:w-1/4 text-gray-60 body-compact-01 py-[11px] md:py-[15px] px-4">
					{voter.party ? voter.party : ''}
				</div>
				<div class="hidden md:block w-[112px] md:w-1/4 py-[11px] md:py-[15px] px-4">
					<Tag class={getVoteColor(voter.voteOption)}>{voter.voteOption}</Tag>
				</div>
			</div>
		{/each}
	</div>
</div>
