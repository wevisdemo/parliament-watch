<script lang="ts">
	import { MenuTypes, type Menu } from '$models/menu';

	import Banner from './Banner.svelte';
	import SideMenuButton from './SideMenuButton.svelte';
	import SideMenuPane from './SideMenuPane.svelte';
	import SideMenuList from './SideMenuList.svelte';

	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';
	import NavigationPane from './NavigationPane.svelte';

	let logoLong = '/images/logo/pw-long-white.png';
	let logoShort = '/images/logo/pw-short-white.png';
	let screenSize: number;
	let previousFromTop = 0;
	let showHeader = true;
	let sideNavActive = false;

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
		<NavigationPane>
			<svelte:fragment slot="leading">
				<SideMenuButton
					isActive={sideNavActive}
					on:click={() => (sideNavActive = !sideNavActive)}
				/>
				<Banner {logoLong} {logoShort} />
			</svelte:fragment>
			<svelte:fragment slot="menu">
				<div class="hidden lg:block">
					<p class="text-white">-------MENU WILL GOING HERE-------</p>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trailing">
				<input
					type="text"
					aria-label="ค้นหาชื่อบุคคล/ร่างกฎหมาย"
					placeholder="ค้นหาชื่อบุคคล/ร่างกฎหมาย"
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
