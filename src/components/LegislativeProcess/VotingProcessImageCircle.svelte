<script lang="ts">
	export let src: string;
	export let alt = '';
	export let title: string;
	export let description = '';
</script>

<div class="flex-1 max-w-[280px]">
	<div class="mb-2 flex justify-center text-center">
		<img class="w-[120px] h-[120px] rounded-full" {src} alt={alt || title} />
	</div>
	<div class="flex flex-col items-center text-center">
		<p><strong>{title}</strong></p>
		<p>{description}</p>
	</div>
</div>
