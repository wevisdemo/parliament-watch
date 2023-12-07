<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	// All sizing props must be passed with numberic value.
	export let size = 40;
	export let padding = 12;
	export let color = '';
	export let bgColor = '';
	export let border = 1;
	export let borderRadius = 2;
	export let margin = 20;
	// The button will be visible when the user scrolls down
	// by 'showAt' value.
	export let showAt = 50;

	// '40' is default size of the button.
	// So, we need to scale the icon according to the 'size' prop.
	let scale = size / 40;

	// (Default) minus value means the user has not scrolled yet.
	// So, the button will be initially hide.
	let scrollY = -1;
	let show = false;

	function onScroll() {
		// Set 'scrollY' value.
		scrollY = window.scrollY;

		// Only show button when the user has scrolled down
		// by 'showAt' value.
		show = scrollY >= 0 && scrollY >= showAt;
	}

	function onClick() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		window.addEventListener('scroll', onScroll, { passive: true });

		// Call onScroll() for  the first time.
		onScroll();

		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

{#if show}
	<button
		class="back-to-top-button"
		style="--size:{size}px;
            --padding:{padding}px;
            --color:{color};
            --bgColor:{bgColor};
            --border:{border}px;
            --border-radius:{borderRadius}px;
            --margin:{margin}px;
            --scale: {scale}"
		on:click={onClick}
		transition:fade
	>
		<div class="btn">
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect width="16" height="16" style="mix-blend-mode:multiply" />
				<!-- The 'currentColor' value will be replaced by the 'color' prop. -->
				<path d="M8 7L3 12L3.7 12.7L8 8.4L12.3 12.7L13 12L8 7Z" fill="currentColor" />
				<path d="M14 4H2V5H14V4Z" fill="currentColor" />
			</svg>
		</div>
	</button>
{/if}

<style lang="scss">
	@import 'src/styles/carbon/theme.scss';

	.back-to-top-button {
		// Use 'fixed' position to make it stick to the bottom right of the page.
		position: fixed;
		// Remove default button bg color.
		background: none;
		// The 'margin' prop is used to set the distance from the bottom right corner.
		bottom: var(--margin);
		right: var(--margin);
		// The 'padding' prop is a clickable area around the button.
		// The 'size' prop is used to define the size of the button (inside border area).
		width: calc(var(--size) + 2 * var(--padding));
		height: calc(var(--size) + 2 * var(--padding));
		padding: var(--padding);
		// The 'pointer' cursor will be use in clickable area.
		cursor: pointer;

		& > .btn {
			width: var(--size);
			height: var(--size);
			border: var(--border) solid;
			border-color: var(--color, $interactive-03);
			background-color: var(--bgColor, transparent);
			border-radius: var(--border-radius);
			display: flex;
			justify-content: center;
			align-items: center;

			& > svg {
				// Use 'scale' transform to scale the icon according to the 'size'
				// of the button.
				transform: scale(var(--scale));
				// Set icon's color according to the 'color' of the button.
				color: var(--color, $interactive-03);
			}
		}
	}
</style>
