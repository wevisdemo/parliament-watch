<script lang="ts">
	interface Props {
		class?: string;
		style?: string;
		option: string;
		value: number;
		total: number;
	}

	let { class: className = '', style = '', option, value, total }: Props = $props();

	let id = 'ccs-' + Math.random().toString(36);
	let open = $state(false);

	const hide = () => (open = false);
	const show = () => (open = true);

	function getWidthPercent(voteCount: number, totalVotes: number) {
		return +((voteCount / (totalVotes || 1)) * 100).toFixed(2);
	}
</script>

<svelte:window
	onkeydown={({ key }) => {
		if (key === 'Escape') hide();
	}}
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class="bx--tooltip--definition bx--tooltip--a11y h-full rounded-sm {className}"
	style="width:{getWidthPercent(value, total)}%; {style}"
	onmouseenter={show}
	onmouseleave={hide}
>
	<button
		type="button"
		aria-describedby={id}
		aria-label="{option} {value} คน"
		class="bx--tooltip--a11y bx--tooltip__trigger bx--tooltip__trigger--definition bx--tooltip--top bx--tooltip--align-center w-full !rounded-sm !border-none"
		class:bx--tooltip--hidden={!open}
		class:bx--tooltip--visible={open}
		onfocus={show}
		onblur={hide}
	></button>
	<div role="tooltip" {id} class="bx--assistive-text">{option} {value} คน</div>
</span>
