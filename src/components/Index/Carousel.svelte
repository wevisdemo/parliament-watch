<script lang="ts">
	import 'keen-slider/keen-slider.min.css';
	import KeenSlider, { type KeenSliderInstance } from 'keen-slider';
	import { onMount } from 'svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';

	let el_carousel: HTMLElement;
	let slider: KeenSliderInstance;
	onMount(() => {
		slider = new KeenSlider(el_carousel, {
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
			}
		});
		return () => slider.destroy();
	});
</script>

<div class="relative">
	<div bind:this={el_carousel} class="keen-slider">
		<slot />
	</div>
	<button
		type="button"
		class="absolute left-0 bottom-[75px] translate-y-1/2 xl:-left-6"
		on:click={() => {
			slider.prev();
		}}
		aria-label="เลื่อนทางซ้าย"><ChevronLeft width="48" height="48" /></button
	>
	<button
		type="button"
		class="absolute right-0 bottom-[75px] translate-y-1/2 xl:-right-6"
		on:click={() => {
			slider.next();
		}}
		aria-label="เลื่อนทางขวา"><ChevronRight width="48" height="48" /></button
	>
</div>
