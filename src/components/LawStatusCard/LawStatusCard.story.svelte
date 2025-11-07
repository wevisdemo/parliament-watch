<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import LawStatusCard from './LawStatusCard.svelte';
	import type { BillStatus } from '$lib/politigraph/genql';
	export let Hst: Hst;

	const bill = {
		status: 'IN_PROGRESS' as BillStatus,
		samples: [
			{ id: '1', nickname: 'ร่าง พ.ร.บ. สุราก้าวหน้า' },
			{ id: '2', nickname: 'ร่าง พ.ร.บ. การจัดสรรที่ดิน' },
			{ id: '3', nickname: 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม' }
		],
		count: 225
	};
</script>

<Hst.Story title="LawStatusCard">
	<LawStatusCard totalCount={900} {bill} />
</Hst.Story>
