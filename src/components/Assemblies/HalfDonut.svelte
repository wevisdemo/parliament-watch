<script lang="ts">
	import { arc as d3Arc } from 'd3';
	import { cubicOut } from 'svelte/easing';
	import { run } from 'svelte/legacy';
	import { tweened } from 'svelte/motion';

	interface Props {
		percent?: number;
		color?: string;
		width?: number;
		height?: number;
	}

	let { percent = 0, color = '#3904E9', width = 144, height = 72 }: Props = $props();

	const animatedPercent = tweened(0, {
		duration: 1000,
		easing: cubicOut
	});

	let arc = $derived(
		d3Arc<unknown, void>()
			.innerRadius(height / 2)
			.outerRadius(height)
			.startAngle(-Math.PI / 2)
	);

	let roundedPercent = $derived(Math.round(percent));
	run(() => {
		animatedPercent.set(roundedPercent);
	});
</script>

<svg {width} {height} viewBox="0 0 {width} {height}" aria-hidden="true">
	<g transform="translate({width / 2}, {height})">
		<path d={arc.endAngle(Math.PI / 2)()} fill="#8D8D8D" />
		<path d={arc.endAngle(($animatedPercent * Math.PI) / 100 - Math.PI / 2)()} fill={color} />
	</g>
</svg>
