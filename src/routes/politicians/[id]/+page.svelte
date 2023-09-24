<script lang="ts">
	import General from '$components/icons/general.svelte';
	import Politician from '$components/icons/politician.svelte';
	import Vote from '$components/icons/vote.svelte';
	import PartyDetail from '$components/politicians/PartyDetail.svelte';
	import PositionStatus from '$components/politicians/PositionStatus.svelte';
	import Section from '$components/politicians/Section.svelte';
	import Share from '$components/politicians/Share.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		InlineNotification,
		Tag
	} from 'carbon-components-svelte';
	import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ArrowUpRight from 'carbon-icons-svelte/lib/ArrowUpRight.svelte';
	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import TableSplit from 'carbon-icons-svelte/lib/TableSplit.svelte';
	import scrollama from 'scrollama';
	import { onMount } from 'svelte';

	export let data;

	const { politician } = data;

	const groupBy = <T, K extends keyof any>(arr: T[], groupFn: (element: T) => K): Record<K, T[]> =>
		arr.reduce(
			(r, v, _i, _a, k = groupFn(v)) => ((r[k] || (r[k] = [])).push(v), r),
			{} as Record<K, T[]>
		);

	const age = new Date(Date.now() - politician.birthdate.getTime()).getFullYear() - 1970;
	const parties = groupBy(politician.partyRoles, (role) => role.party.name);
	const currentParty = politician.partyRoles.find((e) => !e.to);
	const partyCount = Object.keys(parties).length;
	const currentRoles = politician.assemblyRoles.filter((e) => !e.to);

	let currentNavElementIndex = 0;
	onMount(() => {
		if (window.matchMedia('(min-width: 672px)').matches) {
			const scroller = scrollama();

			scroller
				.setup({
					step: '.politician-section',
					// @ts-expect-error Documentation บอกว่าใช้ string ที่มี px ได้ https://github.com/russellsamora/scrollama#:~:text=number%20(0%20%2D%201%2C%20or%20string%20with%20%22px%22)
					offset: '33px'
				})
				.onStepEnter((response) => {
					currentNavElementIndex = response.index;
				});

			return scroller.destroy;
		}
	});
</script>

<Breadcrumb
	noTrailingSlash
	class="px-4 py-2 body-compact-01 [&>.bx--breadcrumb]:flex [&>.bx--breadcrumb]:flex-wrap"
>
	<BreadcrumbItem href="/">หน้าหลัก</BreadcrumbItem>
	<BreadcrumbItem href="/politicians">สส. ชุดที่ 26</BreadcrumbItem>
	<BreadcrumbItem href="/politicians/{politician.firstname}-{politician.lastname}" isCurrentPage
		>{politician.firstname}</BreadcrumbItem
	>
</Breadcrumb>
<header class="px-4 py-8 md:px-16 md:py-12">
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
		{#if currentParty}
			<img
				class="absolute right-0 bottom-0 rounded-full overflow-hidden w-[32px] h-auto aspect-square bg-white border border-gray-30 border-solid object-contain"
				src={currentParty.party.logo}
				alt={currentParty.party.name}
				width="32"
				height="32"
				loading="lazy"
				decoding="async"
			/>
		{/if}
	</div>
	<div class="flex flex-col gap-8 md:flex-row md:gap-16">
		<div class="flex-1 flex flex-col gap-2">
			<!-- FIXME: ไม่มีคำนำหน้า -->
			<h1 class="fluid-heading-05">{politician.firstname} {politician.lastname}</h1>
			<PositionStatus isActive={politician.isActive} />
			{#if currentRoles.length > 0}
				<h2 class="heading-01 -mb-2">ตำแหน่งปัจจุบัน</h2>
				<ul class="body-01 list-disc ml-8">
					{#each currentRoles as role}
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
			<div class="flex flex-col gap-2 border border-solid border-ui-03 rounded-sm p-3">
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

<div
	class="flex flex-col items-start gap-4 p-4 min-h-screen bg-[--party] md:flex-row md:gap-8 md:py-8 md:px-16 heading-01"
	style:--party={currentParty?.party.color ?? '#F4F4F4'}
>
	<nav
		class="w-full bg-ui-05 rounded-sm overflow-hidden md:sticky md:top-8 md:w-[224px] md:flex-[0_0_224px]"
	>
		<menu class="flex flex-col gap-[1px] list-none">
			<li
				class="group bg-inverse-02 hover:bg-[#313131] md:data-[active]:bg-ui-05 md:data-[active]:hover:bg-ui-05 transition-colors duration-[111ms] ease-productive-in-out"
				data-active={currentNavElementIndex === 0 || null}
			>
				<a href="#personal" class="block p-4 text-white no-underline">
					<div class="flex justify-between">
						<span>ข้อมูลพื้นฐาน</span>
						<ArrowDown class="md:hidden" />
						<ArrowRight class="hidden md:group-data-[active]:block" />
					</div>
				</a>
			</li>
			<li
				class="group bg-inverse-02 hover:bg-[#313131] md:data-[active]:bg-ui-05 md:data-[active]:hover:bg-ui-05 transition-colors duration-[113ms] ease-productive-in-out"
				data-active={currentNavElementIndex === 1 || null}
			>
				<a href="#politics" class="block p-4 text-white no-underline">
					<div class="flex justify-between">
						<span>ประวัติทางการเมือง</span>
						<ArrowDown class="md:hidden" />
						<ArrowRight class="hidden md:group-data-[active]:block" />
					</div>
					{#if politician.assemblyRoles.length + partyCount > 0}
						<ul class="label-01 text-white/60">
							{#if politician.assemblyRoles.length > 0}
								<li>{politician.assemblyRoles.length} ตำแหน่ง</li>
							{/if}
							{#if partyCount > 0}
								<li>{partyCount} พรรคการเมือง</li>
							{/if}
						</ul>
					{/if}
				</a>
			</li>
			<li
				class="group bg-inverse-02 hover:bg-[#313131] md:data-[active]:bg-ui-05 md:data-[active]:hover:bg-ui-05 transition-colors duration-[114ms] ease-productive-in-out"
				data-active={currentNavElementIndex === 2 || null}
			>
				<a href="#votelog" class="block p-4 text-white no-underline">
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
				class="group bg-inverse-02 hover:bg-[#313131] md:data-[active]:bg-ui-05 md:data-[active]:hover:bg-ui-05 transition-colors duration-[112ms] ease-productive-in-out"
				data-active={currentNavElementIndex === 3 || null}
			>
				<a href="#bill" class="block p-4 text-white no-underline">
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
	<div class="flex-1 flex flex-col gap-6 w-full min-w-0">
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
			{#if partyCount > 0}
				<hr class="border-0 border-solid border-gray-20 border-t w-full m-0 box-border" />
				<div>
					<h3 class="heading-02">{partyCount} พรรคที่เคยสังกัด</h3>
					<ul class="flex flex-col gap-[2px] ml-8 list-disc">
						{#each Object.entries(parties) as [party, data]}
							<PartyDetail {party} {data} />
						{/each}
					</ul>
				</div>
			{/if}
		</Section>
		<Section id="votelog" title="ประวัติการลงมติ">
			<Vote slot="icon" size="32" />
			<InlineNotification
				slot="header-extension"
				class="m-0 mt-1 min-w-0"
				lowContrast
				kind="info"
				subtitle="การประเมินพฤติกรรมการลงมติ จะพิจารณาเพียงชื่อมติไม่ได้ ควรศึกษาเนื้อหาของมตินั้นๆ ประกอบด้วย"
			/>
			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<h3 class="body-02 px-2 py-1 bg-teal-20">
						5 มติล่าสุด ที่{politician.firstname}<span class="heading-02">เห็นด้วย</span>
					</h3>
					<!-- TODO: add links -->
					<ul class="flex flex-col gap-2 body-01 list-disc ml-8">
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="red">ไม่ผ่าน</Tag>
							</a>
						</li>
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="teal">ผ่าน</Tag>
							</a>
						</li>
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="teal">ผ่าน</Tag>
							</a>
						</li>
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="red">ไม่ผ่าน</Tag>
							</a>
						</li>
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="red">ไม่ผ่าน</Tag>
							</a>
						</li>
					</ul>
					<a
						href="/politicians/{politician.firstname}-{politician.lastname}/votelog?votetype=yes"
						class="mr-auto helper-text-01 flex gap-2 items-center"
						target="_blank"
						rel="nofollow noopener noreferrer"
					>
						<span>ดู xx มติที่เห็นด้วย</span>
						<ArrowRight />
					</a>
				</div>
				<div class="flex flex-col gap-2">
					<h3 class="body-02 px-2 py-1 bg-red-20">
						5 มติล่าสุด ที่{politician.firstname}<span class="heading-02">ไม่เห็นด้วย</span>
					</h3>
					<!-- TODO: add links -->
					<ul class="flex flex-col gap-2 body-01 list-disc ml-8">
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="red">ไม่ผ่าน</Tag>
							</a>
						</li>
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="teal">ผ่าน</Tag>
							</a>
						</li>
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="teal">ผ่าน</Tag>
							</a>
						</li>
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="red">ไม่ผ่าน</Tag>
							</a>
						</li>
						<li>
							<a class="flex items-start gap-1 text-black no-underline cursor-pointer" href="/">
								<span class="flex-1 max-w-max underline"
									>ร่าง พ.ร.บ. กำหนดระยะเวลาดำเนินงานในกระบวนการยุติธรรม (วาระ 1)</span
								>
								<Tag class="cursor-pointer m-0 whitespace-nowrap" type="red">ไม่ผ่าน</Tag>
							</a>
						</li>
					</ul>
					<a
						href="/politicians/{politician.firstname}-{politician.lastname}/votelog?votetype=no"
						class="mr-auto helper-text-01 flex gap-2 items-center"
						target="_blank"
						rel="nofollow noopener noreferrer"
					>
						<span>ดู xx มติที่เห็นด้วย</span>
						<ArrowRight />
					</a>
				</div>
				<div class="flex flex-col gap-2">
					<h3 class="body-02 px-2 py-1 bg-gray-10 heading-02">การลา/ขาดประชุม</h3>
					<!-- TODO: add numbers -->
					<p class="body-02">
						{politician.firstname}ลา/ขาดประชุมในการลงมติ xxx มติ (xx%) จากทั้งหมด x,xxx
						มติในฐานข้อมูล ซึ่งน้อยกว่าค่ากลางของสมาชิกในสภาทั้งหมด (xx%)
					</p>
					<p class="label-01 text-gray-60">
						หมายเหตุ: การขาดลงมติ เกิดจากหลายสาเหตุ เช่น ติดประชุมอื่น ติดภารกิจสำคัญ เจ็บป่วย
						จึงอาจไม่ได้สะท้อนความไม่รับผิดชอบเสมอไป
					</p>
					<a
						href="/politicians/{politician.firstname}-{politician.lastname}/votelog?votetype=absent"
						class="mr-auto helper-text-01 flex gap-2 items-center"
						target="_blank"
						rel="nofollow noopener noreferrer"
					>
						<span>ดู xx มติที่ขาด</span>
						<ArrowRight />
					</a>
				</div>
				<Button
					href="/politicians/{politician.firstname}-{politician.lastname}/votelog"
					kind="tertiary"
					icon={ArrowRight}
					size="small">ดูการลงมติทั้งหมด</Button
				>
			</div>
		</Section>
		<!-- <Section id="data" title="Data">
			<div class="overflow-x-auto">
				<pre>{JSON.stringify(politician, null, 2)}</pre>
			</div>
		</Section> -->
	</div>
</div>
