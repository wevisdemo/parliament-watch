<script lang="ts">
	export let hide = false;
</script>

<div class="hidden {hide ? 'lg:hidden' : 'lg:flex'} xl:flex relative h-full">
	<div class="vl" />
	<div class="ml-4 flex h-full">
		<slot />
	</div>
</div>

<style>
	.vl {
		@apply absolute h-1/2 top-1/2 -translate-y-1/2 left-0 border-solid border-l border-gray-80 mx-2;
	}
</style>
