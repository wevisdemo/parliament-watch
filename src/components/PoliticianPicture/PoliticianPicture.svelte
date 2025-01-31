<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let className = '';
	export { className as class };
	export let avatar = '/images/politicians/_placeholder.webp';
	export let size: string | number = '40';
	export let avatarClass = '';
	export let partyImage = '/images/parties/_placeholder.webp';
	export let partySize: string | number = '16';
	export let partyClass = '';
</script>

<div class={twMerge('relative w-fit', className)}>
	<img
		src={avatar}
		alt=""
		class={twMerge('aspect-square overflow-hidden rounded-full object-cover', avatarClass)}
		width={size}
		height={size}
		loading="lazy"
		decoding="async"
	/>
	{#if partyImage}
		<img
			class={twMerge(
				'absolute bottom-0 right-0 aspect-square overflow-hidden rounded-full border border-solid border-[#C0BFBE] bg-white object-contain',
				partyClass
			)}
			src={partyImage}
			alt=""
			width={partySize}
			height={partySize}
			loading="lazy"
			decoding="async"
		/>
	{/if}
</div>
