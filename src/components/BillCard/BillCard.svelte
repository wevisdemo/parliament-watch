<script lang="ts">
	import { ArrowRight } from 'carbon-icons-svelte';

	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import type { BillStatus, PeopleProposer } from '$models/bill';
	import { twMerge } from 'tailwind-merge';
	import type { Politician } from '$models/politician';
	import type { Assembly } from '$models/assembly';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';

	interface ProposedBy {
		avatar: string;
		name: string;
		description: string;
	}

	// see: https://github.com/wevisdemo/parliament-watch/issues/26#issue-1937096920
	export let orientation: 'landscape' | 'portrait' = 'landscape';
	export let nickname: string;
	export let title: string | undefined = undefined;
	export let proposedBy: ProposedBy | Politician | Assembly | PeopleProposer | undefined =
		undefined;
	export let proposedOn: Date | undefined = undefined;
	export let status: BillStatus;
	export let currentState: string | undefined = undefined;
	export let daySinceProposed: number | undefined = undefined;
	export let billUrl: string;
	export let isFullWidth = false;
	let className = '';
	export { className as class };

	$: isLandscape = orientation === 'landscape';
</script>

<div
	class={twMerge(
		'flex relative p-4 bg-white hover:bg-gray-10 rounded-sm',
		isLandscape
			? 'flex-col md:flex-row gap-y-4 md:gap-y-0 gap-x-6 max-w-[640px]'
			: 'flex-col gap-y-4 max-w-[242px] pt-6',
		isFullWidth ? 'w-full max-w-none' : '',
		className
	)}
>
	<div class={twMerge('space-y-1', isLandscape ? 'w-full md:w-2/3' : 'w-full')}>
		<a href={billUrl} class="block after:absolute after:content-[''] after:inset-0">
			<h3 class="fluid-heading-03 text-text-01">{nickname}</h3>
		</a>

		{#if title}
			<p class="text-sm text-text-02"><span class="font-bold mr-1">ชื่อทางการ</span>{title}</p>
		{/if}

		{#if proposedBy}
			<p class="font-semibold">เสนอโดย</p>
			<!-- Handle ProposedBy -->
			{#if proposedBy.description}
				<div class="flex {isLandscape ? 'flex-col md:flex-row gap-x-2' : 'flex-col'}">
					<figure class="shrink-0 w-6 h-6 rounded-full bg-gray-20 overflow-hidden">
						<img
							src={proposedBy.avatar}
							alt={proposedBy.name}
							class="w-full h-full"
							loading="lazy"
						/>
					</figure>

					<p class="text-sm">
						{proposedBy.name} <span class="text-gray-60">{proposedBy.description}</span>
					</p>
				</div>
				<!-- Handle Politician -->
			{:else if proposedBy.partyRoles}
				<div class="flex {isLandscape ? 'flex-col md:flex-row gap-x-2' : 'flex-col'}">
					<figure class="shrink-0 w-6 h-6 rounded-full bg-gray-20 overflow-hidden">
						<img
							src={proposedBy.avatar}
							alt={proposedBy.firstname.concat(' ', proposedBy.lastname)}
							class="w-full h-full"
							loading="lazy"
						/>
					</figure>

					<div>
						<p class="text-sm">
							{proposedBy.firstname.concat(' ', proposedBy.lastname)}
							<span class="underline">{proposedBy.assemblyRoles[0].assembly.id}</span>
						</p>
						<span class="text-sm text-gray-60">{proposedBy.partyRoles[0].party.name}</span>
					</div>
				</div>
				<!-- Handle Assembly -->
			{:else if proposedBy.name}
				<div class="flex {isLandscape ? 'flex-col md:flex-row gap-x-2' : 'flex-col'}">
					<div class="bg-black w-6 h-6 rounded-full flex items-center justify-center">
						<PoliticianIcon class="stroke-white" size={16} />
					</div>

					<p class="text-sm">
						{proposedBy.firstname.concat(' ', proposedBy.lastname)}
						<span class="underline">{proposedBy.origin}</span>
					</p>
				</div>
				<!-- Handle PeopleProposer -->
			{:else if proposedBy.ledBy}
				<div class="flex {isLandscape ? 'flex-col md:flex-row gap-x-2' : 'flex-col'}">
					<div class="bg-black w-6 h-6 rounded-full flex items-center justify-center">
						<PeopleIcon class="stroke-white" size={16} />
					</div>

					<p class="text-sm">
						{proposedBy.ledBy}
						<span class="text-gray-60">์ และประชาชน {proposedBy.origin} คน</span>
					</p>
				</div>
			{/if}
		{/if}
	</div>

	<div class={isLandscape ? 'w-full md:w-1/3' : 'w-full'}>
		<div
			class="flex {isLandscape
				? 'flex-col md:flex-row gap-x-6 gap-y-4 md:gap-y-0'
				: 'flex-col gap-y-4'}"
		>
			<div class="grow space-y-2">
				{#if proposedOn}
					<div>
						<p class="text-sm font-semibold">วันที่เสนอ</p>

						<p class="text-sm">
							{proposedOn.toLocaleDateString('th-TH', {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							})}
						</p>
					</div>
				{/if}

				<div>
					<p class="text-sm font-semibold">สถานะ</p>
					<BillStatusTag isLarge {status} />
					{#if currentState}
						<p class="text-sm font-semibold">{currentState}</p>
					{/if}
				</div>

				{#if daySinceProposed}
					<p class="text-sm text-blue-70 font-semibold">ผ่านมาแล้ว {daySinceProposed} วัน</p>
				{/if}
			</div>

			<ArrowRight class="ml-auto text-gray-100" />
		</div>
	</div>
</div>
