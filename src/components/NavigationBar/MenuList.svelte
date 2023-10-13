<script lang="ts">
	import type { Menu } from '$models/menu';
	import MenuLink from './MenuLink.svelte';
	import MenuComponent from './Menu.svelte';

	export let menuList: Menu[] = [];

	export let additionalClass = '';
</script>

<ul class="flex items-center justify-start text-white {additionalClass}">
	{#each menuList as menu, index}
		{#if menu.type === 'link' || menu.type === 'both'}
			<li class="w-full">
				<MenuLink linkMenu={menu} />
			</li>
		{:else}
			<li>
				<MenuComponent {menu}>
					<svelte:self menuList={menu.subs} additionalClass="flex-col !items-start shadow-xl" />
				</MenuComponent>
			</li>
		{/if}
	{/each}
</ul>
