<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import PromiseStatusTag from './PromiseStatusTag.svelte';
	import { promiseStatusList } from '../../constants/promise';

	export let Hst: Hst;
	let isLarge = false;
</script>

<Hst.Story
	title="PromiseStatusTag"
	layout={{
		type: 'grid'
	}}
>
	{#each promiseStatusList as status}
		<Hst.Variant title={status.label}>
			<PromiseStatusTag isLarge status={status.label} />
		</Hst.Variant>
	{/each}
	<svelte:fragment slot="controls">
		<Hst.Checkbox title="isLarge" bind:value={isLarge} />
	</svelte:fragment>
</Hst.Story>
