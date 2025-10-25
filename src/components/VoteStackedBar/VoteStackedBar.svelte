<script lang="ts">
	import { DefaultVoteOption } from '$models/voting';
	import type { VoteOptionSlice } from '$lib/vote-summary';
	import { twMerge } from 'tailwind-merge';

	const optionColorClass: Record<string, string> = {
		[DefaultVoteOption.Agreed]: 'bg-teal-50',
		[DefaultVoteOption.Disagreed]: 'bg-red-50',
		[DefaultVoteOption.Novote]: 'bg-gray-70',
		[DefaultVoteOption.Abstain]: 'bg-gray-50',
		[DefaultVoteOption.Absent]: 'bg-gray-30'
	};

	const numberFormatter = new Intl.NumberFormat('th-TH', {
		maximumFractionDigits: 0
	});

	export let segments: VoteOptionSlice[] = [];
	export let total = 0;
	export let highlightOption: string | null = null;
	export let className = '';
	export { className as class };

	const accessibleLabel = segments
		.filter((segment) => segment.count > 0)
		.map((segment) => `${segment.label} ${numberFormatter.format(segment.percentage * 100)}%`)
		.join(', ');

	const getColorClass = (option: string) => optionColorClass[option] ?? 'bg-purple-60';
</script>

<div
	class={twMerge(
		'flex h-5 w-full items-stretch overflow-hidden rounded-full bg-gray-20',
		className
	)}
	role="img"
	aria-label={total ? accessibleLabel : 'ไม่มีข้อมูลคะแนนเสียง'}
>
	{#if total === 0}
		<div class="h-full w-full bg-gray-30" />
	{:else}
		{#each segments as segment (segment.option)}
			{#if segment.count > 0}
				<div
					class={twMerge(
						'flex-1 transition-all',
						getColorClass(segment.option),
						highlightOption === segment.option
							? 'ring-2 ring-white ring-offset-1 ring-offset-gray-20'
							: ''
					)}
					style={`flex-grow: ${segment.count}; flex-basis: 0;`}
					aria-label={`${segment.label} ${numberFormatter.format(segment.percentage * 100)}%`}
				/>
			{:else}
				<span class="sr-only">{segment.label} 0%</span>
			{/if}
		{/each}
	{/if}
</div>
