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

	export let options: KeenSliderOptions<object, object, KeenSliderHooks> | undefined = undefined;
	export let arrowLeftClass = '';
	export let arrowRightClass = '';

	let elCarousel: HTMLElement;
	let slider: KeenSliderInstance;
	let disableLeft = false;
	let disableRight = false;

	const updateArrow = () => {
		if (slider?.options?.loop) return;
		const currentSlide = slider.track.details.rel;
		disableLeft = currentSlide === 0;
		disableRight = currentSlide === slider.track.details.maxIdx;
	};

	onMount(() => {
		slider = new KeenSlider(elCarousel, {
			loop: true,
			mode: 'free-snap',
			slides: {
				perView: 1,
				spacing: 12
			},
			renderMode: 'performance',
			breakpoints: {
				'(min-width: 672px)': {
					slides: {
						perView: 3,
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

		return () => slider.destroy();
	});
</script>

<div class="relative">
	<div bind:this={elCarousel} class="keen-slider">
		<slot />
	</div>
	{#if !disableLeft}
		<button
			type="button"
			class={twMerge('absolute left-0 top-1/2 -translate-y-1/2 xl:-left-6', arrowLeftClass)}
			on:click={() => {
				slider.prev();
				updateArrow();
			}}
			aria-label="เลื่อนทางซ้าย"><ChevronLeft width="48" height="48" /></button
		>
	{/if}
	{#if !disableRight}
		<button
			type="button"
			class={twMerge('absolute right-0 top-1/2 -translate-y-1/2 xl:-right-6', arrowRightClass)}
			on:click={() => {
				slider.next();
				updateArrow();
			}}
			aria-label="เลื่อนทางขวา"><ChevronRight width="48" height="48" /></button
		>
	{/if}
</div>
