<script lang="ts">
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import type { VoteCardProps } from '../../routes/assemblies/[id]/+page.server';
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	export let votes: VoteCardProps[] = [];
	export let assemblyId: string;
</script>

<div class="md:py-[32px] py-[16px]">
	<div class="flex items-center p-[16px]">
		<VoteIcon class="w-[32px] h-[32px]" />
		<span class="fluid-heading-04 ml-[16px]">ผลการลงมติล่าสุด</span>
	</div>
	<div class="border-b-[1px] border-solid border-gray-20 w-full" />
	<div class="flex flex-wrap gap-[8px] mt-[16px] justify-center md:justify-start">
		{#each votes as vote}
			<VoteCard {...vote} />
		{/each}
		<a
			href="/assemblies/{assemblyId}/votes"
			class="w-full max-w-[288px] h-fit bg-blue-60 flex text-[#FFFFFF] justify-between hover:bg-blue-70"
		>
			<span class="fluid-heading-04 p-[16px]">ดูผลการลงมติทั้งหมด</span>
			<div class="pr-[16px] pb-[16px] flex items-end">
				<ArrowRight />
			</div>
		</a>
	</div>
</div>
