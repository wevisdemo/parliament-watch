<script lang="ts">
	import type { Menu } from '$models/menu';
	import SideMenu from './SideMenu.svelte';
	import SideMenuLink from './SideMenuLink.svelte';
	import SideMenuList from './SideMenuList.svelte';

	interface Props {
		menuList?: Menu[];
	}

	let { menuList = [] }: Props = $props();
</script>

<ul>
	{#each menuList as menu}
		<li>
			{#if menu.type === 'link' || menu.type === 'both'}
				<SideMenuLink linkMenu={menu} />
			{:else}
				<SideMenu {menu}>
					<SideMenuList menuList={menu.subs} />
				</SideMenu>
			{/if}
		</li>
		{#if menu.type === 'root' || menu.type === 'both'}
			<hr class="z-40 m-0 border-0 border-b border-gray-30/20 p-0" />
		{/if}
	{/each}
</ul>
