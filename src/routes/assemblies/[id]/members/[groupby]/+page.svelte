<script lang="ts">
	export let data;
	$: ({ groups } = data);
</script>

<div class="whitespace-pre">
	{JSON.stringify(groups, undefined, 2)}
</div>
