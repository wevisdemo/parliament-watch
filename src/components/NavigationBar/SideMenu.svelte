<script lang="ts">
	import type { Menu } from '$models/menu';

	export let menu: Menu;
	// export let index: number;
</script>

<div class="flex flex-col">
	<div class="flex items-center pl-4">
		<div class="flex w-4">
			<svelte:component this={menu.icon} class="text-inverse-link" />
		</div>
		<p class="font-gray-10 p-3 whitespace-nowrap">{menu.label}</p>
	</div>
	<slot />
</div>
