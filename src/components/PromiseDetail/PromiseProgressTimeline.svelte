<script lang="ts">
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import { formatThaiDate } from '$lib/date-parser';
	import type { GlobalEvent } from '$models/global-event';
	import { PromiseStatus, type Promise } from '$models/promise';
	import { Bullhorn, CheckmarkFilled } from 'carbon-icons-svelte';
	import { twMerge } from 'tailwind-merge';

	export let promise: Promise;
	export let globalEvents: GlobalEvent[];

	$: timeline = [...promise.progresses, ...globalEvents].sort((a, b) => {
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

{#each timeline as event, index}
	{@const isProgress = 'type' in event}
	<div
		class={twMerge(
			'p-4 pb-0 text-text-01',
			isProgress && event.type === 'indirect' && 'text-gray-60',
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
						isProgress && event.type === 'indirect' && 'border-dashed',
						index === timeline.length - 1 && 'h-4',
						isProgress && event.type === 'indirect' && 'border-l-gray-60'
					)}
				/>
				{#if isProgress && event.type === 'checkpoint'}
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
				{#if !isProgress || event.type === 'indirect'}
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
					<div class={twMerge('body-01', !isProgress && 'text-text-02')}>
						{formatThaiDate(event.date, true)}
					</div>
					<div class={twMerge('heading-02', !isProgress && 'text-text-02')}>
						{event.title}
					</div>
					{#if event.description}
						<div class={twMerge('body-01', !isProgress && 'text-text-02')}>
							{event.description}
						</div>
					{/if}
					{#if event.url}
						<div class="label-01 text-gray-60">
							<a
								href={event.url}
								target="_blank"
								rel="noopener noreferrer"
								class="label-01 break-all underline"
							>
								ที่มา
							</a>
						</div>
					{/if}
				</div>
				{#if isProgress && event.votingSummary}
					<VoteCard
						voting={{
							id: event.votingSummary.id,
							nickname: event.votingSummary.title || '',
							date: event.votingSummary.date,
							result: event.votingSummary.result
						}}
						highlightedVoteByGroups={highlightedVoteByGroups(
							event.votingSummary.resultsByAffiliation,
							event.votingSummary.result
						)}
						class="mb-4"
					/>
				{/if}
			</div>
		</div>
	</div>
{/each}
