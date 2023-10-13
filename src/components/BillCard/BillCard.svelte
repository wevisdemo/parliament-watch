<script lang="ts">
	import { ArrowRight } from 'carbon-icons-svelte';

	import BillStatusTag from '$components/BillStatusTag/BillStatusTag.svelte';
	import type { BillStatus } from '$models/bill';

	interface ProposedBy {
		avatar: string;
		name: string;
		description: string;
	}

	// see: https://github.com/wevisdemo/parliament-watch/issues/26#issue-1937096920
	export let orientation: 'landscape' | 'portrait' = 'landscape';
	export let nickname: string;
	export let title: string;
	export let proposedBy: ProposedBy;
	export let proposedOn: Date;
	export let status: BillStatus;
	export let currentState: string | undefined;
	export let daySinceProposed: number;
	export let billUrl: string;
</script>

<div
	class="flex relative p-4 bg-white hover:bg-gray-10 rounded-sm {orientation === 'landscape'
		? 'flex-row gap-x-6'
		: 'flex-col gap-y-4 pt-6'}"
>
	<div class="space-y-1 {orientation === 'landscape' ? 'w-2/3' : 'w-full'}">
		<a href={billUrl} class="block after:absolute after:content-[''] after:inset-0">
			<h3 class="fluid-heading-03">{nickname}</h3>
		</a>

		<p class="text-sm text-text-02"><span class="font-bold">ชื่อทางการ</span> {title}</p>

		<div>
			<p class="font-semibold">เสนอโดย</p>

			<div class="flex {orientation === 'landscape' ? 'flex-row gap-x-2' : 'flex-col'}">
				<figure class="shrink-0 w-6 h-6 rounded-full bg-gray-20 overflow-hidden">
					<img src={proposedBy.avatar} alt={proposedBy.name} class="w-full h-full" loading="lazy" />
				</figure>

				<p class="text-sm">
					{proposedBy.name} <span class="text-gray-60">{proposedBy.description}</span>
				</p>
			</div>
		</div>
	</div>

	<div class={orientation === 'landscape' ? 'w-1/3' : 'w-full'}>
		<div class="flex {orientation === 'landscape' ? 'flex-row gap-x-6' : 'flex-col gap-y-4'}">
			<div class="grow space-y-2">
				<div>
					<p class="text-sm font-semibold">วันที่เสนอ</p>

					<p class="text-sm">
						{proposedOn.toLocaleDateString('th-TH', {
							day: 'numeric',
							month: 'short',
							year: 'numeric'
						})}
					</p>
				</div>

				<div>
					<p class="text-sm font-semibold">สถานะ</p>
					<BillStatusTag isLarge={true} {status} />
					{#if currentState}
						<p class="text-sm font-semibold">{currentState}</p>
					{/if}
				</div>

				<p class="text-sm text-blue-70 font-semibold">ผ่านมาแล้ว {daySinceProposed} วัน</p>
			</div>

			<ArrowRight class="w-6 h-6 ml-auto text-gray-100" />
		</div>
	</div>
</div>
