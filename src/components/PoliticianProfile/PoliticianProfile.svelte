<script lang="ts">
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import type { Party } from '$models/party';
	import { twMerge } from 'tailwind-merge';

	export let id: string;
	export let firstname: string;
	export let lastname: string;
	export let avatar: string;
	export let party: Pick<Party, 'logo' | 'name'> | undefined = undefined;
	export let role: string | undefined = undefined;
	export let isLarge = false;
	export let isActive = true;

	$: fullname = `${firstname} ${lastname}`;
	$: imgSize = isLarge ? 64 : 40;
	$: imgClass = isLarge ? 'w-[64px] h-[64px]' : 'w-[40px] h-[40px]';
	$: titleClass = isLarge
		? 'text-lg leading-[28px] font-bold font-serif'
		: 'text-sm leading-[18px] underline mb-1';
	$: subtitleClass = isLarge ? 'leading-[18px]' : 'text-xs leading-[16px]';
</script>

<!-- TODO: use id to link to politician page -->
<div {id} class="p-2 font-sans flex gap-4" class:opacity-50={!isActive}>
	<PoliticianPicture class={imgClass} {avatar} size={imgSize} {party} />
	<div class="flex-1">
		<p class={twMerge('text-text-01', titleClass)}>{fullname}</p>
		{#if party}
			<p class={twMerge('text-text-02', subtitleClass)}>พรรค{party.name}</p>
		{/if}
		{#if role}
			<p class={twMerge('text-text-02', subtitleClass)}>{role}</p>
		{/if}
	</div>
</div>
