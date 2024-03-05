<script context="module" lang="ts">
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';

	export const menuList: Menu[] = [
		{
			label: 'นักการเมือง',
			icon: PoliticianIcon,
			type: MenuTypes.root,
			subs: [
				{
					label: 'สภาผู้แทนราษฎร',
					url: '/assemblies/สภาผู้แทนราษฎร-26',
					type: MenuTypes.link
				},
				{ label: 'วุฒิสภา', url: '/assemblies/วุฒิสภา-12', type: MenuTypes.link }
			]
		},
		{
			label: 'การลงมติ',
			icon: VoteIcon,
			url: '/assemblies/สภาผู้แทนราษฎร-26/votes',
			type: MenuTypes.both
		},
		{
			label: 'การเสนอกฎหมาย',
			icon: LawIcon,
			type: MenuTypes.root,
			subs: [
				{ label: 'สำรวจร่างกฎหมายในสภา', url: '/bills', type: MenuTypes.link },
				{ label: 'รัฐออกกฎหมายอย่างไร', url: '/legislative-process', type: MenuTypes.link }
			]
		},
		{
			label: 'เกี่ยวกับเรา',
			icon: WeVisIcon,
			type: MenuTypes.root,
			subs: [
				{ label: 'ที่มาของโครงการ', url: '/about#เกี่ยวกับเว็บไซต์นี้', type: MenuTypes.link },
				{ label: 'ข้อมูลในเว็บนี้', url: '/about#เกี่ยวกับข้อมูลในเว็บไซต์', type: MenuTypes.link },
				{ label: 'เกี่ยวกับ WeVis', url: '/about#เกี่ยวกับ-WeVis', type: MenuTypes.link }
			]
		}
	];
</script>

<script lang="ts">
	import { MenuTypes, type Menu } from '$models/menu';

	import Banner from './Banner.svelte';
	import MenuList from './MenuList.svelte';
	import MenuPane from './MenuPane.svelte';
	import NavigationPane from './NavigationPane.svelte';
	import SearchContainer from './SearchContainer.svelte';
	import SideMenuButton from './SideMenuButton.svelte';
	import SideMenuList from './SideMenuList.svelte';
	import SideMenuPane from './SideMenuPane.svelte';

	let screenSize: number;
	let previousFromTop = 0;
	let showHeader = true;
	let sideNavActive = false;
	let hideMainMenu = false;

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
			<svelte:fragment slot="trailing">
				<SearchContainer
					on:activate={() => (hideMainMenu = true)}
					on:deactivate={() => (hideMainMenu = false)}
				/>
			</svelte:fragment>
		</NavigationPane>
	{/if}
</header>

<SideMenuPane isActive={sideNavActive} on:backdropClick={() => (sideNavActive = !sideNavActive)}>
	{#if sideNavActive}
		<SideMenuList {menuList} />
	{/if}
</SideMenuPane>
