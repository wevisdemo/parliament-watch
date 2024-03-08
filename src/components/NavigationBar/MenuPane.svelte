<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let hide = false;
</script>

<div class={twMerge('hidden', hide ? 'lg:hidden' : 'lg:flex', 'relative h-full xl:flex')}>
	<div
		class="mx-2; absolute left-0 top-1/2 h-1/2 -translate-y-1/2 border-l border-solid border-gray-80"
	/>
	<div class="ml-4 flex h-full">
		<slot />
	</div>
</div>
