<script lang="ts">
	import type { Menu } from '$models/menu';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';
	import ChevronDownIcon from 'carbon-icons-svelte/lib/ChevronDown.svelte';

	export let menu: Menu;
	let active = false;
	// export let index: number;
</script>

<button
	class="flex bg-white/0 p-0 border-0 hover:bg-gray-90 cursor-pointer group
    {active ? '!bg-gray-90' : ''}"
	on:click={() => (active = !active)}
>
	<div class="flex items-center px-4">
		<div class="flex w-4">
			{#if menu.icon === WeVisIcon}
				<svelte:component this={menu.icon} size={16} viewBoxWidth={16} viewBoxHeight={8} />
			{:else}
				<svelte:component this={menu.icon} class="text-inverse-link" />
			{/if}
		</div>
		<p
			class="text-gray-30 p-3 whitespace-nowrap group-hover:text-gray-10
            {active ? '!text-gray-10' : ''}"
		>
			{menu.label}
		</p>
		<span>
			<ChevronDownIcon
				size={16}
				class="{active ? 'rotate-180' : ''}  transition-all duration-200"
			/>
		</span>
	</div>
</button>
{#if active}
	<div class="flex flex-col absolute bg-gray-90 w-[200px]">
		<slot />
	</div>
{/if}
