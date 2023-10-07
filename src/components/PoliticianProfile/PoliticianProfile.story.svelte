<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import PoliticianProfile from './PoliticianProfile.svelte';
	import { movingForwardParty } from '../../mocks/data/party';
	export let Hst: Hst;
</script>

<Hst.Story title="PoliticianProfile">
	<PoliticianProfile
		id={1}
		firstname="ปิยบุตร"
		lastname="แสงกนกกุล"
		avatar="https://via.placeholder.com/64"
		party={movingForwardParty}
		role="สส. บัญชีรายชื่อ"
		isLarge
	/>
</Hst.Story>
