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

	enum ProposedByType {
		ProposedBy = 'proposedBy',
		Politician = 'politician',
		Assembly = 'assembly',
		PeopleProposer = 'peopleProposer'
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

	function getProposedByType(proposedBy: ProposedBy | Politician | Assembly | PeopleProposer) {
		if ('description' in proposedBy) {
			return ProposedByType.ProposedBy;
		} else if ('partyRoles' in proposedBy) {
			return ProposedByType.Politician;
		} else if ('ledBy' in proposedBy) {
			return ProposedByType.PeopleProposer;
		} else {
			return ProposedByType.Assembly;
		}
	}

	function getProposedByTitle(proposedBy: any) {
		if (getProposedByType(proposedBy) === ProposedByType.ProposedBy) {
			return proposedBy.name;
		} else if (getProposedByType(proposedBy) === ProposedByType.Politician) {
			return proposedBy.firstname.concat(' ', proposedBy.lastname);
		} else if (getProposedByType(proposedBy) === ProposedByType.PeopleProposer) {
			return proposedBy.ledBy;
		} else {
			return proposedBy.name;
		}
	}

	function getProposedBySubTitle(proposedBy: any) {
		if (getProposedByType(proposedBy) === ProposedByType.ProposedBy) {
			return proposedBy.description;
		} else if (getProposedByType(proposedBy) === ProposedByType.Politician) {
			return proposedBy.assemblyRoles[0].assembly.id;
		} else if (getProposedByType(proposedBy) === ProposedByType.PeopleProposer) {
			return 'และประชาชน ' + proposedBy.origin + ' คน';
		} else {
			return proposedBy.origin;
		}
	}

	function getProposedByImage(proposedBy: any) {
		if (getProposedByType(proposedBy) === ProposedByType.ProposedBy) {
			return proposedBy.avatar;
		} else if (getProposedByType(proposedBy) === ProposedByType.Politician) {
			return proposedBy.avatar;
		} else {
			return '';
		}
	}

	function getProposedByParty(proposedBy: any) {
		if (getProposedByType(proposedBy) === ProposedByType.Politician) {
			return proposedBy.partyRoles[0].party.name;
		} else {
			return '';
		}
	}
</script>

<div
	class={twMerge(
		'relative flex rounded-sm bg-white p-4 hover:bg-gray-10',
		isLandscape
			? 'max-w-[640px] flex-col gap-x-6 gap-y-4 md:flex-row md:gap-y-0'
			: 'max-w-[242px] flex-col gap-y-4 pt-6',
		isFullWidth ? 'w-full max-w-none' : '',
		className
	)}
>
	<div class={twMerge('space-y-1', isLandscape ? 'w-full md:w-2/3' : 'w-full')}>
		<a href={billUrl} class="block after:absolute after:inset-0 after:content-['']">
			<h3 class="fluid-heading-03 text-text-01">{nickname}</h3>
		</a>

		{#if title}
			<p class="text-sm text-text-02"><span class="mr-1 font-bold">ชื่อทางการ</span>{title}</p>
		{/if}

		{#if proposedBy}
			<p class="font-semibold">เสนอโดย</p>
			<!-- Handle ProposedBy -->
			{#if getProposedByType(proposedBy) === ProposedByType.ProposedBy}
				<div class="flex {isLandscape ? 'flex-col gap-x-2 md:flex-row' : 'flex-col'}">
					<figure class="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-20">
						<img
							src={getProposedByImage(proposedBy)}
							alt={getProposedByTitle(proposedBy)}
							class="h-full w-full"
							loading="lazy"
						/>
					</figure>

					<p class="text-sm">
						{getProposedByTitle(proposedBy)}
						<span class="text-gray-60">{getProposedBySubTitle(proposedBy)}</span>
					</p>
				</div>
				<!-- Handle Politician -->
			{:else if getProposedByType(proposedBy) === ProposedByType.Politician}
				<div class="flex {isLandscape ? 'flex-col gap-x-2 md:flex-row' : 'flex-col'}">
					<figure class="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-20">
						<img
							src={getProposedByImage(proposedBy)}
							alt={getProposedByTitle(proposedBy)}
							class="h-full w-full"
							loading="lazy"
						/>
					</figure>

					<div>
						<p class="text-sm">
							{getProposedByTitle(proposedBy)}
							<span class="underline">{getProposedBySubTitle(proposedBy)}</span>
						</p>
						<span class="text-sm text-gray-60">{getProposedByParty(proposedBy)}</span>
					</div>
				</div>
				<!-- Handle Assembly -->
			{:else if getProposedByType(proposedBy) === ProposedByType.Assembly}
				<div class="flex {isLandscape ? 'flex-col gap-x-2 md:flex-row' : 'flex-col'}">
					<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
						<PoliticianIcon class="stroke-white" size={16} />
					</div>

					<p class="text-sm">
						{getProposedByTitle(proposedBy)}
						<span class="underline">{getProposedBySubTitle(proposedBy)}</span>
					</p>
				</div>
				<!-- Handle PeopleProposer -->
			{:else if getProposedByType(proposedBy) === ProposedByType.PeopleProposer}
				<div class="flex {isLandscape ? 'flex-col gap-x-2 md:flex-row' : 'flex-col'}">
					<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
						<PeopleIcon class="stroke-white" size={16} />
					</div>

					<p class="text-sm">
						{getProposedByTitle(proposedBy)}
						<span class="text-gray-60">{getProposedBySubTitle(proposedBy)}</span>
					</p>
				</div>
			{/if}
		{/if}
	</div>

	<div class={isLandscape ? 'w-full md:w-1/3' : 'w-full'}>
		<div
			class="flex {isLandscape
				? 'flex-col gap-x-6 gap-y-4 md:flex-row md:gap-y-0'
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
					<p class="text-sm font-semibold text-blue-70">ผ่านมาแล้ว {daySinceProposed} วัน</p>
				{/if}
			</div>

			<ArrowRight class="ml-auto text-gray-100" />
		</div>
	</div>
</div>
