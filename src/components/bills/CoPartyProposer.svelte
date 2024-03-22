<script lang="ts">
	import type { Politician } from '$models/politician';

	export let name: string;
	export let politicians: (Politician | string)[];

	$: party =
		typeof politicians[0] === 'object'
			? politicians[0].partyRoles.find((e) => !e.endedAt)?.party
			: undefined;
</script>

<div class="flex gap-2">
	<div
		class="flex items-center justify-center overflow-hidden rounded-full border border-gray-30"
		style="width: 24px; height: 24px;"
	>
		<img src={party?.logo || '/images/politicians/_placeholder.webp'} alt="" />
	</div>
	<div class="flex">
		<!-- TODO: link to party when implemented -->
		<p>{party ? 'พรรค' : ''}{name}</p>
		<p class="body-02 ml-1 text-text-02">{politicians.length} คน</p>
	</div>
</div>
