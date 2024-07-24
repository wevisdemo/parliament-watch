<script lang="ts">
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import type { Party } from '$models/party';
	import { twMerge } from 'tailwind-merge';

	export let id: string;
	export let firstname: string;
	export let lastname: string;
	export let avatar: string;
	export let party: Pick<Party, 'logo' | 'name'> | undefined = undefined;
	export let imgSize = 48;
	export let partySize = 19;

	$: fullname = `${firstname} ${lastname}`;
</script>

<a
	href="/politicians/{id}"
	class="flex min-w-[144px] flex-col items-center gap-[12px] font-sans hover:underline"
>
	<PoliticianPicture {avatar} size={imgSize} {partySize} {party} />
	<div class="text-center">
		<p class={twMerge('mb-1 text-sm leading-[18px] text-text-01 underline')}>
			{fullname}
		</p>
		<p class={twMerge('text-text-02', 'text-xs leading-[16px]')}>
			{party ? 'พรรค' + party.name : 'ไม่สังกัดพรรค'}
		</p>
	</div>
</a>
