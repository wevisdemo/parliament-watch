<script lang="ts">
	export let src: string;
	export let alt = '';
	export let title: string;
	export let description = '';
</script>

<div class="max-w-[280px] flex-1">
	<div class="mb-2 flex justify-center text-center">
		<img class="h-[120px] w-[120px] rounded-full" {src} alt={alt || title} loading="lazy" />
	</div>
	<div class="flex flex-col items-center text-center">
		<p><strong>{title}</strong></p>
		<p>{description}</p>
	</div>
</div>
