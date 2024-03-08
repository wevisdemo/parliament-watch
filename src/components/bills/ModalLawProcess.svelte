<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import { fade, fly } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import { entranceExpressive } from '$lib/easing';

	let className = '';
	export { className as class };

	const {
		elements: { trigger, portalled, overlay, content, title, close },
		states: { open }
	} = createDialog();
</script>

<button
	class={twMerge('helper-text-01 text-link-01 underline', className)}
	{...$trigger}
	use:trigger
>
	มีขั้นตอนอะไรบ้างกว่าจะผ่านกฏหมายสำเร็จ?
</button>

<div {...$portalled} use:portalled>
	{#if $open}
		<div
			{...$overlay}
			use:overlay
			class="fixed inset-0 z-40 bg-black/60"
			transition:fade={{ duration: 240, easing: entranceExpressive }}
		/>
		<div
			{...$content}
			use:content
			class="fixed left-1/2 top-1/2 z-40 max-h-[620px] w-full
			max-w-[380px] bg-white rounded-sm"
			style="transform:translate(-50%,-50%)"
			transition:fly={{ y: -24, duration: 240, easing: entranceExpressive }}
		>
			<div class="p-4 flex items-start justify-between gap-4">
				<h2 {...$title} use:title class="heading-03">ขั้นตอนการผ่านกฏหมาย</h2>
				<button {...$close} use:close><Close width="20" height="20" /></button>
			</div>
			<!-- TODO: write descriptive alt text -->
			<img
				class="max-w-[330px] w-full h-auto mx-auto"
				src="/images/bills/lawprocess.svg"
				alt=""
				width="330"
				height="478"
				loading="lazy"
				decoding="async"
			/>
			<div class="flex">
				<a href="/legislative-process" class="flex items-center gap-2 text-link-01 px-4 pt-4 pb-8">
					<span class="body-compact-01">อ่านรายละเอียดเพิ่มเติม</span>
					<ArrowRight />
				</a>
			</div>
		</div>
	{/if}
</div>
