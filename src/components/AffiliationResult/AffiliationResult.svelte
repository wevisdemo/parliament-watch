<script lang="ts">
	import VoteChartTooltip from '$components/VoteChartTooltip/VoteChartTooltip.svelte';
	import type { CustomVoteOption, DefaultVoteOption } from '$models/voting.js';
	import { Add } from 'carbon-icons-svelte';
	import { onMount } from 'svelte';
	import type { Results, ResultsByParty } from '../../routes/votings/[id]/+page';

	export let affiliationName: string;
	export let resultSummary: Results;
	export let byParties: ResultsByParty[] | undefined;

	export let totalAffVote: number;

	$: highestVote = resultSummary.reduce(
		(max, current) => (current.total > max.total ? current : max),
		resultSummary[0]
	);
	$: isMpNoParty = affiliationName === 'สส.ไม่สังกัดพรรค';

	export let affiliationPercent = '100%';
	export let isViewPercent: boolean;

	export let resultColorLookup: Record<string, string | undefined>;
	export let getVoteColor: (vote: DefaultVoteOption | CustomVoteOption | string) => string;

	let isExpanded = false;
	let selectedTab: string[] = [];
	const toggleExpanding = () => {
		isExpanded = !isExpanded;
	};

	onMount(() => {
		if (window.matchMedia(`(min-width: 672px)`).matches) {
			isExpanded = true;
		}
	});
</script>

<div class="flex w-full flex-col border-t border-gray-30 pb-4 md:pb-0">
	<div
		class="flex w-full flex-col md:cursor-default"
		on:click={toggleExpanding}
		on:keypress={(e) => {
			if (e.code === 'Enter' || e.code === 'Space') toggleExpanding();
		}}
		tabindex="0"
		aria-expanded={isExpanded}
		aria-controls={'aff-' + affiliationName.replace(/\s/g, '-')}
		role="button"
	>
		<div class="mt-2 flex items-center gap-x-1">
			<p class="heading-02">
				{affiliationName}{#if isMpNoParty}<a href="#mp-no-party-footnote" class="text-text-primary"
						>*<span class="sr-only">รายละเอียด</span></a
					>{/if}
			</p>
			<p class="body-02 text-gray-60">{totalAffVote} คน</p>
			<Add class="ml-auto flex self-start justify-self-start md:hidden" />
		</div>
		<div
			class="mt-1 flex items-center gap-x-1 {resultColorLookup[highestVote.voteOption.toString()] ??
				'text-purple-70'}"
		>
			<p class="heading-03">
				{isViewPercent
					? Math.round((highestVote.total / totalAffVote) * 100) + '%'
					: highestVote.total + ' คน'}
			</p>
			<p class="heading-03">{highestVote.voteOption}</p>
		</div>
		<div class="mt-1 flex items-center gap-x-3">
			{#each resultSummary as vote}
				<div class="flex items-center gap-x-1">
					<div class="h-3 w-1 {getVoteColor(vote.voteOption)}" />
					<p class="label-01">{vote.total}</p>
				</div>
			{/each}
		</div>
		<div class="mt-1 flex h-[30px]" style:width={affiliationPercent}>
			{#each resultSummary as vote}
				{#if vote.total}
					<VoteChartTooltip
						value={vote.total}
						total={totalAffVote}
						color={getVoteColor(vote.voteOption)}
					/>
				{/if}
			{/each}
		</div>
	</div>
	{#if byParties}
		<div
			id={'aff-' + affiliationName.replace(/\s/g, '-')}
			class="{selectedTab.includes(affiliationName)
				? 'flex'
				: 'hidden'} mt-4 w-full flex-col gap-y-4 md:flex"
		>
			{#each byParties as partyDetails}
				{@const totalPartyVote = partyDetails.resultSummary.reduce(
					(acc, vote) => acc + vote.total,
					0
				)}
				<div class="flex items-start gap-x-1">
					<img
						class="h-8 w-8 rounded-full border border-gray-30"
						src={partyDetails.party.logo}
						alt={partyDetails.party.name}
						loading="lazy"
						decoding="async"
					/>
					<div class="flex w-full flex-col items-start justify-start">
						<div class="flex items-center gap-x-1">
							<p class="heading-02">{partyDetails.party.name}</p>
							<p class="body-02 text-gray-60">
								{totalPartyVote} คน
							</p>
						</div>
						<div class="mt-1 flex items-center gap-x-3">
							{#each partyDetails.resultSummary as partyVote}
								<div class="flex items-center gap-x-1">
									<div class="h-3 w-1 {getVoteColor(partyVote.voteOption)}" />
									<p class="label-01">
										{isViewPercent
											? ((partyVote.total / totalPartyVote) * 100).toLocaleString('th-TH', {
													maximumFractionDigits: 2
												}) + '%'
											: partyVote.total}
									</p>
								</div>
							{/each}
						</div>
						<div class="mt-1 flex h-[20px] w-full">
							{#each partyDetails.resultSummary as partyVote}
								{#if partyVote.total}
									<VoteChartTooltip
										value={partyVote.total}
										total={totalAffVote}
										color={getVoteColor(partyVote.voteOption)}
									/>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	{#if isMpNoParty}
		<p id="mp-no-party-footnote" class="label-01 text-gray-60">
			* ข้อมูลการสังกัดพรรคและฝ่ายในสภาฯ ยึดตามข้อมูล ณ วันที่ลงมติ
			ซึ่งเป็นไปได้ว่าในวันนั้นมีอาจสส.ที่ไม่มีสังกัดพรรคร่วมลงมติ
			เพราะอาจอยู่ระหว่างการย้ายพรรคการเมือง หรือเพิ่งโดนขับออกจากพรรค เป็นต้น ตามรัฐธรรมนูญ 60 สส.
			ต้องสังกัดพรรคใหม่ภายใน 30 วัน ในกรณีที่ถูกขับออก และ 60 วันในกรณียุบพรรค ไม่เช่นนั้นจะพ้นสภาพ
		</p>
	{/if}
</div>
