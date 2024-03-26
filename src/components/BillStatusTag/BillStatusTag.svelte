<script lang="ts">
	import { BillStatus } from '$models/bill';
	import { Tag } from 'carbon-components-svelte';
	import { twMerge } from 'tailwind-merge';

	export let isLarge = false;
	export let status: BillStatus;
	let tagStyle = '';

	switch (status) {
		case BillStatus.InProgress:
			tagStyle = 'bg-yellow-20 text-text-10';
			break;
		case BillStatus.Enacted:
			tagStyle = 'bg-teal-80 text-text-04';
			break;
		case BillStatus.Rejected:
			tagStyle = 'bg-red-80 text-text-04';
			break;
		case BillStatus.Merged:
			tagStyle = 'bg-purple-80 text-text-04';
			break;
	}

	let className = '';
	export { className as class };
</script>

<Tag class={twMerge('whitespace-nowrap', tagStyle, className)} size={isLarge ? 'default' : 'sm'}
	>{status}</Tag
>
