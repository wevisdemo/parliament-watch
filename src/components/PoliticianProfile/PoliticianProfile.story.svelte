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

	let politicians = [
		{
			id: '1',
			firstname: 'ปิยบุตร',
			lastname: 'แสงกนกกุล',
			avatar: 'https://via.placeholder.com/64',
			party: movingForwardParty,
			role: 'สส. บัญชีรายชื่อ'
		},
		{
			id: '2',
			firstname: 'จุรินทร์',
			lastname: 'ลักษณวิศิษฏ์',
			avatar: 'https://via.placeholder.com/64',
			party: democratsParty,
			role: 'สส. บัญชีรายชื่อ'
		},
		{
			id: '3',
			firstname: 'เศรษฐา',
			lastname: 'ทวีสิน',
			avatar: 'https://via.placeholder.com/64',
			party: pheuThaiParty,
			role: 'สส. บัญชีรายชื่อ'
		},
		{
			id: '4',
			firstname: 'อนุทิน',
			lastname: 'ชาญวีรกูล',
			avatar: 'https://via.placeholder.com/64',
			party: bhumjaithaiParty,
			role: 'สส. บัญชีรายชื่อ'
		}
	];
</script>

<Hst.Story title="Politician Profile">
	<div class="grid grid-cols-2 gap-4">
		<Hst.Variant title="Small (Default)">
			{#each politicians as politician}
				<PoliticianProfile {...politician} />
			{/each}
		</Hst.Variant>
	</div>
	<div class="grid grid-cols-2 gap-4 mt-5">
		<Hst.Variant title="Large">
			{#each politicians as politician}
				<PoliticianProfile {...politician} isLarge />
			{/each}
		</Hst.Variant>
	</div>

	<svelte:fragment slot="controls">
		<Hst.Json bind:value={politicians} title="politicians" />
	</svelte:fragment>
</Hst.Story>
