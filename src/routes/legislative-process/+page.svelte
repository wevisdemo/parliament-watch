<script land="ts">
	import dayjs from 'dayjs';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import 'dayjs/locale/th';
	import Sidebar from '$components/LegislativeProcess/Sidebar.svelte';
	import Collapsible from '$components/LegislativeProcess/Collapsible.svelte';
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
				</div>
				<div>
					<h2 class="fluid-heading-04" id="กฎหมายบังคับใช้ได้อย่างไร">กฎหมายบังคับใช้ได้อย่างไร</h2>
					<hr />
				</div>
				<div>
					<h2 class="fluid-heading-04" id="กฎหมายในเว็บไซต์นี้">กฎหมายในเว็บไซต์นี้</h2>
					<hr />
				</div>
				<div>
					<h2 class="fluid-heading-04" id="ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา">
						ประเภทของกฎหมายที่ผ่านการพิจารณาโดยรัฐสภา
					</h2>
					<hr />
					<p>
						รัฐสภาประกอบไปด้วยสภาผู้แทนราษฎร และวุฒิสภา
						ทำหน้าที่พิจารณาและกลั่นกรองร่างกฏหมายก่อนการประกาศใช้ ประกอบด้วย
					</p>
					<Collapsible
						title="ร่างพระราชบัญญัติ (พรบ.)"
						details="กฎหมายโดยทั่วไปจะถูกตราเป็น พ.ร.บ."
						presentedBy={['ครม.', 'สส. 20 คน', 'ประชาชน 10,000 คน']}
						consideredBy={['สส.', 'สว.']}
						endorsedBy={'พระมหากษัตริย์'}
						stepDescription="เมื่อประกาศใช้ พ.ร.ก. แล้ว ในการประชุมรัฐสภาสมัยต่อไป ครม. ต้องเสนอ พ.ร.ก.ที่ประกาศใช้ต่อรัฐสภาเพื่อให้พิจารณาโดยเร็ว ถ้าอยู่นอกสมัยประชุมและประเมินว่าการรอสมัยประชุมสามัญจะเป็นการชักช้า ครม. ต้องเรียกประชุมสมัยวิสามัญเพื่อให้รัฐสภาพิจารณาอนุมัติ
            การอนุมัติ พ.ร.ก.เป็นกฎหมายนั้น กำหนดว่าหาก ส.ส. ลงคะแนนเสียงไม่ถึงกึ่งหนึ่ง ให้ พ.ร.ก.ฉบับนั้นตกไป แต่ถ้า ส.ส. อนุมัติ แต่ ส.ว.ไม่อนุมัติ แล้ว ส.ส. ยืนยันการอนุมัติด้วยคะแนนเสียงเกินครึ่งหนึ่งของจำนวน สส. ทั้งหมด ก็ให้ พ.ร.ก. มีผลเป็นกฎหมายและประกาศใช้เป็น พ.ร.บ. ต่อไป"
						steps={[
							'ร่างแก้ไขรัฐธรรมนูญเข้าสภา',
							'ผ่านประชุมร่วมกันของรัฐสภา (สส.+สว.)',
							'ประชามติแก้ไขรัฐธรรมนูญ (ในประเด็นที่กำหนด)',
							'ผ่านศาลรัฐธรรมนูญ (หากมีผู้ร้องเรียน)',
							'พระมหากษัตริย์ลงพระปรมาภิไธย',
							'ประกาศบนราชกิจจานุเบกษา'
						]}
						examples={[
							{ link: '#', description: 'อนุมัติ พ.ร.ก. พิกัดอัตราศุลกากร' },
							{ link: '#', description: 'อนุมัติ พ.ร.ก. เงินกู้โควิด-19 (ห้าแสนล้านบาท)' },
							{ link: '#', description: 'พ.ร.ก.การประมง พ.ศ. 2558' }
						]}
					/>
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
					<h2 class="fluid-heading-04" id="ขั้นตอนทั่วไป">ขั้นตอนทั่วไป</h2>
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
