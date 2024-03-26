<script lang="ts">
	import type { Politician } from '$models/politician';

	export let index: number;
	export let politician: Politician | string;
	export let billProposedOn: Date;

	$: party =
		typeof politician === 'object'
			? politician.partyRoles?.find(
					({ startedAt, endedAt }) =>
						billProposedOn.getTime() >= startedAt.getTime() &&
						(!endedAt || billProposedOn.getTime() <= endedAt.getTime())
				)?.party
			: undefined;
</script>

<tr>
	<td class="body-01 pb-2 text-start text-text-02" style="fixed; width: 1%">{index}</td>
	<td class="pb-2">
		<div class="ml-1.5 flex items-center gap-1">
			<div
				class="flex items-center justify-center overflow-hidden rounded-full border border-gray-30"
				style="width: 16px; height: 16px;"
			>
				<img src={party?.logo || '/images/politicians/_placeholder.webp'} alt="" />
			</div>
			{#if typeof politician === 'object'}
				<a class="text-black underline" href="/policitians/{politician.id}"
					>{politician.firstname} {politician.lastname}</a
				>
			{:else}
				<p>{politician}</p>
			{/if}
		</div>
	</td>
</tr>
