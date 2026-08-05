<script lang="ts">
	import { formatThaiDate } from '$lib/date';

	interface Props {
		updatedAt: Date | string | null;
		withStartDate?: boolean;
	}

	let { updatedAt, withStartDate = false }: Props = $props();

	let updatedAtText = $derived(updatedAt ? formatThaiDate(updatedAt) : 'ไม่ทราบ');
</script>

<p class="helper-text-01 text-gray-60">
	{#if withStartDate}
		ระยะเวลาในการเก็บข้อมูล: <span class="text-nowrap">
			{formatThaiDate('2019-03-24')} - {updatedAtText}
		</span>
	{:else}
		อัปเดตข้อมูล: {updatedAtText}
	{/if}
</p>
