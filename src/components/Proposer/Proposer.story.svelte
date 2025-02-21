<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import Proposer from './Proposer.svelte';
	import { AssemblyName } from '$models/assembly';
	import type { ComponentProps } from 'svelte';
	import { movingForwardPolitician } from '../../mocks/data/politician';
	import { movingForwardParty } from '../../mocks/data/party';

	const rep26 = {
		id: 'สภาผู้แทนราษฎร-26',
		name: AssemblyName.Representatives,
		abbreviation: 'สส.',
		term: 26,
		startedAt: new Date('01/01/2023')
	};

	let orientation: ComponentProps<Proposer>['orientation'] = 'landscape';

	export let Hst: Hst;
</script>

<Hst.Story title="Proposer" layout={{ type: 'grid', width: 400 }}>
	<Hst.Variant title="Politician">
		<Proposer
			{orientation}
			politician={{
				id: movingForwardPolitician.id,
				firstname: movingForwardPolitician.firstname,
				lastname: movingForwardPolitician.lastname,
				avatar: movingForwardPolitician.avatar,
				assembly: {
					id: rep26.id,
					abbreviation: rep26.abbreviation,
					term: rep26.term,
					startedAt: rep26.startedAt
				},
				partyName: movingForwardParty.name
			}}
		/>
	</Hst.Variant>
	<Hst.Variant title="Cabinet">
		<Proposer
			{orientation}
			assembly={{
				id: 'คณะรัฐมนตรี-64',
				isCabinet: true,
				abbreviation: 'คณะรัฐมนตรี',
				term: 64,
				startedAt: new Date('04/09/2024')
			}}
		/>
	</Hst.Variant>
	<Hst.Variant title="Representatives">
		<Proposer
			{orientation}
			assembly={{
				id: rep26.id,
				isCabinet: false,
				abbreviation: rep26.name,
				term: rep26.term,
				startedAt: rep26.startedAt
			}}
		/>
	</Hst.Variant>
	<Hst.Variant title="People">
		<Proposer
			{orientation}
			people={{
				ledBy: 'นายยิ่งชีพ',
				signatoryCount: 150000
			}}
		/>
	</Hst.Variant>
	<Hst.Variant title="Not Found">
		<Proposer {orientation} />
	</Hst.Variant>

	<svelte:fragment slot="controls">
		<Hst.Select bind:value={orientation} title="orientation:" options={['landscape', 'portrait']} />
	</svelte:fragment>
</Hst.Story>
