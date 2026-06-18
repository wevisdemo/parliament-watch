<script lang="ts">
	import type { Menu } from '$models/menu';
	import MenuComponent from './Menu.svelte';
	import MenuLink from './MenuLink.svelte';
	import MenuList from './MenuList.svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		menuList?: Menu[];
		additionalClass?: string;
	}

	let { menuList = [], additionalClass = '' }: Props = $props();
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
					<MenuList menuList={menu.subs} additionalClass="flex-col !items-start shadow-xl" />
				</MenuComponent>
			</li>
		{/if}
	{/each}
</ul>
