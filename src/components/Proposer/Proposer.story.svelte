<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import Proposer from './Proposer.svelte';
	import { rep26 } from '../../mocks/data/assembly';

	export let Hst: Hst;
</script>

<Hst.Story title="Proposer">
	<Proposer assembly={rep26} />
	<Proposer
		common={{
			name: 'นายยิ่งชีพ อัชชานนท',
			description: 'และประชาชน 200,000 คน'
		}}
	/>
</Hst.Story>
