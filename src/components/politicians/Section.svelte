<script lang="ts">
	interface Props {
		id: string;
		title: string;
		icon?: import('svelte').Snippet;
		headerExtension?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { id, title, icon, headerExtension, children }: Props = $props();
</script>

<section
	{id}
	class="politician-section body-02 flex w-full scroll-mt-4 flex-col gap-4 rounded-sm bg-white p-4 md:scroll-mt-8 md:p-8"
	class:items-center={!headerExtension}
>
	<header class="flex gap-2">
		{@render icon?.()}
		<div class="flex-1">
			<h2 class="fluid-heading-04">{title}</h2>
			{@render headerExtension?.()}
		</div>
	</header>
	<hr class="m-0 box-border w-full border-0 border-t border-solid border-gray-50" />
	{@render children?.()}
</section>
