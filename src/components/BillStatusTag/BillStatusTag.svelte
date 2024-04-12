<script lang="ts">
	import { BillStatus } from '$models/bill';
	import { Tag } from 'carbon-components-svelte';
	import { twMerge } from 'tailwind-merge';

	export let isLarge = false;
	export let status: BillStatus;

	let className = '';
	export { className as class };

	$: tagStyle = (() => {
		switch (status) {
			case BillStatus.InProgress:
				return 'bg-yellow-20 text-text-10';
			case BillStatus.Enacted:
				return 'bg-teal-80 text-text-04';
			case BillStatus.Rejected:
				return 'bg-red-80 text-text-04';
			case BillStatus.Merged:
				return 'bg-purple-80 text-text-04';
		}
	})();
</script>

<Tag class={twMerge('whitespace-nowrap', tagStyle, className)} size={isLarge ? 'default' : 'sm'}
	>{status}</Tag
>
