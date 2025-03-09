<script lang="ts">
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import type { Party } from '$models/party';
	import Login from 'carbon-icons-svelte/lib/Login.svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	export let type: 'in' | 'out';
	export let role: string;
	export let party: Party;
	export let avatar: string;
	export let firstname: string;
	export let lastname: string;
	export let id: string;

	$: statusStyle =
		type === 'in' ? 'bg-teal-40 translate-x-[100%] rounded-r-[4px]' : 'bg-red-60 rounded-l-[4px]';
</script>

<div class="flex gap-1 px-2">
	<div class="w-12 flex-shrink-0 px-2">
		<div class="relative h-full w-1/2 border-r-[1px] border-gray-20">
			<div
				class="{statusStyle} absolute right-0 top-2 h-[24px] w-[24px] p-[3px] md:top-1/2 md:-translate-y-1/2"
			>
				{#if type === 'in'}
					<Login class="h-[18px] w-[18px] text-white" />
				{:else}
					<Logout class="h-[18px] w-[18px] rotate-180 text-white" />
				{/if}
			</div>
		</div>
	</div>

	<div class="flex items-start gap-2 px-2 py-[12px] md:items-center md:p-2">
		<PoliticianPicture {avatar} partyLogo={party.logo} size={32} class="flex-shrink-0" />
		<div class="flex flex-col gap-1 md:flex-row">
			<a href="/politicians/{id}" class="font-sans">
				<p class="body-compact-01 text-text-primary underline hover:text-interactive-01">
					<span>{firstname}</span> <span>{lastname}</span>
				</p>
			</a>
			<p class="flex flex-col md:flex-row">
				<span class="label-02 pr-1 text-text-02"
					>{type === 'in' ? 'เข้ารับตำแหน่ง' : 'ออกจากตำแหน่ง'}</span
				>
				<span class="heading-compact-01 text-text-primary">{role}</span>
			</p>
		</div>
	</div>
</div>
