<script>
	import { slide } from 'svelte/transition';
</script>

<nav
	class="fixed top-0 flex h-12 w-full items-center justify-start bg-gray-100"
	transition:slide={{ duration: 350, axis: 'y' }}
>
	<div class="flex">
		<slot name="leading" />
	</div>
	<div class="h-full">
		<slot name="menu" />
	</div>
	<div class="ml-auto h-full">
		<slot name="trailing" />
	</div>
</nav>
