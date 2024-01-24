<script lang="ts">
	import { showModalListCoProposer } from '$components/bills/store';
	import type { Politician } from '$models/politician';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import CoProposer from './CoProposer.svelte';

	export let coProposedByPoliticians: Politician[];
</script>

{#if $showModalListCoProposer}
	<button
		on:click|self={() => {
			$showModalListCoProposer = false;
		}}
		class="model cursor-default px-5 pt-10 pb-5"
	>
		<div
			class="bg-white rounded-sm m-auto relative overflow-y-scroll scrollbar h-full"
			style="max-width: 650px; max-height:394px;"
		>
			<div class="p-4 flex justify-between items-start gap-5">
				<h1 class="heading-03 text-start">รายชื่อผู้ร่วมเสนอกฎหมาย</h1>
				<button on:click={() => ($showModalListCoProposer = false)}><CloseLarge /></button>
			</div>
			<div class="flex flex-col">
				<div class="flex px-5 pb-2">
					<p class="body-01 text-start text-text-02 mr-2">
						{coProposedByPoliticians.length} คน (เรียงตามตัวอักษร)
					</p>
				</div>
				<div class="flex flex-col pl-8 pr-5 pb-5">
					<table class="w-full">
						{#each coProposedByPoliticians as politician, i}
							<CoProposer
								index={i + 1}
								logo={politician.partyRoles.find((e) => !e.endedAt)?.party.logo}
								firstname={politician.firstname}
								lastname={politician.lastname}
							/>
						{/each}
					</table>
				</div>
			</div>
		</div>
	</button>
{/if}

<style>
	.model {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 40;
	}

	.scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
