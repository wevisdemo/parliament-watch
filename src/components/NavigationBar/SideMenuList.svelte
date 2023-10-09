<script lang="ts">
	import type { Menu } from '$models/menu';
	import SideLinkMenu from './SideLinkMenu.svelte';
	import SideMenu from './SideMenu.svelte';

	export let menuList: Menu[] = [];
</script>

<ul>
	{#each menuList as menu, index}
		<li>
			{#if menu.url}
				<SideLinkMenu linkMenu={menu} />
			{:else}
				<SideMenu {menu}>
					<svelte:self menuList={menu.subs} />
				</SideMenu>
			{/if}
		</li>
	{/each}
</ul>
