<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { PartySeat } from './shared';

	interface Point {
		x: number;
		y: number;
		color: string;
	}

	interface LineCalculator {
		total: number;
		count: number;
	}

	export let parties: PartySeat[] = [];
	export let lineAmounts: number[] = [];

	let component: HTMLDivElement | null = null;
	let outterRadius = 0;
	let circleDiameter = outterRadius / 2 / lineAmounts.length;
	let gap = 0;

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
				let radius = outterRadius - index * circleDiameter - index * gap;
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

	const getOutterRadius = () => {
		const componentWidth = component?.clientWidth || 0;
		return Math.min((componentWidth - 20) / 2, 224);
	};

	const redraw = () => {
		const seatComponents = d3.selectAll('.seat');
		seatComponents.remove();
		setUpComponentENV();
		draw();
	};

	const draw = () => {
		const svg = d3.select('#half-circle-chart');
		const points = getPoints();
		points.forEach((value) => {
			svg
				.append('circle')
				.attr('cx', value.x + outterRadius + circleDiameter)
				.attr('cy', value.y + outterRadius + circleDiameter)
				.attr('r', circleDiameter / 2)
				.attr('fill', value.color)
				.attr('class', 'seat');
		});
	};

	const setUpComponentENV = () => {
		outterRadius = getOutterRadius();
		circleDiameter = Math.max(4, outterRadius / 2 / lineAmounts.length);
		gap = Math.max(
			(outterRadius * 0.6 - circleDiameter * lineAmounts.length) / (lineAmounts.length - 1),
			1
		);
	};

	let mounted = false;
	onMount(() => {
		mounted = true;
		window.addEventListener('resize', redraw);

		return () => {
			window.removeEventListener('resize', redraw);
		};
	});

	$: if (mounted) {
		parties;
		lineAmounts;
		redraw();
	}
</script>

<div
	bind:this={component}
	class="relative m-auto flex h-full w-full max-w-[calc(100vw-32px)] items-center justify-center md:max-w-[448px]"
>
	<svg
		id="half-circle-chart"
		width={(outterRadius + circleDiameter) * 2}
		height={outterRadius + circleDiameter * 2}
		class="transition-[height] duration-500 ease-in-out"
	/>
</div>
