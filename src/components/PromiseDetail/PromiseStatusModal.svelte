<script lang="ts">
	import { Modal } from 'carbon-components-svelte';
	import PromiseStatusTag from './PromiseStatusTag.svelte';
	import type { PromiseStatus } from '$models/promise';

	export let open = false;
	export let onClose: () => void;

	const statusList = [
		{
			label: 'รอคำชี้แจงเพิ่มเติม',
			text: '[A definition that helps viewers understand the meaning and criteria of the status]'
		},
		{
			label: 'ไม่พบความเคลื่อนไหว',
			text: '[A definition that helps viewers understand the meaning and criteria of the status]'
		},
		{
			label: 'กำลังดำเนินการ',
			text: '[A definition that helps viewers understand the meaning and criteria of the status]'
		},
		{
			label: 'ดำเนินการแล้ว',
			text: '[A definition that helps viewers understand the meaning and criteria of the status]'
		},
		{
			label: 'เลิกดำเนินการ',
			text: '[A definition that helps viewers understand the meaning and criteria of the status]'
		}
	] as { label: PromiseStatus; text: string }[];
</script>

<Modal {open} passiveModal size="xs" on:close={() => onClose()}>
	<div slot="heading">
		<div class="heading-03">สถานะคำสัญญา</div>
	</div>
	<div class="mt-4 flex flex-col gap-4">
		{#each statusList as status}
			<div>
				<PromiseStatusTag status={status.label} />
				<div class="body-02 mt-2">{status.text}</div>
			</div>
		{/each}
	</div>
</Modal>
