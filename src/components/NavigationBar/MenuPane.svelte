<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		hide?: boolean;
		children?: import('svelte').Snippet;
	}

	let { hide = false, children }: Props = $props();
</script>

<div class={twMerge('hidden', hide ? 'lg:hidden' : 'lg:flex', 'relative h-full xl:flex')}>
	<div
		class="mx-2; absolute left-0 top-1/2 h-1/2 -translate-y-1/2 border-l border-solid border-gray-80"
	></div>
	<div class="ml-4 flex h-full">
		{@render children?.()}
	</div>
</div>
