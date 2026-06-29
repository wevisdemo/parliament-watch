<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		leading?: Snippet;
		menu?: Snippet;
		trailing?: Snippet;
	}

	let { leading, menu, trailing }: Props = $props();
</script>

<nav
	class="fixed top-0 flex h-12 w-full items-center justify-start bg-gray-100"
	transition:slide={{ duration: 350, axis: 'y' }}
>
	<div class="flex">
		{@render leading?.()}
	</div>
	<div class="h-full">
		{@render menu?.()}
	</div>
	<div class="ml-auto h-full">
		{@render trailing?.()}
	</div>
</nav>
