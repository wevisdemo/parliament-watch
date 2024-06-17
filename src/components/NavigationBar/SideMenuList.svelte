<script lang="ts">
	import type { Menu } from '$models/menu';
	import SideMenuLink from './SideMenuLink.svelte';
	import SideMenu from './SideMenu.svelte';

	export let menuList: Menu[] = [];
</script>

<ul>
	{#each menuList as menu}
		<li>
			{#if menu.type === 'link' || menu.type === 'both'}
				<SideMenuLink linkMenu={menu} />
			{:else}
				<SideMenu {menu}>
					<svelte:self menuList={menu.subs} />
				</SideMenu>
			{/if}
		</li>
		{#if menu.type === 'root' || menu.type === 'both'}
			<hr class="z-40 m-0 border-0 border-b border-gray-30/20 p-0" />
		{/if}
	{/each}
</ul>
