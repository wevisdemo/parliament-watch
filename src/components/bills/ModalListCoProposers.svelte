<script lang="ts">
	import { showModalListCoProposer } from '$components/bills/store';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import CoProposer from './CoProposer.svelte';
	import type { ComponentProps } from 'svelte';

	export let coProposedByPoliticians: Omit<ComponentProps<CoProposer>, 'index'>[];
</script>

{#if $showModalListCoProposer}
	<button
		on:click|self={() => {
			$showModalListCoProposer = false;
		}}
		class="model cursor-default px-5 pb-5 pt-10"
	>
		<div
			class="scrollbar relative m-auto h-full overflow-y-scroll rounded-sm bg-white"
			style="max-width: 650px; max-height:394px;"
		>
			<div class="flex items-start justify-between gap-5 p-4">
				<h1 class="heading-03 text-start">รายชื่อผู้ร่วมเสนอกฎหมาย</h1>
				<button on:click={() => ($showModalListCoProposer = false)}><CloseLarge /></button>
			</div>
			<div class="flex flex-col">
				<div class="flex px-5 pb-2">
					<p class="body-01 mr-2 text-start text-text-02">
						{coProposedByPoliticians.length} คน (เรียงตามตัวอักษร)
					</p>
				</div>
				<div class="flex flex-col pb-5 pl-8 pr-5">
					<table class="w-full">
						{#each coProposedByPoliticians as { politician, partyLogo }, i (politician.id)}
							<CoProposer index={i + 1} {politician} {partyLogo} />
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
