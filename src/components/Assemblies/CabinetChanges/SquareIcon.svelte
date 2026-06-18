<script lang="ts">
	interface Props {
		width?: number;
		color?: string;
	}

	let { width = 6, color = '#00B9C4' }: Props = $props();
</script>

<svg {width} height={width} fill="none">
	<rect {width} height={width} fill={color} />
</svg>
