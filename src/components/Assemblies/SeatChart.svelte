<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	interface Point {
		x: number;
		y: number;
	}

	interface Party {
		name: string;
		color: string;
		count: number;
	}

	// export let parties: Party[] = [];

	let lineAmounts = [58, 54, 51, 49, 46, 43, 40, 37, 35, 32, 29, 26];
	let outterRadius = 224;
	let circleDiameter = 8;
	let data: Point[] = [];

	let width = 300;
	let height = 150; // Half of the width

	let circles = [];

	onMount(() => {
		for (let i = 0; i < lineAmounts.length; i++) {
			const amount = lineAmounts[i];
			let radius = outterRadius - i * circleDiameter - i * 2;
			for (let j = 0; j < amount; j++) {
				data.push({
					x: radius * Math.cos((j / (amount - 1)) * -Math.PI),
					y: radius * Math.sin((j / (amount - 1)) * -Math.PI)
				});
			}
		}

		const svg = d3.select('#half-circle-chart');

		data.forEach((value) => {
			const circle = svg
				.append('circle')
				.attr('cx', value.x + 230)
				.attr('cy', value.y + 230)
				.attr('r', 4)
				.attr('fill', 'blue'); // Change the fill color as needed

			circles.push(circle);
		});
	});
</script>

<svg id="half-circle-chart" {width} {height} class="w-full h-full" />
