<script lang="ts">
	import Tooltip from '$components/Assemblies/Tooltip.svelte';
	import DocumentMultiple_02 from 'carbon-icons-svelte/lib/DocumentMultiple_02.svelte';
	import Information from 'carbon-icons-svelte/lib/Information.svelte';

	interface MergeBill {
		id: string;
		name: string;
		proposedBy?: string;
	}

	interface Props {
		currentBillId: string;
		mainBill: MergeBill | undefined;
		otherBills: MergeBill[];
		innerWidth: number;
	}

	let { currentBillId, mainBill, otherBills, innerWidth }: Props = $props();

	let isMainBill = $derived(mainBill?.id === currentBillId);
</script>

<div class="rounded-sm border border-support-04 bg-purple-10 p-3">
	<div class="flex items-center gap-1">
		<DocumentMultiple_02 size={24} color="#2600A3" />
		<div class="flex flex-row items-start gap-1">
			<span class="flex-1">
				{#if isMainBill}
					<b>มีร่างกฎหมายอื่นๆ {otherBills.length} ฉบับ ที่ถูกนำมารวมกับร่างนี้</b>
				{:else}
					<b>ถูกรวมเข้ากับร่างกฏหมายอื่น</b>
				{/if}
			</span>

			<Tooltip
				class="mt-[3px]"
				tooltipText="ร่างกฎหมายฉบับหนึ่งสามารถถูกผนวกกับร่างอื่นในรัฐสภา เพื่อพิจารณาออกเป็นกฎหมายบทเดียวกันได้ เมื่อร่างกฎหมายมีวัตถุประสงค์เดียวกัน ซึ่งจะถูกผนวกกับร่างอื่นในชั้นการพิจารณาโดยสภาผู้แทนฯ หรือในสภาร่วม โดยขึ้นอยู่กับว่าเป็นการพิจารณากฎหมายประเภทใด"
				direction="top"
				align={innerWidth <= 500 ? (innerWidth <= 366 ? 'center' : 'end') : 'center'}
			>
				<Information color="#525252" />
			</Tooltip>
		</div>
	</div>
	{#if !isMainBill && mainBill}
		<a class="text-sm text-black" href="/bills/{mainBill.id}"
			>{mainBill.name}
			{#if mainBill.proposedBy}
				{' '}<span class="text-gray-60">เสนอโดย {mainBill.proposedBy}</span>
			{/if}
		</a>
	{:else}
		{#if !isMainBill && !mainBill}
			<span class="text-sm text-gray-60">กำลังอยู่ระหว่างการตรวจสอบว่าร่างใดเป็นร่างหลัก</span>
		{/if}
		<ul class="ml-8 mt-1 list-disc">
			{#each otherBills as { id, name, proposedBy } (id)}
				<li>
					<a class="text-sm text-black hover:underline" href="/bills/{id}"
						>{name}{#if proposedBy}
							{' '}<span class="text-gray-60">เสนอโดย {proposedBy}</span>
						{/if}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
</div>
