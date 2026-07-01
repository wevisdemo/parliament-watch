<script lang="ts">
	import { billStatusProperty } from '$lib/politigraph/bill/status';
	import type { BillStatus } from '$lib/politigraph/genql';
	import { Tag } from 'carbon-components-svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		isLarge?: boolean;
		status: BillStatus;
		class?: string;
	}

	let { isLarge = false, status, class: className = '' }: Props = $props();

	let { label, colorClass } = $derived(billStatusProperty[status]);
</script>

<Tag class={twMerge('whitespace-nowrap', colorClass, className)} size={isLarge ? 'default' : 'sm'}
	>{label}</Tag
>
