<script>
	import { slide } from 'svelte/transition';
</script>

<nav
	class="flex fixed top-0 items-center w-full justify-between h-12 px-3 lg:px-10 bg-gray-100 z-20"
	transition:slide={{ duration: 350, axis: 'y' }}
>
	<div class="flex">
		<slot name="leading" />
	</div>
	<div>
		<slot name="menu" />
	</div>
	<div>
		<slot name="trailing" />
	</div>
</nav>
