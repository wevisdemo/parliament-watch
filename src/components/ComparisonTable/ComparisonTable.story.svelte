<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import ComparisonTable from './ComparisonTable.svelte';
	export let Hst: Hst;
	let proposerComparisonTableData = [
		{
			'': 'ครม.',
			'ร่าง พ.ร.บ.': 'มีสิทธิเสนอร่าง',
			'ออก พ.ร.ก.': 'มีสิทธิเสนอร่าง',
			'ร่าง พ.ร.ป.': 'มีสิทธิเสนอร่าง',
			'ร่างแก้ไขบทบัญญัติใน รธน.': 'มีสิทธิเสนอร่าง'
		},
		{
			'': 'สส.',
			'ร่าง พ.ร.บ.': '20 คน',
			'ออก พ.ร.ก.': '-',
			'ร่าง พ.ร.ป.': 'สส.ไม่น้อยกว่า 1 ใน 10',
			'ร่างแก้ไขบทบัญญัติใน รธน.': 'สส.ไม่น้อยกว่า 1 ใน 5'
		},
		{
			'': 'สมาชิกรัฐสภา',
			'ร่าง พ.ร.บ.': '-',
			'ออก พ.ร.ก.': '-',
			'ร่าง พ.ร.ป.': '-',
			'ร่างแก้ไขบทบัญญัติใน รธน.': 'สส.ไม่น้อยกว่า 1 ใน 5'
		},
		{
			'': 'ประชาชนผู้มีสิทธิเลือกตั้ง',
			'ร่าง พ.ร.บ.': '10,000 คน',
			'ออก พ.ร.ก.': '-',
			'ร่าง พ.ร.ป.': '-',
			'ร่างแก้ไขบทบัญญัติใน รธน.': '50,000 คน'
		}
	];
</script>

<Hst.Story title="Table">
	<div class="body-02 font-sans"><ComparisonTable {proposerComparisonTableData} /></div>
</Hst.Story>
