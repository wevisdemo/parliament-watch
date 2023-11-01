<script land="ts">
	import dayjs from 'dayjs';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import 'dayjs/locale/th';
	import Sidebar from '$components/LegislativeProcess/Sidebar.svelte';
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';
	import { DefaultVoteOption, DefaultVotingResult } from '$models/voting';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';

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
				<div class="my-6">
					<h2 class="fluid-heading-04" id="ประเภทการลงมติ">ประเภทการลงมติ</h2>
					<hr />
					<div class="flex flex-col gap-4 mt-6">
						<p>โดยทั่วไป การประชุมจะกำหนดให้ สส. และ สว. แสดงเจตจำนงต่อประเด็นที่ใช้ลงมติดังนี้</p>
						<div class="flex gap-4">
							<VotingOptionTag voteOption={DefaultVoteOption.Agreed} />
							<VotingOptionTag voteOption={DefaultVoteOption.Disagreed} />
							<VotingOptionTag voteOption={DefaultVoteOption.Novote} />
						</div>
						<p>
							หาก สส. หรือ สว. ไม่ได้แสดงเจตจำนงด้วยเหตุผลด้านการขาดการประชุมหรือไม่ได้ลงคะแนนเสียง
							ลักษณะของการออกคะแนนเสียงจะเป็นใน 2 รูปแบบคือ
						</p>
						<div class="flex gap-2">
							<div class="flex flex-col gap-2 basis-2/5">
								<VotingOptionTag class={'w-fit'} voteOption={DefaultVoteOption.Abstain} />
								<ul>
									<li class="list-disc list-inside">สมาชิกอยู่ในองค์ประชุม แต่ไม่ลงมติ</li>
									<li class="list-disc list-inside">
										จะถูกนับเป็นองค์ประชุม และถูกคำนวณในคะแนนเสียงของมติ
									</li>
								</ul>
							</div>
							<div class="flex flex-col gap-2 basis-3/5">
								<VotingOptionTag class={'w-fit'} voteOption={DefaultVoteOption.Absent} />
								<ul>
									<li class="list-disc list-inside">สมาชิกไม่ได้เข้าประชุม</li>
									<li class="list-disc list-inside">จะไม่ถูกนับเป็นองค์ประชุม</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div class="my-6">
					<h2 class="fluid-heading-04" id="ผลการลงมติ">ผลการลงมติ</h2>
					<hr />
					<div class="flex flex-col gap-4 mt-6">
						<p>
							<b>การลงมติที่เกี่ยวข้องกับนิติบัญญัติและญัตติต่างๆ ในสภา</b> เช่น การโหวตรับร่างกฎหมายเข้าสภา
							การโหวตอนุมัติ พ.ร.ก. การพิจารณาญัตติ เป็นต้น จะใช้เสียงข้างมากของที่ประชุมของแต่ละสภา
							หรือตามข้อกำหนดที่ระบุไว้ในรัฐธรรมนูญหรือข้อบังคับการประชุม ซึ่งโดยทั่วไปจะมีผลการลงมติ
							ดังนี้
						</p>
						<div class="flex gap-4">
							<VotingResultTag result={DefaultVotingResult.Passed} isLarge />
							<VotingResultTag result={DefaultVotingResult.Failed} isLarge />
						</div>
						<p>
							<b>การลงมติในรูปแบบอื่นๆ ที่ต้องให้ความเห็นชอบบุคคล</b> หากมีผู้ถูกเสนอชื่อมากกว่า 2 คนขึ้นไป
							เช่น มติการเลือกนายกรัฐมนตรี มติเลือกประธาน/รองประธานสภาฯ จะมีผลการลงมติเป็นการรับรองผู้ที่ได้รับการโหวตมากที่สุด
						</p>
						<VotingResultTag result={'บุคคลที่ได้รับการโหวตมากที่สุด'} class={'w-fit'} isLarge />
					</div>
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
