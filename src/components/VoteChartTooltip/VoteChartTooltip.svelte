<script lang="ts">
	export let color: string;
	export let value: number;
	export let total: number;

	let id = 'ccs-' + Math.random().toString(36);
	let open = false;

	const hide = () => (open = false);
	const show = () => (open = true);

	function getWidthPercent(voteCount: number, totalVotes: number) {
		return +((voteCount / (totalVotes || 1)) * 100).toFixed(2);
	}
</script>

<svelte:window
	on:keydown={({ key }) => {
		if (key === 'Escape') hide();
	}}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<span
	class="bx--tooltip--definition bx--tooltip--a11y rounded-sm h-full {color}"
	style="width:{getWidthPercent(value, total)}%"
	on:mouseenter={show}
	on:mouseleave={hide}
>
	<button
		type="button"
		aria-describedby={id}
		class="!rounded-sm !border-none w-full bx--tooltip--a11y bx--tooltip__trigger bx--tooltip__trigger--definition bx--tooltip--top bx--tooltip--align-center"
		class:bx--tooltip--hidden={!open}
		class:bx--tooltip--visible={open}
		on:focus={show}
		on:blur={hide}
	/>
	<div role="tooltip" {id} class="bx--assistive-text">{value} คน</div>
</span>
