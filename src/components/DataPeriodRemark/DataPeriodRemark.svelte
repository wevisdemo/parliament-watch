<script lang="ts">
	export let withStartDate = false;

	const formatDate = (date: Date) =>
		date.toLocaleDateString('th-TH', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
</script>

<p class="helper-text-01 text-gray-60">
	{#if withStartDate}
		ระยะเวลาในการเก็บข้อมูล: <span class="text-nowrap"
			>{formatDate(new Date('2019-03-24'))} - {formatDate(new Date())}</span
		>
	{:else}
		อัปเดตข้อมูล: {formatDate(new Date())}
	{/if}
</p>
