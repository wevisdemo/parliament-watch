<script lang="ts">
	import { DefaultVotingResult } from '$models/voting';
	import { Tag } from 'carbon-components-svelte';

	export let result: DefaultVotingResult | string;
	$: isPassed = result === DefaultVotingResult.Passed || result === 'passed';

	let className = '';
	export { className as class };
</script>

<Tag class={className} type={isPassed ? 'teal' : 'red'}>
	{isPassed ? 'ผ่าน' : 'ไม่ผ่าน'}
</Tag>
