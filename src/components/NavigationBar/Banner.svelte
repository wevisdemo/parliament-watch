<script lang="ts">
	export let logoLong: string;
	export let logoShort: string;
</script>

<!-- <a href="/">
	<picture class="flex items-center h-full">
		<source media="(min-width: 672px)" srcset="/images/logo/pw-long-white.png" height="18" />
		<img src="/images/logo/pw-short-white.png" alt="Parliament Watch" height="28" />
	</picture>
</a> -->

<a href="/">
	<picture class="flex items-center h-full">
		<source media="(min-width: 672px)" srcset={logoLong} height="18" />
		<img src={logoShort} alt="Parliament Watch" height="28" />
	</picture>
</a>
