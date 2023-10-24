<script land="ts">
	import dayjs from 'dayjs';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import 'dayjs/locale/th';
	import Sidebar from '$components/LegislativeProcess/Sidebar.svelte';
	import ProcessCard from '$components/LegislativeProcess/ProcessCard.svelte';
	import ProcessCardArrow from '$components/LegislativeProcess/ProcessCardArrow.svelte';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');
</script>

<div class="flex flex-col w-full">
	<header class="bg-teal-20">
		<div class="w-full max-w-[800px] px-10 py-10 md:py-20 mx-auto">
			<h1 class="fluid-heading-05">ร่างกฎหมายกลายเป็นกฎหมายได้อย่างไร</h1>
			<p>
				<span class="text-text-primary font-bold">อัปเดตล่าสุด :</span>
				<span class="text-helper-text-01">{dayjs(new Date()).format('DD MMM BBBB')}</span>
			</p>
		</div>
	</header>
	<main class="flex flex-col justify-center md:flex-row items-center md:items-start">
		<div
			class="legislative-process-sidebar bg-ui-01 md:bg-white w-full md:w-auto gap-10 px-4 md:px-10 md:py-0 py-8"
		>
			<div class="py-10 w-full bg-white flex items-center justify-center">
				<Sidebar />
			</div>
		</div>
		<div
			class="w-full max-w-[800px] flex flex-col gap-10 px-4 md:px-10 py-8 bg-ui-01 md:bg-white flex-1"
		>
			<section>
				<h1 class="fluid-heading-05" id="แนะนำภาพรวม">แนะนำภาพรวม</h1>
				<div>
					<h2 class="fluid-heading-04" id="การออกกฎหมายตามรัฐธรรมนูญ 2560">
						การออกกฎหมายตามรัฐธรรมนูญ 2560
					</h2>
					<hr />
					<p class="body-02 mt-6">
						<b
							>‘รัฐสภา’ คือผู้รับผิดชอบหลักในการออกกฎหมาย
							เพราะเป็นตัวแทนของประชาชนในการทำหน้าที่และใช้อำนาจนิติบัญญัติ</b
						>
						การออกกฎหมายต้องดำเนินตามกระบวนการที่ระบุไว้ในรัฐธรรมนูญ 2560 ซึ่งกฎหมายมีหลายประเภท กฎหมายประเภทหนึ่งอาจมีกระบวนการ
						ลำดับขั้น หรือเงื่อนไขในการพิจารณาที่แตกต่างไปจากกฎหมายอีกประเภทหนึ่ง ด้วยเหตุเพราะกฎหมายแต่ละประเภทมีลำดับชั้นที่แตกต่างกัน
					</p>
					<br />
					<p class="body-02">
						<b>การกำหนดลำดับชั้นระหว่างกฎหมายประเภทต่าง ๆ</b> มีขึ้นเพื่อให้กฎหมายแม่บท อย่าง ‘รัฐธรรมนูญ’
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
					<h2 class="fluid-heading-04" id="กฎหมายบังคับใช้ได้อย่างไร">กฎหมายบังคับใช้ได้อย่างไร</h2>
					<hr />
					<h3 class="fluid-heading-03 my-6" id="การออกกฎหมายตามรัฐธรรมนูญ 2560">
						กฎหมายที่ออกโดยรัฐสภา ต้องผ่านกระบวนการ 3 ขั้นตอนสำคัญ
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-[1fr_16px_1fr_16px_1fr] gap-3">
						<ProcessCard imgSrc="images/legislative-process/process-01.png" title="เสนอร่างกฎหมาย">
							ผู้มีสิทธิเสนอร่างของกฎหมายแต่ละประเภท จะแตกต่างกัน
						</ProcessCard>
						<ProcessCardArrow />
						<ProcessCard
							imgSrc="images/legislative-process/process-02.png"
							title="พิจารณาโดยรัฐสภา"
						>
							<ul class="list-disc list-inside">
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
							<ul class="list-disc list-inside">
								<li>ไม่ขัดต่อรัฐธรรมนูญ</li>
								<li>พระมหากษัตริย์ทรงลงพระปรมาภิไธย</li>
							</ul>
						</ProcessCard>
					</div>
					<ol class="list-decimal list-inside body-02 mt-6">
						<li>
							<b>การเสนอร่างกฎหมาย</b> เป็นการจัดทำร่างกฎหมายและเสนอเข้าต่อรัฐสภา โดยผู้ที่มีสิทธิเสนอร่างกฎหมายจะแตกต่างกันขึ้นอยู่กับว่าเป็นร่างกฎหมายประเภทใดตามที่รัฐธรรมนูญระบุไว้
							เช่น ร่าง พ.ร.บ. สามารถเสนอโดยคณะรัฐมนตรี หรือ สส. จำนวนไม่น้อยกว่า 20 คน หรือ ประชาชนจำนวน10,000
							คน
						</li>
						<li>
							<b>การพิจารณาร่างกฎหมายโดยรัฐสภา</b> ร่างกฎหมายจะถูกพิจารณาโดยสมาชิกสภาผู้เแทนราษฎร (สส.)
							และสมาชิกวุฒิสภา (สว.) ตามลำดับ การพิจารณาของแต่ละสภาจะมี 3 วาระเท่ากัน แต่มีเงื่อนไขและรายละเอียดในการพิจารณาที่แตกต่างกัน
							ทั้งนี้ ในการพิจารณาร่างกฎหมายบางประเภท จะใช้การประชุมร่วมกันของทั้งสองสภาในการพิจารณา
							เช่น การพิจารณา ร่าง พ.ร.ป.
						</li>
						<li>
							<b>ร่างกฎหมายกลายเป็นกฎหมายโดยสมบูรณ์์</b> เมื่อร่างกฎหมายไม่ขัดต่อรัฐธรรมนูญ และพระมหากษัตริย์ทรงลงพระปรมาภิไธย
							ตามด้วยการประกาศในราชกิจจานุเบกษาให้มีผลบังคับใช้เป็นกฎหมาย
						</li>
					</ol>
				</div>
				<div>
					<h2 class="fluid-heading-04" id="กฎหมายในเว็บไซต์นี้">กฎหมายในเว็บไซต์นี้</h2>
					<hr />
					<p class="body-02 mt-6 mb-4">
						เว็บไซต์ Parliament Watch มุ่งนำเสนอกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา
						เพื่อแสดงให้เห็นถึงกระบวนการทำงานด้านนิติบัญญัติในฐานะตัวแทนประชาชน
						รวมถึงสะท้อนให้เห็นถึงความคิดเห็นของสมาชิกรัฐสภาต่อประเด็นต่างๆ ในทางกฎหมาย
						ซึ่งเป็นเครื่องมือในการกำหนดทิศทางของสังคม ทั้งนี้
						เว็บไซต์นี้จะไม่ปรากฎกฎหมายที่ถูกตราขึ้นผ่านคณะรัฐมนตรีและไม่ต้องผ่านการพิจารณาโดยรัฐสภา
						เช่น พระราชกฤษฎีกา กฎกระทรวง และกฎหมายที่ตราโดยองค์กรปกครองส่วนท้องถิ่น
					</p>
					<img
						src="images/legislative-process/legislative-process-overview.png"
						alt="Overview of legislative process"
					/>
				</div>
				<div>
					<h2 class="fluid-heading-04" id="ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา">
						ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา
					</h2>
					<hr />
				</div>
				<div>
					<h2 class="fluid-heading-04" id="สถานะของกฎหมาย">สถานะของกฎหมาย</h2>
					<hr />
				</div>
			</section>
			<section>
				<h1 class="fluid-heading-05" id="ขั้นตอนการออกกฎหมายโดยรัฐสภา">
					ขั้นตอนการออกกฎหมายโดยรัฐสภา
				</h1>
				<div>
					<h2 class="fluid-heading-04" id="ขั้นตอนโดยย่อ">ขั้นตอนทั่วไป</h2>
					<hr />
				</div>
				<div>
					<h2 class="fluid-heading-04" id="ขั้นตอนพิเศษของกฎหมายบางประเภท">
						ขั้นตอนพิเศษของกฎหมายบางประเภท
					</h2>
					<hr />
				</div>
			</section>
			<section>
				<h1 class="fluid-heading-05" id="เข้าใจการลงมติของ สส. และ สว.">
					เข้าใจการลงมติของ สส. และ สว.
				</h1>
				<div>
					<h2 class="fluid-heading-04" id="การลงมติคืออะไร เกิดขึ้นในขั้นตอนไหนบ้าง ?">
						การลงมติคืออะไร เกิดขึ้นในขั้นตอนไหนบ้าง ?
					</h2>
					<hr />
				</div>
				<div>
					<h2 class="fluid-heading-04" id="วิธีการลงมติ">วิธีการลงมติ</h2>
					<hr />
				</div>
				<div>
					<h2 class="fluid-heading-04" id="ประเภทการลงมติ">ประเภทการลงมติ</h2>
					<hr />
				</div>
				<div>
					<h2 class="fluid-heading-04" id="ผลการลงมติ">ผลการลงมติ</h2>
					<hr />
				</div>
			</section>
			<section>
				<h1 class="fluid-heading-05" id="ส.ส. และ ส.ว. ทำอะไรบ้างในสภา">
					ส.ส. และ ส.ว. ทำอะไรบ้างในสภา
				</h1>
				<div>
					<h2 class="fluid-heading-04" id="หน้าที่ของสมาชิกสภาผู้แทนราษฏร (สส.)">
						หน้าที่ของสมาชิกสภาผู้แทนราษฏร (สส.)
					</h2>
					<hr />
				</div>
				<div>
					<h2 class="fluid-heading-04" id="หน้าที่ของสมาชิกวุฒิสภา (สว.)">
						หน้าที่ของสมาชิกวุฒิสภา (สว.)
					</h2>
					<hr />
				</div>
				<div>
					<h2 class="fluid-heading-04" id="หน้าที่ของสภาร่วม (ส.ส. + ส.ว.)">
						หน้าที่ของสภาร่วม (ส.ส. + ส.ว.)
					</h2>
					<hr />
				</div>
			</section>
		</div>
		<div class="w-[250px]" />
	</main>
</div>

<style lang="postcss">
	section {
		@apply flex flex-col gap-4 bg-white px-4 md:px-0 py-8 md:py-0;
	}

	h1 {
		@apply text-text-primary mb-4;
	}

	h2 {
		@apply text-text-primary mb-4;
	}

	hr {
		@apply border-0 border-solid border-gray-20 border-t w-full box-border;
	}
</style>
