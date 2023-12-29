<script lang="ts">
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import type { MainMember } from '../../routes/assemblies/[id]/+page.server';

	export let members: MainMember[] = [];
	export let assemblyId: string;
</script>

<div class="md:py-[32px] py-[16px]">
	<div class="flex items-center p-[16px]">
		<GeneralIcon class="w-[32px] h-[32px]" />
		<span class="fluid-heading-04 ml-[16px]">สมาชิกหลัก</span>
	</div>
	<div class="border-b-[1px] border-solid border-gray-20 w-full" />
	<div class="flex flex-wrap gap-[8px] mt-[16px] justify-center md:justify-start">
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
			class="w-full max-w-[288px] h-fit bg-blue-60 flex text-[#FFFFFF] justify-between hover:bg-blue-70"
		>
			<span class="fluid-heading-04 p-[16px]">ดูรายชื่อสมาชิกทั้งหมด</span>
			<div class="pr-[16px] pb-[16px] flex items-end">
				<ArrowRight />
			</div>
		</a>
	</div>
</div>
