<script lang="ts">
	import HalfDonut from './HalfDonut.svelte';
	export let percent = 0;
	export let label = '';
	export let chartId: string;
</script>

<div class="text-center grid gap-[4px] w-fit p-[8px] mx-auto">
	<div class="relative w-fit m-auto">
		<HalfDonut id={chartId} {percent} color="#3904E9" />
		<span
			class="fluid-heading-03 absolute left-[50%] bottom-[0px] transform -translate-x-1/2 mb-[-10px]"
			>{percent}%</span
		>
	</div>
	<span class="body-compact-01 text-[16px]">{label}</span>
</div>
