<script lang="ts">
	import General from '$components/icons/general.svelte';
	import Politician from '$components/icons/politician.svelte';
	import PositionStatus from '$components/politicians/PositionStatus.svelte';
	import Section from '$components/politicians/Section.svelte';
	import Share from '$components/politicians/Share.svelte';
	import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ArrowUpRight from 'carbon-icons-svelte/lib/ArrowUpRight.svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';

	export let data;

	const { politician } = data;

	const age = new Date(Date.now() - politician.birthdate.getTime()).getFullYear() - 1970;
</script>

<header class="font-sans px-4 py-8 md:px-16 md:py-12">
	<div class="relative w-[120px] h-[120px] mb-4">
		<img
			class="rounded-full overflow-hidden w-full h-full object-cover"
			src={politician.avatar}
			alt={politician.firstname + ' ' + politician.lastname}
			width="120"
			height="120"
			loading="lazy"
			decoding="async"
		/>
		<!-- FIXME: Get current party to avoid partyRoles being empty arr -->
		<img
			class="absolute right-0 bottom-0 rounded-full overflow-hidden w-[32px] h-auto aspect-square bg-white border border-gray-30 border-solid object-contain"
			src={politician.partyRoles[0].party.logo}
			alt={politician.partyRoles[0].party.name}
			width="32"
			height="32"
			loading="lazy"
			decoding="async"
		/>
	</div>
	<div class="flex flex-col gap-8 md:flex-row md:gap-16">
		<div class="flex-1 flex flex-col gap-2">
			<!-- FIXME: ไม่มีคำนำหน้า -->
			<h1 class="fluid-heading-05">{politician.firstname} {politician.lastname}</h1>
			<PositionStatus isActive={politician.isActive} />
			{#if politician.assemblyRoles.length > 0}
				<h2 class="heading-01 -mb-2">ตำแหน่งปัจจุบัน</h2>
				<ul class="body-01 list-disc ml-8">
					{#each politician.assemblyRoles as role}
						<!-- TODO: add link -->
						<li>
							{role.role} ใน
							<a class="text-black" href="/">{role.assembly.name} ชุดที่ {role.assembly.term}</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex flex-col gap-2 border border-solid border-gray-20 rounded-sm p-3">
				<div class="flex items-center gap-1">
					<Download />
					<h2 class="heading-01">ดาวน์โหลดข้อมูล</h2>
				</div>
				<!-- TODO: add link -->
				<a href="/" class="flex items-center gap-1 mr-auto helper-text-01">
					<TableSplit />
					<span>ผลการลงมติรายคน</span>
				</a>
			</div>
			<p class="label-01 text-gray-60">อัปเดตข้อมูล: 18 ส.ค. 2566</p>
			<!-- TODO: add link -->
			<a href="/" class="mr-auto helper-text-01"> ที่มาและข้อจำกัดข้อมูล </a>
			<Share />
		</div>
	</div>
</header>

<!-- FIXME: Get current party to avoid partyRoles being empty arr -->
<div
	class="flex flex-col items-start gap-4 p-4 min-h-screen bg-[--party] md:flex-row md:gap-8 md:py-8 md:px-16 font-sans heading-01"
	style:--party={politician.partyRoles[0].party.color}
>
	<nav class="w-full bg-gray-100 rounded-sm overflow-hidden md:sticky md:top-8 md:w-[224px]">
		<menu class="flex flex-col gap-[1px] list-none">
			<li
				class="group p-4 bg-gray-80 hover:bg-[#313131] md:data-[active]:bg-gray-100 md:data-[active]:hover:bg-gray-100"
				data-active
			>
				<a href="#personal" class="text-white no-underline">
					<div class="flex justify-between">
						<span>ข้อมูลพื้นฐาน</span>
						<ArrowDown class="md:hidden" />
						<ArrowRight class="hidden md:group-data-[active]:block" />
					</div>
				</a>
			</li>
			<li
				class="group p-4 bg-gray-80 hover:bg-[#313131] md:data-[active]:bg-gray-100 md:data-[active]:hover:bg-gray-100"
			>
				<a href="#politics" class="text-white no-underline">
					<div class="flex justify-between">
						<span>ประวัติทางการเมือง</span>
						<ArrowDown class="md:hidden" />
						<ArrowRight class="hidden md:group-data-[active]:block" />
					</div>
					<ul class="label-01 text-white/60">
						{#if politician.assemblyRoles.length > 0}
							<li>{politician.assemblyRoles.length} ตำแหน่ง</li>
						{/if}
						<!-- TODO: นับพรรคการเมือง -->
						<li>3 พรรคการเมือง</li>
					</ul>
				</a>
			</li>
			<li
				class="group p-4 bg-gray-80 hover:bg-[#313131] md:data-[active]:bg-gray-100 md:data-[active]:hover:bg-gray-100"
			>
				<a href="#votelog" class="text-white no-underline">
					<div class="flex justify-between">
						<span>ประวัติการลงมติ</span>
						<ArrowDown class="md:hidden" />
						<ArrowRight class="hidden md:group-data-[active]:block" />
					</div>
					<ul class="label-01 text-white/60">
						<!-- TODO: เพิ่มนับมติ -->
						<li>เห็นด้วย xxx มติ</li>
						<li>ไม่เห็นด้วย xxx มติ</li>
						<li>ลา/ขาดประชุม xxx มติ</li>
					</ul>
				</a>
			</li>
			<li
				class="group p-4 bg-gray-80 hover:bg-[#313131] md:data-[active]:bg-gray-100 md:data-[active]:hover:bg-gray-100"
			>
				<a href="#bill" class="text-white no-underline">
					<div class="flex justify-between">
						<span>ประวัติการเสนอกฏหมาย</span>
						<ArrowDown class="md:hidden" />
						<ArrowRight class="hidden md:group-data-[active]:block" />
					</div>
					<ul class="label-01 text-white/60">
						<!-- TODO: เพิ่มนับร่าง -->
						<li>xxx ร่าง</li>
					</ul>
				</a>
			</li>
		</menu>
	</nav>
	<div class="flex-1 flex flex-col gap-6 w-full">
		<Section id="personal" title="ข้อมูลพื้นฐาน">
			<General slot="icon" size="32" />
			<div>
				<p>
					<span class="heading-02">เพศ</span>
					{politician.sex} <span class="heading-02">ปีเกิด</span>
					{politician.birthdate.getFullYear() + 543} ({age} ปี)
				</p>
				{#if politician.educations.length > 0}
					<span class="heading-02">การศึกษา</span>
					<ul class="ml-8 list-disc">
						{#each politician.educations as education}
							<li>{education}</li>
						{/each}
					</ul>
				{/if}
				{#if politician.previousOccupations.length > 0}
					<span class="heading-02">อาชีพเดิม</span>
					<ul class="ml-8 list-disc">
						{#each politician.previousOccupations as oldjob}
							<li>{oldjob}</li>
						{/each}
					</ul>
				{/if}
			</div>
			<hr class="border-0 border-solid border-gray-20 border-t w-full m-0 box-border" />
			<div>
				<ul class="mb-1">
					<li>
						<span class="heading-02">ทรัพย์สิน</span>
						{politician.assetValue.toLocaleString('th-TH')} บาท
					</li>
					<li>
						<span class="heading-02">หนี้สิน</span>
						{politician.debtValue.toLocaleString('th-TH')} บาท
					</li>
				</ul>
				<!-- TODO: Add link -->
				<a
					href="/"
					class="mr-auto helper-text-01 flex gap-2 items-center w-fit"
					target="_blank"
					rel="nofollow noopener noreferrer"
				>
					<span>ตรวจสอบประวัติทางธุรกิจ</span>
					<ArrowUpRight />
				</a>
			</div>
			{#if politician.contacts.length > 0}
				<hr class="border-0 border-solid border-gray-20 border-t w-full m-0 box-border" />
				<div>
					<span class="heading-02">ช่องทางติดต่อ</span>
					<ul class="flex flex-wrap gap-3 helper-text-01">
						{#each politician.contacts as contact}
							<li>
								<a href={contact.href} target="_blank" rel="nofollow noopener noreferrer">
									{contact.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</Section>
		<Section id="politics" title="ประวัติทางการเมือง">
			<Politician slot="icon" size="32" />
			<p slot="header-extension" class="label-01 text-gray-60">
				หมายเหตุ: ข้อมูลย้อนหลังถึงปี 2562
			</p>
			{#if politician.assemblyRoles.length > 0}
				<div>
					<h3 class="heading-02">{politician.assemblyRoles.length} ตำแหน่งทางการเมือง</h3>
					<ul class="ml-8 list-disc">
						{#each politician.assemblyRoles as role}
							<li>
								{role.role}
								<!-- TODO: add links -->
								<a class="text-black" href="/">
									{role.assembly.abbreviation} ชุดที่ {role.assembly.term}
								</a>
								<span class="body-compact-02 text-gray-60">
									({role.from.toLocaleDateString('th-TH', {
										month: 'short',
										year: '2-digit'
									})}
									- {role.to
										? role.to.toLocaleDateString('th-TH', {
												month: 'short',
												year: '2-digit'
										  })
										: 'ปัจจุบัน'})
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			<!-- TODO: ใส่ข้อมูลพรรค -->
			<hr class="border-0 border-solid border-gray-20 border-t w-full m-0 box-border" />
			<div>
				<h3 class="heading-02">3 พรรคที่เคยสังกัด</h3>
				<!-- TODO: add links -->
				<ul class="flex flex-col gap-[2px] ml-8 list-disc">
					<li>
						<a class="text-black" href="/">อนาคตใหม่</a>
						<span class="text-gray-60">(ม.ค. 63 - ปัจจุบัน)</span>
						<span class="block label-01">
							ตำแหน่ง : เลขาธิการพรรค <span class="text-gray-60">(พ.ค. 63 - ปัจจุบัน)</span>,
							หัวหน้าพรรค <span class="text-gray-60">(ม.ค. 63 - พ.ค. 63)</span>
						</span>
					</li>
					<li>
						<a class="text-black" href="/">พลังประชารัฐ</a>
						<span class="text-gray-60">(ม.ค. 62 - ม.ค. 63)</span>
					</li>
					<li>
						<a class="text-black" href="/">ประชาธิปัติ</a>
						<span class="text-gray-60">(ม.ค. 62 - ม.ค. 63)</span>
					</li>
				</ul>
			</div>
		</Section>
		<section class="bg-white rounded-sm p-4 md:p-8">
			<details>
				<summary>Data</summary>
				<pre>
					{JSON.stringify(politician, null, 2)}
				</pre>
			</details>
		</section>
	</div>
</div>
