<script lang="ts">
	import DataPeriodRemark from './DataPeriodRemark.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	export let Hst: HstStory;
</script>

<Hst.Story title="DataPeriodRemark" layout={{ type: 'grid' }}>
	<Hst.Variant title="Updated">
		<DataPeriodRemark updatedAt="2025-01-15" />
	</Hst.Variant>

	<Hst.Variant title="Coverage">
		<DataPeriodRemark updatedAt="2025-01-15" variant="coverage" />
	</Hst.Variant>

	<Hst.Variant title="Changed">
		<DataPeriodRemark updatedAt="2025-01-15" variant="changed" />
	</Hst.Variant>

	<Hst.Variant title="Profile">
		<DataPeriodRemark updatedAt="2025-01-15" variant="profile" />
	</Hst.Variant>

	<Hst.Variant title="Scraped">
		<DataPeriodRemark updatedAt="2025-01-15" variant="scraped" />
	</Hst.Variant>
</Hst.Story>
