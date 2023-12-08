<script lang="ts">
	export let imgSrc: string;
	export let title: string;
</script>

<div class="flex flex-col items-center bg-teal-10 p-5">
	<img src={imgSrc} alt="process-step-{title}" />
	<div class="text-01">
		<div class="font-bold">{title}</div>
		<slot />
	</div>
</div>
