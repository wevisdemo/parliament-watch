<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import Proposer from './Proposer.svelte';
	import type { ComponentProps } from 'svelte';

	let orientation: ComponentProps<Proposer>['orientation'] = 'landscape';

	export let Hst: Hst;
</script>

<Hst.Story title="Proposer" layout={{ type: 'grid', width: 400 }}>
	<Hst.Variant title="Politician">
		<Proposer
			{orientation}
			proposer={{
				id: 'พริษฐ์-วัชรสินธุ',
				name: 'พริษฐ์ วัชรสินธุ',
				image: 'https://via.placeholder.com/64',
				assembly: {
					id: 'สภาผู้แทนราษฎร-26',
					abbreviation: 'ส.ส.',
					term: 26,
					startedAt: new Date('01/01/2023')
				},
				partyName: 'ก้าวไกล'
			}}
		/>
	</Hst.Variant>
	<Hst.Variant title="Cabinet">
		<Proposer
			{orientation}
			proposer={{
				id: 'คณะรัฐมนตรี-64',
				abbreviation: 'ครม.',
				term: 64,
				startedAt: new Date('04/09/2024')
			}}
		/>
	</Hst.Variant>
	<Hst.Variant title="Representatives">
		<Proposer
			{orientation}
			proposer={{
				id: 'สภาผู้แทนราษฎร-26',
				abbreviation: 'สส.',
				term: 26,
				startedAt: new Date('01/01/2023')
			}}
		/>
	</Hst.Variant>
	<Hst.Variant title="People">
		<Proposer
			{orientation}
			proposer={{
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
