<script lang="ts">
	import { Tag } from 'carbon-components-svelte';

	export let isLarge = false;
	export let label: string;

	let className = '';
	export { className as class };
</script>

<Tag
	class="text-text-10 border-solid bg-white/0 border-[1px] m-0 whitespace-nowrap {isLarge
		? 'font-semibold'
		: 'font-small'} {className}"
	size={isLarge ? 'default' : 'sm'}>{label}</Tag
>
