<script lang="ts">
	import type { RoleChange } from '../../../routes/assemblies/[id]/+page.server';
	import Calendar from 'carbon-icons-svelte/lib/Calendar.svelte';
	import RoleChangeItem from './RoleChangeItem.svelte';

	export let changeData: RoleChange[];
	export let selectedDate: Date | undefined;
	const formatDate = (date: Date) =>
		date.toLocaleDateString('th-TH', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

	$: isFocus =
		selectedDate &&
		selectedDate.getDate() === changeData[0].date.getDate() &&
		selectedDate.getMonth() === changeData[0].date.getMonth() &&
		selectedDate.getFullYear() === changeData[0].date.getFullYear();
</script>

<div>
	<div
		class="{isFocus
			? 'bg-interactive-02 text-text-04'
			: 'bg-ui-01'} flex items-center justify-between px-4 py-[11px]"
	>
		<div class="flex items-center gap-2 {!isFocus ? 'text-text-01' : ''}">
			<Calendar />
			<p class="label-01">{formatDate(changeData[0].date)}</p>
		</div>
		<p class="heading-compact-01 {!isFocus ? 'text-text-02' : ''}">
			ปรับ {changeData.length} ตำแหน่ง
		</p>
	</div>
	<div
		class="border-[1px] border-t-0
		{isFocus ? ' border-interactive-02' : ' border-interactive-02/0'}"
	>
		{#each changeData as roleChangeData}
			<RoleChangeItem
				type={roleChangeData.type}
				role={roleChangeData.role}
				party={roleChangeData.politician.party}
				avatar={roleChangeData.politician.avatar}
				firstname={roleChangeData.politician.firstname}
				lastname={roleChangeData.politician.lastname}
				id={roleChangeData.politician.id}
			/>
		{/each}
	</div>
</div>
