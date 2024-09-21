<script lang="ts">
	import type { PromiseSummary } from '../../routes/promises/+page.server';
	import { PromiseStatus } from '$models/promise';
	import Quotes from 'carbon-icons-svelte/lib/Quotes.svelte';
	export let promiseSummary: PromiseSummary;

	const formatDate = (date: Date) =>
		date.toLocaleDateString('th-TH', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

	$: tagStyle = (() => {
		switch (promiseSummary.status) {
			case PromiseStatus.inProgress:
				return 'bg-yellow-20 text-black';
			case PromiseStatus.fulfilled:
				return 'bg-green-50 text-white';
			case PromiseStatus.unhonored:
				return 'bg-magenta-50 text-white';
			default:
				return 'bg-gray-50';
		}
	})();
	$: footerStyle = (() => {
		switch (promiseSummary.status) {
			case PromiseStatus.inProgress:
				return 'bg-yellow-10';
			case PromiseStatus.fulfilled:
				return 'bg-green-10';
			case PromiseStatus.unhonored:
				return 'bg-magenta-10';
			default:
				return 'bg-gray-50';
		}
	})();
</script>

<div class="flex w-full shrink-0 flex-col">
	<div class={`h-1 ${tagStyle}`}></div>
	<div class="group bg-ui-background px-6 hover:bg-ui-03">
		<div class="flex items-center gap-2 py-4">
			<img
				src={promiseSummary.party.logo}
				alt="Party logo"
				class="h-8 w-8 rounded-full border border-gray-30"
			/>
			<p class="body-01">พรรค{promiseSummary.party.name}</p>
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex gap-2">
				<p class="text-text-03"><Quotes /></p>
				<div class="w-full translate-y-[50%] border-t border-ui-03 group-hover:border-ui-01"></div>
			</div>
			<div
				class="just heading-compact-02 textCustom h-[165px] overflow-hidden text-ellipsis text-start"
			>
				"{promiseSummary.statements}"
			</div>
			<div class="flex flex-row-reverse gap-2">
				<div class="rotate-180 text-text-03"><Quotes /></div>
				<div class="w-full translate-y-[50%] border-t border-ui-03 group-hover:border-ui-01"></div>
			</div>
		</div>
		<div class="flex flex-col gap-[5px] pb-4 pt-3">
			<div class="flex flex-wrap gap-[2px]">
				<p class="body-01 text-text-02">คีย์เวิร์ด</p>
				{#each promiseSummary.keywords as keyword}
					{#if keyword}
						<button class="label-01 rounded-full bg-gray-10 px-2">{keyword}</button>
					{/if}
				{/each}
			</div>
			<div class="flex flex-wrap gap-[2px]">
				<p class="body-01 text-text-02">หมวด</p>
				{#each promiseSummary.categories as category}
					{#if category}
						<button class="label-01 rounded-full border px-2">{category}</button>
					{/if}
				{/each}
				<button class="label-01 rounded-full border px-2">เศรษฐกิจ</button><button
					class="label-01 rounded-full border px-2">สังคม</button
				>
			</div>
		</div>
	</div>
	<div class={`${footerStyle} grid grid-cols-2 gap-2  px-6 py-4`}>
		<div class="flex flex-col gap-1">
			<p class="heading-01">สถานะ</p>
			<div class={`${tagStyle} label-01 w-fit rounded-full  px-2 py-[3px]`}>
				{promiseSummary.status}
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<p class="heading-01">เคลื่อนไหวล่าสุด</p>
			<div class="body-01">{formatDate(promiseSummary.latestProgressDate.date)}</div>
		</div>
	</div>
</div>

<style>
	.textCustom {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-height: 1.5;
		max-height: 100%;
		-webkit-line-clamp: 7;
		white-space: normal;
	}
</style>
