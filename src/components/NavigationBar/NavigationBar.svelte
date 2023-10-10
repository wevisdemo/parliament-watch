<script lang="ts">
	import { MenuTypes, type Menu } from '$models/menu';

	import { slide } from 'svelte/transition';
	import SideMenuButton from './SideMenuButton.svelte';
	import SideMenuPane from './SideMenuPane.svelte';
	import SideMenuList from './SideMenuList.svelte';

	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';

	let previousFromTop = 0;
	let showHeader = true;
	let sideNavActive = false;
	let screenSize: number;
	$: if (screenSize > 1056) sideNavActive = false;

	/// FOR TESTING MENU UI
	let menuList: Menu[] = [
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

		////* FOR TEST SCROLLING IN NAV
		// {
		// 	label: 'เกี่ยวกับเรา',
		// 	icon: WeVisIcon,
		// 	url: null,
		// 	type: MenuTypes.root,
		// 	subs: [
		// 		{ label: 'ที่มาของโครงการ', url: '/projectorigin', type: MenuTypes.link },
		// 		{ label: 'ข้อมูลในเว็บนี้', url: '/informations', type: MenuTypes.link },
		// 		{ label: 'เกี่ยวกับ WeVis', url: '/aboutus', type: MenuTypes.link }
		// 	]
		// },
		// {
		// 	label: 'เกี่ยวกับเรา',
		// 	icon: WeVisIcon,
		// 	url: null,
		// 	type: MenuTypes.root,
		// 	subs: [
		// 		{ label: 'ที่มาของโครงการ', url: '/projectorigin', type: MenuTypes.link },
		// 		{ label: 'ข้อมูลในเว็บนี้', url: '/informations', type: MenuTypes.link },
		// 		{ label: 'เกี่ยวกับ WeVis', url: '/aboutus', type: MenuTypes.link }
		// 	]
		// }
	];

	function scrollEventHandler(ev: Event) {
		const currentFromTop = window.scrollY;
		if (currentFromTop > previousFromTop) {
			//scrolling down
			showHeader = false;
		} else {
			//scrolling up
			showHeader = true;
		}
		previousFromTop = currentFromTop;
		sideNavActive = false;
	}
</script>

<svelte:window bind:innerWidth={screenSize} on:scroll={scrollEventHandler} />

<header class="w-screen">
	{#if showHeader}
		<nav
			class="flex fixed top-0 items-center w-full justify-between h-12 px-3 lg:px-10 bg-gray-100 z-20"
			transition:slide={{ duration: 350, axis: 'y' }}
		>
			<div class="leading flex">
				<SideMenuButton
					isActive={sideNavActive}
					on:click={() => (sideNavActive = !sideNavActive)}
				/>
				<a href="/">
					<picture class="flex items-center h-full">
						<source
							media="(min-width: 672px)"
							srcset="/images/logo/pw-long-white.png"
							height="18"
						/>
						<img src="/images/logo/pw-short-white.png" alt="Parliament Watch" height="28" />
					</picture>
				</a>
			</div>
			<div class="actions">
				<!-- ! wait for menu -->
			</div>
			<div class="trailing">
				<!--! wait for search box -->
			</div>
		</nav>
	{/if}
</header>

<SideMenuPane isActive={sideNavActive} on:backdropClick={() => (sideNavActive = !sideNavActive)}>
	{#if sideNavActive}
		<SideMenuList {menuList} />
	{/if}
</SideMenuPane>
