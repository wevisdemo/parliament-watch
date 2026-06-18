<script>
	import { slide } from 'svelte/transition';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [leading]
	 * @property {import('svelte').Snippet} [menu]
	 * @property {import('svelte').Snippet} [trailing]
	 */

	/** @type {Props} */
	let { leading, menu, trailing } = $props();
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
