<script lang="ts">
	import { MenuTypes, type Menu } from '$models/menu';

	import Banner from './Banner.svelte';
	import MenuPane from './MenuPane.svelte';
	import MenuList from './MenuList.svelte';
	import SideMenuButton from './SideMenuButton.svelte';
	import SideMenuPane from './SideMenuPane.svelte';
	import SideMenuList from './SideMenuList.svelte';

	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';
	import NavigationPane from './NavigationPane.svelte';
	import SearchInput from './SearchInput.svelte';

	const menuList: Menu[] = [
		{
			label: 'สมาชิกรัฐสภา',
			icon: PoliticianIcon,
			url: null,
			type: MenuTypes.root,
			subs: [
				{ label: 'สภาผู้แทนราษฎร', url: '/representives', type: MenuTypes.link },
				{ label: 'วุฒิสภา', url: '/senate', type: MenuTypes.link }
			]
		},
		{
			label: 'การออกกฎหมาย',
			icon: LawIcon,
			url: null,
			type: MenuTypes.root,
			subs: [
				{ label: 'กฎหมายในกระบวนการ', url: '/lawinprocess', type: MenuTypes.link },
				{ label: 'รัฐออกกฎหมายอย่างไร', url: '/howtomakelaws', type: MenuTypes.link }
			]
		},
		{
			label: 'การลงมติ',
			icon: VoteIcon,
			url: '/voting',
			type: MenuTypes.both
		},
		{
			label: 'เกี่ยวกับเรา',
			icon: WeVisIcon,
			url: null,
			type: MenuTypes.root,
			subs: [
				{ label: 'ที่มาของโครงการ', url: '/projectorigin', type: MenuTypes.link },
				{ label: 'ข้อมูลในเว็บนี้', url: '/informations', type: MenuTypes.link },
				{ label: 'เกี่ยวกับ WeVis', url: '/aboutus', type: MenuTypes.link }
			]
		}
	];

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
		previousFromTop = currentFromTop;
		sideNavActive = false;
	}
</script>

<svelte:window bind:innerWidth={screenSize} on:scroll={scrollEventHandler} />

<header class="w-full fixed top-0 z-50">
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
				<SearchInput
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
