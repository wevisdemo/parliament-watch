<script lang="ts">
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';
	import type { Menu } from '$models/menu';

	interface Props {
		menu: Menu;
		children?: import('svelte').Snippet;
	}

	let { menu, children }: Props = $props();
</script>

<div class="flex flex-col">
	<div class="flex items-center pl-4">
		<div class="flex w-4">
			{#if menu.icon === WeVisIcon}
				<menu.icon size={16} viewBoxWidth={16} viewBoxHeight={8} />
			{:else}
				<menu.icon class="text-inverse-link" />
			{/if}
		</div>
		<p class="whitespace-nowrap p-3 text-gray-10">{menu.label}</p>
	</div>
	{@render children?.()}
</div>
