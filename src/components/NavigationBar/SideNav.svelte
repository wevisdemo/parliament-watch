<script lang="ts">
	export let isActive = false;
</script>

<aside
	class="absolute top-0 left-0 h-screen pt-12 text-white bg-gray-80 z-10 w-80 opacity-100 transition-all duration-200 overflow-hidden"
	class:!w-0={!isActive}
	class:opacity-0={!isActive}
>
	<div class="pt-4">
		<slot />
	</div>
</aside>

<div
	class="absolute top-0 left-0 h-screen backdrop-brightness-125 bg-white/50 w-full z-0"
	class:hidden={!isActive}
/>
