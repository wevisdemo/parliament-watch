<script lang="ts">
	import type { Announcement } from '$models/announcement';
	import AnnouncementBar from './AnnouncementBar.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	export let Hst: HstStory;

	const announcements: Announcement[] = [
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
			bgColor: 'bg-cyan-60',
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
	const infoAnnouncement = announcements[0];
	const helpAnnouncement = announcements[1];
	const warningAnnouncement = announcements[2];
	const successAnnouncement = announcements[3];
</script>

<Hst.Story title="AnnouncementBar">
	<Hst.Variant title="stacking">
		{#each announcements as announcement}
			<AnnouncementBar {announcement} />
		{/each}
	</Hst.Variant>
	<Hst.Variant title="info">
		<AnnouncementBar announcement={infoAnnouncement} />
	</Hst.Variant>
	<Hst.Variant title="help">
		<AnnouncementBar announcement={helpAnnouncement} />
	</Hst.Variant>
	<Hst.Variant title="warning">
		<AnnouncementBar announcement={warningAnnouncement} />
	</Hst.Variant>
	<Hst.Variant title="success">
		<AnnouncementBar announcement={successAnnouncement} />
	</Hst.Variant>
</Hst.Story>
