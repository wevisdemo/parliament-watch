<script lang="ts">
	export let backgroundColor = 'bg-ui-background';
	export let id: string;
</script>

<div {id} class={backgroundColor}>
	<div class="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 md:px-16">
		<slot />
	</div>
</div>
