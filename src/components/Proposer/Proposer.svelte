<script lang="ts">
	import PeopleIcon from '$components/icons/PeopleIcon.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import { formatThaiYear } from '$lib/date';
	import { enumBillCreatorType } from '$lib/politigraph/genql';

	interface PoliticianProposer {
		type: typeof enumBillCreatorType.POLITICIAN;
		id: string;
		name: string;
		image?: string | null;
		assemblyPost?: string;
		assembly?: Omit<AssemblyProposer, 'type'>;
		party?: {
			name: string;
			image?: string | null;
		};
	}

	interface AssemblyProposer {
		type: typeof enumBillCreatorType.ASSEMBLY;
		id: string;
		name: string;
		founding_date: Date | string | null;
	}

	interface PeopleProposer {
		type: typeof enumBillCreatorType.PEOPLE;
		name: string;
		signatoryCount: number | null;
	}

	export let proposer: PoliticianProposer | AssemblyProposer | PeopleProposer | undefined =
		undefined;
	export let orientation: 'landscape' | 'portrait' = 'landscape';

	$: isLandscape = orientation === 'landscape';
</script>

<div class="flex {isLandscape ? 'flex-col gap-2 md:flex-row' : 'flex-col gap-1'}">
	{#if proposer?.type === 'POLITICIAN'}
		{@const { id, name, image, assemblyPost, assembly, party } = proposer}
		<figure class="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-20">
			<img
				src={image || '/images/politicians/_placeholder.webp'}
				alt=""
				class="h-full w-full"
				loading="lazy"
			/>
		</figure>
		<p class="text-sm">
			<a href="/politicians/{id}" class="text-black">
				{name}
			</a>
			{#if assembly}
				<a href="/assemblies/{assembly.id}" class="text-sm text-black underline">
					{assemblyPost || assembly.name}
					{#if assembly.founding_date}
						({formatThaiYear(assembly.founding_date)})
					{/if}
				</a>
			{/if}
		</p>
		{#if party}
			<p class="text-sm text-gray-60">พรรค{party.name}</p>
		{/if}
	{:else if proposer?.type === 'ASSEMBLY'}
		{@const { id, name, founding_date } = proposer}
		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<PoliticianIcon class="fill-white" size={16} />
		</div>
		<a href="/assemblies/{id}" class="text-sm text-black underline">
			{name}
			{#if founding_date}
				({formatThaiYear(founding_date)})
			{/if}
		</a>
	{:else if proposer?.type === 'PEOPLE'}
		{@const { name, signatoryCount } = proposer}
		<div class="flex h-6 w-6 items-center justify-center rounded-full bg-black">
			<PeopleIcon class="fill-white" size={16} />
		</div>
		<p class="text-sm text-black">
			{name || 'ประชาชน'}
			{#if signatoryCount}
				<span class="text-gray-60"> พร้อม {signatoryCount.toLocaleString()} รายชื่อ</span>
			{/if}
		</p>
	{:else}
		<p class="text-sm text-gray-60">อื่นๆ / ไม่พบข้อมูล</p>
	{/if}
</div>
