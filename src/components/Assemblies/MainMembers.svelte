<script lang="ts">
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import type { MainMember } from '../../routes/assemblies/[id]/+page.server';

	export let members: MainMember[] = [];
	export let assemblyId: string;
</script>

<div class="py-[16px] md:py-[32px]">
	<div class="flex items-center p-[16px]">
		<GeneralIcon class="h-[32px] w-[32px]" />
		<span class="fluid-heading-04 ml-[16px]">สมาชิกหลัก</span>
	</div>
	<div class="w-full border-b-[1px] border-solid border-gray-20" />
	<div class="mt-[16px] flex flex-wrap justify-center gap-[8px] md:justify-start">
		{#each members as { politician, assemblyRole, party, description }}
			<div class="w-[288px]">
				<span class="heading-01">{assemblyRole}</span>
				<PoliticianProfile
					id={politician.id}
					firstname={politician.firstname}
					lastname={politician.lastname}
					avatar={politician.avatar}
					{party}
					role={description}
					isLarge
				/>
			</div>
		{/each}
		<a
			href="/assemblies/{assemblyId}/members"
			class="flex h-fit w-full max-w-[288px] justify-between bg-blue-60 text-[#FFFFFF] hover:bg-blue-70"
		>
			<span class="fluid-heading-04 p-[16px]">ดูรายชื่อสมาชิกทั้งหมด</span>
			<div class="flex items-end pb-[16px] pr-[16px]">
				<ArrowRight />
			</div>
		</a>
	</div>
</div>
