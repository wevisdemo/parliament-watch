<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		class?: string;
		avatar?: string;
		size?: string | number;
		avatarClass?: string;
		partyLogo?: string | undefined;
		partySize?: string | number;
		partyClass?: string;
	}

	let {
		class: className = '',
		avatar = '/images/politicians/_placeholder.webp',
		size = '40',
		avatarClass = '',
		partyLogo = undefined,
		partySize = '16',
		partyClass = ''
	}: Props = $props();
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
	{#if partyLogo}
		<img
			class={twMerge(
				'absolute bottom-0 right-0 aspect-square overflow-hidden rounded-full border border-solid border-[#C0BFBE] bg-white object-contain',
				partyClass
			)}
			src={partyLogo}
			alt=""
			width={partySize}
			height={partySize}
			loading="lazy"
			decoding="async"
		/>
	{/if}
</div>
