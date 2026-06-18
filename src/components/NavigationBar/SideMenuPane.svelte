<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		isActive?: boolean;
		children?: import('svelte').Snippet;
	}

	let { isActive = false, children }: Props = $props();
	const dispatch = createEventDispatcher();

	function backdropClick() {
		dispatch('backdropClick');
	}
</script>

{#if isActive}
	<aside
		class="fixed left-0 top-0 z-40 h-full w-screen overflow-hidden overflow-y-auto bg-gray-90 pt-12 text-white opacity-100 transition-all duration-200 md:w-80"
		transition:slide={{ duration: 350, axis: 'x' }}
	>
		<div class="pr-2 pt-2">
			{@render children?.()}
		</div>
	</aside>

	<div
		class="fixed left-0 top-0 z-0 h-screen w-full overflow-hidden bg-white/50 backdrop-brightness-125"
		class:hidden={!isActive}
	>
		<button class="h-screen w-screen cursor-default border-0 bg-white/0" onclick={backdropClick}
		></button>
	</div>
{/if}
