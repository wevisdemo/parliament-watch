<script land="ts">
	import dayjs from 'dayjs';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import 'dayjs/locale/th';
	import Sidebar from '$components/LegislativeProcess/Sidebar.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import { DefaultVotingResult } from '$models/voting';

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
					<h2 class="fluid-heading-04" id="ขั้นตอนโดยย่อ">ขั้นตอนทั่วไป</h2>
					<hr />
					<div>
						<h3 class="fluid-heading-03">2. การพิจารณาโดยสภาผู้แทนราษฏร</h3>
						<p>
							เมื่อร่างกฎหมายถูกเสนอเข้าสู่สภาแล้ว จะเข้าสู่ขั้นตอนต่อไปคือการพิจารณาโดย สส.
							ในขั้นตอนนี้จะแบ่งเป็น 3 วาระ ได้แก่
						</p>
						<h4 class="font-bold">2.1. วาระที่หนึ่ง : ขั้นรับหลักการ</h4>
						<p>
							เป็นการพิจารณาหลักการของร่างกฎหมาย ผู้เสนอฯต้องชี้แจงความจำเป็นที่ต้องออกกฎหมายนั้นๆ
							ในกระบวนการพิจารณา ส.ส. ในสภาจะอภิปรายเหตุผล ถามข้อสงสัยและตั้งข้อสังเกต
							แล้วจึงขอมติในที่ประชุมว่าจะรับหลักการหรือไม่
						</p>
						<div class="gray-box">
							<h5 class="heading-01">วิธีการพิจารณา</h5>
							<p class="body-02">
								สส. ในสภาจะอภิปรายเหตุผล ถามข้อสงสัยและตั้งข้อสังเกต <br />
								แล้วจึงขอมติในที่ประชุมว่าจะรับหลักการหรือไม่
							</p>
						</div>
						<div class="gray-box">
							<h5 class="heading-01">ผลลัพท์</h5>
							<div class="flex flex-row w-full justify-between">
								<div class="w-full">
									<VotingResultTag result={DefaultVotingResult.Passed} />
									<p class="body-02">ร่างกฎหมายจะถูกนำไปพิจารณาวาระที่สอง</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full pl-2">
									<VotingResultTag result={DefaultVotingResult.Failed} />
									<p class="body-02">ร่างกฎหมายนั้นก็จะตกไปและไม่ถูกพิจารณาต่อ</p>
								</div>
							</div>
						</div>
						<h4 class="font-bold">2.2. วาระที่สอง : ขั้นกรรมาธิการ</h4>
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
									ซึ่งมี สส. <br /> เป็นกรรมาธิการในการพิจารณาร่างกฎหมายในด้านที่เกี่ยวข้อง <br />
									หรืออาจตั้งขึ้นใหม่เป็นการเฉพาะเรียกว่า
									<strong class="heading-02">‘คณะกรรมาธิการวิสามัญ’</strong> <br /> ซึ่งบุคคลภายนอกสามารถเข้าร่วมเป็นกรรมาธิการได้
								</li>
								<li>
									ในบางกรณี สภาอาจให้ สส. ทุกคนร่วมพิจารณา เรียกว่า <strong class="heading-02"
										>‘คณะกรรมาธิการเต็มสภา’</strong
									>
								</li>
								<li>
									สส. ที่ไม่เป็นกรรมาธิการสามารถขอแก้ไขเพิ่มเติมร่างกฎหมายได้ โดยเสนอคำขอ
									<strong class="heading-02">‘แปรญัติ’</strong>
									ต่อประธานคณะกรรมาธิการภายใน 7 วัน หลังผ่านวาระแรก <br />
									ซึ่งก็ขึ้นอยู่กับคณะกรรมาธิการว่าจะแก้ไขตามหรือไม่
								</li>
								<li>
									เมื่อคณะกรรมาธิการพิจารณาเสร็จแล้วให้นำร่างกฎหมายเข้าที่ประชุมสภาอีกครั้ง โดย สส. <br
									/>
									ทั้งสภาจะมาอภิปรายร่างกฎหมายตามประเด็นที่มีการแก้ไข <br />
									จากนั้นจะลงมติเห็นชอบโดยใช้เสียงข้างมาก เรียงตามมาตราจนครบ <br />
									จึงให้สภาพิจารณาวาระที่สามต่อไป
								</li>
							</ul>
						</div>
						<h4 class="font-bold">2.3. วาระที่สาม : ขั้นลงมติเห็นชอบ</h4>
						<p class="body-02">
							เป็นการลงมติเห็นชอบร่างกฎหมายทั้งฉบับ ไม่มีการอภิปรายหรือแก้ไขข้อความใดๆ
						</p>
						<div class="gray-box">
							<h5 class="heading-01">ผลลัพท์</h5>
							<div class="flex flex-row w-full justify-between">
								<div class="w-full">
									<VotingResultTag result={DefaultVotingResult.Passed} />
									<p class="body-02">นำไปสู่การพิจารณาของ สว.</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full pl-2">
									<VotingResultTag result={DefaultVotingResult.Failed} />
									<p class="body-02">ร่างกฎหมายนั้นเป็นอันตกไป</p>
								</div>
							</div>
						</div>
					</div>
					<div>
						<h3 class="fluid-heading-03">3. การพิจารณาร่างกฎหมายโดยวุฒิสภา</h3>
						<p class="body-02">
							เมื่อ สส. มีมติเห็นชอบ ร่างกฎหมายจะถูกส่งต่อไปยัง สว. โดยการพิจารณาจะมี 3
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
							<h5 class="heading-01 mb-2">ผลลัพท์</h5>
							<p class="body-02">
								สว. <strong class="heading-02">ไม่มีอำนาจ ‘ปัดตก’</strong> หรือทำให้ร่างกฎหมายที่
								สส. แล้วหายไปได้ แต่ สว. <br />
								<strong class="heading-02">สามารถเพิ่มขั้นตอน</strong>ในการพิจาณาร่างกฎหมายได้ เมื่อ
								สว. <br /> พิจารณาร่างกฎหมายแล้วสามารถลงมติได้ 3 กรณี
							</p>

							<div class="flex flex-col md:flex-row body-01 w-full">
								<div class="w-full md:w-4/12">
									<VotingResultTag result={DefaultVotingResult.Passed} />
									<p class="body-01">เตรียมนำร่างกฎหมายฯ <br /> เข้าสู่ขั้นตอนประกาศใช้</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full md:w-4/12 pt-2 md:px-2 md:pt-0">
									<VotingResultTag result={DefaultVotingResult.Passed} />
									<ul>
										<li>
											ให้ส่งร่างที่แก้ไขเพิ่มเติมให้ สส. เห็นชอบ หรือตั้ง <br />
											<strong class="heading-compact-01">‘คณะกรรมาธิการร่วม’</strong> <br />
											ของสองสภาขึ้นมาพิจารณา โดยต้องมีจำนวน สส. และ สว. เท่ากัน
										</li>
										<li>เมื่อกรรมาธิการร่วมพิจารณาร่างกฎหมายเสร็จแล้วให้เสนอต่อทั้งสองสภา</li>
										<li>ให้ดำเนินขั้นตอนประกาศใช้เป็นกฎหมาย</li>
										<li>
											แต่ถ้าสภาใดสภาหนึ่งไม่เห็นชอบ ให้ยับยั้งร่างกฎหมายนั้นไว้ก่อน ซึ่ง สส.
											อาจยกขึ้นมาพิจารณาใหม่ได้หลัง 180 วัน โดยอาจยืนยันร่างเดิม
											หรือร่างที่คณะกรรมาธิการร่วมกันพิจารณาก็ได้
										</li>
									</ul>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full md:w-4/12 pt-2 md:px-2 md:pt-0">
									<VotingResultTag result={DefaultVotingResult.Failed} />
									<ul>
										<li>ให้ "ยับยั้ง" ไว้</li>
										<li>
											เมื่อพ้นระยะเวลา 180 วัน สส. สามารถยกร่างกฎหมายฉบับนั้นกลับมาพิจารณาใหม่ได้
										</li>
										<li>
											หาก สส. ยืนยันร่างฯ <br />
											ฉบับเดิมด้วยคะแนนเสียงมากกว่ากึ่งหนึ่งของสภาผู้แทนฯ ให้ถือว่า ร่างฉบับนั้นได้รับความเห็นชอบ
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
							<h5 class="heading-01 mb-2">ผลลัพท์</h5>
							<div class="flex flex-col md:flex-row body-01 w-full">
								<div class="w-full md:w-4/12">
									<VotingResultTag result={DefaultVotingResult.Passed} />
									<p class="body-01">ถ้าไม่มีข้อความที่ขัดต่อรัฐธรรมนูญ</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full md:w-4/12 pt-2 md:pt-0">
									<VotingResultTag result={DefaultVotingResult.Passed} />
									<p class="body-01">ถ้ามีข้อความที่ขัดต่อรัฐธรรมนูญ</p>
								</div>
								<div class="vertical-gray-line" />
								<div class="w-full md:w-4/12 pt-2 md:pt-0">
									<VotingResultTag result={DefaultVotingResult.Failed} />
									<p class="body-01">ถ้ามีข้อความที่ขัดต่อรัฐธรรมนูญและเป็นสาระสำคัญของร่าง</p>
								</div>
							</div>
						</div>
					</div>
					<div>
						<h3 class="fluid-heading-03">5. การประกาศใช้เป็นกฎหมาย</h3>
						<p class="body-02">
							เมื่อร่างกฎหมายได้รับความเห็นชอบจากรัฐสภาแล้ว ให้นายกรัฐมนตรีรอไว้ 5 วัน
							แล้วให้ขึ้นทูลเกล้าเพื่อให้พระมหากษัตริย์ทรงลงพระปรมาภิไธยภายใน 20 วัน
							จากนั้นให้ประกาศในราชกิจจานุเบกษาให้มีผลบังคับใช้เป็นกฎหมายได้
						</p>
					</div>
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

	h3 {
		@apply text-text-primary mb-4 mt-16;
	}

	h4 {
		@apply text-text-primary mb-4 mt-4;
	}

	hr {
		@apply border-0 border-solid border-gray-20 border-t w-full box-border;
	}

	.vertical-gray-line {
		@apply md:border-[1px] border-solid border-gray-20 min-h-full mx-2;
	}

	.gray-box {
		@apply bg-gray-10 p-6 w-full h-full mt-2 mb-2;
	}

	li::marker {
		@apply text-xs;
	}

	ul {
		@apply list-disc list-outside ml-6;
	}
</style>
