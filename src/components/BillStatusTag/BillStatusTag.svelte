<script lang="ts">
	import { BillStatus } from '$models/bill';
	import { Tag } from 'carbon-components-svelte';

	export let isLarge = false;
	export let status: BillStatus;
	let label = status;
	let className = '';

	switch (status) {
		case BillStatus.InProgress:
			className = 'bg-yellow-20 text-text-10';
			break;
		case BillStatus.Success:
			className = 'bg-teal-80 text-text-04';
			break;
		case BillStatus.Rejected:
			className = 'bg-red-80 text-text-04';
			break;
		case BillStatus.Merged:
			className = 'bg-purple-80 text-text-04';
			break;
	}

	export { className as class };
</script>

<Tag class=" {className}" size={isLarge ? 'default' : 'sm'}>{label}</Tag>
