<script lang="ts">
	import CabinetRole from './CabinetRole.svelte';
	import type { CabinetSeat } from './shared';

	export let cabinets: CabinetSeat[];
</script>

<div
	class="relative m-auto flex h-full w-full max-w-[calc(100vw-32px)] flex-col items-center justify-center gap-3 px-4 md:max-w-[448px]"
>
	<CabinetRole {cabinets} role="นายกรัฐมนตรี" />
	<CabinetRole {cabinets} role="รองนายกรัฐมนตรี" />
	<div class="grid grid-cols-2 gap-4">
		<CabinetRole {cabinets} role="รัฐมนตรี" />
		<CabinetRole {cabinets} role="รัฐมนตรีช่วย" />
	</div>
</div>
