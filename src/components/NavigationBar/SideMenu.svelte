<script lang="ts">
	import type { Menu } from '$models/menu';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';

	export let menu: Menu;
</script>

<div class="flex flex-col">
	<div class="flex items-center pl-4">
		<div class="flex w-4">
			{#if menu.icon === WeVisIcon}
				<svelte:component this={menu.icon} size={16} viewBoxWidth={16} viewBoxHeight={8} />
			{:else}
				<svelte:component this={menu.icon} class="text-inverse-link" />
			{/if}
		</div>
		<p class="text-gray-10 p-3 whitespace-nowrap">{menu.label}</p>
	</div>
	<slot />
</div>
