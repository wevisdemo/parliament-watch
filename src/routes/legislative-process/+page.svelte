<script land="ts">
	import dayjs from 'dayjs';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import 'dayjs/locale/th';
	import Sidebar from '$components/LegislativeProcess/Sidebar.svelte';
	import VotingProcessImageCircle from '$components/LegislativeProcess/VotingProcessImageCircle.svelte';

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
				<div class="mb-6">
					<h2 class="fluid-heading-04" id="การลงมติคืออะไร เกิดขึ้นในขั้นตอนไหนบ้าง ?">
						การลงมติคืออะไร เกิดขึ้นในขั้นตอนไหนบ้าง ?
					</h2>
					<hr />
					<div class="mt-6">
						<p>
							การลงมติ เป็นส่วนหนึ่งของการประชุมสภา ใช้ในกระบวนการพิจารณาเรื่องต่างๆ
							ทั้งในสภาผู้แทนราษฎร และวุฒิสภา เช่น การพิจารณาญัตติ, การเสนอและพิจารณาร่างกฎหมาย,
							การพิจารณาให้ความเห็นชอบนายกรัฐมนตรี, การพิจารณาในขั้นกรรมาธิการ เป็นต้น
							โดยมติของสภาจะกระทำโดยการออกเสียงลงคะแนน ตามวิธีการที่กำหนดไว้ในข้อบังคับการประชุม
							สมาชิกรัฐสภาหนึ่งคนมีสิทธิออกเสียงได้หนึ่งเสียง และมติของสภาให้เป็นไปตามเสียงข้างมาก
							เพื่อให้ได้ข้อยุติของปัญหาและเพื่อให้ได้แนวทางที่สภาจะต้องดำเนินการต่อไป
						</p>
					</div>
				</div>
				<div class="my-6 grid gap-4">
					<div>
						<h2 class="fluid-heading-04" id="วิธีการลงมติ">วิธีการลงมติ</h2>
						<hr />
						<div class="mt-6">
							<p>การลงมติในสภากระทำผ่านการออกเสียงลงคะแนน ซึ่งแบ่งเป็น 2 กรณี</p>
						</div>
					</div>
					<div class="grid gap-4">
						<p><strong>1. การออกเสียงลงคะแนนเปิดเผย</strong></p>
						<div class="flex gap-3 justify-center">
							<VotingProcessImageCircle
								src="https://placehold.co/120"
								title="การลงคะแนนเสียงด้วยวาจา"
								description="ผ่านการเรียกชื่อสมาชิกตามหมายเลขประจำตัว เช่น การโหวตเลือกนายกรัฐมนตรี"
							/>
							<VotingProcessImageCircle
								src="https://placehold.co/120"
								title="การใช้เครื่องลงคะแนนเสียง"
								description="เพื่อลงมติเห็นด้วยหรือไม่ต่อประเด็นต่างๆ"
							/>
						</div>
						<p><strong>2. การออกเสียงลงคะแนนลับ</strong></p>
						<div class="flex gap-3 justify-center">
							<VotingProcessImageCircle
								src="https://placehold.co/120"
								title="การทำเครื่องหมายบนแผ่นกระดาษ"
								description="ใส่ซองที่เจ้าหน้าที่จัดให้"
							/>
							<VotingProcessImageCircle
								src="https://placehold.co/120"
								title="การใช้เครื่องออกเสียงลงคะแนน"
								description="ตามที่ประชุมกำหนด"
							/>
						</div>
					</div>
					<div class="grid gap-2">
						<p><strong>เกณฑ์ในการเลือกวิธีการลงมติ</strong> ตามข้อบังคับการประชุมสภา</p>
						<div class="lg:flex gap-4">
							<div class="bg-ui-01 p-4 flex-1 mb-4 lg:mb-0 h-fit">
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
							<div class="bg-ui-01 p-4 flex-1 h-fit">
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
