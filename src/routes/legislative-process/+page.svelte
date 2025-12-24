<script lang="ts">
	import 'dayjs/locale/th';
	import Sidebar from '$components/LegislativeProcess/Sidebar.svelte';
	import Collapsible from '$components/LegislativeProcess/Collapsible.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';
	import { DefaultVoteOption, DefaultVotingResult } from '$models/voting';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import VotingProcessImageCircle from '$components/LegislativeProcess/VotingProcessImageCircle.svelte';
	import ComparisonTable from '$components/ComparisonTable/ComparisonTable.svelte';
	import ProcessCard from '$components/LegislativeProcess/ProcessCard.svelte';
	import ProcessCardArrow from '$components/LegislativeProcess/ProcessCardArrow.svelte';
	import BillStatusCard from '$components/LegislativeProcess/BillStatusCard.svelte';
	import { onMount } from 'svelte';
	import scrollama from 'scrollama';
	import { enumBillStatus } from '$lib/politigraph/genql/schema.js';
	import { formatThaiDate } from '$lib/date-parser.js';

	export let data;

	const sections = [
		{
			menu: 'แนะนำภาพรวม',
			menuItem: [
				{ text: 'การออกกฎหมายตามรัฐธรรมนูญ 2560' },
				{ text: 'กฎหมายบังคับใช้ได้อย่างไร' },
				{ text: 'กฎหมายในเว็บไซต์นี้' },
				{ text: 'ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา' },
				{ text: 'สถานะของกฎหมาย' }
			]
		},
		{
			menu: 'ขั้นตอนการออกกฎหมายโดยรัฐสภา',
			menuItem: [{ text: 'ขั้นตอนทั่วไป' }, { text: 'ขั้นตอนพิเศษของกฎหมายบางประเภท' }]
		},
		{
			menu: 'เข้าใจการลงมติของ สส.และ สว.',
			menuItem: [
				{ text: 'การลงมติคืออะไร เกิดขึ้นในขั้นตอนไหนบ้าง?' },
				{ text: 'วิธีการลงมติ' },
				{ text: 'ประเภทการลงมติ' },
				{ text: 'ผลการลงมติ' }
			]
		},
		{
			menu: 'สส.และ สว.ทำอะไรบ้างในสภา',
			menuItem: [
				{ text: 'หน้าที่ของสมาชิกสภาผู้แทนราษฏร (สส.)' },
				{ text: 'หน้าที่ของสมาชิกวุฒิสภา (สว.)' },
				{ text: 'หน้าที่ของสภาร่วม (สส. + สว.)' }
			]
		}
	];

	const billStatuses = [
		{
			billStatus: enumBillStatus.IN_PROGRESS,
			billAmount: 'xxxx',
			descriptionTitle: 'ร่างกฎหมายอยู่ในขั้นตอนใดขั้นตอนหนึ่ง ได้แก่',
			descriptionList: [
				'ถูกเสนอเข้าสภา',
				'สภาผู้แทนฯ พิจารณาวาระที่ 1, 2, 3',
				'วุฒิสภาพิจารณาวาระที่ 1, 2, 3',
				'แก้ไขเพิ่มเติมเพื่อพิจารณาใหม่',
				'รัฐสภาพิจารณา'
			],
			learnMoreLabel: 'สำรวจกฎหมายที่อยู่ในกระบวนการพิจารณา',
			learnMoreUrl: '#',
			class: 'bg-yellow-10'
		},
		{
			billStatus: enumBillStatus.ENACTED,
			billAmount: 'xxxx',
			descriptionTitle: 'บังคับใช้เมื่อ',
			descriptionList: ['พระมหากษัตริย์ลงพระปรมาภิไธย', 'ประกาศบนราชกิจจานุเบกษา'],
			learnMoreLabel: 'สำรวจกฎหมายที่บังคับใช้',
			learnMoreUrl: '#',
			class: 'bg-teal-10'
		},
		{
			billStatus: enumBillStatus.REJECTED,
			billAmount: 'xxxx',
			descriptionTitle: 'ตัวอย่างสาเหตุที่ทำให้กฎหมายตกไป',
			descriptionList: [
				'นายกรัฐมนตรีไม่รับรอง',
				'สส.มีมติไม่รับหลักการ',
				'สส.มีมติไม่เห็นชอบ',
				'สว.ยับยั้ง และ สส.มีมติไม่เห็นชอบ',
				'ศาลรัฐธรรมนูญวินิจฉัยว่าขัดต่อรัฐธรรมนูญ'
			],
			learnMoreLabel: 'สำรวจกฎหมายที่ตกไป',
			learnMoreUrl: '#',
			class: 'bg-red-10'
		},
		{
			billStatus: enumBillStatus.MERGED,
			billAmount: 'xxxx',
			descriptionTitle:
				'ร่างกฎหมายฉบับหนึ่งสามารถถูกผนวกกับร่างอื่นในรัฐสภา เพื่อพิจารณาออกเป็นกฎหมายบทเดียวกันได้ เมื่อร่างกฎหมายมีวัตถุประสงค์เดียวกัน ซึ่งจะถูกผนวกกับร่างอื่นในชั้นการพิจารณาโดยสภาผู้แทนฯ หรือในสภาร่วม โดยขึ้นอยู่กับว่าเป็นการพิจารณากฎหมายประเภทใด',
			descriptionList: [],
			learnMoreLabel: 'สำรวจกฎหมายที่ถูกรวมร่าง',
			learnMoreUrl: '#',
			class: 'bg-purple-10'
		}
	];

	const proposerComparisonTableData = [
		{
			'': 'ครม.',
			'ร่าง พ.ร.บ.': 'มีสิทธิเสนอร่าง',
			'ออก พ.ร.ก.': 'มีสิทธิเสนอร่าง',
			'ร่าง พ.ร.ป.': 'มีสิทธิเสนอร่าง',
			'ร่างแก้ไขบทบัญญัติใน รธน.': 'มีสิทธิเสนอร่าง'
		},
		{
			'': 'สส.',
			'ร่าง พ.ร.บ.': '20 คน',
			'ออก พ.ร.ก.': '-',
			'ร่าง พ.ร.ป.': 'สส.ไม่น้อยกว่า 1 ใน 10',
			'ร่างแก้ไขบทบัญญัติใน รธน.': 'สส.ไม่น้อยกว่า 1 ใน 5'
		},
		{
			'': 'สมาชิกรัฐสภา',
			'ร่าง พ.ร.บ.': '-',
			'ออก พ.ร.ก.': '-',
			'ร่าง พ.ร.ป.': '-',
			'ร่างแก้ไขบทบัญญัติใน รธน.': 'สส.และ สว.ไม่น้อยกว่า 1 ใน 5'
		},
		{
			'': 'ประชาชนผู้มีสิทธิเลือกตั้ง',
			'ร่าง พ.ร.บ.': '10,000 คน',
			'ออก พ.ร.ก.': '-',
			'ร่าง พ.ร.ป.': '-',
			'ร่างแก้ไขบทบัญญัติใน รธน.': '50,000 คน'
		}
	];

	let bodyContainer: HTMLElement;
	let currentNavElementId: string;
	onMount(() => {
		if (window.matchMedia('(min-width: 672px)').matches) {
			const scroller = scrollama();

			scroller
				.setup({
					step: bodyContainer.querySelectorAll('h2,h1'),
					// @ts-expect-error Documentation บอกว่าใช้ string ที่มี px ได้ https://github.com/russellsamora/scrollama#:~:text=number%20(0%20%2D%201%2C%20or%20string%20with%20%22px%22)
					offset: '33px'
				})
				.onStepEnter((response) => {
					currentNavElementId = response.element.id;
				});

			return scroller.destroy;
		}
	});
</script>

<div class="flex w-full flex-col">
	<header class="bg-teal-20">
		<div class="mx-auto w-full max-w-[800px] px-10 py-10 md:py-20">
			<h1 class="fluid-heading-05">ร่างกฎหมายกลายเป็นกฎหมายได้อย่างไร</h1>
			<p>
				<span class="font-bold text-text-primary">อัปเดตล่าสุด :</span>
				<span class="text-helper-text-01">{formatThaiDate(new Date(), { shortMonth: true })}</span>
			</p>
		</div>
	</header>
	<main class="flex flex-col items-center justify-center md:flex-row md:items-start">
		<div
			class="legislative-process-sidebar w-full gap-10 bg-ui-01 px-4 py-8 md:sticky md:top-0 md:w-auto md:bg-white md:px-10 md:py-0"
		>
			<div class="flex w-full items-center justify-center bg-white py-10">
				<Sidebar {currentNavElementId} {sections} />
			</div>
		</div>
		<div
			class="flex w-full max-w-[800px] flex-1 flex-col gap-10 bg-ui-01 px-4 py-8 md:bg-white md:px-10"
			bind:this={bodyContainer}
		>
			<section>
				<h1 class="fluid-heading-05" id="แนะนำภาพรวม">แนะนำภาพรวม</h1>
				<div>
					<h2 class="fluid-heading-04" id="การออกกฎหมายตามรัฐธรรมนูญ-2560">
						การออกกฎหมายตามรัฐธรรมนูญ 2560
					</h2>
					<hr />
					<p class="body-02 mt-6">
						<strong
							>‘รัฐสภา’ คือผู้รับผิดชอบหลักในการออกกฎหมาย
							เพราะเป็นตัวแทนของประชาชนในการทำหน้าที่และใช้อำนาจนิติบัญญัติ</strong
						>
						การออกกฎหมายต้องดำเนินตามกระบวนการที่ระบุไว้ในรัฐธรรมนูญ 2560 ซึ่งกฎหมายมีหลายประเภท กฎหมายประเภทหนึ่งอาจมีกระบวนการ
						ลำดับขั้น หรือเงื่อนไขในการพิจารณาที่แตกต่างไปจากกฎหมายอีกประเภทหนึ่ง ด้วยเหตุเพราะกฎหมายแต่ละประเภทมีลำดับชั้นที่แตกต่างกัน
					</p>
					<br />
					<p class="body-02">
						<strong>การกำหนดลำดับชั้นระหว่างกฎหมายประเภทต่างๆ</strong> มีขึ้นเพื่อให้กฎหมายแม่บท อย่าง
						‘รัฐธรรมนูญ’ เป็นตัวกำกับกฎหมายที่อยู่ในลำดับชั้นรองลงมา เช่น พระราชบัญญัติ ซึ่งต้องห้ามขัดหรือแย้งต่อกฎหมายสูงสุดอย่างรัฐธรรมนูญ
						การพิจารณาบังคับใช้กฎหมายที่อยู่ในลำดับชั้นที่รองลงมาจึงมีกระบวนการบังคับใช้ที่ซับซ้อนน้อยกว่าการแก้ไขหรือการออกกฎหมายตัวแม่บทอย่างการแก้ไขบทบัญญัติในรัฐธรรมนูญ
					</p>
					<br />
					<p class="body-02">
						แม้กฎหมายจะมีหลายชื่อเรียก และมีลำดับชั้นที่หลากหลาย
						แต่กฎหมายแม่บททั้งหมดล้วนเกิดขึ้นจากกระบวนการการออกกฎหมายโดย ‘รัฐสภา’ เป็นสำคัญ
					</p>
				</div>
				<div>
					<h2 class="fluid-heading-04" id="กฎหมายบังคับใช้ได้อย่างไร">กฎหมายบังคับใช้ได้อย่างไร</h2>
					<hr />
					<h3 class="fluid-heading-03 my-6" id="การออกกฎหมายตามรัฐธรรมนูญ-2560">
						กฎหมายที่ออกโดยรัฐสภา ต้องผ่านกระบวนการ 3 ขั้นตอนสำคัญ
					</h3>
					<div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_16px_1fr_16px_1fr]">
						<ProcessCard imgSrc="images/legislative-process/process-01.png" title="เสนอร่างกฎหมาย">
							ผู้มีสิทธิเสนอร่างของกฎหมายแต่ละประเภท จะแตกต่างกัน
						</ProcessCard>
						<ProcessCardArrow />
						<ProcessCard
							imgSrc="images/legislative-process/process-02.png"
							title="พิจารณาโดยรัฐสภา"
						>
							<ul class="list-inside list-disc">
								<li>สส.</li>
								<li>สว.</li>
								<li>สภาร่วม (สส.+ สว.)</li>
							</ul>
						</ProcessCard>
						<ProcessCardArrow />
						<ProcessCard
							imgSrc="images/legislative-process/process-03.png"
							title="กลายเป็นกฎหมายโดยสมบูรณ์"
						>
							<ul class="list-inside list-disc">
								<li>ไม่ขัดต่อรัฐธรรมนูญ</li>
								<li>พระมหากษัตริย์ทรงลงพระปรมาภิไธย</li>
							</ul>
						</ProcessCard>
					</div>
					<ol class="body-02 mt-6 list-inside list-decimal">
						<li>
							<strong>การเสนอร่างกฎหมาย</strong> เป็นการจัดทำร่างกฎหมายและเสนอเข้าสู่รัฐสภา โดยผู้ที่มีสิทธิเสนอร่างกฎหมายจะแตกต่างกันขึ้นอยู่กับว่าเป็นร่างกฎหมายประเภทใดตามที่รัฐธรรมนูญระบุไว้
							เช่น ร่าง พ.ร.บ.สามารถเสนอโดยคณะรัฐมนตรี หรือ สส.จำนวนไม่น้อยกว่า 20 คน หรือประชาชนจำนวน
							10,000 คน
						</li>
						<li>
							<strong>การพิจารณาร่างกฎหมายโดยรัฐสภา</strong> ร่างกฎหมายจะถูกพิจารณาโดยสมาชิกสภาผู้เแทนราษฎร
							(สส.) และสมาชิกวุฒิสภา (สว.) ตามลำดับ การพิจารณาของแต่ละสภาจะมี 3 วาระเท่ากัน แต่มีเงื่อนไขและรายละเอียดในการพิจารณาที่แตกต่างกัน
							ทั้งนี้ ในการพิจารณาร่างกฎหมายบางประเภท จะใช้การประชุมร่วมกันของทั้งสองสภาในการพิจารณา เช่น
							การพิจารณา ร่าง พ.ร.ป.
						</li>
						<li>
							<strong>ร่างกฎหมายกลายเป็นกฎหมายโดยสมบูรณ์์</strong> เมื่อร่างกฎหมายไม่ขัดต่อรัฐธรรมนูญ
							และพระมหากษัตริย์ทรงลงพระปรมาภิไธย ตามด้วยการประกาศในราชกิจจานุเบกษาให้มีผลบังคับใช้เป็นกฎหมาย
						</li>
					</ol>
				</div>
				<div>
					<h2 class="fluid-heading-04" id="กฎหมายในเว็บไซต์นี้">กฎหมายในเว็บไซต์นี้</h2>
					<hr />
					<p class="body-02 mb-4 mt-6">
						เว็บไซต์ Parliament Watch มุ่งนำเสนอกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา
						เพื่อแสดงให้เห็นถึงกระบวนการทำงานด้านนิติบัญญัติในฐานะตัวแทนประชาชน
						รวมถึงสะท้อนให้เห็นถึงความคิดเห็นของสมาชิกรัฐสภาต่อประเด็นต่างๆ ในทางกฎหมาย
						ซึ่งเป็นเครื่องมือในการกำหนดทิศทางของสังคม ทั้งนี้
						เว็บไซต์นี้จะไม่ปรากฏกฎหมายที่ถูกตราขึ้นผ่านคณะรัฐมนตรีและไม่ต้องผ่านการพิจารณาโดยรัฐสภา
						เช่น พระราชกฤษฎีกา กฎกระทรวง และกฎหมายที่ตราโดยองค์กรปกครองส่วนท้องถิ่น
					</p>
					<img
						src="images/legislative-process/legislative-process-overview.png"
						alt="Overview of legislative process"
					/>
				</div>
				<div class="flex flex-col gap-4">
					<div>
						<div class="mb-6">
							<h2 class="fluid-heading-04" id="ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา">
								ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา
							</h2>
							<hr />
						</div>
						<p>
							รัฐสภาประกอบไปด้วยสภาผู้แทนราษฎรและวุฒิสภา
							ทำหน้าที่พิจารณาและกลั่นกรองร่างกฎหมายก่อนการประกาศใช้ ประกอบด้วย
						</p>
					</div>
					<div class="flex flex-col gap-4">
						{#each data.legislations as legislation, i (i)}
							<Collapsible {legislation} />
						{/each}
					</div>
				</div>
				<div>
					<h2 class="fluid-heading-04" id="สถานะของกฎหมาย">สถานะของกฎหมาย</h2>
					<hr />
					<p class="mt-6">
						การจัดแบ่งสถานะของร่างกฎหมายบนเว็บไซต์ Parliament Watch เป็นการจัดแบ่งที่ทีม WeVis
						กำหนดขึ้นมาเพื่อให้ง่ายต่อการทำความเข้าใจของผู้ใช้ทั่วไป
						การจัดสถานะของร่างกฎหมายแต่ละฉบับที่ปรากฏบนเว็บไซต์นี้
						ไม่ได้เป็นสถานะของร่างกฎหมายอย่างเป็นทางการ
					</p>

					<h3 class="fluid-heading-03 my-4">สถานะของกฎหมายในเว็บไซต์นี้ แบ่งได้เป็น 3 ประเภท</h3>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{#each billStatuses as billStatus (billStatus.billStatus)}
							<BillStatusCard {...billStatus} />
						{/each}
					</div>
				</div>
			</section>
			<section>
				<h1 class="fluid-heading-05" id="ขั้นตอนการออกกฎหมายโดยรัฐสภา">
					ขั้นตอนการออกกฎหมายโดยรัฐสภา
				</h1>
				<div>
					<h2 class="fluid-heading-04" id="ขั้นตอนทั่วไป">ขั้นตอนทั่วไป</h2>
					<hr class="mb-6" />
					<p>
						ขั้นตอนการพิจารณาร่างกฎหมายแต่ละประเภทจะมีความแตกต่างกันในบางรายละเอียด แต่โดยทั่วไปแล้ว
						กระบวนการออกกฎหมายโดยรัฐสภา อย่างเช่นการออก พ.ร.บ.หรือการอนุมัติ พ.ร.ก.จะดำเนินการผ่าน <strong
							>5 ขั้นตอน</strong
						>ดังต่อไปนี้
					</p>
					<div class="flex w-full items-center justify-center pt-4">
						<img
							src="images/legislative-process/general-process.webp"
							alt=""
							class="max-w-[440px]"
						/>
					</div>
					<div class="py-6">
						<h3 class="fluid-heading-03" id="การเสนอร่างกฎหมาย">1. การเสนอร่างกฎหมาย</h3>
						<p class="py-4">ผู้มีสิทธิเสนอร่างกฎหมาย และลำดับชั้นของกฎหมายที่เสนอได้</p>
						<ComparisonTable {proposerComparisonTableData} />
					</div>
					<div>
						<h3 class="fluid-heading-03">2. การพิจารณาโดยสภาผู้แทนราษฏร</h3>
						<p>
							เมื่อร่างกฎหมายถูกเสนอเข้าสู่สภาแล้ว จะเข้าสู่ขั้นตอนต่อไปคือการพิจารณาโดย
							สส.ในขั้นตอนนี้จะแบ่งเป็น 3 วาระ ได้แก่
						</p>
						<h4 class="heading-02">2.1. วาระที่หนึ่ง : ขั้นรับหลักการ</h4>
						<p>
							เป็นการพิจารณาหลักการของร่างกฎหมาย ผู้เสนอฯ ต้องชี้แจงความจำเป็นที่ต้องออกกฎหมายนั้นๆ
							ในกระบวนการพิจารณา สส.ในสภาจะอภิปรายเหตุผล ถามข้อสงสัยและตั้งข้อสังเกต
							แล้วจึงขอมติในที่ประชุมว่าจะรับหลักการหรือไม่
						</p>
						<div class="gray-box">
							<h5 class="heading-01">วิธีการพิจารณา</h5>
							<p class="body-02">
								สส.ในสภาจะอภิปรายเหตุผล ถามข้อสงสัยและตั้งข้อสังเกต <br />
								แล้วจึงขอมติในที่ประชุมว่าจะรับหลักการหรือไม่
							</p>
						</div>
						<div class="gray-box">
							<h5 class="heading-01">ผลลัพธ์</h5>
							<div class="flex w-full flex-row justify-between">
								<div class="w-full">
									<VotingResultTag class="m-0" result={DefaultVotingResult.Passed} />
									<p class="body-02">ร่างกฎหมายจะถูกนำไปพิจารณาวาระที่สอง</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full pl-2">
									<VotingResultTag class="m-0" result={DefaultVotingResult.Failed} />
									<p class="body-02">ร่างกฎหมายนั้นก็จะตกไปและไม่ถูกพิจารณาต่อ</p>
								</div>
							</div>
						</div>
						<h4 class="heading-02">2.2. วาระที่สอง : ขั้นกรรมาธิการ</h4>
						<p class="body-02">
							เป็นการพิจารณาร่างกฎหมายเป็นรายมาตรา อาจเพิ่ม
							ตัดทอนหรือแก้ไขบางมาตราหรือเปลี่ยนถ้อยคำให้สมบูรณ์ขึ้น
							แต่ต้องไม่ขัดแย้งกับหลักการของร่างกฎหมายฉบับนั้น
						</p>
						<div class="gray-box">
							<h5 class="heading-01 mb-2">วิธีการพิจารณา</h5>
							<ul class="body-02 ml-2">
								<li>
									ร่างกฎหมายจะถูกพิจารณาโดย <strong class="heading-02">‘คณะกรรมาธิการสามัญ’</strong>
									ซึ่งมี สส.<br /> เป็นกรรมาธิการในการพิจารณาร่างกฎหมายในด้านที่เกี่ยวข้อง <br />
									หรืออาจตั้งขึ้นใหม่เป็นการเฉพาะเรียกว่า
									<strong class="heading-02">‘คณะกรรมาธิการวิสามัญ’</strong> <br /> ซึ่งบุคคลภายนอกสามารถเข้าร่วมเป็นกรรมาธิการได้
								</li>
								<li>
									ในบางกรณี สภาอาจให้ สส.ทุกคนร่วมพิจารณา เรียกว่า <strong class="heading-02"
										>‘คณะกรรมาธิการเต็มสภา’</strong
									>
								</li>
								<li>
									สส.ที่ไม่เป็นกรรมาธิการสามารถขอแก้ไขเพิ่มเติมร่างกฎหมายได้ โดยเสนอคำขอ
									<strong class="heading-02">‘แปรญัติ’</strong>
									ต่อประธานคณะกรรมาธิการภายใน 7 วัน หลังผ่านวาระแรก <br />
									ซึ่งก็ขึ้นอยู่กับคณะกรรมาธิการว่าจะแก้ไขตามหรือไม่
								</li>
								<li>
									เมื่อคณะกรรมาธิการพิจารณาเสร็จแล้วให้นำร่างกฎหมายเข้าที่ประชุมสภาอีกครั้ง โดย สส.<br
									/>
									ทั้งสภาจะมาอภิปรายร่างกฎหมายตามประเด็นที่มีการแก้ไข <br />
									จากนั้นจะลงมติเห็นชอบโดยใช้เสียงข้างมาก เรียงตามมาตราจนครบ <br />
									จึงให้สภาพิจารณาวาระที่สามต่อไป
								</li>
							</ul>
						</div>
						<h4 class="heading-02">2.3. วาระที่สาม : ขั้นลงมติเห็นชอบ</h4>
						<p class="body-02">
							เป็นการลงมติเห็นชอบร่างกฎหมายทั้งฉบับ ไม่มีการอภิปรายหรือแก้ไขข้อความใดๆ
						</p>
						<div class="gray-box">
							<h5 class="heading-01">ผลลัพธ์</h5>
							<div class="flex w-full flex-row justify-between">
								<div class="w-full">
									<VotingResultTag class="m-0" result={DefaultVotingResult.Passed} />
									<p class="body-02">นำไปสู่การพิจารณาของ สว.</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full pl-2">
									<VotingResultTag class="m-0" result={DefaultVotingResult.Failed} />
									<p class="body-02">ร่างกฎหมายนั้นเป็นอันตกไป</p>
								</div>
							</div>
						</div>
					</div>
					<div>
						<h3 class="fluid-heading-03">3. การพิจารณาร่างกฎหมายโดยวุฒิสภา</h3>
						<p class="body-02">
							เมื่อ สส.มีมติเห็นชอบ ร่างกฎหมายจะถูกส่งต่อไปยัง สว.โดยการพิจารณาจะมี 3
							วาระเช่นเดียวกัน แต่มีเงื่อนไขว่าต้องเสร็จภายในเวลาที่กำหนดไว้
						</p>
						<p class="body-02">
							หากเกินระยะเวลาที่กำหนดจะถือว่าเห็นชอบร่างกฎหมายฉบับนั้น ซึ่งเงื่อนไขถูกระบุไว้ว่า
						</p>
						<ul class="body-02 ml-2">
							<li>ร่างกฎหมายทั่วไปต้องพิจารณาให้เสร็จภายใน 60 วัน</li>
							<li>ร่างกฎหมายที่เกี่ยวกับการเงินต้องพิจารณาให้เสร็จภายใน 30 วัน</li>
							<li>ทั้งนี้ สว.สามารถลงมติขยายเวลาออกไปเป็นกรณีพิเศษได้ไม่เกิน 30 วัน</li>
						</ul>
						<div class="gray-box">
							<h5 class="heading-01 mb-2">ผลลัพธ์</h5>
							<p class="body-02">
								สว.<strong class="heading-02">ไม่มีอำนาจ ‘ปัดตก’</strong> หรือทำให้ร่างกฎหมายที่
								สส.มีมติเห็นชอบแล้วหายไปได้ แต่ สว.<strong class="heading-02"
									>สามารถเพิ่มขั้นตอน</strong
								>ในการพิจารณาร่างกฎหมายได้ เมื่อ สว.พิจารณาร่างกฎหมายแล้วสามารถลงมติได้ 3 กรณี
							</p>

							<div class="body-01 mt-2 flex w-full flex-col md:flex-row">
								<div class="w-full md:w-4/12">
									<VotingResultTag class="m-0" result={DefaultVotingResult.Passed} />
									<p class="body-01">เตรียมนำร่างกฎหมายฯ <br /> เข้าสู่ขั้นตอนประกาศใช้</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full pt-2 md:w-4/12 md:px-2 md:pt-0">
									<h5 class="heading-01">แก้ไขเพิ่มเติม</h5>
									<p class="label-01 mb-2 mt-2 text-gray-60">
										โดยลงมติ
										<VotingResultTag class="m-0" result={DefaultVotingResult.Passed} /> <br />
										ให้กับมติที่นำไปสู่การแก้ไขเพิ่มเติม
									</p>
									<ul>
										<li>
											ให้ส่งร่างที่แก้ไขเพิ่มเติมให้ สส.เห็นชอบ หรือตั้ง <br />
											<strong class="heading-compact-01">‘คณะกรรมาธิการร่วม’</strong> <br />
											ของสองสภาขึ้นมาพิจารณา โดยต้องมีจำนวน สส.และ สว.เท่ากัน
										</li>
										<li>เมื่อกรรมาธิการร่วมพิจารณาร่างกฎหมายเสร็จแล้วให้เสนอต่อทั้งสองสภา</li>
										<li>ให้ดำเนินขั้นตอนประกาศใช้เป็นกฎหมาย</li>
										<li>
											แต่ถ้าสภาใดสภาหนึ่งไม่เห็นชอบ ให้ยับยั้งร่างกฎหมายนั้นไว้ก่อน ซึ่ง
											สส.อาจยกขึ้นมาพิจารณาใหม่ได้หลัง 180 วัน โดยอาจยืนยันร่างฯ เดิม หรือร่างฯ
											ที่คณะกรรมาธิการร่วมกันพิจารณาก็ได้
										</li>
									</ul>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full pt-2 md:w-4/12 md:px-2 md:pt-0">
									<VotingResultTag class="m-0" result={DefaultVotingResult.Failed} />
									<ul>
										<li>ให้ ‘ยับยั้ง’ ไว้</li>
										<li>
											เมื่อพ้นระยะเวลา 180 วัน สส.สามารถยกร่างกฎหมายฉบับนั้นกลับมาพิจารณาใหม่ได้
										</li>
										<li>
											หาก สส.ยืนยันร่างฯ <br />
											ฉบับเดิมด้วยคะแนนเสียงมากกว่ากึ่งหนึ่งของสภาผู้แทนฯ ให้ถือว่าร่างฯ ฉบับนั้นได้รับความเห็นชอบ
											และเตรียมประกาศใช้เป็นกฎหมาย
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div>
						<h3 class="fluid-heading-03">4. ศาลรัฐธรรมนูญวินิจฉัยร่างกฎหมาย</h3>
						<p class="body-02">
							โดยทั่วไป เมื่อร่างกฎหมายได้รับความเห็นชอบจากรัฐสภาแล้ว ก็จะเข้าสู่ขั้นตอนการประกาศใช้
							แต่ถ้าหากนายกรัฐมนตรี หรือ สมาชิกไม่น้อยกว่า 1 ใน 10 ของแต่ละสภาหรือทั้งสองสภารวมกัน
							เห็นว่าร่างกฎหมายขัดหรือแย้งต่อรัฐธรรมนูญ ให้ส่งศาลรัฐธรรมนูญเพื่อวินิฉัย
						</p>
						<div class="gray-box">
							<h5 class="heading-01 mb-2">ผลลัพธ์</h5>
							<div class="body-01 flex w-full flex-col md:flex-row">
								<div class="w-full md:w-4/12">
									<VotingResultTag class="m-0" result={DefaultVotingResult.Passed} />
									<p class="body-01">ถ้าไม่มีข้อความที่ขัดต่อรัฐธรรมนูญ</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full pt-2 md:w-4/12 md:pt-0">
									<h5 class="heading-01 mb-2">แก้ไขเพิ่มเติม</h5>
									<p class="body-01">ถ้ามีข้อความที่ขัดต่อรัฐธรรมนูญ</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full pt-2 md:w-4/12 md:pt-0">
									<VotingResultTag class="m-0" result={DefaultVotingResult.Failed} />
									<p class="body-01">ถ้ามีข้อความที่ขัดต่อรัฐธรรมนูญและเป็นสาระสำคัญของร่าง</p>
								</div>
							</div>
						</div>
					</div>
					<div>
						<h3 class="fluid-heading-03">5. การประกาศใช้เป็นกฎหมาย</h3>
						<p class="body-02">
							เมื่อร่างกฎหมายได้รับความเห็นชอบจากรัฐสภาแล้ว ให้นายกรัฐมนตรีรอไว้ 5 วัน
							แล้วให้ขึ้นทูลเกล้าฯ เพื่อให้พระมหากษัตริย์ทรงลงพระปรมาภิไธยภายใน 20 วัน
							จากนั้นให้ประกาศในราชกิจจานุเบกษาให้มีผลบังคับใช้เป็นกฎหมายได้
						</p>
					</div>
				</div>
				<div class="mb-6">
					<h2 class="fluid-heading-04" id="ขั้นตอนพิเศษของกฎหมายบางประเภท">
						ขั้นตอนพิเศษของกฎหมายบางประเภท
					</h2>
					<hr />
					<p class="my-6">
						ในกระบวนการออกกฎหมายหรือแก้กฎหมายบางประเภทจะใช้ <strong
							>‘การประชุมร่วมกันของรัฐสภา’ หรือ สส.และ สว.ประชุมพิจารณาร่วมกัน</strong
						>
						และ <strong>มีเงื่อนไขเพิ่มเติม</strong> ได้แก่
					</p>
					<div class="body-02 mt-10">
						<h3 class="fluid-heading-03 mb-6">การพิจารณาร่าง พ.ร.ป.</h3>
						<p>
							ขั้นตอนในการพิจารณาร่าง พ.ร.ป.จะดำเนินในรูปแบบเดียวกันกับการออก พ.ร.บ.เว้นแต่ใน<strong
								>เงื่อนไขเพิ่มเติม</strong
							>ต่อไปนี้
						</p>
						<img
							class="mx-auto my-4 w-full max-w-[440px]"
							src="images/legislative-process/organic-law-bill-consideration.webp"
							alt=""
						/>
						<ol class="ml-6 list-outside list-decimal">
							<li class="mb-2">
								การพิจารณาโดยสภาร่วม (สส. + สว.) ต้องพิจารณา 3 วาระให้เสร็จภายใน 180 วัน
							</li>
							<li class="mb-2">
								ในวาระที่ 3
								ต้องมีคะแนนเสียงเห็นชอบด้วยมากกว่ากึ่งหนึ่งของจํานวนสมาชิกทั้งหมดเท่าที่มีอยู่ของรัฐสภา
							</li>
							<li class="mb-2">
								เมื่อรัฐสภา ‘เห็นชอบ’ ให้ส่งร่าง พ.ร.ป.ไปยังศาลฎีกา ศาลรัฐธรรมนูญ
								หรือองค์กรอิสระที่เกี่ยวข้องภายใน 15 วัน เพื่อให้ความเห็น
								<ul class="ml-8 list-outside list-disc">
									<li>หากไม่มีข้อทักท้วงภายใน 10 วัน ให้รัฐสภาดําเนินการต่อไป</li>
									<li>
										มีข้อความขัดต่อรัฐธรรมนูญ ให้เสนอความเห็นไปยังรัฐสภา
										และให้รัฐสภาประชุมร่วมกันเพื่อพิจารณาให้แล้วเสร็จภายใน 30 วัน
										โดยสามารถแก้ไขตามที่เห็นสมควร
										จากนั้นให้รัฐสภาดําเนินการต่อไปในวิธีการเดียวกันกับการตรา พ.ร.บ.
									</li>
								</ul>
							</li>
						</ol>
					</div>
					<div class="body-02 mt-10">
						<h3 class="fluid-heading-03 mb-6">การแก้ไขบทบัญญัติในรัฐธรรมนูญ</h3>
						<p>
							เมื่อเข้าสู่ขั้นตอนการพิจารณาของรัฐสภา การประชุมร่วมกันจะมีทั้งหมด 3 วาระ
							เช่นเดียวกันกับการออก พ.ร.บ.แต่ปรากฏ<strong>เงื่อนไขเพิ่มเติม</strong>ดังนี้
						</p>
						<img
							class="mx-auto my-4 w-full max-w-[440px]"
							src="images/legislative-process/amendment-of-constitutional-provisions.webp"
							alt=""
						/>
						<ol class="ml-6 list-outside list-decimal gap-2">
							<li class="mb-2">
								ในวาระที่หนึ่ง ต้องใช้เสียงไม่น้อยกว่าครึ่งหนึ่งของสมาชิกเท่าที่มีอยู่ของสองสภาแล้ว
								ในจำนวนนี้ต้องได้เสียง<strong>เห็นชอบจาก สว.ไม่น้อยกว่า 1 ใน 3</strong> ของจำนวน สว.ที่มีอยู่
							</li>
							<li class="mb-2">
								ในวาระที่สอง การลงมติให้ถือเสียงข้างมากเป็นประมาณ
								<strong
									>หากเป็นการแก้ไขที่ประชาชนเป็นผู้เสนอ
									ต้องเปิดโอกาสให้ผู้แทนประชาชนเสนอความคิดเห็นด้วย</strong
								> จากนั้นรอ 15 วัน จึงเข้าวาระที่สาม
							</li>
							<li class="mb-2">
								ในวาระที่สาม การลงมติ ‘เห็นชอบ’ ต้องประกอบด้วย
								<ul class="ml-8 list-outside list-disc">
									<li>
										เสียงเห็นชอบมากกว่า<strong>ครึ่งหนึ่งของสมาชิก</strong>เท่าที่มีอยู่ของสองสภา
									</li>
									<li>เสียงเห็นชอบจาก สว.ไม่น้อยกว่า <strong>1 ใน 3 ของจำนวน สว.</strong></li>
									<li>
										เสียงเห็นชอบ สส.จากพรรคที่ไม่มีสมาชิกเป็นรัฐมนตรี ประธานสภาหรือรองประธานผู้แทนฯ
										หรือ <strong>‘สส.ฝ่ายค้าน’ ไม่น้อยกว่าร้อยละ 20</strong>
										ของทุกพรรคการเมืองดังกล่าวรวมกัน
									</li>
								</ul>
								เมื่อมีมติเห็นชอบให้รอไว้ 15 วันและนำขึ้นทูลเกล้าฯ ถวาย
							</li>
							<li class="mb-2">
								ในกรณีที่มีการแก้ไขเกี่ยวกับ บททั่วไป พระมหากษัตริย์ การแก้ไขเพิ่มเติมรัฐธรรมนูญ
								คุณสมบัติหรือลักษณะต้องห้ามของผู้ดำรงตำแหน่งต่างๆ
								หรืออำนาจหน้าที่ของศาลหรือองค์กรอิสระ ให้<strong>จัดทำประชามติ</strong
								>เพื่อเห็นชอบก่อน จึงจะสามารถประกาศใช้ได้
							</li>
							<li class="mb-2">
								ในระหว่างนี้ สส.หรือ สว.หรือทั้งสองสภารวมกัน <strong
									>จำนวนไม่น้อยกว่า 1 ใน 10</strong
								>
								สามารถใช้สิทธิเข้าชื่อเสนอให้<strong>ศาลรัฐธรรมนูญวินิจฉัย</strong
								>ว่าร่างแก้ไขรัฐธรรมนูญนั้น เป็นเรื่องเกี่ยวกับการเปลี่ยนแปลงการปกครองหรือไม่
								หรือเป็นเรื่องที่ต้องทำประชามติก่อนหรือไม่ โดยศาลรัฐธรรมนูญต้องพิจารณาให้เสร็จภายใน
								30 วันนับจากวันที่ได้รับเรื่อง โดยในระหว่างนี้ นายกฯ จะนำร่างฯ ขึ้นทูลเกล้าฯ ไม่ได้
							</li>
						</ol>
					</div>
					<div class="body-02 mt-10">
						<h3 class="fluid-heading-03 mb-6">การพิจารณาร่าง พ.ร.บ.งบประมาณประจำปี</h3>
						<p>
							ขั้นตอนในการพิจารณาร่าง พ.ร.บ.งบประมาณประจำปี จะแตกต่างจากการออก
							พ.ร.บ.ทั่วไปในขั้นตอนการพิจารณาของ สว.โดยมีรายละเอียดดังนี้
						</p>
						<img
							class="mx-auto my-4 w-full max-w-[440px]"
							src="images/legislative-process/yearly.webp"
							alt=""
						/>
						<ol class="ml-6 list-outside list-decimal gap-2">
							<li class="mb-2">
								เมื่อ สส.มีมติรับหลักการแห่งร่าง พ.ร.บ.งบประมาณฯ ให้
								สว.ตั้งคณะกรรมาธิการวิสามัญขึ้นคณะหนึ่งเพื่อพิจารณาศึกษาร่าง พ.ร.บ.งบประมาณฯ
								ควบคู่กับการพิจารณาของ
								สส.และรายงานผลการพิจารณาพร้อมข้อสังเกตและข้อเสนอแนะต่อประธานวุฒิสภา
							</li>
							<li class="mb-2">
								สว.ต้องพิจารณาให้ความเห็นชอบหรือไม่ให้ความเห็นชอบร่าง พ.ร.บ.งบประมาณภายใน 20 วัน
								นับตั้งแต่วันที่ร่าง พ.ร.บ.มาถึงวุฒิสภา โดยจะแก้ไขเพิ่มเติมใดๆ มิได้
							</li>
						</ol>
					</div>
				</div>
			</section>
			<section>
				<h1 class="fluid-heading-05" id="เข้าใจการลงมติของ-สส.และ-สว.">
					เข้าใจการลงมติของ สส.และ สว.
				</h1>
				<div>
					<h2 class="fluid-heading-04" id="การลงมติคืออะไร-เกิดขึ้นในขั้นตอนไหนบ้าง?">
						การลงมติคืออะไร เกิดขึ้นในขั้นตอนไหนบ้าง?
					</h2>
					<hr />
					<p class="mt-6">
						การลงมติ เป็นส่วนหนึ่งของการประชุมสภา ใช้ในกระบวนการพิจารณาเรื่องต่างๆ
						ทั้งในสภาผู้แทนราษฎรและวุฒิสภา เช่น การพิจารณาญัตติ, การเสนอและพิจารณาร่างกฎหมาย,
						การพิจารณาให้ความเห็นชอบนายกรัฐมนตรี, การพิจารณาในขั้นกรรมาธิการ เป็นต้น
						โดยมติของสภาจะกระทำโดยการออกเสียงลงคะแนน ตามวิธีการที่กำหนดไว้ในข้อบังคับการประชุม
						สมาชิกรัฐสภาหนึ่งคนมีสิทธิออกเสียงได้หนึ่งเสียง และมติของสภาให้เป็นไปตามเสียงข้างมาก
						เพื่อให้ได้ข้อยุติของปัญหาและเพื่อให้ได้แนวทางที่สภาจะต้องดำเนินการต่อไป
					</p>
				</div>
				<div class="grid gap-4">
					<div>
						<h2 class="fluid-heading-04" id="วิธีการลงมติ">วิธีการลงมติ</h2>
						<hr />
						<div class="mt-6">
							<p>การลงมติในสภากระทำผ่านการออกเสียงลงคะแนน ซึ่งแบ่งเป็น 2 กรณี</p>
						</div>
					</div>
					<div class="grid gap-4">
						<p><strong>1. การออกเสียงลงคะแนนเปิดเผย</strong></p>
						<div class="flex justify-center gap-3">
							<VotingProcessImageCircle
								src="/images/legislative-process/method-verbal.png"
								title="การลงคะแนนเสียงด้วยวาจา"
								description="ผ่านการเรียกชื่อสมาชิกตามหมายเลขประจำตัว เช่น การโหวตเลือกนายกรัฐมนตรี"
							/>
							<VotingProcessImageCircle
								src="/images/legislative-process/method-machine.png"
								title="การใช้เครื่องลงคะแนนเสียง"
								description="เพื่อลงมติเห็นด้วยหรือไม่ต่อประเด็นต่างๆ"
							/>
						</div>
						<p><strong>2. การออกเสียงลงคะแนนลับ</strong></p>
						<div class="flex justify-center gap-3">
							<VotingProcessImageCircle
								src="/images/legislative-process/method-paper.png"
								title="การทำเครื่องหมายบนแผ่นกระดาษ"
								description="ใส่ซองที่เจ้าหน้าที่จัดให้"
							/>
							<VotingProcessImageCircle
								src="/images/legislative-process/method-machine.png"
								title="การใช้เครื่องลงคะแนนเสียง"
								description="ตามที่ประชุมกำหนด"
							/>
						</div>
					</div>
					<div class="grid gap-2">
						<p><strong>เกณฑ์ในการเลือกวิธีการลงมติ</strong> ตามข้อบังคับการประชุมสภา</p>
						<div class="gap-4 lg:flex">
							<div class="mb-4 h-fit flex-1 bg-ui-01 p-4 lg:mb-0">
								<div class="mb-3">
									<p><strong>ที่ประชุมสภาผู้แทนฯ หรือที่ประชุมวุฒิสภา</strong></p>
								</div>
								<div>
									<ul class="list-disc pl-6">
										<li>การออกเสียงลงคะแนนให้กระทำเป็นการเปิดเผย</li>
										<li>
											ถ้ามีสมาชิกเสนอญัตติโดยมีผู้รับรองไม่น้อยกว่า 20 คนของสภานั้นๆ
											ขอให้กระทำเป็นการลับ จึงให้ลงคะแนนลับ
										</li>
										<li>
											แต่ถ้ามีผู้คัดค้านและมีผู้รับรองไม่น้อยกว่า 1 ใน 3 ของสมาชิกในที่ประชุม
											ให้ถือเป็นเอกสิทธิ์ที่จะลงคะแนนโดยเปิดเผย
										</li>
									</ul>
								</div>
							</div>
							<div class="h-fit flex-1 bg-ui-01 p-4">
								<div class="mb-3">
									<p><strong>ประชุมสภาร่วม</strong></p>
								</div>
								<div>
									<ul class="list-disc pl-6">
										<li>การออกเสียงลงคะแนนให้กระทำเป็นการเปิดเผย</li>
										<li>
											ถ้าคณะรัฐมนตรีร้องขอ หรือสมาชิกรัฐสภาเสนอญัตติโดยมีสมาชิกรับรองไม่น้อยกว่า 40
											คนขอให้กระทำเป็นการลับ จึงให้ลงคะแนนลับ
										</li>
										<li>
											แต่ถ้ามีสมาชิกคัดค้านและมีผู้รับรองไม่น้อยกว่า 1 ใน 3
											ของสมาชิกรัฐสภาในที่ประชุมให้ถือเป็นเอกสิทธิ์ที่จะลงคะแนนโดยเปิดเผย
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="my-6">
					<h2 class="fluid-heading-04" id="ประเภทการลงมติ">ประเภทการลงมติ</h2>
					<hr />
					<div class="mt-6 flex flex-col gap-4">
						<p>โดยทั่วไป การประชุมจะกำหนดให้ สส.และ สว.แสดงเจตจำนงต่อประเด็นที่ใช้ลงมติดังนี้</p>
						<div class="flex gap-4">
							<VotingOptionTag voteOption={DefaultVoteOption.Agreed} />
							<VotingOptionTag voteOption={DefaultVoteOption.Disagreed} />
							<VotingOptionTag voteOption={DefaultVoteOption.Novote} />
						</div>
						<p>
							หาก สส.หรือ สว.ไม่ได้แสดงเจตจำนงด้วยเหตุผลด้านการขาดการประชุมหรือไม่ได้ลงคะแนนเสียง
							ลักษณะของการออกคะแนนเสียงจะเป็นใน 2 รูปแบบคือ
						</p>
						<div class="flex gap-2">
							<div class="flex basis-2/5 flex-col gap-2">
								<VotingOptionTag class={'w-fit'} voteOption={DefaultVoteOption.Abstain} />
								<ul>
									<li class="list-inside list-disc">สมาชิกอยู่ในองค์ประชุม แต่ไม่ลงมติ</li>
									<li class="list-inside list-disc">
										จะถูกนับเป็นองค์ประชุม และถูกคำนวณในคะแนนเสียงของมติ
									</li>
								</ul>
							</div>
							<div class="flex basis-3/5 flex-col gap-2">
								<VotingOptionTag class={'w-fit'} voteOption={DefaultVoteOption.Absent} />
								<ul>
									<li class="list-inside list-disc">สมาชิกไม่ได้เข้าประชุม</li>
									<li class="list-inside list-disc">จะไม่ถูกนับเป็นองค์ประชุม</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="my-6">
					<h2 class="fluid-heading-04" id="ผลการลงมติ">ผลการลงมติ</h2>
					<hr />
					<div class="mt-6 flex flex-col gap-4">
						<p>
							<strong>การลงมติที่เกี่ยวข้องกับนิติบัญญัติและญัตติต่างๆ ในสภา</strong> เช่น การโหวตรับร่างกฎหมายเข้าสภา
							การโหวตอนุมัติ พ.ร.ก.การพิจารณาญัตติ เป็นต้น จะใช้เสียงข้างมากของที่ประชุมของแต่ละสภา หรือตามข้อกำหนดที่ระบุไว้ในรัฐธรรมนูญหรือข้อบังคับการประชุม
							ซึ่งโดยทั่วไปจะมีผลการลงมติ ดังนี้
						</p>
						<div class="flex gap-4">
							<VotingResultTag result={DefaultVotingResult.Passed} isLarge />
							<VotingResultTag result={DefaultVotingResult.Failed} isLarge />
						</div>
						<p>
							<strong>การลงมติในรูปแบบอื่นๆ ที่ต้องให้ความเห็นชอบบุคคล</strong> หากมีผู้ถูกเสนอชื่อมากกว่า
							2 คนขึ้นไป เช่น มติการเลือกนายกรัฐมนตรี มติเลือกประธาน / รองประธานสภาฯ จะมีผลการลงมติเป็นการรับรองผู้ที่ได้รับการโหวตมากที่สุด
						</p>
						<VotingResultTag result={'บุคคลที่ได้รับการโหวตมากที่สุด'} class={'w-fit'} isLarge />
					</div>
				</div>
			</section>
			<section>
				<h1 class="fluid-heading-05" id="สส.และ-สว.ทำอะไรบ้างในสภา">สส.และ สว.ทำอะไรบ้างในสภา</h1>
				<div>
					<h2 class="fluid-heading-04" id="หน้าที่ของสมาชิกสภาผู้แทนราษฏร-(สส.)">
						หน้าที่ของสมาชิกสภาผู้แทนราษฏร (สส.)
					</h2>
					<hr />
					<div class="flex flex-col gap-2 py-4">
						{#each data.dutySection.representatives as section, i (i)}
							<h3 class="fluid-heading-03" id={section.heading}>
								{i + 1}. {section.heading}
							</h3>
							<ul>
								{#each section.details as duty (duty)}
									<li>{duty}</li>
								{/each}
							</ul>
						{/each}
					</div>
				</div>
				<div>
					<h2 class="fluid-heading-04" id="หน้าที่ของสมาชิกวุฒิสภา-(สว.)">
						หน้าที่ของสมาชิกวุฒิสภา (สว.)
					</h2>
					<hr />
					<div class="flex flex-col gap-2 py-4">
						{#each data.dutySection.senates as section, i (i)}
							<h3 class="fluid-heading-03" id={section.heading}>
								{i + 1}. {section.heading}
							</h3>
							<ul>
								{#each section.details as duty (duty)}
									<li>{duty}</li>
								{/each}
							</ul>
						{/each}
					</div>
				</div>
				<div>
					<h2 class="fluid-heading-04" id="หน้าที่ของสภาร่วม-(สส.-+-สว.)">
						หน้าที่ของสภาร่วม (สส. + สว.)
					</h2>
					<hr />
					<p class="pt-4">รัฐสภาจะประชุมร่วมกันได้ต้องเป็นไปตามที่กำหนดไว้ในมาตรา</p>
					<div class="flex flex-col gap-2 py-4">
						{#each data.dutySection.both as section, i (i)}
							<h3 class="fluid-heading-03" id={section.heading}>
								{i + 1}. {section.heading}
							</h3>
							<ul>
								{#each section.details as duty (duty)}
									<li>{duty}</li>
								{/each}
							</ul>
						{/each}
					</div>
					<hr />
				</div>
			</section>
		</div>
		<div class="w-[250px]" />
	</main>
</div>

<style lang="postcss">
	section {
		@apply flex flex-col gap-4 bg-white px-4 py-8 md:px-0 md:py-0;
	}

	h1,
	h2,
	h3,
	h4 {
		@apply mb-3 mt-4 text-text-primary;
	}

	hr {
		@apply box-border w-full border-0 border-t border-solid border-gray-20;
	}

	.vertical-gray-line {
		@apply mx-2 min-h-full border-solid border-gray-20 md:border-[1px];
	}

	.gray-box {
		@apply mb-2 mt-2 h-full w-full bg-gray-10 p-6;
	}

	li::marker {
		@apply text-xs;
	}

	ul {
		@apply ml-4 list-outside list-disc;
	}
</style>
