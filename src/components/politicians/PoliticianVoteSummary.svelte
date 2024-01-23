<script lang="ts">
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import Vote from '$components/icons/VoteIcon.svelte';
	import Section from '$components/politicians/Section.svelte';
	import type { Politician } from '$models/politician';
	import { Button, InlineNotification } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import type {
		VotingAbsentStats,
		VotingHistory
	} from '../../routes/politicians/[id]/+page.server';
	// import ArrowUpRight from 'carbon-icons-svelte/lib/ArrowUpRight.svelte';

	export let politician: Politician;
	export let agreedVoting: VotingHistory;
	export let disagreedVoting: VotingHistory;
	export let votingAbsentStats: VotingAbsentStats;

	const safePercent = (n: number, outOf: number) => Math.round((n / (outOf || 1)) * 10000) / 100;

	$: absentPercentage = safePercent(votingAbsentStats.absentVoting, votingAbsentStats.totalVoting);
</script>

<!-- TODO - Correctly Refactor Later -->
<Section id="votes" title="ประวัติการลงมติ">
	<Vote slot="icon" size="32" />
	<InlineNotification
		slot="header-extension"
		class="m-0 mt-1 min-w-0"
		lowContrast
		kind="info"
		subtitle="การประเมินพฤติกรรมการลงมติ จะพิจารณาเพียงชื่อมติไม่ได้ ควรศึกษาเนื้อหาของมตินั้นๆ ประกอบด้วย"
	/>
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<h3 class="body-02 px-2 py-1 bg-teal-40">
				{agreedVoting.latest.length} มติล่าสุด ที่{politician.firstname}<span class="heading-02"
					>เห็นด้วย</span
				>
			</h3>
			<!-- TODO: add links -->
			<ul class="flex flex-col gap-2 body-01 list-disc ml-8">
				{#each agreedVoting.latest as voting, idx (idx)}
					<li>
						<a
							class="flex items-start gap-1 text-black no-underline cursor-pointer"
							href="/votings/{voting.id}"
						>
							<span class="flex-1 max-w-max underline">{voting.title}</span>
							<VotingResultTag
								class="cursor-pointer m-0 whitespace-nowrap"
								result={voting.result}
							/>
						</a>
					</li>
				{/each}
			</ul>
			<a
				href="/politicians/{politician.id}/votes?votetype=agreed"
				class="mr-auto helper-text-01 flex gap-2 items-center"
				target="_blank"
				rel="nofollow noopener noreferrer"
			>
				<span>ดู {agreedVoting.total} มติที่เห็นด้วย</span>
				<ArrowRight />
			</a>
		</div>
		<div class="flex flex-col gap-2">
			<h3 class="body-02 px-2 py-1 bg-red-50 text-white">
				{disagreedVoting.latest.length} มติล่าสุด ที่{politician.firstname}<span class="heading-02"
					>ไม่เห็นด้วย</span
				>
			</h3>
			<ul class="flex flex-col gap-2 body-01 list-disc ml-8">
				{#each disagreedVoting.latest as voting, idx (idx)}
					<li>
						<a
							class="flex items-start gap-1 text-black no-underline cursor-pointer"
							href="/votings/{voting.id}"
						>
							<span class="flex-1 max-w-max underline">{voting.title}</span>
							<VotingResultTag
								class="cursor-pointer m-0 whitespace-nowrap"
								result={voting.result}
							/>
						</a>
					</li>
				{/each}
			</ul>
			<a
				href="/politicians/{politician.id}/votes?votetype=disagreed"
				class="mr-auto helper-text-01 flex gap-2 items-center"
				target="_blank"
				rel="nofollow noopener noreferrer"
			>
				<span>ดู {disagreedVoting.total} มติที่ไม่เห็นด้วย</span>
				<ArrowRight />
			</a>
		</div>
		<div class="flex flex-col gap-2">
			<h3 class="body-02 px-2 py-1 bg-gray-20 heading-02">การลา / ขาดลงมติ</h3>
			<p class="body-02">
				{politician.firstname}ลา / ขาดลงมติในการลงมติ {votingAbsentStats.absentVoting} มติ ({absentPercentage}%)
				จากทั้งหมด
				{votingAbsentStats.totalVoting}
				มติในฐานข้อมูล ซึ่ง{absentPercentage === votingAbsentStats.averageAbsentVoting
					? 'เท่ากับ'
					: absentPercentage < votingAbsentStats.averageAbsentVoting
					? 'น้อยกว่า'
					: 'มากกว่า'}ค่ากลางของสมาชิกในสภาทั้งหมด (ค่ากลาง = {votingAbsentStats.averageAbsentVoting.toPrecision(
					3
				)}%)
			</p>
			<p class="label-01 text-gray-60">
				หมายเหตุ : การขาดลงมติ เกิดจากหลายสาเหตุ เช่น ติดประชุมอื่น ติดภารกิจสำคัญ เจ็บป่วย
				จึงอาจไม่ได้สะท้อนความไม่รับผิดชอบเสมอไป
			</p>
			<a
				href="/politicians/{politician.id}/votes?votetype=absent"
				class="mr-auto helper-text-01 flex gap-2 items-center"
				target="_blank"
				rel="nofollow noopener noreferrer"
			>
				<span>ดู {votingAbsentStats.absentVoting} มติที่ขาด</span>
				<ArrowRight />
			</a>
		</div>
		<Button href="/politicians/{politician.id}/votes" kind="tertiary" icon={ArrowRight} size="small"
			>ดูการลงมติทั้งหมด</Button
		>
	</div>
</Section>
