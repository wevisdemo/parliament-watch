<script lang="ts">
	import type { PromiseSummary } from '../../routes/promises/+page.server';
	import { PromiseStatus } from '$models/promise';
	import Quotes from 'carbon-icons-svelte/lib/Quotes.svelte';
	export let promiseSummary: PromiseSummary;
	export let isList: boolean;
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

<div class="{isList ? 'flex-row' : 'flex-col'} flex h-full w-full">
	<div class="{isList ? 'w-1' : 'h-1 w-full'} {getStyles(promiseSummary.status).tag} shrink-0" />
	<div
		class="{isList
			? 'grid h-[117px] grid-cols-7 gap-2 p-4 '
			: 'flex flex-col'} group w-full shrink-0 cursor-pointer bg-ui-background duration-100 hover:bg-ui-03"
	>
		<div class="{isList ? 'col-span-3 flex-row gap-2' : 'flex-col px-6'} flex">
			<a href="/promises/explore?party={promiseSummary.party.name}" class="shrink-0">
				<button class="flex items-center gap-2 {isList ? '' : 'py-4 '}">
					<img
						src={promiseSummary.party.logo}
						alt=""
						class="h-8 w-8 rounded-full border border-gray-30"
					/>
					{#if !isList}
						<p class="body-01 text-text-01">พรรค{promiseSummary.party.name}</p>
					{/if}
				</button>
			</a>
			<div class="flex flex-col gap-2">
				{#if !isList}
					<div class="flex gap-2">
						<Quotes class="text-text-03" />
						<div
							class="w-full translate-y-[50%] border-t border-ui-03 duration-200 group-hover:border-ui-01"
						></div>
					</div>
				{/if}
				<div class="flex {isList ? '' : 'h-[165px] items-center justify-center'}">
					<p
						class="{isList
							? 'line-clamp-3 max-h-[calc(2.9*1.5em)]'
							: 'line-clamp-[7] max-h-[calc(6.85*1.5em)]'} heading-compact-02 h-auto overflow-hidden leading-6"
					>
						{promiseSummary.statements}
					</p>
				</div>
				{#if !isList}
					<div class="flex flex-row-reverse gap-2">
						<Quotes class="rotate-180 text-text-03" />
						<div
							class="w-full translate-y-[50%] border-t border-ui-03 duration-200 group-hover:border-ui-01"
						></div>
					</div>
				{/if}
			</div>
		</div>

		<div
			class="{isList ? 'grid grid-cols-2' : 'flex flex-col px-6 pb-4 pt-3'} col-span-2 gap-[5px]"
		>
			{#each [{ label: 'คีย์เวิร์ด', items: promiseSummary.keywords }, { label: 'หมวด', items: promiseSummary.categories }] as { label, items } (label)}
				<div class="{isList ? 'h-fit' : 'items-center'} flex flex-wrap gap-[2px]">
					{#if !isList}
						<p class="body-01 text-text-02">{label}</p>
					{/if}
					{#each items as item, itemIndex (itemIndex)}
						{#if item}
							<a
								href="/promises/explore?{label === 'คีย์เวิร์ด'
									? `keyword=${item}`
									: `category=${item}`}"
								class="leading-none"
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

		<div
			class="col-span-2 {isList
				? ''
				: `${getStyles(promiseSummary.status).footer} px-6 py-4`} grid grid-cols-2 gap-2"
		>
			<div class="flex flex-col gap-1">
				{#if !isList}
					<p class="heading-01">สถานะ</p>
				{/if}
				<div
					class="{getStyles(promiseSummary.status).tag} label-01 w-fit rounded-full px-2 py-[3px]"
				>
					{promiseSummary.status}
				</div>
			</div>
			<div class="flex flex-col gap-1">
				{#if !isList}
					<p class="heading-01">เคลื่อนไหวล่าสุด</p>
				{/if}
				<div class="body-01">{formatDate(promiseSummary.latestProgressDate.date)}</div>
			</div>
		</div>
	</div>
</div>
