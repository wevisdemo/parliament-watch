<script lang="ts">
	import GeneralIcon from '$components/icons/GeneralIcon.svelte';
	import type { MainMember } from '../../routes/assemblies/[id]/+page.server';
	import CabinetProfile from './CabinetProfile.svelte';
	import MinistryGroup from './MinistryGroup.svelte';
	export let members: MainMember[] = [];

	$: ministries = Array.from(
		new Set(
			members.map((m) =>
				m.assemblyRole
					.replace('รัฐมนตรีว่าการ', '')
					.replace('รัฐมนตรีช่วยว่าการ', '')
					.replace('รัฐมนตรีประจำ', '')
					.replace('รัฐมนตรีช่วยประจำ', '')
			)
		)
	).filter((r) => !['นายกรัฐมนตรี', 'รองนายกรัฐมนตรี'].includes(r));

	$: primeMinister = members.find((m) => m.assemblyRole === 'นายกรัฐมนตรี');
	$: deputyPrimeMinisterGroup = members.filter((m) => m.assemblyRole === 'รองนายกรัฐมนตรี');

	$: ministryGroup = ministries
		.map((ministry) => {
			return {
				name: ministry,
				members: members.filter((m) => m.assemblyRole.includes(ministry))
			};
		})
		.sort((a, b) => b.members.length - a.members.length);
</script>

<div class="py-[16px] md:py-[32px]">
	<div class="mt-[32px] flex flex-col items-center gap-[32px]">
		<div class="flex flex-col items-center gap-[8px] md:gap-[16px]">
			<p class="fluid-heading-03">นายกรัฐมนตรี</p>
			{#if primeMinister}
				<CabinetProfile
					id={primeMinister.politician.id}
					firstname={primeMinister.politician.firstname}
					lastname={primeMinister.politician.lastname}
					avatar={primeMinister.politician.avatar}
					party={primeMinister.party}
					imgSize={80}
					partySize={32}
				/>
			{/if}
		</div>
		<div class="flex flex-col items-center gap-[8px] md:gap-[16px]">
			<p class="fluid-heading-03">รองนายกรัฐมนตรี</p>
			<div class="flex flex-wrap justify-evenly gap-[2px]">
				{#each deputyPrimeMinisterGroup as deputyPrimeMinister}
					<CabinetProfile
						id={deputyPrimeMinister.politician.id}
						firstname={deputyPrimeMinister.politician.firstname}
						lastname={deputyPrimeMinister.politician.lastname}
						avatar={deputyPrimeMinister.politician.avatar}
						party={deputyPrimeMinister.party}
					/>
				{/each}
			</div>
		</div>
		<div class="flex w-full flex-col items-center">
			<p class="fluid-heading-03">รัฐมนตรีและรัฐมนตรีช่วยว่าการ</p>
			<div class="mt-[16px] grid w-full grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-3">
				{#each ministryGroup as ministry}
					<MinistryGroup title={ministry.name} members={ministry.members} />
				{/each}
			</div>
		</div>
	</div>
</div>
