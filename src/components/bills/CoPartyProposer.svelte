<script lang="ts">
	interface Props {
		politicianCount: number;
		party?:
			| {
					id?: string;
					name: string;
					image?: string | null;
			  }
			| undefined;
	}

	let { politicianCount, party = undefined }: Props = $props();
</script>

<div class="flex gap-2">
	<div
		class="flex items-center justify-center overflow-hidden rounded-full border border-gray-30"
		style="width: 24px; height: 24px;"
	>
		<img src={party?.image || '/images/politicians/_placeholder.webp'} alt="" />
	</div>
	<div class="flex">
		{#if party?.id}
			<p>พรรค{party?.name}</p>
		{:else}
			<p>ไม่พบข้อมูลพรรค</p>
		{/if}
		<p class="body-02 ml-1 text-text-02">{politicianCount} คน</p>
	</div>
</div>
