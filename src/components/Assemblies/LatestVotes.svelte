<script lang="ts">
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import VoteCard from '$components/VoteCard/VoteCard.svelte';
	import type { ComponentProps } from 'svelte';

	export let votes: ComponentProps<VoteCard>[] = [];
	export let assemblyId: string;
</script>

<div class="py-[16px] md:py-[32px]">
	<div class="flex items-center p-[16px]">
		<VoteIcon class="h-[32px] w-[32px]" />
		<span class="fluid-heading-04 ml-[16px]">ผลการลงมติล่าสุด</span>
	</div>
	<div class="w-full border-b-[1px] border-solid border-gray-20" />
	<div class="mt-[16px] flex flex-wrap justify-center gap-[8px] md:justify-start">
		{#each votes as vote}
			<VoteCard {...vote} />
		{/each}
		<a
			href="/assemblies/{assemblyId}/votes"
			class="flex h-fit w-full max-w-[288px] justify-between bg-blue-60 text-[#FFFFFF] hover:bg-blue-70"
		>
			<span class="fluid-heading-04 p-[16px]">ดูผลการลงมติทั้งหมด</span>
			<div class="flex items-end pb-[16px] pr-[16px]">
				<ArrowRight />
			</div>
		</a>
	</div>
</div>
