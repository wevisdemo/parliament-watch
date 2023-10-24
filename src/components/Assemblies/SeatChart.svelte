<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { PartySeat } from './shared';

	interface Point {
		x: number;
		y: number;
		color: string;
	}

	export let parties: PartySeat[] = [];

	let lineAmounts = [58, 54, 51, 49, 46, 43, 40, 37, 35, 32, 29, 26];
	let outterRadius = 224;
	let circleDiameter = 8.5;

	interface LineCalculator {
		total: number;
		count: number;
	}

	const getIndexOfLine = (lineCals: LineCalculator[]) => {
		const filledPercents = lineCals.map((lineCal) => lineCal.count / lineCal.total);
		const minPercent = Math.min(...filledPercents);

		const index = findLastIndex(filledPercents, (percent) => percent === minPercent);
		return index;
	};

	const generateLineCals = () => {
		const lineCals = lineAmounts.map((amount) => ({ total: amount, count: 0 }));
		return lineCals;
	};

	const getPoints = (): Point[] => {
		let points: Point[] = [];
		let lineCals: LineCalculator[] = generateLineCals();
		for (let party of parties) {
			for (let i = 0; i < party.count; i++) {
				let index = getIndexOfLine(lineCals);
				let line = lineCals[index];
				let radius = outterRadius - index * circleDiameter - index * 2.15;
				points.push({
					x: radius * Math.cos((line.count / (line.total - 1)) * Math.PI + Math.PI),
					y: radius * Math.sin((line.count / (line.total - 1)) * Math.PI + Math.PI),
					color: party.color
				});
				lineCals[index].count++;
			}
		}
		return points;
	};

	function findLastIndex<T>(
		array: Array<T>,
		predicate: (value: T, index: number, obj: T[]) => boolean
	): number {
		let l = array.length;
		while (l--) {
			if (predicate(array[l], l, array)) return l;
		}
		return -1;
	}

	let component: HTMLDivElement | null = null;

	onMount(() => {
		const svg = d3.select('#half-circle-chart');
		const points = getPoints();

		points.forEach((value) => {
			svg
				.append('circle')
				.attr('cx', value.x + outterRadius + circleDiameter)
				.attr('cy', value.y + outterRadius + circleDiameter)
				.attr('r', 4)
				.attr('fill', value.color); // Change the fill color as needed
		});
	});
</script>

<div bind:this={component} class="w-full h-full relative flex justify-center items-center">
	<svg
		id="half-circle-chart"
		width={(outterRadius + circleDiameter) * 2}
		height={outterRadius + circleDiameter * 2}
		class=""
	/>
</div>
