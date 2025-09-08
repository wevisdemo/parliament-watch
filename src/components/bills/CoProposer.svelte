<script lang="ts">
	export let index: number;
	export let politician: {
		id?: string;
		name: string;
	};
	export let partyLogo: string | null = null;
</script>

<tr>
	<td class="body-01 pb-2 text-start text-text-02" style="fixed; width: 1%">{index}</td>
	<td class="pb-2">
		<div class="ml-1.5 flex items-center gap-1">
			<div
				class="flex items-center justify-center overflow-hidden rounded-full border border-gray-30"
				style="width: 16px; height: 16px;"
			>
				<img src={partyLogo || '/images/politicians/_placeholder.webp'} alt="" />
			</div>
			{#if politician.id}
				<a class="text-black underline" href="/politicians/{politician.id}">{politician.name}</a>
			{:else}
				<p>{politician.name}</p>
			{/if}
		</div>
	</td>
</tr>
