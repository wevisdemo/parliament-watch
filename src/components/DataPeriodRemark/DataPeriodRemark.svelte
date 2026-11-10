<script lang="ts">
	import { formatThaiDate, formatThaiYear } from '$lib/date';

	interface Props {
		updatedAt: Date | string | null;
		variant?: 'updated' | 'coverage' | 'changed' | 'profile' | 'scraped';
	}

	let { updatedAt, variant = 'updated' }: Props = $props();

	let updatedAtText = $derived(updatedAt ? formatThaiDate(updatedAt) : 'ไม่ทราบ');
</script>

<p class="helper-text-01 text-gray-60">
	{#if variant === 'coverage'}
		ข้อมูลครอบคลุมปี 2562–{updatedAt ? formatThaiYear(updatedAt) : 'ปัจจุบัน'} (วันที่ล่าสุดอาจแตกต่างกันตามประเภทข้อมูล)
		<a
			href="/about#เกี่ยวกับข้อมูลในเว็บไซต์"
			class="text-[inherit] underline hover:text-interactive-01">ดูเพิ่มเติม</a
		>
	{:else if variant === 'changed'}
		มีการเปลี่ยนแปลงล่าสุด: {updatedAtText}
	{:else if variant === 'profile'}
		อัปเดตประวัติล่าสุด: {updatedAtText}
	{:else if variant === 'scraped'}
		ดึงข้อมูลจาก<a
			href="https://lis.parliament.go.th"
			target="_blank"
			rel="noopener noreferrer"
			class="text-[inherit] underline hover:text-interactive-01">เว็บต้นทาง</a
		>ล่าสุด: {updatedAtText} (ข้อมูลอาจล่าช้ากว่าเหตุการณ์จริง หากข้อมูลต้นทางยังไม่ได้อัปเดต)
	{:else}
		อัปเดตข้อมูล: {updatedAtText}
	{/if}
</p>
