<script lang="ts">
	import type { BillsByCategory, BillsByStatus } from '../../routes/bills/+page.server';

	export let billsByStatus: BillsByStatus[];
	export let billsByCategory: BillsByCategory[];
</script>

<div>Use billsByStatus {billsByStatus} and billsByCategory {billsByCategory} to create the UI</div>
