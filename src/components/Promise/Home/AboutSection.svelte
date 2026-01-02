<script lang="ts">
	import { ArrowRight } from 'carbon-icons-svelte';
	import { formatDateRange, formatThaiDate, formatThaiYear } from '$lib/date';
	import PoliticianPicture from '$components/PoliticianPicture/PoliticianPicture.svelte';

	interface CabinetSummary {
		id: string;
		name: string;
		founding_date: string | null;
		dissolution_date: string | null;
		primeMinister?: {
			firstname: string;
			lastname: string;
			image: string | null;
			party: {
				name: string;
				image: string | null;
			};
		};
		cabinetMemberCount: number;
		cabinetMemberCountsByParty: {
			name: string;
			image: string | null;
			count: number;
		}[];
	}

	export let cabinet: CabinetSummary;
	export let previousCabinet: CabinetSummary;
</script>

<div class="flex flex-col items-center gap-2 py-3">
	<p class="fluid-heading-04">เกี่ยวกับรัฐบาล</p>
	<div class="flex w-full flex-col gap-4 bg-ui-05 p-6 text-text-04">
		<div class="flex flex-col md:flex-row">
			{#if cabinet.primeMinister}
				<div class="flex flex-col gap-3 md:basis-1/2">
					<p class="heading-01">นายกรัฐมนตรี</p>
					<div class="flex flex-col gap-2">
						<div class="flex gap-2">
							<PoliticianPicture
								avatar={cabinet.primeMinister.image ?? undefined}
								size="64"
								partyLogo={cabinet.primeMinister.party?.image ?? undefined}
							/>
							<div>
								<p class="fluid-heading-04">
									{cabinet.primeMinister.firstname}
									{cabinet.primeMinister.lastname}
								</p>
								<p class="body-01">
									{cabinet.primeMinister.party ? cabinet.primeMinister.party.name : 'ไม่สังกัดพรรค'}
								</p>
							</div>
						</div>
						<div>
							<span class="heading-01">คณะรัฐมนตรี</span>
							<span class="body-01 text-text-03"
								>{cabinet.cabinetMemberCount} ตำแหน่ง ประกอบด้วย</span
							>
						</div>
						<div class="flex flex-wrap">
							{#each cabinet.cabinetMemberCountsByParty as party}
								<div class="flex items-center gap-1 py-1 pr-3">
									<img
										src={party.image ?? '/images/parties/_placeholder.webp'}
										class="block h-5 w-5 rounded-full"
										alt=""
									/>
									<p class="label-01">{party.name}</p>
									<p class="label-01 text-text-03">{party.count}</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
			<div class="flex flex-col gap-3 md:basis-1/2">
				{#if cabinet.founding_date}
					<div>
						<span class="heading-01">เริ่มวาระ</span>
						<span class="body-01 text-text-04">
							{formatThaiDate(cabinet.founding_date, { shortMonth: true })}
						</span>
					</div>
				{/if}
				<p class="body-01 text-text-04">
					นางสาวแพทองธาร ชินวัตร นายกรัฐมนตรี ได้แถลงนโยบายต่อรัฐสภาเมื่อวันที่ 12 กันยายน 2567
					โดยเน้นความท้าทายที่ประเทศไทยต้องเผชิญ เช่น การเติบโตทางเศรษฐกิจที่ต่ำกว่าศักยภาพ
					ปัญหาหนี้สิน ความเหลื่อมล้ำ และสิ่งแวดล้อม
					โดยรัฐบาลตั้งใจจะเปลี่ยนความท้าทายเหล่านี้ให้เป็นโอกาสและความเสมอภาคทางเศรษฐกิจและสังคม
					นโยบายเร่งด่วนของรัฐบาลประกอบด้วย 10 ข้อ อาทิ การปรับโครงสร้างหนี้
					การกระตุ้นเศรษฐกิจผ่านดิจิทัลวอลเล็ต การลดราคาพลังงาน และการส่งเสริมการท่องเที่ยว
					รวมถึงแผนระยะยาวเพื่อพัฒนาเศรษฐกิจดิจิทัล ยานยนต์ไฟฟ้า และพลังงานสะอาด
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
				รัฐบาลชุดที่ผ่านมาในสมัยการเลือกตั้ง {previousCabinet.founding_date
					? formatThaiYear(previousCabinet.founding_date)
					: ''}
			</p>
			<ul class="list-disc">
				<li class="label-01 ml-5">
					นายกรัฐมนตรี{previousCabinet.primeMinister?.firstname}
					{previousCabinet.primeMinister?.lastname} และคณะรัฐมนตรีจาก
					{#each previousCabinet.cabinetMemberCountsByParty as party, i}
						{party.name} ({party.count} ตำแหน่ง)
						{#if i < previousCabinet.cabinetMemberCountsByParty.length - 1}
							,&nbsp
						{/if}
					{/each}
					<p class="label-01 text-text-03">
						{formatDateRange(previousCabinet.founding_date, previousCabinet.dissolution_date, {
							shortMonth: true
						})}
					</p>
				</li>
			</ul>
		</div>
	</div>
</div>
