<script>
	import { slide } from 'svelte/transition';
</script>

<nav
	class="flex fixed top-0 items-center w-full justify-start h-12 bg-gray-100"
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
