<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';

	export let title = '';
	export let members: { assemblyRole: string; profile: ComponentProps<PoliticianProfile> }[];

	$: minister = members.filter(
		(m) =>
			m.assemblyRole.includes('รัฐมนตรีว่าการ') ||
			m.assemblyRole.includes('รัฐมนตรีประจำสำนักนายกรัฐมนตรี')
	);
	$: deputyMinister = members.filter((m) => m.assemblyRole.includes('รัฐมนตรีช่วย'));
</script>

<div class="flex min-w-[230px] flex-col gap-[16px] border border-ui-01 pb-[16px]">
	<div class="flex h-[34px] flex-none items-center bg-ui-01 px-[16px]">
		<p class="heading-compact-01">{title}</p>
	</div>
	{#each minister as { profile }}
		<div class="flex flex-col gap-[8px] px-[24px]">
			<p class="heading-compact-01">รัฐมนตรี</p>
			<div class="-mx-2">
				<PoliticianProfile {...profile} />
			</div>
		</div>
	{/each}
	{#if deputyMinister.length != 0}
		<div class="flex flex-col px-[24px]">
			<p class="heading-compact-01 mb-[8px]">รัฐมนตรีช่วยว่าการ</p>
			{#each deputyMinister as { profile }}
				<div class="-mx-2">
					<PoliticianProfile {...profile} showAvatar={false} />
				</div>
			{/each}
		</div>
	{/if}
</div>
