<script lang="ts">
	import type { Menu } from '$models/menu';
	export let linkMenu: Menu;
	export let additionalClass = '';
	// export let index: number;
</script>

<a
	href="/"
	class="flex items-center px-4 text-gray-30 hover:text-gray-10 hover:bg-gray-90 decoration-gray-30 no-underline transition-all duration-200 {additionalClass}"
>
	{#if linkMenu.icon}
		<div class="flex w-4">
			<svelte:component this={linkMenu.icon} class="text-inverse-link" />
		</div>
	{/if}
	<p class="p-3 whitespace-nowrap">{linkMenu.label}</p>
</a>
