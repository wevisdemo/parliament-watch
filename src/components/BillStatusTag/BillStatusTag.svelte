<script lang="ts">
	import { billStatusProperty } from '$lib/politigraph/bill/status';
	import type { BillStatus } from '$lib/politigraph/genql';
	import { Tag } from 'carbon-components-svelte';
	import { twMerge } from 'tailwind-merge';

	export let isLarge = false;
	export let status: BillStatus;

	let className = '';
	export { className as class };

	$: ({ label, colorClass } = billStatusProperty[status]);
</script>

<Tag class={twMerge('whitespace-nowrap', colorClass, className)} size={isLarge ? 'default' : 'sm'}
	>{label}</Tag
>
