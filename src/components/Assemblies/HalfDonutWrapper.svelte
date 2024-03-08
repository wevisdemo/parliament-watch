<script lang="ts">
	import HalfDonut from './HalfDonut.svelte';
	export let percent = 0;
	export let label = '';
	export let chartId: string;
</script>

<div class="mx-auto grid w-fit gap-[4px] p-[8px] text-center">
	<div class="relative m-auto w-fit">
		<HalfDonut id={chartId} {percent} color="#3904E9" />
		<span
			class="fluid-heading-03 absolute bottom-[0px] left-[50%] mb-[-10px] -translate-x-1/2 transform"
			>{percent}%</span
		>
	</div>
	<span class="body-compact-01 text-[16px]">{label}</span>
</div>
