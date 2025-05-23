<script lang="ts">
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';
	import { ArrowRight } from 'carbon-icons-svelte';
	import type {
		CabinetSummary,
		PreviousCabinetSummary
	} from '../../../routes/promises/+page.server';
	import { formatThaiDate } from '$lib/date-parser';

	export let cabinet: CabinetSummary;
	export let previousCabinet: PreviousCabinetSummary;
	$: ({ primeMinister, policyStatement } = cabinet);
	$: previousCabinetMemberCountsByParty = previousCabinet.cabinetMemberCountsByParty;
</script>

<div class="flex w-full flex-col gap-4 bg-ui-05 p-6 text-text-04">
	<div class="flex flex-col md:flex-row">
		<div class="flex flex-col gap-3 md:basis-1/2">
			<p class="heading-01">นายกรัฐมนตรี</p>
			<div class="flex flex-col gap-2">
				<div class="flex gap-2">
					<PoliticianPicture
						avatar={primeMinister.avatar}
						size="64"
						partyLogo={primeMinister.party?.logo}
					/>
					<div>
						<p class="fluid-heading-04">{primeMinister.firstname} {primeMinister.lastname}</p>
						<p class="body-01">
							{primeMinister.party ? primeMinister.party.name : 'ไม่สังกัดพรรค'}
						</p>
					</div>
				</div>
				<div>
					<span class="heading-01">คณะรัฐมนตรี</span>
					<span class="body-01 text-text-03">{cabinet.cabinetMemberCount} ตำแหน่ง ประกอบด้วย</span>
				</div>
				<div class="flex flex-wrap">
					{#each cabinet.cabinetMemberCountsByParty as party}
						<div class="flex items-center gap-1 py-1 pr-3">
							{#if typeof party.party != 'string'}
								<img src={party.party.logo} class="block h-5 w-5 rounded-full" alt="" />
								<p class="label-01">{party.party.name}</p>
								<p class="label-01 text-text-03">{party.count}</p>
							{:else}
								<p class="label-01">{party.party}</p>
								<p class="label-01 text-text-03">{party.count}</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-3 md:basis-1/2">
			<div>
				<span class="heading-01">เริ่มวาระ</span>
				<span class="body-01 text-text-04">{formatThaiDate(cabinet.startedAt, true)}</span>
			</div>
			<p class="body-01 text-text-04">
				{policyStatement}
			</p>
			<a
				href="/assemblies/{cabinet.id}"
				class="flex justify-between bg-interactive-02 p-4 text-text-04"
			>
				<p class="body-compact-01">ดูรายละเอียดคณะรัฐมนตรี</p>
				<ArrowRight />
			</a>
		</div>
	</div>
	<div class="flex flex-col gap-2 border-t border-ui-04 pt-3">
		<p class="label-01 text-text-03">
			รัฐบาลชุดที่ผ่านมาในสมัยการเลือกตั้ง {previousCabinet.startedAt.getFullYear() + 543}
		</p>
		<ul class="list-disc">
			<li class="label-01 ml-5">
				นายกรัฐมนตรี{previousCabinet.primeMinister.firstname}
				{previousCabinet.primeMinister.lastname} และคณะรัฐมนตรีจาก
				{#each previousCabinetMemberCountsByParty as party, i}
					{#if typeof party.party !== 'string'}
						{party.party.name} ({party.count} ตำแหน่ง)
					{:else}
						{party.party} ({party.count} ตำแหน่ง)
					{/if}
					{#if i < previousCabinetMemberCountsByParty.length - 1}
						,&nbsp
					{/if}
				{/each}
				<p class="label-01 text-text-03">
					{formatThaiDate(previousCabinet.startedAt, true)} - {formatThaiDate(
						previousCabinet.endedAt,
						true
					)}
				</p>
			</li>
		</ul>
	</div>
</div>
