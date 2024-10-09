<script lang="ts">
	import { Modal } from 'carbon-components-svelte';
	import PromiseStatusTag from './PromiseStatusTag.svelte';
	import type { PromiseStatus } from '$models/promise';

	export let open = false;
	export let onClose: () => void;

	const statusList = [
		{
			label: 'รอคำชี้แจงเพิ่มเติม',
			text: 'เราพบว่าคำสัญญานี้มีความคลุมเครือและกำลังอยู่ในระหว่างการขอคำชี้แจงเพิ่มเติม'
		},
		{
			label: 'ไม่พบความเคลื่อนไหว',
			text: 'เราไม่พบข้อมูลความเคลื่อนไหวที่เกี่ยวกับคำสัญญานี้'
		},
		{
			label: 'กำลังดำเนินการ',
			text: 'เราพบข้อมูลความคืบหน้า แต่ยังไม่บรรลุเป้าหมายที่ได้สัญญาไว้'
		},
		{
			label: 'ดำเนินการแล้ว',
			text: 'เราพบข้อมูลความคืบหน้า และข้อมูลที่ชี้ว่าได้บรรลุเป้าหมายที่ได้สัญญาไว้แล้ว'
		},
		{
			label: 'เลิกดำเนินการ',
			text: 'เราพบข้อมูลความคืบหน้า ที่ชี้ว่ามีการเลิกดำเนินการเพื่อบรรลุเป้าหมายตามคำสัญญานี้แล้ว'
		}
	] as { label: PromiseStatus; text: string }[];
</script>

<Modal {open} passiveModal hasScrollingContent size="xs" on:close={onClose}>
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
