<script lang="ts">
	import { PromiseStatus } from '$models/promise';
	import { twMerge } from 'tailwind-merge';

	export let status: PromiseStatus;
</script>

<span
	class={twMerge(
		'heading-02 rounded-3xl bg-gray-30 px-2 py-1',
		[PromiseStatus.clarifying, PromiseStatus.notStarted].includes(status) && 'bg-gray-30',
		status === PromiseStatus.inProgress && 'bg-yellow-20',
		status === PromiseStatus.fulfilled && 'bg-green-50',
		status === PromiseStatus.unhonored && 'bg-magenta-50'
	)}
>
	{status}
</span>
