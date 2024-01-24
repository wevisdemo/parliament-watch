<script lang="ts">
	import type { Party } from '$models/party';
	import { twMerge } from 'tailwind-merge';

	let className = '';
	export { className as class };
	export let avatar = 'https://placehold.co/128x128?text=politician';
	export let size: string | number = '40';
	export let avatarClass = '';
	export let party: Pick<Party, 'logo'> | undefined = undefined;
	export let partySize: string | number = '16';
	export let partyClass = '';
</script>

<div class={twMerge('relative w-fit', className)}>
	<img
		src={avatar}
		alt=""
		class={twMerge('rounded-full aspect-square object-cover overflow-hidden', avatarClass)}
		width={size}
		height={size}
		loading="lazy"
		decoding="async"
	/>
	{#if party}
		<img
			class={twMerge(
				'absolute bottom-0 right-0 border border-[#C0BFBE] border-solid rounded-full bg-white aspect-square object-contain overflow-hidden',
				partyClass
			)}
			src={party.logo}
			alt=""
			width={partySize}
			height={partySize}
			loading="lazy"
			decoding="async"
		/>
	{/if}
</div>
