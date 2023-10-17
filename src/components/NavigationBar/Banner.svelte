<script lang="ts">
	export let logoLong: string;
	export let logoShort: string;
</script>

<a href="/" class="px-4">
	<picture class="flex items-center h-full">
		<source media="(min-width: 672px)" srcset={logoLong} height="16" />
		<img src={logoShort} alt="Parliament Watch" height="24" />
	</picture>
</a>
