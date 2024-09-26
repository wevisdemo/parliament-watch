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

	const getStyles = (status: PromiseStatus) => {
		switch (status) {
			case PromiseStatus.inProgress:
				return {
					tag: 'bg-yellow-20 text-black',
					footer: 'bg-yellow-10'
				};
			case PromiseStatus.fulfilled:
				return {
					tag: 'bg-green-50 text-white',
					footer: 'bg-green-10'
				};
			case PromiseStatus.unhonored:
				return {
					tag: 'bg-magenta-50 text-white',
					footer: 'bg-magenta-10'
				};
			default:
				return {
					tag: 'bg-gray-30 text-black',
					footer: 'bg-gray-20'
				};
		}
	};
</script>

<div class="flex w-full shrink-0 cursor-pointer flex-col">
	<div class="h-1 {getStyles(promiseSummary.status).tag}"></div>

	<div class="group bg-ui-background px-6 hover:bg-ui-03">
		<a href="/promises/explore?party={promiseSummary.party.name}">
			<button class="flex items-center gap-2 py-4">
				<img
					src={promiseSummary.party.logo}
					alt=""
					class="h-8 w-8 rounded-full border border-gray-30"
				/>
				<p class="body-01 text-text-01">พรรค{promiseSummary.party.name}</p>
			</button>
		</a>
		<div class="flex flex-col gap-2">
			<div class="flex gap-2">
				<Quotes class="text-text-03" />
				<div
					class="w-full translate-y-[50%] border-t border-ui-03 duration-200 group-hover:border-ui-01"
				></div>
			</div>
			<div class="flex h-[165px] items-center justify-center">
				<p class="textCustom heading-compact-02 block h-full overflow-hidden">
					{promiseSummary.statements}
				</p>
			</div>
			<div class="flex flex-row-reverse gap-2">
				<Quotes class="rotate-180 text-text-03" />
				<div
					class="w-full translate-y-[50%] border-t border-ui-03 duration-200 group-hover:border-ui-01"
				></div>
			</div>
		</div>

		<div class="flex flex-col gap-[5px] pb-4 pt-3">
			{#each [{ label: 'คีย์เวิร์ด', items: promiseSummary.keywords }, { label: 'หมวด', items: promiseSummary.categories }] as { label, items } (label)}
				<div class="flex flex-wrap items-center gap-[2px]">
					<p class="body-01 text-text-02">{label}</p>
					{#each items as item, itemIndex (itemIndex)}
						{#if item}
							<a
								href="/promises/explore?{label === 'คีย์เวิร์ด'
									? `keyword=${item}`
									: `category=${item}`}"
							>
								<button
									class="label-01 rounded-full py-[1px] text-text-01 {label === 'คีย์เวิร์ด'
										? 'bg-gray-10'
										: 'border border-black'} px-2">{item}</button
								></a
							>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div class="{getStyles(promiseSummary.status).footer} grid grid-cols-2 gap-2 px-6 py-4">
		<div class="flex flex-col gap-1">
			<p class="heading-01">สถานะ</p>
			<div class="{getStyles(promiseSummary.status).tag} label-01 w-fit rounded-full px-2 py-[3px]">
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
		-webkit-line-clamp: 7;
		line-height: 1.5;
		height: auto;
		max-height: calc(7 * 1.5em);
	}
</style>
