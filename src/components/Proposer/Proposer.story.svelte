<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import Proposer from './Proposer.svelte';
	import { AssemblyName, type Assembly } from '$models/assembly';
	import { BillProposerType } from '$models/bill';
	import { inProgressBill } from '../../mocks/data/bill';
	import type { ComponentProps } from 'svelte';

	const rep26: Assembly = {
		id: 'สภาผู้แทนราษฎร-26',
		name: AssemblyName.Representatives,
		abbreviation: 'สส.',
		term: 26,
		startedAt: new Date('01/01/2023'),
		endedAt: null,
		origin:
			'มาจากการเลือกตั้งทั่วไป พ.ศ. 2566 ประกอบด้วยสมาชิก (สส.) 500 คน ตามระบบจัดสรรปันส่วนผสมโดย 400 คนเป็นผู้แทนเขต และอีก 100 คน มาจากระบบบัญชีรายชื่อ',
		mainRoles: [
			'ประธานสภา',
			'รองประธานสภา คนที่ 1',
			'รองประธานสภา คนที่ 2',
			'ประธานฝ่ายรัฐบาล',
			'ประธานฝ่ายค้าน'
		],
		governmentParties: [],
		oppositionParties: []
	};

	let orientation: ComponentProps<Proposer>['orientation'] = 'landscape';

	export let Hst: Hst;
</script>

<Hst.Story title="Proposer" layout={{ type: 'grid', width: 400 }}>
	<Hst.Variant title="Politician">
		<Proposer {orientation} bill={inProgressBill} />
	</Hst.Variant>
	<Hst.Variant title="Cabinet">
		<Proposer
			{orientation}
			bill={{
				...inProgressBill,
				proposerType: BillProposerType.Assembly,
				proposedLedByPolitician: undefined,
				proposedByAssembly: rep26
			}}
		/>
	</Hst.Variant>
	<Hst.Variant title="People">
		<Proposer
			{orientation}
			bill={{
				...inProgressBill,
				proposerType: BillProposerType.People,
				proposedLedByPolitician: undefined,
				proposedByPeople: {
					ledBy: 'นายยิ่งชีพ',
					signatoryCount: 150000
				}
			}}
		/>
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Select bind:value={orientation} title="orientation:" options={['landscape', 'portrait']} />
	</svelte:fragment>
</Hst.Story>
