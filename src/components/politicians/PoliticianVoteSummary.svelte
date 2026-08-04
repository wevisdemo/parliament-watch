<script module lang="ts">
	export interface VotingHistory {
		total: number;
		latest: {
			id: string;
			title: string;
			result: string | null;
		}[];
	}

	export interface VotingAbsentStats {
		assemblyId: string;
		assemblyName: string;
		foundingDate: string | null;
		dissolutionDate: string | null;
		totalVoting: number;
		absentVoting: number;
		averageAbsentVotingPercent: number;
	}
</script>

<script lang="ts">
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import Vote from '$components/icons/VoteIcon.svelte';
	import Section from '$components/politicians/Section.svelte';
	import { formatDateRange } from '$lib/date.js';
	import VoteWarningNotification from './VoteWarningNotification.svelte';
	import { Button } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

	interface Props {
		politicianId: string;
		politicianFirstname: string;
		agreedVoting: VotingHistory;
		disagreedVoting: VotingHistory;
		votingAbsentStats: VotingAbsentStats[];
	}

	let {
		politicianId,
		politicianFirstname,
		agreedVoting,
		disagreedVoting,
		votingAbsentStats
	}: Props = $props();

	const formatPercent = (value: number) => `${Math.round(value * 100) / 100}`;
	const safePercent = (n: number, outOf: number) => formatPercent((n / (outOf || 1)) * 100);

	const votingSections = $derived([
		{ voting: agreedVoting, option: 'เห็นด้วย', headingClass: 'bg-teal-40' },
		{ voting: disagreedVoting, option: 'ไม่เห็นด้วย', headingClass: 'bg-red-50 text-white' }
	]);
</script>

<Section id="votes" title="ประวัติการลงมติ">
	{#snippet icon()}
		<Vote size={32} />
	{/snippet}
	<VoteWarningNotification />
	<div class="flex flex-col gap-6">
		{#each votingSections as { voting, option, headingClass } (option)}
			<div class="flex flex-col gap-2">
				<h3 class="body-02 px-2 py-1 {headingClass}">
					{voting.latest.length} มติล่าสุด ที่{politicianFirstname}<span class="heading-02"
						>{option}</span
					>
				</h3>
				<ul class="body-01 ml-8 flex list-disc flex-col gap-2">
					{#each voting.latest as latestVoting, idx (idx)}
						<li>
							<a
								class="flex cursor-pointer items-start gap-1 text-black no-underline"
								href="/votings/{latestVoting.id}"
							>
								<span class="max-w-max flex-1 underline">{latestVoting.title}</span>
								<VotingResultTag
									class="m-0 cursor-pointer whitespace-nowrap"
									result={latestVoting.result}
								/>
							</a>
						</li>
					{/each}
				</ul>
				<a
					href="/politicians/{politicianId}/votes?voteType={option}"
					class="helper-text-01 mr-auto flex items-center gap-2"
					rel="nofollow noopener noreferrer"
				>
					<span>ดู {voting.total} มติที่{option}</span>
					<ArrowRight />
				</a>
			</div>
		{/each}
		<div class="flex flex-col gap-2">
			<h3 class="body-02 heading-02 bg-gray-20 px-2 py-1">การลา / ขาดลงมติ</h3>
			{#if votingAbsentStats.length > 0}
				<ul class="body-02 ml-8 list-disc">
					{#each votingAbsentStats as stat (stat.assemblyId)}
						{@const absentPercentage = safePercent(stat.absentVoting, stat.totalVoting)}
						{@const averagePercentage = formatPercent(stat.averageAbsentVotingPercent)}
						<li>
							<span class="underline">{stat.assemblyName}</span>
							<span class="text-gray-60"
								>({formatDateRange(stat.foundingDate, stat.dissolutionDate, {
									shortMonth: true,
									hideDay: true
								})})</span
							><br />
							{politicianFirstname} ลา / ขาดลงมติ {stat.absentVoting} มติ จากทั้งหมด {stat.totalVoting}
							มติของสภาชุดนี้ คิดเป็น {absentPercentage}% ซึ่ง{absentPercentage ===
							averagePercentage
								? 'เท่ากับ'
								: Number(absentPercentage) < Number(averagePercentage)
									? 'น้อยกว่า'
									: 'มากกว่า'}ค่าเฉลี่ยของสมาชิกสภาชุดเดียวกัน (ค่าเฉลี่ย = {averagePercentage}%)
						</li>
					{/each}
				</ul>
			{/if}
			<div class="label-01 flex flex-col gap-1 text-gray-60">
				<span class="label-02 font-bold">ข้อควรระวังก่อนนำข้อมูลไปใช้</span>
				<ol class="ml-4 list-decimal">
					<li>
						การขาดลงมติ (หน่วย = มติ) ไม่เท่ากับการขาดประชุม (หน่วย = ครั้ง)
						<ul class="ml-4 list-disc">
							<li>
								เนื่องจากการประชุม 1 ครั้งอาจมีการลงมติมากกว่า 1 มติ
								และในปัจจุบันสภายังไม่มีการเปิดเผยข้อมูลการเข้าประชุมของสมาชิกสู่สาธารณะ
							</li>
						</ul>
					</li>
					<li>
						การขาดลงมติอาจเกิดจากหลายสาเหตุ
						<ul class="ml-4 list-disc">
							<li>
								เช่น ติดประชุมอื่น ติดภารกิจสำคัญ หรือเจ็บป่วย
								โดยที่ปัจจุบันสภายังไม่มีการเปิดเผยข้อมูลใบลาของสมาชิก
								ข้อมูลการขาดลงมติเพียงอย่างเดียวจึงไม่สามารถสะท้อนความรับผิดชอบในการทำงานได้ทั้งหมด
							</li>
						</ul>
					</li>
					<li>
						จำนวนมติในฐานข้อมูลน้อยกว่ามติที่มีการโหวตจริง
						<ul class="ml-4 list-disc">
							<li>
								เนื่องจากข้อมูลผลโหวตรายคนจากเว็บไซต์ต้นทาง (<a
									href="http://msbis.parliament.go.th/"
									class="underline">msbis.parliament.go.th</a
								>) มักเผยแพร่ไม่ครบหรือไม่ทันทีหลังการโหวต
								และฐานข้อมูลนี้ไม่รวมการลงมติร่างกฎหมายวาระ 2 ซึ่งเป็นการลงมติรายมาตราที่มีจำนวนมาก
							</li>
						</ul>
					</li>
				</ol>
				<span
					>ดูรายละเอียดเพิ่มเติม<a
						href="https://parliamentwatch.wevis.info/about#เกี่ยวกับข้อมูลในเว็บไซต์"
						class="underline">ที่นี่</a
					></span
				>
			</div>
			<a
				href="/politicians/{politicianId}/votes?voteType=ลา+%2F+ขาดลงมติ"
				class="helper-text-01 mr-auto flex items-center gap-2"
				rel="nofollow noopener noreferrer"
			>
				<span
					>ดู {votingAbsentStats.reduce((total, stat) => total + stat.absentVoting, 0)} มติที่ขาด</span
				>
				<ArrowRight />
			</a>
		</div>
		<Button href="/politicians/{politicianId}/votes" kind="tertiary" icon={ArrowRight} size="small"
			>ดูการลงมติทั้งหมด</Button
		>
	</div>
</Section>
