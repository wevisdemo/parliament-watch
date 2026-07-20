<script lang="ts">
	import { navigating } from '$app/state';
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';

	let progress = $state(0);
	let visible = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;

	function start() {
		clearInterval(timer);
		clearTimeout(hideTimer);
		visible = true;
		progress = 10;
		timer = setInterval(() => {
			progress = Math.min(progress + (90 - progress) * 0.1, 90);
		}, 200);
	}

	function done() {
		clearInterval(timer);
		progress = 100;
		hideTimer = setTimeout(() => {
			visible = false;
			progress = 0;
		}, 200);
	}

	$effect(() => {
		const target = navigating.to;
		untrack(() => {
			if (target) start();
			else if (visible) done();
		});
	});
</script>

{#if visible}
	<div
		out:fade={{ duration: 300 }}
		class="fixed left-0 top-0 z-[9999] h-[3px] bg-interactive-01 transition-[width] duration-200 ease-out"
		style="width: {progress}%; box-shadow: 0 0 8px 0 #3904e9;"
		role="progressbar"
		aria-valuenow={progress}
		aria-valuemin={0}
		aria-valuemax={100}
	></div>
{/if}
