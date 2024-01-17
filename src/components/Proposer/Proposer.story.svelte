<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import Proposer from './Proposer.svelte';
	import { AssemblyName, type Assembly } from '$models/assembly';
	import { movingForwardPolitician } from '../../mocks/data/politician';

	const rep26: Assembly = {
		id: 'สมาชิกสภาผู้แทนราษฎร-26',
		name: AssemblyName.Representatives,
		abbreviation: 'สส.',
		term: 26,
		startedAt: new Date('01/01/2023'),
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

	export let Hst: Hst;
</script>

<Hst.Story title="Proposer" layout={{ type: 'grid', width: 400 }}>
	<Hst.Variant title="Politician">
		<Proposer
			partyPolitician={{
				politician: movingForwardPolitician,
				assembly: rep26,
				party: {
					name: 'ก้าวไกล',
					logo: 'https://www.moveforwardparty.org/wp-content/uploads/2021/03/400px-Move_Forward_Party_Logo.svg.png',
					color: '#ff7f00'
				}
			}}
		/>
	</Hst.Variant>
	<Hst.Variant title="Assembly">
		<Proposer assembly={rep26} />
	</Hst.Variant>
	<Hst.Variant title="Others">
		<Proposer
			common={{
				name: 'นายยิ่งชีพ อัชชานนท์',
				description: 'และประชาชน 200,000 คน'
			}}
		/>
	</Hst.Variant>
</Hst.Story>
