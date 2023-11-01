<script lang="ts">
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';
	import type { Party } from '$models/party';
	import { ArrowRight } from 'carbon-icons-svelte';
	import type { MainMember } from '../../routes/assemblies/[id]/+page';
	export let members: MainMember[] = [];

	const defaultParty: Party = {
		name: '',
		color: '',
		logo: ''
	};
</script>

<div class="md:py-[32px] py-[16px]">
	<div class="flex items-center p-[16px]">
		<GeneralIcon class="w-[32px] h-[32px]" />
		<span class="fluid-heading-04 ml-[16px]">สมาชิกหลัก</span>
	</div>
	<div class="border-b-[1px] border-solid border-gray-20 w-full" />
	<div class="grid md:grid-cols-3 grid-cols-1 justify-items-center gap-[8px] mt-[16px]">
		{#each members as member}
			<div class="w-[288px]">
				<span class="heading-01">{member.assemblyRole}</span>
				<PoliticianProfile
					id={'politician-' + member.politician.id}
					firstname={member.politician.firstname}
					lastname={member.politician.lastname}
					avatar={member.politician.avatar || ''}
					party={member.party || defaultParty}
					role={member.partyRole || ''}
					isLarge={true}
				/>
			</div>
		{/each}
		<!-- TODO: fill link -->
		<a
			href="/"
			class="w-full max-w-[288px] h-fit bg-blue-60 flex text-[#FFFFFF] justify-between hover:bg-blue-70"
		>
			<span class="fluid-heading-04 p-[16px]">ดูรายชื่อสมาชิกทั้งหมด</span>
			<div class="pr-[16px] pb-[16px] flex items-end">
				<ArrowRight />
			</div>
		</a>
	</div>
</div>
