<script lang="ts">
	export let index: number;
	export let firstname: string;
	export let lastname: string;
	export let logo: string | undefined;
</script>

<tr>
	<td class="body-01 pb-2 text-start text-text-02" style="fixed; width: 1%">{index}</td>
	<td class="pb-2">
		<div class="ml-1.5 flex items-center gap-1">
			<div
				class="flex items-center justify-center overflow-hidden rounded-full border border-gray-30"
				style="width: 16px; height: 16px;"
			>
				{#if logo}
					<img src={logo} alt="" />
				{/if}
			</div>
			<p class="text-start underline">{firstname + ' ' + lastname}</p>
		</div>
	</td>
</tr>
