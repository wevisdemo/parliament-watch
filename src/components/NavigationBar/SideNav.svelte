<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	export let isActive = false;
	const dispatch = createEventDispatcher();

	function backdropClick() {
		dispatch('backdropClick');
	}
</script>

{#if isActive}
	<aside
		class="absolute top-0 left-0 h-full pt-12 text-white bg-gray-90 z-10 w-80 opacity-100 transition-all duration-200 overflow-y-auto"
		transition:slide={{ duration: 300, axis: 'x' }}
	>
		<div class="pt-2 pr-2">
			<slot />
		</div>
	</aside>

	<div
		class="absolute top-0 left-0 h-screen backdrop-brightness-125 bg-white/50 w-full overflow-hidden z-0"
		class:hidden={!isActive}
	>
		<button class="h-screen w-screen bg-white/0 border-0 cursor-default" on:click={backdropClick} />
	</div>
{/if}
