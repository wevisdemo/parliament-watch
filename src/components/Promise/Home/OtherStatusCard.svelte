<script lang="ts">
	import type { PromiseSample } from '../../../routes/promises/+page.server';

	export let title: string;
	export let description: string;
	export let statusCnt: number;
	export let samples: PromiseSample[] = [];
</script>

<div class="flex flex-col gap-2 bg-gray-10 p-6">
	<p class="heading-01">{statusCnt} {title}</p>
	<p class="body-01">
		{description}
	</p>
	<p class="body-01 text-text-02">เช่น</p>
	<ul class="list-disc space-y-2 pl-6">
		{#each samples as s}
			<li>
				<p class="body-01 line-clamp-2 text-text-02 underline">
					{s.statements}
				</p>
			</li>
		{/each}
	</ul>
	<div class="py-1">
		<button class="helper-text-01 text-blue-60 underline">ดูทั้งหมด</button>
	</div>
</div>
