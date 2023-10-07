<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import PoliticianProfile from './PoliticianProfile.svelte';
	import {
		movingForwardParty,
		democratsParty,
		pheuThaiParty,
		bhumjaithaiParty
	} from '../../mocks/data/party';
	export let Hst: Hst;
</script>

<Hst.Story title="PoliticianProfile">
	<div class="grid grid-cols-2 gap-4">
		<PoliticianProfile
			id={1}
			firstname="ปิยบุตร"
			lastname="แสงกนกกุล"
			avatar="https://via.placeholder.com/64"
			party={movingForwardParty}
			role="สส. บัญชีรายชื่อ"
		/>
		<PoliticianProfile
			id={1}
			firstname="จุรินทร์"
			lastname="ลักษณวิศิษฏ์"
			avatar="https://via.placeholder.com/64"
			party={democratsParty}
			role="สส. บัญชีรายชื่อ"
		/>
		<PoliticianProfile
			id={1}
			firstname="เศรษฐา"
			lastname="ทวีสิน"
			avatar="https://via.placeholder.com/64"
			party={pheuThaiParty}
			role="สส. บัญชีรายชื่อ"
		/>
		<PoliticianProfile
			id={1}
			firstname="อนุทิน"
			lastname="ชาญวีรกูล"
			avatar="https://via.placeholder.com/64"
			party={bhumjaithaiParty}
			role="สส. บัญชีรายชื่อ"
		/>
	</div>
	<div class="grid grid-cols-2 gap-4 mt-5">
		<PoliticianProfile
			id={1}
			firstname="ปิยบุตร"
			lastname="แสงกนกกุล"
			avatar="https://via.placeholder.com/64"
			party={movingForwardParty}
			role="สส. บัญชีรายชื่อ"
			isLarge
		/>
		<PoliticianProfile
			id={1}
			firstname="จุรินทร์"
			lastname="ลักษณวิศิษฏ์"
			avatar="https://via.placeholder.com/64"
			party={democratsParty}
			role="สส. บัญชีรายชื่อ"
			isLarge
		/>
		<PoliticianProfile
			id={1}
			firstname="เศรษฐา"
			lastname="ทวีสิน"
			avatar="https://via.placeholder.com/64"
			party={pheuThaiParty}
			role="สส. บัญชีรายชื่อ"
			isLarge
		/>
		<PoliticianProfile
			id={1}
			firstname="อนุทิน"
			lastname="ชาญวีรกูล"
			avatar="https://via.placeholder.com/64"
			party={bhumjaithaiParty}
			role="สส. บัญชีรายชื่อ"
			isLarge
		/>
	</div>
</Hst.Story>
