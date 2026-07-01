<script lang="ts">
	import DataPeriodRemark from './DataPeriodRemark.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	export let Hst: HstStory;
</script>

<Hst.Story title="DataPeriodRemark" layout={{ type: 'grid' }}>
	<Hst.Variant title="With Start Date">
		<DataPeriodRemark withStartDate />
	</Hst.Variant>

	<Hst.Variant title="Without Start Date">
		<DataPeriodRemark />
	</Hst.Variant>
</Hst.Story>
