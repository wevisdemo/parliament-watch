<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import LawStatusCard from './LawStatusCard.svelte';
	import type { BillStatus } from '$lib/politigraph/genql';
	import type { BillProposerType } from '$models/bill';
	export let Hst: Hst;

	const billByStatus = {
		samples: [
			{ id: '1', nickname: 'ร่าง พ.ร.บ. สุราก้าวหน้า' },
			{ id: '2', nickname: 'ร่าง พ.ร.บ. การจัดสรรที่ดิน' },
			{ id: '3', nickname: 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม' }
		],
		count: 225
	};
	const emptyBillByStatus = { ...billByStatus, samples: [], count: 0 };

	const billByProposerType = {
		proposerType: 'สมาชิกรัฐสภา' as BillProposerType,
		samples: [
			{ id: '1', nickname: 'ร่าง พ.ร.บ. สุราก้าวหน้า' },
			{ id: '2', nickname: 'ร่าง พ.ร.บ. การจัดสรรที่ดิน' },
			{ id: '3', nickname: 'ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม' }
		],
		count: 225,
		countByStatus: {
			IN_PROGRESS: 14,
			MERGED: 42,
			ENACTED: 108,
			REJECTED: 61
		}
	};
	const emptyBillByProposerType = {
		...billByProposerType,
		samples: [],
		count: 0,
		countByStatus: {
			IN_PROGRESS: 0,
			MERGED: 0,
			ENACTED: 0,
			REJECTED: 0
		}
	};

	let status: BillStatus = 'IN_PROGRESS';
	let showDescription = true;
</script>

<Hst.Story title="LawStatusCard">
	<Hst.Variant title="Status (Empty)">
		<LawStatusCard totalCount={900} bill={{ ...emptyBillByStatus, status }} {showDescription} />
	</Hst.Variant>
	<Hst.Variant title="Status (Normal)">
		<LawStatusCard totalCount={900} bill={{ ...billByStatus, status }} {showDescription} />
	</Hst.Variant>
	<Hst.Variant title="Proposer Type (Empty)">
		<LawStatusCard totalCount={900} bill={emptyBillByProposerType} />
	</Hst.Variant>
	<Hst.Variant title="Proposer Type (Normal)">
		<LawStatusCard totalCount={900} bill={billByProposerType} />
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Select
			bind:value={status}
			title="status"
			options={['IN_PROGRESS', 'MERGED', 'ENACTED', 'REJECTED']}
		/>
		<Hst.Checkbox bind:value={showDescription} title="showDescription" />
	</svelte:fragment>
</Hst.Story>
