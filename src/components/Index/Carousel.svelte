<script lang="ts">
	import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import KeenSlider, {
		type KeenSliderHooks,
		type KeenSliderInstance,
		type KeenSliderOptions
	} from 'keen-slider';
	import 'keen-slider/keen-slider.min.css';
	import { onMount, tick } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		options?: KeenSliderOptions<object, object, KeenSliderHooks> | undefined;
		arrowLeftClass?: string;
		arrowRightClass?: string;
		hideNavigation?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		options = undefined,
		arrowLeftClass = '',
		arrowRightClass = '',
		hideNavigation = false,
		children
	}: Props = $props();

	let elCarousel: HTMLElement | undefined = $state();
	let slider: KeenSliderInstance | undefined = $state();
	let disableLeft = $state(false);
	let disableRight = $state(false);

	const updateArrow = () => {
		if (!slider || slider.options.loop) return;
		const currentSlide = slider.track.details.rel;
		disableLeft = currentSlide === 0;
		disableRight = currentSlide === slider.track.details.maxIdx;
	};

	onMount(() => {
		if (!elCarousel) return;
		slider = new KeenSlider(elCarousel, {
			loop: false,
			mode: 'free-snap',
			slides: { perView: 1.25, spacing: 12 },
			renderMode: 'performance',
			breakpoints: {
				'(min-width: 560px)': {
					slides: {
						perView: 2.25,
						spacing: 12
					}
				},
				'(min-width: 960px)': {
					slides: {
						perView: 3.25,
						spacing: 12
					}
				}
			},
			...options
		});

		tick().then(() => {
			updateArrow();
		});

		slider.on('optionsChanged', () => {
			updateArrow();
		});

		slider.on('slideChanged', () => {
			updateArrow();
		});

		return () => slider?.destroy();
	});
</script>

<div class="relative">
	<div bind:this={elCarousel} class="keen-slider">
		{@render children?.()}
	</div>
	{#if !hideNavigation && !disableLeft}
		<button
			type="button"
			class={twMerge('absolute left-0 top-1/2 -translate-y-1/2 xl:-left-6', arrowLeftClass)}
			onclick={() => {
				slider?.prev();
				updateArrow();
			}}
			aria-label="เลื่อนทางซ้าย"><ChevronLeft width="48" height="48" /></button
		>
	{/if}
	{#if !hideNavigation && !disableRight}
		<button
			type="button"
			class={twMerge('absolute right-0 top-1/2 -translate-y-1/2 xl:-right-6', arrowRightClass)}
			onclick={() => {
				slider?.next();
				updateArrow();
			}}
			aria-label="เลื่อนทางขวา"><ChevronRight width="48" height="48" /></button
		>
	{/if}
</div>
