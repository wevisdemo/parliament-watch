<script lang="ts">
	export let color: string;
	export let option: string;
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
	class="bx--tooltip--definition bx--tooltip--a11y h-full rounded-sm {color}"
	style="width:{getWidthPercent(value, total)}%"
	on:mouseenter={show}
	on:mouseleave={hide}
>
	<button
		type="button"
		aria-describedby={id}
		class="bx--tooltip--a11y bx--tooltip__trigger bx--tooltip__trigger--definition bx--tooltip--top bx--tooltip--align-center w-full !rounded-sm !border-none"
		class:bx--tooltip--hidden={!open}
		class:bx--tooltip--visible={open}
		on:focus={show}
		on:blur={hide}
	/>
	<div role="tooltip" {id} class="bx--assistive-text">{option} {value} คน</div>
</span>
