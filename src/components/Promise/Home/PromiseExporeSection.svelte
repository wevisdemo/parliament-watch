<script lang="ts">
	import PromiseList from '$components/PromiseList/PromiseList.svelte';
	import type { PromiseSummary } from '../../../routes/promises/+page.server';

	export let promiseSummaries: PromiseSummary[];
</script>

<div>
	<PromiseList summaries={promiseSummaries} />
</div>
