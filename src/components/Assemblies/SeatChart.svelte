<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { PartySeat, TooltipProp } from './shared';
	import AssemblyTooltip from './AssemblyTooltip.svelte';
	interface Point {
		x: number;
		y: number;
		color: string;
		title?: string;
		additional?: string;
	}

	interface LineCalculator {
		total: number;
		count: number;
	}

	export let parties: PartySeat[] = [];
	export let lineAmounts: number[] = [];

	let component: HTMLDivElement | null = null;
	let outerRadius = 0;
	let circleDiameter = outerRadius / 2 / lineAmounts.length;
	let gap = 0;
	let tooltipProp: TooltipProp | null = null;

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
				let radius = outerRadius - index * circleDiameter - index * gap;
				points.push({
					x: radius * Math.cos((line.count / (line.total - 1)) * Math.PI + Math.PI),
					y: radius * Math.sin((line.count / (line.total - 1)) * Math.PI + Math.PI),
					color: party.color,
					additional: party.name,
					title: party?.members?.[i].name
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

	const getOuterRadius = () => {
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
				.attr('cx', value.x + outerRadius + circleDiameter)
				.attr('cy', value.y + outerRadius + circleDiameter)
				.attr('r', circleDiameter / 2)
				.attr('fill', value.color)
				.attr('class', 'seat')
				.on('mouseover', (e) => setTooltipProperty(value, e))
				.on('mouseout', () => {
					tooltipProp = null;
				});
		});
	};

	const setUpComponentENV = () => {
		outerRadius = getOuterRadius();
		circleDiameter = Math.max(4, outerRadius / 2 / lineAmounts.length);
		gap = Math.max(
			(outerRadius * 0.6 - circleDiameter * lineAmounts.length) / (lineAmounts.length - 1),
			1
		);
	};

	const setTooltipProperty = (value: Point, event: MouseEvent): void => {
		tooltipProp = {
			title: value.title ?? '',
			additional: value.additional ?? '',
			x: event.pageX,
			y: event.pageY + 20
		};
	};

	onMount(() => {
		redraw();

		window.addEventListener('resize', redraw);

		return () => {
			window.removeEventListener('resize', redraw);
		};
	});

	$: if (component && parties && lineAmounts) {
		redraw();
	}
</script>

<div
	bind:this={component}
	class="flex h-full w-full max-w-[calc(100vw-32px)] justify-center md:max-w-[448px]"
>
	<svg
		id="half-circle-chart"
		width={(outerRadius + circleDiameter) * 2}
		height={outerRadius + circleDiameter * 2}
		class="transition-[height] duration-500 ease-in-out"
	/>
</div>

<AssemblyTooltip {tooltipProp}></AssemblyTooltip>
