<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let percent = 0;
	export let color = '#3904E9';
	export let id: string;

	const roundedPercent: number = Math.round(percent);

	let width = 144;
	let height = 72;
	let radius = 72;

	onMount(() => {
		let svg = d3
			.selectAll(`#${id}`)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height})`);

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

<div {id} />
