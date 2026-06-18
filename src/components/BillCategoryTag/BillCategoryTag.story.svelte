<script lang="ts">
	import BillCategoryTag from './BillCategoryTag.svelte';
	import type { Hst as HstStory } from '@histoire/plugin-svelte';

	export let Hst: HstStory;

	let label = 'ขนส่งสาธารณะ';
	let isLarge = false;
</script>

<Hst.Story title="BillCategoryTag">
	<BillCategoryTag {isLarge} {label} />
	<svelte:fragment slot="controls">
		<Hst.Text title="Label" bind:value={label} />
		<Hst.Checkbox title="isLarge" bind:value={isLarge} />
	</svelte:fragment>
</Hst.Story>
