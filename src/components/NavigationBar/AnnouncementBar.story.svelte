<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';

	import AnnouncementBar from './AnnouncementBar.svelte';
	import type { Announcement } from '$models/announcement';
	export let Hst: Hst;

	/// FOR TESTING Announcement UI
	let announcement: Announcement = {
		title: 'รับสมัคร',
		text: 'อาสาสมัครกรอกข้อมูลกฎหมายที่ถูกเข้าชื่อเสนอ โดยประชาชน',
		dateStart: new Date('2023-10-15'),
		dateEnd: new Date('2023-12-15'),
		link: '/volunteer'
	};

	const infoSource = `
    <AnnouncementBar announcement={announcementData} />
    `;
</script>

<Hst.Story title="AnnouncementBar">
	<Hst.Variant title="info" source={infoSource}>
		<AnnouncementBar {announcement} />
	</Hst.Variant>
	<Hst.Variant title="help">
		<AnnouncementBar {announcement} iconType="help" bgColor="bg-blue-40" />
	</Hst.Variant>
	<Hst.Variant title="warning">
		<AnnouncementBar {announcement} iconType="warning" bgColor="bg-red-80" />
	</Hst.Variant>
	<Hst.Variant title="success">
		<AnnouncementBar {announcement} iconType="success" bgColor="bg-green-80" />
	</Hst.Variant>
</Hst.Story>
