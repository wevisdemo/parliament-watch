<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { arc as d3Arc } from 'd3';

	export let percent = 0;
	export let color = '#3904E9';
	export let width = 144;
	export let height = 72;

	const animatedPercent = tweened(0, {
		duration: 1000,
		easing: cubicOut
	});

	$: arc = d3Arc<unknown, void>()
		.innerRadius(height / 2)
		.outerRadius(height)
		.startAngle(-Math.PI / 2);

	$: roundedPercent = Math.round(percent);
	$: animatedPercent.set(roundedPercent);
</script>

<svg {width} {height} viewBox="0 0 {width} {height}" aria-hidden="true">
	<g transform="translate({width / 2}, {height})">
		<path d={arc.endAngle(Math.PI / 2)()} fill="#8D8D8D" />
		<path d={arc.endAngle(($animatedPercent * Math.PI) / 100 - Math.PI / 2)()} fill={color} />
	</g>
</svg>
