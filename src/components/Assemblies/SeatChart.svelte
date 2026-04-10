<script lang="ts">
	import type { PartySeat, TooltipProp } from './shared';
	import AssemblyTooltip from './AssemblyTooltip.svelte';

	interface Point {
		cx: number;
		cy: number;
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

	let clientWidth = 0;
	let tooltipProp: TooltipProp | null = null;

	$: outerRadius = Math.max(Math.min((clientWidth - 20) / 2, 224), 0);
	$: circleDiameter = lineAmounts.length ? Math.max(4, outerRadius / 2 / lineAmounts.length) : 4;
	$: gap =
		lineAmounts.length > 1
			? Math.max(
					(outerRadius * 0.6 - circleDiameter * lineAmounts.length) / (lineAmounts.length - 1),
					1
				)
			: 0;

	$: points = ((): Point[] => {
		if (!parties.length || !lineAmounts.length || outerRadius <= 0) {
			return [];
		}

		const nextPoints: Point[] = [];
		const lineAllocations = lineAmounts.map((amount) => ({ total: amount, count: 0 }));

		for (const party of parties) {
			for (let i = 0; i < party.count; i++) {
				const index = getLeastFilledLineIndex(lineAllocations);
				if (index < 0) continue;

				const line = lineAllocations[index];
				const radius = outerRadius - index * circleDiameter - index * gap;
				const seatIndex = line.total > 1 ? line.count / (line.total - 1) : 0.5;
				const angle = seatIndex * Math.PI + Math.PI;

				nextPoints.push({
					cx: radius * Math.cos(angle) + outerRadius + circleDiameter,
					cy: radius * Math.sin(angle) + outerRadius + circleDiameter,
					color: party.color,
					additional: party.name,
					title: party.members?.[i]?.name
				});

				lineAllocations[index].count++;
			}
		}

		return nextPoints;
	})();

	function getLeastFilledLineIndex(lineAllocations: LineCalculator[]) {
		const filledPercents = lineAllocations.map((lineAllocation) =>
			lineAllocation.total > 0
				? lineAllocation.count / lineAllocation.total
				: Number.POSITIVE_INFINITY
		);
		const minPercent = Math.min(...filledPercents);

		return findLastIndex(filledPercents, (percent) => percent === minPercent);
	}

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

	function setTooltipProperty(value: Point, event: MouseEvent | FocusEvent | KeyboardEvent): void {
		const target = event.currentTarget as SVGCircleElement | null;
		const rect = target?.getBoundingClientRect();
		const x =
			'pageX' in event && typeof event.pageX === 'number'
				? event.pageX
				: (rect?.left ?? 0) + (rect?.width ?? 0) / 2 + window.scrollX;
		const y =
			'pageY' in event && typeof event.pageY === 'number'
				? event.pageY + 20
				: (rect?.top ?? 0) + (rect?.height ?? 0) / 2 + window.scrollY + 20;

		tooltipProp = {
			title: value.title ?? '',
			additional: value.additional ?? '',
			x,
			y
		};
	}

	function clearTooltip() {
		tooltipProp = null;
	}
</script>

<div
	bind:clientWidth
	class="flex h-full w-full max-w-[calc(100vw-32px)] justify-center md:max-w-[448px]"
>
	<svg
		id="half-circle-chart"
		width={(outerRadius + circleDiameter) * 2}
		height={outerRadius + circleDiameter * 2}
		class="transition-[height] duration-500 ease-in-out"
	>
		{#each points as point, i (i)}
			<circle
				class="seat"
				cx={point.cx}
				cy={point.cy}
				r={circleDiameter / 2}
				fill={point.color}
				role="button"
				tabindex="0"
				aria-label={point.title ? `${point.title}, ${point.additional}` : (point.additional ?? '')}
				on:mouseover={(event) => setTooltipProperty(point, event)}
				on:focus={(event) => setTooltipProperty(point, event)}
				on:mouseout={clearTooltip}
				on:blur={clearTooltip}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						setTooltipProperty(point, event);
					}
				}}
			/>
		{/each}
	</svg>
</div>

<AssemblyTooltip {tooltipProp}></AssemblyTooltip>
