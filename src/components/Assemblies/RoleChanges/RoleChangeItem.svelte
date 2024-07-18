<script lang="ts">
	import PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
	import type { Party } from '$models/party';
	import Login from 'carbon-icons-svelte/lib/Login.svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	export let type: 'in' | 'out';
	export let party: Party;
	export let avatar: string;
	export let firstname: string;
	export let lastname: string;
	export let role: string;
	export let id: string;

	$: statusStyle =
		type === 'in' ? 'bg-teal-40 translate-x-[100%] rounded-r-[4px]' : 'bg-red-60 rounded-l-[4px]';
</script>

<div class="flex h-12 items-center gap-1 px-2">
	<div class="h-full w-12 px-2">
		<div class="relative h-full w-1/2 border-r-[1px] border-gray-20">
			<div
				class="{statusStyle} absolute right-0 top-1/2 h-[24px] w-[24px] -translate-y-1/2 p-[3px]"
			>
				{#if type === 'in'}
					<Login class="h-[18px] w-[18px] text-white" />
				{:else}
					<Logout class="h-[18px] w-[18px] rotate-180 text-white" />
				{/if}
			</div>
		</div>
	</div>
	<div class="flex items-center">
		<PoliticianProfile {id} {firstname} {lastname} {avatar} {party} isShowPartyName={false} />
		<p>
			<span class="label-02 text-text-02">เข้ารับตำแหน่ง&nbsp;</span>
			<span class="heading-compact-01 text-text-primary">{role}</span>
		</p>
	</div>
</div>
