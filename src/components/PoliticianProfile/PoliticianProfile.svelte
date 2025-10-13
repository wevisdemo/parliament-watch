<script lang="ts">
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import { twMerge } from 'tailwind-merge';

	export let id: string;
	export let name: string;
	export let avatar: string | undefined;
	export let partyLogo: string | undefined = undefined;
	export let partyName: string | undefined = undefined;
	export let role: string | null = null;
	export let isLarge = false;
	export let isActive = true;
	export let showAvatar = true;

	$: imgSize = isLarge ? 64 : 40;
	$: imgClass = isLarge ? 'w-[64px] h-[64px]' : 'w-[40px] h-[40px]';
	$: titleClass = isLarge
		? 'text-lg leading-[28px] font-bold font-serif'
		: 'text-sm leading-[18px] underline mb-1';
	$: subtitleClass = isLarge ? 'leading-[18px]' : 'text-xs leading-[16px]';
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
