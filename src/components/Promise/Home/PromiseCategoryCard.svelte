<script lang="ts">
	export let categoryName = '';
	export let inProgressCnt = 0;
	export let fulfilledCnt = 0;
	export let unhonored = 0;
	export let totalCnt = 0;
	export let max = 0;
</script>

<div class="flex min-w-[240px] flex-col gap-1">
	<p class="heading-02 text-text-01">{totalCnt} {categoryName}</p>
	<div class="flex gap-3">
		<div class="flex items-center gap-1">
			<div class="legend bg-green-50" />
			<p class="label-01">{fulfilledCnt}</p>
		</div>
		<div class="flex items-center gap-1">
			<div class="legend bg-yellow-20" />
			<p class="label-01">{inProgressCnt}</p>
		</div>
		<div class="flex items-center gap-1">
			<div class="legend bg-magenta-50" />
			<p class="label-01">{unhonored}</p>
		</div>
	</div>
	<div class="flex" style="width:{Math.round((totalCnt / max) * 100)}%;">
		<div
			class="h-2 w-full rounded-sm bg-green-50"
			style="width:{Math.round((fulfilledCnt / totalCnt) * 100)}%;"
		/>
		<div
			class="h-2 w-full rounded-sm bg-yellow-20"
			style="width:{Math.round((inProgressCnt / totalCnt) * 100)}%;"
		/>
		<div
			class="h-2 w-full rounded-sm bg-magenta-50"
			style="width:{Math.round((unhonored / totalCnt) * 100)}%;"
		/>
	</div>
	<div class="py-1">
		<button class="helper-text-01 text-blue-60 underline">ดูทั้งหมด</button>
	</div>
</div>

<style>
	.legend {
		width: 4px;
		height: 12px;
	}
</style>
