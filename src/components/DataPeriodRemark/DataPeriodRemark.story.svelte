<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import DataPeriodRemark from './DataPeriodRemark.svelte';
	export let Hst: Hst;
</script>

<Hst.Story title="DataPeriodRemark" layout={{ type: 'grid' }}>
	<Hst.Variant title="With Start Date">
		<DataPeriodRemark withStartDate />
	</Hst.Variant>

	<Hst.Variant title="Without Start Date">
		<DataPeriodRemark />
	</Hst.Variant>
</Hst.Story>
