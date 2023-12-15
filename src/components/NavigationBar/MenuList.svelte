<script lang="ts">
	import type { Menu } from '$models/menu';
	import { twMerge } from 'tailwind-merge';
	import MenuComponent from './Menu.svelte';
	import MenuLink from './MenuLink.svelte';

	export let menuList: Menu[] = [];

	export let additionalClass = '';
</script>

<ul class={twMerge('flex items-center justify-start text-white', additionalClass)}>
	{#each menuList as menu}
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
