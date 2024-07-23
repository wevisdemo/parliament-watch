<script lang="ts">
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import type { MainMember } from '../../routes/assemblies/[id]/+page.server';

	export let title = '';
	export let members: MainMember[];

	const minister = members.filter(
		(m) =>
			m.assemblyRole.includes('รัฐมนตรีว่าการ') ||
			m.assemblyRole.includes('รัฐมนตรีประจำสำนักนายกรัฐมนตรี')
	);
	const deputyMinister = members.filter((m) => m.assemblyRole.includes('รัฐมนตรีช่วย'));
</script>

<div class="flex min-w-[230px] flex-col gap-[16px] border border-ui-01 pb-[16px]">
	<div class="flex h-[34px] flex-none items-center bg-ui-01 px-[16px]">
		<p class="heading-compact-01">{title}</p>
	</div>
	{#each minister as member}
		<div class="flex flex-col gap-[8px] px-[24px]">
			<p class="heading-compact-01">รัฐมนตรี</p>
			<div class="-mx-2">
				<PoliticianProfile
					id={member.politician.id}
					firstname={member.politician.firstname}
					lastname={member.politician.lastname}
					avatar={member.politician.avatar}
					party={member.party}
				/>
			</div>
		</div>
	{/each}
	{#if deputyMinister.length != 0}
		<div class="flex flex-col px-[24px]">
			<p class="heading-compact-01 mb-[8px]">รัฐมนตรีช่วยว่าการ</p>
			{#each deputyMinister as member}
				<div class="-mx-2">
					<PoliticianProfile
						id={member.politician.id}
						firstname={member.politician.firstname}
						lastname={member.politician.lastname}
						avatar={member.politician.avatar}
						party={member.party}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>
