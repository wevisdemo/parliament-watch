<script lang="ts">
	export let id: string;
	export let title: string;
</script>

<section
	{id}
	class="politician-section body-02 flex w-full scroll-mt-4 flex-col gap-4 rounded-sm bg-white p-4 md:scroll-mt-8 md:p-8"
>
	<header class="flex gap-2" class:items-center={!$$slots['header-extension']}>
		<slot name="icon" />
		<div class="flex-1">
			<h2 class="fluid-heading-04">{title}</h2>
			<slot name="header-extension" />
		</div>
	</header>
	<hr class="m-0 box-border w-full border-0 border-t border-solid border-gray-50" />
	<slot />
</section>
