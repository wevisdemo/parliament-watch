<script lang="ts">
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import { formatThaiDate } from '$lib/date-parser';
	import { PromiseStatus, type Promise } from '$models/promise';
	import { Bullhorn, CheckmarkFilled } from 'carbon-icons-svelte';
	import { twMerge } from 'tailwind-merge';

	export let promise: Promise;

	$: timeline = promise.progresses.sort((a, b) => {
		return b.date > a.date ? 1 : -1;
	});

	const sumObj = (obj: Record<string, number>) => {
		return Object.values(obj).reduce((acc, value) => acc + value, 0);
	};

	const highlightedVoteByGroups = (resultsByAffiliation: any[], key: string) => {
		return resultsByAffiliation.map((res) => {
			return {
				name: res.name,
				count: res.resultSummary[key],
				total: sumObj(res.resultSummary)
			};
		});
	};
</script>

{#each timeline as progress, index}
	<div
		class={twMerge(
			'p-4 pb-0 text-text-01',
			progress.type === 'indirect' && 'text-gray-60',
			index === 0 && promise.status === PromiseStatus.inProgress && 'bg-yellow-10',
			index === 0 && promise.status === PromiseStatus.fulfilled && 'bg-green-10',
			index === 0 && promise.status === PromiseStatus.unhonored && 'bg-magenta-10'
		)}
	>
		{#if index === 0 && promise.status !== PromiseStatus.notStarted}
			<div class="heading-01 mb-2 text-text-primary">ความเคลื่อนไหวล่าสุด</div>
		{/if}
		<div class="flex gap-4">
			<div class="relative flex flex-col items-center">
				<div
					class={twMerge(
						'absolute inset-0 mx-auto w-[1px] flex-1 border-l border-l-text-primary',
						index !== 0 && '-top-4',
						progress.type === 'indirect' && 'border-dashed',
						index === timeline.length - 1 && 'h-4',
						progress.type === 'indirect' && 'border-l-gray-60'
					)}
				></div>
				{#if progress.type === 'checkpoint'}
					<CheckmarkFilled
						size={24}
						class={twMerge(
							'relative bg-white',
							index === 0 && promise.status === PromiseStatus.inProgress && 'bg-yellow-10',
							index === 0 && promise.status === PromiseStatus.fulfilled && 'bg-green-10',
							index === 0 && promise.status === PromiseStatus.unhonored && 'bg-magenta-10'
						)}
					/>
				{/if}
				{#if progress.type === 'indirect'}
					<Bullhorn
						size={24}
						class={twMerge(
							'relative bg-white text-gray-60',
							index === 0 && promise.status === PromiseStatus.inProgress && 'bg-yellow-10',
							index === 0 && promise.status === PromiseStatus.fulfilled && 'bg-green-10',
							index === 0 && promise.status === PromiseStatus.unhonored && 'bg-magenta-10'
						)}
					/>
				{/if}
			</div>
			<div class="flex flex-1 flex-col gap-6 md:flex-row">
				<div class="mb-4 flex flex-1 flex-col gap-2">
					<div class="body-01">{formatThaiDate(progress.date, true)}</div>
					<div class="heading-02">{progress.title}</div>
					{#if progress.description}
						<div class="body-01">{progress.description}</div>
					{/if}
					{#if progress.url}
						<div class="label-01 text-gray-60">
							ที่มา: <a
								href={progress.url}
								target="_blank"
								rel="noopener noreferrer"
								class="label-01 underline">{progress.url}</a
							>
						</div>
					{/if}
				</div>
				{#if progress.votingSummary}
					<VoteCard
						voting={{
							id: progress.votingSummary.id,
							nickname: progress.votingSummary.title || '',
							date: progress.votingSummary.date,
							result: progress.votingSummary.result
						}}
						highlightedVoteByGroups={highlightedVoteByGroups(
							progress.votingSummary.resultsByAffiliation,
							progress.votingSummary.result
						)}
						class="mb-4"
					/>
				{/if}
			</div>
		</div>
	</div>
{/each}
