<script lang="ts">
	import { Tag } from 'carbon-components-svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		isLarge?: boolean;
		label: string;
		class?: string;
	}

	let { isLarge = false, label, class: className = '' }: Props = $props();
</script>

<Tag
	class={twMerge(
		'text-text-10 m-0 whitespace-nowrap border-[1px] border-solid bg-white/0',
		isLarge ? 'font-semibold' : 'font-small',
		className
	)}
	size={isLarge ? 'default' : 'sm'}>{label}</Tag
>
