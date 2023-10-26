<script land="ts">
	import dayjs from 'dayjs';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import 'dayjs/locale/th';
	import Sidebar from '$components/LegislativeProcess/Sidebar.svelte';
	import DataTable from '../../components/DataTable/DataTable.svelte';

	import 'carbon-components-svelte/css/all.css';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');

	const tableData = [
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
			'ร่าง พ.ร.ป.': 'สส. ไม่น้อยกว่า 1 ใน 10',
			'ร่างแก้ไขบทบัญญัติใน รธน.': 'สส. ไม่น้อยกว่า 1 ใน 5'
		},
		{
			'': 'สมาชิกรัฐสภา',
			'ร่าง พ.ร.บ.': '-',
			'ออก พ.ร.ก.': '-',
			'ร่าง พ.ร.ป.': '-',
			'ร่างแก้ไขบทบัญญัติใน รธน.': 'สส. และ สว. ไม่น้อยกว่า 1 ใน 5'
		},
		{
			'': 'ประชาชนผู้มีสิทธิเลือกตั้ง',
			'ร่าง พ.ร.บ.': '10,000 คน',
			'ออก พ.ร.ก.': '-',
			'ร่าง พ.ร.ป.': '-',
			'ร่างแก้ไขบทบัญญัติใน รธน.': '50,000 คน'
		}
	];
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
					ขั้นตอนการพิจารณาร่างกฎหมายแต่ละประเภทจะมีความแตกต่างกันในบางรายละเอียด แต่โดยทั่วไปแล้ว
					กระบวนการออกกฎหมายโดยรัฐสภา อย่างเช่นการออก พ.ร.บ. หรือการอนุมัติ พ.ร.ก. จะดำเนินการผ่าน <b
						>5 ขั้นตอน</b
					>ดังต่อไปนี้
				</div>
				<div class="flex w-full justify-center items-center py-4">
					<img
						src={'images/legislative-process/general-process.png'}
						alt="general-process-process"
						class="max-w-480"
					/>
				</div>
				<div class="py-6">
					<h3 class="fluid-heading-04 mb-0" id="การเสนอร่างกฎหมาย">1. การเสนอร่างกฎหมาย</h3>
					<p class="py-4">ผู้มีสิทธิเสนอร่างกฎหมาย และลำดับชั้นของกฎหมายที่เสนอได้</p>
					<div class="relative">
						<DataTable {tableData} />
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
		@apply text-text-primary mb-4;
	}

	:global(.bx--data-table th) {
		@apply py-4;
	}

	:global(.bx--data-table tbody tr td) {
		@apply text-gray-100 py-4 bg-gray-10;
	}
	:global(.bx--data-table tbody tr td:first-child) {
		@apply font-bold;
	}

	hr {
		@apply border-0 border-solid border-gray-20 border-t w-full box-border;
	}
</style>
