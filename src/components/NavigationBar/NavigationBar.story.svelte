<script lang="ts">
	import { MenuTypes, type Menu } from '$models/menu';
	import type { Announcement } from '$models/announcement';
	import type { Hst } from '@histoire/plugin-svelte';
	import NavigationBar from './NavigationBar.svelte';
	import AnnouncementBar from './AnnouncementBar.svelte';
	import PoliticianIcon from '$components/icons/PoliticianIcon.svelte';
	import LawIcon from '$components/icons/LawIcon.svelte';
	import VoteIcon from '$components/icons/VoteIcon.svelte';
	import WeVisIcon from '$components/icons/WeVisIcon.svelte';

	export let Hst: Hst;
	let searchActionLink = '/search';
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
	let announcements: Announcement[] = [
		{
			title: 'รับสมัคร',
			text: 'อาสาสมัครกรอกข้อมูลกฎหมายที่ถูกเข้าชื่อเสนอ โดยประชาชน',
			dateStart: new Date('2023-10-15'),
			dateEnd: new Date('2023-12-15'),
			link: '/volunteer'
		},
		{
			title: 'รับสมัคร',
			text: 'อาสาสมัครกรอกข้อมูลกฎหมายที่ถูกเข้าชื่อเสนอ โดยประชาชน',
			dateStart: new Date('2023-10-15'),
			dateEnd: new Date('2023-12-15'),
			link: '/volunteer',
			bgColor: 'bg-cyan-80',
			iconType: 'help'
		},
		{
			title: 'รับสมัคร',
			text: 'อาสาสมัครกรอกข้อมูลกฎหมายที่ถูกเข้าชื่อเสนอ โดยประชาชน',
			dateStart: new Date('2023-10-15'),
			dateEnd: new Date('2023-12-15'),
			link: '/volunteer',
			bgColor: 'bg-red-70',
			iconType: 'warning'
		},
		{
			title: 'รับสมัคร',
			text: 'อาสาสมัครกรอกข้อมูลกฎหมายที่ถูกเข้าชื่อเสนอ โดยประชาชน',
			dateStart: new Date('2023-10-15'),
			dateEnd: new Date('2023-12-15'),
			link: '/volunteer',
			bgColor: 'bg-green-70',
			iconType: 'success'
		}
	];
</script>

<Hst.Story title="NavigationBar">
	<NavigationBar {menuList} {searchActionLink} />
	{#each announcements as announcement}
		<AnnouncementBar {announcement} />
	{/each}
</Hst.Story>
