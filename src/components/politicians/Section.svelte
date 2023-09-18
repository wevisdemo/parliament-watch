<script lang="ts">
	export let id: string;
	export let title: string;
</script>

<section {id} class="flex flex-col gap-4 bg-white rounded-sm p-4 font-sans body-02 w-full md:p-8">
	<header class="flex gap-2" class:items-center={!$$slots['header-extension']}>
		<slot name="icon" />
		<div class="flex-1">
			<h2 class="fluid-heading-04">{title}</h2>
			<slot name="header-extension" />
		</div>
	</header>
	<hr class="border-0 border-solid border-gray-50 border-t w-full m-0 box-border" />
	<slot />
</section>
