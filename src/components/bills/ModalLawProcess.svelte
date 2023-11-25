<script lang="ts">
	import LawProcess from '$components/bills/LawProcess.svelte';
	import { showModal } from '$components/bills/store';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

	let dialog: HTMLDialogElement;
</script>

{#if $showModal}
	<button
		on:click|self={() => {
			$showModal = false;
		}}
		class="model cursor-default px-5 py-20"
	>
		<div class="bg-white rounded-sm m-auto" style="max-width: 378px; max-height: 618px;">
			<div class="p-5 flex justify-between gap-5">
				<b class="heading-03 text-start">ขั้นตอนการผ่านกฏหมาย</b>
				<button on:click={() => ($showModal = false)}><CloseLarge /></button>
			</div>
			<LawProcess />
			<div class="px-5 pt-5 pb-10 flex items-start">
				<!-- TO DO add link -->
				<a href="/" class="flex gap-3">
					<p class="body-compact-01 text-start text-link-01">อ่านรายละเอียดเพิ่มเติม</p>
					<ArrowRight color="#3904E9" />
				</a>
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
</style>
