<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import BillStatusCard from './BillStatusCard.svelte';
	import { BillStatus } from '$models/bill';
	export let Hst: Hst;

	let exampleBillStatus = {
		billStatus: BillStatus.InProgress,
		billAmount: '10',
		descriptionTitle: 'ร่างกฎหมายอยู่ในขั้นตอนใดขั้นตอนหนึ่ง ได้แก่',
		descriptionList: [
			'ถูกเสนอเข้าสภา',
			'สภาผู้แทนฯ พิจารณาวาระที่ 1, 2, 3',
			'วุฒิสภาพิจารณาวาระที่ 1, 2, 3',
			'แก้ไขเพิ่มเติมเพื่อพิจารณาใหม่',
			'รัฐสภาพิจารณา'
		],
		learnMoreLabel: 'สำรวจกฎหมายที่อยู่ในกระบวนการพิจารณา',
		learnMoreUrl: '#',
		class: 'bg-yellow-10'
	};
</script>

<Hst.Story title="BillStatusCard">
	<BillStatusCard
		billAmount={exampleBillStatus.billAmount}
		billStatus={exampleBillStatus.billStatus}
		descriptionTitle={exampleBillStatus.descriptionTitle}
		descriptionList={exampleBillStatus.descriptionList}
		learnMoreLabel={exampleBillStatus.learnMoreLabel}
		learnMoreUrl={exampleBillStatus.learnMoreUrl}
		class={exampleBillStatus.class}
	/>
</Hst.Story>
