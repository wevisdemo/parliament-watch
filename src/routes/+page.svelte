<script>
	import { Button } from 'carbon-components-svelte';
</script>

<div class="p-4 space-y-6">
	<h1 class="fluid-display-01 text-blue-60">Parliament Watch 👀</h1>
	<p>Coming soon...</p>
	<Button>Button</Button>

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
