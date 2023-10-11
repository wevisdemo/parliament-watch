<script lang="ts">
	import { Tag } from 'carbon-components-svelte';

	export let isLarge = false;
	let label = 'ขนส่งสาธารณะ';
	let tagStyle = 'text-text-10 border-solid bg-white m-0 whitespace-nowrap';

	let className = '';
	export { className as class };
</script>

<Tag
	class="{tagStyle} font-{isLarge ? 'semibold' : 'small'} {className}"
	style="--tw-bg-opacity: 0; border-width: 1px;"
	size={isLarge ? 'default' : 'sm'}>{label}</Tag
>
