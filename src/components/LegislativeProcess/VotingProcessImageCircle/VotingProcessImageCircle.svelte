<script lang="ts">
	export let src = '';
	export let alt = '';
	export let title: string;
	export let description = '';
</script>

<div class="flex-1 max-w-[280px]">
	<div class="mb-2 flex justify-center text-center">
		{#if src}
			<img class="w-32 h-32 rounded-full" {src} alt={alt ? `${alt}` : `${title}`} />
		{:else}
			<div class="bg-ui-01 w-32 h-32 rounded-full flex justify-center items-center">
				<p class="text-text-03">
					image<br />
					coming soon
				</p>
			</div>
		{/if}
	</div>
	<div class="flex flex-col items-center text-center">
		<p><strong>{title}</strong></p>
		<p>{description}</p>
	</div>
</div>
