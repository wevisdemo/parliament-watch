<script lang="ts">
	import type { Politician } from '$models/politician';

	export let party: string;
	export let politicians: Politician[];
</script>

<div class="flex gap-2">
	<div
		class="flex items-center justify-center overflow-hidden rounded-full border border-gray-30"
		style="width: 24px; height: 24px;"
	>
		<img src={politicians[0].partyRoles.find((e) => !e.endedAt)?.party.logo} alt="" />
	</div>
	<div class="flex">
		<p class="underline">พรรค{party}</p>
		<p class="body-02 ml-1 text-text-02">{politicians.length} คน</p>
	</div>
</div>
