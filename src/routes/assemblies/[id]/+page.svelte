<script lang="ts">
	import type { load } from './+page';

	export let data: ReturnType<typeof load>;
</script>

<div class="whitespace-pre">
	{JSON.stringify(data, undefined, 2)}
</div>
