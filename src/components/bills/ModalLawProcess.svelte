<script lang="ts">
	import { entranceExpressive } from '$lib/easing';
	import { createDialog } from '@melt-ui/svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import { fade, fly } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const {
		elements: { trigger, portalled, overlay, content, title, close },
		states: { open }
	} = createDialog();
</script>

<button
	class={twMerge('helper-text-01 text-link-01 underline', className)}
	{...$trigger}
	use:$trigger.action
>
	มีขั้นตอนอะไรบ้างกว่าจะผ่านกฎหมายสำเร็จ?
</button>

<div {...$portalled} use:$portalled.action>
	{#if $open}
		<div
			{...$overlay}
			use:$overlay.action
			class="fixed inset-0 z-40 bg-black/60"
			transition:fade={{ duration: 240, easing: entranceExpressive }}
		></div>
		<div
			{...$content}
			use:$content.action
			class="fixed left-1/2 top-1/2 z-40 max-h-[620px] w-full
			max-w-[380px] rounded-sm bg-white"
			style="transform:translate(-50%,-50%)"
			transition:fly={{ y: -24, duration: 240, easing: entranceExpressive }}
		>
			<div class="flex items-start justify-between gap-4 p-4">
				<h2 {...$title} use:$title.action class="heading-03">ขั้นตอนการผ่านกฎหมาย</h2>
				<button {...$close} use:$close.action><Close width="20" height="20" /></button>
			</div>
			<img
				class="mx-auto h-auto w-full max-w-[330px]"
				src="/images/bills/lawprocess.svg"
				alt="ขั้นตอนการผ่านกฎหมายมี 5 ขั้นตอน ได้แก่ 1. การเสนอร่างกฎหมาย 2. การพิจารณาโดยสภาผู้แทนราษฎร (มี 3 วาระ) 3. การพิจารณาโดยวุฒิสภา (มี 3 วาระ) 4. การวินิิจฉัยของศาลรัฐธรรมนูญ และ 5. การประกาศใช้เป็นกฎหมาย"
				width="330"
				height="478"
				loading="lazy"
				decoding="async"
			/>
			<div class="flex">
				<a href="/legislative-process" class="flex items-center gap-2 px-4 pb-8 pt-4 text-link-01">
					<span class="body-compact-01">อ่านรายละเอียดเพิ่มเติม</span>
					<ArrowRight />
				</a>
			</div>
		</div>
	{/if}
</div>
