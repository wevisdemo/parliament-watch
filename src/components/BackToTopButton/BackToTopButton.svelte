<script>
	import { onMount } from 'svelte';

	// All sizing props can be passed with or without 'px' unit.
	// For example, '40px' and '40' are both valid values.
	export let size = '40px';
	export let padding = '12px';
	export let color = '';
	export let bgColor = '';
	export let border = '1px';
	export let borderRadius = '2px';
	export let margin = '20px';
	// The button will be visible when the user scrolls down
	// by 'showAt' value.
	export let showAt = 50;

	// Function for auto appending 'px' unit.
	function appendPx(value = '') {
		value = value.toLowerCase();
		if (
			value.endsWith('%') ||
			value.endsWith('vh') ||
			value.endsWith('vw') ||
			value.endsWith('em') ||
			value.endsWith('rem') ||
			value.endsWith('ex') ||
			value.endsWith('ch') ||
			value.endsWith('vmin') ||
			value.endsWith('vmax') ||
			value.endsWith('cm') ||
			value.endsWith('mm') ||
			value.endsWith('in') ||
			value.endsWith('pt') ||
			value.endsWith('pc')
		) {
			return value;
		}
		if (!value.endsWith('px')) {
			return value + 'px';
		}
		return value;
	}

	// Auto append 'px' unit for all props if not provided.
	size = appendPx(size);
	padding = appendPx(padding);
	border = appendPx(border);
	borderRadius = appendPx(borderRadius);
	margin = appendPx(margin);

	let scale = 1;
	try {
		// Parse float using substring to remove 'px' unit.
		scale = parseFloat(size.substring(0, size.length - 2)) / 40;
	} catch (e) {
		// Do nothing.
	}

	// (Default) minus value means the user has not scrolled yet.
	// So, the button will be initially shown.
	let scrollY = -1;
	let show = true;

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
		window.addEventListener('scroll', onScroll);

		// Call onScroll() for  the first time.
		onScroll();
	});
</script>

<!-- Add keydown event & tabindex to make 'div' button accessible by keyboard -->
<!-- Add role 'button' to make 'div' button accessible to all users -->
<div
	class="back-to-top-button"
	class:hide={!show}
	style="--size:{size}; 
            --padding:{padding};
            --color:{color}; 
            --bgColor:{bgColor}; 
            --border:{border}; 
            --border-radius:{borderRadius};
            --margin:{margin};
            --scale: {scale}"
	on:click={onClick}
	on:keydown={onClick}
	tabindex="0"
	role="button"
>
	<div class="btn">
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="16" height="16" style="mix-blend-mode:multiply" />
			<!-- The 'currentColor' value will be replaced by the 'color' prop. -->
			<path d="M8 7L3 12L3.7 12.7L8 8.4L12.3 12.7L13 12L8 7Z" fill="currentColor" />
			<path d="M14 4H2V5H14V4Z" fill="currentColor" />
		</svg>
	</div>
</div>

<style lang="scss">
	@import 'src/styles/carbon/theme.scss';

	.back-to-top-button {
		// Use 'fixed' position to make it stick to the bottom right of the page.
		position: fixed;
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
		transition: 0.2s ease-in-out;

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

		&.hide {
			opacity: 0;
			cursor: default;
			// Set 'pointer-events' as none to make it clickthroughable.
			pointer-events: none;
		}
	}
</style>
