<script context="module" lang="ts">
	export interface VotingHistory {
		total: number;
		latest: {
			id: string;
			title: string;
			result: string | null;
		}[];
	}

	export interface VotingAbsentStats {
		totalVoting: number;
		absentVoting: number;
		averageAbsentVoting: number;
	}
</script>

<script lang="ts">
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import Vote from '$components/icons/VoteIcon.svelte';
	import Section from '$components/politicians/Section.svelte';
	import { Button, InlineNotification } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

	export let politicianId: string;
	export let politicianFirstname: string;
	export let agreedVoting: VotingHistory;
	export let disagreedVoting: VotingHistory;
	export let votingAbsentStats: VotingAbsentStats;

	const safePercent = (n: number, outOf: number) => Math.round((n / (outOf || 1)) * 10000) / 100;

	$: absentPercentage = safePercent(votingAbsentStats.absentVoting, votingAbsentStats.totalVoting);
</script>

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
			<h3 class="body-02 bg-teal-40 px-2 py-1">
				{agreedVoting.latest.length} มติล่าสุด ที่{politicianFirstname}<span class="heading-02"
					>เห็นด้วย</span
				>
			</h3>
			<!-- TODO: add links -->
			<ul class="body-01 ml-8 flex list-disc flex-col gap-2">
				{#each agreedVoting.latest as voting, idx (idx)}
					<li>
						<a
							class="flex cursor-pointer items-start gap-1 text-black no-underline"
							href="/votings/{voting.id}"
						>
							<span class="max-w-max flex-1 underline">{voting.title}</span>
							<VotingResultTag
								class="m-0 cursor-pointer whitespace-nowrap"
								result={voting.result}
							/>
						</a>
					</li>
				{/each}
			</ul>
			<a
				href="/politicians/{politicianId}/votes?votetype=agreed"
				class="helper-text-01 mr-auto flex items-center gap-2"
				target="_blank"
				rel="nofollow noopener noreferrer"
			>
				<span>ดู {agreedVoting.total} มติที่เห็นด้วย</span>
				<ArrowRight />
			</a>
		</div>
		<div class="flex flex-col gap-2">
			<h3 class="body-02 bg-red-50 px-2 py-1 text-white">
				{disagreedVoting.latest.length} มติล่าสุด ที่{politicianFirstname}<span class="heading-02"
					>ไม่เห็นด้วย</span
				>
			</h3>
			<ul class="body-01 ml-8 flex list-disc flex-col gap-2">
				{#each disagreedVoting.latest as voting, idx (idx)}
					<li>
						<a
							class="flex cursor-pointer items-start gap-1 text-black no-underline"
							href="/votings/{voting.id}"
						>
							<span class="max-w-max flex-1 underline">{voting.title}</span>
							<VotingResultTag
								class="m-0 cursor-pointer whitespace-nowrap"
								result={voting.result}
							/>
						</a>
					</li>
				{/each}
			</ul>
			<a
				href="/politicians/{politicianId}/votes?votetype=disagreed"
				class="helper-text-01 mr-auto flex items-center gap-2"
				target="_blank"
				rel="nofollow noopener noreferrer"
			>
				<span>ดู {disagreedVoting.total} มติที่ไม่เห็นด้วย</span>
				<ArrowRight />
			</a>
		</div>
		<div class="flex flex-col gap-2">
			<h3 class="body-02 heading-02 bg-gray-20 px-2 py-1">การลา / ขาดลงมติ</h3>
			<p class="body-02">
				{politicianFirstname}ลา / ขาดลงมติในการลงมติ {votingAbsentStats.absentVoting} มติ ({absentPercentage}%)
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
				href="/politicians/{politicianId}/votes?votetype=absent"
				class="helper-text-01 mr-auto flex items-center gap-2"
				target="_blank"
				rel="nofollow noopener noreferrer"
			>
				<span>ดู {votingAbsentStats.absentVoting} มติที่ขาด</span>
				<ArrowRight />
			</a>
		</div>
		<Button href="/politicians/{politicianId}/votes" kind="tertiary" icon={ArrowRight} size="small"
			>ดูการลงมติทั้งหมด</Button
		>
	</div>
</Section>
