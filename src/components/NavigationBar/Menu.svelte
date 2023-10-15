<script context="module" lang="ts">
	let openMenu: HTMLButtonElement | null = null;
</script>

<script lang="ts">
	import type { Menu } from '$models/menu';
	import { slide } from 'svelte/transition';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';
	import ChevronDownIcon from 'carbon-icons-svelte/lib/ChevronDown.svelte';

	export let menu: Menu;
	let active = false;
	// export let index: number;

	function menuOpen(ev: Event) {
		const clickedMenu: HTMLButtonElement = ev.currentTarget as HTMLButtonElement;
		// if open menu is not clicked menu, close open menu and open a clicked menu
		// else if open menu is clicked menu, close open menu
		if (clickedMenu !== openMenu) {
			openMenu?.click();
			openMenu = clickedMenu;
		} else {
			openMenu = null;
		}
		active = !active;
	}

	function clickOutSide(node: HTMLButtonElement) {
		const handleClick = (ev: Event) => {
			if (node && !node.contains(ev.target as Node) && !ev.defaultPrevented) {
				active = false;
				openMenu = null;
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<button
	class="flex bg-white/0 p-0 border-0 hover:bg-gray-90 cursor-pointer group
    {active ? '!bg-gray-90' : ''}"
	on:click={menuOpen}
	use:clickOutSide
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
		<span class="h-4">
			<ChevronDownIcon
				size={16}
				class="{active ? 'rotate-180 !text-gray-10' : ''}
                    text-gray-30 group-hover:text-gray-10 transition-all duration-200"
			/>
		</span>
	</div>
</button>
{#if active}
	<div
		class="flex flex-col absolute bg-gray-90 w-[225px] overflow-hidden"
		transition:slide={{ duration: 250 }}
	>
		<slot />
	</div>
{/if}
