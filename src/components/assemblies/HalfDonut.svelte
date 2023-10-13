<!-- FILEPATH: /Users/petchsongpon/projects/wevis/parliament-watch/src/components/assemblies/HalfCircle.svelte -->

<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let percent = 0;
	export let color = '#3904E9';

	const roundedPercent: number = Math.round(percent);

	let width = 144;
	let height = 144;
	let radius: number = Math.min(width, height) / 2;

	onMount(() => {
		let svg = d3
			.selectAll('#half-donut')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`);

		let g = svg.append('g').attr('class', 'g-arc');

		g.append('path')
			.attr('class', 'cover-arc')
			.attr(
				'd',
				d3
					.arc<any, any>()
					.innerRadius(radius / 2)
					.outerRadius(radius)
					.startAngle(0 - Math.PI / 2)
					.endAngle(Math.PI - Math.PI / 2)
			)
			.attr('fill', '#8D8D8D');

		g.append('path')
			.transition()
			.duration(1000)
			.attr('class', 'color-arc')
			.attrTween('d', (d) => {
				const i = d3.interpolate(0, (roundedPercent * Math.PI) / 100);
				return (t) => {
					const arc = d3
						.arc<any, any>()
						.innerRadius(radius / 2)
						.outerRadius(radius)
						.startAngle(0 - Math.PI / 2)
						.endAngle(i(t) - Math.PI / 2);

					return arc(d) ?? '';
				};
			})
			.attr('fill', color);
	});
</script>

<div id="half-donut" />
