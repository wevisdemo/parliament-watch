<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import Proposer from './Proposer.svelte';
	import { rep26 } from '../../mocks/data/assembly';
	import { movingForwardPolitician } from '../../mocks/data/politician';
	import { movingForwardParty } from '../../mocks/data/party';

	export let Hst: Hst;
</script>

<Hst.Story title="Proposer">
	<Proposer
		partyPolitician={{
			politician: movingForwardPolitician,
			assembly: rep26,
			party: movingForwardParty
		}}
	/>
	<Proposer assembly={rep26} />
	<Proposer
		common={{
			name: 'นายยิ่งชีพ อัชชานนท์',
			description: 'และประชาชน 200,000 คน'
		}}
	/>
</Hst.Story>
