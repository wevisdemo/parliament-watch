<script lang="ts">
	import type { Menu } from '$models/menu';
	import SideLinkMenu from './SideLinkMenu.svelte';
	import SideMenu from './SideMenu.svelte';

	export let menuList: Menu[] = [];
</script>

<ul>
	{#each menuList as menu, index}
		<li>
			{#if menu.type === 'link' || menu.type === 'both'}
				<SideLinkMenu linkMenu={menu} />
			{:else}
				<SideMenu {menu}>
					<svelte:self menuList={menu.subs} />
				</SideMenu>
			{/if}
		</li>
		{#if menu.type === 'root' || menu.type === 'both'}
			<hr class="  border-0 border-b p-0 m-0 border-gray-30/20 z-40" />
		{/if}
	{/each}
</ul>
