<script lang="ts">
	import Menu from 'carbon-icons-svelte/lib/Menu.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';

	let sideNavActive = false;
	$: console.log(sideNavActive);
</script>

<header class="flex sticky items-center justify-between h-12 px-8 bg-[#161616]">
	<div class="leading flex">
		<button
			class="flex items-center justify-center bg-[#161616] border-0 mr-4 cursor-pointer lg:hidden"
			on:click={() => (sideNavActive = !sideNavActive)}
		>
			{#if !sideNavActive}
				<Menu fill="white" size={24} aria-label="Open Menu" />
			{:else}
				<Close fill="white" size={24} aria-label="Close Menu" />
			{/if}
		</button>

		<a href="/">
			<picture class="flex items-center h-full">
				<source media="(min-width: 1056px)" srcset="/images/logo/pw-long-white.png" height="18" />
				<img src="/images/logo/pw-short-white.png" alt="Parliament Watch" height="28" />
			</picture>
		</a>
	</div>
	<div class="nav" />
	<div class="trailing" />
</header>
