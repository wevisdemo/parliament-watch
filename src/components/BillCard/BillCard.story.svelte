<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';

	import { BillStatus } from '$models/bill';
	import BillCard from './BillCard.svelte';

	export let Hst: Hst;

	let nickname = 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม';
	let title = 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม';
	let proposedBy = {
		avatar: 'https://placehold.co/24x24',
		name: 'ดวงฤทธิ์ เบ็ญจาธิกุล ชัยรุ่งเรือง',
		description: 'สส. ชุดที่ 26 (2566) พรรคก้าวไกล'
	};
	let proposedOn = new Date('July 13, 2023');
	let status = BillStatus.InProgress;
	let currentState = 'สส. พิจารณา วาระ 2';
	let daySinceProposed = 210;
	let billUrl = '#';
</script>

<Hst.Story
	title="BillCard"
	layout={{
		type: 'grid',
		width: '608'
	}}
>
	<Hst.Variant title="BillCard.Landscape">
		<BillCard
			{nickname}
			{title}
			{proposedBy}
			{proposedOn}
			{status}
			{currentState}
			{daySinceProposed}
			{billUrl}
		/>
	</Hst.Variant>

	<Hst.Variant title="BillCard.Portrait">
		<BillCard
			orientation="portrait"
			{nickname}
			{title}
			{proposedBy}
			{proposedOn}
			{status}
			{currentState}
			{daySinceProposed}
			{billUrl}
		/>
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Text bind:value={nickname} title="nickname:" />
		<Hst.Text bind:value={title} title="title:" />
		<Hst.Text bind:value={proposedBy.avatar} title="proposedBy.avatar:" />
		<Hst.Text bind:value={proposedBy.name} title="proposedBy.name:" />
		<Hst.Text bind:value={proposedBy.description} title="proposedBy.description:" />
		<!-- TODOD: add date input for proposedOn -->
		<Hst.Select
			bind:value={status}
			title="status:"
			options={Object.entries(BillStatus)?.map(([label, value]) => ({ value, label }))}
		/>
		<Hst.Text bind:value={currentState} title="currentState:" />
		<Hst.Number bind:value={daySinceProposed} title="daySinceProposed:" />
		<Hst.Text bind:value={billUrl} title="billUrl:" />
	</svelte:fragment>
</Hst.Story>
