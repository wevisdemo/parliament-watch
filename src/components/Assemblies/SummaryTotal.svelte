<script lang="ts">
	import type { MemberGroup } from '../../routes/assemblies/[id]/+page';
	import LowerHouseSummary from './LowerHouseSummary.svelte';
	import UpperHouseSummary from './UpperHouseSummary.svelte';

	export let data: MemberGroup[] = [];
	export let houseLevel = 'upper';
</script>

<div class="flex md:flex-row flex-col">
	<div class="w-[50%]">
		<!-- Chart seats in parliament -->
	</div>
	<div class="w-[50%]">
		{#if houseLevel === 'lower'}
			<LowerHouseSummary {data} />
		{:else}
			<UpperHouseSummary {data} />
		{/if}
	</div>
</div>

<style></style>
