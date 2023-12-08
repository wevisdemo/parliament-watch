<script context="module" lang="ts">
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';

	export const menuList: Menu[] = [
		{
			label: 'นักการเมือง',
			icon: PoliticianIcon,
			url: null,
			type: MenuTypes.root,
			subs: [
				{ label: 'สภาผู้แทนราษฎร', url: '/', type: MenuTypes.link },
				{ label: 'วุฒิสภา', url: '/', type: MenuTypes.link }
			]
		},
		{
			label: 'การลงมติ',
			icon: VoteIcon,
			url: '/',
			type: MenuTypes.both
		},
		{
			label: 'การออกกฎหมาย',
			icon: LawIcon,
			url: null,
			type: MenuTypes.root,
			subs: [
				{ label: 'กฎหมายในกระบวนการ', url: '/', type: MenuTypes.link },
				{ label: 'รัฐออกกฎหมายอย่างไร', url: '/legislative-process', type: MenuTypes.link }
			]
		},
		{
			label: 'เกี่ยวกับเรา',
			icon: WeVisIcon,
			url: null,
			type: MenuTypes.root,
			subs: [
				{ label: 'ที่มาของโครงการ', url: '/', type: MenuTypes.link },
				{ label: 'ข้อมูลในเว็บนี้', url: '/', type: MenuTypes.link },
				{ label: 'เกี่ยวกับ WeVis', url: '/', type: MenuTypes.link }
			]
		}
	];
</script>

<script lang="ts">
	import { MenuTypes, type Menu } from '$models/menu';

	import Banner from './Banner.svelte';
	import MenuPane from './MenuPane.svelte';
	import MenuList from './MenuList.svelte';
	import SideMenuButton from './SideMenuButton.svelte';
	import SideMenuPane from './SideMenuPane.svelte';
	import SideMenuList from './SideMenuList.svelte';
	import NavigationPane from './NavigationPane.svelte';
	import SearchInput from './SearchInput.svelte';
	import SearchResult from '$components/SearchResult/SearchResult.svelte';
	import type { SearchResults } from '$models/search';

	let screenSize: number;
	let previousFromTop = 0;
	let showHeader = true;
	let sideNavActive = false;
	let hideMainMenu = false;
	let searchResults: SearchResults | null = null;

	$: if (screenSize > 1056) sideNavActive = false;

	function scrollEventHandler() {
		if (sideNavActive) return;

		const currentFromTop = window.scrollY;
		showHeader = currentFromTop <= previousFromTop;
		if (showHeader) {
			document.documentElement.classList.add('navbar-shown');
		} else {
			document.documentElement.classList.remove('navbar-shown');
		}
		previousFromTop = currentFromTop;
		sideNavActive = false;
	}
</script>

<svelte:window bind:innerWidth={screenSize} on:scroll={scrollEventHandler} />

<header class="w-full h-12 z-50">
	{#if showHeader}
		<NavigationPane>
			<svelte:fragment slot="leading">
				<SideMenuButton
					isActive={sideNavActive}
					on:click={() => (sideNavActive = !sideNavActive)}
				/>
				<Banner />
			</svelte:fragment>
			<svelte:fragment slot="menu">
				<MenuPane hide={hideMainMenu}>
					<MenuList {menuList} />
				</MenuPane>
			</svelte:fragment>
			<div slot="trailing" class="absolute right-0">
				<SearchInput
					on:activate={() => (hideMainMenu = true)}
					on:deactivate={() => (hideMainMenu = false)}
					bind:searchResults
				/>
				{#if searchResults !== null}
					<SearchResult {searchResults} />
				{/if}
			</div>
		</NavigationPane>
	{/if}
</header>

<SideMenuPane isActive={sideNavActive} on:backdropClick={() => (sideNavActive = !sideNavActive)}>
	{#if sideNavActive}
		<SideMenuList {menuList} />
	{/if}
</SideMenuPane>
