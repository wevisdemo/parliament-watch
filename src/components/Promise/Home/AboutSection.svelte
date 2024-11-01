<script lang="ts">
	import type {
		CabinetSummary,
		PreviousCabinetSummary
	} from '../../../routes/promises/+page.server';
	import AboutCard from './AboutCard.svelte';
	export let cabinet: CabinetSummary;
	export let previousCabinet: PreviousCabinetSummary;
</script>

<div class="flex flex-col items-center gap-2 py-3">
	<p class="fluid-heading-04">เกี่ยวกับรัฐบาล</p>
	<AboutCard {cabinet} {previousCabinet} />
</div>
