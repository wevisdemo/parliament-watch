<script lang="ts">
	import { formatThaiDate } from '$lib/date-parser';

	export let withStartDate = false;
</script>

<p class="helper-text-01 text-gray-60">
	{#if withStartDate}
		ระยะเวลาในการเก็บข้อมูล: <span class="text-nowrap">
			{formatThaiDate('2019-03-24')} - {formatThaiDate(new Date())}
		</span>
	{:else}
		อัปเดตข้อมูล: {formatThaiDate(new Date())}
	{/if}
</p>
