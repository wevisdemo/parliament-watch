<script lang="ts">
	import { page } from '$app/state';
	import { Button } from 'carbon-components-svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

	let description = $derived(
		page.status === 404
			? 'ขออภัย ไม่พบหน้าที่คุณต้องการ หน้านี้อาจถูกย้ายหรือลบไปแล้ว'
			: 'ขออภัย เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง'
	);

	// Hide messages like "404" or "Error: 404" that only repeat the status code
	let message = $derived(
		page.error?.message.match(new RegExp(`^(error:?\\s*)?${page.status}$`, 'i'))
			? undefined
			: page.error?.message
	);
</script>

<svelte:head>
	<title>{[page.status, message, '- Parliament Watch'].filter(Boolean).join(' ')}</title>
</svelte:head>

<div
	class="relative flex h-full min-h-[60vh] flex-col overflow-hidden bg-gradient-to-t from-[#CCEEFF] to-[#FDFEFF]"
>
	<img
		class="absolute bottom-0 left-1/2 h-auto w-full max-w-[1280px] -translate-x-1/2"
		src="/images/sapasathan.svg"
		alt=""
		width="634"
		height="153"
		loading="eager"
		decoding="async"
	/>
	<div
		class="relative flex flex-1 flex-col items-center justify-center gap-2 px-4 py-16 text-center"
	>
		<h1 class="fluid-display-01 text-text-01">{page.status}</h1>
		{#if message}
			<p class="fluid-heading-04 text-text-01">{message}</p>
		{/if}
		<p class="text-text-02">{description}</p>
		<Button class="mt-6" href="/" icon={ArrowRight}>กลับสู่หน้าหลัก</Button>
	</div>
</div>
