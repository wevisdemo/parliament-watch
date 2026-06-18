<script lang="ts">
	interface Props {
		imgSrc: string;
		title: string;
		children?: import('svelte').Snippet;
	}

	let { imgSrc, title, children }: Props = $props();
</script>

<div class="flex flex-col items-center bg-teal-10 p-5">
	<img src={imgSrc} alt="process-step-{title}" />
	<div class="text-01">
		<div class="font-bold">{title}</div>
		{@render children?.()}
	</div>
</div>
