<script lang="ts">
	export let backgroundColor = 'bg-ui-background';
</script>

<div class=" {backgroundColor} px-6 md:px-12 lg:px-16">
	<div class="mx-auto max-w-[1280px] flex-col gap-6">
		<slot />
	</div>
</div>
