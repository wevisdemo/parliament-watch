<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import PromiseStatusTag from './PromiseStatusTag.svelte';
	import { promiseStatusList } from '../../constants/promise';

	export let Hst: Hst;
</script>

<Hst.Story
	title="PromiseStatusTag"
	layout={{
		type: 'grid'
	}}
>
	{#each promiseStatusList as status}
		<Hst.Variant title={status.label}>
			<PromiseStatusTag status={status.label} />
		</Hst.Variant>
	{/each}
</Hst.Story>
