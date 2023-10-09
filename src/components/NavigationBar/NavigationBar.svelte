<script lang="ts">
	import { TestTool } from 'carbon-icons-svelte';
	import SideMenu from './SideMenu.svelte';
	import SideNav from './SideNav.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';

	let sideNavActive = false;
	let screenSize: number;
	$: if (screenSize > 1056) sideNavActive = false;

	let menuList = [
		{
			label: 'สมาชิกรัฐสภา',
			icon: PoliticianIcon,
			sub: [
				{ label: 'สภาผู้แทนราษฎร', icon: '' },
				{ label: 'วุฒิสภา', icon: '' }
			]
		},
		{
			label: 'การออกกฎหมาย',
			icon: LawIcon,
			sub: [
				{ label: 'กฎหมายในกระบวนการ', icon: '' },
				{ label: 'รัฐออกกฎหมายอย่างไร', icon: '' }
			]
		},
		{
			label: 'การลงมติ',
			icon: VoteIcon
		},
		{
			label: 'เกี่ยวกับเรา',
			icon: '',
			sub: [
				{ label: 'ที่มาของโครงการ', icon: '' },
				{ label: 'ข้อมูลในเว็บนี้', icon: '' },
				{ label: 'เกี่ยวกับ WeVis', icon: '' }
			]
		}
	];
</script>

<svelte:window bind:innerWidth={screenSize} />
<header class="flex sticky items-center justify-between h-12 px-6 lg:px-10 bg-gray-100 z-20">
	<div class="leading flex">
		<SideMenu isActive={sideNavActive} on:click={() => (sideNavActive = !sideNavActive)} />
		<a href="/">
			<picture class="flex items-center h-full">
				<source media="(min-width: 1056px)" srcset="/images/logo/pw-long-white.png" height="18" />
				<img src="/images/logo/pw-short-white.png" alt="Parliament Watch" height="28" />
			</picture>
		</a>
	</div>
	<div class="nav" />
	<div class="trailing" />
</header>
<SideNav isActive={sideNavActive}>
	<ul>
		{#each menuList as menu}
			<div class="flex flex-col">
				<li class="font-gray-10 p-2">{menu.label}</li>
				{#if menu.sub}
					<div class="pl-8">
						<ul>
							{#each menu.sub as sub, idx}
								{#if idx < menu.sub.length - 1}
									<hr class="  border-0 border-b p-0 m-0 border-gray-30/20 z-40" />
								{/if}
								<li class=" font-extralight font-gray-30 p-2">{sub.label}</li>
								{#if idx < menu.sub.length - 1}
									<hr class=" border-0 border-b p-0 m-0 border-gray-30/20 z-40" />
								{/if}
							{/each}
						</ul>
					</div>
				{/if}
			</div>
			<hr class=" border-0 border-b p-0 m-0 border-gray-30/20 z-40" />
		{/each}
	</ul>
</SideNav>
