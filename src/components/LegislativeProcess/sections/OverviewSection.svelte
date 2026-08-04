<script lang="ts">
	import type { Legislation } from '../../../routes/legislative-process/+page.server';
	import BillStatusCard from '../BillStatusCard.svelte';
	import Collapsible from '../Collapsible.svelte';
	import ProcessCard from '../ProcessCard.svelte';
	import ProcessCardArrow from '../ProcessCardArrow.svelte';
	import { billStatuses } from '../data';
	import { DIVIDER_CLASS, HEADING_CLASS, LIST_CLASS, SECTION_CLASS } from '../styles';

	interface Props {
		legislations: Legislation[];
	}

	let { legislations }: Props = $props();
</script>

<section class={SECTION_CLASS}>
	<h1 class="fluid-heading-05 {HEADING_CLASS}" id="แนะนำภาพรวม">แนะนำภาพรวม</h1>
	<div>
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="การออกกฎหมายตามรัฐธรรมนูญ-2560">
			การออกกฎหมายตามรัฐธรรมนูญ 2560
		</h2>
		<hr class={DIVIDER_CLASS} />
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
			<strong>การกำหนดลำดับชั้นระหว่างกฎหมายประเภทต่างๆ</strong> มีขึ้นเพื่อให้กฎหมายแม่บท อย่าง ‘รัฐธรรมนูญ’
			เป็นตัวกำกับกฎหมายที่อยู่ในลำดับชั้นรองลงมา เช่น พระราชบัญญัติ ซึ่งต้องห้ามขัดหรือแย้งต่อกฎหมายสูงสุดอย่างรัฐธรรมนูญ
			การพิจารณาบังคับใช้กฎหมายที่อยู่ในลำดับชั้นที่รองลงมาจึงมีกระบวนการบังคับใช้ที่ซับซ้อนน้อยกว่าการแก้ไขหรือการออกกฎหมายตัวแม่บทอย่างการแก้ไขบทบัญญัติในรัฐธรรมนูญ
		</p>
		<br />
		<p class="body-02">
			แม้กฎหมายจะมีหลายชื่อเรียก และมีลำดับชั้นที่หลากหลาย
			แต่กฎหมายแม่บททั้งหมดล้วนเกิดขึ้นจากกระบวนการการออกกฎหมายโดย ‘รัฐสภา’ เป็นสำคัญ
		</p>
	</div>
	<div>
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="กฎหมายบังคับใช้ได้อย่างไร">
			กฎหมายบังคับใช้ได้อย่างไร
		</h2>
		<hr class={DIVIDER_CLASS} />
		<h3 class="fluid-heading-03 {HEADING_CLASS}" id="กฎหมายที่ออกโดยรัฐสภา-3-ขั้นตอน">
			กฎหมายที่ออกโดยรัฐสภา ต้องผ่านกระบวนการ 3 ขั้นตอนสำคัญ
		</h3>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_16px_1fr_16px_1fr]">
			<ProcessCard imgSrc="images/legislative-process/process-01.png" title="เสนอร่างกฎหมาย">
				ผู้มีสิทธิเสนอร่างของกฎหมายแต่ละประเภท จะแตกต่างกัน
			</ProcessCard>
			<ProcessCardArrow />
			<ProcessCard imgSrc="images/legislative-process/process-02.png" title="พิจารณาโดยรัฐสภา">
				<ul class={LIST_CLASS}>
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
				<ul class={LIST_CLASS}>
					<li>ไม่ขัดต่อรัฐธรรมนูญ</li>
					<li>พระมหากษัตริย์ทรงลงพระปรมาภิไธย</li>
				</ul>
			</ProcessCard>
		</div>
		<ol class="body-02 mt-6 list-inside list-decimal marker:text-xs">
			<li>
				<strong>การเสนอร่างกฎหมาย</strong> เป็นการจัดทำร่างกฎหมายและเสนอเข้าสู่รัฐสภา โดยผู้ที่มีสิทธิเสนอร่างกฎหมายจะแตกต่างกันขึ้นอยู่กับว่าเป็นร่างกฎหมายประเภทใดตามที่รัฐธรรมนูญระบุไว้
				เช่น ร่าง พ.ร.บ.สามารถเสนอโดยคณะรัฐมนตรี หรือ สส.จำนวนไม่น้อยกว่า 20 คน หรือประชาชนจำนวน 10,000
				คน
			</li>
			<li>
				<strong>การพิจารณาร่างกฎหมายโดยรัฐสภา</strong> ร่างกฎหมายจะถูกพิจารณาโดยสมาชิกสภาผู้เแทนราษฎร
				(สส.) และสมาชิกวุฒิสภา (สว.) ตามลำดับ การพิจารณาของแต่ละสภาจะมี 3 วาระเท่ากัน แต่มีเงื่อนไขและรายละเอียดในการพิจารณาที่แตกต่างกัน
				ทั้งนี้ ในการพิจารณาร่างกฎหมายบางประเภท จะใช้การประชุมร่วมกันของทั้งสองสภาในการพิจารณา เช่น การพิจารณา
				ร่าง พ.ร.ป.
			</li>
			<li>
				<strong>ร่างกฎหมายกลายเป็นกฎหมายโดยสมบูรณ์์</strong> เมื่อร่างกฎหมายไม่ขัดต่อรัฐธรรมนูญ และพระมหากษัตริย์ทรงลงพระปรมาภิไธย
				ตามด้วยการประกาศในราชกิจจานุเบกษาให้มีผลบังคับใช้เป็นกฎหมาย
			</li>
		</ol>
	</div>
	<div>
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="กฎหมายในเว็บไซต์นี้">กฎหมายในเว็บไซต์นี้</h2>
		<hr class={DIVIDER_CLASS} />
		<p class="body-02 mb-4 mt-6">
			เว็บไซต์ Parliament Watch มุ่งนำเสนอกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา
			เพื่อแสดงให้เห็นถึงกระบวนการทำงานด้านนิติบัญญัติในฐานะตัวแทนประชาชน
			รวมถึงสะท้อนให้เห็นถึงความคิดเห็นของสมาชิกรัฐสภาต่อประเด็นต่างๆ ในทางกฎหมาย
			ซึ่งเป็นเครื่องมือในการกำหนดทิศทางของสังคม ทั้งนี้
			เว็บไซต์นี้จะไม่ปรากฏกฎหมายที่ถูกตราขึ้นผ่านคณะรัฐมนตรีและไม่ต้องผ่านการพิจารณาโดยรัฐสภา เช่น
			พระราชกฤษฎีกา กฎกระทรวง และกฎหมายที่ตราโดยองค์กรปกครองส่วนท้องถิ่น
		</p>
		<img
			src="images/legislative-process/legislative-process-overview.png"
			alt="Overview of legislative process"
		/>
	</div>
	<div class="flex flex-col gap-4">
		<div>
			<div class="mb-6">
				<h2 class="fluid-heading-04 {HEADING_CLASS}" id="ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา">
					ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา
				</h2>
				<hr class={DIVIDER_CLASS} />
			</div>
			<p>
				รัฐสภาประกอบไปด้วยสภาผู้แทนราษฎรและวุฒิสภา
				ทำหน้าที่พิจารณาและกลั่นกรองร่างกฎหมายก่อนการประกาศใช้ ประกอบด้วย
			</p>
		</div>
		<div class="flex flex-col gap-4">
			{#each legislations as legislation, i (i)}
				<Collapsible {legislation} />
			{/each}
		</div>
	</div>
	<div>
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="สถานะของกฎหมาย">สถานะของกฎหมาย</h2>
		<hr class={DIVIDER_CLASS} />
		<p class="mt-6">
			การจัดแบ่งสถานะของร่างกฎหมายบนเว็บไซต์ Parliament Watch เป็นการจัดแบ่งที่ทีม WeVis
			กำหนดขึ้นมาเพื่อให้ง่ายต่อการทำความเข้าใจของผู้ใช้ทั่วไป
			การจัดสถานะของร่างกฎหมายแต่ละฉบับที่ปรากฏบนเว็บไซต์นี้
			ไม่ได้เป็นสถานะของร่างกฎหมายอย่างเป็นทางการ
		</p>

		<h3 class="fluid-heading-03 {HEADING_CLASS}">
			สถานะของกฎหมายในเว็บไซต์นี้ แบ่งได้เป็น 3 ประเภท
		</h3>
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{#each billStatuses as billStatus (billStatus.billStatus)}
				<BillStatusCard {...billStatus} />
			{/each}
		</div>
	</div>
</section>
