<script lang="ts">
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import { twMerge } from 'tailwind-merge';

	export let id: string;
	export let name: string;
	export let avatar: string | undefined;
	export let partyName: string | undefined;
	export let partyLogo: string | undefined;
	export let imgSize = 48;
	export let partySize = 19;
</script>

<a
	href="/politicians/{id}"
	class="flex min-w-[144px] flex-col items-center gap-[12px] font-sans hover:underline"
>
	<PoliticianPicture {avatar} size={imgSize} {partySize} {partyLogo} />
	<div class="text-center">
		<p class={twMerge('mb-1 text-sm leading-[18px] text-text-01 underline')}>
			{name}
		</p>
		<p class={twMerge('text-text-02', 'text-xs leading-[16px]')}>
			{partyName ? 'พรรค' + partyName : 'ไม่สังกัดพรรค'}
		</p>
	</div>
</a>
