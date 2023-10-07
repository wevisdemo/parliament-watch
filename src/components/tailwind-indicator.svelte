<script>
	let showIndicator = false;

	if (process.env.NODE_ENV === 'development') {
		showIndicator = true;
	}
</script>

{#if showIndicator}
	<div
		class="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-black p-3 text-xs text-white"
	>
		<div class="block sm:hidden">xs</div>
		<div class="hidden sm:block md:hidden">sm</div>
		<div class="hidden md:block lg:hidden">md</div>
		<div class="hidden lg:block xl:hidden">lg</div>
		<div class="hidden xl:block 2xl:hidden">xl</div>
		<div class="hidden 2xl:block">2xl</div>
	</div>
{/if}
