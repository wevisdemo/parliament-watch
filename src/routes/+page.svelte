<script>
	import { Button, DataTableSkeleton } from 'carbon-components-svelte';
	import Vote from '../components/icons/vote.svelte';
	import Politician from '../components/icons/politician.svelte';
	import General from '../components/icons/general.svelte';
	import Law from '../components/icons/law.svelte';
	import MobileRotate from '../components/icons/mobile-rotate.svelte';
	import People from '../components/icons/people.svelte';
</script>

<div class="p-4 space-y-6 min-h-screen h-full">
	<h1 class="fluid-display-01 text-blue-60">Parliament Watch 👀</h1>
	<p>Coming soon...</p>

	<div class="flex flex-row">
		<Button>primary</Button>
		<Button kind="secondary">secondary</Button>
		<Button kind="danger">danger</Button>
	</div>

	<DataTableSkeleton showHeader={false} showToolbar={false} size="tall" />

	<div class="flex flex-row gap-2">
		<Vote />
		<Politician />
		<General />
		<Law />
		<MobileRotate />
		<People />
	</div>

	<div>
		{#each ['body-compact', 'body', 'label', 'helper-text', 'heading-compact', 'heading'] as typo}
			{#each [1, 2] as variance}
				{@const token = `${typo}-0${variance}`}
				<p class={token}>{token}</p>
			{/each}
		{/each}
		<p class="heading-03">heading-03</p>
		<p class="fluid-heading-03">fluid-heading-03</p>
		<p class="fluid-heading-04">fluid-heading-04</p>
		<p class="fluid-heading-05">fluid-heading-05</p>
		<p class="fluid-display-01">fluid-display-01</p>
		<p class="fluid-display-03">fluid-display-03</p>
	</div>
</div>
