<script lang="ts">
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		id: string;
		name: string;
		avatar: string | undefined;
		partyLogo?: string | undefined;
		partyName?: string | undefined;
		role?: string | null;
		isLarge?: boolean;
		isActive?: boolean;
		showAvatar?: boolean;
	}

	let {
		id,
		name,
		avatar,
		partyLogo = undefined,
		partyName = undefined,
		role = null,
		isLarge = false,
		isActive = true,
		showAvatar = true
	}: Props = $props();

	let imgSize = $derived(isLarge ? 64 : 40);
	let imgClass = $derived(isLarge ? 'w-[64px] h-[64px]' : 'w-[40px] h-[40px]');
	let titleClass = $derived(
		isLarge
			? 'text-lg leading-[28px] font-bold font-serif'
			: 'text-sm leading-[18px] underline mb-1'
	);
	let subtitleClass = $derived(isLarge ? 'leading-[18px]' : 'text-xs leading-[16px]');
</script>

<a
	href="/politicians/{id}"
	class="flex gap-4 p-2 font-sans hover:underline"
	class:opacity-50={!isActive}
>
	{#if showAvatar}
		<PoliticianPicture class={imgClass} {avatar} size={imgSize} {partyLogo} />
	{/if}
	<div class="flex-1">
		<p class={twMerge('text-text-01', titleClass)}>{name}</p>
		<p class={twMerge('text-text-02', subtitleClass)}>
			{partyName ? `พรรค${partyName}` : 'ไม่สังกัดพรรค'}
		</p>
		{#if role}
			<p class={twMerge('text-text-02', subtitleClass)}>{role}</p>
		{/if}
	</div>
</a>
