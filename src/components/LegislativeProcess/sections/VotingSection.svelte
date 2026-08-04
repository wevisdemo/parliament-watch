<script lang="ts">
	import VotingOptionTag from '$components/VotingOptionTag/VotingOptionTag.svelte';
	import VotingResultTag from '$components/VotingResultTag/VotingResultTag.svelte';
	import { DefaultVoteOption, DefaultVotingResult } from '$models/voting';
	import VotingProcessImageCircle from '../VotingProcessImageCircle.svelte';
	import { DIVIDER_CLASS, HEADING_CLASS, LIST_CLASS, SECTION_CLASS } from '../styles';
</script>

<section class={SECTION_CLASS}>
	<h1 class="fluid-heading-05 {HEADING_CLASS}" id="เข้าใจการลงมติของ-สส.และ-สว.">
		เข้าใจการลงมติของ สส.และ สว.
	</h1>
	<div>
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="การลงมติคืออะไร-เกิดขึ้นในขั้นตอนไหนบ้าง?">
			การลงมติคืออะไร เกิดขึ้นในขั้นตอนไหนบ้าง?
		</h2>
		<hr class={DIVIDER_CLASS} />
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
			<h2 class="fluid-heading-04 {HEADING_CLASS}" id="วิธีการลงมติ">วิธีการลงมติ</h2>
			<hr class={DIVIDER_CLASS} />
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
						<ul class="{LIST_CLASS} pl-6">
							<li>การออกเสียงลงคะแนนให้กระทำเป็นการเปิดเผย</li>
							<li>
								ถ้ามีสมาชิกเสนอญัตติโดยมีผู้รับรองไม่น้อยกว่า 20 คนของสภานั้นๆ ขอให้กระทำเป็นการลับ
								จึงให้ลงคะแนนลับ
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
						<ul class="{LIST_CLASS} pl-6">
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
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="ประเภทการลงมติ">ประเภทการลงมติ</h2>
		<hr class={DIVIDER_CLASS} />
		<div class="mt-6 flex flex-col gap-4">
			<p>โดยทั่วไป การประชุมจะกำหนดให้ สส.และ สว.แสดงเจตจำนงต่อประเด็นที่ใช้ลงมติดังนี้</p>
			<div class="flex gap-4">
				<VotingOptionTag voteOption={DefaultVoteOption.Agreed} />
				<VotingOptionTag voteOption={DefaultVoteOption.Disagreed} />
				<VotingOptionTag voteOption={DefaultVoteOption.Abstain} />
			</div>
			<p>
				หาก สส.หรือ สว.ไม่ได้แสดงเจตจำนงด้วยเหตุผลด้านการขาดการประชุมหรือไม่ได้ลงคะแนนเสียง
				ลักษณะของการออกคะแนนเสียงจะเป็นใน 2 รูปแบบคือ
			</p>
			<div class="flex gap-2">
				<div class="flex basis-2/5 flex-col gap-2">
					<VotingOptionTag class="w-fit" voteOption={DefaultVoteOption.Novote} />
					<ul class={LIST_CLASS}>
						<li class="list-inside list-disc">สมาชิกอยู่ในองค์ประชุม แต่ไม่ลงมติ</li>
						<li class="list-inside list-disc">
							จะถูกนับเป็นองค์ประชุม และถูกคำนวณในคะแนนเสียงของมติ
						</li>
					</ul>
				</div>
				<div class="flex basis-3/5 flex-col gap-2">
					<VotingOptionTag class="w-fit" voteOption={DefaultVoteOption.Absent} />
					<ul class={LIST_CLASS}>
						<li class="list-inside list-disc">สมาชิกไม่ได้เข้าประชุม</li>
						<li class="list-inside list-disc">จะไม่ถูกนับเป็นองค์ประชุม</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="my-6">
		<h2 class="fluid-heading-04 {HEADING_CLASS}" id="ผลการลงมติ">ผลการลงมติ</h2>
		<hr class={DIVIDER_CLASS} />
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
				<strong>การลงมติในรูปแบบอื่นๆ ที่ต้องให้ความเห็นชอบบุคคล</strong> หากมีผู้ถูกเสนอชื่อมากกว่า 2
				คนขึ้นไป เช่น มติการเลือกนายกรัฐมนตรี มติเลือกประธาน / รองประธานสภาฯ จะมีผลการลงมติเป็นการรับรองผู้ที่ได้รับการโหวตมากที่สุด
			</p>
			<VotingResultTag result="บุคคลที่ได้รับการโหวตมากที่สุด" class="w-fit" isLarge />
		</div>
	</div>
</section>
